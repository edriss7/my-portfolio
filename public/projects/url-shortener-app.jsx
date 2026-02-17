const { useState, useEffect, useRef } = React;

function generateCode() {
  var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var code = '';
  for (var i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

var initialUrls = [
  { id: 1, originalUrl: 'https://developer.mozilla.org/en-US/docs/Web/JavaScript', shortCode: 'mdn42x', clicks: 24, createdAt: '2026-02-10T10:30:00' },
  { id: 2, originalUrl: 'https://reactjs.org/docs/getting-started.html', shortCode: 'rct7Qm', clicks: 18, createdAt: '2026-02-12T14:15:00' },
  { id: 3, originalUrl: 'https://github.com/trending', shortCode: 'ghTr3n', clicks: 45, createdAt: '2026-02-14T09:00:00' }
];

function App() {
  var _s1 = useState(initialUrls);
  var urls = _s1[0], setUrls = _s1[1];
  var _s2 = useState('');
  var inputUrl = _s2[0], setInputUrl = _s2[1];
  var _s3 = useState('');
  var searchTerm = _s3[0], setSearchTerm = _s3[1];
  var _s4 = useState(null);
  var copiedId = _s4[0], setCopiedId = _s4[1];
  var _s5 = useState('');
  var error = _s5[0], setError = _s5[1];
  var nextId = useRef(4);

  function isValidUrl(str) {
    try {
      var url = new URL(str);
      return url.protocol === 'http:' || url.protocol === 'https:';
    } catch(e) {
      return false;
    }
  }

  function shortenUrl() {
    setError('');
    if (!inputUrl.trim()) {
      setError('Please enter a URL');
      return;
    }
    if (!isValidUrl(inputUrl.trim())) {
      setError('Please enter a valid URL (starting with http:// or https://)');
      return;
    }
    var code = generateCode();
    var newEntry = {
      id: nextId.current++,
      originalUrl: inputUrl.trim(),
      shortCode: code,
      clicks: 0,
      createdAt: new Date().toISOString()
    };
    setUrls(function(prev) { return [newEntry].concat(prev); });
    setInputUrl('');
  }

  function deleteUrl(id) {
    setUrls(function(prev) { return prev.filter(function(u) { return u.id !== id; }); });
  }

  function simulateClick(id) {
    setUrls(function(prev) {
      return prev.map(function(u) {
        if (u.id !== id) return u;
        return Object.assign({}, u, { clicks: u.clicks + 1 });
      });
    });
  }

  function copyToClipboard(id, shortCode) {
    var shortUrl = 'https://short.url/' + shortCode;
    navigator.clipboard.writeText(shortUrl).then(function() {
      setCopiedId(id);
      setTimeout(function() { setCopiedId(null); }, 2000);
    }).catch(function() {
      // Fallback
      var textArea = document.createElement('textarea');
      textArea.value = shortUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopiedId(id);
      setTimeout(function() { setCopiedId(null); }, 2000);
    });
  }

  function formatDate(dateStr) {
    var d = new Date(dateStr);
    return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  }

  var filteredUrls = urls.filter(function(u) {
    if (!searchTerm.trim()) return true;
    var term = searchTerm.toLowerCase();
    return u.originalUrl.toLowerCase().indexOf(term) !== -1 ||
           u.shortCode.toLowerCase().indexOf(term) !== -1;
  });

  var totalClicks = urls.reduce(function(s, u) { return s + u.clicks; }, 0);

  var styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%)',
      color: '#e0e0e0',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      padding: '0 0 40px'
    },
    backLink: { color: '#888', textDecoration: 'none', padding: '15px 20px', display: 'inline-block', fontSize: '14px' },
    header: { textAlign: 'center', fontSize: '28px', color: '#fff', margin: '0 0 25px' },
    content: { maxWidth: '750px', margin: '0 auto', padding: '0 20px' },
    statsRow: {
      display: 'flex',
      gap: '15px',
      marginBottom: '25px'
    },
    statCard: {
      flex: 1,
      background: 'rgba(255,255,255,0.06)',
      borderRadius: '12px',
      padding: '15px',
      textAlign: 'center'
    },
    statLabel: { fontSize: '12px', color: '#888', marginBottom: '4px' },
    statValue: { fontSize: '24px', fontWeight: 'bold', color: '#fff' },
    shortenBox: {
      background: 'rgba(255,255,255,0.06)',
      borderRadius: '12px',
      padding: '25px',
      marginBottom: '25px'
    },
    shortenTitle: { fontSize: '16px', fontWeight: '600', color: '#fff', marginBottom: '15px' },
    inputRow: {
      display: 'flex',
      gap: '10px',
      flexWrap: 'wrap'
    },
    input: {
      flex: '1 1 300px',
      padding: '12px 16px',
      borderRadius: '8px',
      border: '1px solid rgba(255,255,255,0.15)',
      background: 'rgba(255,255,255,0.08)',
      color: '#fff',
      fontSize: '14px',
      outline: 'none'
    },
    shortenBtn: {
      padding: '12px 24px',
      borderRadius: '8px',
      border: 'none',
      background: 'linear-gradient(135deg, #9b59b6, #3498db)',
      color: '#fff',
      fontSize: '14px',
      cursor: 'pointer',
      fontWeight: '600',
      whiteSpace: 'nowrap'
    },
    errorMsg: {
      color: '#e74c3c',
      fontSize: '13px',
      marginTop: '8px'
    },
    searchBox: {
      marginBottom: '20px'
    },
    searchInput: {
      width: '100%',
      padding: '10px 14px',
      borderRadius: '8px',
      border: '1px solid rgba(255,255,255,0.15)',
      background: 'rgba(255,255,255,0.06)',
      color: '#fff',
      fontSize: '14px',
      outline: 'none',
      boxSizing: 'border-box'
    },
    urlList: {
      display: 'flex',
      flexDirection: 'column',
      gap: '10px'
    },
    urlCard: {
      background: 'rgba(255,255,255,0.06)',
      borderRadius: '10px',
      padding: '18px',
      position: 'relative'
    },
    urlOriginal: {
      fontSize: '14px',
      color: '#aaa',
      marginBottom: '8px',
      wordBreak: 'break-all',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap'
    },
    urlShort: {
      fontSize: '16px',
      fontWeight: '600',
      color: '#3498db',
      marginBottom: '10px',
      cursor: 'pointer'
    },
    urlMeta: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px',
      flexWrap: 'wrap'
    },
    metaItem: {
      fontSize: '12px',
      color: '#888'
    },
    clickBadge: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '4px',
      padding: '3px 10px',
      borderRadius: '12px',
      background: 'rgba(46,204,113,0.15)',
      color: '#2ecc71',
      fontSize: '12px',
      fontWeight: '600'
    },
    urlActions: {
      display: 'flex',
      gap: '8px',
      marginTop: '12px'
    },
    actionBtn: {
      padding: '6px 14px',
      borderRadius: '6px',
      border: 'none',
      fontSize: '12px',
      cursor: 'pointer',
      fontWeight: '600'
    },
    copyBtn: {
      background: 'rgba(52,152,219,0.2)',
      color: '#3498db'
    },
    copiedBtn: {
      background: 'rgba(46,204,113,0.2)',
      color: '#2ecc71'
    },
    visitBtn: {
      background: 'rgba(155,89,182,0.2)',
      color: '#9b59b6'
    },
    deleteBtn: {
      background: 'rgba(231,76,60,0.2)',
      color: '#e74c3c'
    },
    emptyState: {
      textAlign: 'center',
      color: '#666',
      padding: '40px',
      fontSize: '14px'
    }
  };

  return React.createElement('div', { style: styles.container },
    React.createElement('a', { href: '/projects', style: styles.backLink }, '\u2190 Back to Projects'),
    React.createElement('h1', { style: styles.header }, 'URL Shortener'),
    React.createElement('div', { style: styles.content },
      React.createElement('div', { style: styles.statsRow },
        React.createElement('div', { style: styles.statCard },
          React.createElement('div', { style: styles.statLabel }, 'Total URLs'),
          React.createElement('div', { style: styles.statValue }, urls.length)
        ),
        React.createElement('div', { style: styles.statCard },
          React.createElement('div', { style: styles.statLabel }, 'Total Clicks'),
          React.createElement('div', { style: Object.assign({}, styles.statValue, { color: '#2ecc71' }) }, totalClicks)
        ),
        React.createElement('div', { style: styles.statCard },
          React.createElement('div', { style: styles.statLabel }, 'Avg. Clicks'),
          React.createElement('div', { style: Object.assign({}, styles.statValue, { color: '#3498db' }) },
            urls.length > 0 ? (totalClicks / urls.length).toFixed(1) : '0'
          )
        )
      ),
      React.createElement('div', { style: styles.shortenBox },
        React.createElement('div', { style: styles.shortenTitle }, 'Shorten a URL'),
        React.createElement('div', { style: styles.inputRow },
          React.createElement('input', {
            style: styles.input,
            placeholder: 'Enter a long URL (e.g. https://example.com/very/long/path)',
            value: inputUrl,
            onChange: function(e) { setInputUrl(e.target.value); setError(''); },
            onKeyDown: function(e) { if (e.key === 'Enter') shortenUrl(); }
          }),
          React.createElement('button', { style: styles.shortenBtn, onClick: shortenUrl }, 'Shorten')
        ),
        error ? React.createElement('div', { style: styles.errorMsg }, error) : null
      ),
      React.createElement('div', { style: styles.searchBox },
        React.createElement('input', {
          style: styles.searchInput,
          placeholder: 'Search URLs...',
          value: searchTerm,
          onChange: function(e) { setSearchTerm(e.target.value); }
        })
      ),
      React.createElement('div', { style: styles.urlList },
        filteredUrls.length === 0
          ? React.createElement('div', { style: styles.emptyState },
              searchTerm ? 'No URLs match your search' : 'No shortened URLs yet. Create one above!'
            )
          : filteredUrls.map(function(u) {
              var shortUrl = 'https://short.url/' + u.shortCode;
              return React.createElement('div', { key: u.id, style: styles.urlCard },
                React.createElement('div', { style: styles.urlOriginal, title: u.originalUrl }, u.originalUrl),
                React.createElement('div', {
                  style: styles.urlShort,
                  onClick: function() { simulateClick(u.id); },
                  title: 'Click to simulate a visit'
                }, shortUrl),
                React.createElement('div', { style: styles.urlMeta },
                  React.createElement('span', { style: styles.clickBadge }, '📊 ' + u.clicks + ' clicks'),
                  React.createElement('span', { style: styles.metaItem }, 'Created: ' + formatDate(u.createdAt)),
                  React.createElement('span', { style: styles.metaItem }, 'Code: ' + u.shortCode)
                ),
                React.createElement('div', { style: styles.urlActions },
                  React.createElement('button', {
                    style: Object.assign({}, styles.actionBtn, copiedId === u.id ? styles.copiedBtn : styles.copyBtn),
                    onClick: function() { copyToClipboard(u.id, u.shortCode); }
                  }, copiedId === u.id ? '\u2713 Copied!' : 'Copy'),
                  React.createElement('button', {
                    style: Object.assign({}, styles.actionBtn, styles.visitBtn),
                    onClick: function() { simulateClick(u.id); }
                  }, 'Simulate Visit'),
                  React.createElement('button', {
                    style: Object.assign({}, styles.actionBtn, styles.deleteBtn),
                    onClick: function() { deleteUrl(u.id); }
                  }, 'Delete')
                )
              );
            })
      )
    )
  );
}

var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
