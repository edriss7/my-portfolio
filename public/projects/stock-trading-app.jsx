const { useState, useMemo, useCallback } = React;

var backLinkStyle = { color: '#8be9fd', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '16px' };
var containerStyle = { minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%)', color: '#e0e0e0', fontFamily: "'Segoe UI', Tahoma, sans-serif", padding: '24px' };
var cardStyle = { background: 'rgba(255,255,255,0.06)', borderRadius: '12px', padding: '16px', border: '1px solid rgba(255,255,255,0.1)' };

var WATCHLIST = [
  { symbol: 'AAPL', name: 'Apple Inc.', price: 189.42, change: 2.34, pct: 1.25 },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', price: 142.68, change: -1.52, pct: -1.05 },
  { symbol: 'MSFT', name: 'Microsoft Corp.', price: 415.20, change: 5.81, pct: 1.42 },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', price: 178.35, change: -0.89, pct: -0.50 },
  { symbol: 'TSLA', name: 'Tesla Inc.', price: 248.90, change: 8.45, pct: 3.51 },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', price: 875.50, change: 12.30, pct: 1.43 },
  { symbol: 'META', name: 'Meta Platforms', price: 502.15, change: -3.20, pct: -0.63 }
];

var CANDLE_DATA = [
  { o: 182, h: 186, l: 180, c: 185 }, { o: 185, h: 188, l: 183, c: 184 },
  { o: 184, h: 187, l: 182, c: 186 }, { o: 186, h: 190, l: 185, c: 188 },
  { o: 188, h: 189, l: 184, c: 185 }, { o: 185, h: 187, l: 183, c: 186 },
  { o: 186, h: 191, l: 185, c: 190 }, { o: 190, h: 192, l: 187, c: 188 },
  { o: 188, h: 190, l: 186, c: 189 }, { o: 189, h: 193, l: 188, c: 191 },
  { o: 191, h: 194, l: 189, c: 190 }, { o: 190, h: 191, l: 186, c: 187 },
  { o: 187, h: 190, l: 185, c: 189 }, { o: 189, h: 192, l: 188, c: 190 },
  { o: 190, h: 191, l: 187, c: 189 }
];

var PORTFOLIO = [
  { symbol: 'AAPL', shares: 50, avgCost: 175.30, current: 189.42 },
  { symbol: 'MSFT', shares: 25, avgCost: 380.50, current: 415.20 },
  { symbol: 'NVDA', shares: 10, avgCost: 720.00, current: 875.50 },
  { symbol: 'TSLA', shares: 30, avgCost: 220.15, current: 248.90 },
  { symbol: 'GOOGL', shares: 40, avgCost: 135.80, current: 142.68 }
];

var HISTORY = [
  { time: '14:32', action: 'BUY', symbol: 'AAPL', qty: 10, price: 189.10, total: 1891.00 },
  { time: '13:15', action: 'SELL', symbol: 'META', qty: 5, price: 505.30, total: 2526.50 },
  { time: '11:42', action: 'BUY', symbol: 'NVDA', qty: 2, price: 870.20, total: 1740.40 },
  { time: '10:05', action: 'BUY', symbol: 'TSLA', qty: 15, price: 245.60, total: 3684.00 },
  { time: '09:35', action: 'SELL', symbol: 'GOOGL', qty: 10, price: 143.90, total: 1439.00 }
];

