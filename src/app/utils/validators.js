export const required = (value) =>
    value !== undefined && value !== null && value !== '' ? true : 'This field is required';

export const isEmail = (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? true : 'Enter a valid email address';

export const minLength = (len) => (value) =>
    value?.length >= len ? true : `Must be at least ${len} characters`;

export const pattern = (regex, msg = 'Invalid format') => (value) =>
    regex.test(value) ? true : msg;

export const hasNumber = (value) =>
    /\d/.test(value) ? true : 'Must contain at least one number';

export const isCardNumber = () => (value = '') =>
    /^\d{13,19}$/.test(value.replace(/\s+/g, '')) ? true : 'Invalid card number';

export const isExpirationDate = () => (value = '') =>
    /^(0[1-9]|1[0-2])\/\d{2}$/.test(value) ? true : 'Format must be MM/YY';

export const isFutureDate = (val) => {
    if (!/^\d{2}\/\d{2}$/.test(val)) return 'Date format should be MM/YY';
    const [mm, yy] = val.split('/').map(Number);
    if (mm < 1 || mm > 12) return 'Invalid month';
    const now = new Date();
    const currentYear = now.getFullYear() % 100;
    const currentMonth = now.getMonth() + 1;
    return yy > currentYear || (yy === currentYear && mm >= currentMonth)
        ? true
        : 'Expiration date must be in the future';
};

export const isCVV = () => (value = '') =>
    /^\d{3}$/.test(value) ? true : 'CVV must be 3 digits';

export const combineValidators = (...validators) => (value) => {
    for (const v of validators) {
        const result = v(value);
        if (result !== true) return result;
    }
    return true;
};
