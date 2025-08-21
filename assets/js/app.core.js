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

    App.content = {
        browser() {
            return `
            <div class="browser-tree>
                <div class="broswer-item>Packs</div>
                <div class="broswer-item>Current Project</div>
                <div class="broswer-item>Plugin Database</div>
                <div class="broswer-item>Channel Presets</div>
                <div class="broswer-item>Mixer Presets</div>
                <div class="broswer-item>Recorded</div>
            </div>
            `;
        },
        rack() {
            rows = [
                {name: 'Kick', on: [0, 4, 8, 12] },
                {name: 'Clap', on: [4, 12] },
                {name: 'Hat', on: [2, 6, 10, 14] },
                {name: 'Snare', on: [8] },
            ];
            const cols = 16;
            return `
            <div class="rack">
                ${rows.map(r => {
                    let step = '';
                    for (let i = 0; i < cols; i++) {
                        const on = r.on.includes(i) ? ' on' : '';
                        step += `<div class="step${on}"></div>`;
                    }
                    return `<div class="inst">${r.name}</div>${step}`;
                }).join('')}
            </div>
            `;
        },
        playlist(){
            const bars = Array.from({length:16},(_,i)=>`<div class="bar">${i+1}</div>`).join('');
            return `
            <div class="timeline">${bars}</div>
            <div class="tracks">
                <div class="track"><div class="clip"></div></div>
                <div class="track"><div class="clip alt" style="left:20%; right:10%"></div></div>
                <div class="track"><div class="clip" style="left:60%; right:4%"></div></div>
                <div class="track"></div>
                <div class="track"></div>
            </div>
            `;
        },
        mixer(){
            const strips = Array.from({length:8},(_,i)=>`
            <div class="strip">
                <div class="label">Ins ${i+1}</div>
                <div class="meter"></div>
                <div class="knob">VOL</div>
            </div>
            `).join('');
            return `<div class="mixer">${strips}</div>`;
        }
    };
})(window.App);
