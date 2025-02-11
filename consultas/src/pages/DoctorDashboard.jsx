import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
  Button,
  Card,
  CardContent,
} from '@mui/material';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';

function DoctorDashboard() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState([]);
  const [stats, setStats] = useState({
    todayAppointments: 0,
    weekAppointments: 0,
    totalPatients: 0,
  });

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        const [appointmentsResponse, statsResponse] = await Promise.all([
          api.get('/appointments/today'),
          api.get('/appointments/stats'),
        ]);

        setAppointments(appointmentsResponse.data);
        setStats(statsResponse.data);
      } catch (error) {
        console.error('Erro ao carregar dados do dashboard:', error);
      }
    };

    loadDashboardData();
  }, []);

  const handleConfirmAppointment = async (appointmentId) => {
    try {
      await api.patch(`/appointments/${appointmentId}/confirm`);
      // Atualiza a lista de consultas
      const response = await api.get('/appointments/today');
      setAppointments(response.data);
    } catch (error) {
      console.error('Erro ao confirmar consulta:', error);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Estatísticas */}
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Consultas Hoje
              </Typography>
              <Typography variant="h3">{stats.todayAppointments}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Consultas na Semana
              </Typography>
              <Typography variant="h3">{stats.weekAppointments}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total de Pacientes
              </Typography>
              <Typography variant="h3">{stats.totalPatients}</Typography>
            </CardContent>
          </Card>
        </Grid>

        {/* Próximas Consultas */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom component="div">
              Próximas Consultas
            </Typography>
            <List>
              {appointments.map((appointment, index) => (
                <Box key={appointment.id}>
                  <ListItem
                    secondaryAction={
                      !appointment.confirmed && (
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleConfirmAppointment(appointment.id)}
                        >
                          Confirmar
                        </Button>
                      )
                    }
                  >
                    <ListItemText
                      primary={appointment.patient.name}
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
                  <ListItemText primary="Nenhuma consulta agendada para hoje" />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default DoctorDashboard;
