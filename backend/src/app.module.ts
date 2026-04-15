import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProjectsModule } from './projects/projects.module';
import { ConfigurationsModule } from './configurations/configurations.module';
import { ComponentsModule } from './components/components.module';
import { PrismaModule } from './prisma/prisma.module';
import { AiModule } from './ai/ai.module';

/**
 * Root application module.
 * AI operations become available to the app when AiModule is imported here.
 */
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ProjectsModule,
    ConfigurationsModule,
    ComponentsModule,
    // Registers authenticated AI endpoints and provider wiring.
    AiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
