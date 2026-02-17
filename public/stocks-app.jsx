const { useState, useRef, useEffect, useCallback } = React;

// CORS proxies — try multiple in order for resilience
const CORS_PROXIES = [
  (url) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
  (url) => `https://api.allorigins.win/raw?url=${encodeURIComponent(url)}`,
  (url) => url, // direct fetch (works if no CORS issues, e.g. browser extension)
];

// Stock definitions — prices fetched from API, not hardcoded
const STOCK_DEFS = [
  { symbol: 'NVDA', name: 'NVIDIA Corp', sector: 'Technology' },
  { symbol: 'AAPL', name: 'Apple Inc', sector: 'Technology' },
  { symbol: 'MSFT', name: 'Microsoft Corp', sector: 'Technology' },
  { symbol: 'GOOGL', name: 'Alphabet Inc', sector: 'Technology' },
  { symbol: 'AMZN', name: 'Amazon.com Inc', sector: 'Consumer' },
  { symbol: 'META', name: 'Meta Platforms', sector: 'Technology' },
  { symbol: 'TSLA', name: 'Tesla Inc', sector: 'Automotive' },
  { symbol: 'BRK.B', name: 'Berkshire Hathaway', sector: 'Finance' },
  { symbol: 'JPM', name: 'JPMorgan Chase', sector: 'Finance' },
  { symbol: 'V', name: 'Visa Inc', sector: 'Finance' },
  { symbol: 'UNH', name: 'UnitedHealth Group', sector: 'Healthcare' },
  { symbol: 'LLY', name: 'Eli Lilly', sector: 'Healthcare' },
];

const PERIODS = ['1D', '1W', '1M', '3M', '1Y', '5Y', 'ALL'];

