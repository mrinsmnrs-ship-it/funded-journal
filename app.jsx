<!DOCTYPE html>
<html lang="id">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Aftermath Journey — Dashboard Trading</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;700&family=Inter:wght@400;500;600&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet">
<style>
  :root{
    --ink:#111111;
    --paper:#F5F6F1;
    --card:#FFFFFF;
    --profit:#17A672;
    --profit-tint:#DFF5EC;
    --loss:#E8483D;
    --loss-tint:#FCE4E2;
    --accent:#FFD23F;
    --muted:#767672;
    --line-soft:#E4E4DE;
    --border-w:1.5px;
    --radius:16px;
    --shadow:4px 4px 0 var(--ink);
    --shadow-sm:3px 3px 0 var(--ink);
  }
  body{ transition:background-color .2s ease, color .2s ease; }
  .card, .btn, select.acct-switch, .period-toggle{ transition:background-color .2s ease, border-color .2s ease, color .2s ease; }
  *{box-sizing:border-box; margin:0; padding:0;}
  body{
    background:var(--paper);
    color:var(--ink);
    font-family:'Inter', sans-serif;
    padding:20px;
    min-height:100vh;
  }
  .wrap{max-width:920px; margin:0 auto;}

  /* ---- Header ---- */
  header{
    display:flex; align-items:center; justify-content:space-between;
    flex-wrap:wrap; gap:14px;
    margin-bottom:22px;
  }
  .brand{
    display:flex; align-items:center; gap:10px;
  }
  .brand .mark{
    width:34px; height:34px; background:var(--ink); border-radius:8px;
    display:flex; align-items:center; justify-content:center;
    color:var(--paper); font-family:'Space Grotesk', sans-serif; font-weight:700; font-size:16px;
    transform:rotate(-4deg);
  }
  .brand h1{
    font-family:'Space Grotesk', sans-serif; font-size:22px; letter-spacing:-0.02em;
  }
  .header-actions{display:flex; align-items:center; gap:10px; flex-wrap:wrap;}

  select.acct-switch{
    appearance:none; -webkit-appearance:none;
    font-family:'Space Mono', monospace; font-size:13px; font-weight:700;
    background:var(--card); border:var(--border-w) solid var(--ink); border-radius:10px;
    padding:9px 34px 9px 14px; box-shadow:var(--shadow-sm);
    cursor:pointer; outline:none;
    background-image: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23111' stroke-width='3'><path d='M6 9l6 6 6-6'/></svg>");
    background-repeat:no-repeat; background-position:right 10px center; background-size:14px;
    transition:transform .1s ease, box-shadow .1s ease;
  }
  select.acct-switch:focus{ outline:none; border-color:var(--ink); }
  select.acct-switch::-moz-focus-inner{ border:0; }
  select.acct-switch:hover{ transform:translate(-2px,-2px); box-shadow:5px 5px 0 var(--ink); }
  select.acct-switch:active{ transform:translate(3px,3px); box-shadow:0 0 0 var(--ink); }
  .btn{
    font-family:'Space Grotesk', sans-serif; font-weight:700; font-size:13px;
    border:var(--border-w) solid var(--ink); border-radius:10px;
    padding:9px 16px; cursor:pointer; background:var(--card);
    box-shadow:var(--shadow-sm);
    transition:transform .1s ease, box-shadow .1s ease;
  }
  .btn:hover{ transform:translate(-2px,-2px); box-shadow:5px 5px 0 var(--ink); }
  .btn:active{ transform:translate(3px,3px); box-shadow:0 0 0 var(--ink); }
  .btn-accent{ background:var(--accent); }

  /* ---- Card base ---- */
  .card{
    background:var(--card);
    border:var(--border-w) solid var(--ink);
    border-radius:var(--radius);
    padding:20px;
    position:relative;
    overflow:hidden;
  }

  /* ---- Equity Hero ---- */
  .equity-card{ margin-bottom:18px; }
  .equity-top{
    display:flex; justify-content:space-between; align-items:flex-start;
    flex-wrap:wrap; gap:14px; margin-bottom:6px;
  }
  .equity-label{ font-size:12px; color:var(--ink); text-transform:uppercase; letter-spacing:.08em; font-weight:600; }
  .equity-value{ font-family:'Space Mono', monospace; font-size:34px; font-weight:700; line-height:1.1; margin-top:4px;}
  .delta-pill{
    display:inline-flex; align-items:center; gap:5px;
    font-family:'Space Mono', monospace; font-weight:700; font-size:13px;
    padding:5px 10px; border-radius:20px; border:var(--border-w) solid var(--ink);
    margin-top:8px;
  }
  .delta-up{ background:var(--profit-tint); color:var(--ink); }
  .delta-down{ background:var(--loss-tint); color:var(--ink); }

  .period-toggle{
    display:flex; gap:8px; height:fit-content;
  }
  .period-toggle button{
    font-family:'Space Mono', monospace; font-size:12px; font-weight:700;
    border:var(--border-w) solid var(--ink); border-radius:10px;
    background:var(--card); padding:8px 12px; cursor:pointer;
    box-shadow:var(--shadow-sm);
    transition:transform .1s ease, box-shadow .1s ease, background-color .12s ease;
  }
  .period-toggle button:hover:not(.active){ transform:translate(-2px,-2px); box-shadow:5px 5px 0 var(--ink); }
  .period-toggle button:active{ transform:translate(3px,3px); box-shadow:0 0 0 var(--ink); }
  .period-toggle button.active{ background:var(--ink); color:var(--paper); }

  .chart-wrap{ margin:14px -20px 0 -20px; }
  svg{ width:100%; height:170px; display:block; }

  /* ---- Metrics grid ---- */
  .metrics{
    display:grid; grid-template-columns:repeat(3, 1fr); gap:14px; margin-bottom:18px;
  }
  .metric-card{ padding:16px; }
  .metric-label{ font-size:11px; color:var(--ink); text-transform:uppercase; letter-spacing:.06em; font-weight:600; margin-bottom:8px; }
  .metric-value{ font-family:'Space Mono', monospace; font-size:22px; font-weight:700; color:var(--ink); }
  .metric-sub{ font-size:11px; color:var(--ink); margin-top:4px; font-family:'Space Mono', monospace; }
  .pos{ color:var(--ink); } .neg{ color:var(--ink); }

  /* ---- Trade history ---- */
  .history-card h2{
    font-family:'Space Grotesk', sans-serif; font-size:16px; margin-bottom:12px;
  }
  .table-wrap{ margin:0 -20px; }
  table{ width:100%; border-collapse:collapse; font-family:'Space Mono', monospace; font-size:12.5px; }
  thead tr{ background:var(--ink); }
  thead th{
    text-align:left; font-size:10.5px; text-transform:uppercase; letter-spacing:.05em;
    color:var(--card); font-weight:700; padding:9px 10px;
  }
  thead th:first-child{ padding-left:30px; }
  thead th:last-child{ padding-right:30px; }
  tbody tr:first-child td{ padding-top:14px; }
  tbody td{ padding:9px 8px; border-bottom:1px solid var(--line-soft); color:var(--ink); }
  tbody td:first-child{ padding-left:30px; }
  tbody td:last-child{ padding-right:30px; }
  tbody tr:last-child td{ border-bottom:none; }
  .tag{
    display:inline-block; font-size:10px; font-weight:700; padding:2px 7px; border-radius:6px;
    border:1px solid var(--ink); color:var(--ink);
  }
  .tag-buy{ background:var(--profit-tint); }
  .tag-sell{ background:var(--loss-tint); }
  .src-auto{ color:var(--ink); font-size:10.5px; }

  footer{ text-align:center; margin-top:20px; color:var(--ink); font-size:11.5px; font-family:'Space Mono', monospace; }

  @media (max-width:640px){
    .metrics{ grid-template-columns:repeat(2, 1fr); }
    .equity-value{ font-size:26px; }
    table{ font-size:11px; }
    thead th:nth-child(4), tbody td:nth-child(4){ display:none; }
  }

  /* ---- Connect Account modal ---- */
  .modal-overlay{
    position:fixed; inset:0; background:rgba(17,17,17,0.55);
    display:none; align-items:flex-end; justify-content:center; z-index:50;
    padding:0;
  }
  .modal-overlay.open{ display:flex; }
  .modal-card{
    background:var(--card); border:var(--border-w) solid var(--ink);
    border-radius:20px 20px 0 0; padding:22px; width:100%; max-width:480px;
    max-height:88vh; overflow-y:auto; position:relative;
  }
  @media (min-width:640px){
    .modal-overlay{ align-items:center; }
    .modal-card{ border-radius:var(--radius); }
  }
  .modal-head{ display:flex; align-items:center; justify-content:space-between; margin-bottom:4px; }
  .modal-head h2{ font-family:'Space Grotesk', sans-serif; font-size:18px; }
  .modal-close{
    width:32px; height:32px; padding:0; border-radius:50%;
    display:flex; align-items:center; justify-content:center; font-size:16px; line-height:1;
  }
  .modal-sub{ font-size:12px; color:var(--ink); opacity:.65; margin-bottom:18px; }

  .field{ margin-bottom:14px; }
  .field label{
    display:block; font-size:11px; text-transform:uppercase; letter-spacing:.06em;
    font-weight:600; margin-bottom:6px;
  }
  .field input{
    width:100%; font-family:'Space Mono', monospace; font-size:13.5px;
    border:var(--border-w) solid var(--ink); border-radius:10px; padding:11px 12px;
    background:var(--card); color:var(--ink); outline:none;
  }
  .field input:focus{ border-color:var(--ink); }
  .field-hint{ font-size:10.5px; opacity:.6; margin-top:5px; }

  .type-toggle{ display:flex; gap:8px; }
  .type-toggle button{
    flex:1; font-family:'Space Grotesk', sans-serif; font-weight:700; font-size:13px;
    border:var(--border-w) solid var(--ink); border-radius:10px; background:var(--card);
    padding:10px; cursor:pointer; box-shadow:var(--shadow-sm);
    transition:transform .1s ease, box-shadow .1s ease, background-color .12s ease;
  }
  .type-toggle button:hover:not(.active){ transform:translate(-2px,-2px); box-shadow:5px 5px 0 var(--ink); }
  .type-toggle button:active{ transform:translate(3px,3px); box-shadow:0 0 0 var(--ink); }
  .type-toggle button.active{ background:var(--ink); color:var(--paper); }

  .submit-btn{ width:100%; padding:13px; font-size:14px; margin-top:6px; text-align:center; }
  .security-note{
    display:flex; gap:8px; align-items:flex-start; margin-top:16px; padding:11px 12px;
    border:1px solid var(--line-soft); border-radius:10px; font-size:11px; opacity:.75; line-height:1.5;
  }
