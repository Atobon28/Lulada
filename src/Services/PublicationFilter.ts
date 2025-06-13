// PublicationFilter.ts - Servicio para filtrar publicaciones por usuario
export class PublicationFilter {
    private static instance: PublicationFilter;

    private constructor() {}

    public static getInstance(): PublicationFilter {
        if (!PublicationFilter.instance) {
            PublicationFilter.instance = new PublicationFilter();
        }
        return PublicationFilter.instance;
    }

    /**
     * Filtra las publicaciones para mostrar solo las del usuario actual
     */
    public filterUserPublications(username?: string): any[] {
        try {
            const currentUser = this.getCurrentUser();
            const targetUsername = username || currentUser?.nombreDeUsuario;
            
            if (!targetUsername) {
                console.warn('No hay usuario para filtrar publicaciones');
                return [];
            }

            const allPublications = this.getAllPublications();
            const userPublications = allPublications.filter(pub => 
                pub.username === targetUsername
            );

            console.log(`Publicaciones filtradas para ${targetUsername}: ${userPublications.length}`);
            return userPublications;

        } catch (error) {
            console.error('Error filtrando publicaciones:', error);
            return [];
        }
    }

    /**
     * Obtiene todas las publicaciones desde sessionStorage
     */
    private getAllPublications(): any[] {
        try {
            const publications = sessionStorage.getItem('lulada_publications');
            return publications ? JSON.parse(publications) : [];
        } catch (error) {
            console.error('Error obteniendo publicaciones:', error);
            return [];
        }
    }

    /**
     * Obtiene el usuario actual desde localStorage
     */
    private getCurrentUser(): any {
        try {
            const userData = localStorage.getItem('currentUser');
            return userData ? JSON.parse(userData) : null;
        } catch (error) {
            console.error('Error obteniendo usuario actual:', error);
            return null;
        }
    }

    /**
     * Elimina publicaciones de otros usuarios que no sean el actual
     */
    public cleanOtherUsersPublications(): void {
        try {
            const currentUser = this.getCurrentUser();
            if (!currentUser?.nombreDeUsuario) {
                console.warn('No hay usuario actual para limpiar publicaciones');
                return;
            }

            const userPublications = this.filterUserPublications();
            
            // Guardar solo las publicaciones del usuario actual
            sessionStorage.setItem('lulada_publications', JSON.stringify(userPublications));
            
            console.log(`✅ Limpieza completada. Publicaciones restantes: ${userPublications.length}`);

        } catch (error) {
            console.error('Error limpiando publicaciones:', error);
        }
    }

    /**
     * Evita la duplicación de páginas verificando si ya existe una instancia
     */
    public preventPageDuplication(): void {
        const currentPath = window.location.pathname;
        const existingPages = document.querySelectorAll(`[data-page="${currentPath}"]`);
        
        if (existingPages.length > 1) {
            console.warn('Detectada duplicación de página, limpiando...');
            
            // Remover páginas duplicadas excepto la primera
            for (let i = 1; i < existingPages.length; i++) {
                existingPages[i].remove();
            }
        }
    }

    /**
     * Inicializa el filtro en el componente actual
     */
    public initializeForComponent(component: HTMLElement): void {
        try {
            // Marcar el componente para evitar duplicaciones
            const currentPath = window.location.pathname;
            component.setAttribute('data-page', currentPath);

            // Prevenir duplicación
            this.preventPageDuplication();

            // Filtrar publicaciones del usuario
            this.cleanOtherUsersPublications();

            console.log('✅ PublicationFilter inicializado para componente');

        } catch (error) {
            console.error('Error inicializando PublicationFilter:', error);
        }
    }

    /**
     * Limpia todos los datos de Firebase/verificación visual
     */
    public cleanFirebaseVisualElements(): void {
        try {
            // Remover elementos visuales de verificación
            const verificationBadges = document.querySelectorAll('.verification-badge, .verified-icon, .firebase-status');
            verificationBadges.forEach(element => element.remove());

            // Remover textos de "verificado" o "autenticado"
            const textElements = document.querySelectorAll('[data-firebase-text]');
            textElements.forEach(element => {
                const textContent = element.textContent || '';
                if (textContent.includes('verificado') || textContent.includes('autenticado')) {
                    element.textContent = textContent.replace(/verificado|autenticado/gi, '').trim();
                }
            });

            console.log('✅ Elementos visuales de Firebase limpiados');

        } catch (error) {
            console.error('Error limpiando elementos visuales:', error);
        }
    }
}