import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsIn, IsInt, IsNotEmpty, IsNumber, IsString } from 'class-validator';
import { Gender, Status } from '../enum/index.enum';

export default class CharacterDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'Character first name'
  })
  firstName: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    description: 'Character last name'
  })
  lastName: string;

  @IsString()
  @IsEnum(Status)
  @IsIn(['DEAD', 'ACTIVE', 'UNKNOWN'])
  @ApiProperty({
    enum: Status,
    description: 'Character status'
  })
  status: Status;

  @IsString()
  @IsEnum(Gender)
  @IsIn(['MALE', 'FEMALE'])
  @ApiProperty({
    enum: Gender,
    description: 'Character gender'
  })
  gender: Gender;
}
