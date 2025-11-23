// Token management JavaScript

document.addEventListener('DOMContentLoaded', function() {
    const transferForm = document.getElementById('transferForm');
    const depositForm = document.getElementById('depositForm');
    const withdrawForm = document.getElementById('withdrawForm');
    const burnForm = document.getElementById('burnForm');
    const createForm = document.getElementById('createForm');

    // Transfer form handler
    if (transferForm) {
        transferForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const formData = new FormData(transferForm);
            const data = Object.fromEntries(formData);

            try {
                const response = await fetch('/tokens/transfer', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (response.ok) {
                    showAlert(result.message || 'Transfer completed successfully!', 'success');
                    transferForm.reset();
                    updateBalance();
                } else {
                    showAlert(result.error || 'Transfer failed', 'danger');
                }
            } catch (error) {
                showAlert('An error occurred. Please try again.', 'danger');
            } finally {
                const submitBtn = transferForm.querySelector('button[type="submit"]');
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="bi bi-arrow-left-right"></i> Transfer Tokens';
                }
            }
        });
    }

    // Deposit form handler
    if (depositForm) {
        depositForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const formData = new FormData(depositForm);
            const data = Object.fromEntries(formData);

            try {
                const response = await fetch('/tokens/deposit', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (response.ok) {
                    showAlert(result.message || 'Deposit completed successfully!', 'success');
                    depositForm.reset();
                    updateBalance();
                } else {
                    showAlert(result.error || 'Deposit failed', 'danger');
                }
            } catch (error) {
                showAlert('An error occurred. Please try again.', 'danger');
            } finally {
                const submitBtn = depositForm.querySelector('button[type="submit"]');
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="bi bi-arrow-down-circle"></i> Deposit Tokens';
                }
            }
        });
    }

    // Withdraw form handler
    if (withdrawForm) {
        withdrawForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const formData = new FormData(withdrawForm);
            const data = Object.fromEntries(formData);

            try {
                const response = await fetch('/tokens/withdraw', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (response.ok) {
                    showAlert(result.message || 'Withdrawal completed successfully!', 'success');
                    withdrawForm.reset();
                    updateBalance();
                } else {
                    showAlert(result.error || 'Withdrawal failed', 'danger');
                }
            } catch (error) {
                showAlert('An error occurred. Please try again.', 'danger');
            } finally {
                const submitBtn = withdrawForm.querySelector('button[type="submit"]');
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="bi bi-arrow-up-circle"></i> Withdraw Tokens';
                }
            }
        });
    }

    // Burn form handler
    if (burnForm) {
        burnForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const formData = new FormData(burnForm);
            const data = Object.fromEntries(formData);

            if (!confirm('Are you sure you want to burn these tokens? This action cannot be undone.')) {
                return;
            }

            try {
                const response = await fetch('/tokens/burn', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (response.ok) {
                    showAlert(result.message || 'Tokens burned successfully!', 'success');
                    burnForm.reset();
                    updateBalance();
                } else {
                    showAlert(result.error || 'Burn failed', 'danger');
                }
            } catch (error) {
                showAlert('An error occurred. Please try again.', 'danger');
            } finally {
                const submitBtn = burnForm.querySelector('button[type="submit"]');
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="bi bi-fire"></i> Burn Tokens';
                }
            }
        });
    }

    // Create form handler (Admin only)
    if (createForm) {
        createForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            const formData = new FormData(createForm);
            const data = Object.fromEntries(formData);

            try {
                const response = await fetch('/tokens/create', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });

                const result = await response.json();

                if (response.ok) {
                    showAlert(result.message || 'Tokens created successfully!', 'success');
                    createForm.reset();
                    updateBalance();
                } else {
                    showAlert(result.error || 'Token creation failed', 'danger');
                }
            } catch (error) {
                showAlert('An error occurred. Please try again.', 'danger');
            } finally {
                const submitBtn = createForm.querySelector('button[type="submit"]');
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="bi bi-plus-circle"></i> Create Tokens';
                }
            }
        });
    }
});

// Update balance display
async function updateBalance() {
    try {
        const response = await fetch('/dashboard');
        if (response.ok) {
            // Reload page to get updated balance
            setTimeout(() => {
                window.location.reload();
            }, 1000);
        }
    } catch (error) {
        console.error('Failed to update balance:', error);
    }
}

