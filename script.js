document.addEventListener('DOMContentLoaded', function() {
    // Configuración inicial
    initApp();
    
    // Funcionalidades
    setupNavigation();
    setupInteractiveMessages();
    setupMoodTree();
    setupBreathingExercise();
    setupMemoryGame();
    setupReactionGame();
    setupDrawingZone();
});

function initApp() {
    // Año actual en footer
    document.getElementById('currentYear').textContent = new Date().getFullYear();
}

// ================= NAVEGACIÓN =================
function setupNavigation() {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            
            // Actualizar navegación
            navLinks.forEach(l => l.classList.remove('active'));
            this.classList.add('active');
            
            // Mostrar sección
            sections.forEach(section => {
                section.classList.remove('active');
                if (section.id === targetId) section.classList.add('active');
            });
            
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    });
}

// ================= MENSAJES INTERACTIVOS =================
function setupInteractiveMessages() {
    const messageElements = document.querySelectorAll('.message-element');
    const messageDisplay = document.getElementById('messageDisplay');
    
    messageElements.forEach(element => {
        element.addEventListener('click', function() {
            const message = this.getAttribute('data-message');
            messageDisplay.textContent = message;
            messageDisplay.style.backgroundColor = '#e6e6fa';
            messageDisplay.style.borderColor = '#4169E1';
            
            // Efecto visual
            this.style.transform = 'translateY(-8px) scale(1.05)';
            setTimeout(() => {
                this.style.transform = 'translateY(-8px)';
            }, 200);
        });
    });
}

// ================= ÁRBOL DE ESTADOS DE ÁNIMO =================
function setupMoodTree() {
    const branches = document.querySelectorAll('.branch');
    const treeResponse = document.getElementById('treeResponse');
    
    branches.forEach(branch => {
        branch.addEventListener('click', function() {
            const response = this.getAttribute('data-response');
            treeResponse.textContent = response;
            treeResponse.style.backgroundColor = '#e6f0ff';
            
            // Efecto visual
            branches.forEach(b => {
                b.style.transform = 'translateY(0)';
                b.style.boxShadow = 'none';
            });
            this.style.transform = 'translateY(-8px)';
            this.style.boxShadow = '0 10px 25px rgba(100, 149, 237, 0.4)';
            
            // Color aleatorio del borde
            const colors = ['#8A2BE2', '#4169E1', '#FF69B4', '#00BFFF'];
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            treeResponse.style.borderLeftColor = randomColor;
        });
    });
}

// ================= EJERCICIO DE RESPIRACIÓN =================
function setupBreathingExercise() {
    const breathingCircle = document.getElementById('breathingCircle');
    const startBtn = document.getElementById('startBreathing');
    const stopBtn = document.getElementById('stopBreathing');
    const breathInstruction = document.getElementById('breathInstruction');
    
    let breathingInterval;
    let isBreathing = false;
    let breatheIn = true;
    let cycleCount = 0;
    
    function startBreathing() {
        if (isBreathing) return;
        
        isBreathing = true;
        breathingCircle.style.animation = 'pulse 4s infinite ease-in-out';
        breathInstruction.textContent = 'Inhala... (4 segundos)';
        breatheIn = true;
        cycleCount = 0;
        
        breathingInterval = setInterval(() => {
            if (breatheIn) {
                breathingCircle.querySelector('.breath-text').textContent = 'INHALA';
                breathInstruction.textContent = 'Inhala profundamente... (4 segundos)';
                breatheIn = false;
            } else {
                breathingCircle.querySelector('.breath-text').textContent = 'EXHALA';
                breathInstruction.textContent = 'Exhala lentamente... (6 segundos)';
                breatheIn = true;
                cycleCount++;
                
                if (cycleCount >= 3) {
                    breathInstruction.textContent = '¡Bien hecho! 3 ciclos completados.';
                    setTimeout(() => {
                        if (isBreathing) {
                            breathInstruction.textContent = 'Continúa... Inhala...';
                        }
                    }, 2000);
                }
            }
        }, 4000);
        
        startBtn.disabled = true;
        stopBtn.disabled = false;
    }
    
    function stopBreathing() {
        clearInterval(breathingInterval);
        isBreathing = false;
        breathingCircle.style.animation = 'none';
        breathingCircle.querySelector('.breath-text').textContent = 'INHALA';
        breathInstruction.textContent = 'Ejercicio detenido. Haz clic en "Comenzar" para iniciar de nuevo.';
        
        startBtn.disabled = false;
        stopBtn.disabled = true;
    }
    
    startBtn.addEventListener('click', startBreathing);
    stopBtn.addEventListener('click', stopBreathing);
    stopBtn.disabled = true;
}

