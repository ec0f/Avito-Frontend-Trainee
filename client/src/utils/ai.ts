export type AiSuggestionKind = 'description' | 'price';

export interface AiAnnouncementContext {
  category: string;
  title: string;
  price: number | null;
  description: string;
  params: Record<string, string>;
  missingFields: string[];
}

export interface AiSuggestion {
  kind: AiSuggestionKind;
  title: string;
  text: string;
  applyValue: string | number;
}

const AI_ENDPOINT = (process.env.REACT_APP_AI_ENDPOINT ?? '').replace(/\/$/, '');

function ensureAiEndpoint() {
  if (!AI_ENDPOINT) {
    throw new Error(
      'AI endpoint не настроен. Проверь REACT_APP_AI_ENDPOINT и перезапусти клиент.'
    );
  }
}

async function postJson<T>(path: string, payload: AiAnnouncementContext): Promise<T> {
  ensureAiEndpoint();

  let response: Response;

  try {
    response = await fetch(`${AI_ENDPOINT}${path}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
  } catch {
    throw new Error(
      'Не удалось подключиться к AI-сервису. Проверь, что сервер запущен и REACT_APP_AI_ENDPOINT указан правильно.'
    );
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = data?.error || data?.details?.message || 'AI-сервис вернул ошибку';

    throw new Error(String(message));
  }

  return data as T;
}

export async function requestAiDescription(
  context: AiAnnouncementContext
): Promise<AiSuggestion> {
  const data = await postJson<{
    title: string;
    text: string;
    applyValue: string;
  }>('/description', context);

  return {
    kind: 'description',
    title: data.title ?? 'Ответ AI:',
    text: data.text ?? '',
    applyValue: data.applyValue ?? '',
  };
}

export async function requestAiPrice(
  context: AiAnnouncementContext
): Promise<AiSuggestion> {
  const data = await postJson<{
    title: string;
    text: string;
    applyValue: number;
  }>('/price', context);

  return {
    kind: 'price',
    title: data.title ?? 'Ответ AI:',
    text: data.text ?? '',
    applyValue: Number(data.applyValue),
  };
}
