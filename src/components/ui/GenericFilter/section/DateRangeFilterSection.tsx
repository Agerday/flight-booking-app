import {DateRangeFilter} from "@/types/filter.types";
import {Box, Typography} from "@mui/material";
import {DatePicker, LocalizationProvider} from "@mui/x-date-pickers";
import {AdapterDateFns} from "@mui/x-date-pickers/AdapterDateFns";
import React from "react";

interface DateRangeFilterSectionProps {
    filter: DateRangeFilter;
    value: [Date, Date] | undefined;
    onChange: (value: [Date, Date]) => void;
    dense?: boolean;
}

const DateRangeFilterSection: React.FC<DateRangeFilterSectionProps> = ({
                                                                           filter,
                                                                           value,
                                                                           onChange,
                                                                           dense = false,
                                                                       }) => {
    const [startDate, endDate] = value || [null, null];

    const handleStartChange = (date: Date | null) => {
        if (date) {
            onChange([date, endDate || date]);
        }
    };

    const handleEndChange = (date: Date | null) => {
        if (date && startDate) {
            onChange([startDate, date]);
        }
    };

    return (
        <Box>
            {filter.label && (
                <Box sx={{display: 'flex', alignItems: 'center', gap: 1, mb: 1}}>
                    {filter.icon}
                    <Typography variant={dense ? 'body2' : 'subtitle2'} fontWeight={500}>
                        {filter.label}
                    </Typography>
                </Box>
            )}

            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <Box sx={{display: 'flex', flexDirection: 'column', gap: 1}}>
                    <DatePicker
                        label="Start Date"
                        value={startDate}
                        onChange={handleStartChange}
                        minDate={filter.minDate}
                        maxDate={filter.maxDate}
                        slotProps={{
                            textField: {
                                size: dense ? 'small' : 'medium',
                                fullWidth: true,
                            }
                        }}
                    />
                    <DatePicker
                        label="End Date"
                        value={endDate}
                        onChange={handleEndChange}
                        minDate={startDate || filter.minDate}
                        maxDate={filter.maxDate}
                        slotProps={{
                            textField: {
                                size: dense ? 'small' : 'medium',
                                fullWidth: true,
                            }
                        }}
                    />
                </Box>
            </LocalizationProvider>
        </Box>
    );
};

export default DateRangeFilterSection;