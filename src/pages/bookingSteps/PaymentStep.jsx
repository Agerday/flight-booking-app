import React, {useEffect} from 'react';
import {Grid, Typography} from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import LuggageIcon from '@mui/icons-material/Luggage';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import ShieldIcon from '@mui/icons-material/Shield';

import PaymentPage from '../PaymentPage/PaymentPage';
import {generatePriceSummary} from '../../app/utils/priceSummaryGenerator';
import {BookingSteps} from '../../app/constants/bookingSteps';
import {useDispatch, useSelector} from 'react-redux';
import {setCurrentStep, updateStepValidity} from '../../redux/slices/bookingSlice';

const iconMap = {
    meals: <RestaurantIcon fontSize="small"/>,
    baggageInsurance: <ShieldIcon fontSize="small"/>,
    checkedBaggage: <LuggageIcon fontSize="small"/>,
    assistance: <CheckIcon fontSize="small" color="info"/>,
    insurance: <ShieldIcon fontSize="small" color="warning"/>,
    seat: <CheckIcon fontSize="small" color="secondary"/>,
    flight: <CheckIcon fontSize="small" color="success"/>,
};

const PaymentStep = () => {
    const dispatch = useDispatch();
    const formData = useSelector(state => state.booking.formData);
    const currentStep = useSelector(state => state.booking.currentStep);

    const itemList = generatePriceSummary(formData, {icons: iconMap});
    const total = itemList.reduce((sum, item) => sum + item.price, 0);

    const handleSubmit = () => {
        dispatch(setCurrentStep(BookingSteps.CONFIRM));
    };

    useEffect(() => {
        dispatch(updateStepValidity({step: currentStep, isValid: true}));
    }, [currentStep, dispatch]);

    return (
        <Grid container spacing={4} justifyContent="center" alignItems="flex-start">
            <Grid size={6}>
                <Typography variant="h5" gutterBottom>
                    💳 Complete Your Payment
                </Typography>
                <Typography variant="body2" sx={{mb: 2}}>
                    You're almost there! Just one step away from takeoff.
                </Typography>
                <PaymentPage totalAmount={total} onSubmit={handleSubmit}/>
            </Grid>
        </Grid>
    );
};

export default PaymentStep;
