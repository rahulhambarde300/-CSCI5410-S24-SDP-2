import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {AuthProvider } from './context/AuthContext';
import { Header } from './components/Header';
import Login from './components/user-authentication/Login';
import SignUp from './components/user-authentication/SignUp';
import SecurityQuestionAuth from './components/user-authentication/SecurityQuestionAuth';
import ChallengeAuth from './components/user-authentication/ChallengeAuth';
import RoomBookingNotistack from './components/booking/RoomBooking';
import Home from './components/home/Home.jsx';
import Chatbot from './components/chatbot/ChatBot';
import MessagePassing from './components/message-passing/messagePassing.js'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <AuthProvider>
          <Router>
              <div className="App">
                <Header />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<SignUp />} />
                  <Route path="/security-questions" element={<SecurityQuestionAuth />} />
                  <Route path="/human-challenge" element={<ChallengeAuth />} />
                  <Route path="/booking" element={<RoomBookingNotistack />} />
                  <Route path="/chatbot" element={<Chatbot />} />
                  <Route path="/livechat" element={<MessagePassing />} />
                </Routes>
                <ToastContainer/>
              </div>
          </Router>
        </AuthProvider>
  );
}

export default App;
