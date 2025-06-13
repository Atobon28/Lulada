// ===============================================
// LULADA-FIX.JS - Arreglo simple para tu presentación
// ===============================================

// Arreglar el Dispatcher que ya tienes
if (window.AppDispatcher && !window.AppDispatcher.getStatus) {
    window.AppDispatcher.getStatus = function() {
        return {
            isDispatching: this._isDispatching || false,
            listenerCount: this._listeners ? this._listeners.size : 0
        };
    };
}

// Arreglar UserActions que ya tienes
if (window.UserActions) {
    // Solo agregar las funciones que faltan sin romper las existentes
    const originalUserActions = window.UserActions;
    
    window.UserActions = {
        ...originalUserActions,
        
        // Asegurar que estas funciones existan
        updateTheme: originalUserActions.updateTheme || function(theme) {
            console.log('🎨 Actualizando tema:', theme);
            const currentUser = localStorage.getItem('currentUser');
            if (currentUser) {
                try {
                    const userData = JSON.parse(currentUser);
                    if (!userData.preferences) userData.preferences = {};
                    userData.preferences.theme = theme;
                    localStorage.setItem('currentUser', JSON.stringify(userData));
                    localStorage.setItem('lulada_theme', theme);
                } catch (error) {
                    console.error('Error actualizando tema:', error);
                }
            }
        },
        
        markLogin: originalUserActions.markLogin || function() {
            console.log('⏰ Marcando login');
            const currentUser = localStorage.getItem('currentUser');
            if (currentUser) {
                try {
                    const userData = JSON.parse(currentUser);
                    userData.lastLogin = Date.now();
                    localStorage.setItem('currentUser', JSON.stringify(userData));
                } catch (error) {
                    console.error('Error marcando login:', error);
                }
            }
        }
    };
}

// Crear SavedPublicationsStore simple si no existe
if (!window.SavedPublicationsStore) {
    class SimpleSavedPublicationsStore {
        constructor() {
            this.storageKey = 'lulada_saved_publications';
            this.state = {
                savedPublications: this.loadFromStorage(),
                isLoading: false,
                error: null
            };
            console.log('💾 SavedPublicationsStore creado');
        }

        loadFromStorage() {
            try {
                const stored = localStorage.getItem(this.storageKey);
                return stored ? JSON.parse(stored) : [];
            } catch (error) {
                console.error('Error cargando publicaciones:', error);
                return [];
            }
        }

        saveToStorage() {
            try {
                localStorage.setItem(this.storageKey, JSON.stringify(this.state.savedPublications));
            } catch (error) {
                console.error('Error guardando publicaciones:', error);
            }
        }

        isPublicationSaved(publicationId) {
            return this.state.savedPublications.some(pub => pub.id === publicationId);
        }

        savePublication(publication) {
            if (!this.isPublicationSaved(publication.id)) {
                this.state.savedPublications.push({
                    ...publication,
                    timestamp: Date.now()
                });
                this.saveToStorage();
                console.log('💾 Publicación guardada:', publication.id);
            }
        }

        unsavePublication(publicationId) {
            this.state.savedPublications = this.state.savedPublications.filter(
                pub => pub.id !== publicationId
            );
            this.saveToStorage();
            console.log('🗑️ Publicación eliminada:', publicationId);
        }

        getSavedPublications() {
            return [...this.state.savedPublications];
        }

        getPublicationCount() {
            return this.state.savedPublications.length;
        }

        clearAll() {
            this.state.savedPublications = [];
            this.saveToStorage();
            console.log('🧹 Todas las publicaciones eliminadas');
        }
    }

    window.SavedPublicationsStore = new SimpleSavedPublicationsStore();
}

// Crear PublicationActions simple si no existe
if (!window.PublicationActions) {
    window.PublicationActions = {
        savePublication: function(publication) {
            if (window.SavedPublicationsStore) {
                window.SavedPublicationsStore.savePublication(publication);
            }
        },

        unsavePublication: function(publicationId) {
            if (window.SavedPublicationsStore) {
                window.SavedPublicationsStore.unsavePublication(publicationId);
            }
        },

        isPublicationSaved: function(publicationId) {
            return window.SavedPublicationsStore ? 
                window.SavedPublicationsStore.isPublicationSaved(publicationId) : false;
        },

        toggleSaved: function(publication) {
            if (this.isPublicationSaved(publication.id)) {
                this.unsavePublication(publication.id);
            } else {
                this.savePublication(publication);
            }
        }
    };
}

// Arreglar AntojarPopupService si existe
if (window.AntojarPopupService) {
    // Asegurar que tenga el método getInstance
    if (!window.AntojarPopupService.getInstance) {
        window.AntojarPopupService.getInstance = function() {
            return this;
        };
    }
}

