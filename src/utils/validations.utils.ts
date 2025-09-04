type ValidationResult = true | string;
type ValidatorFunction = (value: any) => ValidationResult;

export const required = (value: any): ValidationResult =>
    value !== undefined && value !== null && value !== '' ? true : 'This field is required';

export const isEmail = (value: string): ValidationResult =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? true : 'Enter a valid email address';

export const minLength = (len: number) => (value: string): ValidationResult =>
    value?.length >= len ? true : `Must be at least ${len} characters`;

export const pattern = (regex: RegExp, msg = 'Invalid format') => (value: string): ValidationResult =>
    regex.test(value) ? true : msg;

export const hasNumber = (value: string): ValidationResult =>
    /\d/.test(value) ? true : 'Must contain at least one number';

export const isCardNumber = () => (value = ''): ValidationResult =>
    /^\d{13,19}$/.test(value.replace(/\s+/g, '')) ? true : 'Invalid card number';

export const isExpirationDate = () => (value = ''): ValidationResult =>
    /^(0[1-9]|1[0-2])\/\d{2}$/.test(value) ? true : 'Format must be MM/YY';

export const isFutureDate = (val: string): ValidationResult => {
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

export const isCVV = () => (value = ''): ValidationResult =>
    /^\d{3}$/.test(value) ? true : 'CVV must be 3 digits';

export const combineValidators = (...validators: ValidatorFunction[]) => (value: any): ValidationResult => {
    for (const validator of validators) {
        const result = validator(value);
        if (result !== true) return result;
    }
    return true;
};