// ================= MEMORY GAME =================
function setupMemoryGame() {
    const memoryBoard = document.getElementById('memoryBoard');
    const scoreElement = document.getElementById('score');
    const movesElement = document.getElementById('moves');
    const resetButton = document.getElementById('resetMemory');
    
    const emojis = ['😺', '😸', '😹', '😻', '😼', '😽'];
    let selectedEmojis = [];
    let flippedCards = [];
    let matchedPairs = 0;
    let score = 0;
    let moves = 0;
    
    function initMemoryGame() {
        // Seleccionar y duplicar emojis
        selectedEmojis = [...emojis, ...emojis];
        selectedEmojis = selectedEmojis.sort(() => Math.random() - 0.5);
        
        // Limpiar tablero
        memoryBoard.innerHTML = '';
        flippedCards = [];
        matchedPairs = 0;
        score = 0;
        moves = 0;
        updateScore();
        
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
        if (flippedCards.length >= 2 || this.classList.contains('flipped') || this.classList.contains('matched')) {
            return;
        }
        
        this.classList.add('flipped');
        flippedCards.push(this);
        moves++;
        movesElement.textContent = moves;
        
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
            score += 10;
            
            if (matchedPairs === 6) {
                setTimeout(() => {
                    alert(`¡Felicidades! 🎉\nEncontraste todos los pares en ${moves} movimientos.\nPuntuación: ${score}`);
                }, 500);
            }
        } else {
            card1.classList.remove('flipped');
            card2.classList.remove('flipped');
            score = Math.max(0, score - 1);
        }
        
        flippedCards = [];
        updateScore();
    }
    
    function updateScore() {
        scoreElement.textContent = matchedPairs;
        movesElement.textContent = moves;
    }
    
    resetButton.addEventListener('click', initMemoryGame);
    initMemoryGame();
}

// ================= JUEGO DE REACCIÓN =================
function setupReactionGame() {
    const reactionArea = document.getElementById('reactionArea');
    const reactionTime = document.getElementById('reactionTime');
    const reactionScore = document.getElementById('reactionScore');
    const reactionBest = document.getElementById('reactionBest');
    const startBtn = document.getElementById('startReaction');
    const resetBtn = document.getElementById('resetReaction');
    
    let gameActive = false;
    let startTime;
    let score = 0;
    let bestTime = localStorage.getItem('bestReactionTime') || 0;
    reactionBest.textContent = bestTime;
    
    function createTarget() {
        reactionArea.innerHTML = '';
        
        const size = Math.random() * 80 + 40;
        const x = Math.random() * (reactionArea.offsetWidth - size);
        const y = Math.random() * (reactionArea.offsetHeight - size);
        
        const target = document.createElement('div');
        target.className = 'reaction-target';
        target.style.width = `${size}px`;
        target.style.height = `${size}px`;
        target.style.left = `${x}px`;
        target.style.top = `${y}px`;
        
        target.addEventListener('click', function() {
            if (!gameActive) return;
            
            const endTime = Date.now();
            const timeTaken = endTime - startTime;
            
            reactionTime.textContent = timeTaken;
            score++;
            reactionScore.textContent = score;
            
            if (timeTaken < bestTime || bestTime === 0) {
                bestTime = timeTaken;
                reactionBest.textContent = bestTime;
                localStorage.setItem('bestReactionTime', bestTime);
                this.style.background = 'linear-gradient(135deg, #FFD700, #FFA500)';
            }
            
            this.remove();
            setTimeout(createTarget, Math.random() * 800 + 400);
            startTime = Date.now();
        });
        
        reactionArea.appendChild(target);
    }
    
    startBtn.addEventListener('click', function() {
        if (gameActive) return;
        
        gameActive = true;
        score = 0;
        reactionScore.textContent = score;
        reactionTime.textContent = '0';
        reactionArea.innerHTML = '<p>¡Preparate! El objetivo aparecerá pronto...</p>';
        
        setTimeout(() => {
            reactionArea.innerHTML = '';
            createTarget();
            startTime = Date.now();
        }, Math.random() * 1500 + 1000);
        
        startBtn.disabled = true;
        setTimeout(() => {
            startBtn.disabled = false;
        }, 2000);
    });
    
    resetBtn.addEventListener('click', function() {
        gameActive = false;
        reactionArea.innerHTML = '<p>Haz clic en "Comenzar Juego"</p>';
        score = 0;
        reactionScore.textContent = score;
        reactionTime.textContent = '0';
    });
}

