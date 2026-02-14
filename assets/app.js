// app.js - comportamentos extraídos do index.html
window.addEventListener('DOMContentLoaded', function() {
    // Encontrar dados do paciente para incluir no link
    const infoFields = document.querySelectorAll('.patient-info .info-field');
    let patientName = '';
    let reportDate = '';
    infoFields.forEach(f => {
        const key = (f.querySelector('strong') || {}).textContent || '';
        const value = (f.querySelector('p') || {}).textContent || '';
        if (/Nome/i.test(key)) patientName = value.trim();
        if (/Data/i.test(key)) reportDate = value.trim();
    });

    // construir URL do PDF com query params para validação/compartilhamento
    const basePdf = 'laudo.pdf';
    const slug = encodeURIComponent((patientName + ' ' + reportDate).toLowerCase().replace(/\s+/g, '-')) || 'laudo';
    const pdfUrl = new URL(basePdf, window.location.href);
    pdfUrl.searchParams.set('patient', slug);

    // Atualiza link de download
    const downloadLink = document.getElementById('downloadPdf');
    if (downloadLink) downloadLink.href = pdfUrl.href;

    // Gera QR code com URL contendo identificação simples
    const qrCode = document.getElementById('qrCode');
    if (qrCode) {
        const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(pdfUrl.href)}`;
        qrCode.src = qrApiUrl;
    }

    // Toggle: transforma cada <h3.med-heading> em controle para colapsar sua lista seguinte
    document.querySelectorAll('h3.med-heading').forEach(h3 => {
        const ul = h3.nextElementSibling;
        if (!ul || !ul.classList.contains('medicine-list')) return;

        const btn = document.createElement('button');
        btn.className = 'toggle-btn';
        btn.type = 'button';
        btn.setAttribute('aria-expanded', 'true');
        btn.innerText = 'Ocultar';
        btn.addEventListener('click', () => {
            const collapsed = ul.classList.toggle('collapsed');
            btn.setAttribute('aria-expanded', String(!collapsed));
            btn.innerText = collapsed ? 'Mostrar' : 'Ocultar';
        });

        // inserir botão ao lado do título
        h3.style.display = 'flex';
        h3.style.justifyContent = 'space-between';
        h3.appendChild(btn);
    });

    // Expand/Collapse all
    const expandAll = document.getElementById('expandAll');
    const collapseAll = document.getElementById('collapseAll');
    if (expandAll) expandAll.addEventListener('click', () => {
        document.querySelectorAll('.medicine-list.collapsed').forEach(ul => ul.classList.remove('collapsed'));
    });
    if (collapseAll) collapseAll.addEventListener('click', () => {
        document.querySelectorAll('.medicine-list').forEach(ul => ul.classList.add('collapsed'));
    });

    // Copiar link para clipboard
    const copyLink = document.getElementById('copyLink');
    if (copyLink) copyLink.addEventListener('click', async () => {
        try {
            await navigator.clipboard.writeText(pdfUrl.href);
            copyLink.innerText = 'Copiado!';
            setTimeout(() => copyLink.innerText = '🔗 Copiar Link', 1800);
        } catch (e) {
            alert('Não foi possível copiar o link.');
        }
    });

    // Print
    const printBtn = document.getElementById('printBtn');
    if (printBtn) printBtn.addEventListener('click', () => window.print());

    // Theme (dark mode) - persisted in localStorage
    const themeToggle = document.getElementById('themeToggle');
    const THEME_KEY = 'laudoTheme';
    const applyTheme = (t) => {
        if (t === 'dark') document.documentElement.classList.add('dark');
        else document.documentElement.classList.remove('dark');
        if (themeToggle) themeToggle.innerText = (t === 'dark') ? '☀️ Claro' : '🌙 Escuro';
    };

    // Inicializar tema: preferência salva ou preferência do sistema
    const savedTheme = localStorage.getItem(THEME_KEY) || (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    applyTheme(savedTheme);

    if (themeToggle) themeToggle.addEventListener('click', () => {
        const next = document.documentElement.classList.contains('dark') ? 'light' : 'dark';
        applyTheme(next);
        try { localStorage.setItem(THEME_KEY, next); } catch (e) { /* ignore */ }
    });

    // -- Animations: reveal on scroll, staggered list reveals, ripple effect, header parallax
    // Reveal on scroll (sections and list items)
    const ioOptions = { root: null, rootMargin: '0px 0px -8% 0px', threshold: 0.08 };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
                // For list item children, stagger by index
                if (entry.target.matches('.medicine-list')) {
                    const items = Array.from(entry.target.querySelectorAll('li'));
                    items.forEach((li, i) => {
                        setTimeout(() => li.classList.add('in-view'), i * 45);
                    });
                }
            }
        });
    }, ioOptions);

    // Observe sections and lists
    document.querySelectorAll('.section, .medicine-list').forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
    });

    // Also observe individual list items for entry (in case lists are already visible)
    document.querySelectorAll('.medicine-list li').forEach((li, idx) => {
        // small stagger on load
        li.style.transitionDelay = (idx % 8) * 30 + 'ms';
        observer.observe(li);
    });

    // Ripple effect for buttons
    const makeRipple = (e) => {
        const el = e.currentTarget;
        const rect = el.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height) * 1.2;
        const span = document.createElement('span');
        span.className = 'ripple';
        span.style.width = span.style.height = size + 'px';
        span.style.left = (e.clientX - rect.left - size/2) + 'px';
        span.style.top = (e.clientY - rect.top - size/2) + 'px';
        el.appendChild(span);
        setTimeout(() => span.remove(), 700);
    };

    document.querySelectorAll('.toggle-btn, .download-btn').forEach(btn => {
        btn.addEventListener('click', makeRipple);
    });

    // Header parallax (subtle translate on scroll)
    const headerEl = document.querySelector('.header');
    if (headerEl) {
        window.addEventListener('scroll', () => {
            const y = Math.min(window.scrollY, 200);
            headerEl.style.transform = `translateY(${y * 0.06}px)`;
        }, { passive: true });
    }
});
