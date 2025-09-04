import {isSameDay} from 'date-fns';
import {Flight, LocationOption} from "../types";

export const getFilteredLocations = (
    flights: Flight[],
    selectedOrigin?: string,
    selectedDestination?: string
): { origins: LocationOption[]; destinations: LocationOption[] } => {
    const availableOrigins = selectedDestination
        ? [...new Set(flights.filter(f => f.to === selectedDestination).map(f => f.from))]
        : [...new Set(flights.map(f => f.from))];

    const availableDestinations = selectedOrigin
        ? [...new Set(flights.filter(f => f.from === selectedOrigin).map(f => f.to))]
        : [...new Set(flights.map(f => f.to))];

    return {
        origins: availableOrigins.map(city => ({label: city, value: city})),
        destinations: availableDestinations.map(city => ({label: city, value: city})),
    };
};

export const getAvailableDepartureDates = (
    flights: Flight[],
    origin?: string,
    destination?: string
): Date[] => {
    if (!origin || !destination) return [];

    const filteredFlights = flights.filter(
        flight => flight.from === origin && flight.to === destination
    );

    // Get unique dates using date-fns isSameDay for proper comparison
    const uniqueDates: Date[] = [];

    filteredFlights.forEach(flight => {
        const flightDate = new Date(flight.departureTime);
        const isDuplicate = uniqueDates.some(existingDate =>
            isSameDay(existingDate, flightDate)
        );

        if (!isDuplicate) {
            uniqueDates.push(flightDate);
        }
    });

    return uniqueDates.sort((a, b) => a.getTime() - b.getTime());
};

export const getFilteredFlights = (
    flights: Flight[],
    from: string,
    to: string,
    departureDate?: Date
): Flight[] => {
    return flights.filter(flight => {
        const matchesRoute = flight.from === from && flight.to === to;

        if (!departureDate) return matchesRoute;

        return matchesRoute && isSameDay(new Date(flight.departureTime), departureDate);
    });
};