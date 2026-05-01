# WorkVerse – Team Task Manager 🚀

A **modern, premium-quality, full-stack MERN web application** for team task management. Built with production-level architecture, real-time collaboration via Socket.IO, role-based access control, drag-and-drop Kanban board, and a beautiful dark glassmorphism UI.

---

## 🌟 Live Preview

> Deploy your own instance using the instructions below.

---

## ✨ Features

### 🔐 Authentication & Security
- JWT-based authentication with secure token storage
- Password hashing with bcryptjs (12 salt rounds)
- Role-based access control (Admin / Member)
- Protected API routes with middleware
- Rate limiting (200 req / 15 min)
- CORS protection

### 👑 Admin Features
- Create / Edit / Delete Projects
- Create / Assign / Delete Tasks
- Manage team members
- View full analytics dashboard
- Access all activity logs

### 👤 Member Features
- View assigned tasks
- Update task status (drag & drop)
- Add comments on tasks
- Manage subtasks
- Receive real-time notifications

### 📋 Task Management
- Full CRUD for tasks
- Status: `Todo → In Progress → Review → Completed`
- Priority levels: `Low / Medium / High`
- Subtasks with progress tracking
- Comments system
- Due date management with overdue detection
- File attachment support

### 📁 Project Management
- Full CRUD for projects
- Team member assignment
- Progress bar based on task completion
- Status: `Planning / Active / Completed / On Hold`
- Color-coded project cards

### 🗂️ Kanban Board
- Drag & drop tasks between columns (react-beautiful-dnd)
- Real-time updates via Socket.IO
- Filter by project
- Visual priority indicators

### 📊 Analytics
- Task status distribution (Pie Chart)
- Priority breakdown (Bar Chart)
- Tasks by Project (Grouped Bar)
- Monthly activity trends (Line Chart)
- Real-time stats cards

### 🔔 Notifications
- Real-time notifications via Socket.IO
- Types: Task assigned, Updated, Comment added, Deadline reminder
- Mark as read / Mark all as read
- Unread count badge in sidebar & navbar

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React.js (Vite), Tailwind CSS, Redux Toolkit |
| Animations | Framer Motion |
| Charts | Recharts |
| Drag & Drop | react-beautiful-dnd |
| HTTP Client | Axios |
| Real-time | Socket.IO Client |
| Backend | Node.js, Express.js |
| Database | MongoDB + Mongoose |
| Auth | JWT + bcryptjs |
| Real-time | Socket.IO |
| File Upload | Multer |
| Rate Limiting | express-rate-limit |

---

## 📁 Folder Structure

```
WorkVerse/
├── backend/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Auth logic
│   │   ├── projectController.js  # Project CRUD
│   │   ├── taskController.js     # Task CRUD + comments
│   │   └── notificationController.js
│   ├── middleware/
│   │   ├── auth.js               # JWT protect + adminOnly
│   │   └── errorHandler.js       # Global error handling
│   ├── models/
│   │   ├── User.js
│   │   ├── Project.js
│   │   ├── Task.js
│   │   ├── Notification.js
│   │   └── ActivityLog.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── projectRoutes.js
│   │   ├── taskRoutes.js
│   │   └── notificationRoutes.js
│   ├── socket/
│   │   └── index.js              # Socket.IO setup
│   ├── uploads/                  # File uploads dir
│   ├── server.js                 # Entry point
│   └── .env.example
│
└── frontend/
    ├── src/
    │   ├── api/
    │   │   └── axios.js          # Axios instance + interceptors
    │   ├── components/
    │   │   └── common/
    │   │       └── Navbar.jsx
    │   ├── layouts/
    │   │   └── MainLayout.jsx    # Sidebar + Navbar wrapper
    │   ├── pages/
    │   │   ├── LandingPage.jsx
    │   │   ├── LoginPage.jsx
    │   │   ├── RegisterPage.jsx
    │   │   ├── DashboardPage.jsx
    │   │   ├── ProjectsPage.jsx
    │   │   ├── ProjectDetailPage.jsx
    │   │   ├── TasksPage.jsx
    │   │   ├── KanbanPage.jsx
    │   │   ├── AnalyticsPage.jsx
    │   │   ├── NotificationsPage.jsx
    │   │   ├── ProfilePage.jsx
    │   │   └── SettingsPage.jsx
    │   ├── redux/
    │   │   ├── store.js
    │   │   └── slices/
    │   │       ├── authSlice.js
    │   │       ├── projectSlice.js
    │   │       ├── taskSlice.js
    │   │       └── notificationSlice.js
    │   ├── App.jsx               # Routes + Socket init
    │   ├── main.jsx              # React entry point
    │   └── index.css             # Global styles + CSS classes
    ├── index.html
    ├── vite.config.js
    ├── tailwind.config.js
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js >= 18.x
- MongoDB Atlas account (free tier works)
- npm or yarn

---

### 1️⃣ Clone the Repository

```bash
git clone https://github.com/yourusername/WorkVerse.git
cd WorkVerse
```

---

### 2️⃣ Backend Setup

```bash
cd backend
npm install
```

Create your `.env` file:

```bash
cp .env.example .env
```

Edit `.env` with your values:

```env
PORT=5000
MONGO_URI=mongodb+srv://<user>:<password>@cluster0.xxxxx.mongodb.net/WorkVerse
JWT_SECRET=your_super_secret_key_here_make_it_long_and_random
JWT_EXPIRE=7d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

