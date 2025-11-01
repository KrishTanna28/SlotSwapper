import React, { useState, useEffect } from 'react';
import { eventAPI } from '../services/api';
import EventCard from '../components/EventCard';
import CreateEventModal from '../components/CreateEventModal';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const response = await eventAPI.getEvents();
      setEvents(response.data);
      setError('');
    } catch (error) {
      setError('Failed to load events');
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (eventData) => {
    try {
      await eventAPI.createEvent(eventData);
      setIsModalOpen(false);
      fetchEvents();
    } catch (error) {
      setError('Failed to create event');
      console.error('Error creating event:', error);
    }
  };

  const handleStatusChange = async (eventId, newStatus) => {
    try {
      await eventAPI.updateEvent(eventId, { status: newStatus });
      fetchEvents();
    } catch (error) {
      setError('Failed to update event status');
      console.error('Error updating event:', error);
    }
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await eventAPI.deleteEvent(eventId);
        fetchEvents();
      } catch (error) {
        setError('Failed to delete event');
        console.error('Error deleting event:', error);
      }
    }
  };

  const sortedEvents = [...events].sort(
    (a, b) => new Date(a.startTime) - new Date(b.startTime)
  );

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">My Calendar</h1>
            <p className="text-gray-600">Manage your schedule and events</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="btn-primary"
          >
            + Create Event
          </button>
        </div>

        {error && (
          <div className="bg-gray-100 border-2 border-black text-black px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-black border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Loading events...</p>
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12 border-2 border-gray-200 rounded-lg">
            <p className="text-xl font-medium mb-2">No events yet</p>
            <p className="text-gray-600 mb-6">Create your first event to get started</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="btn-primary"
            >
              + Create Event
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedEvents.map((event) => (
              <EventCard
                key={event._id}
                event={event}
                onStatusChange={handleStatusChange}
                onDelete={handleDeleteEvent}
              />
            ))}
          </div>
        )}
      </div>

      <CreateEventModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateEvent}
      />
    </div>
  );
};

export default Dashboard;
