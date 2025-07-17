// Spline-style animated background for Forgot Password
const canvas = document.getElementById('spline-bg');
const ctx = canvas.getContext('2d');
let width = window.innerWidth;
let height = window.innerHeight;
canvas.width = width;
canvas.height = height;

// Responsive resize
function resize() {
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width;
    canvas.height = height;
}
window.addEventListener('resize', resize);

// --- PARTICLES ---
const colors = ['#3468c0', '#ffa424', '#48bb78', '#1d4ed8'];
const particles = Array.from({length: 22}, () => ({
    x: Math.random() * width,
    y: Math.random() * height,
    r: 18 + Math.random() * 18,
    color: colors[Math.floor(Math.random() * colors.length)],
    dx: (Math.random() - 0.5) * 0.7,
    dy: (Math.random() - 0.5) * 0.7,
    alpha: 0.18 + Math.random() * 0.18
}));

// --- BLOBS ---
const blobs = [
    { x: width*0.2, y: height*0.7, r: 120, color: '#3468c0', alpha: 0.13, phase: 0 },
    { x: width*0.8, y: height*0.3, r: 90, color: '#ffa424', alpha: 0.11, phase: Math.PI/2 }
];

// --- WAVE ---
function drawWave() {
    ctx.save();
    ctx.globalAlpha = 0.13;
    ctx.beginPath();
    ctx.moveTo(0, height*0.82);
    for (let x = 0; x <= width; x += 8) {
        const y = height*0.82 + Math.sin((x/width)*4*Math.PI + Date.now()/1800) * 22;
        ctx.lineTo(x, y);
    }
    ctx.lineTo(width, height);
    ctx.lineTo(0, height);
    ctx.closePath();
    ctx.fillStyle = 'url(#wave-gradient)';
    ctx.fillStyle = '#3468c0';
    ctx.fill();
    ctx.restore();
}

// --- ANIMATION LOOP ---
function animate() {
    ctx.clearRect(0, 0, width, height);

    // Draw blobs
    blobs.forEach((b, i) => {
        ctx.save();
        ctx.globalAlpha = b.alpha;
        ctx.beginPath();
        const phase = Math.sin(Date.now()/1800 + b.phase) * 18;
        ctx.arc(b.x + phase, b.y - phase, b.r + Math.sin(Date.now()/1200 + i)*12, 0, 2*Math.PI);
        ctx.fillStyle = b.color;
        ctx.shadowColor = b.color;
        ctx.shadowBlur = 32;
        ctx.fill();
        ctx.restore();
    });

    // Draw wave
    drawWave();

    // Draw particles
    particles.forEach(p => {
        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, 2*Math.PI);
        ctx.fillStyle = p.color;
        ctx.shadowColor = p.color;
        ctx.shadowBlur = 18;
        ctx.fill();
        ctx.restore();
        // Move
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < -p.r) p.x = width + p.r;
        if (p.x > width + p.r) p.x = -p.r;
        if (p.y < -p.r) p.y = height + p.r;
        if (p.y > height + p.r) p.y = -p.r;
    });

    requestAnimationFrame(animate);
}

animate();

// Forzar animación de salto en el icono de email y luego swing indefinido
window.addEventListener('DOMContentLoaded', () => {
    const icon = document.querySelector('.icon-anim');
    if (icon) {
        icon.classList.remove('icon-anim');
        void icon.offsetWidth; // trigger reflow
        icon.classList.add('icon-anim');
        // Cuando termine la animación de entrada, dispara el swing
        icon.addEventListener('animationend', function handler(e) {
            if (e.animationName === 'iconSuperJump') {
                icon.removeEventListener('animationend', handler);
                icon.classList.add('icon-swing');
            }
        });
    }
}); 