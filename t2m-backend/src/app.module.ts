import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { softDeletePlugin } from 'soft-delete-plugin-mongoose';
import { PermissionsModule } from './permissions/permissions.module';
import { RolesModule } from './roles/roles.module';
import { DatabasesModule } from './databases/databases.module';
import { LicensesModule } from './licenses/licenses.module';
import { ProductsModule } from './products/products.module';
import { MailModule } from './mail/mail.module';
import { ScheduleModule } from '@nestjs/schedule';
import { DiscountcodesModule } from './discountcodes/discountcodes.module';
import { FilesModule } from './files/files.module';
import { OrdersModule } from './orders/orders.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StockdataModule } from './stockdata/stockdata.module';
import { SaleModule } from './sale/sale.module';
require('dotenv').config()

@Module({
  imports: [
    ScheduleModule.forRoot(),
    MongooseModule.forRootAsync({
      useFactory: async () => ({
        uri: process.env.MONGODB_URL,
        connectionFactory: (connection) => {
          connection.plugin(softDeletePlugin);
          return connection;
        }
      })
    }),
    UsersModule,
    AuthModule,
    PermissionsModule,
    RolesModule,
    DatabasesModule,
    LicensesModule,
    ProductsModule,
    MailModule,
    DiscountcodesModule,
    FilesModule,
    OrdersModule,
    SaleModule,

    TypeOrmModule.forRoot({
      type: 'mysql',
      host: '14.225.192.30',
      port: 3306,
      username: 'twan',
      password: 'chodom',
      database: 't2m',
      extra: {
        connectionLimit: 10,
      },
      timezone: 'Z',
      entities: [__dirname + '/../**/*.entity{.ts,.js}'],
      synchronize: true,
    }),
    StockdataModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
