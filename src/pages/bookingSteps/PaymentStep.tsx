    import React, {useCallback, useEffect, useMemo, useState} from 'react';
    import {Alert, Box, CircularProgress, Grid, Typography} from '@mui/material';

    import {useAppDispatch, useAppSelector} from '@/redux/hooks';
    import {calculateTotalPrice} from '@/redux/slices/bookingSlice';
    import {useStepper} from '../../hooks/useStepper';

    import PaymentPage from '../PaymentPage/PaymentPage';

    interface PaymentState {
        isProcessing: boolean;
        error: string | null;
        success: boolean;
    }

    const PaymentStep: React.FC = () => {
        const dispatch = useAppDispatch();
        const {nextStep} = useStepper();
        const {data: bookingData, isLoading} = useAppSelector((state) => state.booking);

        const [paymentState, setPaymentState] = useState<PaymentState>({
            isProcessing: false,
            error: null,
            success: false,
        });

        const totalAmount = useMemo(() => {
            dispatch(calculateTotalPrice());
            return bookingData.totalPrice;
        }, [bookingData, dispatch]);

        const isValidPayment = useMemo(() => {
            return totalAmount > 0 && totalAmount <= 50000;
        }, [totalAmount]);

        const handlePaymentSubmit = useCallback(async () => {
            if (!isValidPayment) return;

            setPaymentState(prev => ({...prev, isProcessing: true, error: null}));

            try {
                await new Promise(resolve => setTimeout(resolve, 2000));

                setPaymentState(prev => ({...prev, success: true, isProcessing: false}));

                setTimeout(() => {
                    nextStep();
                }, 1500);

            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : 'Payment processing failed';

                setPaymentState(prev => ({
                    ...prev,
                    error: errorMessage,
                    isProcessing: false
                }));
            }
        }, [isValidPayment, nextStep]);

        const clearPaymentError = useCallback(() => {
            setPaymentState(prev => ({...prev, error: null}));
        }, []);

        useEffect(() => {
            return () => {
                clearPaymentError();
            };
        }, [clearPaymentError]);

        if (!isValidPayment) {
            return (
                <Box sx={{maxWidth: 800, mx: 'auto', textAlign: 'center', p: 4}}>
                    <Alert severity="error" sx={{mb: 3}}>
                        <Typography variant="h6" gutterBottom>
                            Payment Cannot Be Processed
                        </Typography>
                        <Typography variant="body2">
                            {totalAmount <= 0 ? 'Invalid booking amount' : 'Amount exceeds maximum limit'}
                        </Typography>
                    </Alert>
                </Box>
            );
        }

        if (isLoading && paymentState.isProcessing) {
            return (
                <Box sx={{maxWidth: 800, mx: 'auto', textAlign: 'center', p: 4}}>
                    <CircularProgress size={60} sx={{mb: 2}}/>
                    <Typography variant="h6" gutterBottom>
                        Processing Your Payment
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Please do not close this window or navigate away
                    </Typography>
                </Box>
            );
        }

        if (paymentState.success) {
            return (
                <Box sx={{maxWidth: 800, mx: 'auto', textAlign: 'center', p: 4}}>
                    <Alert severity="success" sx={{mb: 3}}>
                        <Typography variant="h6" gutterBottom>
                            Payment Successful!
                        </Typography>
                        <Typography variant="body2">
                            Redirecting to confirmation...
                        </Typography>
                    </Alert>
                </Box>
            );
        }

        return (
            <Box sx={{maxWidth: 800, mx: 'auto'}}>
                <Grid container spacing={4} justifyContent="center">
                    <Grid size={12}>
                        <Typography variant="h4" align="center" gutterBottom fontWeight={600}>
                            Complete Your Payment
                        </Typography>
                        <Typography variant="body1" align="center" color="text.secondary" sx={{mb: 4}}>
                            You're almost there! Just one step away from takeoff.
                        </Typography>
                    </Grid>

                    {paymentState.error && (
                        <Grid size={12}>
                            <Alert
                                severity="error"
                                onClose={clearPaymentError}
                                sx={{mb: 3}}
                            >
                                <Typography variant="body2">
                                    {paymentState.error}
                                </Typography>
                            </Alert>
                        </Grid>
                    )}

                    <Grid size={{xs: 12, md: 8}}>
                        <PaymentPage
                            totalAmount={totalAmount}
                            onSubmit={handlePaymentSubmit}
                        />
                    </Grid>
                </Grid>
            </Box>
        );
    };

    export default PaymentStep;