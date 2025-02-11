import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Card,
  CardContent,
  Divider,
} from '@mui/material';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

function PatientDashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({
    nextAppointment: null,
    totalAppointments: 0,
    pendingAppointments: 0,
  });

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [appointmentsResponse, statsResponse] = await Promise.all([
          api.get('/patient/appointments'),
          api.get('/patient/stats'),
        ]);

        setAppointments(appointmentsResponse.data);
        setStats(statsResponse.data);
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
      }
    };

    loadDashboardData();
  }, []);

  const handleCancelAppointment = async (appointmentId) => {
    try {
      await api.delete(`/appointments/${appointmentId}`);
      // Atualiza a lista de consultas
      const response = await api.get('/patient/appointments');
      setAppointments(response.data);
    } catch (error) {
      console.error('Erro ao cancelar consulta:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Botão de Nova Consulta */}
        <Grid item xs={12}>
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => navigate('/schedule-appointment')}
            sx={{ mb: 3 }}
          >
            Agendar Nova Consulta
          </Button>
        </Grid>

        {/* Estatísticas */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Próxima Consulta
              </Typography>
              <Typography variant="body1">
                {stats.nextAppointment ? (
                  format(new Date(stats.nextAppointment.datetime), "dd 'de' MMMM 'às' HH:mm", {
                    locale: ptBR,
                  })
                ) : (
                  'Nenhuma consulta agendada'
                )}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total de Consultas
              </Typography>
              <Typography variant="h3">{stats.totalAppointments}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Consultas Pendentes
              </Typography>
              <Typography variant="h3">{stats.pendingAppointments}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Lista de Consultas */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom component="div">
              Minhas Consultas
            </Typography>
            <List>
              {appointments.map((appointment, index) => (
                <Box key={appointment.id}>
                  <ListItem
                    secondaryAction={
                      !appointment.confirmed && (
                        <Button
                          variant="outlined"
                          color="error"
                          onClick={() => handleCancelAppointment(appointment.id)}
                        >
                          Cancelar
                        </Button>
                      )
                    }
                  >
                    <ListItemText
                      primary={`Dr(a). ${appointment.doctor.name} - ${appointment.doctor.speciality}`}
                      secondary={`${format(new Date(appointment.datetime), "dd 'de' MMMM 'às' HH:mm", {
                        locale: ptBR,
                      })} - ${appointment.confirmed ? 'Confirmada' : 'Pendente'}`}
                    />
                  </ListItem>
                  {index < appointments.length - 1 && <Divider />}
                </Box>
              ))}
              {appointments.length === 0 && (
                <ListItem>
                  <ListItemText primary="Nenhuma consulta agendada" />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default PatientDashboard;
