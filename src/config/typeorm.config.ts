import { DataSource } from 'typeorm';
import { User } from '../entities/user.entity';

// Chỉ export duy nhất một instance DataSource
export default new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USERNAME || 'nntuyen',
  password: process.env.DB_PASSWORD || 'nnt',
  database: process.env.DB_NAME || 'qlcv',
  schema: process.env.DB_SCHEMA || 'qlcv',
  entities: [User],
  migrations: ['src/migrations/*{.ts,.js}'],
  migrationsTableName: 'migrations',
});