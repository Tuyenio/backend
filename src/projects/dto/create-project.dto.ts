import { IsString, IsOptional, IsEnum, IsDateString, IsNumber, IsDecimal } from 'class-validator';
import { ProjectStatus } from '../../common/enums/project-status.enum';
import { ProjectPriority } from '../../common/enums/project-priority.enum';

export class CreateProjectDto {
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @IsOptional()
  @IsEnum(ProjectPriority)
  priority?: ProjectPriority;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsOptional()
  @IsNumber()
  budget?: number;

  @IsOptional()
  @IsString()
  color?: string;

  @IsNumber()
  managerId: number;
}