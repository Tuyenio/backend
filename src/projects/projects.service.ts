import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ProjectStatus } from '../common/enums/project-status.enum';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project)
    private projectRepository: Repository<Project>,
  ) {}

  async create(createProjectDto: CreateProjectDto): Promise<Project> {
    const project = this.projectRepository.create({
      ...createProjectDto,
      startDate: new Date(createProjectDto.startDate),
      endDate: new Date(createProjectDto.endDate),
    });
    return await this.projectRepository.save(project);
  }

  async findAll(): Promise<Project[]> {
    return await this.projectRepository.find({
      relations: ['manager', 'tasks'],
      order: { createdAt: 'DESC' },
    });
  }

  async findByManager(managerId: number): Promise<Project[]> {
    return await this.projectRepository.find({
      where: { managerId },
      relations: ['manager', 'tasks'],
      order: { createdAt: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Project> {
    const project = await this.projectRepository.findOne({
      where: { id },
      relations: ['manager', 'tasks', 'tasks.assignee'],
    });

    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }

    return project;
  }

  async update(id: number, updateProjectDto: UpdateProjectDto): Promise<Project> {
    await this.projectRepository.update(id, {
      ...updateProjectDto,
      ...(updateProjectDto.startDate && { startDate: new Date(updateProjectDto.startDate) }),
      ...(updateProjectDto.endDate && { endDate: new Date(updateProjectDto.endDate) }),
    });

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.projectRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Project with ID ${id} not found`);
    }
  }

  async getProjectStats(): Promise<any> {
    const total = await this.projectRepository.count();
    const active = await this.projectRepository.count({
      where: { status: ProjectStatus.IN_PROGRESS },
    });
    const completed = await this.projectRepository.count({
      where: { status: ProjectStatus.COMPLETED },
    });
    const planning = await this.projectRepository.count({
      where: { status: ProjectStatus.PLANNING },
    });

    return {
      total,
      active,
      completed,
      planning,
    };
  }
}