// Crear funciones de debug simples
window.luladaStatus = function() {
    console.log('📊 Estado de Lulada:');
    console.log('- Usuario autenticado:', localStorage.getItem('isAuthenticated') === 'true');
    
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        try {
            const user = JSON.parse(currentUser);
            console.log('- Usuario actual:', user.nombreDeUsuario || 'sin nombre');
        } catch (e) {
            console.log('- Usuario actual: datos corruptos');
        }
    }
    
    const publicationsCount = window.SavedPublicationsStore ? 
        window.SavedPublicationsStore.getPublicationCount() : 0;
    console.log('- Publicaciones guardadas:', publicationsCount);
};

window.luladaDebug = function() {
    console.log('🔍 Debug de Lulada:');
    console.log('- AppDispatcher:', !!window.AppDispatcher);
    console.log('- UserActions:', !!window.UserActions);
    console.log('- SavedPublicationsStore:', !!window.SavedPublicationsStore);
    console.log('- PublicationActions:', !!window.PublicationActions);
    
    // Mostrar errores comunes
    const errors = [];
    if (!window.AppDispatcher) errors.push('AppDispatcher faltante');
    if (!window.UserActions) errors.push('UserActions faltante');
    
    if (errors.length > 0) {
        console.error('❌ Errores encontrados:', errors);
    } else {
        console.log('✅ Componentes básicos OK');
    }
};

window.luladaCleanup = function() {
    console.log('🧹 Limpiando datos de Lulada...');
    
    // Limpiar localStorage
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('lulada_')) {
            keysToRemove.push(key);
        }
    }
    
    keysToRemove.forEach(key => localStorage.removeItem(key));
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('currentUser');
    
    console.log('✅ Limpieza completada');
};

// Función para configurar usuario demo rápidamente
window.setupDemoUser = function() {
    console.log('👤 Configurando usuario demo...');
    
    const demoUser = {
        foto: 'https://images.unsplash.com/photo-1494790108755-2616b612b4c0?w=150&h=150&fit=crop&crop=face',
        nombreDeUsuario: 'ana_foodie',
        nombre: 'Ana María Rodríguez',
        descripcion: 'Explorando los sabores de Cali 🍽️✨',
        rol: 'persona',
        locationText: 'Cali, Valle del Cauca',
        menuLink: '',
        preferences: {
            theme: 'light',
            notifications: true,
            language: 'es'
        }
    };

    localStorage.setItem('currentUser', JSON.stringify(demoUser));
    localStorage.setItem('isAuthenticated', 'true');
    
    console.log('✅ Usuario demo configurado');
    
    // Recargar la página para aplicar cambios
    setTimeout(() => window.location.reload(), 500);
};

// Función para arreglar errores comunes de navegación
window.fixNavigation = function() {
    console.log('🧭 Arreglando navegación...');
    
    // Asegurar que los eventos de navegación funcionen
    document.addEventListener('navigate', function(event) {
        const route = event.detail;
        console.log('📍 Navegando a:', route);
        
        // Actualizar URL sin recargar
        if (history.pushState) {
            history.pushState(null, '', route);
        }
        
        // Buscar load-pages y navegar
        const loadPages = document.querySelector('load-pages');
        if (loadPages && loadPages.navigateTo) {
            loadPages.navigateTo(route);
        }
    });
    
    console.log('✅ Navegación arreglada');
};

// Auto-ejecutar algunas funciones
(function() {
    console.log('🔧 Aplicando arreglos de Lulada...');
    
    // Configurar usuario demo si no hay usuario
    const hasUser = localStorage.getItem('isAuthenticated') === 'true' && 
                   localStorage.getItem('currentUser');
    
    if (!hasUser) {
        console.log('👤 No hay usuario, configurando demo...');
        setTimeout(setupDemoUser, 1000);
    }
    
    // Arreglar navegación después de que cargue todo
    setTimeout(fixNavigation, 1500);
    
    console.log('✅ Arreglos aplicados');
    console.log('💡 Usa: luladaStatus(), luladaDebug(), setupDemoUser()');
})();

// Exponer utilidades globales simples
window.LuladaSimple = {
    status: window.luladaStatus,
    debug: window.luladaDebug,
    cleanup: window.luladaCleanup,
    setupDemo: window.setupDemoUser,
    fixNav: window.fixNavigation,
    
    // Funciones útiles para la presentación
    showUserInfo: function() {
        const user = localStorage.getItem('currentUser');
        if (user) {
            const userData = JSON.parse(user);
            alert(`Usuario: ${userData.nombre}\nUsername: ${userData.nombreDeUsuario}\nRol: ${userData.rol}`);
        } else {
            alert('No hay usuario configurado');
        }
    },
    
    addSamplePublication: function() {
        if (window.SavedPublicationsStore) {
            const samplePub = {
                id: 'demo_pub_' + Date.now(),
                username: 'ana_foodie',
                text: 'Excelente restaurante en el centro de Cali. La comida estuvo deliciosa y el servicio muy atento.',
                stars: 5,
                restaurant: 'Restaurante El Buen Sabor',
                location: 'Centro, Cali',
                timestamp: Date.now()
            };
            
            window.SavedPublicationsStore.savePublication(samplePub);
            alert('Publicación de ejemplo agregada');
        }
    }
};

console.log('🎉 Lulada-Fix cargado. Tu app debería funcionar mejor ahora!');