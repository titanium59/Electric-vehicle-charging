# EV Charging Stations Management

A full-stack application for managing and visualizing EV charging stations with authentication, CRUD, and Mapbox map view.

---

## 🚀 Setup Instructions

### Prerequisites

- [Node.js](https://nodejs.org/) (v16+ recommended)
- [MongoDB](https://www.mongodb.com/try/download/community) running locally (or update the connection string in `backend/app.js`)

---

### 1. Clone the Repository

```sh
git clone <your-repo-url>
cd <project-root>
```

---

### 2. Install Backend Dependencies

```sh
cd backend
npm install
```

---

### 3. Install Frontend Dependencies

```sh
cd ../frontend
npm install
```

---

### 4. Configure Environment Variables

- **Frontend:**  
  Edit `frontend/.env` and set your Mapbox token:
  ```
  VUE_APP_MAPBOX_TOKEN=your_mapbox_token_here
  ```

- **Backend:**  
  If you want to change the MongoDB URI or JWT secret, edit `backend/app.js`.

---

### 5. Seed the Database (Optional)

To seed 2,500 demo EV stations:
Note: Seeding will require a temp user

```sh
cd ../backend
node seed.js
```

---

### 6. Start the Backend Server

```sh
cd backend
node app.js
```
The backend will run at [http://localhost:3000](http://localhost:3000).

---

### 7. Start the Frontend Dev Server

```sh
cd ../frontend
npm run serve
```
The frontend will run at [http://localhost:8080](http://localhost:8080).

---

### 8. Access the App

- Open [http://localhost:8080](http://localhost:8080) in your browser.

---

## 🧑‍💻 Default Owner Credentials (from seed)

- **Username:** utsav
- **Password:** (see your database, as it's hashed)

---

## 📦 Scripts

- `npm run serve` — Start frontend dev server
- `npm run build` — Build frontend for production
- `node app.js` — Start backend server
- `node seed.js` — Seed demo data

---

## 🗺️ Features

- Register/Login as owner
- Add, edit, delete your own charging stations
- Map view with clustering (Mapbox)
- Secure JWT-protected API

---

## 🛠️ Tech Stack

- **Backend:** Node.js, Express, MongoDB, Mongoose, JWT
- **Frontend:** Vue.js 3, Vue Router, Mapbox GL JS, Tailwind CSS (optional)

---