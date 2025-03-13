
# Skincare Specialist CMS

This is a CMS (Content Management System) for a skincare specialist application. It has both admin and user interfaces where admins can manage all content, and users can view the published content.

## Features

- Admin dashboard for content management
- Blog management
- Service management 
- Specialist management
- Booking management
- User authentication (admin and customer roles)
- API testing panel for development

## Getting Started

### Prerequisites

- Node.js (v16 or newer)
- npm or yarn package manager

### Installation

1. Clone the repository:
   ```
   git clone [your-repository-url]
   cd skincare-cms
   ```

2. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn
   ```

3. Start the development server:
   ```
   npm run dev
   ```
   or
   ```
   yarn dev
   ```

4. Open your browser and navigate to:
   ```
   http://localhost:8080
   ```

## Test Accounts

The application includes test accounts for development:

### Admin Account
- Username: admin
- Password: admin123

### User Account
- Username: user
- Password: user123

You can use these accounts to log in and test different aspects of the application.

## API Testing

The admin dashboard includes an API testing panel where you can test all available API endpoints. This helps verify that backend connections are working correctly.

## Project Structure

- `/src/components` - Reusable UI components
- `/src/pages` - Main application pages
- `/src/services` - API services and data fetching
- `/src/hooks` - Custom React hooks
- `/src/components/ui` - UI component library (Shadcn UI)

## Development Guidelines

- Use TypeScript for type safety
- Follow Tailwind CSS conventions for styling
- Use React Query for data fetching
- Use the Shadcn UI component library when possible

## Backend API

The application expects a backend API at `http://localhost:8080/api`. During development, mock data is used when the backend is not available.
