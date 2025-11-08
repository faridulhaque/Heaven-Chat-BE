import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EnvironmentConfigModule } from '../environment-config';
import { EnvironmentConfigService } from '../environment-config';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    EnvironmentConfigModule,
    TypeOrmModule.forRootAsync({
      imports: [EnvironmentConfigModule],
      inject: [EnvironmentConfigService],
      useFactory: (config: EnvironmentConfigService) => {
        let migrationsPath;
        switch (process.env.NODE_ENV) {
          case 'production':
            migrationsPath = '/prod-migrations/*{.ts,.js}';
            break;
          case 'staging':
            migrationsPath = '/staging-migrations/*{.ts,.js}';
            break;
          default:
            migrationsPath = '/migrations/*{.ts,.js}';
        }

        return {
          type: 'postgres',
          url: config.getDbConnectionUrl(),
          migrations: [migrationsPath], // Use dynamic migrations path
          migrationsTableName: '_migrations',
          migrationsRun: true, // Auto-run migrations
          entities: ['dist/**/*.entity{.ts,.js}'],
          synchronize: false,
          logging: false,
          // ssl:true,
          // extra:{
          //   ssl:{
          //     rejectUnauthorized:false
          //   }
          // }
        };
      },
    }),
  ],
})
export class TypeOrmConfigModule {}