</style>
</head>
<body>
<div class="wrap">

  <header>
    <div class="brand">
      <div class="mark">A.</div>
      <h1>AFTRMTH JRNY</h1>
    </div>
    <div class="header-actions">
      <select class="acct-switch" id="acctSwitch"></select>
      <button class="btn btn-accent" id="connectBtn">+ Connect Account</button>
    </div>
  </header>

  <div class="card equity-card">
    <div class="equity-top">
      <div>
        <div class="equity-label" id="acctTypeLabel">Personal Account</div>
        <div class="equity-value" id="equityValue">$0.00</div>
        <div class="delta-pill" id="deltaPill">— 0.0%</div>
      </div>
      <div class="period-toggle" id="periodToggle">
        <button data-p="7">7D</button>
        <button data-p="30" class="active">30D</button>
        <button data-p="90">90D</button>
        <button data-p="365">ALL</button>
      </div>
    </div>
    <div class="chart-wrap">
      <svg id="equityChart" viewBox="0 0 800 180" preserveAspectRatio="none"></svg>
    </div>
  </div>

  <div class="metrics">
    <div class="card metric-card">
      <div class="metric-label">P/L Periode Ini</div>
      <div class="metric-value" id="mPL">$0</div>
      <div class="metric-sub" id="mPLsub">vs periode lalu</div>
    </div>
    <div class="card metric-card">
      <div class="metric-label">Win Rate</div>
      <div class="metric-value" id="mWinRate">0%</div>
      <div class="metric-sub" id="mWinCount">0W / 0L</div>
    </div>
    <div class="card metric-card">
      <div class="metric-label">Avg Win</div>
      <div class="metric-value" id="mAvgWin">$0</div>
      <div class="metric-sub">rata-rata profit</div>
    </div>
    <div class="card metric-card">
      <div class="metric-label">Avg Loss</div>
      <div class="metric-value" id="mAvgLoss">$0</div>
      <div class="metric-sub">rata-rata rugi</div>
    </div>
    <div class="card metric-card">
      <div class="metric-label">R:R Ratio</div>
      <div class="metric-value" id="mRR">—</div>
      <div class="metric-sub">risk : reward</div>
    </div>
    <div class="card metric-card">
      <div class="metric-label">Max Drawdown</div>
      <div class="metric-value" id="mDD">0%</div>
      <div class="metric-sub">titik terendah</div>
    </div>
  </div>

  <div class="card history-card">
    <h2>Riwayat Trade</h2>
    <div class="table-wrap">
    <table>
      <thead>
        <tr><th>Tanggal</th><th>Pair</th><th>Arah</th><th>Size</th><th>P/L</th><th>Src</th></tr>
      </thead>
      <tbody id="tradeRows"></tbody>
    </table>
    </div>
  </div>

  <footer>Data disinkronkan otomatis dari MetaApi &middot; Terakhir sync 2 menit lalu</footer>
