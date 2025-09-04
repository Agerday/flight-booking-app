import React, {useCallback, useEffect, useMemo, useState} from 'react';
import {Alert, Box, Typography} from '@mui/material';

import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import {assignSeat, calculateTotalPrice, setStepValid} from '../../redux/slices/bookingSlice';
import {useStepper} from '../../hooks/useStepper';
import {BookingStep, FlightClass, type Passenger, Seat} from '../../types';

import SeatMap from '../../components/booking/SeatMap/SeatMap';
import PassengerNavigation from '../../components/booking/PassengerNavigation/PassengerNavigation';

// Types
interface SeatSelectionState {
    currentPassenger: Passenger | null;
    currentSeat: Seat | null;
    reservedSeatIds: string[];
    allSeatsSelected: boolean;
    selectedClass: FlightClass;
    passengerCount: number;
}

const SeatSelectionStep: React.FC = () => {
    const dispatch = useAppDispatch();
    const {setCanGoNext} = useStepper();
    const {data: bookingData} = useAppSelector((state) => state.booking);

    const [activePassengerIndex, setActivePassengerIndex] = useState(0);

    // Memoized seat selection state
    const seatSelectionState = useMemo<SeatSelectionState>(() => {
        const selectedFlight = bookingData.outboundFlight;
        const passengerCount = bookingData.search.passengerCount;
        const currentPassenger = bookingData.passengers[activePassengerIndex] || null;
        const currentSeat = currentPassenger?.seat || null;
        const selectedClass = selectedFlight?.selectedClass || FlightClass.ECONOMY;

        // Get all reserved seat IDs (excluding current passenger)
        const reservedSeatIds = bookingData.passengers
            .filter((_, index) => index !== activePassengerIndex)
            .map(passenger => passenger.seat?.id)
            .filter((seatId): seatId is string => Boolean(seatId));

        // Check if all passengers have selected seats
        const allSeatsSelected = bookingData.passengers.length > 0 &&
            bookingData.passengers.every(passenger => Boolean(passenger.seat?.id));

        return {
            currentPassenger,
            currentSeat,
            reservedSeatIds,
            allSeatsSelected,
            selectedClass,
            passengerCount,
        };
    }, [bookingData, activePassengerIndex]);

    // Update stepper navigation state
    useEffect(() => {
        setCanGoNext(seatSelectionState.allSeatsSelected);
        dispatch(setStepValid({
            step: BookingStep.SEATS,
            isValid: seatSelectionState.allSeatsSelected
        }));
    }, [seatSelectionState.allSeatsSelected, setCanGoNext, dispatch]);

    // Recalculate total price when seats change
    useEffect(() => {
        dispatch(calculateTotalPrice());
    }, [dispatch, seatSelectionState.currentSeat]);

    // Event handlers
    const handleSeatSelect = useCallback((seat: Seat) => {
        if (!seatSelectionState.currentPassenger?.id) {
            console.error('No passenger ID found for seat assignment');
            return;
        }

        dispatch(assignSeat({
            passengerId: seatSelectionState.currentPassenger.id,
            seat
        }));
    }, [dispatch, seatSelectionState.currentPassenger?.id]);

    const handleNextPassenger = useCallback(() => {
        if (activePassengerIndex < seatSelectionState.passengerCount - 1) {
            setActivePassengerIndex(prev => prev + 1);
        }
    }, [activePassengerIndex, seatSelectionState.passengerCount]);

    const handlePreviousPassenger = useCallback(() => {
        if (activePassengerIndex > 0) {
            setActivePassengerIndex(prev => prev - 1);
        }
    }, [activePassengerIndex]);

    // Early return for error states
    if (!bookingData.outboundFlight) {
        return (
            <Box sx={{textAlign: 'center', p: 4}}>
                <Alert severity="error">
                    No flight selected. Please go back and select a flight.
                </Alert>
            </Box>
        );
    }

    if (seatSelectionState.passengerCount <= 0 || bookingData.passengers.length === 0) {
        return (
            <Box sx={{textAlign: 'center', p: 4}}>
                <Alert severity="error">
                    No passenger information found. Please go back and enter passenger details.
                </Alert>
            </Box>
        );
    }

    return (
        <Box sx={{textAlign: 'center'}}>
            <Typography variant="h4" gutterBottom fontWeight={600}>
                Select Your Seat
            </Typography>

            <Typography variant="h6" color="text.secondary" gutterBottom>
                Passenger {activePassengerIndex + 1} of {seatSelectionState.passengerCount}
                {seatSelectionState.currentPassenger && (
                    <Typography component="span" variant="body2" sx={{ml: 1}}>
                        ({seatSelectionState.currentPassenger.firstName} {seatSelectionState.currentPassenger.lastName})
                    </Typography>
                )}
            </Typography>

            {!seatSelectionState.allSeatsSelected && (
                <Alert severity="info" sx={{mb: 3, maxWidth: 600, mx: 'auto'}}>
                    Please select a seat for each passenger to continue.
                </Alert>
            )}

            <SeatMap
                selectedSeat={seatSelectionState.currentSeat}
                reservedSeatIds={seatSelectionState.reservedSeatIds}
                onSeatSelect={handleSeatSelect}
                allowedClass={seatSelectionState.selectedClass}
            />

            {seatSelectionState.currentSeat && (
                <Box sx={{mt: 3, p: 2, bgcolor: 'primary.light', borderRadius: 2, maxWidth: 400, mx: 'auto'}}>
                    <Typography variant="h6" color="primary.contrastText">
                        Selected Seat: <strong>{seatSelectionState.currentSeat.id}</strong>
                    </Typography>
                    <Typography variant="body2" color="primary.contrastText">
                        {seatSelectionState.currentSeat.class} class • €{seatSelectionState.currentSeat.price}
                    </Typography>
                </Box>
            )}

            {seatSelectionState.passengerCount > 1 && (
                <Box sx={{mt: 4}}>
                    <PassengerNavigation
                        activeIndex={activePassengerIndex}
                        maxIndex={seatSelectionState.passengerCount}
                        onNext={handleNextPassenger}
                        onPrev={handlePreviousPassenger}
                    />
                </Box>
            )}
        </Box>
    );
};

export default SeatSelectionStep;