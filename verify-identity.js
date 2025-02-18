// Verification Page JavaScript
document.addEventListener('DOMContentLoaded', () => {
    // Scroll to verification form
    window.scrollToVerification = () => {
        document.getElementById('verificationForm').scrollIntoView({ behavior: 'smooth' });
    };

    // Drag and drop functionality
    const dragDropZone = document.getElementById('dragDropZone');
    const fileInput = document.getElementById('fileInput');

    dragDropZone.addEventListener('click', () => {
        fileInput.click();
    });

    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dragDropZone.addEventListener(eventName, preventDefaults, false);
    });

    function preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    }

    ['dragenter', 'dragover'].forEach(eventName => {
        dragDropZone.addEventListener(eventName, highlight, false);
    });

    ['dragleave', 'drop'].forEach(eventName => {
        dragDropZone.addEventListener(eventName, unhighlight, false);
    });

    function highlight() {
        dragDropZone.classList.add('drag-highlight');
    }

    function unhighlight() {
        dragDropZone.classList.remove('drag-highlight');
    }

    dragDropZone.addEventListener('drop', handleDrop, false);
    fileInput.addEventListener('change', handleFileSelect, false);

    function handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;
        handleFiles(files);
    }

    function handleFileSelect(e) {
        const files = e.target.files;
        handleFiles(files);
    }

    function handleFiles(files) {
        if (files.length > 0) {
            startVerification(files[0]);
        }
    }

    // Verification process simulation
    function startVerification(file) {
        // Show progress section
        const progressSection = document.querySelector('.verification-progress');
        const resultSection = document.querySelector('.verification-result');
        progressSection.style.display = 'block';
        resultSection.style.display = 'none';

        // Update UI for each step
        const steps = document.querySelectorAll('.step');
        let currentStep = 0;

        function updateStep() {
            steps.forEach((step, index) => {
                if (index < currentStep) {
                    step.classList.remove('active');
                    step.classList.add('complete');
                } else if (index === currentStep) {
                    step.classList.add('active');
                    step.classList.remove('complete');
                } else {
                    step.classList.remove('active', 'complete');
                }
            });
        }

        // Simulate verification process
        function simulateVerification() {
            updateStep();
            
            if (currentStep < steps.length) {
                setTimeout(() => {
                    currentStep++;
                    simulateVerification();
                }, 2000); // Each step takes 2 seconds
            } else {
                // Show verification result
                setTimeout(() => {
                    showVerificationResult(file);
                }, 1000);
            }
        }

        simulateVerification();
    }

    function showVerificationResult(file) {
        const progressSection = document.querySelector('.verification-progress');
        const resultSection = document.querySelector('.verification-result');
        
        // Generate random verification hash
        const hash = Array.from({length: 64}, () => Math.floor(Math.random() * 16).toString(16)).join('');
        
        // Update result details
        document.getElementById('docType').textContent = file.name.split('.').slice(0, -1).join('.');
        document.getElementById('verificationHash').textContent = `0x${hash.substring(0, 8)}...${hash.substring(56)}`;
        document.getElementById('verificationDate').textContent = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });

        // Show result section
        progressSection.style.display = 'none';
        resultSection.style.display = 'block';

        // Add animation
        resultSection.style.opacity = '0';
        resultSection.style.transform = 'translateY(20px)';
        requestAnimationFrame(() => {
            resultSection.style.transition = 'all 0.5s ease';
            resultSection.style.opacity = '1';
            resultSection.style.transform = 'translateY(0)';
        });
    }

    // Action buttons functionality
    document.querySelector('.action-btn.download').addEventListener('click', () => {
        // Implement download functionality
        console.log('Downloading verification certificate...');
    });

    document.querySelector('.action-btn.share').addEventListener('click', () => {
        // Implement share functionality
        console.log('Opening share dialog...');
    });

    document.querySelector('.action-btn.store').addEventListener('click', () => {
        // Implement wallet storage
        console.log('Connecting to Web3 wallet...');
    });
});
