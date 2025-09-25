import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@Controller('tasks')
@UseGuards(JwtAuthGuard, RolesGuard)
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @Post()
  create(@Body() createTaskDto: CreateTaskDto) {
    return this.tasksService.create(createTaskDto);
  }

  @Get()
  findAll(@Query('assigneeId') assigneeId?: string, @Query('projectId') projectId?: string) {
    if (assigneeId) {
      return this.tasksService.findByAssignee(+assigneeId);
    }
    if (projectId) {
      return this.tasksService.findByProject(+projectId);
    }
    return this.tasksService.findAll();
  }

  @Get('stats')
  @Roles(Role.ADMIN, Role.DIRECTOR, Role.MANAGER)
  getStats() {
    return this.tasksService.getTaskStats();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTaskDto: UpdateTaskDto) {
    return this.tasksService.update(+id, updateTaskDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.DIRECTOR, Role.MANAGER)
  remove(@Param('id') id: string) {
    return this.tasksService.remove(+id);
  }
}