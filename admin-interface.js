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
                <div class="table-header-actions">
                    ${window.roleManager.canSeeDonorForm() ? '<button id="donorFormBtn" class="btn btn-primary">Donor Form</button>' : ''}
                    <button id="refreshBikes" class="btn btn-secondary">Refresh</button>
                </div>
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
                <div class="table-header-actions">
                    <button id="donorFormBtn" class="btn btn-primary">Donor Form</button>
                    <button id="refreshBikes" class="btn btn-secondary">Refresh</button>
                </div>
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
    if (!window.roleManager.hasPermission('update', 'bikes')) {
        alert(`You do not have permission to edit bikes.\n\nYour role: ${window.roleManager.currentRole || 'None'}\n\nPlease run: await window.debugRoles.runDiagnostic() in the console to diagnose the issue.`);
        return;
    }
    
    try {
        // Get the current bike data
        const { data: bike, error: fetchError } = await window.supabaseClient
            .from('bikes')
            .select('*')
            .eq('id', bikeId)
            .single();
            
        if (fetchError) throw fetchError;
        
        // Show edit modal
        showEditBikeModal(bike);
        
    } catch (error) {
        console.error('Error fetching bike for edit:', error);
        alert('Error loading bike data. Please try again.');
    }
}

// Delete bike function
async function deleteBike(bikeId) {
    if (!window.roleManager.hasPermission('delete', 'bikes')) {
        alert(`You do not have permission to delete bikes.\n\nYour role: ${window.roleManager.currentRole || 'None'}`);
        return;
    }
    
    try {
        // Get bike details for confirmation
        const { data: bike, error: fetchError } = await window.supabaseClient
            .from('bikes')
            .select('serial_number, brand, model')
            .eq('id', bikeId)
            .single();
            
        if (fetchError) throw fetchError;
        
        const confirmMessage = `Are you sure you want to delete this bike?\n\nSerial: ${bike.serial_number || 'N/A'}\nBrand: ${bike.brand || 'N/A'}\nModel: ${bike.model || 'N/A'}\n\nThis action cannot be undone.`;
        
        if (confirm(confirmMessage)) {
            // Perform the deletion
            const { error: deleteError } = await window.supabaseClient
                .from('bikes')
                .delete()
                .eq('id', bikeId);
                
            if (deleteError) throw deleteError;
            
            // Show success message and refresh the table
            alert('Bike deleted successfully!');
            await loadBikesTable();
        }
        
    } catch (error) {
        console.error('Error deleting bike:', error);
        alert('Error deleting bike. Please try again.');
    }
}

// View donor function
async function viewDonor(donorId) {
    alert(`View donor ${donorId} - functionality to be implemented!`);
}

// Edit donor function
async function editDonor(donorId) {
    if (!window.roleManager.hasPermission('update', 'donors')) {
        alert(`You do not have permission to edit donors.\n\nYour role: ${window.roleManager.currentRole || 'None'}`);
        return;
    }
    
    alert(`Edit donor ${donorId} - functionality to be implemented!`);
}

