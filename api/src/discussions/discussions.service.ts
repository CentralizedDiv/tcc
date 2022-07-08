import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SystemsService } from 'src/systems/systems.service';
import { CreateDiscussionDto } from './dto/create-discussion.dto';
import { UpdateDiscussionDto } from './dto/update-discussion.dto';
import { Discussion, DiscussionDocument } from './entities/discussion.entity';

@Injectable()
export class DiscussionsService {
  constructor(
    @InjectModel(Discussion.name)
    private DiscussionModel: Model<DiscussionDocument>,
    private systemService: SystemsService,
  ) {}

  async create(createDiscussionDto: CreateDiscussionDto) {
    const createdDiscussion = new this.DiscussionModel(createDiscussionDto);

    this.systemService.createIfNotExists(createdDiscussion.system);

    return createdDiscussion.save();
  }

  createBatch(createDiscussionDto: CreateDiscussionDto[]) {
    const operations = createDiscussionDto.map((dto) => {
      return this.create(dto);
    });
    return Promise.all(operations);
  }

  async findAll(offset = 0, limit?: number) {
    const query = this.DiscussionModel.find().sort({ _id: 1 }).skip(offset);

    if (limit) {
      query.limit(limit);
    }
    const results = await query.exec();
    const count = await this.DiscussionModel.count();
    return Promise.resolve({
      results,
      pageCount: limit ? Math.ceil(count / limit) : 1,
    });
  }

  findOne(id: string) {
    return this.DiscussionModel.findOne({ id }).exec();
  }

  update(id: string, updateDiscussionDto: UpdateDiscussionDto) {
    return this.DiscussionModel.findOneAndUpdate({ id }, updateDiscussionDto, {
      new: true,
    });
  }

  remove(id: string) {
    return this.DiscussionModel.deleteOne({ id }).exec();
  }
}
