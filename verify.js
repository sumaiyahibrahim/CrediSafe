/ Import required libraries
import { sha256 } from 'crypto-js';
import { ethers } from 'ethers';
import QrScanner from 'qr-scanner';

document.addEventListener('DOMContentLoaded', function() {
    // Initialize UI Components
    initMethodTabs();
    initFileUpload();
    initQRScanner();
    initWalletConnection();
    initHashVerification();
    initActivityLog();

    // Global state
    let selectedCategory = null;
    let uploadedFiles = [];
    let verificationInProgress = false;

    // Method Tab Switching
    function initMethodTabs() {
        const tabs = document.querySelectorAll('.method-tab');
        const panels = document.querySelectorAll('.method-panel');

        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                const method = tab.dataset.method;
                
                // Update active states
                tabs.forEach(t => t.classList.remove('active'));
                panels.forEach(p => p.classList.remove('active'));
                
                tab.classList.add('active');
                document.getElementById(`${method}-panel`).classList.add('active');
            });
        });
    }

    // Category Selection
    const categoryCards = document.querySelectorAll('.category-card');
    categoryCards.forEach(card => {
        card.addEventListener('click', () => {
            categoryCards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            selectedCategory = card.dataset.category;
        });
    });

    // File Upload Handling
    function initFileUpload() {
        const dropZone = document.querySelector('.file-upload-area');
        const fileInput = document.getElementById('credential-file');
        const preview = document.querySelector('.upload-preview');

        // Drag and drop handlers
        dropZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            dropZone.classList.add('dragover');
        });

        dropZone.addEventListener('dragleave', () => {
            dropZone.classList.remove('dragover');
        });

        dropZone.addEventListener('drop', async (e) => {
            e.preventDefault();
            dropZone.classList.remove('dragover');
            
            const files = e.dataTransfer.files;
            await handleFiles(files);
        });

        fileInput.addEventListener('change', async () => {
            await handleFiles(fileInput.files);
        });

        async function handleFiles(files) {
            for (const file of files) {
                if (validateFile(file)) {
                    const fileHash = await generateFileHash(file);
                    uploadedFiles.push({
                        file,
                        hash: fileHash
                    });
                    updateFilePreview();
                }
            }
        }

        function validateFile(file) {
            const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            const maxSize = 10 * 1024 * 1024; // 10MB

            if (!allowedTypes.includes(file.type)) {
                showError('Invalid file type. Please upload PDF, JPG, PNG, or DOC files.');
                return false;
            }

            if (file.size > maxSize) {
                showError('File size exceeds 10MB limit.');
                return false;
            }

            return true;
        }

        async function generateFileHash(file) {
            return new Promise((resolve) => {
                const reader = new FileReader();
                reader.onload = async (e) => {
                    const fileContent = e.target.result;
                    const hash = sha256(fileContent).toString();
                    resolve(hash);
                };
                reader.readAsArrayBuffer(file);
            });
        }

        function updateFilePreview() {
            preview.innerHTML = uploadedFiles.map((file, index) => `
                <div class="file-preview-item">
                    <i class="fas fa-file"></i>
                    <span>${file.file.name}</span>
                    <div class="file-actions">
                        <button onclick="removeFile(${index})">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>
            `).join('');
        }
    }

    // QR Scanner Implementation
    function initQRScanner() {
        let qrScanner = null;
        const video = document.getElementById('qr-video');
        const startButton = document.getElementById('start-scan');

        startButton.addEventListener('click', () => {
            if (qrScanner && qrScanner.isScanning()) {
                qrScanner.stop();
                startButton.innerHTML = '<i class="fas fa-camera"></i> Start Scanner';
            } else {
                startQRScanner();
                startButton.innerHTML = '<i class="fas fa-stop"></i> Stop Scanner';
            }
        });

        async function startQRScanner() {
            try {
                qrScanner = new QrScanner(video, result => handleQRResult(result), {
                    highlightScanRegion: true,
                    highlightCodeOutline: true,
                });
                await qrScanner.start();
            } catch (error) {
                showError('Unable to start camera. Please ensure camera permissions are granted.');
            }
        }

        async function handleQRResult(result) {
            qrScanner.stop();
            startButton.innerHTML = '<i class="fas fa-camera"></i> Start Scanner';
            
            try {
                // Verify the QR code hash
                await verifyCredentialHash(result.data);
            } catch (error) {
                showError('Invalid QR code format.');
            }
        }
    }

    // Wallet Connection
    function initWalletConnection() {
        const walletButtons = document.querySelectorAll('.wallet-btn');
        
        walletButtons.forEach(button => {
            button.addEventListener('click', async () => {
                const walletType = button.classList[1];
                try {
                    await connectWallet(walletType);
                } catch (error) {
                    showError('Unable to connect wallet. Please ensure you have the wallet extension installed.');
                }
            });
        });

        async function connectWallet(walletType) {
            if (walletType === 'metamask') {
                if (typeof window.ethereum !== 'undefined') {
                    try {
                        const provider = new ethers.providers.Web3Provider(window.ethereum);
                        await provider.send("eth_requestAccounts", []);
                        const signer = provider.getSigner();
                        const address = await signer.getAddress();
                        
                        // Verify DID
                        await verifyDID(address);
                    } catch (error) {
                        throw new Error('User rejected connection');
                    }
                } else {
                    throw new Error('MetaMask is not installed');
                }
            }
            // Add support for other wallet types
        }

        async function verifyDID(address) {
            // Implement DID verification logic
            console.log('Verifying DID for address:', address);
        }
    }

    // Hash Verification
    function initHashVerification() {
        const hashInput = document.querySelector('.hash-input');
        
        hashInput.addEventListener('input', async () => {
            const hash = hashInput.value.trim();
            if (hash.length === 64) { // SHA-256 hash length
                await verifyCredentialHash(hash);
            }
        });
    }

    // Credential Verification
    async function verifyCredentialHash(hash) {
        if (verificationInProgress) return;
        verificationInProgress = true;

        try {
            showVerificationProgress();
            
            // Simulate API call to verify credential
            const result = await simulateVerification(hash);
            
            if (result.verified) {
                showVerificationResults(result);
                addActivityLog({
                    type: 'success',
                    message: 'Credential verified successfully',
                    hash: hash.substring(0, 8) + '...'
                });
            } else {
                showError('Credential verification failed. Please ensure the hash is correct.');
                addActivityLog({
                    type: 'error',
                    message: 'Credential verification failed',
                    hash: hash.substring(0, 8) + '...'
                });
            }
        } catch (error) {
            showError('An error occurred during verification.');
        } finally {
            verificationInProgress = false;
        }
    }

    // Activity Log
    function initActivityLog() {
        const activityList = document.querySelector('.activity-list');
        
        // Load initial activities
        const activities = [
            {
                type: 'success',
                message: 'Academic transcript verified',
                timestamp: new Date().toISOString()
            },
            {
                type: 'pending',
                message: 'Driver\'s license verification in progress',
                timestamp: new Date().toISOString()
            }
        ];

        activities.forEach(activity => addActivityLog(activity));
    }

    function addActivityLog(activity) {
        const activityList = document.querySelector('.activity-list');
        const activityItem = document.createElement('div');
        activityItem.className = `activity-item ${activity.type}`;
        
        activityItem.innerHTML = `
            <i class="fas fa-${getActivityIcon(activity.type)}"></i>
            <div class="activity-content">
                <p>${activity.message}</p>
                <small>${formatTimestamp(activity.timestamp || new Date())}</small>
            </div>
        `;

        activityList.insertBefore(activityItem, activityList.firstChild);
    }

    // Utility Functions
    function showError(message) {
        // Implement error notification
        console.error(message);
    }

    function showVerificationProgress() {
        // Implement progress indicator
    }

    function showVerificationResults(result) {
        const resultsSection = document.querySelector('.verification-results');
        resultsSection.style.display = 'block';
        
        // Update result details
        document.getElementById('credential-type').textContent = result.type;
        document.getElementById('credential-issuer').textContent = result.issuer;
        document.getElementById('credential-date').textContent = result.issueDate;
        document.getElementById('blockchain-timestamp').textContent = result.blockchainTimestamp;
        document.getElementById('credential-hash').textContent = result.hash;
    }

    function getActivityIcon(type) {
        const icons = {
            success: 'check-circle',
            error: 'times-circle',
            pending: 'clock'
        };
        return icons[type] || 'info-circle';
    }

    function formatTimestamp(timestamp) {
        return new Date(timestamp).toLocaleString();
    }

    // Simulated Verification (Replace with actual API calls)
    async function simulateVerification(hash) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve({
                    verified: true,
                    type: 'Academic Degree',
                    issuer: 'Stanford University',
                    issueDate: '2024-01-15',
                    blockchainTimestamp: '2024-01-15 14:30:45 UTC',
                    hash: hash
                });
            }, 2000);
        });
    }
});
