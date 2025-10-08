# Quick Setup Guide for Phoenix Bikes

## Step-by-Step Deployment

### 1️⃣ Create Supabase Project (5 minutes)

1. Go to [supabase.com](https://supabase.com) and sign up
2. Click "New Project"
3. Fill in:
   - Name: `Phoenix Bikes`
   - Database Password: (create a strong password)
   - Region: (choose closest to you)
4. Wait for project to be created (2-3 minutes)

### 2️⃣ Set Up Database (5 minutes)

1. In Supabase dashboard, click "SQL Editor"
2. Click "New Query"
3. Copy and paste this SQL:

```sql
-- Create tables
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

-- Enable RLS
ALTER TABLE donations ENABLE ROW LEVEL SECURITY;
ALTER TABLE bikes ENABLE ROW LEVEL SECURITY;
ALTER TABLE work_orders ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Enable read access for all users" ON bikes
  FOR SELECT USING (true);

CREATE POLICY "Enable insert for authenticated users only" ON donations
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Enable read access for authenticated users" ON donations
  FOR SELECT USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all access for authenticated users" ON work_orders
  FOR ALL USING (auth.role() = 'authenticated');
```

4. Click "Run" or press Ctrl+Enter

### 3️⃣ Get API Keys (2 minutes)

1. In Supabase dashboard, go to Settings (gear icon) > API
2. Find and copy:
   - **Project URL** (looks like: `https://xxxxx.supabase.co`)
   - **anon public key** (long string starting with `eyJ...`)
3. Keep these handy for the next step!

### 4️⃣ Deploy to Netlify (5 minutes)

**Option A: Deploy from Git (Recommended)**

1. Push your code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/phoenix-bikes.git
   git push -u origin main
   ```

2. Go to [app.netlify.com](https://app.netlify.com)
3. Click "Add new site" > "Import an existing project"
4. Choose "GitHub" and select your repository
5. Settings should be:
   - Build command: (leave empty)
   - Publish directory: `.`
6. Click "Deploy site"

**Option B: Drag and Drop**

1. Go to [app.netlify.com](https://app.netlify.com)
2. Drag your project folder onto the Netlify dashboard
3. Wait for deployment to complete

### 5️⃣ Configure Environment Variables (2 minutes)

1. In Netlify dashboard, go to Site settings > Environment variables
2. Click "Add a variable"
3. Add these two variables:
   
   **Variable 1:**
   - Key: `SUPABASE_URL`
   - Value: (paste your Project URL from step 3)
   
   **Variable 2:**
   - Key: `SUPABASE_ANON_KEY`
   - Value: (paste your anon public key from step 3)

4. Click "Save"
5. Go to Deploys > Trigger deploy > Deploy site

### 6️⃣ Create Admin User (2 minutes)

1. In Supabase dashboard, go to Authentication > Users
2. Click "Add user" > "Create new user"
3. Enter:
   - Email: your email
   - Password: create a strong password
   - Auto Confirm User: ✅ (check this box)
4. Click "Create user"

### 7️⃣ Test Your Site! 🎉

1. Go to your Netlify site URL (e.g., `https://your-site.netlify.app`)
2. Click the "Login" button
3. Enter the email and password you just created
4. You should see "Login successful!"

## Local Development Setup

### Method 1: Using localStorage (Quick)

1. Open your site in a browser
2. Open browser console (F12)
3. Run these commands (with your actual values):

```javascript
localStorage.setItem('supabase_url', 'https://xxxxx.supabase.co');
localStorage.setItem('supabase_anon_key', 'eyJxxx...');
```

4. Refresh the page

### Method 2: Using env-config.js (Development)

1. Open `env-config.js`
2. Uncomment and fill in these lines:

```javascript
window.__SUPABASE_URL__ = 'https://xxxxx.supabase.co';
window.__SUPABASE_ANON_KEY__ = 'eyJxxx...';
```

3. Start a local server:
```bash
npx http-server -p 8000
```

4. Open `http://localhost:8000`

## Troubleshooting

### "Supabase client not initialized"
- Check that environment variables are set in Netlify
- Redeploy site after adding environment variables
- Check browser console for specific errors

### Login not working
- Verify user exists in Supabase Authentication
- Make sure "Auto Confirm User" was checked
- Check that password meets minimum requirements

### Database errors
- Run the SQL script again from step 2
- Check RLS policies in Supabase > Authentication > Policies
- Verify tables exist in Database > Tables

### Site not updating after changes
- In Netlify: Deploys > Trigger deploy > Clear cache and deploy site
- Clear your browser cache
- Try in an incognito/private window

## Next Steps

- Customize the site design in `styles.css`
- Add more pages (bikes inventory, work orders, etc.)
- Set up email authentication
- Add more database tables as needed
- Configure custom domain

## Support Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Netlify Documentation](https://docs.netlify.com)
- Check browser console (F12) for error messages
- Check Netlify function logs in dashboard

## Security Notes

- Never commit API keys to Git (they're in .gitignore)
- Only the anon/public key should be public
- Service role key should NEVER be exposed
- RLS policies protect your data
- Always use HTTPS (automatic on Netlify)
