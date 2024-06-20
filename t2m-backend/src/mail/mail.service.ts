import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
    constructor(
        private readonly mailerService: MailerService,
    ) { }

    async registerEmail(customerName: string, mailTo: string) {
        await this.mailerService.sendMail({
            to: mailTo,
            from: '"T2M Invest" <mail.t2minvest@gmail.com>', // override default from
            subject: 'Đăng kí thành công tài khoản T2M Invest!',
            template: "registerUser", //Tên của file .hbs trong thư mục templates

            //truyền các biến này sang file handlebar
            context: {
                customerName: customerName
            },
        });
    }

    async licenseExpireEmail(customerName: string, daysLeft: number, mailTo: string) {
        await this.mailerService.sendMail({
            to: mailTo,
            from: '"T2M Invest" <mail.t2minvest@gmail.com>', // override default from
            subject: 'Lưu ý giá hạn hội viên T2M Invest!',
            template: "licenseExpire", //Tên của file .hbs trong thư mục templates

            //truyền các biến này sang file handlebar
            context: {
                customerName: customerName,
                daysLeft: daysLeft
            },
        });
    }

    async forgetPasswordEmail(customerName: string, token: string, mailTo: string) {
        await this.mailerService.sendMail({
            to: mailTo,
            from: '"T2M Invest" <mail.t2minvest@gmail.com>', // override default from
            subject: 'Mã xác thực đổi mật khẩu!',
            template: "forgetPassword", //Tên của file .hbs trong thư mục templates

            //truyền các biến này sang file handlebar
            context: {
                customerName: customerName,
                token: token
            },
        });
    }

    async trialEmail(customerName: string, token: string, mailTo: string) {
        await this.mailerService.sendMail({
            to: mailTo,
            from: '"T2M Invest" <mail.t2minvest@gmail.com>', // override default from
            subject: 'Xác nhận đăng kí dùng thử T2M Invest',
            template: "trialConfirm", //Tên của file .hbs trong thư mục templates

            //truyền các biến này sang file handlebar
            context: {
                customerName: customerName,
                token: token
            },
        });
    }

    async changePasswordEmail(customerName: string, mailTo: string) {
        await this.mailerService.sendMail({
            to: mailTo,
            from: '"T2M Invest" <mail.t2minvest@gmail.com>', // override default from
            subject: 'Mật khẩu đã được thay đổi!',
            template: "changePassword", //Tên của file .hbs trong thư mục templates

            //truyền các biến này sang file handlebar
            context: {
                customerName: customerName
            },
        });
    }

    async newRegisterEmail(name: string, email: string, phoneNumber: string, note: string) {
        await this.mailerService.sendMail({
            to: "mail.t2minvest@gmail.com",
            from: '"T2M Invest" <mail.t2minvest@gmail.com>',
            subject: 'Khách hàng mới đăng kí tư vấn!',
            template: "newRegister",
            context: {
                name: name,
                email: email,
                phoneNumber: phoneNumber,
                note: note
            },
        });
    }

    async confirmRegisterEmail(customerName: string, mailTo: string) {
        await this.mailerService.sendMail({
            to: mailTo,
            from: '"T2M Invest" <mail.t2minvest@gmail.com>',
            subject: 'T2M Invest cảm ơn!',
            template: "confirmRegister",
            context: {
                customerName: customerName
            },
        });
    }
}
