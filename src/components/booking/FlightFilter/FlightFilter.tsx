import React from 'react';
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Box,
    Button,
    Checkbox,
    Chip,
    Divider,
    FormControlLabel,
    FormGroup,
    Paper,
    Slider,
    Typography,
} from '@mui/material';
import {
    Airlines as AirlinesIcon,
    AttachMoney as MoneyIcon,
    Clear as ClearIcon,
    ExpandMore as ExpandMoreIcon,
    FilterList as FilterListIcon,
    Flight as FlightIcon,
} from '@mui/icons-material';
import {FlightFilterProps} from '../../../types/filter.types';
import {useFlightFilters} from '../../../hooks/useFlightFilters';

const FlightFilter: React.FC<FlightFilterProps> = ({
                                                       flights,
                                                       filters,
                                                       onFiltersChange,
                                                       variant = 'inline',
                                                   }) => {
    const isSidebar = variant === 'sidebar';

    const {
        filterOptions,
        hasActiveFilters,
        getFilteredCount,
    } = useFlightFilters({flights});

    const handlePriceChange = (_: Event, newValue: number | number[]) => {
        onFiltersChange({
            ...filters,
            priceRange: newValue as [number, number],
        });
    };

    const handleFilterToggle = (
        type: 'airlines' | 'stops',
        value: string | number
    ) => {
        if (type === 'airlines') {
            const currentValues = filters.airlines;
            const updated = currentValues.includes(value as string)
                ? currentValues.filter((v) => v !== value)
                : [...currentValues, value as string];

            onFiltersChange({
                ...filters,
                airlines: updated,
            });
        }

        if (type === 'stops') {
            const currentValues = filters.stops;
            const updated = currentValues.includes(value as number)
                ? currentValues.filter((v) => v !== value)
                : [...currentValues, value as number];

            onFiltersChange({
                ...filters,
                stops: updated,
            });
        }
    };

    const handleClearFilters = () => {
        onFiltersChange({
            priceRange: filterOptions.priceRange,
            airlines: [],
            stops: [],
            timeOfDay: [],
        });
    };

    const getStopsLabel = (stops: number) => {
        return stops === 0 ? 'Direct' : `${stops} Stop${stops > 1 ? 's' : ''}`;
    };

    const containerSx = isSidebar ? {
        p: 3,
        bgcolor: 'background.paper',
        borderRadius: 2,
        backdropFilter: 'blur(10px)',
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
    } : {mb: 3};

    const Container: React.ElementType = isSidebar ? Paper : Box;

    return (
        <Container elevation={isSidebar ? 3 : 0} sx={containerSx}>
            {/* Header */}
            <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2}}>
                <Typography variant="h6" sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                    <FilterListIcon/>
                    Filters
                </Typography>
                {hasActiveFilters && (
                    <Button
                        size="small"
                        startIcon={<ClearIcon/>}
                        onClick={handleClearFilters}
                        sx={{textTransform: 'none'}}
                    >
                        Clear
                    </Button>
                )}
            </Box>

            <Divider sx={{mb: 2}}/>

            {/* Price Range */}
            <FilterSection
                title="Price Range"
                icon={<MoneyIcon fontSize="small" color="primary"/>}
                defaultExpanded={isSidebar}
            >
                <Box sx={{px: 1}}>
                    <Slider
                        value={filters.priceRange}
                        onChange={handlePriceChange}
                        valueLabelDisplay="auto"
                        valueLabelFormat={(value) => `€${value}`}
                        min={filterOptions.priceRange[0]}
                        max={filterOptions.priceRange[1]}
                    />
                    <Box sx={{display: 'flex', justifyContent: 'space-between'}}>
                        <Typography variant="caption" color="text.secondary">
                            €{filters.priceRange[0]}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            €{filters.priceRange[1]}
                        </Typography>
                    </Box>
                </Box>
            </FilterSection>

            {/* Stops */}
            <FilterSection
                title="Stops"
                icon={<FlightIcon fontSize="small" color="primary"/>}
                defaultExpanded={isSidebar}
            >
                <FilterCheckboxGroup
                    options={filterOptions.stops}
                    selected={filters.stops}
                    getLabel={getStopsLabel}
                    getCount={(value) => getFilteredCount('stops', value)}
                    onChange={(value) => handleFilterToggle('stops', value)}
                />
            </FilterSection>

            {/* Airlines */}
            <FilterSection
                title="Airlines"
                icon={<AirlinesIcon fontSize="small" color="primary"/>}
                defaultExpanded={isSidebar}
            >
                <FilterCheckboxGroup
                    options={filterOptions.airlines}
                    selected={filters.airlines}
                    getLabel={(value) => String(value)}
                    getCount={(value) => getFilteredCount('airline', value)}
                    onChange={(value) => handleFilterToggle('airlines', value)}
                />
            </FilterSection>
        </Container>
    );
};

// Reusable Filter Section Component
interface FilterSectionProps {
    title: string;
    icon: React.ReactNode;
    defaultExpanded: boolean;
    children: React.ReactNode;
}

const FilterSection: React.FC<FilterSectionProps> = ({title, icon, defaultExpanded, children}) => (
    <Accordion
        defaultExpanded={defaultExpanded}
        sx={{
            boxShadow: 'none',
            '&:before': {display: 'none'},
            backgroundColor: 'transparent',
        }}
    >
        <AccordionSummary expandIcon={<ExpandMoreIcon/>} sx={{px: 0}}>
            <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                {icon}
                <Typography fontWeight={500}>{title}</Typography>
            </Box>
        </AccordionSummary>
        <AccordionDetails sx={{px: 0}}>
            {children}
        </AccordionDetails>
    </Accordion>
);

// Reusable Checkbox Group Component
interface FilterCheckboxGroupProps<T> {
    options: T[];
    selected: T[];
    getLabel: (value: T) => string;
    getCount: (value: T) => number;
    onChange: (value: T) => void;
}

function FilterCheckboxGroup<T extends string | number>({
                                                            options,
                                                            selected,
                                                            getLabel,
                                                            getCount,
                                                            onChange,
                                                        }: FilterCheckboxGroupProps<T>) {
    return (
        <FormGroup>
            {options.map(option => {
                const count = getCount(option);
                const isDisabled = count === 0;

                return (
                    <FormControlLabel
                        key={String(option)}
                        control={
                            <Checkbox
                                checked={selected.includes(option)}
                                onChange={() => onChange(option)}
                                size="small"
                                disabled={isDisabled}
                            />
                        }
                        label={
                            <Box sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                width: '100%',
                                opacity: isDisabled ? 0.5 : 1,
                            }}>
                                <Typography variant="body2">
                                    {getLabel(option)}
                                </Typography>
                                <Chip
                                    label={count}
                                    size="small"
                                    variant="outlined"
                                    sx={{height: 20, minWidth: 28}}
                                />
                            </Box>
                        }
                        sx={{
                            width: '100%',
                            mr: 0,
                            '& .MuiFormControlLabel-label': {
                                flexGrow: 1,
                                ml: 1,
                            }
                        }}
                    />
                );
            })}
        </FormGroup>
    );
}

export default FlightFilter;