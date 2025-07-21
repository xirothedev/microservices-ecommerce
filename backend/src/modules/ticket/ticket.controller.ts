import { MediasInterceptor } from '@/common/interceptors/media.interceptor';
import { Body, Controller, Get, Param, Post, Put, Query, Req, UseInterceptors } from '@nestjs/common';
import { Request } from 'express';
import { CreateTicketMessageDto } from './dto/create-ticket-message.dto';
import { CreateTicketDto } from './dto/create-ticket.dto';
import { FindAllTicketDto } from './dto/find-all-ticket.dto';
import { UpdateTicketDto } from './dto/update-ticket.dto';
import { TicketService } from './ticket.service';
import { ApiTags, ApiOperation, ApiBody, ApiParam, ApiQuery } from '@nestjs/swagger';

@ApiTags('Ticket')
@Controller('ticket')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new ticket' })
  @ApiBody({ type: CreateTicketDto })
  @UseInterceptors(MediasInterceptor('attachments'))
  create(@Req() req: Request, @Body() body: CreateTicketDto, attachments: Express.Multer.File[]) {
    return this.ticketService.create(req, body, attachments);
  }

  @Get()
  @ApiOperation({ summary: 'Get all tickets with filters and pagination' })
  @ApiQuery({ name: 'page', required: false })
  @ApiQuery({ name: 'limit', required: false })
  @ApiQuery({ name: 'cursor', required: false })
  @ApiQuery({ name: 'category', required: false })
  @ApiQuery({ name: 'priority', required: false })
  @ApiQuery({ name: 'status', required: false })
  @ApiQuery({ name: 'search', required: false })
  findAll(@Req() req: Request, @Query() query: FindAllTicketDto) {
    return this.ticketService.findAll(req, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get ticket detail by id' })
  @ApiParam({ name: 'id', required: true })
  findOne(@Param('id') id: string) {
    return this.ticketService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update a ticket (author: all fields, assigned: status only)' })
  @ApiParam({ name: 'id', required: true })
  @ApiBody({ type: UpdateTicketDto })
  update(@Req() req: Request, @Param('id') id: string, @Body() body: UpdateTicketDto) {
    return this.ticketService.update(req, id, body);
  }

  @Post(':id/message')
  @ApiOperation({ summary: 'Create a new message for a ticket' })
  @ApiParam({ name: 'id', required: true })
  @ApiBody({ type: CreateTicketMessageDto })
  @UseInterceptors(MediasInterceptor('attachments'))
  createMessage(
    @Req() req: Request,
    @Param('id') ticketId: string,
    @Body() body: CreateTicketMessageDto,
    attachments: Express.Multer.File[],
  ) {
    return this.ticketService.createMessage(req, ticketId, body, attachments);
  }
}
