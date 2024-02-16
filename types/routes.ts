import { MiddlewareHandler, Handler } from 'hono'

export type Methods = ['get', 'post', 'put', 'delete', 'options', 'patch'][number]

export interface Routes {
	path: string
	method: Methods
	handlers: (Handler | MiddlewareHandler)[]
}