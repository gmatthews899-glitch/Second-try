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

    // Adventure descriptions data
    const adventureDescriptions = {
        'magical-forest': {
            title: 'Magical Forest',
            description: 'Your pet steps into a glowing forest where animals talk, mushrooms light the way, and tiny fairy houses hide secrets waiting to be discovered.'
        },
        'pirate-island': {
            title: 'Pirate Island',
            description: 'Your pet sails to a sandy island, finds an old treasure map, and teams up with friendly pirates to hunt for gold in secret caves.'
        },
        'space-station': {
            title: 'Space Station',
            description: 'Your pet blasts off to a shiny space station, floats through zero-gravity halls, and meets curious aliens who need help with a space mission.'
        },
        'underwater-kingdom': {
            title: 'Underwater Kingdom',
            description: 'Your pet dives beneath the waves into a coral palace, plays with mermaids, swims with sea turtles, and finds hidden treasure on the ocean floor.'
        },
        'ancient-castle': {
            title: 'Ancient Castle',
            description: 'Your pet explores a huge castle, sneaks through secret passageways, and befriends a kind dragon who needs help protecting the royal crown.'
        },
        'farmyard-adventure': {
            title: 'Farmyard Adventure',
            description: 'Your pet trots into a sunny farm full of clucking chickens and mooing cows, solving farmyard puzzles and helping the farmer with a mystery.'
        },
        'snowy-mountain-village': {
            title: 'Snowy Mountain Village',
            description: 'Your pet visits a snow-covered town, zips down magical ski slopes, drinks cocoa with new friends, and helps the winter animals prepare for a snow festival.'
        },
        'jungle-safari': {
            title: 'Jungle Safari',
            description: 'Your pet explores a wild jungle, swings on vines with monkeys, climbs to treehouses, and discovers a hidden waterfall full of clues.'
        },
        'desert-oasis': {
            title: 'Desert Oasis',
            description: 'Your pet journeys through hot desert sands to a sparkling oasis, finds ancient ruins, and solves riddles to unlock a mysterious cave.'
        },
        'big-city-park': {
            title: 'Big City Park',
            description: 'Your pet runs through a busy city park, splashes in fountains, meets street performers, and discovers a hidden playground no one else has seen.'
        }
    };

    // Initialize the application
    function init() {
        setupEventListeners();
        setupCanvas();
        setupAnimations();
        startAnimation();
        setupAdventureSelection();
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

        // Get Started button functionality
        const getStartedBtn = document.querySelector('.btn-primary');
        if (getStartedBtn && getStartedBtn.textContent.includes('Click here to get started')) {
            getStartedBtn.addEventListener('click', showGetStartedScreen);
        }

        // Start Creating button functionality
        const startCreatingBtn = document.querySelector('.btn-outline');
        if (startCreatingBtn && startCreatingBtn.textContent.includes('Start Creating')) {
            startCreatingBtn.addEventListener('click', navigateToStoryPage);
        }

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

        // Clear input after sending
        setTimeout(() => {
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

    // Show Get Started screen
    function showGetStartedScreen() {
        const landingPage = document.getElementById('landingPage');
        const getStartedScreen = document.getElementById('getStartedScreen');
        const nav = document.querySelector('.nav');
        const headerActions = document.querySelector('.header-actions');
        const animationContainer = document.querySelector('.animation-container');
        
        if (landingPage && getStartedScreen) {
            landingPage.style.display = 'none';
            getStartedScreen.style.display = 'block';
            
            // Hide navigation elements and animation
            if (nav) nav.style.display = 'none';
            if (headerActions) headerActions.style.display = 'none';
            if (animationContainer) animationContainer.style.display = 'none';
            
            // Add smooth transition effect
            getStartedScreen.style.opacity = '0';
            getStartedScreen.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                getStartedScreen.style.transition = 'all 0.3s ease';
                getStartedScreen.style.opacity = '1';
                getStartedScreen.style.transform = 'translateY(0)';
            }, 10);
        }
    }

    // Navigate to story page
    function navigateToStoryPage() {
        // Collect form data before navigating
        const formData = {
            species: document.getElementById('species')?.value || '',
            breed: document.getElementById('breed')?.value || '',
            petName: document.getElementById('petName')?.value || '',
            word1: document.getElementById('word1')?.value || '',
            word2: document.getElementById('word2')?.value || '',
            word3: document.getElementById('word3')?.value || '',
            adventure: document.querySelector('.adventure-btn.selected')?.dataset.adventure || '',
            photo: document.getElementById('petPhotoInput')?.files[0]?.name || ''
        };

        // Store form data in localStorage for the story page
        localStorage.setItem('petStoryData', JSON.stringify(formData));

        // Navigate to story page
        window.location.href = 'story.html';
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

    // Single word input functionality
    function enforceSingleWord(input) {
        input.addEventListener('input', function(e) {
            let value = e.target.value;
            // Remove any spaces and keep only the first word
            const words = value.trim().split(/\s+/);
            if (words.length > 1) {
                e.target.value = words[0];
            }
        });
        
        input.addEventListener('keydown', function(e) {
            // Prevent space key from being entered
            if (e.key === ' ') {
                e.preventDefault();
            }
        });
    }

    // Apply single word enforcement to all word input fields
    function initSingleWordInputs() {
        const wordInputs = document.querySelectorAll('#word1, #word2, #word3');
        wordInputs.forEach(enforceSingleWord);
    }

    // Set up adventure selection functionality
    function setupAdventureSelection() {
        const adventureButtons = document.querySelectorAll('.adventure-btn');
        const descriptionTitle = document.querySelector('.adventure-description-title');
        const descriptionText = document.querySelector('.adventure-description-text');
        let selectedAdventure = null;

        adventureButtons.forEach(button => {
            // Click event for selection
            button.addEventListener('click', () => {
                // Remove selected class from all buttons
                adventureButtons.forEach(btn => btn.classList.remove('selected'));
                
                // Add selected class to clicked button
                button.classList.add('selected');
                
                // Update selected adventure
                selectedAdventure = button.dataset.adventure;
                
                // Update description
                updateDescription(selectedAdventure);
            });

            // Hover events for preview
            button.addEventListener('mouseenter', () => {
                if (!selectedAdventure) {
                    updateDescription(button.dataset.adventure);
                }
            });

            button.addEventListener('mouseleave', () => {
                if (!selectedAdventure) {
                    resetDescription();
                } else {
                    updateDescription(selectedAdventure);
                }
            });
        });

        function updateDescription(adventureKey) {
            const adventure = adventureDescriptions[adventureKey];
            if (adventure && descriptionTitle && descriptionText) {
                descriptionTitle.textContent = adventure.title;
                descriptionText.textContent = adventure.description;
            }
        }

        function resetDescription() {
            if (descriptionTitle && descriptionText) {
                descriptionTitle.textContent = 'Choose an Adventure';
                descriptionText.textContent = 'Hover over or click on an adventure button to see what exciting story awaits your pet!';
            }
        }
    }

    // Photo upload functionality
    function initPhotoUpload() {
        const photoInput = document.getElementById('petPhotoInput');
        const uploadPlaceholder = document.querySelector('.upload-photo-placeholder');
        const uploadText = document.querySelector('.upload-text');

        if (photoInput && uploadPlaceholder && uploadText) {
            photoInput.addEventListener('change', function(event) {
                const file = event.target.files[0];
                if (file) {
                    // Validate file type
                    if (!file.type.startsWith('image/')) {
                        alert('Please select an image file.');
                        return;
                    }

                    // Validate file size (max 10MB)
                    if (file.size > 10 * 1024 * 1024) {
                        alert('File size must be less than 10MB.');
                        return;
                    }

                    // Update the placeholder to show file selected
                    uploadText.textContent = `Selected: ${file.name}`;
                    uploadPlaceholder.style.borderColor = '#4f46e5';
                    uploadPlaceholder.style.backgroundColor = 'rgba(79, 70, 229, 0.1)';
                    
                    // Optional: Preview the image
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        // You can add image preview functionality here if needed
                        console.log('Image loaded successfully');
                    };
                    reader.readAsDataURL(file);
                }
            });
        }
    }


    // Story pagination functionality
    function initStoryPagination() {
        const storyPageContent = document.getElementById('storyPageContent');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const currentPageSpan = document.getElementById('currentPage');
        const totalPagesSpan = document.getElementById('totalPages');
        
        if (!storyPageContent || !prevBtn || !nextBtn || !currentPageSpan || !totalPagesSpan) {
            return; // Not on story page
        }
        
        let currentPage = 1;
        const totalPages = 9;
        
        // Set total pages
        totalPagesSpan.textContent = totalPages;
        
        // Story pages data
        const storyPages = [
            {
                type: "title",
                title: "MyPet's Magical Adventure",
                subtitle: "",
                image: "🌟"
            },
            {
                text: "Once upon a time, in a magical world far, far away, there lived a brave little pet who was about to embark on the greatest adventure of their life. The sun was shining brightly, and the birds were singing sweet melodies as our hero prepared for an unforgettable journey.",
                image: "🌟"
            },
            {
                text: "Our brave pet ventured into the enchanted forest, where ancient trees whispered secrets and magical creatures danced in the moonlight. The path ahead was filled with wonder and mystery, but our hero was not afraid. With courage in their heart, they took the first step into the unknown.",
                image: "🌲"
            },
            {
                text: "In the heart of the forest, our pet met a wise old owl who had been waiting for them. 'I've been expecting you,' the owl said with a twinkle in their eye. 'You are the chosen one who will save our magical kingdom from the darkness that threatens to consume it.'",
                image: "🦉"
            },
            {
                text: "The owl revealed that to save the kingdom, our pet must find the legendary Golden Bone, hidden deep within the Crystal Caves. This magical artifact had the power to restore peace and harmony to all the lands. The journey would be dangerous, but our hero was ready.",
                image: "🦴"
            },
            {
                text: "Deep beneath the earth, our pet discovered the Crystal Caves, where walls sparkled like diamonds and the air shimmered with magic. Strange creatures lurked in the shadows, but our brave hero pressed on, following the mysterious glow that led to the Golden Bone.",
                image: "💎"
            },
            {
                text: "At the heart of the caves, our pet faced the mighty Crystal Guardian, a magnificent creature made entirely of precious gems. 'To prove your worth,' the guardian boomed, 'you must solve my riddle and show me the true meaning of courage and friendship.'",
                image: "🛡️"
            },
            {
                text: "With wisdom and kindness, our pet solved the guardian's riddle and earned the right to claim the Golden Bone. As they touched the magical artifact, a brilliant light filled the caves, and our hero felt a surge of power and responsibility flow through them.",
                image: "✨"
            },
            {
                text: "Returning to the surface, our pet used the power of the Golden Bone to banish the darkness and restore peace to the magical kingdom. All the creatures celebrated, and our hero was hailed as the greatest adventurer of all time. The adventure was complete, but many more awaited!",
                image: "🎉"
            },
            {
                text: "The End!",
                image: null
            }
        ];
        
        // Function to update page content
        function updatePageContent(pageNumber) {
            const page = storyPages[pageNumber - 1];
            
            // Special handling for the title page
            if (page.type === "title") {
                storyPageContent.innerHTML = `
                    <div class="story-title-page">
                        <h1 class="story-title-page-title">${page.title}</h1>
                        <h2 class="story-title-page-subtitle">${page.subtitle}</h2>
                        <div class="story-title-page-image">${page.image}</div>
                    </div>
                `;
                
                // Ensure the title has the solid blue color applied with a delay
                setTimeout(() => {
                    const titleElement = storyPageContent.querySelector('.story-title-page-title');
                    if (titleElement) {
                        // Apply solid blue color
                        titleElement.style.color = '#45b7d1';
                        titleElement.style.background = '';
                        titleElement.style.backgroundSize = '';
                        titleElement.style.webkitBackgroundClip = '';
                        titleElement.style.webkitTextFillColor = '';
                        titleElement.style.backgroundClip = '';
                        titleElement.style.animation = '';
                        
                        // Force a reflow to ensure the styles are applied
                        titleElement.offsetHeight;
                    }
                }, 100);
            }
            // Special handling for the last page (The End!)
            else if (pageNumber === totalPages) {
                storyPageContent.innerHTML = `
                    <div class="story-end-text"><span>${page.text}</span></div>
                `;
            } else {
                storyPageContent.innerHTML = `
                    <div class="story-page-image">${page.image}</div>
                    <p class="story-page-text">${page.text}</p>
                `;
            }
            
            // Update page number
            currentPageSpan.textContent = pageNumber;
            
            // Update button states
            prevBtn.disabled = pageNumber === 1;
            nextBtn.disabled = pageNumber === totalPages;
        }
        
        // Event listeners
        prevBtn.addEventListener('click', () => {
            if (currentPage > 1) {
                currentPage--;
                updatePageContent(currentPage);
            }
        });
        
        nextBtn.addEventListener('click', () => {
            if (currentPage < totalPages) {
                currentPage++;
                updatePageContent(currentPage);
            }
        });
        
        // Initialize with first page
        updatePageContent(1);
    }

    // Initialize when DOM is loaded
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            init();
            initSingleWordInputs();
            initPhotoUpload();
            initStoryPagination();
        });
    } else {
        init();
        initSingleWordInputs();
        initPhotoUpload();
        initStoryPagination();
    }
})();