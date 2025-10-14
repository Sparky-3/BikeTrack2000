// Debug script for role system troubleshooting

// Add this to help debug the role system
window.debugRoles = {
    // Test if user_roles table exists and is accessible
    async testUserRolesTable() {
        console.log('🔍 Testing user_roles table...');
        
        if (!window.supabaseClient) {
            console.error('❌ Supabase client not initialized');
            return false;
        }

        try {
            // Try to query the table
            const { data, error } = await window.supabaseClient
                .from('user_roles')
                .select('*')
                .limit(1);

            if (error) {
                console.error('❌ Error accessing user_roles table:', error);
                if (error.code === '42P01') {
                    console.error('💡 The user_roles table does not exist. You need to create it in Supabase.');
                }
                return false;
            }

            console.log('✅ user_roles table is accessible');
            console.log('📊 Sample data:', data);
            return true;
        } catch (err) {
            console.error('❌ Exception accessing user_roles table:', err);
            return false;
        }
    },

    // Test current user and their role
    async testCurrentUser() {
        console.log('🔍 Testing current user...');
        
        const user = await checkAuth();
        if (!user) {
            console.log('❌ No user logged in');
            return null;
        }

        console.log('✅ User logged in:', {
            id: user.id,
            email: user.email
        });

        // Test getting their role
        try {
            const role = await window.roleManager.getUserRole(user.id);
            console.log('📊 User role result:', role);
            return { user, role };
        } catch (err) {
            console.error('❌ Error getting user role:', err);
            return { user, role: null };
        }
    },

    // Create a test role for current user (admin only)
    async createTestRole(userId, role = 'admin') {
        console.log(`🔧 Creating test role '${role}' for user ${userId}...`);
        
        if (!window.supabaseClient) {
            console.error('❌ Supabase client not initialized');
            return false;
        }

        try {
            const { data, error } = await window.supabaseClient
                .from('user_roles')
                .upsert({
                    user_id: userId,
                    role: role
                })
                .select();

            if (error) {
                console.error('❌ Error creating test role:', error);
                return false;
            }

            console.log('✅ Test role created:', data);
            return true;
        } catch (err) {
            console.error('❌ Exception creating test role:', err);
            return false;
        }
    },

    // Run full diagnostic
    async runDiagnostic() {
        console.log('🚀 Running role system diagnostic...');
        console.log('=====================================');
        
        // Test 1: Check if user_roles table exists
        const tableExists = await this.testUserRolesTable();
        
        // Test 2: Check current user
        const userInfo = await this.testCurrentUser();
        
        if (!tableExists) {
            console.log('💡 SOLUTION: Create the user_roles table in Supabase SQL Editor:');
            console.log(`
CREATE TABLE public.user_roles (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  user_id uuid NOT NULL UNIQUE,
  role text NOT NULL,
  CONSTRAINT user_roles_pkey PRIMARY KEY (id),
  CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

-- Enable RLS (Row Level Security)
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Create policy to allow users to read their own role
CREATE POLICY "Users can view their own role" ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);

-- Create policy to allow service role to manage all roles
CREATE POLICY "Service role can manage all roles" ON public.user_roles
  FOR ALL USING (auth.role() = 'service_role');
            `);
            return;
        }

        if (userInfo && userInfo.user) {
            if (!userInfo.role) {
                console.log('💡 SOLUTION: User has no role assigned. Creating test admin role...');
                await this.createTestRole(userInfo.user.id, 'admin');
                
                // Test again
                console.log('🔄 Testing role after creation...');
                const newRole = await window.roleManager.getUserRole(userInfo.user.id);
                console.log('📊 New role result:', newRole);
                
                if (newRole) {
                    console.log('✅ Success! Refresh the page to see the role take effect.');
                }
            } else {
                console.log('✅ User has role:', userInfo.role);
            }
        }
        
        console.log('=====================================');
        console.log('🏁 Diagnostic complete!');
    },

    // Quick fix - set current user to admin role
    async setCurrentUserAdmin() {
        console.log('🔧 Setting current user to admin role...');
        
        const user = await checkAuth();
        if (!user) {
            console.error('❌ No user logged in. Please log in first.');
            return false;
        }
        
        console.log('👤 Current user:', user.email);
        
        const success = await this.createTestRole(user.id, 'admin');
        
        if (success) {
            console.log('✅ Successfully set role to admin!');
            console.log('🔄 Refreshing role manager...');
            await window.roleManager.initializeUserRole(user);
            console.log('✅ Role manager refreshed. Try editing a bike again!');
            return true;
        }
        
        return false;
    }
};

// Auto-run diagnostic when script loads
document.addEventListener('DOMContentLoaded', () => {
    // Wait a bit for other scripts to load
    setTimeout(() => {
        console.log('🛠️ Role system debug tools loaded. Run window.debugRoles.runDiagnostic() to troubleshoot.');
        console.log('🚑 Quick fix: Run window.debugRoles.setCurrentUserAdmin() to set yourself as admin.');
    }, 1000);
});

