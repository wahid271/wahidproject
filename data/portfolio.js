/* ============================================================
   PORTFOLIO DATA — edit this file to update the whole site
   All numbers are SAMPLE data. Replace with your real results.
   ============================================================ */

const PORTFOLIO = {
  meta: {
    name: "Arkan Pradipta",
    alias: "AP",
    title: "Discretionary Futures Trader",
    location: "Jakarta, ID",
    timezone: "GMT+7",
    since: 2019,
    bio: "I trade index and commodity futures on a discretionary, price-action-driven system. This page is my public track record: every number here is derived from the same trade log I keep for myself — wins, losses, and drawdowns included.",
    contactEmail: "trader@example.com",
    socials: {
      x: "https://x.com/",
      tradingview: "https://tradingview.com/",
      youtube: "https://youtube.com/",
      instagram: "https://instagram.com/"
    }
  },

  // ── Headline KPIs (hero strip) ─────────────
  kpis: {
    returnPct:        184.2,   // cumulative return, %
    winRate:          63.4,    // %
    profitFactor:     2.31,
    maxDrawdownPct:   -11.8,   // keep the minus sign
    tradesCount:      1247
  },

  // ── Monthly returns, % per month (rows = years) ──
  monthlyReturns: {
    years:  [2023, 2024, 2025],
    // 12 values per year, Jan..Dec. Use null for months with no data.
    data: [
      [  4.2,  -1.8,   6.1,   2.4,  -3.2,   5.7,   1.9,   7.3,  -2.1,   4.8,   3.1,   6.4],
      [  2.8,   5.1,  -2.4,   8.2,   3.6,  -4.1,   6.8,   2.2,   5.4,  -1.6,   4.9,   7.1],
      [  6.3,   3.8,   9.2,   5.1,   4.4,  -2.8,   7.6,   6.1,   3.2,   5.8,  null,  null]
    ]
  },

  // ── Equity curve (month-end balance, account currency) ──
  equityCurve: [
    { t: "2023-01", v: 10000 }, { t: "2023-02", v: 10420 }, { t: "2023-03", v: 10205 },
    { t: "2023-04", v: 10450 }, { t: "2023-05", v: 10116 }, { t: "2023-06", v: 10693 },
    { t: "2023-07", v: 10896 }, { t: "2023-08", v: 11691 }, { t: "2023-09", v: 11446 },
    { t: "2023-10", v: 11995 }, { t: "2023-11", v: 12367 }, { t: "2023-12", v: 13158 },
    { t: "2024-01", v: 13527 }, { t: "2024-02", v: 14217 }, { t: "2024-03", v: 13875 },
    { t: "2024-04", v: 15013 }, { t: "2024-05", v: 15554 }, { t: "2024-06", v: 14916 },
    { t: "2024-07", v: 15930 }, { t: "2024-08", v: 16281 }, { t: "2024-09", v: 17160 },
    { t: "2024-10", v: 16885 }, { t: "2024-11", v: 17713 }, { t: "2024-12", v: 18970 },
    { t: "2025-01", v: 20164 }, { t: "2025-02", v: 20931 }, { t: "2025-03", v: 22858 },
    { t: "2025-04", v: 24022 }, { t: "2025-05", v: 25078 }, { t: "2025-06", v: 24376 },
    { t: "2025-07", v: 26227 }, { t: "2025-08", v: 27826 }, { t: "2025-09", v: 28716 },
    { t: "2025-10", v: 30383 }, { t: "2025-11", v: null }, { t: "2025-12", v: null }
  ],

  // ── Recent trades (track-record table, newest first) ──
  trades: [
    { date: "2025-10-28", symbol: "NQ",   side: "LONG",  entry: 21420.00, exit: 21585.00, rMultiple:  2.4, pnl:  825.00 },
    { date: "2025-10-27", symbol: "ES",   side: "SHORT", entry: 6012.25,  exit: 5988.50,  rMultiple:  1.8, pnl:  594.00 },
    { date: "2025-10-24", symbol: "GC",   side: "LONG",  entry: 2384.60,  exit: 2371.20,  rMultiple: -1.0, pnl: -335.00 },
    { date: "2025-10-23", symbol: "CL",   side: "LONG",  entry: 71.48,    exit: 73.02,    rMultiple:  3.1, pnl:  770.00 },
    { date: "2025-10-22", symbol: "NQ",   side: "SHORT", entry: 21590.50, exit: 21640.75, rMultiple: -1.0, pnl: -505.00 },
    { date: "2025-10-21", symbol: "ES",   side: "LONG",  entry: 5944.00,  exit: 5967.25,  rMultiple:  2.2, pnl:  581.00 },
    { date: "2025-10-20", symbol: "6E",   side: "SHORT", entry: 1.1628,   exit: 1.1587,   rMultiple:  1.6, pnl:  512.00 },
    { date: "2025-10-17", symbol: "GC",   side: "SHORT", entry: 2412.90,  exit: 2396.40,  rMultiple:  2.0, pnl:  412.00 },
    { date: "2025-10-16", symbol: "CL",   side: "SHORT", entry: 73.85,    exit: 72.91,    rMultiple:  1.4, pnl:  235.00 },
    { date: "2025-10-15", symbol: "NQ",   side: "LONG",  entry: 21288.25, exit: 21255.50, rMultiple: -1.0, pnl: -327.00 },
    { date: "2025-10-14", symbol: "ES",   side: "LONG",  entry: 5891.75,  exit: 5920.50,  rMultiple:  2.9, pnl:  718.00 },
    { date: "2025-10-13", symbol: "6E",   side: "LONG",  entry: 1.1512,   exit: 1.1496,   rMultiple: -1.0, pnl: -200.00 },
    { date: "2025-10-10", symbol: "GC",   side: "LONG",  entry: 2360.10,  exit: 2389.30,  rMultiple:  3.4, pnl:  730.00 },
    { date: "2025-10-09", symbol: "CL",   side: "LONG",  entry: 70.92,    exit: 70.31,    rMultiple: -1.0, pnl: -305.00 },
    { date: "2025-10-08", symbol: "NQ",   side: "SHORT", entry: 21980.00, exit: 21862.25, rMultiple:  2.6, pnl:  588.00 },
    { date: "2025-10-07", symbol: "ES",   side: "SHORT", entry: 6041.50,  exit: 6020.75,  rMultiple:  1.9, pnl:  518.00 },
    { date: "2025-10-06", symbol: "6E",   side: "SHORT", entry: 1.1702,   exit: 1.1668,   rMultiple:  1.5, pnl:  425.00 },
    { date: "2025-10-03", symbol: "GC",   side: "SHORT", entry: 2445.70,  exit: 2461.35,  rMultiple: -1.0, pnl: -391.00 },
    { date: "2025-10-02", symbol: "NQ",   side: "LONG",  entry: 21642.00, exit: 21789.50, rMultiple:  3.2, pnl:  737.00 },
    { date: "2025-10-01", symbol: "ES",   side: "LONG",  entry: 5968.25,  exit: 5951.00,  rMultiple: -1.0, pnl: -431.00 }
  ],

  // ── Instrument breakdown (donut/legend) ──
  instruments: [
    { symbol: "NQ", label: "Nasdaq 100 futures",  share: 34, pnl: 21400 },
    { symbol: "ES", label: "S&P 500 futures",     share: 28, pnl: 16800 },
    { symbol: "GC", label: "Gold futures",        share: 18, pnl: 9600  },
    { symbol: "CL", label: "Crude oil futures",   share: 13, pnl: 5200  },
    { symbol: "6E", label: "Euro FX futures",     share: 7,  pnl: 2100  }
  ],

  // ── Strategy / playbook cards ──
  strategies: [
    {
      name: "Opening Range Breakout",
      market: "Index futures · NQ / ES",
      timeframe: "5m → 15m",
      desc: "First-hour range fade or breakout with volume confirmation. Tight stop beyond the range, targets at measured moves.",
      stats: { "Win rate": "66%", "Avg R": "+1.9R", "Trades/mo": "18" }
    },
    {
      name: "Liquidity Sweep Reversal",
      market: "Metals & energy · GC / CL",
      timeframe: "15m → 1H",
      desc: "Stop-run beyond a session extreme followed by rejection. Enter on the reclaim candle with structure-based invalidation.",
      stats: { "Win rate": "58%", "Avg R": "+2.6R", "Trades/mo": "9" }
    },
    {
      name: "Trend Continuation Pullback",
      market: "FX majors · 6E",
      timeframe: "1H → 4H",
      desc: "Buy/sell the first pullback into a demand/supply zone inside a clean trend. Partial at 1R, runner to the weekly extreme.",
      stats: { "Win rate": "61%", "Avg R": "+2.2R", "Trades/mo": "6" }
    }
  ],

  // ── Rules / methodology ──
  principles: [
    { title: "Risk first, always",  text: "Fixed 0.5–1% risk per idea. Daily loss limit of 2R stops the day. No exceptions, no revenge sizing." },
    { title: "One page, one plan",  text: "Every setup lives on a single playbook page with entry, invalidation, and targets defined before the bell." },
    { title: "Journal everything",  text: "Each trade is logged with screenshot, thesis, and emotion score. Reviews every Sunday, adjustments monthly." },
    { title: "Process over P&L",    text: "I grade months on execution quality, not returns. A profitable month full of rule breaks is a failed month." }
  ],

  // ── FAQ ──
  faq: [
    { q: "Is this track record verified?", a: "The numbers come from my own broker statements and journal. I'm working on linking a verified Myfxbook/TradingView account — until then, treat this as self-reported." },
    { q: "Can I copy your trades?", a: "No. This site is a public journal, not a signal service. I don't sell signals, courses, or managed accounts." },
    { q: "What do you trade?", a: "CME index futures (NQ, ES), metals (GC), energy (CL), and FX futures (6E). I avoid illiquid sessions and news spikes." },
    { q: "What was your worst drawdown?", a: "-11.8% peak-to-trough over five weeks in 2023. It's documented in the drawdown chart — I don't hide it." },
    { q: "How do I get in touch?", a: "Email is best — see the contact section. I answer questions about process and risk, not trade calls." }
  ]
};

// export for module usage if needed
if (typeof module !== "undefined" && module.exports) module.exports = PORTFOLIO;
