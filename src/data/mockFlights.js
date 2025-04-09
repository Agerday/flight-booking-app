const airlines = ['ReactJet', 'JS Airlines', 'Air React'];
const cities = ['Berlin', 'Paris', 'Rome'];
const days = ['2025-04-01', '2025-04-02', '2025-04-03', '2025-04-04', '2025-04-05'];

let flightId = 1;
const mockFlights = [];

const generatePrices = (dayIndex, airlineIndex) => {
    const base = 100 + dayIndex * 200 + airlineIndex * 50;
    return {
        economy: base,
        premium: base + 100,
        business: base + 250,
    };
};

for (let dayIndex = 0; dayIndex < days.length; dayIndex++) {
    const date = days[dayIndex];
    for (let from of cities) {
        for (let to of cities) {
            if (from === to) continue;
            for (let airlineIndex = 0; airlineIndex < airlines.length; airlineIndex++) {
                const airline = airlines[airlineIndex];
                const hour = 8 + airlineIndex * 2;
                mockFlights.push({
                    id: flightId++,
                    airline,
                    from,
                    to,
                    departureTime: `${date}T${String(hour).padStart(2, '0')}:00:00Z`,
                    arrivalTime: `${date}T${String(hour + 2).padStart(2, '0')}:00:00Z`,
                    stops: 0,
                    prices: generatePrices(dayIndex, airlineIndex),
                });
            }
        }
    }
}

export default mockFlights;
