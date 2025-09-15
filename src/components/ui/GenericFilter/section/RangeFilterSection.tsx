import {RangeFilter} from "@/types/filter.types";
import {Box, Grid, Input, Slider, Typography} from "@mui/material";
import React from "react";

interface RangeFilterSectionProps {
    filter: RangeFilter;
    value: [number, number];
    onChange: (value: [number, number]) => void;
    dense?: boolean;
}

const RangeFilterSection: React.FC<RangeFilterSectionProps> = ({
                                                                   filter,
                                                                   value,
                                                                   onChange,
                                                                   dense = false,
                                                               }) => {
    const currentValue = value || [filter.min, filter.max];

    const handleSliderChange = (_: Event, newValue: number | number[]) => {
        onChange(newValue as [number, number]);
    };

    const handleInputChange = (index: 0 | 1) => (event: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = [...currentValue] as [number, number];
        newValue[index] = Number(event.target.value);
        onChange(newValue);
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

            <Box sx={{px: dense ? 1 : 2}}>
                <Slider
                    value={currentValue}
                    onChange={handleSliderChange}
                    valueLabelDisplay="auto"
                    valueLabelFormat={filter.formatValue || ((v) => String(v))}
                    min={filter.min}
                    max={filter.max}
                    step={filter.step || 1}
                    marks={filter.marks}
                    size={dense ? 'small' : 'medium'}
                />

                <Grid container spacing={2}>
                    <Grid size={6}>
                        <Input
                            value={currentValue[0]}
                            size="small"
                            onChange={handleInputChange(0)}
                            inputProps={{
                                step: filter.step || 1,
                                min: filter.min,
                                max: currentValue[1],
                                type: 'number',
                            }}
                            fullWidth
                            startAdornment={
                                <Typography variant="caption" color="text.secondary" sx={{mr: 1}}>
                                    Min:
                                </Typography>
                            }
                        />
                    </Grid>
                    <Grid size={6}>
                        <Input
                            value={currentValue[1]}
                            size="small"
                            onChange={handleInputChange(1)}
                            inputProps={{
                                step: filter.step || 1,
                                min: currentValue[0],
                                max: filter.max,
                                type: 'number',
                            }}
                            fullWidth
                            startAdornment={
                                <Typography variant="caption" color="text.secondary" sx={{mr: 1}}>
                                    Max:
                                </Typography>
                            }
                        />
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
};

export default RangeFilterSection;
