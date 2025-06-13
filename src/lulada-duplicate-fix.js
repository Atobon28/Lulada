// ===============================================
// LULADA DUPLICATE FIX - Evitar duplicación de componentes
// ===============================================

// Variable global para controlar inicialización
window.LULADA_INITIALIZED = window.LULADA_INITIALIZED || false;

// Función para prevenir duplicación
function preventDuplicateInit() {
    if (window.LULADA_INITIALIZED) {
        console.log('⚠️ Lulada ya está inicializado, evitando duplicación');
        return true;
    }
    return false;
}

// Función para limpiar duplicados existentes
function removeDuplicateComponents() {
    console.log('🧹 Limpiando componentes duplicados...');
    
    // Buscar y eliminar duplicados comunes
    const selectors = [
        'lulada-home',
        'lulada-header-home', 
        'lulada-sidebar',
        'lulada-suggestions',
        'lulada-reviews-container',
        '.main-container',
        '.header-container'
    ];
    
    selectors.forEach(selector => {
        const elements = document.querySelectorAll(selector);
        if (elements.length > 1) {
            console.log(`🗑️ Encontrados ${elements.length} elementos ${selector}, eliminando duplicados`);
            // Mantener solo el primer elemento, eliminar el resto
            for (let i = 1; i < elements.length; i++) {
                elements[i].remove();
            }
        }
    });
}

// Interceptar registros de custom elements para evitar duplicados
const originalDefine = customElements.define;
const registeredElements = new Set();

customElements.define = function(name, constructor, options) {
    if (registeredElements.has(name)) {
        console.log(`⚠️ Elemento ${name} ya registrado, evitando duplicación`);
        return;
    }
    
    registeredElements.add(name);
    console.log(`✅ Registrando elemento: ${name}`);
    return originalDefine.call(this, name, constructor, options);
};

// Función para arreglar Home específicamente
function fixHomeComponent() {
    console.log('🏠 Arreglando componente Home...');
    
    // Buscar todos los elementos lulada-home
    const homeElements = document.querySelectorAll('lulada-home');
    
    if (homeElements.length > 1) {
        console.log(`🗑️ Eliminando ${homeElements.length - 1} elementos Home duplicados`);
        
        // Mantener solo el primero
        for (let i = 1; i < homeElements.length; i++) {
            homeElements[i].remove();
        }
    }
    
    // Verificar que el Home restante esté en el lugar correcto
    const remainingHome = document.querySelector('lulada-home');
    if (remainingHome) {
        // Asegurar que esté en el contenedor principal
        const mainContainer = document.querySelector('.main-content, #main, main, .app-container');
        if (mainContainer && !mainContainer.contains(remainingHome)) {
            mainContainer.appendChild(remainingHome);
        }
    }
}

// Función para arreglar Load Pages
function fixLoadPagesComponent() {
    console.log('📄 Arreglando load-pages...');
    
    const loadPagesElements = document.querySelectorAll('load-pages');
    
    if (loadPagesElements.length > 1) {
        console.log(`🗑️ Eliminando ${loadPagesElements.length - 1} load-pages duplicados`);
        
        for (let i = 1; i < loadPagesElements.length; i++) {
            loadPagesElements[i].remove();
        }
    }
}

// Función principal para arreglar duplicación
function fixDuplication() {
    if (preventDuplicateInit()) {
        return;
    }
    
    console.log('🔧 Iniciando arreglo de duplicación...');
    
    // Esperar a que el DOM esté listo
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            setTimeout(fixDuplication, 100);
        });
        return;
    }
    
    // Limpiar duplicados
    removeDuplicateComponents();
    fixHomeComponent();
    fixLoadPagesComponent();
    
    // Observar por nuevos duplicados
    const observer = new MutationObserver((mutations) => {
        let needsCleanup = false;
        
        mutations.forEach((mutation) => {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeType === Node.ELEMENT_NODE) {
                    const element = node;
                    
                    // Verificar si es un componente que puede duplicarse
                    if (element.tagName && (
                        element.tagName.startsWith('LULADA-') ||
                        element.classList.contains('main-container') ||
                        element.classList.contains('header-container')
                    )) {
                        needsCleanup = true;
                    }
                }
            });
        });
        
        if (needsCleanup) {
            setTimeout(() => {
                removeDuplicateComponents();
                fixHomeComponent();
            }, 100);
        }
    });
    
    // Observar cambios en el DOM
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
    
    // Marcar como inicializado
    window.LULADA_INITIALIZED = true;
    
    console.log('✅ Arreglo de duplicación completado');
}

// Función para forzar limpieza manual
window.fixDuplicates = function() {
    console.log('🔄 Limpieza manual de duplicados...');
    removeDuplicateComponents();
    fixHomeComponent();
    fixLoadPagesComponent();
    console.log('✅ Limpieza manual completada');
};

// Función para reiniciar completamente
window.restartLulada = function() {
    console.log('🔄 Reiniciando Lulada...');
    
    // Limpiar todo
    window.LULADA_INITIALIZED = false;
    registeredElements.clear();
    
    // Remover todos los componentes de Lulada
    const luladaComponents = document.querySelectorAll('[class*="lulada"], [id*="lulada"], lulada-home, load-pages');
    luladaComponents.forEach(component => component.remove());
    
    // Reiniciar después de un momento
    setTimeout(() => {
        window.location.reload();
    }, 500);
};

// Auto-ejecutar el arreglo
fixDuplication();

// También disponible como función global
window.LuladaDuplicateFix = {
    fix: fixDuplication,
    clean: window.fixDuplicates,
    restart: window.restartLulada,
    status: () => {
        console.log('📊 Estado de duplicación:');
        console.log('- Inicializado:', window.LULADA_INITIALIZED);
        console.log('- Elementos registrados:', Array.from(registeredElements));
        
        const duplicates = {};
        ['lulada-home', 'load-pages', 'lulada-header-home'].forEach(selector => {
            const count = document.querySelectorAll(selector).length;
            if (count > 1) {
                duplicates[selector] = count;
            }
        });
        
        if (Object.keys(duplicates).length > 0) {
            console.warn('⚠️ Duplicados encontrados:', duplicates);
        } else {
            console.log('✅ No hay duplicados');
        }
    }
};

console.log('🛡️ Lulada Duplicate Fix cargado');
console.log('💡 Usa: fixDuplicates(), restartLulada(), LuladaDuplicateFix.status()');