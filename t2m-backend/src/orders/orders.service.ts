import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { UserDocument } from 'src/users/schemas/user.schemas';
import { Order } from './schemas/order.schemas';
import aqp from 'api-query-params';

@Injectable()
export class OrdersService {

  constructor(
    @InjectModel(Order.name)
    private orderModel: SoftDeleteModel<UserDocument>,
  ) { }


  create(createOrderDto: CreateOrderDto) {
    return 'This action adds a new order';
  }

  async getAll() {
    return await this.orderModel.find()
  }


  findOne(id: number) {
    return `This action returns a #${id} order`;
  }

  update(id: number, updateOrderDto: UpdateOrderDto) {
    return `This action updates a #${id} order`;
  }

  remove(id: number) {
    return `This action removes a #${id} order`;
  }
}
