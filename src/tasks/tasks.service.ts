import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../entities/task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { TaskStatus } from '../common/enums/task-status.enum';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private taskRepository: Repository<Task>,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const taskData: any = {
      ...createTaskDto,
      dueDate: createTaskDto.dueDate ? new Date(createTaskDto.dueDate) : undefined,
      tags: createTaskDto.tags ? JSON.stringify(createTaskDto.tags) : undefined,
    };
    const task = this.taskRepository.create(taskData);
    const savedTask = await this.taskRepository.save(task);
    return Array.isArray(savedTask) ? savedTask[0] : savedTask;
  }

  async findAll(): Promise<Task[]> {
    const tasks = await this.taskRepository.find({
      relations: ['assignee', 'project'],
      order: { createdAt: 'DESC' },
    });

    return tasks.map(task => ({
      ...task,
      tags: task.tags ? JSON.parse(task.tags) : [],
    }));
  }

  async findByAssignee(assigneeId: number): Promise<Task[]> {
    const tasks = await this.taskRepository.find({
      where: { assigneeId },
      relations: ['assignee', 'project'],
      order: { createdAt: 'DESC' },
    });

    return tasks.map(task => ({
      ...task,
      tags: task.tags ? JSON.parse(task.tags) : [],
    }));
  }

  async findByProject(projectId: number): Promise<Task[]> {
    const tasks = await this.taskRepository.find({
      where: { projectId },
      relations: ['assignee', 'project'],
      order: { createdAt: 'DESC' },
    });

    return tasks.map(task => ({
      ...task,
      tags: task.tags ? JSON.parse(task.tags) : [],
    }));
  }

  async findOne(id: number): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: ['assignee', 'project', 'timeEntries'],
    });

    if (!task) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }

    return {
      ...task,
      tags: task.tags ? JSON.parse(task.tags) : [],
    };
  }

  async update(id: number, updateTaskDto: UpdateTaskDto): Promise<Task> {
    await this.taskRepository.update(id, {
      ...updateTaskDto,
      dueDate: updateTaskDto.dueDate ? new Date(updateTaskDto.dueDate) : undefined,
      tags: updateTaskDto.tags ? JSON.stringify(updateTaskDto.tags) : undefined,
    });

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const result = await this.taskRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`Task with ID ${id} not found`);
    }
  }

  async getTaskStats(): Promise<any> {
    const total = await this.taskRepository.count();
    const todo = await this.taskRepository.count({
      where: { status: TaskStatus.TODO },
    });
    const inProgress = await this.taskRepository.count({
      where: { status: TaskStatus.IN_PROGRESS },
    });
    const completed = await this.taskRepository.count({
      where: { status: TaskStatus.COMPLETED },
    });

    return {
      total,
      todo,
      inProgress,
      completed,
    };
  }
}