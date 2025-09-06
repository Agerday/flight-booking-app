import React, {useCallback, useEffect, useState} from 'react';
import {Alert, Box, Button, Card, CardContent, Grid, Typography} from '@mui/material';
import {useForm} from 'react-hook-form';
import {zodResolver} from '@hookform/resolvers/zod';

import FormInput from '../../components/ui/FormInput/FormInput';
import {type CardType, detectCardType} from '../../utils/creditCard.utils';
import {formatCVV, formatExpiryDate} from '../../utils/paymentFormatter.utils';
import {createPaymentSchema, type PaymentFormData} from '../../schemas/paymentSchema';

interface PaymentPageProps {
    totalAmount: number;
    onSubmit: (data: PaymentFormData) => Promise<void>;
}

interface PaymentState {
    isSubmitting: boolean;
    error: string | null;
    cardType: CardType | null;
}

const CardIcon: React.FC<{ cardType: CardType | null }> = ({cardType}) => {
    if (!cardType) return null;

    const iconMap: Record<CardType, string> = {
        visa: '/credit-card-logos/visa.png',
        mastercard: '/credit-card-logos/mastercard.png',
        amex: '/credit-card-logos/amex.png',
        discover: '/credit-card-logos/discover.png',
    };

    return (
        <img
            src={iconMap[cardType]}
            alt={`${cardType} logo`}
            height={24}
            style={{objectFit: 'contain'}}
            onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
            }}
        />
    );
};

const SecurityNotice: React.FC = () => (
    <Box sx={{mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1}}>
        <Typography variant="caption" color="text.secondary">
            🔒 Your payment information is encrypted and secure
        </Typography>
    </Box>
);

const PaymentPage: React.FC<PaymentPageProps> = ({totalAmount, onSubmit}) => {
    const [paymentState, setPaymentState] = useState<PaymentState>({
        isSubmitting: false,
        error: null,
        cardType: null,
    });

    const paymentSchema = createPaymentSchema(paymentState.cardType);

    const {control, handleSubmit, setValue, watch, formState: {isValid}} = useForm<PaymentFormData>({
        resolver: zodResolver(paymentSchema),
        mode: 'onChange',
        defaultValues: {
            cardName: '',
            cardNumber: '',
            expirationDate: '',
            cvv: ''
        }
    });

    const watchedCardNumber = watch('cardNumber');

    useEffect(() => {
        const cleaned = watchedCardNumber.replace(/\D/g, '');
        const detectedType = detectCardType(cleaned);

        if (detectedType !== paymentState.cardType) {
            setPaymentState(prev => ({...prev, cardType: detectedType}));

            if (paymentState.cardType && detectedType !== paymentState.cardType) {
                setValue('cvv', '');
            }
        }
    }, [watchedCardNumber, paymentState.cardType, setValue]);

    const formatCardNumber = useCallback((value: string): string => {
        const cleaned = value.replace(/\D/g, '');

        if (paymentState.cardType === 'amex') {
            return cleaned.slice(0, 15).replace(/(\d{4})(\d{6})(\d{5})/, '$1 $2 $3').trim();
        }

        return cleaned.slice(0, 16).replace(/(\d{4})/g, '$1 ').trim();
    }, [paymentState.cardType]);

    const onLocalSubmit = useCallback(async (data: PaymentFormData) => {
        if (paymentState.isSubmitting) return;

        setPaymentState(prev => ({...prev, isSubmitting: true, error: null}));

        try {
            const cleanData: PaymentFormData = {
                cardName: data.cardName.trim(),
                cardNumber: data.cardNumber.replace(/\s/g, ''),
                expirationDate: data.expirationDate,
                cvv: data.cvv,
            };

            await onSubmit(cleanData);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : 'Payment processing failed';
            setPaymentState(prev => ({
                ...prev,
                error: errorMessage,
                isSubmitting: false
            }));
        }
    }, [onSubmit, paymentState.isSubmitting]);

    const clearError = useCallback(() => {
        setPaymentState(prev => ({...prev, error: null}));
    }, []);

    return (
        <form onSubmit={handleSubmit(onLocalSubmit)} noValidate>
            <Card sx={{borderRadius: 3, boxShadow: 3}}>
                <CardContent sx={{px: 3, py: 3}}>
                    <Typography variant="h6" gutterBottom fontWeight={600}>
                        Payment Details
                    </Typography>

                    {paymentState.error && (
                        <Alert severity="error" onClose={clearError} sx={{mb: 2}}>
                            {paymentState.error}
                        </Alert>
                    )}

                    <Grid container spacing={2}>
                        <Grid size={12}>
                            <FormInput
                                name="cardName"
                                control={control}
                                label="Cardholder Name"
                                placeholder="John Smith"
                                disabled={paymentState.isSubmitting}
                            />
                        </Grid>

                        <Grid size={12}>
                            <Box sx={{position: 'relative'}}>
                                <FormInput
                                    name="cardNumber"
                                    control={control}
                                    label="Card Number"
                                    placeholder="1234 5678 9012 3456"
                                    disabled={paymentState.isSubmitting}
                                    inputProps={{
                                        inputMode: 'numeric',
                                        maxLength: paymentState.cardType === 'amex' ? 17 : 19,
                                        onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                                            const formatted = formatCardNumber(e.target.value);
                                            setValue('cardNumber', formatted);
                                        }
                                    }}
                                />
                                {paymentState.cardType && (
                                    <Box sx={{
                                        position: 'absolute',
                                        right: 12,
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        pointerEvents: 'none'
                                    }}>
                                        <CardIcon cardType={paymentState.cardType}/>
                                    </Box>
                                )}
                            </Box>
                        </Grid>

                        <Grid size={6}>
                            <FormInput
                                name="expirationDate"
                                control={control}
                                label="Expiration Date"
                                placeholder="MM/YY"
                                disabled={paymentState.isSubmitting}
                                inputProps={{
                                    inputMode: 'numeric',
                                    maxLength: 5,
                                    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                                        const formatted = formatExpiryDate(e.target.value);
                                        setValue('expirationDate', formatted);
                                    }
                                }}
                            />
                        </Grid>

                        <Grid size={6}>
                            <FormInput
                                name="cvv"
                                control={control}
                                label={paymentState.cardType === 'amex' ? 'CID' : 'CVV'}
                                placeholder={paymentState.cardType === 'amex' ? '1234' : '123'}
                                disabled={paymentState.isSubmitting}
                                inputProps={{
                                    inputMode: 'numeric',
                                    maxLength: paymentState.cardType === 'amex' ? 4 : 3,
                                    onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                                        const formatted = formatCVV(e.target.value, paymentState.cardType);
                                        setValue('cvv', formatted);
                                    }
                                }}
                            />
                        </Grid>
                    </Grid>

                    <SecurityNotice/>

                    <Box sx={{mt: 3}}>
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            size="large"
                            disabled={!isValid || paymentState.isSubmitting}
                            sx={{
                                py: 1.5,
                                fontWeight: 600,
                                textTransform: 'none',
                                '&:disabled': {
                                    opacity: 0.6,
                                },
                            }}
                        >
                            {paymentState.isSubmitting ? 'Processing...' : `Pay €${totalAmount} & Confirm Booking`}
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </form>
    );
};

export default PaymentPage;