import React, { useMemo } from 'react';
import { Flight } from '@/types/booking.types';
import { FilterBuilder, FilterGroupConfig } from '@/types/filter.types';
import GenericFilter from '@/components/ui/GenericFilter/GenericFilter';
import { useFilterFunctions, useGenericFilter } from '@/hooks/useGenericFilter';
import {
    AttachMoney as MoneyIcon,
    Flight as FlightIcon,
    Airlines as AirlinesIcon,
    Schedule as TimeIcon,
} from '@mui/icons-material';

interface FlightFilterProps {
    flights: Flight[];
    variant?: 'inline' | 'sidebar' | 'modal' | 'drawer';
    onFilteredFlightsChange?: (flights: Flight[]) => void;
}

const FlightFilter: React.FC<FlightFilterProps> = ({
                                                       flights,
                                                       variant = 'inline',
                                                       onFilteredFlightsChange,
                                                   }) => {
    const { createRangeFilter, createMultiSelectFilter } = useFilterFunctions<Flight>();

    const filterOptions = useMemo(() => {
        const airlines = new Set<string>();
        const stops = new Set<number>();
        let minPrice = Infinity;
        let maxPrice = 0;

        flights.forEach(flight => {
            airlines.add(flight.airline);
            stops.add(flight.stops);

            const prices = Object.values(flight.prices);
            const flightMin = Math.min(...prices);
            const flightMax = Math.max(...prices);

            minPrice = Math.min(minPrice, flightMin);
            maxPrice = Math.max(maxPrice, flightMax);
        });

        return {
            airlines: Array.from(airlines).sort(),
            stops: Array.from(stops).sort((a, b) => a - b),
            priceRange: {
                min: minPrice === Infinity ? 0 : minPrice,
                max: maxPrice === 0 ? 1000 : maxPrice,
            },
        };
    }, [flights]);

    const groups = useMemo((): FilterGroupConfig[] => {
        const getStopsLabel = (stops: number) => (stops === 0 ? 'Direct' : `${stops} Stop${stops > 1 ? 's' : ''}`);

        const airlineCounts = flights.reduce<Record<string, number>>((acc, flight) => {
            acc[flight.airline] = (acc[flight.airline] || 0) + 1;
            return acc;
        }, {});

        const stopCounts = flights.reduce<Record<number, number>>((acc, flight) => {
            acc[flight.stops] = (acc[flight.stops] || 0) + 1;
            return acc;
        }, {});

        const getTimeOfDay = (dateString: string): string => {
            const hour = new Date(dateString).getHours();
            if (hour >= 6 && hour < 12) return 'morning';
            if (hour >= 12 && hour < 18) return 'afternoon';
            if (hour >= 18 && hour < 24) return 'evening';
            return 'night';
        };

        const timeCounts = flights.reduce<Record<string, number>>((acc, flight) => {
            const key = getTimeOfDay(flight.departureTime);
            acc[key] = (acc[key] || 0) + 1;
            return acc;
        }, {});

        return [
            {
                id: 'price',
                label: 'Price',
                icon: <MoneyIcon fontSize="small" color="primary" />,
                filters: [
                    FilterBuilder.range(
                        'priceRange',
                        'Price Range',
                        filterOptions.priceRange.min,
                        filterOptions.priceRange.max,
                        { step: 10, formatValue: (v) => `€${v}`, icon: <MoneyIcon fontSize="small" /> }
                    ),
                ],
                defaultExpanded: true,
            },
            {
                id: 'stops',
                label: 'Stops',
                icon: <FlightIcon fontSize="small" color="primary" />,
                filters: [
                    FilterBuilder.checkbox(
                        'stops',
                        'Number of Stops',
                        filterOptions.stops.map(stop => ({
                            value: stop,
                            label: getStopsLabel(stop),
                            count: stopCounts[stop] || 0,
                        }))
                    ),
                ],
                defaultExpanded: true,
            },
            {
                id: 'airlines',
                label: 'Airlines',
                icon: <AirlinesIcon fontSize="small" color="primary" />,
                filters: [
                    FilterBuilder.checkbox(
                        'airlines',
                        'Select Airlines',
                        filterOptions.airlines.map(airline => ({
                            value: airline,
                            label: airline,
                            count: airlineCounts[airline] || 0,
                        }))
                    ),
                ],
                defaultExpanded: true,
            },
            {
                id: 'time',
                label: 'Departure Time',
                icon: <TimeIcon fontSize="small" color="primary" />,
                filters: [
                    FilterBuilder.checkbox(
                        'timeOfDay',
                        'Time of Day',
                        [
                            { value: 'morning', label: 'Morning (6AM - 12PM)', count: timeCounts['morning'] || 0 },
                            { value: 'afternoon', label: 'Afternoon (12PM - 6PM)', count: timeCounts['afternoon'] || 0 },
                            { value: 'evening', label: 'Evening (6PM - 12AM)', count: timeCounts['evening'] || 0 },
                            { value: 'night', label: 'Night (12AM - 6AM)', count: timeCounts['night'] || 0 },
                        ]
                    ),
                ],
                defaultExpanded: variant === 'sidebar',
            },
        ];
    }, [flights, filterOptions, variant]);

    const filterFunctions = useMemo(() => {
        const getTimeOfDay = (dateString: string): string => {
            const hour = new Date(dateString).getHours();
            if (hour >= 6 && hour < 12) return 'morning';
            if (hour >= 12 && hour < 18) return 'afternoon';
            if (hour >= 18 && hour < 24) return 'evening';
            return 'night';
        };

        return {
            priceRange: createRangeFilter(f => Math.min(...Object.values(f.prices))),
            airlines: createMultiSelectFilter(f => f.airline),
            stops: createMultiSelectFilter(f => f.stops),
            timeOfDay: createMultiSelectFilter(f => getTimeOfDay(f.departureTime)),
        };
    }, [createRangeFilter, createMultiSelectFilter]);

    const {
        filterState,
        setFilterState,
        filteredData,
        groupsWithCounts,
        clearFilters,
    } = useGenericFilter({
        data: flights,
        groups,
        filterFunctions,
        debounceMs: 200,
    });

    React.useEffect(() => {
        if (onFilteredFlightsChange) onFilteredFlightsChange(filteredData);
    }, [filteredData, onFilteredFlightsChange]);

    return (
        <GenericFilter
            groups={groupsWithCounts}
            state={filterState}
            onChange={setFilterState}
            variant={variant}
            showClearButton
            showResultCount
            resultCount={filteredData.length}
            onClear={clearFilters}
            dense={variant === 'sidebar'}
        />
    );
};

export default FlightFilter;
