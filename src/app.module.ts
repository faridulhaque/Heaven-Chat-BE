import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EnvironmentConfigModule, TypeOrmConfigModule } from './infrastructure';
import { AuthModule } from './auth/auth.module';
import { ChatModule } from './chat/chat.module';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmConfigModule,
    AuthModule,
    ChatModule,
    EnvironmentConfigModule,
    JwtModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
