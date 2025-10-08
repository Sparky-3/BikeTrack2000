// Environment Configuration Injector
// This file helps inject environment variables for Netlify deployment

// OPTION 1: Using .env file for local development
// For local development, you can directly set your credentials here.
// The .env file is gitignored, so your keys stay safe.
// Simply uncomment the lines below and add your actual credentials:

/*
window.__SUPABASE_URL__ = 'https://your-project.supabase.co';
window.__SUPABASE_ANON_KEY__ = 'your-anon-key-here';
*/

// OPTION 2: Using localStorage (alternative for local development)
// Set these in your browser console:
// localStorage.setItem('supabase_url', 'your-url-here')
// localStorage.setItem('supabase_anon_key', 'your-key-here')

// OPTION 3: Load from Netlify Function (recommended for production)
// This fetches config from a serverless function
async function loadConfigFromNetlify() {
    try {
        const response = await fetch('/.netlify/functions/config');
        if (response.ok) {
            const config = await response.json();
            window.__SUPABASE_URL__ = config.supabaseUrl;
            window.__SUPABASE_ANON_KEY__ = config.supabaseAnonKey;
            console.log('✅ Configuration loaded from Netlify function');
            
            // Reinitialize Supabase client with new config
            if (window.supabase && window.__SUPABASE_URL__ && window.__SUPABASE_ANON_KEY__) {
                try {
                    window.supabaseClient = window.supabase.createClient(window.__SUPABASE_URL__, window.__SUPABASE_ANON_KEY__);
                    console.log('✅ Supabase client reinitialized with Netlify config');
                } catch (error) {
                    console.error('❌ Error reinitializing Supabase client:', error);
                }
            }
        }
    } catch (error) {
        console.warn('⚠️ Could not load config from Netlify function:', error.message);
        console.warn('Using fallback configuration method');
    }
}

// Check if we're on Netlify (has /.netlify/ endpoints)
if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    // On Netlify, try to load from function
    loadConfigFromNetlify();
}

console.log('🔧 Environment configuration loaded');
