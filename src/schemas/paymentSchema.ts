import * as z from 'zod';
import { type CardType, validateCardNumber, isValidExpiryDate } from '../utils/creditCard.utils';

export const createPaymentSchema = (cardType: CardType | null) => z.object({
    cardName: z.string()
        .min(1, 'Cardholder name is required')
        .min(2, 'Name must be at least 2 characters')
        .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),

    cardNumber: z.string()
        .min(1, 'Card number is required')
        .refine(
            (value) => validateCardNumber(value.replace(/\s/g, '')),
            'Invalid card number'
        ),

    expirationDate: z.string()
        .min(1, 'Expiration date is required')
        .regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Invalid date format (MM/YY)')
        .refine((value) => isValidExpiryDate(value), 'Card has expired or invalid date'),

    cvv: z.string()
        .min(1, 'CVV is required')
        .refine(
            (value) => {
                const expectedLength = cardType === 'amex' ? 4 : 3;
                return value.length === expectedLength;
            },
            cardType === 'amex' ? 'CID must be 4 digits' : 'CVV must be 3 digits'
        ),
});

export type PaymentFormData = z.infer<ReturnType<typeof createPaymentSchema>>;