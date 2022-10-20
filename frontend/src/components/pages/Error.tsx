import React from 'react';
import {Box, Container, Typography} from '@mui/material';
import Grid from '@mui/material/Grid';

export default function Error() {
    return (
        <Box
            sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh'
            }}
        >
            <Container maxWidth="md">
                <Grid container spacing={2}>
                    <Grid xs={4}>
                        <Typography variant="h1">
                            404
                        </Typography>
                    </Grid>
                    <Grid xs={8}>
                        <Typography variant="h3">
                            The page you’re looking for doesn’t exist.
                        </Typography>
                    </Grid>
                </Grid>
            </Container>
        </Box>
    );
}