// Show edit bike modal
async function showEditBikeModal(bike) {
    // Create modal if it doesn't exist
    let modal = document.getElementById('editBikeModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'editBikeModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 600px; margin-top: 5vh;">
                <span class="close" onclick="closeEditBikeModal()">&times;</span>
                <h2>Edit Bike</h2>
                <form id="editBikeForm">
                    <div class="form-group">
                        <label for="editSerialNumber">Serial Number *</label>
                        <input type="number" id="editSerialNumber" required>
                    </div>
                    <div class="form-group">
                        <label for="editBrand">Brand</label>
                        <select id="editBrand">
                            <option value="">Select brand...</option>
                            <option value="__ADD_NEW__">+ Add New Brand</option>
                        </select>
                        <input type="text" id="editBrandNew" placeholder="Enter new brand name" 
                               style="display: none; margin-top: 0.5rem;" class="form-control">
                    </div>
                    <div class="form-group">
                        <label for="editModel">Model</label>
                        <select id="editModel">
                            <option value="">Select model...</option>
                            <option value="__ADD_NEW__">+ Add New Model</option>
                        </select>
                        <input type="text" id="editModelNew" placeholder="Enter new model name" 
                               style="display: none; margin-top: 0.5rem;" class="form-control">
                    </div>
                    <div class="form-group">
                        <label for="editType">Type</label>
                        <select id="editType">
                            <option value="">Select Type</option>
                            <option value="Mountain">Mountain</option>
                            <option value="Road">Road</option>
                            <option value="Hybrid">Hybrid</option>
                            <option value="BMX">BMX</option>
                            <option value="Cruiser">Cruiser</option>
                            <option value="Kids">Kids</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="editSize">Size</label>
                        <select id="editSize">
                            <option value="">Select Size</option>
                            <option value="XS">XS</option>
                            <option value="S">S</option>
                            <option value="M">M</option>
                            <option value="L">L</option>
                            <option value="XL">XL</option>
                            <option value="XXL">XXL</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="editValue">Estimated Value ($)</label>
                        <input type="number" id="editValue" min="0">
                    </div>
                    <div class="form-group">
                        <label for="editProgram">Program</label>
                        <select id="editProgram">
                            <option value="">Select Program</option>
                            <option value="Earn-A-Bike">Earn-A-Bike</option>
                            <option value="Give-A-Bike">Give-A-Bike</option>
                            <option value="Sales">Sales</option>
                            <option value="Strip">Strip</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="editCondition">Condition</label>
                        <select id="editCondition">
                            <option value="">Select Condition</option>
                            <option value="Excellent">Excellent</option>
                            <option value="Good">Good</option>
                            <option value="Fair">Fair</option>
                            <option value="Poor">Poor</option>
                            <option value="For Parts">For Parts</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="editStatus">Status</label>
                        <select id="editStatus">
                            <option value="In stock">In stock</option>
                            <option value="Earned">Earned</option>
                            <option value="Donated">Donated</option>
                            <option value="Trashed">Trashed</option>
                            <option value="Strip">Strip</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="editDonatedTo">Donated To</label>
                        <input type="text" id="editDonatedTo" placeholder="Enter recipient name">
                    </div>
                    <div class="form-group">
                        <label for="editNotes">Notes</label>
                        <textarea id="editNotes" rows="3"></textarea>
                    </div>
                    <div class="form-group">
                        <label for="editBottomBracketSerial">Bottom Bracket Serial</label>
                        <input type="text" id="editBottomBracketSerial">
                    </div>
                    <div class="form-actions">
                        <button type="button" class="btn btn-secondary" onclick="closeEditBikeModal()">Cancel</button>
                        <button type="submit" class="btn btn-primary">Update Bike</button>
                    </div>
                </form>
            </div>
        `;
        document.body.appendChild(modal);
        
        // Add form submit handler
        document.getElementById('editBikeForm').addEventListener('submit', handleEditBikeSubmission);
        
        // Setup brand/model listeners
        setupEditBikeBrandModelListeners();
    }
    
    // Load brands and models into dropdowns
    await loadBrandsAndModelsForEdit();
    
    // Populate form with current bike data
    document.getElementById('editSerialNumber').value = bike.serial_number || '';
    
    // Handle brand selection
    const brandSelect = document.getElementById('editBrand');
    if (bike.brand && brandSelect.options.length > 2) {
        // Check if the bike's brand exists in the dropdown
        let brandExists = false;
        for (let option of brandSelect.options) {
            if (option.value === bike.brand) {
                brandSelect.value = bike.brand;
                brandExists = true;
                break;
            }
        }
        // If brand doesn't exist in dropdown, show it in the new input field
        if (!brandExists && bike.brand) {
            brandSelect.value = '__ADD_NEW__';
            const brandNewInput = document.getElementById('editBrandNew');
            brandNewInput.style.display = 'block';
            brandNewInput.value = bike.brand;
        }
    }
    
    // Handle model selection
    const modelSelect = document.getElementById('editModel');
    if (bike.model && modelSelect.options.length > 2) {
        // Check if the bike's model exists in the dropdown
        let modelExists = false;
        for (let option of modelSelect.options) {
            if (option.value === bike.model) {
                modelSelect.value = bike.model;
                modelExists = true;
                break;
            }
        }
        // If model doesn't exist in dropdown, show it in the new input field
        if (!modelExists && bike.model) {
            modelSelect.value = '__ADD_NEW__';
            const modelNewInput = document.getElementById('editModelNew');
            modelNewInput.style.display = 'block';
            modelNewInput.value = bike.model;
        }
    }
    
    document.getElementById('editType').value = bike.type || '';
    document.getElementById('editSize').value = bike.size || '';
    document.getElementById('editValue').value = bike.value || '';
    document.getElementById('editProgram').value = bike.program || '';
    document.getElementById('editCondition').value = bike.condition || '';
    document.getElementById('editStatus').value = bike.status || 'In stock';
    
    document.getElementById('editDonatedTo').value = bike.donated_to || '';
    
    document.getElementById('editNotes').value = bike.notes || '';
    document.getElementById('editBottomBracketSerial').value = bike.bottom_bracket_serial || '';
    
    // Store the bike ID for the update
    modal.dataset.bikeId = bike.id;
    
    // Show modal
    modal.style.display = 'block';
}

// Close edit bike modal
function closeEditBikeModal() {
    const modal = document.getElementById('editBikeModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Load brands and models for edit modal
async function loadBrandsAndModelsForEdit() {
    if (!window.supabaseClient) {
        console.error('Supabase client not initialized');
        return;
    }
    
    try {
        // Fetch brands
        const { data: brands, error: brandsError } = await window.supabaseClient
            .from('brands')
            .select('name')
            .order('name', { ascending: true });
        
        if (brandsError) throw brandsError;
        
        // Fetch models
        const { data: models, error: modelsError } = await window.supabaseClient
            .from('models')
            .select('name')
            .order('name', { ascending: true });
        
        if (modelsError) throw modelsError;
        
        
        // Populate brand dropdown
        const brandSelect = document.getElementById('editBrand');
        if (brandSelect && brands) {
            // Clear existing options except the first two
            while (brandSelect.options.length > 2) {
                brandSelect.removeChild(brandSelect.lastChild);
            }
            
            // Add brand options
            brands.forEach(brand => {
                const option = document.createElement('option');
                option.value = brand.name;
                option.textContent = brand.name;
                brandSelect.appendChild(option);
            });
        }
        
        // Populate model dropdown
        const modelSelect = document.getElementById('editModel');
        if (modelSelect && models) {
            // Clear existing options except the first two
            while (modelSelect.options.length > 2) {
                modelSelect.removeChild(modelSelect.lastChild);
            }
            
            // Add model options
            models.forEach(model => {
                const option = document.createElement('option');
                option.value = model.name;
                option.textContent = model.name;
                modelSelect.appendChild(option);
            });
        }
        
        
    } catch (error) {
        console.error('Error loading brands and models:', error);
    }
}

// Setup brand/model listeners for edit modal
function setupEditBikeBrandModelListeners() {
    const brandSelect = document.getElementById('editBrand');
    const brandNewInput = document.getElementById('editBrandNew');
    const modelSelect = document.getElementById('editModel');
    const modelNewInput = document.getElementById('editModelNew');
    
    if (brandSelect && brandNewInput) {
        brandSelect.addEventListener('change', function() {
            if (this.value === '__ADD_NEW__') {
                brandNewInput.style.display = 'block';
                brandNewInput.required = true;
                this.required = false;
            } else {
                brandNewInput.style.display = 'none';
                brandNewInput.required = false;
                this.required = true;
            }
        });
    }
    
    if (modelSelect && modelNewInput) {
        modelSelect.addEventListener('change', function() {
            if (this.value === '__ADD_NEW__') {
                modelNewInput.style.display = 'block';
                modelNewInput.required = true;
                this.required = false;
            } else {
                modelNewInput.style.display = 'none';
                modelNewInput.required = false;
                this.required = true;
            }
        });
    }
    
}

// Handle edit bike form submission
async function handleEditBikeSubmission(event) {
    event.preventDefault();
    
    const modal = document.getElementById('editBikeModal');
    const bikeId = modal.dataset.bikeId;
    
    // Get brand (either from dropdown or new input)
    let brand = document.getElementById('editBrand').value;
    if (brand === '__ADD_NEW__') {
        brand = document.getElementById('editBrandNew').value;
    }
    
    // Get model (either from dropdown or new input)
    let model = document.getElementById('editModel').value;
    if (model === '__ADD_NEW__') {
        model = document.getElementById('editModelNew').value;
    }
    
    // Get donated_to value
    let donatedTo = document.getElementById('editDonatedTo').value.trim();
    
    // Collect form data
    const formData = {
        serial_number: document.getElementById('editSerialNumber').value,
        brand: brand,
        model: model,
        type: document.getElementById('editType').value,
        size: document.getElementById('editSize').value,
        value: document.getElementById('editValue').value ? parseInt(document.getElementById('editValue').value) : null,
        program: document.getElementById('editProgram').value,
        condition: document.getElementById('editCondition').value,
        status: document.getElementById('editStatus').value,
        donated_to: donatedTo,
        notes: document.getElementById('editNotes').value,
        bottom_bracket_serial: document.getElementById('editBottomBracketSerial').value
    };
    
    try {
        // If new brand/model was added, ensure they exist in the database
        if (brand && document.getElementById('editBrand').value === '__ADD_NEW__') {
            await window.supabaseClient
                .from('brands')
                .upsert({ name: brand }, { onConflict: 'name', ignoreDuplicates: true });
        }
        
        if (model && document.getElementById('editModel').value === '__ADD_NEW__') {
            await window.supabaseClient
                .from('models')
                .upsert({ name: model }, { onConflict: 'name', ignoreDuplicates: true });
        }
        
        // If donated_to is provided, ensure the recipient exists in the database
        if (donatedTo) {
            // First, check if the recipient already exists
            const { data: existingRecipient, error: checkError } = await window.supabaseClient
                .from('recipients')
                .select('name')
                .eq('name', donatedTo)
                .single();
            
            // If recipient doesn't exist, create it
            if (!existingRecipient && !checkError) {
                const { error: createError } = await window.supabaseClient
                    .from('recipients')
                    .insert({ name: donatedTo });
                
                if (createError) {
                    console.error('Error creating recipient:', createError);
                    // Don't throw here - let the bike update proceed
                }
            }
        }
        
        // Update the bike in the database
        const { error } = await window.supabaseClient
            .from('bikes')
            .update(formData)
            .eq('id', bikeId);
            
        if (error) throw error;
        
        // Close modal and refresh the table
        closeEditBikeModal();
        await loadBikesTable();
        
    } catch (error) {
        console.error('Error updating bike:', error);
        alert('Error updating bike. Please try again.');
    }
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
window.showEditBikeModal = showEditBikeModal;
window.closeEditBikeModal = closeEditBikeModal;
window.handleEditBikeSubmission = handleEditBikeSubmission;
