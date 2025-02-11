import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('@ConsultasApp:token');
    const storedUser = localStorage.getItem('@ConsultasApp:user');

    if (token && storedUser) {
      api.defaults.headers.authorization = `Bearer ${token}`;
      setUser(JSON.parse(storedUser));
    }

    setLoading(false);
  }, []);

  const signIn = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user: userData } = response.data;

      localStorage.setItem('@ConsultasApp:token', token);
      localStorage.setItem('@ConsultasApp:user', JSON.stringify(userData));

      api.defaults.headers.authorization = `Bearer ${token}`;
      setUser(userData);

      toast.success('Login realizado com sucesso!');
      navigate(userData.role === 'doctor' ? '/doctor-dashboard' : '/patient-dashboard');
    } catch (error) {
      toast.error('Erro ao fazer login. Verifique suas credenciais.');
    }
  };

  const signUp = async (userData) => {
    try {
      await api.post('/auth/register', userData);
      toast.success('Cadastro realizado com sucesso! Faça login para continuar.');
      navigate('/login');
    } catch (error) {
      toast.error('Erro ao realizar cadastro. Tente novamente.');
    }
  };

  const signOut = () => {
    localStorage.removeItem('@ConsultasApp:token');
    localStorage.removeItem('@ConsultasApp:user');
    api.defaults.headers.authorization = '';
    setUser(null);
    navigate('/');
  };

  return (
    <AuthContext.Provider
      value={{
        signed: !!user,
        user,
        loading,
        signIn,
        signUp,
        signOut
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }

  return context;
}
