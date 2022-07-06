import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { DiscussionsService } from './discussions.service';
import { Discussion, DiscussionSchema } from './discussion.schema';
import { DiscussionsController } from './discussios.controller';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Discussion.name, schema: DiscussionSchema },
    ]),
  ],
  controllers: [DiscussionsController],
  providers: [DiscussionsService],
})
export class DiscussionsModule {}
