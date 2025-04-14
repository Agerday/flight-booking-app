export const initialBookingForm = {
    // STEP 1
    initialInfos: {
        origin: '',
        destination: '',
        departure: '',
        returnDate: '',
        tripType: 'oneway',
        passengerNumber: 1,
    },

    flight: {
        id: null,
        from: '',
        to: '',
        airline: '',
        departureTime: '',
        arrivalTime: '',
        stops: 0,
        price: 0,
        selectedClass: '',
        prices: {
            economy: 0,
            premium: 0,
            business: 0,
        },
    },

    selectedReturnFlight: null,

    // STEP 3
    passengers: [
        {
            firstName: '',
            lastName: '',
            email: '',
            passport: '',
            nationality: '',
            dateOfBirth: '',
            gender: '',
            passportExpiry: '',
            seat: null
        },
    ],

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
        },
    },
};
