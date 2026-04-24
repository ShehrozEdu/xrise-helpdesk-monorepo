import Groq from 'groq-sdk';
import { env } from '../config/env';
import { Ticket } from '../models/ticket.model';
import { Event } from '../models/event.model';
import { logger } from '../config/logger';

const groq = env.GROQ_API_KEY ? new Groq({ apiKey: env.GROQ_API_KEY }) : null;

export class AiService {
  static async generateDraftReply(ticketId: string) {
    if (!groq) {
      return 'GROQ_API_KEY is not configured. AI draft generation is disabled.';
    }

    const ticket = await Ticket.findById(ticketId);
    if (!ticket) throw { statusCode: 404, message: 'Ticket not found' };

    const events = await Event.find({ ticketId: ticket.ticketId, type: 'reply' }).sort({ createdAt: 1 });

    let prompt = `You are a helpful customer support agent.
Customer Issue:
Subject: ${ticket.subject}
Body: ${ticket.body}

Conversation history:
`;
    events.forEach((e) => {
      prompt += `${e.createdBy ? 'Agent' : 'Customer'}: ${e.message}\n`;
    });

    prompt += `
Please draft a professional, empathetic, and concise reply to the customer. 
Do not include placeholders like "[Your Name]", just provide the reply text itself.`;

    try {
      const chatCompletion = await groq.chat.completions.create({
        messages: [{ role: 'user', content: prompt }],
        model: 'llama-3.1-8b-instant',
        temperature: 0.7,
        max_tokens: 512,
      });

      return chatCompletion.choices[0]?.message?.content || 'Failed to generate draft.';
    } catch (error: any) {
      logger.error({ err: error }, 'Groq AI error');
      throw { statusCode: 500, message: 'AI generation failed. Please check your API configuration.' };
    }
  }
}