</div>

<div class="modal-overlay" id="connectModal">
  <div class="modal-card">
    <div class="modal-head">
      <h2>Connect Account</h2>
      <button class="btn modal-close" id="modalClose" aria-label="Tutup">✕</button>
    </div>
    <div class="modal-sub">Hubungkan akun MT4/MT5 kamu lewat MetaApi. Sekali connect, data auto-sync.</div>

    <form id="connectForm">
      <div class="field">
        <label for="fNickname">Nama Akun</label>
        <input type="text" id="fNickname" placeholder="cth. FTMO Challenge #83" required>
      </div>

      <div class="field">
        <label>Tipe Akun</label>
        <div class="type-toggle" id="typeToggle">
          <button type="button" data-type="Funded" class="active">Funded</button>
          <button type="button" data-type="Personal">Personal</button>
        </div>
      </div>

      <div class="field">
        <label for="fAccountId">MetaApi Account ID</label>
        <input type="text" id="fAccountId" placeholder="cth. 8a2f9c1e-..." required>
      </div>

      <div class="field">
        <label for="fToken">API Token</label>
        <input type="password" id="fToken" placeholder="Token dari MetaApi dashboard" required>
        <div class="field-hint">Token dikirim langsung ke server, tidak pernah disimpan di browser.</div>
      </div>

      <button type="submit" class="btn btn-accent submit-btn">Connect &amp; Sync</button>
    </form>

    <div class="security-note">🔒 Token disimpan terenkripsi di server. Kamu bisa putuskan koneksi kapan saja.</div>
  </div>
