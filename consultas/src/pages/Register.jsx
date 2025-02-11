import { useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';
import {
  Avatar,
  Button,
  TextField,
  Link,
  Grid,
  Box,
  Typography,
  Container,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { useAuth } from '../contexts/AuthContext';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'patient',
    speciality: '',
    crm: '',
    phone: '',
  });

  const { signUp } = useAuth();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('As senhas não coincidem!');
      return;
    }

    const userData = {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      role: formData.role,
      phone: formData.phone,
      ...(formData.role === 'doctor' && {
        speciality: formData.speciality,
        crm: formData.crm,
      }),
    };

    await signUp(userData);
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <PersonAddIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Cadastro
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="name"
                label="Nome Completo"
                name="name"
                autoComplete="name"
                value={formData.name}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email"
                name="email"
                autoComplete="email"
                value={formData.email}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="phone"
                label="Telefone"
                name="phone"
                autoComplete="tel"
                value={formData.phone}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel id="role-label">Tipo de Usuário</InputLabel>
                <Select
                  labelId="role-label"
                  id="role"
                  name="role"
                  value={formData.role}
                  label="Tipo de Usuário"
                  onChange={handleChange}
                >
                  <MenuItem value="patient">Paciente</MenuItem>
                  <MenuItem value="doctor">Médico</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            {formData.role === 'doctor' && (
              <>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="speciality"
                    label="Especialidade"
                    name="speciality"
                    value={formData.speciality}
                    onChange={handleChange}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="crm"
                    label="CRM"
                    name="crm"
                    value={formData.crm}
                    onChange={handleChange}
                  />
                </Grid>
              </>
            )}

            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Senha"
                type="password"
                id="password"
                autoComplete="new-password"
                value={formData.password}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="confirmPassword"
                label="Confirmar Senha"
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Cadastrar
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link component={RouterLink} to="/login" variant="body2">
                Já tem uma conta? Faça login
              </Link>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </Container>
  );
}

export default Register;
