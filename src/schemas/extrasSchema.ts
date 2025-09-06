import * as z from 'zod';

export const extrasSchema = z.object({
    assistance: z.object({
        type: z.enum(['normal', 'gold', 'premium']),
        price: z.number(),
    }).optional(),
    checkedBaggage: z.object({
        selected: z.boolean(),
        weight: z.string(),
        price: z.number(),
    }).optional(),
    meals: z.object({
        selected: z.boolean(),
        price: z.number(),
    }).optional(),
    baggageInsurance: z.object({
        selected: z.boolean(),
        price: z.number(),
    }).optional(),
});

export type ExtrasFormData = z.infer<typeof extrasSchema>;