import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Header } from './components/Header';
import RoomBookingNotistack from './components/booking/RoomBooking';
import Home from './components/home/Home.jsx';
import Chatbot from './components/chatbot/ChatBot';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Routes>
        <Route path="/" element={<Home />} />
          <Route path="/booking" element={<RoomBookingNotistack />} />
          <Route path="/chatbot" element={<Chatbot />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;