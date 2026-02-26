import { type paths } from "./types"

export type TCreateBoard = paths['/kanban/create_board']['post']['responses']['200']['content']['application/json']
export type TUpdateBoard = paths['/kanban/update_board']['patch']['responses']['200']['content']['application/json']
export type TBoard = paths['/kanban/get_board_by_id']['get']['responses']['200']['content']['application/json']['data']

export type TColumn = paths['/kanban/get_column_by_id']['get']['responses']['200']['content']['application/json']['data']
export type TCard = paths['/kanban/get_card_by_id']['get']['responses']['200']['content']['application/json']['data']