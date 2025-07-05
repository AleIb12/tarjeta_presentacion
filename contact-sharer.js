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
        this.checkQRSupport();
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

    // Verificar soporte QR
    checkQRSupport() {
        const qrBtn = document.getElementById('qr-btn');
        const subtitle = qrBtn.querySelector('.btn-subtitle');
        
        // Esperar un poco para que se carguen las librerías
        setTimeout(() => {
            if (window.qrLibraryLoaded || typeof qrcode !== 'undefined' || typeof QRCode !== 'undefined') {
                console.log('QR Code library is available');
                this.enableQRButton();
            } else {
                console.log('QR Code library failed to load');
                qrBtn.style.opacity = '0.5';
                qrBtn.style.cursor = 'not-allowed';
                qrBtn.style.pointerEvents = 'none';
                subtitle.textContent = 'Usa vCard en su lugar';
                
                const btnIcon = qrBtn.querySelector('.btn-icon');
                btnIcon.innerHTML = '❌';
            }
        }, 1000);
    }

    // Habilitar botón QR
    enableQRButton() {
        const qrBtn = document.getElementById('qr-btn');
        const subtitle = qrBtn.querySelector('.btn-subtitle');
        const btnIcon = qrBtn.querySelector('.btn-icon');
        
        qrBtn.style.opacity = '1';
        qrBtn.style.cursor = 'pointer';
        qrBtn.style.pointerEvents = 'auto';
        subtitle.textContent = 'Escanea para agregar';
        btnIcon.innerHTML = '📱';
        
        console.log('QR button enabled successfully');
    }

    // Verificar soporte NFC
    checkNFCSupport() {
        const nfcBtn = document.getElementById('nfc-btn');
        const subtitle = nfcBtn.querySelector('.btn-subtitle');
        
        // Verificar si es iOS (iPhone/iPad)
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        
        if (!('NDEFReader' in window) || isIOS) {
            console.log('NFC is not supported on this device/browser');
            // Deshabilitar el botón visualmente
            nfcBtn.style.opacity = '0.5';
            nfcBtn.style.cursor = 'not-allowed';
            nfcBtn.style.pointerEvents = 'none';
            subtitle.textContent = 'No disponible en este dispositivo';
            
            // Agregar un ícono de información
            const btnIcon = nfcBtn.querySelector('.btn-icon');
            btnIcon.innerHTML = '❌';
        } else {
            console.log('NFC is supported');
            subtitle.textContent = 'Acerca tu dispositivo';
        }
    }

    // Compartir por NFC
    async shareViaStatus(type) {
        const statusMessage = document.getElementById('status-message');
        
        if (type === 'nfc') {
            // Verificar si es iOS
            const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
            
            if (isIOS) {
                this.showMessage('NFC no está disponible en dispositivos iOS. Usa el código QR o descarga el vCard.', 'info');
                return;
            }
            
            if ('NDEFReader' in window) {
                try {
                    const ndef = new NDEFReader();
                    const vCardData = this.generateVCard();
                    
                    // Solicitar permisos
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
                    if (error.name === 'NotAllowedError') {
                        this.showMessage('Permiso denegado. Habilita NFC en la configuración del dispositivo.', 'error');
                    } else if (error.name === 'NotSupportedError') {
                        this.showMessage('NFC no es compatible con este dispositivo.', 'error');
                    } else {
                        this.showMessage('Error al compartir por NFC. Intenta con QR o vCard.', 'error');
                    }
                }
            } else {
                this.showMessage('NFC no es compatible con este navegador. Usa Chrome en Android.', 'error');
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
            this.showMessage('Código QR ocultado', 'info');
            return;
        }

        // Generar vCard para el QR
        const vCardData = this.generateVCard();
        
        // Verificar que el canvas existe
        if (!canvas) {
            this.showMessage('Error: Canvas no encontrado', 'error');
            return;
        }
        
        // Mostrar mensaje de carga
        this.showMessage('Generando código QR...', 'info');
        
        try {
            // Intentar con la primera librería (qrcode-generator)
            if (typeof qrcode !== 'undefined') {
                this.generateQRWithSimpleLibrary(canvas, vCardData, qrContainer);
            } 
            // Intentar con la segunda librería (QRCode)
            else if (typeof QRCode !== 'undefined') {
                this.generateQRWithQRCodeLibrary(canvas, vCardData, qrContainer);
            }
            // Si no hay librerías, usar una API externa
            else {
                this.generateQRWithAPI(canvas, vCardData, qrContainer);
            }
        } catch (error) {
            console.error('Error al generar QR:', error);
            this.showMessage('Error al generar QR. Intenta descargar el vCard.', 'error');
        }
    }

    // Generar QR con librería simple
    generateQRWithSimpleLibrary(canvas, vCardData, qrContainer) {
        try {
            const qr = qrcode(0, 'M');
            qr.addData(vCardData);
            qr.make();
            
            const ctx = canvas.getContext('2d');
            canvas.width = 200;
            canvas.height = 200;
            
            // Limpiar canvas
            ctx.fillStyle = '#ffffff';
            ctx.fillRect(0, 0, 200, 200);
            
            // Dibujar QR
            const modules = qr.modules;
            const tileW = 200 / modules.length;
            const tileH = 200 / modules.length;
            
            for (let row = 0; row < modules.length; row++) {
                for (let col = 0; col < modules.length; col++) {
                    ctx.fillStyle = modules[row][col] ? '#000000' : '#ffffff';
                    ctx.fillRect(col * tileW, row * tileH, tileW, tileH);
                }
            }
            
            qrContainer.classList.add('show');
            this.showMessage('¡Código QR generado! Escanea para agregar el contacto.', 'success');
            
            setTimeout(() => {
                qrContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }, 300);
            
        } catch (error) {
            console.error('Error con librería simple:', error);
            this.generateQRWithAPI(canvas, vCardData, qrContainer);
        }
    }

    // Generar QR con QRCode.js
    generateQRWithQRCodeLibrary(canvas, vCardData, qrContainer) {
        QRCode.toCanvas(canvas, vCardData, {
            width: 200,
            height: 200,
            margin: 2,
            color: {
                dark: '#000000',
                light: '#ffffff'
            },
            errorCorrectionLevel: 'M'
        }, (error) => {
            if (error) {
                console.error('Error con QRCode.js:', error);
                this.generateQRWithAPI(canvas, vCardData, qrContainer);
            } else {
                qrContainer.classList.add('show');
                this.showMessage('¡Código QR generado! Escanea para agregar el contacto.', 'success');
                
                setTimeout(() => {
                    qrContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 300);
            }
        });
    }

    // Generar QR con API externa (fallback final)
    generateQRWithAPI(canvas, vCardData, qrContainer) {
        try {
            const encodedData = encodeURIComponent(vCardData);
            const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodedData}`;
            
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
                const ctx = canvas.getContext('2d');
                canvas.width = 200;
                canvas.height = 200;
                ctx.drawImage(img, 0, 0, 200, 200);
                
                qrContainer.classList.add('show');
                this.showMessage('¡Código QR generado! Escanea para agregar el contacto.', 'success');
                
                setTimeout(() => {
                    qrContainer.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 300);
            };
            img.onerror = () => {
                this.showMessage('Error al generar QR. Usa la opción de descargar vCard.', 'error');
            };
            img.src = qrUrl;
            
        } catch (error) {
            console.error('Error con API externa:', error);
            this.showMessage('Error al generar QR. Usa la opción de descargar vCard.', 'error');
        }
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
    window.ContactSharer = new ContactSharer();
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
