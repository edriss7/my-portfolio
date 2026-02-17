const { useState, useCallback, useMemo } = React;

var backLinkStyle = { color: '#8be9fd', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '16px' };
var baseStyle = { minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%)', color: '#e0e0e0', fontFamily: "'Segoe UI', sans-serif", padding: '24px' };
var inputStyle = { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', padding: '8px 12px', color: '#e0e0e0', fontSize: '14px', width: '100%', boxSizing: 'border-box', marginBottom: '10px' };
var btnStyle = function (c) { return { background: c || '#8be9fd', color: '#0a0a1a', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }; };
var cardStyle = { background: 'rgba(255,255,255,0.07)', borderRadius: '8px', padding: '16px', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '16px' };

var keywords = {
  js: ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'class', 'import', 'export', 'from', 'new', 'this', 'async', 'await', 'try', 'catch', 'throw', 'switch', 'case', 'break', 'default', 'true', 'false', 'null', 'undefined', 'typeof', 'instanceof'],
  python: ['def', 'class', 'return', 'if', 'elif', 'else', 'for', 'while', 'import', 'from', 'as', 'try', 'except', 'finally', 'with', 'yield', 'lambda', 'pass', 'raise', 'True', 'False', 'None', 'in', 'not', 'and', 'or', 'is', 'self'],
  css: ['color', 'background', 'display', 'flex', 'grid', 'margin', 'padding', 'border', 'font', 'width', 'height', 'position', 'top', 'left', 'right', 'bottom', 'z-index', 'opacity', 'transform', 'transition', 'animation'],
  html: ['div', 'span', 'html', 'body', 'head', 'script', 'style', 'link', 'meta', 'title', 'h1', 'h2', 'h3', 'p', 'a', 'img', 'ul', 'li', 'form', 'input', 'button', 'table', 'tr', 'td']
};

var langColors = { JavaScript: '#f1fa8c', Python: '#50fa7b', CSS: '#ff79c6', HTML: '#ffb86c' };
var langKeys = { JavaScript: 'js', Python: 'python', CSS: 'css', HTML: 'html' };

var initialSnippets = [
  { id: 1, title: 'Debounce Function', language: 'JavaScript', code: 'function debounce(func, wait) {\n  let timeout;\n  return function executedFn(...args) {\n    const later = () => {\n      clearTimeout(timeout);\n      func(...args);\n    };\n    clearTimeout(timeout);\n    timeout = setTimeout(later, wait);\n  };\n}', tags: ['utility', 'performance'] },
  { id: 2, title: 'Fibonacci Generator', language: 'Python', code: 'def fibonacci(n):\n    if n <= 1:\n        return n\n    a, b = 0, 1\n    for _ in range(2, n + 1):\n        a, b = b, a + b\n    return b\n\n# Generate first 10 numbers\nfor i in range(10):\n    print(fibonacci(i))', tags: ['algorithm', 'math'] },
  { id: 3, title: 'Glassmorphism Card', language: 'CSS', code: '.glass-card {\n  background: rgba(255, 255, 255, 0.1);\n  backdrop-filter: blur(10px);\n  border-radius: 16px;\n  border: 1px solid rgba(255, 255, 255, 0.2);\n  padding: 24px;\n  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);\n}', tags: ['ui', 'design'] },
  { id: 4, title: 'Responsive Grid', language: 'HTML', code: '<div class="grid">\n  <div class="card">Item 1</div>\n  <div class="card">Item 2</div>\n  <div class="card">Item 3</div>\n  <div class="card">Item 4</div>\n</div>', tags: ['layout', 'responsive'] },
  { id: 5, title: 'Array Shuffle', language: 'JavaScript', code: 'function shuffle(array) {\n  const arr = [...array];\n  for (let i = arr.length - 1; i > 0; i--) {\n    const j = Math.floor(Math.random() * (i + 1));\n    [arr[i], arr[j]] = [arr[j], arr[i]];\n  }\n  return arr;\n}', tags: ['utility', 'algorithm'] }
];

