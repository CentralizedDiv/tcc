import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateSystemDto } from './dto/create-system.dto';
import { UpdateSystemDto } from './dto/update-system.dto';
import { System, SystemDocument } from './entities/system.entity';

@Injectable()
export class SystemsService {
  constructor(
    @InjectModel(System.name)
    private SystemModel: Model<SystemDocument>,
  ) {}

  async create(createSystemDto: CreateSystemDto) {
    const createdSystem = new this.SystemModel(createSystemDto);
    const systemWithSameLabel = await this.SystemModel.findOne({
      label: createdSystem.label,
    }).exec();
    if (systemWithSameLabel) {
      throw new HttpException(
        'There is already a system with this label!',
        HttpStatus.CONFLICT,
      );
    }
    return createdSystem.save();
  }

  async createBatch(createSystemDto: CreateSystemDto[]) {
    const operations = createSystemDto.map(async (dto, index) => {
      try {
        const result = await this.create(dto);
        return result;
      } catch (e) {
        return Promise.resolve(
          `Document ${index} not created: ${e.response ?? e}`,
        );
      }
    });
    return Promise.all(operations);
  }

  async findAll(offset = 0, limit?: number) {
    const query = this.SystemModel.find().sort({ _id: -1 }).skip(offset);

    if (limit) {
      query.limit(limit);
    }
    const results = await query.exec();
    const count = await this.SystemModel.count();
    return Promise.resolve({
      results,
      pageCount: limit ? Math.ceil(count / limit) : 1,
    });
  }

  findOne(id: string) {
    return this.SystemModel.findOne({ id }).exec();
  }

  findOneByLabel(label: string) {
    return this.SystemModel.findOne({ label }).exec();
  }

  async createIfNotExists(label: string) {
    const system = await this.findOneByLabel(label);
    if (!system) {
      this.create({ label });
    }
  }

  update(id: string, updateSystemDto: UpdateSystemDto) {
    return this.SystemModel.findOneAndUpdate({ id }, updateSystemDto, {
      new: true,
    });
  }

  remove(id: string) {
    return this.SystemModel.deleteOne({ id }).exec();
  }
}
