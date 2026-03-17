# Internet Banking Application Documentation

## Overview

The Internet Banking Application is a Spring Boot-based web application that provides a comprehensive online banking platform. It offers user account management, role-based authentication, and secure transaction processing capabilities. The application uses JWT (JSON Web Tokens) for secure authentication and MySQL as the database backend.

## Technologies Used

- **Framework**: Spring Boot 3.5.7
- **Java Version**: 21
- **Database**: MySQL 8
- **ORM**: JPA/Hibernate
- **Security**: Spring Security with JWT
- **API Documentation**: OpenAPI/Swagger
- **Build Tool**: Maven
- **Password Encoding**: BCrypt

## Project Structure

```
src/
├── main/
│   ├── java/com/prabhas/
│   │   ├── AtmProjectApplication.java          # Main application class for Internet Banking
│   │   ├── config/
│   │   │   ├── DataInitializer.java            # Database initialization for banking data
│   │   │   ├── OpenApiConfig.java              # Swagger configuration for API documentation
│   │   │   └── SecurityConfig.java             # Security configuration for banking operations
│   │   ├── controller/
│   │   │   ├── AuthController.java             # Authentication endpoints for user login
│   │   │   ├── RoleController.java             # Role management endpoints for banking staff
│   │   │   ├── TransactionsController.java     # Transaction endpoints for banking operations
│   │   │   └── UserController.java             # User account management endpoints
│   │   ├── dto/
│   │   │   ├── AuthRequest.java                # Login request DTO for authentication
│   │   │   ├── JwtResponse.java                # JWT response DTO for secure tokens
│   │   │   ├── TransactionRequest.java         # Transaction request DTO for banking operations
│   │   │   ├── UserCreateRequest.java          # User account creation DTO
│   │   │   └── UserUpdateRequest.java          # User account update DTO
│   │   ├── exception/
│   │   │   ├── GlobalExceptionHandler.java     # Global exception handling for banking errors
│   │   │   └── ResourceNotFoundException.java  # Custom exception for missing banking resources
│   │   ├── models/entity/
│   │   │   ├── Role.java                       # Role entity for user permissions
│   │   │   ├── Transactions.java               # Transaction entity for banking operations
│   │   │   └── User.java                       # User entity for account holders
│   │   ├── repositories/
│   │   │   ├── RoleRepository.java             # Role data access for permissions
│   │   │   ├── TransactionsRepository.java     # Transaction data access for banking history
│   │   │   └── UserRepository.java             # User data access for account management
│   │   ├── service/
│   │   │   ├── CustomUserDetailsService.java   # User details service for authentication
│   │   │   ├── RoleService.java                # Role business logic for permissions
│   │   │   ├── TransactionsService.java        # Transaction business logic for banking operations
│   │   │   └── UserService.java                # User business logic for account management
│   │   └── util/
│   │       ├── JwtAuthenticationEntryPoint.java # JWT entry point for unauthorized access
│   │       ├── JwtAuthenticationFilter.java     # JWT filter for request validation
│   │       └── JwtUtils.java                    # JWT utilities for token management
│   └── resources/
│       ├── application.properties               # Application configuration for banking system
│       └── static/                              # Static resources for banking interface
└── test/
    └── java/com/prabhas/
        └── AtmProjectApplicationTests.java      # Basic integration tests for banking application
```

## Configuration

### Application Properties

The application is configured via `src/main/resources/application.properties`:

```properties
spring.application.name=ATM-Application
server.port=5000

# MySQL Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/atmdb
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver
spring.datasource.username=root
spring.datasource.password=tiger

# JPA Configuration
spring.jpa.database-platform=org.hibernate.dialect.MySQL8Dialect
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.format_sql=true

# JWT Configuration
jwt.secret=**********
jwt.expiration=900000

# Logging
logging.level.root=INFO
logging.level.com.prabhas=DEBUG
```

### Database Schema

The application uses three main tables:

