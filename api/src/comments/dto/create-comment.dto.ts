import { IsNotEmpty, IsString, IsObject, ValidateIf } from 'class-validator';

export class CreateCommentDto {
  @IsString()
  @IsNotEmpty()
  discussionId: string;

  @IsString({ message: 'date must be string or null' })
  @ValidateIf((_, value) => value !== null)
  date: string | null;

  @IsString()
  content: string | null;

  @IsObject()
  extra: {
    [key: string]: any;
  };
}
