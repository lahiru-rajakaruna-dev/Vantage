import { Module } from '@nestjs/common';
import { OrmModule } from '../../orm/orm.module';
import { SaleService } from './sale.service';
import { SaleController } from './sale.controller';

@Module({
  imports: [OrmModule],
  providers: [SaleService],
  controllers: [SaleController],
})
export class SaleModule {}