1. **USER_TABLE**
   - id (Primary Key)
   - USER_NAME (Unique username for login)
   - password (Encrypted password)
   - FIRST_NAME (Account holder's first name)
   - LAST_NAME (Account holder's last name)
   - EMAIL (Unique email for notifications)
   - PHONE (Contact phone number)
   - BALANCE (Current account balance)
   - CREATED_AT (Account creation timestamp)
   - UPDATED_AT (Last profile update)
   - ENABLED (Account status)

2. **ROLE_TABLE** (User Permissions)
   - id (Primary Key)
   - ROLE_NAME (Unique role identifier: USER/ADMIN)
   - DESCRIPTION (Role description and permissions)

3. **TRANSACTIONS_TABLE** (Banking Transactions)
   - id (Primary Key)
   - PURPOSE (Transaction description/purpose)
   - AMOUNT (Transaction amount)
   - TYPE (CREDIT/DEBIT transaction type)
   - CREATED_AT (Transaction timestamp)
   - user_id (Foreign Key to account holder)

## API Endpoints

### Authentication Controller (`/api/auth`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/login` | User login with JWT token generation | Public |
| POST | `/logout` | User logout | Authenticated |

### User Controller (`/api/users`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/all` | Get all users | ADMIN |
| GET | `/{username}` | Get user by username | ADMIN or self |
| POST | `/create` | Create new user | ADMIN |
| PUT | `/{username}` | Update user | ADMIN or self |
| DELETE | `/{username}` | Delete user | ADMIN |
| PUT | `/{username}/change-password` | Change password | ADMIN or self |

### Transactions Controller (`/api/transactions`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| POST | `/create` | Process banking transaction | USER/ADMIN |
| GET | `/user/{userId}` | View account transaction history | USER/ADMIN |
| GET | `/{transactionId}` | Get transaction details | USER/ADMIN |
| GET | `/user/{userId}/type/{type}` | Filter transactions by type | USER/ADMIN |
| GET | `/balance/{userId}` | Check account balance | USER/ADMIN |
| POST | `/verify-withdrawal` | Verify withdrawal availability | USER/ADMIN |

### Role Controller (`/api/roles`)

| Method | Endpoint | Description | Access |
|--------|----------|-------------|---------|
| GET | `/profile` | Access account profile | USER/ADMIN |
| GET | `/user/data` | View personal account data | USER |
| GET | `/admin/data` | Access administrative banking data | ADMIN |
| GET | `/all` | Get all user roles | ADMIN |
| POST | `/create` | Create new user role | ADMIN |
| PUT | `/{roleId}` | Update role permissions | ADMIN |
| DELETE | `/{roleName}` | Delete user role | ADMIN |
| POST | `/user/{username}/add-role` | Assign role to account holder | ADMIN |
| DELETE | `/user/{username}/remove-role` | Remove role from account holder | ADMIN |
| GET | `/{roleName}/users` | Get account holders by role | ADMIN |

## Security

The application implements JWT-based authentication with role-based authorization:

- **JWT Secret**: Configured in application.properties
- **Token Expiration**: 15 minutes (900000 ms)
- **Roles**: USER, ADMIN
- **Password Encoding**: BCrypt

### Security Configuration

- Stateless session management
- CORS enabled
- JWT authentication filter
- Method-level security with @PreAuthorize annotations

## Data Models

### User Entity (Account Holder)
```java
- Long id (Unique account identifier)
- String username (Login username)
- String password (BCrypt encoded password)
- String firstName (Account holder's first name)
- String lastName (Account holder's last name)
- String email (Email for notifications and recovery)
- String phone (Contact phone number)
- Double balance (Current account balance)
- LocalDateTime createdAt (Account creation date)
- LocalDateTime updatedAt (Last profile modification)
- Set<Role> roles (User permissions and access levels)
- boolean enabled (Account active status)
```

### Role Entity (User Permissions)
```java
- Long id (Role identifier)
- String roleName (Role name: USER, ADMIN)
- String description (Role description and capabilities)
```

### Transactions Entity (Banking Operations)
```java
- Long id (Transaction identifier)
- String purpose (Transaction description/memo)
- Double amount (Transaction amount)
- String type (CREDIT for deposits, DEBIT for withdrawals)
- LocalDateTime createdAt (Transaction timestamp)
- User user (Associated account holder)
```

## Setup Instructions

1. **Prerequisites**:
   - Java 21
   - MySQL 8
   - Maven

2. **Database Setup**:
   - Create database: `atmdb`
   - Update connection details in `application.properties`

3. **Build and Run**:
   ```bash
   mvn clean install
   mvn spring-boot:run
   ```

4. **Access Application**:
   - API: http://localhost:5000
   - Swagger UI: http://localhost:5000/swagger-ui.html

## Testing

Basic context loading test is available in `AtmProjectApplicationTests.java`.

## Dependencies

Key dependencies from pom.xml:
- Spring Boot Starter Web
- Spring Boot Starter Data JPA
- Spring Boot Starter Security
- Spring Boot Starter Actuator
- MySQL Connector/J
- JWT libraries
- Swagger/OpenAPI

## Error Handling

Global exception handling is implemented in `GlobalExceptionHandler.java` for consistent error responses.

## Future Enhancements

- Add more comprehensive test coverage for banking operations
- Implement refresh token functionality for better security
- Add transaction limits and validation for regulatory compliance
- Implement audit logging for financial transactions
- Add email/SMS notifications for account activities
- Integrate with payment gateways for fund transfers
- Add multi-currency support
- Implement account statements generation
- Add fraud detection mechanisms
- Integrate with external banking systems</content>
