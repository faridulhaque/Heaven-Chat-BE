// typeorm.config.ts
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

const migrations_path = (() => {
  switch (process.env.NODE_ENV) {
    case 'production':
      return 'prod-migrations';
    case 'staging':
      return 'staging-migrations';
    default:
      return 'migrations';
  }
})();

config({ path: '.env' });
const configService = new ConfigService();
export default new DataSource({
  type: 'postgres',
  url: configService.get<string>('DB_CONNECTION_URL'),
  entities: ['dist/**/*.entity{.ts,.js}'],
  migrations: [`dist/${migrations_path}/*.js`],
  // ssl:true,
  // extra:{
  //   ssl:{
  //     rejectUnauthorized:false
  //   }
  // }
});
