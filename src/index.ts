// index.ts – COMPLETO Y CORREGIDO SIN ERRORES
// ===========================================

// =======================
// DECLARACIONES GLOBALES
// =======================
export {};

// Importar servicios básicos primero
import "./services-global";
// import "./Services/realtime-sync-init"; // ✅ COMENTADO TEMPORALMENTE

// =======================
// INTERFACES TIPADAS
// =======================

interface ComponentConstructor {
  new (...args: unknown[]): HTMLElement;
}

interface PublicationsServiceInstance {
  getInstance?(): PublicationsServiceInstance;
  [key: string]: unknown;
}

interface AntojarServiceInstance {
  getInstance?(): AntojarServiceInstance;
  initialize?(): void;
  [key: string]: unknown;
}

interface InteractionServiceInstance {
  getInstance(): InteractionServiceInstance;
  loadInteractions?(): void;
  [key: string]: unknown;
}

interface SidebarElement extends HTMLElement {
  debugNavigation?(): void;
}

interface LuladaServices {
  publicationsService: PublicationsServiceInstance | null;
  antojarService: AntojarServiceInstance | null;
  interactionService: InteractionServiceInstance | null;
}

// ✅ INTERFACE CORREGIDA (customElements ya no está aquí)
interface WindowWithGlobalProperties extends Window {
  AntojarPopupService?: unknown;
  LuladaServices?: LuladaServices;
  debugSidebar?: () => void;
  luladaStatus?: () => void;
  luladaDebug?: () => void;
  UserActions?: unknown;
  userStore?: unknown;
  InteractionService?: InteractionServiceInstance;
}

declare const window: WindowWithGlobalProperties;

// =======================
// CARGA DINÁMICA DE COMPONENTES
// =======================

async function loadComponent<T extends ComponentConstructor>(
  path: string,
  componentName: string,
  elementName: string
): Promise<T | null> {
  try {
    console.log(`🔄 Cargando componente: ${componentName} desde ${path}`);
    const module = await import(path);
    const ComponentClass = module[componentName] as T;

    if (!ComponentClass) {
      console.error(`❌ Componente ${componentName} no encontrado en ${path}`);
      return null;
    }

    // Registrar si no existe
    if (!customElements.get(elementName)) {
      customElements.define(elementName, ComponentClass);
      console.log(`✅ Componente ${elementName} registrado`);
    } else {
      console.log(`ℹ️ Componente ${elementName} ya estaba registrado`);
    }

    return ComponentClass;
  } catch (error) {
    console.error(`❌ Error cargando componente ${componentName}:`, error);
    return null;
  }
}

async function loadService<T>(
  path: string,
  serviceName: string
): Promise<T | null> {
  try {
    console.log(`🔄 Cargando servicio: ${serviceName} desde ${path}`);
    const module = await import(path);
    const ServiceClass = module[serviceName];

    if (!ServiceClass) {
      console.error(`❌ Servicio ${serviceName} no encontrado en ${path}`);
      return null;
    }

    if (typeof ServiceClass.getInstance === "function") {
      const instance = ServiceClass.getInstance() as T;
      console.log(`✅ Servicio ${serviceName} cargado`);
      return instance;
    }

    console.error(`❌ Servicio ${serviceName} no tiene getInstance`);
    return null;
  } catch (error) {
    console.error(`❌ Error cargando servicio ${serviceName}:`, error);
    return null;
  }
}

// =======================
// FUNCIONES DE INICIALIZACIÓN
// =======================

async function initializeComponents(): Promise<void> {
  console.log("🚀 Inicializando componentes de Lulada…");

  const componentPromises = [
    // Navegación
    loadComponent(
      "./Components/Home/Header/reponsiveheader",
      "ReponsiveHeader",
      "responsive-header"
    ),
    loadComponent(
      "./Components/Home/Navbars/responsivebar",
      "ResponsiveBar",
      "responsive-bar"
    ),
    loadComponent("./Components/Home/Navbars/sidebar", "Sidebar", "side-bar"),

    // Usuario
    loadComponent(
      "./Components/PUser/userProfile/UserInfo",
      "UserInfo",
      "user-info"
    ),
    loadComponent(
      "./Components/PUser/userProfile/EditProfileModal",
      "EditProfileModal",
      "edit-profile-modal"
    ),

    // Configuración
    loadComponent(
      "./Components/Settings/CambiarNombreSimple",
      "CambiarNombreSimple",
      "cambiar-nombre-simple"
    ),

    // Nueva Cuenta
    loadComponent(
      "./Pages/NewAccount/containernewaccount",
      "ContainerNewAccount",
      "container-new-account"
    ),

    // Antojar
    loadComponent(
      "./Components/Antojar/LuladaAntojar",
      "LuladaAntojar",
      "lulada-antojar"
    ),
    loadComponent(
      "./Components/Antojar/LuladaAntojarBoton",
      "LuladaAntojarBoton",
      "lulada-antojar-boton"
    ),
  ];

  const results = await Promise.allSettled(componentPromises);
  const successful = results.filter(
    (r) => r.status === "fulfilled" && r.value !== null
  ).length;

  console.log(`📊 Componentes cargados: ${successful}/${results.length}`);
}

