import React from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles.css'

createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)

// Initialize small UI effects: reveal on scroll, ripple, header parallax
function initUIEffects(){
  // reveal observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('in-view')
    })
  }, { threshold: 0.12 })

  document.querySelectorAll('.reveal, .reveal-item').forEach(el => observer.observe(el))

  // ripple delegated effect for elements with .ripple
  document.addEventListener('pointerdown', (e) => {
    const btn = e.target.closest('.ripple')
    if (!btn) return
    btn.classList.remove('active')
    // force reflow
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    void btn.offsetWidth
    btn.classList.add('active')
    setTimeout(() => btn.classList.remove('active'), 650)
  })

  // header parallax subtle
  const header = document.querySelector('.header')
  if (header) {
    window.addEventListener('scroll', () => {
      const y = Math.min(40, window.scrollY / 8)
      header.style.backgroundPosition = `50% ${50 + y}%`
    })
  }
}

setTimeout(initUIEffects, 120)
