// Admin Interface Functions for BikeTrack 2000

// Load admin interface (for Admin, Earn-A-Bike, Give-A-Bike roles)
async function loadAdminInterface() {
    // Hide public interface
    const publicElements = document.querySelectorAll('.public-only');
    publicElements.forEach(el => el.style.display = 'none');

    // Show admin interface
    const adminElements = document.querySelectorAll('.admin-only');
    adminElements.forEach(el => el.style.display = 'block');

    // Create admin interface if it doesn't exist
    if (!document.getElementById('adminInterface')) {
        await createAdminInterface();
    }

    // Load dashboard data
    await loadAdminDashboard();
}

// Load sales interface (for Sales role)
async function loadSalesInterface() {
    // Hide public interface
    const publicElements = document.querySelectorAll('.public-only');
    publicElements.forEach(el => el.style.display = 'none');

    // Show admin interface
    const adminElements = document.querySelectorAll('.admin-only');
    adminElements.forEach(el => el.style.display = 'block');

    // Create sales interface if it doesn't exist
    if (!document.getElementById('adminInterface')) {
        await createSalesInterface();
    }

    // Load dashboard data
    await loadSalesDashboard();
}

// Create admin interface HTML
async function createAdminInterface() {
    const main = document.querySelector('.main');
    
    const adminInterface = document.createElement('div');
    adminInterface.id = 'adminInterface';
    adminInterface.className = 'admin-interface';
    adminInterface.innerHTML = `
        <div class="admin-header">
            <h1>Welcome, ${window.roleManager.currentUser?.email || 'User'}!</h1>
            <div class="admin-actions">
                ${window.roleManager.canSeeDonorForm() ? '<button id="donorFormBtn" class="btn btn-primary">Donor Form</button>' : ''}
            </div>
        </div>

        <div class="dashboard-metrics">
            <div class="metric-card">
                <h3># On Hand</h3>
                <div class="metric-value" id="onHandCount">0</div>
            </div>
            <div class="metric-card">
                <h3># Out</h3>
                <div class="metric-value" id="outCount">0</div>
            </div>
            <div class="metric-card">
                <h3>Total Bikes</h3>
                <div class="metric-value" id="totalBikesCount">0</div>
            </div>
        </div>

        <div class="admin-filters">
            <div class="filter-tabs">
                <button class="filter-tab active" data-filter="on-hand">On Hand</button>
                <button class="filter-tab" data-filter="trashed">Trashed</button>
                <button class="filter-tab" data-filter="out">Out</button>
                <button class="filter-tab" data-filter="strip">Strip</button>
                <button class="filter-tab" data-filter="donors">Donors</button>
            </div>
            
            <div class="search-container">
                <input type="text" id="bikeSearch" placeholder="Search bikes..." class="search-input">
                <button id="searchBtn" class="btn btn-secondary">Search</button>
            </div>
        </div>

        <div class="bikes-table-container">
            <div class="table-header">
                <h3>Bikes Inventory</h3>
                <button id="refreshBikes" class="btn btn-secondary">Refresh</button>
            </div>
            <div class="bikes-table" id="bikesTable">
                <div class="loading">Loading bikes...</div>
            </div>
        </div>

        <div class="admin-notes">
            <p><strong>Note:</strong> "Out" includes all bikes under donated/forsale/Earned</p>
        </div>
    `;

    main.appendChild(adminInterface);
    
    // Add event listeners
    setupAdminEventListeners();
}

// Create sales interface HTML
async function createSalesInterface() {
    const main = document.querySelector('.main');
    
    const adminInterface = document.createElement('div');
    adminInterface.id = 'adminInterface';
    adminInterface.className = 'admin-interface';
    adminInterface.innerHTML = `
        <div class="admin-header">
            <h1>Welcome, ${window.roleManager.currentUser?.email || 'User'}!</h1>
            <div class="admin-actions">
                <button id="donorFormBtn" class="btn btn-primary">Donor Form</button>
            </div>
        </div>

        <div class="dashboard-metrics">
            <div class="metric-card">
                <h3># On Hand</h3>
                <div class="metric-value" id="onHandCount">0</div>
            </div>
            <div class="metric-card">
                <h3># Earned</h3>
                <div class="metric-value" id="earnedCount">0</div>
            </div>
            <div class="metric-card">
                <h3>Total Bikes</h3>
                <div class="metric-value" id="totalBikesCount">0</div>
            </div>
        </div>

        <div class="admin-filters">
            <div class="filter-tabs">
                <button class="filter-tab active" data-filter="on-hand">On Hand</button>
                <button class="filter-tab" data-filter="trashed">Trashed</button>
                <button class="filter-tab" data-filter="earned">Earned</button>
                <button class="filter-tab" data-filter="strip">Strip</button>
                <button class="filter-tab" data-filter="donors">Donors</button>
            </div>
            
            <div class="search-container">
                <input type="text" id="bikeSearch" placeholder="Search bikes..." class="search-input">
                <button id="searchBtn" class="btn btn-secondary">Search</button>
            </div>
        </div>

        <div class="bikes-table-container">
            <div class="table-header">
                <h3>Bikes Inventory</h3>
                <button id="refreshBikes" class="btn btn-secondary">Refresh</button>
            </div>
            <div class="bikes-table" id="bikesTable">
                <div class="loading">Loading bikes...</div>
            </div>
        </div>
    `;

    main.appendChild(adminInterface);
    
    // Add event listeners
    setupAdminEventListeners();
}

