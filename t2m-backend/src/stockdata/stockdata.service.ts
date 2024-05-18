import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class StockdataService {
  constructor(private readonly dataSource: DataSource) { }

  async findAllTables(): Promise<string[]> {
    const query = `SHOW TABLES`;
    const result = await this.dataSource.query(query);
    return result.map((row: any) => Object.values(row)[0]);
  }

  async findTableData(tableName: string): Promise<any[]> {
    const query = `SELECT * FROM ${tableName}`;
    return this.dataSource.query(query);
  }
}