// Format a unix timestamp for display based on chart period
function formatTimestamp(unix, period) {
  const d = new Date(unix * 1000);
  if (period === '1D') {
    return d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  }
  if (period === '5Y' || period === 'ALL') {
    return d.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
  }
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

// Draw a rounded rectangle path
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

// Fetch with multi-proxy fallback
async function fetchWithProxy(url) {
  for (const makeProxy of CORS_PROXIES) {
    try {
      const proxyUrl = makeProxy(url);
      const res = await fetch(proxyUrl, { signal: AbortSignal.timeout(10000) });
      if (!res.ok) continue;
      const text = await res.text();
      const data = JSON.parse(text);
      // Verify it's valid Yahoo Finance data, not a proxy error page
      if (data.chart && data.chart.result) return data;
    } catch (e) {
      continue;
    }
  }
  throw new Error('All proxies failed for: ' + url);
}

// Fetch from Yahoo Finance v8 chart API
async function yahooChart(symbol, interval, range) {
  const yahooSymbol = symbol.replace('.', '-');
  const url = `https://query2.finance.yahoo.com/v8/finance/chart/${yahooSymbol}?interval=${interval}&range=${range}&includePrePost=false`;
  const data = await fetchWithProxy(url);
  const result = data.chart.result[0];
  const meta = result.meta;
  const rawCloses = result.indicators.quote[0].close || [];
  const rawTimestamps = result.timestamp || [];
  // Keep closes and timestamps aligned, filtering out nulls
  const closes = [];
  const timestamps = [];
  for (let i = 0; i < rawCloses.length; i++) {
    if (rawCloses[i] !== null) {
      closes.push(rawCloses[i]);
      timestamps.push(rawTimestamps[i] || 0);
    }
  }
  return { meta, closes, timestamps };
}

// Fetch daily + intraday data in parallel
async function fetchStockData(symbol) {
  const [daily, intraday] = await Promise.all([
    yahooChart(symbol, '1d', '10y'),
    yahooChart(symbol, '1m', '1d'),
  ]);

  const price = daily.meta.regularMarketPrice;
  const previousClose = daily.meta.chartPreviousClose || daily.meta.previousClose || daily.closes[daily.closes.length - 2] || price;
  const change = previousClose ? parseFloat(((price - previousClose) / previousClose * 100).toFixed(2)) : 0;

  return {
    price,
    change,
    closes: daily.closes,
    dailyTs: daily.timestamps,
    intraday: intraday.closes,
    intradayTs: intraday.timestamps,
  };
}

// Slice historical closes and timestamps into period buckets
function sliceHistories(closes, intraday, dailyTs, intradayTs) {
  return {
    prices: {
      '1D': intraday && intraday.length > 0 ? intraday : closes.slice(-1),
      '1W': closes.slice(-5),
      '1M': closes.slice(-22),
      '3M': closes.slice(-66),
      '1Y': closes.slice(-252),
      '5Y': closes.slice(-1260),
      'ALL': closes,
    },
    timestamps: {
      '1D': intradayTs && intradayTs.length > 0 ? intradayTs : dailyTs.slice(-1),
      '1W': dailyTs.slice(-5),
      '1M': dailyTs.slice(-22),
      '3M': dailyTs.slice(-66),
      '1Y': dailyTs.slice(-252),
      '5Y': dailyTs.slice(-1260),
      'ALL': dailyTs,
    },
  };
}

// Fallback: generate fake price history when API unavailable
function generatePriceHistory(basePrice, days, volatility) {
  const prices = [];
  let price = basePrice * (0.7 + Math.random() * 0.3);
  for (let i = 0; i < days; i++) {
    const change = (Math.random() - 0.48) * volatility * price;
    price = Math.max(price + change, basePrice * 0.3);
    prices.push(parseFloat(price.toFixed(2)));
  }
  const drift = (basePrice - prices[prices.length - 1]) / 10;
  for (let i = prices.length - 10; i < prices.length; i++) {
    prices[i] = parseFloat((prices[i] + drift * (i - prices.length + 11)).toFixed(2));
  }
  return prices;
}

function generateFakeTimestamps(count, stepSeconds) {
  const now = Math.floor(Date.now() / 1000);
  return Array.from({ length: count }, (_, i) => now - (count - 1 - i) * stepSeconds);
}

function generateAllHistories(basePrice) {
  return {
    prices: {
      '1D': generatePriceHistory(basePrice, 390, 0.005),
      '1W': generatePriceHistory(basePrice, 7, 0.02),
      '1M': generatePriceHistory(basePrice, 30, 0.025),
      '3M': generatePriceHistory(basePrice, 90, 0.03),
      '1Y': generatePriceHistory(basePrice, 365, 0.035),
      '5Y': generatePriceHistory(basePrice, 1825, 0.035),
      'ALL': generatePriceHistory(basePrice, 3650, 0.04),
    },
    timestamps: {
      '1D': generateFakeTimestamps(390, 60),
      '1W': generateFakeTimestamps(7, 86400),
      '1M': generateFakeTimestamps(30, 86400),
      '3M': generateFakeTimestamps(90, 86400),
      '1Y': generateFakeTimestamps(365, 86400),
      '5Y': generateFakeTimestamps(1825, 86400),
      'ALL': generateFakeTimestamps(3650, 86400),
    },
  };
}

const CHART_PADDING = { top: 30, bottom: 40, left: 60, right: 20 };

function Chart({ data, timestamps, period, color, width, height }) {
  const canvasRef = useRef(null);
  const chartImageRef = useRef(null);
  const dataRef = useRef({ data, timestamps, period, color, width, height });
  dataRef.current = { data, timestamps, period, color, width, height };

  // Draw the base chart and save a snapshot
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !data || data.length === 0) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, width, height);

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const p = CHART_PADDING;
    const chartW = width - p.left - p.right;
    const chartH = height - p.top - p.bottom;

    // Grid lines and labels
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '11px Arial';
    ctx.textAlign = 'right';
    const gridLines = 5;
    for (let i = 0; i <= gridLines; i++) {
      const y = p.top + (chartH / gridLines) * i;
      const val = max - (range / gridLines) * i;
      ctx.beginPath();
      ctx.moveTo(p.left, y);
      ctx.lineTo(width - p.right, y);
      ctx.stroke();
      ctx.fillText('$' + val.toFixed(2), p.left - 8, y + 4);
    }

    // X axis labels
    ctx.textAlign = 'center';
    const labelCount = Math.min(6, data.length);
    for (let i = 0; i < labelCount; i++) {
      const idx = Math.round((i / (labelCount - 1)) * (data.length - 1));
      const x = p.left + (idx / (data.length - 1)) * chartW;
      if (timestamps && timestamps[idx]) {
        ctx.fillText(formatTimestamp(timestamps[idx], period), x, height - 10);
      } else {
        ctx.fillText(idx + 1, x, height - 10);
      }
    }

    // Gradient fill
    const gradient = ctx.createLinearGradient(0, p.top, 0, p.top + chartH);
    gradient.addColorStop(0, color + '40');
    gradient.addColorStop(1, color + '05');

    ctx.beginPath();
    data.forEach((val, i) => {
      const x = p.left + (i / (data.length - 1)) * chartW;
      const y = p.top + chartH - ((val - min) / range) * chartH;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    const lastX = p.left + chartW;
    const firstX = p.left;
    ctx.lineTo(lastX, p.top + chartH);
    ctx.lineTo(firstX, p.top + chartH);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Line
    ctx.beginPath();
    data.forEach((val, i) => {
      const x = p.left + (i / (data.length - 1)) * chartW;
      const y = p.top + chartH - ((val - min) / range) * chartH;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Dot on last point
    const lastY = p.top + chartH - ((data[data.length - 1] - min) / range) * chartH;
    ctx.beginPath();
    ctx.arc(lastX, lastY, 4, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();

    // Save snapshot for hover overlay
    chartImageRef.current = ctx.getImageData(0, 0, canvas.width, canvas.height);
  }, [data, timestamps, period, color, width, height]);

  const drawOverlay = useCallback((idx) => {
    const canvas = canvasRef.current;
    if (!canvas || !chartImageRef.current) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const { data, timestamps, period, color, width, height } = dataRef.current;

    // Reset transform before restoring snapshot (putImageData ignores transforms)
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.putImageData(chartImageRef.current, 0, 0);

    if (idx === null || !data || idx < 0 || idx >= data.length) return;

    // Apply DPR scaling fresh (no stacked transforms)
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const pad = CHART_PADDING;
    const chartW = width - pad.left - pad.right;
    const chartH = height - pad.top - pad.bottom;

    const x = pad.left + (idx / (data.length - 1)) * chartW;
    const y = pad.top + chartH - ((data[idx] - min) / range) * chartH;

    // Vertical crosshair
    ctx.beginPath();
    ctx.setLineDash([3, 3]);
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 0.5;
    ctx.moveTo(x, pad.top);
    ctx.lineTo(x, pad.top + chartH);
    ctx.stroke();

    // Horizontal crosshair
    ctx.beginPath();
    ctx.moveTo(pad.left, y);
    ctx.lineTo(pad.left + chartW, y);
    ctx.stroke();
    ctx.setLineDash([]);

    // Highlight dot
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    // Tooltip content
    const priceText = '$' + data[idx].toFixed(2);
    const startPrice = data[0];
    const changeFromStart = ((data[idx] - startPrice) / startPrice * 100);
    const changeSign = changeFromStart >= 0 ? '+' : '';
    const changeText = '  ' + changeSign + changeFromStart.toFixed(2) + '%';
    const changeColor = changeFromStart >= 0 ? '#4caf50' : '#ef5350';
    const timeText = timestamps && timestamps[idx] ? '  ' + formatTimestamp(timestamps[idx], period) : '';

    ctx.font = '11px Arial';
    const priceW = ctx.measureText(priceText).width;
    const changeW = ctx.measureText(changeText).width;
    const timeW = ctx.measureText(timeText).width;
    const tooltipW = priceW + changeW + timeW + 14;
    const tooltipH = 22;

    let tooltipX = x - tooltipW / 2;
    let tooltipY = y - tooltipH - 10;
    // Keep in bounds
    if (tooltipX < 2) tooltipX = 2;
    if (tooltipX + tooltipW > width - 2) tooltipX = width - 2 - tooltipW;
    if (tooltipY < 2) tooltipY = y + 10;

    // Tooltip background
    ctx.fillStyle = 'rgba(20,20,20,0.92)';
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 1;
    roundRect(ctx, tooltipX, tooltipY, tooltipW, tooltipH, 4);
    ctx.fill();
    ctx.stroke();

    // Draw text segments with colors
    ctx.font = '11px Arial';
    ctx.textAlign = 'left';
    let textX = tooltipX + 7;
    const textY = tooltipY + 15;
    ctx.fillStyle = '#fff';
    ctx.fillText(priceText, textX, textY);
    textX += priceW;
    ctx.fillStyle = changeColor;
    ctx.fillText(changeText, textX, textY);
    textX += changeW;
    ctx.fillStyle = 'rgba(255,255,255,0.5)';
    ctx.fillText(timeText, textX, textY);

    // Reset transform
    ctx.setTransform(1, 0, 0, 1, 0, 0);
  }, []);

  const handleMouseMove = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const { data, width } = dataRef.current;
    if (!data || data.length === 0) return;
    const pad = CHART_PADDING;
    const chartW = width - pad.left - pad.right;
    const ratio = (mouseX - pad.left) / chartW;
    const idx = Math.round(ratio * (data.length - 1));
    if (idx >= 0 && idx < data.length) {
      drawOverlay(idx);
    }
  }, [drawOverlay]);

  const handleMouseLeave = useCallback(() => {
    drawOverlay(null);
  }, [drawOverlay]);

  return React.createElement('canvas', {
    ref: canvasRef,
    style: { width, height, cursor: 'crosshair' },
    onMouseMove: handleMouseMove,
    onMouseLeave: handleMouseLeave,
  });
}

