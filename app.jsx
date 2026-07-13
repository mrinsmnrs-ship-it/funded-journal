import { useState } from "react";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar,
} from "recharts";
import {
  LayoutGrid, ListOrdered, Wallet, Zap, RefreshCw, CalendarClock,
  ArrowUpRight, ArrowDownRight, Check, ChevronDown, Search,
  ChevronLeft, ShieldCheck, PlugZap, Server, KeyRound, Hash,
  Lightbulb, Repeat, AlertTriangle, Clock, TrendingUp, TrendingDown,
  Bell, Info, Percent, Building2,
} from "lucide-react";

/* ---------- design tokens ---------- */
const C = {
  bg: "#0A0D13",
  surface: "#12161F",
  surfaceAlt: "#171C27",
  border: "#212736",
  hair: "#1A2029",
  text: "#E7E9ED",
  sub: "#6E7688",
  faint: "#414A5C",
  profit: "#34C795",
  profitSoft: "rgba(52,199,149,0.12)",
  loss: "#EF6461",
  lossSoft: "rgba(239,100,97,0.12)",
  accent: "#5B8DEF",
  accentSoft: "rgba(91,141,239,0.14)",
  warn: "#E0A458",
  warnSoft: "rgba(224,164,88,0.14)",
};
const FONT_UI = "'Inter', ui-sans-serif, system-ui, sans-serif";
const FONT_MONO = "'IBM Plex Mono', ui-monospace, 'SF Mono', monospace";

const donutColors = ["#5B8DEF", "#34C795", "#8B7CF6", "#E0A458", "#4A5568"];

/* ---------- mock data ---------- */
const equityData = [
  { d: 1, you: 0, sp: 0 }, { d: 3, you: 1.2, sp: 0.4 }, { d: 5, you: 0.8, sp: 0.6 },
  { d: 7, you: 2.6, sp: 1.1 }, { d: 9, you: 3.4, sp: 1.3 }, { d: 11, you: 2.9, sp: 1.5 },
  { d: 13, you: 4.8, sp: 2.0 }, { d: 15, you: 6.1, sp: 2.4 }, { d: 17, you: 5.5, sp: 2.6 },
  { d: 19, you: 7.4, sp: 3.0 }, { d: 21, you: 8.9, sp: 3.4 }, { d: 23, you: 8.1, sp: 3.6 },
  { d: 25, you: 10.2, sp: 4.1 }, { d: 27, you: 12.0, sp: 4.5 }, { d: 29, you: 11.1, sp: 4.8 },
  { d: 31, you: 13.6, sp: 5.2 },
];

const stats = [
  { label: "Win Rate", value: "64%" },
  { label: "Profit Factor", value: "1.85" },
  { label: "Avg R:R", value: "1:1.6" },
  { label: "Total Trade", value: "214" },
  { label: "Trade Terbaik", value: "+$482", positive: true },
  { label: "Max Drawdown", value: "-8.2%", positive: false },
];

const symbolData = [
  { name: "XAUUSD", value: 38, pnl: 4820 },
  { name: "EURUSD", value: 24, pnl: 1210 },
  { name: "GBPUSD", value: 18, pnl: -320 },
  { name: "US30", value: 12, pnl: 860 },
  { name: "BTCUSD", value: 8, pnl: 210 },
];
const mostProfitable = symbolData.reduce((a, b) => (b.pnl > a.pnl ? b : a));

const pnlDist = [
  { bucket: "<-200", count: 6, sign: "loss" },
  { bucket: "-200/-100", count: 14, sign: "loss" },
  { bucket: "-100/0", count: 22, sign: "loss" },
  { bucket: "0/100", count: 48, sign: "profit" },
  { bucket: "100/200", count: 31, sign: "profit" },
  { bucket: ">200", count: 17, sign: "profit" },
];

// July 2026 calendar — 1 Jul = Wednesday, today = 13 Jul
const calDays = [
  { day: 1, pnl: 120 }, { day: 2, pnl: -45 }, { day: 3, pnl: 210 },
  { day: 4, pnl: null, weekend: true }, { day: 5, pnl: null, weekend: true },
  { day: 6, pnl: 88 }, { day: 7, pnl: -120 }, { day: 8, pnl: 340 },
  { day: 9, pnl: 15 }, { day: 10, pnl: -60 },
  { day: 11, pnl: null, weekend: true }, { day: 12, pnl: null, weekend: true },
  { day: 13, pnl: 275, today: true },
  ...Array.from({ length: 18 }, (_, i) => ({ day: 14 + i, future: true })),
];
const leadingBlanks = 2; // Mon-Tue before 1 Jul belongs to June

const trades = [
  { symbol: "XAUUSD", side: "Buy", lot: 0.5, entry: 2412.3, exit: 2429.8, pnl: 245.5, date: "13 Jul", time: "09:14" },
  { symbol: "EURUSD", side: "Sell", lot: 1.0, entry: 1.0862, exit: 1.0841, pnl: 210.0, date: "12 Jul", time: "16:02" },
  { symbol: "GBPUSD", side: "Buy", lot: 0.8, entry: 1.2710, exit: 1.2689, pnl: -168.0, date: "12 Jul", time: "11:47" },
  { symbol: "US30", side: "Sell", lot: 0.3, entry: 39840, exit: 39705, pnl: 121.5, date: "11 Jul", time: "20:30" },
  { symbol: "XAUUSD", side: "Sell", lot: 0.5, entry: 2405.1, exit: 2411.9, pnl: -34.0, date: "10 Jul", time: "14:05" },
  { symbol: "BTCUSD", side: "Buy", lot: 0.05, entry: 61200, exit: 62480, pnl: 64.0, date: "9 Jul", time: "22:18" },
  { symbol: "EURUSD", side: "Buy", lot: 1.2, entry: 1.0821, exit: 1.0805, pnl: -192.0, date: "8 Jul", time: "08:52" },
];

const weekdayWinRate = [
  { day: "Sen", wr: 68 }, { day: "Sel", wr: 71 }, { day: "Rab", wr: 63 },
  { day: "Kam", wr: 66 }, { day: "Jum", wr: 38 },
];
const worstDay = weekdayWinRate.reduce((a, b) => (b.wr < a.wr ? b : a));

const disciplineScore = { current: 72, previous: 65 };

const weeklyBriefing = {
  range: "7 – 13 Jul 2026",
  n: 24,
  text:
    "Minggu ini tercatat 24 transaksi dengan win rate 58%, turun dari 64% pada minggu sebelumnya (n=31). Penurunan paling terlihat pada transaksi yang dibuka hari Jumat dan pada transaksi yang di-entry kurang dari 15 menit setelah kerugian. Volume trading naik 22% dibanding rata-rata 4 minggu terakhir, tanpa kenaikan win rate yang sepadan.",
};

