import { createClient } from 'redis';

if (!process.env.REDIS_URL) {
  throw new Error('Por favor, define REDIS_URL en el archivo .env.local');
}

const redisClient = createClient({
  url: process.env.REDIS_URL,
});

redisClient.on('error', (err) => console.error('Error de Redis:', err));
redisClient.on('connect', () => console.log('Conectado a Redis'));

// Conectar al cliente
(async () => {
  await redisClient.connect();
})();

export default redisClient; 