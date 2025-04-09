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

export const combineValidators = (...validators) => (value) => {
    for (const v of validators) {
        const result = v(value);
        if (result !== true) return result;
    }
    return true;
};
