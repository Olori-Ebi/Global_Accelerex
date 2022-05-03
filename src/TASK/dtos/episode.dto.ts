import { ApiProperty } from '@nestjs/swagger';
import { IsDate, IsIn, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export default class EpisodeDto {
  @IsString()
  @IsNotEmpty({
    message: 'Episode name must not be empty.',
  })

  @ApiProperty({
    type: String,
    description: 'Episode name'
  })
  name: string;

  @IsString()
  @IsNotEmpty()

  @ApiProperty({
    type: String,
    description: 'Episode code'
  })
  episodeCode: string;

  @IsDate()
  @IsNotEmpty()
  @ApiProperty({
    type: Date,
    description: 'Episode release date'
  })
  releaseDate: Date;
}
