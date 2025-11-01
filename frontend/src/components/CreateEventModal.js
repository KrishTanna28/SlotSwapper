import React, { useState } from 'react';

const CreateEventModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    startTime: '',
    endTime: '',
    status: 'BUSY',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      title: '',
      description: '',
      startTime: '',
      endTime: '',
      status: 'BUSY',
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-md w-full p-6 border-2 border-black">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Create New Event</h2>
          <button
            onClick={onClose}
            className="text-gray-600 hover:text-black text-2xl"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="title" className="block text-sm font-medium mb-2">
              Title *
            </label>
            <input
              id="title"
              name="title"
              type="text"
              value={formData.title}
              onChange={handleChange}
              className="input-field"
              placeholder="Team Meeting"
              required
            />
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="input-field"
              placeholder="Optional description"
              rows="3"
            />
          </div>

          <div>
            <label htmlFor="startTime" className="block text-sm font-medium mb-2">
              Start Time *
            </label>
            <input
              id="startTime"
              name="startTime"
              type="datetime-local"
              value={formData.startTime}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          <div>
            <label htmlFor="endTime" className="block text-sm font-medium mb-2">
              End Time *
            </label>
            <input
              id="endTime"
              name="endTime"
              type="datetime-local"
              value={formData.endTime}
              onChange={handleChange}
              className="input-field"
              required
            />
          </div>

          <div>
            <label htmlFor="status" className="block text-sm font-medium mb-2">
              Status *
            </label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="input-field"
              required
            >
              <option value="BUSY">Busy</option>
              <option value="SWAPPABLE">Swappable</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="btn-secondary flex-1"
            >
              Cancel
            </button>
            <button type="submit" className="btn-primary flex-1">
              Create Event
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEventModal;
