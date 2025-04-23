import {createSlice} from '@reduxjs/toolkit';
import {initialBookingForm} from '../../app/constants/initialBookingForm';
import {BookingSteps} from "../../app/constants/bookingSteps";

const initialState = {
    currentStep: BookingSteps.SEARCH,
    stepValidity: {},
    formData: initialBookingForm,
};

const bookingSlice = createSlice({
    name: 'booking',
    initialState,
    reducers: {
        updateForm: (state, {payload: {key, value}}) => {
            state.formData[key] = value;
        },
        updateStepValidity: (state, {payload: {step, isValid}}) => {
            state.stepValidity[step] = isValid;
        },
        setCurrentStep: (state, {payload}) => {
            state.currentStep = payload;
        },
        resetFlight: (state) => {
            state.formData.flight = null
        },
        resetBooking: () => initialState
    },
});

export const {
    updateForm,
    updateStepValidity,
    setCurrentStep,
    resetBooking,
    resetFlight
} = bookingSlice.actions;

export default bookingSlice.reducer;
