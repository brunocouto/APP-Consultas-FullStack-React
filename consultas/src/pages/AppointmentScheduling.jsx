import { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  Card,
  CardContent,
  CardActions,
  Avatar,
  Rating,
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider, DatePicker, TimePicker } from '@mui/x-date-pickers';
import { format } from 'date-fns';
import ptBR from 'date-fns/locale/pt-BR';
import api from '../services/api';
import { useAuth } from '../contexts/AuthContext';
import { toast } from 'react-toastify';

function AppointmentScheduling() {
  const { user } = useAuth();
  const [specialties, setSpecialties] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const loadSpecialties = async () => {
      try {
        const response = await api.get('/specialties');
        setSpecialties(response.data);
      } catch (error) {
        console.error('Erro ao carregar especialidades:', error);
      }
    };

    loadSpecialties();
  }, []);

  useEffect(() => {
    const loadDoctors = async () => {
      try {
        const response = await api.get('/doctors', {
          params: {
            specialty: selectedSpecialty,
            search: searchTerm,
          },
        });
        setDoctors(response.data);
      } catch (error) {
        console.error('Erro ao carregar médicos:', error);
      }
    };

    if (selectedSpecialty || searchTerm) {
      loadDoctors();
    }
  }, [selectedSpecialty, searchTerm]);

  const handleDoctorSelect = async (doctor) => {
    setSelectedDoctor(doctor);
    if (selectedDate) {
      loadAvailableSlots(doctor.id, selectedDate);
    }
  };

  const loadAvailableSlots = async (doctorId, date) => {
    try {
      const response = await api.get(`/doctors/${doctorId}/available-slots`, {
        params: {
          date: format(date, 'yyyy-MM-dd'),
        },
      });
      setAvailableSlots(response.data);
    } catch (error) {
      console.error('Erro ao carregar horários disponíveis:', error);
    }
  };

  const handleDateChange = (date) => {
    setSelectedDate(date);
    if (selectedDoctor) {
      loadAvailableSlots(selectedDoctor.id, date);
    }
  };

  const handleScheduleAppointment = async () => {
    try {
      if (!selectedDoctor || !selectedDate || !selectedTime) {
        toast.error('Por favor, selecione todas as informações necessárias.');
        return;
      }

      const appointmentData = {
        doctorId: selectedDoctor.id,
        datetime: new Date(
          selectedDate.getFullYear(),
          selectedDate.getMonth(),
          selectedDate.getDate(),
          selectedTime.getHours(),
          selectedTime.getMinutes()
        ).toISOString(),
      };

      await api.post('/appointments', appointmentData);
      toast.success('Consulta agendada com sucesso!');
      
      // Limpa os campos após o agendamento
      setSelectedDoctor(null);
      setSelectedDate(null);
      setSelectedTime(null);
    } catch (error) {
      console.error('Erro ao agendar consulta:', error);
      toast.error('Erro ao agendar consulta. Tente novamente.');
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        Agendar Consulta
      </Typography>

      <Grid container spacing={3}>
        {/* Filtros */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Filtros
            </Typography>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>Especialidade</InputLabel>
              <Select
                value={selectedSpecialty}
                label="Especialidade"
                onChange={(e) => setSelectedSpecialty(e.target.value)}
              >
                {specialties.map((specialty) => (
                  <MenuItem key={specialty.id} value={specialty.id}>
                    {specialty.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="Buscar por nome"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Paper>
        </Grid>

        {/* Lista de Médicos */}
        <Grid item xs={12} md={8}>
          <Grid container spacing={2}>
            {doctors.map((doctor) => (
              <Grid item xs={12} key={doctor.id}>
                <Card>
                  <CardContent>
                    <Grid container spacing={2}>
                      <Grid item>
                        <Avatar
                          src={doctor.avatar}
                          sx={{ width: 64, height: 64 }}
                        />
                      </Grid>
                      <Grid item xs>
                        <Typography variant="h6">{doctor.name}</Typography>
                        <Typography color="textSecondary">
                          {doctor.specialty}
                        </Typography>
                        <Rating value={doctor.rating} readOnly />
                      </Grid>
                    </Grid>
                  </CardContent>
                  <CardActions>
                    <Button
                      size="small"
                      color="primary"
                      onClick={() => handleDoctorSelect(doctor)}
                    >
                      Selecionar
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Agendamento */}
        {selectedDoctor && (
          <Grid item xs={12}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" gutterBottom>
                Agendar com Dr(a). {selectedDoctor.name}
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <LocalizationProvider
                    dateAdapter={AdapterDateFns}
                    adapterLocale={ptBR}
                  >
                    <DatePicker
                      label="Data da Consulta"
                      value={selectedDate}
                      onChange={handleDateChange}
                      renderInput={(params) => <TextField {...params} fullWidth />}
                      minDate={new Date()}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12} md={6}>
                  <LocalizationProvider
                    dateAdapter={AdapterDateFns}
                    adapterLocale={ptBR}
                  >
                    <TimePicker
                      label="Horário"
                      value={selectedTime}
                      onChange={setSelectedTime}
                      renderInput={(params) => <TextField {...params} fullWidth />}
                    />
                  </LocalizationProvider>
                </Grid>
                <Grid item xs={12}>
                  <Button
                    variant="contained"
                    color="primary"
                    fullWidth
                    onClick={handleScheduleAppointment}
                  >
                    Confirmar Agendamento
                  </Button>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
        )}
      </Grid>
    </Container>
  );
}

export default AppointmentScheduling;
