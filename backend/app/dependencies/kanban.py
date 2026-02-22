from ..core.db import get_db
from ..services.kanban import KanbanService
from ..repository.kanban_repository import KanbanRepository
from fastapi import Depends
from sqlalchemy.ext.asyncio import AsyncSession

def get_kanban_service(db: AsyncSession = Depends(get_db)):
  return KanbanService(KanbanRepository(db))