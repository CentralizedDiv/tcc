import { IsNotEmpty, IsObject, IsString } from 'class-validator';

export class CreateDiscussionDto {
  @IsNotEmpty()
  @IsString()
  system: string;

  @IsString()
  label: string | null;

  @IsString()
  description: string | null;

  @IsObject()
  extra: {
    [key: string]: any;
  };
}
