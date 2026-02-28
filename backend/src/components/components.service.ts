import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ComponentsService {
	constructor(private readonly prisma: PrismaService) {}

	/**
	 * List all builder components.
	 * Frontend uses this to populate the drag-and-drop sidebar.
	 */
	findAll() {
		return this.prisma.builderComponent.findMany({
			orderBy: [{ componentType: 'asc' }, { componentName: 'asc' }],
		});
	}

	/**
	 * Filter component catalog by type (e.g., hero, header, card).
	 */
	findByType(type: string) {
		return this.prisma.builderComponent.findMany({
			where: { componentType: type },
			orderBy: { componentName: 'asc' },
		});
	}

	/**
	 * Inserts starter component definitions used by your no-code builder.
	 * Upsert avoids duplicate rows if seed is called multiple times.
	 */
	async seedDefaults() {
		const defaults = [
			{
				key: 'header-basic',
				componentName: 'Basic Header',
				componentType: 'header',
				description: 'Header with school name and navigation links.',
				propsSchema: { title: 'string', navLinks: 'string[]' },
			},
			{
				key: 'hero-banner',
				componentName: 'Hero Banner',
				componentType: 'hero',
				description: 'Main hero section with title and subtitle.',
				propsSchema: { title: 'string', subtitle: 'string', imageUrl: 'string' },
			},
			{
				key: 'announcement-list',
				componentName: 'Announcements',
				componentType: 'content',
				description: 'List latest school announcements.',
				propsSchema: { heading: 'string', items: 'string[]' },
			},
			{
				key: 'contact-card',
				componentName: 'Contact Card',
				componentType: 'footer',
				description: 'School address, email and phone information.',
				propsSchema: { address: 'string', email: 'string', phone: 'string' },
			},
		];

		await Promise.all(
			defaults.map((component) =>
				this.prisma.builderComponent.upsert({
					where: { key: component.key },
					create: component,
					update: {
						componentName: component.componentName,
						componentType: component.componentType,
						description: component.description,
						propsSchema: component.propsSchema,
					},
				}),
			),
		);

		return this.findAll();
	}
}
