import { Request, Response, NextFunction } from 'express';
import { TicketService } from '../services/ticket.service';
import { AiService } from '../services/ai.service';
import { sendResponse } from '../utils/response';

export class TicketController {
  static async create(req: Request, res: Response, next: NextFunction) {
    try {
      req.body.email = req.body.email.toLowerCase();
      const ticket = await TicketService.createTicket(req.body);
      sendResponse(res, 201, true, 'Ticket created', { ticketId: ticket.ticketId });
    } catch (error) {
      next(error);
    }
  }

  static async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await TicketService.getTickets(req.query as any, (req as any).user!);
      sendResponse(res, 200, true, 'Tickets fetched', data);
    } catch (error) {
      next(error);
    }
  }

  static async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await TicketService.getTicketById(req.params.id as string, (req as any).user!);
      sendResponse(res, 200, true, 'Ticket details fetched', data);
    } catch (error) {
      next(error);
    }
  }

  static async checkStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const { ticketId, email } = req.query as any;
      const data = await TicketService.checkStatus(ticketId, email);
      sendResponse(res, 200, true, 'Status fetched', data);
    } catch (error) {
      next(error);
    }
  }

  static async reply(req: Request, res: Response, next: NextFunction) {
    try {
      const event = await TicketService.replyToTicket(req.params.id as string, req.body.message, (req as any).user!.userId);
      sendResponse(res, 201, true, 'Reply added', event);
    } catch (error) {
      next(error);
    }
  }

  static async updateStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const ticket = await TicketService.updateStatus(req.params.id as string, req.body.status, (req as any).user!.userId);
      sendResponse(res, 200, true, 'Status updated', ticket);
    } catch (error) {
      next(error);
    }
  }

  static async assign(req: Request, res: Response, next: NextFunction) {
    try {
      const ticket = await TicketService.assignTicket(req.params.id as string, req.body.assigneeId, (req as any).user!.userId);
      sendResponse(res, 200, true, 'Ticket assigned', ticket);
    } catch (error) {
      next(error);
    }
  }

  static async draftReply(req: Request, res: Response, next: NextFunction) {
    try {
      const draft = await AiService.generateDraftReply(req.params.id as string);
      sendResponse(res, 200, true, 'Draft generated', { draft });
    } catch (error) {
      next(error);
    }
  }
}
