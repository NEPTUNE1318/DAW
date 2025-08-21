(function(App) {
    const WINDOW_DEFS = [
        { id: "browser", title: "Browser",      x: 16,  y: 64,   w: 260,  h: 560 },
        { id: "channel", title: "Channel Rack", x: 290, y: 64,   w: 520,  h: 220 },
        { id: "playlist", title: "Playlist",    x: 820, y: 64,   w: 640,  h: 560 },
        { id: "mixer", title: "Mixer",          x: 290, y: 300,  w: 520,  h: 324 },
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
        const resetBtn = document.getElementById('reset-layout');
        if (resetBtn) resetBtn.addEventListener('click', () => App.resetLayout(WINDOW_DEFS));
    }

    window.addEventListener('DOMContentLoaded', () => {
        App.initialDefs = WINDOW_DEFS.map(d => ({...d}));
        buildMenu();
        WINDOW_DEFS.forEach(def => App.createWindow(def));
    });
})(window.App);
