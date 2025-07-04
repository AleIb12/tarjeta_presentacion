// Contact Sharer - Funcionalidad para compartir contacto por NFC, QR y vCard
class ContactSharer {
    constructor() {
        this.contactData = {
            name: 'Alisha Ibarra Bello',
            phone: '+34692616005',
            email: 'ibarrabelloalisha@gmail.com',
            title: 'Desarrolladora de Software',
            location: 'Madrid, España',
            website: 'https://alishas-atelier.vercel.app',
            linkedin: 'https://www.linkedin.com/in/alisha-ibarra-bello-4526561b6',
            github: 'https://github.com/AleIb12',
            instagram: 'https://instagram.com/ali.ibarrabello',
            buymeacoffee: 'https://buymeacoffee.com/ali.ibarra'
        };
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.checkNFCSupport();
    }

    setupEventListeners() {
        // Botón NFC
        document.getElementById('nfc-btn').addEventListener('click', () => {
            this.shareViaStatus('nfc');
        });

        // Botón QR
        document.getElementById('qr-btn').addEventListener('click', () => {
            this.shareViaQR();
        });

        // Botón vCard
        document.getElementById('vcard-btn').addEventListener('click', () => {
            this.shareViaVCard();
        });
    }

    // Verificar soporte NFC
    checkNFCSupport() {
        if ('NDEFReader' in window) {
            console.log('NFC is supported');
        } else {
            console.log('NFC is not supported');
            // Actualizar el botón para mostrar que no es compatible
            const nfcBtn = document.getElementById('nfc-btn');
            const subtitle = nfcBtn.querySelector('.btn-subtitle');
            subtitle.textContent = 'No disponible en este dispositivo';
        }
    }

    // Compartir por NFC
    async shareViaStatus(type) {
        const statusMessage = document.getElementById('status-message');
        
        if (type === 'nfc') {
            if ('NDEFReader' in window) {
                try {
                    const ndef = new NDEFReader();
                    const vCardData = this.generateVCard();
                    
                    await ndef.write({
                        records: [
                            {
                                recordType: "text",
                                data: vCardData
                            }
                        ]
                    });
                    
                    this.showMessage('¡Contacto compartido por NFC! Acerca otro dispositivo para recibir.', 'success');
                } catch (error) {
                    console.error('Error al compartir por NFC:', error);
                    this.showMessage('Error al compartir por NFC. Asegúrate de tener NFC habilitado.', 'error');
                }
            } else {
                this.showMessage('NFC no es compatible con este dispositivo o navegador.', 'error');
            }
        }
    }

