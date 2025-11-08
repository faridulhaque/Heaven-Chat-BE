// typeorm.config.ts
import { DataSource } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { config } from 'dotenv';

const envFilePath = (() => {
  switch (process.env.NODE_ENV) {
    case 'production':
      return './env/.prod.env';
    case 'staging':
      return './env/.staging.env';
    default:
      return './env/.local.env';
  }
})();
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

console.log(process.env.NODE_ENV);
console.log('envFilePath: ', envFilePath);

config({ path: envFilePath });
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
