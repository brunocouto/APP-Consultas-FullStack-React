import { Box, Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

function NotFound() {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '60vh',
          textAlign: 'center',
        }}
      >
        <Typography variant="h1" color="primary" gutterBottom>
          404
        </Typography>
        <Typography variant="h4" gutterBottom>
          Página não encontrada
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          A página que você está procurando não existe ou foi removida.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => navigate('/')}
          sx={{ mt: 2 }}
        >
          Voltar para a página inicial
        </Button>
      </Box>
    </Container>
  );
}

export default NotFound;
