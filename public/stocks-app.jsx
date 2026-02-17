const { useState, useRef, useEffect, useCallback } = React;

// Generate realistic-looking price history
function generatePriceHistory(basePrice, days, volatility) {
  const prices = [];
  let price = basePrice * (0.7 + Math.random() * 0.3);
  for (let i = 0; i < days; i++) {
    const change = (Math.random() - 0.48) * volatility * price;
    price = Math.max(price + change, basePrice * 0.3);
    prices.push(parseFloat(price.toFixed(2)));
  }
  // Make last price close to the current price
  const drift = (basePrice - prices[prices.length - 1]) / 10;
  for (let i = prices.length - 10; i < prices.length; i++) {
    prices[i] = parseFloat((prices[i] + drift * (i - prices.length + 11)).toFixed(2));
  }
  return prices;
}

const STOCKS = [
  { symbol: 'NVDA', name: 'NVIDIA Corp', price: 878.35, change: 2.41, marketCap: '2.16T', sector: 'Technology' },
  { symbol: 'AAPL', name: 'Apple Inc', price: 232.15, change: -0.32, marketCap: '3.58T', sector: 'Technology' },
  { symbol: 'MSFT', name: 'Microsoft Corp', price: 428.50, change: 1.15, marketCap: '3.18T', sector: 'Technology' },
  { symbol: 'GOOGL', name: 'Alphabet Inc', price: 176.80, change: 0.87, marketCap: '2.18T', sector: 'Technology' },
  { symbol: 'AMZN', name: 'Amazon.com Inc', price: 214.92, change: 1.63, marketCap: '2.23T', sector: 'Consumer' },
  { symbol: 'META', name: 'Meta Platforms', price: 582.40, change: -1.24, marketCap: '1.48T', sector: 'Technology' },
  { symbol: 'TSLA', name: 'Tesla Inc', price: 248.50, change: 3.72, marketCap: '790B', sector: 'Automotive' },
  { symbol: 'BRK.B', name: 'Berkshire Hathaway', price: 453.20, change: 0.18, marketCap: '980B', sector: 'Finance' },
  { symbol: 'JPM', name: 'JPMorgan Chase', price: 232.80, change: 0.55, marketCap: '670B', sector: 'Finance' },
  { symbol: 'V', name: 'Visa Inc', price: 295.10, change: -0.42, marketCap: '605B', sector: 'Finance' },
  { symbol: 'UNH', name: 'UnitedHealth Group', price: 548.30, change: 0.93, marketCap: '505B', sector: 'Healthcare' },
  { symbol: 'LLY', name: 'Eli Lilly', price: 792.60, change: 2.10, marketCap: '752B', sector: 'Healthcare' },
];

// Pre-generate price histories
const PRICE_HISTORIES = {};
STOCKS.forEach((s) => {
  PRICE_HISTORIES[s.symbol] = {
    '1W': generatePriceHistory(s.price, 7, 0.02),
    '1M': generatePriceHistory(s.price, 30, 0.025),
    '3M': generatePriceHistory(s.price, 90, 0.03),
    '1Y': generatePriceHistory(s.price, 365, 0.035),
  };
});

