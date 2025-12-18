import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { OrmModule } from '../../orm/orm.module';
import { ClientController } from './client.controller';

@Module({
  imports: [OrmModule],
  providers: [ClientService],
  controllers: [ClientController],
})
export class ClientModule {}
