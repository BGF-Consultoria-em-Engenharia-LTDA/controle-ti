import { Routes } from '../types/routes.ts'
import trelloRoutes from './trello.ts'
import sheetRoutes from './sheet.ts'

const routes: Routes[] = [
	...trelloRoutes,
	...sheetRoutes
]

export default routes