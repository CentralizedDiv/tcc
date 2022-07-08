import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { DiscussionsModule } from 'src/discussions/discussions.module';
import {
  rootMongooseTestModule,
  closeInMongodConnection,
} from 'src/utils/spec-db';
import { CommentsService } from '../comments.service';
import { Comment, CommentSchema } from '../entities/comment.entity';

describe('CommentsService', () => {
  let service: CommentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          { name: Comment.name, schema: CommentSchema },
        ]),
        DiscussionsModule,
      ],
      providers: [CommentsService],
    }).compile();

    service = module.get<CommentsService>(CommentsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });
});
