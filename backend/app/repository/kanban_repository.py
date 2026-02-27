from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, update
from sqlalchemy.orm import selectinload
from ..models.kanban import Board, Card, Column
from ..schemas.kanban import BoardCreate, BoardUpdate, ColumnUpdate, CardUpdate, ColumnCreate, CardCreate, ColumnOrdersUpdateList
from ..core.utils import update_existing_entity
from ..core.exceptions import AppError

class KanbanRepository:
  def __init__(self, db: AsyncSession):
    self.db = db
    
  async def get_all_boards(self, owner_id: int):
    query = select(Board).filter_by(owner_id=owner_id).options(selectinload(Board.columns).selectinload(Column.cards))
    boards = await self.db.scalars(query)
    return boards.all()
  
  
  async def get_board_by_id(self, owner_id: int, board_id: int):
    query = select(Board).filter_by(owner_id=owner_id, id=board_id).options(selectinload(Board.columns).selectinload(Column.cards))
    board = await self.db.scalar(query)
    return board
  
  
  async def get_board_by_title(self, owner_id: int, title: str):
    query = (select(Board)).filter_by(owner_id=owner_id, title=title).options(selectinload(Board.columns).selectinload(Column.cards))
    board = await self.db.scalar(query)
    return board
  
  
  async def create_board(self, owner_id: int, board: BoardCreate):
    new_board = Board(title=board.title, owner_id=owner_id)
    self.db.add(new_board)
    
    try:
      await self.db.commit()
      query = (select(Board).where(Board.id == new_board.id).options(selectinload(Board.columns)))
      result = await self.db.execute(query)
      return result.scalar_one()
    except Exception as e:
      await self.db.rollback()
      raise AppError(400, f'{e}')
    
    
  async def update_board(self, owner_id: int, board_id: int, board_data: BoardUpdate):
    exist_board = await self.get_board_by_id(owner_id, board_id)
    
    if not exist_board:
      raise AppError(400, 'Доска не найдена')
    
    updated_data = board_data.model_dump(exclude_unset=False)
    print('updated_data', updated_data)
    for key, value in updated_data.items():
      setattr(exist_board, key, value)

    return await update_existing_entity(self, exist_board, 'Помилка під час оновлення дошки')
  
  
  async def delete_board(self, board: Board):
    try:
      await self.db.delete(board)
      await self.db.commit()
      return board
    except:
      await self.db.rollback()
      raise AppError(500, 'Помилка при видаленні дошки')
  
  
  async def get_all_columns(self, board_id: int):
    query = (select(Column)).filter_by(board_id=board_id).options(selectinload(Column.cards))
    columns = await self.db.scalars(query)
    return columns.all()
  
  async def get_column_by_id(self, column_id: int, board_id: int):
    query = (select(Column)).filter_by(id=column_id, board_id=board_id).options(selectinload(Column.cards))
    column = await self.db.scalar(query)
    return column
  
  
  async def get_column_by_title(self, title: str, board_id: int):
    query = (select(Column)).filter_by(title=title, board_id=board_id).options(selectinload(Column.cards))
    column = await self.db.scalar(query)
    return column
  
  
  async def create_column(self, column: ColumnCreate):
    query = select(Column).filter_by(board_id=column.board_id).order_by(Column.order.desc()).limit(1)
    columns = await self.db.execute(query)
    last_order = columns.scalars().first()

    order = (last_order.order + 1) if last_order is not None else 1

    new_column = Column(title=column.title, board_id=column.board_id, order=order)
    self.db.add(new_column)
    
    try:
      await self.db.commit()
      query = (select(Column).where(Column.id == new_column.id).options(selectinload(Column.cards)))
      result = await self.db.execute(query)
      return result.scalar_one()
    except Exception as e:
      await self.db.rollback()
      raise AppError(400, f'{e}')
  
  
  async def update_column(self, column_id: int, column_data: ColumnUpdate, board_id: int):
    exist_column = await self.get_column_by_id(column_id, board_id)
    
    if exist_column is None:
      raise AppError(404, f"Колонка з ID “{column_id}” не знайдена на дошці {board_id}")
    
    updated_data = column_data.model_dump(exclude_unset=False)
    
    for key, value in updated_data.items():
      setattr(exist_column, key, value)

    return await update_existing_entity(self, exist_column, 'Помилка під час оновлення колонки')
  
  
  async def reorder_all_columns(self, board_id: int, user_id: int, data: ColumnOrdersUpdateList):
    exist_board = self.get_board_by_id(user_id, board_id)
    
    if exist_board is None:
      raise AppError(400, 'Такой дошки не існує')

    columns = [col.model_dump() for col in data.columns]
    print(columns)
    
    await self.db.execute(update(Column), columns)
    await self.db.commit()
    
    return columns
  
  
  async def delete_column(self, column: Column):
    try:
      await self.db.delete(column)
      await self.db.commit()
      return column
    except:
      await self.db.rollback()
      raise AppError(500, 'Помилка при видаленні колонки')

  
  async def get_all_cards(self, column_id: int):
    query = (select(Card)).filter_by(column_id=column_id)
    cards = await self.db.scalars(query)
    return cards.all()
  
  
  async def get_card_by_id(self, card_id: int, column_id: int):
    query = (select(Card)).filter_by(id=card_id, column_id=column_id)
    card = await self.db.scalar(query)
    return card
  
  
  async def get_card_by_column(self, column_id: int):
    query = select(Card).where(Card.column_id == column_id)
    card = await self.db.execute(query)
    return card.scalar_one_or_none()
  
  
  async def get_card_by_title(self, card_title: str, column_id: int):
    query = select(Card).where(Card.title == card_title, Card.column_id == column_id)
    card = await self.db.execute(query)
    return card.scalar_one_or_none()
  
  
  async def create_card(self, card: CardCreate, column_id: int, creator_id: int):
    query = select(Card).filter_by(column_id=column_id, creator_id=creator_id).order_by(Card.order.desc()).limit(1)
    entities = await self.db.execute(query)
    last_order = entities.scalars().first()

    order = (last_order.order + 1) if last_order is not None else 1
    
    new_card = Card(title=card.title, description=card.description, column_id=column_id, order=order, creator_id=creator_id)
    self.db.add(new_card)
    
    try:
      await self.db.commit()
      query = (select(Card).where(Card.id == new_card.id))
      result = await self.db.execute(query)
      return result.scalar_one()
    except Exception as e:
      await self.db.rollback()
      raise AppError(400, f'{e}')
  
  
  async def update_card(self, card_id: int, column_id: int, card_update: CardUpdate, user_id: int):
    exist_card = await self.get_card_by_id(card_id, column_id)

    if exist_card is None:
      raise AppError(400, 'Картки не знайдено')
    
    if user_id is not None:
      if exist_card.creator_id != user_id:
        raise AppError(403, 'Ви не можете редагувати чужу картку')
    
    updated_data = card_update.model_dump(exclude_unset=False)
    
    for key, value in updated_data.items():
      setattr(exist_card, key, value)
      
    return await update_existing_entity(self, exist_card, 'Помилка під час оновлення картки')
  
  
  async def delete_card(self, card: Card):
    try:
      await self.db.delete(card)
      await self.db.commit()
      return card
    except:
      await self.db.rollback()
      raise AppError(500, 'Помилка при видаленні карточки')