const notifPreview = {
  time: "14:32",
  title: "Ringkasan Perilaku",
  body: "Terdeteksi 2 kerugian beruntun dalam 20 menit terakhir. Berdasarkan 90 hari histori, win rate pada kondisi serupa turun ke 41% (rata-rata 64%).",
};

const fundedAccount = {
  firm: "FTMO",
  phase: "Verification",
  size: 100000,
  currency: "USD",
  resetIn: "5j 18m",
  dailyLoss: { current: 1240, limit: 5000 },
  drawdown: { current: 3150, limit: 10000 },
  tradingDays: { current: 6, required: 4 },
  profitTarget: { current: 3820, target: 5000 },
  consistency: { limitPct: 30, largestDayProfit: 1450, totalProfit: 3820 },
};

const plans = [
  {
    id: "harian",
    icon: Zap,
    name: "Sync Harian",
    freq: "Sinkron 1x /hari",
    price: "Rp149rb",
    per: "/bulan",
    recommended: true,
    features: ["Sinkronisasi otomatis dari MT5 tiap hari", "Semua fitur dashboard & analitik", "Riwayat transaksi tanpa batas"],
  },
  {
    id: "mingguan",
    icon: RefreshCw,
    name: "Sync Mingguan",
    freq: "Sinkron 1x /minggu",
    price: "Rp79rb",
    per: "/bulan",
    recommended: false,
    features: ["Sinkronisasi otomatis dari MT5 tiap minggu", "Semua fitur dashboard & analitik", "Cocok untuk swing trader"],
  },
  {
    id: "bulanan",
    icon: CalendarClock,
    name: "Sync Bulanan",
    freq: "Sinkron 1x /bulan",
    price: "Rp39rb",
    per: "/bulan",
    recommended: false,
    features: ["Sinkronisasi otomatis dari MT5 tiap bulan", "Semua fitur dashboard & analitik", "Cocok untuk investor jangka panjang"],
  },
];

/* ---------- small building blocks ---------- */
function Card({ children, style }) {
  return (
    <div
      style={{
        background: C.surface,
        border: `1px solid ${C.border}`,
        borderRadius: 16,
        padding: 16,
        ...style,
      }}
    >
      {children}
    </div>
  );
}
function SectionTitle({ children, right }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
      <span style={{ fontSize: 13, fontWeight: 600, color: C.text, letterSpacing: 0.2 }}>{children}</span>
      {right}
    </div>
  );
}

