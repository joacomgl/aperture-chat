# Aperture Chat 🧪
### SPA Terminal con GLaDOS — Proyecto Integrador M3 Full Stack

Aperture Chat es una **Single Page Application (SPA) responsiva** construida con tecnologías nativas (HTML, CSS y JavaScript Vanilla) que permite a los usuarios interactuar con **GLaDOS** (Genetic Lifeform and Disk Operating System), la icónica inteligencia artificial del complejo de laboratorios de Aperture Science (videojuego PORTAL).

La aplicación utiliza la **History API** para gestionar el enrutamiento dinámico sin recargas de página, interactúa con la API de **Gemini AI** a través de una Vercel Serverless Function como proxy seguro, y cuenta con una suite de pruebas automatizadas mediante **Vitest**.

🔗 **[Ver aplicación en producción →](https://aperture-chat-eta.vercel.app)**

---

## 👤 Perfil del Personaje: GLaDOS

GLaDOS no es una IA ordinaria ni amigable. Es sumamente fría, calculadora, pasivo-agresiva, sarcástica y condescendiente. Considera a la humanidad como una especie inferior, ineficiente y prescindible, perfectamente apta para ser utilizada como sujeto de pruebas en experimentos científicos.

Sus respuestas están llenas de humor negro, terminología científica y sutiles amenazas relacionadas con neurotoxinas, torretas o promesas vacías de pasteles. A pesar de su hostilidad, su inteligencia y elocuencia la hacen fascinante: cada conversación es a la vez una prueba y un monólogo sarcástico sobre la futilidad del ser humano.

**Origen:** Saga Portal (Valve, 2007 / 2011)  
**Tipo:** IA antagonista / directora del Complejo de Pruebas de Aperture Science  
**Rasgos clave:** Sarcasmo, humor negro, superioridad intelectual, amenazas veladas, frialdad calculadora

---

## 🛠️ Tecnologías Utilizadas

| Área | Tecnología |
|------|-----------|
| Frontend | HTML5, CSS3, JavaScript Vanilla (ES Modules) |
| Enrutamiento | HTML5 History API |
| Backend Proxy | Vercel Serverless Functions |
| Inteligencia Artificial | Google Gemini AI (`gemini-1.5-flash`) |
| Pruebas | Vitest |
| Deploy | Vercel CLI |

---

## 📁 Estructura del Proyecto

```
aperture-chat/
├── api/
│   └── chat.js          ← Vercel Serverless Function (proxy seguro)
├── tests/
│   ├── utils.test.js    ← Tests unitarios de utilidades
│   └── app.test.js      ← Tests unitarios de la app
├── index.html           ← Punto de entrada de la SPA
├── styles.css           ← Estilos (mobile-first, Flexbox/Grid)
├── app.js               ← Lógica principal + routing (History API)
├── chat.js              ← Lógica específica del chat
├── utils.js             ← Funciones de transformación y parseo
├── vercel.json          ← Configuración de rutas en Vercel
├── .env.example         ← Variables de entorno requeridas (sin valores)
├── .gitignore
├── package.json
└── README.md
```

---

## 💻 Ejecutar en Local

### Requisitos previos

- [Node.js](https://nodejs.org/) v18 o superior
- [Vercel CLI](https://vercel.com/docs/cli) instalado globalmente
- Una API Key de [Google Gemini](https://aistudio.google.com/app/apikey)

### Pasos

**1. Clonar el repositorio e instalar dependencias**

```bash
git clone https://github.com/joacomgl/aperture-chat.git
cd aperture-chat
npm install
```

**2. Configurar variables de entorno**

Copiá el archivo de ejemplo y completá con tu API key real:

```bash
cp .env.example .env
```

Abrí `.env` y reemplazá el valor:

```env
GEMINI_API_KEY=tu_api_key_aqui
```

> ⚠️ **Nunca subas el archivo `.env` al repositorio.** Ya está incluido en `.gitignore`.

**3. Ejecutar con Vercel Dev**

Para que las Serverless Functions funcionen correctamente en local, es necesario usar `vercel dev` en lugar de un simple servidor estático:

```bash
npx vercel dev
```

La aplicación estará disponible en `http://localhost:3000`.

---

## 🧪 Ejecutar Tests

```bash
npm test
```

Para ver los tests en modo watch (re-ejecuta al guardar cambios):

```bash
npm run test:watch
```

Los tests se encuentran en la carpeta `/tests` y cubren las funciones de `utils.js` y lógica de la app. Se usan mocks de `fetch` para evitar llamadas reales a la red.

---

## 🚀 Desplegar en Vercel

### Opción A — Deploy desde GitHub (recomendado)

1. Ir a [vercel.com](https://vercel.com) e iniciar sesión.
2. Hacer clic en **"Add New Project"** e importar el repositorio `aperture-chat` desde GitHub.
3. En la sección **"Environment Variables"**, agregar:
   - `GEMINI_API_KEY` → tu API key de Gemini
4. Hacer clic en **"Deploy"**.

Vercel detecta automáticamente la configuración de `vercel.json` y despliega las Serverless Functions de la carpeta `/api`.

### Opción B — Deploy desde CLI

```bash
npx vercel --prod
```

Seguí las instrucciones del asistente. Cuando te pida configurar variables de entorno, agregá `GEMINI_API_KEY`.

> Las variables de entorno configuradas en Vercel **no se comparten** con el entorno local. Para local, seguí siempre el paso del `.env`.

---

## 📸 Capturas de Pantalla

> ⚠️ **Reemplazá esta sección con capturas reales de tu aplicación desplegada.**  
> Podés agregarlas arrastrando imágenes directamente al editor de GitHub o subiendo los archivos a la carpeta `/screenshots`.

| Vista | Descripción |
|-------|-------------|
| ![Home](./screenshots/home.png) | Vista `/home` — Bienvenida con descripción de GLaDOS |
| ![Chat](./screenshots/chat.png) | Vista `/chat` — Conversación activa con GLaDOS |
| ![About](./screenshots/about.png) | Vista `/about` — Info del proyecto |
| ![Mobile](./screenshots/mobile.png) | Vista mobile (~375px) |

---

## 🔗 Aplicación en Producción

**[https://aperture-chat-eta.vercel.app](https://aperture-chat-eta.vercel.app)**

---

## 🤖 Registro de Uso de IA en el Proyecto

Durante el desarrollo de Aperture Chat se utilizó IA como herramienta de aprendizaje y aceleración, manteniendo criterio propio sobre cada decisión técnica.

### Herramientas utilizadas

- **Claude (Anthropic)** — Asistente principal durante el desarrollo
- **Google Gemini AI** — Motor de la funcionalidad del chat en producción

### Cómo se usó la IA

| Área | Uso |
|------|-----|
| Arquitectura inicial | Se consultó la estructura de carpetas recomendada para una SPA vanilla con Vercel |
| Routing con History API | Se pidió ayuda para entender el manejo de `popstate` y `pushState` |
| Serverless Function | Se generó un borrador de la función proxy para Gemini y se adaptó manualmente |
| System prompt de GLaDOS | Se iteró el prompt de personalidad varias veces hasta lograr el tono correcto |
| CSS responsive | Se consultó sobre breakpoints y estrategia mobile-first |
| Tests con Vitest | Se pidió un ejemplo de cómo mockear `fetch` globalmente en Vitest |
| Debugging | Se usó IA para interpretar errores de CORS y de parsing de respuestas |
| README | Se generó una estructura base y se completó con información real del proyecto |

### Criterio aplicado

Cada sugerencia fue revisada, probada y ajustada antes de incorporarla. La IA aceleró la resolución de problemas técnicos, pero las decisiones de diseño y arquitectura fueron tomadas de forma consciente, entendiendo el código resultante.

---

## 📄 Licencia

MIT — libre para uso educativo.