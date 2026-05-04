import Fastify from 'fastify';
import cors from '@fastify/cors';
import { healthRoutes } from './routes/health.js';
import { exampleRoutes } from './routes/example.js';
import { configRoutes } from './routes/config.js';

const app = Fastify({ logger: true });

await app.register(cors, {
  origin: process.env.CORS_ORIGIN ?? 'http://localhost:5173',
  credentials: true,
});

// Register routes
await app.register(healthRoutes, { prefix: '/api' });
await app.register(exampleRoutes, { prefix: '/api' });
await app.register(configRoutes, { prefix: '/api' });

// Start server
const port = Number(process.env.PORT ?? 3001);
const host = process.env.HOST ?? '0.0.0.0';

try {
  await app.listen({ port, host });
  app.log.info(`Fastify API running on http://${host}:${port}`);
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
