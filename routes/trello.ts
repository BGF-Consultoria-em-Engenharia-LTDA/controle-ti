import { Routes } from '../types/routes.ts'
import { getTrelloCard, postTrelloCard, headTrelloAction, postTrelloAction } from "../controllers/trelloController.ts"

const Routes: Routes[] = [
	{
		path: '/trello/cards/:id',
		method: 'get',
		handlers: getTrelloCard
	},
	{
		path: '/trello/cards',
		method: 'post',
		handlers: postTrelloCard
	},
	{
		path: '/trello/actions',
		method: 'get',
		handlers: headTrelloAction
	},
	{
		path: '/trello/actions',
		method: 'post',
		handlers: postTrelloAction
	}
]

export default Routes