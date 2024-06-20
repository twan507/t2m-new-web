import { IsNotEmpty, IsOptional } from "class-validator"

export class CreateSaleDto {

    @IsNotEmpty({ message: "Họ và tên không được để trống!" })
    name: string;

    @IsOptional()
    email: string;

    @IsNotEmpty({ message: "Số điện thoại không được để trống!" })
    phoneNumber: string;

    @IsOptional()
    note: string;

    @IsOptional()
    description: string;

    @IsOptional()
    level: string;
}