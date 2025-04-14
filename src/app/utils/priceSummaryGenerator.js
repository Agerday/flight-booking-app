export const generatePriceSummary = (formData, config = {}) => {
    const items = [];

    const walk = (obj, path = []) => {
        if (typeof obj !== 'object' || obj === null) return;

        for (const [key, value] of Object.entries(obj)) {
            const currentPath = [...path, key];

            if (value && typeof value === 'object' && 'price' in value && value.price > 0) {
                const label = config?.labels?.[key] ||
                    (key === 'assistance' && value.type
                        ? `Assistance Tier: ${value.type}`
                        : key === 'checkedBaggage' && value.weight
                            ? `Checked Baggage (${value.weight}kg)`
                            : key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase()));

                const icon = config?.icons?.[key] || null;

                const isPassengerScope = currentPath[0] === 'passengers' && !isNaN(currentPath[1]);
                const passengerIndex = isPassengerScope ? Number(currentPath[1]) : undefined;
                const scope = isPassengerScope ? 'passenger' : 'global';

                items.push({
                    label,
                    price: value.price,
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
