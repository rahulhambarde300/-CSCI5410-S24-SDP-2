import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Box,
  TextField,
  Button,
  Typography,
  CircularProgress,
  Snackbar
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { FETCH_CIPHER_CHALLENGE, VERIFY_CIPHER_CHALLENGE } from '../../API_URL';

const ChallengeAuth = () => {
  const [cipher, setCipher] = useState({ challenge: '', key: '' });
  const [userAnswer, setUserAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [severity, setSeverity] = useState("success");
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const fetchCipherChallenge = async () => {
    try {
      const response = await axios.get(FETCH_CIPHER_CHALLENGE, {
        params: { email: user.email }
      });
      setCipher(response.data);
    } catch (error) {
      setMessage('Failed to fetch cipher challenge. Please try again.');
      setSeverity('error');
      setOpen(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCipherChallenge();
    // eslint-disable-next-line
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(VERIFY_CIPHER_CHALLENGE, {
        email: user.email,
        answer: userAnswer
      });

      if (response.data.success) {
        setMessage('Cipher challenge answered correctly!');
        setSeverity('success');
        setOpen(true);
        setTimeout(() => {
          navigate('/');
        }, 3000);
      } else {
        
      }
    } catch (error) {
        if(error.response.status === 400){
            setMessage('Incorrect answers for the cipher challenge.');
        setSeverity('error');
        setOpen(true);
        }
        else{
            setMessage('Failed to verify cipher challenge. Please try again.');
            setSeverity('error');
            setOpen(true);
        }
    }
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <Typography component="h1" variant="h5">
          Cipher Challenge
        </Typography>
        <Box sx={{ mt: 1 }}>
          <Typography variant="body1">Challenge: {cipher.challenge}</Typography>
          <Typography variant="body1">Key: {cipher.key}</Typography>
          <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              label="Your Answer"
              value={userAnswer}
              onChange={(e) => setUserAnswer(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Submit
            </Button>
          </Box>
        </Box>
      </Box>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <MuiAlert elevation={6} variant="filled" onClose={handleClose} severity={severity}>
          {message}
        </MuiAlert>
      </Snackbar>
    </Container>
  );
};

export default ChallengeAuth;
