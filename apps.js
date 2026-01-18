const HOS = {
    z: 100,
    password: localStorage.getItem('hos_pass'),
    
    boot() {
        this.updateTime();
        setInterval(() => this.updateTime(), 1000);
        this.renderDesktop();

        if (!this.password) {
            document.getElementById('setup-area').style.display = "block";
        } else {
            document.getElementById('login-area').style.display = "block";
        }
    },

    updateTime() {
        const t = new Date().toLocaleTimeString('ar-EG', {hour:'2-digit', minute:'2-digit'});
        document.getElementById('lock-clock').innerText = t;
        document.getElementById('mini-clock').innerText = t;
    },

    saveFirstPass() {
        const p = document.getElementById('new-pass').value;
        if(p.length < 1) return;
        localStorage.setItem('hos_pass', p);
        location.reload();
    },

    checkPass() {
        const p = document.getElementById('pass-field').value;
        if(p === this.password) {
            document.getElementById('lock-screen').style.transform = "translateY(-100%)";
        } else {
            document.getElementById('error-msg').innerText = "خطأ!";
        }
    },

    renderDesktop() {
        const apps = [
            { id: 'Settings', name: 'الإعدادات', icon: 'fa-cog', color: '#888' },
            { id: 'Notes', name: 'الملاحظات', icon: 'fa-sticky-note', color: '#ffcc00' }
        ];
        const grid = document.getElementById('icons-grid');
        grid.innerHTML = "";
        apps.forEach(app => {
            grid.innerHTML += `
                <div class="icon" onclick="HOS.openApp('${app.id}')">
                    <i class="fas ${app.icon}" style="color:${app.color}"></i>
                    <span>${app.name}</span>
                </div>`;
        });
    },

    openApp(id) {
        if(document.getElementById('win-'+id)) return;
        const win = document.createElement('div');
        win.className = "window";
        win.id = 'win-'+id;
        win.style.zIndex = ++this.z;
        win.style.top = "100px"; win.style.left = "100px";
        
        let content = id === 'Settings' ? this.getSettingsUI() : "محتوى التطبيق قيد التطوير";

        win.innerHTML = `
            <div class="bar" onmousedown="HOS.drag(event, this)">
                <span>${id}</span>
                <span onclick="this.closest('.window').remove()" style="cursor:pointer">×</span>
            </div>
            <div class="body">${content}</div>`;
        document.getElementById('windows-container').appendChild(win);
    },

    getSettingsUI() {
        return `
            <div style="text-align:right">
                <label>تغيير كلمة المرور:</label>
                <input type="password" id="change-pass-inp" style="width:100%;margin:10px 0;">
                <button class="set-btn" onclick="HOS.updatePass()">حفظ الكلمة الجديدة</button>
                <hr style="margin:20px 0; border:0; border-top:1px solid #444;">
                <button class="set-btn danger" onclick="HOS.factoryReset()">إعادة ضبط المصنع (مسح كل شيء)</button>
            </div>`;
    },

    updatePass() {
        const newP = document.getElementById('change-pass-inp').value;
        if(newP) {
            localStorage.setItem('hos_pass', newP);
            alert("تم تحديث كلمة المرور!");
        }
    },

    factoryReset() {
        if(confirm("هل أنت متأكد؟ سيتم مسح كلمة المرور وجميع البيانات!")) {
            localStorage.clear();
            location.reload();
        }
    },

    drag(e, bar) {
        const win = bar.parentElement;
        let ox = e.clientX - win.offsetLeft;
        let oy = e.clientY - win.offsetTop;
        document.onmousemove = (ev) => {
            win.style.left = ev.clientX - ox + "px";
            win.style.top = ev.clientY - oy + "px";
        };
        document.onmouseup = () => document.onmousemove = null;
    }
};
