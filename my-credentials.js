// My Credentials Page JavaScript
document.addEventListener('DOMContentLoaded', () => {
    // Initialize tooltips for action buttons
    const actionButtons = document.querySelectorAll('.btn-icon');
    actionButtons.forEach(button => {
        const title = button.getAttribute('title');
        button.addEventListener('mouseover', (e) => {
            showTooltip(e, title);
        });
        button.addEventListener('mouseout', hideTooltip);
    });

    // Add New Credential Button
    const addCredentialBtn = document.querySelector('.btn-primary');
    if (addCredentialBtn) {
        addCredentialBtn.addEventListener('click', () => {
            // TODO: Implement add credential modal
            console.log('Add new credential clicked');
        });
    }

    // Export All Button
    const exportBtn = document.querySelector('.btn-secondary');
    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            // TODO: Implement export functionality
            console.log('Export all clicked');
        });
    }

    // Share Buttons
    const shareButtons = document.querySelectorAll('.btn-icon[title="Share"]');
    shareButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const card = e.target.closest('.credential-card');
            const credentialTitle = card.querySelector('h3').textContent;
            const issuer = card.querySelector('.issuer').textContent;
            
            // TODO: Implement proper sharing functionality
            console.log(`Sharing ${credentialTitle} from ${issuer}`);
        });
    });

    // Download Buttons
    const downloadButtons = document.querySelectorAll('.btn-icon[title="Download"]');
    downloadButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const card = e.target.closest('.credential-card');
            const credentialTitle = card.querySelector('h3').textContent;
            
            // TODO: Implement proper download functionality
            console.log(`Downloading ${credentialTitle}`);
        });
    });

    // View Details Buttons
    const viewButtons = document.querySelectorAll('.btn-icon[title="View Details"]');
    viewButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            const card = e.target.closest('.credential-card');
            const credentialTitle = card.querySelector('h3').textContent;
            
            // TODO: Implement view details modal
            console.log(`Viewing details for ${credentialTitle}`);
        });
    });
});

// Tooltip functionality
function showTooltip(event, text) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = text;
    
    // Position the tooltip
    const button = event.target.closest('.btn-icon');
    const rect = button.getBoundingClientRect();
    
    tooltip.style.position = 'fixed';
    tooltip.style.top = `${rect.top - 30}px`;
    tooltip.style.left = `${rect.left + (rect.width / 2)}px`;
    tooltip.style.transform = 'translateX(-50%)';
    
    document.body.appendChild(tooltip);
    
    // Add tooltip styles
    Object.assign(tooltip.style, {
        background: 'var(--background-secondary)',
        color: 'var(--text-primary)',
        padding: '0.5rem 1rem',
        borderRadius: '0.25rem',
        fontSize: '0.875rem',
        zIndex: '1000',
        pointerEvents: 'none',
        opacity: '0',
        transition: 'opacity 0.2s ease'
    });
    
    // Trigger reflow and animate
    requestAnimationFrame(() => {
        tooltip.style.opacity = '1';
    });
}

function hideTooltip() {
    const tooltip = document.querySelector('.tooltip');
    if (tooltip) {
        tooltip.style.opacity = '0';
        setTimeout(() => tooltip.remove(), 200);
    }
}

// Add animation to cards on scroll
const observeCards = () => {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.1
    });

    document.querySelectorAll('.credential-card').forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(card);
    });
};

// Initialize card animations
observeCards();
