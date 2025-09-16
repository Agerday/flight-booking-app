import { CardType } from "./creditCard.utils";

export const formatCVV = (value: string, cardType?: CardType | null): string => {
    const maxLength = cardType === 'amex' ? 4 : 3;
    return value.replace(/\D/g, '').slice(0, maxLength);
};