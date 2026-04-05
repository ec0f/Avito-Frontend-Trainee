export type ItemCategory = 'auto' | 'real_estate' | 'electronics';

export interface Item {
    id: number;
    category: ItemCategory;
    title: string;
    description?: string;
    price: number;
    createdAt: string;
    updatedAt: string;
    params: Record<string, unknown>;
}