import re

html = open('live_pretty.html', 'r', encoding='utf-8').read()

match = re.search(r'(<header class="nav-container".*?</footer>)', html, re.DOTALL)
if match:
    body_content = match.group(1)
    
    clean_js = '''
// ─── HERO STATS COUNT UP ───
const statsObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const el = entry.target;
      const target = parseInt(el.dataset.target);
      if (isNaN(target)) return;
      let current = 0;
      if (target === 0) {
        el.textContent = "Zero";
        statsObserver.unobserve(el);
        return;
      }
      const step = Math.ceil(target / 30);
      const interval = setInterval(() => {
        current += step;
        if (current >= target) {
          current = target;
          clearInterval(interval);
        }
        el.textContent = current + (el.parentElement.querySelector('.stat-lbl').textContent.includes('Latency') ? 's' : '%');
      }, 35);
      statsObserver.unobserve(el);
    }
  });
}, { threshold: 0.5 });
setTimeout(() => {
  document.querySelectorAll('.stat-val').forEach(el => statsObserver.observe(el));
}, 200);

// ─── INTERACTIVE TERMINAL SIMULATOR ───
const commands = {
  bridge: 'gauvreau-bridge --sync-costs --target-firm 0928',
  rate: 'gauvreau-rate-engine --audit-entries --firm-id 0928'
};

const consoleLogs = {
  bridge: [
    { text: '$ gauvreau-bridge --sync-costs --target-firm 0928', type: 'info' },
    { text: '[Clio API] Fetching new hard cost records... [3 items found]', type: 'text' },
    { text: '[Bridge Engine] Resolving vendor mappings with QuickBooks Online...', type: 'text' },
    { text: '[Syncing] Item 1: Filing Fee ($402.00) -> Matched Vendor: County Court', type: 'text' },
    { text: '[Syncing] Attaching invoice: filing_fee_receipt.pdf...', type: 'text' },
    { text: ' Sync complete. 3 QuickBooks Online vendor bills generated automatically.', type: 'success' },
    { text: '[Stats] Bridge Latency: 0.8 seconds (Synchronized)', type: 'info' }
  ],
  rate: [
    { text: '$ gauvreau-rate-engine --audit-entries --firm-id 0928', type: 'info' },
    { text: '[Rate Override Engine] Watching Clio Manage time entries... [Active listener]', type: 'text' },
    { text: '[Event Intercepted] User: J. James | Matter: Smithson (00001)', type: 'text' },
    { text: '[Rules Matcher] Applying matter rule: 00001-Smithson bills at $333.00/hr', type: 'text' },
    { text: '[Clio API] Discrepancy detected (logged at $250.00/hr). Patching rate...', type: 'warning' },
    { text: ' Clio time entry rate updated successfully to $333.00/hr.', type: 'success' },
    { text: '[Audit Trail] Wrote correction record to secure audit journal.', type: 'info' }
  ]
};

const prevewHTMLs = {
  bridge: `
    <div style="width:100%; height:100%; border-radius:8px; background:linear-gradient(45deg, #2a251e, #14120e); border:1px solid rgba(255,255,255,0.06); padding:16px; display:flex; gap:20px; align-items:center;">
      <div style="width:80px; height:80px; border-radius:8px; background:rgba(255,255,255,0.02); border:1px solid rgba(255,255,255,0.06); display:flex; align-items:center; justify-content:center; font-size:32px; position:relative; overflow:hidden;">
        <div style="position:absolute; inset:0; border:1px solid rgba(184,150,46,0.2); border-radius:8px; animation: breathe 2.5s ease infinite;"></div>
      </div>
      <div>
        <h4 style="color:#fff; font-size:14px; font-weight:600; margin-bottom:4px; font-family:var(--font-sans);">QuickBooks Online Sync Bill</h4>
        <p style="color:#90897d; font-size:11px; margin-bottom:0;">Vendor: County Court<br>Amount: $402.00<br>Receipt: filing_fee_receipt.pdf attached</p>
      </div>
    </div>
  `,
  rate: `
    <div style="width:100%; height:100%; border-radius:8px; background:linear-gradient(135deg, rgba(184,150,46,0.02), rgba(184,150,46,0.06)); border:1px solid rgba(184,150,46,0.08); padding:16px; display:flex; flex-direction:column; justify-content:space-between;">
      <div style="font-size:11px; text-transform:uppercase; color:var(--gold-light); font-weight:600;">Time Entry Override corrected</div>
      <div>
        <div style="font-size:16px; font-weight:700; color:#fff; font-family:var(--font-sans);">Matter: 00001-Smithson</div>
        <p style="color:#90897d; font-size:11px; margin-top:2px;">Rate adjusted: $250.00/hr &rarr; <span style="color:#2ecc71; font-weight:600;">$333.00/hr</span></p>
      </div>
      <div style="display:flex; justify-content:space-between; font-size:10px; color:#706757; margin-top:8px;">
        <span>User: Jason James</span>
        <span style="color:#2ecc71; font-weight:600;">Audit Recorded</span>
      </div>
    </div>
  `
};

let activeTool = 'bridge';
let isRunning = false;

const tabs = document.querySelectorAll('.sandbox-tab');
const cmdText = document.getElementById('cmd-text');
const btnRun = document.getElementById('btn-run-simulation');
const consoleOutput = document.getElementById('console-output');
const previewOutput = document.getElementById('preview-output');

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    if (isRunning) return;
    tabs.forEach(t => t.classList.remove('active-tab'));
    tab.classList.add('active-tab');
    activeTool = tab.dataset.tool;
    if (cmdText) cmdText.textContent = commands[activeTool];
    
    // Reset output console
    if (consoleOutput) consoleOutput.innerHTML = `<div class="console-line">Click "Run Automation Task" to run ${tab.textContent}...</div>`;
    if (previewOutput) previewOutput.classList.remove('show-preview');
  });
});

if (btnRun) {
  btnRun.addEventListener('click', () => {
    if (isRunning) return;
    isRunning = true;
    btnRun.disabled = true;
    btnRun.style.opacity = '0.6';
    
    consoleOutput.innerHTML = '';
    previewOutput.classList.remove('show-preview');
    
    const logs = consoleLogs[activeTool];
    let currentLogIdx = 0;
    
    function printNextLine() {
      if (currentLogIdx < logs.length) {
        const lineData = logs[currentLogIdx];
        const div = document.createElement('div');
        div.className = 'console-line';
        if (lineData.type === 'success') div.className += ' console-success';
        if (lineData.type === 'warning') div.className += ' console-warning';
        if (lineData.type === 'info') div.className += ' console-info';
        div.textContent = lineData.text;
        
        consoleOutput.appendChild(div);
        
        setTimeout(() => {
          div.classList.add('show-line');
          consoleOutput.scrollTop = consoleOutput.scrollHeight;
        }, 50);
        
        currentLogIdx++;
        setTimeout(printNextLine, 500 + Math.random() * 400);
      } else {
        previewOutput.innerHTML = prevewHTMLs[activeTool];
        previewOutput.classList.add('show-preview');
        
        isRunning = false;
        btnRun.disabled = false;
        btnRun.style.opacity = '1';
      }
    }
    
    printNextLine();
  });
}

// Mobile menu toggle
const menuToggle = document.getElementById('menu-toggle');
const navLinks = document.getElementById('nav-links-menu');
if (menuToggle && navLinks) {
  menuToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    menuToggle.classList.toggle('open');
  });
  document.querySelectorAll('.nav-link, .nav-btn').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      menuToggle.classList.remove('open');
    });
  });
}

// ─── 3D CARD TILT ON HOVER (Optimized) ───
const isTouchDev = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
if (!isTouchDev) {
  document.querySelectorAll('.tool-card, .cap-card').forEach(card => {
    card.style.willChange = 'transform';
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      requestAnimationFrame(() => {
        card.style.transform = `perspective(1000px) rotateX(${y * -8}deg) rotateY(${x * 8}deg) translate3d(0, -8px, 0)`;
      });
    });
    card.addEventListener('mouseleave', () => {
      requestAnimationFrame(() => {
        card.style.transform = '';
      });
    });
  });
  
  // Magnetic buttons
  document.querySelectorAll('.hero-btn-primary, .hero-btn-secondary, .nav-btn, .cta-btn, .run-btn').forEach(btn => {
    btn.style.willChange = 'transform';
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      requestAnimationFrame(() => {
        btn.style.transform = `translate3d(${x * 0.25}px, ${y * 0.25}px, 0)`;
      });
    });
    btn.addEventListener('mouseleave', () => {
      requestAnimationFrame(() => {
        btn.style.transform = `translate3d(0px, 0px, 0)`;
      });
    });
  });
}
'''
    
    astro_file = f'''---
import Layout from '../layouts/Layout.astro';
import '../styles/global.css';
---

<Layout>
{body_content}

<script is:inline>
{clean_js}
</script>
</Layout>
'''
    open('src/pages/index.astro', 'w', encoding='utf-8').write(astro_file)
