import React, {useEffect} from 'react';
import {Box, Divider, Typography} from '@mui/material';
import {FormProvider, useForm} from 'react-hook-form';
import CardGrid from '../../components/flights/CardGrid/CardGrid';
import FlightCard from '../../components/flights/FlightCard/FlightCard';
import mockFlights from '../../data/mockFlights';
import {filterFlights} from '../../app/utils/flightUtils';
import {BookingSteps} from '../../app/constants/bookingSteps';
import {useDispatch, useSelector} from 'react-redux';
import {setCurrentStep, updateForm, updateStepValidity} from '../../redux/slices/bookingSlice';

const FlightResultsStep = () => {
    const dispatch = useDispatch();
    const formData = useSelector(state => state.booking.formData);
    const currentStep = useSelector(state => state.booking.currentStep);

    const methods = useForm({
        defaultValues: {
            flight: formData.flight,
        },
        mode: 'onChange',
    });

    const {watch, formState: {isValid}} = methods;
    const {origin: from, destination: to, departure: departureDate} = formData.initialInfos;
    const isReturnTrip = formData.initialInfos.tripType === 'return';
    const flights = filterFlights(mockFlights, from, to, departureDate);

    useEffect(() => {
        dispatch(updateStepValidity({step: currentStep, isValid}));
    }, [isValid, currentStep, dispatch]);

    useEffect(() => {
        const subscription = watch((data) => {
            dispatch(updateForm({key: 'flight', value: data.flight}));
        });
        return () => subscription.unsubscribe();
    }, [watch, dispatch]);

    const handleSelectFlight = (flight) => {
        if (!isReturnTrip) {
            dispatch(updateForm({key: 'flight', value: flight}));
            dispatch(setCurrentStep(BookingSteps.PASSENGER));
        } else if (!formData.flight) {
            dispatch(updateForm({key: 'flight', value: flight}));
        } else {
            dispatch(updateForm({key: 'returnFlight', value: flight}));
            dispatch(setCurrentStep(BookingSteps.PASSENGER));
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

export default FlightResultsStep;
