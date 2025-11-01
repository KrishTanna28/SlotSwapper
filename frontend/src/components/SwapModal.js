import React, { useState, useEffect } from 'react';
import { eventAPI } from '../services/api';
import { format } from 'date-fns';

const SwapModal = ({ isOpen, onClose, targetSlot, onSubmit }) => {
  const [mySlots, setMySlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchMySwappableSlots();
    }
  }, [isOpen]);

  const fetchMySwappableSlots = async () => {
    try {
      setLoading(true);
      const response = await eventAPI.getEvents();
      const swappableSlots = response.data.filter(
        (event) => event.status === 'SWAPPABLE'
      );
      setMySlots(swappableSlots);
    } catch (error) {
      console.error('Error fetching slots:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedSlot) {
      onSubmit(selectedSlot, targetSlot._id);
      setSelectedSlot('');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full p-6 border-2 border-black max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Request Swap</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-black text-2xl"
          >
            ×
          </button>
        </div>

        <div className="mb-6 p-4 bg-gray-50 border-2 border-gray-200 rounded-lg">
          <p className="text-sm font-medium text-gray-600 mb-2">You want to swap for:</p>
          <h3 className="text-lg font-bold mb-1">{targetSlot.title}</h3>
          <p className="text-sm text-gray-600">
            {format(new Date(targetSlot.startTime), 'MMM dd, yyyy • h:mm a')} -{' '}
            {format(new Date(targetSlot.endTime), 'h:mm a')}
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label className="block text-sm font-medium mb-3">
              Select one of your swappable slots to offer:
            </label>

            {loading ? (
              <div className="text-center py-8">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-black border-t-transparent"></div>
              </div>
            ) : mySlots.length === 0 ? (
              <div className="text-center py-8 border-2 border-gray-200 rounded-lg">
                <p className="text-gray-600">
                  You don't have any swappable slots. Mark a slot as swappable in your calendar first.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {mySlots.map((slot) => (
                  <label
                    key={slot._id}
                    className={`block p-4 border-2 rounded-lg cursor-pointer transition-colors ${
                      selectedSlot === slot._id
                        ? 'border-black bg-gray-50'
                        : 'border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="slot"
                      value={slot._id}
                      checked={selectedSlot === slot._id}
                      onChange={(e) => setSelectedSlot(e.target.value)}
                      className="mr-3"
                    />
                    <span className="font-bold">{slot.title}</span>
                    <div className="ml-6 text-sm text-gray-600 mt-1">
                      {format(new Date(slot.startTime), 'MMM dd, yyyy • h:mm a')} -{' '}
                      {format(new Date(slot.endTime), 'h:mm a')}
                    </div>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="flex gap-3 pt-4 border-t-2 border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!selectedSlot}
              className="btn-primary flex-1"
            >
              Request Swap
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SwapModal;
