
---

# Internet Banking Application (ATM Project)

## Overview

The Internet Banking Application is a full-stack web application designed to provide secure and efficient online banking services. It enables users to manage accounts, perform financial transactions, and access role-based functionalities through a modern web interface.

The backend is built using Spring Boot with robust security powered by JWT authentication, while the frontend is developed using React for a responsive and user-friendly experience. The system uses MySQL as the database for persistent storage.

---

## Key Features

### Authentication and Security

* JWT-based authentication mechanism
* Role-based authorization (USER, ADMIN)
* Secure password encryption using BCrypt
* Stateless session management with Spring Security

### User Management

* Create, update, and delete user accounts
* Role assignment and access control
* Profile management
* Password update functionality

### Transaction Management

* Deposit and withdrawal operations
* Transaction history tracking
* Account balance inquiry
* Filtering transactions by type (CREDIT/DEBIT)

### Administrative Capabilities

* Manage users and roles
* Assign and revoke roles
* Access system-wide data for monitoring

---

## Technology Stack

### Backend

* Java 21
* Spring Boot 3.5.7
* Spring Security
* Spring Data JPA (Hibernate)
* MySQL 8
* Maven

### Frontend

* React 18
* React Router DOM
* Axios
* Bootstrap 5
* React Toastify

---

## Project Structure

### Backend Structure

```
src/main/java/com/prabhas
├── config          # Application and security configuration
├── controller      # REST controllers
├── dto             # Data Transfer Objects
├── exception       # Exception handling
├── models/entity   # JPA entities
├── repositories    # Data access layer
├── service         # Business logic layer
└── util            # Utility classes (JWT, filters)
```

### Frontend Structure

```
src/
├── api             # API communication layer
├── components      # Reusable UI components
├── context         # Authentication context
├── pages           # Application pages
└── resources       # Styling and assets
```

---

## System Architecture

* RESTful API architecture
* Client-server model
* Stateless authentication using JWT tokens
* Layered backend design (Controller → Service → Repository)
* Frontend communicates via HTTP APIs

---

## Setup Instructions

### Prerequisites

* Java 21
* Node.js (v14 or higher)
* MySQL 8
* Maven

---

### Backend Setup

1. Clone the repository

```
git clone https://github.com/your-username/atm-project.git
cd atm-project
```

2. Configure application properties

```
spring.datasource.url=jdbc:mysql://localhost:3306/atmdb
spring.datasource.username=root
spring.datasource.password=your_password

jwt.secret=your_secret_key
jwt.expiration=900000
```

3. Build and run the application

```
mvn clean install
mvn spring-boot:run
```

Backend will run at:

```
http://localhost:5000
```

---

### Frontend Setup

1. Navigate to frontend directory

```
cd frontend
```

2. Install dependencies

```
npm install
```

3. Start development server

```
npm start
```

Frontend will run at:

```
http://localhost:3000
```

---

## API Endpoints

### Authentication

* POST `/api/auth/login`
* POST `/api/auth/logout`

### Users

* GET `/api/users/all`
* GET `/api/users/{username}`
* POST `/api/users/create`
* PUT `/api/users/{username}`
* DELETE `/api/users/{username}`

### Transactions

* POST `/api/transactions/create`
* GET `/api/transactions/user/{userId}`
* GET `/api/transactions/{transactionId}`
* GET `/api/transactions/balance/{userId}`

### Roles

* GET `/api/roles/all`
* POST `/api/roles/create`
* PUT `/api/roles/{roleId}`
* DELETE `/api/roles/{roleName}`
* POST `/api/roles/user/{username}/add-role`

---

## Database Schema

### USER_TABLE

* id
* username
* password
* first_name
* last_name
* email
* phone
* balance
* created_at
* updated_at
* enabled

### ROLE_TABLE

* id
* role_name
* description

### TRANSACTIONS_TABLE

* id
* purpose
* amount
* type
* created_at
* user_id

---

## Security Implementation

* JWT-based authentication with configurable secret key
* Token expiration configured to 15 minutes
* Role-based authorization using Spring Security annotations
* Secure endpoints using authentication filters
* Password hashing using BCrypt

---

## Testing

### Backend

```
mvn test
```

### Frontend

```
npm test
```

---

## Error Handling

* Centralized exception handling using global exception handler
* Consistent API error responses
* Validation and error messaging for client interactions

---

## Future Enhancements

* Refresh token implementation
* Email and SMS notifications
* Transaction limits and validations
* Audit logging for financial operations
* Fraud detection mechanisms
* Multi-currency support
* Integration with external banking systems
* Payment gateway integration
* Account statement generation

---

## Author

Sri Venkata Prabhas Guda
---