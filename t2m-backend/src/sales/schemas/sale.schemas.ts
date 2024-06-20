import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { Permission } from 'src/permissions/schemas/permission.schemas';

export type SaleDocument = HydratedDocument<Sale>;

@Schema({ timestamps: true })
export class Sale {

    @Prop()
    name: string;

    @Prop()
    email: string;

    @Prop()
    phoneNumber: string;

    @Prop()
    note: string;

    @Prop()
    description: string;

    @Prop()
    level: number;

    @Prop({ type: Object })
    deletedBy: {
        _id: Types.ObjectId
        email: string
    };

    @Prop()
    createdAt: Date;

    @Prop()
    isDeleted: boolean;

    @Prop()
    deletedAt: Date;
}

export const SaleSchema = SchemaFactory.createForClass(Sale);
