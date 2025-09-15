import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Alert, Box, Button, Chip, Container, Grid, Paper, Stack, Tab, Tabs, Typography,} from '@mui/material';
import {AirlineSeatReclineNormal, ArrowForward, CheckCircle, FlightLand, FlightTakeoff,} from '@mui/icons-material';

import {useAppDispatch, useAppSelector} from '@/redux/hooks';
import {assignSeat, removeSeat, setStepValid} from '@/redux/slices/bookingSlice';
import {useStepper} from '../../hooks/useStepper';
import {BookingStep, FlightClass, Seat, TripType} from '@/types/booking.types';
import SeatMap from '../../components/booking/SeatMap/SeatMap';

type FlightDirection = 'outbound' | 'return';

interface PassengerSeat {
    outbound?: Seat;
    return?: Seat;
}

const SeatSelectionStep: React.FC = () => {
    const dispatch = useAppDispatch();
    const {setCanGoNext} = useStepper();
    const {data: bookingData} = useAppSelector((state) => state.booking);

    const [selectedPassengerIndex, setSelectedPassengerIndex] = useState(0);
    const [showSeatMap, setShowSeatMap] = useState(false);
    const [currentFlight, setCurrentFlight] = useState<FlightDirection>('outbound');

    const {passengers, outboundFlight, returnFlight, search} = bookingData;
    const isReturnTrip = search.tripType === TripType.RETURN && returnFlight;
    const activeFlight = currentFlight === 'outbound' ? outboundFlight : returnFlight;
    const selectedClass = activeFlight?.selectedClass || FlightClass.ECONOMY;

    const [passengerSeats, setPassengerSeats] = useState<Map<string, PassengerSeat>>(new Map());

    useEffect(() => {
        const seatsMap = new Map<string, PassengerSeat>();
        passengers.forEach(p => {
            if (p.seat) {
                seatsMap.set(p.id, {outbound: p.seat});
            }
        });
        setPassengerSeats(seatsMap);
    }, []);

    const currentPassenger = passengers[selectedPassengerIndex];
    const currentPassengerSeats = passengerSeats.get(currentPassenger?.id || '') || {};
    const selectedSeat = currentFlight === 'outbound'
        ? currentPassengerSeats.outbound
        : currentPassengerSeats.return;

    const reservedSeatIds = useMemo(() => {
        const reserved: string[] = [];
        passengers.forEach((p, idx) => {
            if (idx !== selectedPassengerIndex) {
                const seats = passengerSeats.get(p.id);
                const seat = currentFlight === 'outbound' ? seats?.outbound : seats?.return;
                if (seat?.id) reserved.push(seat.id);
            }
        });
        return reserved;
    }, [passengers, selectedPassengerIndex, passengerSeats, currentFlight]);

    useEffect(() => {
        setCanGoNext(true);
        dispatch(setStepValid({step: BookingStep.SEATS, isValid: true}));
    }, [setCanGoNext, dispatch]);

    const handleSeatSelect = useCallback((seat: Seat) => {
        if (!currentPassenger) return;

        setPassengerSeats(prev => {
            const newMap = new Map(prev);
            const current = newMap.get(currentPassenger.id) || {};

            if (selectedSeat?.id === seat.id) {
                if (currentFlight === 'outbound') {
                    delete current.outbound;
                } else {
                    delete current.return;
                }

                const remainingSeat = currentFlight === 'outbound' ? current.return : current.outbound;
                if (remainingSeat) {
                    dispatch(assignSeat({passengerId: currentPassenger.id, seat: remainingSeat}));
                } else {
                    dispatch(removeSeat({passengerId: currentPassenger.id}));
                }
            } else {
                if (currentFlight === 'outbound') {
                    current.outbound = seat;
                } else {
                    current.return = seat;
                }

                dispatch(assignSeat({passengerId: currentPassenger.id, seat}));
            }

            if (Object.keys(current).length > 0) {
                newMap.set(currentPassenger.id, current);
            } else {
                newMap.delete(currentPassenger.id);
            }

            return newMap;
        });
    }, [dispatch, currentPassenger, selectedSeat, currentFlight]);

    const handleSkipAll = useCallback(() => {
        passengers.forEach(p => dispatch(removeSeat({passengerId: p.id})));
        setPassengerSeats(new Map());
        setShowSeatMap(false);
    }, [passengers, dispatch]);

    const handleRemoveSeat = useCallback((passengerId: string, flight: FlightDirection) => {
        setPassengerSeats(prev => {
            const newMap = new Map(prev);
            const current = newMap.get(passengerId) || {};

            if (flight === 'outbound') {
                delete current.outbound;
            } else {
                delete current.return;
            }

            if (Object.keys(current).length > 0) {
                newMap.set(passengerId, current);
                const remainingSeat = flight === 'outbound' ? current.return : current.outbound;
                if (remainingSeat) {
                    dispatch(assignSeat({passengerId, seat: remainingSeat}));
                }
            } else {
                newMap.delete(passengerId);
                dispatch(removeSeat({passengerId}));
            }

            return newMap;
        });
    }, [dispatch]);

    const totalSeatCost = useMemo(() => {
        let total = 0;
        passengerSeats.forEach(seats => {
            if (seats.outbound) total += seats.outbound.price || 0;
            if (seats.return) total += seats.return.price || 0;
        });
        return total;
    }, [passengerSeats]);

    const seatsSelected = useMemo(() => {
        let count = 0;
        passengerSeats.forEach(seats => {
            if (seats.outbound) count++;
            if (seats.return) count++;
        });
        return count;
    }, [passengerSeats]);

    const maxSeats = isReturnTrip ? passengers.length * 2 : passengers.length;

    if (!passengers.length) {
        return (
            <Container maxWidth="lg">
                <Alert severity="error">
                    No passenger information found. Please complete the passenger details first.
                </Alert>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" gutterBottom fontWeight={600}>
                💺 Select Your Seats
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{mb: 3}}>
                Optional - Skip for free automatic assignment at check-in
            </Typography>

            {/* Flight tabs */}
            {isReturnTrip && showSeatMap && (
                <Paper sx={{mb: 3}}>
                    <Tabs
                        value={currentFlight}
                        onChange={(_, val) => setCurrentFlight(val)}
                        variant="fullWidth"
                    >
                        <Tab
                            value="outbound"
                            label={`Outbound: ${search.origin} → ${search.destination}`}
                            icon={<FlightTakeoff/>}
                            iconPosition="start"
                        />
                        <Tab
                            value="return"
                            label={`Return: ${search.destination} → ${search.origin}`}
                            icon={<FlightLand/>}
                            iconPosition="start"
                        />
                    </Tabs>
                </Paper>
            )}

            <Grid container spacing={3}>
                {/* Left column: progress, passenger list, actions */}
                <Grid size={4}>
                    <Paper sx={{p: 3, mb: 2}}>
                        <Stack spacing={2}>
                            {/* Seat selection progress + total cost */}
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary">
                                    Progress: {seatsSelected}/{maxSeats} seats
                                </Typography>
                                {totalSeatCost > 0 && (
                                    <Typography variant="h6" color="primary">
                                        +€{totalSeatCost}
                                    </Typography>
                                )}
                            </Box>

                            {/* Toggle seat map button */}
                            <Button
                                variant={showSeatMap ? "contained" : "outlined"}
                                startIcon={<AirlineSeatReclineNormal/>}
                                onClick={() => setShowSeatMap(!showSeatMap)}
                                fullWidth
                            >
                                {showSeatMap ? "Hide Map" : "Select Seats"}
                            </Button>

                            {/* Skip seat selection */}
                            <Button
                                variant="text"
                                startIcon={<ArrowForward/>}
                                onClick={handleSkipAll}
                                fullWidth
                            >
                                Skip All & Continue
                            </Button>
                        </Stack>
                    </Paper>

                    {/* Passenger list with selected seats */}
                    <Typography variant="h6" gutterBottom>
                        Passengers
                    </Typography>

                    <Stack spacing={1}>
                        {passengers.map((p, idx) => {
                            const seats = passengerSeats.get(p.id) || {};
                            const hasAnySeats = seats.outbound || seats.return;

                            return (
                                <Paper
                                    key={p.id}
                                    sx={{
                                        p: 2,
                                        cursor: 'pointer',
                                        borderLeft: 3,
                                        borderColor: idx === selectedPassengerIndex ? 'primary.main' : 'transparent',
                                        bgcolor: idx === selectedPassengerIndex ? 'primary.50' : 'background.paper',
                                    }}
                                    onClick={() => {
                                        setSelectedPassengerIndex(idx);
                                        setShowSeatMap(true);
                                    }}
                                >
                                    <Stack spacing={1}>
                                        {/* Passenger name + check if seats assigned */}
                                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                                            <Typography variant="subtitle2">
                                                {p.firstName} {p.lastName}
                                            </Typography>
                                            {hasAnySeats && <CheckCircle color="success" fontSize="small"/>}
                                        </Stack>

                                        {/* Outbound + Return seat chips */}
                                        <Stack direction="row" spacing={0.5} flexWrap="wrap">
                                            {seats.outbound && (
                                                <Chip
                                                    label={`↗ ${seats.outbound.row}${seats.outbound.letter} €${seats.outbound.price}`}
                                                    size="small"
                                                    onDelete={() => handleRemoveSeat(p.id, 'outbound')}
                                                />
                                            )}
                                            {seats.return && (
                                                <Chip
                                                    label={`↙ ${seats.return.row}${seats.return.letter} €${seats.return.price}`}
                                                    size="small"
                                                    color="secondary"
                                                    onDelete={() => handleRemoveSeat(p.id, 'return')}
                                                />
                                            )}
                                        </Stack>
                                    </Stack>
                                </Paper>
                            );
                        })}
                    </Stack>
                </Grid>

                {/* Right column: seat map or placeholder */}
                <Grid size={8}>
                    {showSeatMap && activeFlight ? (
                        <Paper sx={{p: 3}}>
                            {/* Active flight + passenger info */}
                            <Typography variant="h6" gutterBottom>
                                {currentFlight === 'outbound' ? 'Outbound' : 'Return'} Flight
                                - {currentPassenger?.firstName} {currentPassenger?.lastName}
                            </Typography>

                            {/* Seat map */}
                            <SeatMap
                                onSeatSelect={handleSeatSelect}
                                selectedSeat={selectedSeat || null}
                                reservedSeatIds={reservedSeatIds}
                                allowedClass={selectedClass}
                            />
                        </Paper>
                    ) : (
                        /* Placeholder when no seat map visible */
                        <Paper sx={{
                            minHeight: 400,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexDirection: 'column',
                            gap: 2,
                            p: 4
                        }}>
                            <AirlineSeatReclineNormal sx={{fontSize: 60, color: 'text.secondary'}}/>
                            <Typography variant="h5">No Seat Selection</Typography>
                            <Typography variant="body2" color="text.secondary" textAlign="center">
                                Click "Select Seats" or a passenger to begin
                            </Typography>
                        </Paper>
                    )}
                </Grid>
            </Grid>
        </Container>
    );
};

export default SeatSelectionStep;
