import { type paths } from "./types"

export type TCreateBoard = paths['/kanban/create_board']['post']['responses']['200']['content']['application/json']
export type TUpdateBoard = paths['/kanban/update_board']['patch']['responses']['200']['content']['application/json']
export type TBoard = paths['/kanban/get_board_by_id']['post']['responses']['200']['content']['application/json']['data']