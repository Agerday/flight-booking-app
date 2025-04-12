import React, {useEffect, useState} from 'react';
import {Divider, Grid, Typography} from '@mui/material';
import {CreditCard, Email, Public, VpnKey, Wc as WcIcon} from '@mui/icons-material';

import {FormProvider, useForm} from 'react-hook-form';
import {useNavigate} from 'react-router-dom';

import {isEmail, minLength, required} from '../../app/utils/validators';
import {useBookingForm} from '../../context/BookingFormContext';
import PassportScanner from '../../components/booking/PassportScanner/PassportScanner';
import FormInput from '../../components/ui/FormInput/FormInput';
import {genderOptions} from '../../app/constants/genderOptions';
import FrostedCard from "../../components/layout/FrostedCard/FrostedCard";
import DatePickerInput from "../../components/ui/DatepickerInput/DatepickerInput";

const PassengerStep = () => {
    const {formData, updateForm, updateStepValidity, currentStep} = useBookingForm();
    const navigate = useNavigate();
    const [autoFilledFields, setAutoFilledFields] = useState({});

    const methods = useForm({
        defaultValues: {
            firstName: formData.firstName || '',
            lastName: formData.lastName || '',
            email: formData.email || '',
            nationality: formData.nationality || '',
            gender: formData.gender || '',
            dateOfBirth: formData.dateOfBirth || '',
            passport: formData.passport || '',
            passportExpiry: formData.passportExpiry || '',
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
        const subscription = watch(data => {
            Object.entries(data).forEach(([key, value]) => {
                updateForm(key, value);
            });
        });
        return () => subscription.unsubscribe();
    }, [watch, updateForm]);

    const onSubmit = (data) => {
        Object.keys(data).forEach((key) => updateForm(key, data[key]));
        const stored = JSON.parse(localStorage.getItem('myBookings')) || [];
        const updated = [...new Set([...stored, formData.selectedFlight?.id])];
        localStorage.setItem('myBookings', JSON.stringify(updated));
        navigate('/my-bookings');
    };

    const handleScanComplete = (scannedData) => {
        const filled = {};
        Object.entries(scannedData).forEach(([key, value]) => {
            setValue(key, value, {shouldValidate: true});
            updateForm(key, value);
            filled[key] = true;
        });
        window.scrollTo({top: 0, behavior: 'smooth'});
        setAutoFilledFields(filled);
    };

    return (
        <>
            <Typography variant="h4" gutterBottom>📝 Passenger Details</Typography>
            <Divider sx={{my: 2}}/>

            <FormProvider {...methods}>
                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* Section 1: Personal Info */}
                    <FrostedCard>
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={4}>
                                <FormInput
                                    name="firstName"
                                    label="First Name *"
                                    placeholder="e.g. Adrien"
                                    icon={<CreditCard/>}
                                    validators={[required]}
                                    showAutofillWarning
                                    extraWarning={showWarning('firstName') ? 'Please verify this information' : ''}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <FormInput
                                    name="lastName"
                                    label="Last Name *"
                                    placeholder="e.g. Gerday"
                                    icon={<CreditCard/>}
                                    validators={[required]}
                                    showAutofillWarning
                                    extraWarning={showWarning('lastName') ? 'Please verify this information' : ''}
                                />
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <FormInput
                                    name="email"
                                    label="Email *"
                                    placeholder="e.g. adrien.gerday@airline.com"
                                    icon={<Email/>}
                                    type="email"
                                    validators={[required, isEmail]}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormInput
                                    name="nationality"
                                    label="Nationality *"
                                    placeholder="e.g. Belgium"
                                    icon={<Public/>}
                                    validators={[required]}
                                    showAutofillWarning
                                    extraWarning={showWarning('nationality') ? 'Please verify this information' : ''}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormInput
                                    name="gender"
                                    label="Gender *"
                                    icon={<WcIcon/>}
                                    validators={[required]}
                                    isSelect
                                    options={genderOptions}
                                    showAutofillWarning
                                    extraWarning={showWarning('gender') ? 'Please verify this information' : ''}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Grid item xs={12} md={6}>
                                    <DatePickerInput
                                        name="dateOfBirth"
                                        label="Date of Birth *"
                                        validators={[required]}
                                        showAutofillWarning
                                        extraWarning={showWarning('dateOfBirth') ? 'Please verify this information' : ''}
                                    />
                                </Grid>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormInput
                                    name="passport"
                                    label="Passport Number *"
                                    placeholder="e.g. SPEC2014"
                                    icon={<VpnKey/>}
                                    validators={[required, minLength(6)]}
                                    showAutofillWarning
                                    extraWarning={showWarning('passport') ? 'Please verify this information' : ''}
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Grid item xs={12} md={6}>
                                    <DatePickerInput
                                        name="passportExpiry"
                                        label="Passport Expiration Date *"
                                        validators={[required]}
                                        showAutofillWarning
                                        extraWarning={showWarning('passportExpiry') ? 'Please verify this information' : ''}
                                    />
                                </Grid>
                            </Grid>
                        </Grid>
                    </FrostedCard>

                    {/* Section 2: Scanner */}
                    <FrostedCard>
                        <PassportScanner onScanComplete={handleScanComplete}/>
                    </FrostedCard>
                </form>
            </FormProvider>
        </>
    );
};

export default PassengerStep;
