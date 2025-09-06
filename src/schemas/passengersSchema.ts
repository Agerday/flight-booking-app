import * as z from "zod";

export const passengerSchema = z.object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Invalid email address'),
    nationality: z.string().min(1, 'Nationality is required'),
    gender: z.string().min(1, 'Gender is required'),
    dateOfBirth: z.date({required_error: 'Date of birth is required'}),
    passport: z.string()
        .min(6, 'Passport number must be at least 6 characters')
        .regex(/.*\d.*/, 'Passport number must contain at least one number'),
    passportExpiry: z.date({required_error: 'Passport expiration date is required'}),
});

export const passengersFormSchema = z.object({
    passengers: z.array(passengerSchema).min(1, 'At least one passenger is required'),
});

export type PassengersFormData = z.infer<typeof passengersFormSchema>;