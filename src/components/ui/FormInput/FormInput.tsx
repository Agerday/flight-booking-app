import React from 'react';
import { TextField, TextFieldProps, InputAdornment, MenuItem, Typography } from '@mui/material';
import { Controller, Control, FieldPath, FieldValues } from 'react-hook-form';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

interface FormInputProps<T extends FieldValues> {
    name: FieldPath<T>;
    control: Control<T>;
    label: string;
    placeholder?: string;
    icon?: React.ReactNode;
    type?: string;
    isSelect?: boolean;
    options?: Array<{ label: string; value: string | number }>;
    showAutofillWarning?: boolean;
    extraWarning?: string;
    disabled?: boolean;
    min?: number;
    max?: number;
    inputProps?: TextFieldProps['inputProps'];
    formatDisplay?: (value: string) => string;
}

export function FormInput<T extends FieldValues>({
                                                     name,
                                                     control,
                                                     label,
                                                     placeholder,
                                                     icon,
                                                     type = 'text',
                                                     isSelect = false,
                                                     options = [],
                                                     showAutofillWarning = false,
                                                     extraWarning = '',
                                                     disabled = false,
                                                     min,
                                                     max,
                                                     inputProps,
                                                     formatDisplay,
                                                 }: FormInputProps<T>) {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <>
                    <TextField
                        value={formatDisplay ? formatDisplay(field.value ?? '') : field.value ?? ''}
                        onChange={inputProps?.onChange || field.onChange}
                        onBlur={field.onBlur}
                        name={field.name}
                        ref={field.ref}
                        fullWidth
                        label={label}
                        placeholder={placeholder}
                        type={type}
                        disabled={disabled}
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message || placeholder || ''}
                        select={isSelect}
                        InputProps={{
                            startAdornment: icon ? <InputAdornment position="start">{icon}</InputAdornment> : undefined,
                            inputProps: {
                                min,
                                max,
                                ...inputProps,
                                onChange: undefined,
                            },
                        }}
                    >
                        {isSelect &&
                            options.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                    </TextField>

                    {showAutofillWarning && extraWarning && !fieldState.error && (
                        <Typography
                            variant="caption"
                            sx={{ color: 'warning.main', display: 'flex', alignItems: 'center', mt: 0.5, ml: 1 }}
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

export default FormInput;