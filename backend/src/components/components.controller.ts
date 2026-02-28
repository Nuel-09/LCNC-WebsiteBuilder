import { Controller, Get, Param, Post } from '@nestjs/common';
import { ComponentsService } from './components.service';

/**
 * Component catalog endpoints.
 * These endpoints feed the frontend builder with reusable blocks.
 */
@Controller('components')
export class ComponentsController {
	constructor(private readonly componentsService: ComponentsService) {}

	/**
	 * Get full component catalog.
	 */
	@Get()
	findAll() {
		return this.componentsService.findAll();
	}

	/**
	 * Get components by category/type.
	 */
	@Get('type/:type')
	findByType(@Param('type') type: string) {
		return this.componentsService.findByType(type);
	}

	/**
	 * Seed starter components for development/demo use.
	 */
	@Post('seed')
	seedDefaults() {
		return this.componentsService.seedDefaults();
	}
}
