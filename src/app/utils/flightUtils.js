import {eachDayOfInterval} from 'date-fns';

export const getAvailableFrom = (flights, to) =>
    [...new Set(flights.filter(f => !to || f.to === to).map(f => f.from))];

export const getAvailableTo = (flights, from) =>
    [...new Set(flights.filter(f => !from || f.from === from).map(f => f.to))];

export const getFilteredLocations = (flights, selectedFrom, selectedTo) => ({
    from: getAvailableFrom(flights, selectedTo),
    to: getAvailableTo(flights, selectedFrom),
});

export const getAvailableDepartureDates = (flights, from, to) => {
    return flights
        .filter(f => f.from === from && f.to === to)
        .map(f => new Date(f.departureTime));
};

export const filterFlights = (flights, from, to, departureDate) => {
    return flights.filter(
        (flight) =>
            flight.from === from &&
            flight.to === to &&
            (!departureDate ||
                new Date(flight.departureTime).toDateString() ===
                new Date(departureDate).toDateString())
    );
};

export const getPriceTier = (prices = []) => {
    const min = Math.min(...prices);
    if (min < 300) return 'cheap';        // Green
    if (min > 800) return 'expensive';    // Red
    return 'moderate';                    // Orange
};

export const getDateHighlights = (flights, startDate, endDate, from, to) => {
    const highlights = {};

    const days = eachDayOfInterval({
        start: new Date(startDate),
        end: new Date(endDate),
    });

    days.forEach((day) => {
        const dateStr = day.toDateString();

        const flightsOnRoute = flights.filter(
            (f) =>
                new Date(f.departureTime).toDateString() === dateStr &&
                f.from === from &&
                f.to === to
        );

        if (flightsOnRoute.length > 0) {
            const prices = flightsOnRoute.flatMap((f) => Object.values(f.prices));
            const min = Math.min(...prices);

            if (min < 300) highlights[dateStr] = 'cheap';
            else if (min > 800) highlights[dateStr] = 'expensive';
            else highlights[dateStr] = 'moderate';
        }
    });

    return highlights;
};