document.addEventListener('DOMContentLoaded', function() {
    // Role Selection
    const roleButtons = document.querySelectorAll('.role-btn');
    const signupForm = document.getElementById('signupForm');
    const individualFields = document.querySelectorAll('.individual-fields');
    const organizationFields = document.querySelectorAll('.organization-fields');

    roleButtons.forEach(button => {
        button.addEventListener('click', () => {
            roleButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            const role = button.dataset.role;
            
            if (role === 'individual') {
                individualFields.forEach(field => field.style.display = 'block');
                organizationFields.forEach(field => field.style.display = 'none');
            } else {
                individualFields.forEach(field => field.style.display = 'none');
                organizationFields.forEach(field => field.style.display = 'block');
            }
        });
    });

    // Populate Country, Nationality, and Language Dropdowns
    const countries = [
        "United States", "United Kingdom", "Canada", "Australia", "Germany", "France", "Japan", "India", "China", 
        // Add more countries as needed
    ];

    const languages = [
        "English", "Spanish", "French", "German", "Chinese", "Japanese", "Hindi", "Arabic",
        // Add more languages as needed
    ];

    function populateDropdown(selectId, options) {
        const select = document.getElementById(selectId);
        if (!select) return;

        options.forEach(option => {
            const opt = document.createElement('option');
            opt.value = option.toLowerCase().replace(/\s+/g, '_');
            opt.textContent = option;
            select.appendChild(opt);
        });
    }

    populateDropdown('nationality', countries);
    populateDropdown('language', languages);
    populateDropdown('country', countries);
    populateDropdown('businessCountry', countries);

    // Multi-step Form Navigation
    const nextButtons = document.querySelectorAll('.next-step');
    const prevButtons = document.querySelectorAll('.prev-step');
    const formSteps = document.querySelectorAll('.form-step');
    const progressSteps = document.querySelectorAll('.progress-step');

    nextButtons.forEach(button => {
        button.addEventListener('click', () => {
            const currentStep = button.closest('.form-step');
            if (validateStep(currentStep)) {
                const nextStep = currentStep.nextElementSibling;
                
                if (nextStep) {
                    currentStep.classList.remove('active');
                    nextStep.classList.add('active');
                    
                    const nextStepNumber = parseInt(nextStep.dataset.step);
                    updateProgress(nextStepNumber);
                }
            }
        });
    });

    prevButtons.forEach(button => {
        button.addEventListener('click', () => {
            const currentStep = button.closest('.form-step');
            const prevStep = currentStep.previousElementSibling;
            
            if (prevStep) {
                currentStep.classList.remove('active');
                prevStep.classList.add('active');
                
                const prevStepNumber = parseInt(prevStep.dataset.step);
                updateProgress(prevStepNumber);
            }
        });
    });

    function validateStep(step) {
        const requiredFields = step.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            if (!field.value) {
                isValid = false;
                field.classList.add('error');
                showError(field, 'This field is required');
            } else {
                field.classList.remove('error');
                removeError(field);
            }
        });

        return isValid;
    }

    function showError(field, message) {
        const existingError = field.nextElementSibling?.classList.contains('error-message');
        if (!existingError) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'error-message';
            errorDiv.textContent = message;
            field.parentNode.insertBefore(errorDiv, field.nextSibling);
        }
    }

    function removeError(field) {
        const errorDiv = field.nextElementSibling;
        if (errorDiv?.classList.contains('error-message')) {
            errorDiv.remove();
        }
    }

    function updateProgress(step) {
        progressSteps.forEach(progressStep => {
            const stepNumber = parseInt(progressStep.dataset.step);
            if (stepNumber <= step) {
                progressStep.classList.add('active');
            } else {
                progressStep.classList.remove('active');
            }
        });
    }

    // Password Strength
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    const strengthBars = document.querySelectorAll('.strength-bar');
    const strengthTexts = document.querySelectorAll('.strength-text');

    passwordInputs.forEach((input, index) => {
        if (input.placeholder.includes('Create')) {
            input.addEventListener('input', () => {
                const strength = calculatePasswordStrength(input.value);
                updatePasswordStrength(strength, strengthBars[index], strengthTexts[index]);
            });
        }
    });

    function calculatePasswordStrength(password) {
        let score = 0;
        
        // Length check
        if (password.length >= 8) score += 20;
        if (password.length >= 12) score += 10;
        
        // Character type checks
        if (password.match(/[a-z]/)) score += 10;
        if (password.match(/[A-Z]/)) score += 20;
        if (password.match(/[0-9]/)) score += 20;
        if (password.match(/[^a-zA-Z0-9]/)) score += 20;
        
        // Complexity checks
        if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) score += 10;
        if (password.match(/([a-zA-Z]).*[0-9]|[0-9].*([a-zA-Z])/)) score += 10;
        if (password.match(/([a-zA-Z0-9].*[^a-zA-Z0-9])|([^a-zA-Z0-9].*[a-zA-Z0-9])/)) score += 10;

        return Math.min(100, score);
    }

    function updatePasswordStrength(strength, bar, text) {
        bar.style.width = `${strength}%`;
        bar.style.background = getStrengthColor(strength);
        
        let strengthLabel = 'Weak';
        if (strength >= 80) strengthLabel = 'Very Strong';
        else if (strength >= 60) strengthLabel = 'Strong';
        else if (strength >= 40) strengthLabel = 'Medium';
        
        text.textContent = `Password strength: ${strengthLabel}`;
        text.style.color = getStrengthColor(strength);
    }

    function getStrengthColor(strength) {
        if (strength >= 80) return '#22c55e';
        if (strength >= 60) return '#3b82f6';
        if (strength >= 40) return '#f59e0b';
        return '#ef4444';
    }

    // Toggle Password Visibility
    const togglePasswordButtons = document.querySelectorAll('.toggle-password');
    
    togglePasswordButtons.forEach(button => {
        button.addEventListener('click', () => {
            const input = button.previousElementSibling;
            const type = input.type === 'password' ? 'text' : 'password';
            input.type = type;
            
            const icon = button.querySelector('i');
            icon.className = `fas fa-${type === 'password' ? 'eye' : 'eye-slash'}`;
        });
    });

    // File Upload Handling
    const fileInputs = document.querySelectorAll('input[type="file"]');
    
    fileInputs.forEach(input => {
        const label = input.nextElementSibling.querySelector('span');
        const originalText = label.textContent;
        
        input.addEventListener('change', () => {
            if (input.files.length > 0) {
                label.textContent = input.files[0].name;
            } else {
                label.textContent = originalText;
            }
        });

        // Drag and drop support
        const dropZone = input.parentElement;
        
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('dragover');
        });
        
        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('dragover');
        });
        
        dropZone.addEventListener('drop', (e) => {
            e.preventDefault();
            dropZone.classList.remove('dragover');
            
            if (e.dataTransfer.files.length) {
                input.files = e.dataTransfer.files;
                label.textContent = e.dataTransfer.files[0].name;
            }
        });
    });

    // 2FA Selection
    const twoFactorOptions = document.querySelectorAll('input[name="2fa"]');
    const authenticatorSetup = document.getElementById('authenticatorSetup');

    twoFactorOptions.forEach(option => {
        option.addEventListener('change', () => {
            if (option.value === 'authenticator') {
                authenticatorSetup.style.display = 'block';
                // Here you would typically generate and display a QR code
                generateQRCode();
            } else {
                authenticatorSetup.style.display = 'none';
            }
        });
    });

    function generateQRCode() {
        // Simulated QR code generation
        const qrCode = document.querySelector('.qr-code');
        qrCode.innerHTML = `
            <div style="background: #f3f4f6; padding: 1rem; text-align: center;">
                <i class="fas fa-qrcode fa-5x"></i>
                <p style="margin-top: 1rem;">Scan with Google Authenticator</p>
            </div>
        `;
    }

    // Web3 Wallet Integration
    const walletButtons = document.querySelectorAll('.wallet-btn');
    
    walletButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const walletType = button.classList[1];
            try {
                await connectWallet(walletType);
            } catch (error) {
                console.error('Wallet connection error:', error);
                alert('Unable to connect wallet. Please make sure you have the wallet extension installed.');
            }
        });
    });

    async function connectWallet(walletType) {
        if (walletType === 'metamask') {
            if (typeof window.ethereum !== 'undefined') {
                try {
                    await window.ethereum.request({ method: 'eth_requestAccounts' });
                    // Handle successful connection
                    button.classList.add('connected');
                    button.querySelector('span').textContent = 'Connected';
                } catch (error) {
                    throw new Error('User rejected connection');
                }
            } else {
                throw new Error('MetaMask is not installed');
            }
        }
        // Add support for other wallet types as needed
    }

    // Form Submission
    signupForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const formData = new FormData(signupForm);
        const role = document.querySelector('.role-btn.active').dataset.role;
        formData.append('role', role);

        try {
            // Here you would typically send the form data to your server
            console.log('Form submitted successfully');
            // Redirect to success page or show success message
        } catch (error) {
            console.error('Form submission error:', error);
            alert('An error occurred while creating your account. Please try again.');
        }
    });
});
