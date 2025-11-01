import Event from "../models/EventSchema.js";
import SwapRequest from "../models/SwapRequestSchema.js";

export const getEvents = async (req, res) => {
    const owner = req.user?.id;
    try {
        const events = await Event.find({ owner });
        return res.status(200).json(events);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const createEvent = async (req, res) => {
    const { title, description, status, startTime, endTime } = req.body;
    const owner = req.user?.id;
    if (!title || !startTime || !endTime) {
        return res.status(400).json({ message: "All fields are required" });
    }
    const existing = await Event.findOne({ title, owner });
    if (existing) {
        return res.status(400).json({ message: "Event name already exists" });
    }
    try {
        if (title.length < 3) {
            return res.status(400).json({ message: "Title must be at least 3 characters long" });
        }
        if (startTime > endTime) {
            return res.status(400).json({ message: "Start time must be before end time" });
        }
        const event = await Event.create({ title, description, status, startTime, endTime, owner });
        return res.status(201).json(event);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const updateEvent = async (req, res) => {
  const { id } = req.params;
  const owner = req.user?.id;
  const updates = req.body;

  if (!id) return res.status(400).json({ message: "Event id is required" });

  if (updates.startTime && updates.endTime && updates.startTime > updates.endTime)
    return res.status(400).json({ message: "Start time must be before end time" });

  try {
    const event = await Event.findOneAndUpdate(
      { _id: id, owner },
      { $set: updates },
      { new: true }
    );

    if (!event) return res.status(404).json({ message: "Event not found" });

    return res.status(200).json({ message: "Event updated successfully", event });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};


export const deleteEvent = async (req, res) => {
    const { id } = req.params;
    const owner = req.user?.id;
    if (!id) {
        return res.status(400).json({ message: "Event id is required" });
    }
    const event = await Event.findOne({ _id: id, owner });
    if (event.status === "SWAP_PENDING") {
        return res.status(400).json({ message: "Cannot delete event as it is already in a swap request" });
    }
    try {
        await Event.findOneAndDelete({ _id: id, owner });
        return res.status(200).json({ message: "Event deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};