import React, { useEffect, useState } from 'react';
import { Box, Divider, Grid, Typography } from '@mui/material';
import { CreditCard, Email, Public, VpnKey, Wc as WcIcon } from '@mui/icons-material';
import { FormProvider, useForm } from 'react-hook-form';
import { hasNumber, isEmail, minLength, required } from '../../app/utils/validators';
import { useBookingForm } from '../../context/BookingFormContext';
import PassportScanner from '../../components/booking/PassportScanner/PassportScanner';
import FormInput from '../../components/ui/FormInput/FormInput';
import DatePickerInput from '../../components/ui/DatepickerInput/DatepickerInput';
import FrostedCard from '../../components/layout/FrostedCard/FrostedCard';
import { genderOptions } from '../../app/constants/genderOptions';
import { createEmptyPassenger } from '../../app/utils/formUtils';

const PassengerStep = () => {
    const { formData, updateForm, updateStepValidity, currentStep } = useBookingForm();
    const [autoFilledFields, setAutoFilledFields] = useState({});

    const initializePassengers = (passengers, passengerNumber) => {
        if (passengers?.length) {
            return passengers.map(p => ({
                ...createEmptyPassenger(),
                ...p,
            }));
        }
        return Array.from({ length: passengerNumber }, () => createEmptyPassenger());
    };

    const methods = useForm({
        defaultValues: {
            passengers: initializePassengers(
                formData.passengers,
                formData.initialInfos.passengerNumber
            ),
        },
        mode: 'onBlur',
        reValidateMode: 'onChange',
    });

    const {
        setValue,
        watch,
        formState: { isValid, touchedFields },
    } = methods;

    useEffect(() => {
        updateStepValidity(currentStep, isValid);
    }, [isValid, currentStep, updateStepValidity]);

    useEffect(() => {
        const subscription = watch((data) => {
            updateForm('passengers', data.passengers);
        });
        return () => subscription.unsubscribe();
    }, [watch, updateForm]);

    const handleScanComplete = (scannedData, index) => {
        const filled = {};
        Object.entries(scannedData).forEach(([key, value]) => {
            const path = `passengers.${index}.${key}`;
            setValue(path, value, { shouldValidate: true }); // don't touch field
            filled[path] = true;
        });
        setAutoFilledFields(prev => ({ ...prev, ...filled }));
    };

    const showWarning = (fieldPath) => {
        const get = (obj, path) => path.split('.').reduce((acc, part) => acc?.[part], obj);
        return autoFilledFields[fieldPath] && !get(touchedFields, fieldPath);
    };

    return (
        <>
            <Typography variant="h4" gutterBottom>
                📝 Passengers Details
            </Typography>
            <Divider sx={{ my: 2 }} />

            <FormProvider {...methods}>
                {Array.from({ length: formData.initialInfos.passengerNumber }).map((_, index) => (
                    <FrostedCard key={index}>
                        <Typography variant="h6" gutterBottom>
                            Passenger {index + 1}
                        </Typography>

                        <Box mb={2}>
                            <PassportScanner onScanComplete={(data) => handleScanComplete(data, index)} />
                        </Box>

                        <Grid container spacing={2}>
                            <Grid size={6}>
                                <FormInput
                                    name={`passengers.${index}.firstName`}
                                    label="First Name *"
                                    placeholder="e.g. Adrien"
                                    icon={<CreditCard />}
                                    validators={[required]}
                                    showAutofillWarning={showWarning(`passengers.${index}.firstName`)}
                                    extraWarning="Auto-filled from passport scan. Please verify."
                                />
                            </Grid>
                            <Grid size={6}>
                                <FormInput
                                    name={`passengers.${index}.lastName`}
                                    label="Last Name *"
                                    placeholder="e.g. Gerday"
                                    icon={<CreditCard />}
                                    validators={[required]}
                                    showAutofillWarning={showWarning(`passengers.${index}.lastName`)}
                                    extraWarning="Auto-filled from passport scan. Please verify."
                                />
                            </Grid>
                            <Grid size={6}>
                                <FormInput
                                    name={`passengers.${index}.email`}
                                    label="Email *"
                                    placeholder="e.g. adrien@airline.com"
                                    icon={<Email />}
                                    type="email"
                                    validators={[required, isEmail]}
                                    showAutofillWarning={showWarning(`passengers.${index}.email`)}
                                    extraWarning="Auto-filled from passport scan. Please verify."
                                />
                            </Grid>
                            <Grid size={3}>
                                <FormInput
                                    name={`passengers.${index}.nationality`}
                                    label="Nationality *"
                                    placeholder="e.g. Belgium"
                                    icon={<Public />}
                                    validators={[required]}
                                    showAutofillWarning={showWarning(`passengers.${index}.nationality`)}
                                    extraWarning="Auto-filled from passport scan. Please verify."
                                />
                            </Grid>
                            <Grid size={3}>
                                <FormInput
                                    name={`passengers.${index}.gender`}
                                    label="Gender *"
                                    icon={<WcIcon />}
                                    isSelect
                                    options={genderOptions}
                                    validators={[required]}
                                    showAutofillWarning={showWarning(`passengers.${index}.gender`)}
                                    extraWarning="Auto-filled from passport scan. Please verify."
                                />
                            </Grid>
                            <Grid size={4}>
                                <DatePickerInput
                                    name={`passengers.${index}.dateOfBirth`}
                                    label="Date of Birth *"
                                    validators={[required]}
                                    showAutofillWarning={showWarning(`passengers.${index}.dateOfBirth`)}
                                    extraWarning="Auto-filled from passport scan. Please verify."
                                />
                            </Grid>
                            <Grid size={4}>
                                <FormInput
                                    name={`passengers.${index}.passport`}
                                    label="Passport Number *"
                                    placeholder="e.g. SPEC2014"
                                    icon={<VpnKey />}
                                    validators={[required, minLength(6), hasNumber]}
                                    showAutofillWarning={showWarning(`passengers.${index}.passport`)}
                                    extraWarning="Auto-filled from passport scan. Please verify."
                                />
                            </Grid>
                            <Grid size={4}>
                                <DatePickerInput
                                    name={`passengers.${index}.passportExpiry`}
                                    label="Passport Expiration Date *"
                                    validators={[required]}
                                    showAutofillWarning={showWarning(`passengers.${index}.passportExpiry`)}
                                    extraWarning="Auto-filled from passport scan. Please verify."
                                />
                            </Grid>
                        </Grid>
                    </FrostedCard>
                ))}
            </FormProvider>
        </>
    );
};

export default PassengerStep;
