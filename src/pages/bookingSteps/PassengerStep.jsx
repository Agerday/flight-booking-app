import React, {useEffect, useState} from 'react';
import {Divider, Grid, Typography} from '@mui/material';
import {CreditCard, Email, Public, VpnKey, Wc as WcIcon} from '@mui/icons-material';
import {FormProvider, useForm} from 'react-hook-form';
import {useNavigate} from 'react-router-dom';
import {hasNumber, isEmail, minLength, required} from '../../app/utils/validators';
import {useBookingForm} from '../../context/BookingFormContext';
import PassportScanner from '../../components/booking/PassportScanner/PassportScanner';
import FormInput from '../../components/ui/FormInput/FormInput';
import {genderOptions} from '../../app/constants/genderOptions';
import FrostedCard from '../../components/layout/FrostedCard/FrostedCard';
import DatePickerInput from '../../components/ui/DatepickerInput/DatepickerInput';
import {createEmptyPassenger} from "../../app/utils/formUtils";

const PassengerStep = () => {
    const {formData, updateForm, updateStepValidity, currentStep} = useBookingForm();
    const navigate = useNavigate();
    const [autoFilledFields, setAutoFilledFields] = useState({});

    const initializePassengers = (passengers, passengerNumber) => {
        if (passengers?.length) {
            return passengers.map(p => ({
                ...createEmptyPassenger(),
                ...p,
            }));
        }

        return Array.from({length: passengerNumber}, () => createEmptyPassenger());
    };

    const methods = useForm({
        defaultValues: {
            passengers: initializePassengers(formData.passengers, formData.initialInfos.passengerNumber),
        },
        mode: 'onBlur',
        reValidateMode: 'onChange',
    });

    const {
        handleSubmit,
        setValue,
        watch,
        formState: {isValid, touchedFields}
    } = methods;

    const watchAll = watch();

    const showWarning = (field) =>
        autoFilledFields[field] && watchAll[field] && !touchedFields[field];

    useEffect(() => {
        updateStepValidity(currentStep, isValid);
    }, [isValid, currentStep, updateStepValidity]);

    useEffect(() => {
        const subscription = watch((data) => {
            updateForm('passengers', data.passengers);
        });
        return () => subscription.unsubscribe();
    }, [watch, updateForm]);

    const onSubmit = (data) => {
        updateForm('passengers', data.passengers);
        const stored = JSON.parse(localStorage.getItem('myBookings')) || [];
        const updated = [...new Set([...stored, formData.flight?.id])];
        localStorage.setItem('myBookings', JSON.stringify(updated));
        navigate('/my-bookings');
    };

    const handleScanComplete = (scannedData) => {
        const filled = {};
        Object.entries(scannedData).forEach(([key, value]) => {
            const path = `passengers.0.${key}`;
            setValue(path, value, {shouldValidate: true});
            filled[path] = true;
        });
        window.scrollTo({top: 0, behavior: 'smooth'});
        setAutoFilledFields(filled);
    };

    return (
        <>
            <Typography variant="h4" gutterBottom>📝 Passengers Details</Typography>
            <Divider sx={{my: 2}}/>

            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    {Array.from({length: formData.initialInfos.passengerNumber}).map((_, index) => (
                        <FrostedCard key={index}>
                            <Typography variant="h6" gutterBottom>Passenger {index + 1}</Typography>
                            <Grid container spacing={2}>
                                <Grid size={6}>
                                    <FormInput
                                        name={`passengers.${index}.firstName`}
                                        label="First Name *"
                                        placeholder="e.g. Adrien"
                                        icon={<CreditCard/>}
                                        validators={[required]}
                                    />
                                </Grid>
                                <Grid size={6}>
                                    <FormInput
                                        name={`passengers.${index}.lastName`}
                                        label="Last Name *"
                                        placeholder="e.g. Gerday"
                                        icon={<CreditCard/>}
                                        validators={[required]}
                                    />
                                </Grid>
                                <Grid size={6}>
                                    <FormInput
                                        name={`passengers.${index}.email`}
                                        label="Email *"
                                        placeholder="e.g. adrien@airline.com"
                                        icon={<Email/>}
                                        type="email"
                                        validators={[required, isEmail]}
                                    />
                                </Grid>
                                <Grid size={3}>
                                    <FormInput
                                        name={`passengers.${index}.nationality`}
                                        label="Nationality *"
                                        placeholder="e.g. Belgium"
                                        icon={<Public/>}
                                        validators={[required]}
                                    />
                                </Grid>
                                <Grid size={3}>
                                    <FormInput
                                        name={`passengers.${index}.gender`}
                                        label="Gender *"
                                        icon={<WcIcon/>}
                                        isSelect
                                        options={genderOptions}
                                        validators={[required]}
                                    />
                                </Grid>
                                <Grid size={4}>
                                    <DatePickerInput
                                        name={`passengers.${index}.dateOfBirth`}
                                        label="Date of Birth *"
                                        validators={[required]}
                                    />
                                </Grid>
                                <Grid size={4}>
                                    <FormInput
                                        name={`passengers.${index}.passport`}
                                        label="Passport Number *"
                                        placeholder="e.g. SPEC2014"
                                        icon={<VpnKey/>}
                                        validators={[required, minLength(6), hasNumber]}
                                    />
                                </Grid>
                                <Grid size={4}>
                                    <DatePickerInput
                                        name={`passengers.${index}.passportExpiry`}
                                        label="Passport Expiration Date *"
                                        validators={[required]}
                                    />
                                </Grid>
                            </Grid>
                        </FrostedCard>
                    ))}

                    <FrostedCard>
                        <PassportScanner onScanComplete={handleScanComplete}/>
                    </FrostedCard>
                </form>
            </FormProvider>
        </>
    );
};

export default PassengerStep;
