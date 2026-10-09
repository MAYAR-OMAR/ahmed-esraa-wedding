const $ = s => document.querySelector(s), ev = $('#ev'), hv = $('#hv'), bgm = $('#bgm');
let opened = false;

// sora el envelope fo2 el fidyo l7ad ma awl frame yetrasem (3shan ma yzhar4 shasha 7amra)
const cover = document.createElement("img");
cover.src = ev.getAttribute("poster"); cover.className = "epc"; cover.alt = "";
ev.after(cover);
let clicked = false;
// tskhin el fidyo 2abl el dast (muted) 3shan el fat7 ybd2 3ltol 3la el mobile
ev.muted = true;
ev.play().then(() => { if (!clicked) { ev.pause(); ev.currentTime = 0; } }).catch(() => {});
function uncover() { cover.style.display = "none"; }
function watch() {
    if ("requestVideoFrameCallback" in ev) {
        const f = (n, m) => m.mediaTime > 0 ? uncover() : ev.requestVideoFrameCallback(f);
        ev.requestVideoFrameCallback(f);
    } else ev.addEventListener("timeupdate", () => { if (ev.currentTime > .05) uncover(); });
}


function open_() {
    if (opened) return;
    opened = true;
    $('#env').classList.add('out');
    document.body.classList.remove('lock');
    
    // el fidyo yebda2 mn awl el sanya 3ltol, w el kalam yebda2 ma3ah (mn gheir ta2kheer)
    try { hv.currentTime = 0; } catch (e) {}
    hv.play().catch(() => {});
    document.body.classList.add('go');
    
    if (!matchMedia('(prefers-reduced-motion:reduce)').matches) {
        setTimeout(start, 9000);
    }
}

// Hna zydna hv.play() awl ma el user ydws 3la el zarrar
$('#openBtn').onclick = () => {
    clicked = true;
    $('#openBtn').style.display = 'none';
    ev.play().catch(open_);      // el envelope el awl 3shan ma yet2akhar4 3la el mobile
    bgm.play().then(() => setSnd(true)).catch(() => {});
    watch();
    ev.onended = open_;
    // el wa2t byb2a mn lahzet ma el fidyo byshtaghal fe3lan
    ev.addEventListener('playing', () => {
        hv.play().catch(() => {});   // fidyo el nafora yebda2 ba3d ma el envelope yeshtaghal (mn gheir ta3arod)
        setTimeout(open_, Math.max(1200, (ev.duration || 3) * 1000 - 500));
    }, { once: true });
    setTimeout(open_, 12000); // ehtiyaty
};

const ar = n => String(n).padStart(2, '0');
const T = new Date('2026-11-06T20:00:00+02:00');

function tick() {
    let d = Math.max(0, T - Date.now()) / 1000,
        v = [d / 86400, d / 3600 % 24, d / 60 % 60, d % 60].map(x => ar(Math.floor(x)));
    document.querySelectorAll('#bx b').forEach((e, i) => e.textContent = v[i]);
}

tick();
setInterval(tick, 1000);

new IntersectionObserver((es, o) => es.forEach(e => {
    if (e.isIntersecting) {
        e.target.classList.add('on');
        o.unobserve(e.target);
    }
}), { threshold: .25 }).observe && document.querySelectorAll('.rv').forEach(el => {
    new IntersectionObserver((es, o) => {
        if (es[0].isIntersecting) {
            el.classList.add('on');
            o.disconnect();
        }
    }, { threshold: .2 }).observe(el);
});

$("#pe2").src = $("#pe1").src;

let as = false, raf, last, y;

function ui() {
    $('#ai').innerHTML = as ? '<path d="M9 5v14M15 5v14"/>' : '<path d="M6 7l6 5 6-5M6 13l6 5 6-5"/>';
    $('#as').setAttribute('aria-pressed', as);
}

function step(t) {
    if (!as) return;
    if (last) {
        y += (t - last) * .04;
        if (y >= document.documentElement.scrollHeight - innerHeight) {
            stop();
            return;
        }
        scrollTo({ top: y, behavior: 'instant' });
    }
    last = t;
    raf = requestAnimationFrame(step);
}

function start() {
    if (as || !opened) return;
    as = true;
    y = scrollY;
    last = 0;
    raf = requestAnimationFrame(step);
    ui();
}

function stop() {
    as = false;
    cancelAnimationFrame(raf);
    ui();
}

['wheel', 'touchstart', 'keydown', 'mousedown'].forEach(e => addEventListener(e, v => {
    if (as && !(v.target.closest && v.target.closest('#as,#snd'))) stop();
}, { passive: true }));

$('#as').onclick = () => as ? stop() : start();
ui();

// zorar el sot: byshaghal / yewaqqaf el o8nya el mp3
function setSnd(v) { $('#wv').style.opacity = v ? 1 : .25; }
let wasOn = false;
$('#snd').onclick = () => {
    if (bgm.paused) bgm.play().then(() => setSnd(true)).catch(() => {});
    else { bgm.pause(); setSnd(false); }
};
// law el user 5arag mn el tab, nwaqqaf el o8nya w nrg3ha lama yrg3
document.addEventListener('visibilitychange', () => {
    if (document.hidden) { wasOn = !bgm.paused; bgm.pause(); }
    else if (wasOn) bgm.play().catch(() => {});
});
setSnd(false);