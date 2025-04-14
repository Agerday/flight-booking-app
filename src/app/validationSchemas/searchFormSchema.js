import {required} from '../utils/validators';

export const searchFormSchema = {
    origin: [required],
    destination: [required],
    departure: [required],
    tripType: [required],
    passengerNumber: [(val) => (val > 0 ? true : 'At least 1 passenger required')],
    returnDate: (formData) =>
        formData.tripType === 'return' ? [required] : [],
};