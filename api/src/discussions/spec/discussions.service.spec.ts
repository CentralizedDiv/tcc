import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { SystemsModule } from 'src/systems/systems.module';
import {
  rootMongooseTestModule,
  closeInMongodConnection,
} from 'src/utils/spec-db';
import { DiscussionsService } from '../discussions.service';
import { Discussion, DiscussionSchema } from '../entities/discussion.entity';

describe('DiscussionsService', () => {
  let service: DiscussionsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          { name: Discussion.name, schema: DiscussionSchema },
        ]),
        SystemsModule,
      ],
      providers: [DiscussionsService],
    }).compile();

    service = module.get<DiscussionsService>(DiscussionsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });
});
