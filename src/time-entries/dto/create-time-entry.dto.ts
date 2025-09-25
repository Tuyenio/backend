import { IsDateString, IsOptional, IsNumber, IsString } from 'class-validator';

export class CreateTimeEntryDto {
  @IsDateString()
  startTime: string;

  @IsOptional()
  @IsDateString()
  endTime?: string;

  @IsNumber()
  hours: number;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  date: string;

  @IsNumber()
  userId: number;

  @IsOptional()
  @IsNumber()
  taskId?: number;
}