import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
    BookingData,
    BookingStep,
    Flight,
    FlightSearchData,
    GlobalAssistance,
    Passenger,
    TripType
} from '../../types';

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
        [BookingStep.SEATS]: true,
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
            state.stepValidation[BookingStep.SEATS] = true;
            state.stepValidation[BookingStep.EXTRAS] = false;
            state.stepValidation[BookingStep.PAYMENT] = false;
        },

        selectOutboundFlight: (state, action: PayloadAction<Flight>) => {
            state.data.outboundFlight = action.payload;
            state.data.passengers = [];
            state.stepValidation[BookingStep.PASSENGER] = false;
            state.stepValidation[BookingStep.SEATS] = true;
            state.stepValidation[BookingStep.EXTRAS] = false;
            state.stepValidation[BookingStep.PAYMENT] = false;
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

        assignSeat: (state, action: PayloadAction<{ passengerId: string; seat: Passenger['seat'] }>) => {
            const passenger = state.data.passengers.find(p => p.id === action.payload.passengerId);
            if (passenger) {
                passenger.seat = action.payload.seat;
            }
        },

        removeSeat: (state, action: PayloadAction<{ passengerId: string }>) => {
            const passenger = state.data.passengers.find(p => p.id === action.payload.passengerId);
            if (passenger) {
                passenger.seat = undefined;
            }
        },

        updateAssistance: (state, action: PayloadAction<GlobalAssistance | null>) => {
            state.data.assistance = action.payload;
        },

        calculateTotalPrice: (state) => {
            let total = 0;

            if (state.data.outboundFlight?.selectedPrice) {
                total += state.data.outboundFlight.selectedPrice * state.data.search.passengerCount;
            }
            if (state.data.returnFlight?.selectedPrice) {
                total += state.data.returnFlight.selectedPrice * state.data.search.passengerCount;
            }

            state.data.passengers.forEach(passenger => {
                if (passenger.seat?.price) {
                    total += passenger.seat.price;
                }
            });

            if (state.data.assistance?.price) {
                total += state.data.assistance.price;
            }

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

        resetFromStep: (state, action: PayloadAction<BookingStep>) => {
            const resetStep = action.payload;
            const stepOrder = Object.values(BookingStep);
            const stepIndex = stepOrder.indexOf(resetStep);

            stepOrder.forEach((step, index) => {
                if (index >= stepIndex) {
                    if (step === BookingStep.SEATS || step === BookingStep.CONFIRMATION) {
                        state.stepValidation[step as BookingStep] = true;
                    } else {
                        state.stepValidation[step as BookingStep] = false;
                    }
                }
            });

            switch (resetStep) {
                case BookingStep.RESULTS:
                    state.data.outboundFlight = null;
                    state.data.returnFlight = null;
                    state.data.passengers = [];
                    state.data.assistance = null;
                    break;
                case BookingStep.PASSENGER:
                    state.data.passengers = [];
                    state.data.assistance = null;
                    break;
                case BookingStep.SEATS:
                    state.data.passengers.forEach(p => {
                        p.seat = undefined;
                    });
                    break;
                case BookingStep.EXTRAS:
                    state.data.assistance = null;
                    state.data.passengers.forEach(p => {
                        p.extras = undefined;
                    });
                    break;
                case BookingStep.PAYMENT:
                    break;
            }

            state.data.totalPrice = 0;
        },
    },
});

export const {
    setStepValid,
    setLoading,
    setError,
    updateSearchData,
    selectOutboundFlight,
    selectReturnFlight,
    updatePassengers,
    updatePassenger,
    assignSeat,
    removeSeat,
    updateAssistance,
    calculateTotalPrice,
    resetFromStep,
} = bookingSlice.actions;

export default bookingSlice.reducer;