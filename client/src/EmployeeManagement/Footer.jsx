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
        textAlign: 'center',
      }}
    >
      <Container>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Company Info
            </Typography>
            <Typography variant="body2">
              1234 Service Lane
              <br />
              Negombo, Sri Lanka
              <br />
              Phone: (123) 456-7890
              <br />
              Email: info@levvaiggo.com
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Quick Links
            </Typography>
            <Typography variant="body2">
              <a href="/home" style={{ color: '#fff', textDecoration: 'none' }}>Home</a><br />
              <a href="/services" style={{ color: '#fff', textDecoration: 'none' }}>Services</a><br />
              <a href="/about" style={{ color: '#fff', textDecoration: 'none' }}>About Us</a><br />
              <a href="/contact" style={{ color: '#fff', textDecoration: 'none' }}>Contact</a>
            </Typography>
          </Grid>

          <Grid item xs={12} md={4}>
            <Typography variant="h6" gutterBottom>
              Follow Us
            </Typography>
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
          </Grid>
        </Grid>

        <Box sx={{ mt: 4 }}>
          <Typography variant="body2" color="inherit">
            © {new Date().getFullYear()} Levaiggo. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;