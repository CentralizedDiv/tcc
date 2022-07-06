import { Model } from 'mongoose';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Discussion, DiscussionDocument } from './discussion.schema';
import { CreateDiscussionDTO } from './dto/create-discussion.dto';

@Injectable()
export class DiscussionsService {
  constructor(
    @InjectModel(Discussion.name)
    private DiscussionModel: Model<DiscussionDocument>,
  ) {}

  async create(createDiscussionDTO: CreateDiscussionDTO): Promise<Discussion> {
    const createdDiscussion = new this.DiscussionModel(createDiscussionDTO);
    return createdDiscussion.save();
  }

  async findAll(): Promise<Discussion[]> {
    return this.DiscussionModel.find().exec();
  }
}
