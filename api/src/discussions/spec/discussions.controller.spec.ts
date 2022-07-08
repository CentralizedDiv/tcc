import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { SystemsModule } from 'src/systems/systems.module';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from 'src/utils/spec-db';
import { DiscussionsController } from '../discussions.controller';
import { DiscussionsService } from '../discussions.service';
import { Discussion, DiscussionSchema } from '../entities/discussion.entity';

describe('DiscussionsController', () => {
  let controller: DiscussionsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          { name: Discussion.name, schema: DiscussionSchema },
        ]),
        SystemsModule,
      ],
      controllers: [DiscussionsController],
      providers: [DiscussionsService],
    }).compile();

    controller = module.get<DiscussionsController>(DiscussionsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });
});
