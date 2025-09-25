import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Skill } from '../entities/skill.entity';
import { CreateSkillDto } from './dto/create-skill.dto';
import { UpdateSkillDto } from './dto/update-skill.dto';

@Injectable()
export class SkillsService {
  constructor(
    @InjectRepository(Skill)
    private skillRepository: Repository<Skill>,
  ) {}

  async create(createSkillDto: CreateSkillDto): Promise<Skill> {
    const skillData: any = {
      ...createSkillDto,
      targetDate: createSkillDto.targetDate ? new Date(createSkillDto.targetDate) : undefined,
    };
    const skill = this.skillRepository.create(skillData);
    const savedSkill = await this.skillRepository.save(skill);
    return Array.isArray(savedSkill) ? savedSkill[0] : savedSkill;
  }

  async findByUser(userId: number): Promise<Skill[]> {
    return await this.skillRepository.find({
      where: { userId },
      relations: ['user'],
      order: { category: 'ASC', name: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Skill> {
    const skill = await this.skillRepository.findOne({
      where: { id },
      relations: ['user'],
    });

    if (!skill) {
      throw new NotFoundException(`Skill with ID ${id} not found`);
    }

    return skill;
  }

  async update(id: number, updateSkillDto: UpdateSkillDto): Promise<Skill> {
    const updateData: any = {
      ...updateSkillDto,
      targetDate: updateSkillDto.targetDate ? new Date(updateSkillDto.targetDate) : undefined,
    };
    await this.skillRepository.update(id, updateData);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.skillRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Skill with ID ${id} not found`);
    }
  }
}