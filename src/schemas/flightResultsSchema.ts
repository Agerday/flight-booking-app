import {z} from 'zod';

export const flightResultsSchema = z.object({
    outboundFlight: z.object({}).optional(),
    returnFlight: z.object({}).optional(),
}).refine((data) => {
    return !!data.outboundFlight;
}, {
    message: "Please select an outbound flight",
    path: ["outboundFlight"]
});

export type FlightResultsFormData = z.infer<typeof flightResultsSchema>;
