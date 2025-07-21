import { IsEnum, IsNumber, IsOptional, IsString } from 'class-validator';
import { TicketCategory, TicketPriority, TicketStatus } from '@prisma/generated';

export class FindAllTicketDto {
  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsString()
  cursor?: string;

  @IsOptional()
  @IsEnum(TicketCategory)
  category?: TicketCategory;

  @IsOptional()
  @IsEnum(TicketPriority)
  priority?: TicketPriority;

  @IsOptional()
  @IsEnum(TicketStatus)
  status?: TicketStatus;

  @IsOptional()
  @IsString()
  search?: string;
}
