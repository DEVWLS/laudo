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

    // Campo de link legível removido

    // Gera QR code com URL contendo identificação simples
    const qrCode = document.getElementById('qrCode');
    if (qrCode) {
        const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(pdfUrl.href)}`;
        qrCode.src = qrApiUrl;
    }

    // Add temporary attention animation to download button on load
    const downloadBtn = document.getElementById('downloadPdf');
    if (downloadBtn) {
        // short attention then switch to a subtle continuous pulse
        downloadBtn.classList.add('attention');
        setTimeout(() => {
            downloadBtn.classList.remove('attention');
            downloadBtn.classList.add('pulse');
        }, 1800);
        // remove pulse after user clicks download to avoid distraction
        downloadBtn.addEventListener('click', () => {
            downloadBtn.classList.remove('pulse');
        });
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

    // Busca na seção 'Não Usar' - filtra medicamentos
    const notAllowedSearch = document.getElementById('notAllowedSearch');
    if (notAllowedSearch) {
        const notAllowedItems = Array.from(document.querySelectorAll('.not-allowed .medicine-list li'));
        notAllowedSearch.addEventListener('input', (e) => {
            const q = (e.target.value || '').trim().toLowerCase();
            if (!q) {
                notAllowedItems.forEach(li => li.style.display = 'inline-flex');
                return;
            }
            notAllowedItems.forEach(li => {
                const text = (li.textContent || '').toLowerCase();
                li.style.display = text.indexOf(q) !== -1 ? 'inline-flex' : 'none';
            });
        });
    }

    // Expand/Collapse controls removed per user request

    // (cópia via botão removida) 

    // (botão alternativo de cópia removido)

    // Print with small visual feedback
    const printBtn = document.getElementById('printBtn');
    if (printBtn) printBtn.addEventListener('click', () => {
        // add visual state
        printBtn.classList.add('printing');
        const originalText = printBtn.innerText;
        // keep original icon but show status via pseudo-element; still set innerText briefly
        printBtn.innerText = '🖨️ Imprimindo...';
        // small delay so the animation is visible before the print dialog
        setTimeout(() => {
            try {
                window.print();
            } catch (e) {
                console.error(e);
            } finally {
                // restore after short timeout
                setTimeout(() => {
                    printBtn.classList.remove('printing');
                    printBtn.innerText = originalText;
                }, 700);
            }
        }, 160);
    });

    // Dark theme removed per user request

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