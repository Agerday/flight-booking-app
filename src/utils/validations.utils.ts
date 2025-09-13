type ValidationResult = true | string;
type ValidatorFunction<T = any> = (value: T, allValues?: any, meta?: any) => ValidationResult;

// Basic validators
export const required = (value: any): ValidationResult =>
    value !== undefined && value !== null && value !== '' ? true : 'This field is required';

export const isEmail = (value: string): ValidationResult =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? true : 'Enter a valid email address';

export const minLength = (len: number) => (value: string): ValidationResult =>
    value?.length >= len ? true : `Must be at least ${len} characters`;

export const maxLength = (len: number) => (value: string): ValidationResult =>
    value?.length <= len ? true : `Must be at most ${len} characters`;

export const pattern = (regex: RegExp, msg = 'Invalid format') => (value: string): ValidationResult =>
    regex.test(value) ? true : msg;

export const hasNumber = (value: string): ValidationResult =>
    /\d/.test(value) ? true : 'Must contain at least one number';

// Payment validators
export const isCardNumber = () => (value = ''): ValidationResult => {
    const cleaned = value.replace(/\s+/g, '');
    if (!/^\d{13,19}$/.test(cleaned)) return 'Invalid card number';

    // Luhn algorithm validation
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

    return sum % 10 === 0 ? true : 'Invalid card number';
};

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
    /^\d{3,4}$/.test(value) ? true : 'CVV must be 3 or 4 digits';

// Date validators
export const isValidDate = (value: Date | string): ValidationResult => {
    const date = value instanceof Date ? value : new Date(value);
    return !isNaN(date.getTime()) ? true : 'Invalid date';
};

export const isAdult = (minAge = 18) => (value: Date | string): ValidationResult => {
    const date = value instanceof Date ? value : new Date(value);
    if (isNaN(date.getTime())) return 'Invalid date';

    const today = new Date();
    const age = today.getFullYear() - date.getFullYear();
    const monthDiff = today.getMonth() - date.getMonth();
    const dayDiff = today.getDate() - date.getDate();

    const actualAge = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;

    return actualAge >= minAge ? true : `Must be at least ${minAge} years old`;
};

export const isFutureDateFrom = (refDate?: Date) => (value: Date | string): ValidationResult => {
    const date = value instanceof Date ? value : new Date(value);
    const reference = refDate || new Date();

    if (isNaN(date.getTime())) return 'Invalid date';

    return date > reference ? true : 'Date must be in the future';
};

export const isPastDate = (value: Date | string): ValidationResult => {
    const date = value instanceof Date ? value : new Date(value);
    if (isNaN(date.getTime())) return 'Invalid date';

    return date < new Date() ? true : 'Date must be in the past';
};

// Passport validators
export const isValidPassport = (value: string): ValidationResult => {
    if (!value) return 'Passport number is required';

    // Remove spaces and convert to uppercase
    const cleaned = value.replace(/\s+/g, '').toUpperCase();

    // Most passports are 6-9 characters, alphanumeric
    if (!/^[A-Z0-9]{6,9}$/.test(cleaned)) {
        return 'Passport must be 6-9 alphanumeric characters';
    }

    return true;
};

export const isPassportNotExpired = (value: Date | string): ValidationResult => {
    const date = value instanceof Date ? value : new Date(value);
    if (isNaN(date.getTime())) return 'Invalid expiration date';

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date <= today) return 'Passport has expired';

    // Check if passport expires within 6 months (many countries require this)
    const sixMonthsFromNow = new Date();
    sixMonthsFromNow.setMonth(sixMonthsFromNow.getMonth() + 6);

    if (date < sixMonthsFromNow) {
        return 'Passport expires within 6 months - may not be valid for travel';
    }

    return true;
};

// Passenger uniqueness validators
interface Passenger {
    firstName?: string;
    lastName?: string;
    passport?: string;
    [key: string]: any;
}

export const uniquePassengerName = (passengers: Passenger[], currentIndex: number) =>
    (value: string, allValues?: any): ValidationResult => {
        if (!value || !allValues) return true;

        const currentPassenger = allValues.passengers?.[currentIndex];
        if (!currentPassenger?.firstName || !currentPassenger?.lastName) return true;

        const fullName = `${currentPassenger.firstName.toLowerCase().trim()} ${currentPassenger.lastName.toLowerCase().trim()}`;

        for (let i = 0; i < passengers.length; i++) {
            if (i === currentIndex) continue;

            const otherPassenger = allValues.passengers?.[i];
            if (!otherPassenger?.firstName || !otherPassenger?.lastName) continue;

            const otherFullName = `${otherPassenger.firstName.toLowerCase().trim()} ${otherPassenger.lastName.toLowerCase().trim()}`;

            if (fullName === otherFullName) {
                return `Passenger with name "${currentPassenger.firstName} ${currentPassenger.lastName}" already exists`;
            }
        }

        return true;
    };

