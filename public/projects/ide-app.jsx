const { useState, useCallback, useMemo, useRef, useEffect } = React;

var backLinkStyle = { color: '#8be9fd', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '8px' };
var baseStyle = { height: '100vh', background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%)', color: '#e0e0e0', fontFamily: "'Segoe UI', sans-serif", display: 'flex', flexDirection: 'column', overflow: 'hidden' };

var jsKeywords = ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'class', 'import', 'export', 'from', 'new', 'this', 'async', 'await', 'try', 'catch', 'throw', 'true', 'false', 'null', 'undefined', 'switch', 'case', 'break', 'default'];
var cssKeywords = ['color', 'background', 'display', 'flex', 'margin', 'padding', 'border', 'font', 'width', 'height', 'position'];
var htmlTags = ['div', 'span', 'html', 'body', 'head', 'script', 'style', 'link', 'meta', 'h1', 'h2', 'p', 'a', 'img', 'button'];

var fileTree = [
  { name: 'src', type: 'folder', open: true, children: [
    { name: 'index.js', type: 'file', lang: 'js' },
    { name: 'App.js', type: 'file', lang: 'js' },
    { name: 'utils.js', type: 'file', lang: 'js' },
    { name: 'components', type: 'folder', open: true, children: [
      { name: 'Header.js', type: 'file', lang: 'js' },
      { name: 'Footer.js', type: 'file', lang: 'js' }
    ]},
    { name: 'styles', type: 'folder', open: false, children: [
      { name: 'main.css', type: 'file', lang: 'css' },
      { name: 'theme.css', type: 'file', lang: 'css' }
    ]}
  ]},
  { name: 'public', type: 'folder', open: false, children: [
    { name: 'index.html', type: 'file', lang: 'html' },
    { name: 'favicon.ico', type: 'file', lang: 'other' }
  ]},
  { name: 'package.json', type: 'file', lang: 'json' },
  { name: 'README.md', type: 'file', lang: 'md' }
];

var fileContents = {
  'index.js': "import React from 'react';\nimport ReactDOM from 'react-dom/client';\nimport App from './App';\nimport './styles/main.css';\n\nconst root = ReactDOM.createRoot(\n  document.getElementById('root')\n);\n\nroot.render(\n  <React.StrictMode>\n    <App />\n  </React.StrictMode>\n);",
  'App.js': "import React, { useState } from 'react';\nimport Header from './components/Header';\nimport Footer from './components/Footer';\n\nfunction App() {\n  const [count, setCount] = useState(0);\n  const [theme, setTheme] = useState('dark');\n\n  const handleIncrement = () => {\n    setCount(prev => prev + 1);\n  };\n\n  const toggleTheme = () => {\n    setTheme(t => t === 'dark' ? 'light' : 'dark');\n  };\n\n  return (\n    <div className={`app ${theme}`}>\n      <Header theme={theme} />\n      <main>\n        <h1>Counter: {count}</h1>\n        <button onClick={handleIncrement}>\n          Increment\n        </button>\n        <button onClick={toggleTheme}>\n          Toggle Theme\n        </button>\n      </main>\n      <Footer />\n    </div>\n  );\n}\n\nexport default App;",
  'utils.js': "// Utility functions\n\nexport function debounce(func, wait) {\n  let timeout;\n  return function(...args) {\n    clearTimeout(timeout);\n    timeout = setTimeout(() => {\n      func.apply(this, args);\n    }, wait);\n  };\n}\n\nexport function formatDate(date) {\n  return new Intl.DateTimeFormat('en-US', {\n    year: 'numeric',\n    month: 'long',\n    day: 'numeric'\n  }).format(date);\n}\n\nexport function deepClone(obj) {\n  return JSON.parse(JSON.stringify(obj));\n}",
  'Header.js': "import React from 'react';\n\nfunction Header({ theme }) {\n  return (\n    <header className=\"header\">\n      <h1>My App</h1>\n      <nav>\n        <a href=\"/\">Home</a>\n        <a href=\"/about\">About</a>\n        <a href=\"/contact\">Contact</a>\n      </nav>\n      <span>Theme: {theme}</span>\n    </header>\n  );\n}\n\nexport default Header;",
  'Footer.js': "import React from 'react';\n\nfunction Footer() {\n  return (\n    <footer className=\"footer\">\n      <p>2026 My App. All rights reserved.</p>\n    </footer>\n  );\n}\n\nexport default Footer;",
  'main.css': "/* Main Styles */\n\n:root {\n  --bg-color: #0a0a1a;\n  --text-color: #e0e0e0;\n  --accent: #8be9fd;\n}\n\nbody {\n  margin: 0;\n  padding: 0;\n  font-family: 'Segoe UI', sans-serif;\n  background: var(--bg-color);\n  color: var(--text-color);\n}\n\n.app {\n  min-height: 100vh;\n  display: flex;\n  flex-direction: column;\n}\n\n.header {\n  padding: 16px 24px;\n  border-bottom: 1px solid rgba(255,255,255,0.1);\n}\n\nbutton {\n  background: var(--accent);\n  border: none;\n  padding: 8px 16px;\n  border-radius: 6px;\n  cursor: pointer;\n}",
  'theme.css': "/* Dark Theme */\n.dark {\n  --bg-color: #0a0a1a;\n  --text-color: #e0e0e0;\n}\n\n/* Light Theme */\n.light {\n  --bg-color: #f5f5f5;\n  --text-color: #1a1a1a;\n}",
  'index.html': "<!DOCTYPE html>\n<html lang=\"en\">\n<head>\n  <meta charset=\"UTF-8\">\n  <meta name=\"viewport\" content=\"width=device-width\">\n  <title>My App</title>\n  <link rel=\"stylesheet\" href=\"/styles/main.css\">\n</head>\n<body>\n  <div id=\"root\"></div>\n  <script src=\"/index.js\"></script>\n</body>\n</html>",
  'package.json': "{\n  \"name\": \"my-app\",\n  \"version\": \"1.0.0\",\n  \"private\": true,\n  \"scripts\": {\n    \"dev\": \"vite\",\n    \"build\": \"vite build\",\n    \"test\": \"vitest\"\n  },\n  \"dependencies\": {\n    \"react\": \"^19.0.0\",\n    \"react-dom\": \"^19.0.0\"\n  }\n}",
  'README.md': "# My App\n\nA simple React application.\n\n## Getting Started\n\n```bash\nnpm install\nnpm run dev\n```"
};

