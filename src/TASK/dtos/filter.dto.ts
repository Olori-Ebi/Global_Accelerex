import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Gender, Sort, Status } from '../enum/index.enum';

export class FilterDto {
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsEnum(Status)
  status?: Status;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  sortValue?: string;

  @IsOptional()
  @IsEnum(Sort)
  sort?: Sort;
}
