import React, {useEffect} from 'react';
import {Box, Divider, Typography} from '@mui/material';
import {FormProvider, useForm} from 'react-hook-form';
import CardGrid from '../../components/CardGrid/CardGrid';
import FlightCard from '../../components/FlightCard/FlightCard';
import {useBookingForm} from '../../context/BookingFormContext';
import mockFlights from '../../data/mockFlights';
import {filterFlights} from '../../app/utils/flightUtils';
import {BookingSteps} from '../../app/constants/bookingSteps';

const FlightResults = () => {
    const {formData, updateForm, updateStepValidity, currentStep, setCurrentStep} = useBookingForm();
    const methods = useForm({
        defaultValues: {
            selectedFlight: formData.selectedFlight || null,
        },
        mode: 'onChange',
    });

    const {watch, setValue, formState: {isValid}} = methods;

    const {origin: from, destination: to, departure: departureDate} = formData;
    const flights = filterFlights(mockFlights, from, to, departureDate);
    const isReturnTrip = formData.tripType === 'return';


    useEffect(() => {
        updateStepValidity(currentStep, isValid);
    }, [isValid, currentStep, updateStepValidity]);

    useEffect(() => {
        const subscription = watch((data) => {
            updateForm('selectedFlight', data.selectedFlight);
        });
        return () => subscription.unsubscribe();
    }, [watch, updateForm]);


    const handleSelectFlight = (flight) => {
        if (!isReturnTrip) {
            updateForm('selectedOutboundFlight', flight);
            setCurrentStep(BookingSteps.PASSENGER);
        } else if (!formData.selectedOutboundFlight) {
            updateForm('selectedOutboundFlight', flight);
        } else {
            updateForm('selectedReturnFlight', flight);
            setCurrentStep(BookingSteps.PASSENGER);
        }
    };

    return (
        <FormProvider {...methods}>
            <Typography variant="h5" gutterBottom>
                ✈️ Flights from <Box component="span" fontWeight="bold" color="primary.main">{from}</Box> to{' '}
                <Box component="span" fontWeight="bold" color="error.main">{to}</Box>
            </Typography>

            <Divider sx={{my: 2}}/>

            <CardGrid
                items={flights}
                renderItem={(flight) => (
                    <FlightCard key={flight.id} flight={flight} onSelect={handleSelectFlight}/>
                )}
            />
        </FormProvider>
    );
};

export default FlightResults;
