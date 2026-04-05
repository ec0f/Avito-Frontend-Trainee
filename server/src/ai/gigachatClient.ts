import 'dotenv/config';
import GigaChat from 'gigachat';
import { Agent } from 'node:https';

const authKey = process.env.GIGACHAT_AUTH_KEY;
const scope = process.env.GIGACHAT_SCOPE;
const model = process.env.GIGACHAT_MODEL || 'GigaChat';

if (!authKey) {
    throw new Error('GIGACHAT_AUTH_KEY is required');
}

// Для локальной разработки без установленного сертификата.
// Потом лучше перейти на нормальный сертификат Минцифры.
const httpsAgent = new Agent({
    rejectUnauthorized: false,
});

export const gigaClient = new GigaChat({
    credentials: authKey,
    scope,
    model,
    timeout: 120,
    httpsAgent,
});

export async function askGigaChat(
    messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>
) {
    const response = await gigaClient.chat({
        messages,
    });

    const content = response.choices?.[0]?.message?.content;

    if (!content) {
        throw new Error('GigaChat returned empty content');
    }

    return content;
}