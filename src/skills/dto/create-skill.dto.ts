import { IsString, IsOptional, IsEnum, IsNumber, IsDateString } from 'class-validator';
import { SkillLevel } from '../../common/enums/skill-level.enum';

export class CreateSkillDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  category: string;

  @IsOptional()
  @IsEnum(SkillLevel)
  level?: SkillLevel;

  @IsOptional()
  @IsNumber()
  progress?: number;

  @IsOptional()
  @IsDateString()
  targetDate?: string;

  @IsNumber()
  userId: number;
}