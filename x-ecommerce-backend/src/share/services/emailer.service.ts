import { ForgotPasswordDto } from '@/modules/auth/dto/forgot-password.dto';
import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import TimeUtils from '../utils/time-utils';

@Injectable()
export class EmailerService {
  private transporter: nodemailer.Transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      // Cấu hình transporter, ví dụ: SMTP hoặc service như Gmail
      // Chi tiết cấu hình xem trong tài liệu nodemailer
      host: 'smtp.gmail.com', // Gmail SMTP server address
      port: 465,
      secure: true,
      auth: {
        user: process.env.SYSTEM_EMAIL, // Địa chỉ email của bạn
        pass: process.env.SYSTEM_EMAIL_PASSWORD, // Mật khẩu email của bạn, mật khẩu app nếu sử dụng Gmail
      },
    });
  }

  async sendPasswordResettingVerificationLink(name: string, dto: ForgotPasswordDto, token: string): Promise<boolean> {
    const mailContent = `
    <p>
      Chúng tôi nhận được yêu cầu đổi mật khẩu cho tài khoản bằng email ${dto.email}. Vui lòng click 
      <a href="${process.env.WEB_URL}/new-password?token=${token}" target="_blank"> tại dây </a>
      để xác nhận.
    </p>
    `;
    const mailOptions: nodemailer.SendMailOptions = {
      to: dto.email,
      subject: 'Xác nhận đặt lại mật khẩu',
      html: this.generateHtmlEmail(name, mailContent, {
        expiresIn: TimeUtils.convertLifespanToMilliseconds(process.env.OTP_EXPIRE),
      }),
    };

    await this.transporter.sendMail(mailOptions);

    return true;
  }

  generateHtmlEmail(name: string, content: string, options?: { expiresIn: number }): string {
    return `
    <h4>Xin chào ${name}</h4>
    ${content}
    <div> Token cho hành động Quên mật khẩu sẽ có hiệu lực trong vòng ${Number(options?.expiresIn) / 60000} phút</div>
    <div> Nếu bạn không yêu cầu tạo tài khoản này, vui lòng bỏ qua email này. </div>
    <p>Trân trọng,</p>
    <p>Chore Team</p>
    `;
  }
}
