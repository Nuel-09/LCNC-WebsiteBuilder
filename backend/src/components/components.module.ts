import { Module } from '@nestjs/common';
import { ComponentsController } from './components.controller';
import { ComponentsService } from './components.service';

/**
 * Components module:
 * - manages builder component catalog
 * - provides list/filter endpoints for frontend sidebar
 */
@Module({
  controllers: [ComponentsController],
  providers: [ComponentsService],
})
export class ComponentsModule {}
