import { z } from 'zod';

const NonEmptyString = z.string().trim().min(1);
const NonNegativeNumber = z.number().nonnegative();

export const ElectronicsParamsSchema = z.object({
    type: z.enum(['phone', 'laptop', 'misc']),
    brand: NonEmptyString,
    model: NonEmptyString,
    condition: z.enum(['new', 'used']),
    color: NonEmptyString,
});

export const AutoParamsSchema = z.object({
    brand: NonEmptyString,
    model: NonEmptyString,
    yearOfManufacture: z.number().int().min(1900).max(2100),
    transmission: z.enum(['automatic', 'manual']),
    mileage: z.number().int().nonnegative(),
    enginePower: z.number().int().nonnegative(),
});

export const RealEstateParamsSchema = z.object({
    type: z.enum(['flat', 'house', 'room']),
    address: NonEmptyString,
    area: z.number().positive(),
    floor: z.number().int().nonnegative(),
});

const ElectronicsUpdateSchema = z.object({
    category: z.literal('electronics'),
    title: NonEmptyString,
    description: z.string().trim().default(''),
    price: NonNegativeNumber,
    params: ElectronicsParamsSchema.partial().default({}),
});

const AutoUpdateSchema = z.object({
    category: z.literal('auto'),
    title: NonEmptyString,
    description: z.string().trim().default(''),
    price: NonNegativeNumber,
    params: AutoParamsSchema.partial().default({}),
});

const RealEstateUpdateSchema = z.object({
    category: z.literal('real_estate'),
    title: NonEmptyString,
    description: z.string().trim().default(''),
    price: NonNegativeNumber,
    params: RealEstateParamsSchema.partial().default({}),
});

export const ItemUpdateInSchema = z.discriminatedUnion('category', [
    ElectronicsUpdateSchema,
    AutoUpdateSchema,
    RealEstateUpdateSchema,
]);

export const ItemsGetInQuerySchema = z.object({
    q: z.string().default(''),
    limit: z.coerce.number().int().positive().max(100).default(10),
    skip: z.coerce.number().int().min(0).default(0),
    categories: z
        .string()
        .optional()
        .transform((value: string | undefined) => {
            if (!value) {
                return undefined;
            }

            return value
                .split(',')
                .map((item) => item.trim())
                .filter(Boolean) as Array<'auto' | 'real_estate' | 'electronics'>;
        }),
    needsRevision: z
        .enum(['true', 'false'])
        .optional()
        .transform((value: 'true' | 'false' | undefined) => {
            if (value === undefined) {
                return undefined;
            }

            return value === 'true';
        }),
    sortColumn: z.enum(['title', 'createdAt']).optional(),
    sortDirection: z.enum(['asc', 'desc']).optional(),
});