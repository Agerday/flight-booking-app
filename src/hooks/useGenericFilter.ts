import {useCallback, useEffect, useMemo, useState} from 'react';
import {FilterGroupConfig, FilterState, FilterValue, isCheckboxFilter, isRangeFilter,} from '@/types/filter.types';

interface UseGenericFilterOptions<T> {
    data: T[];
    groups: FilterGroupConfig[];
    filterFunctions: FilterFunctionMap<T>;
    debounceMs?: number;
}

type FilterFunction<T> = (item: T, value: any) => boolean;
type FilterFunctionMap<T> = Record<string, FilterFunction<T>>;

export function useGenericFilter<T>({
                                        data,
                                        groups,
                                        filterFunctions,
                                        debounceMs = 0,
                                    }: UseGenericFilterOptions<T>) {
    const initialState = useMemo((): FilterState => {
        const state: FilterState = {};
        groups.forEach(group => {
            group.filters.forEach(filter => {
                if (isRangeFilter(filter)) {
                    state[filter.id] = [filter.min, filter.max];
                } else if (isCheckboxFilter(filter)) {
                    state[filter.id] = [];
                } else {
                    state[filter.id] = '';
                }
            });
        });
        return state;
    }, [groups]);

    const [filterState, setFilterState] = useState<FilterState>(initialState);
    const [debouncedFilterState, setDebouncedFilterState] = useState<FilterState>(filterState);

    useEffect(() => {
        if (debounceMs > 0) {
            const timer = setTimeout(() => {
                setDebouncedFilterState(filterState);
            }, debounceMs);
            return () => clearTimeout(timer);
        } else {
            setDebouncedFilterState(filterState);
        }
    }, [filterState, debounceMs]);

    const filteredData = useMemo(() => {
        return data.filter(item => {
            return Object.entries(debouncedFilterState).every(([filterId, value]) => {
                const filterFunction = filterFunctions[filterId];
                if (!filterFunction) return true;
                if (value === null || value === undefined || value === '') return true;
                if (Array.isArray(value) && value.length === 0) return true;
                const filter = groups
                    .flatMap(g => g.filters)
                    .find(f => f.id === filterId);
                if (filter && isRangeFilter(filter)) {
                    const [min, max] = value as [number, number];
                    if (min === filter.min && max === filter.max) return true;
                }
                return filterFunction(item, value);
            });
        });
    }, [data, debouncedFilterState, filterFunctions, groups]);

    const getFilteredCount = useCallback((filterId: string, filterValue: FilterValue): number => {
        const filterFunction = filterFunctions[filterId];
        if (!filterFunction) return 0;
        return data.filter(item => filterFunction(item, filterValue)).length;
    }, [data, filterFunctions]);

    const groupsWithCounts = useMemo(() => {
        return groups.map(group => ({
            ...group,
            filters: group.filters.map(filter => {
                if (filter.type === "checkbox" || filter.type === "radio" || filter.type === "select") {
                    return {
                        ...filter,
                        options: filter.options.map(option => {
                            const count = data.filter(item => {
                                return Object.entries(debouncedFilterState).every(([fid, value]) => {
                                    const fn = filterFunctions[fid];
                                    if (!fn) return true;
                                    if (fid === filter.id) return fn(item, [option.value]); // only this option
                                    if (value === null || value === undefined || value === '') return true;
                                    if (Array.isArray(value) && value.length === 0) return true;
                                    return fn(item, value);
                                });
                            }).length;
                            return {...option, count};
                        }),
                    };
                }
                return filter;
            }),
        }));
    }, [groups, data, filterFunctions, debouncedFilterState]);

    const clearFilters = useCallback(() => {
        setFilterState(initialState);
    }, [initialState]);

    const updateFilter = useCallback((filterId: string, value: any) => {
        setFilterState(prev => ({
            ...prev,
            [filterId]: value,
        }));
    }, []);

    const hasActiveFilters = useMemo(() => {
        return Object.entries(filterState).some(([filterId, value]) => {
            if (Array.isArray(value)) return value.length > 0;
            if (value === null || value === undefined || value === '') return false;
            const filter = groups
                .flatMap(g => g.filters)
                .find(f => f.id === filterId);
            if (filter && isRangeFilter(filter)) {
                const [min, max] = value as unknown as [number, number];
                return min !== filter.min || max !== filter.max;
            }
            return true;
        });
    }, [filterState, groups]);

    const activeFilterCount = useMemo(() => {
        return Object.entries(filterState).reduce((count, [filterId, value]) => {
            if (Array.isArray(value) && value.length > 0) return count + 1;
            if (value === null || value === undefined || value === '') return count;
            const filter = groups
                .flatMap(g => g.filters)
                .find(f => f.id === filterId);
            if (filter && isRangeFilter(filter)) {
                const [min, max] = value as [number, number];
                if (min === filter.min && max === filter.max) return count;
            }
            return count + 1;
        }, 0);
    }, [filterState, groups]);

    return {
        filterState,
        setFilterState,
        filteredData,
        groupsWithCounts,
        clearFilters,
        updateFilter,
        hasActiveFilters,
        activeFilterCount,
        getFilteredCount,
    };
}

export function useFilterFunctions<T>() {
    const createRangeFilter = useCallback(
        (getValue: (item: T) => number): FilterFunction<T> => {
            return (item, value) => {
                const [min, max] = Array.isArray(value) ? value : [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER];
                const itemValue = getValue(item);
                return itemValue >= min && itemValue <= max;
            };
        },
        []
    );

    const createMultiSelectFilter = useCallback(
        (getValue: (item: T) => FilterValue): FilterFunction<T> => {
            return (item, value) => {
                const values = Array.isArray(value) ? value : [];
                if (values.length === 0) return true;
                const itemValue = getValue(item);
                return values.includes(itemValue);
            };
        },
        []
    );

    const createSingleSelectFilter = useCallback(
        (getValue: (item: T) => FilterValue): FilterFunction<T> => {
            return (item, value) => {
                if (!value) return true;
                return getValue(item) === value;
            };
        },
        []
    );

    const createTextFilter = useCallback(
        (getValue: (item: T) => string): FilterFunction<T> => {
            return (item, value) => {
                if (!value) return true;
                const searchValue = String(value).toLowerCase();
                const itemValue = getValue(item).toLowerCase();
                return itemValue.includes(searchValue);
            };
        },
        []
    );

    const createDateRangeFilter = useCallback(
        (getValue: (item: T) => Date): FilterFunction<T> => {
            return (item, value) => {
                const [startDate, endDate] = Array.isArray(value) ? value : [null, null];
                const itemDate = getValue(item);
                return itemDate >= startDate && itemDate <= endDate;
            };
        },
        []
    );

    return {
        createRangeFilter,
        createMultiSelectFilter,
        createSingleSelectFilter,
        createTextFilter,
        createDateRangeFilter,
    };
}
