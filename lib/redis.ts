import Redis from 'ioredis';

if (!process.env.REDIS_URL) {
  throw new Error('Falta la variable de entorno REDIS_URL para Redis Upstash');
}

const redis = new Redis(process.env.REDIS_URL);

redis.on('connect', () => {
  console.log('Redis Upstash conectado correctamente');
});
redis.on('error', (err) => {
  console.error('Error de conexión a Redis Upstash:', err);
});

export default redis;

