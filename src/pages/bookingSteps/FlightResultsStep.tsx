import React, {useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Alert, Box, Chip, Container, Divider, Grid, Tab, Tabs, Typography} from '@mui/material';

import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import {selectOutboundFlight, selectReturnFlight} from '../../redux/slices/bookingSlice';
import {useStepper} from '../../hooks/useStepper';
import {Flight, FlightClass, TripType} from '../../types';
import {getFilteredFlights} from '../../utils/flightSearch.utils';
import {mockFlights} from '../../data/mockFlights';

import CardGrid from '../../components/layout/CardGrid/CardGrid';
import FlightCard from '../../components/layout/FlightCard/FlightCard';
import FlightFilter from '../../components/booking/FlightFilter/FlightFilter';

interface FlightFilters {
    priceRange: [number, number];
    airlines: string[];
    stops: number[];
    timeOfDay: string[];
}

interface FlightDirection {
    from: string;
    to: string;
}

interface FlightSelectionState {
    outboundFlight: Flight | null;
    returnFlight: Flight | null;
    canProceed: boolean;
}

interface EnhancedFlight extends Flight {
    selectedClass: FlightClass;
    price: number;
}

const FlightResultsStep: React.FC = () => {
    const dispatch = useAppDispatch();
    const {setCanGoNext} = useStepper();
    const {data: bookingData} = useAppSelector((state) => state.booking);
    const bottomRef = useRef<HTMLDivElement>(null);

    const {search, outboundFlight, returnFlight} = bookingData;
    const isReturnTrip = search.tripType === TripType.RETURN;

    const [currentTab, setCurrentTab] = useState<0 | 1>(0);
    const [filters, setFilters] = useState<FlightFilters>({
        priceRange: [0, 1000],
        airlines: [],
        stops: [],
        timeOfDay: []
    });

    const currentFlights = useMemo(() => {
        if (!isReturnTrip) {
            return getFilteredFlights(
                mockFlights,
                search.origin,
                search.destination,
                new Date(search.departureDate)
            );
        }

        if (currentTab === 0) {
            return getFilteredFlights(
                mockFlights,
                search.origin,
                search.destination,
                new Date(search.departureDate)
            );
        }

        return getFilteredFlights(
            mockFlights,
            search.destination,
            search.origin,
            search.returnDate ? new Date(search.returnDate) : new Date()
        );
    }, [isReturnTrip, currentTab, search]);

    const availableFlights = useMemo(() => {
        return currentFlights.filter(flight => {
            const minPrice = Math.min(...Object.values(flight.prices));
            const maxPrice = Math.max(...Object.values(flight.prices));

            const priceInRange = minPrice >= filters.priceRange[0] && maxPrice <= filters.priceRange[1];
            const airlineMatch = filters.airlines.length === 0 || filters.airlines.includes(flight.airline);
            const stopsMatch = filters.stops.length === 0 || filters.stops.includes(flight.stops);

            return priceInRange && airlineMatch && stopsMatch;
        });
    }, [currentFlights, filters]);

    const flightSelectionState = useMemo<FlightSelectionState>(() => {
        const canProceed = isReturnTrip
            ? Boolean(outboundFlight && returnFlight)
            : Boolean(outboundFlight);

        return {
            outboundFlight,
            returnFlight,
            canProceed
        };
    }, [outboundFlight, returnFlight, isReturnTrip]);

    const currentDirection = useMemo<FlightDirection>(() => {
        if (!isReturnTrip) {
            return {from: search.origin, to: search.destination};
        }

        return currentTab === 0
            ? {from: search.origin, to: search.destination}
            : {from: search.destination, to: search.origin};
    }, [isReturnTrip, currentTab, search.origin, search.destination]);

    useEffect(() => {
        if (currentFlights.length > 0) {
            const prices = currentFlights.flatMap(f => Object.values(f.prices));
            const minPrice = Math.min(...prices);
            const maxPrice = Math.max(...prices);

            setFilters(prev => ({
                ...prev,
                priceRange: [minPrice, maxPrice]
            }));
        }
    }, [currentFlights]);

    useEffect(() => {
        setCanGoNext(flightSelectionState.canProceed);
    }, [flightSelectionState.canProceed, setCanGoNext]);

    useEffect(() => {
        if (flightSelectionState.canProceed) {
            const timer = setTimeout(() => {
                bottomRef.current?.scrollIntoView({
                    behavior: 'smooth',
                    block: 'end'
                });
            }, 500);

            return () => clearTimeout(timer);
        }
    }, [flightSelectionState.canProceed]);

    const handleSelectFlight = useCallback((selectedFlight: EnhancedFlight) => {
        const flightWithPrice = {
            ...selectedFlight,
            selectedPrice: selectedFlight.price
        };

        if (!isReturnTrip || currentTab === 0) {
            dispatch(selectOutboundFlight(flightWithPrice));
        } else {
            dispatch(selectReturnFlight(flightWithPrice));
        }
    }, [dispatch, isReturnTrip, currentTab]);

    const handleTabChange = useCallback((_: React.SyntheticEvent, newValue: number) => {
        setCurrentTab(newValue as 0 | 1);
    }, []);

    const handleFiltersChange = useCallback((newFilters: FlightFilters) => {
        setFilters(newFilters);
    }, []);

    const getTabLabel = useCallback((index: number) => {
        const flight = index === 0 ? outboundFlight : returnFlight;
        const label = index === 0 ? 'Outbound Flight' : 'Return Flight';

        return (
            <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                {flight && <Chip label="✓" size="small" color="success"/>}
                <span>{label}</span>
                {flight && (
                    <Typography variant="caption" sx={{opacity: 0.7}}>
                        ({flight.airline})
                    </Typography>
                )}
            </Box>
        );
    }, [outboundFlight, returnFlight]);

    if (currentFlights.length === 0) {
        return (
            <Container maxWidth="lg">
                <Typography variant="h4" align="center" gutterBottom fontWeight={600}>
                    No Flights Available
                </Typography>
                <Alert severity="warning" sx={{mt: 3}}>
                    No flights found for your search criteria. Please go back and try different dates or destinations.
                </Alert>
            </Container>
        );
    }

    return (
        <>
            <Container maxWidth="lg">
                <Typography variant="h4" align="center" gutterBottom fontWeight={600}>
                    Select Your Flight{isReturnTrip ? 's' : ''}
                </Typography>

                {isReturnTrip && (
                    <Box sx={{mb: 3}}>
                        <Tabs
                            value={currentTab}
                            onChange={handleTabChange}
                            centered
                            sx={{
                                '& .MuiTab-root': {
                                    minWidth: 200,
                                    fontWeight: 500,
                                    textTransform: 'none',
                                },
                                '& .MuiTab-root.Mui-selected': {
                                    backgroundColor: 'primary.light',
                                    borderRadius: 1,
                                    color: 'primary.contrastText',
                                }
                            }}
                        >
                            <Tab label={getTabLabel(0)}/>
                            <Tab label={getTabLabel(1)}/>
                        </Tabs>
                    </Box>
                )}

                <Typography variant="h6" align="center" gutterBottom>
                    Flights from{' '}
                    <Box component="span" fontWeight="bold" color="primary.main">
                        {currentDirection.from}
                    </Box>{' '}
                    to{' '}
                    <Box component="span" fontWeight="bold" color="error.main">
                        {currentDirection.to}
                    </Box>
                </Typography>

                {isReturnTrip && (
                    <Alert
                        severity={
                            outboundFlight && returnFlight ? "success" :
                                outboundFlight ? "info" : "info"
                        }
                        sx={{mb: 3}}
                    >
                        {!outboundFlight && "Please select your outbound flight first"}
                        {outboundFlight && !returnFlight && "Great! Now select your return flight"}
                        {outboundFlight && returnFlight && "Both flights selected! You can proceed to the next step"}
                    </Alert>
                )}

                <FlightFilter
                    flights={currentFlights}
                    filters={filters}
                    onFiltersChange={handleFiltersChange}
                />

                <Divider sx={{my: 3}}/>

                {availableFlights.length > 0 ? (
                    <CardGrid
                        items={availableFlights}
                        renderItem={(flight) => (
                            <FlightCard
                                key={flight.id}
                                flight={flight}
                                onSelect={handleSelectFlight}
                            />
                        )}
                    />
                ) : (
                    <Box sx={{textAlign: 'center', py: 4}}>
                        <Typography variant="h6" color="text.secondary">
                            No flights available for your search criteria
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Try adjusting your filters or search different dates
                        </Typography>
                    </Box>
                )}

                {(outboundFlight || returnFlight) && (
                    <Box sx={{mt: 4, p: 3, bgcolor: 'grey.50', borderRadius: 2}}>
                        <Typography variant="h6" gutterBottom>
                            Selected Flights
                        </Typography>

                        <Grid container spacing={2}>
                            {outboundFlight && (
                                <Grid size={12}>
                                    <Typography variant="body2">
                                        <strong>Outbound:</strong> {outboundFlight.airline} - {search.origin} → {search.destination}
                                    </Typography>
                                </Grid>
                            )}

                            {returnFlight && (
                                <Grid size={12}>
                                    <Typography variant="body2">
                                        <strong>Return:</strong> {returnFlight.airline} - {search.destination} → {search.origin}
                                    </Typography>
                                </Grid>
                            )}
                        </Grid>
                    </Box>
                )}
            </Container>

            <div ref={bottomRef}/>
        </>
    );
};

export default FlightResultsStep;