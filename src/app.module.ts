import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import {
  EnvironmentConfigModule,
  ServiceLevelLogger,
  TypeOrmConfigModule,
} from './infrastructure';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from './entities/user.entity';
import { TLoggers } from './services/enums';

@Module({
  imports: [
    TypeOrmConfigModule,
    TypeOrmModule.forFeature([UserEntity]),
    AuthModule,
    ChatModule,
    EnvironmentConfigModule,
    JwtModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,

    {
      provide: TLoggers.app,
      useValue: new ServiceLevelLogger(TLoggers.app),
    },
  ],
})
export class AppModule {}
