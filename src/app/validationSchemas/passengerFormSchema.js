import {required, isEmail, minLength, hasNumber} from '../utils/validators';

export const passengerFormSchema = {
    firstName: [required],
    lastName: [required],
    email: [required, isEmail],
    nationality: [required],
    gender: [required],
    dateOfBirth: [required],
    passport: [required, minLength(6), hasNumber],
    passportExpiry: [required],
};
