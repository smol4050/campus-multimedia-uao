//export function initModal() {
//    const modal = document.getElementById("zone-modal");
//    const closeBtn = document.getElementById("close-modal");
//    const tabBtns = document.querySelectorAll(".tab-btn");

//    closeBtn.onclick = () => {
//        modal.classList.add("hidden");
//        document.getElementById("modal-audio").pause();
//    };

//    tabBtns.forEach(btn => {
//        btn.onclick = (e) => {
//            document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
//            document.querySelectorAll(".tab-content").forEach(c => {
//                c.classList.remove("active");
//                c.classList.add("hidden");
//            });

//            const target = e.target.getAttribute("data-tab");
//            e.target.classList.add("active");

//            const content = document.getElementById(`tab-${target}`);
//            content.classList.remove("hidden");
//            content.classList.add("active");
//        };
//    });
//}

//export function openModal(zone) {
//    document.getElementById("modal-title").textContent = zone.name;
//    document.getElementById("modal-category").textContent = zone.category;
//    document.getElementById("modal-desc").textContent = zone.description;
//    document.getElementById("modal-img").src = zone.image;

//    const audioEl = document.getElementById("modal-audio");
//    audioEl.src = zone.audio;
//    audioEl.load();

//    document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
//    document.querySelectorAll(".tab-content").forEach(c => {
//        c.classList.remove("active");
//        c.classList.add("hidden");
//    });

//    document.querySelector('[data-tab="info"]').classList.add("active");
//    const infoTab = document.getElementById("tab-info");
//    infoTab.classList.remove("hidden");
//    infoTab.classList.add("active");

//    document.getElementById("zone-modal").classList.remove("hidden");
//}