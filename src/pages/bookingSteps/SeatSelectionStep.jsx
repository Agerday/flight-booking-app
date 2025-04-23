import React, {useEffect, useState} from 'react';
import {Box, Typography} from '@mui/material';
import SeatMap from '../../components/booking/SeatMap/SeatMap';
import {useDispatch, useSelector} from 'react-redux';
import {updateForm, updateStepValidity} from '../../redux/slices/bookingSlice';
import PassengerNavigation from "../../components/booking/PassengerNavigation/PassengerNavigation";

const SeatSelectionStep = () => {
    const dispatch = useDispatch();
    const formData = useSelector(state => state.booking.formData);
    const currentStep = useSelector(state => state.booking.currentStep);

    const selectedClass = formData.flight.selectedClass;
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
        dispatch(updateForm({ key: 'passengers', value: updatedPassengers }));
    };

    const allSeatsSelected = formData.passengers.every(
        (p) => p.seat && p.seat.id
    );

    useEffect(() => {
        dispatch(updateStepValidity({ step: currentStep, isValid: allSeatsSelected }));
    }, [allSeatsSelected, currentStep, dispatch]);

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
                allowedClass={selectedClass}
            />

            {currentSeat && (
                <Typography mt={3} variant="h6" color="primary">
                    Selected seat: <strong>{currentSeat.id}</strong> —{' '}
                    <em>{currentSeat.class} class</em> — ${currentSeat.price}
                </Typography>
            )}

            <PassengerNavigation
                activeIndex={activePassengerIndex}
                maxIndex={passengerCount}
                onNext={() => setActivePassengerIndex(i => i + 1)}
                onPrev={() => setActivePassengerIndex(i => i - 1)}
            />

        </Box>
    );
};

export default SeatSelectionStep;
