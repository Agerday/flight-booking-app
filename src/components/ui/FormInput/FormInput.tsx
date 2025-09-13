import {InputAdornment, MenuItem, TextField, TextFieldProps, Typography} from '@mui/material';
import {Control, Controller, FieldPath, FieldValues} from 'react-hook-form';
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
    inputProps?: TextFieldProps["inputProps"];
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
                                                     inputProps
                                                 }: FormInputProps<T>) {
    return (
        <Controller
            name={name}
            control={control}
            render={({field, fieldState}) => (
                <>
                    <TextField
                        {...field}
                        value={field.value ?? ''}
                        fullWidth
                        label={label}
                        placeholder={placeholder}
                        type={type}
                        disabled={disabled}
                        error={!!fieldState.error}
                        helperText={fieldState.error?.message || ''}
                        select={isSelect}
                        onChange={(e) => {
                            if (type === 'number') {
                                const value = e.target.value;

                                if (value === '') {
                                    field.onChange('');
                                    return;
                                }

                                if (!/^\d+$/.test(value)) return;

                                const numValue = parseInt(value, 10);

                                if (min !== undefined && numValue < min) {
                                    field.onChange(min);
                                } else if (max !== undefined && numValue > max) {
                                    field.onChange(max);
                                } else {
                                    field.onChange(numValue);
                                }
                            } else {
                                field.onChange(e);
                            }
                        }}
                        InputProps={{
                            startAdornment: icon ? (
                                <InputAdornment position="start">{icon}</InputAdornment>
                            ) : undefined,
                            inputProps: {
                                min,
                                max,
                                ...inputProps,
                            }
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
                            sx={{
                                color: 'warning.main',
                                display: 'flex',
                                alignItems: 'center',
                                mt: 0.5,
                                ml: 1,
                            }}
                        >
                            <WarningAmberIcon sx={{fontSize: 16, mr: 0.5}}/>
                            {extraWarning}
                        </Typography>
                    )}
                </>
            )}
        />
    );
}

export default FormInput;