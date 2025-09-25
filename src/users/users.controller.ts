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
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/enums/role.enum';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(Role.ADMIN, Role.DIRECTOR)
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  @Roles(Role.ADMIN, Role.DIRECTOR, Role.MANAGER)
  findAll(
    @Query('role') role?: Role,
    @Query('departmentId') departmentId?: string,
  ) {
    if (role) {
      return this.usersService.findByRole(role);
    }
    if (departmentId) {
      return this.usersService.findByDepartment(+departmentId);
    }
    return this.usersService.findAll();
  }

  @Get('stats')
  @Roles(Role.ADMIN, Role.DIRECTOR)
  getStats() {
    return this.usersService.getUserStats();
  }

  @Get(':id')
  @Roles(Role.ADMIN, Role.DIRECTOR, Role.MANAGER)
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(+id);
  }

  @Patch(':id')
  @Roles(Role.ADMIN, Role.DIRECTOR)
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  @Roles(Role.ADMIN, Role.DIRECTOR)
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}