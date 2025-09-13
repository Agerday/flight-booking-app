import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { createPortal } from 'react-dom';
import { Alert, Box, Chip, Container, Tab, Tabs, Typography } from '@mui/material';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { selectOutboundFlight, selectReturnFlight } from '../../redux/slices/bookingSlice';
import { useStepper } from '../../hooks/useStepper';
import { useFlightFilters } from '../../hooks/useFlightFilters';
import { Flight, FlightClass, TripType } from '../../types';
import { getFilteredFlights } from '../../utils/flightSearch.utils';
import { mockFlights } from '../../data/mockFlights';
import CardGrid from '../../components/layout/CardGrid/CardGrid';
import FlightCard from '../../components/layout/FlightCard/FlightCard';
import FlightFilter from '../../components/booking/FlightFilter/FlightFilter';
import SelectedFlightsSummary from '../../components/booking/Summary/SelectedFlightSummary';

interface FlightResultsStepProps {
    showFilterInSidebar?: boolean;
}

interface EnhancedFlight extends Flight {
    selectedClass: FlightClass;
    price: number;
}

const FlightResultsStep: React.FC<FlightResultsStepProps> = ({ showFilterInSidebar = false }) => {
    const dispatch = useAppDispatch();
    const { setCanGoNext } = useStepper();
    const { data: bookingData } = useAppSelector((state) => state.booking);
    const { search, outboundFlight, returnFlight } = bookingData;

    const isReturnTrip = search.tripType === TripType.RETURN;
    const [currentTab, setCurrentTab] = useState<0 | 1>(0);

    // Get current flights based on tab and trip type
    const currentFlights = useMemo(() => {
        const isReturnTab = isReturnTrip && currentTab === 1;

        return getFilteredFlights(
            mockFlights,
            isReturnTab ? search.destination : search.origin,
            isReturnTab ? search.origin : search.destination,
            new Date(isReturnTab && search.returnDate ? search.returnDate : search.departureDate)
        );
    }, [isReturnTrip, currentTab, search]);

    // Use the flight filters hook
    const {
        filters,
        filteredFlights: availableFlights,
        updateFilters,
    } = useFlightFilters({ flights: currentFlights });

    // Check if can proceed
    const canProceed = useMemo(() => {
        return isReturnTrip
            ? Boolean(outboundFlight && returnFlight)
            : Boolean(outboundFlight);
    }, [outboundFlight, returnFlight, isReturnTrip]);

    // Current direction display
    const currentDirection = useMemo(() => {
        const isReturnTab = isReturnTrip && currentTab === 1;
        return {
            from: isReturnTab ? search.destination : search.origin,
            to: isReturnTab ? search.origin : search.destination,
        };
    }, [isReturnTrip, currentTab, search]);

    // Set stepper state
    useEffect(() => {
        setCanGoNext(canProceed);
    }, [canProceed, setCanGoNext]);

    // Handle flight selection
    const handleSelectFlight = useCallback((selectedFlight: EnhancedFlight) => {
        const flightWithPrice: Flight = {
            ...selectedFlight,
            departureTime: String(selectedFlight.departureTime),
            arrivalTime: String(selectedFlight.arrivalTime),
            selectedPrice: selectedFlight.price,
        };

        const isOutboundTab = !isReturnTrip || currentTab === 0;

        if (isOutboundTab) {
            dispatch(selectOutboundFlight(flightWithPrice));
            if (isReturnTrip && !returnFlight) setCurrentTab(1);
        } else {
            dispatch(selectReturnFlight(flightWithPrice));
        }
    }, [dispatch, isReturnTrip, currentTab, returnFlight]);

    // Handle tab change
    const handleTabChange = useCallback((_: React.SyntheticEvent, newValue: number) => {
        setCurrentTab(newValue as 0 | 1);
    }, []);

    // Get tab label with status
    const getTabLabel = useCallback((index: number) => {
        const flight = index === 0 ? outboundFlight : returnFlight;
        const label = index === 0 ? 'Outbound Flight' : 'Return Flight';

        return (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                {flight && <Chip label="✓" size="small" color="success" />}
                <span>{label}</span>
                {flight && (
                    <Typography variant="caption" sx={{ opacity: 0.7 }}>
                        ({flight.airline})
                    </Typography>
                )}
            </Box>
        );
    }, [outboundFlight, returnFlight]);

    // No flights available
    if (currentFlights.length === 0) {
        return (
            <Container maxWidth="lg">
                <Typography variant="h4" align="center" gutterBottom fontWeight={600}>
                    No Flights Available
                </Typography>
                <Alert severity="warning" sx={{ mt: 3 }}>
                    No flights found for your search criteria. Please go back and try different dates or destinations.
                </Alert>
            </Container>
        );
    }

    // Portal for sidebar filter
    const portalTarget = showFilterInSidebar ? document.getElementById('flight-filter-portal') : null;

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" align="center" gutterBottom fontWeight={600}>
                Select Your Flight{isReturnTrip ? 's' : ''}
            </Typography>

            {/* Tabs for return trips */}
            {isReturnTrip && (
                <Box sx={{ mb: 3 }}>
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
                        <Tab label={getTabLabel(0)} />
                        <Tab label={getTabLabel(1)} />
                    </Tabs>
                </Box>
            )}

            {/* Flight direction */}
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

            {/* Status alerts */}
            {isReturnTrip && (
                <Alert
                    severity={
                        outboundFlight && returnFlight ? "success" :
                            outboundFlight ? "info" : "info"
                    }
                    sx={{ mb: 3 }}
                >
                    {!outboundFlight && "Please select your outbound flight first"}
                    {outboundFlight && !returnFlight && "Great! Now select your return flight"}
                    {outboundFlight && returnFlight && "Both flights selected! You can proceed to the next step"}
                </Alert>
            )}

            {/* Inline filter when not in sidebar */}
            {!showFilterInSidebar && (
                <FlightFilter
                    flights={currentFlights}
                    filters={filters}
                    onFiltersChange={updateFilters}
                    variant="inline"
                />
            )}

            {/* Flight results */}
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
                <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="h6" color="text.secondary">
                        No flights match your filters
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Try adjusting your filters
                    </Typography>
                </Box>
            )}

            {/* Selected flights summary */}
            <SelectedFlightsSummary
                outboundFlight={outboundFlight}
                returnFlight={returnFlight}
                search={search}
            />

            {/* Portal render for sidebar filter */}
            {portalTarget && createPortal(
                <FlightFilter
                    flights={currentFlights}
                    filters={filters}
                    onFiltersChange={updateFilters}
                    variant="sidebar"
                />,
                portalTarget
            )}
        </Container>
    );
};

export default FlightResultsStep;