const { useState, useCallback, useMemo } = React;

var backLinkStyle = { color: '#8be9fd', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '20px' };
var containerStyle = { minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%)', color: '#e0e0e0', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", padding: '30px' };
var inputStyle = { background: '#1e1e3a', border: '1px solid #3a3a5c', borderRadius: '8px', color: '#e0e0e0', padding: '10px 14px', fontSize: '14px', width: '100%', boxSizing: 'border-box', outline: 'none' };
var btnStyle = { background: 'linear-gradient(135deg, #6c5ce7, #a29bfe)', border: 'none', borderRadius: '8px', color: '#fff', padding: '10px 20px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' };
var cardStyle = { background: 'rgba(30,30,58,0.8)', borderRadius: '12px', padding: '16px', marginBottom: '10px', border: '1px solid #2a2a4a' };

var defaultFolders = [
  { id: 'all', name: 'All Bookmarks', icon: '\u2606', children: [] },
  { id: 'dev', name: 'Development', icon: '\u2699', children: [
    { id: 'dev-tools', name: 'Tools', icon: '\u25b8', children: [] },
    { id: 'dev-docs', name: 'Documentation', icon: '\u25b8', children: [] }
  ]},
  { id: 'design', name: 'Design', icon: '\u25c6', children: [] },
  { id: 'news', name: 'News & Blogs', icon: '\u25c8', children: [] },
  { id: 'social', name: 'Social', icon: '\u25cf', children: [] }
];

var defaultBookmarks = [
  { id: 1, url: 'https://github.com', title: 'GitHub', desc: 'Code hosting platform', folder: 'dev-tools', created: '2026-02-10' },
  { id: 2, url: 'https://react.dev', title: 'React Documentation', desc: 'Official React docs', folder: 'dev-docs', created: '2026-02-11' },
  { id: 3, url: 'https://developer.mozilla.org', title: 'MDN Web Docs', desc: 'Web technology reference', folder: 'dev-docs', created: '2026-02-12' },
  { id: 4, url: 'https://figma.com', title: 'Figma', desc: 'Collaborative design tool', folder: 'design', created: '2026-02-13' },
  { id: 5, url: 'https://news.ycombinator.com', title: 'Hacker News', desc: 'Tech news aggregator', folder: 'news', created: '2026-02-14' },
  { id: 6, url: 'https://stackoverflow.com', title: 'Stack Overflow', desc: 'Developer Q&A community', folder: 'dev', created: '2026-02-15' },
  { id: 7, url: 'https://dribbble.com', title: 'Dribbble', desc: 'Design inspiration', folder: 'design', created: '2026-02-16' },
  { id: 8, url: 'https://twitter.com', title: 'X (Twitter)', desc: 'Social media platform', folder: 'social', created: '2026-02-16' }
];

function getAllFolderIds(folders) {
  var ids = [];
  folders.forEach(function(f) { ids.push(f.id); ids = ids.concat(getAllFolderIds(f.children)); });
  return ids;
}

