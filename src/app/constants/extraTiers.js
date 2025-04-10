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
];