import { useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  MenuItem,
  useTheme,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useAuth } from '../contexts/AuthContext';

function MainLayout() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const handleMenuClick = (path) => {
    navigate(path);
    handleCloseNavMenu();
  };

  const pages = user
    ? user.role === 'doctor'
      ? [
          { name: 'Dashboard', path: '/doctor-dashboard' },
          { name: 'Agenda', path: '/schedule' },
          { name: 'Pacientes', path: '/patients' },
        ]
      : [
          { name: 'Buscar Médicos', path: '/schedule-appointment' },
          { name: 'Minhas Consultas', path: '/patient-dashboard' },
          { name: 'Histórico', path: '/history' },
        ]
    : [{ name: 'Home', path: '/' }];

  const settings = user
    ? [
        { name: 'Perfil', path: '/profile' },
        { name: 'Configurações', path: '/settings' },
        { name: 'Sair', action: signOut },
      ]
    : [
        { name: 'Login', path: '/login' },
        { name: 'Cadastrar', path: '/register' },
      ];

  return (
    <Box sx={{ 
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      width: '100%'
    }}>
      <AppBar position="static" sx={{ mb: 2 }}>
        <Container maxWidth="xl">
          <Toolbar disableGutters>
            {/* Logo - Desktop */}
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: 'none', md: 'flex' },
                fontWeight: 700,
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              ConsultasApp
            </Typography>

            {/* Menu Mobile */}
            <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
              <IconButton
                size="large"
                aria-label="menu"
                aria-controls="menu-appbar"
                aria-haspopup="true"
                onClick={handleOpenNavMenu}
                color="inherit"
              >
                <MenuIcon />
              </IconButton>
              <Menu
                id="menu-appbar"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'left',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left',
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                sx={{
                  display: { xs: 'block', md: 'none' },
                }}
              >
                {pages.map((page) => (
                  <MenuItem key={page.name} onClick={() => handleMenuClick(page.path)}>
                    <Typography textAlign="center">{page.name}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>

            {/* Logo - Mobile */}
            <Typography
              variant="h6"
              noWrap
              component="a"
              href="/"
              sx={{
                mr: 2,
                display: { xs: 'flex', md: 'none' },
                flexGrow: 1,
                fontWeight: 700,
                color: 'inherit',
                textDecoration: 'none',
              }}
            >
              ConsultasApp
            </Typography>

            {/* Menu Desktop */}
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
              {pages.map((page) => (
                <Button
                  key={page.name}
                  onClick={() => handleMenuClick(page.path)}
                  sx={{ my: 2, color: 'white', display: 'block' }}
                >
                  {page.name}
                </Button>
              ))}
            </Box>

            {/* User Menu */}
            <Box sx={{ flexGrow: 0 }}>
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar 
                  alt={user?.name || 'User'} 
                  src={user?.avatar}
                  sx={{ 
                    bgcolor: theme.palette.secondary.main,
                    width: 40,
                    height: 40
                  }}
                >
                  {user?.name ? user.name[0].toUpperCase() : 'U'}
                </Avatar>
              </IconButton>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                {settings.map((setting) => (
                  <MenuItem
                    key={setting.name}
                    onClick={() => {
                      if (setting.action) {
                        setting.action();
                      } else {
                        navigate(setting.path);
                      }
                      handleCloseUserMenu();
                    }}
                  >
                    <Typography textAlign="center">{setting.name}</Typography>
                  </MenuItem>
                ))}
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Main Content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          py: 3,
          px: { xs: 2, md: 3 },
          backgroundColor: 'background.default',
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

export default MainLayout;
