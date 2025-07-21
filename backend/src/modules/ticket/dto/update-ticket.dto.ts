import { PartialType } from '@nestjs/mapped-types';
import { CreateTicketDto } from './create-ticket.dto';
import { TicketStatus } from '@prisma/generated';
import { IsEnum, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateTicketDto extends PartialType(CreateTicketDto) {
  @ApiPropertyOptional({ enum: TicketStatus, description: 'Ticket status' })
  @IsEnum(TicketStatus)
  @IsOptional()
  status?: TicketStatus;
}
