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
        const getStopsLabel = (stops: number) => {
            return stops === 0 ? 'Direct' : `${stops} Stop${stops > 1 ? 's' : ''}`;
        };

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
                        {
                            step: 10,
                            formatValue: (value) => `€${value}`,
                            icon: <MoneyIcon fontSize="small" />,
                        }
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
                            { value: 'morning', label: 'Morning (6AM - 12PM)' },
                            { value: 'afternoon', label: 'Afternoon (12PM - 6PM)' },
                            { value: 'evening', label: 'Evening (6PM - 12AM)' },
                            { value: 'night', label: 'Night (12AM - 6AM)' },
                        ]
                    ),
                ],
                defaultExpanded: variant === 'sidebar',
            },
        ];
    }, [filterOptions, variant]);

    const filterFunctions = useMemo(() => {
        const getTimeOfDay = (dateString: string): string => {
            const date = new Date(dateString);
            const hour = date.getHours();

            if (hour >= 6 && hour < 12) return 'morning';
            if (hour >= 12 && hour < 18) return 'afternoon';
            if (hour >= 18 && hour < 24) return 'evening';
            return 'night';
        };

        return {
            priceRange: createRangeFilter((flight) => {
                return Math.min(...Object.values(flight.prices));
            }),
            airlines: createMultiSelectFilter((flight) => flight.airline),
            stops: createMultiSelectFilter((flight) => flight.stops),
            timeOfDay: createMultiSelectFilter((flight) => getTimeOfDay(flight.departureTime)),
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
        if (onFilteredFlightsChange) {
            onFilteredFlightsChange(filteredData);
        }
    }, [filteredData, onFilteredFlightsChange]);

    return (
        <GenericFilter
            groups={groupsWithCounts}
            state={filterState}
            onChange={setFilterState}
            variant={variant}
            showClearButton={true}
            showResultCount={true}
            resultCount={filteredData.length}
            onClear={clearFilters}
            dense={variant === 'sidebar'}
        />
    );
};

export default FlightFilter;