// ================= ZONA DE DIBUJO =================
function setupDrawingZone() {
    const canvas = document.getElementById('drawingCanvas');
    const ctx = canvas.getContext('2d');
    const colorOptions = document.querySelectorAll('.color-option');
    const brushSize = document.getElementById('brushSize');
    const brushSizeValue = document.getElementById('brushSizeValue');
    const opacity = document.getElementById('opacity');
    const opacityValue = document.getElementById('opacityValue');
    const toolButtons = document.querySelectorAll('.tool-btn');
    const clearBtn = document.getElementById('clearCanvas');
    const undoBtn = document.getElementById('undoDrawing');
    const saveBtn = document.getElementById('saveDrawing');
    const fillBtn = document.getElementById('fillBackground');
    const ideaButtons = document.querySelectorAll('.idea-btn');
    
    // Estado del dibujo
    let drawing = false;
    let lastX = 0;
    let lastY = 0;
    let currentTool = 'brush';
    let currentColor = '#8A2BE2';
    let currentSize = 5;
    let currentOpacity = 1;
    let history = [];
    let startX, startY;
    
    // Inicializar canvas
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    saveState();
    
    // Eventos del mouse
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    // Eventos táctiles
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', stopDrawing);
    
    // Funciones de dibujo
    function startDrawing(e) {
        drawing = true;
        const pos = getMousePos(e);
        [lastX, lastY] = [pos.x, pos.y];
        [startX, startY] = [pos.x, pos.y];
        
        if (currentTool === 'brush') {
            ctx.beginPath();
            ctx.moveTo(lastX, lastY);
        }
    }
    
    function draw(e) {
        if (!drawing) return;
        
        e.preventDefault();
        const pos = getMousePos(e);
        const x = pos.x;
        const y = pos.y;
        
        ctx.globalAlpha = currentOpacity;
        ctx.strokeStyle = currentColor;
        ctx.fillStyle = currentColor;
        ctx.lineWidth = currentSize;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';
        
        switch(currentTool) {
            case 'brush':
                ctx.lineTo(x, y);
                ctx.stroke();
                break;
                
            case 'eraser':
                ctx.save();
                ctx.globalCompositeOperation = 'destination-out';
                ctx.lineTo(x, y);
                ctx.stroke();
                ctx.restore();
                break;
                
            case 'line':
                // Redibujar desde el estado guardado
                restoreState();
                ctx.beginPath();
                ctx.moveTo(startX, startY);
                ctx.lineTo(x, y);
                ctx.stroke();
                break;
                
            case 'circle':
                restoreState();
                const radius = Math.sqrt(Math.pow(x - startX, 2) + Math.pow(y - startY, 2));
                ctx.beginPath();
                ctx.arc(startX, startY, radius, 0, Math.PI * 2);
                ctx.stroke();
                break;
        }
        
        [lastX, lastY] = [x, y];
    }
    
    function stopDrawing() {
        if (!drawing) return;
        
        drawing = false;
        ctx.closePath();
        saveState();
    }
    
    // Funciones de utilidad
    function getMousePos(e) {
        const rect = canvas.getBoundingClientRect();
        let x, y;
        
        if (e.type.includes('touch')) {
            x = e.touches[0].clientX - rect.left;
            y = e.touches[0].clientY - rect.top;
        } else {
            x = e.clientX - rect.left;
            y = e.clientY - rect.top;
        }
        
        return { x, y };
    }
    
    function handleTouchStart(e) {
        e.preventDefault();
        startDrawing(e.touches[0]);
    }
    
    function handleTouchMove(e) {
        e.preventDefault();
        draw(e.touches[0]);
    }
    
    function resizeCanvas() {
        const container = canvas.parentElement;
        canvas.width = container.clientWidth - 30;
        canvas.height = Math.min(500, canvas.width * 0.7);
        redraw();
    }
    
    function redraw() {
        if (history.length > 0) {
            const img = new Image();
            img.onload = function() {
                ctx.drawImage(img, 0, 0);
            };
            img.src = history[history.length - 1];
        }
    }
    
    function saveState() {
        history.push(canvas.toDataURL());
        if (history.length > 20) history.shift(); // Limitar historial
    }
    
    function restoreState() {
        if (history.length === 0) return;
        
        const img = new Image();
        img.onload = function() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
        };
        img.src = history[history.length - 1];
    }
    
    // Controladores de eventos
    colorOptions.forEach(option => {
        option.addEventListener('click', function() {
            colorOptions.forEach(opt => opt.classList.remove('active'));
            this.classList.add('active');
            currentColor = this.getAttribute('data-color');
        });
    });
    
    brushSize.addEventListener('input', function() {
        currentSize = this.value;
        brushSizeValue.textContent = currentSize;
    });
    
    opacity.addEventListener('input', function() {
        currentOpacity = this.value / 100;
        opacityValue.textContent = this.value;
    });
    
    toolButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            toolButtons.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            currentTool = this.getAttribute('data-tool');
        });
    });
    
    clearBtn.addEventListener('click', function() {
        if (confirm('¿Estás segura de que quieres limpiar todo el dibujo?')) {
            ctx.fillStyle = 'white';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            saveState();
        }
    });
    
    undoBtn.addEventListener('click', function() {
        if (history.length > 1) {
            history.pop(); // Remover estado actual
            restoreState();
            history.pop(); // Remover el que acabamos de restaurar
            saveState(); // Guardar como nuevo estado actual
        }
    });
    
    saveBtn.addEventListener('click', function() {
        const link = document.createElement('a');
        link.download = `dibujo-luhe-${Date.now()}.png`;
        link.href = canvas.toDataURL();
        link.click();
    });
    
    fillBtn.addEventListener('click', function() {
        ctx.fillStyle = '#f9f0ff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        saveState();
    });
    
    ideaButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const idea = this.getAttribute('data-idea');
            const ideas = {
                flower: '🌸 Dibuja una flor bonita',
                cat: '🐱 Dibuja un gatito juguetón',
                heart: '💜 Dibuja un corazón con detalles',
                star: '⭐ Dibuja una constelación de estrellas',
                abstract: '🎨 Deja fluir tu creatividad abstracta'
            };
            
            alert(ideas[idea] || '¡Dibuja algo increíble!');
        });
    });
}
