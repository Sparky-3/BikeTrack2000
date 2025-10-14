// Main Script for Phoenix Bikes Website

// Modal functionality
document.addEventListener('DOMContentLoaded', function() {
    const loginBtn = document.getElementById('loginBtn');
    const loginModal = document.getElementById('loginModal');
    const closeBtn = document.querySelector('.close');
    const loginForm = document.querySelector('.login-form');

    // Open modal
    if (loginBtn) {
        loginBtn.addEventListener('click', function() {
            // Check if user is already logged in
            checkAuth().then(user => {
                if (user) {
                    logout();
                } else {
                    if (loginModal) loginModal.style.display = 'block';
                }
            });
        });
    }

    // Close modal
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            if (loginModal) loginModal.style.display = 'none';
        });
    }

    // Close modal when clicking outside
    window.addEventListener('click', function(event) {
        if (event.target === loginModal) {
            loginModal.style.display = 'none';
        }
    });

    // Handle login form submission
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            
            try {
                const data = await login(email, password);
                
                if (data && data.user) {
                    if (loginModal) loginModal.style.display = 'none';
                    
                    // Clear form
                    loginForm.reset();
                    
                    // Update UI
                    await updateAuthUI();
                }
            } catch (error) {
                alert('Login failed: ' + error.message);
            }
        });
    }
});

// Helper function to format dates
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

// Database helper functions

// Insert a donation record
async function createDonation(donationData) {
    if (!window.supabaseClient) {
        console.error('Supabase client not initialized');
        return null;
    }
    
    try {
        const { data, error } = await window.supabaseClient
            .from('donations')
            .insert([donationData])
            .select();
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error creating donation:', error);
        throw error;
    }
}

// Get all donations
async function getDonations() {
    if (!window.supabaseClient) {
        console.error('Supabase client not initialized');
        return [];
    }
    
    try {
        const { data, error } = await window.supabaseClient
            .from('donations')
            .select('*')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching donations:', error);
        return [];
    }
}

// Get bikes inventory
async function getBikes(filters = {}) {
    if (!window.supabaseClient) {
        console.error('Supabase client not initialized');
        return [];
    }
    
    try {
        let query = window.supabaseClient
            .from('bikes')
            .select('*');
        
        // Apply filters if provided
        if (filters.type) {
            query = query.eq('type', filters.type);
        }
        if (filters.status) {
            query = query.eq('status', filters.status);
        }
        if (filters.minPrice) {
            query = query.gte('price', filters.minPrice);
        }
        if (filters.maxPrice) {
            query = query.lte('price', filters.maxPrice);
        }
        
        query = query.order('created_at', { ascending: false });
        
        const { data, error } = await query;
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error fetching bikes:', error);
        return [];
    }
}

// Create a work order
async function createWorkOrder(workOrderData) {
    if (!window.supabaseClient) {
        console.error('Supabase client not initialized');
        return null;
    }
    
    try {
        const { data, error } = await window.supabaseClient
            .from('work_orders')
            .insert([workOrderData])
            .select();
        
        if (error) throw error;
        return data;
    } catch (error) {
        console.error('Error creating work order:', error);
        throw error;
    }
}

// Export functions for use in other scripts
window.phoenixBikes = {
    formatDate,
    createDonation,
    getDonations,
    getBikes,
    createWorkOrder
};
