export const createEmptyPassenger = () => ({
    firstName: '',
    lastName: '',
    email: '',
    passport: '',
    nationality: '',
    dateOfBirth: '',
    gender: '',
    passportExpiry: '',
    seat: null,
    extras: {
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
    }
});
