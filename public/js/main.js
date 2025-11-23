// Main JavaScript file

// Enhanced alert system with better user feedback
function showAlert(message, type = 'success', duration = 5000) {
    // Create alert container if it doesn't exist
    let alertContainer = document.getElementById('alertContainer');
    if (!alertContainer) {
        alertContainer = document.createElement('div');
        alertContainer.id = 'alertContainer';
        alertContainer.style.cssText = 'position: fixed; top: 20px; right: 20px; z-index: 10000; max-width: 400px;';
        document.body.appendChild(alertContainer);
    }

    const alertId = 'alert-' + Date.now();
    const icons = {
        'success': 'check-circle-fill',
        'danger': 'exclamation-triangle-fill',
        'warning': 'exclamation-triangle-fill',
        'info': 'info-circle-fill'
    };
    
    const alertHTML = `
        <div id="${alertId}" class="alert alert-${type} alert-dismissible fade show shadow-lg" role="alert" style="animation: slideInRight 0.3s ease-out;">
            <i class="bi bi-${icons[type] || 'info-circle'} me-2"></i>
            <strong>${type === 'success' ? 'Success!' : type === 'danger' ? 'Error!' : type === 'warning' ? 'Warning!' : 'Info!'}</strong>
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    
    alertContainer.insertAdjacentHTML('beforeend', alertHTML);
    
    // Add animation
    const alert = document.getElementById(alertId);
    if (alert) {
        alert.classList.add('fade-in');
    }
    
    // Auto-dismiss after specified duration
    setTimeout(() => {
        const alertEl = document.getElementById(alertId);
        if (alertEl) {
            const bsAlert = new bootstrap.Alert(alertEl);
            bsAlert.close();
            setTimeout(() => {
                if (alertEl.parentNode) {
                    alertEl.remove();
                }
            }, 300);
        }
    }, duration);
}

// Add CSS animation for alerts
if (!document.getElementById('alert-animations')) {
    const style = document.createElement('style');
    style.id = 'alert-animations';
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
    `;
    document.head.appendChild(style);
}

// Format number with commas
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Handle form submissions with loading states
document.addEventListener('DOMContentLoaded', function() {
    // Add loading state to buttons on form submit
    const forms = document.querySelectorAll('form');
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            const submitButton = form.querySelector('button[type="submit"]');
            if (submitButton && !form.dataset.noLoading) {
                submitButton.disabled = true;
                const originalText = submitButton.innerHTML;
                submitButton.innerHTML = '<span class="spinner-border spinner-border-sm me-2"></span>Processing...';
                
                // Re-enable after 10 seconds as fallback
                setTimeout(() => {
                    submitButton.disabled = false;
                    submitButton.innerHTML = originalText;
                }, 10000);
            }
        });
    });
});

// Real-time balance update (if on dashboard or tokens page)
if (document.getElementById('currentBalance') || document.getElementById('balance')) {
    // Balance updates on page refresh
    // For real-time updates, implement WebSocket or polling
    console.log('Balance elements found - ready for updates');
}