/* ---------- Dashboard ---------- */
function Dashboard() {
  return (
    <div style={{ padding: "18px 16px 90px", display: "flex", flexDirection: "column", gap: 14 }}>
      {/* equity header */}
      <div>
        <div style={{ color: C.sub, fontSize: 12 }}>Total Ekuitas</div>
        <div style={{ display: "flex", alignItems: "baseline", gap: 8, marginTop: 2 }}>
          <span style={{ fontFamily: FONT_MONO, fontSize: 30, fontWeight: 600, color: C.text }}>
            $24,850.32
          </span>
          <span
            style={{
              fontFamily: FONT_MONO, fontSize: 12, fontWeight: 600, color: C.profit,
              background: C.profitSoft, padding: "2px 7px", borderRadius: 20,
              display: "flex", alignItems: "center", gap: 2,
            }}
          >
            <ArrowUpRight size={12} strokeWidth={2.5} /> 13.6%
          </span>
        </div>
      </div>

      {/* signature: equity curve */}
      <Card>
        <SectionTitle
          right={
            <div style={{ display: "flex", gap: 10, fontSize: 11, fontFamily: FONT_MONO }}>
              <span style={{ display: "flex", alignItems: "center", gap: 4, color: C.text }}>
                <span style={{ width: 7, height: 7, borderRadius: 99, background: C.accent, display: "inline-block" }} />
                Anda
              </span>
              <span style={{ display: "flex", alignItems: "center", gap: 4, color: C.sub }}>
                <span style={{ width: 7, height: 2, background: C.faint, display: "inline-block" }} />
                S&P 500
              </span>
            </div>
          }
        >
          Kurva Ekuitas
        </SectionTitle>
        <div style={{ height: 150, marginLeft: -16 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={equityData} margin={{ top: 4, right: 12, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="glow" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={C.accent} stopOpacity={0.35} />
                  <stop offset="100%" stopColor={C.accent} stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke={C.hair} strokeDasharray="2 4" vertical={false} />
              <XAxis dataKey="d" tick={{ fill: C.sub, fontSize: 10, fontFamily: FONT_MONO }} axisLine={false} tickLine={false} interval={4} />
              <YAxis hide domain={["dataMin - 1", "dataMax + 1"]} />
              <Tooltip
                contentStyle={{ background: C.surfaceAlt, border: `1px solid ${C.border}`, borderRadius: 10, fontFamily: FONT_MONO, fontSize: 11 }}
                labelStyle={{ color: C.sub }}
                itemStyle={{ color: C.text }}
              />
              <Line type="monotone" dataKey="sp" stroke={C.faint} strokeWidth={1.5} strokeDasharray="3 4" dot={false} />
              <Line type="monotone" dataKey="you" stroke={C.accent} strokeWidth={2.5} dot={false} fill="url(#glow)" />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* stats grid */}
      <Card>
        <SectionTitle>Ringkasan Performa</SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", rowGap: 14 }}>
          {stats.map((s) => (
            <div key={s.label}>
              <div
                style={{
                  fontFamily: FONT_MONO, fontSize: 15, fontWeight: 600,
                  color: s.positive === false ? C.loss : s.positive === true ? C.profit : C.text,
                }}
              >
                {s.value}
              </div>
              <div style={{ fontSize: 10.5, color: C.sub, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </Card>

      {/* symbol donut */}
      <Card>
        <SectionTitle>Simbol Ditradingkan</SectionTitle>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div style={{ width: 110, height: 110, flexShrink: 0 }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={symbolData} dataKey="value" innerRadius={34} outerRadius={52} paddingAngle={2} stroke="none">
                  {symbolData.map((_, i) => (
                    <Cell key={i} fill={donutColors[i % donutColors.length]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 7 }}>
            {symbolData.map((s, i) => (
              <div key={s.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 11.5 }}>
                <span style={{ display: "flex", alignItems: "center", gap: 6, color: C.text }}>
                  <span style={{ width: 7, height: 7, borderRadius: 99, background: donutColors[i], display: "inline-block" }} />
                  {s.name}
                  {s.name === mostProfitable.name && (
                    <span style={{ fontSize: 9, color: C.profit, background: C.profitSoft, padding: "1px 5px", borderRadius: 6, fontFamily: FONT_MONO }}>
                      TERUNTUNG
                    </span>
                  )}
                </span>
                <span style={{ fontFamily: FONT_MONO, color: C.sub }}>{s.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* P&L distribution */}
      <Card>
        <SectionTitle>Distribusi P&L</SectionTitle>
        <div style={{ height: 120 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={pnlDist} margin={{ top: 4, right: 4, bottom: 0, left: -24 }}>
              <XAxis dataKey="bucket" tick={{ fill: C.sub, fontSize: 8.5, fontFamily: FONT_MONO }} axisLine={false} tickLine={false} />
              <YAxis hide />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {pnlDist.map((d, i) => (
                  <Cell key={i} fill={d.sign === "profit" ? C.profit : C.loss} fillOpacity={0.85} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* calendar heatmap */}
      <Card>
        <SectionTitle right={<span style={{ fontSize: 11, color: C.sub, fontFamily: FONT_MONO }}>Juli 2026</span>}>
          Kalender Trading
        </SectionTitle>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 5, marginBottom: 6 }}>
          {["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map((d) => (
            <div key={d} style={{ textAlign: "center", fontSize: 9, color: C.sub }}>{d}</div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 5 }}>
          {Array.from({ length: leadingBlanks }).map((_, i) => <div key={"b" + i} />)}
          {calDays.map((c) => {
            let bg = "transparent", border = C.hair, color = C.faint, borderStyle = "solid";
            if (c.future) { borderStyle = "dashed"; }
            else if (c.weekend) { bg = C.surfaceAlt; }
            else if (c.pnl != null) {
              const isProfit = c.pnl >= 0;
              const mag = Math.min(Math.abs(c.pnl) / 350, 1);
              bg = isProfit ? C.profit : C.loss;
              border = bg;
              color = "#0A0D13";
              return (
                <div key={c.day} style={{
                  aspectRatio: "1", borderRadius: 7, background: bg, opacity: 0.35 + mag * 0.65,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: FONT_MONO, fontSize: 9.5, fontWeight: 600, color: "#0A0D13",
                  border: c.today ? `1.5px solid ${C.text}` : "none",
                }}>
                  {c.day}
                </div>
              );
            }
            return (
              <div key={c.day} style={{
                aspectRatio: "1", borderRadius: 7, background: bg, border: `1px dashed ${c.future ? C.hair : "transparent"}`,
                display: "flex", alignItems: "center", justifyContent: "center", fontFamily: FONT_MONO, fontSize: 9.5, color: C.faint,
              }}>
                {c.day}
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}

/* ---------- History ---------- */
function HistoryScreen() {
  const [filter, setFilter] = useState("Semua");
  const filtered = trades.filter((t) =>
    filter === "Semua" ? true : filter === "Profit" ? t.pnl > 0 : t.pnl < 0
  );
  return (
    <div style={{ padding: "18px 16px 90px" }}>
      <div style={{ fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 4 }}>Riwayat Transaksi</div>
      <div style={{ color: C.sub, fontSize: 12, marginBottom: 14 }}>{trades.length} transaksi tersinkron dari MT5</div>

      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        {["Semua", "Profit", "Rugi"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              fontFamily: FONT_UI, fontSize: 12, padding: "6px 14px", borderRadius: 20,
              border: `1px solid ${filter === f ? C.accent : C.border}`,
              background: filter === f ? C.accentSoft : "transparent",
              color: filter === f ? C.accent : C.sub, fontWeight: 600,
            }}
          >
            {f}
          </button>
        ))}
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {filtered.map((t, i) => (
          <div key={i} style={{
            background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: "12px 14px",
            display: "flex", alignItems: "center", gap: 12,
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10, flexShrink: 0,
              background: t.pnl >= 0 ? C.profitSoft : C.lossSoft,
              display: "flex", alignItems: "center", justifyContent: "center",
            }}>
              {t.pnl >= 0
                ? <ArrowUpRight size={17} color={C.profit} strokeWidth={2.5} />
                : <ArrowDownRight size={17} color={C.loss} strokeWidth={2.5} />}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ fontSize: 13.5, fontWeight: 600, color: C.text }}>{t.symbol}</span>
                <span style={{
                  fontSize: 9.5, fontFamily: FONT_MONO, padding: "1px 6px", borderRadius: 5,
                  color: t.side === "Buy" ? C.accent : "#C77DFF", background: t.side === "Buy" ? C.accentSoft : "rgba(199,125,255,0.12)",
                }}>
                  {t.side.toUpperCase()}
                </span>
              </div>
              <div style={{ fontSize: 11, color: C.sub, marginTop: 2, fontFamily: FONT_MONO }}>
                {t.lot} lot · {t.entry} → {t.exit}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontFamily: FONT_MONO, fontSize: 13.5, fontWeight: 600, color: t.pnl >= 0 ? C.profit : C.loss }}>
                {t.pnl >= 0 ? "+" : ""}{t.pnl.toFixed(2)}
              </div>
              <div style={{ fontSize: 10, color: C.sub, marginTop: 2 }}>{t.date} · {t.time}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------- Insight Perilaku (behavioral analytics — the differentiator) ---------- */
function MiniBarCompare({ items }) {
  const max = Math.max(...items.map((i) => i.value));
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 10 }}>
      {items.map((it) => (
        <div key={it.label}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 10.5, color: C.sub, marginBottom: 3 }}>
            <span>{it.label}</span>
            <span style={{ fontFamily: FONT_MONO, color: it.color }}>{it.display}</span>
          </div>
          <div style={{ height: 6, borderRadius: 4, background: C.surfaceAlt, overflow: "hidden" }}>
            <div style={{ width: `${(it.value / max) * 100}%`, height: "100%", background: it.color, borderRadius: 4 }} />
          </div>
        </div>
      ))}
    </div>
  );
}

function TrendBadge({ direction, label }) {
  // direction: 'improving' | 'worsening' — objective wording, no praise/blame
  const isImproving = direction === "improving";
  const color = isImproving ? C.profit : C.loss;
  const Icon = isImproving ? TrendingUp : TrendingDown;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10.5, fontWeight: 600,
      color, background: isImproving ? C.profitSoft : C.lossSoft, padding: "3px 8px", borderRadius: 20, fontFamily: FONT_MONO,
    }}>
      <Icon size={11} strokeWidth={2.5} />
      {label}
    </span>
  );
}

function Switch({ on, onToggle }) {
  return (
    <button
      onClick={onToggle}
      style={{
        width: 38, height: 22, borderRadius: 20, background: on ? C.accent : C.surfaceAlt,
        border: `1px solid ${on ? C.accent : C.border}`, position: "relative", flexShrink: 0,
      }}
    >
      <span style={{
        position: "absolute", top: 1.5, left: on ? 17 : 2, width: 17, height: 17, borderRadius: 99,
        background: on ? "#0A0D13" : C.sub, transition: "left 0.15s ease",
      }} />
    </button>
  );
}

function InsightCard({ icon: Icon, tag, title, trend, sample, children, action, active, onToggle }) {
  return (
    <Card>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 9, background: C.warnSoft,
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <Icon size={15} color={C.warn} />
          </div>
          <span style={{
            fontSize: 9.5, fontWeight: 700, color: C.warn, background: C.warnSoft,
            padding: "2px 7px", borderRadius: 6, fontFamily: FONT_MONO, letterSpacing: 0.3,
          }}>
            {tag}
          </span>
        </div>
        {trend && <TrendBadge direction={trend.direction} label={trend.label} />}
      </div>

      <div style={{ fontSize: 13.5, fontWeight: 700, color: C.text, marginBottom: 4 }}>{title}</div>
      {children}

      {action && (
        <div style={{
          marginTop: 12, paddingTop: 12, borderTop: `1px solid ${C.hair}`,
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 11.5, color: C.text, fontWeight: 600 }}>{action}</div>
            {active && <div style={{ fontSize: 10, color: C.sub, marginTop: 2 }}>Diikuti pada 4 dari 5 kesempatan minggu ini</div>}
          </div>
          <Switch on={active} onToggle={onToggle} />
        </div>
      )}

      <div style={{ fontSize: 9.5, color: C.faint, marginTop: 10, fontFamily: FONT_MONO }}>
        Berdasarkan {sample} transaksi · 90 hari terakhir
      </div>
    </Card>
  );
}

function InsightScreen() {
  const [rules, setRules] = useState({ revenge: true, overtrade: false, weekday: false });
  const toggle = (k) => setRules((r) => ({ ...r, [k]: !r[k] }));

  return (
    <div style={{ padding: "18px 16px 90px", display: "flex", flexDirection: "column", gap: 14 }}>
      <div>
        <div style={{ fontSize: 20, fontWeight: 700, color: C.text }}>Insight Perilaku</div>
        <div style={{ color: C.sub, fontSize: 12, marginTop: 2, lineHeight: 1.5 }}>
          Korelasi statistik antara kondisi trading dan hasilmu — bukan saran finansial, hanya pola dari data historismu sendiri.
        </div>
      </div>

      {/* weekly briefing — analyst-style narrative summary */}
      <Card style={{ background: C.surfaceAlt }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span style={{ fontSize: 12, fontWeight: 700, color: C.text }}>Ringkasan Mingguan</span>
          <span style={{ fontSize: 10.5, color: C.sub, fontFamily: FONT_MONO }}>{weeklyBriefing.range}</span>
        </div>
        <div style={{ fontSize: 12, color: C.text, lineHeight: 1.6 }}>{weeklyBriefing.text}</div>
      </Card>

      {/* discipline score — composite index, not a game badge */}
      <Card>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: C.text }}>Skor Disiplin</div>
            <div style={{ fontSize: 10.5, color: C.sub, marginTop: 2, maxWidth: 200, lineHeight: 1.5 }}>
              Indeks kepatuhan terhadap pola yang teridentifikasi sebagai risiko pada akunmu.
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontFamily: FONT_MONO, fontSize: 26, fontWeight: 700, color: C.text }}>
              {disciplineScore.current}
            </div>
            <TrendBadge
              direction="improving"
              label={`+${disciplineScore.current - disciplineScore.previous} vs minggu lalu`}
            />
          </div>
        </div>
      </Card>

      <InsightCard
        icon={Repeat}
        tag="REVENGE TRADING"
        title="Entry berikutnya lebih cepat setelah rugi"
        trend={{ direction: "worsening", label: "-3pp vs minggu lalu" }}
        sample="n=58"
        action="Jeda otomatis 20 menit setelah kerugian"
        active={rules.revenge}
        onToggle={() => toggle("revenge")}
      >
        <div style={{ fontSize: 11.5, color: C.sub, lineHeight: 1.5 }}>
          Jeda rata-rata sebelum entry berikutnya berbeda tergantung hasil transaksi sebelumnya.
        </div>
        <MiniBarCompare
          items={[
            { label: "Setelah rugi", value: 12, display: "12 menit", color: C.loss },
            { label: "Setelah profit", value: 47, display: "47 menit", color: C.profit },
          ]}
        />
        <div style={{ fontSize: 11, color: C.text, marginTop: 10, background: C.surfaceAlt, borderRadius: 8, padding: "8px 10px" }}>
          Transaksi yang dibuka &lt;15 menit setelah rugi memiliki win rate <b style={{ color: C.loss }}>41%</b>, dibanding rata-rata keseluruhan <b style={{ color: C.profit }}>64%</b>.
        </div>
      </InsightCard>

      <InsightCard
        icon={AlertTriangle}
        tag="OVERTRADING"
        title="Frekuensi transaksi naik setelah rugi beruntun"
        trend={{ direction: "improving", label: "+6pp vs minggu lalu" }}
        sample="n=19"
        action="Notifikasi setelah 2x kerugian beruntun"
        active={rules.overtrade}
        onToggle={() => toggle("overtrade")}
      >
        <div style={{ fontSize: 11.5, color: C.sub, lineHeight: 1.5, marginBottom: 10 }}>
          Dibandingkan dengan aktivitas normal, kondisi berikut teramati dalam 1 jam setelah 2 kerugian beruntun.
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <div style={{ flex: 1, background: C.surfaceAlt, borderRadius: 10, padding: "10px 12px" }}>
            <div style={{ fontFamily: FONT_MONO, fontSize: 16, fontWeight: 700, color: C.warn }}>+65%</div>
            <div style={{ fontSize: 10, color: C.sub, marginTop: 2 }}>jumlah transaksi</div>
          </div>
          <div style={{ flex: 1, background: C.surfaceAlt, borderRadius: 10, padding: "10px 12px" }}>
            <div style={{ fontFamily: FONT_MONO, fontSize: 16, fontWeight: 700, color: C.warn }}>+40%</div>
            <div style={{ fontSize: 10, color: C.sub, marginTop: 2 }}>ukuran lot</div>
          </div>
        </div>
      </InsightCard>

      <InsightCard
        icon={Clock}
        tag="POLA MINGGUAN"
        title="Win rate hari Jumat berada di bawah rata-rata"
        trend={{ direction: "worsening", label: "-9pp vs minggu lalu" }}
        sample="n=42"
        action="Kurangi ukuran posisi 50% tiap Jumat"
        active={rules.weekday}
        onToggle={() => toggle("weekday")}
      >
        <div style={{ height: 100, marginTop: 4, marginLeft: -16 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weekdayWinRate} margin={{ top: 4, right: 12, bottom: 0, left: 0 }}>
              <XAxis dataKey="day" tick={{ fill: C.sub, fontSize: 10, fontFamily: FONT_MONO }} axisLine={false} tickLine={false} />
              <YAxis hide domain={[0, 100]} />
              <Bar dataKey="wr" radius={[4, 4, 0, 0]}>
                {weekdayWinRate.map((d, i) => (
                  <Cell key={i} fill={d.day === worstDay.day ? C.warn : C.accent} fillOpacity={d.day === worstDay.day ? 1 : 0.55} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div style={{ fontSize: 11, color: C.text, marginTop: 6, background: C.surfaceAlt, borderRadius: 8, padding: "8px 10px" }}>
          Win rate hari {worstDay.day} tercatat <b style={{ color: C.warn }}>{worstDay.wr}%</b>, dibanding rata-rata hari kerja lainnya.
        </div>
      </InsightCard>

      {/* proactive notification preview */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
          <Bell size={13} color={C.sub} />
          <span style={{ fontSize: 11.5, fontWeight: 600, color: C.sub }}>Contoh notifikasi proaktif</span>
        </div>
        <div style={{
          background: "rgba(255,255,255,0.06)", backdropFilter: "blur(6px)", border: `1px solid ${C.border}`,
          borderRadius: 16, padding: 12, display: "flex", gap: 10,
        }}>
          <div style={{
            width: 32, height: 32, borderRadius: 8, background: C.warn, flexShrink: 0,
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <Bell size={16} color="#0A0D13" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 11.5, fontWeight: 700, color: C.text }}>{notifPreview.title}</span>
              <span style={{ fontSize: 10, color: C.sub, fontFamily: FONT_MONO }}>{notifPreview.time}</span>
            </div>
            <div style={{ fontSize: 11, color: C.sub, marginTop: 3, lineHeight: 1.45 }}>{notifPreview.body}</div>
          </div>
        </div>
      </div>

      {/* objective disclaimer */}
      <div style={{ display: "flex", gap: 8, padding: "2px 2px 0" }}>
        <Info size={13} color={C.faint} style={{ flexShrink: 0, marginTop: 1 }} />
        <span style={{ fontSize: 10, color: C.faint, lineHeight: 1.5 }}>
          Insight menunjukkan korelasi, bukan sebab-akibat, dan tidak menjamin hasil trading di masa depan. Bukan nasihat finansial.
        </span>
      </div>
    </div>
  );
}

/* ---------- Kepatuhan Akun Funded (prop-firm rule compliance — real, non-gimmick value) ---------- */
function statusColor(pct) {
  if (pct >= 90) return C.loss;
  if (pct >= 70) return C.warn;
  return C.profit;
}

function RuleBar({ label, current, limit, currency = "$", note, statusOverride }) {
  const pct = Math.min((current / limit) * 100, 100);
  const color = statusOverride || statusColor(pct);
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 5 }}>
        <span style={{ fontSize: 12, color: C.text, fontWeight: 600 }}>{label}</span>
        <span style={{ fontFamily: FONT_MONO, fontSize: 11.5, color }}>
          {currency}{current.toLocaleString("en-US")} / {currency}{limit.toLocaleString("en-US")}
        </span>
      </div>
      <div style={{ height: 7, borderRadius: 5, background: C.surfaceAlt, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 5 }} />
      </div>
      {note && <div style={{ fontSize: 10.5, color: C.sub, marginTop: 4 }}>{note}</div>}
    </div>
  );
}

function ComplianceScreen() {
  const dailyPct = (fundedAccount.dailyLoss.current / fundedAccount.dailyLoss.limit) * 100;
  const ddPct = (fundedAccount.drawdown.current / fundedAccount.drawdown.limit) * 100;
  const targetPct = (fundedAccount.profitTarget.current / fundedAccount.profitTarget.target) * 100;
  const consistencyPct = (fundedAccount.consistency.largestDayProfit / fundedAccount.consistency.totalProfit) * 100;
  const consistencyBreach = consistencyPct > fundedAccount.consistency.limitPct;
  const daysMet = fundedAccount.tradingDays.current >= fundedAccount.tradingDays.required;

  const anyWarning = dailyPct >= 70 || ddPct >= 70 || consistencyBreach;

  return (
    <div style={{ padding: "18px 16px 90px", display: "flex", flexDirection: "column", gap: 14 }}>
      <div>
        <div style={{ fontSize: 20, fontWeight: 700, color: C.text }}>Kepatuhan Akun Funded</div>
        <div style={{ color: C.sub, fontSize: 12, marginTop: 2, lineHeight: 1.5 }}>
          Pelacakan otomatis terhadap aturan akun funded — dihitung real-time dari data yang tersinkron via MT5.
        </div>
      </div>

      {/* account identity */}
      <Card style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{fundedAccount.firm}</div>
          <div style={{ fontSize: 11, color: C.sub, marginTop: 1 }}>
            {fundedAccount.phase} · ${fundedAccount.size.toLocaleString("en-US")}
          </div>
        </div>
        <div style={{
          fontSize: 10, fontFamily: FONT_MONO, color: C.sub, background: C.surfaceAlt,
          padding: "5px 10px", borderRadius: 8, textAlign: "center",
        }}>
          Reset harian<br /><span style={{ color: C.text }}>{fundedAccount.resetIn}</span>
        </div>
      </Card>

      {/* overall status */}
      <div style={{
        display: "flex", alignItems: "center", gap: 9,
        background: anyWarning ? C.warnSoft : C.profitSoft,
        border: `1px solid ${anyWarning ? C.warn : C.profit}`, borderRadius: 12, padding: 12,
      }}>
        {anyWarning
          ? <AlertTriangle size={16} color={C.warn} style={{ flexShrink: 0 }} />
          : <ShieldCheck size={16} color={C.profit} style={{ flexShrink: 0 }} />}
        <span style={{ fontSize: 11.5, color: C.text }}>
          {anyWarning
            ? "1 aturan mendekati atau melewati batas yang diizinkan."
            : "Semua aturan akun saat ini dalam batas aman."}
        </span>
      </div>

      <Card>
        <SectionTitle>Batas Risiko</SectionTitle>
        <RuleBar
          label="Batas Rugi Harian"
          current={fundedAccount.dailyLoss.current}
          limit={fundedAccount.dailyLoss.limit}
          note={`Sisa buffer $${(fundedAccount.dailyLoss.limit - fundedAccount.dailyLoss.current).toLocaleString("en-US")} sebelum batas harian tercapai.`}
        />
        <RuleBar
          label="Max Drawdown"
          current={fundedAccount.drawdown.current}
          limit={fundedAccount.drawdown.limit}
          note={`Sisa buffer $${(fundedAccount.drawdown.limit - fundedAccount.drawdown.current).toLocaleString("en-US")} dari batas trailing drawdown.`}
        />
      </Card>

      <Card>
        <SectionTitle>Target &amp; Syarat</SectionTitle>
        <RuleBar
          label="Target Profit"
          current={fundedAccount.profitTarget.current}
          limit={fundedAccount.profitTarget.target}
          statusOverride={C.accent}
          note={`${targetPct.toFixed(1)}% dari target tercapai.`}
        />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 2 }}>
          <span style={{ fontSize: 12, color: C.text, fontWeight: 600 }}>Minimum Hari Trading</span>
          <span style={{
            display: "flex", alignItems: "center", gap: 5, fontFamily: FONT_MONO, fontSize: 11.5,
            color: daysMet ? C.profit : C.sub,
          }}>
            {daysMet && <Check size={13} strokeWidth={3} />}
            {fundedAccount.tradingDays.current} / {fundedAccount.tradingDays.required} hari
          </span>
        </div>
      </Card>

      <Card style={consistencyBreach ? { border: `1px solid ${C.loss}` } : undefined}>
        <SectionTitle
          right={
            <span style={{
              fontSize: 9.5, fontWeight: 700, fontFamily: FONT_MONO, padding: "2px 7px", borderRadius: 6,
              color: consistencyBreach ? C.loss : C.profit,
              background: consistencyBreach ? C.lossSoft : C.profitSoft,
            }}>
              {consistencyBreach ? "MELANGGAR" : "AMAN"}
            </span>
          }
        >
          Aturan Konsistensi
        </SectionTitle>
        <div style={{ fontSize: 11.5, color: C.sub, lineHeight: 1.5, marginBottom: 8 }}>
          Profit dari satu hari tidak boleh melebihi {fundedAccount.consistency.limitPct}% dari total profit akun.
        </div>
        <RuleBar
          label="Profit hari terbesar"
          current={fundedAccount.consistency.largestDayProfit}
          limit={fundedAccount.consistency.totalProfit}
          statusOverride={consistencyBreach ? C.loss : C.profit}
          note={`${consistencyPct.toFixed(1)}% dari total profit — batas ${fundedAccount.consistency.limitPct}%.`}
        />
        {consistencyBreach && (
          <div style={{ fontSize: 11, color: C.text, background: C.lossSoft, borderRadius: 8, padding: "8px 10px" }}>
            Satu hari profit kamu melebihi ambang konsistensi. Sebagian firm menahan payout sampai rasio ini diperbaiki dengan hari profit tambahan yang lebih merata.
          </div>
        )}
      </Card>

      <div style={{ display: "flex", gap: 8, padding: "2px 2px 0" }}>
        <Info size={13} color={C.faint} style={{ flexShrink: 0, marginTop: 1 }} />
        <span style={{ fontSize: 10, color: C.faint, lineHeight: 1.5 }}>
          Aturan dan ambang batas bervariasi tergantung firm dan jenis akun. Angka di atas dihitung berdasarkan konfigurasi yang kamu masukkan saat menghubungkan akun, dan sebaiknya dicocokkan dengan ketentuan resmi firm-mu.
        </span>
      </div>
    </div>
  );
}

/* ---------- Subscription ---------- */
function SubscriptionScreen({ onContinue }) {
  const [selected, setSelected] = useState("harian");
  return (
    <div style={{ padding: "18px 16px 90px" }}>
      <div style={{ fontSize: 20, fontWeight: 700, color: C.text, marginBottom: 4 }}>Paket Sinkronisasi</div>
      <div style={{ color: C.sub, fontSize: 12, marginBottom: 16, lineHeight: 1.5 }}>
        Pilih seberapa sering data trading dari akun MetaTrader 5 kamu disinkronkan secara otomatis.
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {plans.map((p) => {
          const active = selected === p.id;
          const Icon = p.icon;
          return (
            <button
              key={p.id}
              onClick={() => setSelected(p.id)}
              style={{
                textAlign: "left", borderRadius: 16, padding: 16, position: "relative",
                background: active ? C.accentSoft : C.surface,
                border: `1.5px solid ${active ? C.accent : C.border}`,
              }}
            >
              {p.recommended && (
                <span style={{
                  position: "absolute", top: -9, left: 14, background: C.accent, color: "#0A0D13",
                  fontSize: 9.5, fontWeight: 700, padding: "2px 8px", borderRadius: 20, fontFamily: FONT_UI,
                }}>
                  DIREKOMENDASIKAN
                </span>
              )}
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 40, height: 40, borderRadius: 11, background: active ? "rgba(91,141,239,0.2)" : C.surfaceAlt,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
                }}>
                  <Icon size={19} color={active ? C.accent : C.sub} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 14.5, fontWeight: 700, color: C.text }}>{p.name}</div>
                  <div style={{ fontSize: 11, color: C.sub, marginTop: 1 }}>{p.freq}</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div style={{ fontFamily: FONT_MONO, fontSize: 15, fontWeight: 700, color: C.text }}>{p.price}</div>
                  <div style={{ fontSize: 10, color: C.sub }}>{p.per}</div>
                </div>
              </div>
              <div style={{ marginTop: 12, display: "flex", flexDirection: "column", gap: 6 }}>
                {p.features.map((f) => (
                  <div key={f} style={{ display: "flex", alignItems: "flex-start", gap: 7, fontSize: 11.5, color: C.text }}>
                    <Check size={13} color={C.profit} strokeWidth={3} style={{ marginTop: 1.5, flexShrink: 0 }} />
                    {f}
                  </div>
                ))}
              </div>
            </button>
          );
        })}
      </div>

      <button
        onClick={onContinue}
        style={{
          width: "100%", marginTop: 18, background: C.accent, color: "#0A0D13", fontWeight: 700,
          fontSize: 14, padding: "13px 0", borderRadius: 14, fontFamily: FONT_UI,
        }}
      >
        Lanjutkan
      </button>
      <div style={{ textAlign: "center", fontSize: 10.5, color: C.sub, marginTop: 10 }}>
        Bisa upgrade, downgrade, atau batal kapan saja.
      </div>
    </div>
  );
}

/* ---------- Connect MT5 ---------- */
function InputField({ icon: Icon, label, placeholder, type = "text", value, onChange }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ fontSize: 11.5, color: C.sub, marginBottom: 6 }}>{label}</div>
      <div style={{
        display: "flex", alignItems: "center", gap: 9, background: C.surfaceAlt,
        border: `1px solid ${C.border}`, borderRadius: 12, padding: "11px 13px",
      }}>
        <Icon size={16} color={C.sub} />
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          style={{
            background: "transparent", border: "none", outline: "none", flex: 1,
            color: C.text, fontFamily: FONT_MONO, fontSize: 13,
          }}
        />
      </div>
    </div>
  );
}

