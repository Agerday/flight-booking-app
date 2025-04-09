export const validateAgainstSchema = (formData, schema) => {
    const newErrors = {};
    let valid = true;

    for (const field in schema) {
        const validators = typeof schema[field] === 'function'
            ? schema[field](formData)
            : schema[field];

        for (const validator of validators) {
            const result = validator(formData[field]);
            if (result !== true) {
                newErrors[field] = result;
                valid = false;
                break;
            }
        }
    }

    return { errors: newErrors, isValid: valid };
};
