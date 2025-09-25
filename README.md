# Canteeno - Smart Canteen Management System

A comprehensive canteen management system built with React, TypeScript, Node.js, Express, and PostgreSQL. Features real-time order management, kitchen dashboard, admin controls, and seamless user experience.

## 🚀 Features

### User Features

- **Browse Menu**: View categorized menu items with descriptions and prices
- **Shopping Cart**: Add items, modify quantities, and manage orders
- **Order Tracking**: Real-time order status updates (Pending → Preparing → Ready → Completed)
- **Order History**: View past orders and their details
- **Responsive Design**: Optimized for desktop and mobile devices

### Kitchen Features

- **Order Queue Management**: View pending, cooking, and ready orders
- **Status Updates**: Update order status with one click
- **Real-time Notifications**: Get notified of new orders
- **Order Details**: Complete item breakdown for each order

### Admin Features

- **Dashboard Analytics**: View sales, orders, and performance metrics
- **Menu Management**: Add, edit, and manage menu items
- **Order Oversight**: Monitor all orders across the system
- **User Management**: Manage user accounts and roles
- **Kitchen Status**: Monitor kitchen operations

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite, TailwindCSS
- **Backend**: Node.js, Express.js, TypeScript
- **Database**: PostgreSQL
- **Authentication**: JWT tokens
- **UI Components**: Radix UI, Lucide React Icons
- **Animations**: Motion/React (Framer Motion)
- **State Management**: React Hooks

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn package manager

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone https://github.com/Bushra-git/Canteeno.git
cd Canteeno
```

### 2. Backend Setup

#### Install Dependencies

```bash
cd backend
npm install
```

#### Database Setup

1. Ensure PostgreSQL is running on your system
2. Create a `.env` file in the backend directory:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=canteen_db
DB_USER=postgres
DB_PASSWORD=your_password_here
JWT_SECRET=your-super-secret-jwt-key
PORT=4000
```

3. Run the database setup script:

```bash
# Windows
setup_db_enhanced.bat

# Or manually:
psql -U postgres -c "CREATE DATABASE canteen_db;"
psql -U postgres -d canteen_db -f schema.sql
```

#### Start Backend Server

```bash
npm run dev
```

The backend server will start on `http://localhost:4000`

### 3. Frontend Setup

#### Install Dependencies

```bash
# From root directory
npm install
```

#### Start Frontend Development Server

```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

## 🔐 Authentication

### Default Accounts

The system comes with pre-configured accounts:

#### Student Account

- **Roll Number**: `23101A0003`
- **Password**: `password`
- **Role**: User

#### Admin Account

- **ID**: `23101A0001` or `admin`
- **Password**: `password`
- **Role**: Admin

#### Kitchen Account

- **ID**: `23101A0002` or `kitchen`
- **Password**: `password`
- **Role**: Kitchen

### Auto-Registration for Students

Students can log in using any valid roll number (format: `23101A0001` to `23101A9999`) without prior registration. The system will automatically create an account.

## 📊 Database Schema

The system uses a normalized PostgreSQL database with the following main tables:

- **users**: User accounts and authentication
- **menu_items**: Available food items
- **orders**: Order records
- **order_items**: Individual items within orders
- **user_logs**: Activity tracking and audit trail

## 🔄 API Endpoints

### Authentication

- `POST /auth/login` - User login
- `POST /auth/signup` - User registration

### Menu Management

- `GET /menu_items` - Get all menu items
- `POST /menu_items` - Add new menu item (admin only)

### Order Management

- `POST /orders` - Create new order
- `GET /orders` - Get user orders / all orders (admin)
- `PUT /orders/:id/status` - Update order status (admin/kitchen)
- `GET /kitchen/orders` - Get active kitchen orders

### User Management

- `GET /users` - Get all users (admin only)

## 🎨 UI/UX Features

- **Modern Design**: Clean, intuitive interface with smooth animations
- **Real-time Updates**: Live order status updates
- **Responsive Layout**: Works seamlessly on desktop and mobile
- **Dark/Light Theme**: Automatic theme detection
- **Toast Notifications**: User-friendly feedback system
- **Loading States**: Clear loading indicators for better UX

## 🛡️ Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access**: Different access levels for users, admins, and kitchen staff
- **Input Validation**: Server-side validation for all inputs
- **SQL Injection Protection**: Parameterized queries
- **CORS Configuration**: Proper cross-origin resource sharing setup

## 📱 Responsive Design

The application is fully responsive and optimized for:

- Desktop computers (1024px+)
- Tablets (768px - 1023px)
- Mobile phones (320px - 767px)

## 🚀 Deployment

### Production Build

```bash
# Frontend
npm run build

# Backend
cd backend
npm run build
```

### Environment Variables for Production

Ensure you set the following environment variables:

- `NODE_ENV=production`
- `JWT_SECRET=strong-random-secret`
- `DB_PASSWORD=secure-password`

## 🧪 Testing

Run the application locally and test the following workflows:

1. **User Flow**: Login → Browse Menu → Add to Cart → Place Order → Track Status
2. **Kitchen Flow**: Login → View Orders → Update Status → Process Queue
3. **Admin Flow**: Login → View Dashboard → Manage Menu → Monitor Orders

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Vidyalankar Institute of Technology** - For the project inspiration
- **Radix UI** - For excellent UI components
- **Lucide Icons** - For beautiful iconography
- **Motion/React** - For smooth animations

## 📞 Support

For support, email support@canteeno.com or create an issue in the GitHub repository.

---

**Built with ❤️ for the VIT community** ## Running the code

Run `npm i` to install the dependencies.

Run `npm run dev` to start the development server.
