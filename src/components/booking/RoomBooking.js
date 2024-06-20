import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Select, MenuItem, FormControl, InputLabel, Grid, Paper
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { SnackbarProvider, useSnackbar } from 'notistack';

const RoomBooking = () => {
  const [selectedRoom, setSelectedRoom] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [bookings, setBookings] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  const rooms = ['Room 101', 'Room 102', 'Room 103'];

  //Show alert messages
  const showMessage = (msg, variant) => {
    enqueueSnackbar(msg, { variant });
  };


  const handleBooking = () => {
    if (selectedRoom && startDate && endDate) {
      if(endDate < startDate){
        showMessage("End date can't be before start date", 'error');
      }
      else{
        setBookings([
          ...bookings,
          { room: selectedRoom, startDate, endDate }
        ]);
        setSelectedRoom('');
        setStartDate(null);
        setEndDate(null);
        showMessage('Room booking queued! You will be notified soon.', 'success')
      }
      
    } else {
      showMessage("Please fill in all fields", 'error');
    }
  };

  return (
    <SnackbarProvider maxSnack={3}>
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Book a Room
      </Typography>
      <Paper style={{ padding: 20 }}>
        <FormControl fullWidth>
          <InputLabel id="selectRoomInputLabel">Select Room</InputLabel>
          <Select
            labelId="selectRoomInputLabel"
            value={selectedRoom}
            onChange={(e) => setSelectedRoom(e.target.value)}
            label="Select Room"
          >
            {rooms.map((room) => (
              <MenuItem key={room} value={room}>
                {room}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Grid container spacing={2} pt={2}>
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Start date"
                value={startDate}
                onChange={(date)=>{setStartDate(date)}}
                
                />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} sm={6}>
            <LocalizationProvider dateAdapter={AdapterDateFns}>
                <DatePicker
                  label="End date"
                  value={endDate}
                  onChange={(date)=>{setEndDate(date)}}
                  
                  />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" color="primary" onClick={handleBooking} fullWidth>
              Book Room
            </Button>
          </Grid>
        </Grid>
      </Paper>
    </Container>
    </SnackbarProvider>
  );
};

export default function RoomBookingNotistack() {
  return (
    <SnackbarProvider maxSnack={3}>
      <RoomBooking />
    </SnackbarProvider>
  );
}