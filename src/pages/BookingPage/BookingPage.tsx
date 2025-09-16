import React, {useMemo} from 'react';
import {Box} from '@mui/material';
import {useAppDispatch, useAppSelector} from '@/redux/hooks';
import {StepContent} from '@/components/ui/Stepper/StepContent';
import BookingSummary from '../../components/booking/Summary/BookingSummary';
import {Step} from '@/types/stepper.types';
import Stepper from '../../components/ui/Stepper/Stepper';
import FlightSearchStep from '../bookingSteps/FlightSearchStep';
import FlightResultsStep from '../bookingSteps/FlightResultsStep';
import PassengerStep from '../bookingSteps/PassengerStep';
import SeatSelectionStep from '../bookingSteps/SeatSelectionStep';
import ExtrasStep from '../bookingSteps/ExtrasStep';
import PaymentStep from '../bookingSteps/PaymentStep';
import ConfirmationStep from '../bookingSteps/ConfirmationStep';
import {resetBooking, setCurrentStep} from '@/redux/slices/bookingSlice';
import {BookingStep} from "@/types/booking.types";

const BookingPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const bookingState = useAppSelector(state => state.booking);

    const hasSummary = !!bookingState.data?.outboundFlight || !!bookingState.data?.returnFlight;
    const showFilterSidebar = bookingState.currentStep === BookingStep.RESULTS;

    const steps: Step[] = useMemo(() => [
        {id: 'search', label: 'Search Flights'},
        {id: 'results', label: 'Select Flight'},
        {id: 'passenger', label: 'Passenger Details'},
        {id: 'seats', label: 'Choose Seats'},
        {id: 'extras', label: 'Add Extras'},
        {id: 'payment', label: 'Payment'},
        {id: 'confirmation', label: 'Confirmation'},
    ], []);

    const initialStep = bookingState.currentStep || BookingStep.SEARCH;

    const handleStepChange = (currentStep: string, previousStep: string) => {
        if (currentStep === BookingStep.SEARCH && previousStep !== BookingStep.SEARCH) {
            dispatch(resetBooking());
        }
        dispatch(setCurrentStep(currentStep as BookingStep));
        window.scrollTo({top: 0, behavior: 'smooth'});
    };

    const handleComplete = () => {
        console.log('Booking completed!');
    };

    return (
        <Box
            sx={{
                background: 'url("https://images.unsplash.com/photo-1507525428034-b723cf961d3e") no-repeat center center',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                minHeight: '100vh',
                p: 3,
                display: 'flex',
                justifyContent: 'center',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    width: '100%',
                    maxWidth: 1400,
                    gap: 3,
                }}
            >
                {/* Filter Sidebar */}
                <Box
                    sx={{
                        width: 280,
                        minWidth: 280,
                        visibility: showFilterSidebar ? "visible" : "hidden",
                        position: 'sticky',
                        top: 50,
                        flexShrink: 0,
                    }}
                >
                    {showFilterSidebar && <div id="flight-filter-portal"/>}
                </Box>

                {/* Main Stepper Content */}
                <Box
                    sx={{
                        flexGrow: 1,
                        maxWidth: 900,
                        width: '100%',
                        transition: 'all 0.3s ease',
                    }}
                >
                    <Stepper
                        steps={steps}
                        initialStep={initialStep}
                        onStepChange={handleStepChange}
                        onComplete={handleComplete}
                        showNavigation={true}
                        confirmLabel="Complete Booking"
                        hideNextButton={bookingState.currentStep === BookingStep.PAYMENT
                            || bookingState.currentStep === BookingStep.CONFIRMATION}
                    >
                        <StepContent stepId="search">
                            <FlightSearchStep/>
                        </StepContent>

                        <StepContent stepId="results">
                            <FlightResultsStep showFilterInSidebar={showFilterSidebar}/>
                        </StepContent>

                        <StepContent stepId="passenger">
                            <PassengerStep/>
                        </StepContent>

                        <StepContent stepId="seats">
                            <SeatSelectionStep/>
                        </StepContent>

                        <StepContent stepId="extras">
                            <ExtrasStep/>
                        </StepContent>

                        <StepContent stepId="payment">
                            <PaymentStep/>
                        </StepContent>

                        <StepContent stepId="confirmation">
                            <ConfirmationStep/>
                        </StepContent>
                    </Stepper>
                </Box>

                {/* Summary Sidebar */}
                <Box
                    sx={{
                        width: 250,
                        minWidth: 250,
                        visibility: hasSummary ? "visible" : "hidden",
                        position: 'sticky',
                        top: 30,
                        flexShrink: 0,
                    }}
                >
                    {hasSummary && <BookingSummary/>}
                </Box>
            </Box>
        </Box>
    );
};

export default BookingPage;