function highlightLine(text, lang) {
  var parts = [];
  var kws = lang === 'css' ? cssKeywords : jsKeywords;

  var commentMatch = text.match(/^(.*?)(\/\/.*)$/) || text.match(/^(.*?)(\/\*.*)$/);
  if (lang === 'css') commentMatch = text.match(/^(.*?)(\/\*.*)$/);
  var beforeComment = text;
  var commentPart = null;
  if (commentMatch) { beforeComment = commentMatch[1]; commentPart = commentMatch[2]; }

  var stringRegex = /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g;
  var segments = [];
  var lastIdx = 0;
  var match;
  while ((match = stringRegex.exec(beforeComment)) !== null) {
    if (match.index > lastIdx) segments.push({ type: 'code', text: beforeComment.substring(lastIdx, match.index) });
    segments.push({ type: 'string', text: match[0] });
    lastIdx = match.index + match[0].length;
  }
  if (lastIdx < beforeComment.length) segments.push({ type: 'code', text: beforeComment.substring(lastIdx) });
  if (commentPart) segments.push({ type: 'comment', text: commentPart });

  var idx = 0;
  segments.forEach(function (seg, si) {
    if (seg.type === 'string') {
      parts.push(React.createElement('span', { key: idx++, style: { color: '#f1fa8c' } }, seg.text));
    } else if (seg.type === 'comment') {
      parts.push(React.createElement('span', { key: idx++, style: { color: '#6272a4', fontStyle: 'italic' } }, seg.text));
    } else {
      if (lang === 'html' || lang === 'json' || lang === 'md') {
        parts.push(React.createElement('span', { key: idx++ }, seg.text));
      } else {
        var wordRegex = /([a-zA-Z_$][\w$-]*|[^a-zA-Z_$\w]+)/g;
        var wm;
        while ((wm = wordRegex.exec(seg.text)) !== null) {
          var w = wm[0];
          if (kws.indexOf(w) !== -1) {
            parts.push(React.createElement('span', { key: idx++, style: { color: '#ff79c6', fontWeight: 'bold' } }, w));
          } else if (/^\d+$/.test(w)) {
            parts.push(React.createElement('span', { key: idx++, style: { color: '#bd93f9' } }, w));
          } else {
            parts.push(React.createElement('span', { key: idx++ }, w));
          }
        }
      }
    }
  });
  return parts;
}

