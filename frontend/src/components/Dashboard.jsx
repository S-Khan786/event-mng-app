import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import API from "../services/api";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const navigate = useNavigate();
  const token = localStorage.getItem("token");
  const decodedToken = jwtDecode(token);
  const isAdmin = decodedToken?.role === "admin";
  const userId = decodedToken?.userId; // Get the current user's ID

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await API.get("/events");
        setEvents(res.data);
        setFilteredEvents(res.data);
      } catch (err) {
        console.error(err.response.data.msg);
      }
    };
    fetchEvents();

    // Set up WebSocket connection
    const socket = io("https://event-mng-app.onrender.com"); // Replace with your backend URL

    // Listen for real-time attendee updates
    socket.on("attendeeUpdate", (data) => {
      console.log('Received attendeeUpdate:', data); // Debugging log

      setEvents((prevEvents) => {
        const updatedEvents = prevEvents.map((event) => {
          if (event._id.toString() === data.eventId.toString()) {
            console.log('Updating event:', event._id); // Debugging log
            return { ...event, attendees: data.attendees };
          }
          return event;
        });

        console.log('Updated Events:', updatedEvents); // Debugging log
        return updatedEvents;
      });
    });

    return () => socket.disconnect(); // Cleanup on unmount
  }, []);

  // Sync filteredEvents with events
  useEffect(() => {
    setFilteredEvents(events);
  }, [events]);

  const handleJoinEvent = async (eventId) => {
    try {
      await API.post(`/events/${eventId}/join`);
    } catch (err) {
      console.error(err.response?.data?.msg || "Failed to join event");
    }
  };

  const handleLeaveEvent = async (eventId) => {
    try {
      await API.post(`/events/${eventId}/leave`);
    } catch (err) {
      console.error(err.response?.data?.msg || "Failed to leave event");
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await API.delete(`/events/${eventId}`);
      // Remove the deleted event from the state
      setEvents((prevEvents) => prevEvents.filter((event) => event._id !== eventId));
    } catch (err) {
      console.error(err.response?.data?.msg || "Failed to delete event");
    }
  };

  const handleUpdateEvent = (eventId) => {
    // Navigate to the update event page
    navigate(`/update-event/${eventId}`);
  };


  const handleLogout = async () => {
    try {
      await API.get("/auth/logout");
      localStorage.removeItem("token");
      navigate("/login");
    } catch (err) {
      console.error("Logout failed:", err.response?.data?.msg || err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-6xl mx-auto bg-white shadow-lg rounded-lg p-6">
        <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">
          Event Dashboard
        </h2>
        <div className="flex justify-end mb-6">
          {isAdmin && (
            <button
              onClick={() => navigate("/create-event")}
              className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition-colors"
            >
              Create Event
            </button>
          )}
          <button
            onClick={handleLogout}
            className="mx-3 px-6 py-2 bg-red-500 text-white font-semibold rounded-md hover:bg-red-600 transition-colors"
          >
            Logout
          </button>
        </div>

        <ul className="space-y-6">
          {filteredEvents.map((event) => (
            <li
              key={event._id}
              className="p-4 border border-gray-300 rounded-lg hover:shadow-md transition-shadow"
            >
              <h3 className="text-2xl font-semibold text-gray-800">
                {event.name}
              </h3>
              <p className="text-gray-600 mt-2">{event.description}</p>
              <p className="text-gray-500 mt-2">
                {format(new Date(event.date), "MMMM dd, yyyy")} | {event.time}
              </p>
              <p className="text-gray-500 mt-2">Location: {event.location}</p>
              <p className="text-gray-500 mt-2">
                Attendees: {event.attendees?.length || 0}
              </p>
              <div className="mt-4">
                <button
                  onClick={() => handleJoinEvent(event._id)}
                  className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                >
                  Join
                </button>
                <button
                  onClick={() => handleLeaveEvent(event._id)}
                  className="ml-2 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                >
                  Leave
                </button>
                                {/* Show Update and Delete buttons only for admins or event creators */}
                                {(isAdmin || event.createdBy === userId) && (
                  <>
                    <button
                      onClick={() => handleUpdateEvent(event._id)}
                      className="ml-2 px-4 py-2 bg-yellow-500 text-white rounded-md hover:bg-yellow-600 transition-colors"
                    >
                      Update
                    </button>
                    <button
                      onClick={() => handleDeleteEvent(event._id)}
                      className="ml-2 px-4 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600 transition-colors"
                    >
                      Delete
                    </button>
                  </>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
