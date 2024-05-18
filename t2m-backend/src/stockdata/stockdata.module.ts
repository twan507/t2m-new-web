import { Module } from '@nestjs/common';
import { StockdataService } from './stockdata.service';
import { StockdataController } from './stockdata.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  controllers: [StockdataController],
  providers: [StockdataService]
})
export class StockdataModule { }
