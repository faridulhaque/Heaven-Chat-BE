import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserEntity } from 'src/entities/user.entity';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { TLoggers } from 'src/services/enums';
import { ServiceLevelLogger } from 'src/infrastructure';
import { JwtService } from '@nestjs/jwt';

@Module({
  imports: [TypeOrmModule.forFeature([UserEntity])],
  controllers: [AuthController],
  providers: [
    AuthService,

    {
      provide: TLoggers.auth,
      useValue: new ServiceLevelLogger(TLoggers.auth),
    },
    JwtService,
  ],
})
export class AuthModule {}
