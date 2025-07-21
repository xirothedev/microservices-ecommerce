export class Ticket {
  id: string;
  numericalOrder: number;
  createAt: Date;
  updateAt: Date;
  title: string;
  description: string;
  status: string;
  category: string;
  priority: string;
  referenceContext?: string;
  images?: string[];
  authorId: string;
  assignedId: string;
  // messages: TicketMessage[]; // Add when TicketMessage entity is defined
}
