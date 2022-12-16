import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DiscussionsModule } from 'src/discussions/discussions.module';
import { CommentsModule } from 'src/comments/comments.module';
import { SystemsModule } from 'src/systems/systems.module';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { JwtAuthGuard } from 'src/auth/guards/jwt/jwt-auth.guard';

const ENV = process.env.NODE_ENV;

@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: `${ENV === 'production' ? '.env.production' : '.env'}`,
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        uri: 'mongodb://admin:xSpP1CxgS%255EjT2D5ZNz@localhost:27017/main',
      }),
      inject: [ConfigService],
    }),
    DiscussionsModule,
    CommentsModule,
    SystemsModule,
    AuthModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
