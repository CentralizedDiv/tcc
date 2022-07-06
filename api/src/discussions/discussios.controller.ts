import { Body, Controller, Get, Post } from '@nestjs/common';
import { DiscussionsService } from './discussions.service';
import { CreateDiscussionDTO } from './dto/create-discussion.dto';
import { Discussion } from './discussion.schema';

@Controller('discussions')
export class DiscussionsController {
  constructor(private readonly discussionsService: DiscussionsService) {}

  @Post()
  async create(@Body() creatediscussionDTO: CreateDiscussionDTO) {
    await this.discussionsService.create(creatediscussionDTO);
  }

  @Get()
  async findAll(): Promise<Discussion[]> {
    return this.discussionsService.findAll();
  }
}
