export type CardType = 'visa' | 'mastercard' | 'amex' | 'discover';

interface CardPattern {
    type: CardType;
    pattern: RegExp;
    length: number[];
    cvvLength: number[];
}

const CARD_PATTERNS: CardPattern[] = [
    {
        type: 'visa',
        pattern: /^4/,
        length: [16],
        cvvLength: [3]
    },
    {
        type: 'mastercard',
        pattern: /^5[1-5]|^2[2-7]/,
        length: [16],
        cvvLength: [3]
    },
    {
        type: 'amex',
        pattern: /^3[47]/,
        length: [15],
        cvvLength: [4]
    },
    {
        type: 'discover',
        pattern: /^6(?:011|5)/,
        length: [16],
        cvvLength: [3]
    }
];

export const detectCardType = (cardNumber: string): CardType | null => {
    const cleaned = cardNumber.replace(/\D/g, '');
    for (const card of CARD_PATTERNS) {
        if (card.pattern.test(cleaned)) return card.type;
    }
    return null;
};

export const validateCardNumber = (cardNumber: string): boolean => {
    const cleaned = cardNumber.replace(/\D/g, ''); // remove spaces

    const card = CARD_PATTERNS.find(c => c.pattern.test(cleaned));
    if (!card) return false;

    if (!card.length.includes(cleaned.length)) return false;

    // Luhn algorithm
    let sum = 0;
    let isEven = false;

    for (let i = cleaned.length - 1; i >= 0; i--) {
        let digit = parseInt(cleaned[i], 10);
        if (isEven) {
            digit *= 2;
            if (digit > 9) digit -= 9;
        }
        sum += digit;
        isEven = !isEven;
    }

    return sum % 10 === 0;
};


// (format MM/YY)
export const isValidExpiryDate = (expiryDate: string): boolean => {
    if (!expiryDate) return false;

    const match = expiryDate.match(/^(\d{2})\/(\d{2})$/);
    if (!match) return false;

    const month = parseInt(match[1], 10);
    const year = parseInt(match[2], 10) + 2000;

    if (month < 1 || month > 12) return false;

    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;

    if (year < currentYear) return false;
    if (year === currentYear && month < currentMonth) return false;

    return true;
};
