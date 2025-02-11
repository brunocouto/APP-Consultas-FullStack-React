import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Avatar,
  Rating,
  List,
  ListItem,
  ListItemText,
  Divider,
  Box,
  Button,
  Card,
  CardContent,
} from '@mui/material';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import api from '../services/api';

function DoctorProfile() {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    const loadDoctorData = async () => {
      try {
        const [doctorResponse, reviewsResponse, scheduleResponse] = await Promise.all([
          api.get(`/doctors/${id}`),
          api.get(`/doctors/${id}/reviews`),
          api.get(`/doctors/${id}/schedule`),
        ]);

        setDoctor(doctorResponse.data);
        setReviews(reviewsResponse.data);
        setSchedule(scheduleResponse.data);
      } catch (error) {
        console.error('Erro ao carregar dados do médico:', error);
      }
    };

    loadDoctorData();
  }, [id]);

  if (!doctor) {
    return (
      <Container>
        <Typography>Carregando...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        {/* Informações do Médico */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Avatar
              src={doctor.avatar}
              sx={{ width: 120, height: 120, mb: 2 }}
            />
            <Typography variant="h5" gutterBottom>
              Dr(a). {doctor.name}
            </Typography>
            <Typography color="textSecondary" gutterBottom>
              {doctor.specialty}
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Rating value={doctor.rating} readOnly />
              <Typography variant="body2" sx={{ ml: 1 }}>
                ({doctor.reviewsCount} avaliações)
              </Typography>
            </Box>
            <Button
              variant="contained"
              color="primary"
              fullWidth
              href={`/schedule-appointment?doctor=${id}`}
            >
              Agendar Consulta
            </Button>
          </Paper>
        </Grid>

        {/* Horários Disponíveis */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Horários de Atendimento
            </Typography>
            <Grid container spacing={2}>
              {schedule.map((day) => (
                <Grid item xs={12} sm={6} key={day.weekDay}>
                  <Card>
                    <CardContent>
                      <Typography variant="subtitle1" gutterBottom>
                        {format(new Date(day.date), 'EEEE', { locale: ptBR })}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {day.slots.map((slot) => format(new Date(slot), 'HH:mm')).join(', ')}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Avaliações */}
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Avaliações dos Pacientes
            </Typography>
            <List>
              {reviews.map((review, index) => (
                <Box key={review.id}>
                  <ListItem alignItems="flex-start">
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                          <Typography component="span" variant="subtitle1" sx={{ mr: 1 }}>
                            {review.patientName}
                          </Typography>
                          <Rating value={review.rating} size="small" readOnly />
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography
                            component="span"
                            variant="body2"
                            color="textPrimary"
                          >
                            {format(new Date(review.date), "dd 'de' MMMM 'de' yyyy", {
                              locale: ptBR,
                            })}
                          </Typography>
                          {" — "}{review.comment}
                        </>
                      }
                    />
                  </ListItem>
                  {index < reviews.length - 1 && <Divider />}
                </Box>
              ))}
              {reviews.length === 0 && (
                <ListItem>
                  <ListItemText primary="Nenhuma avaliação disponível" />
                </ListItem>
              )}
            </List>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}

export default DoctorProfile;
