// Enhanced Form Validation with User-Friendly Messages

document.addEventListener('DOMContentLoaded', function() {
    initializeFormValidation();
});

function initializeFormValidation() {
    // Add real-time validation to all forms
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        const inputs = form.querySelectorAll('input, textarea, select');
        
        inputs.forEach(input => {
            // Add validation on blur
            input.addEventListener('blur', function() {
                validateField(this);
            });
            
            // Add validation on input (for immediate feedback)
            input.addEventListener('input', function() {
                if (this.classList.contains('is-invalid')) {
                    validateField(this);
                }
            });
        });
        
        // Add form submission validation
        form.addEventListener('submit', function(e) {
            if (!validateForm(form)) {
                e.preventDefault();
                e.stopPropagation();
            }
        });
    });
}

function validateField(field) {
    const value = field.value.trim();
    const fieldName = field.name || field.id;
    let isValid = true;
    let errorMessage = '';
    
    // Remove previous error messages
    removeFieldError(field);
    
    // Required field validation
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        errorMessage = getFieldLabel(field) + ' is required';
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }
    
    // Password validation
    if (field.type === 'password' && value) {
        if (value.length < 6) {
            isValid = false;
            errorMessage = 'Password must be at least 6 characters long';
        }
    }
    
    // Number validation
    if (field.type === 'number' && value) {
        const numValue = parseFloat(value);
        if (isNaN(numValue)) {
            isValid = false;
            errorMessage = 'Please enter a valid number';
        } else if (field.hasAttribute('min') && numValue < parseFloat(field.getAttribute('min'))) {
            isValid = false;
            errorMessage = `Value must be at least ${field.getAttribute('min')}`;
        } else if (field.hasAttribute('max') && numValue > parseFloat(field.getAttribute('max'))) {
            isValid = false;
            errorMessage = `Value must be at most ${field.getAttribute('max')}`;
        }
    }
    
    // Amount validation (for token amounts)
    if (fieldName.includes('amount') || fieldName.includes('Amount')) {
        if (value) {
            const amount = parseFloat(value);
            if (isNaN(amount) || amount <= 0) {
                isValid = false;
                errorMessage = 'Please enter a valid amount greater than 0';
            } else if (amount < 0.01) {
                isValid = false;
                errorMessage = 'Minimum amount is 0.01';
            }
        }
    }
    
    // Display validation result
    if (isValid) {
        field.classList.remove('is-invalid');
        field.classList.add('is-valid');
    } else {
        field.classList.remove('is-valid');
        field.classList.add('is-invalid');
        showFieldError(field, errorMessage);
    }
    
    return isValid;
}

function validateForm(form) {
    const inputs = form.querySelectorAll('input, textarea, select');
    let isFormValid = true;
    
    inputs.forEach(input => {
        if (!validateField(input)) {
            isFormValid = false;
        }
    });
    
    // Show form-level error if needed
    if (!isFormValid) {
        showFormError(form, 'Please correct the errors above before submitting');
    }
    
    return isFormValid;
}

function showFieldError(field, message) {
    // Remove existing error
    removeFieldError(field);
    
    // Create error message element
    const errorDiv = document.createElement('div');
    errorDiv.className = 'invalid-feedback';
    errorDiv.textContent = message;
    errorDiv.id = field.id + '-error';
    
    // Insert after field
    field.parentNode.appendChild(errorDiv);
    
    // Add aria attributes for accessibility
    field.setAttribute('aria-invalid', 'true');
    field.setAttribute('aria-describedby', errorDiv.id);
}

function removeFieldError(field) {
    const existingError = field.parentNode.querySelector('.invalid-feedback');
    if (existingError) {
        existingError.remove();
    }
    field.removeAttribute('aria-invalid');
    field.removeAttribute('aria-describedby');
}

function showFormError(form, message) {
    // Remove existing form error
    const existingError = form.querySelector('.form-error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Create error message
    const errorDiv = document.createElement('div');
    errorDiv.className = 'alert alert-danger form-error-message';
    errorDiv.innerHTML = `<i class="bi bi-exclamation-triangle"></i> ${message}`;
    
    // Insert at the top of form
    form.insertBefore(errorDiv, form.firstChild);
    
    // Scroll to error
    errorDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
    
    // Remove after 5 seconds
    setTimeout(() => {
        if (errorDiv.parentNode) {
            errorDiv.remove();
        }
    }, 5000);
}

function getFieldLabel(field) {
    const label = field.parentNode.querySelector('label');
    if (label) {
        return label.textContent.replace('*', '').trim();
    }
    
    // Try to get from placeholder
    if (field.placeholder) {
        return field.placeholder;
    }
    
    // Try to get from name/id
    const name = field.name || field.id;
    return name.charAt(0).toUpperCase() + name.slice(1).replace(/([A-Z])/g, ' $1');
}

// Enhanced confirmation dialogs
function showConfirmationDialog(title, message, onConfirm, onCancel) {
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">${title}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <p>${message}</p>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary" id="confirmBtn">Confirm</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
    
    document.getElementById('confirmBtn').addEventListener('click', function() {
        bsModal.hide();
        if (onConfirm) onConfirm();
        setTimeout(() => document.body.removeChild(modal), 300);
    });
    
    modal.addEventListener('hidden.bs.modal', function() {
        if (onCancel) onCancel();
        setTimeout(() => {
            if (modal.parentNode) {
                document.body.removeChild(modal);
            }
        }, 300);
    });
}

// Make confirmation dialog globally available
window.showConfirmationDialog = showConfirmationDialog;


