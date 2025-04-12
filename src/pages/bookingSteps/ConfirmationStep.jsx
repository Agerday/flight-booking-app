import {getFlightById} from "../../app/services/flightService";
import {Container, Divider, Typography} from "@mui/material";
import CardGrid from "../../components/flights/CardGrid/CardGrid";
import FlightCard from "../../components/flights/FlightCard/FlightCard";
import React from "react";

const ConfirmationStep = () => {
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

export default ConfirmationStep;
