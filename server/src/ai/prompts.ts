import type { AiAnnouncementContext } from './types';

export function buildDescriptionMessages(ctx: AiAnnouncementContext) {
    return [
        {
            role: 'system' as const,
            content: [
                'Ты — помощник по созданию объявлений для маркетплейса.',
                'Твоя задача: написать краткое, правдоподобное и продающее описание объявления на русском языке.',
                'Не выдумывай факты, которых нет во входных данных.',
                'Если данных мало, опирайся только на то, что дано.',
                'Не используй markdown.',
                'Верни только JSON без пояснений.',
                'Формат JSON:',
                '{',
                '  "title": "Ответ AI:",',
                '  "text": "Короткое объяснение, что улучшено",',
                '  "applyValue": "Готовое описание объявления"',
                '}',
            ].join('\n'),
        },
        {
            role: 'user' as const,
            content: JSON.stringify({
                task: 'generate_description',
                announcement: ctx,
                rules: {
                    minLength: 120,
                    maxLength: 450,
                    tone: 'neutral-selling',
                    language: 'ru',
                },
            }),
        },
    ];
}

export function buildPriceMessages(ctx: AiAnnouncementContext) {
    return [
        {
            role: 'system' as const,
            content: [
                'Ты — помощник по оценке цены объявления.',
                'Оцени разумную стартовую цену размещения в рублях.',
                'Не выдавай вымышленные рыночные факты как истину.',
                'Если данных мало, укажи это в объяснении, но всё равно предложи цену.',
                'Цена должна быть целым числом.',
                'Верни только JSON без пояснений.',
                'Формат JSON:',
                '{',
                '  "title": "Ответ AI:",',
                '  "text": "Краткое объяснение оценки цены",',
                '  "applyValue": 123456',
                '}',
            ].join('\n'),
        },
        {
            role: 'user' as const,
            content: JSON.stringify({
                task: 'estimate_price',
                announcement: ctx,
                rules: {
                    currency: 'RUB',
                    outputInteger: true,
                    language: 'ru',
                },
            }),
        },
    ];
}