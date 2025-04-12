import React, {useEffect, useState} from 'react';
import {Box, Button, Card, CardContent, Grid, InputAdornment, TextField, Typography,} from '@mui/material';
import {Controller, useForm} from 'react-hook-form';
import {combineValidators, isCardNumber, isCVV, isFutureDate, required,} from '../../app/utils/validators';
import {detectCardType} from '../../app/utils/creditCardUtils';
import {useBookingForm} from '../../context/BookingFormContext';


const PaymentPage = ({totalAmount = 0, onSubmit}) => {
    const {updateStepValidity, currentStep} = useBookingForm();
    const {control, handleSubmit, formState: {isValid}} = useForm({mode: 'onChange'});
    const [cardType, setCardType] = useState(null);

    // useEffect(() => {
    //     updateStepValidity(currentStep, isValid);
    // }, [isValid, currentStep, updateStepValidity]);

    const handleCardChange = (value) => {
        setCardType(detectCardType(value));
    };

    const getCardIcon = () => {
        if (cardType === 'visa') return <img src="/credit-card-logos/visa.png" alt="Visa" height={24}/>;
        if (cardType === 'mastercard') return <img src="/credit-card-logos/mastercard.png" alt="MasterCard"
                                                   height={24}/>;
        return null;
    };

    const onLocalSubmit = (data) => {
        alert('💸 Payment submitted! Thank you for your money 🤑');
        if (onSubmit) onSubmit(data);
    };

    return (
        <form onSubmit={handleSubmit(onLocalSubmit)}>
            <Card sx={{borderRadius: 3, boxShadow: 3}}>
                <CardContent sx={{px: 3, py: 2}}>
                    <Typography variant="h6" gutterBottom>Payment Details</Typography>

                    {/* Cardholder Name */}
                    <Controller
                        name="cardName"
                        control={control}
                        rules={{validate: required}}
                        render={({field, fieldState}) => (
                            <TextField
                                {...field}
                                fullWidth
                                label="Cardholder Name"
                                margin="dense"
                                size="small"
                                required
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                            />
                        )}
                    />

                    {/* Card Number */}
                    <Controller
                        name="cardNumber"
                        control={control}
                        rules={{validate: combineValidators(required, isCardNumber)}}
                        render={({field, fieldState}) => (
                            <TextField
                                {...field}
                                fullWidth
                                label="Card Number"
                                margin="dense"
                                size="small"
                                required
                                error={!!fieldState.error}
                                helperText={fieldState.error?.message}
                                inputProps={{inputMode: 'numeric', maxLength: 19}}
                                onChange={(e) => {
                                    const raw = e.target.value.replace(/\D/g, '').slice(0, 16);
                                    const formatted = raw.replace(/(.{4})/g, '$1 ').trim();
                                    handleCardChange(raw);
                                    field.onChange(formatted);
                                }}
                                InputProps={{
                                    endAdornment: <InputAdornment position="end">{getCardIcon()}</InputAdornment>,
                                }}
                            />
                        )}
                    />

                    {/* Expiry and CVV */}
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <Controller
                                name="expirationDate"
                                control={control}
                                rules={{validate: combineValidators(required, isFutureDate)}}
                                render={({field, fieldState}) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        label="Expiration Date"
                                        placeholder="MM/YY"
                                        margin="dense"
                                        size="small"
                                        required
                                        error={!!fieldState.error}
                                        helperText={fieldState.error?.message}
                                        inputProps={{inputMode: 'numeric', maxLength: 5}}
                                        onChange={(e) => {
                                            let val = e.target.value.replace(/[^\d]/g, '').slice(0, 4);
                                            if (val.length > 2) val = val.slice(0, 2) + '/' + val.slice(2);
                                            field.onChange(val);
                                        }}
                                    />
                                )}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <Controller
                                name="cvv"
                                control={control}
                                rules={{validate: combineValidators(required, isCVV)}}
                                render={({field, fieldState}) => (
                                    <TextField
                                        {...field}
                                        fullWidth
                                        label="CVV"
                                        margin="dense"
                                        size="small"
                                        required
                                        error={!!fieldState.error}
                                        helperText={fieldState.error?.message}
                                        inputProps={{inputMode: 'numeric', maxLength: 3}}
                                        onChange={(e) => {
                                            const val = e.target.value.replace(/\D/g, '').slice(0, 3);
                                            field.onChange(val);
                                        }}
                                    />
                                )}
                            />
                        </Grid>
                    </Grid>

                    <Box mt={3}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            size="large"
                        >
                            Pay €{totalAmount} & Confirm Booking
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </form>
    );
};

export default PaymentPage;
