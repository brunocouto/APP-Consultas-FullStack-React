import { Box, Button, Container, Grid, Typography, Card, CardContent, useTheme } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import SearchIcon from '@mui/icons-material/Search';
import HistoryIcon from '@mui/icons-material/History';
import React from 'react';

function Home() {
  const navigate = useNavigate();
  const { signed } = useAuth();
  const theme = useTheme();

  const features = [
    {
      icon: <SearchIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: 'Encontre Especialistas',
      description: 'Busque médicos por especialidade, localização ou nome. Veja avaliações de outros pacientes.'
    },
    {
      icon: <CalendarMonthIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: 'Agendamento Flexível',
      description: 'Escolha o melhor horário para você. Receba confirmações e lembretes por e-mail.'
    },
    {
      icon: <HistoryIcon sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      title: 'Histórico Completo',
      description: 'Mantenha um registro de todas as suas consultas e exames em um só lugar.'
    }
  ];

  return (
    <Box sx={{ 
      flexGrow: 1,
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      textAlign: 'center',
      width: '100%'
    }}>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: { xs: 6, md: 12 },
          width: '100vw',
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Container maxWidth="lg" sx={{ px: 3 }}>
          <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 3,
            width: '100%'
          }}>
            <Typography
              component="h1"
              variant="h2"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '2.5rem', md: '3.75rem' }
              }}
            >
              Bem-vindo ao ConsultasApp
            </Typography>
            <Typography
              variant="h5"
              sx={{ 
                opacity: 0.9, 
                fontSize: { xs: '1.25rem', md: '1.5rem' },
                maxWidth: '800px',
                mx: 'auto'
              }}
            >
              Agende suas consultas médicas de forma rápida e fácil
            </Typography>
            {!signed && (
              <Box sx={{ 
                mt: 2,
                display: 'flex',
                gap: 2,
                flexWrap: 'wrap',
                justifyContent: 'center'
              }}>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    bgcolor: 'white',
                    color: 'primary.main',
                    '&:hover': {
                      bgcolor: 'grey.100',
                    },
                  }}
                  onClick={() => navigate('/register')}
                >
                  Cadastre-se Gratuitamente
                </Button>
                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    '&:hover': {
                      borderColor: 'grey.100',
                      bgcolor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                  onClick={() => navigate('/login')}
                >
                  Fazer Login
                </Button>
              </Box>
            )}
            {signed && (
              <Box sx={{ mt: 2 }}>
                <Button
                  variant="contained"
                  size="large"
                  sx={{
                    bgcolor: 'white',
                    color: 'primary.main',
                    '&:hover': {
                      bgcolor: 'grey.100',
                    },
                  }}
                  onClick={() => navigate('/schedule-appointment')}
                >
                  Agendar Consulta
                </Button>
              </Box>
            )}
          </Box>
        </Container>
      </Box>

      {/* Espaço entre o hero e os cards */}
      <Box sx={{ height: '50px' }} />

      {/* Features Section */}
      <Container 
        maxWidth="xl" 
        sx={{ 
          px: 4,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <Grid 
          container 
          spacing={4} 
          sx={{ 
            display: 'flex',
            justifyContent: 'center',
            maxWidth: '1200px',
            margin: '0 auto'
          }}
        >
          {features.map((feature, index) => (
            <Grid 
              item 
              xs={12} 
              sm={6} 
              md={4} 
              key={index}
              sx={{
                display: 'flex',
                justifyContent: 'center'
              }}
            >
              <Card sx={{ 
                height: '100%', 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                p: 2,
                width: '100%',
                maxWidth: '350px'
              }}>
                <CardContent>
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography gutterBottom variant="h5" component="h2">
                    {feature.title}
                  </Typography>
                  <Typography>
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Call to Action Section */}
      <Box
        sx={{
          bgcolor: 'grey.100',
          py: 8,
          borderRadius: { xs: 0, md: 2 },
          mt: 4,
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h3"
            align="center"
            gutterBottom
            sx={{ fontWeight: 700 }}
          >
            Comece a cuidar da sua saúde hoje
          </Typography>
          <Typography
            variant="h6"
            align="center"
            color="text.secondary"
            paragraph
          >
            Junte-se a milhares de pacientes que já estão usando o ConsultasApp para
            cuidar melhor da sua saúde.
          </Typography>
          <Box sx={{ mt: 4, textAlign: 'center' }}>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate(signed ? '/schedule-appointment' : '/register')}
            >
              {signed ? 'Agendar Consulta' : 'Começar Agora'}
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}

export default Home;
