import { Injectable } from '@nestjs/common';
import { CreateSaleDto } from './dto/create-sale.dto';
import { UpdateSaleDto } from './dto/update-sale.dto';
import { InjectModel } from '@nestjs/mongoose';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { UserDocument } from 'src/users/schemas/user.schemas';
import { Sale } from './schemas/sale.schemas';
import { IUser } from 'src/users/users.interface';
import { MailService } from 'src/mail/mail.service';

@Injectable()
export class SaleService {

  constructor(
    @InjectModel(Sale.name)
    private saleModal: SoftDeleteModel<UserDocument>,

    private readonly mailService: MailService,

  ) { }

  async create(createSaleDto: CreateSaleDto) {

    const { name, email, phoneNumber, note } = createSaleDto

    const newSaleRegister = await this.saleModal.create({
      name, 
      email: email ?? '', 
      phoneNumber, 
      note: note ?? '',
      description: '',
      level: 0,
    })

    await this.mailService.newRegisterEmail(name, email, phoneNumber, note)

    await this.mailService.confirmRegisterEmail(name, email)

    return newSaleRegister
  }

  async getAll() {
    return await this.saleModal.find()
  }

  async update(id: string, updateSaleDto: UpdateSaleDto, user: IUser) {
    return await this.saleModal.updateOne(
      { _id: id },
      {
        ...updateSaleDto,
        updatedBy: {
          _id: user._id,
          email: user.email
        }
      }
    );
  }

  async remove(id: string, user: IUser) {
    await this.saleModal.updateOne(
      { _id: id },
      {
        deletedBy: {
          _id: user._id,
          email: user.email,
        },
      }
    );
    return await this.saleModal.softDelete({ _id: id });
  }
}
