import React, {useEffect} from 'react';
import {useBookingForm} from '../../context/BookingFormContext';
import GenericStepper from '../../components/ui/GenericStepper/GenericStepper';
import FlightResultsStep from '../bookingSteps/FlightResultsStep';
import PassengerStep from '../bookingSteps/PassengerStep';
import SeatSelectionStep from '../bookingSteps/SeatSelectionStep';
import Confirmation from '../bookingSteps/ConfirmationStep';
import {BookingSteps} from '../../app/constants/bookingSteps';
import {useStepNavigation} from '../../hooks/useStepNavigation';
import SearchFlightStep from "../bookingSteps/SearchFlightStep";
import ExtrasStep from "../bookingSteps/ExtrasStep";
import PaymentStep from "../bookingSteps/PaymentStep";

const BookingStepper = () => {
    const {currentStep, setCurrentStep, isValid} = useBookingForm();
    const {next, back} = useStepNavigation(currentStep, setCurrentStep);

    useEffect(() => {
        window.scrollTo({top: 0, behavior: 'smooth'});
    }, [currentStep]);

    const renderMap = {
        [BookingSteps.SEARCH]: <SearchFlightStep/>,
        [BookingSteps.RESULTS]: <FlightResultsStep/>,
        [BookingSteps.PASSENGER]: <PassengerStep/>,
        [BookingSteps.SEAT]: <SeatSelectionStep/>,
        [BookingSteps.EXTRAS]: <ExtrasStep/>,
        [BookingSteps.PAYMENT]: <PaymentStep/>,
        [BookingSteps.CONFIRM]: <Confirmation/>,
    };

    return (
        <GenericStepper
            currentStep={currentStep}
            onNext={next}
            onBack={back}
            isFinal={currentStep === BookingSteps.CONFIRM}
            renderMap={renderMap}
            disableNext={!isValid}
            customLabels={{
                [BookingSteps.SEARCH]: 'Search Flights',
                [BookingSteps.PASSENGER]: 'Continue to seat selection',
                [BookingSteps.SEAT]: 'Validate Seat',
                [BookingSteps.EXTRAS]: 'Continue to payment',
                [BookingSteps.PAYMENT]: 'Confirm Booking',
            }}
            hideNextButton={{
                [BookingSteps.RESULTS]: true,
                [BookingSteps.PAYMENT]: true
            }}
            firstStepKey={BookingSteps.SEARCH}
            background='url("https://images.unsplash.com/photo-1507525428034-b723cf961d3e")'
        />
    );
};

export default BookingStepper;
