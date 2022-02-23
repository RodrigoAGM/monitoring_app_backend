import * as mailer from 'nodemailer';
import fs from 'fs';
import handlebars from 'handlebars';
import { config } from 'dotenv';
import * as path from 'path';
import Mail from 'nodemailer/lib/mailer';
import AppError from '../../../error/app.error';

export class MailingService {
  private static _instance: MailingService

  transporter: Mail;

  constructor() {
    // Call config to read env variables
    config();

    try {
      this.transporter = mailer.createTransport({
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        secure: false,
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      });

      console.log('Mailing server connected');
    } catch (error) {
      console.log('Something went wrong trying to connect with SMTP server');
      throw error;
    }
  }

  async sendRecoverPasswordMail(userMail: string, tempPass: string, fullname: string) {
    try {
      // Read and set html to send
      const hostMail = process.env.HOST_MAIL;

      const filePath = path.join(__dirname, '../template/recover.password.html');

      const source = fs.readFileSync(filePath, 'utf-8').toString();

      const template = handlebars.compile(source);

      const replacements = {
        fullname,
        tempPass,
      };

      const htmlToSend = template(replacements);

      const mailOptions: Mail.Options = {
        from: `Soporte <${hostMail}>`,
        to: userMail,
        subject: 'Recupera tu contraseña',
        html: htmlToSend,
      };

      const info = await this.transporter.sendMail(mailOptions);

      return Promise.resolve(info);
    } catch (error) {
      return Promise.reject(new AppError({
        message: 'Ocurrió un error al envíar el correo.',
        statusCode: 500,
      }));
    }
  }

  public static getConnection() {
    // eslint-disable-next-line no-return-assign
    return this._instance || (this._instance = new this());
  }
}
