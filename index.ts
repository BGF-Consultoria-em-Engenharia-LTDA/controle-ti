import '@std/dotenv/load';
import { Hono } from 'hono';
import { bearerAuth } from 'hono/bearer-auth';
import { cors } from 'hono/cors';
import routes from './routes/routes.ts';

export const app = new Hono();
app.use('*', cors());
app.use('*', bearerAuth({ token: Deno.env.get('BEARER_TOKEN') || '' }));

routes.map((route) => app.on(route.method, route.path, ...route.handlers));

Deno.serve(app.fetch);