function App() {
  var _s1 = useState(fileTree), tree = _s1[0], setTree = _s1[1];
  var _s2 = useState([{ name: 'App.js', lang: 'js' }]), openTabs = _s2[0], setOpenTabs = _s2[1];
  var _s3 = useState('App.js'), activeFile = _s3[0], setActiveFile = _s3[1];
  var _s4 = useState(fileContents), contents = _s4[0], setContents = _s4[1];
  var _s5 = useState([
    '$ npm run dev',
    '',
    '  VITE v5.2.0  ready in 234 ms',
    '',
    '  \u279C  Local:   http://localhost:5173/',
    '  \u279C  Network: http://192.168.1.10:5173/',
    '',
    '  press h + enter to show help',
    ''
  ]), terminal = _s5[0], setTerminal = _s5[1];
  var _s6 = useState(''), termInput = _s6[0], setTermInput = _s6[1];
  var _s7 = useState(true), showTerminal = _s7[0], setShowTerminal = _s7[1];
  var termRef = useRef(null);

  var openFile = useCallback(function (name, lang) {
    setActiveFile(name);
    if (!openTabs.find(function (t) { return t.name === name; })) {
      setOpenTabs(function (prev) { return prev.concat([{ name: name, lang: lang }]); });
    }
  }, [openTabs]);

  var closeTab = useCallback(function (name, ev) {
    ev.stopPropagation();
    setOpenTabs(function (prev) {
      var next = prev.filter(function (t) { return t.name !== name; });
      if (activeFile === name && next.length > 0) { setActiveFile(next[next.length - 1].name); }
      else if (next.length === 0) setActiveFile(null);
      return next;
    });
  }, [activeFile]);

  var runCommand = useCallback(function (cmd) {
    var output = ['$ ' + cmd];
    if (cmd === 'npm run build') {
      output = output.concat(['', 'vite v5.2.0 building for production...', '\u2713 142 modules transformed.', 'dist/index.html    0.45 kB | gzip: 0.29 kB', 'dist/assets/index-abc123.js  145.22 kB | gzip: 47.85 kB', '\u2713 built in 1.82s', '']);
    } else if (cmd === 'npm test') {
      output = output.concat(['', ' \u2713 src/App.test.js (3 tests) 12ms', ' \u2713 src/utils.test.js (5 tests) 8ms', '', ' Test Files  2 passed (2)', ' Tests       8 passed (8)', ' Duration    234ms', '']);
    } else if (cmd === 'clear') {
      setTerminal([]);
      return;
    } else {
      output = output.concat(['command not found: ' + cmd, '']);
    }
    setTerminal(function (prev) { return prev.concat(output); });
  }, []);

  var handleTermKey = useCallback(function (e) {
    if (e.key === 'Enter' && termInput.trim()) {
      runCommand(termInput.trim());
      setTermInput('');
    }
  }, [termInput, runCommand]);

  useEffect(function () {
    if (termRef.current) termRef.current.scrollTop = termRef.current.scrollHeight;
  }, [terminal]);

  var currentContent = activeFile ? (contents[activeFile] || '') : '';
  var currentLang = activeFile ? (openTabs.find(function (t) { return t.name === activeFile; }) || {}).lang || 'js' : 'js';
  var lines = currentContent.split('\n');

  var toggleFolder = function (name, items) {
    return items.map(function (item) {
      if (item.type === 'folder') {
        if (item.name === name) return Object.assign({}, item, { open: !item.open });
        if (item.children) return Object.assign({}, item, { children: toggleFolder(name, item.children) });
      }
      return item;
    });
  };

  var renderTree = function (items, depth) {
    return items.map(function (item) {
      if (item.type === 'folder') {
        return React.createElement('div', { key: item.name },
          React.createElement('div', { onClick: function () { setTree(function (prev) { return toggleFolder(item.name, prev); }); }, style: { padding: '3px 0 3px ' + (depth * 16 + 8) + 'px', cursor: 'pointer', fontSize: '13px', color: '#8be9fd', display: 'flex', alignItems: 'center', gap: '4px' } },
            React.createElement('span', { style: { fontSize: '10px', width: '12px', display: 'inline-block' } }, item.open ? '\u25BC' : '\u25B6'),
            React.createElement('span', null, '\uD83D\uDCC1 ' + item.name)
          ),
          item.open && item.children && renderTree(item.children, depth + 1)
        );
      }
      var icon = '\uD83D\uDCC4';
      if (item.lang === 'js') icon = '\uD83D\uDFE8';
      if (item.lang === 'css') icon = '\uD83D\uDFE6';
      if (item.lang === 'html') icon = '\uD83D\uDFE7';
      return React.createElement('div', { key: item.name, onClick: function () { openFile(item.name, item.lang); }, style: { padding: '3px 0 3px ' + (depth * 16 + 8) + 'px', cursor: 'pointer', fontSize: '13px', color: activeFile === item.name ? '#fff' : '#aaa', background: activeFile === item.name ? 'rgba(139,233,253,0.1)' : 'transparent', display: 'flex', alignItems: 'center', gap: '4px' } },
        React.createElement('span', { style: { width: '12px' } }),
        React.createElement('span', null, icon + ' ' + item.name)
      );
    });
  };

  var minimapColors = lines.map(function (line) {
    if (line.trim().indexOf('//') === 0 || line.trim().indexOf('/*') === 0) return '#6272a4';
    if (line.indexOf('function') !== -1 || line.indexOf('class') !== -1 || line.indexOf('const') !== -1) return '#ff79c6';
    if (line.indexOf("'") !== -1 || line.indexOf('"') !== -1) return '#f1fa8c';
    if (line.trim() === '') return 'transparent';
    return '#44475a';
  });

  return React.createElement('div', { style: baseStyle },
    React.createElement('div', { style: { background: 'rgba(0,0,0,0.3)', padding: '4px 16px', display: 'flex', alignItems: 'center', gap: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)', fontSize: '13px' } },
      React.createElement('a', { href: '/projects', style: Object.assign({}, backLinkStyle, { marginBottom: 0, fontSize: '12px' }) }, '\u2190 Back to Projects'),
      React.createElement('span', { style: { color: '#8be9fd', fontWeight: 'bold' } }, 'Mini IDE'),
      React.createElement('div', { style: { display: 'flex', gap: '4px', marginLeft: 'auto' } },
        React.createElement('button', { style: { background: '#50fa7b', color: '#0a0a1a', border: 'none', padding: '4px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' }, onClick: function () { runCommand('npm run build'); } }, '\u25B6 Run'),
        React.createElement('button', { style: { background: '#8be9fd', color: '#0a0a1a', border: 'none', padding: '4px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' } }, 'Save'),
        React.createElement('button', { style: { background: '#bd93f9', color: '#0a0a1a', border: 'none', padding: '4px 12px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '11px' } }, 'New'),
        React.createElement('button', { style: { background: 'rgba(255,255,255,0.1)', color: '#ccc', border: 'none', padding: '4px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '11px' }, onClick: function () { setShowTerminal(!showTerminal); } }, 'Terminal')
      )
    ),
    React.createElement('div', { style: { display: 'flex', flex: 1, overflow: 'hidden' } },
      React.createElement('div', { style: { width: '200px', background: 'rgba(0,0,0,0.2)', borderRight: '1px solid rgba(255,255,255,0.08)', overflowY: 'auto', flexShrink: 0 } },
        React.createElement('div', { style: { padding: '8px 12px', fontSize: '11px', color: '#888', textTransform: 'uppercase', fontWeight: 'bold' } }, 'Explorer'),
        renderTree(tree, 0)
      ),
      React.createElement('div', { style: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' } },
        React.createElement('div', { style: { display: 'flex', background: 'rgba(0,0,0,0.15)', borderBottom: '1px solid rgba(255,255,255,0.08)', overflow: 'auto' } },
          openTabs.map(function (tab) {
            return React.createElement('div', { key: tab.name, onClick: function () { setActiveFile(tab.name); }, style: { padding: '6px 12px', fontSize: '12px', cursor: 'pointer', background: activeFile === tab.name ? 'rgba(255,255,255,0.05)' : 'transparent', borderRight: '1px solid rgba(255,255,255,0.05)', color: activeFile === tab.name ? '#fff' : '#888', display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap', borderTop: activeFile === tab.name ? '2px solid #8be9fd' : '2px solid transparent' } },
              React.createElement('span', null, tab.name),
              React.createElement('span', { onClick: function (ev) { closeTab(tab.name, ev); }, style: { fontSize: '14px', color: '#666', cursor: 'pointer', lineHeight: 1 } }, '\u00D7')
            );
          })
        ),
        React.createElement('div', { style: { flex: 1, display: 'flex', overflow: 'hidden' } },
          activeFile ? React.createElement('div', { style: { flex: 1, overflowY: 'auto', display: 'flex' } },
            React.createElement('div', { style: { padding: '8px 0', textAlign: 'right', color: '#555', fontSize: '12px', fontFamily: "'Fira Code', 'Consolas', monospace", minWidth: '40px', flexShrink: 0, background: 'rgba(0,0,0,0.15)', userSelect: 'none' } },
              lines.map(function (_, i) {
                return React.createElement('div', { key: i, style: { padding: '0 8px', lineHeight: '20px' } }, i + 1);
              })
            ),
            React.createElement('div', { style: { flex: 1, padding: '8px 12px', fontFamily: "'Fira Code', 'Consolas', monospace", fontSize: '13px', lineHeight: '20px', overflow: 'auto' } },
              lines.map(function (line, i) {
                return React.createElement('div', { key: i, style: { minHeight: '20px', whiteSpace: 'pre' } },
                  highlightLine(line, currentLang)
                );
              })
            ),
            React.createElement('div', { style: { width: '28px', background: 'rgba(0,0,0,0.15)', padding: '8px 2px', flexShrink: 0, overflowY: 'hidden' } },
              minimapColors.map(function (c, i) {
                return React.createElement('div', { key: i, style: { height: '3px', marginBottom: '1px', background: c, borderRadius: '1px', opacity: 0.7 } });
              })
            )
          ) : React.createElement('div', { style: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#555' } }, 'Open a file from the explorer')
        ),
        showTerminal && React.createElement('div', { style: { height: '180px', borderTop: '1px solid rgba(255,255,255,0.08)', background: 'rgba(0,0,0,0.3)', display: 'flex', flexDirection: 'column', flexShrink: 0 } },
          React.createElement('div', { style: { padding: '4px 12px', fontSize: '11px', color: '#888', borderBottom: '1px solid rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' } },
            React.createElement('span', null, 'TERMINAL'),
            React.createElement('span', { style: { cursor: 'pointer' }, onClick: function () { setShowTerminal(false); } }, '\u00D7')
          ),
          React.createElement('div', { ref: termRef, style: { flex: 1, overflowY: 'auto', padding: '8px 12px', fontFamily: "'Fira Code', 'Consolas', monospace", fontSize: '12px', lineHeight: '18px' } },
            terminal.map(function (line, i) {
              var color = '#ccc';
              if (line.indexOf('$') === 0) color = '#50fa7b';
              if (line.indexOf('\u2713') !== -1) color = '#50fa7b';
              if (line.indexOf('\u279C') !== -1) color = '#8be9fd';
              if (line.indexOf('not found') !== -1) color = '#ff5555';
              return React.createElement('div', { key: i, style: { color: color } }, line || '\u00A0');
            })
          ),
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', padding: '4px 12px', borderTop: '1px solid rgba(255,255,255,0.05)' } },
            React.createElement('span', { style: { color: '#50fa7b', fontFamily: 'monospace', fontSize: '12px', marginRight: '8px' } }, '$'),
            React.createElement('input', { style: { background: 'transparent', border: 'none', color: '#e0e0e0', fontFamily: "'Fira Code', 'Consolas', monospace", fontSize: '12px', flex: 1, outline: 'none' }, value: termInput, onChange: function (e) { setTermInput(e.target.value); }, onKeyDown: handleTermKey, placeholder: 'Type a command...' })
          )
        )
      )
    ),
    React.createElement('div', { style: { background: 'rgba(0,0,0,0.3)', padding: '2px 16px', display: 'flex', alignItems: 'center', gap: '16px', borderTop: '1px solid rgba(255,255,255,0.08)', fontSize: '11px', color: '#888' } },
      React.createElement('span', null, activeFile || 'No file'),
      React.createElement('span', null, 'Ln ' + lines.length + ', Col 1'),
      React.createElement('span', null, currentLang.toUpperCase()),
      React.createElement('span', null, 'UTF-8'),
      React.createElement('span', { style: { marginLeft: 'auto' } }, 'Spaces: 2')
    )
  );
}

var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
