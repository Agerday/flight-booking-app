import React, {useEffect} from 'react';
import {useBookingForm} from '../../context/BookingFormContext';
import GenericStepper from '../../components/ui/GenericStepper/GenericStepper';
import FlightResults from '../bookingSteps/FlightResults';
import PassengerForm from '../bookingSteps/PassengerForm';
import SeatSelection from '../bookingSteps/SeatSelection';
import ExtrasForm from '../bookingSteps/ExtrasForm';
import Confirmation from '../bookingSteps/Confirmation';
import {BookingSteps} from '../../app/constants/bookingSteps';
import {useStepNavigation} from '../../hooks/useStepNavigation';
import SearchForm from "../bookingSteps/SearchForm";

const BookingStepper = () => {
    const {currentStep, setCurrentStep, isValid} = useBookingForm();
    const {next, back} = useStepNavigation(currentStep, setCurrentStep);

    useEffect(() => {
        window.scrollTo({top: 0, behavior: 'smooth'});
    }, [currentStep]);

    const renderMap = {
        [BookingSteps.SEARCH]: <SearchForm/>,
        [BookingSteps.RESULTS]: <FlightResults/>,
        [BookingSteps.PASSENGER]: <PassengerForm/>,
        [BookingSteps.SEAT]: <SeatSelection/>,
        [BookingSteps.EXTRAS]: <ExtrasForm/>,
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
            }}
            hideNextButton={{
                [BookingSteps.RESULTS]: true,
            }}
            firstStepKey={BookingSteps.SEARCH}
            background='url("https://images.unsplash.com/photo-1507525428034-b723cf961d3e")'
        />
    );
};

export default BookingStepper;
