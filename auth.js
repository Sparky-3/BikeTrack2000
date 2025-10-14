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
        // Initialize user role
        await window.roleManager.initializeUserRole(user);
        
        // Wait a moment to ensure role is set
        await new Promise(resolve => setTimeout(resolve, 100));
        
        // Update login button to show user info and logout
        const roleName = window.roleManager.getRoleName();
        console.log('Setting button text with role:', roleName);
        loginBtn.textContent = `Logout (${roleName})`;
        loginBtn.onclick = logout;
        
        // Load appropriate interface based on role
        await loadRoleBasedInterface();
    } else if (loginBtn) {
        loginBtn.textContent = 'Login';
        loginBtn.onclick = () => {
            const modal = document.getElementById('loginModal');
            if (modal) modal.style.display = 'block';
        };
        
        // Load public interface
        await loadPublicInterface();
    }
}

// Load interface based on user role
async function loadRoleBasedInterface() {
    const role = window.roleManager.currentRole;
    console.log('loadRoleBasedInterface called with role:', role);
    
    if (!role) {
        console.log('No role found, loading public interface');
        await loadPublicInterface();
        return;
    }

    // Hide public interface elements
    const publicElements = document.querySelectorAll('.public-only');
    publicElements.forEach(el => el.style.display = 'none');

    // Show appropriate admin interface
    const roleLower = role?.toLowerCase();
    console.log('Role lowercased:', roleLower);
    
    if (roleLower === 'sales') {
        console.log('Loading sales interface');
        await loadSalesInterface();
    } else if (['earn-a-bike', 'give-a-bike', 'admin'].includes(roleLower)) {
        console.log('Loading admin interface');
        await loadAdminInterface();
    } else {
        console.log('Unknown role, loading public interface');
        await loadPublicInterface();
    }
}

// Load public interface for non-logged-in users
async function loadPublicInterface() {
    // Show public elements
    const publicElements = document.querySelectorAll('.public-only');
    publicElements.forEach(el => el.style.display = 'block');

    // Hide admin interfaces
    const adminElements = document.querySelectorAll('.admin-only');
    adminElements.forEach(el => el.style.display = 'none');
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
