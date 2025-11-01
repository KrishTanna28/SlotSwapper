import SwapRequest from "../models/SwapRequestSchema.js";
import Events from "../models/EventSchema.js";
import Users from "../models/UserSchema.js";
import { io } from "../index.js";

export const swappableSlots = async (req, res) => {
    const userId = req.user?.id;
    try {
        const events = await Events.find({ status: "SWAPPABLE", owner: { $ne: userId } });
        return res.status(200).json(events);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const swapRequest = async (req, res) => {
    const { mySlotId, theirSlotId } = req.body;
    const userId = req.user?.id;
    if (!mySlotId || !theirSlotId) {
        return res.status(400).json({ message: "Both slot IDs are required" });
    }
    try {
        const mySlot = await Events.findOne({ _id: mySlotId, owner: userId, status: "SWAPPABLE" });
        const theirSlot = await Events.findOne({ _id: theirSlotId, status: "SWAPPABLE" });
        if (!mySlot || !theirSlot) {
            return res.status(404).json({ message: "One or both slots are not available for swapping" });
        }
        const responder = await Users.findOne({ _id: theirSlot.owner });
        const swap = await SwapRequest.create({
            requester: userId,
            responder: responder,
            requesterEvent: mySlotId,
            responderEvent: theirSlotId,
            status: "PENDING"
        });
        await Events.updateMany(
            { _id: { $in: [mySlotId, theirSlotId] } },
            { $set: { status: "SWAP_PENDING" } }
        );
        
        // Emit socket event to responder
        io.to(responder._id.toString()).emit('newSwapRequest', {
            message: 'You have a new swap request',
            swapRequestId: swap._id,
        });
        
        return res.status(201).json({ message: "Swap request created", swap });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export const respondToSwap = async (req, res) => {
    const { requestId } = req.params;
    const { action } = req.body;
    const userId = req.user.id;

    console.log('respondToSwap called with:', { requestId, action, body: req.body });

    try {
        const swapRequest = await SwapRequest.findById(requestId);
        if (!swapRequest) {
            return res.status(404).json({ message: "Swap request not found" });
        }

        if (!swapRequest.responder.equals(userId)) {
            return res.status(403).json({ message: "Not authorized to respond to this request" });
        }

        const mySlot = await Events.findById(swapRequest.requesterEvent);
        const theirSlot = await Events.findById(swapRequest.responderEvent);

        if (!mySlot || !theirSlot) {
            return res.status(404).json({ message: "One or both slots not found" });
        }

        console.log('Action comparison:', { action, isReject: action === "REJECT", isAccept: action === "ACCEPT" });

        if (action === "REJECT") {
            swapRequest.status = "REJECTED";
            await swapRequest.save();
            mySlot.status = "SWAPPABLE";
            theirSlot.status = "SWAPPABLE";
            await mySlot.save();
            await theirSlot.save();
            
            // Emit socket event to requester
            io.to(swapRequest.requester.toString()).emit('swapRejected', {
                message: 'Your swap request was rejected',
                swapRequestId: swapRequest._id,
            });
            
            return res.status(200).json({ message: "Swap request rejected" });
        }

        const tempOwner = mySlot.owner;
        mySlot.owner = theirSlot.owner;
        theirSlot.owner = tempOwner;

        mySlot.status = "BUSY";
        theirSlot.status = "BUSY";

        swapRequest.status = "ACCEPTED";
        await mySlot.save();
        await theirSlot.save();
        await swapRequest.save();

        // Emit socket event to requester
        io.to(swapRequest.requester.toString()).emit('swapAccepted', {
            message: 'Your swap request was accepted!',
            swapRequestId: swapRequest._id,
        });

        return res.status(200).json({ message: "Swap request accepted successfully" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

export const mySwapRequests = async (req, res) => {
    const userId = req.user.id;
    try {
        const swapRequest = await SwapRequest.find({ $or: [{ requester: userId }, { responder: userId }] })
            .populate('requesterEvent')
            .populate('responderEvent')
            .populate('requester', 'name email')
            .populate('responder', 'name email');
        return res.status(200).json(swapRequest);
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Internal server error" });
    }
}