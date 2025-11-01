import React from 'react';
import { format } from 'date-fns';

const EventCard = ({ event, onStatusChange, onDelete, showActions = true }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'BUSY':
        return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'SWAPPABLE':
        return 'bg-black text-white border-black';
      case 'SWAP_PENDING':
        return 'bg-gray-300 text-gray-800 border-gray-400';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const formatDateTime = (date) => {
    return format(new Date(date), 'MMM dd, yyyy • h:mm a');
  };

  return (
    <div className="card">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <h3 className="text-lg font-bold mb-1">{event.title}</h3>
          {event.description && (
            <p className="text-sm text-gray-600 mb-2">{event.description}</p>
          )}
        </div>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium border-2 ${getStatusColor(
            event.status
          )}`}
        >
          {event.status}
        </span>
      </div>

      <div className="space-y-1 text-sm text-gray-600 mb-4">
        <div className="flex items-center">
          <span className="font-medium mr-2">Start:</span>
          {formatDateTime(event.startTime)}
        </div>
        <div className="flex items-center">
          <span className="font-medium mr-2">End:</span>
          {formatDateTime(event.endTime)}
        </div>
      </div>

      {showActions && (
        <div className="flex gap-2 pt-3 border-t-2 border-gray-200">
          {event.status === 'BUSY' && (
            <button
              onClick={() => onStatusChange(event._id, 'SWAPPABLE')}
              className="flex-1 bg-black text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
            >
              Make Swappable
            </button>
          )}
          {event.status === 'SWAPPABLE' && (
            <button
              onClick={() => onStatusChange(event._id, 'BUSY')}
              className="flex-1 bg-white text-black border-2 border-black px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              Mark as Busy
            </button>
          )}
          {event.status !== 'SWAP_PENDING' && (
            <button
              onClick={() => onDelete(event._id)}
              className="px-4 py-2 border-2 border-gray-300 rounded-lg text-sm font-medium hover:border-black transition-colors"
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default EventCard;