export const uniquePassport = (passengers: Passenger[], currentIndex: number) =>
    (value: string, allValues?: any): ValidationResult => {
        if (!value) return true;

        const normalizedValue = value.replace(/\s+/g, '').toUpperCase();

        for (let i = 0; i < passengers.length; i++) {
            if (i === currentIndex) continue;

            const otherPassport = allValues?.passengers?.[i]?.passport;
            if (!otherPassport) continue;

            const normalizedOther = otherPassport.replace(/\s+/g, '').toUpperCase();

            if (normalizedValue === normalizedOther) {
                return `Passport number ${value} is already used by another passenger`;
            }
        }

        return true;
    };

// Phone validators
export const isPhoneNumber = (value: string): ValidationResult => {
    // Remove all non-digit characters except + at the beginning
    const cleaned = value.replace(/[^\d+]/g, '');

    // Basic international phone validation (7-15 digits, optional + at start)
    if (!/^\+?\d{7,15}$/.test(cleaned)) {
        return 'Enter a valid phone number';
    }

    return true;
};

// Name validators
export const isValidName = (value: string): ValidationResult => {
    if (!value) return 'Name is required';

    // Allow letters, spaces, hyphens, and apostrophes
    if (!/^[a-zA-Z\s\-']+$/.test(value)) {
        return 'Name can only contain letters, spaces, hyphens, and apostrophes';
    }

    // Check minimum length (at least 2 characters)
    if (value.trim().length < 2) {
        return 'Name must be at least 2 characters';
    }

    return true;
};

// Number validators
export const isPositiveNumber = (value: number | string): ValidationResult => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    return !isNaN(num) && num > 0 ? true : 'Must be a positive number';
};

export const inRange = (min: number, max: number) => (value: number | string): ValidationResult => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return 'Must be a number';
    return num >= min && num <= max ? true : `Must be between ${min} and ${max}`;
};

// Nationality validator
export const isValidNationality = (value: string): ValidationResult => {
    if (!value) return 'Nationality is required';

    // Basic check - at least 2 characters, only letters and spaces
    if (!/^[a-zA-Z\s]{2,}$/.test(value)) {
        return 'Enter a valid nationality';
    }

    return true;
};

// Combinator function
export const combineValidators = <T = any>(...validators: ValidatorFunction<T>[]) =>
    (value: T, allValues?: any, meta?: any): ValidationResult => {
        for (const validator of validators) {
            const result = validator(value, allValues, meta);
            if (result !== true) return result;
        }
        return true;
    };

// Conditional validator
export const conditionalValidator = <T = any>(
    condition: (value: T, allValues?: any) => boolean,
    validator: ValidatorFunction<T>
) => (value: T, allValues?: any, meta?: any): ValidationResult => {
    if (!condition(value, allValues)) return true;
    return validator(value, allValues, meta);
};

// Array validators
export const arrayMinLength = (min: number) => (value: any[]): ValidationResult =>
    Array.isArray(value) && value.length >= min
        ? true
        : `Must have at least ${min} item${min !== 1 ? 's' : ''}`;

export const arrayMaxLength = (max: number) => (value: any[]): ValidationResult =>
    Array.isArray(value) && value.length <= max
        ? true
        : `Must have at most ${max} item${max !== 1 ? 's' : ''}`;

// Custom error message wrapper
export const withCustomError = <T = any>(
    validator: ValidatorFunction<T>,
    customError: string
) => (value: T, allValues?: any, meta?: any): ValidationResult => {
    const result = validator(value, allValues, meta);
    return result === true ? true : customError;
};

// Async validator wrapper (for API checks, etc.)
export const asyncValidator = <T = any>(
    asyncFn: (value: T) => Promise<ValidationResult>
) => async (value: T): Promise<ValidationResult> => {
    try {
        return await asyncFn(value);
    } catch (error) {
        return 'Validation error occurred';
    }
};

// Export types for use in other files
export type { ValidationResult, ValidatorFunction, Passenger };