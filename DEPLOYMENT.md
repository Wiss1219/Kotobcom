# Deployment Guide

This guide provides instructions for deploying the Msaken Bookstore Hub website securely.

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- A Supabase account and project
- A hosting service (Vercel, Netlify, etc.)

## Environment Setup

1. Create a `.env` file in the root directory of the project based on the `.env.example` template.
2. Fill in the environment variables with your actual values:

```
# Supabase Configuration
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key

# Admin Authentication
VITE_ADMIN_USERNAME=your_admin_username
VITE_ADMIN_PASSWORD=your_admin_password

# API Configuration
VITE_API_BASE_URL=your_api_base_url

# Other Configuration
VITE_APP_ENV=production
```

> **IMPORTANT**: Never commit your `.env` file to version control. It contains sensitive information.

## Building for Production

1. Install dependencies:
   ```
   npm install
   ```
   or
   ```
   yarn
   ```

2. Build the project:
   ```
   npm run build
   ```
   or
   ```
   yarn build
   ```

3. The build output will be in the `dist` directory.

## Deployment Options

### Option 1: Vercel

1. Install the Vercel CLI:
   ```
   npm install -g vercel
   ```

2. Log in to Vercel:
   ```
   vercel login
   ```

3. Deploy the project:
   ```
   vercel
   ```

4. Set up environment variables in the Vercel dashboard.

### Option 2: Netlify

1. Install the Netlify CLI:
   ```
   npm install -g netlify-cli
   ```

2. Log in to Netlify:
   ```
   netlify login
   ```

3. Deploy the project:
   ```
   netlify deploy
   ```

4. Set up environment variables in the Netlify dashboard.

### Option 3: GitHub Pages

1. Update the `vite.config.ts` file to include the base path:
   ```typescript
   export default defineConfig({
     base: '/your-repo-name/',
     // other config
   });
   ```

2. Build the project:
   ```
   npm run build
   ```

3. Deploy to GitHub Pages:
   ```
   npm run deploy
   ```

## Security Considerations

1. **Environment Variables**: Always use environment variables for sensitive information.
2. **Admin Credentials**: Change the default admin username and password.
3. **HTTPS**: Ensure your hosting service provides HTTPS.
4. **Content Security Policy**: Consider implementing a Content Security Policy.
5. **Regular Updates**: Keep dependencies updated to patch security vulnerabilities.

## Supabase Security

1. **Row Level Security (RLS)**: Ensure proper RLS policies are in place for your Supabase tables.
2. **API Keys**: Rotate your Supabase API keys periodically.
3. **Authentication**: Consider implementing more robust authentication methods for production.

## Monitoring and Maintenance

1. **Error Tracking**: Set up error tracking with a service like Sentry.
2. **Analytics**: Implement analytics to monitor user behavior.
3. **Backups**: Regularly backup your Supabase database.

## Troubleshooting

If you encounter issues during deployment:

1. Check that all environment variables are correctly set.
2. Verify that the build process completes successfully.
3. Check the logs of your hosting service for any errors.
4. Ensure your Supabase project is properly configured.

## Contact

For assistance with deployment, please contact the development team.
