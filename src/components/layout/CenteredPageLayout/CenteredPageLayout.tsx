import React from 'react';
import {Box, Container} from '@mui/material';
import FrostedCard from "../FrostedCard/FrostedCard";

interface Props {
    children: React.ReactNode;
    useCard?: boolean;
}

const CenteredPageLayout = ({
                                children, useCard = true
                            }: Props) => {
    const Wrapper = useCard ? FrostedCard : React.Fragment;

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                px: 2,
            }}
        >
            <Container maxWidth="md">
                <Wrapper sx={{p: 4}}>
                    {children}
                </Wrapper>
            </Container>
        </Box>
    );
};

export default CenteredPageLayout;
