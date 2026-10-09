# InvestPro - Mutual Fund Investment Platform

A complete role-based React application built with Vite for managing mutual fund investments with admin and user dashboards.

## Features

### User Features
- 🎨 Modern fintech UI with blue/teal gradient theme
- 🔐 Role-based authentication (User/Admin)
- 📊 Interactive dashboard with charts (Line, Pie, Bar)
- 🔍 Explore mutual funds
- 💰 Investment calculator (One-time & SIP)
- 📈 Portfolio tracking with analytics
- 🧮 SIP Calculator
- 💬 AI Chat Support (context-aware responses)
- 👤 User profile management
- 🎯 Responsive design

### Admin Features
- 📊 Admin analytics dashboard
- 👥 User management (view, delete users)
- 💰 Fund management (add, delete funds)
- 📈 Detailed reports and insights
- 📉 Revenue and growth tracking

## Tech Stack

- React 18
- Vite
- React Router DOM
- Recharts (Data Visualization)
- CSS3
- LocalStorage (Authentication)

## Installation

```bash
npm install
```

## Run Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173`

## Build for Production

```bash
npm run build
```

## Deployment on Railway

### Backend Deployment
1. In Railway, create a new project.
2. Add a new service for the backend, pointing to the `InvestPro-Backend` folder.
3. Railway will use the provided Dockerfile to build and deploy the Spring Boot app.
4. Add environment variables:
   - `DATABASE_URL`: The MySQL database URL from Railway's database plugin.
   - `DB_USERNAME`: Database username.
   - `DB_PASSWORD`: Database password.
   - `PORT`: Will be set automatically by Railway.
   - `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`: For email functionality (optional).

### Frontend Deployment
1. In the same Railway project, add another service for the frontend, pointing to the `InvestPro` folder.
2. Railway will detect it as a Node.js app and run `npm run build` to create the production build.
3. Add environment variable:
   - `VITE_API_BASE_URL`: Set to the backend service's Railway URL (e.g., `https://investpro-backend.railway.app`).

### Database Setup
1. In Railway, add a MySQL database plugin.
2. Connect it to the backend service.
3. The backend will automatically create tables using JPA.

### Connecting Frontend and Backend
- The frontend will use the `VITE_API_BASE_URL` to make API calls to the backend.
- CORS is configured globally in the backend to allow all origins for simplicity.

## Project Structure

```
src/
├── components/       # Reusable components
│   └── ChatSupport.jsx
├── pages/           # Page components
│   ├── admin/       # Admin pages
│   │   ├── AdminDashboard.jsx
│   │   ├── ManageUsers.jsx
│   │   ├── ManageFunds.jsx
│   │   └── Reports.jsx
│   ├── SplashScreen.jsx
│   ├── LandingPage.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Dashboard.jsx
│   ├── ExploreFunds.jsx
│   ├── InvestFund.jsx
│   ├── Portfolio.jsx
│   ├── SIPCalculator.jsx
│   └── Profile.jsx
├── layout/          # Layout components
│   ├── DashboardLayout.jsx
│   └── AdminLayout.jsx
├── styles/          # CSS files
└── App.jsx          # Main app component
```

## Routes

### Public Routes
- `/` - Splash Screen (auto-redirects to /home)
- `/home` - Landing Page
- `/login` - Login Page
- `/register` - Register Page (with role selection)

### User Routes (Protected)
- `/dashboard` - User Dashboard with charts
- `/explore` - Explore Funds
- `/invest/:fundName` - Invest in Fund
- `/portfolio` - Portfolio
- `/sip-calculator` - SIP Calculator
- `/profile` - User Profile

### Admin Routes (Protected)
- `/admin/dashboard` - Admin Dashboard with analytics
- `/admin/users` - Manage Users
- `/admin/funds` - Manage Funds
- `/admin/reports` - Reports & Analytics

## Role-Based Access

### User Role
- Access to investment features
- Portfolio management
- Chat support available
- Cannot access admin pages

### Admin Role
- Access to admin dashboard
- User management
- Fund management
- Analytics and reports
- No chat support
- Cannot access user dashboard

## Sample Funds

1. **Axis Midcap Fund** - High Risk, 18.5% Returns
2. **Mirae Asset Large Cap** - Medium Risk, 14.2% Returns
3. **HDFC Balanced Fund** - Low Risk, 12.8% Returns

## Features Details

### Authentication
- Role selection during registration (User/Admin)
- Password validation and confirmation
- LocalStorage-based session management
- Role-based route protection

### User Dashboard
- Portfolio growth line chart
- Asset allocation pie chart
- Monthly investment bar chart
- Summary cards (Total Invested, Current Value, Profit, Return %)

### Chat Support (User Only)
- Floating chat button
- Context-aware responses
- Keywords: returns, risk, invest, sip, portfolio
- Expandable to AI API integration

### Admin Dashboard
- User growth analytics
- Investment distribution
- Monthly revenue tracking
- Platform statistics

### Investment Types
- **One Time**: Single lump sum investment
- **SIP**: Systematic Investment Plan with monthly contributions

### Calculations
- Expected returns based on 12% annual rate
- Automatic calculation of maturity value
- Real-time updates as you input values

### Portfolio Management
- Track all investments
- View total invested amount
- Monitor expected returns
- See investment history

## UI Theme

- Professional fintech design
- Blue/Teal gradient for users
- Blue gradient for admin
- Smooth animations and transitions
- Card-based layouts
- Responsive across all devices
- Soft shadows and hover effects

## Notes

- This is a frontend-only application with dummy data
- No backend or database required
- All data is stored in component state and localStorage
- Authentication is simulated (no real validation)
- Charts use sample data for demonstration

## Default Credentials

Register with any email/password and select your role:
- **User**: Access user dashboard and investment features
- **Admin**: Access admin panel and management features

## License

MIT
