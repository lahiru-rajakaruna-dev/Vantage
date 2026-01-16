import { NestFactory } from '@nestjs/core';
import cookieParser from 'cookie-parser';
import * as z from 'zod';
import { AppModule } from './app.module';
import { EDatabaseStrategy, EEnvVars, ENodeEnv, EOrmStrategy } from './types';

async function bootstrap() {
  checkEnv();
  const app = await NestFactory.create(AppModule, {
    cors: {
      credentials: true,
      preflightContinue: false,
      origin: true,
    },
  });
  app.use(cookieParser());
  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();

async function checkEnv() {
  const config = process.env;

  const drizzle_postgres = z.object({
    [EEnvVars.NODE_ENV]: z.enum([ENodeEnv.PRODUCTION, ENodeEnv.TEST]),
    [EEnvVars.PADDLE_PRODUCTION_API_KEY]: z.string().nonempty().nonoptional(),
    [EEnvVars.ORM_STRATEGY]: z.enum(EOrmStrategy),
    [EEnvVars.DATABASE_STRATEGY]: z.enum(EDatabaseStrategy),
    [EEnvVars.POSTGRES_URL]: z.string().nonempty().nonoptional(),
    [EEnvVars.POSTGRES_USERNAME]: z.string().nonempty().nonoptional(),
    [EEnvVars.POSTGRES_PASSWORD]: z.string().nonempty().nonoptional(),
    [EEnvVars.JWT_SECRET_KEY]: z.string().nonempty().nonoptional(),
  });

  const drizzle_sqlite = z.object({
    [EEnvVars.NODE_ENV]: z.enum([ENodeEnv.DEVELOPMENT]),
    [EEnvVars.PADDLE_DEVELOPMENT_API_KEY]: z.string().nonempty().nonoptional(),
    [EEnvVars.ORM_STRATEGY]: z.enum(EOrmStrategy),
    [EEnvVars.DATABASE_STRATEGY]: z.enum(EDatabaseStrategy),
    [EEnvVars.SQLITE_URL]: z.string().nonempty().nonoptional(),
    [EEnvVars.JWT_SECRET_KEY]: z.string().nonempty().nonoptional(),
  });

  const applicationConfigStrategy = z.xor([drizzle_sqlite, drizzle_postgres]);

  applicationConfigStrategy.parse(config);
}
