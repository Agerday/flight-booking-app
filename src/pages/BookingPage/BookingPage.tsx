import React, {useMemo} from 'react';
import {Box} from '@mui/material';
import {useAppDispatch, useAppSelector} from '../../redux/hooks';
import {StepContent} from '../../components/stepper/StepContent';
import BookingSummaryBox from '../../components/booking/Summary/BookingSummary';
import {Step} from '../../types/stepper.types';
import Stepper from '../../components/stepper/Stepper';
import FlightSearchStep from '../bookingSteps/FlightSearchStep';
import FlightResultsStep from '../bookingSteps/FlightResultsStep';
import PassengerStep from '../bookingSteps/PassengerStep';
import SeatSelectionStep from '../bookingSteps/SeatSelectionStep';
import ExtrasStep from '../bookingSteps/ExtrasStep';
import PaymentStep from '../bookingSteps/PaymentStep';
import ConfirmationStep from '../bookingSteps/ConfirmationStep';
import {resetBooking, setCurrentStep} from '../../redux/slices/bookingSlice';
import {BookingStep} from '../../types';

const BookingPage: React.FC = () => {
    const dispatch = useAppDispatch();
    const bookingState = useAppSelector(state => state.booking);

    const hasSummary = !!bookingState.data?.outboundFlight || !!bookingState.data?.returnFlight;
    const showFilterSidebar = bookingState.currentStep === BookingStep.RESULTS;

    const steps: Step[] = useMemo(() => [
        { id: 'search', label: 'Search Flights' },
        { id: 'results', label: 'Select Flight' },
        { id: 'passenger', label: 'Passenger Details' },
        { id: 'seats', label: 'Choose Seats' },
        { id: 'extras', label: 'Add Extras' },
        { id: 'payment', label: 'Payment' },
        { id: 'confirmation', label: 'Confirmation' },
    ], []);

    const initialStep = bookingState.currentStep || BookingStep.SEARCH;

    const handleStepChange = (currentStep: string, previousStep: string) => {
        if (currentStep === BookingStep.SEARCH && previousStep !== BookingStep.SEARCH) {
            dispatch(resetBooking());
        }
        dispatch(setCurrentStep(currentStep as BookingStep));
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleComplete = () => {
        console.log('Booking completed!');
    };

    const getContainerTransform = () => {
        const leftOffset = showFilterSidebar ? 150 : 0;
        const rightOffset = hasSummary ? 125 : 0;
        const netOffset = rightOffset - leftOffset;

        return netOffset !== 0 ? `translateX(${netOffset}px)` : 'none';
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
                position: 'relative',
            }}
        >
            <Box
                sx={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    width: '100%',
                    maxWidth: 1400,
                    gap: 3,
                    position: 'relative',
                }}
            >
                {/* Filter Sidebar */}
                {showFilterSidebar && (
                    <Box
                        sx={{
                            width: 280,
                            minWidth: 280,
                            position: 'sticky',
                            top: 5,
                            flexShrink: 0,
                            opacity: 0,
                            animation: 'slideInFromLeft 0.3s ease forwards',
                            '@keyframes slideInFromLeft': {
                                from: {
                                    opacity: 0,
                                    transform: 'translateX(-20px)',
                                },
                                to: {
                                    opacity: 1,
                                    transform: 'translateX(0)',
                                },
                            },
                        }}
                    >
                        <div id="flight-filter-portal" />
                    </Box>
                )}

                {/* Main Stepper Content */}
                <Box
                    sx={{
                        flexGrow: 1,
                        maxWidth: 900,
                        width: '100%',
                        transform: getContainerTransform(),
                        transition: 'transform 0.3s ease',
                    }}
                >
                    <Stepper
                        steps={steps}
                        initialStep={initialStep}
                        onStepChange={handleStepChange}
                        onComplete={handleComplete}
                        showNavigation={true}
                        confirmLabel="Complete Booking"
                    >
                        <StepContent stepId="search">
                            <FlightSearchStep />
                        </StepContent>

                        <StepContent stepId="results">
                            <FlightResultsStep showFilterInSidebar={showFilterSidebar} />
                        </StepContent>

                        <StepContent stepId="passenger">
                            <PassengerStep />
                        </StepContent>

                        <StepContent stepId="seats">
                            <SeatSelectionStep />
                        </StepContent>

                        <StepContent stepId="extras">
                            <ExtrasStep />
                        </StepContent>

                        <StepContent stepId="payment">
                            <PaymentStep />
                        </StepContent>

                        <StepContent stepId="confirmation">
                            <ConfirmationStep />
                        </StepContent>
                    </Stepper>
                </Box>

                {/* Summary Sidebar */}
                {hasSummary && (
                    <Box
                        sx={{
                            width: 250,
                            minWidth: 250,
                            position: 'sticky',
                            top: 5,
                            flexShrink: 0,
                            opacity: 0,
                            animation: 'slideInFromRight 0.3s ease forwards',
                            '@keyframes slideInFromRight': {
                                from: {
                                    opacity: 0,
                                    transform: 'translateX(20px)',
                                },
                                to: {
                                    opacity: 1,
                                    transform: 'translateX(0)',
                                },
                            },
                        }}
                    >
                        <BookingSummaryBox />
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default BookingPage;