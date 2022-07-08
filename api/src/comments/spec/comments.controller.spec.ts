import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { DiscussionsModule } from 'src/discussions/discussions.module';
import {
  rootMongooseTestModule,
  closeInMongodConnection,
} from 'src/utils/spec-db';
import { CommentsController } from '../comments.controller';
import { CommentsService } from '../comments.service';
import { Comment, CommentSchema } from '../entities/comment.entity';

describe('CommentsController', () => {
  let controller: CommentsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          { name: Comment.name, schema: CommentSchema },
        ]),
        DiscussionsModule,
      ],
      controllers: [CommentsController],
      providers: [CommentsService],
    }).compile();

    controller = module.get<CommentsController>(CommentsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });
});
