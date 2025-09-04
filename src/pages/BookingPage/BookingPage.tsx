import React from 'react';
import { Box } from '@mui/material';
import { useAppSelector } from '../../redux/hooks';
import { StepContent } from '../../components/stepper/StepContent';
import BookingSummaryBox from '../../components/booking/Summary/BookingSummary';
import { Step } from '../../types/stepper.types';
import Stepper from '../../components/stepper/Stepper';
import FlightSearchStep from '../bookingSteps/FlightSearchStep';
import FlightResultsStep from "../bookingSteps/FlightResultsStep";
import PassengerStep from "../bookingSteps/PassengerStep";
import SeatSelectionStep from "../bookingSteps/SeatSelectionStep";

const ExtrasStep: React.FC = () => (
    <div>Payment - Coming Soon</div>

);const PaymentStep: React.FC = () => (
    <div>Payment - Coming Soon</div>
);
const ConfirmationStep: React.FC = () => (
    <div>Confirmation - Coming Soon</div>
);

const BookingPage: React.FC = () => {
    const bookingState = useAppSelector(state => state.booking);

    const hasSummary = !!bookingState.data?.outboundFlight;

    const steps: Step[] = [
        { id: 'search', label: 'Search Flights' },
        { id: 'results', label: 'Select Flight' },
        { id: 'passenger', label: 'Passenger Details' },
        { id: 'seats', label: 'Choose Seats' },
        { id: 'extras', label: 'Add Extras' },
        { id: 'payment', label: 'Payment' },
        { id: 'confirmation', label: 'Confirmation' },
    ];

    const handleStepChange = (currentStep: string, previousStep: string) => {
        console.log(`Step changed from ${previousStep} to ${currentStep}`);
        window.scrollTo({ top: 0, behavior: 'smooth' });
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
                    width: '100%',
                    maxWidth: 1200,
                    gap: 3,
                    transform: hasSummary ? 'translateX(12rem)' : 'none',
                    transition: 'transform 0.3s ease',
                }}
            >
                <Box sx={{ flexGrow: 1 }}>
                    <Stepper
                        steps={steps}
                        initialStep="search"
                        onStepChange={handleStepChange}
                        onComplete={handleComplete}
                        showNavigation={true}
                        confirmLabel="Complete Booking"
                    >
                        <StepContent stepId="search">
                            <FlightSearchStep />
                        </StepContent>

                        <StepContent stepId="results">
                            <FlightResultsStep />
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

                {hasSummary && (
                    <Box
                        sx={{
                            width: 250,
                            minWidth: 250,
                            position: 'sticky',
                            top: 5,
                            flexShrink: 0,
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