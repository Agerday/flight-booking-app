import React from 'react';

export interface PriceSummaryItem {
    label: string;
    price: number;
    icon?: React.ReactNode;
    scope: 'passenger' | 'global';
    passengerIndex?: number;
    key: string;
}

export interface PriceSummaryConfig {
    labels?: Record<string, string>;
    icons?: Record<string, React.ReactNode>;
}

interface PriceObject {
    price: number;
    type?: string;
    weight?: string;
}

export const generatePriceSummary = (
    formData: Record<string, any>,
    config: PriceSummaryConfig = {}
): PriceSummaryItem[] => {
    const items: PriceSummaryItem[] = [];

    const walk = (obj: any, path: string[] = []): void => {
        if (typeof obj !== 'object' || obj === null) return;

        for (const [key, value] of Object.entries(obj)) {
            const currentPath = [...path, key];

            if (value && typeof value === 'object' && 'price' in value && (value as PriceObject).price > 0) {
                const priceObj = value as PriceObject;

                const label = config?.labels?.[key] ||
                    (key === 'assistance' && priceObj.type
                        ? `Assistance Tier: ${priceObj.type}`
                        : key === 'checkedBaggage' && priceObj.weight
                            ? `Checked Baggage (${priceObj.weight}kg)`
                            : key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase()));

                const icon = config?.icons?.[key] || undefined;

                const isPassengerScope = currentPath[0] === 'passengers' && !isNaN(Number(currentPath[1]));
                const passengerIndex = isPassengerScope ? Number(currentPath[1]) : undefined;
                const scope: 'passenger' | 'global' = isPassengerScope ? 'passenger' : 'global';

                items.push({
                    label,
                    price: priceObj.price,
                    icon,
                    scope,
                    passengerIndex,
                    key: currentPath.join('.'),
                });
            }

            walk(value, currentPath);
        }
    };

    walk(formData);
    return items;
};