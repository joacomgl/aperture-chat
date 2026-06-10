/**
 * Genera un timestamp con el formato HH:MM basándose en la fecha actual.
 * @returns {string} Hora formateada (ej. "14:35")
 */
export function getTimestamp() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    return `${hours}:${minutes}`;
}

/**
 * Limpia y normaliza el texto proveniente de la respuesta de la IA.
 * Remueve espacios en blanco innecesarios en los extremos.
 * @param {string} text - Respuesta cruda de la API
 * @returns {string} Texto limpio
 */
export function parseApiResponse(text) {
    if (!text || typeof text !== 'string') {
        return '';
    }
    return text.trim();
}