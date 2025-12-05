class DataLoader {
    constructor() {
        this.data = null;
        this.init();
    }
    
    async init() {
        try {
            await this.loadData();
            if (this.data) {
                this.renderEducation();
                this.renderCertifications();
                console.log('✅ Data loaded successfully:', this.data);
            }
        } catch (error) {
            console.error('❌ Error loading data:', error);
        }
    }
    
    async loadData() {
        try {
            // Add timestamp to prevent caching
            const timestamp = new Date().getTime();
            const response = await fetch(`assets/data.json?t=${timestamp}`);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            this.data = await response.json();
            console.log('Data fetched from:', response.url);
        } catch (error) {
            console.error('❌ Failed to load data.json:', error);
        }
    }
    
    renderEducation() {
        if (!this.data || !this.data.education) {
            console.warn('❌ No education data found');
            return;
        }
        
        const container = document.getElementById('education-container');
        if (!container) {
            console.warn('❌ Education container not found');
            return;
        }
        
        container.innerHTML = '';
        console.log('📚 Rendering education items:', this.data.education);
        
        this.data.education.forEach((edu, index) => {
            const eduCard = document.createElement('div');
            eduCard.className = 'edu-card';
            eduCard.style.animation = `slideUpFade 0.8s ease-out ${index * 0.2}s backwards`;
            
            const startYear = new Date(edu.startDate).getFullYear();
            const endYear = new Date(edu.endDate).getFullYear();
            
            eduCard.innerHTML = `
                <div class="edu-icon">${edu.icon || '🎓'}</div>
                <h4>${edu.qualification}</h4>
                <p class="edu-institution">${edu.institution}</p>
                <span class="edu-year">${startYear} - ${endYear}</span>
            `;
            
            container.appendChild(eduCard);
            console.log(`Added education: ${edu.qualification} from ${edu.institution}`);
        });
    }
    
    renderCertifications() {
        if (!this.data || !this.data.certifications) {
            console.warn('❌ No certifications data found');
            return;
        }
        
        const container = document.getElementById('certifications-container');
        if (!container) {
            console.warn('❌ Certifications container not found');
            return;
        }
        
        container.innerHTML = '';
        console.log('📜 Rendering certifications:', this.data.certifications);
        
        this.data.certifications.forEach((cert, index) => {
            const certCard = document.createElement('div');
            certCard.className = 'edu-card';
            certCard.style.animation = `slideUpFade 0.8s ease-out ${index * 0.15}s backwards`;
            
            certCard.innerHTML = `
                <div class="edu-icon">${cert.icon}</div>
                <h4>${cert.name}</h4>
                <p class="edu-institution">${cert.issuer}</p>
                <span class="edu-year">${cert.date}</span>
            `;
            
            if (cert.url) {
                certCard.style.cursor = 'pointer';
                certCard.addEventListener('click', () => {
                    window.open(cert.url, '_blank');
                });
            }
            
            container.appendChild(certCard);
            console.log(`Added certification: ${cert.name} (${cert.date})`);
        });
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('🚀 Initializing DataLoader...');
        window.dataLoader = new DataLoader();
    });
} else {
    console.log('🚀 Initializing DataLoader...');
    window.dataLoader = new DataLoader();
}

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DataLoader;
}