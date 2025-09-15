import {Passenger} from "@/types/booking.types";

export const createEmptyPassenger = (): Omit<Passenger, 'dateOfBirth' | 'passportExpiry'> & {
    dateOfBirth?: Date;
    passportExpiry?: Date;
} => ({
    id: crypto.randomUUID(),
    firstName: '',
    lastName: '',
    email: '',
    passport: '',
    nationality: '',
    dateOfBirth: undefined,
    gender: '',
    passportExpiry: undefined,
    seat: undefined,
});
