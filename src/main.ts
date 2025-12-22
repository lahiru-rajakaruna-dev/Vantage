import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as z from 'zod';

async function bootstrap() {
  checkEnv();
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();

async function checkEnv() {
  const config = process.env;
  console.debug(config);

  const drizzle_postgres = z.object({
    ['ORM_STRATEGY']: z.enum(['drizzle']),
    ['DATABASE_STRATEGY']: z.enum(['postgres']),
    ['POSTGRES_DATABASE_URL']: z.string(),
  });

  const drizzle_sqlite = z.object({
    ['ORM_STRATEGY']: z.enum(['drizzle']),
    ['DATABASE_STRATEGY']: z.enum(['sqlite']),
    ['SQLITE_DATABASE_URL']: z.string(),
  });

  const applicationConfigStrategy = z.xor([drizzle_sqlite, drizzle_postgres]);

  applicationConfigStrategy.parse(config);
}
