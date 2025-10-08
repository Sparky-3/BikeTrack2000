# Phoenix Bikes - Bike Donation Platform

A website for Phoenix Bikes to manage bike donations, built with Supabase and deployed on Netlify.

## Features

- 🚴 Display bike donation acceptance criteria
- 🔐 User authentication (login/logout)
- 📊 Database integration with Supabase
- 🌐 Ready for Netlify deployment
- 📱 Responsive design

## Setup Instructions

### 1. Supabase Setup

1. **Create a Supabase Account**
   - Go to [https://supabase.com](https://supabase.com)
   - Sign up for a free account
   - Create a new project

2. **Get Your API Credentials**
   - Go to your project settings
   - Navigate to Settings > API
   - Copy your Project URL and anon/public key

3. **Create Database Tables**
   
   Run these SQL commands in the Supabase SQL Editor:

   ```sql
   -- Create donations table
   CREATE TABLE donations (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     donor_name VARCHAR(255),
     donor_email VARCHAR(255),
     donor_phone VARCHAR(50),
     item_type VARCHAR(100),
     item_description TEXT,
     condition VARCHAR(50),
     donation_date TIMESTAMP DEFAULT NOW(),
     created_at TIMESTAMP DEFAULT NOW()
   );

   -- Create bikes table
   CREATE TABLE bikes (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     type VARCHAR(100),
     brand VARCHAR(100),
     model VARCHAR(100),
     size VARCHAR(50),
     color VARCHAR(50),
     condition VARCHAR(50),
     status VARCHAR(50) DEFAULT 'available',
     price DECIMAL(10, 2),
     description TEXT,
     created_at TIMESTAMP DEFAULT NOW(),
     updated_at TIMESTAMP DEFAULT NOW()
   );

   -- Create work_orders table
   CREATE TABLE work_orders (
     id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
     bike_id UUID REFERENCES bikes(id),
     mechanic_id UUID,
     description TEXT,
     status VARCHAR(50) DEFAULT 'pending',
     priority VARCHAR(50),
     created_at TIMESTAMP DEFAULT NOW(),
     completed_at TIMESTAMP
   );

   -- Enable Row Level Security (RLS)
   ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
   ALTER TABLE bikes ENABLE ROW LEVEL SECURITY;
   ALTER TABLE work_orders ENABLE ROW LEVEL SECURITY;

   -- Create policies for public read access (adjust as needed)
   CREATE POLICY "Enable read access for all users" ON bikes
     FOR SELECT USING (true);

   CREATE POLICY "Enable insert for authenticated users only" ON donations
     FOR INSERT WITH CHECK (auth.role() = 'authenticated');

   CREATE POLICY "Enable read access for authenticated users" ON donations
     FOR SELECT USING (auth.role() = 'authenticated');

   CREATE POLICY "Enable all access for authenticated users" ON work_orders
     FOR ALL USING (auth.role() = 'authenticated');
   ```

4. **Set Up Authentication**
   - In Supabase dashboard, go to Authentication > Settings
   - Configure your authentication providers (Email, Google, etc.)
   - For testing, you can create users manually in Authentication > Users

### 2. Local Development

1. **Add Your Supabase Keys**
   
   Open `local-config.js` and paste your Supabase credentials:

   ```javascript
   window.__SUPABASE_URL__ = 'https://your-project-id.supabase.co';
   window.__SUPABASE_ANON_KEY__ = 'your-anon-key-here';
   ```

   This file is gitignored so your keys stay private!

2. **Test Locally**
   
   You can use any local server, for example:
   
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js (with http-server)
   npx http-server -p 8000
   ```

   Then open `http://localhost:8000` in your browser.

### 3. Netlify Deployment

1. **Connect to Netlify**
   - Push your code to GitHub, GitLab, or Bitbucket
   - Go to [https://app.netlify.com](https://app.netlify.com)
   - Click "Add new site" > "Import an existing project"
   - Connect your Git repository

2. **Configure Build Settings**
   - Build command: (leave empty for static site)
   - Publish directory: `.` (current directory)
   - The `netlify.toml` file will handle the rest

3. **Set Environment Variables**
   - In Netlify dashboard, go to Site settings > Environment variables
   - Add the following variables:
     - `SUPABASE_URL`: Your Supabase project URL
     - `SUPABASE_ANON_KEY`: Your Supabase anon key

4. **Deploy**
   - Click "Deploy site"
   - Netlify will build and deploy your site
   - You'll get a URL like `https://your-site-name.netlify.app`

### 4. Using Custom Domain (Optional)

1. In Netlify dashboard, go to Site settings > Domain management
2. Click "Add custom domain"
3. Follow the instructions to configure your DNS

## Project Structure

```
BikeTrack2001/
├── index.html          # Main HTML file
├── styles.css          # Styling
├── config.js          # Supabase configuration
├── auth.js            # Authentication logic
├── script.js          # Main JavaScript functionality
├── netlify.toml       # Netlify configuration
├── _headers           # Security headers
├── .gitignore         # Git ignore rules
└── README.md          # This file
```

## Database Schema

### Donations Table
- `id`: UUID (Primary Key)
- `donor_name`: String
- `donor_email`: String
- `donor_phone`: String
- `item_type`: String
- `item_description`: Text
- `condition`: String
- `donation_date`: Timestamp
- `created_at`: Timestamp

### Bikes Table
- `id`: UUID (Primary Key)
- `type`: String (e.g., "Mountain", "Road", "Hybrid")
- `brand`: String
- `model`: String
- `size`: String
- `color`: String
- `condition`: String
- `status`: String (available, in-repair, ready-for-sale, sold)
- `price`: Decimal
- `description`: Text
- `created_at`: Timestamp
- `updated_at`: Timestamp

### Work Orders Table
- `id`: UUID (Primary Key)
- `bike_id`: UUID (Foreign Key to bikes)
- `mechanic_id`: UUID
- `description`: Text
- `status`: String (pending, in-progress, completed, cancelled)
- `priority`: String
- `created_at`: Timestamp
- `completed_at`: Timestamp

## Authentication

The site includes basic authentication functionality:

- Login modal for users
- Session management via Supabase Auth
- Protected routes (can be expanded)

To create admin users:
1. Go to your Supabase dashboard
2. Navigate to Authentication > Users
3. Click "Add user" to create accounts manually

## API Functions Available

The following JavaScript functions are available globally:

### From `auth.js`:
- `checkAuth()` - Check if user is logged in
- `login(email, password)` - Login user
- `logout()` - Logout current user
- `signUp(email, password)` - Register new user
- `updateAuthUI()` - Update UI based on auth state

### From `script.js`:
- `createDonation(donationData)` - Create a donation record
- `getDonations()` - Get all donations
- `getBikes(filters)` - Get bikes with optional filters
- `createWorkOrder(workOrderData)` - Create a work order
- `formatDate(dateString)` - Format date for display

## Security

- Row Level Security (RLS) is enabled on all tables
- Environment variables keep sensitive data secure
- Security headers configured via `_headers` file
- HTTPS enforced on Netlify

## Troubleshooting

### "Supabase is not configured" Error
- Make sure your environment variables are set in Netlify
- Check that the variable names match exactly
- Redeploy your site after adding environment variables

### Authentication Not Working
- Verify your Supabase project URL and anon key
- Check that authentication is enabled in Supabase dashboard
- Ensure users are created in Supabase Authentication

### Database Queries Failing
- Verify your RLS policies in Supabase
- Check browser console for specific error messages
- Ensure tables are created with correct schema

## Support

For issues or questions:
- Check the browser console for error messages
- Review Supabase logs in your project dashboard
- Check Netlify deploy logs for deployment issues

## License

© 2025 Phoenix Bikes. All rights reserved.
