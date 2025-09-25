import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { TimeEntry } from '../entities/time-entry.entity';
import { CreateTimeEntryDto } from './dto/create-time-entry.dto';
import { UpdateTimeEntryDto } from './dto/update-time-entry.dto';

@Injectable()
export class TimeEntriesService {
  constructor(
    @InjectRepository(TimeEntry)
    private timeEntryRepository: Repository<TimeEntry>,
  ) {}

  async create(createTimeEntryDto: CreateTimeEntryDto): Promise<TimeEntry> {
    const timeEntryData: any = {
      ...createTimeEntryDto,
      startTime: new Date(createTimeEntryDto.startTime),
      endTime: createTimeEntryDto.endTime ? new Date(createTimeEntryDto.endTime) : undefined,
      date: new Date(createTimeEntryDto.date),
    };
    const timeEntry = this.timeEntryRepository.create(timeEntryData);
    const savedTimeEntry = await this.timeEntryRepository.save(timeEntry);
    return Array.isArray(savedTimeEntry) ? savedTimeEntry[0] : savedTimeEntry;
  }

  async findAll(): Promise<TimeEntry[]> {
    return await this.timeEntryRepository.find({
      relations: ['user', 'task'],
      order: { date: 'DESC', startTime: 'DESC' },
    });
  }

  async findByUser(userId: number): Promise<TimeEntry[]> {
    return await this.timeEntryRepository.find({
      where: { userId },
      relations: ['user', 'task'],
      order: { date: 'DESC', startTime: 'DESC' },
    });
  }

  async findByUserAndDateRange(userId: number, startDate: string, endDate: string): Promise<TimeEntry[]> {
    return await this.timeEntryRepository.find({
      where: {
        userId,
        date: Between(new Date(startDate), new Date(endDate)),
      },
      relations: ['user', 'task'],
      order: { date: 'DESC', startTime: 'DESC' },
    });
  }

  async findOne(id: number): Promise<TimeEntry> {
    const timeEntry = await this.timeEntryRepository.findOne({
      where: { id },
      relations: ['user', 'task'],
    });

    if (!timeEntry) {
      throw new NotFoundException(`Time entry with ID ${id} not found`);
    }

    return timeEntry;
  }

  async update(id: number, updateTimeEntryDto: UpdateTimeEntryDto): Promise<TimeEntry> {
    await this.timeEntryRepository.update(id, {
      ...updateTimeEntryDto,
      startTime: updateTimeEntryDto.startTime ? new Date(updateTimeEntryDto.startTime) : undefined,
      endTime: updateTimeEntryDto.endTime ? new Date(updateTimeEntryDto.endTime) : undefined,
      date: updateTimeEntryDto.date ? new Date(updateTimeEntryDto.date) : undefined,
    });

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.timeEntryRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Time entry with ID ${id} not found`);
    }
  }

  async getUserTimeStats(userId: number, startDate?: string, endDate?: string): Promise<any> {
    const whereCondition: any = { userId };
    
    if (startDate && endDate) {
      whereCondition.date = Between(new Date(startDate), new Date(endDate));
    }

    const timeEntries = await this.timeEntryRepository.find({
      where: whereCondition,
    });

    const totalHours = timeEntries.reduce((sum, entry) => sum + Number(entry.hours), 0);
    const totalEntries = timeEntries.length;
    
    return {
      totalHours,
      totalEntries,
      averageHoursPerDay: totalEntries > 0 ? totalHours / totalEntries : 0,
    };
  }
}