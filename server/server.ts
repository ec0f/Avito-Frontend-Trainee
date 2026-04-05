import 'dotenv/config';
import Fastify, {
    FastifyReply,
    FastifyRequest,
    RouteGenericInterface,
} from 'fastify';
import cors from '@fastify/cors';
import middie from '@fastify/middie';
import fs from 'node:fs';
import path from 'node:path';
import { ZodError, treeifyError } from 'zod';
import type { Item } from './src/types';
import {
    ItemsGetInQuerySchema,
    ItemUpdateInSchema,
} from './src/validation';
import { doesItemNeedRevision } from './src/utils';
import { aiRoutes } from './src/ai/routes';

const ITEMS = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'data', 'items.json'), 'utf-8')
) as Item[];

interface GetItemRoute extends RouteGenericInterface {
    Params: { id: string };
}

interface GetItemsRoute extends RouteGenericInterface {
    Querystring: {
        q?: string;
        limit?: string;
        skip?: string;
        categories?: string;
        needsRevision?: string;
        sortColumn?: string;
        sortDirection?: string;
    };
}

interface UpdateItemRoute extends RouteGenericInterface {
    Params: { id: string };
    Body: unknown;
}

async function bootstrap() {
    const fastify = Fastify({
        logger: true,
    });

    await fastify.register(cors, {
        origin: 'http://localhost:3000',
        methods: ['GET', 'PUT', 'POST', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
    });

    await fastify.register(middie);

    fastify.use((_, __, next) => {
        new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 700)).then(() => next());
    });

    await fastify.register(aiRoutes);

    fastify.get<GetItemRoute>(
        '/items/:id',
        async (
            request: FastifyRequest<GetItemRoute>,
            reply: FastifyReply
        ) => {
            const itemId = Number(request.params.id);

            if (!Number.isFinite(itemId)) {
                reply.status(400).send({
                    success: false,
                    error: 'Item ID path param should be a number',
                });
                return;
            }

            const item = ITEMS.find((currentItem) => currentItem.id === itemId);

            if (!item) {
                reply.status(404).send({
                    success: false,
                    error: "Item with requested id doesn't exist",
                });
                return;
            }

            return {
                ...item,
                needsRevision: doesItemNeedRevision(item),
            };
        }
    );

    fastify.get<GetItemsRoute>(
        '/items',
        async (request: FastifyRequest<GetItemsRoute>) => {
            const {
                q,
                limit,
                skip,
                needsRevision,
                categories,
                sortColumn,
                sortDirection,
            } = ItemsGetInQuerySchema.parse(request.query);

            const filteredItems = ITEMS.filter((item: Item) => {
                return (
                    item.title.toLowerCase().includes(q.toLowerCase()) &&
                    (needsRevision === undefined || doesItemNeedRevision(item) === needsRevision) &&
                    (!categories?.length || categories.some((category) => item.category === category))
                );
            });

            const sortedItems = [...filteredItems].sort((item1: Item, item2: Item) => {
                let comparisonValue = 0;

                if (!sortDirection || !sortColumn) {
                    return comparisonValue;
                }

                if (sortColumn === 'title') {
                    comparisonValue = item1.title.localeCompare(item2.title);
                } else if (sortColumn === 'createdAt') {
                    comparisonValue =
                        new Date(item1.createdAt).valueOf() - new Date(item2.createdAt).valueOf();
                }

                return (sortDirection === 'desc' ? -1 : 1) * comparisonValue;
            });

            return {
                items: sortedItems.slice(skip, skip + limit).map((item: Item) => ({
                    id: item.id,
                    category: item.category,
                    title: item.title,
                    price: item.price,
                    needsRevision: doesItemNeedRevision(item),
                })),
                total: filteredItems.length,
            };
        }
    );

    fastify.put<UpdateItemRoute>(
        '/items/:id',
        async (
            request: FastifyRequest<UpdateItemRoute>,
            reply: FastifyReply
        ) => {
            const itemId = Number(request.params.id);

            if (!Number.isFinite(itemId)) {
                reply.status(400).send({
                    success: false,
                    error: 'Item ID path param should be a number',
                });
                return;
            }

            const itemIndex = ITEMS.findIndex((item: Item) => item.id === itemId);

            if (itemIndex === -1) {
                reply.status(404).send({
                    success: false,
                    error: "Item with requested id doesn't exist",
                });
                return;
            }

            try {
                const parsedData = ItemUpdateInSchema.parse({
                    category: ITEMS[itemIndex].category,
                    ...(request.body as Record<string, unknown>),
                });

                ITEMS[itemIndex] = {
                    id: ITEMS[itemIndex].id,
                    createdAt: ITEMS[itemIndex].createdAt,
                    updatedAt: new Date().toISOString(),
                    ...parsedData,
                } as Item;

                return { success: true };
            } catch (error) {
                if (error instanceof ZodError) {
                    reply.status(400).send({
                        success: false,
                        error: treeifyError(error),
                    });
                    return;
                }

                throw error;
            }
        }
    );

    const parsedPort = Number(process.env.PORT ?? '8080');
    const port = Number.isFinite(parsedPort) && parsedPort > 0 ? parsedPort : 8080;

    await fastify.listen({ port, host: '0.0.0.0' });
    fastify.log.info(`Server is listening on port ${port}`);
}

bootstrap().catch((error) => {
    console.error(error);
    process.exit(1);
});