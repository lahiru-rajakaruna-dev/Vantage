import { Module } from '@nestjs/common';
import { PaddleService } from './paddle.service';
import { LoggerModule } from '../logger/logger.module';

@Module({
  imports: [LoggerModule],
  providers: [PaddleService],
  exports: [PaddleService],
})
export class PaddleModule {}
