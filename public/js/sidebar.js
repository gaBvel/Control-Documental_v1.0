
document.addEventListener("DOMContentLoaded", () => {
    const sidebar = document.getElementById("sidebar");
    const btnSidebar = document.getElementById("btnSidebar");
    if (!sidebar || !btnSidebar) return;
    const STORAGE_KEY = "scd_sidebar";
    const MOBILE_WIDTH = 992;
    let overlay = document.getElementById("sidebarOverlay");

    /* Cerrar Overlay */
    if (!overlay) {
        overlay = document.createElement("div");
        overlay.id = "sidebarOverlay";
        overlay.className = "sidebar-overlay";
        document.body.appendChild(overlay);
    }

    /* Detectar Movil */
    function isMobile() {
        return window.innerWidth <= MOBILE_WIDTH;
    }

/* Guardar Estado */
    function saveState() {
        localStorage.setItem(
            STORAGE_KEY,
            sidebar.classList.contains("collapsed")
                ? "collapsed"
                : "expanded"
        );
    }

/* Cargar Estado */
    function loadState() {
        if (isMobile()) {
            sidebar.classList.remove("collapsed");
            sidebar.classList.remove("show");
            overlay.classList.remove("active");
            return;
        }
        const state = localStorage.getItem(STORAGE_KEY);
        if (state === "collapsed") {
            sidebar.classList.add("collapsed");
        }
    }

    /* Desktop */
    function toggleDesktop() {
        sidebar.classList.toggle("collapsed");
        saveState();
    }

    /* Mobile */
    function toggleMobile() {
        sidebar.classList.toggle("show");
        overlay.classList.toggle("active");
    }

    /* Boton */
    btnSidebar.addEventListener("click", () => {
        if (isMobile()) {
            toggleMobile();
        } else {
            toggleDesktop();
        }
    });

    /* Cerrar con Overlay */
    overlay.addEventListener("click", () => {
        sidebar.classList.remove("show");
        overlay.classList.remove("active");
    });

    /* ESC */
    document.addEventListener("keydown", (e) => {
        if (e.key !== "Escape") return;
        if (isMobile()) {
            sidebar.classList.remove("show");
            overlay.classList.remove("active");
        }
    });

    /* Cambio de tamaño */
    window.addEventListener("resize", () => {
        if (!isMobile()) {
            sidebar.classList.remove("show");
            overlay.classList.remove("active");
            loadState();
        } else {
            sidebar.classList.remove("collapsed");
        }
    });

    /* Cerrar al hacer click en un link (mobile) */
    document.querySelectorAll(".menu-item").forEach(link => {
        link.addEventListener("click", () => {
            if (!isMobile()) return;
            sidebar.classList.remove("show");
            overlay.classList.remove("active");
        });
    });

    /* Inicializar */
    loadState();
});
