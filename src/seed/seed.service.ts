import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { Role } from '../common/enums/role.enum';

@Injectable()
export class SeedService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async seedUsers() {
    const existingUsers = await this.userRepository.count();
    if (existingUsers > 0) {
      console.log('Dữ liệu người dùng đã tồn tại, bỏ qua seeding');
      return;
    }

    const users = [
      {
        email: 'admin@company.com',
        password: await bcrypt.hash('admin123', 12),
        fullName: 'Quản trị viên hệ thống',
        role: Role.ADMIN,
        phone: '0901234567',
        isActive: true,
      },
      {
        email: 'director@company.com',
        password: await bcrypt.hash('director123', 12),
        fullName: 'Nguyễn Văn Giám Đốc',
        role: Role.DIRECTOR,
        phone: '0901234568',
        isActive: true,
      },
      {
        email: 'manager@company.com',
        password: await bcrypt.hash('manager123', 12),
        fullName: 'Trần Thị Trưởng Phòng',
        role: Role.MANAGER,
        phone: '0901234569',
        isActive: true,
      },
      {
        email: 'employee@company.com',
        password: await bcrypt.hash('employee123', 12),
        fullName: 'Lê Văn Nhân Viên',
        role: Role.EMPLOYEE,
        phone: '0901234570',
        isActive: true,
      },
    ];

    for (const userData of users) {
      const user = this.userRepository.create(userData);
      await this.userRepository.save(user);
      console.log(`Đã tạo tài khoản: ${userData.email} - ${userData.role}`);
    }

    console.log('Seeding hoàn tất!');
    console.log('Thông tin đăng nhập:');
    console.log('Admin: admin@company.com / admin123');
    console.log('Giám đốc: director@company.com / director123');
    console.log('Trưởng phòng: manager@company.com / manager123');
    console.log('Nhân viên: employee@company.com / employee123');
  }

  async resetAndSeedUsers() {
    // Xóa tất cả users
    await this.userRepository.clear();
    console.log('Đã xóa tất cả users');
    
    // Seed lại users
    await this.seedUsers();
  }
}