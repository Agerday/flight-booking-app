import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Stack } from '@mui/material';
import SeatMap from '../../components/booking/SeatMap/SeatMap';
import { useBookingForm } from '../../context/BookingFormContext';

const SeatSelectionStep = () => {
    const {
        formData,
        updateForm,
        updateStepValidity,
        currentStep
    } = useBookingForm();

    const passengerCount = formData.initialInfos?.passengerNumber || 1;
    const [activePassengerIndex, setActivePassengerIndex] = useState(0);

    const currentSeat = formData.passengers?.[activePassengerIndex]?.seat || null;

    const reservedSeatIds = formData.passengers
        .filter((_, i) => i !== activePassengerIndex)
        .map(p => p.seat?.id)
        .filter(Boolean);

    const handleSeatSelect = (seat) => {
        const updatedPassengers = [...formData.passengers];
        updatedPassengers[activePassengerIndex] = {
            ...updatedPassengers[activePassengerIndex],
            seat,
        };
        updateForm('passengers', updatedPassengers);
    };

    const allSeatsSelected = formData.passengers.every(
        (p) => p.seat && p.seat.id
    );

    useEffect(() => {
        updateStepValidity(currentStep, allSeatsSelected);
    }, [allSeatsSelected, currentStep, updateStepValidity]);

    return (
        <Box textAlign="center">
            <Typography variant="h4" gutterBottom>
                ✈️ Select Your Seat
            </Typography>

            <Typography variant="h6" gutterBottom>
                Passenger {activePassengerIndex + 1} of {passengerCount}
            </Typography>

            <SeatMap
                selectedSeat={currentSeat}
                reservedSeatIds={reservedSeatIds}
                onSeatSelect={handleSeatSelect}
            />

            {currentSeat && (
                <Typography mt={3} variant="h6" color="primary">
                    Selected seat: <strong>{currentSeat.id}</strong> —{' '}
                    <em>{currentSeat.class} class</em> — ${currentSeat.price}
                </Typography>
            )}

            <Stack direction="row" justifyContent="center" spacing={2} mt={4}>
                <Button
                    disabled={activePassengerIndex === 0}
                    onClick={() => setActivePassengerIndex((i) => i - 1)}
                >
                    ⬅️ Previous
                </Button>

                <Button
                    disabled={activePassengerIndex === passengerCount - 1}
                    onClick={() => setActivePassengerIndex((i) => i + 1)}
                >
                    Next ➡️
                </Button>
            </Stack>
        </Box>
    );
};

export default SeatSelectionStep;
