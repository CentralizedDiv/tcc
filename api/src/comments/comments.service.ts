import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DiscussionsService } from 'src/discussions/discussions.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment, CommentDocument } from './entities/comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name)
    private CommentModel: Model<CommentDocument>,
    private discussionService: DiscussionsService,
  ) {}

  async create(createCommentDto: CreateCommentDto) {
    const createdComment = new this.CommentModel(createCommentDto);

    const discussion = await this.discussionService.findOne(
      createdComment.discussionId,
    );
    if (!discussion) {
      throw new HttpException(
        `Discussion ${createdComment.discussionId} not found!`,
        HttpStatus.NOT_FOUND,
      );
    }

    createdComment.system = discussion.system;
    return createdComment.save();
  }

  createBatch(createCommentDto: CreateCommentDto[]) {
    const operations = createCommentDto.map(async (dto, index) => {
      try {
        const response = await this.create(dto);
        return response;
      } catch (e) {
        return Promise.resolve(
          `Document ${index} not created: ${e.response ?? e}`,
        );
      }
    });
    return Promise.all(operations);
  }

  async findAll(offset = 0, limit?: number) {
    const query = this.CommentModel.find().sort({ _id: -1 }).skip(offset);

    if (limit) {
      query.limit(limit);
    }
    const results = await query.exec();
    const count = await this.CommentModel.count();
    return Promise.resolve({
      results,
      pageCount: limit ? Math.ceil(count / limit) : 1,
    });
  }

  findOne(id: string) {
    return this.CommentModel.findOne({ id }).exec();
  }

  update(id: string, updateCommentDto: UpdateCommentDto) {
    return this.CommentModel.findOneAndUpdate({ id }, updateCommentDto, {
      new: true,
    });
  }

  remove(id: string) {
    return this.CommentModel.deleteOne({ id }).exec();
  }
}
