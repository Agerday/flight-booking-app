import React from 'react';
import {Container, Divider, Typography} from '@mui/material';
import CardGrid from '../components/CardGrid/CardGrid';
import FlightCard from '../components/FlightCard/FlightCard';
import {getFlightById} from '../app/services/flightService';

const MyBookings = () => {
    const bookedFlightIds = JSON.parse(localStorage.getItem('myBookings')) || [];
    const myFlights = bookedFlightIds.map(getFlightById).filter(Boolean);

    return (
        <Container>
            <Typography variant="h4" gutterBottom>
                🧳 My Bookings
            </Typography>

            <Divider sx={{my: 2}}/>

            {myFlights.length > 0 ? (
                <CardGrid
                    items={myFlights}
                    renderItem={(flight) => <FlightCard flight={flight}/>}
                />
            ) : (
                <Typography>You have no bookings yet.</Typography>
            )}
        </Container>
    );
};

export default MyBookings;
