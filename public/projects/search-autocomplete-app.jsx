const { useState, useEffect, useRef, useCallback } = React;

var dataset = [
  'JavaScript', 'TypeScript', 'Python', 'Ruby', 'Go', 'Rust', 'Swift', 'Kotlin', 'Java', 'C++',
  'React', 'Angular', 'Vue.js', 'Svelte', 'Next.js', 'Nuxt.js', 'Remix', 'Gatsby', 'Astro', 'SolidJS',
  'Node.js', 'Deno', 'Bun', 'Express', 'Fastify', 'Koa', 'NestJS', 'Django', 'Flask', 'FastAPI',
  'PostgreSQL', 'MySQL', 'MongoDB', 'Redis', 'SQLite', 'Cassandra', 'DynamoDB', 'Supabase', 'Firebase', 'PlanetScale',
  'Docker', 'Kubernetes', 'Terraform', 'AWS', 'Azure', 'Google Cloud', 'Vercel', 'Netlify', 'Railway', 'Fly.io',
  'Git', 'GitHub', 'GitLab', 'Bitbucket', 'Visual Studio Code', 'Vim', 'Neovim', 'Emacs', 'WebStorm', 'Sublime Text'
];

function App() {
  var _s = useState('');
  var query = _s[0]; var setQuery = _s[1];
  var _s2 = useState([]);
  var results = _s2[0]; var setResults = _s2[1];
  var _s3 = useState(-1);
  var activeIdx = _s3[0]; var setActiveIdx = _s3[1];
  var _s4 = useState(false);
  var showDropdown = _s4[0]; var setShowDropdown = _s4[1];
  var _s5 = useState([]);
  var history = _s5[0]; var setHistory = _s5[1];
  var _s6 = useState(null);
  var selected = _s6[0]; var setSelected = _s6[1];
  var inputRef = useRef(null);
  var dropdownRef = useRef(null);

  useEffect(function() {
    if (!query.trim()) {
      setResults([]);
      return;
    }
    var q = query.toLowerCase();
    var filtered = dataset.filter(function(item) {
      return item.toLowerCase().indexOf(q) >= 0;
    });
    setResults(filtered.slice(0, 10));
    setActiveIdx(-1);
  }, [query]);

  var selectItem = function(item) {
    setSelected(item);
    setQuery(item);
    setShowDropdown(false);
    if (history.indexOf(item) < 0) {
      setHistory(function(prev) { return [item].concat(prev).slice(0, 8); });
    }
  };

  var clearHistory = function() { setHistory([]); };

  var handleKeyDown = function(e) {
    var items = query.trim() ? results : history;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIdx(function(i) { return Math.min(i + 1, items.length - 1); });
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIdx(function(i) { return Math.max(i - 1, -1); });
    } else if (e.key === 'Enter' && activeIdx >= 0 && activeIdx < items.length) {
      e.preventDefault();
      selectItem(items[activeIdx]);
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
    }
  };

  useEffect(function() {
    var handleClick = function(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target) &&
          inputRef.current && !inputRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return function() { document.removeEventListener('mousedown', handleClick); };
  }, []);

  var highlightMatch = function(text, q) {
    if (!q.trim()) return [React.createElement('span', { key: 0 }, text)];
    var lower = text.toLowerCase();
    var idx = lower.indexOf(q.toLowerCase());
    if (idx < 0) return [React.createElement('span', { key: 0 }, text)];
    return [
      React.createElement('span', { key: 'b' }, text.slice(0, idx)),
      React.createElement('span', { key: 'm', style: { color: '#bd93f9', fontWeight: 'bold' } }, text.slice(idx, idx + q.length)),
      React.createElement('span', { key: 'a' }, text.slice(idx + q.length))
    ];
  };

  var containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%)',
    color: '#e0e0e0',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: '20px'
  };
  var backLinkStyle = { color: '#8be9fd', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '20px' };
  var wrapperStyle = { maxWidth: '560px', margin: '0 auto', position: 'relative' };
  var inputWrapperStyle = {
    display: 'flex', alignItems: 'center',
    background: 'rgba(255,255,255,0.08)',
    borderRadius: '12px',
    border: '1px solid rgba(255,255,255,0.15)',
    padding: '0 14px',
    transition: 'border-color 0.2s'
  };
  var inputFieldStyle = {
    flex: 1, padding: '14px 0', background: 'transparent',
    border: 'none', color: '#e0e0e0', fontSize: '16px', outline: 'none'
  };
  var dropdownStyle = {
    position: 'absolute', top: '100%', left: 0, right: 0,
    background: 'rgba(20,20,50,0.98)',
    borderRadius: '12px', marginTop: '6px',
    border: '1px solid rgba(255,255,255,0.1)',
    boxShadow: '0 12px 36px rgba(0,0,0,0.5)',
    maxHeight: '360px', overflowY: 'auto', zIndex: 10
  };
  var itemStyle = function(isActive) {
    return {
      padding: '12px 16px', cursor: 'pointer',
      background: isActive ? 'rgba(189,147,249,0.15)' : 'transparent',
      borderBottom: '1px solid rgba(255,255,255,0.04)',
      fontSize: '14px', display: 'flex', alignItems: 'center', gap: '10px',
      transition: 'background 0.15s'
    };
  };

  var showingHistory = !query.trim() && history.length > 0 && showDropdown;
  var showingResults = query.trim() && results.length > 0 && showDropdown;

  return React.createElement('div', { style: containerStyle },
    React.createElement('a', { href: '/projects', style: backLinkStyle }, '\u2190 Back to Projects'),
    React.createElement('h1', { style: { textAlign: 'center', fontSize: '28px', color: '#fff', marginBottom: '8px' } }, 'Search Autocomplete'),
    React.createElement('p', { style: { textAlign: 'center', color: '#888', fontSize: '14px', marginBottom: '30px' } }, 'Search ' + dataset.length + ' technologies. Try "React", "Python", or "Docker"'),
    React.createElement('div', { style: wrapperStyle },
      React.createElement('div', { style: inputWrapperStyle },
        React.createElement('span', { style: { color: '#888', marginRight: '8px', fontSize: '16px' } }, '\u2315'),
        React.createElement('input', {
          ref: inputRef,
          value: query,
          onChange: function(e) { setQuery(e.target.value); setSelected(null); setShowDropdown(true); },
          onFocus: function() { setShowDropdown(true); },
          onKeyDown: handleKeyDown,
          placeholder: 'Search technologies...',
          style: inputFieldStyle
        }),
        query && React.createElement('button', {
          onClick: function() { setQuery(''); setSelected(null); setResults([]); inputRef.current && inputRef.current.focus(); },
          style: { background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '18px', padding: '4px' }
        }, '\u00D7')
      ),
      (showingResults || showingHistory) && React.createElement('div', { style: dropdownStyle, ref: dropdownRef },
        showingHistory && React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 16px', borderBottom: '1px solid rgba(255,255,255,0.06)' } },
          React.createElement('span', { style: { fontSize: '12px', color: '#888', textTransform: 'uppercase', letterSpacing: '1px' } }, 'Recent Searches'),
          React.createElement('button', {
            onClick: clearHistory,
            style: { background: 'none', border: 'none', color: '#ff5555', cursor: 'pointer', fontSize: '12px' }
          }, 'Clear')
        ),
        (showingHistory ? history : results).map(function(item, i) {
          return React.createElement('div', {
            key: item + '-' + i,
            style: itemStyle(i === activeIdx),
            onClick: function() { selectItem(item); },
            onMouseEnter: function() { setActiveIdx(i); }
          },
            React.createElement('span', { style: { color: '#666', fontSize: '14px' } }, showingHistory ? '\u29BB' : '\u2315'),
            React.createElement('span', null, showingHistory ? item : highlightMatch(item, query))
          );
        }),
        showingResults && results.length === 0 && React.createElement('div', { style: { padding: '20px', textAlign: 'center', color: '#666' } }, 'No results found')
      )
    ),
    selected && React.createElement('div', { style: {
      maxWidth: '560px', margin: '24px auto', textAlign: 'center',
      padding: '24px',
      background: 'rgba(255,255,255,0.05)',
      borderRadius: '12px',
      border: '1px solid rgba(255,255,255,0.08)'
    } },
      React.createElement('div', { style: { fontSize: '14px', color: '#888', marginBottom: '4px' } }, 'Selected:'),
      React.createElement('div', { style: { fontSize: '20px', fontWeight: 'bold', color: '#bd93f9' } }, selected)
    ),
    React.createElement('div', { style: { maxWidth: '560px', margin: '20px auto' } },
      React.createElement('div', { style: { fontSize: '12px', color: '#666', textAlign: 'center' } },
        'Use \u2191 \u2193 arrow keys to navigate, Enter to select, Escape to close'
      )
    )
  );
}

var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
