import { Injectable } from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { UserDocument } from 'src/users/schemas/user.schemas';
import { Sale } from './schemas/sale.schemas';

@Injectable()
export class SaleService {

  constructor(
    @InjectModel(Sale.name)
    private orderModel: SoftDeleteModel<UserDocument>,
  ) { }


  create(createSaleDto: CreateSaleDto) {
    return 'This action adds a new order';
  }

  async getAll() {
    return await this.orderModel.find()
  }


  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateSaleDto: UpdateSaleDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
