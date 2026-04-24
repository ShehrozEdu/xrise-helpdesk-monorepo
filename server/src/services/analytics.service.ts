import { Ticket } from '../models/ticket.model';
import { Event } from '../models/event.model';
import mongoose from 'mongoose';

export class AnalyticsService {
  static async getStats() {
    const [statusStats, priorityStats, ticketTrends] = await Promise.all([
      // Status breakdown
      Ticket.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ]),
      
      // Priority breakdown
      Ticket.aggregate([
        { $group: { _id: '$priority', count: { $sum: 1 } } }
      ]),
      
      // Tickets created over last 7 days
      Ticket.aggregate([
        {
          $match: {
            createdAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
          }
        },
        {
          $group: {
            _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
            count: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } }
      ])
    ]);

    // Average Response Time calculation
    // This is more complex: find the first 'reply' event for each ticket and compare it with ticket.createdAt
    const responseTimeStats = await Event.aggregate([
      { $match: { type: 'reply', createdBy: { $ne: null } } },
      { $sort: { ticketId: 1, createdAt: 1 } },
      {
        $group: {
          _id: '$ticketId',
          firstReplyAt: { $first: '$createdAt' }
        }
      },
      {
        $lookup: {
          from: 'tickets',
          localField: '_id',
          foreignField: 'ticketId',
          as: 'ticket'
        }
      },
      { $unwind: '$ticket' },
      {
        $project: {
          responseTimeMs: { $subtract: ['$firstReplyAt', '$ticket.createdAt'] }
        }
      },
      {
        $group: {
          _id: null,
          avgResponseTimeHours: { $avg: { $divide: ['$responseTimeMs', 3600000] } }
        }
      }
    ]);

    return {
      byStatus: statusStats.map(s => ({ label: s._id, value: s.count })),
      byPriority: priorityStats.map(p => ({ label: p._id, value: p.count })),
      trend: ticketTrends.map(t => ({ date: t._id, count: t.count })),
      avgResponseTimeHours: responseTimeStats[0]?.avgResponseTimeHours || 0
    };
  }
}
