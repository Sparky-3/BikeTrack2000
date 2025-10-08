// Donor Form Functionality for BikeTrack 2000

// Open donor form modal
function openDonorForm() {
    // Check if user has permission to see donor form
    if (!window.roleManager.canSeeDonorForm()) {
        alert('You do not have permission to access the donor form.');
        return;
    }

    // Create donor form modal if it doesn't exist
    if (!document.getElementById('donorFormModal')) {
        createDonorFormModal();
    }

    // Show the modal
    const modal = document.getElementById('donorFormModal');
    modal.style.display = 'block';
}

// Create donor form modal
function createDonorFormModal() {
    const modal = document.createElement('div');
    modal.id = 'donorFormModal';
    modal.className = 'modal';
    modal.innerHTML = `
        <div class="modal-content donor-form-modal">
            <span class="close" onclick="closeDonorForm()">&times;</span>
            <h2>Donor Information Form</h2>
            
            <form id="donorForm" class="donation-form">
                <div class="form-group">
                    <label for="donorName">Donor Name *</label>
                    <input type="text" id="donorName" required>
                </div>
                
                <div class="form-group">
                    <label for="donorEmail">Email Address *</label>
                    <input type="email" id="donorEmail" required>
                </div>
                
                <div class="form-group">
                    <label for="donorPhone">Phone Number</label>
                    <input type="tel" id="donorPhone">
                </div>
                
                <div class="form-group">
                    <label for="donorAddress">Address</label>
                    <textarea id="donorAddress" rows="3"></textarea>
                </div>
                
                <div class="form-group">
                    <label for="donationType">Donation Type *</label>
                    <select id="donationType" required>
                        <option value="">Select donation type</option>
                        <option value="bike">Bike</option>
                        <option value="parts">Parts</option>
                        <option value="both">Bike and Parts</option>
                    </select>
                </div>
                
                <div id="bikeSection" class="donation-section" style="display: none;">
                    <h3>Bike Information</h3>
                    
                    <div class="form-group">
                        <label for="bikeBrand">Brand</label>
                        <input type="text" id="bikeBrand">
                    </div>
                    
                    <div class="form-group">
                        <label for="bikeModel">Model</label>
                        <input type="text" id="bikeModel">
                    </div>
                    
                    <div class="form-group">
                        <label for="bikeType">Type</label>
                        <select id="bikeType">
                            <option value="">Select bike type</option>
                            <option value="road">Road Bike</option>
                            <option value="mountain">Mountain Bike</option>
                            <option value="hybrid">Hybrid</option>
                            <option value="cruiser">Cruiser</option>
                            <option value="bmx">BMX</option>
                            <option value="other">Other</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="bikeSize">Size</label>
                        <input type="text" id="bikeSize">
                    </div>
                    
                    <div class="form-group">
                        <label for="bikeCondition">Condition</label>
                        <select id="bikeCondition">
                            <option value="">Select condition</option>
                            <option value="excellent">Excellent</option>
                            <option value="good">Good</option>
                            <option value="fair">Fair</option>
                            <option value="poor">Poor</option>
                            <option value="needs_repair">Needs Repair</option>
                        </select>
                    </div>
                    
                    <div class="form-group">
                        <label for="bikeValue">Estimated Value ($)</label>
                        <input type="number" id="bikeValue" min="0" step="0.01">
                    </div>
                    
                    <div class="form-group">
                        <label for="bikeSerialNumber">Serial Number</label>
                        <input type="text" id="bikeSerialNumber">
                    </div>
                    
                    <div class="form-group">
                        <label for="bikeNotes">Notes</label>
                        <textarea id="bikeNotes" rows="3" placeholder="Any additional information about the bike..."></textarea>
                    </div>
                </div>
                
                <div id="partsSection" class="donation-section" style="display: none;">
                    <h3>Parts Information</h3>
                    
                    <div class="form-group">
                        <label for="partsDescription">Parts Description</label>
                        <textarea id="partsDescription" rows="3" placeholder="Describe the parts being donated..."></textarea>
                    </div>
                    
                    <div class="form-group">
                        <label for="numberOfParts">Number of Parts</label>
                        <input type="number" id="numberOfParts" min="1" value="1">
                    </div>
                    
                    <div class="form-group">
                        <label for="partsValue">Estimated Value ($)</label>
                        <input type="number" id="partsValue" min="0" step="0.01">
                    </div>
                    
                    <div class="form-group">
                        <label for="partsCondition">Condition</label>
                        <select id="partsCondition">
                            <option value="">Select condition</option>
                            <option value="new">New</option>
                            <option value="excellent">Excellent</option>
                            <option value="good">Good</option>
                            <option value="fair">Fair</option>
                            <option value="poor">Poor</option>
                        </select>
                    </div>
                </div>
                
                <div class="form-group">
                    <label for="donationNotes">Additional Notes</label>
                    <textarea id="donationNotes" rows="3" placeholder="Any additional information about the donation..."></textarea>
                </div>
                
                <div class="form-group">
                    <label class="checkbox-label">
                        <input type="checkbox" id="receiptRequested" checked>
                        I would like a receipt for this donation
                    </label>
                </div>
                
                <div class="form-group">
                    <label class="checkbox-label">
                        <input type="checkbox" id="taxDeductible">
                        This donation is tax deductible
                    </label>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn btn-secondary" onclick="closeDonorForm()">Cancel</button>
                    <button type="submit" class="btn btn-primary">Submit Donation</button>
                </div>
            </form>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Add event listeners
    setupDonorFormEventListeners();
}

// Setup event listeners for donor form
function setupDonorFormEventListeners() {
    // Handle donation type change
    const donationType = document.getElementById('donationType');
    if (donationType) {
        donationType.addEventListener('change', function() {
            const bikeSection = document.getElementById('bikeSection');
            const partsSection = document.getElementById('partsSection');
            
            // Hide both sections first
            if (bikeSection) bikeSection.style.display = 'none';
            if (partsSection) partsSection.style.display = 'none';
            
            // Show relevant sections based on selection
            switch (this.value) {
                case 'bike':
                    if (bikeSection) bikeSection.style.display = 'block';
                    break;
                case 'parts':
                    if (partsSection) partsSection.style.display = 'block';
                    break;
                case 'both':
                    if (bikeSection) bikeSection.style.display = 'block';
                    if (partsSection) partsSection.style.display = 'block';
                    break;
            }
        });
    }
    
    // Handle form submission
    const form = document.getElementById('donorForm');
    if (form) {
        form.addEventListener('submit', handleDonorFormSubmission);
    }
    
    // Close modal when clicking outside
    const modal = document.getElementById('donorFormModal');
    if (modal) {
        modal.addEventListener('click', function(event) {
            if (event.target === modal) {
                closeDonorForm();
            }
        });
    }
}

// Handle donor form submission
async function handleDonorFormSubmission(event) {
    event.preventDefault();
    
    // Get form data
    const formData = {
        donor: {
            name: document.getElementById('donorName').value,
            email: document.getElementById('donorEmail').value,
            phone: document.getElementById('donorPhone').value,
            address: document.getElementById('donorAddress').value
        },
        donation: {
            type: document.getElementById('donationType').value,
            notes: document.getElementById('donationNotes').value,
            receiptRequested: document.getElementById('receiptRequested').checked,
            taxDeductible: document.getElementById('taxDeductible').checked
        }
    };
    
    // Add bike information if applicable
    const donationType = formData.donation.type;
    if (donationType === 'bike' || donationType === 'both') {
        formData.bike = {
            brand: document.getElementById('bikeBrand').value,
            model: document.getElementById('bikeModel').value,
            type: document.getElementById('bikeType').value,
            size: document.getElementById('bikeSize').value,
            condition: document.getElementById('bikeCondition').value,
            value: parseFloat(document.getElementById('bikeValue').value) || 0,
            serialNumber: document.getElementById('bikeSerialNumber').value,
            notes: document.getElementById('bikeNotes').value
        };
    }
    
    // Add parts information if applicable
    if (donationType === 'parts' || donationType === 'both') {
        formData.parts = {
            description: document.getElementById('partsDescription').value,
            numberOfParts: parseInt(document.getElementById('numberOfParts').value) || 1,
            value: parseFloat(document.getElementById('partsValue').value) || 0,
            condition: document.getElementById('partsCondition').value
        };
    }
    
    try {
        // Show loading state
        const submitBtn = event.target.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Submitting...';
        submitBtn.disabled = true;
        
        // Submit the donation
        await submitDonation(formData);
        
        // Show success message
        alert('Donation submitted successfully!');
        
        // Close the modal
        closeDonorForm();
        
    } catch (error) {
        console.error('Error submitting donation:', error);
        alert('Error submitting donation: ' + error.message);
        
        // Reset button state
        const submitBtn = event.target.querySelector('button[type="submit"]');
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
    }
}

// Submit donation to database
async function submitDonation(formData) {
    if (!window.supabaseClient) {
        throw new Error('Database connection not available');
    }
    
    try {
        // Start a transaction-like process
        const { data: donorData, error: donorError } = await window.supabaseClient
            .from('donors')
            .upsert({
                name: formData.donor.name,
                email: formData.donor.email
            })
            .select()
            .single();
        
        if (donorError) throw donorError;
        
        // Create donation record
        const donationRecord = {
            email: formData.donor.email,
            name: formData.donor.name,
            total_bikes_donated: (formData.bike ? 1 : 0),
            total_estimated_value: (formData.bike?.value || 0) + (formData.parts?.value || 0),
            total_parts_donated: formData.parts?.numberOfParts || 0
        };
        
        const { data: donationData, error: donationError } = await window.supabaseClient
            .from('donations')
            .insert([donationRecord])
            .select()
            .single();
        
        if (donationError) throw donationError;
        
        // Create bike record if applicable
        if (formData.bike && (formData.donation.type === 'bike' || formData.donation.type === 'both')) {
            const bikeRecord = {
                brand: formData.bike.brand,
                model: formData.bike.model,
                value: formData.bike.value,
                program: 'donated' // Default program for donations
            };
            
            const { error: bikeError } = await window.supabaseClient
                .from('bikes_donated')
                .insert([bikeRecord]);
            
            if (bikeError) throw bikeError;
        }
        
        // Create parts record if applicable
        if (formData.parts && (formData.donation.type === 'parts' || formData.donation.type === 'both')) {
            const partsRecord = {
                number_of_parts: formData.parts.numberOfParts,
                parts_value: formData.parts.value
            };
            
            const { error: partsError } = await window.supabaseClient
                .from('parts_donated')
                .insert([partsRecord]);
            
            if (partsError) throw partsError;
        }
        
        return { success: true, donationId: donationData.id };
        
    } catch (error) {
        console.error('Error submitting donation:', error);
        throw error;
    }
}

// Close donor form modal
function closeDonorForm() {
    const modal = document.getElementById('donorFormModal');
    if (modal) {
        modal.style.display = 'none';
        
        // Reset form
        const form = document.getElementById('donorForm');
        if (form) {
            form.reset();
            
            // Hide sections
            const bikeSection = document.getElementById('bikeSection');
            const partsSection = document.getElementById('partsSection');
            if (bikeSection) bikeSection.style.display = 'none';
            if (partsSection) partsSection.style.display = 'none';
        }
    }
}

// Export functions for global access
window.openDonorForm = openDonorForm;
window.closeDonorForm = closeDonorForm;
