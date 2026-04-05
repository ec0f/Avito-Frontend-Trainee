export function extractJsonObject(text: string) {
    const start = text.indexOf('{');
    const end = text.lastIndexOf('}');

    if (start === -1 || end === -1 || end <= start) {
        throw new Error('Model did not return JSON');
    }

    const raw = text.slice(start, end + 1);
    return JSON.parse(raw);
}