function App() {
  var _b = useState(defaultBookmarks), bookmarks = _b[0], setBookmarks = _b[1];
  var _f = useState(defaultFolders), folders = _f[0], setFolders = _f[1];
  var _sel = useState('all'), selFolder = _sel[0], setSelFolder = _sel[1];
  var _q = useState(''), search = _q[0], setSearch = _q[1];
  var _show = useState(false), showAdd = _show[0], setShowAdd = _show[1];
  var _nu = useState(''), newUrl = _nu[0], setNewUrl = _nu[1];
  var _nt = useState(''), newTitle = _nt[0], setNewTitle = _nt[1];
  var _nd = useState(''), newDesc = _nd[0], setNewDesc = _nd[1];
  var _nf = useState('dev'), newFolder = _nf[0], setNewFolder = _nf[1];
  var _mv = useState(null), movingId = _mv[0], setMovingId = _mv[1];
  var _exp = useState({}), expanded = _exp[0], setExpanded = _exp[1];
  var _io = useState(false), showIO = _io[0], setShowIO = _io[1];
  var _json = useState(''), jsonText = _json[0], setJsonText = _json[1];

  var allFolderIds = useMemo(function() { return getAllFolderIds(folders); }, [folders]);

  var flatFolders = useMemo(function() {
    var result = [];
    function walk(list, depth) {
      list.forEach(function(f) {
        if (f.id !== 'all') {
          result.push({ id: f.id, name: f.name, depth: depth });
          walk(f.children, depth + 1);
        }
      });
    }
    walk(folders, 0);
    return result;
  }, [folders]);

  var folderAndChildren = useCallback(function(folderId) {
    if (folderId === 'all') return allFolderIds;
    var ids = [folderId];
    function walk(list) {
      list.forEach(function(f) {
        if (f.id === folderId) { function collect(fl) { fl.children.forEach(function(c) { ids.push(c.id); collect(c); }); } collect(f); }
        else { walk(f.children); }
      });
    }
    walk(folders);
    return ids;
  }, [folders, allFolderIds]);

  var filtered = useMemo(function() {
    var folderIds = folderAndChildren(selFolder);
    return bookmarks.filter(function(b) {
      var inFolder = folderIds.indexOf(b.folder) > -1;
      var matchSearch = !search || b.title.toLowerCase().indexOf(search.toLowerCase()) > -1 || b.url.toLowerCase().indexOf(search.toLowerCase()) > -1 || b.desc.toLowerCase().indexOf(search.toLowerCase()) > -1;
      return inFolder && matchSearch;
    });
  }, [bookmarks, selFolder, search, folderAndChildren]);

  var addBookmark = function() {
    if (!newUrl.trim() || !newTitle.trim()) return;
    setBookmarks(function(p) { return p.concat([{ id: Date.now(), url: newUrl, title: newTitle, desc: newDesc, folder: newFolder, created: '2026-02-17' }]); });
    setNewUrl(''); setNewTitle(''); setNewDesc(''); setShowAdd(false);
  };

  var deleteBookmark = function(id) { setBookmarks(function(p) { return p.filter(function(b) { return b.id !== id; }); }); };

  var moveToFolder = function(bId, fId) {
    setBookmarks(function(p) { return p.map(function(b) { return b.id === bId ? Object.assign({}, b, { folder: fId }) : b; }); });
    setMovingId(null);
  };

  var toggleExpand = function(fId) { setExpanded(function(p) { var n = Object.assign({}, p); n[fId] = !n[fId]; return n; }); };

  var exportJSON = function() { setJsonText(JSON.stringify({ bookmarks: bookmarks, folders: folders }, null, 2)); setShowIO(true); };
  var importJSON = function() {
    try { var data = JSON.parse(jsonText); if (data.bookmarks) setBookmarks(data.bookmarks); setShowIO(false); }
    catch(e) { /* ignore parse errors */ }
  };

  var getFavicon = function(url) {
    var letter = 'W';
    try { letter = new URL(url).hostname.charAt(0).toUpperCase(); } catch(e) {}
    return React.createElement('div', { style: { width: '32px', height: '32px', borderRadius: '8px', background: 'linear-gradient(135deg, #6c5ce7, #a29bfe)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', fontWeight: '700', flexShrink: 0 } }, letter);
  };

  var renderFolder = function(f, depth) {
    var count = bookmarks.filter(function(b) { return folderAndChildren(f.id).indexOf(b.folder) > -1; }).length;
    var isSelected = selFolder === f.id;
    var hasChildren = f.children && f.children.length > 0;
    var isExpanded = expanded[f.id] !== false;

    return React.createElement('div', { key: f.id },
      React.createElement('div', { onClick: function() { setSelFolder(f.id); if (hasChildren) toggleExpand(f.id); }, style: { padding: '8px 12px', paddingLeft: (12 + depth * 16) + 'px', cursor: 'pointer', background: isSelected ? 'rgba(108,92,231,0.2)' : 'transparent', borderRadius: '8px', marginBottom: '2px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderLeft: isSelected ? '3px solid #6c5ce7' : '3px solid transparent', transition: 'all 0.2s' } },
        React.createElement('span', { style: { fontSize: '14px', color: isSelected ? '#a29bfe' : '#ccc' } },
          (hasChildren ? (isExpanded ? '\u25be ' : '\u25b8 ') : '  ') + f.icon + ' ' + f.name
        ),
        React.createElement('span', { style: { fontSize: '11px', color: '#666', background: '#1a1a3a', borderRadius: '10px', padding: '2px 8px' } }, count)
      ),
      hasChildren && isExpanded && f.children.map(function(c) { return renderFolder(c, depth + 1); })
    );
  };

  return React.createElement('div', { style: containerStyle },
    React.createElement('a', { href: '/projects', style: backLinkStyle }, '\u2190 Back to Projects'),
    React.createElement('h1', { style: { fontSize: '32px', fontWeight: '700', marginBottom: '8px', background: 'linear-gradient(90deg, #ffa502, #ff6b6b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } }, 'Bookmark Manager'),
    React.createElement('p', { style: { color: '#888', marginBottom: '24px' } }, 'Organize your web with folders'),

    React.createElement('div', { style: { display: 'flex', gap: '20px', flexWrap: 'wrap' } },
      // Sidebar
      React.createElement('div', { style: { width: '240px', flexShrink: 0 } },
        React.createElement('div', { style: Object.assign({}, cardStyle, { padding: '12px' }) },
          folders.map(function(f) { return renderFolder(f, 0); })
        ),
        React.createElement('div', { style: { display: 'flex', gap: '8px', marginTop: '10px' } },
          React.createElement('button', { style: Object.assign({}, btnStyle, { fontSize: '12px', padding: '8px 12px', flex: 1 }), onClick: exportJSON }, 'Export'),
          React.createElement('button', { style: Object.assign({}, btnStyle, { fontSize: '12px', padding: '8px 12px', flex: 1, background: '#2a2a4a' }), onClick: function() { setShowIO(true); setJsonText(''); } }, 'Import')
        )
      ),

      // Main content
      React.createElement('div', { style: { flex: '1', minWidth: '300px' } },
        React.createElement('div', { style: { display: 'flex', gap: '10px', marginBottom: '16px' } },
          React.createElement('input', { style: Object.assign({}, inputStyle, { flex: '1' }), placeholder: 'Search bookmarks...', value: search, onChange: function(e) { setSearch(e.target.value); } }),
          React.createElement('button', { style: btnStyle, onClick: function() { setShowAdd(!showAdd); } }, showAdd ? 'Cancel' : '+ Add')
        ),

        showAdd && React.createElement('div', { style: Object.assign({}, cardStyle, { border: '1px solid #6c5ce7', marginBottom: '16px' }) },
          React.createElement('input', { style: Object.assign({}, inputStyle, { marginBottom: '10px' }), placeholder: 'URL (https://...)', value: newUrl, onChange: function(e) { setNewUrl(e.target.value); } }),
          React.createElement('input', { style: Object.assign({}, inputStyle, { marginBottom: '10px' }), placeholder: 'Title', value: newTitle, onChange: function(e) { setNewTitle(e.target.value); } }),
          React.createElement('input', { style: Object.assign({}, inputStyle, { marginBottom: '10px' }), placeholder: 'Description', value: newDesc, onChange: function(e) { setNewDesc(e.target.value); } }),
          React.createElement('select', { style: Object.assign({}, inputStyle, { marginBottom: '12px', cursor: 'pointer' }), value: newFolder, onChange: function(e) { setNewFolder(e.target.value); } },
            flatFolders.map(function(f) { return React.createElement('option', { key: f.id, value: f.id, style: { background: '#1e1e3a' } }, '\u00a0'.repeat(f.depth * 2) + f.name); })
          ),
          React.createElement('button', { style: btnStyle, onClick: addBookmark }, 'Save Bookmark')
        ),

        showIO && React.createElement('div', { style: Object.assign({}, cardStyle, { border: '1px solid #ffa502', marginBottom: '16px' }) },
          React.createElement('h3', { style: { margin: '0 0 10px 0', color: '#ffa502', fontSize: '16px' } }, 'Import / Export JSON'),
          React.createElement('textarea', { style: Object.assign({}, inputStyle, { height: '120px', fontFamily: 'monospace', fontSize: '12px' }), value: jsonText, onChange: function(e) { setJsonText(e.target.value); } }),
          React.createElement('div', { style: { display: 'flex', gap: '8px', marginTop: '10px' } },
            React.createElement('button', { style: Object.assign({}, btnStyle, { fontSize: '12px', padding: '8px 14px' }), onClick: importJSON }, 'Import'),
            React.createElement('button', { style: Object.assign({}, btnStyle, { fontSize: '12px', padding: '8px 14px', background: '#555' }), onClick: function() { if (jsonText) { navigator.clipboard.writeText(jsonText); } } }, 'Copy'),
            React.createElement('button', { style: Object.assign({}, btnStyle, { fontSize: '12px', padding: '8px 14px', background: '#555' }), onClick: function() { setShowIO(false); } }, 'Close')
          )
        ),

        React.createElement('div', { style: { fontSize: '13px', color: '#888', marginBottom: '10px' } }, filtered.length + ' bookmarks'),

        filtered.map(function(b) {
          return React.createElement('div', { key: b.id, style: Object.assign({}, cardStyle, { display: 'flex', gap: '14px', alignItems: 'center' }) },
            getFavicon(b.url),
            React.createElement('div', { style: { flex: '1', minWidth: 0 } },
              React.createElement('div', { style: { fontWeight: '600', fontSize: '15px', color: '#fff', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, b.title),
              React.createElement('div', { style: { fontSize: '12px', color: '#6c5ce7', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, b.url),
              b.desc && React.createElement('div', { style: { fontSize: '12px', color: '#888' } }, b.desc)
            ),
            React.createElement('div', { style: { display: 'flex', gap: '6px', flexShrink: 0 } },
              movingId === b.id
                ? React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '4px' } },
                    flatFolders.map(function(f) {
                      return React.createElement('button', { key: f.id, style: { background: '#2a2a4a', border: '1px solid #3a3a5c', borderRadius: '4px', color: '#ccc', cursor: 'pointer', padding: '4px 8px', fontSize: '11px', textAlign: 'left' }, onClick: function() { moveToFolder(b.id, f.id); } }, f.name);
                    }),
                    React.createElement('button', { style: { background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '11px' }, onClick: function() { setMovingId(null); } }, 'Cancel')
                  )
                : React.createElement('div', { style: { display: 'flex', gap: '6px' } },
                    React.createElement('button', { style: { background: 'none', border: '1px solid #3a3a5c', borderRadius: '6px', color: '#888', cursor: 'pointer', padding: '4px 10px', fontSize: '12px' }, onClick: function() { setMovingId(b.id); } }, 'Move'),
                    React.createElement('button', { style: { background: 'none', border: '1px solid #ff6b6b33', borderRadius: '6px', color: '#ff6b6b', cursor: 'pointer', padding: '4px 10px', fontSize: '12px' }, onClick: function() { deleteBookmark(b.id); } }, '\u00d7')
                  )
            )
          );
        })
      )
    )
  );
}

var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
