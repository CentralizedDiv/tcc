import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  ParseArrayPipe,
  Query,
} from '@nestjs/common';
import { PaginationParams } from 'src/utils/pagination';
import { DiscussionsService } from './discussions.service';
import { CreateDiscussionDto } from './dto/create-discussion.dto';
import { UpdateDiscussionDto } from './dto/update-discussion.dto';

@Controller('discussions')
export class DiscussionsController {
  constructor(private readonly discussionsService: DiscussionsService) {}

  @Post()
  create(@Body() createDiscussionDto: CreateDiscussionDto) {
    return this.discussionsService.create(createDiscussionDto);
  }

  @Post('batch')
  createBatch(
    @Body(new ParseArrayPipe({ items: CreateDiscussionDto }))
    createSystemDtos: CreateDiscussionDto[],
  ) {
    return this.discussionsService.createBatch(createSystemDtos);
  }

  @Get()
  findAll(@Query() { offset, limit }: PaginationParams) {
    return this.discussionsService.findAll(offset, limit);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.discussionsService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateDiscussionDto: UpdateDiscussionDto,
  ) {
    return this.discussionsService.update(id, updateDiscussionDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.discussionsService.remove(id);
  }
}
