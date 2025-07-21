import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateTicketMessageDto {
  @ApiProperty({ example: 'I need help with my order', description: 'Message content' })
  @IsString()
  @IsNotEmpty()
  content: string;
}
