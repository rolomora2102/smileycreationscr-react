// src/components/HeroSlider/HeroSlider.js
import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { ImagesURLObject } from '../../imagesURLs';

const slides = [
  {
    image: ImagesURLObject.home_hero_main, // Cambia esto con las rutas de tus imágenes
    redirect: '/productos',
  }
];

function HeroSlider() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prevSlide) => (prevSlide + 1) % slides.length);
    }, 5000); // Cambia de imagen cada 5 segundos
    return () => clearInterval(interval);
  }, []);

  const handleRedirect = (redirectPath) => {
    navigate(redirectPath);
  };

  return (
    <Box
      sx={{
        position: 'relative',
        width: '100%',
        height: { xs: '260px', s: '400px', md: '700px' },
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {slides.map((slide, index) => (
        <Box
          key={index}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `url(${slide.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            opacity: index === currentSlide ? 1 : 0,
            maskImage: `linear-gradient(to top, rgba(255, 230, 240, 0), rgba(0, 0, 0, 1) 10%, rgba(0, 0, 0, 1) 100%, rgba(0, 0, 0, 0))`, // Degradado radial para los bordes
            WebkitMaskImage: `linear-gradient(to top, rgba(255, 230, 240, 0, rgba(0, 0, 0, 1) 10%, rgba(0, 0, 0, 1) 100%, rgba(0, 0, 0, 0))`, // Compatibilidad con Safari
            transition: 'opacity 1s ease-in-out',
          }}
        >
          {/* <Box
            sx={{
              position: 'absolute',
              bottom: { xs: '5%', s: '8%', md: '8%' },
              left: { xs: '2%', s: '10%', md: '10%' },
              right: { xs: '70%', s: '40%', md: '80%' },
              color: '#fff',
              background: 'linear-gradient(135deg, rgba(197, 108, 240, 0.7), rgba(255, 183, 197, 0.7))',
              backgroundColor: 'rgba(255, 255, 255, 0.5)',
              padding: '10px 20px',
              borderRadius: '12px',
            }}
          >
            <Typography variant="h4" sx={{ fontWeight: 'bold' }}>
              {slide.title}
            </Typography>
            <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
              {slide.text}
            </Typography>
            <Button
              variant="contained"
              color="primary"
              sx={{ mt: 2 }}
              onClick={() => handleRedirect(slide.redirect)}
            >
              Ver más
            </Button>
          </Box> */}
        </Box>
      ))}
    </Box>
  );
}

export default HeroSlider;
