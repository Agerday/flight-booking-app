import { z } from "zod";
import { mockFlights } from "@/data/mockFlights";
import { getAvailableDepartureDates } from "@/utils/flightSearch.utils";
import { isSameDay } from "date-fns";
import { TripType } from "@/types/booking.types";
import {
    required,
    isFutureDateFrom,
    inRange,
} from "@/utils/validations.utils";

export const flightSearchSchema = z.object({
    origin: z.string().refine(required, { message: "Please select departure city" }),
    destination: z.string().refine(required, { message: "Please select destination city" }),
    departure: z.date({
        required_error: "Please select departure date",
        invalid_type_error: "Invalid departure date",
    }).refine(isFutureDateFrom(), { message: "Departure date must be in the future" }),
    returnDate: z.date().optional(),
    tripType: z.nativeEnum(TripType),
    passengerNumber: z.string().refine(inRange(1, 9), {
        message: "Passenger count must be between 1 and 9",
    }),
})
    .refine((data) => {
        if (data.tripType === TripType.ONE_WAY) return true;
        if (!data.returnDate) return false;

        const dayAfterDeparture = new Date(data.departure);
        dayAfterDeparture.setDate(data.departure.getDate() + 1);

        return data.returnDate >= dayAfterDeparture;
    }, {
        message: "Return date must be after departure date",
        path: ["returnDate"],
    })
    .refine((data) => {
        const outboundFlights = getAvailableDepartureDates(mockFlights, data.origin, data.destination);
        return outboundFlights.some((d) => isSameDay(d, data.departure));
    }, {
        message: "No flights available for selected route and date",
        path: ["departure"],
    })
    .refine((data) => {
        if (data.tripType === TripType.ONE_WAY || !data.returnDate) return true;
        const returnFlights = getAvailableDepartureDates(mockFlights, data.destination, data.origin);
        return returnFlights.some((d) => isSameDay(d, data.returnDate!));
    }, {
        message: "No return flights available for selected route and date",
        path: ["returnDate"],
    });

export type FlightSearchFormData = z.infer<typeof flightSearchSchema>;
