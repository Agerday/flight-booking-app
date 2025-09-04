import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { BookingStep, BookingData, FlightSearchData, Flight, Passenger, GlobalAssistance, TripType } from '../../types/booking.types';

interface BookingState {
    currentStep: BookingStep;
    stepValidation: Record<BookingStep, boolean>;
    isLoading: boolean;
    error: string | null;
    data: BookingData;
}

const initialSearchData: FlightSearchData = {
    origin: '',
    destination: '',
    departureDate: new Date().toISOString(),
    returnDate: undefined,
    tripType: TripType.ONE_WAY,
    passengerCount: 1,
};

const initialBookingData: BookingData = {
    search: initialSearchData,
    outboundFlight: null,
    returnFlight: null,
    passengers: [],
    assistance: null,
    totalPrice: 0,
};

const initialState: BookingState = {
    currentStep: BookingStep.SEARCH,
    stepValidation: {
        [BookingStep.SEARCH]: false,
        [BookingStep.RESULTS]: false,
        [BookingStep.PASSENGER]: false,
        [BookingStep.SEATS]: false,
        [BookingStep.EXTRAS]: false,
        [BookingStep.PAYMENT]: false,
        [BookingStep.CONFIRMATION]: true,
    },
    isLoading: false,
    error: null,
    data: initialBookingData,
};

const bookingSlice = createSlice({
    name: 'booking',
    initialState,
    reducers: {
        goToStep: (state, action: PayloadAction<BookingStep>) => {
            state.currentStep = action.payload;
            state.error = null;
        },

        goToNextStep: (state) => {
            const currentIndex = Object.values(BookingStep).indexOf(state.currentStep);
            const nextStep = Object.values(BookingStep)[currentIndex + 1];
            if (nextStep && state.stepValidation[state.currentStep]) {
                state.currentStep = nextStep;
                state.error = null;
            }
        },

        goToPreviousStep: (state) => {
            const currentIndex = Object.values(BookingStep).indexOf(state.currentStep);
            const prevStep = Object.values(BookingStep)[currentIndex - 1];
            if (prevStep) {
                state.currentStep = prevStep;
                state.error = null;
            }
        },

        setStepValid: (state, action: PayloadAction<{ step: BookingStep; isValid: boolean }>) => {
            state.stepValidation[action.payload.step] = action.payload.isValid;
        },

        setLoading: (state, action: PayloadAction<boolean>) => {
            state.isLoading = action.payload;
        },

        setError: (state, action: PayloadAction<string | null>) => {
            state.error = action.payload;
        },

        updateSearchData: (state, action: PayloadAction<Partial<FlightSearchData>>) => {
            state.data.search = { ...state.data.search, ...action.payload };
            state.stepValidation[BookingStep.RESULTS] = false;
            state.stepValidation[BookingStep.PASSENGER] = false;
            state.stepValidation[BookingStep.SEATS] = false;
        },

        selectOutboundFlight: (state, action: PayloadAction<Flight>) => {
            state.data.outboundFlight = action.payload;
            state.data.passengers = [];
            state.stepValidation[BookingStep.PASSENGER] = false;
            state.stepValidation[BookingStep.SEATS] = false;
        },

        selectReturnFlight: (state, action: PayloadAction<Flight>) => {
            state.data.returnFlight = action.payload;
        },

        updatePassengers: (state, action: PayloadAction<Passenger[]>) => {
            state.data.passengers = action.payload;
        },

        updatePassenger: (state, action: PayloadAction<{ index: number; passenger: Partial<Passenger> }>) => {
            const { index, passenger } = action.payload;
            if (state.data.passengers[index]) {
                state.data.passengers[index] = { ...state.data.passengers[index], ...passenger };
            }
        },

        addPassenger: (state, action: PayloadAction<Passenger>) => {
            state.data.passengers.push(action.payload);
        },

        removePassenger: (state, action: PayloadAction<number>) => {
            state.data.passengers.splice(action.payload, 1);
        },

        assignSeat: (state, action: PayloadAction<{ passengerId: string; seat: Passenger['seat'] }>) => {
            const passenger = state.data.passengers.find(p => p.id === action.payload.passengerId);
            if (passenger) {
                passenger.seat = action.payload.seat;
            }
        },

        updateAssistance: (state, action: PayloadAction<GlobalAssistance | null>) => {
            state.data.assistance = action.payload;
        },

        calculateTotalPrice: (state) => {
            let total = 0;

            // Flight costs
            if (state.data.outboundFlight?.selectedPrice) {
                total += state.data.outboundFlight.selectedPrice * state.data.search.passengerCount;
            }
            if (state.data.returnFlight?.selectedPrice) {
                total += state.data.returnFlight.selectedPrice * state.data.search.passengerCount;
            }

            // Seat costs
            state.data.passengers.forEach(passenger => {
                if (passenger.seat?.price) {
                    total += passenger.seat.price;
                }
            });

            // Global assistance cost
            if (state.data.assistance?.price) {
                total += state.data.assistance.price;
            }

            // Individual passenger extras
            state.data.passengers.forEach(passenger => {
                if (passenger.extras?.checkedBaggage?.selected && passenger.extras.checkedBaggage.price) {
                    total += passenger.extras.checkedBaggage.price;
                }
                if (passenger.extras?.meals?.selected && passenger.extras.meals.price) {
                    total += passenger.extras.meals.price;
                }
                if (passenger.extras?.baggageInsurance?.selected && passenger.extras.baggageInsurance.price) {
                    total += passenger.extras.baggageInsurance.price;
                }
            });

            state.data.totalPrice = total;
        },

        resetBooking: () => {
            return initialState;
        },

        resetFromStep: (state, action: PayloadAction<BookingStep>) => {
            const resetStep = action.payload;
            const stepIndex = Object.values(BookingStep).indexOf(resetStep);

            Object.values(BookingStep).forEach((step, index) => {
                if (index >= stepIndex) {
                    state.stepValidation[step as BookingStep] = step === BookingStep.CONFIRMATION;
                }
            });

            switch (resetStep) {
                case BookingStep.RESULTS:
                    state.data.outboundFlight = null;
                    state.data.returnFlight = null;
                    break;
                case BookingStep.PASSENGER:
                    state.data.passengers = [];
                    break;
                case BookingStep.SEATS:
                    state.data.passengers.forEach(p => { p.seat = undefined; });
                    break;
                case BookingStep.EXTRAS:
                    state.data.assistance = null;
                    state.data.passengers.forEach(p => { p.extras = undefined; });
                    break;
            }

            state.data.totalPrice = 0;
        },
    },
});

export const {
    goToStep,
    goToNextStep,
    goToPreviousStep,
    setStepValid,
    setLoading,
    setError,
    updateSearchData,
    selectOutboundFlight,
    selectReturnFlight,
    updatePassengers,
    updatePassenger,
    addPassenger,
    removePassenger,
    assignSeat,
    updateAssistance,
    calculateTotalPrice,
    resetBooking,
    resetFromStep,
} = bookingSlice.actions;

export default bookingSlice.reducer;