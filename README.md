# RepairLink - Service Booking Platform
RepairLink is a platform that allows customers to book services from vendors and leave reviews for completed services. Vendors can register and offer their services, and customers can manage their bookings, view their service history, and leave feedback.

## Table of Contents
- [Technologies Used](#technologies-used)
- [Features](#features)
- [API Endpoints](#api-endpoints)
- [Database Schema](#database-schema)
- [Installation](#installation)
- [Contributing](#contributing)
- [License](#license)

## Technologies Used
- **Backend**: Java, Spring Boot
- **Database**: MySQL
- **Cache**: Redis
- **Authentication**: JWT (JSON Web Token)
- **Frontend**: React, Tailwind CSS
- **Hosting/Deployment**: Render/Railway (Backend), Vercel/Netlify (Frontend)

## Features
- **Authentication & Authorization**:  
  - Users can register, log in, and manage their profiles.
  - Admins, customers, and vendors have different roles with respective access controls.
  
- **Vendor Registration**:  
  - Vendors can sign up, provide additional business info, and offer services on the platform.

- **Service Listings**:  
  - Vendors can list their services, set pricing, duration, and description.

- **Booking Services**:  
  - Customers can search for services, book them, and track the status of their bookings.

- **Reviews**:  
  - Customers can leave reviews for completed services.

- **Service History**:  
  - Customers can view their past services in their service history.

## API Endpoints
### Authentication
- **POST /api/auth/register**: Register a new user (CUSTOMER/VENDOR).
- **POST /api/auth/login**: Log in a user.
- **POST /api/auth/verify**: Email verification.
- **POST /api/auth/forgot-password**: Password reset request.
  
### Users & Roles
- **GET /api/users/{id}**: Get user details.
- **PUT /api/users/{id}**: Update user profile.
  
### Service Providers
- **POST /api/service-providers**: Vendor registration (business info).
- **GET /api/service-providers/{id}**: Get service provider details.

### Services
- **GET /api/services**: Get list of services.
- **POST /api/services**: Vendor adds a service.
  
### Bookings
- **POST /api/bookings**: Customer makes a booking.
- **GET /api/bookings/{id}**: Get booking details.
- **PUT /api/bookings/{id}**: Update booking status.

### Reviews
- **POST /api/reviews**: Customer submits a review for a service.
- **GET /api/reviews/{id}**: Get reviews for a service.

### Service History
- **GET /api/service-history/{customerId}**: Get service history for a customer.

## Database Schema
The database schema includes tables for users, roles, service providers, services, bookings, reviews, and service history. You can find the SQL schema in the `docs/` directory.

## Installation
### Prerequisites
1. **JDK 11+**: Install Java Development Kit (JDK) version 11 or later.
2. **MySQL**: Install MySQL 5.7+ for the database.
3. **Redis**: For caching and token management.
4. **Node.js & NPM**: Install Node.js and npm for the frontend.
  
### Backend Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/repairlink.git
   cd repairlink
   ```

2. Create a `.env` file with the following variables:
   ```bash
   SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/repairlink_db
   SPRING_DATASOURCE_USERNAME=root
   SPRING_DATASOURCE_PASSWORD=password
   SPRING_REDIS_HOST=localhost
   JWT_SECRET_KEY=your_jwt_secret_key
   ```

3. Run the Spring Boot application:
   ```bash
   ./mvnw spring-boot:run
   ```

4. The backend will be available at `http://localhost:8080`.

### Frontend Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/repairlink-frontend.git
   cd repairlink-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the frontend:
   ```bash
   npm run dev
   ```

4. The frontend will be available at `http://localhost:3000`.

## Contributing
1. Fork the repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Make your changes.
4. Commit your changes (`git commit -am 'Add feature'`).
5. Push to the branch (`git push origin feature-name`).
6. Create a pull request.

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

