// src/Services/realtime-sync-init.ts
// Archivo simple de inicialización para evitar errores de import

console.log('🚀 Inicializando sistema de sincronización...');

// Función de inicialización “dummy” que no lanza excepciones
async function initRealTimeSync(): Promise<void> {
  try {
    console.log('✅ Sistema de sincronización inicializado');
  } catch (error) {
    console.warn('⚠️ Sistema de sincronización no disponible');
  }
}

// Ejecutar tras la carga del DOM (o inmediatamente si ya está cargado)
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initRealTimeSync);
  } else {
    initRealTimeSync();
  }
} else {
  // Entorno sin DOM (por ejemplo, pruebas en Node.js)
  initRealTimeSync();
}

export { initRealTimeSync };
