class AudioManager {
    constructor() {
        this.audio = document.getElementById('background-music');
        this.toggleBtn = document.getElementById('music-toggle');
        this.isPlaying = false;
        this.isMuted = false;
        this.hasInteracted = false;
        
        if (!this.audio || !this.toggleBtn) {
            console.warn('Audio elements not found');
            return;
        }
        
        this.init();
    }
    
    init() {
        // Set initial volume to 30%
        this.audio.volume = 0.3;
        
        // Event listeners
        this.toggleBtn.addEventListener('click', () => this.toggleMusic());
        this.audio.addEventListener('play', () => this.onPlay());
        this.audio.addEventListener('pause', () => this.onPause());
        this.audio.addEventListener('ended', () => this.onEnded());
        this.audio.addEventListener('error', (e) => this.onError(e));
        
        // Trigger music on user interaction
        document.addEventListener('scroll', () => this.startMusicOnInteraction(), { once: true });
        document.addEventListener('mousemove', () => this.startMusicOnInteraction(), { once: true });
        document.addEventListener('touchstart', () => this.startMusicOnInteraction(), { once: true });
        document.addEventListener('click', () => this.startMusicOnInteraction(), { once: true });
        document.addEventListener('keydown', () => this.startMusicOnInteraction(), { once: true });
        
        // Auto-start after 3 seconds
        setTimeout(() => this.startMusicOnInteraction(), 3000);
        
        console.log('Audio Manager initialized');
    }
    
    startMusicOnInteraction() {
        if (!this.hasInteracted && !this.isMuted) {
            this.hasInteracted = true;
            this.play();
        }
    }
    
    play() {
        if (!this.audio) return;
        
        // Fade in effect
        let currentVolume = this.audio.volume;
        this.audio.volume = 0;
        
        const fadeIn = setInterval(() => {
            if (this.audio.volume < currentVolume) {
                this.audio.volume = Math.min(this.audio.volume + 0.05, currentVolume);
            } else {
                clearInterval(fadeIn);
            }
        }, 50);
        
        const playPromise = this.audio.play();
        
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    console.log('Music started playing');
                })
                .catch(error => {
                    console.log('Autoplay prevented or error occurred:', error);
                    // Some browsers block autoplay - user will need to click
                });
        }
    }
    
    pause() {
        if (!this.audio) return;
        
        // Fade out effect
        const fadeOut = setInterval(() => {
            if (this.audio.volume > 0.05) {
                this.audio.volume -= 0.05;
            } else {
                this.audio.pause();
                this.audio.volume = 0.3; // Reset volume for next play
                clearInterval(fadeOut);
            }
        }, 50);
    }
    
    toggleMusic() {
        if (this.isMuted) {
            this.unmute();
        } else {
            this.mute();
        }
    }
    
    mute() {
        if (this.audio) {
            this.pause();
            this.isMuted = true;
            this.updateButtonState();
            this.savePreference();
            console.log('Music muted');
        }
    }
    
    unmute() {
        if (this.audio) {
            this.isMuted = false;
            this.updateButtonState();
            this.play();
            this.savePreference();
            console.log('Music unmuted');
        }
    }
    
    updateButtonState() {
        if (this.isMuted) {
            this.toggleBtn.classList.add('muted');
            this.toggleBtn.classList.remove('playing');
            this.toggleBtn.innerHTML = '<span class="music-icon">🔇</span>';
            this.toggleBtn.title = 'Unmute Music';
        } else if (this.isPlaying) {
            this.toggleBtn.classList.remove('muted');
            this.toggleBtn.classList.add('playing');
            this.toggleBtn.innerHTML = '<span class="music-icon">🔊</span>';
            this.toggleBtn.title = 'Mute Music';
        } else {
            this.toggleBtn.classList.remove('muted', 'playing');
            this.toggleBtn.innerHTML = '<span class="music-icon">🔊</span>';
            this.toggleBtn.title = 'Play Music';
        }
    }
    
    onPlay() {
        this.isPlaying = true;
        this.updateButtonState();
    }
    
    onPause() {
        this.isPlaying = false;
        if (!this.isMuted) {
            this.updateButtonState();
        }
    }
    
    onEnded() {
        this.isPlaying = false;
        // Audio will loop due to loop attribute, but this handles edge cases
    }
    
    onError(error) {
        console.error('Audio error:', error);
        this.toggleBtn.title = 'Audio file not found';
    }
    
    setVolume(level) {
        if (this.audio) {
            this.audio.volume = Math.max(0, Math.min(1, level));
        }
    }
    
    getVolume() {
        return this.audio ? this.audio.volume : 0;
    }
    
    savePreference() {
        localStorage.setItem('music-muted', this.isMuted);
    }
    
    loadPreference() {
        const saved = localStorage.getItem('music-muted');
        if (saved === 'true') {
            this.isMuted = true;
            this.updateButtonState();
        }
    }
}

// Initialize audio manager when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.audioManager = new AudioManager();
    window.audioManager.loadPreference();
});