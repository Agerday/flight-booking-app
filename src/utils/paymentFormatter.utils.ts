import {CardType} from "./creditCard.utils";

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