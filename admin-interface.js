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
                <button class="filter-tab" data-filter="donor-search">Donor Search</button>
            </div>
            
            <div class="filter-options">
                <label class="filter-checkbox">
                    <input type="checkbox" id="inStockOnly" checked>
                    Show only bikes In Stock
                </label>
                <label class="filter-checkbox">
                    <input type="checkbox" id="trashedOnly">
                    Show only bikes trashed
                </label>
                <label class="filter-checkbox">
                    <input type="checkbox" id="earnedOnly">
                    Show only bikes Earned
                </label>
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
                <button class="filter-tab" data-filter="search">Search</button>
            </div>
            
            <div class="filter-options">
                <label class="filter-checkbox">
                    <input type="checkbox" id="inStockOnly" checked>
                    Show only bikes In Stock
                </label>
                <label class="filter-checkbox">
                    <input type="checkbox" id="trashedOnly">
                    Show only bikes trashed
                </label>
                <label class="filter-checkbox">
                    <input type="checkbox" id="earnedOnly">
                    Show only bikes Earned
                </label>
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
            loadBikesTable();
        });
    });

    // Filter checkboxes
    document.querySelectorAll('.filter-checkbox input').forEach(checkbox => {
        checkbox.addEventListener('change', loadBikesTable);
    });

    // Refresh button
    const refreshBtn = document.getElementById('refreshBikes');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', loadBikesTable);
    }

    // Donor form button
    const donorFormBtn = document.getElementById('donorFormBtn');
    if (donorFormBtn) {
        donorFormBtn.addEventListener('click', openDonorForm);
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
        const inStockOnly = document.getElementById('inStockOnly')?.checked;
        const trashedOnly = document.getElementById('trashedOnly')?.checked;
        const earnedOnly = document.getElementById('earnedOnly')?.checked;

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
                    // Show donated, for sale, and earned
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
        
        // Apply additional filters
        let filteredBikes = bikes;
        
        if (inStockOnly) {
            filteredBikes = filteredBikes.filter(bike => bike.status === 'In stock');
        }
        if (trashedOnly) {
            filteredBikes = filteredBikes.filter(bike => bike.status === 'Trashed');
        }
        if (earnedOnly) {
            filteredBikes = filteredBikes.filter(bike => bike.status === 'Earned');
        }

        // Render table
        renderBikesTable(filteredBikes);
        
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
                <th>Serial Number</th>
                <th>Brand</th>
                <th>Model</th>
                <th>Type</th>
                <th>Size</th>
                <th>Value</th>
                <th>Program</th>
                <th>Condition</th>
                <th>Status</th>
                <th>Donated To</th>
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

// Open donor form modal
function openDonorForm() {
    // Use the donor form functionality from donor-form.js
    if (typeof window.openDonorForm === 'function') {
        window.openDonorForm();
    } else {
        alert('Donor form functionality is not available.');
    }
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

// Export functions for global access
window.loadAdminInterface = loadAdminInterface;
window.loadSalesInterface = loadSalesInterface;
window.loadBikesTable = loadBikesTable;
window.editBike = editBike;
window.deleteBike = deleteBike;
window.openDonorForm = openDonorForm;
