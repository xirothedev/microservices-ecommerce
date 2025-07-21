import { Ticket } from '@prisma/generated';

export interface TicketMessageResponse {
  id: string;
  content: string;
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  attachments: string[];
  sender: {
    id: string;
    fullname: string;
    email: string;
    avatarUrl: string | null;
  };
}

export interface TicketResponse extends Ticket {}
