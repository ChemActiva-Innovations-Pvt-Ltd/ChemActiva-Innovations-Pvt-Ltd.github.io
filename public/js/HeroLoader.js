// Enhanced Hero Loader with Particle Animation
class HeroLoader {
    constructor() {
        this.loader = document.getElementById('hero-loader');
        this.loaderContent = document.getElementById('loader-content');
        this.canvas = null;
        this.ctx = null;
        this.particles = [];
        this.animationId = null;
        
        if (this.loader && this.loaderContent) {
            this.init();
        }
    }
    
    init() {
        // Create canvas for particle animation
        this.canvas = document.createElement('canvas');
        this.ctx = this.canvas.getContext('2d');
        this.loaderContent.appendChild(this.canvas);
        
        // Set canvas size
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());
        
        // Create particles
        this.createParticles();
        
        // Start animation
        this.animate();
        
        // Show loader content
        setTimeout(() => {
            this.loaderContent.style.opacity = '1';
        }, 100);
    }
    
    resizeCanvas() {
        this.canvas.width = this.loaderContent.offsetWidth;
        this.canvas.height = this.loaderContent.offsetHeight;
    }
    
    createParticles() {
        const particleCount = Math.min(80, Math.floor(this.canvas.width / 10));
        this.particles = [];
        
        for (let i = 0; i < particleCount; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 3 + 1,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                color: this.getParticleColor()
            });
        }
    }
    
    getParticleColor() {
        const colors = [
            'rgba(76, 175, 80, 0.6)',   // Green
            'rgba(139, 195, 74, 0.6)',  // Light green
            'rgba(33, 150, 243, 0.6)',  // Blue
            'rgba(0, 188, 212, 0.6)'    // Cyan
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }
    
    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Update and draw particles
        this.particles.forEach((particle, index) => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Bounce off edges
            if (particle.x < 0 || particle.x > this.canvas.width) particle.vx *= -1;
            if (particle.y < 0 || particle.y > this.canvas.height) particle.vy *= -1;
            
            // Draw particle
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.fill();
            
            // Draw connections
            this.particles.slice(index + 1).forEach(otherParticle => {
                const dx = particle.x - otherParticle.x;
                const dy = particle.y - otherParticle.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    this.ctx.beginPath();
                    this.ctx.strokeStyle = `rgba(76, 175, 80, ${0.2 * (1 - distance / 100)})`;
                    this.ctx.lineWidth = 0.5;
                    this.ctx.moveTo(particle.x, particle.y);
                    this.ctx.lineTo(otherParticle.x, otherParticle.y);
                    this.ctx.stroke();
                }
            });
        });
        
        this.animationId = requestAnimationFrame(() => this.animate());
    }
    
    hide() {
        // Fade out animation
        if (this.loader) {
            this.loader.style.transition = 'opacity 0.8s ease-out';
            this.loader.style.opacity = '0';
            
            // Stop animation
            if (this.animationId) {
                cancelAnimationFrame(this.animationId);
            }
            
            setTimeout(() => {
                this.loader.style.display = 'none';
            }, 800);
        }
    }
}

// Initialize and export
const heroLoader = new HeroLoader();

// Auto-hide after page load
window.addEventListener('load', () => {
    setTimeout(() => {
        heroLoader.hide();
    }, 1500);
});

export default HeroLoader;
