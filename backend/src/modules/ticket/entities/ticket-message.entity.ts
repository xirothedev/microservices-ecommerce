export class TicketMessage {
  id: string;
  content: string;
  isRead: boolean;
  createdAt: Date;
  updatedAt: Date;
  ticketId: string;
  senderId: string;
  attachments?: string[];
}