</div>


<script>
// ---------- Mock data generation ----------
function seededRandom(seed){
  let s = seed;
  return function(){ s = (s*9301+49297) % 233280; return s/233280; };
}

function genAccount(id, name, type, startBalance, seed, winBias){
  const rand = seededRandom(seed);
  const days = 90;
  let bal = startBalance;
  const equity = [];
  const trades = [];
  const pairs = ['EURUSD','GBPUSD','XAUUSD','USDJPY','GBPJPY','NAS100'];
  const today = new Date();
  for(let i=days; i>=0; i--){
    const d = new Date(today); d.setDate(d.getDate()-i);
    const tradesToday = rand() > 0.6 ? Math.floor(rand()*3)+1 : 0;
    for(let t=0; t<tradesToday; t++){
      const isWin = rand() < winBias;
      const pl = isWin ? +(rand()*140+20).toFixed(2) : -(rand()*90+15).toFixed(2);
      bal += pl;
      trades.push({
        date: d.toISOString().slice(0,10),
        pair: pairs[Math.floor(rand()*pairs.length)],
        dir: rand()>0.5 ? 'BUY':'SELL',
        size: (rand()*2+0.1).toFixed(2),
        pl: pl,
        src: rand() > 0.15 ? 'auto' : 'manual'
      });
    }
    equity.push({date:d.toISOString().slice(0,10), balance: bal});
  }
  return {id, name, type, equity, trades: trades.reverse()};
}

