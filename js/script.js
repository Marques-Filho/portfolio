// ========================= js/script.js =========================
// JS puro, com checagens para não quebrar se algum elemento faltar.
(function () {
  'use strict';

  // Utilitários simples
  const $  = (sel) => document.querySelector(sel);
  const $$ = (sel) => document.querySelectorAll(sel);

  // Ano automático no footer
  const elAno = $('#ano');
  if (elAno) elAno.textContent = new Date().getFullYear();

  // ===== Menu mobile =====
  const btnMenu = $('#btnMenu');
  const nav     = $('#nav');

  if (btnMenu && nav) {
    btnMenu.addEventListener('click', () => {
      const aberto = nav.classList.toggle('open');
      btnMenu.setAttribute('aria-expanded', String(aberto));
    });

    // Fecha o menu ao clicar em um link (melhor UX no mobile)
    nav.addEventListener('click', (e) => {
      if (e.target.tagName === 'A' && nav.classList.contains('open')) {
        nav.classList.remove('open');
        btnMenu.setAttribute('aria-expanded', 'false');
      }
    });
  }

  // ===== Tema claro/escuro (com persistência) =====
  const btnTema   = $('#btnTema');
  const ROOT      = document.documentElement; // <html>
  const CHAVE_TEMA = 'tema-site';

  function aplicarTema(tema) {
    ROOT.setAttribute('data-tema', tema);
    if (btnTema) btnTema.setAttribute('aria-pressed', String(tema === 'escuro'));
  }

  // Inicializa tema: localStorage → preferência do SO → padrão claro
  const temaSalvo = localStorage.getItem(CHAVE_TEMA);
  if (temaSalvo) {
    aplicarTema(temaSalvo);
  } else {
    const prefereEscuro = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    aplicarTema(prefereEscuro ? 'escuro' : 'claro');
  }

  // Alterna tema ao clicar no botão
  if (btnTema) {
    btnTema.addEventListener('click', () => {
      const atual   = ROOT.getAttribute('data-tema') || 'claro';
      const proximo = (atual === 'claro') ? 'escuro' : 'claro';
      aplicarTema(proximo);
      localStorage.setItem(CHAVE_TEMA, proximo);
    });
  }

  // ===== Formulário: validação + envio simulado =====
  const form        = $('#form-contato');
  const modal       = $('#modal');
  const fecharModal = $('#fecharModal');

  function validarEmail(email) {
    // Regex simples e suficiente para o trabalho
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function mostrarErro(campo, msg) {
    if (!campo) return;
    const small = $('#erro-' + campo.id);
    if (small) small.textContent = msg || '';
    campo.setAttribute('aria-invalid', msg ? 'true' : 'false');
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const nome     = $('#nome');
      const email    = $('#email');
      const mensagem = $('#mensagem');

      let ok = true;

      // Nome
      if (!nome || !nome.value.trim()) { mostrarErro(nome, 'Por favor, informe seu nome.'); ok = false; }
      else { mostrarErro(nome, ''); }

      // E-mail
      if (!email || !email.value.trim())        { mostrarErro(email, 'Por favor, informe seu e-mail.'); ok = false; }
      else if (!validarEmail(email.value))      { mostrarErro(email, 'Informe um e-mail válido (ex.: usuario@dominio.com).'); ok = false; }
      else                                      { mostrarErro(email, ''); }

      // Mensagem
      if (!mensagem || !mensagem.value.trim())  { mostrarErro(mensagem, 'Por favor, escreva sua mensagem.'); ok = false; }
      else                                      { mostrarErro(mensagem, ''); }

      if (!ok) return;

      // Envio simulado
      form.reset();
      if (modal && typeof modal.showModal === 'function') modal.showModal();
      else alert('Mensagem enviada com sucesso!');
    });
  }

  if (fecharModal && modal) {
    fecharModal.addEventListener('click', () => modal.close());
  }

  // ===== Scrollspy: destaca link da seção visível =====
  const links  = $$('.nav a[href^="#"]');
  const secoes = [...links].map(l => $(l.getAttribute('href'))).filter(Boolean);

  if (secoes.length) {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const id   = '#' + entry.target.id;
        const link = document.querySelector(`.nav a[href="${id}"]`);
        if (!link) return;
        if (entry.isIntersecting) {
          links.forEach(a => a.classList.remove('is-active'));
          link.classList.add('is-active');
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px', threshold: 0 });

    secoes.forEach(sec => obs.observe(sec));
  }
})();