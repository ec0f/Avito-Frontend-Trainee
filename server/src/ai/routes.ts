import type { FastifyPluginAsync, FastifyReply, FastifyRequest, RouteGenericInterface } from 'fastify';
import { askGigaChat } from './gigachatClient';
import { buildDescriptionMessages, buildPriceMessages } from './prompts';
import { extractJsonObject } from './utils';
import type { AiAnnouncementContext } from './types';

interface DescriptionRoute extends RouteGenericInterface {
    Body: AiAnnouncementContext;
}

interface PriceRoute extends RouteGenericInterface {
    Body: AiAnnouncementContext;
}

function normalizeError(error: unknown) {
    if (error instanceof Error) {
        return {
            message: error.message,
            stack: error.stack,
        };
    }

    if (typeof error === 'object' && error !== null) {
        return JSON.parse(JSON.stringify(error));
    }

    return { message: String(error) };
}

export const aiRoutes: FastifyPluginAsync = async (fastify) => {
    fastify.post(
        '/ai/description',
        async (
            request: FastifyRequest<DescriptionRoute>,
            reply: FastifyReply
        ) => {
            try {
                const text = await askGigaChat(buildDescriptionMessages(request.body));
                const parsed = extractJsonObject(text);

                return {
                    title: String(parsed.title ?? 'Ответ AI:'),
                    text: String(parsed.text ?? ''),
                    applyValue: String(parsed.applyValue ?? ''),
                };
            } catch (error) {
                const normalized = normalizeError(error);
                request.log.error({ error: normalized }, 'AI description request failed');

                reply.status(500).send({
                    error: normalized.message ?? 'AI description request failed',
                    details: normalized,
                });
            }
        }
    );

    fastify.post(
        '/ai/price',
        async (
            request: FastifyRequest<PriceRoute>,
            reply: FastifyReply
        ) => {
            try {
                const text = await askGigaChat(buildPriceMessages(request.body));
                const parsed = extractJsonObject(text);

                return {
                    title: String(parsed.title ?? 'Ответ AI:'),
                    text: String(parsed.text ?? ''),
                    applyValue: Number(parsed.applyValue),
                };
            } catch (error) {
                const normalized = normalizeError(error);
                request.log.error({ error: normalized }, 'AI price request failed');

                reply.status(500).send({
                    error: normalized.message ?? 'AI price request failed',
                    details: normalized,
                });
            }
        }
    );
};