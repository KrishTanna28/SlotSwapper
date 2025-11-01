# SlotSwapper - Peer-to-Peer Time Slot Exchange Platform

## 📋 Project Overview

SlotSwapper is a full-stack web application that enables users to exchange time slots with each other in a peer-to-peer manner. Users can create events, mark them as swappable, browse available slots from other users, and request swaps. The platform features real-time notifications using WebSocket technology to instantly notify users when their swap requests are accepted or rejected.

### Key Features
- **User Authentication**: Secure JWT-based authentication system
- **Calendar Management**: Create, update, and delete personal events
- **Swap Marketplace**: Browse and request swaps for available time slots
- **Request Management**: Accept or reject incoming swap requests
- **Real-time Notifications**: Instant WebSocket notifications for swap actions
- **Responsive Design**: Black and white Uber-style minimalist UI

---

## 🎨 Design Choices

### Architecture
- **MERN Stack**: MongoDB, Express.js, React, Node.js for full-stack JavaScript development
- **RESTful API**: Clean, resource-based API endpoints
- **JWT Authentication**: Stateless authentication with secure token management
- **Socket.IO**: Real-time bidirectional communication for notifications

### UI/UX Design
- **Black & White Theme**: Minimalist Uber-style design for clarity and focus
- **Component-Based**: Reusable React components for maintainability
- **Responsive Layout**: Mobile-first approach using Tailwind CSS
- **Visual Feedback**: Loading states, error messages, and success notifications

### Database Schema
- **User Model**: Stores user credentials and profile information
- **Event Model**: Manages time slots with ownership and status tracking
- **SwapRequest Model**: Handles swap transactions between users

### State Management
- **React Context API**: For global authentication and socket state
- **Local State**: Component-level state for UI interactions
- **Real-time Updates**: Automatic data refresh on socket events

---

## 🚀 Setup Instructions

### Prerequisites
- Node.js (v14 or higher)
- MongoDB (local installation or MongoDB Atlas account)
- npm or yarn package manager
- Git

### Step 1: Clone the Repository
```bash
git clone <repository-url>
cd SlotSwapper
```

### Step 2: Backend Setup

#### 2.1 Navigate to Backend Directory
```bash
cd backend
```

#### 2.2 Install Dependencies
```bash
npm install
```

#### 2.3 Configure Environment Variables
Create a `.env` file in the root directory (not in backend folder) with the following:

```env
MONGO_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/slotswapper?retryWrites=true&w=majority
PORT=5000
JWT_SECRET=your_jwt_secret_key_here
FRONTEND_URL=http://localhost:3000
```

**Note**: Replace `<username>` and `<password>` with your MongoDB credentials.

#### 2.4 Start Backend Server
```bash
npm start
```

The backend server will run on `http://localhost:5000`

### Step 3: Frontend Setup

#### 3.1 Navigate to Frontend Directory (New Terminal)
```bash
cd frontend
```

#### 3.2 Install Dependencies
```bash
npm install
```

#### 3.3 Configure Environment Variables
Create a `.env` file in the `frontend` directory:

```env
REACT_APP_API_URL=http://localhost:5000
```

#### 3.4 Start Frontend Development Server
```bash
npm start
```

The frontend will run on `http://localhost:3000` and automatically open in your browser.

### Step 4: Verify Installation
1. Open `http://localhost:3000` in your browser
2. You should see the SlotSwapper landing page
3. Create a new account by clicking "Sign Up"
4. After registration, you'll be redirected to the dashboard

---

## 📡 API Endpoints

### Authentication Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| POST | `/api/user/register` | Register a new user | `{ name, email, password }` | `{ message, user, token }` |
| POST | `/api/user/login` | Login existing user | `{ email, password }` | `{ message, user, token }` |
| POST | `/api/user/logout` | Logout current user | - | `{ message }` |

**Example - Register User:**
```bash
curl -X POST http://localhost:5000/api/user/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "John Doe",
    "email": "john@example.com",
    "password": "password123"
  }'
```

