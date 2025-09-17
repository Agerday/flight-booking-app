import { CardType } from "./creditCard.utils";

export const formatCardNumber = (value: string, cardType?: CardType | null): string => {
    const cleaned = value.replace(/\D/g, '');

    if (cardType === 'amex') {
        const part1 = cleaned.slice(0, 4);
        const part2 = cleaned.slice(4, 10);
        const part3 = cleaned.slice(10, 15);
        return [part1, part2, part3].filter(Boolean).join(' ');
    }

    return cleaned.match(/.{1,4}/g)?.join(' ') || '';
};

export const formatExpiryDate = (value: string): string => {
    let val = value.replace(/[^\d]/g, '').slice(0, 4);
    if (val.length > 2) {
        val = val.slice(0, 2) + '/' + val.slice(2);
    }
    return val;
};

export const formatCVV = (value: string, cardType?: CardType | null): string => {
    const maxLength = cardType === 'amex' ? 4 : 3;
    return value.replace(/\D/g, '').slice(0, maxLength);
};