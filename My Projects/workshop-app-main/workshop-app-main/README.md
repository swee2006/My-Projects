# Workshop Registration & Confirmation App

A React + Vite application for workshop registration with participant analytics dashboard.

## Features

- **Registration Form** - Register participants with name, email, phone, and workshop selection
- **Duplicate Prevention** - Prevents duplicate registrations by email
- **Dashboard Analytics** - View participant statistics and charts
- **Local Storage** - Persistent data storage in browser
- **Animated Background** - Beautiful moon and stars animation
- **Responsive Design** - Works on desktop and mobile

## Tech Stack

- React 19.2.6
- Vite 8.0.12
- React Router 7.18.0
- Recharts 3.8.1

## Getting Started

### Install Dependencies
```bash
npm install
```

### Run Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:5173/`

### Build for Production
```bash
npm run build
```

## Project Structure

```
workshop-app/
├── src/
│   ├── components/
│   │   ├── DashboardCards.jsx
│   │   ├── ParticipantTable.jsx
│   │   ├── PopUp.jsx
│   │   └── Sidebar.jsx
│   ├── pages/
│   │   ├── Register.jsx
│   │   └── Dashboard.jsx
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
├── public/
├── package.json
└── vite.config.js
```

## Usage

1. Navigate to the **Register** page
2. Fill in participant details
3. Submit the form
4. View registered participants in the table below
5. Navigate to **Dashboard** to see analytics and charts

## License

MIT
