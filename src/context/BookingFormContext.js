import React, { createContext, useContext, useState, useEffect } from 'react';
import { BookingSteps } from '../app/constants/bookingSteps';
import { initialBookingForm } from '../app/constants/initialBookingForm';
import { validateAgainstSchema } from '../app/utils/validationUtils';
import { searchFormSchema } from '../app/validationSchemas/searchFormSchema';
import {passengerFormSchema} from "../app/validationSchemas/passengerFormSchema";

const stepSchemas = {
    [BookingSteps.SEARCH]: searchFormSchema,
    [BookingSteps.PASSENGER]: passengerFormSchema
};

const BookingFormContext = createContext();

export const BookingFormProvider = ({ children }) => {
    const [formData, setFormData] = useState(initialBookingForm);
    const [errors, setErrors] = useState({});
    const [stepValidity, setStepValidity] = useState({});
    const [currentStep, setCurrentStep] = useState(BookingSteps.SEARCH);

    useEffect(() => {
        const schema = stepSchemas[currentStep];
        if (!schema) return;

        const result = validateAgainstSchema(formData, schema);
        setErrors(result.errors);

        setStepValidity((prev) => {
            if (prev[currentStep] !== result.isValid) {
                return { ...prev, [currentStep]: result.isValid };
            }
            return prev;
        });
    }, [formData, currentStep]);

    const updateForm = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
        console.log(formData)
    };

    const updateStepValidity = (step, isValid) => {
        setStepValidity((prev) => {
            if (prev[step] !== isValid) {
                return { ...prev, [step]: isValid };
            }
            return prev;
        });
    };

    return (
        <BookingFormContext.Provider
            value={{
                formData,
                updateForm,
                errors,
                currentStep,
                setCurrentStep,
                updateStepValidity,
                isValid: stepValidity[currentStep] ?? false,
            }}
        >
            {children}
        </BookingFormContext.Provider>
    );
};

export const useBookingForm = () => useContext(BookingFormContext);
