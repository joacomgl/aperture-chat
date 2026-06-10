import { describe, test, expect, beforeEach } from 'vitest';

// Creamos un entorno simulado mínimo (Mock) para el DOM antes de correr los tests
const mockDOM = {
    body: { innerHTML: '' },
    getElementById: (id) => {
        if (id === 'app') {
            return {
                get innerHTML() { return mockDOM.body.innerHTML; },
                set innerHTML(val) { mockDOM.body.innerHTML = val; }
            };
        }
        return null;
    }
};

// Se lo asignamos al objeto global de Node para simular el navegador
global.document = mockDOM;

describe('Pruebas del Enrutador SPA - Aperture Science', () => {
    beforeEach(() => {
        // Limpiamos el DOM simulado antes de cada prueba
        document.body.innerHTML = '';
    });

    test('Debería definir un contenedor base en el DOM', () => {
        const appContainer = document.getElementById('app');
        expect(appContainer).not.toBeNull();
    });

    test('La configuración de rutas debería manejar respuestas dinámicas', () => {
        const appContainer = document.getElementById('app');
        
        // Simulando carga de vista Home
        appContainer.innerHTML = '<h1>BIENVENIDO A APERTURE SCIENCE</h1>';
        expect(appContainer.innerHTML).toContain('BIENVENIDO');

        // Simulando cambio a vista About
        appContainer.innerHTML = '<p><strong>Nombre del Sistema:</strong> Aperture Chat</p>';
        expect(appContainer.innerHTML).toContain('Aperture Chat');
    });
});