import { Controller, Get, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { SeedService } from './seed/seed.service';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly seedService: SeedService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('seed')
  async seedDatabase() {
    await this.seedService.seedUsers();
    return { message: 'Database seeded successfully' };
  }

  @Post('seed/reset')
  async resetAndSeedDatabase() {
    await this.seedService.resetAndSeedUsers();
    return { message: 'Database reset and seeded successfully' };
  }
}
