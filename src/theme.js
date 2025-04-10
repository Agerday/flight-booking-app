import { createTheme } from '@mui/material/styles';

const airlineTheme = createTheme({
    palette: {
        mode: 'light',
        primary: {
            main: '#0055A5',
        },
        secondary: {
            main: '#FF8200',
        },
        background: {
            default: '#f7f9fc',
            paper: '#ffffff',
        },
        warning: {
            main: '#FFA500',
        },
    },
    shape: {
        borderRadius: 10,
    },
    typography: {
        fontFamily: ['"Segoe UI"', 'Roboto', '"Helvetica Neue"', 'Arial', 'sans-serif'].join(','),
        h4: {
            fontWeight: 600,
        },
        h6: {
            fontWeight: 500,
        },
    },
    components: {
        MuiTextField: {
            defaultProps: {
                variant: 'outlined',
            },
        },
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 10,
                    textTransform: 'none',
                    fontWeight: '600',
                },
            },
        },
    },
});

export default airlineTheme;
