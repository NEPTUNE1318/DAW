(function(App) {
    App.createWindow = function(def) {
        const desktop = App.el.desktop();
        const win = document.createElement('section');
        win.className = 'window';
        Object.assign(win.style, {
            left: def.x + 'px', top: def.y + 'px',
            width: def.w + 'px', height: def.h + 'px',
            zIndex: ++App.state.zTop
        });

        win.innerHTML = `
        <header class="titlebar" data-role="drag">
        <span class="title">${def.title}</span>
        <span class="spacer"></span>
        <button class="win-btn close" data-role="close" title="닫기">✕</button>
        </header>
        <div class="content">
        ${App.placeholder(def.id)}
        <div class="resize-handle" data-role="resize"></div>
        </div>
        `;

        desktop.appendChild(win);
        
        App.state.windows.set(def.id, {
            id: def.id, title: def.title, el: win, open: true,
            x: def.x, y: def.y, w: def.w, h: def.h
        });
        
        win.addEventListener('pointerdown', () => App.bringToFront(def.id));
        win.querySelector("[data-role='close']").addEventListener('click', (e) => {
            e.stopPropagation(); App.hideWindow(def.id);
        });

        enableDrag(def.id, win.querySelector("[data-role='drag']"));
        enableResize(def.id, win.querySelector("[data-role='resize']"));
        App.syncMenu(def.id, true);
    };

    App.hideWindow = function(id) {
        const w = App.state.windows.get(id);
        if(!w || !w.open) return;
        w.open = false; w.el.style.display = 'none';
        App.syncMenu(id, false);
    };

    App.showWindow = function(id) {
        const w = App.state.windows.get(id);
        if(!w || w.open) return;
        w.open = true; w.el.style.display = 'block';
        App.syncMenu(id, true); App.bringToFront(id);
    };

    App.toggleWindow = function(id) {
        const w = App.state.windows.get(id);
        if(!w) return;
        (w.open ? App.hideWindow: App.showWindow)(id);
    };

    App.resetLayout = function(defs) {
        App.state.zTop = 10;
        defs.forEach(def => {
            const w = App.state.windows.get(def.id);
            if(!w) return;
            Object.assign(w, {x: def.x, y: def.y, w: def.w, h: def.h});
            Object.assign(w.el.style, {
                left: def.x + 'px', top: def.y + 'px', width: def.w + 'px', height: def.h + 'px'
            });
            App.showWindow(def.id); App.bringToFront(def.id);
        });
    };

    function enableDrag(id, handle) {
        const w = App.state.windows.get(id);
        let startX, startY, sx, sy, moving = false;

        const onDown = (e) => {
            if(e.button != 0) return;
            moving = true; handle.classList.add('noselect');
            startX = e.clientX; startY = e.clientY;
            sx = parseFloat(w.el.style.left); sy = parseFloat(w.el.style.top);
            App.bringToFront(id);
            window.addEventListener('pointermove', onMove);
            window.addEventListener('pointerup', onUp, {once: true});
        };

        const onMove = (e) => {
            if(!moving) return;
            const dx = e.clientX - startX, dy = e.clientY - startY;
            const desk = App.el.desktop().getBoundingClientRect();
            let nx = sx + dx, ny = sy + dy;
            nx = Math.max(desk.left, Math.min(nx, desk.right - w.el.offsetWidth)) - desk.left;
            ny = Math.max(desk.top, Math.min(ny, desk.bottom - 60)) - desk.top;
            w.el.style.left = nx + 'px'; w.el.style.top = ny + 'px';
            w.x = nx, w.y = ny;
        };

        const onUp = () => {
            moving = false;
            handle.classList.remove('noselect');
            window.removeEventListener('pointermove', onMove);
        };
        handle.addEventListener('pointerdown', onDown);
    }

    function enableResize(id, handle) {
        const w = App.state.windows.get(id);
        let startX, startY, sw, sh, resizing = false;

        const onDown = (e) => {
            if(e.button != 0) return;
            resizing = true; startX = e.clientX, startY = e.clientY;
            sw = w.el.offsetWidth; sh = w.el.offsetHeight;
            App.bringToFront(id);
            window.addEventListener('pointermove', onMove);
            window.addEventListener('pointerup', onUp, {once: true});
        };

        const onMove = (e) => {
            if(!resizing) return;
            const dw = e.clientX - startX, dh = e.clientY - startY;
            const minW = 260, minH = 160;
            let nw = Math.max(minW, sw + dw), nh = Math.max(minH, sh + dh);
            const desk = App.el.desktop().getBoundingClientRect();
            const rect = w.el.getBoundingClientRect();
            nw = Math.min(nw, desk.right-rect.left - 8);
            nh = Math.min(nh, desk.bottom-rect.top - 8);
            w.el.style.width = nw + 'px', w.el.style.height = nh + 'px';
            w.w = nw; w.h = nh;
        };
        
        const onUp = () => {
            resizing = false;
            window.removeEventListener('pointermove', onMove);
        };
        handle.addEventListener('pointerdown', onDown);
    }
})(window.App);