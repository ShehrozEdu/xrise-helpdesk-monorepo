import { Ticket } from '../models/ticket.model';
import { Event } from '../models/event.model';
import { generateTicketId } from '../utils/ticketId';
import { CreateTicketInput, TicketQueryInput } from '@helpdesk/shared';
import mongoose from 'mongoose';
import { getIO } from '../socket';
import { MailService } from './mail.service';

export class TicketService {
  static async createTicket(data: CreateTicketInput) {
    try {
      const ticketId = await generateTicketId();

      const ticket = new Ticket({
        ...data,
        ticketId,
      });
      await ticket.save();

      const event = new Event({
        ticketId,
        type: 'created',
        message: 'Ticket created successfully',
      });
      await event.save();
      
      const io = getIO();
      io.emit('ticket:created', ticket);

      // Notify customer (async)
      MailService.sendTicketConfirmation(ticket.email, ticket.ticketId, ticket.subject);

      return ticket;
    } catch (error) {
      throw error;
    }
  }

  static async getTickets(query: TicketQueryInput, user: { userId: string, role: string }) {
    const filter: any = {};
    
    if (user.role === 'agent') {
      filter.assigneeId = user.userId;
    } else if (query.assigneeId) {
      filter.assigneeId = query.assigneeId;
    }

    if (query.status) filter.status = query.status;
    if (query.priority) filter.priority = query.priority;
    if (query.search) {
      filter.$text = { $search: query.search };
    }

    const { page, limit } = query;
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      Ticket.find(filter)
        .sort(query.search ? { score: { $meta: 'textScore' } } : { createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .populate('assigneeId', 'name email role'),
      Ticket.countDocuments(filter)
    ]);

    return {
      items,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      }
    };
  }

  static async getTicketById(id: string, user: { userId: string, role: string }) {
    const ticket = await Ticket.findById(id).populate('assigneeId', 'name email role');
    if (!ticket) throw { statusCode: 404, message: 'Ticket not found' };

    // Enforce role access
    if (user.role === 'agent' && String(ticket.assigneeId?._id || ticket.assigneeId) !== user.userId) {
      throw { statusCode: 403, message: 'Forbidden' };
    }

    const events = await Event.find({ ticketId: ticket.ticketId })
      .sort({ createdAt: 1 })
      .populate('createdBy', 'name email role');

    return { ticket, events };
  }

  static async checkStatus(ticketId: string, email: string) {
    const ticket = await Ticket.findOne({ ticketId, email: email.toLowerCase() });
    if (!ticket) throw { statusCode: 404, message: 'Ticket not found or invalid email' };

    const latestReplyEvent = await Event.findOne({ ticketId, type: 'reply', createdBy: { $ne: null } })
      .sort({ createdAt: -1 });

    return {
      ticketId: ticket.ticketId,
      subject: ticket.subject,
      status: ticket.status,
      priority: ticket.priority,
      createdAt: ticket.createdAt,
      latestReply: latestReplyEvent ? {
        message: latestReplyEvent.message,
        createdAt: latestReplyEvent.createdAt,
      } : null,
    };
  }

  static async replyToTicket(id: string, message: string, userId: string) {
    const ticket = await Ticket.findById(id);
    if (!ticket) throw { statusCode: 404, message: 'Ticket not found' };

    const event = new Event({
      ticketId: ticket.ticketId,
      type: 'reply',
      message,
      createdBy: userId,
    });
    await event.save();
    
    // Auto-change status to in-progress if open
    if (ticket.status === 'open') {
      ticket.status = 'in-progress';
      await ticket.save();
    }

    const io = getIO();
    io.emit('ticket:reply', { ticketId: ticket.ticketId, event });
    io.emit('ticket:updated', ticket);

    // Notify customer (async)
    if (userId) { // If it's an agent reply
      MailService.sendReplyNotification(ticket.email, ticket.ticketId, message);
    }

    return event;
  }

  static async updateStatus(id: string, status: string, userId: string) {
    const ticket = await Ticket.findByIdAndUpdate(id, { status }, { new: true });
    if (!ticket) throw { statusCode: 404, message: 'Ticket not found' };

    const event = new Event({
      ticketId: ticket.ticketId,
      type: 'status_change',
      message: `Status changed to ${status}`,
      createdBy: userId,
    });
    await event.save();

    const io = getIO();
    io.emit('ticket:updated', ticket);

    return ticket;
  }

  static async assignTicket(id: string, assigneeId: string, adminId: string) {
    const ticket = await Ticket.findByIdAndUpdate(id, { assigneeId }, { new: true });
    if (!ticket) throw { statusCode: 404, message: 'Ticket not found' };

    const event = new Event({
      ticketId: ticket.ticketId,
      type: 'reassigned',
      message: 'Ticket reassigned',
      createdBy: adminId,
    });
    await event.save();

    const io = getIO();
    io.emit('ticket:updated', ticket);

    return ticket;
  }
}