const accounts = [
  genAccount('acc1','FTMO Challenge #82','Funded', 100000, 11, 0.52),
  genAccount('acc2','Personal — Exness','Personal', 5000, 47, 0.46),
  genAccount('acc3','Funded — The5ers','Funded', 25000, 93, 0.58),
];

let currentAcctId = accounts[0].id;
let currentPeriod = 30;

// ---------- Populate account switcher ----------
const acctSwitch = document.getElementById('acctSwitch');
accounts.forEach(a=>{
  const opt = document.createElement('option');
  opt.value = a.id; opt.textContent = `${a.name}`;
  acctSwitch.appendChild(opt);
});
acctSwitch.value = currentAcctId;
acctSwitch.addEventListener('change', e=>{
  currentAcctId = e.target.value;
  render();
});

document.getElementById('periodToggle').addEventListener('click', e=>{
  const btn = e.target.closest('button');
  if(!btn) return;
  currentPeriod = parseInt(btn.dataset.p);
  document.querySelectorAll('.period-toggle button').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  render();
});

document.getElementById('connectBtn').addEventListener('click', ()=>{
  document.getElementById('connectModal').classList.add('open');
});

const connectModal = document.getElementById('connectModal');
document.getElementById('modalClose').addEventListener('click', closeModal);
connectModal.addEventListener('click', (e)=>{ if(e.target === connectModal) closeModal(); });
function closeModal(){
  connectModal.classList.remove('open');
  document.getElementById('connectForm').reset();
  document.querySelectorAll('#typeToggle button').forEach(b=>b.classList.remove('active'));
  document.querySelector('#typeToggle button[data-type="Funded"]').classList.add('active');
  selectedType = 'Funded';
}

let selectedType = 'Funded';
document.getElementById('typeToggle').addEventListener('click', e=>{
  const btn = e.target.closest('button');
  if(!btn) return;
  document.querySelectorAll('#typeToggle button').forEach(b=>b.classList.remove('active'));
  btn.classList.add('active');
  selectedType = btn.dataset.type;
});

document.getElementById('connectForm').addEventListener('submit', e=>{
  e.preventDefault();
  const name = document.getElementById('fNickname').value.trim() || 'Akun Baru';
  const newId = 'acc' + (accounts.length + 1) + '_' + Date.now();
  const seed = Math.floor(Math.random()*900)+100;
  const startBal = selectedType === 'Funded' ? 100000 : 2000;
  const winBias = 0.45 + Math.random()*0.15;
  const newAcct = genAccount(newId, name, selectedType, startBal, seed, winBias);
  accounts.push(newAcct);

  const opt = document.createElement('option');
  opt.value = newAcct.id; opt.textContent = newAcct.name;
  acctSwitch.appendChild(opt);
  acctSwitch.value = newAcct.id;
  currentAcctId = newAcct.id;

  closeModal();
  render();
});

function fmtMoney(n){
  const sign = n < 0 ? '-' : '';
  return sign + '$' + Math.abs(n).toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2});
}
function fmtSigned(n){
  const sign = n < 0 ? '-' : '+';
  return sign + '$' + Math.abs(n).toLocaleString('en-US', {minimumFractionDigits:2, maximumFractionDigits:2});
}

