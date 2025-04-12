import React from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Grid,
    TextField,
    Typography,
} from '@mui/material';

const PaymentPage = ({ totalAmount = 0, onSubmit }) => {
    const handleSubmit = (e) => {
        e.preventDefault();
        if (onSubmit) onSubmit();
        alert('💸 Payment submitted!');
    };

    return (
        <form onSubmit={handleSubmit}>
            <Card>
                <CardContent>
                    <Typography variant="h6" gutterBottom>
                        Payment Details
                    </Typography>
                    <TextField
                        fullWidth
                        label="Cardholder Name"
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Card Number"
                        margin="normal"
                        required
                    />
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="Expiration Date"
                                placeholder="MM/YY"
                                margin="normal"
                                required
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                fullWidth
                                label="CVV"
                                margin="normal"
                                required
                            />
                        </Grid>
                    </Grid>
                    <Box mt={2}>
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            Pay €{totalAmount} & Confirm Booking
                        </Button>
                    </Box>
                </CardContent>
            </Card>
        </form>
    );
};

export default PaymentPage;
