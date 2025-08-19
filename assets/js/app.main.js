(function(App) {
    const WINDOW_DEFS = [
        { id: "browser", title: "Browser",      x: 16,  y: 64,  w: 280,  h: 380 },
        { id: "channel", title: "Channel Rack", x: 310, y: 64,  w: 360,  h: 320 },
        { id: "playlist", title: "Playlist",    x: 310, y: 400, w: 720,  h: 260 },
        { id: "mixer", title: "Mixer",          x: 690, y: 64,  w: 520,  h: 320 },
    ];

    function buildMenu() {
        const wrap = App.el.menu();
        WINDOW_DEFS.forEach(def => {
            const btn = document.createElement('button');
            btn.className = 'toggle on';
            btn.dataset.id = def.id;
            btn.textContent = def.title;
            btn.addEventListener('click', () => App.toggleWindow(def.id));
            wrap.appendChild(btn);
        });
        document.getElementById('reset-layout').addEventListener('click', () => App.resetLayout(WINDOW_DEFS));
    }

    window.addEventListener('DOMContentLoaded', () => {
        buildMenu();
        WINDOW_DEFS.forEach(def => App.createWindow(def));
    });
})(window.App);