Create uploads folder:

```bash
mkdir uploads
```

Start the backend:

```bash
# Development (with auto-reload)
npm run dev

# Production
npm start
```

Backend will run at: `http://localhost:5000`

---

### 3️⃣ Frontend Setup

```bash
cd ../frontend
npm install
```

Create `.env` file in frontend:

```env
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
```

Start the frontend:

```bash
npm run dev
```

Frontend will run at: `http://localhost:5173`

---

### 4️⃣ Seed Demo Data (Optional)

Register two accounts manually:

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@WorkVerse.com | admin123 |
| Member | member@WorkVerse.com | member123 |

Login as **Admin** → Create projects → Assign tasks to Member.

---

## 🌐 API Endpoints

### Auth
```
POST   /api/auth/register       Register new user
POST   /api/auth/login          Login user
GET    /api/auth/profile        Get current user (protected)
PUT    /api/auth/profile        Update profile (protected)
PUT    /api/auth/change-password Change password (protected)
GET    /api/auth/users          Get all users (admin only)
```

### Projects
```
GET    /api/projects            Get all projects
POST   /api/projects            Create project (admin)
GET    /api/projects/stats      Dashboard stats
GET    /api/projects/:id        Get single project
PUT    /api/projects/:id        Update project (admin)
DELETE /api/projects/:id        Delete project (admin)
```

### Tasks
```
GET    /api/tasks               Get tasks (with filters)
POST   /api/tasks               Create task
GET    /api/tasks/:id           Get single task
PUT    /api/tasks/:id           Update task
DELETE /api/tasks/:id           Delete task (admin)
POST   /api/tasks/:id/comments  Add comment
PUT    /api/tasks/:id/subtasks/:subtaskId  Update subtask
```

### Notifications
```
GET    /api/notifications       Get user notifications
PUT    /api/notifications/read-all  Mark all as read
PUT    /api/notifications/:id   Mark single as read
```

---

## ☁️ Deployment

### Backend → Render.com

1. Push your `backend/` folder to GitHub
2. Go to [render.com](https://render.com) → New Web Service
3. Connect your GitHub repo
4. Set:
   - **Build Command:** `npm install`
   - **Start Command:** `node server.js`
5. Add all environment variables from `.env`
6. Deploy!

### Frontend → Vercel

1. Push your `frontend/` folder to GitHub
2. Go to [vercel.com](https://vercel.com) → New Project
3. Import your repo
4. Set environment variables:
   ```
   VITE_API_URL=https://your-render-backend.onrender.com/api
   VITE_SOCKET_URL=https://your-render-backend.onrender.com
   ```
5. Deploy!

### Database → MongoDB Atlas

1. Create free cluster at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create database user
3. Whitelist `0.0.0.0/0` in Network Access
4. Get your connection string
5. Use in `MONGO_URI` env variable

---

## 🔧 Environment Variables Reference

### Backend (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `MONGO_URI` | MongoDB connection string | `mongodb+srv://...` |
| `JWT_SECRET` | JWT signing secret (keep private!) | `your-secret-key` |
| `JWT_EXPIRE` | Token expiry | `7d` |
| `NODE_ENV` | Environment | `development` or `production` |
| `CLIENT_URL` | Frontend URL for CORS | `http://localhost:5173` |

### Frontend (.env)
| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:5000/api` |
| `VITE_SOCKET_URL` | Backend Socket.IO URL | `http://localhost:5000` |

---

## 🔌 Socket.IO Events

| Event | Direction | Description |
|-------|-----------|-------------|
| `join` | Client → Server | Join personal notification room |
| `joinProject` | Client → Server | Join project room |
| `notification` | Server → Client | New notification |
| `taskUpdated` | Server → Client | Task was updated |
| `commentAdded` | Server → Client | New comment on task |

---

## 📱 Responsive Design

- ✅ Desktop (1280px+) — Full sidebar + content
- ✅ Tablet (768px–1279px) — Collapsible sidebar
- ✅ Mobile (< 768px) — Drawer sidebar + stacked layout

---

## 🛡️ Security Features

- JWT authentication with expiry
- Passwords hashed with bcrypt (12 rounds)
- Rate limiting (200 req / 15 min per IP)
- Role-based middleware on all sensitive routes
- Input validation with Mongoose schemas
- CORS configured to allowed origins only
- Environment variables for all secrets
- HTTP-only considerations for production

---

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push: `git push origin feature/amazing-feature`
5. Open a Pull Request

---

## 📄 License

MIT License — free to use for personal and commercial projects.

---

## 👨‍💻 Built With

- **MongoDB** — Database
- **Express.js** — Backend framework
- **React.js** — Frontend library
- **Node.js** — Runtime environment
- **Socket.IO** — Real-time engine
- **Tailwind CSS** — Styling
- **Redux Toolkit** — State management
- **Framer Motion** — Animations
- **Recharts** — Charts & analytics

---

> Built with ❤️ using the MERN stack. Inspired by Notion, Trello, Jira, and Monday.com.
