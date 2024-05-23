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

  async findFilterTable(tableName: string, columnName: string, columnValue: string | number): Promise<any[]> {
    try {
      const query = `SELECT * FROM \`${tableName}\` WHERE \`${columnName}\` = ?`;
      return this.dataSource.query(query, [columnValue]);
    } catch {
      const query = `SELECT * FROM ${tableName}`;
      return this.dataSource.query(query);
    }
  }
}
