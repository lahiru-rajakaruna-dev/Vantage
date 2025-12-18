import { Module } from '@nestjs/common';
import { DrizzlePostgresService } from './drizzle-postgres/drizzle-postgres.service';
import { DrizzleSqliteService } from './drizzle-sqlite/drizzle-sqlite.service';
import { DrizzleFactory } from './drizzle-factory/drizzle-factory.service';
import { ConfigModule } from '@nestjs/config';
import { LoggerModule } from '../../logger/logger.module';

@Module({
  imports: [ConfigModule, LoggerModule],
  providers: [DrizzlePostgresService, DrizzleFactory, DrizzleSqliteService],
  exports: [DrizzleFactory],
})
export class DrizzleModule {}
