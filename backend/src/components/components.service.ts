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
        key: 'header-school',
        componentName: 'School Header',
        componentType: 'header',
        description: 'Top navigation with school name and short tagline.',
        propsSchema: { title: 'string', subtitle: 'string' },
      },
      {
        key: 'hero-school',
        componentName: 'Hero Banner',
        componentType: 'hero',
        description: 'Main school landing hero with CTA.',
        propsSchema: {
          heading: 'string',
          description: 'string',
          buttonText: 'string',
          buttonUrl: 'string',
        },
      },
      {
        key: 'about-school',
        componentName: 'About Section',
        componentType: 'about',
        description: 'School mission/overview section.',
        propsSchema: {
          title: 'string',
          description: 'string',
        },
      },
      {
        key: 'programs-grid',
        componentName: 'Programs Grid',
        componentType: 'academics',
        description: 'Academic programs or departments list.',
        propsSchema: {
          title: 'string',
          items: 'Array<{name: string, summary: string}>',
        },
      },
      {
        key: 'announcement-list',
        componentName: 'Announcements',
        componentType: 'news',
        description: 'List latest school announcements.',
        propsSchema: {
          title: 'string',
          items: 'Array<{date: string, title: string, content: string}>',
        },
      },
      {
        key: 'cta-admissions',
        componentName: 'Admissions CTA',
        componentType: 'cta',
        description: 'Call-to-action section for admissions.',
        propsSchema: {
          heading: 'string',
          buttonText: 'string',
          buttonUrl: 'string',
        },
      },
      {
        key: 'contact-school',
        componentName: 'Contact Section',
        componentType: 'contact',
        description: 'School address, email and phone information.',
        propsSchema: { address: 'string', email: 'string', phone: 'string' },
      },
      {
        key: 'footer-school',
        componentName: 'Footer',
        componentType: 'footer',
        description: 'Bottom copyright and footer area.',
        propsSchema: { copyrightText: 'string' },
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
