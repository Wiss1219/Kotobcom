/**
 * Environment Variable Validation Script
 * 
 * This script validates that all required environment variables are present
 * before building or deploying the application.
 */

const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables from .env file
dotenv.config();

// Define required environment variables
const requiredEnvVars = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
  'VITE_ADMIN_USERNAME',
  'VITE_ADMIN_PASSWORD'
];

// Check for missing environment variables
const missingEnvVars = requiredEnvVars.filter(envVar => !process.env[envVar]);

if (missingEnvVars.length > 0) {
  console.error('\x1b[31m%s\x1b[0m', 'Error: Missing required environment variables:');
  missingEnvVars.forEach(envVar => {
    console.error(`  - ${envVar}`);
  });
  console.error('\nPlease add these variables to your .env file before building or deploying.');
  process.exit(1);
} else {
  console.log('\x1b[32m%s\x1b[0m', 'Environment validation successful! All required variables are present.');
}
