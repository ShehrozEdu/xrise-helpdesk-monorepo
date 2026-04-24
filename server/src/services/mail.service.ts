import { Resend } from 'resend';
import { env } from '../config/env';
import { logger } from '../config/logger';

const resend = env.RESEND_API_KEY ? new Resend(env.RESEND_API_KEY) : null;

export class MailService {
  static async sendTicketConfirmation(email: string, ticketId: string, subject: string) {
    if (!resend) {
      logger.warn('RESEND_API_KEY not configured. Skipping confirmation email.');
      return;
    }

    try {
      await resend.emails.send({
        from: 'Support <support@resend.dev>', // Should be a verified domain in production
        to: email,
        subject: `Ticket Received: ${ticketId}`,
        html: `
          <h1>Thanks for reaching out!</h1>
          <p>We've received your ticket regarding: <strong>${subject}</strong></p>
          <p>Your Ticket ID is <strong>${ticketId}</strong>.</p>
          <p>You can check the status of your ticket at any time on our portal.</p>
          <br />
          <p>Best regards,<br />Helpdesk Team</p>
        `,
      });
      logger.info(`Confirmation email sent to ${email} for ticket ${ticketId}`);
    } catch (error) {
      logger.error({ err: error }, 'Failed to send confirmation email');
    }
  }

  static async sendReplyNotification(email: string, ticketId: string, message: string) {
    if (!resend) {
      logger.warn('RESEND_API_KEY not configured. Skipping reply notification email.');
      return;
    }

    try {
      await resend.emails.send({
        from: 'Support <support@resend.dev>',
        to: email,
        subject: `New Reply to Ticket ${ticketId}`,
        html: `
          <h1>New Update!</h1>
          <p>A support agent has replied to your ticket ${ticketId}:</p>
          <blockquote style="padding: 15px; background: #f0f0f0; border-left: 5px solid #ccc;">
            ${message}
          </blockquote>
          <p>Please visit the portal to respond or view more details.</p>
          <br />
          <p>Best regards,<br />Helpdesk Team</p>
        `,
      });
      logger.info(`Reply notification sent to ${email} for ticket ${ticketId}`);
    } catch (error) {
      logger.error({ err: error }, 'Failed to send reply notification email');
    }
  }
}
