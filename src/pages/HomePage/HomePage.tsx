import {useState} from 'react';
import {Box, Button, Container, Fade, Typography} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import FrostedCard from "../../components/layout/FrostedCard/FrostedCard";
import {AnimatePresence, motion} from 'framer-motion';

const HomePage = () => {
    const navigate = useNavigate();
    const [fly, setFly] = useState(false);

    const handleBookingClick = () => {
        setFly(true);
        setTimeout(() => navigate('/book'), 1500);
    };

    return (
        <Box
            sx={{
                position: 'relative',
                minHeight: '100vh',
                backgroundImage: 'url("https://images.unsplash.com/photo-1507525428034-b723cf961d3e")',
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                overflow: 'hidden',
                px: 2,
            }}
        >
            <AnimatePresence>
                {fly && (
                    <motion.img
                        src="/plane.webp"
                        initial={{x: '20%', y: '0%', opacity: 0}}
                        animate={{x: '120%', y: '-10%', opacity: [0, 1, 1, 0]}}
                        exit={{opacity: 0}}
                        transition={{duration: 2, ease: "easeInOut"}}
                        style={{position: 'absolute', width: '250px', zIndex: 10}}
                    />
                )}
            </AnimatePresence>

            <Fade in timeout={1200}>
                <Container maxWidth="sm" sx={{position: 'relative', zIndex: 2}}>
                    <FrostedCard sx={{p: 5, textAlign: 'center', backdropFilter: 'blur(15px)'}}>
                        <Typography variant="h3" gutterBottom fontWeight={700}>
                            🌴 Your Paradise Awaits
                        </Typography>
                        <Typography variant="subtitle1" sx={{mb: 4}}>
                            Embark on a breathtaking journey—explore, select, and book your next unforgettable
                            adventure.
                        </Typography>

                        <Button
                            onClick={handleBookingClick}
                            variant="contained"
                            size="large"
                            sx={{
                                fontWeight: 'bold',
                                borderRadius: 2,
                                px: 4,
                                py: 1.5,
                            }}
                        >
                            Book Your Adventure
                        </Button>
                    </FrostedCard>
                </Container>
            </Fade>
        </Box>
    );
};

export default HomePage;