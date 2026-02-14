import React, { useState } from 'react'

export default function MedicineSection({ title, items = [], kind = '', defaultCollapsed = false }) {
  const [collapsed, setCollapsed] = useState(defaultCollapsed)
  return (
    <section className={`section ${kind} reveal`}>
      <h2>{title}</h2>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <small style={{ color: 'var(--muted)' }}>{items.length} itens</small>
        <button className="toggle-btn ripple" onClick={() => setCollapsed(c => !c)} aria-expanded={!collapsed}>
          {collapsed ? 'Mostrar' : 'Ocultar'}
        </button>
      </div>
      <ul className={`medicine-list ${collapsed ? 'collapsed' : ''}`}>
        {items.map((m, i) => (
          // caso o item seja uma string longa com vírgulas, dividir para uma visualização melhor
          (typeof m === 'string' && m.includes(',')) ?
            m.split(',').map((part, pidx) => <li className="reveal-item" key={`${i}-${pidx}`}>{part.trim()}</li>) :
            <li className="reveal-item" key={i}>{m}</li>
        ))}
      </ul>
    </section>
  )
}
