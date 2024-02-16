import { Hono } from 'hono'
import { prettyJSON } from 'hono/middleware'
import { cors } from 'hono/cors'
import * as dotenv from 'dotenv'
import routes from './routes/routes.ts'

const app = new Hono()
app.use('*', prettyJSON())
app.use('*', cors())

await dotenv.load({ export: true })

routes.map((route) => app.on(route.method, route.path, ...route.handlers))

Deno.serve(app.fetch)