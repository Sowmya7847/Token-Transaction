// Help System and User Guidance

// Initialize help system
document.addEventListener('DOMContentLoaded', function() {
    // Wait for Bootstrap to be available
    if (typeof bootstrap !== 'undefined') {
        initializeTooltips();
        initializeHelpModals();
        checkFirstTimeUser();
    } else {
        // Retry after a short delay if Bootstrap isn't loaded yet
        setTimeout(function() {
            initializeTooltips();
            initializeHelpModals();
            checkFirstTimeUser();
        }, 100);
    }
});

// Initialize Bootstrap tooltips
function initializeTooltips() {
    if (typeof bootstrap === 'undefined') return;
    
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        // Destroy existing tooltip if any
        const existingTooltip = bootstrap.Tooltip.getInstance(tooltipTriggerEl);
        if (existingTooltip) {
            existingTooltip.dispose();
        }
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// Check if user is first-time
function checkFirstTimeUser() {
    const hasSeenTour = localStorage.getItem('hasSeenTour');
    if (!hasSeenTour && window.location.pathname === '/dashboard') {
        setTimeout(() => {
            showWelcomeTour();
        }, 1000);
    }
}

// Welcome Tour
function showWelcomeTour() {
    const tourSteps = [
        {
            element: '#balance',
            title: 'Your Balance',
            content: 'This shows your current token balance. You can deposit, withdraw, transfer, or burn tokens.',
            placement: 'bottom'
        },
        {
            element: '.nav-link[href="/tokens"]',
            title: 'Token Management',
            content: 'Click here to manage your tokens - deposit, withdraw, transfer, or burn them.',
            placement: 'right'
        },
        {
            element: '.nav-link[href="/transactions"]',
            title: 'Transaction History',
            content: 'View all your past transactions here with detailed information.',
            placement: 'right'
        },
        {
            element: '.nav-link[href="/reports"]',
            title: 'Reports & Analytics',
            content: 'See charts and statistics about your transaction activity.',
            placement: 'right'
        }
    ];

    let currentStep = 0;
    
    function showStep() {
        if (currentStep >= tourSteps.length) {
            localStorage.setItem('hasSeenTour', 'true');
            return;
        }

        const step = tourSteps[currentStep];
        const element = document.querySelector(step.element);
        
        if (element) {
            showTooltipGuide(element, step.title, step.content, step.placement, () => {
                currentStep++;
                setTimeout(showStep, 500);
            });
        } else {
            currentStep++;
            showStep();
        }
    }

    showStep();
}

// Show tooltip guide
function showTooltipGuide(element, title, content, placement, onNext) {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'tour-overlay';
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.7);
        z-index: 9998;
    `;
    
    // Highlight element
    const rect = element.getBoundingClientRect();
    const highlight = document.createElement('div');
    highlight.style.cssText = `
        position: fixed;
        top: ${rect.top}px;
        left: ${rect.left}px;
        width: ${rect.width}px;
        height: ${rect.height}px;
        border: 3px solid #0d6efd;
        border-radius: 0.5rem;
        z-index: 9999;
        pointer-events: none;
        box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.7);
    `;
    
    // Create tooltip
    const tooltip = document.createElement('div');
    tooltip.className = 'tour-tooltip';
    tooltip.style.cssText = `
        position: fixed;
        background: white;
        padding: 1.5rem;
        border-radius: 0.5rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        max-width: 300px;
        ${placement === 'right' ? `left: ${rect.right + 20}px; top: ${rect.top}px;` : ''}
        ${placement === 'bottom' ? `top: ${rect.bottom + 20}px; left: ${rect.left}px;` : ''}
    `;
    
    tooltip.innerHTML = `
        <h5>${title}</h5>
        <p>${content}</p>
        <div class="d-flex justify-content-between mt-3">
            <button class="btn btn-sm btn-outline-secondary" onclick="skipTour()">Skip Tour</button>
            <button class="btn btn-sm btn-primary" onclick="nextTourStep()">Next</button>
        </div>
    `;
    
    document.body.appendChild(overlay);
    document.body.appendChild(highlight);
    document.body.appendChild(tooltip);
    
    window.nextTourStep = function() {
        document.body.removeChild(overlay);
        document.body.removeChild(highlight);
        document.body.removeChild(tooltip);
        if (onNext) onNext();
    };
    
    window.skipTour = function() {
        localStorage.setItem('hasSeenTour', 'true');
        document.body.removeChild(overlay);
        document.body.removeChild(highlight);
        document.body.removeChild(tooltip);
    };
}

// Initialize help modals
function initializeHelpModals() {
    // Help content for different pages
    const helpContent = {
        dashboard: {
            title: 'Dashboard Help',
            content: `
                <h6><i class="bi bi-speedometer2"></i> Understanding Your Dashboard</h6>
                <ul>
                    <li><strong>Current Balance:</strong> Your available tokens that you can use</li>
                    <li><strong>Total Deposits:</strong> Sum of all tokens you've added to your account</li>
                    <li><strong>Total Withdrawals:</strong> Sum of all tokens you've removed</li>
                    <li><strong>Total Transactions:</strong> Count of all your completed transactions</li>
                    <li><strong>Total Transfers:</strong> Amount of tokens you've sent or received</li>
                    <li><strong>Total Burns:</strong> Amount of tokens permanently destroyed</li>
                </ul>
                <h6 class="mt-3"><i class="bi bi-graph-up"></i> Charts & Analytics</h6>
                <p>The charts show your transaction trends over the last 7 days, helping you track your activity.</p>
                <h6 class="mt-3"><i class="bi bi-lightning-charge"></i> Quick Actions</h6>
                <p>Use the quick action buttons to quickly access token management, view transactions, or check reports.</p>
            `
        },
        tokens: {
            title: 'Token Management Help',
            content: `
                <h6><i class="bi bi-wallet2"></i> Available Actions</h6>
                <ul>
                    <li><strong>Transfer:</strong> Send tokens to another user by entering their email address</li>
                    <li><strong>Deposit:</strong> Add tokens to your account balance</li>
                    <li><strong>Withdraw:</strong> Remove tokens from your account</li>
                    <li><strong>Burn:</strong> Permanently destroy tokens (this action cannot be undone!)</li>
                    <li><strong>Create (Admin only):</strong> Generate new tokens for any user</li>
                </ul>
                <h6 class="mt-3"><i class="bi bi-shield-check"></i> Security Tips</h6>
                <ul>
                    <li>Always double-check recipient email before transferring</li>
                    <li>Burning tokens is permanent - be very careful!</li>
                    <li>Your balance updates automatically after each action</li>
                    <li>All transactions are recorded and cannot be deleted</li>
                </ul>
                <h6 class="mt-3"><i class="bi bi-question-circle"></i> Common Questions</h6>
                <p><strong>Q: Can I reverse a transfer?</strong><br>
                A: No, transfers are final. Make sure you have the correct email address.</p>
                <p><strong>Q: What happens when I burn tokens?</strong><br>
                A: Burned tokens are permanently removed and cannot be recovered.</p>
            `
        },
        transactions: {
            title: 'Transaction History Help',
            content: `
                <h6><i class="bi bi-list-ul"></i> Understanding Transactions</h6>
                <ul>
                    <li><strong>Transaction ID:</strong> Unique identifier for each transaction (starts with TX)</li>
                    <li><strong>Type:</strong> The type of transaction:
                        <ul>
                            <li>Deposit: Tokens added to your account (green)</li>
                            <li>Withdraw: Tokens removed from your account (red)</li>
                            <li>Transfer: Tokens sent or received (green/red)</li>
                            <li>Burn: Tokens permanently destroyed (red)</li>
                        </ul>
                    </li>
                    <li><strong>Amount:</strong> Positive (green) = you received tokens, Negative (red) = you sent tokens</li>
                    <li><strong>Description:</strong> Additional notes about the transaction</li>
                    <li><strong>Status:</strong> Current status (usually "completed")</li>
                    <li><strong>Date & Time:</strong> When the transaction occurred</li>
                </ul>
                <h6 class="mt-3"><i class="bi bi-arrow-left-right"></i> Pagination</h6>
                <p>Use the page numbers at the bottom to navigate through your transaction history. Each page shows 20 transactions.</p>
            `
        },
        reports: {
            title: 'Reports & Analytics Help',
            content: `
                <h6><i class="bi bi-graph-up"></i> Understanding Reports</h6>
                <ul>
                    <li><strong>Total Transactions:</strong> Count of all your transactions</li>
                    <li><strong>Total Deposits:</strong> Sum of all tokens deposited</li>
                    <li><strong>Total Withdrawals:</strong> Sum of all tokens withdrawn</li>
                    <li><strong>Total Transfers:</strong> Sum of all tokens transferred</li>
                    <li><strong>Total Burns:</strong> Sum of all tokens burned</li>
                    <li><strong>Net Amount:</strong> Your overall token balance change</li>
                </ul>
                <h6 class="mt-3"><i class="bi bi-bar-chart"></i> Charts</h6>
                <ul>
                    <li><strong>Transaction Timeline:</strong> Shows daily transaction trends (line or bar chart)</li>
                    <li><strong>Distribution Chart:</strong> Pie chart showing transaction type distribution</li>
                    <li><strong>Monthly Comparison:</strong> Bar chart comparing monthly activity</li>
                </ul>
                <h6 class="mt-3"><i class="bi bi-lightbulb"></i> Tips</h6>
                <p>Use these reports to track your spending patterns and understand your token usage over time.</p>
            `
        },
        admin: {
            title: 'Admin Panel Help',
            content: `
                <h6><i class="bi bi-shield-check"></i> Admin Features</h6>
                <ul>
                    <li><strong>User Management:</strong> View all users and their balances</li>
                    <li><strong>Reset Balance:</strong> Set a user's balance to a specific amount</li>
                    <li><strong>Token Distribution:</strong> Distribute tokens to multiple users at once</li>
                    <li><strong>Transaction Monitoring:</strong> View all transactions across the system</li>
                </ul>
                <h6 class="mt-3"><i class="bi bi-exclamation-triangle"></i> Important</h6>
                <p>Admin actions are logged and cannot be undone. Use these features carefully.</p>
            `
        },
        contact: {
            title: 'Contact Us Help',
            content: `
                <h6><i class="bi bi-envelope"></i> How to Contact Us</h6>
                <ul>
                    <li><strong>Name:</strong> Enter your full name so we can address you properly</li>
                    <li><strong>Email:</strong> Your email address where we'll send our response</li>
                    <li><strong>Subject:</strong> Brief summary of your inquiry (e.g., "Account Question", "Technical Issue")</li>
                    <li><strong>Message:</strong> Provide detailed information about your inquiry</li>
                </ul>
                <h6 class="mt-3"><i class="bi bi-clock-history"></i> Response Time</h6>
                <p>We typically respond within 24-48 hours. For urgent matters, include "URGENT" in the subject line.</p>
                <h6 class="mt-3"><i class="bi bi-shield-check"></i> Privacy</h6>
                <p>Your information is secure and will only be used to respond to your inquiry.</p>
            `
        }
    };
    
    // Store help content globally
    window.helpContent = helpContent;
}

// Show help modal
function showHelp(page) {
    const content = window.helpContent && window.helpContent[page];
    if (!content) return;
    
    const modal = document.createElement('div');
    modal.className = 'modal fade';
    modal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">${content.title}</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    ${content.content}
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
    
    modal.addEventListener('hidden.bs.modal', function() {
        document.body.removeChild(modal);
    });
}

// Make help function globally available
window.showHelp = showHelp;

