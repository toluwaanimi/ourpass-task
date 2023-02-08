import { IsNotEmpty } from 'class-validator';
import { ApiProperty, PartialType } from '@nestjs/swagger';

export class CreatePostDTO {
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsNotEmpty()
  @ApiProperty()
  text: string;

  @IsNotEmpty()
  @ApiProperty()
  categoryId: string;
}

export class UpdatePostDTO extends PartialType(CreatePostDTO) {}
