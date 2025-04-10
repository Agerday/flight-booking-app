export const initialBookingForm = {
    /*STEP 1*/
    origin: '',
    destination: '',
    departure: '',
    returnDate: '',
    tripType: 'oneway',
    passengers: 1,
    selectedOutboundFlight: null,
    selectedReturnFlight: null,

    /*STEP 3*/
    firstName: '',
    lastName: '',
    email: '',
    passport: '',
    nationality: '',
    dateOfBirth: '',
    gender: '',
    passportExpiry: '',

    /*STEP 4*/
    selectedSeatInfo: '',

    /*STEP 5*/
    extras: {
        insurance: '',
        assistance: '',
        checkedBaggage: false,
        meals: false,
        baggageInsurance: false,
    },

};
