import React from "react";
import {Box, Grid, Stack, Typography, Divider} from "@mui/material";
import FlightTakeoffIcon from "@mui/icons-material/FlightTakeoff";
import FlightLandIcon from "@mui/icons-material/FlightLand";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import {Flight, FlightSearchData} from "@/types/booking.types";

interface Props {
    outboundFlight: Flight | null;
    returnFlight: Flight | null;
    search: FlightSearchData;
}

const SelectedFlightsSummary: React.FC<Props> = ({outboundFlight, returnFlight, search}) => {
    if (!outboundFlight && !returnFlight) return null;

    const renderFlight = (
        label: string,
        flight: Flight,
        from: string,
        to: string
    ) => (
        <Box
            sx={{
                p: 2,
                borderRadius: 2,
                border: "1px solid",
                borderColor: "grey.300",
                bgcolor: "grey.50",
                mb: 2,
            }}
        >
            <Typography variant="subtitle2" sx={{fontWeight: 600, mb: 1}}>
                {label}
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center">
                <Box
                    component="img"
                    src={`/airline-logos/${flight.airline.toLowerCase().replace(/\s+/g, "-")}.png`}
                    alt={flight.airline}
                    sx={{height: 36, width: 36, borderRadius: "50%"}}
                />
                <Typography variant="body1" sx={{fontWeight: 600}}>
                    {flight.airline}
                </Typography>
            </Stack>

            <Divider sx={{my: 1.5}} />

            <Grid container spacing={2}>
                <Grid size={6}>
                    <Stack spacing={1}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <FlightTakeoffIcon fontSize="small" color="primary" />
                            <Typography variant="body2">{from}</Typography>
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <FlightLandIcon fontSize="small" color="error" />
                            <Typography variant="body2">{to}</Typography>
                        </Stack>
                    </Stack>
                </Grid>

                <Grid size={6}>
                    <Stack spacing={1}>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <AccessTimeIcon fontSize="small" color="action" />
                            <Typography variant="body2">
                                {new Date(flight.departureTime).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}{" "}
                                →{" "}
                                {new Date(flight.arrivalTime).toLocaleTimeString([], {
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1} alignItems="center">
                            <MonetizationOnIcon fontSize="small" color="success" />
                            <Typography variant="body2" fontWeight={600}>
                                ${flight.selectedPrice?.toFixed(2) ?? "0.00"}
                            </Typography>
                        </Stack>
                    </Stack>
                </Grid>
            </Grid>
        </Box>
    );

    return (
        <Box
            sx={{
                mt: 4,
                p: 3,
                bgcolor: "grey.100",
                borderRadius: 2,
                border: "1px solid",
                borderColor: "grey.300",
            }}
        >
            <Typography
                variant="h6"
                gutterBottom
                sx={{fontWeight: 600, color: "grey.800"}}
            >
                Selected Flights
            </Typography>

            {outboundFlight &&
                renderFlight("Outbound Flight", outboundFlight, search.origin, search.destination)}
            {returnFlight &&
                renderFlight("Return Flight", returnFlight, search.destination, search.origin)}
        </Box>
    );
};

export default SelectedFlightsSummary;
