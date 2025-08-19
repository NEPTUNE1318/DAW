// 전역 네임스페이스
window.App = window.App || {};

// utils
(function(App) {
    App.state = { zTop: 10, windows : new Map() };

    App.el = {
        desktop: () => document.getElementById('desktop'),
        menu: () => document.getElementById('menu-toggles'),
    };

    App.bringToFront = function(id) {
        const w = App.state.windows.get(id);
        if(!w) return;
        w.el.style.zIndex = ++App.state.zTop;
    };

    App.syncMenu = function(id, isOpen) {
        const btn = document.querySelector(`.toggle[data-id='${id}']`);
        if(btn) {
            btn.classList.toggle("on", !!isOpen);
            btn.setAttribute("aria-pressed", !!isOpen);
        }
    };

    App.placeholder = function(id) {
        switch(id) {
        case "browser":
            return `<div class="placeholder">
            <div class="badge">Packs</div><div class="badge">Current Project</div>
            <div class="badge">Plugin Database</div><div class="badge">Channel presets</div>
            </div>`;
        case "channel":
            return `<div class="placeholder">
            <div class="badge">Kick ▯▯▯▯</div><div class="badge">Clap ▯▯▯▯</div>
            <div class="badge">Hat ▯▯▯▯</div><div class="badge">Snare ▯▯▯▯</div>
            </div>`;
        case "playlist":
            return `<div class="placeholder">
            <div class="badge">Intro | Verse | Chorus</div>
            <div class="badge">Tracks: Vocal / Drums / Bass / FX</div>
            </div>`;
        case "mixer":
            return `<div class="placeholder">
            <div class="badge">Insert 1..10</div><div class="badge">Master</div>
            </div>`;
        default: return `<div class="placeholder"><div class="badge">Empty</div></div>`;
        }
    };
})(window.App);