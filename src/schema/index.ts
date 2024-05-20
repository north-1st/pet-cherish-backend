import { OpenAPIRegistry, OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import { orderBodySchema } from '@schema/orders';
import { reviewBodySchema } from '@schema/task';
import { userBaseSchema } from '@schema/user';

// Generate Swagger Definitions
const registry = new OpenAPIRegistry();
registry.register('Orders', orderBodySchema);
registry.register('Base', userBaseSchema);
registry.register('Reviews', reviewBodySchema);

const generator = new OpenApiGeneratorV3(registry.definitions);
export const openAPIComponents = generator.generateComponents();
