export const initialBookingForm = {
    // STEP 1
    origin: '',
    destination: '',
    departure: '',
    returnDate: '',
    tripType: 'oneway',
    passengers: 1,
    selectedOutboundFlight: null,
    selectedReturnFlight: null,

    // STEP 3
    passenger: {
        firstName: '',
        lastName: '',
        email: '',
        passport: '',
        nationality: '',
        dateOfBirth: '',
        gender: '',
        passportExpiry: '',
    },

    // STEP 4
    selectedSeatInfo: {
        id: '',
        class: '',
        price: 0,
        row: null,
        seat: '',
    },

    // STEP 5 - EXTRAS
    extras: {
        assistance: {
            type: '',
            price: 0,
        },
        checkedBaggage: {
            selected: false,
            weight: '',
            price: 0,
        },
        meals: {
            selected: false,
            price: 0,
        },
        baggageInsurance: {
            selected: false,
            price: 0,
        }
    }
};
