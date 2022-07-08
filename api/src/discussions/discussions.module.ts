import { Module } from '@nestjs/common';
import { DiscussionsService } from './discussions.service';
import { DiscussionsController } from './discussions.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Discussion, DiscussionSchema } from './entities/discussion.entity';
import { SystemsModule } from 'src/systems/systems.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Discussion.name, schema: DiscussionSchema },
    ]),
    SystemsModule,
  ],
  controllers: [DiscussionsController],
  providers: [DiscussionsService],
  exports: [DiscussionsService],
})
export class DiscussionsModule {}