function Chip({ active, onClick, children }) {
  return (
    <button
      onClick={onClick}
      style={{
        fontSize: 11.5, fontWeight: 600, padding: "7px 12px", borderRadius: 10,
        border: `1px solid ${active ? C.accent : C.border}`,
        background: active ? C.accentSoft : C.surfaceAlt,
        color: active ? C.accent : C.sub,
      }}
    >
      {children}
    </button>
  );
}

function RuleInput({ label, value, onChange, suffix = "%" }) {
  return (
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 10.5, color: C.sub, marginBottom: 5 }}>{label}</div>
      <div style={{
        display: "flex", alignItems: "center", gap: 6, background: C.surfaceAlt,
        border: `1px solid ${C.border}`, borderRadius: 10, padding: "9px 11px",
      }}>
        <input
          type="number"
          value={value}
          onChange={onChange}
          style={{ background: "transparent", border: "none", outline: "none", width: "100%", color: C.text, fontFamily: FONT_MONO, fontSize: 13 }}
        />
        <span style={{ fontSize: 11, color: C.sub }}>{suffix}</span>
      </div>
    </div>
  );
}

function ConnectMT5Screen({ onBack, onFinish }) {
  const [step, setStep] = useState(1); // 1: kredensial, 2: firm & aturan, 3: sukses
  const [account, setAccount] = useState("");
  const [server, setServer] = useState("");
  const [password, setPassword] = useState("");
  const [firm, setFirm] = useState("FTMO");
  const [phase, setPhase] = useState("Challenge");
  const [dailyLossPct, setDailyLossPct] = useState("5");
  const [maxDdPct, setMaxDdPct] = useState("10");
  const [profitTargetPct, setProfitTargetPct] = useState("10");
  const [minDays, setMinDays] = useState("4");

  const canConnect = account.trim() && server.trim() && password.trim();

  if (step === 3) {
    return (
      <div style={{ padding: "18px 16px 40px", display: "flex", flexDirection: "column", height: "100%" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 24 }}>
          <button onClick={onBack} style={{ color: C.sub }}><ChevronLeft size={20} /></button>
          <div style={{ fontSize: 16, fontWeight: 700, color: C.text }}>Akun MT5</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "20px 0" }}>
          <div style={{
            width: 64, height: 64, borderRadius: 99, background: C.profitSoft,
            display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 14,
          }}>
            <ShieldCheck size={30} color={C.profit} />
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: C.text }}>Akun berhasil terhubung</div>
          <div style={{ fontSize: 12, color: C.sub, marginTop: 4, textAlign: "center" }}>
            Aturan {firm} akan dipantau otomatis dari data yang tersinkron
          </div>
        </div>

        <Card style={{ marginTop: 10 }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, padding: "6px 0" }}>
            <span style={{ color: C.sub }}>Nomor Akun</span>
            <span style={{ color: C.text, fontFamily: FONT_MONO }}>{account}</span>
          </div>
          <div style={{ height: 1, background: C.hair }} />
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: 12.5, padding: "10px 0 6px" }}>
            <span style={{ color: C.sub }}>Firm / Fase</span>
            <span style={{ color: C.text, fontFamily: FONT_MONO }}>{firm} · {phase}</span>
          </div>
          <div style={{ height: 1, background: C.hair }} />
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 12.5, padding: "10px 0 0" }}>
            <span style={{ color: C.sub }}>Status Sync</span>
            <span style={{ display: "flex", alignItems: "center", gap: 5, color: C.profit, fontFamily: FONT_MONO, fontWeight: 600 }}>
              <span style={{ width: 6, height: 6, borderRadius: 99, background: C.profit, display: "inline-block" }} />
              Sync terakhir 2 jam lalu
            </span>
          </div>
        </Card>

        <button
          onClick={onFinish}
          style={{
            width: "100%", marginTop: "auto", background: C.accent, color: "#0A0D13", fontWeight: 700,
            fontSize: 14, padding: "13px 0", borderRadius: 14, fontFamily: FONT_UI,
          }}
        >
          Lihat Status Kepatuhan
        </button>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div style={{ padding: "18px 16px 40px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
          <button onClick={() => setStep(1)} style={{ color: C.sub }}><ChevronLeft size={20} /></button>
          <div style={{ fontSize: 16, fontWeight: 700, color: C.text }}>Firm &amp; Aturan Akun</div>
        </div>
        <div style={{ fontSize: 10.5, color: C.sub, marginBottom: 18, marginLeft: 30 }}>Langkah 2 dari 2</div>

        <div style={{ fontSize: 11.5, color: C.sub, marginBottom: 8 }}>Prop Firm</div>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 18 }}>
          {["FTMO", "The5ers", "MyFundedFX", "Lainnya"].map((f) => (
            <Chip key={f} active={firm === f} onClick={() => setFirm(f)}>{f}</Chip>
          ))}
        </div>

        <div style={{ fontSize: 11.5, color: C.sub, marginBottom: 8 }}>Fase Akun</div>
        <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
          {["Challenge", "Verification", "Funded"].map((p) => (
            <Chip key={p} active={phase === p} onClick={() => setPhase(p)}>{p}</Chip>
          ))}
        </div>

        <div style={{ fontSize: 11.5, color: C.sub, marginBottom: 8 }}>Parameter Aturan</div>
        <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
          <RuleInput label="Batas Rugi Harian" value={dailyLossPct} onChange={(e) => setDailyLossPct(e.target.value)} />
          <RuleInput label="Max Drawdown" value={maxDdPct} onChange={(e) => setMaxDdPct(e.target.value)} />
        </div>
        <div style={{ display: "flex", gap: 10, marginBottom: 18 }}>
          <RuleInput label="Target Profit" value={profitTargetPct} onChange={(e) => setProfitTargetPct(e.target.value)} />
          <RuleInput label="Min. Hari Trading" value={minDays} onChange={(e) => setMinDays(e.target.value)} suffix="hari" />
        </div>

        <div style={{ fontSize: 11, color: C.sub, lineHeight: 1.5, marginBottom: 22 }}>
          Nilai default mengikuti aturan umum {firm}. Sesuaikan jika paket kamu berbeda — parameter ini yang dipakai untuk memantau kepatuhan akunmu secara real-time.
        </div>

        <button
          onClick={() => setStep(3)}
          style={{
            width: "100%", background: C.accent, color: "#0A0D13", fontWeight: 700,
            fontSize: 14, padding: "13px 0", borderRadius: 14, fontFamily: FONT_UI,
          }}
        >
          Simpan &amp; Hubungkan
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: "18px 16px 40px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 6 }}>
        <button onClick={onBack} style={{ color: C.sub }}><ChevronLeft size={20} /></button>
        <div style={{ fontSize: 16, fontWeight: 700, color: C.text }}>Hubungkan Akun MT5</div>
      </div>
      <div style={{ fontSize: 10.5, color: C.sub, marginBottom: 18, marginLeft: 30 }}>Langkah 1 dari 2</div>

      <div style={{
        display: "flex", gap: 10, background: C.accentSoft, border: `1px solid ${C.accent}`,
        borderRadius: 12, padding: 12, marginBottom: 22,
      }}>
        <PlugZap size={17} color={C.accent} style={{ flexShrink: 0, marginTop: 1 }} />
        <div style={{ fontSize: 11.5, color: C.text, lineHeight: 1.5 }}>
          Cukup dihubungkan sekali. Semua transaksi akan tersinkron otomatis lewat MetaApi sesuai jadwal paketmu.
        </div>
      </div>

      <InputField icon={Hash} label="Nomor Akun" placeholder="Contoh: 51234567" value={account} onChange={(e) => setAccount(e.target.value)} />
      <InputField icon={Server} label="Server Broker" placeholder="Contoh: Exness-Real8" value={server} onChange={(e) => setServer(e.target.value)} />
      <InputField icon={KeyRound} label="Investor Password" placeholder="Password read-only" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />

      <div style={{ fontSize: 11, color: C.sub, lineHeight: 1.5, marginBottom: 22 }}>
        Gunakan <span style={{ color: C.text, fontWeight: 600 }}>investor password (read-only)</span>, bukan password trading —
        akun kamu tetap aman karena kami hanya bisa membaca riwayat transaksi, tidak bisa membuka posisi apa pun.
      </div>

      <button
        onClick={() => canConnect && setStep(2)}
        style={{
          width: "100%", background: canConnect ? C.accent : C.surfaceAlt, color: canConnect ? "#0A0D13" : C.sub,
          fontWeight: 700, fontSize: 14, padding: "13px 0", borderRadius: 14, fontFamily: FONT_UI,
        }}
      >
        Lanjut
      </button>
    </div>
  );
}

