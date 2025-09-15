// MyPet Adventures - Interactive Features with Multi-Animal Animation
(() => {
    'use strict';

    // Canvas and animation variables
    const canvas = document.getElementById('animalCanvas');
    const context = canvas.getContext('2d');
    let animationId;
    let particles = [];
    let animals = [];
    let frameCount = 0;
    let lastTime = 0;

    // Animal types configuration
    const animalTypes = {
        dog: {
            color: '#8B4513',
            size: { width: 40, height: 30 },
            speed: 1.8,
            frames: 8,
            frameWidth: 40,
            frameHeight: 30,
            y: 70,
            emoji: '🐕'
        },
        bird: {
            color: '#4169E1',
            size: { width: 25, height: 20 },
            speed: 2.2,
            frames: 6,
            frameWidth: 25,
            frameHeight: 20,
            y: 30,
            emoji: '🐦'
        },
        snake: {
            color: '#228B22',
            size: { width: 35, height: 15 },
            speed: 1.2,
            frames: 4,
            frameWidth: 35,
            frameHeight: 15,
            y: 90,
            emoji: '🐍'
        },
        cat: {
            color: '#FF6347',
            size: { width: 35, height: 25 },
            speed: 2.0,
            frames: 6,
            frameWidth: 35,
            frameHeight: 25,
            y: 80,
            emoji: '🐱'
        },
        rabbit: {
            color: '#DDA0DD',
            size: { width: 20, height: 25 },
            speed: 2.5,
            frames: 8,
            frameWidth: 20,
            frameHeight: 25,
            y: 75,
            emoji: '🐰'
        }
    };

    // DOM elements
    const chatInput = document.getElementById('chatInput');
    const sendButton = document.querySelector('.control-btn-send');
    const voiceButton = document.querySelector('.control-btn[aria-label="Voice input"]');
    const attachButton = document.querySelector('.control-btn[aria-label="Attach file"]');
    const publicButton = document.querySelector('.control-btn[aria-label="Make public"]');

    // Initialize the application
    function init() {
        setupEventListeners();
        setupCanvas();
        setupAnimations();
        startAnimation();
    }

    // Set up event listeners
    function setupEventListeners() {
        // Send message functionality
        if (sendButton) {
            sendButton.addEventListener('click', handleSendMessage);
        }

        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSendMessage();
                }
            });

            // Auto-resize input
            chatInput.addEventListener('input', () => {
                chatInput.style.height = 'auto';
                chatInput.style.height = chatInput.scrollHeight + 'px';
            });
        }

        // Voice input (placeholder functionality)
        if (voiceButton) {
            voiceButton.addEventListener('click', handleVoiceInput);
        }

        // File attachment (placeholder functionality)
        if (attachButton) {
            attachButton.addEventListener('click', handleFileAttachment);
        }

        // Public/Private toggle
        if (publicButton) {
            publicButton.addEventListener('click', handlePublicToggle);
        }

        // Add hover effects to control buttons
        const controlButtons = document.querySelectorAll('.control-btn');
        controlButtons.forEach(btn => {
            btn.addEventListener('mouseenter', () => {
                btn.style.transform = 'scale(1.1)';
            });
            
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'scale(1)';
            });
        });
    }

    // Handle sending messages
    function handleSendMessage() {
        const message = chatInput.value.trim();
        
        if (!message) {
            // Add shake animation to input
            chatInput.style.animation = 'shake 0.5s ease-in-out';
            setTimeout(() => {
                chatInput.style.animation = '';
            }, 500);
            return;
        }

        // Show loading state
        showLoadingState();

        // Simulate AI response (in a real app, this would call an API)
        setTimeout(() => {
            showResponse(message);
            chatInput.value = '';
            chatInput.style.height = 'auto';
        }, 1500);
    }

    // Show loading state
    function showLoadingState() {
        const originalText = sendButton.querySelector('.control-icon').textContent;
        sendButton.querySelector('.control-icon').textContent = '⏳';
        sendButton.disabled = true;
        
        // Revert after delay
        setTimeout(() => {
            sendButton.querySelector('.control-icon').textContent = originalText;
            sendButton.disabled = false;
        }, 1500);
    }

    // Show AI response (placeholder)
    function showResponse(userMessage) {
        // Create response element
        const responseDiv = document.createElement('div');
        responseDiv.className = 'ai-response';
        responseDiv.innerHTML = `
            <div class="response-content">
                <h3>🐾 Adventure Plan Generated!</h3>
                <p>I've created a personalized adventure plan based on your request: "${userMessage}"</p>
                <div class="response-actions">
                    <button class="btn btn-primary">View Plan</button>
                    <button class="btn btn-outline">Customize</button>
                </div>
            </div>
        `;

        // Insert after chat container
        const chatContainer = document.querySelector('.chat-container');
        chatContainer.parentNode.insertBefore(responseDiv, chatContainer.nextSibling);

        // Animate in
        responseDiv.style.opacity = '0';
        responseDiv.style.transform = 'translateY(20px)';
        setTimeout(() => {
            responseDiv.style.transition = 'all 0.3s ease';
            responseDiv.style.opacity = '1';
            responseDiv.style.transform = 'translateY(0)';
        }, 100);

        // Remove after 10 seconds
        setTimeout(() => {
            responseDiv.style.transition = 'all 0.3s ease';
            responseDiv.style.opacity = '0';
            responseDiv.style.transform = 'translateY(-20px)';
            setTimeout(() => {
                responseDiv.remove();
            }, 300);
        }, 10000);
    }

    // Handle voice input (placeholder)
    function handleVoiceInput() {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            alert('Voice input is not supported in this browser. Please type your message instead.');
            return;
        }

        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = 'en-US';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onstart = () => {
            voiceButton.style.background = '#4f46e5';
            voiceButton.style.color = 'white';
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            chatInput.value = transcript;
            chatInput.focus();
        };

        recognition.onend = () => {
            voiceButton.style.background = '';
            voiceButton.style.color = '';
        };

        recognition.start();
    }

    // Handle file attachment (placeholder)
    function handleFileAttachment() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'image/*,video/*';
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (file) {
                // Show file attached indicator
                attachButton.style.background = '#10b981';
                attachButton.style.color = 'white';
                attachButton.querySelector('.control-icon').textContent = '✓';
                
                setTimeout(() => {
                    attachButton.style.background = '';
                    attachButton.style.color = '';
                    attachButton.querySelector('.control-icon').textContent = '📎';
                }, 2000);
            }
        };
        input.click();
    }

    // Handle public/private toggle
    function handlePublicToggle() {
        const isPublic = publicButton.classList.contains('active');
        
        if (isPublic) {
            publicButton.classList.remove('active');
            publicButton.style.background = '';
            publicButton.style.color = '';
            publicButton.querySelector('.control-icon').textContent = '🌐';
        } else {
            publicButton.classList.add('active');
            publicButton.style.background = '#4f46e5';
            publicButton.style.color = 'white';
            publicButton.querySelector('.control-icon').textContent = '🔒';
        }
    }

    // Set up canvas
    function setupCanvas() {
        // Set canvas size to match container
        const resizeCanvas = () => {
            const container = canvas.parentElement;
            canvas.width = container.offsetWidth;
            canvas.height = container.offsetHeight;
        };
        
        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
    }

    // Set up animations
    function setupAnimations() {
        // Initialize particles
        initParticles();
        
        // Initialize animals
        initAnimals();
        
        // Add shake animation CSS
        const style = document.createElement('style');
        style.textContent = `
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                25% { transform: translateX(-5px); }
                75% { transform: translateX(5px); }
            }
            
            .ai-response {
                margin-top: 24px;
                padding: 20px;
                background: rgba(255, 255, 255, 0.95);
                border-radius: 16px;
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.2);
            }
            
            .response-content h3 {
                color: #1a1a1a;
                margin-bottom: 12px;
                font-size: 18px;
            }
            
            .response-content p {
                color: #4a4a4a;
                margin-bottom: 16px;
            }
            
            .response-actions {
                display: flex;
                gap: 12px;
                flex-wrap: wrap;
            }
            
            .response-actions .btn {
                font-size: 14px;
                padding: 8px 16px;
            }
        `;
        document.head.appendChild(style);
    }

    // Initialize particles (based on the GitHub repo)
    function initParticles() {
        particles = [];
        for (let i = 0; i < 50; i++) {
            particles.push(new Particle());
        }
    }

    // Particle class (based on the GitHub repo)
    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * (canvas.height / 2) + canvas.height / 4;
            this.vx = (Math.random() - 0.5) * 2;
            this.vy = (Math.random() - 0.5) * 2;
            this.alpha = Math.random() * 0.5 + 0.3;
            this.size = Math.random() * 3 + 1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;
            
            // Wrap around screen
            if (this.x < 0) this.x = canvas.width;
            if (this.x > canvas.width) this.x = 0;
            if (this.y < 0) this.y = canvas.height;
            if (this.y > canvas.height) this.y = 0;
        }

        draw() {
            context.save();
            context.globalAlpha = this.alpha;
            context.fillStyle = '#D95D50';
            context.beginPath();
            context.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            context.fill();
            context.restore();
        }
    }

    // Initialize animals
    function initAnimals() {
        animals = [];
        
        // Create initial chase sequence: snake -> bird -> cat -> rabbit -> dog
        const chaseOrder = ['snake', 'bird', 'cat', 'rabbit', 'dog'];
        
        chaseOrder.forEach((type, index) => {
            setTimeout(() => {
                animals.push(new Animal(type, -100 - (index * 120)));
            }, index * 600);
        });
        
        // Restart the chase sequence every 8 seconds for constant flow
        setInterval(() => {
            chaseOrder.forEach((type, index) => {
                setTimeout(() => {
                    animals.push(new Animal(type, -100 - (index * 120)));
                }, index * 600);
            });
        }, 8000);
        
        // Add random animals every 2-4 seconds for variety
        setInterval(() => {
            const types = Object.keys(animalTypes);
            const randomType = types[Math.floor(Math.random() * types.length)];
            animals.push(new Animal(randomType, -100));
        }, 2000 + Math.random() * 2000);
    }

    // Animal class
    class Animal {
        constructor(type, startX = -100) {
            this.type = type;
            this.config = animalTypes[type];
            this.x = startX;
            this.y = this.config.y;
            this.frameIndex = 0;
            this.animationSpeed = 0.3;
            this.speed = this.config.speed;
            this.isActive = true;
            this.originalSpeed = this.config.speed;
            this.chaseTarget = null;
            this.energy = 100;
        }

        update() {
            if (!this.isActive) return;
            
            // Update position
            this.x += this.speed;
            this.frameIndex += this.animationSpeed;
            
            // Reset frame index
            if (this.frameIndex >= this.config.frames) {
                this.frameIndex = 0;
            }
            
            // Chase behavior - speed up when chasing
            this.updateChaseBehavior();
            
            // Add some vertical movement for more dynamic animation
            this.y = this.config.y + Math.sin(this.frameIndex * 0.5) * 2;
            
            // Remove if off screen
            if (this.x > canvas.width + 100) {
                this.isActive = false;
            }
        }

        updateChaseBehavior() {
            // Find the animal ahead in the chase sequence
            const chaseOrder = ['snake', 'bird', 'cat', 'rabbit', 'dog'];
            const currentIndex = chaseOrder.indexOf(this.type);
            const targetType = chaseOrder[currentIndex + 1];
            
            if (targetType) {
                const target = animals.find(animal => 
                    animal.type === targetType && 
                    animal.isActive && 
                    animal.x > this.x && 
                    animal.x < this.x + 300
                );
                
                if (target) {
                    // Speed up when chasing (less aggressive)
                    this.speed = this.originalSpeed * 1.15;
                    this.chaseTarget = target;
                } else {
                    this.speed = this.originalSpeed;
                    this.chaseTarget = null;
                }
            }
        }

        draw() {
            if (!this.isActive) return;
            
            context.save();
            
            // Draw shadow
            context.fillStyle = 'rgba(0, 0, 0, 0.2)';
            context.fillRect(
                this.x + 2, 
                this.y + this.config.size.height + 2, 
                this.config.size.width, 
                4
            );
            
            // Draw animal body with gradient
            const gradient = context.createLinearGradient(
                this.x, this.y, 
                this.x + this.config.size.width, 
                this.y + this.config.size.height
            );
            gradient.addColorStop(0, this.config.color);
            gradient.addColorStop(1, this.lightenColor(this.config.color, 20));
            
            context.fillStyle = gradient;
            context.fillRect(
                this.x, 
                this.y, 
                this.config.size.width, 
                this.config.size.height
            );
            
            // Add border
            context.strokeStyle = this.darkenColor(this.config.color, 20);
            context.lineWidth = 1;
            context.strokeRect(
                this.x, 
                this.y, 
                this.config.size.width, 
                this.config.size.height
            );
            
            // Draw emoji
            context.font = '20px Arial';
            context.textAlign = 'center';
            context.fillText(
                this.config.emoji, 
                this.x + this.config.size.width / 2, 
                this.y + this.config.size.height / 2 + 7
            );
            
            // Add running effect (bobbing motion)
            const bobOffset = Math.sin(this.frameIndex * 2) * 2;
            context.translate(0, bobOffset);
            
            // Draw simple running animation effect
            if (this.type === 'dog' || this.type === 'cat' || this.type === 'rabbit') {
                // Draw legs
                context.fillStyle = this.darkenColor(this.config.color, 30);
                const legHeight = 8;
                const legSpacing = this.config.size.width / 4;
                
                for (let i = 0; i < 4; i++) {
                    const legX = this.x + (i * legSpacing) + legSpacing / 2;
                    const legY = this.y + this.config.size.height;
                    const legBob = Math.sin((this.frameIndex + i * 0.5) * 4) * 3;
                    
                    context.fillRect(legX, legY + legBob, 3, legHeight);
                }
            }
            
            // Add chase effect (speed lines)
            if (this.chaseTarget) {
                context.strokeStyle = 'rgba(255, 255, 255, 0.6)';
                context.lineWidth = 1;
                for (let i = 0; i < 3; i++) {
                    context.beginPath();
                    context.moveTo(this.x - 10 - (i * 5), this.y + 5);
                    context.lineTo(this.x - 5 - (i * 5), this.y + 5);
                    context.stroke();
                }
            }
            
            context.restore();
        }

        lightenColor(color, percent) {
            const num = parseInt(color.replace("#", ""), 16);
            const amt = Math.round(2.55 * percent);
            const R = (num >> 16) + amt;
            const G = (num >> 8 & 0x00FF) + amt;
            const B = (num & 0x0000FF) + amt;
            return "#" + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
                (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
                (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
        }

        darkenColor(color, percent) {
            const num = parseInt(color.replace("#", ""), 16);
            const amt = Math.round(2.55 * percent);
            const R = (num >> 16) - amt;
            const G = (num >> 8 & 0x00FF) - amt;
            const B = (num & 0x0000FF) - amt;
            return "#" + (0x1000000 + (R > 255 ? 255 : R < 0 ? 0 : R) * 0x10000 +
                (G > 255 ? 255 : G < 0 ? 0 : G) * 0x100 +
                (B > 255 ? 255 : B < 0 ? 0 : B)).toString(16).slice(1);
        }
    }

    // Start animation loop
    function startAnimation() {
        function animate(currentTime) {
            // Clear canvas
            context.clearRect(0, 0, canvas.width, canvas.height);
            
            // Update and draw particles
            particles.forEach(particle => {
                particle.update();
                particle.draw();
            });
            
            // Update and draw animals
            animals.forEach(animal => {
                animal.update();
                animal.draw();
            });
            
            // Remove inactive animals
            animals = animals.filter(animal => animal.isActive);
            
            // Ensure minimum number of animals for constant flow
            if (animals.length < 2 && Math.random() < 0.01) {
                const types = Object.keys(animalTypes);
                const randomType = types[Math.floor(Math.random() * types.length)];
                animals.push(new Animal(randomType, -100));
            }
            
            frameCount++;
            animationId = requestAnimationFrame(animate);
        }
        
        animationId = requestAnimationFrame(animate);
    }

    // Initialize when DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();