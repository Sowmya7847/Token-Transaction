// Admin panel JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const resetForm = document.getElementById('resetForm');
    const distributeForm = document.getElementById('distributeForm');

    // Reset balance form handler
    if (resetForm) {
        resetForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const formData = new FormData(resetForm);
            const data = Object.fromEntries(formData);

            try {
                const response = await fetch('/admin/reset-balance', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (response.ok) {
                    showAlert(result.message || 'Balance reset successfully!', 'success');
                    const modal = bootstrap.Modal.getInstance(document.getElementById('resetModal'));
                    if (modal) modal.hide();
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                } else {
                    showAlert(result.error || 'Reset failed', 'danger');
                }
            } catch (error) {
                showAlert('An error occurred. Please try again.', 'danger');
            }
        });
    }

    // Distribute tokens form handler
    if (distributeForm) {
        distributeForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const formData = new FormData(distributeForm);
            const userIdsText = formData.get('userIds');
            const userIds = userIdsText.split(',').map(id => id.trim()).filter(id => id);
            const amount = formData.get('amount');

            if (userIds.length === 0) {
                showAlert('Please enter at least one user ID', 'danger');
                return;
            }

            try {
                const response = await fetch('/admin/distribute', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ userIds, amount })
                });

                const result = await response.json();

                if (response.ok) {
                    showAlert(result.message || 'Tokens distributed successfully!', 'success');
                    distributeForm.reset();
                    setTimeout(() => {
                        window.location.reload();
                    }, 1000);
                } else {
                    showAlert(result.error || 'Distribution failed', 'danger');
                }
            } catch (error) {
                showAlert('An error occurred. Please try again.', 'danger');
            } finally {
                const submitBtn = distributeForm.querySelector('button[type="submit"]');
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="bi bi-send"></i> Distribute Tokens';
                }
            }
        });
    }
});

// Open reset modal
function openResetModal(userId, userEmail, currentBalance) {
    document.getElementById('resetUserId').value = userId;
    document.getElementById('resetUserEmail').value = userEmail;
    document.getElementById('resetCurrentBalance').value = currentBalance;
    document.getElementById('resetNewBalance').value = '';
    
    const modal = new bootstrap.Modal(document.getElementById('resetModal'));
    modal.show();
}

