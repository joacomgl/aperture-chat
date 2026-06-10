// Importar la lógica del chat (se usará cuando inicialicemos la vista del chat)
import { initChat } from './chat.js';

// 1. Definición de las vistas de la SPA
const views = {
    '/home': () => `
        <section class="view-container home-view">
            <h1 class="terminal-title">BIENVENIDO A APERTURE SCIENCE</h1>
            <p class="description">
                Estás a punto de interactuar con el Centro de Desarrollo y el Sistema Operativo del Complejo: <strong>GLaDOS</strong>. 
                Por favor, mantén la calma durante las pruebas de comunicación.
            </p>
            <div class="warning-box">
                <strong>AVISO:</strong> El comportamiento sarcástico, las amenazas sutiles y las evaluaciones científicas son normales en el modelo de Inteligencia Artificial actual.
            </div>
            <button id="btn-start-chat" class="aperture-btn dynamic-link" data-href="/chat">Empezar a chatear</button>
        </section>
    `,
    '/chat': () => `
        <section class="view-container chat-view">
            <div class="chat-header">
                <h2>Terminal de Comunicación: GLaDOS</h2>
                <button id="btn-clear-chat" class="clear-btn">Limpiar Historial</button>
            </div>
            <div id="chat-messages" class="chat-messages-container">
                </div>
            <div id="chat-loading" class="chat-loading hidden">GLaDOS está escribiendo...</div>
            <form id="chat-form" class="chat-input-area">
                <input type="text" id="chat-input" placeholder="Escribe un mensaje para GLaDOS..." autocomplete="off" required />
                <button type="submit" id="chat-submit">Enviar</button>
            </form>
        </section>
    `,
    '/about': () => `
        <section class="view-container about-view">
            <h1>Especificaciones del Proyecto</h1>
            <p><strong>Nombre del Sistema:</strong> Aperture Chat (SPA)</p>
            <p><strong>Sujeto de Interfaz:</strong> GLaDOS (Genetic Lifeform and Disk Operating System)</p>
            <p><strong>Núcleo de Cómputo:</strong> Gemini AI Pro v1.5 API de Google operado mediante Vercel Serverless Proxy.</p>
            <p><strong>Protocolos de Prueba:</strong> Vitest Unit Testing Framework.</p>
        </section>
    `
};

// 2. Función del Enrutador Principal
const router = () => {
    let path = window.location.pathname;

    // Redirección por defecto a /home si la ruta es la raíz o no existe
    if (path === '/' || !views[path]) {
        path = '/home';
        window.history.replaceState(null, '', path);
    }

    // Renderizar la vista correspondiente en el contenedor principal
    const appContainer = document.getElementById('app');
    appContainer.innerHTML = views[path]();

    // Actualizar clases activas en los enlaces de navegación del header
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === path) {
            link.classList.add('active');
        } else {
            link.classList.remove('active');
        }
    });

    // Inicializar la lógica específica si entramos a la vista de chat
    if (path === '/chat') {
        initChat();
    }

    // Agregar funcionalidad al botón dinámico de "Empezar a chatear" si existe en la vista actual
    const startBtn = document.getElementById('btn-start-chat');
    if (startBtn) {
        startBtn.addEventListener('click', () => {
            navigateTo(startBtn.getAttribute('data-href'));
        });
    }
};

// 3. Función para navegar sin recargar la página
const navigateTo = (url) => {
    window.history.pushState(null, '', url);
    router();
};

// 4. Capturar eventos globales de navegación
document.addEventListener('DOMContentLoaded', () => {
    // Interceptar clicks en enlaces con data-link
    document.body.addEventListener('click', e => {
        if (e.target.matches('[data-link]')) {
            e.preventDefault();
            navigateTo(e.target.getAttribute('href'));
        }
    });

    // Escuchar el evento de volver atrás/adelante en el navegador
    window.addEventListener('popstate', router);

    // Ejecutar el enrutador en la carga inicial
    router();
});