async function initializeServices(): Promise<void> {
  console.log("🛠️ Inicializando servicios de Lulada…");

  const services: LuladaServices = {
    publicationsService: null,
    antojarService: null,
    interactionService: null,
  };

  try {
    // InteractionService
    const interactionService = await loadService<InteractionServiceInstance>(
      "./Services/flux/Interactionservice",
      "InteractionService"
    );
    if (interactionService) {
      services.interactionService = interactionService;
      window.InteractionService = interactionService;
      interactionService.loadInteractions?.();
    }

    // PublicationsService (opcional)
    try {
      services.publicationsService =
        (await loadService<PublicationsServiceInstance>(
          "./Services/PublicationsService",
          "PublicationsService"
        )) ?? null;
    } catch {
      console.log("ℹ️ PublicationsService no disponible");
    }

    // AntojarService (opcional)
    try {
      services.antojarService =
        (await loadService<AntojarServiceInstance>(
          "./Services/AntojarService",
          "AntojarService"
        )) ?? null;
      services.antojarService?.initialize?.();
    } catch {
      console.log("ℹ️ AntojarService no disponible");
    }
  } catch (error) {
    console.error("❌ Error inicializando servicios:", error);
  }

  window.LuladaServices = services;
  console.log("✅ Servicios inicializados:", services);
}

// =======================
// DEBUG  & ERROR HANDLING
// =======================

function setupGlobalDebugging(): void {
  console.log("🔧 Configurando debugging global…");

  window.luladaStatus = () => {
    console.group("📊 Estado de Lulada");
    console.log("Servicios:", window.LuladaServices);
    console.log("InteractionService:", window.InteractionService);
    console.log("UserStore:", window.userStore);
    console.log(
      "Componentes registrados:",
      customElements ? "Disponible" : "No disponible"
    );
    console.groupEnd();
  };

  window.luladaDebug = () => {
    console.group("🔍 Debug completo de Lulada");
    if (window.LuladaServices) {
      console.log("--- Servicios ---");
      Object.entries(window.LuladaServices).forEach(([k, v]) =>
        console.log(`${k}:`, v ? "Activo" : "Inactivo")
      );
    }
    if (
      window.InteractionService &&
      typeof (window.InteractionService as any).debug === "function"
    ) {
      (window.InteractionService as any).debug();
    }
    if (window.userStore && typeof (window.userStore as any).debug === "function") {
      (window.userStore as any).debug();
    }
    console.groupEnd();
  };

  window.debugSidebar = () => {
    const sidebar = document.querySelector("side-bar") as SidebarElement;
    sidebar?.debugNavigation?.();
  };

  console.log(
    "✅ Herramientas de debug: usa luladaStatus(), luladaDebug() o debugSidebar() en la consola"
  );
}

function setupErrorHandling(): void {
  window.addEventListener("error", (e) => {
    console.error("❌ Error no capturado:", e);
  });
  window.addEventListener("unhandledrejection", (e) => {
    console.error("❌ Promesa rechazada no manejada:", e.reason);
  });
  console.log("✅ Manejo de errores configurado");
}

// =======================
// FUNCIÓN PRINCIPAL
// =======================

async function initializeLuladaApp(): Promise<void> {
  console.log("🎉 Iniciando aplicación Lulada…");

  try {
    setupErrorHandling();
    setupGlobalDebugging();

    await Promise.allSettled([initializeServices(), initializeComponents()]);

    console.log("🎊 ¡Aplicación Lulada inicializada!");

    window.dispatchEvent(
      new CustomEvent("luladaAppReady", {
        detail: {
          timestamp: new Date().toISOString(),
          services: window.LuladaServices,
          version: "1.0.0",
        },
      })
    );

    window.luladaStatus?.();
  } catch (error) {
    console.error("❌ Error crítico iniciando la app:", error);
  }
}

// =======================
// PUNTO DE ENTRADA
// =======================

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initializeLuladaApp);
} else {
  initializeLuladaApp();
}

// Exportar funciones (opcional)
export {
  initializeLuladaApp,
  loadComponent,
  loadService,
  initializeComponents,
  initializeServices,
};
