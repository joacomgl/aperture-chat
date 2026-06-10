import { describe, test, expect } from 'vitest';
import { getTimestamp, parseApiResponse } from '../src/utils.js';

describe('Pruebas de utilidades - Aperture Science', () => {
    
    // Pruebas para parseApiResponse
    test('parseApiResponse debería limpiar espacios al inicio y al final', () => {
        const input = '   Hola, soy GLaDOS.   ';
        const result = parseApiResponse(input);
        expect(result).toBe('Hola, soy GLaDOS.');
    });

    test('parseApiResponse debería retornar un string vacío si recibe un valor nulo o no válido', () => {
        expect(parseApiResponse(null)).toBe('');
        expect(parseApiResponse(undefined)).toBe('');
        expect(parseApiResponse(12345)).toBe('');
    });

    // Pruebas para getTimestamp
    test('getTimestamp debería retornar un formato válido de hora HH:MM', () => {
        const timestamp = getTimestamp();
        // Expresión regular que valida el formato de hora 24h (00:00 a 23:59)
        const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
        expect(timestamp).toMatch(timeRegex);
    });

    test('getTimestamp debería retornar una cadena de exactamente 5 caracteres', () => {
        const timestamp = getTimestamp();
        expect(timestamp.length).toBe(5);
    });
});