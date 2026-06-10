# Aperture Chat 🧪 — SPA Terminal con GLaDOS

Aperture Chat es una Single Page Application (SPA) responsiva construida con tecnologías nativas (HTML, CSS y JavaScript Vanilla) que permite a los usuarios interactuar con **GLaDOS** (Genetic Lifeform and Disk Operating System), la icónica inteligencia artificial del complejo de laboratorios de Aperture Science (juego de pc PORTAL).

La aplicación utiliza la **History API** para gestionar el enrutamiento dinámico sin recargas de página, interactúa con la API de **Gemini AI** a través de una función segura en el servidor proxy (Vercel Serverless Functions) y cuenta con una suite de pruebas automatizadas mediante **Vitest**.

---

## 👤 Perfil del Personaje: GLaDOS
GLaDOS no es una IA ordinaria ni amigable. Es sumamente fría, calculadora, pasivo-agresiva, sarcástica y condescendiente. Considera a la humanidad como una especie inferior, ineficiente y prescindible, perfectamente apta para ser utilizada como sujeto de pruebas en experimentos científicos. Sus respuestas están llenas de humor negro, terminología científica y sutiles amenazas relacionadas con neurotoxinas, torretas o promesas vacías de pasteles.

---

## 🛠️ Tecnologías Utilizadas
* **Frontend:** HTML5, CSS3 (Mobile-first con Flexbox y Grid) y JavaScript Vanilla (ES Modules).
* **Enrutamiento:** HTML5 History API (Navegación limpia sin recargas).
* **Backend Proxy:** Vercel Serverless Functions (para ocultar de forma segura la clave de la API).
* **Inteligencia Artificial:** Google Gemini AI Pro (`gemini-1.5-flash`).
* **Pruebas Automatizadas:** Vitest (Pruebas unitarias y entornos simulados).
* **Despliegue e Integración:** Vercel CLI.

---

## 💻 Configuración e Instalación Local

Para correr este proyecto en tu entorno local, asegúrate de tener instalado [Node.js](https://nodejs.org/) y sigue estos pasos:

### 1. Clonar el proyecto e instalar dependencias
Abre tu terminal en la carpeta raíz del proyecto y ejecuta:
```bash
npm install