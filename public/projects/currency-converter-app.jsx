const { useState, useCallback, useMemo } = React;

var backLinkStyle = { color: '#8be9fd', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '20px' };
var containerStyle = { minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%)', color: '#e0e0e0', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", padding: '30px' };
var inputStyle = { background: '#1e1e3a', border: '1px solid #3a3a5c', borderRadius: '8px', color: '#e0e0e0', padding: '10px 14px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' };
var btnStyle = { background: 'linear-gradient(135deg, #6c5ce7, #a29bfe)', border: 'none', borderRadius: '8px', color: '#fff', padding: '10px 20px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' };
var cardStyle = { background: 'rgba(30,30,58,0.8)', borderRadius: '12px', padding: '20px', border: '1px solid #2a2a4a' };

var currencies = [
  { code: 'USD', name: 'US Dollar', symbol: '$', flag: '\ud83c\uddfa\ud83c\uddf8' },
  { code: 'EUR', name: 'Euro', symbol: '\u20ac', flag: '\ud83c\uddea\ud83c\uddfa' },
  { code: 'GBP', name: 'British Pound', symbol: '\u00a3', flag: '\ud83c\uddec\ud83c\udde7' },
  { code: 'JPY', name: 'Japanese Yen', symbol: '\u00a5', flag: '\ud83c\uddef\ud83c\uddf5' },
  { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$', flag: '\ud83c\udde8\ud83c\udde6' },
  { code: 'AUD', name: 'Australian Dollar', symbol: 'A$', flag: '\ud83c\udde6\ud83c\uddfa' },
  { code: 'CHF', name: 'Swiss Franc', symbol: 'Fr', flag: '\ud83c\udde8\ud83c\udded' },
  { code: 'CNY', name: 'Chinese Yuan', symbol: '\u00a5', flag: '\ud83c\udde8\ud83c\uddf3' },
  { code: 'INR', name: 'Indian Rupee', symbol: '\u20b9', flag: '\ud83c\uddee\ud83c\uddf3' },
  { code: 'KRW', name: 'South Korean Won', symbol: '\u20a9', flag: '\ud83c\uddf0\ud83c\uddf7' },
  { code: 'BRL', name: 'Brazilian Real', symbol: 'R$', flag: '\ud83c\udde7\ud83c\uddf7' },
  { code: 'MXN', name: 'Mexican Peso', symbol: 'Mex$', flag: '\ud83c\uddf2\ud83c\uddfd' }
];

var rates = { USD: 1, EUR: 0.92, GBP: 0.79, JPY: 149.5, CAD: 1.36, AUD: 1.53, CHF: 0.88, CNY: 7.19, INR: 83.1, KRW: 1325, BRL: 4.97, MXN: 17.15 };

var historicalData = [
  { month: 'Sep', mult: 0.97 }, { month: 'Oct', mult: 0.99 }, { month: 'Nov', mult: 1.02 },
  { month: 'Dec', mult: 0.98 }, { month: 'Jan', mult: 1.01 }, { month: 'Feb', mult: 1.0 }
];

function App() {
  var _a = useState('100'), amount = _a[0], setAmount = _a[1];
  var _f = useState('USD'), fromCur = _f[0], setFromCur = _f[1];
  var _t = useState('EUR'), toCur = _t[0], setToCur = _t[1];
  var _fav = useState([{ from: 'USD', to: 'EUR' }, { from: 'GBP', to: 'JPY' }]), favs = _fav[0], setFavs = _fav[1];
  var _tab = useState('converter'), tab = _tab[0], setTab = _tab[1];

  var convert = useCallback(function(amt, from, to) {
    if (!amt || isNaN(parseFloat(amt))) return '0.00';
    var inUsd = parseFloat(amt) / rates[from];
    return (inUsd * rates[to]).toFixed(2);
  }, []);

  var converted = useMemo(function() { return convert(amount, fromCur, toCur); }, [amount, fromCur, toCur, convert]);
  var rate = useMemo(function() { return convert('1', fromCur, toCur); }, [fromCur, toCur, convert]);

  var swapCurrencies = function() { var tmp = fromCur; setFromCur(toCur); setToCur(tmp); };

  var toggleFav = function() {
    var exists = favs.some(function(f) { return f.from === fromCur && f.to === toCur; });
    if (exists) { setFavs(favs.filter(function(f) { return !(f.from === fromCur && f.to === toCur); })); }
    else { setFavs(favs.concat([{ from: fromCur, to: toCur }])); }
  };

  var isFav = favs.some(function(f) { return f.from === fromCur && f.to === toCur; });
  var getCur = function(code) { return currencies.find(function(c) { return c.code === code; }); };

  var selectStyle = Object.assign({}, inputStyle, { width: '100%', cursor: 'pointer', appearance: 'none', WebkitAppearance: 'none', paddingRight: '30px', backgroundImage: 'url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' fill=\'%23888\' viewBox=\'0 0 16 16\'%3E%3Cpath d=\'M8 11L3 6h10z\'/%3E%3C/svg%3E")', backgroundRepeat: 'no-repeat', backgroundPosition: 'right 10px center' });

  var tabBtn = function(t, label) {
    return React.createElement('button', { style: Object.assign({}, btnStyle, { background: tab === t ? 'linear-gradient(135deg, #6c5ce7, #a29bfe)' : 'transparent', border: tab === t ? 'none' : '1px solid #3a3a5c', padding: '8px 18px', fontSize: '13px' }), onClick: function() { setTab(t); } }, label);
  };

  return React.createElement('div', { style: containerStyle },
    React.createElement('a', { href: '/projects', style: backLinkStyle }, '\u2190 Back to Projects'),
    React.createElement('h1', { style: { fontSize: '32px', fontWeight: '700', marginBottom: '8px', background: 'linear-gradient(90deg, #00cec9, #6c5ce7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } }, 'Currency Converter'),
    React.createElement('p', { style: { color: '#888', marginBottom: '20px' } }, 'Convert between 12 world currencies'),

    React.createElement('div', { style: { display: 'flex', gap: '10px', marginBottom: '24px' } }, tabBtn('converter', 'Converter'), tabBtn('rates', 'Rates Table'), tabBtn('chart', 'History')),

    tab === 'converter' && React.createElement('div', null,
      React.createElement('div', { style: Object.assign({}, cardStyle, { maxWidth: '600px', marginBottom: '20px' }) },
        React.createElement('div', { style: { display: 'flex', gap: '12px', alignItems: 'flex-end', marginBottom: '20px', flexWrap: 'wrap' } },
          React.createElement('div', { style: { flex: '1', minWidth: '120px' } },
            React.createElement('label', { style: { fontSize: '12px', color: '#888', display: 'block', marginBottom: '6px' } }, 'Amount'),
            React.createElement('input', { style: Object.assign({}, inputStyle, { width: '100%', fontSize: '22px', fontWeight: '700' }), type: 'number', value: amount, onChange: function(e) { setAmount(e.target.value); } })
          ),
          React.createElement('div', { style: { flex: '1', minWidth: '140px' } },
            React.createElement('label', { style: { fontSize: '12px', color: '#888', display: 'block', marginBottom: '6px' } }, 'From'),
            React.createElement('select', { style: selectStyle, value: fromCur, onChange: function(e) { setFromCur(e.target.value); } },
              currencies.map(function(c) { return React.createElement('option', { key: c.code, value: c.code, style: { background: '#1e1e3a' } }, c.flag + ' ' + c.code + ' - ' + c.name); })
            )
          ),
          React.createElement('button', { style: Object.assign({}, btnStyle, { padding: '10px 16px', fontSize: '18px', background: '#2a2a4a', borderRadius: '50%', width: '44px', height: '44px', display: 'flex', alignItems: 'center', justifyContent: 'center' }), onClick: swapCurrencies }, '\u21c4'),
          React.createElement('div', { style: { flex: '1', minWidth: '140px' } },
            React.createElement('label', { style: { fontSize: '12px', color: '#888', display: 'block', marginBottom: '6px' } }, 'To'),
            React.createElement('select', { style: selectStyle, value: toCur, onChange: function(e) { setToCur(e.target.value); } },
              currencies.map(function(c) { return React.createElement('option', { key: c.code, value: c.code, style: { background: '#1e1e3a' } }, c.flag + ' ' + c.code + ' - ' + c.name); })
            )
          )
        ),
        React.createElement('div', { style: { textAlign: 'center', padding: '20px', background: 'rgba(108,92,231,0.1)', borderRadius: '10px', marginBottom: '16px' } },
          React.createElement('div', { style: { fontSize: '14px', color: '#888', marginBottom: '4px' } }, getCur(fromCur).flag + ' ' + amount + ' ' + fromCur + ' ='),
          React.createElement('div', { style: { fontSize: '36px', fontWeight: '700', color: '#a29bfe' } }, getCur(toCur).symbol + ' ' + converted),
          React.createElement('div', { style: { fontSize: '13px', color: '#666', marginTop: '8px' } }, '1 ' + fromCur + ' = ' + rate + ' ' + toCur)
        ),
        React.createElement('div', { style: { display: 'flex', justifyContent: 'center' } },
          React.createElement('button', { style: Object.assign({}, btnStyle, { background: isFav ? '#fd79a8' : '#2a2a4a', fontSize: '13px', padding: '8px 16px' }), onClick: toggleFav }, isFav ? '\u2605 Favorited' : '\u2606 Add to Favorites')
        )
      ),

      favs.length > 0 && React.createElement('div', { style: Object.assign({}, cardStyle, { maxWidth: '600px' }) },
        React.createElement('h3', { style: { margin: '0 0 12px 0', color: '#fd79a8', fontSize: '16px' } }, '\u2605 Favorite Pairs'),
        favs.map(function(f, i) {
          return React.createElement('div', { key: i, onClick: function() { setFromCur(f.from); setToCur(f.to); }, style: { display: 'flex', justifyContent: 'space-between', padding: '10px 14px', background: 'rgba(253,121,168,0.08)', borderRadius: '8px', marginBottom: '6px', cursor: 'pointer', alignItems: 'center' } },
            React.createElement('span', null, getCur(f.from).flag + ' ' + f.from + ' \u2192 ' + getCur(f.to).flag + ' ' + f.to),
            React.createElement('span', { style: { color: '#a29bfe', fontWeight: '600' } }, '1 ' + f.from + ' = ' + convert('1', f.from, f.to) + ' ' + f.to)
          );
        })
      )
    ),

    tab === 'rates' && React.createElement('div', { style: Object.assign({}, cardStyle, { overflowX: 'auto' }) },
      React.createElement('h3', { style: { margin: '0 0 16px 0', color: '#00cec9' } }, 'Exchange Rates (Base: ' + fromCur + ')'),
      React.createElement('table', { style: { width: '100%', borderCollapse: 'collapse' } },
        React.createElement('thead', null,
          React.createElement('tr', null,
            ['Currency', 'Code', 'Rate', '1 Unit ='].map(function(h) {
              return React.createElement('th', { key: h, style: { textAlign: 'left', padding: '10px 14px', borderBottom: '1px solid #2a2a4a', color: '#888', fontSize: '12px', textTransform: 'uppercase' } }, h);
            })
          )
        ),
        React.createElement('tbody', null,
          currencies.filter(function(c) { return c.code !== fromCur; }).map(function(c) {
            return React.createElement('tr', { key: c.code, style: { borderBottom: '1px solid #1a1a3a' } },
              React.createElement('td', { style: { padding: '10px 14px' } }, c.flag + ' ' + c.name),
              React.createElement('td', { style: { padding: '10px 14px', fontWeight: '600' } }, c.code),
              React.createElement('td', { style: { padding: '10px 14px', color: '#a29bfe', fontWeight: '600' } }, convert('1', fromCur, c.code)),
              React.createElement('td', { style: { padding: '10px 14px', color: '#888' } }, '1 ' + c.code + ' = ' + convert('1', c.code, fromCur) + ' ' + fromCur)
            );
          })
        )
      )
    ),

    tab === 'chart' && React.createElement('div', { style: Object.assign({}, cardStyle, { maxWidth: '600px' }) },
      React.createElement('h3', { style: { margin: '0 0 16px 0', color: '#00cec9' } }, fromCur + '/' + toCur + ' - 6 Month History (Mock)'),
      React.createElement('div', { style: { display: 'flex', alignItems: 'flex-end', gap: '12px', height: '200px', padding: '0 10px' } },
        historicalData.map(function(d, i) {
          var baseRate = parseFloat(rate);
          var val = (baseRate * d.mult);
          var maxVal = baseRate * 1.05;
          var pct = (val / maxVal) * 100;
          return React.createElement('div', { key: i, style: { flex: '1', display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end' } },
            React.createElement('div', { style: { fontSize: '11px', color: '#a29bfe', marginBottom: '4px', fontWeight: '600' } }, val.toFixed(2)),
            React.createElement('div', { style: { width: '100%', height: pct + '%', background: 'linear-gradient(180deg, #6c5ce7, #a29bfe)', borderRadius: '6px 6px 0 0', minHeight: '20px', transition: 'height 0.5s ease' } }),
            React.createElement('div', { style: { fontSize: '12px', color: '#888', marginTop: '8px' } }, d.month)
          );
        })
      ),
      React.createElement('div', { style: { textAlign: 'center', marginTop: '16px', color: '#666', fontSize: '12px' } }, 'Mock historical data for demonstration')
    )
  );
}

var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
