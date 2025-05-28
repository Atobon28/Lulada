// src/services-global.ts
// Archivo para inicializar servicios globales

import './types'; // Importar tipos centralizados
import { UserActions } from './Services/flux/UserActions';
import { userStore } from './Services/flux/UserStore';

// Inicializar servicios globales
console.log('🌐 Inicializando servicios globales...');

// Hacer disponibles los servicios de usuario globalmente
window.UserActions = UserActions;
window.userStore = userStore;

console.log('✅ Servicios globales inicializados correctamente');

export {};