import {createTheme} from '@mui/material/styles';

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
        h4: {fontWeight: 600},
        h6: {fontWeight: 500},
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

    layout: {
        containerPadding: '2rem',
        contentMaxWidth: '900px',
        summaryWidth: '300px',
        stepperFlex: {
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'flex-start',
            gap: '2rem',
            padding: '2rem',
        },
    },
    backgrounds: {
        beach: 'url("https://images.unsplash.com/photo-1507525428034-b723cf961d3e") no-repeat center center',
        beachCover: {
            background: 'url("https://images.unsplash.com/photo-1507525428034-b723cf961d3e") no-repeat center center',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
        },
    },
});

export default airlineTheme;
