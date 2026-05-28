// Location: backend/src/common/services/email.service.ts
// Purpose: Injectable service wrapping Nodemailer. Sends transactional emails:
//          booking confirmation, QR code delivery, event reminders, etc.

import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT, 10) || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  /**
   * Send booking confirmation with QR code attachment.
   */
  async sendTicketConfirmation(
    to: string,
    userName: string,
    eventName: string,
    ticketId: string,
    qrCodeBase64: string,
  ): Promise<void> {
    const qrBuffer = Buffer.from(qrCodeBase64.split(',')[1], 'base64');

    await this.transporter.sendMail({
      from: `"EventMS" <${process.env.EMAIL_FROM}>`,
      to,
      subject: `🎟️ Your ticket for ${eventName}`,
      html: `
        <div style="font-family:sans-serif;max-width:600px;margin:auto">
          <h2>Hi ${userName}! 🎉</h2>
          <p>Your ticket for <strong>${eventName}</strong> is confirmed.</p>
          <p>Ticket ID: <code>${ticketId}</code></p>
          <p>Show the QR code below at the venue entrance:</p>
          <img src="cid:qrcode" alt="QR Code" style="width:200px"/>
          <p>See you there! — EventMS Team</p>
        </div>
      `,
      attachments: [
        {
          filename: 'ticket-qr.png',
          content: qrBuffer,
          cid: 'qrcode',
        },
      ],
    });

    this.logger.log(`Ticket email sent to ${to} for event: ${eventName}`);
  }

  /**
   * Generic email sender for notifications.
   */
  async sendEmail(to: string, subject: string, html: string): Promise<void> {
    await this.transporter.sendMail({
      from: `"EventMS" <${process.env.EMAIL_FROM}>`,
      to,
      subject,
      html,
    });
  }
}