function MiniChart({ data, color }) {
  const canvasRef = useRef(null);
  const w = 100;
  const h = 36;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !data) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.scale(dpr, dpr);
    ctx.clearRect(0, 0, w, h);

    const slice = data.slice(-30);
    const min = Math.min(...slice);
    const max = Math.max(...slice);
    const range = max - min || 1;

    ctx.beginPath();
    slice.forEach((val, i) => {
      const x = (i / (slice.length - 1)) * w;
      const y = h - ((val - min) / range) * (h - 4) - 2;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }, [data, color]);

  return React.createElement('canvas', {
    ref: canvasRef,
    style: { width: w, height: h },
  });
}

function StocksApp() {
  const [stocks, setStocks] = useState([]);
  const [histories, setHistories] = useState({});
  const [selected, setSelected] = useState(null);
  const [period, setPeriod] = useState('1D');
  const [filter, setFilter] = useState('All');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newStock, setNewStock] = useState({ symbol: '', name: '', sector: '' });
  const [addingStock, setAddingStock] = useState(false);
  const [dragIdx, setDragIdx] = useState(null);
  const [dragOverIdx, setDragOverIdx] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dataSource, setDataSource] = useState('loading');
  const chartPanelRef = useRef(null);

  // Escape key closes the detail panel
  useEffect(() => {
    if (!selected) return;
    function handleKeyDown(e) {
      if (e.key === 'Escape') setSelected(null);
    }
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selected]);

  // Fetch all stock data on mount
  useEffect(() => {
    let cancelled = false;
    async function loadStocks() {
      const results = [];
      const allHistories = {};

      const fetches = STOCK_DEFS.map(async (def) => {
        try {
          const data = await fetchStockData(def.symbol);
          return { def, data, live: true };
        } catch (err) {
          console.warn(`Failed to fetch ${def.symbol}:`, err);
          return { def, data: null, live: false };
        }
      });

      const settled = await Promise.all(fetches);
      if (cancelled) return;

      let anyLive = false;
      for (const item of settled) {
        const { def, data, live } = item;
        if (live && data && data.price) {
          anyLive = true;
          results.push({
            symbol: def.symbol,
            name: def.name,
            sector: def.sector,
            price: data.price,
            change: data.change,
            marketCap: 'N/A',
          });
          allHistories[def.symbol] = sliceHistories(data.closes, data.intraday, data.dailyTs, data.intradayTs);
        } else {
          const fallbackPrice = 100;
          results.push({
            symbol: def.symbol,
            name: def.name,
            sector: def.sector,
            price: fallbackPrice,
            change: 0,
            marketCap: 'N/A',
          });
          allHistories[def.symbol] = generateAllHistories(fallbackPrice);
        }
      }

      setStocks(results);
      setHistories(allHistories);
      setDataSource(anyLive ? 'live' : 'demo');
      setLoading(false);
    }

    loadStocks();
    return () => { cancelled = true; };
  }, []);

  // Refresh real prices from API every 60 seconds
  useEffect(() => {
    if (loading || dataSource !== 'live') return;
    const interval = setInterval(async () => {
      try {
        const updates = await Promise.allSettled(
          stocks.map(async (stock) => {
            const chart = await yahooChart(stock.symbol, '1d', '5d');
            const price = chart.meta.regularMarketPrice;
            const prevClose = chart.meta.chartPreviousClose || chart.meta.previousClose || price;
            const change = prevClose ? parseFloat(((price - prevClose) / prevClose * 100).toFixed(2)) : 0;
            return { symbol: stock.symbol, price, change };
          })
        );
        setStocks((prev) =>
          prev.map((stock) => {
            const result = updates.find(
              (u) => u.status === 'fulfilled' && u.value.symbol === stock.symbol
            );
            if (result) {
              return { ...stock, price: result.value.price, change: result.value.change };
            }
            return stock;
          })
        );
      } catch (err) {
        console.warn('Price refresh failed:', err);
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [loading, dataSource, stocks.length]);

  // Keep selected stock in sync with live updates
  useEffect(() => {
    if (selected) {
      const current = stocks.find((s) => s.symbol === selected.symbol);
      if (current && (current.price !== selected.price || current.change !== selected.change)) {
        setSelected(current);
      }
    }
  }, [stocks, selected]);

  const sectors = ['All', ...new Set(stocks.map((s) => s.sector))];
  const filtered = filter === 'All' ? stocks : stocks.filter((s) => s.sector === filter);

  const handleAddStock = async () => {
    const symbol = newStock.symbol.trim().toUpperCase();
    if (!symbol || !newStock.name || !newStock.sector) return;
    if (stocks.some((s) => s.symbol === symbol)) return;

    setAddingStock(true);
    try {
      const data = await fetchStockData(symbol);
      const stock = {
        symbol,
        name: newStock.name,
        price: data.price,
        change: data.change,
        marketCap: 'N/A',
        sector: newStock.sector,
      };
      setStocks((prev) => [...prev, stock]);
      setHistories((prev) => ({
        ...prev,
        [symbol]: sliceHistories(data.closes, data.intraday, data.dailyTs, data.intradayTs),
      }));
    } catch (err) {
      console.warn(`Failed to fetch ${symbol}:`, err);
      alert(`Could not fetch data for "${symbol}". Check the symbol and try again.`);
      setAddingStock(false);
      return;
    }

    setNewStock({ symbol: '', name: '', sector: '' });
    setShowAddForm(false);
    setAddingStock(false);
  };

  const handleDragStart = (e, idx) => {
    setDragIdx(idx);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e, idx) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    setDragOverIdx(idx);
  };

  const handleDrop = (e, dropIdx) => {
    e.preventDefault();
    if (dragIdx === null || dragIdx === dropIdx) {
      setDragIdx(null);
      setDragOverIdx(null);
      return;
    }
    setStocks((prev) => {
      const reordered = [...prev];
      const [moved] = reordered.splice(dragIdx, 1);
      reordered.splice(dropIdx, 0, moved);
      return reordered;
    });
    setDragIdx(null);
    setDragOverIdx(null);
  };

  const handleDragEnd = () => {
    setDragIdx(null);
    setDragOverIdx(null);
  };

  // Helper to get price/timestamp arrays for selected stock + period
  const selectedPrices = selected && histories[selected.symbol] ? histories[selected.symbol].prices[period] : null;
  const selectedTimestamps = selected && histories[selected.symbol] ? histories[selected.symbol].timestamps[period] : null;
  const periodChange = selectedPrices && selectedPrices.length > 1
    ? parseFloat(((selectedPrices[selectedPrices.length - 1] - selectedPrices[0]) / selectedPrices[0] * 100).toFixed(2))
    : (selected ? selected.change : 0);
  const chartColor = periodChange >= 0 ? '#4caf50' : '#ef5350';

  if (loading) {
    return (
      <div style={styles.container}>
        <a href="/" style={styles.backLink}>&larr; Back to Home</a>
        <h1 style={styles.title}>Top Stocks</h1>
        <div style={styles.loadingContainer}>
          <div style={styles.spinner}></div>
          <p style={styles.loadingText}>Fetching live market data...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <a href="/" style={styles.backLink}>&larr; Back to Home</a>
      <h1 style={styles.title}>Top Stocks</h1>

      <div style={styles.dataSourceBadge}>
        <span style={{
          ...styles.badge,
          background: dataSource === 'live' ? 'rgba(76,175,80,0.2)' : 'rgba(255,152,0,0.2)',
          color: dataSource === 'live' ? '#4caf50' : '#ff9800',
        }}>
          {dataSource === 'live' ? 'Live Data' : 'Demo Data'}
        </span>
      </div>

      <div style={styles.topBar}>
        <div style={styles.filters}>
          {sectors.map((s) => (
            <button
              key={s}
              style={{
                ...styles.filterBtn,
                background: filter === s ? '#4caf50' : 'rgba(255,255,255,0.08)',
                color: filter === s ? '#fff' : '#aaa',
              }}
              onClick={() => setFilter(s)}
            >
              {s}
            </button>
          ))}
        </div>
        <button
          style={styles.addBtn}
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Cancel' : '+ Add Stock'}
        </button>
      </div>

      {showAddForm && (
        <div style={styles.addForm}>
          <input
            style={styles.input}
            placeholder="Symbol (e.g. GOOG)"
            value={newStock.symbol}
            onChange={(e) => setNewStock({ ...newStock, symbol: e.target.value })}
          />
          <input
            style={styles.input}
            placeholder="Name (e.g. Alphabet Inc)"
            value={newStock.name}
            onChange={(e) => setNewStock({ ...newStock, name: e.target.value })}
          />
          <input
            style={styles.input}
            placeholder="Sector (e.g. Technology)"
            value={newStock.sector}
            onChange={(e) => setNewStock({ ...newStock, sector: e.target.value })}
          />
          <button
            style={{ ...styles.submitBtn, opacity: addingStock ? 0.6 : 1 }}
            onClick={handleAddStock}
            disabled={addingStock}
          >
            {addingStock ? 'Fetching...' : 'Add Stock'}
          </button>
        </div>
      )}

      <div style={styles.tableHeader}>
        <span style={{ width: 30 }}></span>
        <span style={{ flex: 2 }}>Stock</span>
        <span style={{ flex: 1, textAlign: 'right' }}>Price</span>
        <span style={{ flex: 1, textAlign: 'right' }}>Change</span>
        <span style={{ flex: 1, textAlign: 'center' }}>Trend</span>
      </div>

      {filtered.map((stock) => {
        const stockIdx = stocks.indexOf(stock);
        const isSelected = selected?.symbol === stock.symbol;
        const showPanel = isSelected && selectedPrices;
        const miniData = histories[stock.symbol] ? histories[stock.symbol].prices['1D'] : null;
        const trendColor = miniData && miniData.length > 1
          ? (miniData[miniData.length - 1] >= miniData[0] ? '#4caf50' : '#ef5350')
          : (stock.change >= 0 ? '#4caf50' : '#ef5350');
        return (
          <React.Fragment key={stock.symbol}>
            {showPanel && (
              <div ref={chartPanelRef} style={styles.chartPanel} onClick={(e) => e.stopPropagation()}>
                <div style={styles.chartHeader}>
                  <div>
                    <span style={styles.chartSymbol}>{selected.symbol}</span>
                    <span style={styles.chartName}>{selected.name}</span>
                  </div>
                  <button style={styles.closeBtn} onClick={() => setSelected(null)}>&#10005;</button>
                </div>
                <div style={styles.chartPriceRow}>
                  <span style={styles.chartPrice}>${selected.price.toFixed(2)}</span>
                  <span style={{ ...styles.chartChange, color: chartColor }}>
                    {periodChange >= 0 ? '+' : ''}{periodChange.toFixed(2)}%
                  </span>
                </div>
                <div style={styles.periodRow}>
                  {PERIODS.map((p) => (
                    <button
                      key={p}
                      style={{
                        ...styles.periodBtn,
                        background: period === p ? '#4caf50' : 'transparent',
                        color: period === p ? '#fff' : '#aaa',
                      }}
                      onClick={() => setPeriod(p)}
                    >
                      {p}
                    </button>
                  ))}
                </div>
                <div style={styles.chartArea}>
                  <Chart
                    data={selectedPrices}
                    timestamps={selectedTimestamps}
                    period={period}
                    color={chartColor}
                    width={460}
                    height={250}
                  />
                </div>
                <div style={styles.statsRow}>
                  <div style={styles.stat}>
                    <div style={styles.statLabel}>Sector</div>
                    <div style={styles.statValue}>{selected.sector}</div>
                  </div>
                  <div style={styles.stat}>
                    <div style={styles.statLabel}>High</div>
                    <div style={styles.statValue}>${Math.max(...selectedPrices).toFixed(2)}</div>
                  </div>
                  <div style={styles.stat}>
                    <div style={styles.statLabel}>Low</div>
                    <div style={styles.statValue}>${Math.min(...selectedPrices).toFixed(2)}</div>
                  </div>
                </div>
              </div>
            )}
            <div
              draggable
              onDragStart={(e) => handleDragStart(e, stockIdx)}
              onDragOver={(e) => handleDragOver(e, stockIdx)}
              onDrop={(e) => handleDrop(e, stockIdx)}
              onDragEnd={handleDragEnd}
              style={{
                ...styles.row,
                background:
                  dragOverIdx === stockIdx
                    ? 'rgba(76,175,80,0.25)'
                    : isSelected
                    ? 'rgba(76,175,80,0.15)'
                    : 'transparent',
                opacity: dragIdx === stockIdx ? 0.5 : 1,
              }}
              onClick={() => setSelected(isSelected ? null : stock)}
            >
              <div
                style={styles.dragHandle}
                onMouseDown={(e) => e.stopPropagation()}
                title="Drag to reorder"
              >
                &#10303;
              </div>
              <div style={{ flex: 2 }}>
                <div style={styles.symbol}>{stock.symbol}</div>
                <div style={styles.name}>{stock.name}</div>
              </div>
              <div style={{ flex: 1, textAlign: 'right' }}>
                <span style={styles.price}>${stock.price.toFixed(2)}</span>
              </div>
              <div style={{ flex: 1, textAlign: 'right' }}>
                <span style={{ ...styles.change, color: trendColor }}>
                  {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%
                </span>
              </div>
              <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                {miniData && (
                  <MiniChart
                    data={miniData}
                    color={trendColor}
                  />
                )}
              </div>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
}

const spinnerKeyframes = `
@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
`;

// Inject spinner keyframes
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = spinnerKeyframes;
  document.head.appendChild(styleSheet);
}

const styles = {
  backLink: {
    display: 'inline-block',
    marginBottom: 12,
    color: '#4caf50',
    textDecoration: 'none',
    fontSize: 14,
  },
  container: {
    maxWidth: 600,
    margin: '30px auto',
    padding: 20,
    color: '#e0e0e0',
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
    color: '#fff',
    fontSize: 26,
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '60px 0',
  },
  spinner: {
    width: 40,
    height: 40,
    border: '4px solid rgba(255,255,255,0.1)',
    borderTop: '4px solid #4caf50',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
    marginBottom: 16,
  },
  loadingText: {
    color: '#aaa',
    fontSize: 14,
  },
  dataSourceBadge: {
    textAlign: 'center',
    marginBottom: 16,
  },
  badge: {
    display: 'inline-block',
    padding: '3px 12px',
    fontSize: 11,
    fontWeight: 'bold',
    borderRadius: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    flexWrap: 'wrap',
    gap: 10,
  },
  filters: {
    display: 'flex',
    gap: 8,
    flexWrap: 'wrap',
  },
  filterBtn: {
    padding: '6px 14px',
    fontSize: 13,
    border: 'none',
    borderRadius: 20,
    cursor: 'pointer',
  },
  addBtn: {
    padding: '6px 16px',
    fontSize: 13,
    border: '1px solid #4caf50',
    borderRadius: 20,
    background: 'transparent',
    color: '#4caf50',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  addForm: {
    display: 'flex',
    gap: 8,
    marginBottom: 20,
    flexWrap: 'wrap',
    padding: 16,
    background: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    border: '1px solid rgba(255,255,255,0.1)',
  },
  input: {
    flex: '1 1 120px',
    padding: '8px 12px',
    fontSize: 13,
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 8,
    background: 'rgba(255,255,255,0.08)',
    color: '#fff',
    outline: 'none',
  },
  submitBtn: {
    padding: '8px 20px',
    fontSize: 13,
    border: 'none',
    borderRadius: 8,
    background: '#4caf50',
    color: '#fff',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  chartPanel: {
    background: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    border: '1px solid rgba(255,255,255,0.1)',
  },
  chartHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  chartSymbol: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 10,
  },
  chartName: {
    fontSize: 14,
    color: '#aaa',
  },
  closeBtn: {
    background: 'none',
    border: 'none',
    color: '#aaa',
    fontSize: 18,
    cursor: 'pointer',
  },
  chartPriceRow: {
    marginBottom: 12,
  },
  chartPrice: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginRight: 12,
  },
  chartChange: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  periodRow: {
    display: 'flex',
    gap: 6,
    marginBottom: 12,
  },
  periodBtn: {
    padding: '4px 12px',
    fontSize: 12,
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 4,
    cursor: 'pointer',
  },
  chartArea: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 16,
  },
  statsRow: {
    display: 'flex',
    justifyContent: 'space-between',
    gap: 10,
  },
  stat: {
    textAlign: 'center',
    flex: 1,
  },
  statLabel: {
    fontSize: 11,
    color: '#888',
    marginBottom: 2,
  },
  statValue: {
    fontSize: 14,
    color: '#fff',
    fontWeight: 'bold',
  },
  tableHeader: {
    display: 'flex',
    padding: '10px 16px',
    fontSize: 12,
    color: '#888',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
    textTransform: 'uppercase',
    alignItems: 'center',
  },
  row: {
    display: 'flex',
    alignItems: 'center',
    padding: '12px 16px',
    borderBottom: '1px solid rgba(255,255,255,0.05)',
    cursor: 'pointer',
    borderRadius: 8,
    transition: 'background 0.2s',
  },
  dragHandle: {
    width: 30,
    fontSize: 18,
    color: '#555',
    cursor: 'grab',
    userSelect: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  symbol: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff',
  },
  name: {
    fontSize: 12,
    color: '#888',
  },
  price: {
    fontSize: 15,
    color: '#fff',
  },
  change: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  mcap: {
    fontSize: 13,
    color: '#aaa',
  },
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<StocksApp />);
