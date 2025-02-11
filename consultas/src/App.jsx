import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import { CssBaseline, Box } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Contexts
import { AuthProvider } from './contexts/AuthContext';

// Layouts
import MainLayout from './layouts/MainLayout';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import DoctorDashboard from './pages/DoctorDashboard';
import PatientDashboard from './pages/PatientDashboard';
import AppointmentScheduling from './pages/AppointmentScheduling';
import DoctorProfile from './pages/DoctorProfile';
import NotFound from './pages/NotFound';

// Theme
import theme from './theme';

// Estilos globais
import './index.css';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ 
        minHeight: '100vh',
        backgroundColor: 'background.default',
        display: 'flex',
        flexDirection: 'column'
      }}>
        <BrowserRouter>
          <AuthProvider>
            <Routes>
              <Route path="/" element={<MainLayout />}>
                <Route index element={<Home />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                <Route path="doctor-dashboard" element={<DoctorDashboard />} />
                <Route path="patient-dashboard" element={<PatientDashboard />} />
                <Route path="schedule-appointment" element={<AppointmentScheduling />} />
                <Route path="doctor/:id" element={<DoctorProfile />} />
                <Route path="*" element={<NotFound />} />
              </Route>
            </Routes>
            <ToastContainer position="top-right" autoClose={3000} />
          </AuthProvider>
        </BrowserRouter>
      </Box>
    </ThemeProvider>
  );
}

export default App;