// Setup event listeners for admin interface
function setupAdminEventListeners() {
    // Filter tabs
    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.addEventListener('click', function() {
            document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            const filterType = this.dataset.filter;
            if (filterType === 'donors') {
                loadDonorsTable();
            } else {
                loadBikesTable();
            }
        });
    });

    // Search functionality
    const searchInput = document.getElementById('bikeSearch');
    const searchBtn = document.getElementById('searchBtn');
    
    if (searchBtn) {
        searchBtn.addEventListener('click', performBikeSearch);
    }
    
    if (searchInput) {
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performBikeSearch();
            }
        });
    }

    // Refresh button
    const refreshBtn = document.getElementById('refreshBikes');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            const activeTab = document.querySelector('.filter-tab.active');
            if (activeTab?.dataset.filter === 'donors') {
                loadDonorsTable();
            } else {
                loadBikesTable();
            }
        });
    }

    // Donor form button
    const donorFormBtn = document.getElementById('donorFormBtn');
    if (donorFormBtn) {
        donorFormBtn.addEventListener('click', () => {
            // Navigate to the donor form page
            window.location.href = 'donor-form-page.html';
        });
    }
}

// Load admin dashboard with metrics
async function loadAdminDashboard() {
    try {
        const counts = await window.roleManager.getBikeCounts();
        
        document.getElementById('onHandCount').textContent = counts.onHand;
        document.getElementById('outCount').textContent = counts.out;
        document.getElementById('totalBikesCount').textContent = counts.total;
        
        await loadBikesTable();
    } catch (error) {
        console.error('Error loading admin dashboard:', error);
    }
}

// Load sales dashboard with metrics
async function loadSalesDashboard() {
    try {
        const counts = await window.roleManager.getBikeCounts();
        
        document.getElementById('onHandCount').textContent = counts.onHand;
        document.getElementById('earnedCount').textContent = counts.earned;
        document.getElementById('totalBikesCount').textContent = counts.total;
        
        await loadBikesTable();
    } catch (error) {
        console.error('Error loading sales dashboard:', error);
    }
}

// Load bikes table with current filters
async function loadBikesTable() {
    const tableContainer = document.getElementById('bikesTable');
    if (!tableContainer) return;

    tableContainer.innerHTML = '<div class="loading">Loading bikes...</div>';

    try {
        // Get current filter values
        const activeTab = document.querySelector('.filter-tab.active');

        // Build filters object
        const filters = {};
        
        if (activeTab) {
            const filterType = activeTab.dataset.filter;
            switch (filterType) {
                case 'on-hand':
                    filters.status = 'In stock';
                    break;
                case 'trashed':
                    filters.status = 'Trashed';
                    break;
                case 'out':
                    // Show all bikes that are not in stock, trashed, or strip
                    filters.statusNotIn = ['In stock', 'Trashed', 'Strip'];
                    break;
                case 'earned':
                    filters.status = 'Earned';
                    break;
                case 'strip':
                    filters.status = 'Strip';
                    break;
            }
        }

        const bikes = await window.roleManager.getFilteredBikes(filters);

        // Render table
        renderBikesTable(bikes);
        
    } catch (error) {
        console.error('Error loading bikes table:', error);
        tableContainer.innerHTML = '<div class="error">Error loading bikes. Please try again.</div>';
    }
}

// Render bikes table
function renderBikesTable(bikes) {
    const tableContainer = document.getElementById('bikesTable');
    
    if (bikes.length === 0) {
        tableContainer.innerHTML = '<div class="no-data">No bikes found matching your criteria.</div>';
        return;
    }

    const table = document.createElement('table');
    table.className = 'bikes-table';
    
    table.innerHTML = `
        <thead>
            <tr>
                <th>Serial #</th>
                <th>Brand</th>
                <th>Model</th>
                <th>Type</th>
                <th>Size</th>
                <th>Est. Value</th>
                <th>Program</th>
                <th>Condition</th>
                <th>Status</th>
                <th>Recipient</th>
                <th>Notes</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            ${bikes.map(bike => `
                <tr>
                    <td>${bike.serial_number || 'N/A'}</td>
                    <td>${bike.brand || 'N/A'}</td>
                    <td>${bike.model || 'N/A'}</td>
                    <td>${bike.type || 'N/A'}</td>
                    <td>${bike.size || 'N/A'}</td>
                    <td>$${bike.value || 0}</td>
                    <td>${bike.program || 'N/A'}</td>
                    <td>${bike.condition || 'N/A'}</td>
                    <td><span class="status-badge status-${bike.status?.toLowerCase().replace(' ', '-')}">${bike.status || 'N/A'}</span></td>
                    <td>${bike.donated_to || 'N/A'}</td>
                    <td>${bike.notes || 'N/A'}</td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="editBike('${bike.id}')">Edit</button>
                        ${window.roleManager.hasPermission('delete') ? `<button class="btn btn-sm btn-danger" onclick="deleteBike('${bike.id}')">Delete</button>` : ''}
                    </td>
                </tr>
            `).join('')}
        </tbody>
    `;
    
    tableContainer.innerHTML = '';
    tableContainer.appendChild(table);
}

