from fastapi import APIRouter, Depends
from ..models.user import User
from ..dependencies.user import get_current_user
from ..services.kanban import KanbanService
from ..dependencies.kanban import get_kanban_service
from ..schemas.response import SuccessResponse
from ..schemas.kanban import BoardCreate, BoardResponse, BoardUpdate, ColumnListResponse, ColumnResponse, ColumnCreate, ColumnUpdate, CardListResponse, CardResponse, CardCreate, CardUpdate

router = APIRouter(prefix='/kanban', tags=['Kanban'])

@router.get('/get_boards', response_model=SuccessResponse[list[BoardResponse]])
async def get_boards(user: User = Depends(get_current_user), service: KanbanService = Depends(get_kanban_service)):
  boards = await service.get_all_boards(user.id)
  print('boards', boards)
  return SuccessResponse(
    data=boards
  )

@router.post('/get_board_by_id', response_model=SuccessResponse[BoardResponse])
async def get_board_by_id(board_id: int, user: User = Depends(get_current_user), service: KanbanService = Depends(get_kanban_service)):
  board = await service.get_board_by_id(user.id, board_id)
  return SuccessResponse(
    data=board
  )

@router.post('/create_board', response_model=SuccessResponse[BoardResponse])
async def create_board(board: BoardCreate, user: User = Depends(get_current_user), service: KanbanService = Depends(get_kanban_service)):
  new_board = await service.create_board(user.id, board)
  return SuccessResponse(
    message='Дошка успішно створено',
    data=new_board
  )
  
@router.patch('/update_board', response_model=SuccessResponse[BoardResponse])
async def update_board(board_id: int, board: BoardUpdate, user: User = Depends(get_current_user), service: KanbanService = Depends(get_kanban_service)):
  updated_board = await service.update_board(user.id, board_id, board)
  return SuccessResponse(
    message='Дошка успішно оновлено',
    data=updated_board
  )
  
@router.delete('/delete_board', response_model=SuccessResponse[BoardResponse])
async def delete_board(board_id: int, user: User = Depends(get_current_user), service: KanbanService = Depends(get_kanban_service)):
  deleted_board = await service.delete_board(user.id, board_id)
  return SuccessResponse(
    message='Дошка успішно видалена',
    data=deleted_board
  )


@router.get('/get_columns', response_model=SuccessResponse[ColumnListResponse])
async def get_columns(board_id: int, user: User = Depends(get_current_user), service: KanbanService = Depends(get_kanban_service)):
  columns = await service.get_all_columns(board_id, user.id)
  return SuccessResponse(
    data={'columns': columns}
  )

@router.post('/get_column_by_id', response_model=SuccessResponse[ColumnResponse])
async def get_column(board_id: int, column_id: int, service: KanbanService = Depends(get_kanban_service)):
  column = await service.get_column_by_id(column_id, board_id)
  return SuccessResponse(
    data=column
  )

@router.post('/create_column', response_model=SuccessResponse[ColumnResponse])
async def create_column(column_data: ColumnCreate, service: KanbanService = Depends(get_kanban_service)):
  new_column = await service.create_column(column_data)
  return SuccessResponse(
    message='Нову колонку успішно створено',
    data=new_column
  )
  
@router.patch('/update_column', response_model=SuccessResponse[ColumnResponse])
async def update_column(board_id: int, column_data: ColumnUpdate, service: KanbanService = Depends(get_kanban_service)):
  new_column = await service.update_column(column_data, board_id)
  return SuccessResponse(
    message='Колонка успішно оновлена',
    data=new_column
  )
  
@router.delete('/delete_column', response_model=SuccessResponse[ColumnResponse])
async def delete_column(board_id: int, column_id: int, service: KanbanService = Depends(get_kanban_service)):
  deleted_column = await service.delete_column(column_id, board_id)
  return SuccessResponse(
    message='Колонка успішно видалена',
    data=deleted_column
  )

  
@router.get('/get_cards', response_model=SuccessResponse[CardListResponse])
async def get_cards(board_id: int, column_id: int, service: KanbanService = Depends(get_kanban_service)):
  cards = await service.get_all_cards(column_id, board_id)
  return SuccessResponse(
    data={'cards': cards}
  )
  
@router.post('/get_card_by_id', response_model=SuccessResponse[CardResponse])
async def get_card(card_id: int, column_id: int, service: KanbanService = Depends(get_kanban_service)):
  card = await service.get_card_by_id(card_id, column_id)
  return SuccessResponse( 
    data=card
  )

@router.post('/create_card', response_model=SuccessResponse[CardResponse])
async def create_card(card_data: CardCreate, column_id: int, user: User = Depends(get_current_user), service: KanbanService = Depends(get_kanban_service)):
  new_card = await service.create_card(card_data, column_id, user.id)
  return SuccessResponse(
    message='Нову картку успішно створено',
    data=new_card
  )
  
@router.patch('/update_card', response_model=SuccessResponse[CardResponse])
async def update_card(card_id: int, column_id: int, card_data: CardUpdate, user: User = Depends(get_current_user), service: KanbanService = Depends(get_kanban_service)):
  updated_card = await service.update_card(card_id, column_id, card_data, user.id)
  return SuccessResponse(
    message='Картку успішно оновлено',
    data=updated_card
  )
  
@router.delete('/delete_card', response_model=SuccessResponse[CardResponse])
async def delete_card(card_id: int, column_id: int, service: KanbanService = Depends(get_kanban_service)):
  deleted_card = await service.delete_card(column_id, card_id)
  return SuccessResponse(
    message='Картка успішно видалена',
    data=deleted_card
  )
