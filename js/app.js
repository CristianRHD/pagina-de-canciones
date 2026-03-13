// ============================
//  OYE — app.js
//  Ubicación: js/app.js
// ============================

let canciones = [];

// Rutas relativas desde componentes/index.html
const iconPath = num => `../imagenes/icon_${num}.svg`;
const mp3Path  = r   => `../canciones/${r}`;

// ── Cargar datos.json ─────────────────────────
fetch('../datos.json')
  .then(r => r.json())
  .then(d => { canciones = d.canciones; init(); })
  .catch(() => {
    // Fallback si no hay servidor (abrir con file://)
    canciones = [
      {nombre:'vive',       ruta:'uno.mp3',    reproducciones:1200, icono:4},
      {nombre:'invierno',   ruta:'dos.mp3',    reproducciones:30,   icono:1},
      {nombre:'planeta',    ruta:'tres.mp3',   reproducciones:210,  icono:3},
      {nombre:'suave',      ruta:'cuatro.mp3', reproducciones:30,   icono:2},
      {nombre:'contigo',    ruta:'cinco.mp3',  reproducciones:50,   icono:4},
      {nombre:'alas',       ruta:'seis.mp3',   reproducciones:70,   icono:1},
      {nombre:'verde',      ruta:'siete.mp3',  reproducciones:60,   icono:3},
      {nombre:'nuevamente', ruta:'ocho.mp3',   reproducciones:90,   icono:1},
      {nombre:'hoy',        ruta:'nueve.mp3',  reproducciones:40,   icono:2},
    ];
    init();
  });

// ── Init ──────────────────────────────────────
function init() {
  renderTop3();
  renderCards(canciones);
  bindNav();
  bindSearch();
  bindContacto();
  bindLogin();
  bindRegistro();
}

// ── Navegación SPA ────────────────────────────
function bindNav() {
  document.querySelectorAll('[data-page]').forEach(el => {
    el.addEventListener('click', () => mostrarPagina(el.dataset.page));
  });
}

function mostrarPagina(nombre) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const pg = document.getElementById('page-' + nombre);
  if (pg) pg.classList.add('active');
  document.querySelectorAll('.nav-link[data-page]').forEach(l =>
    l.classList.toggle('active', l.dataset.page === nombre));
}

// ── TOP 3 ─────────────────────────────────────
function renderTop3() {
  const top3  = [...canciones].sort((a,b) => b.reproducciones - a.reproducciones).slice(0,3);
  const tbody = document.getElementById('top3-body');
  tbody.innerHTML = '';
  top3.forEach(s => {
    const row = document.createElement('div');
    row.className = 'top3-row';
    row.innerHTML = `
      <div class="top3-name">
        <img src="${iconPath(s.icono)}" alt="${s.nombre}">
        ${s.nombre}
      </div>
      <audio controls src="${mp3Path(s.ruta)}"></audio>`;
    tbody.appendChild(row);
  });
}

// ── Cards canciones ───────────────────────────
function renderCards(lista) {
  const ordenadas = [...lista].sort((a,b) => b.reproducciones - a.reproducciones);
  const grid = document.getElementById('cards-grid');
  grid.innerHTML = '';
  if (!ordenadas.length) {
    grid.innerHTML = '<p class="empty-msg">No se encontraron canciones.</p>';
    return;
  }
  ordenadas.forEach(s => {
    const card = document.createElement('div');
    card.className = 'song-card';
    card.innerHTML = `
      <div class="card-cover">
        <img src="${iconPath(s.icono)}" alt="${s.nombre}">
      </div>
      <div class="card-body">
        <h3>${s.nombre}</h3>
        <p class="plays">${s.reproducciones} reproducciones</p>
        <audio controls src="${mp3Path(s.ruta)}"></audio>
      </div>`;
    grid.appendChild(card);
  });
}

// ── Buscador ──────────────────────────────────
function bindSearch() {
  document.getElementById('search-input').addEventListener('input', e => {
    const q = e.target.value.toLowerCase();
    renderCards(canciones.filter(s => s.nombre.toLowerCase().includes(q)));
  });
}

// ── Modal Contacto ────────────────────────────
function bindContacto() {
  const overlay = document.getElementById('modal-contacto');
  document.querySelectorAll('[data-action="contacto"]')
    .forEach(b => b.addEventListener('click', () => overlay.classList.add('open')));
  document.getElementById('btn-cerrar-modal')
    .addEventListener('click', () => overlay.classList.remove('open'));
  overlay.addEventListener('click', e => {
    if (e.target === overlay) overlay.classList.remove('open');
  });
}

// ── Login ─────────────────────────────────────
function bindLogin() {
  document.getElementById('form-login').addEventListener('submit', e => {
    e.preventDefault();
    const email = e.target.querySelector('#login-email');
    const pass  = e.target.querySelector('#login-pass');
    clearErr(email); clearErr(pass);
    let ok = true;
    if (!email.value.trim() || !isEmail(email.value)) {
      setErr(email, 'Correo electrónico inválido.'); ok = false;
    }
    if (!pass.value.trim()) {
      setErr(pass, 'La contraseña es obligatoria.'); ok = false;
    }
    if (ok) {
      showAlert('alert-login', 'success', '¡Bienvenido! Sesión iniciada correctamente.');
      e.target.reset();
    }
  });
}

// ── Registro ──────────────────────────────────
function bindRegistro() {
  document.getElementById('form-registro').addEventListener('submit', e => {
    e.preventDefault();
    const f    = e.target;
    const mail = f.querySelector('#reg-email');
    const pass = f.querySelector('#reg-pass');
    const conf = f.querySelector('#reg-pass-conf');
    const gen  = f.querySelector('#reg-genero');
    const term = f.querySelector('#reg-terminos');
    const edadOk = [...f.querySelectorAll('input[name="edad"]')].some(r => r.checked);

    clearErr(mail); clearErr(pass); clearErr(conf); clearErr(gen);
    hide('error-edad'); hide('error-terminos');

    let ok = true;
    if (!mail.value.trim() || !isEmail(mail.value)) { setErr(mail, 'Correo electrónico inválido.'); ok = false; }
    if (!pass.value || pass.value.length < 6)        { setErr(pass, 'Mínimo 6 caracteres.'); ok = false; }
    if (conf.value !== pass.value)                   { setErr(conf, 'Las contraseñas no coinciden.'); ok = false; }
    if (!gen.value)                                  { setErr(gen,  'Selecciona un género musical.'); ok = false; }
    if (!edadOk)                                     { show('error-edad'); ok = false; }
    if (!term.checked)                               { show('error-terminos'); ok = false; }

    if (ok) {
      showAlert('alert-registro', 'success', '¡Registro exitoso! Ya puedes iniciar sesión.');
      f.reset();
    }
  });
}

// ── Helpers ───────────────────────────────────
const isEmail = v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

function setErr(input, msg) {
  input.classList.add('error');
  const el = input.nextElementSibling;
  if (el && el.classList.contains('error-msg')) {
    el.textContent = msg;
    el.style.display = 'block';
  }
}
function clearErr(input) {
  input.classList.remove('error');
  const el = input.nextElementSibling;
  if (el && el.classList.contains('error-msg')) el.style.display = 'none';
}
function show(id) { document.getElementById(id).style.display = 'block'; }
function hide(id) { document.getElementById(id).style.display = 'none'; }

function showAlert(id, type, msg) {
  const el = document.getElementById(id);
  el.textContent = msg;
  el.className = `alert alert-${type} show`;
  setTimeout(() => el.classList.remove('show'), 4000);
}