import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { SaleService } from './sale.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { Public, ResponseMessage, SkipCheckPermission, User } from 'src/decorator/customize';
import { IUser } from 'src/users/users.interface';

@Controller('sales')
export class SaleController {
  constructor(private readonly saleService: SaleService) { }

  @Public()
  @Post()
  create(@Body() createSaleDto: CreateSaleDto) {
    return this.saleService.create(createSaleDto);
  }

  @SkipCheckPermission()
  @Get()
  @ResponseMessage("Fetch all Sale")
  getAll() { return this.saleService.getAll() }

  @SkipCheckPermission()
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateSaleDto: UpdateSaleDto, @User() user: IUser) {
    return this.saleService.update(id, updateSaleDto, user);
  }

  @SkipCheckPermission()
  @Delete(':id')
  remove(@Param('id') id: string, @User() user: IUser) {
    return this.saleService.remove(id, user);
  }
}
