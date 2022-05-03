import { ApiProperty } from '@nestjs/swagger';
import { IsIn, IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';

export default class CommentDto {
  @IsString()
  @IsNotEmpty()

  @ApiProperty({
    type: String,
    description: 'Comment'
  })
  comment: string;
}
