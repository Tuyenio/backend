
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { SeedModule } from './seed/seed.module';
import { SeedService } from './seed/seed.service';
import { ProjectsModule } from './projects/projects.module';
import { TasksModule } from './tasks/tasks.module';
import { TimeEntriesModule } from './time-entries/time-entries.module';
import { DepartmentsModule } from './departments/departments.module';
import { UsersModule } from './users/users.module';
import { GoalsModule } from './goals/goals.module';
import { NotificationsModule } from './notifications/notifications.module';
import { CalendarEventsModule } from './calendar-events/calendar-events.module';
import { User } from './entities/user.entity';
import { Project } from './entities/project.entity';
import { Task } from './entities/task.entity';
import { TimeEntry } from './entities/time-entry.entity';
import { Department } from './entities/department.entity';
import { Skill } from './entities/skill.entity';
import { Goal } from './entities/goal.entity';
import { Notification } from './entities/notification.entity';
import { CalendarEvent } from './entities/calendar-event.entity';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432', 10),
      username: process.env.DB_USERNAME || 'nntuyen',
      password: process.env.DB_PASSWORD || 'nnt',
      database: process.env.DB_NAME || 'qlcv',
      schema: process.env.DB_SCHEMA || 'qlcv',
      entities: [
        User,
        Project,
        Task,
        TimeEntry,
        Department,
        Skill,
        Goal,
        Notification,
        CalendarEvent,
      ],
      autoLoadEntities: true,
      migrations: [__dirname + '/migrations/*{.ts,.js}'],
      migrationsTableName: 'migrations',
      migrationsRun: true,
      synchronize: false,
    }),
    TypeOrmModule.forFeature([
      User,
      Project,
      Task,
      TimeEntry,
      Department,
      Skill,
      Goal,
      Notification,
      CalendarEvent,
    ]),
    AuthModule,
    SeedModule,
    ProjectsModule,
    TasksModule,
    TimeEntriesModule,
    DepartmentsModule,
    UsersModule,
    GoalsModule,
    NotificationsModule,
    CalendarEventsModule,
  ],
  controllers: [AppController],
  providers: [AppService, SeedService],
})
export class AppModule {}
