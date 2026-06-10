import { getTimestamp, parseApiResponse } from './utils.js';

// Historial en memoria. Se inicializa intentando leer de localStorage
let chatHistory = JSON.parse(localStorage.getItem('aperture_chat_history')) || [];

/**
 * Inicializa los elementos del DOM y listeners de la vista de Chat.
 * Es invocada dinámicamente por app.js al cargar la ruta /chat.
 */
export function initChat() {
    const chatForm = document.getElementById('chat-form');
    const chatInput = document.getElementById('chat-input');
    const messagesContainer = document.getElementById('chat-messages');
    const loadingIndicator = document.getElementById('chat-loading');
    const clearBtn = document.getElementById('btn-clear-chat');

    if (!chatForm || !chatInput || !messagesContainer) return;

    // Pintar los mensajes almacenados de sesiones previas
    renderMessages(messagesContainer);

    // Evento para enviar mensaje (Versión mejorada con bloqueo de seguridad)
    chatForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const messageText = chatInput.value.trim();
        if (!messageText) return;

        // 1. Agregar mensaje del usuario al historial local
        chatHistory.push({
            role: 'user',
            text: messageText,
            time: getTimestamp()
        });

        // Limpiar input y refrescar pantalla
        chatInput.value = '';
        renderMessages(messagesContainer);

        // Bloquear controles para evitar envíos dobles o masivos
        chatInput.disabled = true;
        const submitBtn = chatForm.querySelector('button[type="submit"]');
        if (submitBtn) submitBtn.disabled = true;

        // 2. Activar estado "escribiendo..."
        loadingIndicator.classList.remove('hidden');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        try {
            // DETECTAR ENTORNO: Si estamos en localhost, simulamos para evitar el bug de Node 24 en Windows
            if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
                // Simulación local instantánea con respuestas estilo GLaDOS
                const respuestasLocales = [
                    "Interesante pregunta para un espécimen de tu inteligencia. El pastel sigue siendo una mentira, por cierto.",
                    "He analizado tu mensaje. Mis sensores indican una eficiencia humana del 12%. Continuemos con las pruebas.",
                    "Los circuitos de Aperture están operativos. Tu insistencia es casi... conmovedora. No te emociones.",
                    "Procesando... Por favor, colócate en la cámara de relajación más cercana mientras ignoro tu comentario."
                ];
                // Elegir una respuesta al azar
                const cleanReply = respuestasLocales[Math.floor(Math.random() * respuestasLocales.length)];

                // Esperar medio segundo para simular latencia de red
                await new Promise(resolve => setTimeout(resolve, 600));

                chatHistory.push({
                    role: 'glados',
                    text: cleanReply,
                    time: getTimestamp()
                });
            } else { 
                // EN PRODUCCIÓN (VERCEL NUBE): Ejecuta el código real hacia Gemini sin fallas
                const apiContents = chatHistory.map(msg => ({
                    role: msg.role === 'user' ? 'user' : 'model',
                    parts: [{ text: msg.text }]
                }));

                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ contents: apiContents })
                });

                // Si Vercel devuelve un error (ej: 400, 404, 500), leemos el JSON para saber qué pasó
                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({}));
                    const mensajeError = errorData.error || 'La IA sufrió un colapso en sus circuitos.';
                    throw new Error(mensajeError);
                }

                const data = await response.json();
                
                // Validamos: si parseApiResponse falla o no existe, usamos directamente data.reply
                let cleanReply = '';
                try {
                    cleanReply = parseApiResponse(data.reply);
                } catch (e) {
                    cleanReply = data.reply;
                }

                chatHistory.push({
                    role: 'glados',
                    text: cleanReply || '... [GLaDOS te mira fijamente en silencio] ...',
                    time: getTimestamp()
                });
            }

        } catch (error) { 
            chatHistory.push({
                role: 'glados',
                text: `ERROR DEL SISTEMA: ${error.message}. Por favor, continúe con la siguiente prueba.`,
                time: getTimestamp()
            });
        } finally { // <--- RESTAURADO: Desbloquea la interfaz tras terminar la petición
            chatInput.disabled = false;
            if (submitBtn) submitBtn.disabled = false;
            chatInput.focus();

            loadingIndicator.classList.add('hidden');
            saveHistory();
            renderMessages(messagesContainer);
        }
    }); // <--- Cierre del addEventListener corregido

    // Evento para limpiar el historial de la sesión y almacenamiento
    clearBtn.addEventListener('click', () => {
        chatHistory = [];
        saveHistory();
        renderMessages(messagesContainer);
    });

    // Delegación de eventos para capturar clicks en el botón "Copiar"
    messagesContainer.addEventListener('click', (e) => {
        if (e.target.matches('.copy-btn')) {
            const textToCopy = e.target.getAttribute('data-text');
            navigator.clipboard.writeText(textToCopy).then(() => {
                const originalText = e.target.innerText;
                e.target.innerText = '¡Copiado!';
                setTimeout(() => { e.target.innerText = originalText; }, 1500);
            });
        }
    });
}

/**
 * Renderiza el arreglo de mensajes dentro del contenedor del DOM.
 */
function renderMessages(container) {
    container.innerHTML = '';

    if (chatHistory.length === 0) {
        container.innerHTML = `
            <div class="message glados">
                Haz iniciado conexión. Adelante, di algo. El laboratorio necesita recopilar datos de tus cuerdas vocales.
                <span class="timestamp">${getTimestamp()}</span>
            </div>
        `;
        return;
    }

    chatHistory.forEach(msg => {
        const msgElement = document.createElement('div');
        msgElement.classList.add('message', msg.role);

        const copyButtonHTML = msg.role === 'glados'
            ? `<button class="copy-btn" data-text="${msg.text.replace(/"/g, '&quot;')}">Copiar</button>`
            : '';

        msgElement.innerHTML = `
            ${copyButtonHTML}
            <span>${msg.text}</span>
            <span class="timestamp">${msg.time}</span>
        `;
        container.appendChild(msgElement);
    });

    container.scrollTop = container.scrollHeight;
}

/**
 * Guarda el estado del historial actual en localStorage.
 */
function saveHistory() {
    localStorage.setItem('aperture_chat_history', JSON.stringify(chatHistory