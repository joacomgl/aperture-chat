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

    // Evento para enviar mensaje
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

        // 2. Activar estado "escribiendo..."
        loadingIndicator.classList.remove('hidden');
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        try {
            // Estructurar el historial con el formato oficial que exige Gemini API (roles: user/model)
            const apiContents = chatHistory.map(msg => ({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.text }]
            }));

            // 3. Petición HTTP al proxy seguro (Vercel Serverless Function)
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ contents: apiContents })
            });

            if (!response.ok) {
                throw new Error('La IA sufrió un colapso en sus circuitos.');
            }

            const data = await response.json();
            const cleanReply = parseApiResponse(data.reply);

            // 4. Agregar respuesta de GLaDOS al historial
            chatHistory.push({
                role: 'glados',
                text: cleanReply || '... [GLaDOS te mira fijamente en silencio] ...',
                time: getTimestamp()
            });

        } catch (error) {
            // Manejo de errores visuales en el chat
            chatHistory.push({
                role: 'glados',
                text: `ERROR DEL SISTEMA: ${error.message}. Por favor, continúe con la siguiente prueba.`,
                time: getTimestamp()
            });
        } finally {
            // Desactivar estado de carga, actualizar persistencia y refrescar vista
            loadingIndicator.classList.add('hidden');
            saveHistory();
            renderMessages(messagesContainer);
        }
    });

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

        // Si el mensaje es de GLaDOS, añadimos el botón para copiar respuesta (Extra)
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

    // Auto-scroll automático al último mensaje
    container.scrollTop = container.scrollHeight;
}

/**
 * Guarda el estado del historial actual en localStorage.
 */
function saveHistory() {
    localStorage.setItem('aperture_chat_history', JSON.stringify(chatHistory));
}