function App() {
  var _sel = useState('AAPL'), selected = _sel[0], setSelected = _sel[1];
  var _side = useState('buy'), side = _side[0], setSide = _side[1];
  var _type = useState('market'), orderType = _type[0], setOrderType = _type[1];
  var _qty = useState('10'), qty = _qty[0], setQty = _qty[1];
  var _price = useState('189.42'), limitPrice = _price[0], setLimitPrice = _price[1];
  var _tab = useState('portfolio'), tab = _tab[0], setTab = _tab[1];

  var selStock = WATCHLIST.find(function(w) { return w.symbol === selected; }) || WATCHLIST[0];
  var chartMin = Math.min.apply(null, CANDLE_DATA.map(function(c) { return c.l; }));
  var chartMax = Math.max.apply(null, CANDLE_DATA.map(function(c) { return c.h; }));
  var chartRange = chartMax - chartMin;

  var totalValue = PORTFOLIO.reduce(function(a, p) { return a + p.shares * p.current; }, 0);
  var totalCost = PORTFOLIO.reduce(function(a, p) { return a + p.shares * p.avgCost; }, 0);
  var totalPL = totalValue - totalCost;

  return React.createElement('div', { style: containerStyle },
    React.createElement('a', { href: '/projects', style: backLinkStyle }, '\u2190 Back to Projects'),
    React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '12px' } },
      React.createElement('div', null,
        React.createElement('h1', { style: { fontSize: '28px', fontWeight: 'bold', margin: 0, background: 'linear-gradient(90deg, #00b894, #55efc4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } }, 'Stock Trading'),
        React.createElement('p', { style: { color: '#888', margin: '4px 0 0', fontSize: '14px' } }, 'Real-time market dashboard')
      ),
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '10px' } },
        React.createElement('div', { style: { width: '10px', height: '10px', borderRadius: '50%', background: '#00b894', boxShadow: '0 0 8px #00b894' } }),
        React.createElement('span', { style: { fontSize: '13px', color: '#00b894', fontWeight: 'bold' } }, 'Market Open'),
        React.createElement('span', { style: { fontSize: '12px', color: '#888' } }, '14:32 EST')
      )
    ),

    React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '260px 1fr 280px', gap: '20px', alignItems: 'start' } },

      // Watchlist
      React.createElement('div', { style: cardStyle },
        React.createElement('h3', { style: { margin: '0 0 12px 0', fontSize: '14px', color: '#888' } }, 'Watchlist'),
        WATCHLIST.map(function(w) {
          var isUp = w.change >= 0;
          return React.createElement('div', {
            key: w.symbol, onClick: function() { setSelected(w.symbol); setLimitPrice(w.price.toFixed(2)); },
            style: { padding: '10px', borderRadius: '8px', cursor: 'pointer', marginBottom: '4px', background: selected === w.symbol ? 'rgba(0,184,148,0.1)' : 'transparent', border: selected === w.symbol ? '1px solid rgba(0,184,148,0.3)' : '1px solid transparent' }
          },
            React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } },
              React.createElement('div', null,
                React.createElement('div', { style: { fontWeight: 'bold', fontSize: '14px' } }, w.symbol),
                React.createElement('div', { style: { fontSize: '11px', color: '#888' } }, w.name)
              ),
              React.createElement('div', { style: { textAlign: 'right' } },
                React.createElement('div', { style: { fontWeight: 'bold', fontSize: '14px' } }, '$' + w.price.toFixed(2)),
                React.createElement('div', { style: { fontSize: '12px', color: isUp ? '#00b894' : '#ff6b6b' } }, (isUp ? '+' : '') + w.change.toFixed(2) + ' (' + (isUp ? '+' : '') + w.pct.toFixed(2) + '%)')
              )
            )
          );
        })
      ),

      // Chart + tabs
      React.createElement('div', null,
        React.createElement('div', { style: Object.assign({}, cardStyle, { marginBottom: '20px' }) },
          React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' } },
            React.createElement('div', null,
              React.createElement('span', { style: { fontSize: '22px', fontWeight: 'bold' } }, selStock.symbol),
              React.createElement('span', { style: { fontSize: '22px', marginLeft: '12px' } }, '$' + selStock.price.toFixed(2)),
              React.createElement('span', { style: { fontSize: '14px', marginLeft: '10px', color: selStock.change >= 0 ? '#00b894' : '#ff6b6b' } }, (selStock.change >= 0 ? '+' : '') + selStock.change.toFixed(2) + ' (' + (selStock.change >= 0 ? '+' : '') + selStock.pct.toFixed(2) + '%)')
            ),
            React.createElement('div', { style: { display: 'flex', gap: '4px' } },
              ['1D', '1W', '1M', '3M', '1Y'].map(function(p) {
                return React.createElement('button', { key: p, style: { padding: '4px 10px', borderRadius: '6px', border: 'none', fontSize: '11px', cursor: 'pointer', background: p === '1M' ? 'rgba(0,184,148,0.2)' : 'rgba(255,255,255,0.05)', color: p === '1M' ? '#00b894' : '#888' } }, p);
              })
            )
          ),
          // Candlestick chart
          React.createElement('div', { style: { display: 'flex', alignItems: 'stretch', gap: '6px', height: '200px', padding: '10px 0' } },
            CANDLE_DATA.map(function(c, i) {
              var isUp = c.c >= c.o;
              var bodyTop = ((chartMax - Math.max(c.o, c.c)) / chartRange) * 100;
              var bodyHeight = (Math.abs(c.c - c.o) / chartRange) * 100;
              var wickTop = ((chartMax - c.h) / chartRange) * 100;
              var wickBottom = ((chartMax - c.l) / chartRange) * 100;
              var color = isUp ? '#00b894' : '#ff6b6b';
              return React.createElement('div', { key: i, style: { flex: 1, position: 'relative', height: '100%' } },
                // Wick
                React.createElement('div', { style: { position: 'absolute', left: '50%', transform: 'translateX(-50%)', width: '2px', top: wickTop + '%', height: (wickBottom - wickTop) + '%', background: color } }),
                // Body
                React.createElement('div', { style: { position: 'absolute', left: '15%', width: '70%', top: bodyTop + '%', height: Math.max(bodyHeight, 1) + '%', background: isUp ? color : color, borderRadius: '2px', opacity: isUp ? 1 : 0.8 } })
              );
            })
          )
        ),

        // Tabs
        React.createElement('div', { style: { display: 'flex', gap: '8px', marginBottom: '12px' } },
          [['portfolio', 'Portfolio'], ['history', 'Trade History']].map(function(t) {
            return React.createElement('button', { key: t[0], onClick: function() { setTab(t[0]); }, style: { padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: '600', background: tab === t[0] ? '#00b894' : 'rgba(255,255,255,0.06)', color: tab === t[0] ? '#fff' : '#aaa' } }, t[1]);
          })
        ),

        tab === 'portfolio' ? React.createElement('div', { style: cardStyle },
          React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '16px' } },
            React.createElement('div', null,
              React.createElement('div', { style: { fontSize: '12px', color: '#888' } }, 'Portfolio Value'),
              React.createElement('div', { style: { fontSize: '24px', fontWeight: 'bold' } }, '$' + totalValue.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','))
            ),
            React.createElement('div', { style: { textAlign: 'right' } },
              React.createElement('div', { style: { fontSize: '12px', color: '#888' } }, 'Total P&L'),
              React.createElement('div', { style: { fontSize: '20px', fontWeight: 'bold', color: totalPL >= 0 ? '#00b894' : '#ff6b6b' } }, (totalPL >= 0 ? '+' : '') + '$' + totalPL.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','))
            )
          ),
          React.createElement('div', { style: { overflowX: 'auto' } },
            React.createElement('table', { style: { width: '100%', borderCollapse: 'collapse', fontSize: '13px' } },
              React.createElement('thead', null,
                React.createElement('tr', { style: { borderBottom: '1px solid rgba(255,255,255,0.1)' } },
                  ['Symbol', 'Shares', 'Avg Cost', 'Current', 'Value', 'P&L'].map(function(h) {
                    return React.createElement('th', { key: h, style: { padding: '8px', textAlign: 'left', color: '#888' } }, h);
                  })
                )
              ),
              React.createElement('tbody', null,
                PORTFOLIO.map(function(p) {
                  var pl = (p.current - p.avgCost) * p.shares;
                  var plPct = ((p.current - p.avgCost) / p.avgCost * 100);
                  return React.createElement('tr', { key: p.symbol, style: { borderBottom: '1px solid rgba(255,255,255,0.05)' } },
                    React.createElement('td', { style: { padding: '8px', fontWeight: 'bold' } }, p.symbol),
                    React.createElement('td', { style: { padding: '8px' } }, p.shares),
                    React.createElement('td', { style: { padding: '8px' } }, '$' + p.avgCost.toFixed(2)),
                    React.createElement('td', { style: { padding: '8px' } }, '$' + p.current.toFixed(2)),
                    React.createElement('td', { style: { padding: '8px', fontWeight: 'bold' } }, '$' + (p.shares * p.current).toFixed(2)),
                    React.createElement('td', { style: { padding: '8px', color: pl >= 0 ? '#00b894' : '#ff6b6b', fontWeight: 'bold' } }, (pl >= 0 ? '+' : '') + '$' + pl.toFixed(2) + ' (' + plPct.toFixed(1) + '%)')
                  );
                })
              )
            )
          )
        ) :
        React.createElement('div', { style: cardStyle },
          HISTORY.map(function(h, i) {
            return React.createElement('div', { key: i, style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px', borderBottom: '1px solid rgba(255,255,255,0.05)' } },
              React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '10px' } },
                React.createElement('span', { style: { padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: 'bold', background: h.action === 'BUY' ? '#00b89422' : '#ff6b6b22', color: h.action === 'BUY' ? '#00b894' : '#ff6b6b' } }, h.action),
                React.createElement('span', { style: { fontWeight: 'bold' } }, h.symbol),
                React.createElement('span', { style: { color: '#888', fontSize: '12px' } }, 'x' + h.qty + ' @ $' + h.price.toFixed(2))
              ),
              React.createElement('div', { style: { textAlign: 'right' } },
                React.createElement('div', { style: { fontWeight: 'bold' } }, '$' + h.total.toFixed(2)),
                React.createElement('div', { style: { fontSize: '11px', color: '#888' } }, h.time)
              )
            );
          })
        )
      ),

      // Order form
      React.createElement('div', { style: cardStyle },
        React.createElement('h3', { style: { margin: '0 0 16px 0', fontSize: '15px' } }, 'Place Order'),
        React.createElement('div', { style: { display: 'flex', marginBottom: '16px', borderRadius: '8px', overflow: 'hidden' } },
          React.createElement('button', { onClick: function() { setSide('buy'); }, style: { flex: 1, padding: '10px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', background: side === 'buy' ? '#00b894' : 'rgba(255,255,255,0.06)', color: side === 'buy' ? '#fff' : '#888' } }, 'Buy'),
          React.createElement('button', { onClick: function() { setSide('sell'); }, style: { flex: 1, padding: '10px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px', background: side === 'sell' ? '#ff6b6b' : 'rgba(255,255,255,0.06)', color: side === 'sell' ? '#fff' : '#888' } }, 'Sell')
        ),
        React.createElement('div', { style: { marginBottom: '12px' } },
          React.createElement('label', { style: { fontSize: '12px', color: '#888', display: 'block', marginBottom: '4px' } }, 'Symbol'),
          React.createElement('div', { style: { padding: '10px', background: 'rgba(255,255,255,0.08)', borderRadius: '8px', fontWeight: 'bold', fontSize: '16px' } }, selStock.symbol + ' - $' + selStock.price.toFixed(2))
        ),
        React.createElement('div', { style: { marginBottom: '12px' } },
          React.createElement('label', { style: { fontSize: '12px', color: '#888', display: 'block', marginBottom: '4px' } }, 'Order Type'),
          React.createElement('div', { style: { display: 'flex', gap: '6px' } },
            ['market', 'limit'].map(function(t) {
              return React.createElement('button', { key: t, onClick: function() { setOrderType(t); }, style: { flex: 1, padding: '8px', borderRadius: '6px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: '600', background: orderType === t ? (side === 'buy' ? '#00b89433' : '#ff6b6b33') : 'rgba(255,255,255,0.06)', color: orderType === t ? (side === 'buy' ? '#00b894' : '#ff6b6b') : '#888', textTransform: 'capitalize' } }, t);
            })
          )
        ),
        React.createElement('div', { style: { marginBottom: '12px' } },
          React.createElement('label', { style: { fontSize: '12px', color: '#888', display: 'block', marginBottom: '4px' } }, 'Quantity'),
          React.createElement('input', { type: 'number', value: qty, onChange: function(e) { setQty(e.target.value); }, style: { width: '100%', padding: '10px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff', fontSize: '14px', boxSizing: 'border-box' } })
        ),
        orderType === 'limit' ? React.createElement('div', { style: { marginBottom: '12px' } },
          React.createElement('label', { style: { fontSize: '12px', color: '#888', display: 'block', marginBottom: '4px' } }, 'Limit Price'),
          React.createElement('input', { type: 'number', step: '0.01', value: limitPrice, onChange: function(e) { setLimitPrice(e.target.value); }, style: { width: '100%', padding: '10px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff', fontSize: '14px', boxSizing: 'border-box' } })
        ) : null,
        React.createElement('div', { style: { padding: '12px', background: 'rgba(255,255,255,0.04)', borderRadius: '8px', marginBottom: '16px', fontSize: '13px' } },
          React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '4px' } },
            React.createElement('span', { style: { color: '#888' } }, 'Estimated Total'),
            React.createElement('span', { style: { fontWeight: 'bold' } }, '$' + (Number(qty) * (orderType === 'limit' ? Number(limitPrice) : selStock.price)).toFixed(2))
          ),
          React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between' } },
            React.createElement('span', { style: { color: '#888' } }, 'Commission'),
            React.createElement('span', { style: { color: '#00b894' } }, 'Free')
          )
        ),
        React.createElement('button', { style: { width: '100%', padding: '14px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px', background: side === 'buy' ? '#00b894' : '#ff6b6b', color: '#fff' } }, side === 'buy' ? 'Buy ' + selStock.symbol : 'Sell ' + selStock.symbol)
      )
    )
  );
}

var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
