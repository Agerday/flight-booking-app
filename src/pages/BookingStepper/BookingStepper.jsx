import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import GenericStepper from '../../components/ui/GenericStepper/GenericStepper';
import FlightResultsStep from '../bookingSteps/FlightResultsStep';
import PassengerStep from '../bookingSteps/PassengerStep';
import SeatSelectionStep from '../bookingSteps/SeatSelectionStep';
import Confirmation from '../bookingSteps/ConfirmationStep';
import {BookingStepOrder, BookingSteps} from '../../app/constants/bookingSteps';
import SearchFlightStep from "../bookingSteps/SearchFlightStep";
import ExtrasStep from "../bookingSteps/ExtrasStep";
import PaymentStep from "../bookingSteps/PaymentStep";
import {resetBooking, resetFlight, setCurrentStep} from '../../redux/slices/bookingSlice';

const BookingStepper = () => {
    const dispatch = useDispatch();
    const currentStep = useSelector(state => state.booking.currentStep);
    const stepIndex = BookingStepOrder.indexOf(currentStep);
    const stepValidity = useSelector(state => state.booking.stepValidity);
    const isValid = stepValidity[currentStep] === true;

    const next = () => {
        if (stepIndex < BookingStepOrder.length - 1) {
            dispatch(setCurrentStep(BookingStepOrder[stepIndex + 1]));
        }
    };

    const back = () => {
        if (stepIndex > 0) {
            const prevStep = BookingStepOrder[stepIndex - 1];
            const current = BookingStepOrder[stepIndex];

            if (current === BookingSteps.RESULTS) {
                dispatch(resetBooking());
            } else if (current === BookingSteps.PASSENGER) {
                dispatch(resetFlight());
            }

            dispatch(setCurrentStep(prevStep));
        }
    };



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
            renderMap={renderMap}
            disableNext={!isValid}
            customLabels={{
                [BookingSteps.SEARCH]: 'Search Flights',
                [BookingSteps.PASSENGER]: 'Continue to seat selection',
                [BookingSteps.SEAT]: 'Validate Seat',
                [BookingSteps.EXTRAS]: 'Continue to payment',
                [BookingSteps.PAYMENT]: 'Confirm Booking',
            }}
            hidePreviousButton={{
                [BookingSteps.SEARCH]: true,
                [BookingSteps.CONFIRM]: true,
            }}
            hideNextButton={{
                [BookingSteps.RESULTS]: true,
                [BookingSteps.PAYMENT]: true,
                [BookingSteps.CONFIRM]: true
            }}
        />
    );
};

export default BookingStepper;