/* ---------- App shell ---------- */
export default function TradingJournalApp() {
  const [tab, setTab] = useState("funded");
  const [showConnect, setShowConnect] = useState(false);
  const tabs = [
    { id: "funded", label: "Funded", icon: ShieldCheck },
    { id: "dashboard", label: "Dashboard", icon: LayoutGrid },
    { id: "insight", label: "Insight", icon: Lightbulb },
    { id: "history", label: "Riwayat", icon: ListOrdered },
    { id: "subscription", label: "Langganan", icon: Wallet },
  ];

  return (
    <div style={{ background: "#05070B", minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px 0", fontFamily: FONT_UI }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=IBM+Plex+Mono:wght@400;500;600;700&display=swap');`}</style>
      <div style={{
        width: 375, height: 812, background: C.bg, borderRadius: 40, overflow: "hidden",
        border: "8px solid #1B1F27", boxShadow: "0 30px 60px rgba(0,0,0,0.5)", position: "relative", display: "flex", flexDirection: "column",
      }}>
        {/* status bar */}
        <div style={{ display: "flex", justifyContent: "space-between", padding: "14px 22px 6px", fontFamily: FONT_MONO, fontSize: 12, color: C.text }}>
          <span>9:41</span>
          <span style={{ color: C.sub }}>●●●● MT5 Sync</span>
        </div>

        {/* brand header */}
        <div style={{ padding: "6px 20px 12px", display: "flex", alignItems: "center", gap: 9 }}>
          <div style={{
            width: 26, height: 26, borderRadius: 8, background: C.accentSoft,
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0,
          }}>
            <ShieldCheck size={15} color={C.accent} />
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 700, color: C.text, letterSpacing: 0.2 }}>Aftermath Journey</div>
            <div style={{ fontSize: 9.5, color: C.sub, marginTop: -1 }}>Compliance &amp; jurnal untuk funded trader</div>
          </div>
        </div>

        {/* scrollable content */}
        <div style={{ flex: 1, overflowY: "auto" }}>
          {showConnect ? (
            <ConnectMT5Screen
              onBack={() => setShowConnect(false)}
              onFinish={() => { setShowConnect(false); setTab("funded"); }}
            />
          ) : (
            <>
              {tab === "dashboard" && <Dashboard />}
              {tab === "funded" && <ComplianceScreen />}
              {tab === "insight" && <InsightScreen />}
              {tab === "history" && <HistoryScreen />}
              {tab === "subscription" && <SubscriptionScreen onContinue={() => setShowConnect(true)} />}
            </>
          )}
        </div>

        {/* bottom nav */}
        {!showConnect && (
        <div style={{
          position: "absolute", bottom: 0, left: 0, right: 0, background: "rgba(18,22,31,0.92)",
          backdropFilter: "blur(10px)", borderTop: `1px solid ${C.border}`, display: "flex", padding: "10px 8px 22px",
        }}>
          {tabs.map((t) => {
            const Icon = t.icon;
            const active = tab === t.id;
            return (
              <button key={t.id} onClick={() => setTab(t.id)} style={{
                flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4,
              }}>
                <Icon size={20} color={active ? C.accent : C.sub} strokeWidth={active ? 2.4 : 2} />
                <span style={{ fontSize: 10, color: active ? C.accent : C.sub, fontWeight: active ? 600 : 500 }}>
                  {t.label}
                </span>
              </button>
            );
          })}
        </div>
        )}
      </div>
    </div>
  );
}
