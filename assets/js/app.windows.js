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

        const htmlByType = {
            browser: App.content.browser(),
            channel: App.content.rack(),
            playlist: App.content.playlist(),
            mixer: App.content.mixer(),
        };

        win.innerHTML = `
        <header class="titlebar" data-role="drag">
            <span class="title">${def.title}</span>
            <span class="spacer"></span>
            <button class="win-btn close" data-role="close" title="닫기">✕</button>
        </header>
        <div class="content">
            ${htmlByType[def.id] || '<div>Empty</div>'}
            <div class="resize-handle" data-role="resize"></div>
        </div>
        `;

        desktop.appendChild(win);
        
        App.state.windows.set(def.id, {
            id: def.id, title: def.title, el: win, open: true,
            x: def.x, y: def.y, w: def.w, h: def.h
        });
        
        win.addEventListener('pointerdown', () => App.bringToFront(def.id));
        const closeBtn = win.querySelector("[data-role='close']");
        if(closeBtn) {
            closeBtn.addEventListener('pointerdown', (e) => {
                e.stopPropagation();
            });
            closeBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                App.hideWindow(def.id);
            });
        }

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

    App.initialDefs = App.initialDefs || [];
    App.resetLayout = function(defs) {
        const source = (Array.isArray(defs) && defs.length) ? defs : App.initialDefs;
        if (!source.length) { console.warn('[resetLayout] 초기 레이아웃 없음'); return; }
        App.state.zTop = 10;
        source.forEach(def => {
            const w = App.state.windows.get(def.id);
            if(!w) return;
            Object.assign(w, { x: def.x, y: def.y, w: def.w, h: def.h, open: true });
            Object.assign(w.el.style, {
                left: def.x + 'px', top: def.y + 'px', width: def.w + 'px', height: def.h + 'px', display: 'block'
            });
            App.syncMenu(def.id, true);
            App.bringToFront(def.id);
        })
    };

    function enableDrag(id, handle) {
        const w = App.state.windows.get(id);
        let startX, startY, sx, sy, moving = false;

        const onDown = (e) => {
            if(e.button !== 0) return;
            if(e.target.closeset('[data-role="close"], win-btn')) return;
            moving = true; handle.classList.add('noselect');
            startX = e.clientX; startY = e.clientY;
            sx = parseFloat(w.el.style.left) || 0; sy = parseFloat(w.el.style.top) || 0;
            App.bringToFront(id);
            if(handle.setPointerCapture) handle.setPointerCapture(e.pointerId);
            window.addEventListener('pointermove', onMove);
            window.addEventListener('pointerup', onUp, {once: true});
        };

        const onMove = (e) => {
            if(!moving) return;
            const dx = e.clientX - startX, dy = e.clientY - startY;
            const desk = App.el.desktop();
            const maxX = desk.clientWidth - w.el.offsetWidth;
            const maxY = desk.clientHeight - w.el.offsetHeight;
            const nx=Math.max(0, Math.min(sx+dx, maxX));
            const ny=Math.max(0, Math.min(sy+dy, maxY));
            w.el.style.left=nx+'px'; w.el.style.top=ny+'px'; w.x=nx; w.y=ny;
        };

        const onUp = (e) => {
            moving = false;
            handle.classList.remove('noselect');
            window.removeEventListener('pointermove', onMove);
            if(handle.releasePointerCapture) handle.releasePointerCapture(e.pointerId);
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
            const desk = App.el.desktop();
            const rect = w.el.getBoundingClientRect();
            const deskRect = desk.getBoundingClientRect();
            nw = Math.min(nw, deskRect.right-rect.left - 8);
            nh = Math.min(nh, deskRect.bottom-rect.top - 8);
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
