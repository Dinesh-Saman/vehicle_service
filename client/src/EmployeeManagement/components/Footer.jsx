import React from 'react';
import { Box, Container, Grid, Typography, IconButton } from '@mui/material';
import { Facebook, Twitter, Instagram, LinkedIn } from '@mui/icons-material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        backgroundColor: '#333',
        color: '#fff',
        py: 4,
        mt: 5,
        display: 'flex', // Set display to flex
        justifyContent: 'space-between', // Align items to the left and right
        alignItems: 'center', // Center items vertically
        padding: '0 470px', // Add padding for left/right spacing
      }}
    >
      <Container sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
        <Box>
          <Typography variant="body2" color="inherit">
            © {new Date().getFullYear()} Levaiggo. All rights reserved.
          </Typography>
        </Box>
        <Box>
          <IconButton color="inherit" aria-label="facebook" href="https://facebook.com">
            <Facebook />
          </IconButton>
          <IconButton color="inherit" aria-label="twitter" href="https://twitter.com">
            <Twitter />
          </IconButton>
          <IconButton color="inherit" aria-label="instagram" href="https://instagram.com">
            <Instagram />
          </IconButton>
          <IconButton color="inherit" aria-label="linkedin" href="https://linkedin.com">
            <LinkedIn />
          </IconButton>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