function highlightCode(code, language) {
  var lang = langKeys[language] || 'js';
  var kws = keywords[lang] || [];
  var lines = code.split('\n');
  return lines.map(function (line, li) {
    var parts = [];
    var remaining = line;
    var idx = 0;
    var commentMatch = lang === 'python' ? remaining.match(/^(.*?)(#.*)$/) : remaining.match(/^(.*?)(\/\/.*)$/);
    var beforeComment = remaining;
    var commentPart = null;
    if (commentMatch) {
      beforeComment = commentMatch[1];
      commentPart = commentMatch[2];
    }
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
    segments.forEach(function (seg, si) {
      if (seg.type === 'string') {
        parts.push(React.createElement('span', { key: li + '-' + si, style: { color: '#f1fa8c' } }, seg.text));
      } else if (seg.type === 'comment') {
        parts.push(React.createElement('span', { key: li + '-' + si, style: { color: '#6272a4', fontStyle: 'italic' } }, seg.text));
      } else {
        var wordRegex = /([a-zA-Z_$][\w$-]*|[^a-zA-Z_$\w]+)/g;
        var wordMatch;
        var wi = 0;
        while ((wordMatch = wordRegex.exec(seg.text)) !== null) {
          var word = wordMatch[0];
          if (kws.indexOf(word) !== -1) {
            parts.push(React.createElement('span', { key: li + '-' + si + '-' + wi, style: { color: '#ff79c6', fontWeight: 'bold' } }, word));
          } else if (/^\d+$/.test(word)) {
            parts.push(React.createElement('span', { key: li + '-' + si + '-' + wi, style: { color: '#bd93f9' } }, word));
          } else {
            parts.push(React.createElement('span', { key: li + '-' + si + '-' + wi }, word));
          }
          wi++;
        }
      }
    });
    return React.createElement('div', { key: li, style: { minHeight: '20px' } }, parts.length > 0 ? parts : ' ');
  });
}

function App() {
  var _s1 = useState(initialSnippets), snippets = _s1[0], setSnippets = _s1[1];
  var _s2 = useState(''), search = _s2[0], setSearch = _s2[1];
  var _s3 = useState('All'), langFilter = _s3[0], setLangFilter = _s3[1];
  var _s4 = useState(false), showForm = _s4[0], setShowForm = _s4[1];
  var _s5 = useState(null), editing = _s5[0], setEditing = _s5[1];
  var _s6 = useState({ title: '', language: 'JavaScript', code: '', tags: '' }), form = _s6[0], setForm = _s6[1];
  var _s7 = useState(null), copied = _s7[0], setCopied = _s7[1];

  var filtered = useMemo(function () {
    return snippets.filter(function (s) {
      var matchLang = langFilter === 'All' || s.language === langFilter;
      var matchSearch = !search || s.title.toLowerCase().indexOf(search.toLowerCase()) !== -1 || s.tags.some(function (t) { return t.toLowerCase().indexOf(search.toLowerCase()) !== -1; });
      return matchLang && matchSearch;
    });
  }, [snippets, search, langFilter]);

  var handleSave = useCallback(function () {
    if (!form.title.trim() || !form.code.trim()) return;
    var tagsArr = form.tags.split(',').map(function (t) { return t.trim(); }).filter(Boolean);
    if (editing !== null) {
      setSnippets(function (prev) { return prev.map(function (s) { return s.id === editing ? Object.assign({}, s, { title: form.title, language: form.language, code: form.code, tags: tagsArr }) : s; }); });
      setEditing(null);
    } else {
      setSnippets(function (prev) { return [{ id: Date.now(), title: form.title, language: form.language, code: form.code, tags: tagsArr }].concat(prev); });
    }
    setForm({ title: '', language: 'JavaScript', code: '', tags: '' });
    setShowForm(false);
  }, [form, editing]);

  var startEdit = useCallback(function (snippet) {
    setForm({ title: snippet.title, language: snippet.language, code: snippet.code, tags: snippet.tags.join(', ') });
    setEditing(snippet.id);
    setShowForm(true);
  }, []);

  var deleteSnippet = useCallback(function (id) {
    setSnippets(function (prev) { return prev.filter(function (s) { return s.id !== id; }); });
  }, []);

  var copyToClipboard = useCallback(function (code, id) {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(code);
    }
    setCopied(id);
    setTimeout(function () { setCopied(null); }, 2000);
  }, []);

  var languages = ['All', 'JavaScript', 'Python', 'CSS', 'HTML'];

  return React.createElement('div', { style: baseStyle },
    React.createElement('a', { href: '/projects', style: backLinkStyle }, '\u2190 Back to Projects'),
    React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' } },
      React.createElement('h1', { style: { color: '#8be9fd', margin: 0, fontSize: '24px' } }, 'Code Snippets'),
      React.createElement('input', { style: Object.assign({}, inputStyle, { width: '250px', marginBottom: 0 }), placeholder: 'Search snippets or tags...', value: search, onChange: function (e) { setSearch(e.target.value); } }),
      React.createElement('div', { style: { display: 'flex', gap: '4px' } },
        languages.map(function (l) {
          return React.createElement('button', { key: l, onClick: function () { setLangFilter(l); }, style: { background: langFilter === l ? (langColors[l] || '#8be9fd') : 'rgba(255,255,255,0.08)', color: langFilter === l ? '#0a0a1a' : '#ccc', border: 'none', padding: '6px 14px', borderRadius: '16px', cursor: 'pointer', fontSize: '12px', fontWeight: langFilter === l ? 'bold' : 'normal' } }, l);
        })
      ),
      React.createElement('button', { style: btnStyle('#50fa7b'), onClick: function () { setShowForm(true); setEditing(null); setForm({ title: '', language: 'JavaScript', code: '', tags: '' }); } }, '+ New Snippet')
    ),
    showForm && React.createElement('div', { style: Object.assign({}, cardStyle, { maxWidth: '700px' }) },
      React.createElement('h3', { style: { margin: '0 0 12px', color: '#8be9fd' } }, editing !== null ? 'Edit Snippet' : 'New Snippet'),
      React.createElement('input', { style: inputStyle, placeholder: 'Title', value: form.title, onChange: function (e) { setForm(Object.assign({}, form, { title: e.target.value })); } }),
      React.createElement('select', { style: Object.assign({}, inputStyle, { width: 'auto' }), value: form.language, onChange: function (e) { setForm(Object.assign({}, form, { language: e.target.value })); } },
        ['JavaScript', 'Python', 'CSS', 'HTML'].map(function (l) { return React.createElement('option', { key: l, value: l }, l); })
      ),
      React.createElement('textarea', { style: Object.assign({}, inputStyle, { minHeight: '120px', fontFamily: 'monospace', resize: 'vertical' }), placeholder: 'Paste your code...', value: form.code, onChange: function (e) { setForm(Object.assign({}, form, { code: e.target.value })); } }),
      React.createElement('input', { style: inputStyle, placeholder: 'Tags (comma separated)', value: form.tags, onChange: function (e) { setForm(Object.assign({}, form, { tags: e.target.value })); } }),
      React.createElement('div', { style: { display: 'flex', gap: '8px' } },
        React.createElement('button', { style: btnStyle('#50fa7b'), onClick: handleSave }, 'Save'),
        React.createElement('button', { style: btnStyle('#ff5555'), onClick: function () { setShowForm(false); setEditing(null); } }, 'Cancel')
      )
    ),
    React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(420px, 1fr))', gap: '16px' } },
      filtered.map(function (snippet) {
        return React.createElement('div', { key: snippet.id, style: cardStyle },
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' } },
            React.createElement('span', { style: { background: langColors[snippet.language] || '#8be9fd', color: '#0a0a1a', padding: '2px 10px', borderRadius: '12px', fontSize: '11px', fontWeight: 'bold' } }, snippet.language),
            React.createElement('span', { style: { flex: 1, fontWeight: 'bold', fontSize: '15px' } }, snippet.title),
            React.createElement('button', { style: Object.assign({}, btnStyle(copied === snippet.id ? '#50fa7b' : '#8be9fd'), { padding: '4px 10px', fontSize: '11px' }), onClick: function () { copyToClipboard(snippet.code, snippet.id); } }, copied === snippet.id ? 'Copied!' : 'Copy'),
            React.createElement('button', { style: Object.assign({}, btnStyle('#bd93f9'), { padding: '4px 10px', fontSize: '11px' }), onClick: function () { startEdit(snippet); } }, 'Edit'),
            React.createElement('button', { style: Object.assign({}, btnStyle('#ff5555'), { padding: '4px 10px', fontSize: '11px' }), onClick: function () { deleteSnippet(snippet.id); } }, 'Del')
          ),
          React.createElement('div', { style: { background: 'rgba(0,0,0,0.3)', borderRadius: '6px', padding: '12px', fontFamily: "'Fira Code', 'Consolas', monospace", fontSize: '13px', lineHeight: '1.5', overflow: 'auto', maxHeight: '250px' } },
            highlightCode(snippet.code, snippet.language)
          ),
          snippet.tags.length > 0 && React.createElement('div', { style: { display: 'flex', gap: '6px', marginTop: '10px', flexWrap: 'wrap' } },
            snippet.tags.map(function (tag, i) {
              return React.createElement('span', { key: i, style: { background: 'rgba(255,255,255,0.08)', borderRadius: '10px', padding: '2px 10px', fontSize: '11px', color: '#999' } }, '#' + tag);
            })
          )
        );
      })
    ),
    filtered.length === 0 && React.createElement('div', { style: { textAlign: 'center', color: '#666', padding: '60px 0', fontSize: '16px' } }, 'No snippets found. Try a different search or filter.')
  );
}

var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
