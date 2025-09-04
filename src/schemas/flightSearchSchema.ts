import {z} from 'zod';
import {TripType} from '../types';
import {mockFlights} from '../data/mockFlights';
import {getAvailableDepartureDates} from '../utils/flightSearch.utils';
import {isSameDay} from 'date-fns';

export const flightSearchSchema = z.object({
    origin: z.string().min(1, 'Please select departure city'),
    destination: z.string().min(1, 'Please select destination city'),
    departure: z.date({
        required_error: 'Please select departure date',
        invalid_type_error: 'Invalid departure date',
    }),
    returnDate: z.date().optional(),
    tripType: z.nativeEnum(TripType),
    passengerNumber: z
        .number()
        .min(1, 'At least 1 passenger required')
        .max(9, 'Maximum 9 passengers allowed'),
}).refine((data) => {
    if (data.tripType === TripType.ONE_WAY) {
        return true;
    }

    if (!data.returnDate) {
        return false;
    }

    const dayAfterDeparture = new Date(data.departure);
    dayAfterDeparture.setDate(data.departure.getDate() + 1);
    if (data.returnDate < dayAfterDeparture) {
        return false;
    }

    const returnFlights = getAvailableDepartureDates(mockFlights, data.destination, data.origin);
    return returnFlights.some((d) => isSameDay(d, data.returnDate!));
}, {
    message: "Return date must be after departure date and have available flights",
    path: ["returnDate"],
}).refine((data) => {
    const outboundFlights = getAvailableDepartureDates(mockFlights, data.origin, data.destination);
    return outboundFlights.some((d) => isSameDay(d, data.departure));
}, {
    message: "No flights available for selected route and date",
    path: ["departure"],
});

export type FlightSearchFormData = z.infer<typeof flightSearchSchema>;