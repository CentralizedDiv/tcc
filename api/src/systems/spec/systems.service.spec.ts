import { MongooseModule } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import {
  closeInMongodConnection,
  rootMongooseTestModule,
} from 'src/utils/spec-db';
import { System, SystemSchema } from '../entities/system.entity';
import { SystemsService } from '../systems.service';

describe('SystemsService', () => {
  let service: SystemsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        rootMongooseTestModule(),
        MongooseModule.forFeature([
          { name: System.name, schema: SystemSchema },
        ]),
      ],
      providers: [SystemsService],
    }).compile();

    service = module.get<SystemsService>(SystemsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  afterAll(async () => {
    await closeInMongodConnection();
  });
});
