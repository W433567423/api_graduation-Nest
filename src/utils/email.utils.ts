import { emailConfig } from '@/config/secret.config';
import { SendMailOptions } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import * as nodemail from 'nodemailer';
import { Readable } from 'stream';
import Mail from 'nodemailer/lib//mailer';

const emailCreateConfig: SMTPTransport.Options = {
  service: emailConfig.service,
  from: `${emailConfig.alias}<${emailConfig.username}>`,
  host: emailConfig.host,
  port: emailConfig.port,
  secure: emailConfig.secure,
  auth: {
    user: emailConfig.username,
    pass: emailConfig.password,
  },
};

class Email {
  private transporter;
  constructor() {
    this.transporter = nodemail.createTransport(emailCreateConfig);
  }
  // 发送验证码的方法
  send({
    email,
    text,
    subject = 'tutu',
  }: {
    email: string;
    subject?: string;
    text?: string | Buffer | Readable | Mail.AttachmentLike | undefined;
  }) {
    const options: SendMailOptions = {
      from: `${emailConfig.alias}<${emailConfig.username}>`,
      to: email,
      subject,
      text,
    };

    this.transporter.sendMail(options, (error) => {
      if (error) {
        console.log('邮件发送失败');
        console.log(error);
      } else {
        console.log('邮件发送成功');
      }
    });
  }
}

export default new Email();
