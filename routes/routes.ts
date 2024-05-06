import { Routes } from '../types/routes.ts'
import trelloRoutes from './trello.ts'
import sheetRoutes from './sheet.ts'
import stockRoutes from './stock.ts'

const routes: Routes[] = [
	...trelloRoutes,
	...sheetRoutes,
	...stockRoutes
]

export default routes