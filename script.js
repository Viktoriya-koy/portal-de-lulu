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
            
            let shapeElement;
            
            switch(shapeType) {
                case 'circle':
                    shapeElement = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
                    shapeElement.setAttribute('cx', Math.random() * 180 + 10);
                    shapeElement.setAttribute('cy', Math.random() * 130 + 10);
                    shapeElement.setAttribute('r', Math.random() * 30 + 10);
                    break;
                    
                case 'rect':
                    shapeElement = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
                    shapeElement.setAttribute('x', Math.random() * 150);
                    shapeElement.setAttribute('y', Math.random() * 100);
                    shapeElement.setAttribute('width', Math.random() * 50 + 20);
                    shapeElement.setAttribute('height', Math.random() * 50 + 20);
                    shapeElement.setAttribute('rx', Math.random() * 15);
                    break;
                    
                case 'line':
                    shapeElement = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    shapeElement.setAttribute('x1', Math.random() * 200);
                    shapeElement.setAttribute('y1', Math.random() * 150);
                    shapeElement.setAttribute('x2', Math.random() * 200);
                    shapeElement.setAttribute('y2', Math.random() * 150);
                    shapeElement.setAttribute('stroke-width', Math.random() * 5 + 1);
                    break;
                    
                case 'polygon':
                    const points = [];
                    const numPoints = Math.floor(Math.random() * 4) + 3;
                    for (let p = 0; p < numPoints; p++) {
                        points.push(`${Math.random() * 180 + 10},${Math.random() * 130 + 10}`);
                    }
                    shapeElement = document.createElementNS('http://www.w3.org/2000/svg', 'polygon');
                    shapeElement.setAttribute('points', points.join(' '));
                    break;
                    
                case 'path':
                    shapeElement = document.createElementNS('http://www.w3.org/2000/svg', 'path');
                    const d = `M ${Math.random() * 50 + 50} ${Math.random() * 50 + 50} 
                               C ${Math.random() * 200} ${Math.random() * 150}, 
                                 ${Math.random() * 200} ${Math.random() * 150}, 
                                 ${Math.random() * 150 + 50} ${Math.random() * 100 + 50}`;
                    shapeElement.setAttribute('d', d);
                    shapeElement.setAttribute('fill', 'none');
                    shapeElement.setAttribute('stroke-width', Math.random() * 3 + 1);
                    color = colors[Math.floor(Math.random() * colors.length)];
                    break;
            }
            
            shapeElement.setAttribute('fill', shapeType !== 'line' && shapeType !== 'path' ? color : 'none');
            shapeElement.setAttribute('stroke', color);
            shapeElement.setAttribute('opacity', opacity);
            
            if (shapeType === 'line' || shapeType === 'path') {
                shapeElement.setAttribute('stroke', color);
            }
            
            doodleSVG.appendChild(shapeElement);
        }
        
        // Asignar un nombre aleatorio al doodle
        const randomName = doodleNames[Math.floor(Math.random() * doodleNames.length)];
        doodleName.textContent = `"${randomName}"`;
        
        // Efecto visual en el botón
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 150);
    });
}

// Zona de doodles
function setupDoodleZone() {
    const canvas = document.getElementById('doodleCanvas');
    const ctx = canvas.getContext('2d');
    const colorOptions = document.querySelectorAll('.color-option');
    const brushSize = document.getElementById('brushSize');
    const brushSizeValue = document.getElementById('brushSizeValue');
    const clearButton = document.getElementById('clearCanvas');
    const saveButton = document.getElementById('saveDoodle');
    
    // Ajustar canvas al tamaño de pantalla
    function resizeCanvas() {
        const container = canvas.parentElement;
        canvas.width = container.clientWidth - 30;
        canvas.height = Math.min(500, canvas.width * 0.6);
        
        // Redibujar contenido (si hubiera)
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
    }
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Estado del dibujo
    let drawing = false;
    let lastX = 0;
    let lastY = 0;
    let currentColor = '#8A2BE2';
    let currentSize = 5;
    
    // Configurar canvas
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    
    // Eventos del mouse/touch
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    // Para dispositivos táctiles
    canvas.addEventListener('touchstart', function(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousedown', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    });
    
    canvas.addEventListener('touchmove', function(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent('mousemove', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    });
    
    canvas.addEventListener('touchend', function(e) {
        e.preventDefault();
        const mouseEvent = new MouseEvent('mouseup', {});
        canvas.dispatchEvent(mouseEvent);
    });
    
    // Funciones de dibujo
    function startDrawing(e) {
        drawing = true;
        [lastX, lastY] = [e.offsetX, e.offsetY];
    }
    
    function draw(e) {
        if (!drawing) return;
        
        ctx.strokeStyle = currentColor;
        ctx.lineWidth = currentSize;
        
        ctx.beginPath();
        ctx.moveTo(lastX, lastY);
        ctx.lineTo(e.offsetX, e.offsetY);
        ctx.stroke();
        
        [lastX, lastY] = [e.offsetX, e.offsetY];
    }
    
    function stopDrawing() {
        drawing = false;
    }
    
    // Selector de color
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            colorOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            currentColor = this.getAttribute('data-color');
        });
    });
    
    // Control de grosor del pincel
    brushSize.addEventListener('input', function() {
        currentSize = this.value;
        brushSizeValue.textContent = currentSize;
    });
    
    // Botón limpiar
    clearButton.addEventListener('click', function() {
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Efecto visual
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 150);
    });
    
    // Botón guardar
    saveButton.addEventListener('click', function() {
        const link = document.createElement('a');
        link.download = `doodle-luhe-${Date.now()}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        // Efecto visual
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 150);
    });
    
    // Sugerencias de doodles
    document.querySelectorAll('.prompt').forEach(prompt => {
        prompt.addEventListener('click', function() {
            alert(`¡Buena idea! Ahora dibuja: "${this.textContent}"`);
        });
    });
}
