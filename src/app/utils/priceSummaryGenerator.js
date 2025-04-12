export const generatePriceSummary = (formData, config = {}) => {
    const items = [];

    const walk = (obj, path = []) => {
        if (typeof obj !== 'object' || obj === null) return;

        Object.entries(obj).forEach(([key, value]) => {
            const currentPath = [...path, key];

            if (value && typeof value === 'object' && 'price' in value && value.price > 0) {
                const label =
                    config?.labels?.[key] ||
                    (key === 'assistance' && value.type
                        ? `Assistance Tier: ${value.type}`
                        : key === 'checkedBaggage' && value.weight
                            ? `Checked Baggage (${value.weight}kg)`
                            : key.charAt(0).toUpperCase() + key.slice(1));

                const icon = config?.icons?.[key] || null;

                items.push({
                    label,
                    price: value.price,
                    icon,
                });
            }

            walk(value, currentPath);
        });
    };

    walk(formData);

    return items;
};
