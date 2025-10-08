# BikeTrack 2000 - Role-Based Access Control System

## Overview

The BikeTrack 2000 application now includes a comprehensive role-based access control system that matches the structure outlined in your diagram. The system provides different interfaces and permissions based on user roles.

## User Roles and Permissions

### 1. **Earn-A-Bike**
- **Permissions**: Can CRUD bikes associated with the "Earn-A-Bike" program and strip bikes
- **Interface**: Admin interface with full access to bike management
- **Donor Form**: Can access donor form (shared with Admin/Manager)

### 2. **Give-A-Bike**
- **Permissions**: Can CRUD bikes associated with the "Give-A-Bike" program and strip bikes
- **Interface**: Admin interface with full access to bike management
- **Donor Form**: Can access donor form (shared with Admin/Manager)

### 3. **Sales**
- **Permissions**: Can CRUD bikes associated with the "Sales" program and strip bikes
- **Interface**: Sales-specific interface with focus on earned bikes
- **Donor Form**: Can access donor form (only Sales role sees this prominently)

### 4. **Admin**
- **Permissions**: Can CRUD all tables and access everything
- **Interface**: Admin interface with full access
- **Donor Form**: Can access donor form

### 5. **Not Logged In**
- **Permissions**: Can insert into donations, bikes_donated, donors, parts_donated
- **Interface**: Public donation information page

## Interface Differences

### Admin Interface (Admin, Earn-A-Bike, Give-A-Bike)
- **Metrics**: # On Hand, # Out, Total Bikes
- **Filters**: On Hand, Trashed, Out, Strip, Donor Search
- **Note**: "Out is all bikes under donated/forsale/Earned"

### Sales Interface (Sales Role Only)
- **Metrics**: # On Hand, # Earned, Total Bikes
- **Filters**: On Hand, Trashed, Earned, Strip, Search
- **Focus**: Emphasis on earned bikes rather than general "out" status

## Key Features

### 1. **Role-Based Access Control**
- Users are assigned roles in the `user_roles` table
- Permissions are checked before allowing actions
- Different interfaces load based on user role

### 2. **Dynamic Interface Loading**
- Public interface for non-logged-in users
- Admin interface for most logged-in users
- Sales interface specifically for Sales role

### 3. **Donor Form Access**
- Sales role: Prominent donor form access
- Admin/Manager roles: Can also access donor form
- Other roles: No donor form access

### 4. **Bike Filtering**
- Role-based filtering ensures users only see bikes they have permission to manage
- Program-specific filtering (Earn-A-Bike users only see Earn-A-Bike bikes, etc.)
- Admin and Manager roles see all bikes

## Database Integration

### User Roles Table
```sql
CREATE TABLE public.user_roles (
  id bigint GENERATED ALWAYS AS IDENTITY NOT NULL,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  user_id uuid NOT NULL UNIQUE,
  role USER-DEFINED,
  CONSTRAINT user_roles_pkey PRIMARY KEY (id),
  CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);
```

### Role Assignment
- Roles are stored as USER-DEFINED enum values
- Users must be assigned roles by an admin
- Default behavior: users without roles see public interface only

## File Structure

### Core Files
- `roles.js` - Role management and permission checking
- `auth.js` - Authentication with role integration
- `admin-interface.js` - Admin and sales interface logic
- `donor-form.js` - Donor form functionality
- `styles.css` - Styling for all interfaces

### Key Functions

#### Role Management
- `window.roleManager.getUserRole(userId)` - Get user's role
- `window.roleManager.hasPermission(action, resource)` - Check permissions
- `window.roleManager.canAccessProgram(program)` - Check program access
- `window.roleManager.getFilteredBikes(filters)` - Get role-filtered bikes

#### Interface Loading
- `loadAdminInterface()` - Load admin interface
- `loadSalesInterface()` - Load sales interface
- `loadPublicInterface()` - Load public interface

#### Donor Form
- `openDonorForm()` - Open donor form modal
- `submitDonation(formData)` - Submit donation to database

## Usage Instructions

### 1. **Setting Up User Roles**
1. Users must first be created in Supabase Auth
2. Admin users can assign roles using the `setUserRole()` function
3. Roles are stored in the `user_roles` table

### 2. **Role Assignment**
```javascript
// Only admins can assign roles
await window.roleManager.setUserRole(userId, 'sales');
```

### 3. **Permission Checking**
```javascript
// Check if user can update bikes
if (window.roleManager.hasPermission('update', 'bikes')) {
    // Allow bike update
}
```

### 4. **Program Access**
```javascript
// Check if user can access Earn-A-Bike program
if (window.roleManager.canAccessProgram('earn-a-bike')) {
    // Show Earn-A-Bike bikes
}
```

## Security Considerations

1. **Permission Checks**: All sensitive operations check permissions before execution
2. **Data Filtering**: Users only see data they have permission to access
3. **Role Validation**: Roles are validated against the defined USER_ROLES object
4. **Database Constraints**: Foreign key constraints ensure data integrity

## Future Enhancements

1. **Role Management UI**: Interface for admins to assign roles
2. **Audit Logging**: Track role changes and permission usage
3. **Dynamic Permissions**: More granular permission system
4. **Role Hierarchy**: Define role inheritance and escalation

## Troubleshooting

### Common Issues

1. **User sees public interface after login**
   - Check if user has a role assigned in `user_roles` table
   - Verify role value matches defined USER_ROLES

2. **Permission denied errors**
   - Verify user's role has the required permissions
   - Check if the resource parameter is correct

3. **Donor form not showing**
   - Verify user role has `canSeeDonorForm()` permission
   - Check if Sales or Admin role is assigned

### Debug Information
- Check browser console for role initialization messages
- Verify Supabase client is properly configured
- Ensure all required scripts are loaded in correct order
