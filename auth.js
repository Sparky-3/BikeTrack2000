// Authentication Logic for Phoenix Bikes

// Check if user is logged in on page load
async function checkAuth() {
    if (!window.supabaseClient) return null;
    
    try {
        const { data: { user } } = await window.supabaseClient.auth.getUser();
        return user;
    } catch (error) {
        console.error('Error checking auth:', error);
        return null;
    }
}

// Login function
async function login(email, password) {
    if (!window.supabaseClient) {
        alert('Supabase is not configured. Please check your environment variables.');
        return null;
    }
    
    try {
        const { data, error } = await window.supabaseClient.auth.signInWithPassword({
            email: email,
            password: password
        });
        
        if (error) throw error;
        
        return data;
    } catch (error) {
        console.error('Login error:', error);
        throw error;
    }
}

// Logout function
async function logout() {
    if (!window.supabaseClient) return;
    
    try {
        const { error } = await window.supabaseClient.auth.signOut();
        if (error) throw error;
        
        // Redirect to home page after logout
        window.location.href = '/';
    } catch (error) {
        console.error('Logout error:', error);
        alert('Error logging out. Please try again.');
    }
}

// Sign up function
async function signUp(email, password) {
    if (!window.supabaseClient) {
        alert('Supabase is not configured. Please check your environment variables.');
        return null;
    }
    
    try {
        const { data, error } = await window.supabaseClient.auth.signUp({
            email: email,
            password: password
        });
        
        if (error) throw error;
        
        return data;
    } catch (error) {
        console.error('Sign up error:', error);
        throw error;
    }
}

// Update UI based on auth state
async function updateAuthUI() {
    const user = await checkAuth();
    const loginBtn = document.getElementById('loginBtn');
    
    if (user && loginBtn) {
        loginBtn.textContent = 'Logout';
        loginBtn.onclick = logout;
    } else if (loginBtn) {
        loginBtn.textContent = 'Login';
        loginBtn.onclick = () => {
            const modal = document.getElementById('loginModal');
            if (modal) modal.style.display = 'block';
        };
    }
}

// Listen for auth state changes
if (window.supabaseClient) {
    window.supabaseClient.auth.onAuthStateChange((event, session) => {
        console.log('Auth state changed:', event);
        updateAuthUI();
    });
}

// Initialize auth UI on page load
document.addEventListener('DOMContentLoaded', updateAuthUI);
