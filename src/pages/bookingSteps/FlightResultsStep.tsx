import React, {useCallback, useEffect, useMemo, useRef, useState} from "react";
import {createPortal} from "react-dom";
import {Alert, Box, Chip, Container, Tab, Tabs, Typography,} from "@mui/material";
import {useAppDispatch, useAppSelector} from "@/redux/hooks";
import {selectOutboundFlight, selectReturnFlight,} from "@/redux/slices/bookingSlice";
import {useStepper} from "@/hooks/useStepper";
import {Flight, FlightClass, TripType} from "@/types/booking.types";
import {getFilteredFlights} from "@/utils/flightSearch.utils";
import {mockFlights} from "@/data/mockFlights";
import CardGrid from "@/components/layout/CardGrid/CardGrid";
import FlightCard from "@/components/layout/FlightCard/FlightCard";
import FlightFilter from "@/components/booking/FlightFilter/FlightFilter";
import SelectedFlightsSummary from "@/components/booking/Summary/SelectedFlightSummary";

interface FlightResultsStepProps {
    showFilterInSidebar?: boolean;
}

type SelectionPayload = Flight & {
    selectedClass: FlightClass;
    selectedPrice: number;
};

const FlightResultsStep: React.FC<FlightResultsStepProps> = ({
                                                                 showFilterInSidebar = false,
                                                             }) => {
    const dispatch = useAppDispatch();
    const {setCanGoNext} = useStepper();
    const {data: bookingData} = useAppSelector((state) => state.booking);
    const {search, outboundFlight, returnFlight} = bookingData;

    const isReturnTrip = search.tripType === TripType.RETURN;
    const [currentTab, setCurrentTab] = useState<0 | 1>(0);
    const [filteredFlights, setFilteredFlights] = useState<Flight[]>([]);

    const currentFlights = useMemo(() => {
        const isReturnTab = isReturnTrip && currentTab === 1;
        return getFilteredFlights(
            mockFlights,
            isReturnTab ? search.destination : search.origin,
            isReturnTab ? search.origin : search.destination,
            new Date(isReturnTab && search.returnDate ? search.returnDate : search.departureDate)
        );
    }, [isReturnTrip, currentTab, search]);

    useEffect(() => {
        setFilteredFlights(currentFlights);
    }, [currentFlights]);

    const canProceed = useMemo(
        () =>
            isReturnTrip
                ? Boolean(outboundFlight && returnFlight)
                : Boolean(outboundFlight),
        [outboundFlight, returnFlight, isReturnTrip]
    );

    useEffect(() => {
        setCanGoNext(canProceed);
    }, [canProceed, setCanGoNext]);

    const prevSelectionRef = useRef<{
        outbound: typeof outboundFlight;
        ret: typeof returnFlight;
    }>({
        outbound: outboundFlight,
        ret: returnFlight,
    });

    useEffect(() => {
        const prev = prevSelectionRef.current;
        const becameSelected =
            (!prev.outbound && outboundFlight) || (!prev.ret && returnFlight);
        prevSelectionRef.current = {outbound: outboundFlight, ret: returnFlight};
    }, [outboundFlight, returnFlight]);

    const handleSelectFlight = useCallback(
        (payload: SelectionPayload | null) => {
            const isOutboundTab = !isReturnTrip || currentTab === 0;
            const currentSelection = isOutboundTab ? outboundFlight : returnFlight;

            if (!payload) {
                if (isOutboundTab) dispatch(selectOutboundFlight(null));
                else dispatch(selectReturnFlight(null));
                return;
            }

            if (
                currentSelection &&
                currentSelection.id === payload.id &&
                currentSelection.selectedClass === payload.selectedClass
            ) {
                if (isOutboundTab) dispatch(selectOutboundFlight(null));
                else dispatch(selectReturnFlight(null));
                return;
            }

            if (isOutboundTab) {
                dispatch(selectOutboundFlight(payload));
                if (isReturnTrip && !returnFlight) setCurrentTab(1);
            } else {
                dispatch(selectReturnFlight(payload));
            }
        },
        [dispatch, isReturnTrip, currentTab, returnFlight, outboundFlight]
    );

    const handleFilteredFlightsChange = useCallback((flights: Flight[]) => {
        setFilteredFlights(flights);
    }, []);

    const getTabLabel = useCallback(
        (index: number): React.ReactNode => {
            const flight = index === 0 ? outboundFlight : returnFlight;
            const label = index === 0 ? "Outbound Flight" : "Return Flight";
            return (
                <Box sx={{display: "flex", alignItems: "center", gap: 1}}>
                    {flight && <Chip label="✓" size="small" color="success"/>}
                    <Typography component="span">{label}</Typography>
                    {flight && (
                        <Typography variant="caption" sx={{opacity: 0.7}}>
                            ({flight.airline})
                        </Typography>
                    )}
                </Box>
            );
        },

        [outboundFlight, returnFlight]
    );

    const selectedFlightId = useMemo(() => {
        const isOutboundTab = !isReturnTrip || currentTab === 0;
        const selectedFlight = isOutboundTab ? outboundFlight : returnFlight;
        return selectedFlight?.id;
    }, [isReturnTrip, currentTab, outboundFlight, returnFlight]);

    if (currentFlights.length === 0) {
        return (
            <Container maxWidth="lg">
                <Box>
                    <Typography variant="h4" align="center" gutterBottom fontWeight={600}>
                        No Flights Available
                    </Typography>
                    <Alert severity="warning" sx={{mt: 3}}>
                        No flights found for your search criteria. Please go back and try
                        different dates or destinations.
                    </Alert>
                </Box>
            </Container>
        );
    }

    const portalTarget = showFilterInSidebar
        ? document.getElementById("flight-filter-portal")
        : null;

    return (
        <Container maxWidth="lg">
            <Box>
                <Typography variant="h4" align="center" gutterBottom fontWeight={600}>
                    Select Your Flight{isReturnTrip ? "s" : ""}
                </Typography>

                {/* Flight switch (tabs) — return trips only */}
                {isReturnTrip && (
                    <Box sx={{mb: 3}}>
                        <Tabs
                            value={currentTab}
                            onChange={(_, v) => setCurrentTab(v as 0 | 1)}
                            centered
                            sx={{
                                "& .MuiTab-root": {
                                    minWidth: 200,
                                    fontWeight: 500,
                                    textTransform: "none",
                                },
                                "& .MuiTab-root.Mui-selected": {
                                    backgroundColor: "primary.light",
                                    borderRadius: 1,
                                    color: "primary.contrastText",
                                },
                            }}
                        >
                            <Tab label={
                                <span>
                                    {getTabLabel(0)}
                                </span>
                            }/>
                            <Tab label={
                                <span>
                                    {getTabLabel(1)}
                                </span>
                            }/>
                        </Tabs>
                    </Box>
                )}

                {/* Subheading: route info */}
                <Typography variant="h6" align="center" gutterBottom>
                    Flights from{" "}
                    <Box component="span" fontWeight="bold" color="primary.main">
                        {isReturnTrip && currentTab === 1
                            ? search.destination
                            : search.origin}
                    </Box>{" "}
                    to{" "}
                    <Box component="span" fontWeight="bold" color="error.main">
                        {isReturnTrip && currentTab === 1
                            ? search.origin
                            : search.destination}
                    </Box>
                </Typography>

                {/* Status info (only for return trips) */}
                {isReturnTrip && (
                    <Alert
                        severity={
                            outboundFlight && returnFlight
                                ? "success"
                                : outboundFlight
                                    ? "info"
                                    : "info"
                        }
                        sx={{mb: 3}}
                    >
                        {!outboundFlight && "Please select your outbound flight first"}
                        {outboundFlight &&
                            !returnFlight &&
                            "Great! Now select your return flight"}
                        {outboundFlight &&
                            returnFlight &&
                            "Both flights selected! You can proceed to the next step"}
                    </Alert>
                )}

                {/* Inline filter (when sidebar filter is disabled) */}
                {!showFilterInSidebar && (
                    <FlightFilter
                        flights={currentFlights}
                        variant="inline"
                        onFilteredFlightsChange={handleFilteredFlightsChange}
                    />
                )}

                {/* Flight cards grid */}
                {filteredFlights.length > 0 ? (
                    <CardGrid
                        items={filteredFlights}
                        renderItem={(flight) => (
                            <FlightCard
                                key={flight.id}
                                flight={flight}
                                onSelect={handleSelectFlight}
                                isSelected={selectedFlightId === flight.id}
                                selectedClass={
                                    selectedFlightId === flight.id
                                        ? currentTab === 0
                                            ? outboundFlight?.selectedClass
                                            : returnFlight?.selectedClass
                                        : undefined
                                }
                            />
                        )}
                    />
                ) : (
                    <Box sx={{textAlign: "center", py: 4}}>
                        <Typography variant="h6" color="text.secondary">
                            No flights match your filters
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Try adjusting your filters
                        </Typography>
                    </Box>
                )}

                {/* Bottom summary */}
                <SelectedFlightsSummary
                    outboundFlight={outboundFlight}
                    returnFlight={returnFlight}
                    search={search}
                />
            </Box>

            {/* Sidebar filter portal */}
            {portalTarget &&
                createPortal(
                    <FlightFilter
                        flights={currentFlights}
                        variant="sidebar"
                        onFilteredFlightsChange={handleFilteredFlightsChange}
                    />,
                    portalTarget
                )}
        </Container>
    );
};

export default FlightResultsStep;