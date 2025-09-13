export interface FlightFilters {
    priceRange: [number, number];
    airlines: string[];
    stops: number[];
    timeOfDay: string[];
}

export type FilterChangeHandler = (filters: FlightFilters) => void;

export interface FlightFilterProps {
    flights: any[];
    filters: FlightFilters;
    onFiltersChange: FilterChangeHandler;
    variant?: 'inline' | 'sidebar';
}