function render(){
  const acct = accounts.find(a=>a.id===currentAcctId);
  document.getElementById('acctTypeLabel').textContent = `${acct.type} Account`;

  const slice = acct.equity.slice(-currentPeriod-1);
  const startBal = slice[0].balance;
  const endBal = slice[slice.length-1].balance;
  const delta = endBal - startBal;
  const deltaPct = (delta/startBal*100);

  document.getElementById('equityValue').textContent = fmtMoney(endBal);
  const pill = document.getElementById('deltaPill');
  pill.textContent = `${delta>=0?'▲':'▼'} ${fmtMoney(Math.abs(delta))} (${deltaPct.toFixed(1)}%)`;
  pill.className = 'delta-pill ' + (delta>=0 ? 'delta-up':'delta-down');

  // --- draw chart (black line, smooth curve, bleeds into card border) ---
  const svg = document.getElementById('equityChart');
  const rect = svg.getBoundingClientRect();
  const w = Math.max(rect.width, 100), h = 170, padTop = 18, padBottom = 16;
  svg.setAttribute('viewBox', `0 0 ${w} ${h}`);

  const vals = slice.map(p=>p.balance);
  const min = Math.min(...vals), max = Math.max(...vals);
  const range = (max-min) || 1;
  const stepX = w/(vals.length-1 || 1);
  const pts = vals.map((v,i)=>{
    const x = i*stepX;
    const y = (h-padBottom) - ((v-min)/range)*(h-padTop-padBottom);
    return [x,y];
  });

  function smoothPath(p){
    if(p.length < 3) return p.map((pt,i)=>(i===0?'M':'L')+pt[0].toFixed(1)+','+pt[1].toFixed(1)).join(' ');
    let d = `M${p[0][0].toFixed(1)},${p[0][1].toFixed(1)}`;
    for(let i=0; i<p.length-1; i++){
      const p0 = p[i-1] || p[i];
      const p1 = p[i];
      const p2 = p[i+1];
      const p3 = p[i+2] || p2;
      const c1x = p1[0] + (p2[0]-p0[0])/6;
      const c1y = p1[1] + (p2[1]-p0[1])/6;
      const c2x = p2[0] - (p3[0]-p1[0])/6;
      const c2y = p2[1] - (p3[1]-p1[1])/6;
      d += ` C${c1x.toFixed(1)},${c1y.toFixed(1)} ${c2x.toFixed(1)},${c2y.toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
    }
    return d;
  }

  const lineColor = getComputedStyle(document.documentElement).getPropertyValue('--ink').trim() || '#111111';
  const linePath = smoothPath(pts);

  svg.innerHTML = `
    <path d="${linePath}" fill="none" stroke="${lineColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"></path>
  `;

  // --- metrics ---
  const periodTrades = acct.trades.filter(t => {
    const d = new Date(t.date);
    const cutoff = new Date(); cutoff.setDate(cutoff.getDate()-currentPeriod);
    return d >= cutoff;
  });
  const wins = periodTrades.filter(t=>t.pl>0);
  const losses = periodTrades.filter(t=>t.pl<0);
  const totalPL = periodTrades.reduce((s,t)=>s+t.pl,0);
  const winRate = periodTrades.length ? (wins.length/periodTrades.length*100) : 0;
  const avgWin = wins.length ? wins.reduce((s,t)=>s+t.pl,0)/wins.length : 0;
  const avgLoss = losses.length ? losses.reduce((s,t)=>s+t.pl,0)/losses.length : 0;

  document.getElementById('mPL').textContent = fmtSigned(totalPL);
  document.getElementById('mPLsub').textContent = `${periodTrades.length} trade`;
  document.getElementById('mWinRate').textContent = winRate.toFixed(0)+'%';
  document.getElementById('mWinCount').textContent = `${wins.length}W / ${losses.length}L`;
  document.getElementById('mAvgWin').textContent = fmtSigned(avgWin);
  document.getElementById('mAvgLoss').textContent = fmtSigned(avgLoss);
  document.getElementById('mRR').textContent = avgLoss!==0 ? `1 : ${(Math.abs(avgWin/avgLoss)).toFixed(2)}` : '—';

  // max drawdown over slice
  let peak = vals[0], maxDD = 0;
  vals.forEach(v=>{ peak = Math.max(peak, v); maxDD = Math.max(maxDD, (peak-v)/peak*100); });
  document.getElementById('mDD').textContent = '-'+maxDD.toFixed(1)+'%';

  // --- trade table ---
  const rows = periodTrades.slice(-15).reverse().map(t=>`
    <tr>
      <td>${t.date}</td>
      <td>${t.pair}</td>
      <td><span class="tag ${t.dir==='BUY'?'tag-buy':'tag-sell'}">${t.dir}</span></td>
      <td>${t.size}</td>
      <td>${fmtSigned(t.pl)}</td>
      <td class="src-auto">${t.src}</td>
    </tr>
  `).join('');
  document.getElementById('tradeRows').innerHTML = rows || `<tr><td colspan="6" style="color:var(--ink); text-align:center; padding:20px;">Belum ada trade di periode ini.</td></tr>`;
}

render();
window.addEventListener('resize', render);
</script>
</body>
</html>
