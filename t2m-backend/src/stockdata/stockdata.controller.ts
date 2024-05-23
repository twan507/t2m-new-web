import { Controller, Get, Param, Query } from '@nestjs/common';
import { StockdataService } from './stockdata.service';
import { Public } from 'src/decorator/customize';

@Controller('stockdata')
export class StockdataController {
  constructor(private readonly stockdataService: StockdataService) { }

  @Get('')
  @Public()
  findAllTables(): Promise<string[]> {
    return this.stockdataService.findAllTables();
  }

  // @Get(':tableName')
  // @Public()
  // findTableData(@Param('tableName') tableName: string): Promise<any[]> {
  //   return this.stockdataService.findTableData(tableName);
  // }

  @Get(':tableName')
  @Public()
  findFilterTable(
    @Param('tableName') tableName: string,
    @Query('columnName') columnName: string,
    @Query('columnValue') columnValue: string | number
  ): Promise<any[]> {
    if (columnName && columnValue) {
      return this.stockdataService.findFilterTable(tableName, columnName, columnValue);
    } else {
      return this.stockdataService.findTableData(tableName);
    }
  }
}
