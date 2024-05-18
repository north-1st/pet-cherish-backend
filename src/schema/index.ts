import { OpenAPIRegistry, OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import { baseSchema, orderBodySchema } from '@schema/orders';

// Generate Swagger Definitions
const registry = new OpenAPIRegistry();
registry.register('Orders', orderBodySchema);
registry.register('Base', baseSchema);

const generator = new OpenApiGeneratorV3(registry.definitions);
export const openAPIComponents = generator.generateComponents();