// Perform bike search
async function performBikeSearch() {
    const searchInput = document.getElementById('bikeSearch');
    const tableContainer = document.getElementById('bikesTable');
    
    if (!searchInput || !tableContainer) return;
    
    const searchTerm = searchInput.value.trim().toLowerCase();
    
    if (!searchTerm) {
        // If search is empty, just reload the current table
        loadBikesTable();
        return;
    }
    
    tableContainer.innerHTML = '<div class="loading">Searching bikes...</div>';
    
    try {
        // Get all bikes that the user has access to
        const allBikes = await window.roleManager.getFilteredBikes({});
        
        // Search across multiple fields
        const searchResults = allBikes.filter(bike => {
            const searchableFields = [
                bike.serial_number?.toString(),
                bike.brand,
                bike.model,
                bike.type,
                bike.size,
                bike.status,
                bike.program,
                bike.donated_to,
                bike.notes
            ];
            
            return searchableFields.some(field => 
                field && field.toLowerCase().includes(searchTerm)
            );
        });
        
        renderBikesTable(searchResults);
        
    } catch (error) {
        console.error('Error searching bikes:', error);
        tableContainer.innerHTML = '<div class="error">Error searching bikes. Please try again.</div>';
    }
}

// Load donors table
async function loadDonorsTable() {
    const tableContainer = document.getElementById('bikesTable');
    if (!tableContainer) return;

    tableContainer.innerHTML = '<div class="loading">Loading donors...</div>';

    try {
        if (!window.supabaseClient) {
            throw new Error('Supabase client not initialized');
        }

        const { data: donors, error } = await window.supabaseClient
            .from('donors')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;

        renderDonorsTable(donors);
        
    } catch (error) {
        console.error('Error loading donors table:', error);
        tableContainer.innerHTML = '<div class="error">Error loading donors. Please try again.</div>';
    }
}

// Render donors table
function renderDonorsTable(donors) {
    const tableContainer = document.getElementById('bikesTable');
    
    if (donors.length === 0) {
        tableContainer.innerHTML = '<div class="no-data">No donors found.</div>';
        return;
    }

    const table = document.createElement('table');
    table.className = 'bikes-table';
    
    table.innerHTML = `
        <thead>
            <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Created At</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            ${donors.map(donor => `
                <tr>
                    <td>${donor.name || 'N/A'}</td>
                    <td>${donor.email || 'N/A'}</td>
                    <td>${donor.created_at ? new Date(donor.created_at).toLocaleDateString() : 'N/A'}</td>
                    <td>
                        <button class="btn btn-sm btn-primary" onclick="viewDonor('${donor.id}')">View</button>
                        ${window.roleManager.hasPermission('update') ? `<button class="btn btn-sm btn-secondary" onclick="editDonor('${donor.id}')">Edit</button>` : ''}
                    </td>
                </tr>
            `).join('')}
        </tbody>
    `;
    
    tableContainer.innerHTML = '';
    tableContainer.appendChild(table);
}

// Edit bike function
async function editBike(bikeId) {
    if (!window.roleManager.hasPermission('update')) {
        alert('You do not have permission to edit bikes.');
        return;
    }
    
    alert(`Edit bike ${bikeId} - functionality to be implemented!`);
}

// Delete bike function
async function deleteBike(bikeId) {
    if (!window.roleManager.hasPermission('delete')) {
        alert('You do not have permission to delete bikes.');
        return;
    }
    
    if (confirm('Are you sure you want to delete this bike?')) {
        alert(`Delete bike ${bikeId} - functionality to be implemented!`);
    }
}

// View donor function
async function viewDonor(donorId) {
    alert(`View donor ${donorId} - functionality to be implemented!`);
}

// Edit donor function
async function editDonor(donorId) {
    if (!window.roleManager.hasPermission('update')) {
        alert('You do not have permission to edit donors.');
        return;
    }
    
    alert(`Edit donor ${donorId} - functionality to be implemented!`);
}

// Export functions for global access
window.loadAdminInterface = loadAdminInterface;
window.loadSalesInterface = loadSalesInterface;
window.loadBikesTable = loadBikesTable;
window.performBikeSearch = performBikeSearch;
window.loadDonorsTable = loadDonorsTable;
window.editBike = editBike;
window.deleteBike = deleteBike;
window.viewDonor = viewDonor;
window.editDonor = editDonor;
