import React, { useState } from 'react';
import { Container, Typography, TextField, Button, Select, MenuItem, FormControl, InputLabel, Grid, Paper, TableContainer
} from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { SnackbarProvider, useSnackbar } from 'notistack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import IconButton from '@mui/material/IconButton';

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

function createData(name, calories, fat, carbs, protein) {
  return { name, calories, fat, carbs, protein };
}

const rows = [
  createData('Frozen yoghurt', 159, 6.0, 24, 4.0),
  createData('Ice cream sandwich', 237, 9.0, 37, 4.3),
  createData('Eclair', 262, 16.0, 24, 6.0),
  createData('Cupcake', 305, 3.7, 67, 4.3),
  createData('Gingerbread', 356, 16.0, 49, 3.9),
];

const RoomBooking = () => {
  const [selectedRoom, setSelectedRoom] = useState('');
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [bookings, setBookings] = useState([]);
  const { enqueueSnackbar } = useSnackbar();

  const rooms = ['101', '102', '103'];

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
    <>
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
    <Container maxWidth="sm" sx={{ pt: 2 }}>
      <Typography variant="h4" gutterBottom>
        Your bookings
      </Typography>
      <Paper >
      <Table sx={{ minWidth: 500 }}  size="small" aria-label="Bookings table">
        <TableHead>
          <TableRow sx={{backgroundColor:'#FAFAFA', fontSize: 14}}>
            <TableCell>Room</TableCell>
            <TableCell align="right">Start Date</TableCell>
            <TableCell align="right">End Date</TableCell>
            <TableCell align="right"></TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <TableRow
              key={row.bookingId}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {/* {row.roomNumber} */}301
              </TableCell>
              <TableCell align="right">
                {/* {row.startDate} */}2024-06-29
              </TableCell>
              <TableCell align="right">
                {/* {row.endDate} */}2024-07-04
              </TableCell>
              <TableCell align="right">
                <IconButton color="error">
                  <DeleteIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      </Paper>
    </Container>
    </>
  );
};

export default function RoomBookingNotistack() {
  return (
    <SnackbarProvider maxSnack={3}>
      <RoomBooking />
    </SnackbarProvider>
  );
}