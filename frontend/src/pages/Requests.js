import React, { useState, useEffect } from "react";
import { swapAPI } from "../services/api";
import Navbar from "../components/Navbar";
import { format } from "date-fns";
import { useAuth } from "../context/AuthContext";
import { useSocket } from "../context/SocketContext";

const Requests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { user } = useAuth();
  const { notification } = useSocket();

  useEffect(() => {
    fetchData();
  }, []);

  // Auto-refresh when receiving swap notifications
  useEffect(() => {
    if (notification && (notification.type === 'success' || notification.type === 'error' || notification.type === 'info')) {
      fetchData();
    }
  }, [notification]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const requestsRes = await swapAPI.getMySwapRequests();

      console.log('Swap Requests:', requestsRes.data);
      console.log('Current User:', user);
      setRequests(requestsRes.data);
      setError("");
    } catch (err) {
      console.error("Error fetching data:", err);
      setError("Failed to load swap requests");
    } finally {
      setLoading(false);
    }
  };

  const handleRespond = async (requestId, action) => {
    try {
      await swapAPI.respondToSwap(requestId, action);
      setSuccess(
        action === "ACCEPT" ? "Swap accepted successfully" : "Swap rejected"
      );
      setTimeout(() => setSuccess(""), 3000);
      fetchData();
    } catch (err) {
      console.error("Error responding to swap:", err);
      setError(`Failed to ${action.toLowerCase()} swap request`);
    }
  };

  // Debug: Check user object structure
  console.log('Full user object:', user);
  console.log('User _id:', user?._id);
  console.log('User id:', user?.id);
  console.log('All requests:', requests);
  
  // Get user ID - try both _id and id, convert to string
  const userId = String(user?._id || user?.id || '');
  console.log('Using userId (as string):', userId);
  
  const incomingRequests = requests.filter((req) => {
    const responderStr = String(req.responder?._id || req.responder || '');
    const match = responderStr === userId && req.status === 'PENDING';
    console.log('Incoming check:', responderStr, '===', userId, '?', match, 'status:', req.status);
    return match;
  });

  const outgoingRequests = requests.filter((req) => {
    const requesterStr = String(req.requester?._id || req.requester || '');
    const match = requesterStr === userId;
    console.log('Outgoing check:', requesterStr, '===', userId, '?', match);
    return match;
  });
  
  console.log('Incoming requests:', incomingRequests);
  console.log('Outgoing requests:', outgoingRequests);

  const RequestCard = ({ request, isIncoming }) => {
    // Events are now populated objects from backend
    const requesterEvent = request.requesterEvent;
    const responderEvent = request.responderEvent;
    
    if (!requesterEvent || !responderEvent) {
      console.log('Missing event data:', { requesterEvent, responderEvent });
      return null;
    }

    const statusStyles = {
      PENDING: "bg-gray-100 text-gray-800 border-gray-300",
      ACCEPTED: "bg-black text-white border-black",
      REJECTED: "bg-gray-300 text-gray-800 border-gray-400",
    };

    return (
      <div className="card border-2 border-gray-200 rounded-lg p-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-bold text-lg">Swap Request</h3>
          <span
            className={`px-3 py-1 rounded-full text-xs border-2 ${
              statusStyles[request.status] || statusStyles.PENDING
            }`}
          >
            {request.status}
          </span>
        </div>

        <div className="space-y-4">
          <div className="p-3 bg-gray-50 border rounded-lg">
            <p className="text-xs text-gray-600 mb-1">
              {isIncoming ? "They offer:" : "You offered:"}
            </p>
            <h4 className="font-bold">{requesterEvent.title}</h4>
            <p className="text-sm text-gray-600">
              {format(new Date(requesterEvent.startTime), "MMM dd, yyyy • h:mm a")} -{" "}
              {format(new Date(requesterEvent.endTime), "h:mm a")}
            </p>
          </div>

          <div className="text-center text-gray-400 font-bold">⇅</div>

          <div className="p-3 bg-gray-50 border rounded-lg">
            <p className="text-xs text-gray-600 mb-1">
              {isIncoming ? "For your:" : "For their:"}
            </p>
            <h4 className="font-bold">{responderEvent.title}</h4>
            <p className="text-sm text-gray-600">
              {format(new Date(responderEvent.startTime), "MMM dd, yyyy • h:mm a")} -{" "}
              {format(new Date(responderEvent.endTime), "h:mm a")}
            </p>
          </div>
        </div>

        {isIncoming && request.status === "PENDING" && (
          <div className="flex gap-3 mt-4 pt-3 border-t">
            <button
              onClick={() => handleRespond(request._id, "REJECT")}
              className="flex-1 border border-black px-3 py-2 rounded hover:bg-gray-50"
            >
              Reject
            </button>
            <button
              onClick={() => handleRespond(request._id, "ACCEPT")}
              className="flex-1 bg-black text-white px-3 py-2 rounded hover:bg-gray-800"
            >
              Accept
            </button>
          </div>
        )}

        <div className="text-xs text-gray-500 mt-2">
          Created {format(new Date(request.createdAt), "MMM dd, yyyy • h:mm a")}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">Swap Requests</h1>

        {error && (
          <div className="bg-gray-100 border border-black p-3 mb-4 rounded">
            {error}
          </div>
        )}
        {success && (
          <div className="bg-black text-white p-3 mb-4 rounded">{success}</div>
        )}

        {loading ? (
          <div className="text-center py-10">Loading requests...</div>
        ) : (
          <>
            <section className="mb-10">
              <h2 className="text-2xl font-bold mb-3">
                Incoming Requests ({incomingRequests.length})
              </h2>
              {incomingRequests.length === 0 ? (
                <div className="p-6 border rounded text-gray-500 text-center">
                  No incoming swap requests
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {incomingRequests.map((req) => (
                    <RequestCard key={req._id} request={req} isIncoming />
                  ))}
                </div>
              )}
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-3">
                Outgoing Requests ({outgoingRequests.length})
              </h2>
              {outgoingRequests.length === 0 ? (
                <div className="p-6 border rounded text-gray-500 text-center">
                  No outgoing swap requests
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {outgoingRequests.map((req) => (
                    <RequestCard key={req._id} request={req} />
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
};

export default Requests;