### Event Endpoints (Protected - Requires JWT Token)

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/api/event` | Get all user's events | - | `[{ _id, title, description, startTime, endTime, status, owner }]` |
| POST | `/api/event/create` | Create a new event | `{ title, description, startTime, endTime, status }` | `{ _id, title, ... }` |
| PUT | `/api/event/update/:id` | Update an event | `{ title?, description?, startTime?, endTime?, status? }` | `{ message, event }` |
| DELETE | `/api/event/delete/:id` | Delete an event | - | `{ message }` |

**Example - Create Event:**
```bash
curl -X POST http://localhost:5000/api/event/create \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_jwt_token>" \
  -d '{
    "title": "Team Meeting",
    "description": "Weekly sync",
    "startTime": "2025-11-05T10:00:00Z",
    "endTime": "2025-11-05T11:00:00Z",
    "status": "BUSY"
  }'
```

### Swap Request Endpoints (Protected - Requires JWT Token)

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/api/swappableSlots` | Get all swappable slots (excluding user's own) | - | `[{ _id, title, startTime, endTime, owner }]` |
| POST | `/api/swapRequest` | Create a swap request | `{ mySlotId, theirSlotId }` | `{ message, swap }` |
| POST | `/api/respondToSwap/:requestId` | Accept or reject a swap | `{ action: "ACCEPT" or "REJECT" }` | `{ message }` |
| GET | `/api/mySwapRequests` | Get user's swap requests (incoming & outgoing) | - | `[{ _id, requester, responder, requesterEvent, responderEvent, status }]` |

**Example - Request Swap:**
```bash
curl -X POST http://localhost:5000/api/swapRequest \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_jwt_token>" \
  -d '{
    "mySlotId": "6904e61cc0d485cb9cb5ab9c",
    "theirSlotId": "6904e7a83d4987af55f1d9e2"
  }'
```

**Example - Accept Swap:**
```bash
curl -X POST http://localhost:5000/api/respondToSwap/6905b3cd30c628bb2a5c418c \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your_jwt_token>" \
  -d '{
    "action": "ACCEPT"
  }'
```

### Event Status Values
- `BUSY`: Event is not available for swapping
- `SWAPPABLE`: Event is available for swapping
- `SWAP_PENDING`: Event is involved in a pending swap request

### Swap Request Status Values
- `PENDING`: Waiting for responder's action
- `ACCEPTED`: Swap completed successfully
- `REJECTED`: Swap declined by responder

---

## 🔌 WebSocket Events

### Client → Server
| Event | Description | Payload |
|-------|-------------|---------|
| `join` | Join user's private room | `userId` (string) |

### Server → Client
| Event | Description | Payload |
|-------|-------------|---------|
| `newSwapRequest` | New incoming swap request | `{ message, swapRequestId }` |
| `swapAccepted` | Your swap request was accepted | `{ message, swapRequestId }` |
| `swapRejected` | Your swap request was rejected | `{ message, swapRequestId }` |

---

## 📁 Project Structure

```
SlotSwapper/
├── backend/
│   ├── config/
│   │   └── db.js                    # MongoDB connection
│   ├── controllers/
│   │   ├── userControllers.js       # User authentication logic
│   │   ├── eventControllers.js      # Event CRUD operations
│   │   └── swaprequestControllers.js # Swap request logic
│   ├── middlewares/
│   │   └── jwtmiddleware.js         # JWT verification
│   ├── models/
│   │   ├── UserSchema.js            # User model
│   │   ├── EventSchema.js           # Event model
│   │   └── SwapRequestSchema.js     # SwapRequest model
│   ├── routes/
│   │   ├── userRoutes.js            # User routes
│   │   ├── eventRoutes.js           # Event routes
│   │   └── swapresquestRoutes.js    # Swap routes
│   ├── utils/
│   │   └── jwt.js                   # JWT utilities
│   ├── index.js                     # Server entry point
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.js            # Navigation bar
│   │   │   ├── EventCard.js         # Event display card
│   │   │   ├── CreateEventModal.js  # Event creation modal
│   │   │   ├── SwapModal.js         # Swap request modal
│   │   │   ├── Notification.js      # Toast notifications
│   │   │   └── ProtectedRoute.js    # Route protection
│   │   ├── context/
│   │   │   ├── AuthContext.js       # Authentication state
│   │   │   └── SocketContext.js     # Socket.IO connection
│   │   ├── pages/
│   │   │   ├── Landing.js           # Landing page
│   │   │   ├── Login.js             # Login page
│   │   │   ├── Register.js          # Registration page
│   │   │   ├── Dashboard.js         # User calendar
│   │   │   ├── Marketplace.js       # Browse swappable slots
│   │   │   └── Requests.js          # Manage swap requests
│   │   ├── services/
│   │   │   └── api.js               # API service layer
│   │   ├── App.js                   # Main app component
│   │   ├── index.js                 # React entry point
│   │   └── index.css                # Global styles
│   ├── tailwind.config.js           # Tailwind configuration
│   ├── postcss.config.js            # PostCSS configuration
│   └── package.json
│
├── .env                              # Root environment variables
├── README.md                         # This file
└── WEBSOCKET_SETUP.md               # WebSocket documentation
```

---

## 🧪 Testing the Application

### Manual Testing Flow

#### 1. Create Two User Accounts
```
User A: alice@example.com
User B: bob@example.com
```

#### 2. User A - Create and Mark Events as Swappable
1. Login as User A
2. Go to "My Calendar"
3. Click "+ Create Event"
4. Create event: "Morning Workout" (10:00 AM - 11:00 AM)
5. Click "Make Swappable" on the event

#### 3. User B - Create Events
1. Login as User B
2. Create event: "Dentist Appointment" (10:00 AM - 11:00 AM)
3. Mark it as swappable

#### 4. User B - Request Swap
1. Go to "Marketplace"
2. See User A's "Morning Workout" slot
3. Click "Request Swap"
4. Select your "Dentist Appointment" slot
5. Submit request

#### 5. User A - Accept Swap
1. Go to "Swap Requests"
2. See incoming request from User B
3. Click "Accept"
4. **Real-time notification appears for User B**

#### 6. Verify Swap
1. Both users check their calendars
2. User A now has "Dentist Appointment"
3. User B now has "Morning Workout"
4. Both events are marked as "BUSY"

---

## 💡 Assumptions Made

### Technical Assumptions
1. **Single Time Zone**: All times are stored in UTC; no timezone conversion implemented
2. **No Recurring Events**: Each event is a one-time occurrence
3. **Binary Swap**: Only 1-to-1 swaps are supported (no multi-party swaps)
4. **No Overlap Validation**: System doesn't prevent overlapping events
5. **Instant Swap**: Accepted swaps take effect immediately
6. **No Swap History**: Past swaps are not tracked separately

### Business Logic Assumptions
1. **Mutual Consent**: Both parties must have swappable slots to initiate a swap
2. **Responder Authority**: Only the responder can accept/reject requests
3. **No Cancellation**: Once accepted, swaps cannot be undone
4. **Status Lock**: Events in `SWAP_PENDING` status cannot be modified or deleted
5. **One Request Per Slot**: A slot can only be in one pending swap at a time

### User Experience Assumptions
1. **Email Uniqueness**: Each user has a unique email address
2. **Password Security**: Minimum 6 characters required
3. **Active Sessions**: Users remain logged in until explicit logout
4. **Browser Support**: Modern browsers with WebSocket support
5. **Network Stability**: Reliable internet connection for real-time features

---

## 🚧 Challenges Faced & Solutions

### 1. Real-time Notification Delivery
**Challenge**: Ensuring notifications reach the correct user in real-time.

**Solution**: Implemented Socket.IO with room-based messaging where each user joins a room identified by their user ID. This ensures notifications are sent only to the intended recipient.

### 2. Event Ownership Transfer
**Challenge**: Swapping event ownership while maintaining data integrity.

**Solution**: Used atomic database operations to swap the `owner` field of both events simultaneously, ensuring consistency even if the operation fails midway.

### 3. Concurrent Swap Requests
**Challenge**: Preventing multiple users from requesting the same slot simultaneously.

**Solution**: Implemented `SWAP_PENDING` status that locks events during active swap negotiations. Events with this status cannot be involved in new swap requests.

### 4. User ID Comparison Issues
**Challenge**: MongoDB ObjectIds were not matching with string IDs from JWT tokens.

**Solution**: Standardized all user ID comparisons by converting ObjectIds to strings using `.toString()` method before comparison.

### 5. Populated vs Non-Populated Data
**Challenge**: Frontend needed full event details for swap requests, but backend only stored event IDs.

**Solution**: Used Mongoose `.populate()` method to include full event and user details in swap request responses, eliminating the need for multiple API calls.

### 6. WebSocket Connection Management
**Challenge**: Managing socket connections across page navigations and user sessions.

**Solution**: Created a React Context for socket management that connects when user logs in and disconnects on logout, with automatic reconnection handling.

### 7. API Request Double-Wrapping
**Challenge**: Action parameter was being double-wrapped in objects, causing accept/reject logic to fail.

**Solution**: Refactored API service layer to handle object wrapping consistently, ensuring clean data flow from frontend to backend.

---

## 🔐 Security Considerations

### Implemented
- ✅ Password hashing using bcrypt
- ✅ JWT-based stateless authentication
- ✅ Protected API routes with JWT middleware
- ✅ Authorization checks (users can only modify their own data)
- ✅ Input validation on backend
- ✅ CORS configuration for frontend-backend communication

### Future Enhancements
- 🔄 Rate limiting for API endpoints
- 🔄 Refresh token mechanism
- 🔄 Email verification for new accounts
- 🔄 Password reset functionality
- 🔄 XSS and CSRF protection
- 🔄 API request logging and monitoring

---

## 🎯 Future Enhancements

### Features
- [ ] Calendar grid view with drag-and-drop
- [ ] Search and filter functionality
- [ ] User profiles with ratings/reviews
- [ ] Swap history and analytics
- [ ] Email notifications
- [ ] Mobile application (React Native)
- [ ] Multi-party swaps (3+ users)
- [ ] Recurring events support
- [ ] Time zone support
- [ ] Event categories and tags

### Technical Improvements
- [ ] Unit and integration tests
- [ ] CI/CD pipeline
- [ ] Docker containerization
- [ ] Redis caching for performance
- [ ] GraphQL API option
- [ ] Server-side pagination
- [ ] Database indexing optimization
- [ ] Error tracking (Sentry)
- [ ] Performance monitoring

---

## 📝 Dependencies

### Backend
```json
{
  "express": "^4.18.2",
  "mongoose": "^7.0.0",
  "bcrypt": "^5.1.0",
  "jsonwebtoken": "^9.0.0",
  "socket.io": "^4.8.1",
  "dotenv": "^16.0.3",
  "cors": "^2.8.5"
}
```

### Frontend
```json
{
  "react": "^19.2.0",
  "react-dom": "^19.2.0",
  "react-router-dom": "^7.9.5",
  "axios": "^1.13.1",
  "socket.io-client": "^4.8.1",
  "date-fns": "^4.1.0",
  "tailwindcss": "^3.4.1",
  "lucide-react": "^0.263.1"
}
```

---

## 🐛 Known Issues

1. **Notification Duplication**: In some cases, notifications may appear twice due to socket event handling. (Under investigation)
2. **No Offline Support**: Application requires active internet connection for all features.
3. **Browser Refresh**: Socket connection is lost on page refresh; requires re-login in some cases.
4. **Mobile Responsiveness**: Some modals may not be optimally sized on very small screens.

---

## 📞 Support & Contact

For issues, questions, or contributions:
- Create an issue in the repository
- Check existing documentation in `/docs` folder
- Review `WEBSOCKET_SETUP.md` for real-time features

---

## 📄 License

This project is created for educational purposes.

---

## 🙏 Acknowledgments

- **Tailwind CSS** for the utility-first CSS framework
- **Socket.IO** for real-time communication
- **MongoDB** for flexible document storage
- **React** for the component-based UI framework
- **Lucide React** for beautiful icons

---

**Built with ❤️ using the MERN Stack**

*Last Updated: November 1, 2025*
