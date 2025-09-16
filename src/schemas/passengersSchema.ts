import * as z from "zod";
import {
    isAdult,
    isEmail,
    isPassportNotExpired,
    isValidName,
    isValidNationality,
    isValidPassport,
} from "@/utils/validations.utils";

export const passengerSchema = z.object({
    firstName: z.string().min(1, "First name is required")
        .refine((val) => isValidName(val) === true, {
            message: "Name can only contain letters, spaces, hyphens, and apostrophes",
        }),

    lastName: z.string().min(1, "Last name is required")
        .refine((val) => isValidName(val) === true, {
            message: "Name can only contain letters, spaces, hyphens, and apostrophes",
        }),

    email: z.string().min(1, "Email is required")
        .refine((val) => isEmail(val) === true, {
            message: "Enter a valid email address",
        }),

    nationality: z.string().min(1, "Nationality is required")
        .refine((val) => isValidNationality(val) === true, {
            message: "Enter a valid nationality",
        }),

    gender: z.string().min(1, "Gender is required"),

    dateOfBirth: z.date({
        required_error: "Date of birth is required",
        invalid_type_error: "Invalid date of birth",
    }).refine((val) => isAdult(18)(val) === true, {
        message: "Passenger must be at least 18 years old",
    }),

    passport: z.string().min(6, "Passport number must be at least 6 characters")
        .refine((val) => isValidPassport(val) === true, {
            message: "Passport must be 6-9 alphanumeric characters",
        }),

    passportExpiry: z.date({
        required_error: "Passport expiration date is required",
        invalid_type_error: "Invalid passport expiration date",
    }).refine((val) => isPassportNotExpired(val) === true, {
        message: "Passport has expired or is expiring within 6 months",
    }),
});

export const passengersFormSchema = z.object({
    passengers: z.array(passengerSchema).min(1, "At least one passenger is required"),
}).superRefine((data, ctx) => {
    const seenNames = new Set<string>();
    const seenPassports = new Set<string>();

    data.passengers.forEach((p, i) => {
        // name uniqueness
        const fullName = `${p.firstName?.toLowerCase().trim()} ${p.lastName?.toLowerCase().trim()}`;
        if (seenNames.has(fullName)) {
            ctx.addIssue({
                path: ["passengers", i, "firstName"],
                code: z.ZodIssueCode.custom,
                message: `Passenger with name "${p.firstName} ${p.lastName}" already exists`,
            });
        } else {
            seenNames.add(fullName);
        }

        if (p.passport) {
            const passportNormalized = p.passport.replace(/\s+/g, "").toUpperCase();
            if (seenPassports.has(passportNormalized)) {
                ctx.addIssue({
                    path: ["passengers", i, "passport"],
                    code: z.ZodIssueCode.custom,
                    message: `Passport number ${p.passport} is already used by another passenger`,
                });
            } else {
                seenPassports.add(passportNormalized);
            }
        }
    });
});

export type PassengersFormData = z.infer<typeof passengersFormSchema>;
