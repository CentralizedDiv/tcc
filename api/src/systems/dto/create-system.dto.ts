import { IsNotEmpty, IsString } from 'class-validator';

export class CreateSystemDto {
  @IsNotEmpty()
  @IsString()
  label: string;
}
