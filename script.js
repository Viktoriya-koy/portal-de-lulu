// Configuración global
document.addEventListener('DOMContentLoaded', function() {
    // Configurar año actual en el footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();
    
    // Navegación entre secciones
    setupNavigation();
    
    // Mensajes interactivos
    setupInteractiveMessages();
    
    // Árbol de estados de ánimo
    setupMoodTree();
    
    // Sonidos
    setupSounds();
    
    // Memory Game
    setupMemoryGame();
    
    // Generador de doodles aleatorios
    setupDoodleGenerator();
    
    // Zona de doodles
    setupDoodleZone();
});

// Navegación
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            
            // Actualizar navegación activa
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Mostrar sección correspondiente
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetId) {
                    section.classList.add('active');
                }
            });
            
            // Scroll suave al principio de la sección
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
}

// Mensajes interactivos
function setupInteractiveMessages() {
    const messageElements = document.querySelectorAll('.message-element');
    const messageDisplay = document.getElementById('messageDisplay');
    
    messageElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            const message = this.getAttribute('data-message');
            messageDisplay.textContent = message;
            messageDisplay.style.backgroundColor = '#e6e6fa';
            messageDisplay.style.borderColor = '#4169E1';
        });
        
        element.addEventListener('mouseleave', function() {
            messageDisplay.textContent = 'Haz hover sobre los iconos para ver mensajes secretos';
            messageDisplay.style.backgroundColor = '#f9f0ff';
            messageDisplay.style.borderColor = '#8A2BE2';
        });
    });
}

// Árbol de estados de ánimo
function setupMoodTree() {
    const branches = document.querySelectorAll('.branch');
    const treeResponse = document.getElementById('treeResponse');
    
    branches.forEach(branch => {
        branch.addEventListener('click', function() {
            const response = this.getAttribute('data-response');
            treeResponse.textContent = response;
            treeResponse.style.backgroundColor = '#e6f0ff';
            
            // Efecto visual en el botón clickeado
            branches.forEach(b => b.style.transform = 'translateY(0)');
            this.style.transform = 'translateY(-5px)';
            this.style.boxShadow = '0 8px 20px rgba(100, 149, 237, 0.5)';
        });
    });
}

// Sonidos
function setupSounds() {
    const sounds = {
        rain: new Howl({ src: ['https://assets.mixkit.co/sfx/preview/mixkit-rain-loop-1246.mp3'], loop: true }),
        coffee: new Howl({ src: ['https://assets.mixkit.co/sfx/preview/mixkit-coffee-machine-bubble-833.mp3'], loop: true }),
        fire: new Howl({ src: ['https://assets.mixkit.co/sfx/preview/mixkit-campfire-crackles-1330.mp3'], loop: true })
    };
    
    let currentSound = null;
    
    document.querySelectorAll('.sound-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const soundType = this.getAttribute('data-sound');
            
            // Si hay un sonido reproduciéndose, lo paramos
            if (currentSound && currentSound.playing()) {
                currentSound.stop();
            }
            
            // Si es el mismo botón, solo paramos
            if (currentSound === sounds[soundType] && sounds[soundType].playing()) {
                currentSound = null;
                return;
            }
            
            // Reproducimos el nuevo sonido
            if (sounds[soundType]) {
                sounds[soundType].play();
                currentSound = sounds[soundType];
                
                // Efecto visual
                document.querySelectorAll('.sound-btn').forEach(b => {
                    b.style.transform = 'translateY(0)';
                    b.style.boxShadow = 'none';
                });
                this.style.transform = 'translateY(-5px)';
                this.style.boxShadow = '0 8px 20px rgba(65, 105, 225, 0.4)';
            }
        });
    });
    
    // Botón para parar todos los sonidos
    document.getElementById('stopSounds').addEventListener('click', function() {
        if (currentSound && currentSound.playing()) {
            currentSound.stop();
            currentSound = null;
        }
        
        // Resetear estilos de botones
        document.querySelectorAll('.sound-btn').forEach(b => {
            b.style.transform = 'translateY(0)';
            b.style.boxShadow = 'none';
        });
    });
}

