export interface AiAnnouncementContext {
    category: string;
    title: string;
    price: number | null;
    description: string;
    params: Record<string, string>;
    missingFields: string[];
}