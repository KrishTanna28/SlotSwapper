import React, { useState, useEffect } from 'react';
import { swapAPI } from '../services/api';
import Navbar from '../components/Navbar';
import SwapModal from '../components/SwapModal';
import { format } from 'date-fns';

const Marketplace = () => {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchSwappableSlots();
  }, []);

  const fetchSwappableSlots = async () => {
    try {
      setLoading(true);
      const response = await swapAPI.getSwappableSlots();
      setSlots(response.data);
      setError('');
    } catch (error) {
      setError('Failed to load swappable slots');
      console.error('Error fetching slots:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestSwap = (slot) => {
    setSelectedSlot(slot);
    setIsModalOpen(true);
  };

  const handleSubmitSwap = async (mySlotId, theirSlotId) => {
    try {
      await swapAPI.createSwapRequest({
        mySlotId,
        theirSlotId,
      });
      setIsModalOpen(false);
      setSuccess('Swap request sent successfully!');
      setTimeout(() => setSuccess(''), 3000);
      fetchSwappableSlots();
    } catch (error) {
      setError('Failed to create swap request');
      console.error('Error creating swap request:', error);
    }
  };

  const sortedSlots = [...slots].sort(
    (a, b) => new Date(a.startTime) - new Date(b.startTime)
  );

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Marketplace</h1>
          <p className="text-gray-600">Browse and request swaps for available slots</p>
        </div>

        {error && (
          <div className="bg-gray-100 border-2 border-black text-black px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-black text-white px-4 py-3 rounded-lg mb-6">
            {success}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-black border-t-transparent"></div>
            <p className="mt-4 text-gray-600">Loading available slots...</p>
          </div>
        ) : slots.length === 0 ? (
          <div className="text-center py-12 border-2 border-gray-200 rounded-lg">
            <p className="text-xl font-medium mb-2">No swappable slots available</p>
            <p className="text-gray-600">Check back later for new opportunities</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedSlots.map((slot) => (
              <div key={slot._id} className="card">
                <div className="mb-3">
                  <h3 className="text-lg font-bold mb-1">{slot.title}</h3>
                  {slot.description && (
                    <p className="text-sm text-gray-600 mb-2">{slot.description}</p>
                  )}
                </div>

                <div className="space-y-1 text-sm text-gray-600 mb-4">
                  <div className="flex items-center">
                    <span className="font-medium mr-2">Start:</span>
                    {format(new Date(slot.startTime), 'MMM dd, yyyy • h:mm a')}
                  </div>
                  <div className="flex items-center">
                    <span className="font-medium mr-2">End:</span>
                    {format(new Date(slot.endTime), 'h:mm a')}
                  </div>
                </div>

                <button
                  onClick={() => handleRequestSwap(slot)}
                  className="w-full bg-black text-white px-4 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                >
                  Request Swap
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {selectedSlot && (
        <SwapModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setSelectedSlot(null);
          }}
          targetSlot={selectedSlot}
          onSubmit={handleSubmitSwap}
        />
      )}
    </div>
  );
};

export default Marketplace;