function Chart({ data, color, width, height }) {
  const canvasRef = useRef(null);

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
    const padding = { top: 30, bottom: 40, left: 60, right: 20 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    // Grid lines and labels
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '11px Arial';
    ctx.textAlign = 'right';
    const gridLines = 5;
    for (let i = 0; i <= gridLines; i++) {
      const y = padding.top + (chartH / gridLines) * i;
      const val = max - (range / gridLines) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();
      ctx.fillText('$' + val.toFixed(2), padding.left - 8, y + 4);
    }

    // X axis labels
    ctx.textAlign = 'center';
    const labelCount = Math.min(6, data.length);
    for (let i = 0; i < labelCount; i++) {
      const idx = Math.round((i / (labelCount - 1)) * (data.length - 1));
      const x = padding.left + (idx / (data.length - 1)) * chartW;
      ctx.fillText(idx + 1, x, height - 10);
    }

    // Gradient fill
    const gradient = ctx.createLinearGradient(0, padding.top, 0, padding.top + chartH);
    gradient.addColorStop(0, color + '40');
    gradient.addColorStop(1, color + '05');

    ctx.beginPath();
    data.forEach((val, i) => {
      const x = padding.left + (i / (data.length - 1)) * chartW;
      const y = padding.top + chartH - ((val - min) / range) * chartH;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    const lastX = padding.left + chartW;
    const firstX = padding.left;
    ctx.lineTo(lastX, padding.top + chartH);
    ctx.lineTo(firstX, padding.top + chartH);
    ctx.closePath();
    ctx.fillStyle = gradient;
    ctx.fill();

    // Line
    ctx.beginPath();
    data.forEach((val, i) => {
      const x = padding.left + (i / (data.length - 1)) * chartW;
      const y = padding.top + chartH - ((val - min) / range) * chartH;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    });
    ctx.strokeStyle = color;
    ctx.lineWidth = 2;
    ctx.stroke();

    // Dot on last point
    const lastY = padding.top + chartH - ((data[data.length - 1] - min) / range) * chartH;
    ctx.beginPath();
    ctx.arc(lastX, lastY, 4, 0, Math.PI * 2);
    ctx.fillStyle = color;
    ctx.fill();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 2;
    ctx.stroke();
  }, [data, color, width, height]);

  return React.createElement('canvas', {
    ref: canvasRef,
    style: { width, height },
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
  const [selected, setSelected] = useState(null);
  const [period, setPeriod] = useState('1M');
  const [filter, setFilter] = useState('All');

  const sectors = ['All', ...new Set(STOCKS.map((s) => s.sector))];
  const filtered = filter === 'All' ? STOCKS : STOCKS.filter((s) => s.sector === filter);

  return (
    <div style={styles.container}>
      <a href="/" style={styles.backLink}>&larr; Back to Home</a>
      <h1 style={styles.title}>Top Stocks</h1>

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

      {selected && (
        <div style={styles.chartPanel}>
          <div style={styles.chartHeader}>
            <div>
              <span style={styles.chartSymbol}>{selected.symbol}</span>
              <span style={styles.chartName}>{selected.name}</span>
            </div>
            <button style={styles.closeBtn} onClick={() => setSelected(null)}>&#10005;</button>
          </div>
          <div style={styles.chartPriceRow}>
            <span style={styles.chartPrice}>${selected.price.toFixed(2)}</span>
            <span style={{ ...styles.chartChange, color: selected.change >= 0 ? '#4caf50' : '#ef5350' }}>
              {selected.change >= 0 ? '+' : ''}{selected.change.toFixed(2)}%
            </span>
          </div>
          <div style={styles.periodRow}>
            {['1W', '1M', '3M', '1Y'].map((p) => (
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
              data={PRICE_HISTORIES[selected.symbol][period]}
              color={selected.change >= 0 ? '#4caf50' : '#ef5350'}
              width={460}
              height={250}
            />
          </div>
          <div style={styles.statsRow}>
            <div style={styles.stat}>
              <div style={styles.statLabel}>Market Cap</div>
              <div style={styles.statValue}>{selected.marketCap}</div>
            </div>
            <div style={styles.stat}>
              <div style={styles.statLabel}>Sector</div>
              <div style={styles.statValue}>{selected.sector}</div>
            </div>
            <div style={styles.stat}>
              <div style={styles.statLabel}>High</div>
              <div style={styles.statValue}>${Math.max(...PRICE_HISTORIES[selected.symbol][period]).toFixed(2)}</div>
            </div>
            <div style={styles.stat}>
              <div style={styles.statLabel}>Low</div>
              <div style={styles.statValue}>${Math.min(...PRICE_HISTORIES[selected.symbol][period]).toFixed(2)}</div>
            </div>
          </div>
        </div>
      )}

      <div style={styles.tableHeader}>
        <span style={{ flex: 2 }}>Stock</span>
        <span style={{ flex: 1, textAlign: 'right' }}>Price</span>
        <span style={{ flex: 1, textAlign: 'right' }}>Change</span>
        <span style={{ flex: 1, textAlign: 'center' }}>Trend</span>
        <span style={{ flex: 1, textAlign: 'right' }}>Mkt Cap</span>
      </div>

      {filtered.map((stock) => (
        <div
          key={stock.symbol}
          style={{
            ...styles.row,
            background: selected?.symbol === stock.symbol ? 'rgba(76,175,80,0.15)' : 'transparent',
          }}
          onClick={() => setSelected(stock)}
        >
          <div style={{ flex: 2 }}>
            <div style={styles.symbol}>{stock.symbol}</div>
            <div style={styles.name}>{stock.name}</div>
          </div>
          <div style={{ flex: 1, textAlign: 'right' }}>
            <span style={styles.price}>${stock.price.toFixed(2)}</span>
          </div>
          <div style={{ flex: 1, textAlign: 'right' }}>
            <span style={{ ...styles.change, color: stock.change >= 0 ? '#4caf50' : '#ef5350' }}>
              {stock.change >= 0 ? '+' : ''}{stock.change.toFixed(2)}%
            </span>
          </div>
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <MiniChart
              data={PRICE_HISTORIES[stock.symbol]['1M']}
              color={stock.change >= 0 ? '#4caf50' : '#ef5350'}
            />
          </div>
          <div style={{ flex: 1, textAlign: 'right' }}>
            <span style={styles.mcap}>{stock.marketCap}</span>
          </div>
        </div>
      ))}
    </div>
  );
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
  filters: {
    display: 'flex',
    gap: 8,
    marginBottom: 20,
    justifyContent: 'center',
    flexWrap: 'wrap',
  },
  filterBtn: {
    padding: '6px 14px',
    fontSize: 13,
    border: 'none',
    borderRadius: 20,
    cursor: 'pointer',
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
