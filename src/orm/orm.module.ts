import { Module } from '@nestjs/common';
import { DatabaseClientModule } from '../database-client/database-client.module';
import { DrizzleModule } from './drizzle/drizzle.module';
import { OrmFactory } from './orm-factory/orm-factory.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [DatabaseClientModule, DrizzleModule, ConfigModule],
  providers: [OrmFactory],
  exports: [OrmFactory],
})
export class OrmModule {}
