import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { io } from 'socket.io-client';
import Dashboard from './components/Dashboard.jsx';
import Register from './components/Register.jsx';
import Login from './components/Login.jsx';
import CreateEvent from './components/CreateEvent.jsx';
import UpdateEvent from './components/UpdateEvent.jsx';
import ProtectedRoute from './utils/ProtectedRoute';
import PublicRoute from './utils/PublicRoute';
import { Navigate } from 'react-router-dom';


const socket = io("https://event-mng-app.onrender.com", {
  withCredentials: true, // Ensure credentials are sent with the connection
});

function App() {
  const [events, setEvents] = useState([]);

  useEffect(() => {
    // Listen for real-time event updates
    socket.on('eventUpdate', (data) => {
      console.log('Real-time update:', data);
      // Refresh the events or handle accordingly
      setEvents((prevEvents) => {
        // If it's an update, you may want to update specific event, or append new ones
        return prevEvents.map((event) => (event._id === data._id ? data : event));
      });
    });

    return () => socket.disconnect();
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public Routes (accessible only when not logged in) */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>

        {/* Protected Routes (accessible only when logged in) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard events={events} />} />
          <Route path="/create-event" element={<CreateEvent />} />
          <Route path="/update-event/:id" element={<UpdateEvent />} /> {/* Route for update page */}
        </Route>

        {/* Default route (redirect to login if not authenticated) */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
