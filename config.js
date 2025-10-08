// Supabase Configuration
// Get these values from your Supabase project settings

// For Netlify, environment variables need to be injected during build
// You can also hardcode them here for local development (NOT RECOMMENDED for production)
// Better approach: Create a netlify function or use build-time injection

// Check for environment variables from different sources
const supabaseUrl = 
    window.__SUPABASE_URL__ ||  // Injected at build time
    localStorage.getItem('supabase_url') ||  // Local development fallback
    '';

const supabaseAnonKey = 
    window.__SUPABASE_ANON_KEY__ ||  // Injected at build time
    localStorage.getItem('supabase_anon_key') ||  // Local development fallback
    '';

// Initialize Supabase client
let supabase = null;

if (supabaseUrl && supabaseAnonKey) {
    try {
        supabase = window.supabase.createClient(supabaseUrl, supabaseAnonKey);
        console.log('✅ Supabase client initialized successfully');
    } catch (error) {
        console.error('❌ Error initializing Supabase client:', error);
    }
} else {
    // Only show warnings if we're not on Netlify (where env-config.js will load them)
    const isNetlify = window.location.hostname !== 'localhost' && 
                     window.location.hostname !== '127.0.0.1' && 
                     window.location.hostname.includes('netlify');
    
    if (!isNetlify) {
        console.warn('⚠️ Supabase URL or Anon Key is missing.');
        console.warn('For local development, you can set them in localStorage:');
        console.warn('localStorage.setItem("supabase_url", "your-url")');
        console.warn('localStorage.setItem("supabase_anon_key", "your-key")');
        console.warn('For production, configure environment variables in Netlify.');
    } else {
        console.log('⏳ Waiting for configuration from Netlify function...');
    }
}

// Export for use in other files
window.supabaseClient = supabase;
