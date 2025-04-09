import mockFlights from '../../data/mockFlights';

export const getFlightById = (id) =>
    mockFlights.find((f) => f.id.toString() === id);

export const filterFlights = (from, to, date) =>
    mockFlights.filter(
        (flight) =>
            flight.from === from &&
            flight.to === to &&
            (!date || new Date(flight.departureTime).toDateString() === new Date(date).toDateString())
    );
