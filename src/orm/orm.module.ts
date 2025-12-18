import { Module } from '@nestjs/common';
import { DrizzleModule } from './drizzle/drizzle.module';
import { OrmFactory } from './orm-factory/orm-factory.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [DrizzleModule, ConfigModule],
  providers: [OrmFactory],
  exports: [OrmFactory],
})
export class OrmModule {}
