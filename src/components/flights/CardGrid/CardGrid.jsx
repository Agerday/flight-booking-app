import React from 'react';
import {Box} from '@mui/material';

const CardGrid = ({ items, renderItem }) => {
    if (!items || items.length === 0) return null;

    return (
        <Box
            sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: 3,
            }}
        >
            {items.map((item) => (
                <Box
                    key={item.id}
                    sx={{
                        flex: '0 1 calc(50% - 24px)',
                        minWidth: 300,
                        maxWidth: 500,
                        display: 'flex',
                    }}
                >
                    <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                        {renderItem(item)}
                    </Box>
                </Box>
            ))}
        </Box>
    );
};

export default CardGrid;
