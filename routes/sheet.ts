import { Routes } from '../types/routes.ts'
import { getSheetRange, putSheetCell } from "../controllers/sheetController.ts"

const SheetRoutes: Routes[] = [
  {
    path: '/sheet/:id',
    method: 'get',
    handlers: getSheetRange
  },
  {
    path: '/sheet/:id/:cell',
    method: 'put',
    handlers: putSheetCell
  }
]

export default SheetRoutes