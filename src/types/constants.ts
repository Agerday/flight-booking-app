export const countryMap = {
    BEL: 'Belgium',
    FRA: 'France',
    USA: 'United States',
    GBR: 'United Kingdom',
    DEU: 'Germany',
    ESP: 'Spain',
    ITA: 'Italy',
    NLD: 'Netherlands',
    VNM: 'Vietnam',
    KOR: 'South Korea',
    JPN: 'Japan',
    CHN: 'China',
    IND: 'India',
    CAN: 'Canada',
    AUS: 'Australia',
} as const;

export const extrasPricing = {
    meals: 12,
    baggageInsurance: 8,
    checkedBaggage: {
        weights: {
            '20': 20,
            '25': 25,
            '30': 30,
        },
        defaultWeight: '20',
    },
    assistanceTiers: {
        gold: 9,
        premium: 18,
    }
} as const;

export const assistanceTiers = [
    {
        id: 'normal',
        name: 'Basic',
        price: 0,
        color: 'default',
        features: [
            '24/7 live support',
        ],
    },
    {
        id: 'gold',
        name: 'Gold',
        price: 9,
        color: 'warning',
        features: [
            '24/7 live support',
            'Change service fees: €9',
            'Cancellation service fees: €9',
            'Promo code: €9 value',
            'Fast response',
        ],
    },
    {
        id: 'premium',
        name: 'Premium',
        price: 18,
        color: 'success',
        popular: true,
        features: [
            '24/7 live support',
            'Change fees: Waived',
            'Cancellation fees: Waived',
            'Promo code: €9 value',
            'Fastest support (top priority)',
        ],
    },
] as const;

export const flightClassThemes = {
    economy: {
        emoji: '💺',
        color: 'info.main',
        label: 'Best Value',
    },
    premium: {
        emoji: '🥂',
        color: 'warning.main',
        label: 'Extra Comfort',
    },
    business: {
        emoji: '👨‍💼',
        color: 'secondary.main',
        label: 'Top Class',
    },
} as const;

export const genderOptions = [
    {value: 'male', label: 'Male'},
    {value: 'female', label: 'Female'},
    {value: 'other', label: 'Other'},
] as const;