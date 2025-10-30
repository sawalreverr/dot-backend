import { MinLength } from 'class-validator';

export class CreatePostDto {
  @MinLength(3)
  title: string;

  @MinLength(12)
  description: string;
}