// Memory Game
function setupMemoryGame() {
    const memoryBoard = document.getElementById('memoryBoard');
    const scoreElement = document.getElementById('score');
    const resetButton = document.getElementById('resetMemory');
    
    const emojis = ['😺', '😸', '😹', '😻', '😼', '😽', '🙀', '😿', '😾', '🐱'];
    let selectedEmojis = [];
    let flippedCards = [];
    let matchedPairs = 0;
    let score = 0;
    
    function initMemoryGame() {
        // Seleccionar 6 emojis aleatorios y duplicarlos
        selectedEmojis = [...emojis].sort(() => 0.5 - Math.random()).slice(0, 6);
        selectedEmojis = [...selectedEmojis, ...selectedEmojis];
        selectedEmojis = selectedEmojis.sort(() => 0.5 - Math.random());
        
        // Limpiar tablero
        memoryBoard.innerHTML = '';
        flippedCards = [];
        matchedPairs = 0;
        score = 0;
        scoreElement.textContent = score;
        
        // Crear cartas
        selectedEmojis.forEach((emoji, index) => {
            const card = document.createElement('div');
            card.className = 'memory-card';
            card.dataset.emoji = emoji;
            card.dataset.index = index;
            
            card.innerHTML = `
                <div class="card-back">🐾</div>
                <div class="card-front">${emoji}</div>
            `;
            
            card.addEventListener('click', flipCard);
            memoryBoard.appendChild(card);
        });
    }
    
    function flipCard() {
        // No hacer nada si ya hay 2 cartas volteadas o si esta ya está volteada
        if (flippedCards.length >= 2 || this.classList.contains('flipped') || this.classList.contains('matched')) {
            return;
        }
        
        this.classList.add('flipped');
        flippedCards.push(this);
        
        // Si hay 2 cartas volteadas, verificar si hacen match
        if (flippedCards.length === 2) {
            setTimeout(checkMatch, 600);
        }
    }
    
    function checkMatch() {
        const [card1, card2] = flippedCards;
        const isMatch = card1.dataset.emoji === card2.dataset.emoji;
        
        if (isMatch) {
            card1.classList.add('matched');
            card2.classList.add('matched');
            matchedPairs++;
            score++;
            scoreElement.textContent = score;
            
            // Verificar si el juego terminó
            if (matchedPairs === 6) {
                setTimeout(() => {
                    alert('¡Felicidades! Has encontrado todos los pares de gatitos. 🎉');
                }, 500);
            }
        } else {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
        }
        
        flippedCards = [];
    }
    
    resetButton.addEventListener('click', initMemoryGame);
    initMemoryGame();
}

// Generador de doodles aleatorios
function setupDoodleGenerator() {
    const generateButton = document.getElementById('generateDoodle');
    const doodleSVG = document.getElementById('doodleSVG');
    const doodleName = document.getElementById('doodleName');
    
    const doodleNames = [
        "Gatito Cósmico",
        "Flor Espacial",
        "Corazón Vibrante",
        "Estrella Fugaz",
        "Espiral de Sueños",
        "Nube Melódica",
        "Mariposa Digital",
        "Árbol de Luz",
        "Ola Violeta",
        "Constelación Azul"
    ];
    
    const shapes = ['circle', 'rect', 'line', 'polygon', 'path'];
    const colors = ['#8A2BE2', '#4B0082', '#4169E1', '#00BFFF', '#9370DB', '#6495ED'];
    
    generateButton.addEventListener('click', function() {
        // Limpiar SVG anterior
        doodleSVG.innerHTML = '';
        
        // Generar 3-6 formas aleatorias
        const numShapes = Math.floor(Math.random() * 4) + 3;
        
        for (let i = 0; i < numShapes; i++) {
            const shapeType = shapes[Math.floor(Math.random() * shapes.length)];
            const color = colors[Math.floor(Math.random() * colors.length)];
            const opacity = Math.random() * 0.7 + 0.3;
            
            let shape
