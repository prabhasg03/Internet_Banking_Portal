# ATM Project Frontend Documentation

## Overview

The ATM Project Frontend is a React-based web application that provides the user interface for the Internet Banking Application. It offers a responsive and intuitive interface for user account management, authentication, and transaction processing. The application communicates with the Spring Boot backend API for secure banking operations and uses JWT for client-side authentication management.

## Technologies Used

- **Framework**: React 18.2.0
- **Routing**: React Router DOM 6.20.0
- **HTTP Client**: Axios 1.6.0
- **Styling**: Bootstrap 5.3.8
- **Notifications**: React Toastify 11.0.5
- **Testing**: Jest, React Testing Library
- **Build Tool**: Create React App (React Scripts 5.0.1)

## Project Structure

```
src/
├── App.css                              # Main application styles
├── App.js                               # Root component with routing
├── App.test.js                          # Application tests
├── index.css                            # Global styles
├── index.js                             # Application entry point
├── reportWebVitals.js                   # Performance monitoring
├── setupTests.js                        # Test configuration
├── api/
│   └── api.js                           # API service for backend communication
├── components/
│   ├── ProtectedRoute.js                # Route protection component
│   └── Welcome.js                       # Welcome component
├── context/
│   └── AuthContext.js                   # Authentication context provider
├── pages/
│   ├── Landing.js                       # Landing page
│   ├── ManagerDashboard.js              # Manager dashboard
│   ├── ManagerLogin.js                  # Manager login page
│   ├── UserDashboard.js                 # User dashboard
│   └── UserLogin.js                     # User login page
└── resources/
    └── styles/
        ├── landing.css                  # Landing page styles
        ├── manager.css                  # Manager dashboard styles
        ├── managerLogin.css             # Manager login styles
        ├── styles.css                   # Global custom styles
        ├── user-dashboard.css           # User dashboard styles
        └── user-login.css               # User login styles
```

## Configuration

### Package.json Scripts

The application uses the following npm scripts:

```json
{
  "start": "react-scripts start",
  "build": "react-scripts build",
  "test": "react-scripts test",
  "eject": "react-scripts eject"
}
```

### Environment Configuration

The application connects to the backend API. Update the API base URL in `src/api/api.js` if needed:

```javascript
const API_BASE_URL = 'http://localhost:5000/api';
```

## Components and Pages

### Authentication Components

- **AuthContext.js**: Provides authentication state management across the application
- **ProtectedRoute.js**: Guards routes requiring authentication
- **UserLogin.js**: Login page for regular users
- **ManagerLogin.js**: Login page for bank managers

### Dashboard Components

- **UserDashboard.js**: User account overview and transaction interface
- **ManagerDashboard.js**: Administrative interface for bank managers
- **Landing.js**: Public landing page with application information

### Utility Components

- **Welcome.js**: Welcome message component
- **Toast Notifications**: Integrated with React Toastify for user feedback

## API Integration

The frontend communicates with the Spring Boot backend through RESTful APIs defined in `src/api/api.js`. Key integrations include:

- User authentication and authorization
- Account balance and transaction history
- User profile management
- Role-based access control

## Styling

The application uses Bootstrap 5 for responsive design with custom CSS overrides in the `resources/styles/` directory:

- **Bootstrap**: Responsive grid system and components
- **Custom CSS**: Application-specific styling for branding and UX

## Routing

Application routes are configured in `App.js` using React Router:

- `/` - Landing page
- `/user-login` - User login
- `/manager-login` - Manager login
- `/user-dashboard` - User dashboard (protected)
- `/manager-dashboard` - Manager dashboard (protected)

## Security

- **JWT Token Management**: Stored in localStorage for session persistence
- **Protected Routes**: Automatic redirection for unauthorized access
- **Context-based Auth**: Global authentication state management

## Setup Instructions

1. **Prerequisites**:
   - Node.js (v14 or higher)
   - npm or yarn
   - Running backend API (Spring Boot on port 5000)

2. **Installation**:
   ```bash
   npm install
   ```

3. **Development Server**:
   ```bash
   npm start
   ```
   Opens [http://localhost:3000](http://localhost:3000) in the browser

4. **Build for Production**:
   ```bash
   npm run build
   ```

5. **Testing**:
   ```bash
   npm test
   ```

## Testing

The application includes unit tests using Jest and React Testing Library. Run tests with:

```bash
npm test
```

## Dependencies

Key dependencies from package.json:
- React 18.2.0 - UI framework
- React Router DOM 6.20.0 - Client-side routing
- Axios 1.6.0 - HTTP client for API calls
- Bootstrap 5.3.8 - CSS framework
- React Toastify 11.0.5 - Notification system
- Testing Library suite - Testing utilities

## Error Handling

- API error handling with user-friendly toast notifications
- Authentication error redirects to login pages
- Network error handling for offline scenarios

## Future Enhancements

- Add comprehensive test coverage for components
- Implement refresh token functionality
- Add real-time transaction notifications
- Implement dark mode theme
- Add accessibility improvements (ARIA labels, keyboard navigation)
- Integrate with payment gateways for enhanced UX
- Add multi-language support
- Implement progressive web app (PWA) features
- Add transaction history export functionality
- Implement biometric authentication support

### Analyzing the Bundle Size

This section has moved here: [https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size](https://facebook.github.io/create-react-app/docs/analyzing-the-bundle-size)

### Making a Progressive Web App

This section has moved here: [https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app](https://facebook.github.io/create-react-app/docs/making-a-progressive-web-app)

### Advanced Configuration

This section has moved here: [https://facebook.github.io/create-react-app/docs/advanced-configuration](https://facebook.github.io/create-react-app/docs/advanced-configuration)

### Deployment

This section has moved here: [https://facebook.github.io/create-react-app/docs/deployment](https://facebook.github.io/create-react-app/docs/deployment)

### `npm run build` fails to minify

This section has moved here: [https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify](https://facebook.github.io/create-react-app/docs/troubleshooting#npm-run-build-fails-to-minify)
