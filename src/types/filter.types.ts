import React from "react";

export type FilterValue = string | number | boolean | Date;
export type FilterRange<T extends FilterValue = number> = [T, T];

export interface BaseFilter<T extends FilterValue = FilterValue> {
    id: string;
    label: string;
    icon?: React.ReactNode;
    type: 'checkbox' | 'radio' | 'range' | 'date-range' | 'select' | 'multi-select';
    defaultExpanded?: boolean;
}

export interface CheckboxFilter<T extends FilterValue = string> extends BaseFilter<T> {
    type: 'checkbox';
    options: CheckboxOption<T>[];
    multiple?: boolean;
}

export interface RadioFilter<T extends FilterValue = string> extends BaseFilter<T> {
    type: 'radio';
    options: RadioOption<T>[];
}

export interface RangeFilter<T extends FilterValue = number> extends BaseFilter<T> {
    type: 'range';
    min: T;
    max: T;
    step?: number;
    formatValue?: (value: T) => string;
    marks?: Array<{ value: number; label?: string }>;
}

export interface DateRangeFilter extends BaseFilter<Date> {
    type: 'date-range';
    minDate?: Date;
    maxDate?: Date;
    formatDate?: (date: Date) => string;
}

export interface SelectFilter<T extends FilterValue = string> extends BaseFilter<T> {
    type: 'select' | 'multi-select';
    options: SelectOption<T>[];
    multiple?: boolean;
    searchable?: boolean;
    placeholder?: string;
}

export type FilterConfig<T extends FilterValue = FilterValue> =
    | CheckboxFilter<T>
    | RadioFilter<T>
    | RangeFilter<T extends number ? T : never>
    | DateRangeFilter
    | SelectFilter<T>;

export interface FilterOption<T extends FilterValue = FilterValue> {
    value: T;
    label: string;
    count?: number;
    disabled?: boolean;
    icon?: React.ReactNode;
    color?: string;
}

export type CheckboxOption<T extends FilterValue = FilterValue> = FilterOption<T>;
export type RadioOption<T extends FilterValue = FilterValue> = FilterOption<T>;
export type SelectOption<T extends FilterValue = FilterValue> = FilterOption<T>;

export interface FilterState {
    [filterId: string]: FilterValue | FilterValue[] | FilterRange;
}

export interface FilterGroupConfig {
    id: string;
    label: string;
    filters: FilterConfig[];
    collapsible?: boolean;
    defaultExpanded?: boolean;
    icon?: React.ReactNode;
}

export interface GenericFilterProps {
    groups: FilterGroupConfig[];
    state: FilterState;
    onChange: (state: FilterState) => void;
    variant?: 'inline' | 'sidebar' | 'modal' | 'drawer';
    showClearButton?: boolean;
    showApplyButton?: boolean;
    showResultCount?: boolean;
    resultCount?: number;
    onClear?: () => void;
    onApply?: () => void;
    className?: string;
    dense?: boolean;
    orientation?: 'vertical' | 'horizontal';
}

export interface FilterSectionProps {
    filter: FilterConfig;
    value: FilterValue | FilterValue[] | FilterRange;
    onChange: (value: FilterValue | FilterValue[] | FilterRange) => void;
    variant?: 'inline' | 'sidebar' | 'modal' | 'drawer';
    dense?: boolean;
}

export const isCheckboxFilter = (filter: FilterConfig): filter is CheckboxFilter =>
    filter.type === 'checkbox';

export const isRadioFilter = (filter: FilterConfig): filter is RadioFilter =>
    filter.type === 'radio';

export const isRangeFilter = (filter: FilterConfig): filter is RangeFilter =>
    filter.type === 'range';

export const isDateRangeFilter = (filter: FilterConfig): filter is DateRangeFilter =>
    filter.type === 'date-range';

export const isSelectFilter = (filter: FilterConfig): filter is SelectFilter =>
    filter.type === 'select' || filter.type === 'multi-select';

export class FilterBuilder {
    static checkbox<T extends FilterValue = string>(
        id: string,
        label: string,
        options: Array<{ value: T; label: string; count?: number }>
    ): CheckboxFilter<T> {
        return {
            id,
            label,
            type: 'checkbox',
            options: options.map(opt => ({
                value: opt.value,
                label: opt.label,
                count: opt.count,
                disabled: opt.count === 0,
            })),
            multiple: true,
        };
    }

    static range(
        id: string,
        label: string,
        min: number,
        max: number,
        config?: {
            step?: number;
            formatValue?: (value: number) => string;
            icon?: React.ReactNode;
        }
    ): RangeFilter {
        return {
            id,
            label,
            type: 'range',
            min,
            max,
            step: config?.step ?? 1,
            formatValue: config?.formatValue ?? ((v) => String(v)),
            icon: config?.icon,
        };
    }

    static select<T extends FilterValue = string>(
        id: string,
        label: string,
        options: Array<{ value: T; label: string }>,
        config?: {
            multiple?: boolean;
            searchable?: boolean;
            placeholder?: string;
            icon?: React.ReactNode;
        }
    ): SelectFilter<T> {
        return {
            id,
            label,
            type: config?.multiple ? 'multi-select' : 'select',
            options,
            multiple: config?.multiple,
            searchable: config?.searchable,
            placeholder: config?.placeholder,
            icon: config?.icon,
        };
    }

    static dateRange(
        id: string,
        label: string,
        config?: {
            minDate?: Date;
            maxDate?: Date;
            formatDate?: (date: Date) => string;
            icon?: React.ReactNode;
        }
    ): DateRangeFilter {
        return {
            id,
            label,
            type: 'date-range',
            minDate: config?.minDate,
            maxDate: config?.maxDate,
            formatDate: config?.formatDate,
            icon: config?.icon,
        };
    }
}