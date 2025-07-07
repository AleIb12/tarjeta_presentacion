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
        
        this.debugMode = window.location.search.includes('debug=true');
        this.log('ContactSharer initialized');
        this.init();
    }

    log(message, type = 'info') {
        if (this.debugMode) {
            console.log(`[ContactSharer] ${type.toUpperCase()}: ${message}`);
        }
    }

    init() {
        this.log('Starting initialization');
        
        // Esperar a que el DOM esté completamente cargado
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                this.setupEventListeners();
                this.checkNFCSupport();
                this.checkQRSupport();
            });
        } else {
            this.setupEventListeners();
            this.checkNFCSupport();
            this.checkQRSupport();
        }
        
        this.log('Initialization complete');
    }

    setupEventListeners() {
        // Verificar que todos los botones existen antes de agregar listeners
        const buttons = [
            { id: 'nfc-btn', handler: () => this.shareViaStatus('nfc') },
            { id: 'qr-btn', handler: () => this.shareViaQR() },
            { id: 'vcard-btn', handler: () => this.shareViaVCard() },
            { id: 'whatsapp-btn', handler: () => this.shareViaWhatsApp() },
            { id: 'telegram-btn', handler: () => this.shareViaTelegram() }
        ];

        buttons.forEach(({ id, handler }) => {
            const button = document.getElementById(id);
            if (button) {
                // Agregar event listener
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    
                    // Verificar que el botón no esté deshabilitado
                    if (button.style.pointerEvents === 'none' || button.disabled) {
                        console.log(`Button ${id} is disabled`);
                        return;
                    }
                    
                    console.log(`Button ${id} clicked`);
                    handler();
                });
                
                console.log(`Event listener added for ${id}`);
            } else {
                console.error(`Button with id ${id} not found`);
            }
        });
    }

    // Verificar soporte QR
    checkQRSupport() {
        const qrBtn = document.getElementById('qr-btn');
        if (!qrBtn) return;
        
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
                if (subtitle) subtitle.textContent = 'Usa vCard en su lugar';
                
                const btnIcon = qrBtn.querySelector('.btn-icon');
                if (btnIcon) btnIcon.innerHTML = '❌';
            }
        }, 1000);
    }

    // Habilitar botón QR
    enableQRButton() {
        const qrBtn = document.getElementById('qr-btn');
        if (!qrBtn) return;
        
        const subtitle = qrBtn.querySelector('.btn-subtitle');
        const btnIcon = qrBtn.querySelector('.btn-icon');
        
        qrBtn.style.opacity = '1';
        qrBtn.style.cursor = 'pointer';
        qrBtn.style.pointerEvents = 'auto';
        if (subtitle) subtitle.textContent = 'Escanea para agregar';
        if (btnIcon) btnIcon.innerHTML = '📱';
        
        console.log('QR button enabled successfully');
    }

    // Verificar soporte NFC
    checkNFCSupport() {
        const nfcBtn = document.getElementById('nfc-btn');
        if (!nfcBtn) return;
        
        const subtitle = nfcBtn.querySelector('.btn-subtitle');
        
        // Verificar si es iOS (iPhone/iPad)
        const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
        
        if (!('NDEFReader' in window) || isIOS) {
            console.log('NFC is not supported on this device/browser');
            // Deshabilitar el botón visualmente
            nfcBtn.style.opacity = '0.5';
            nfcBtn.style.cursor = 'not-allowed';
            nfcBtn.style.pointerEvents = 'none';
            if (subtitle) subtitle.textContent = 'No disponible en este dispositivo';
            
            // Agregar un ícono de información
            const btnIcon = nfcBtn.querySelector('.btn-icon');
            if (btnIcon) btnIcon.innerHTML = '❌';
        } else {
            console.log('NFC is supported');
            if (subtitle) subtitle.textContent = 'Acerca tu dispositivo';
        }
    }

    // Compartir por NFC
    async shareViaStatus(type) {
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
                        this.showMessage('Error al activar NFC. Intenta nuevamente.', 'error');
                    }
                }
            } else {
                this.showMessage('NFC no es compatible con este navegador.', 'error');
            }
        }
    }

    // Compartir por QR
    shareViaQR() {
        const qrContainer = document.getElementById('qr-container');
        const canvas = document.getElementById('qr-code');
        
        if (!qrContainer || !canvas) {
            this.showMessage('Error: Elementos QR no encontrados', 'error');
            return;
        }
        
        // Si ya está visible, ocultarlo
        if (qrContainer.classList.contains('show')) {
            qrContainer.classList.remove('show');
            return;
        }
        
        const vCardData = this.generateVCard();
        
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
                this.showMessage('Error al generar código QR. Intenta descargar el vCard.', 'error');
            };
            
            img.src = qrUrl;
        } catch (error) {
            console.error('Error con API externa:', error);
            this.showMessage('Error al generar código QR. Intenta descargar el vCard.', 'error');
        }
    }

    // Compartir por vCard
    shareViaVCard() {
        const vCardData = this.generateVCard();
        const blob = new Blob([vCardData], { type: 'text/vcard;charset=utf-8' });
        const url = window.URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `${this.contactData.name}.vcf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        window.URL.revokeObjectURL(url);
        this.showMessage('¡Archivo vCard descargado! Abre el archivo para agregar el contacto.', 'success');
    }

    // Compartir por WhatsApp
    shareViaWhatsApp() {
        const message = `¡Hola! 👋 Te comparto mi información de contacto:

📱 *${this.contactData.name}*
💼 ${this.contactData.title}

📞 Teléfono: ${this.contactData.phone}
✉️ Email: ${this.contactData.email}
📍 Ubicación: ${this.contactData.location}

🌐 Portfolio: ${this.contactData.website}
💼 LinkedIn: ${this.contactData.linkedin}
🚀 GitHub: ${this.contactData.github}
☕ Buy Me a Coffee: ${this.contactData.buymeacoffee}

¡Contactemos! 🚀`;

        const encodedMessage = encodeURIComponent(message);
        const whatsappUrl = `https://wa.me/?text=${encodedMessage}`;
        
        window.open(whatsappUrl, '_blank');
        this.showMessage('¡Abriendo WhatsApp para compartir contacto!', 'success');
    }

    // Compartir por Telegram
    shareViaTelegram() {
        const message = `🌟 *${this.contactData.name}* 🌟
${this.contactData.title}

📱 ${this.contactData.phone}
✉️ ${this.contactData.email}
📍 ${this.contactData.location}

🔗 Links importantes:
🌐 Portfolio: ${this.contactData.website}
💼 LinkedIn: ${this.contactData.linkedin}
🚀 GitHub: ${this.contactData.github}
☕ Buy Me a Coffee: ${this.contactData.buymeacoffee}

¡Conectemos! ✨`;

        const encodedMessage = encodeURIComponent(message);
        const telegramUrl = `https://t.me/share/url?url=${encodeURIComponent(this.contactData.website)}&text=${encodedMessage}`;
        
        window.open(telegramUrl, '_blank');
        this.showMessage('¡Abriendo Telegram para compartir contacto!', 'success');
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
ADR;TYPE=HOME:;;${this.contactData.location};;;;
NOTE:Desarrolladora de Software especializada en soluciones web modernas.\\n\\nRedes sociales:\\nLinkedIn: ${this.contactData.linkedin}\\nGitHub: ${this.contactData.github}\\nInstagram: ${this.contactData.instagram}\\nBuy Me a Coffee: ${this.contactData.buymeacoffee}
END:VCARD`;

        return vCard;
    }

    // Mostrar mensaje de estado
    showMessage(message, type = 'info') {
        const statusMessage = document.getElementById('status-message');
        if (statusMessage) {
            statusMessage.textContent = message;
            statusMessage.className = `status-message ${type}`;
            statusMessage.style.display = 'block';
            
            // Ocultar después de 5 segundos
            setTimeout(() => {
                statusMessage.style.display = 'none';
            }, 5000);
        }
        
        this.log(`Message shown: ${message}`, type);
    }

    // Test de funcionalidad para debugging
    testAllButtons() {
        const buttons = [
            { id: 'nfc-btn', name: 'NFC' },
            { id: 'qr-btn', name: 'QR' },
            { id: 'vcard-btn', name: 'vCard' },
            { id: 'whatsapp-btn', name: 'WhatsApp' },
            { id: 'telegram-btn', name: 'Telegram' }
        ];

        let testResults = [];
        
        buttons.forEach(({ id, name }) => {
            const button = document.getElementById(id);
            if (button) {
                const isDisabled = button.style.pointerEvents === 'none' || button.disabled;
                const hasListener = button.onclick !== null;
                
                testResults.push({
                    name,
                    exists: true,
                    disabled: isDisabled,
                    hasListener
                });
                
                this.log(`${name} button: exists=true, disabled=${isDisabled}, hasListener=${hasListener}`);
            } else {
                testResults.push({
                    name,
                    exists: false,
                    disabled: false,
                    hasListener: false
                });
                
                this.log(`${name} button: NOT FOUND`, 'error');
            }
        });
        
        return testResults;
    }
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing ContactSharer...');
    
    // Crear instancia del ContactSharer
    window.contactSharer = new ContactSharer();
    
    // Modo debug - agregar testing global
    if (window.location.search.includes('debug=true')) {
        console.log('Debug mode enabled');
        window.testButtons = () => window.contactSharer.testAllButtons();
        console.log('Use window.testButtons() to test all buttons');
    }
    
    console.log('ContactSharer initialized successfully');
});

// Fallback para cuando el DOM ya está cargado
if (document.readyState === 'interactive' || document.readyState === 'complete') {
    console.log('DOM already loaded, initializing ContactSharer...');
    window.contactSharer = new ContactSharer();
    
    if (window.location.search.includes('debug=true')) {
        window.testButtons = () => window.contactSharer.testAllButtons();
    }
}
