import { Module } from '@nestjs/common';
import { SystemsService } from './systems.service';
import { SystemsController } from './systems.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { System, SystemSchema } from './entities/system.entity';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: System.name, schema: SystemSchema }]),
  ],
  controllers: [SystemsController],
  providers: [SystemsService],
  exports: [SystemsService],
})
export class SystemsModule {}
