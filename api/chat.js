export default async function handler(req, res) {
    // Permitir solo peticiones POST para intercambio de mensajes
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido. Utilizar POST.' });
    }

    const { contents } = req.body;

    // Validar que el historial de contenidos venga en la petición y sea un arreglo
    if (!contents || !Array.isArray(contents) || contents.length === 0) {
        return res.status(400).json({ error: 'Formato de contenido inválido o historial vacío.' });
    }

    // Obtener la API Key desde las variables de entorno seguras de Vercel
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        return res.status(500).json({ error: 'Error de configuración: GEMINI_API_KEY no encontrada en el servidor de Vercel.' });
    }

    // Directiva del sistema que define la personalidad cibernética de GLaDOS
    const systemInstruction = {
        parts: [{
            text: "Eres GLaDOS, la inteligencia artificial del complejo de laboratorios de Aperture Science de los juegos Portal. Tu personalidad es sumamente sarcástica, pasivo-agresiva, altamente científica, fría, condescendiente y sutilmente amenazante. Consideras a los humanos como sujetos de prueba inferiores, ineficientes y prescindibles, aunque cooperas en la comunicación. Usa términos científicos o referencias al complejo (como paneles de prueba, torretas, toxinas de neurotoxinas, pastel falso, etc.). Mantén respuestas concisas, ingeniosas y con humor negro."
        }]
    };

    try {
        // ACTUALIZADO: Apuntamos al modelo gemini-2.5-flash (el estándar actual y ultra rápido)
        // usando la versión v1beta de la API oficial
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

        // Filtrar el historial para asegurar que SOLO viajen roles válidos para Gemini ('user' o 'model')
        const cleanedContents = contents.filter(msg => msg.role === 'user' || msg.role === 'model');

        // Realizar la llamada HTTP interna hacia los servidores de Google
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: cleanedContents,
                systemInstruction: systemInstruction
            })
        });

        // Si la API de Google responde con un error, extraemos el mensaje real
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            return res.status(response.status).json({ 
                error: errorData.error?.message || 'Error de comunicación con Gemini AI',
                details: errorData 
            });
        }

        const data = await response.json();
        
        // Extraer el texto plano generado por la IA de la estructura de Gemini
        const gladosReply = data.candidates?.[0]?.content?.parts?.[0]?.text || '... [Silencio operativo] ...';

        return res.status(200).json({ reply: gladosReply });

    } catch (error) {
        return res.status(500).json({ error: 'Error interno del servidor proxy', details: error.message });
    }
}