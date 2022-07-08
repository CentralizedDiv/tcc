import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from 'src/utils/spec-db';
import { System, SystemSchema } from '../entities/system.entity';
import { SystemsController } from '../systems.controller';
import { SystemsService } from '../systems.service';

describe('SystemsController', () => {
  let controller: SystemsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          { name: System.name, schema: SystemSchema },
        ]),
      ],
      controllers: [SystemsController],
      providers: [SystemsService],
    }).compile();

    controller = module.get<SystemsController>(SystemsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });
});