    // Compartir por QR
    shareViaQR() {
        const qrContainer = document.getElementById('qr-container');
        const canvas = document.getElementById('qr-code');
        
        // Alternar la visibilidad del contenedor QR
        if (qrContainer.classList.contains('show')) {
            qrContainer.classList.remove('show');
            return;
        }

        // Generar vCard para el QR
        const vCardData = this.generateVCard();
        
        // Generar QR Code
        QRCode.toCanvas(canvas, vCardData, {
            width: 200,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#ffffff'
            }
        }, (error) => {
            if (error) {
                console.error('Error al generar QR:', error);
                this.showMessage('Error al generar código QR.', 'error');
            } else {
                qrContainer.classList.add('show');
                this.showMessage('¡Código QR generado! Escanea para agregar el contacto.', 'success');
            }
        });
    }

    // Compartir por vCard
    shareViaVCard() {
        const vCardData = this.generateVCard();
        const blob = new Blob([vCardData], { type: 'text/vcard' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `${this.contactData.name.replace(/\s+/g, '_')}_contact.vcf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        this.showMessage('¡Archivo vCard descargado! Abre el archivo para agregar el contacto.', 'success');
    }

    // Generar vCard
    generateVCard() {
        const vCard = `BEGIN:VCARD
VERSION:3.0
FN:${this.contactData.name}
N:Ibarra Bello;Alisha;;;
ORG:Freelance
TITLE:${this.contactData.title}
TEL;TYPE=CELL:${this.contactData.phone}
EMAIL;TYPE=INTERNET:${this.contactData.email}
URL:${this.contactData.website}
ADR;TYPE=HOME:;;${this.contactData.location};;;
X-SOCIALPROFILE;TYPE=LinkedIn:${this.contactData.linkedin}
X-SOCIALPROFILE;TYPE=GitHub:${this.contactData.github}
X-SOCIALPROFILE;TYPE=Instagram:${this.contactData.instagram}
X-SOCIALPROFILE;TYPE=BuyMeACoffee:${this.contactData.buymeacoffee}
NOTE:Desarrolladora de Software especializada en desarrollo web y aplicaciones móviles. Disponible para proyectos freelance y colaboraciones.
END:VCARD`;
        return vCard;
    }

    // Mostrar mensaje de estado
    showMessage(message, type) {
        const statusMessage = document.getElementById('status-message');
        statusMessage.textContent = message;
        statusMessage.className = `status-message ${type} show`;
        
        // Ocultar mensaje después de 4 segundos
        setTimeout(() => {
            statusMessage.classList.remove('show');
        }, 4000);
    }

    // Método para compartir usando Web Share API si está disponible
    async shareViaWebShare() {
        if (navigator.share) {
            try {
                await navigator.share({
                    title: this.contactData.name,
                    text: `Contacto de ${this.contactData.name} - ${this.contactData.title}`,
                    url: this.contactData.website
                });
                this.showMessage('¡Contacto compartido exitosamente!', 'success');
            } catch (error) {
                console.error('Error al compartir:', error);
                this.showMessage('Error al compartir el contacto.', 'error');
            }
        } else {
            this.showMessage('La función de compartir no está disponible en este navegador.', 'error');
        }
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new ContactSharer();
});

// Funcionalidad adicional para mejorar la experiencia
document.addEventListener('DOMContentLoaded', () => {
    // Efecto de typing para el nombre
    const nameElement = document.querySelector('.profile-info h1');
    if (nameElement) {
        const originalText = nameElement.textContent;
        nameElement.textContent = '';
        
        let i = 0;
        const typeWriter = () => {
            if (i < originalText.length) {
                nameElement.textContent += originalText.charAt(i);
                i++;
                setTimeout(typeWriter, 100);
            }
        };
        
        // Iniciar el efecto después de un pequeño delay
        setTimeout(typeWriter, 500);
    }

    // Animación de entrada para los elementos de contacto
    const contactItems = document.querySelectorAll('.contact-item');
    contactItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            item.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            item.style.opacity = '1';
            item.style.transform = 'translateY(0)';
        }, 800 + (index * 100));
    });

    // Animación de entrada para los botones de compartir
    const shareButtons = document.querySelectorAll('.share-btn');
    shareButtons.forEach((button, index) => {
        button.style.opacity = '0';
        button.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            button.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            button.style.opacity = '1';
            button.style.transform = 'translateY(0)';
        }, 1200 + (index * 150));
    });

    // Efecto de particles en el background
    createParticles();
});

// Función para crear partículas de fondo
function createParticles() {
    const particleCount = 15;
    const body = document.body;
    
    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: fixed;
            width: 4px;
            height: 4px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            pointer-events: none;
            z-index: -1;
            left: ${Math.random() * 100}vw;
            top: ${Math.random() * 100}vh;
            animation: particleFloat ${5 + Math.random() * 10}s ease-in-out infinite;
            animation-delay: ${Math.random() * 2}s;
        `;
        body.appendChild(particle);
    }
}

// Añadir estilos para las partículas
const style = document.createElement('style');
style.textContent = `
    @keyframes particleFloat {
        0%, 100% { 
            transform: translateY(0px) translateX(0px) rotate(0deg);
            opacity: 0.3;
        }
        25% { 
            transform: translateY(-20px) translateX(10px) rotate(90deg);
            opacity: 0.7;
        }
        50% { 
            transform: translateY(-10px) translateX(-10px) rotate(180deg);
            opacity: 0.5;
        }
        75% { 
            transform: translateY(-30px) translateX(5px) rotate(270deg);
            opacity: 0.8;
        }
    }
    
    .particle {
        animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
    }
`;
document.head.appendChild(style);
