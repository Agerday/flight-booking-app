    import React, { useCallback, useEffect, useMemo, useState } from 'react';
    import {Alert, Box, Chip, Divider, Grid, Typography} from '@mui/material';
    import { FormProvider, useForm } from 'react-hook-form';
    import { zodResolver } from '@hookform/resolvers/zod';
    
    import { useAppDispatch, useAppSelector } from '../../redux/hooks';
    import { setStepValid, updatePassengers } from '../../redux/slices/bookingSlice';
    import { useStepper } from '../../hooks/useStepper';
    import { BookingStep, Passenger } from '../../types';
    import { genderOptions } from '../../types/constants';
    import { PassengersFormData, passengersFormSchema } from '../../schemas/passengersSchema';
    
    import FrostedCard from '../../components/layout/FrostedCard/FrostedCard';
    import PassportScanner from '../../components/booking/PassportScanner/PassportScanner';
    import FormInput from '../../components/ui/FormInput/FormInput';
    import DatepickerInput from '../../components/ui/DatepickerInput/DatepickerInput';
    import PassengerNavigation from '../../components/booking/PassengerNavigation/PassengerNavigation';
    import { createEmptyPassenger } from '../../utils/passenger.utils';
    import {CheckCircle} from "@mui/icons-material";
    
    interface AutoFilledFields {
        [fieldPath: string]: boolean;
    }
    
    interface ScannedPassportData {
        firstName?: string;
        lastName?: string;
        email?: string;
        nationality?: string;
        gender?: string;
        dateOfBirth?: Date;
        passport?: string;
        passportExpiry?: Date;
    }
    
    interface PassengerFormError {
        message: string;
        field?: string;
    }
    
    interface PassengerCompletionStatus {
        [index: number]: boolean;
    }
    
    const PassengerStep: React.FC = () => {
        const dispatch = useAppDispatch();
        const { setCanGoNext } = useStepper();
        const { data: bookingData, isLoading } = useAppSelector((state) => state.booking);
    
        const [autoFilledFields, setAutoFilledFields] = useState<AutoFilledFields>({});
        const [currentPassengerIndex, setCurrentPassengerIndex] = useState(0);
        const [error, setError] = useState<PassengerFormError | null>(null);
        const [passengerCompletion, setPassengerCompletion] = useState<PassengerCompletionStatus>({});
    
        const mutableGenderOptions = useMemo(() =>
                genderOptions.map(option => ({ ...option })),
            []
        );
    
        const passengerCount = bookingData.search.passengerCount;
    
        const initializePassengers = useMemo(() => {
            if (bookingData.passengers?.length === passengerCount) {
                return bookingData.passengers.map((p) => ({
                    ...createEmptyPassenger(),
                    ...p,
                    dateOfBirth: p.dateOfBirth ? new Date(p.dateOfBirth) : new Date(),
                    passportExpiry: p.passportExpiry ? new Date(p.passportExpiry) : new Date(),
                }));
            }
    
            return Array.from({ length: passengerCount }, () => ({
                ...createEmptyPassenger(),
                dateOfBirth: new Date(),
                passportExpiry: new Date(),
            }));
        }, [bookingData.passengers, passengerCount]);
    
        const methods = useForm<PassengersFormData>({
            resolver: zodResolver(passengersFormSchema),
            defaultValues: {
                passengers: initializePassengers,
            },
            mode: 'onBlur',
            reValidateMode: 'onChange',
        });
    
        const { control, setValue, watch, formState: { isValid, touchedFields, errors }, trigger } = methods;
    
        // Check individual passenger completion
        const checkPassengerCompletion = useCallback(async (index: number) => {
            const result = await trigger(`passengers.${index}`);
            setPassengerCompletion(prev => ({ ...prev, [index]: result }));
            return result;
        }, [trigger]);
    
        // Check all passengers completion on form changes
        useEffect(() => {
            const checkAllPassengers = async () => {
                const completionStatus: PassengerCompletionStatus = {};
                for (let i = 0; i < passengerCount; i++) {
                    const isComplete = await trigger(`passengers.${i}`);
                    completionStatus[i] = isComplete;
                }
                setPassengerCompletion(completionStatus);
            };
    
            // Debounce the check to avoid too many validations
            const timer = setTimeout(() => {
                checkAllPassengers();
            }, 500);
    
            return () => clearTimeout(timer);
        }, [watch(), passengerCount, trigger]);
    
        useEffect(() => {
            setCanGoNext(isValid);
            dispatch(setStepValid({ step: BookingStep.PASSENGER, isValid }));
        }, [isValid, setCanGoNext, dispatch]);
    
        useEffect(() => {
            const subscription = watch((data) => {
                try {
                    const serializedPassengers = data.passengers?.map((p) => ({
                        ...p,
                        dateOfBirth: p?.dateOfBirth instanceof Date
                            ? p.dateOfBirth.toISOString()
                            : p?.dateOfBirth || '',
                        passportExpiry: p?.passportExpiry instanceof Date
                            ? p.passportExpiry.toISOString()
                            : p?.passportExpiry || '',
                    })) as Passenger[];
    
                    if (serializedPassengers) {
                        dispatch(updatePassengers(serializedPassengers));
                        setError(null);
                    }
                } catch (err) {
                    setError({
                        message: 'Failed to update passenger information',
                    });
                    console.error('Passenger data serialization error:', err);
                }
            });
    
            return () => subscription.unsubscribe();
        }, [watch, dispatch]);
    
        useEffect(() => {
            setError(null);
        }, [currentPassengerIndex]);
    
        const handleScanComplete = useCallback((scannedData: ScannedPassportData, passengerIndex: number) => {
            try {
                const filledFields: AutoFilledFields = {};
    
                Object.entries(scannedData).forEach(([key, value]) => {
                    if (value !== undefined && value !== '') {
                        const fieldPath = `passengers.${passengerIndex}.${key}`;
                        setValue(fieldPath as any, value, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
                        filledFields[fieldPath] = true;
                    }
                });
    
                setAutoFilledFields(prev => ({ ...prev, ...filledFields }));
                setError(null);
    
                // Check completion after scan
                setTimeout(() => {
                    checkPassengerCompletion(passengerIndex);
                }, 100);
    
            } catch (err) {
                setError({
                    message: 'Failed to process passport scan data',
                });
                console.error('Passport scan error:', err);
            }
        }, [setValue, checkPassengerCompletion]);
    
        const shouldShowWarning = useCallback((fieldPath: string): boolean => {
            const getNestedValue = (obj: any, path: string): any => {
                return path.split('.').reduce((acc, part) => acc?.[part], obj);
            };
    
            return autoFilledFields[fieldPath] && !getNestedValue(touchedFields, fieldPath);
        }, [autoFilledFields, touchedFields]);
    
        const handleNextPassenger = useCallback(async () => {
            // Check current passenger completion
            const isCurrentValid = await checkPassengerCompletion(currentPassengerIndex);
    
            if (!isCurrentValid) {
                setError({
                    message: 'Please complete all required fields for this passenger before continuing',
                });
                return;
            }
    
            if (currentPassengerIndex < passengerCount - 1) {
                setCurrentPassengerIndex(index => index + 1);
            }
        }, [currentPassengerIndex, passengerCount, checkPassengerCompletion]);
    
        const handlePreviousPassenger = useCallback(() => {
            if (currentPassengerIndex > 0) {
                setCurrentPassengerIndex(index => index - 1);
            }
        }, [currentPassengerIndex]);
    
        const handleNavigateToPassenger = useCallback((index: number) => {
            setCurrentPassengerIndex(index);
        }, []);
    
        if (passengerCount <= 0) {
            return (
                <Box sx={{ textAlign: 'center', p: 4 }}>
                    <Alert severity="error">
                        Invalid passenger count. Please go back and select the number of passengers.
                    </Alert>
                </Box>
            );
        }
    
        return (
            <Box>
                <Typography variant="h4" gutterBottom fontWeight={600}>
                    Passenger Details
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                    Enter details for {passengerCount} passenger{passengerCount > 1 ? 's' : ''}
                </Typography>
                <Divider sx={{ my: 2 }} />
    
                {error && (
                    <Alert
                        severity="error"
                        sx={{ mb: 3 }}
                        onClose={() => setError(null)}
                    >
                        {error.message}
                    </Alert>
                )}
    
                {passengerCount > 1 && (
                    <Box sx={{ mb: 3 }}>
                        <PassengerNavigation
                            activeIndex={currentPassengerIndex}
                            maxIndex={passengerCount}
                            onNext={handleNextPassenger}
                            onPrev={handlePreviousPassenger}
                            disabled={isLoading}
                            completionStatus={passengerCompletion}
                            onNavigateToIndex={handleNavigateToPassenger}
                        />
                    </Box>
                )}
    
                <FormProvider {...methods}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {Array.from({ length: passengerCount }).map((_, index) => (
                            <FrostedCard
                                key={index}
                                sx={{
                                    display: passengerCount > 1 && index !== currentPassengerIndex ? 'none' : 'block'
                                }}
                            >
                                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, p: 3 }}>
                                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
                                        {passengerCompletion[index] && (
                                            <Chip
                                                label="Complete"
                                                color="success"
                                                size="small"
                                                icon={<CheckCircle />}
                                            />
                                        )}
                                    </Box>
    
                                    <PassportScanner
                                        onScanComplete={(data) => handleScanComplete(data, index)}
                                        disabled={isLoading}
                                    />
    
                                    <Grid container spacing={2}>
                                        <Grid size={6}>
                                            <FormInput
                                                name={`passengers.${index}.firstName`}
                                                control={control}
                                                label="First Name *"
                                                placeholder="e.g. John"
                                                disabled={isLoading}
                                                showAutofillWarning={shouldShowWarning(`passengers.${index}.firstName`)}
                                                extraWarning="Auto-filled from passport scan. Please verify."
                                            />
                                        </Grid>
    
                                        <Grid size={6}>
                                            <FormInput
                                                name={`passengers.${index}.lastName`}
                                                control={control}
                                                label="Last Name *"
                                                placeholder="e.g. Smith"
                                                disabled={isLoading}
                                                showAutofillWarning={shouldShowWarning(`passengers.${index}.lastName`)}
                                                extraWarning="Auto-filled from passport scan. Please verify."
                                            />
                                        </Grid>
    
                                        <Grid size={6}>
                                            <FormInput
                                                name={`passengers.${index}.email`}
                                                control={control}
                                                label="Email *"
                                                type="email"
                                                placeholder="e.g. john.smith@email.com"
                                                disabled={isLoading}
                                                showAutofillWarning={shouldShowWarning(`passengers.${index}.email`)}
                                                extraWarning="Auto-filled from passport scan. Please verify."
                                            />
                                        </Grid>
    
                                        <Grid size={6}>
                                            <FormInput
                                                name={`passengers.${index}.nationality`}
                                                control={control}
                                                label="Nationality *"
                                                placeholder="e.g. United States"
                                                disabled={isLoading}
                                                showAutofillWarning={shouldShowWarning(`passengers.${index}.nationality`)}
                                                extraWarning="Auto-filled from passport scan. Please verify."
                                            />
                                        </Grid>
    
                                        <Grid size={6}>
                                            <FormInput
                                                name={`passengers.${index}.gender`}
                                                control={control}
                                                label="Gender *"
                                                isSelect
                                                options={mutableGenderOptions}
                                                disabled={isLoading}
                                                showAutofillWarning={shouldShowWarning(`passengers.${index}.gender`)}
                                                extraWarning="Auto-filled from passport scan. Please verify."
                                            />
                                        </Grid>
    
                                        <Grid size={6}>
                                            <DatepickerInput
                                                name={`passengers.${index}.dateOfBirth`}
                                                control={control}
                                                label="Date of Birth *"
                                                showAutofillWarning={shouldShowWarning(`passengers.${index}.dateOfBirth`)}
                                                extraWarning="Auto-filled from passport scan. Please verify."
                                            />
                                        </Grid>
    
                                        <Grid size={6}>
                                            <FormInput
                                                name={`passengers.${index}.passport`}
                                                control={control}
                                                label="Passport Number *"
                                                placeholder="e.g. SPEC2014"
                                                disabled={isLoading}
                                                showAutofillWarning={shouldShowWarning(`passengers.${index}.passport`)}
                                                extraWarning="Auto-filled from passport scan. Please verify."
                                            />
                                        </Grid>
    
                                        <Grid size={6}>
                                            <DatepickerInput
                                                name={`passengers.${index}.passportExpiry`}
                                                control={control}
                                                label="Passport Expiration Date *"
                                                showAutofillWarning={shouldShowWarning(`passengers.${index}.passportExpiry`)}
                                                extraWarning="Auto-filled from passport scan. Please verify."
                                            />
                                        </Grid>
                                    </Grid>
                                </Box>
                            </FrostedCard>
                        ))}
                    </Box>
                </FormProvider>
    
                {passengerCount > 1 && (
                    <Box sx={{ mt: 3 }}>
                        <PassengerNavigation
                            activeIndex={currentPassengerIndex}
                            maxIndex={passengerCount}
                            onNext={handleNextPassenger}
                            onPrev={handlePreviousPassenger}
                            disabled={isLoading}
                            completionStatus={passengerCompletion}
                            onNavigateToIndex={handleNavigateToPassenger}
                        />
                    </Box>
                )}
    
                {!isValid && errors.passengers && (
                    <Alert severity="warning" sx={{ mt: 3 }}>
                        Please complete all required fields to continue
                    </Alert>
                )}
            </Box>
        );
    };
    
    export default PassengerStep;