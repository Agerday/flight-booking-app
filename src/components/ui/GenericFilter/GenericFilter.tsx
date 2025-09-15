import React, {useCallback, useMemo, useState} from "react";
import {
    Accordion,
    AccordionDetails,
    AccordionSummary,
    Badge,
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    Divider,
    Drawer,
    IconButton,
    Paper,
    Typography,
    useMediaQuery,
    useTheme,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import ClearIcon from "@mui/icons-material/Clear";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import CloseIcon from "@mui/icons-material/Close";

import {
    FilterConfig,
    FilterSectionProps,
    FilterState,
    GenericFilterProps,
    isCheckboxFilter,
    isDateRangeFilter,
    isRadioFilter,
    isRangeFilter,
    isSelectFilter,
} from "@/types/filter.types";

import CheckboxFilterSection from "@/components/ui/GenericFilter/section/CheckboxFilterSection";
import SelectFilterSection from "@/components/ui/GenericFilter/section/SelectFilterSection";
import RadioFilterSection from "@/components/ui/GenericFilter/section/RadioFilterSection";
import RangeFilterSection from "@/components/ui/GenericFilter/section/RangeFilterSection";
import DateRangeFilterSection from "@/components/ui/GenericFilter/section/DateRangeFilterSection";

const GenericFilter: React.FC<GenericFilterProps> = ({
                                                         groups,
                                                         state,
                                                         onChange,
                                                         variant = "inline",
                                                         showClearButton = true,
                                                         showApplyButton = false,
                                                         showResultCount = false,
                                                         resultCount = 0,
                                                         onClear,
                                                         onApply,
                                                         className,
                                                         dense = false,
                                                     }) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    const [expandedMap, setExpandedMap] = useState<Record<string, boolean>>(() =>
        Object.fromEntries(groups.map((g) => [g.id, !!g.defaultExpanded])) as Record<string, boolean>
    );

    const activeFilterCount = useMemo(() => {
        let count = 0;
        Object.entries(state).forEach(([filterId, value]) => {
            const filter = groups.flatMap((g) => g.filters).find((f) => f.id === filterId);
            if (!filter) return;

            if (isRangeFilter(filter)) {
                const [min, max] = value as [number, number];
                if (min !== filter.min || max !== filter.max) count++;
            } else if (isCheckboxFilter(filter)) {
                if (Array.isArray(value) && value.length > 0) count++;
            } else if (isDateRangeFilter(filter)) {
                if (value && Array.isArray(value) && value[0] && value[1]) count++;
            } else if (value !== null && value !== undefined && value !== "") {
                count++;
            }
        });
        return count;
    }, [state, groups]);

    const hasActiveFilters = useMemo(() => activeFilterCount > 0, [activeFilterCount]);

    const handleFilterChange = useCallback((filterId: string, value: any) => {
        onChange({...state, [filterId]: value});
    }, [onChange, state]);

    const handleClear = useCallback(() => {
        if (onClear) {
            onClear();
            return;
        }

        const clearedState: FilterState = {};
        groups.forEach((group) => {
            group.filters.forEach((filter) => {
                if (isRangeFilter(filter)) {
                    clearedState[filter.id] = [filter.min, filter.max];
                } else if (isCheckboxFilter(filter)) {
                    clearedState[filter.id] = [];
                } else {
                    clearedState[filter.id] = "";
                }
            });
        });
        onChange(clearedState);
    }, [groups, onChange, onClear]);

    const renderFilterSection = (filter: FilterConfig) => {
        const value = state[filter.id];
        return (
            <FilterSection
                key={filter.id}
                filter={filter}
                value={value}
                onChange={(newValue) => handleFilterChange(filter.id, newValue)}
                dense={dense}
            />
        );
    };

    const allExpanded = useMemo(() => groups.every((g) => expandedMap[g.id]), [groups, expandedMap]);

    const toggleExpandAll = useCallback(() => {
        const next = Object.fromEntries(groups.map((g) => [g.id, !allExpanded]));
        setExpandedMap(next as Record<string, boolean>);
    }, [groups, allExpanded]);

    const handlePanelToggle = useCallback((id: string) => (_: React.SyntheticEvent, isExpanded: boolean) => {
        setExpandedMap((prev) => ({...prev, [id]: isExpanded}));
    }, []);

    const renderContent = () => (
        <>
            {/* Header */}
            <Box sx={{display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2}}>
                <Typography
                    variant={dense ? "body1" : "h6"}
                    sx={{display: "flex", alignItems: "center", gap: 1, fontWeight: 500}}
                >
                    <Badge badgeContent={activeFilterCount} color="primary">
                        <FilterListIcon fontSize={dense ? "small" : "medium"}/>
                    </Badge>
                    Filters
                    {showResultCount && (
                        <Typography component="span" variant="body2" color="text.secondary" sx={{ml: 1}}>
                            ({resultCount} results)
                        </Typography>
                    )}
                </Typography>

                {/* Expand / Clear buttons */}
                <Box sx={{display: "flex", gap: 1, alignItems: "center"}}>
                    <Button size={dense ? "small" : "medium"} onClick={toggleExpandAll} sx={{textTransform: "none"}}>
                        {allExpanded ? "Collapse all" : "Expand all"}
                    </Button>
                    {variant !== "sidebar" && showClearButton && hasActiveFilters && (
                        <Button size={dense ? "small" : "medium"} startIcon={<ClearIcon/>} onClick={handleClear}
                                sx={{textTransform: 'none'}}>
                            Clear
                        </Button>
                    )}
                </Box>
            </Box>

            <Divider sx={{mb: 2}}/>

            {/* Accordion Groups */}
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 2,
                    overflowY: "auto",
                    overflowX: "hidden",
                    maxHeight: {xs: '50vh', sm: 'calc(100vh - 220px)'},
                    pr: 1,
                    '&::-webkit-scrollbar': {width: 8, height: 8},
                    '&::-webkit-scrollbar-thumb': {borderRadius: 8, backgroundColor: 'rgba(0,0,0,0.12)'},
                    '&::-webkit-scrollbar-track': {background: 'transparent'},
                    scrollbarWidth: 'thin',
                }}
            >
                {groups.map((group) => (
                    <Accordion
                        key={group.id}
                        expanded={expandedMap[group.id]}
                        onChange={handlePanelToggle(group.id)}
                        disableGutters
                        elevation={0}
                        square
                        sx={{
                            backgroundColor: 'transparent',
                            '&:before': {display: 'none'},
                            width: '100%',
                            boxSizing: 'border-box',
                        }}
                    >
                        <AccordionSummary expandIcon={<ExpandMoreIcon/>} sx={{px: 0}}>
                            <Box sx={{display: 'flex', alignItems: 'center', gap: 1, minWidth: 0}}>
                                <Box sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    overflow: 'hidden',
                                    whiteSpace: 'nowrap'
                                }}>
                                    {group.icon}
                                    <Typography sx={{
                                        fontWeight: 500,
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis'
                                    }}>{group.label}</Typography>
                                </Box>
                            </Box>
                        </AccordionSummary>
                        <AccordionDetails sx={{px: 0}}>
                            <Box sx={{display: 'flex', flexDirection: 'column', gap: 2, width: '100%'}}>
                                {group.filters.map(renderFilterSection)}
                            </Box>
                        </AccordionDetails>
                    </Accordion>
                ))}
            </Box>
        </>
    );

    switch (variant) {
        case 'sidebar':
            return (
                <Paper
                    className={className}
                    elevation={3}
                    sx={{
                        p: dense ? 2 : 3,
                        borderRadius: 2,
                        backdropFilter: 'blur(10px)',
                        backgroundColor: 'rgba(255, 255, 255, 0.95)',
                        height: '100%',
                        display: 'flex',
                        flexDirection: 'column',
                        overflowX: 'hidden',
                    }}
                >
                    {renderContent()}
                    {/* Footer (Clear/Apply buttons) */}
                    <Box
                        sx={{
                            mt: 2,
                            borderTop: '1px solid',
                            borderColor: 'divider',
                            pt: 2,
                            display: 'flex',
                            gap: 1,
                            justifyContent: 'flex-end',
                            position: 'sticky',
                            bottom: 0,
                            background: 'linear-gradient(180deg, rgba(255,255,255,0.0), rgba(255,255,255,0.95))',
                            backdropFilter: 'blur(6px)',
                        }}
                    >
                        {showClearButton && hasActiveFilters && (
                            <Button size={dense ? 'small' : 'medium'} startIcon={<ClearIcon/>} onClick={handleClear}
                                    sx={{textTransform: 'none'}}>
                                Clear
                            </Button>
                        )}
                        {showApplyButton && (
                            <Button size={dense ? 'small' : 'medium'} variant="contained" onClick={onApply}>
                                Apply
                            </Button>
                        )}
                    </Box>
                </Paper>
            );

        case 'modal':
            return (
                <Dialog open maxWidth="md" fullWidth fullScreen={isMobile}>
                    <DialogTitle>
                        <Box sx={{display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                            <Typography variant="h6">Filters</Typography>
                            <IconButton onClick={onClear} size="small">
                                <CloseIcon/>
                            </IconButton>
                        </Box>
                    </DialogTitle>
                    <DialogContent dividers>{renderContent()}</DialogContent>
                    <DialogActions>
                        <Button onClick={handleClear}>Clear All</Button>
                        <Button variant="contained" onClick={onApply}>
                            Apply Filters
                        </Button>
                    </DialogActions>
                </Dialog>
            );

        case 'drawer':
            return (
                <Drawer anchor="right" open PaperProps={{sx: {width: isMobile ? '100%' : 400}}}>
                    <Box sx={{p: dense ? 2 : 3, display: 'flex', flexDirection: 'column', height: '100%'}}>
                        {renderContent()}
                    </Box>
                </Drawer>
            );

        case 'inline':
        default:
            return (
                <Box className={className} sx={{mb: 3}}>
                    {renderContent()}
                </Box>
            );
    }
};

const FilterSection: React.FC<FilterSectionProps> = ({filter, value, onChange, dense}) => {
    if (isCheckboxFilter(filter)) {
        return <CheckboxFilterSection filter={filter} value={value as string[] | number[]} onChange={onChange}
                                      dense={dense}/>;
    }
    if (isRangeFilter(filter)) {
        return <RangeFilterSection filter={filter} value={value as [number, number]} onChange={onChange}
                                   dense={dense}/>;
    }
    if (isRadioFilter(filter)) {
        return <RadioFilterSection filter={filter} value={value as string | number} onChange={onChange} dense={dense}/>;
    }
    if (isSelectFilter(filter)) {
        return <SelectFilterSection filter={filter} value={value} onChange={onChange} dense={dense}/>;
    }
    if (isDateRangeFilter(filter)) {
        return <DateRangeFilterSection filter={filter} value={value as [Date, Date]} onChange={onChange}
                                       dense={dense}/>;
    }
    return null;
};

export default GenericFilter;