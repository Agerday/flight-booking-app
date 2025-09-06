import {lazy, Suspense} from 'react';
import {BrowserRouter as Router, Route, Routes} from 'react-router-dom';
import {LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterDateFns} from '@mui/x-date-pickers/AdapterDateFns';
import {CssBaseline, ThemeProvider} from '@mui/material';
import airlineTheme from './theme';
import HomePage from './pages/HomePage/HomePage';

const BookingPage = lazy(() => import('./pages/BookingPage/BookingPage'));

// const MyBookings = lazy(() => import('./pages/MyBookings/MyBookings'));

function App() {
    return (
        <LocalizationProvider dateAdapter={AdapterDateFns}>
            <ThemeProvider theme={airlineTheme}>
                <CssBaseline/>
                <Router>
                    <Suspense fallback={<div>Loading...</div>}>
                        <Routes>
                            <Route path="/" element={<HomePage/>}/>
                            <Route path="/book" element={<BookingPage/>}/>
                            {/*<Route path="/my-bookings" element={<PageWrapper><MyBookings/></PageWrapper>}/>*/}
                        </Routes>
                    </Suspense>
                </Router>
            </ThemeProvider>
        </LocalizationProvider>
    );
}

export default App;
