import '@std/dotenv/load'
import { Hono } from 'hono'
import { prettyJSON } from 'hono/middleware'
import { cors } from 'hono/cors'
import routes from './routes/routes.ts'

export const app = new Hono()
app.use('*', prettyJSON())
app.use('*', cors())

routes.map((route) => app.on(route.method, route.path, ...route.handlers))

Deno.serve(app.fetch)