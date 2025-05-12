# Msaken Bookstore Hub

A modern e-commerce platform for Islamic books and Quran editions.

## Features

- Browse books by categories
- View Quran editions
- Shopping cart functionality
- Admin dashboard for managing products
- Responsive design for all devices
- Multi-language support (English, French, Arabic)
- Dark/Light mode

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Supabase account

### Installation

1. Clone the repository:
   ```
   git clone https://github.com/yourusername/msaken-bookstore-hub.git
   cd msaken-bookstore-hub
   ```

2. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn
   ```

3. Create a `.env` file in the root directory based on `.env.example`:
   ```
   cp .env.example .env
   ```

4. Update the `.env` file with your Supabase credentials and admin login details.

5. Start the development server:
   ```
   npm run dev
   ```
   or
   ```
   yarn dev
   ```

6. Open [http://localhost:8080](http://localhost:8080) in your browser.

## Environment Variables

The following environment variables are required:

- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key
- `VITE_ADMIN_USERNAME`: Admin username for the dashboard
- `VITE_ADMIN_PASSWORD`: Admin password for the dashboard

## Deployment

For detailed deployment instructions, see [DEPLOYMENT.md](DEPLOYMENT.md).

### Quick Deployment Steps

1. Build the project:
   ```
   npm run build
   ```
   or
   ```
   yarn build
   ```

2. Deploy the `dist` directory to your hosting provider.

## Security

This project implements several security measures:

1. Environment variables for sensitive information
2. Secure admin authentication
3. Input validation
4. Supabase Row Level Security (RLS)

## Admin Access

To access the admin dashboard:

1. Navigate to `/admin` in your browser
2. Log in with the credentials set in your `.env` file
3. Manage books, Quran editions, and orders

## Technologies Used

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
- Supabase
