import React from 'react';
import {Box, Chip, Paper, Slider, Stack, Typography,} from '@mui/material';
import {Flight} from '../../../types';

interface FlightFilters {
    priceRange: [number, number];
    airlines: string[];
    stops: number[];
    timeOfDay: string[];
}

interface FlightFilterProps {
    flights: Flight[];
    filters: FlightFilters;
    onFiltersChange: (filters: FlightFilters) => void;
}

const FlightFilter: React.FC<FlightFilterProps> = ({
                                                       flights,
                                                       filters,
                                                       onFiltersChange,
                                                   }) => {
    const uniqueAirlines = [...new Set(flights.map(f => f.airline))];
    const priceRange = flights.reduce(
        (range, flight) => {
            const minPrice = Math.min(...Object.values(flight.prices));
            const maxPrice = Math.max(...Object.values(flight.prices));
            return [
                Math.min(range[0], minPrice),
                Math.max(range[1], maxPrice)
            ];
        },
        [Infinity, -Infinity]
    );

    const handlePriceChange = (_: Event, newValue: number | number[]) => {
        onFiltersChange({
            ...filters,
            priceRange: newValue as [number, number]
        });
    };

    const handleAirlineToggle = (airline: string) => {
        const newAirlines = filters.airlines.includes(airline)
            ? filters.airlines.filter(a => a !== airline)
            : [...filters.airlines, airline];

        onFiltersChange({
            ...filters,
            airlines: newAirlines
        });
    };

    const handleStopsChange = (stops: number) => {
        const newStops = filters.stops.includes(stops)
            ? filters.stops.filter(s => s !== stops)
            : [...filters.stops, stops];

        onFiltersChange({
            ...filters,
            stops: newStops
        });
    };

    return (
        <Paper sx={{p: 3, mb: 3}}>
            <Typography variant="h6" gutterBottom>
                Filter Flights
            </Typography>

            <Stack spacing={3}>
                {/* Price Range */}
                <Box>
                    <Typography variant="subtitle2" gutterBottom>
                        Price Range: €{filters.priceRange[0]} - €{filters.priceRange[1]}
                    </Typography>
                    <Slider
                        value={filters.priceRange}
                        onChange={handlePriceChange}
                        valueLabelDisplay="auto"
                        min={priceRange[0]}
                        max={priceRange[1]}
                        step={10}
                    />
                </Box>

                {/* Airlines */}
                <Box>
                    <Typography variant="subtitle2" gutterBottom>
                        Airlines
                    </Typography>
                    <Box sx={{display: 'flex', flexWrap: 'wrap', gap: 1}}>
                        {uniqueAirlines.map(airline => (
                            <Chip
                                key={airline}
                                label={airline}
                                onClick={() => handleAirlineToggle(airline)}
                                color={filters.airlines.includes(airline) ? 'primary' : 'default'}
                                variant={filters.airlines.includes(airline) ? 'filled' : 'outlined'}
                                size="small"
                            />
                        ))}
                    </Box>
                </Box>

                {/* Stops */}
                <Box>
                    <Typography variant="subtitle2" gutterBottom>
                        Stops
                    </Typography>
                    <Box sx={{display: 'flex', gap: 1}}>
                        {[0, 1, 2].map(stops => (
                            <Chip
                                key={stops}
                                label={stops === 0 ? 'Direct' : `${stops} Stop${stops > 1 ? 's' : ''}`}
                                onClick={() => handleStopsChange(stops)}
                                color={filters.stops.includes(stops) ? 'primary' : 'default'}
                                variant={filters.stops.includes(stops) ? 'filled' : 'outlined'}
                                size="small"
                            />
                        ))}
                    </Box>
                </Box>
            </Stack>
        </Paper>
    );
};

export default FlightFilter;