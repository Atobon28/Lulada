class LuladaSidebar extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: 'open' });

        if (this.shadowRoot) {
            this.shadowRoot.innerHTML = `
                <style>
                    :host {
                        width: 250px;
                        background-color: white;
                        border-right: 1px solid #e0e0e0;
                        display: flex;
                        flex-direction: column;
                        padding: 20px;
                        align-items: center;
                    }
                    .sidebar-logo {
                        margin-bottom: 30px;
                        text-align: center;
                    }
                    .location-tags {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        margin-bottom: 20px;
                        font-size: 18px;
                        color: #666;
                    }
                    .menu-items {
                        width: 100%;
                    }
                    .menu-item {
                        display: flex;
                        align-items: center;
                        padding: 10px;
                        cursor: pointer;
                        border-radius: 5px;
                        margin-bottom: 10px;
                    }
                    .menu-item:hover {
                        background-color: #f0f0f0;
                    }
                    .menu-icon {
                        margin-right: 10px;
                        width: 24px;
                        height: 24px;
                    }
                </style>
                
                <div class="menu-items">
                    <div class="menu-item">
                        <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjQUFBQjU0IiBkPSJNMTAgMTl2LTVoNHY1YzAgLjU1LjQ1IDEgMSAxaDNjLjU1IDAgMS0uNDUgMS0xdi03aDEuN2MuNDYgMCAuNjgtLjU3LjMzLS44N0wxMi42NyAzLjZjLS4zOC0uMzQtLjk2LS4zNC0xLjM0IDBsLTguMzYgNy41M2MtLjM0LjMtLjEzLjg3LjMzLjg3SDV2N2MwIC41NS40NSAxIDEgMWgzYy41NSAwIDEtLjQ1IDEtMSIvPjwvc3ZnPg==" class="menu-icon" alt="Inicio">
                        <span>Inicio</span>
                    </div>
                    <div class="menu-item">
                        <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjQUFBQjU0IiBkPSJNNSAxOXEtLjQyNSAwLS43MTItLjI4OFQ0IDE4dC4yODgtLjcxMlQ1IDE3aDF2LTdxMC0yLjA3NSAxLjI1LTMuNjg3VDEwLjUgNC4ydi0uN3EwLS42MjUuNDM4LTEuMDYyVDEyIDJ0MS4wNjMuNDM4VDEzLjUgMy41di43cTIgLjUgMy4yNSAyLjExM1QxOCAxMHY3aDFxLjQyNSAwIC43MTMuMjg4VDIwIDE4dC0uMjg4LjcxM1QxOSAxOXptNyAzcS0uODI1IDAtMS40MTItLjU4N1QxMCAyMGg0cTAgLjgyNS0uNTg3IDEuNDEzVDEyIDIybS00LTVoOHYtN3EwLTEuNjUtMS4xNzUtMi44MjVUMTIgNlQ5LjE3NSA3LjE3NVQ4IDEweiIvPjwvc3ZnPg==" class="menu-icon" alt="Notificaciones">
                        <span>Notificaciones</span>
                    </div>
                    <div class="menu-item">
                        <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjQUFBQjU0IiBkPSJNNSAyMVY1cTAtLjgyNS41ODgtMS40MTJUNyAzaDEwcS44MjUgMCAxLjQxMy41ODhUMTkgNXYxNmwtNy0zem0yLTMuMDVsNS0yLjE1bDUgMi4xNVY1SDd6TTcgNWgxMHoiLz48L3N2Zz4=" class="menu-icon" alt="Guardado">
                        <span>Guardado</span>
                    </div>
                    <div class="menu-item">
                        <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSJub25lIiBzdHJva2U9IiNBQUFCNTQiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIgc3Ryb2tlLWxpbmVqb2luPSJyb3VuZCIgc3Ryb2tlLXdpZHRoPSIyIiBkPSJNMyAxMGE3IDcgMCAxIDAgMTQgMGE3IDcgMCAxIDAtMTQgMG0xOCAxMWwtNi02Ii8+PC9zdmc+" class="menu-icon" alt="Explorar">
                        <span>Explorar</span>
                    </div>
                    <div class="menu-item">
                        <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Im0xMi41OTQgMjMuMjU4bC0uMDEyLjAwMmwtLjA3MS4wMzVsLS4wMi4wMDRsLS4wMTQtLjAwNGwtLjA3MS0uMDM2cS0uMDE2LS4wMDQtLjAyNC4wMDZsLS4wMDQuMDFsLS4wMTcuNDI4bC4wMDUuMDJsLjAxLjAxM2wuMTA0LjA3NGwuMDE1LjAwNGwuMDEyLS4wMDRsLjEwNC0uMDc0bC4wMTItLjAxNmwuMDA0LS4wMTdsLS4wMTctLjQyN3EtLjAwNC0uMDE2LS4wMTYtLjAxOG0uMjY0LS4xMTNsLS4wMTQuMDAybC0uMTg0LjA5M2wtLjAxLjAxbC0uMDAzLjAxMWwuMDE4LjQzbC4wMDUuMDEybC4wMDguMDA4bC4yMDEuMDkycS4wMTkuMDA1LjAyOS0uMDA4bC4wMDQtLjAxNGwtLjAzNC0uNjE0cS0uMDA1LS4wMTktLjAyLS4wMjJtLS43MTUuMDAyYS4wMi4wMiAwIDAgMC0uMDI3LjAwNmwtLjAwNi4wMTRsLS4wMzQuNjE0cS4wMDEuMDE4LjAxNy4wMjRsLjAxNS0uMDAybC4yMDEtLjA5M2wuMDEtLjAwOGwuMDAzLS4wMTFsLjAxOC0uNDNsLS4wMDMtLjAxMmwtLjAxLS4wMXoiLz48cGF0aCBmaWxsPSIjQUFBQjU0IiBkPSJNMTguMjkzIDE3LjI5M2ExIDEgMCAwIDEgMS40OTggMS4zMmwtLjA4NC4wOTRsLTEuNSAxLjVhMy4xMiAzLjEyIDAgMCAxLTQuNDE0IDBhMS4xMiAxLjEyIDAgMCAwLTEuNDg4LS4wODdsLS4wOTguMDg3bC0uNS41YTEgMSAwIDAgMS0xLjQ5Ny0xLjMybC4wODMtLjA5NGwuNS0uNWEzLjEyIDMuMTIgMCAwIDEgNC40MTQgMGExLjEyIDEuMTIgMCAwIDAgMS40ODguMDg3bC4wOTgtLjA4N3ptLTEuODEtMTMuMzFhMi41IDIuNSAwIDAgMSAzLjY1NyAzLjQwNWwtLjEyMi4xMzFMOC40NDMgMTkuMDk0YTEuNSAxLjUgMCAwIDEtLjUwNi4zMzNsLS4xNDUuMDVsLTIuODM3LjgwN2ExIDEgMCAwIDEtMS4yNjEtMS4xM2wuMDI0LS4xMDdsLjgwNy0yLjgzOGExLjUgMS41IDAgMCAxIC4yOC0uNTM3bC4xMDItLjExM3ptMi4xMiAxLjQxNWEuNS41IDAgMCAwLS42MzctLjA1OGwtLjA3LjA1OEw2LjQxNCAxNi44OGwtLjI4Ljk4OGwuOTg3LS4yOEwxOC42MDQgNi4xMDRhLjUuNSAwIDAgMCAwLS43MDciLz48L2c+PC9zdmc+" class="menu-icon" alt="Antojar">
                        <span>Antojar</span>
                    </div>
                    <div class="menu-item">
                        <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48cGF0aCBmaWxsPSIjQUFBQjU0IiBkPSJNMTkuNDMgMTIuOThjLjA0LS4zMi4wNy0uNjQuMDctLjk4cy0uMDMtLjY2LS4wNy0uOThsMi4xMS0xLjY1Yy4xOS0uMTUuMjQtLjQyLjEyLS42NGwtMi0zLjQ2YS41LjUgMCAwIDAtLjYxLS4yMmwtMi40OSAxYy0uNTItLjQtMS4wOC0uNzMtMS42OS0uOThsLS4zOC0yLjY1QS40OS40OSAwIDAgMCAxNCAyaC00Yy0uMjUgMC0uNDYuMTgtLjQ5LjQybC0uMzggMi42NWMtLjYxLjI1LTEuMTcuNTktMS42OS45OGwtMi40OS0xYS42LjYgMCAwIDAtLjE4LS4wM2MtLjE3IDAtLjM0LjA5LS40My4yNWwtMiAzLjQ2Yy0uMTMuMjItLjA3LjQ5LjEyLjY0bDIuMTEgMS42NWMtLjA0LjMyLS4wNy42NS0uMDcuOThzLjAzLjY2LjA3Ljk4bC0yLjExIDEuNjVjLS4xOS4xNS0uMjQuNDItLjEyLjY0bDIgMy40NmEuNS41IDAgMCAwIC42MS4yMmwyLjQ5LTFjLjUyLjQgMS4wOC43MyAxLjY5Ljk4bC4zOCAyLjY1Yy4wMy4yNC4yNC40Mi40OS40Mmg0Yy4yNSAwIC40Ni0uMTguNDktLjQybC4zOC0yLjY1Yy42MS0uMjUgMS4xNy0uNTkgMS42OS0uOThsMi40OSAxcS4wOS4wMy4xOC4wM2MuMTcgMCAuMzQtLjA5LjQzLS4yNWwyLTMuNDZjLjEyLS4yMi4wNy0uNDktLjEyLS42NHptLTEuOTgtMS43MWMuMDQuMzEuMDUuNTIuMDUuNzNzLS4wMi40My0uMDUuNzNsLS4xNCAxLjEzbC44OS43bDEuMDguODRsLS43IDEuMjFsLTEuMjctLjUxbC0xLjA0LS40MmwtLjkuNjhjLS40My4zMi0uODQuNTYtMS4yNS43M2wtMS4wNi40M2wtLjE2IDEuMTNsLS4yIDEuMzVoLTEuNGwtLjE5LTEuMzVsLS4xNi0xLjEzbC0xLjA2LS40M2MtLjQzLS4xOC0uODMtLjQxLTEuMjMtLjcxbC0uOTEtLjdsLTEuMDYuNDNsLTEuMjcuNTFsLS43LTEuMjFsMS4wOC0uODRsLjg5LS43bC0uMTQtMS4xM2MtLjAzLS4zMS0uMDUtLjU0LS4wNS0uNzRzLjAyLS40My4wNS0uNzNsLjE0LTEuMTNsLS44OS0uN2wtMS4wOC0uODRsLjctMS4yMWwxLjI3LjUxbDEuMDQuNDJsLjktLjY4Yy40My0uMzIuODQtLjU2IDEuMjUtLjczbDEuMDYtLjQzbC4xNi0xLjEzbC4yLTEuMzVoMS4zOWwuMTkgMS4zNWwuMTYgMS4xM2wxLjA2LjQzYy40My4xOC44My40MSAxLjIzLjcxbC45MS43bDEuMDYtLjQzbDEuMjctLjUxbC43IDEuMjFsLTEuMDcuODVsLS44OS43ek0xMiA4Yy0yLjIxIDAtNCAxLjc5LTQgNHMxLjc5IDQgNCA0czQtMS43OSA0LTRzLTEuNzktNC00LTRtMCA2Yy0xLjEgMC0yLS45LTItMnMuOS0yIDItMnMyIC45IDIgMnMtLjkgMi0yIDIiLz48L3N2Zz4=" class="menu-icon" alt="Configuración">
                        <span>Configuración</span>
                    </div>
                    <div class="menu-item">
                        <img src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyNCIgaGVpZ2h0PSIyNCIgdmlld0JveD0iMCAwIDI0IDI0Ij48ZyBmaWxsPSJub25lIiBzdHJva2U9IiNBQUFCNTQiIHN0cm9rZS13aWR0aD0iMS41Ij48cGF0aCBzdHJva2UtbGluZWpvaW49InJvdW5kIiBkPSJNNCAxOGE0IDQgMCAwIDEgNC00aDhhNCA0IDAgMCAxIDQgNGEyIDIgMCAwIDEtMiAySDZhMiAyIDAgMCAxLTItMloiLz48Y2lyY2xlIGN4PSIxMiIgY3k9IjciIHI9IjMiLz48L2c+PC9zdmc+" class="menu-icon" alt="Perfil">
                        <span>Perfil</span>
                    </div>
                </div>
            `;
        }
    }

    connectedCallback(): void {
        console.log('LuladaSidebar añadido al DOM');
    }

    disconnectedCallback(): void {
        console.log('LuladaSidebar eliminado del DOM');
    }

    attributeChangedCallback(name: string, oldValue: string, newValue: string): void {
        console.log(`Atributo ${name} cambió de ${oldValue} a ${newValue}`);
    }

    static get observedAttributes(): string[] {
        return [];
    }
}

export default LuladaSidebar;