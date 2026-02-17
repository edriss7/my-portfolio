const { useState, useEffect, useRef, useCallback } = React;

var backLinkStyle = { color: '#7b8cff', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '20px' };
var containerStyle = { minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%)', color: '#e0e0e0', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", padding: '20px' };
var cardStyle = { background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px', border: '1px solid rgba(255,255,255,0.08)' };

var countries = [
  { name: 'United States', code: 'US', flag: '\uD83C\uDDFA\uD83C\uDDF8' },
  { name: 'United Kingdom', code: 'UK', flag: '\uD83C\uDDEC\uD83C\uDDE7' },
  { name: 'Germany', code: 'DE', flag: '\uD83C\uDDE9\uD83C\uDDEA' },
  { name: 'Japan', code: 'JP', flag: '\uD83C\uDDEF\uD83C\uDDF5' },
  { name: 'Brazil', code: 'BR', flag: '\uD83C\uDDE7\uD83C\uDDF7' },
  { name: 'India', code: 'IN', flag: '\uD83C\uDDEE\uD83C\uDDF3' },
  { name: 'Canada', code: 'CA', flag: '\uD83C\uDDE8\uD83C\uDDE6' },
  { name: 'Australia', code: 'AU', flag: '\uD83C\uDDE6\uD83C\uDDFA' }
];

var topPages = [
  { path: '/home', views: 4521, bounce: '32%' },
  { path: '/products', views: 3890, bounce: '28%' },
  { path: '/about', views: 2156, bounce: '45%' },
  { path: '/blog/react-tips', views: 1987, bounce: '22%' },
  { path: '/pricing', views: 1654, bounce: '38%' },
  { path: '/docs/api', views: 1432, bounce: '18%' },
  { path: '/contact', views: 987, bounce: '52%' },
  { path: '/blog/css-guide', views: 876, bounce: '25%' }
];

var eventTypes = ['Page View', 'Click', 'Scroll', 'Form Submit', 'Purchase', 'Sign Up', 'Download', 'Share'];
var eventColors = { 'Page View': '#7b8cff', 'Click': '#4ade80', 'Scroll': '#6b7280', 'Form Submit': '#fbbf24', 'Purchase': '#f87171', 'Sign Up': '#a78bfa', 'Download': '#38bdf8', 'Share': '#f0abfc' };

function randInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function App() {
  var s1 = useState(1247), visitors = s1[0], setVisitors = s1[1];
  var s2 = useState(function() {
    var bars = [];
    for (var i = 0; i < 30; i++) bars.push(randInt(40, 200));
    return bars;
  }), chartData = s2[0], setChartData = s2[1];
  var s3 = useState(function() {
    return countries.map(function(c) { return Object.assign({}, c, { count: randInt(50, 500) }); });
  }), geoData = s3[0], setGeoData = s3[1];
  var s4 = useState([]), events = s4[0], setEvents = s4[1];
  var s5 = useState({ avg: '4:32', median: '3:15', p90: '8:45' }), sessionStats = s5[0], setSessionStats = s5[1];
  var s6 = useState(38456), totalPageViews = s6[0], setTotalPageViews = s6[1];
  var tickRef = useRef(0);

  useEffect(function() {
    var timer = setInterval(function() {
      tickRef.current++;

      // Update visitors
      setVisitors(function(v) { return Math.max(100, v + randInt(-15, 20)); });

      // Update chart
      setChartData(function(prev) {
        var next = prev.slice(1);
        next.push(randInt(40, 200));
        return next;
      });

      // Update geo
      setGeoData(function(prev) {
        return prev.map(function(c) {
          return Object.assign({}, c, { count: Math.max(10, c.count + randInt(-5, 8)) });
        });
      });

      // Add event
      var evType = eventTypes[randInt(0, eventTypes.length - 1)];
      var paths = ['/home', '/products', '/pricing', '/blog', '/docs', '/about'];
      var newEvent = {
        id: Date.now() + Math.random(),
        type: evType,
        path: paths[randInt(0, paths.length - 1)],
        time: new Date().toLocaleTimeString(),
        user: 'user_' + randInt(1000, 9999)
      };
      setEvents(function(prev) { return [newEvent].concat(prev).slice(0, 20); });

      // Update total views
      setTotalPageViews(function(v) { return v + randInt(1, 5); });

      // Occasionally update session stats
      if (tickRef.current % 5 === 0) {
        setSessionStats({
          avg: randInt(3, 6) + ':' + (randInt(10, 59)),
          median: randInt(2, 4) + ':' + (randInt(10, 59)),
          p90: randInt(7, 12) + ':' + (randInt(10, 59))
        });
      }
    }, 1000);
    return function() { clearInterval(timer); };
  }, []);

  var maxChart = Math.max.apply(null, chartData.concat([1]));
  var totalGeo = geoData.reduce(function(s, c) { return s + c.count; }, 0);

  return React.createElement('div', { style: containerStyle },
    React.createElement('a', { href: '/projects', style: backLinkStyle }, '\u2190 Back to Projects'),
    React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' } },
      React.createElement('h1', { style: { fontSize: '28px', fontWeight: '800', color: '#fff', margin: 0 } }, 'Live Analytics'),
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
        React.createElement('div', { style: { width: '8px', height: '8px', borderRadius: '50%', background: '#4ade80', animation: 'pulse 2s infinite' } }),
        React.createElement('span', { style: { fontSize: '13px', color: '#4ade80', fontWeight: '600' } }, 'Live')
      )
    ),

    // Top metrics
    React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '16px' } },
      [
        { label: 'Active Visitors', value: visitors.toLocaleString(), color: '#7b8cff', delta: '+12%' },
        { label: 'Page Views Today', value: totalPageViews.toLocaleString(), color: '#4ade80', delta: '+8%' },
        { label: 'Avg Session', value: sessionStats.avg, color: '#fbbf24', delta: '+3%' },
        { label: 'Bounce Rate', value: '34.2%', color: '#f87171', delta: '-2%' }
      ].map(function(m) {
        return React.createElement('div', { key: m.label, style: cardStyle },
          React.createElement('div', { style: { fontSize: '12px', color: '#9ca3af', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.5px' } }, m.label),
          React.createElement('div', { style: { display: 'flex', alignItems: 'baseline', gap: '8px' } },
            React.createElement('span', { style: { fontSize: '28px', fontWeight: '800', color: m.color } }, m.value),
            React.createElement('span', { style: { fontSize: '12px', color: m.delta.startsWith('+') ? '#4ade80' : '#f87171', fontWeight: '600' } }, m.delta)
          )
        );
      })
    ),

    React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '16px', marginBottom: '16px' } },
      // Page Views Chart
      React.createElement('div', { style: cardStyle },
        React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '12px' } },
          React.createElement('h3', { style: { margin: 0, fontSize: '16px', color: '#fff' } }, 'Page Views (Last 30s)'),
          React.createElement('span', { style: { fontSize: '12px', color: '#9ca3af' } }, 'Updates every second')
        ),
        React.createElement('div', { style: { display: 'flex', alignItems: 'flex-end', gap: '2px', height: '160px', padding: '0 4px' } },
          chartData.map(function(val, i) {
            var h = Math.max(4, (val / maxChart) * 100);
            var isLast = i === chartData.length - 1;
            return React.createElement('div', { key: i, style: { flex: 1, height: h + '%', background: isLast ? '#7b8cff' : 'rgba(123,140,255,0.5)', borderRadius: '2px 2px 0 0', transition: 'height 0.3s ease', minWidth: '4px' } });
          })
        )
      ),

      // Geographic Distribution
      React.createElement('div', { style: cardStyle },
        React.createElement('h3', { style: { margin: '0 0 12px', fontSize: '16px', color: '#fff' } }, 'Geographic Distribution'),
        React.createElement('div', { style: { overflow: 'auto', maxHeight: '180px' } },
          geoData.slice().sort(function(a, b) { return b.count - a.count; }).map(function(c) {
            var pct = (c.count / totalGeo * 100).toFixed(1);
            return React.createElement('div', { key: c.code, style: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' } },
              React.createElement('span', { style: { fontSize: '16px', width: '24px' } }, c.flag),
              React.createElement('span', { style: { fontSize: '12px', width: '40px', color: '#9ca3af' } }, c.code),
              React.createElement('div', { style: { flex: 1, height: '6px', background: 'rgba(0,0,0,0.3)', borderRadius: '3px', overflow: 'hidden' } },
                React.createElement('div', { style: { width: pct + '%', height: '100%', background: '#7b8cff', borderRadius: '3px', transition: 'width 0.5s' } })
              ),
              React.createElement('span', { style: { fontSize: '12px', color: '#fff', fontWeight: '600', width: '36px', textAlign: 'right' } }, c.count)
            );
          })
        )
      )
    ),

    React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' } },
      // Top Pages
      React.createElement('div', { style: cardStyle },
        React.createElement('h3', { style: { margin: '0 0 12px', fontSize: '16px', color: '#fff' } }, 'Top Pages'),
        React.createElement('div', { style: { fontSize: '11px', color: '#6b7280', display: 'flex', padding: '4px 0', borderBottom: '1px solid rgba(255,255,255,0.06)', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' } },
          React.createElement('span', { style: { flex: 1 } }, 'Page'),
          React.createElement('span', { style: { width: '60px', textAlign: 'right' } }, 'Views'),
          React.createElement('span', { style: { width: '50px', textAlign: 'right' } }, 'Bounce')
        ),
        topPages.map(function(page) {
          return React.createElement('div', { key: page.path, style: { display: 'flex', alignItems: 'center', padding: '5px 0', borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '12px' } },
            React.createElement('span', { style: { flex: 1, color: '#7b8cff', fontFamily: 'monospace' } }, page.path),
            React.createElement('span', { style: { width: '60px', textAlign: 'right', color: '#fff', fontWeight: '600' } }, page.views.toLocaleString()),
            React.createElement('span', { style: { width: '50px', textAlign: 'right', color: '#9ca3af' } }, page.bounce)
          );
        })
      ),

      // Session Duration Stats
      React.createElement('div', { style: cardStyle },
        React.createElement('h3', { style: { margin: '0 0 12px', fontSize: '16px', color: '#fff' } }, 'Session Duration'),
        React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '12px' } },
          [
            { label: 'Average', value: sessionStats.avg, color: '#7b8cff' },
            { label: 'Median', value: sessionStats.median, color: '#4ade80' },
            { label: '90th Percentile', value: sessionStats.p90, color: '#fbbf24' }
          ].map(function(stat) {
            return React.createElement('div', { key: stat.label },
              React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '6px' } },
                React.createElement('span', { style: { fontSize: '12px', color: '#9ca3af' } }, stat.label),
                React.createElement('span', { style: { fontSize: '16px', fontWeight: '700', color: stat.color, fontFamily: 'monospace' } }, stat.value)
              ),
              React.createElement('div', { style: { height: '4px', background: 'rgba(0,0,0,0.3)', borderRadius: '2px' } },
                React.createElement('div', { style: { width: randInt(30, 80) + '%', height: '100%', background: stat.color, borderRadius: '2px' } })
              )
            );
          })
        ),
        React.createElement('div', { style: { marginTop: '20px', padding: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', textAlign: 'center' } },
          React.createElement('div', { style: { fontSize: '11px', color: '#9ca3af', marginBottom: '4px' } }, 'Active Sessions'),
          React.createElement('div', { style: { fontSize: '32px', fontWeight: '800', color: '#fff' } }, Math.floor(visitors * 0.7))
        )
      ),

      // Live Event Feed
      React.createElement('div', { style: Object.assign({}, cardStyle, { overflow: 'hidden' }) },
        React.createElement('h3', { style: { margin: '0 0 12px', fontSize: '16px', color: '#fff' } }, 'Live Event Feed'),
        React.createElement('div', { style: { maxHeight: '280px', overflow: 'auto' } },
          events.map(function(ev) {
            return React.createElement('div', { key: ev.id, style: { display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '11px' } },
              React.createElement('div', { style: { width: '6px', height: '6px', borderRadius: '50%', background: eventColors[ev.type] || '#6b7280', flexShrink: 0 } }),
              React.createElement('span', { style: { color: eventColors[ev.type] || '#9ca3af', fontWeight: '600', width: '70px', flexShrink: 0 } }, ev.type),
              React.createElement('span', { style: { color: '#6b7280', fontFamily: 'monospace', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, ev.path),
              React.createElement('span', { style: { color: '#4a4a6a', fontSize: '10px', flexShrink: 0 } }, ev.time)
            );
          }),
          events.length === 0 && React.createElement('div', { style: { color: '#6b7280', textAlign: 'center', padding: '20px', fontSize: '12px' } }, 'Waiting for events...')
        )
      )
    )
  );
}

var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
