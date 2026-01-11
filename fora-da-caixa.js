document.addEventListener('DOMContentLoaded', () => {
    initCustomCursor();
    initCanvasEffect();
    initTiltEffect();
    initScrollGlitch();
});

/* === 1. CURSOR PERSONALIZADO MAGNÉTICO === */
function initCustomCursor() {
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    // Variáveis para posição suave
    let mouseX = 0;
    let mouseY = 0;
    let outlineX = 0;
    let outlineY = 0;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Dot segue instantaneamente
        cursorDot.style.left = `${mouseX}px`;
        cursorDot.style.top = `${mouseY}px`;
        
        // Torna visível ao mover
        cursorDot.style.opacity = 1;
        cursorOutline.style.opacity = 1;
    });

    // Loop de animação suave para o outline (Delay elástico sem travar)
    const animateOutline = () => {
        outlineX += (mouseX - outlineX) * 0.15; // Fator de suavidade
        outlineY += (mouseY - outlineY) * 0.15;

        cursorOutline.style.left = `${outlineX}px`;
        cursorOutline.style.top = `${outlineY}px`;

        requestAnimationFrame(animateOutline);
    };
    animateOutline();

    // Efeito Hover em links e botões
    const interactables = document.querySelectorAll('a, button, .creative-card');
    interactables.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1.5)';
            cursorOutline.style.borderColor = '#00f3ff';
            cursorDot.style.backgroundColor = '#ff00ff';
        });
        el.addEventListener('mouseleave', () => {
            cursorOutline.style.transform = 'translate(-50%, -50%) scale(1)';
            cursorOutline.style.borderColor = 'rgba(255, 255, 255, 0.5)';
            cursorDot.style.backgroundColor = '#fff';
        });
    });
}

/* === 2. CANVAS INTERATIVO (REDE NEURAL) === */
function initCanvasEffect() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    function resize() {
        width = canvas.width = canvas.parentElement.offsetWidth;
        height = canvas.height = canvas.parentElement.offsetHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 1; // Velocidade lenta
            this.vy = (Math.random() - 0.5) * 1;
            this.size = Math.random() * 2 + 1;
            this.color = Math.random() > 0.5 ? '#00f3ff' : '#ff00ff'; // Ciano ou Magenta
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            // Rebater nas bordas
            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = this.color;
            ctx.fill();
        }
    }

    // Criar partículas
    for (let i = 0; i < 60; i++) {
        particles.push(new Particle());
    }

    // Mouse interaction
    let mouse = { x: null, y: null };
    window.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouse.x = e.clientX - rect.left;
        mouse.y = e.clientY - rect.top;
    });

    function animate() {
        ctx.clearRect(0, 0, width, height);
        
        particles.forEach((p, index) => {
            p.update();
            p.draw();

            // Conectar partículas próximas
            for (let j = index; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(255, 255, 255, ${1 - distance/100})`;
                    ctx.lineWidth = 0.5;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }

            // Conectar com o mouse
            if (mouse.x != null) {
                const dx = p.x - mouse.x;
                const dy = p.y - mouse.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < 150) {
                    ctx.beginPath();
                    ctx.strokeStyle = `rgba(0, 243, 255, ${1 - distance/150})`; // Linha Ciano
                    ctx.lineWidth = 1;
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            }
        });

        requestAnimationFrame(animate);
    }
    animate();
}

/* === 3. EFEITO TILT 3D NOS CARDS === */
function initTiltEffect() {
    const cards = document.querySelectorAll('.creative-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Calcular rotação baseada no centro do card
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -10; // Inverte eixo Y para tilt correto
            const rotateY = ((x - centerX) / centerX) * 10;

            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
            
            // Efeito de brilho (Glare)
            const glare = card.querySelector('.glare');
            if(glare) {
                glare.style.left = `${x}px`;
                glare.style.top = `${y}px`;
                glare.style.opacity = 1;
            }
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) scale(1)';
            const glare = card.querySelector('.glare');
            if(glare) glare.style.opacity = 0;
        });

        // Adicionar elemento de brilho dinamicamente se não existir
        if(!card.querySelector('.glare')) {
            const glare = document.createElement('div');
            glare.classList.add('glare');
            card.appendChild(glare);
        }
    });
}

/* === 4. SCROLL REVEAL COM GLITCH === */
function initScrollGlitch() {
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active-glitch');
                
                // Efeito de texto embaralhado (Matrix style)
                const textElement = entry.target.querySelector('h2, h3');
                if(textElement) {
                    const originalText = textElement.innerText;
                    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%&';
                    let iterations = 0;
                    
                    const interval = setInterval(() => {
                        textElement.innerText = originalText.split('')
                            .map((letter, index) => {
                                if(index < iterations) return originalText[index];
                                return chars[Math.floor(Math.random() * chars.length)];
                            })
                            .join('');
                        
                        if(iterations >= originalText.length) clearInterval(interval);
                        iterations += 1/3;
                    }, 30);
                }
            }
        });
    }, { threshold: 0.2 });

    const elements = document.querySelectorAll('.manifesto-text, .creative-card, .cta-content');
    elements.forEach(el => {
        el.classList.add('reveal-hidden'); // Começa invisível
        observer.observe(el);
    });
}