import {useCallback, useEffect, useMemo, useState} from 'react';
import {Flight} from '../types';
import {FlightFilters} from '../types/filter.types';

interface UseFlightFiltersProps {
    flights: Flight[];
    initialFilters?: Partial<FlightFilters>;
}

interface UseFlightFiltersReturn {
    filters: FlightFilters;
    filteredFlights: Flight[];
    filterOptions: {
        airlines: string[];
        stops: number[];
        priceRange: [number, number];
    };
    updateFilters: (filters: FlightFilters) => void;
    resetFilters: () => void;
    hasActiveFilters: boolean;
    getFilteredCount: (filterType: string, value: any) => number;
}

export const useFlightFilters = ({
                                     flights,
                                     initialFilters = {},
                                 }: UseFlightFiltersProps): UseFlightFiltersReturn => {
    const filterOptions = useMemo(() => {
        const airlines = new Set<string>();
        const stops = new Set<number>();
        let minPrice = Infinity;
        let maxPrice = 0;

        flights.forEach(flight => {
            airlines.add(flight.airline);
            stops.add(flight.stops);
            const economyPrice = flight.prices['economy'];
            minPrice = Math.min(minPrice, economyPrice);
            maxPrice = Math.max(maxPrice, economyPrice);
        });

        return {
            airlines: Array.from(airlines).sort(),
            stops: Array.from(stops).sort((a, b) => a - b),
            priceRange: [
                minPrice === Infinity ? 0 : minPrice,
                maxPrice === 0 ? 1000 : maxPrice,
            ] as [number, number],
        };
    }, [flights]);

    const [filters, setFilters] = useState<FlightFilters>({
        priceRange: initialFilters.priceRange || filterOptions.priceRange,
        airlines: initialFilters.airlines || [],
        stops: initialFilters.stops || [],
        timeOfDay: initialFilters.timeOfDay || [],
    });

    const [minPrice, maxPrice] = filterOptions.priceRange;

    useEffect(() => {
        setFilters(prev => ({
            ...prev,
            priceRange: [minPrice, maxPrice],
        }));
    }, [minPrice, maxPrice]);

    const filteredFlights = useMemo(() => {
        return flights.filter(flight => {
            const economyPrice = flight.prices['economy'];

            const priceInRange =
                economyPrice >= filters.priceRange[0] &&
                economyPrice <= filters.priceRange[1];

            const airlineMatch =
                filters.airlines.length === 0 ||
                filters.airlines.includes(flight.airline);

            const stopsMatch =
                filters.stops.length === 0 ||
                filters.stops.includes(flight.stops);

            return priceInRange && airlineMatch && stopsMatch;
        });
    }, [flights, filters]);

    const updateFilters = useCallback((newFilters: FlightFilters) => {
        setFilters(newFilters);
    }, []);

    const resetFilters = useCallback(() => {
        setFilters({
            priceRange: filterOptions.priceRange,
            airlines: [],
            stops: [],
            timeOfDay: [],
        });
    }, [filterOptions.priceRange]);

    const hasActiveFilters = useMemo(() => {
        return (
            filters.airlines.length > 0 ||
            filters.stops.length > 0 ||
            filters.priceRange[0] !== filterOptions.priceRange[0] ||
            filters.priceRange[1] !== filterOptions.priceRange[1]
        );
    }, [filters, filterOptions.priceRange]);

    const getFilteredCount = useCallback((filterType: string, value: any) => {
        return flights.filter(flight => {
            const economyPrice = flight.prices['economy'];

            if (economyPrice < filters.priceRange[0] || economyPrice > filters.priceRange[1]) {
                return false;
            }

            if (filterType === 'airline') {
                const stopsOk = filters.stops.length === 0 || filters.stops.includes(flight.stops);
                return flight.airline === value && stopsOk;
            }

            if (filterType === 'stops') {
                const airlineOk = filters.airlines.length === 0 || filters.airlines.includes(flight.airline);
                return flight.stops === value && airlineOk;
            }

            return false;
        }).length;
    }, [flights, filters]);

    return {
        filters,
        filteredFlights,
        filterOptions,
        updateFilters,
        resetFilters,
        hasActiveFilters,
        getFilteredCount,
    };
};