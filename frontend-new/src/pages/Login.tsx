import { useState } from 'react';
import { Container, Typography, TextField, Button, Box, Paper, Alert, Link, alpha } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import SplashScreen from '../components/SplashScreen';
import logoLight from '../assets/icon light background.png';
import { motion } from 'framer-motion';
import { styled } from '@mui/material/styles';

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    color: '#FFD700',
    '& fieldset': {
      borderColor: 'rgba(218,165,32,0.3)',
    },
    '&:hover fieldset': {
      borderColor: '#DAA520',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#FFD700',
    },
  },
  '& .MuiInputLabel-root': {
    color: '#DAA520',
    '&.Mui-focused': {
      color: '#FFD700',
    },
  },
  '& .MuiOutlinedInput-input': {
    '&::placeholder': {
      color: 'rgba(218,165,32,0.5)',
    },
  },
}));

const GoldButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #B8860B, #DAA520)',
  color: '#000',
  fontWeight: 'bold',
  padding: '12px 24px',
  '&:hover': {
    background: 'linear-gradient(45deg, #DAA520, #FFD700)',
    transform: 'scale(1.02)',
  },
  transition: 'all 0.3s ease',
}));

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showSplash, setShowSplash] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      await login(username, password);
      setShowSplash(true);
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Failed to login');
      setLoading(false);
    }
  };

  const handleSplashComplete = () => {
    navigate('/dashboard');
  };

  return (
    <>
      {showSplash ? (
        <SplashScreen onComplete={handleSplashComplete} />
      ) : (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            minHeight: '100vh',
            width: '100vw',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #000000, #1A1A1A)',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'radial-gradient(circle at center, transparent 0%, #000000 70%)',
              opacity: 0.8,
            },
            '&::after': {
              content: '""',
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: '200%',
              height: '200%',
              transform: 'translate(-50%, -50%) rotate(45deg)',
              background: 'linear-gradient(45deg, transparent 45%, rgba(218,165,32,0.1) 50%, transparent 55%)',
              animation: 'shimmer 10s infinite linear',
            },
            '@keyframes shimmer': {
              '0%': {
                transform: 'translate(-50%, -50%) rotate(45deg) translateX(-100%)',
              },
              '100%': {
                transform: 'translate(-50%, -50%) rotate(45deg) translateX(100%)',
              },
            },
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
          >
            <Container maxWidth="sm">
              <Paper
                elevation={24}
                sx={{
                  p: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: 3,
                  background: 'linear-gradient(145deg, rgba(26,26,26,0.9), rgba(0,0,0,0.95))',
                  border: '1px solid rgba(218,165,32,0.3)',
                  borderRadius: '20px',
                  backdropFilter: 'blur(10px)',
                  boxShadow: '0 8px 32px rgba(218,165,32,0.2)',
                  position: 'relative',
                  overflow: 'hidden',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: 0,
                    left: '-100%',
                    width: '200%',
                    height: '100%',
                    background: 'linear-gradient(90deg, transparent, rgba(218,165,32,0.1), transparent)',
                    animation: 'shine 8s infinite linear',
                  },
                  '@keyframes shine': {
                    '0%': { left: '-100%' },
                    '100%': { left: '100%' },
                  },
                }}
              >
                <Box sx={{ mb: 2, transform: 'scale(1.5)' }}>
                  <motion.img
                    src={logoLight}
                    alt="Logo"
                    style={{ height: '64px' }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: 'spring', stiffness: 300 }}
                  />
                </Box>

                <Typography
                  component="h1"
                  variant="h4"
                  sx={{
                    color: '#FFD700',
                    fontWeight: 'bold',
                    textAlign: 'center',
                    textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                    mb: 3,
                  }}
                >
                  MyMine Login
                </Typography>

                {error && (
                  <Alert 
                    severity="error" 
                    sx={{ 
                      width: '100%',
                      bgcolor: 'rgba(211,47,47,0.1)',
                      color: '#ff8a80',
                      border: '1px solid #ff8a80',
                    }}
                  >
                    {error}
                  </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit} sx={{ width: '100%', mt: 1 }}>
                  <StyledTextField
                    margin="normal"
                    required
                    fullWidth
                    id="username"
                    label="Username"
                    name="username"
                    autoComplete="username"
                    autoFocus
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    sx={{ mb: 2 }}
                  />
                  <StyledTextField
                    margin="normal"
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    sx={{ mb: 3 }}
                  />

                  <GoldButton
                    type="submit"
                    fullWidth
                    variant="contained"
                    disabled={loading}
                    sx={{ mb: 2 }}
                  >
                    {loading ? 'Mining Access...' : 'Enter the Mine'}
                  </GoldButton>

                  <Box sx={{ mt: 2, textAlign: 'center' }}>
                    <Link
                      href="#"
                      variant="body2"
                      sx={{
                        color: '#DAA520',
                        textDecoration: 'none',
                        '&:hover': {
                          color: '#FFD700',
                          textDecoration: 'none',
                        },
                      }}
                    >
                      Forgot password?
                    </Link>
                  </Box>
                </Box>
              </Paper>
            </Container>
          </motion.div>
        </Box>
      )}
    </>
  );
}
