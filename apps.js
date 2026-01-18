const HOS = {
    z: 100,
    password: "1234",
    apps: {},
    installed: JSON.parse(localStorage.getItem('installed_apps')) || ['Browser', 'Notes', 'Calculator'],

    boot() {
        this.createStars();
        this.timer();
        setInterval(() => this.timer(), 1000);
        this.initApps();
        this.renderDesktop();
        this.loadStore();
    },

    timer() {
        const now = new Date();
        const timeStr = now.toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' });
        document.getElementById("lock-clock").innerText = timeStr;
        document.getElementById("mini-clock").innerText = timeStr;
    },

    checkPassword() {
        const val = document.getElementById("pass-field").value;
        const screen = document.getElementById("lock-screen");
        if (val === this.password) {
            screen.style.transform = "scale(1.2)";
            screen.style.opacity = "0";
            setTimeout(() => screen.style.display = "none", 800);
        } else {
            document.getElementById("error-msg").innerText = "خطأ في كلمة المرور!";
            document.getElementById("pass-field").value = "";
        }
    },

    createStars() {
        const container = document.getElementById("stars-container");
        for (let i = 0; i < 100; i++) {
            const star = document.createElement("div");
            star.className = "star";
            const size = Math.random() * 3 + "px";
            star.style.width = star.style.height = size;
            star.style.left = Math.random() * 100 + "vw";
            star.style.top = Math.random() * 100 + "vh";
            container.appendChild(star);
        }
    },

    initApps() {
        this.apps = {
            "Browser": { name: "المتصفح", icon: "fa-globe", color: "#4285f4", content: `<iframe src="https://www.bing.com" style="width:100%;height:100%;border:none;background:white;"></iframe>` },
            "Notes": { name: "المفكرة", icon: "fa-edit", color: "#fbbc05", content: `<textarea style="width:100%;height:100%;background:transparent;color:white;border:none;padding:15px;outline:none;" placeholder="اكتب هنا..."></textarea>` },
            "Calculator": { name: "الحاسبة", icon: "fa-calculator", color: "#34a853", content: `<div style="padding:20px;text-align:center;">جاري تطوير الحاسبة المتطورة...</div>` },
            "Snake": { name: "الثعبان", icon: "fa-vial", color: "#ea4335", content: `<div style="padding:20px;text-align:center;">اللعبة قيد التحميل...</div>` }
        };
    },

    renderDesktop() {
        const desk = document.getElementById("desktop");
        desk.innerHTML = "";
        this.installed.forEach(id => {
            const app = this.apps[id];
            const div = document.createElement("div");
            div.className = "icon";
            div.innerHTML = `<i class="fas ${app.icon}" style="color:${app.color}"></i><span>${app.name}</span>`;
            div.onclick = () => this.openApp(id);
            desk.appendChild(div);
        });
    },

    openApp(id) {
        if (document.getElementById("win-" + id)) return;
        const app = this.apps[id];
        const win = document.createElement("div");
        win.className = "window";
        win.id = "win-" + id;
        win.style.zIndex = ++this.z;
        win.style.top = "100px"; win.style.left = "100px";
        
        win.innerHTML = `
            <div class="bar">
                <span><i class="fas ${app.icon}"></i> ${app.name}</span>
                <span class="close-btn" onclick="this.closest('.window').remove()">×</span>
            </div>
            <div style="flex:1; overflow:hidden;">${app.content}</div>
        `;
        document.body.appendChild(win);
        this.makeDraggable(win);
    },

    makeDraggable(win) {
        const bar = win.querySelector(".bar");
        bar.onmousedown = (e) => {
            let ox = e.clientX - win.offsetLeft;
            let oy = e.clientY - win.offsetTop;
            document.onmousemove = (ev) => {
                win.style.left = ev.clientX - ox + "px";
                win.style.top = ev.clientY - oy + "px";
            };
            document.onmouseup = () => document.onmousemove = null;
        };
    },

    toggleStore(show) {
        document.getElementById("app-store").style.display = show ? "block" : "none";
    },

    loadStore() {
        const grid = document.getElementById("store-items");
        grid.innerHTML = "";
        Object.keys(this.apps).forEach(id => {
            const card = document.createElement("div");
            card.className = "store-card"; // أضف تنسيقها في CSS
            card.innerHTML = `<h4>${this.apps[id].name}</h4><button onclick="HOS.install('${id}')">تثبيت</button>`;
            grid.appendChild(card);
        });
    },

    install(id) {
        if (!this.installed.includes(id)) {
            this.installed.push(id);
            localStorage.setItem('installed_apps', JSON.stringify(this.installed));
            this.renderDesktop();
            alert("تم التثبيت بنجاح!");
        }
    }
};
