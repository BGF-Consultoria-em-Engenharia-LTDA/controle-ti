import { Routes } from '../types/routes.ts';
import { getStock, getItem, getCollaborators } from "../controllers/stockController.tsx";

const Routes: Routes[] = [
  {
    path: '/stock',
    method: 'get',
    handlers: getStock
  },
  {
    path: '/stock/:row',
    method: 'get',
    handlers: getItem
  },
  {
    path: '/collaborators',
    method: 'get',
    handlers: getCollaborators
  }
]

export default Routes