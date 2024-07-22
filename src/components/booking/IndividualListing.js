import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { Grid, Typography, Card, CardMedia, Box, TextField, Button, colors } from '@mui/material';
import Divider from '@mui/material/Divider';
import { SnackbarProvider, useSnackbar } from 'notistack';
import axios from 'axios';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { useNavigate } from 'react-router-dom';

const IndividualListingComponent = ({ room  }) => {
  const API_GATEWAY_URL = 'https://2zhi4uaze6.execute-api.us-east-1.amazonaws.com/prod/';

  const storedUser = localStorage.getItem('user');
  let user;
  if(storedUser){
    user = JSON.parse(storedUser);
  }
  
  const { id } = useParams();
  const [checkInDate, setCheckInDate] = React.useState('');
  const [checkOutDate, setCheckOutDate] = React.useState('');
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  if (!room) {
    return (<Typography variant="h4" 
                        color="textSecondary" 
                        sx={{mt:'1em', mb:'0.5em', justifyContent:'center', textAlign: 'center'}}>
                          Room not found
                        </Typography>);
  }

  const showMessage = (msg, variant) => {
    enqueueSnackbar(msg, { variant });
  };

  
  const handleBooking = () => {
    if (checkInDate && checkOutDate && user) {
      if(checkOutDate < checkInDate){
        showMessage("Check out date can't be before check in date", 'error');
      }
      else{
        setCheckInDate(null);
        setCheckOutDate(null);
        
        //Add request in SQS using lambda function

        const userId = user.userId;
        const message = {
          userId: userId,
          roomId: id,
          roomName: room.name,
          startDate: checkInDate,
          endDate: checkOutDate
        }

        try {
          axios.post(`${API_GATEWAY_URL}bookings/sendBooking`, message);
          showMessage('Room booking queued! You will be notified soon.', 'success')
          setTimeout(() => {
            navigate(`/listing/`);
          }, 1000);

          
        } catch (error) {
          console.error('Error while booking room:', error);
          showMessage('Error while booking the room.', 'error')
        }
      }
      
    } else {
      showMessage("Please login and fill in all fields", 'error');
    }
  };

  return (
    <Box p={2} height="90vh">
      <Grid container spacing={2} style={{ height: '100%' }}>
        <Grid item xs={12} sm={6} style={{ height: '100%' }}>
          <Box display="flex" height="100%" alignItems="center" justifyContent="center">
            <img src={room.image} alt={room.description} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </Box>
        </Grid>
        <Grid item xs={12} sm={6} style={{ height: '100%' }}>
          <Box display="flex" flexDirection="column" justifyContent="center" height="100%" sx={{mx:'2em'}}>
            <Box display="flex" justifyContent="space-between" alignItems="center" sx={{mb:'2em'}}>
                <Typography variant="h3" component="h2">
                    {room.name}
                </Typography>
                <Typography variant="h4" component="h2">
                    ${(room.price * (100-room.discount))/100}/day ({room.discount}% off)
                </Typography>
            </Box>
            <Divider />
            <Typography variant="h4" color="textSecondary" sx={{mt:'0.25em', mb:'0.5em'}}>
              {room.description}
            </Typography>
            { user ?
              (<>
                <Box component="form" mt={2} display="flex" flexDirection="column" gap={2}>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Check in date"
                      value={checkInDate}
                      onChange={(date)=>{setCheckInDate(date)}}
                      />
                  </LocalizationProvider>
                  <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <DatePicker
                      label="Check out date"
                      value={checkOutDate}
                      onChange={(date)=>{setCheckOutDate(date)}}
                      />
                  </LocalizationProvider>
                  <Button variant="contained" color="primary" onClick={handleBooking}>
                    Book Now
                  </Button>
                </Box>
              </>) :
              (<>
                <Typography variant="h4" 
                    color="textSecondary" 
                    sx={{mt:'1em', mb:'0.5em', justifyContent:'center', textAlign: 'center', color: "#2563EB"}}>
                    <Link to="/login"
                          sx={{}}>
                        Login to book!
                    </Link>
                </Typography>
                     
              </>)}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
}

export default function IndividualListing({ room  }) {
  return (
    <SnackbarProvider maxSnack={3}>
      <IndividualListingComponent room={room}/>
    </SnackbarProvider>
  );
}