import React, { useState, useMemo } from 'react'
import MedicineSection from './components/MedicineSection'
import medicines from './data/medicines.json'

const patient = {
  name: 'WASHINGTON LUIZ SILVA',
  date: '23/08/24',
  diagnosis: 'PACIENTE PORTADOR DE ANGIOEDEMA/UrticÁRIA INDUZIDO POR AINES'
}

export default function App() {
  const [collapsedAll, setCollapsedAll] = useState(false)
  const [query, setQuery] = useState('')

  const pdfUrl = useMemo(() => {
    const base = new URL('laudo.pdf', window.location.href)
    const slug = encodeURIComponent((patient.name + ' ' + patient.date).toLowerCase().replace(/\s+/g, '-'))
    base.searchParams.set('patient', slug)
    return base.href
  }, [])

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(pdfUrl)
      alert('Link copiado para área de transferência')
    } catch (e) {
      alert('Erro ao copiar link')
    }
  }

  // Filtra itens por query (busca simples)
  const normalize = s => (s || '').toLowerCase()
  const filteredAllowed = medicines.allowed.filter(item => normalize(item).includes(normalize(query)))
  const filteredProhibited = medicines.prohibitedSections
    .map(s => ({ ...s, matches: normalize(s.title).includes(normalize(query)) || normalize(s.items.join(' ')).includes(normalize(query)) }))
    .filter(s => query.trim() ? s.matches : true)

  return (
    <div className="container">
      <header className="header">
        <h1>ORIENTAÇÕES PARA PACIENTES ALÉRGICOS A ANTIINFLAMATÓRIOS, ANALGÉSICOS E ANTI-TÉRMICOS</h1>
        <p>Laudo rápido e validado — compartilhe com segurança via QR ou link</p>
      </header>

      <div className="top-actions">
        <div className="search">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden focusable="false"><path d="M21 21l-4.35-4.35" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><circle cx="11" cy="11" r="6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>
          <input value={query} onChange={e => setQuery(e.target.value)} placeholder="Pesquisar medicamento ou princípio ativo" aria-label="Pesquisar" />
        </div>
        <div className="actions-right">
          <button className="btn-ghost ripple" onClick={() => { setQuery(''); document.querySelectorAll('.medicine-list').forEach(el => el.classList.remove('collapsed')) }}>Limpar</button>
          <button className="btn-primary ripple" onClick={() => window.print()}>Imprimir Laudo</button>
        </div>
      </div>

      <section className="patient-info reveal">
        <div className="patient-info-grid">
          <div className="info-field">
            <strong>Nome do Paciente</strong>
            <p>{patient.name}</p>
          </div>
          <div className="info-field">
            <strong>Data do Laudo</strong>
            <p>{patient.date}</p>
          </div>
          <div className="info-field">
            <strong>Diagnóstico</strong>
            <p>{patient.diagnosis}</p>
          </div>
        </div>
      </section>


      <main className="content">
        <MedicineSection title="Pode Usar" kind="allowed" items={filteredAllowed} defaultCollapsed={false} />

        <section className="section not-allowed reveal">
          <h2>Não Usar</h2>
          <p className="muted">Os seguintes medicamentos que contenham:</p>

          {filteredProhibited.map((s, i) => (
            <div key={i} style={{ marginTop: 15 }}>
              <h3 className="med-heading">{s.title}</h3>
              <ul className="medicine-list">
                {s.items.map((it, idx) => (
                  // dividir por vírgula para melhor visualização
                  it.split(',').map((part, pidx) => (
                    <li className="reveal-item" key={`${idx}-${pidx}`}>{part.trim()}</li>
                  ))
                ))}
              </ul>
            </div>
          ))}

        </section>

        <section className="section warning warnings reveal">
          <strong>⚠️ OBSERVAÇÕES IMPORTANTES:</strong>
          <p><strong>1. Medicações como pomadas e colírios:</strong> As medicações acima também podem causar sintomas se forem usadas como pomadas ou colírios.</p>
          <p><strong>2. Verificar nome genérico:</strong> Observe sempre o nome Genérico do medicamento!!! Muitos medicamentos contêm estes princípios ativos na composição mesmo que não seja aparente pelo nome comercial.</p>
        </section>

        <section className="pdf-viewer-section reveal">
          <h2>📄 Visualizar Laudo Completo</h2>
          <div className="pdf-frame-container">
            <iframe src={pdfUrl} title="Laudo Médico em PDF" loading="lazy"></iframe>
          </div>
          <p className="muted">Se o PDF não carregar, verifique se o arquivo "laudo.pdf" está na mesma pasta.</p>
        </section>

        <div className="download-section reveal">
          <a id="downloadPdf" href={pdfUrl} download className="download-btn ripple">📥 Baixar Laudo em PDF</a>

          <div className="controls">
            <button onClick={() => document.querySelectorAll('.medicine-list').forEach(el => el.classList.remove('collapsed'))} className="toggle-btn ripple">🔽 Expandir Tudo</button>
            <button onClick={() => document.querySelectorAll('.medicine-list').forEach(el => el.classList.add('collapsed'))} className="toggle-btn ripple">🔼 Colapsar Tudo</button>
            <button onClick={copyLink} className="toggle-btn ripple">🔗 Copiar Link</button>
            <button onClick={() => window.print()} className="toggle-btn ripple">🖨️ Imprimir</button>
          </div>

          <div className="qr-code-container">
            <p>Escanear para acessar PDF:</p>
            <img className="pulse" src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(pdfUrl)}`} alt="QR Code para download do laudo" />
          </div>
        </div>

        <footer className="footer">
          <p>Laudo Médico - Angioedema e Reações a AINEs | Gerado em: 13 de fevereiro de 2026</p>
          <p style={{ marginTop: 10, fontSize: '0.85rem' }}>Este documento é uma orientação médica oficial. Para dúvidas, consulte seu médico responsável.</p>
        </footer>
      </main>
    </div>
  )
}
