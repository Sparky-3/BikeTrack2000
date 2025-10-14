// Role-Based Access Control System for BikeTrack 2000

// Define user roles and their permissions
const USER_ROLES = {
    'earn-a-bike': {
        name: 'Earn-A-Bike',
        permissions: {
            canCRUD: ['earn-a-bike_bikes', 'strip_bikes'],
            canRead: ['all_tables']
        }
    },
    'give-a-bike': {
        name: 'Give-A-Bike',
        permissions: {
            canCRUD: ['give-a-bike_bikes', 'strip_bikes'],
            canRead: ['all_tables']
        }
    },
    'sales': {
        name: 'Sales',
        permissions: {
            canCRUD: ['sales_bikes', 'strip_bikes'],
            canRead: ['all_tables']
        }
    },
    'admin': {
        name: 'Admin',
        permissions: {
            canCRUD: ['all_tables'],
            canRead: ['all_tables']
        }
    }
};

// User role management functions
class RoleManager {
    constructor() {
        this.currentUser = null;
        this.currentRole = null;
    }

    // Get user role from database
    async getUserRole(userId) {
        if (!window.supabaseClient) {
            console.error('Supabase client not initialized');
            return null;
        }

        try {
            const { data, error } = await window.supabaseClient
                .from('user_roles')
                .select('role')
                .eq('user_id', userId)
                .single();

            if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
                throw error;
            }

            return data?.role || null;
        } catch (error) {
            console.error('Error fetching user role:', error);
            return null;
        }
    }

    // Set user role (admin only)
    async setUserRole(userId, role) {
        if (!this.hasPermission('admin')) {
            throw new Error('Only admins can set user roles');
        }

        if (!window.supabaseClient) {
            console.error('Supabase client not initialized');
            return false;
        }

        try {
            const { error } = await window.supabaseClient
                .from('user_roles')
                .upsert({
                    user_id: userId,
                    role: role
                });

            if (error) throw error;
            return true;
        } catch (error) {
            console.error('Error setting user role:', error);
            return false;
        }
    }

    // Initialize user role after authentication
    async initializeUserRole(user) {
        this.currentUser = user;
        if (user) {
            this.currentRole = await this.getUserRole(user.id);
            console.log('User role initialized:', this.currentRole);
        } else {
            this.currentRole = null;
        }
    }

    // Check if user has permission for a specific action
    hasPermission(action, resource = null) {
        if (!this.currentRole || !USER_ROLES[this.currentRole]) {
            return false;
        }

        const role = USER_ROLES[this.currentRole];
        const permissions = role.permissions;

        // Admin has all permissions
        if (this.currentRole === 'admin') {
            return true;
        }

        // Check CRUD permissions
        if (action === 'create' || action === 'read' || action === 'update' || action === 'delete') {
            // Check if user can CRUD all tables
            if (permissions.canCRUD.includes('all_tables')) {
                return true;
            }

            // Check specific resource permissions
            if (resource && permissions.canCRUD.includes(resource)) {
                return true;
            }

            // Check read permissions for read operations
            if (action === 'read') {
                if (permissions.canRead.includes('all_tables') || 
                    (resource && permissions.canRead.includes(resource))) {
                    return true;
                }
            }
        }

        return false;
    }

    // Check if user can access a specific bike program
    canAccessProgram(program) {
        const role = this.currentRole?.toLowerCase();
        
        switch (program) {
            case 'earn-a-bike':
                return role === 'earn-a-bike' || role === 'admin';
            case 'give-a-bike':
                return role === 'give-a-bike' || role === 'admin';
            case 'sales':
                return role === 'sales' || role === 'admin';
            default:
                return false;
        }
    }

    // Check if user can see donor form
    canSeeDonorForm() {
        const role = this.currentRole?.toLowerCase();
        return role === 'sales' || role === 'admin';
    }

    // Get user-friendly role name
    getRoleName() {
        if (!this.currentRole) {
            return 'Not Logged In';
        }
        
        // Handle case-insensitive role lookup
        const roleKey = Object.keys(USER_ROLES).find(key => 
            key.toLowerCase() === this.currentRole.toLowerCase()
        );
        
        if (!roleKey) {
            return 'Not Logged In';
        }
        
        return USER_ROLES[roleKey].name;
    }

    // Check if user is logged in
    isLoggedIn() {
        return !!this.currentUser;
    }

    // Get bikes filtered by user's program access
    async getFilteredBikes(filters = {}) {
        if (!window.supabaseClient) {
            console.error('Supabase client not initialized');
            return [];
        }

        try {
            let query = window.supabaseClient
                .from('bikes')
                .select('*');

            // Apply role-based filtering
            if (this.currentRole === 'earn-a-bike') {
                query = query.eq('program', 'earn-a-bike');
            } else if (this.currentRole === 'give-a-bike') {
                query = query.eq('program', 'give-a-bike');
            } else if (this.currentRole === 'sales') {
                query = query.eq('program', 'sales');
            }
            // Admin can see all bikes (no program filter)

            // Apply additional filters
            if (filters.status) {
                query = query.eq('status', filters.status);
            }
            if (filters.type) {
                query = query.eq('type', filters.type);
            }
            if (filters.minValue) {
                query = query.gte('value', filters.minValue);
            }
            if (filters.maxValue) {
                query = query.lte('value', filters.maxValue);
            }

            query = query.order('created_at', { ascending: false });

            const { data, error } = await query;
            if (error) throw error;
            return data;
        } catch (error) {
            console.error('Error fetching filtered bikes:', error);
            return [];
        }
    }

    // Get bike counts for dashboard
    async getBikeCounts() {
        const bikes = await this.getFilteredBikes();
        
        const counts = {
            onHand: 0,
            out: 0,
            earned: 0,
            trashed: 0,
            strip: 0,
            total: bikes.length
        };

        bikes.forEach(bike => {
            switch (bike.status) {
                case 'In stock':
                    counts.onHand++;
                    break;
                case 'Donated':
                case 'For sale':
                case 'Earned':
                    counts.out++;
                    if (bike.status === 'Earned') {
                        counts.earned++;
                    }
                    break;
                case 'Trashed':
                    counts.trashed++;
                    break;
                case 'Strip':
                    counts.strip++;
                    break;
            }
        });

        return counts;
    }
}

// Create global role manager instance
window.roleManager = new RoleManager();

// Export for use in other files
window.USER_ROLES = USER_ROLES;
