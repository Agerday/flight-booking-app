import {createSlice, PayloadAction} from '@reduxjs/toolkit';
import {
    BookingData,
    BookingStep,
    Flight,
    FlightSearchData,
    GlobalAssistance,
    Passenger,
    TripType
} from "@/types/booking.types";

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
        setCurrentStep: (state, action: PayloadAction<BookingStep>) => {
            state.currentStep = action.payload;
        },

        setStepValid: (state, action: PayloadAction<{ step: BookingStep; isValid: boolean }>) => {
            state.stepValidation[action.payload.step] = action.payload.isValid;
        },

        updateSearchData: (state, action: PayloadAction<Partial<FlightSearchData>>) => {
            state.data.search = {...state.data.search, ...action.payload};
        },

        selectOutboundFlight: (state, action: PayloadAction<Flight>) => {
            state.data.outboundFlight = action.payload;
            if (state.data.passengers.length !== state.data.search.passengerCount) {
                state.data.passengers = [];
                state.stepValidation[BookingStep.PASSENGER] = false;
            }
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
            const {index, passenger} = action.payload;
            if (state.data.passengers[index]) {
                state.data.passengers[index] = {...state.data.passengers[index], ...passenger};
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

        resetBooking: () => initialState,
    },
});

export const {
    setCurrentStep,
    setStepValid,
    updateSearchData,
    selectOutboundFlight,
    selectReturnFlight,
    updatePassengers,
    updatePassenger,
    assignSeat,
    removeSeat,
    updateAssistance,
    calculateTotalPrice,
    resetBooking,
} = bookingSlice.actions;

export default bookingSlice.reducer;
