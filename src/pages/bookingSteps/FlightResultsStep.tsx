import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {createPortal} from 'react-dom';
import {Alert, Box, Chip, Container, Tab, Tabs, Typography} from '@mui/material';
import {useAppDispatch, useAppSelector} from '@/redux/hooks';
import {selectOutboundFlight, selectReturnFlight} from '@/redux/slices/bookingSlice';
import {useStepper} from '@/hooks/useStepper';
import {Flight, FlightClass, TripType} from '@/types/booking.types';
import {getFilteredFlights} from '@/utils/flightSearch.utils';
import {mockFlights} from '@/data/mockFlights';
import CardGrid from '@/components/layout/CardGrid/CardGrid';
import FlightCard from '@/components/layout/FlightCard/FlightCard';
import FlightFilter from '@/components/booking/FlightFilter/FlightFilter';
import SelectedFlightsSummary from '@/components/booking/Summary/SelectedFlightSummary';

interface FlightResultsStepProps {
    showFilterInSidebar?: boolean;
}

interface EnhancedFlight extends Flight {
    selectedClass: FlightClass;
    price: number;
}

const FlightResultsStep: React.FC<FlightResultsStepProps> = ({showFilterInSidebar = false}) => {
    const dispatch = useAppDispatch();
    const {setCanGoNext} = useStepper();
    const {data: bookingData} = useAppSelector((state) => state.booking);
    const {search, outboundFlight, returnFlight} = bookingData;

    const isReturnTrip = search.tripType === TripType.RETURN;
    const [currentTab, setCurrentTab] = useState<0 | 1>(0);
    const [filteredFlights, setFilteredFlights] = useState<Flight[]>([]);

    const currentFlights = useMemo(() => {
        const isReturnTab = isReturnTrip && currentTab === 1;

        return getFilteredFlights(
            mockFlights,
            isReturnTab ? search.destination : search.origin,
            isReturnTab ? search.origin : search.destination,
            new Date(isReturnTab && search.returnDate ? search.returnDate : search.departureDate)
        );
    }, [isReturnTrip, currentTab, search]);

    useEffect(() => {
        setFilteredFlights(currentFlights);
    }, [currentFlights]);

    const canProceed = useMemo(() => {
        return isReturnTrip
            ? Boolean(outboundFlight && returnFlight)
            : Boolean(outboundFlight);
    }, [outboundFlight, returnFlight, isReturnTrip]);

    const currentDirection = useMemo(() => {
        const isReturnTab = isReturnTrip && currentTab === 1;
        return {
            from: isReturnTab ? search.destination : search.origin,
            to: isReturnTab ? search.origin : search.destination,
        };
    }, [isReturnTrip, currentTab, search]);

    useEffect(() => {
        setCanGoNext(canProceed);
    }, [canProceed, setCanGoNext]);

    const handleSelectFlight = useCallback((selectedFlight: EnhancedFlight) => {
        const flightWithPrice: Flight = {
            ...selectedFlight,
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

    const handleTabChange = useCallback((_: React.SyntheticEvent, newValue: number) => {
        setCurrentTab(newValue as 0 | 1);
    }, []);

    const handleFilteredFlightsChange = useCallback((flights: Flight[]) => {
        setFilteredFlights(flights);
    }, []);

    const getTabLabel = useCallback((index: number): React.ReactNode => {
        const flight = index === 0 ? outboundFlight : returnFlight;
        const label = index === 0 ? 'Outbound Flight' : 'Return Flight';

        return (
            <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                {flight && <Chip label="✓" size="small" color="success"/>}
                <Typography component="span">{label}</Typography>
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

    const portalTarget = showFilterInSidebar ? document.getElementById('flight-filter-portal') : null;

    return (
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

            {!showFilterInSidebar ? (
                <FlightFilter
                    flights={currentFlights}
                    variant="inline"
                    onFilteredFlightsChange={handleFilteredFlightsChange}
                />
            ) : null}

            {filteredFlights.length > 0 ? (
                <CardGrid
                    items={filteredFlights}
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
                        No flights match your filters
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Try adjusting your filters
                    </Typography>
                </Box>
            )}

            <SelectedFlightsSummary
                outboundFlight={outboundFlight}
                returnFlight={returnFlight}
                search={search}
            />

            {portalTarget && createPortal(
                <FlightFilter
                    flights={currentFlights}
                    variant="sidebar"
                    onFilteredFlightsChange={handleFilteredFlightsChange}
                />,
                portalTarget
            )}
        </Container>
    );
};

export default FlightResultsStep;