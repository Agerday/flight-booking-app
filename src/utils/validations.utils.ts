type ValidationResult = true | string;

export const required = (value: any): ValidationResult =>
    value !== undefined && value !== null && value !== '' ? true : 'This field is required';

export const isEmail = (value: string): ValidationResult =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? true : 'Enter a valid email address';

// Date validators
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

// Passport validators
export const isValidPassport = (value: string): ValidationResult => {
    if (!value) return "Passport number is required";

    const cleaned = value.replace(/\s+/g, "").toUpperCase();

    if (!/^(?=.*\d)[A-Z0-9]{6,9}$/.test(cleaned)) {
        return "Passport must be 6–9 alphanumeric characters and include at least one number";
    }

    return true;
};

export const isPassportNotExpired = (value: Date | string): ValidationResult => {
    const date = value instanceof Date ? value : new Date(value);
    if (isNaN(date.getTime())) return 'Invalid expiration date';

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (date <= today) return 'Passport has expired';

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


export const isValidName = (value: string): ValidationResult => {
    if (!value) return 'Name is required';

    if (!/^[a-zA-Z\s\-']+$/.test(value)) {
        return 'Name can only contain letters, spaces, hyphens, and apostrophes';
    }

    if (value.trim().length < 2) {
        return 'Name must be at least 2 characters';
    }

    return true;
};


export const inRange = (min: number, max: number) => (value: number | string): ValidationResult => {
    const num = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(num)) return 'Must be a number';
    return num >= min && num <= max ? true : `Must be between ${min} and ${max}`;
};

export const isValidNationality = (value: string): ValidationResult => {
    if (!value) return 'Nationality is required';

    if (!/^[a-zA-Z\s]{2,}$/.test(value)) {
        return 'Enter a valid nationality';
    }

    return true;
};

export type {ValidationResult, Passenger};