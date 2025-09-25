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
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@Controller('projects')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @Roles(Role.ADMIN, Role.DIRECTOR, Role.MANAGER)
  create(@Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.create(createProjectDto);
  }

  @Get()
  findAll(@Query('managerId') managerId?: string) {
    if (managerId) {
      return this.projectsService.findByManager(+managerId);
    }
    return this.projectsService.findAll();
  }

  @Get('stats')
  @Roles(Role.ADMIN, Role.DIRECTOR, Role.MANAGER)
  getStats() {
    return this.projectsService.getProjectStats();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectsService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.DIRECTOR, Role.MANAGER)
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.update(+id, updateProjectDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.DIRECTOR, Role.MANAGER)
  remove(@Param('id') id: string) {
    return this.projectsService.remove(+id);
  }
}