import type { Item } from './types';
import {
    AutoParamsSchema,
    ElectronicsParamsSchema,
    RealEstateParamsSchema,
} from './validation';

export function doesItemNeedRevision(item: Item): boolean {
    const hasDescription = typeof item.description === 'string' && item.description.trim().length > 0;

    if (!hasDescription) {
        return true;
    }

    switch (item.category) {
        case 'electronics':
            return !ElectronicsParamsSchema.safeParse(item.params).success;

        case 'auto':
            return !AutoParamsSchema.safeParse(item.params).success;

        case 'real_estate':
            return !RealEstateParamsSchema.safeParse(item.params).success;

        default:
            return true;
    }
}