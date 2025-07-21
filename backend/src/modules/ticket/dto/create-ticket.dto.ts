import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TicketCategory, TicketPriority } from '@prisma/generated';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTicketDto {
  @ApiProperty({ example: 'Cannot login', description: 'Title of the ticket' })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({ example: 'I cannot login with my account...', description: 'Detailed description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ enum: TicketCategory, description: 'Ticket category' })
  @IsEnum(TicketCategory)
  category: TicketCategory;

  @ApiProperty({ enum: TicketPriority, description: 'Ticket priority' })
  @IsEnum(TicketPriority)
  priority: TicketPriority;

  @ApiPropertyOptional({ example: 'order-123', description: 'Reference context (optional)' })
  @IsOptional()
  @IsString()
  referenceContext?: string;
}
