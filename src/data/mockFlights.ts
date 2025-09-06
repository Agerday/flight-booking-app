import {Flight} from "../types";

const airlines = ["ReactJet", "JS Airlines", "Air React", "Vue Airways", "Angular Express"];
const cities = ["Berlin", "Paris", "Rome", "Madrid", "London", "Amsterdam"];

const generateDates = (): Date[] => {
    const dates: Date[] = [];
    const today = new Date();
    for (let i = 0; i < 30; i++) { // Extended to 30 days
        const date = new Date(today);
        date.setDate(today.getDate() + i);
        dates.push(date);
    }
    return dates;
};

const generatePrices = (dayIndex: number, airlineIndex: number, routeIndex: number) => {
    const base = 150 + (dayIndex * 5) + (airlineIndex * 30) + (routeIndex * 20);
    return {
        economy: base,
        premium: base + 120,
        business: base + 300,
    };
};

let flightId = 1;
const dates = generateDates();

export const mockFlights: Flight[] = [];

// Generate flights for each date
for (let dayIndex = 0; dayIndex < dates.length; dayIndex++) {
    const baseDate = dates[dayIndex];
    let routeIndex = 0;

    // Generate flights for every city pair (both directions)
    for (const from of cities) {
        for (const to of cities) {
            if (from === to) continue;

            routeIndex++;

            // Generate multiple flights per route per day (morning, afternoon, evening)
            const timeSlots = [
                {hour: 6, label: 'Early Morning'},
                {hour: 9, label: 'Morning'},
                {hour: 14, label: 'Afternoon'},
                {hour: 18, label: 'Evening'},
                {hour: 21, label: 'Night'}
            ];

            timeSlots.forEach((slot, slotIndex) => {
                // Generate flights with different airlines for each time slot
                airlines.slice(0, 3).forEach((airline, airlineIndex) => {
                    const departureTime = new Date(baseDate);
                    departureTime.setHours(slot.hour + airlineIndex, Math.random() * 60, 0, 0);

                    const arrivalTime = new Date(departureTime);
                    const flightDuration = 1.5 + Math.random() * 2; // 1.5 to 3.5 hours
                    arrivalTime.setHours(departureTime.getHours() + Math.floor(flightDuration),
                        departureTime.getMinutes() + ((flightDuration % 1) * 60), 0, 0);

                    const stops = Math.random() < 0.7 ? 0 : Math.random() < 0.8 ? 1 : 2;

                    mockFlights.push({
                        id: flightId++,
                        airline,
                        from,
                        to,
                        departureTime,
                        arrivalTime,
                        stops,
                        prices: generatePrices(dayIndex, airlineIndex, routeIndex + slotIndex),
                    });
                });
            });
        }
    }
}

console.log(`Generated ${mockFlights.length} flights across ${dates.length} days and ${cities.length} cities`);