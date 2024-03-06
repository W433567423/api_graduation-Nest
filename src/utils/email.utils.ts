import { emailConfig } from '@/config/secret.config';
import * as NodeMail from 'nodemailer';
import { SendMailOptions } from 'nodemailer';
import Mail from 'nodemailer/lib//mailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';
import { Readable } from 'stream';

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
    this.transporter = NodeMail.createTransport(emailCreateConfig);
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
        console.log('邮件发送失败', error);
      } else {
        console.log('邮件发送成功');
      }
    });
  }
}

export default new Email();
