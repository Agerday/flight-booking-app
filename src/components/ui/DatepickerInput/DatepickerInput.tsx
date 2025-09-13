import React from 'react';
import { InputAdornment, Typography } from '@mui/material';
import { Control, Controller, FieldPath, FieldValues } from 'react-hook-form';
import { DatePicker } from '@mui/x-date-pickers';
import { CalendarMonth } from '@mui/icons-material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

interface DatePickerInputProps<T extends FieldValues> {
    name: FieldPath<T>;
    control: Control<T>;
    label: string;
    placeholder?: string;
    icon?: React.ReactNode;
    showAutofillWarning?: boolean;
    extraWarning?: string;
    disabled?: boolean;
    shouldDisableDate?: (date: Date) => boolean;
    minDate?: Date;
    maxDate?: Date;
}

export function DatePickerInput<T extends FieldValues>({
                                                           name,
                                                           control,
                                                           label,
                                                           placeholder,
                                                           icon = <CalendarMonth />,
                                                           showAutofillWarning = false,
                                                           extraWarning = '',
                                                           disabled = false,
                                                           shouldDisableDate,
                                                           minDate,
                                                           maxDate,
                                                       }: DatePickerInputProps<T>) {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <>
                    <DatePicker
                        label={label}
                        value={field.value || null}
                        onChange={(newValue) => {
                            field.onChange(newValue);
                        }}
                        disabled={disabled}
                        shouldDisableDate={shouldDisableDate}
                        minDate={minDate}
                        maxDate={maxDate}
                        slotProps={{
                            textField: {
                                fullWidth: true,
                                placeholder,
                                error: !!fieldState.error,
                                helperText: fieldState.error?.message || '',
                                InputProps: {
                                    startAdornment: icon ? (
                                        <InputAdornment position="start">{icon}</InputAdornment>
                                    ) : undefined,
                                },
                            },
                        }}
                    />

                    {showAutofillWarning && extraWarning && !fieldState.error && (
                        <Typography
                            variant="caption"
                            sx={{
                                color: 'warning.main',
                                display: 'flex',
                                alignItems: 'center',
                                mt: 0.5,
                                ml: 1,
                            }}
                        >
                            <WarningAmberIcon sx={{ fontSize: 16, mr: 0.5 }} />
                            {extraWarning}
                        </Typography>
                    )}
                </>
            )}
        />
    );
}

export default DatePickerInput;