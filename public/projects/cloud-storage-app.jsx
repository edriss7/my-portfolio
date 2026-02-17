const { useState, useCallback, useMemo } = React;

var backLinkStyle = { color: '#7b8cff', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '20px' };
var containerStyle = { minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%)', color: '#e0e0e0', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", padding: '20px' };
var cardStyle = { background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px', border: '1px solid rgba(255,255,255,0.08)' };

var fileIcons = { folder: '\uD83D\uDCC1', image: '\uD83D\uDDBC', document: '\uD83D\uDCC4', video: '\uD83C\uDFA5', audio: '\uD83C\uDFB5', code: '\u2699', archive: '\uD83D\uDCE6', other: '\uD83D\uDCC3' };
function getFileIcon(type) { return fileIcons[type] || fileIcons.other; }
function formatSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1048576) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / 1048576).toFixed(1) + ' MB';
}

var initialFiles = [
  { id: 1, name: 'Documents', type: 'folder', size: 0, modified: '2026-02-15', parent: '/', starred: false },
  { id: 2, name: 'Photos', type: 'folder', size: 0, modified: '2026-02-14', parent: '/', starred: true },
  { id: 3, name: 'Projects', type: 'folder', size: 0, modified: '2026-02-10', parent: '/', starred: false },
  { id: 4, name: 'report.pdf', type: 'document', size: 2456789, modified: '2026-02-16', parent: '/', starred: true },
  { id: 5, name: 'presentation.pptx', type: 'document', size: 5678901, modified: '2026-02-15', parent: '/', starred: false },
  { id: 6, name: 'budget.xlsx', type: 'document', size: 345678, modified: '2026-02-13', parent: '/', starred: false },
  { id: 7, name: 'photo1.jpg', type: 'image', size: 3456789, modified: '2026-02-14', parent: '/Photos', starred: false },
  { id: 8, name: 'photo2.png', type: 'image', size: 4567890, modified: '2026-02-14', parent: '/Photos', starred: true },
  { id: 9, name: 'notes.txt', type: 'document', size: 12345, modified: '2026-02-16', parent: '/Documents', starred: false },
  { id: 10, name: 'resume.docx', type: 'document', size: 67890, modified: '2026-02-12', parent: '/Documents', starred: true },
  { id: 11, name: 'app.js', type: 'code', size: 23456, modified: '2026-02-10', parent: '/Projects', starred: false },
  { id: 12, name: 'styles.css', type: 'code', size: 8765, modified: '2026-02-10', parent: '/Projects', starred: false },
  { id: 13, name: 'demo.mp4', type: 'video', size: 15678901, modified: '2026-02-11', parent: '/', starred: false },
  { id: 14, name: 'song.mp3', type: 'audio', size: 4321098, modified: '2026-02-09', parent: '/', starred: false },
  { id: 15, name: 'backup.zip', type: 'archive', size: 9876543, modified: '2026-02-08', parent: '/', starred: false }
];

function App() {
  var s1 = useState(initialFiles), files = s1[0], setFiles = s1[1];
  var s2 = useState('/'), currentPath = s2[0], setCurrentPath = s2[1];
  var s3 = useState('grid'), viewMode = s3[0], setViewMode = s3[1];
  var s4 = useState(null), selectedFile = s4[0], setSelectedFile = s4[1];
  var s5 = useState(null), renaming = s5[0], setRenaming = s5[1];
  var s6 = useState(''), renameValue = s6[0], setRenameValue = s6[1];
  var s7 = useState('all'), filter = s7[0], setFilter = s7[1];
  var s8 = useState(null), contextMenu = s8[0], setContextMenu = s8[1];

  var totalStorage = 50 * 1024 * 1024;
  var usedStorage = useMemo(function() {
    return files.reduce(function(sum, f) { return sum + f.size; }, 0);
  }, [files]);

  var currentFiles = useMemo(function() {
    var filtered = files.filter(function(f) { return f.parent === currentPath; });
    if (filter === 'starred') return filtered.filter(function(f) { return f.starred; });
    if (filter === 'recent') return filtered.slice().sort(function(a, b) { return b.modified.localeCompare(a.modified); }).slice(0, 5);
    return filtered;
  }, [files, currentPath, filter]);

  var breadcrumbs = useMemo(function() {
    var parts = currentPath === '/' ? [''] : currentPath.split('/');
    var crumbs = [{ label: 'Home', path: '/' }];
    var built = '';
    for (var i = 1; i < parts.length; i++) {
      if (parts[i]) { built += '/' + parts[i]; crumbs.push({ label: parts[i], path: built }); }
    }
    return crumbs;
  }, [currentPath]);

  var openFolder = useCallback(function(name) {
    var newPath = currentPath === '/' ? '/' + name : currentPath + '/' + name;
    setCurrentPath(newPath);
    setSelectedFile(null);
    setFilter('all');
  }, [currentPath]);

  var handleUpload = useCallback(function() {
    var names = ['upload_' + Date.now() + '.txt', 'data_export.csv', 'screenshot.png', 'notes_' + Math.floor(Math.random() * 100) + '.md'];
    var types = ['document', 'document', 'image', 'document'];
    var idx = Math.floor(Math.random() * names.length);
    var newFile = { id: Date.now(), name: names[idx], type: types[idx], size: Math.floor(Math.random() * 5000000 + 10000), modified: '2026-02-17', parent: currentPath, starred: false };
    setFiles(function(p) { return p.concat([newFile]); });
  }, [currentPath]);

  var deleteFile = useCallback(function(id) {
    setFiles(function(p) { return p.filter(function(f) { return f.id !== id; }); });
    setSelectedFile(null); setContextMenu(null);
  }, []);

  var toggleStar = useCallback(function(id) {
    setFiles(function(p) { return p.map(function(f) { return f.id === id ? Object.assign({}, f, { starred: !f.starred }) : f; }); });
    setContextMenu(null);
  }, []);

  var startRename = useCallback(function(f) {
    setRenaming(f.id); setRenameValue(f.name); setContextMenu(null);
  }, []);

  var finishRename = useCallback(function() {
    if (renameValue.trim()) {
      setFiles(function(p) { return p.map(function(f) { return f.id === renaming ? Object.assign({}, f, { name: renameValue.trim() }) : f; }); });
    }
    setRenaming(null);
  }, [renaming, renameValue]);

  var handleRightClick = useCallback(function(e, file) {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, file: file });
    setSelectedFile(file.id);
  }, []);

  var usedPct = (usedStorage / totalStorage * 100).toFixed(1);

  var renderFile = function(file) {
    var isSel = selectedFile === file.id;
    var isGrid = viewMode === 'grid';

    if (isGrid) {
      return React.createElement('div', {
        key: file.id,
        onClick: function() { if (file.type === 'folder') openFolder(file.name); else setSelectedFile(file.id); },
        onContextMenu: function(e) { handleRightClick(e, file); },
        onDoubleClick: function() { if (file.type === 'folder') openFolder(file.name); },
        style: { padding: '16px', background: isSel ? 'rgba(123,140,255,0.15)' : 'rgba(255,255,255,0.03)', borderRadius: '10px', border: isSel ? '1px solid rgba(123,140,255,0.4)' : '1px solid rgba(255,255,255,0.06)', cursor: 'pointer', textAlign: 'center', transition: 'background 0.2s', position: 'relative' }
      },
        file.starred && React.createElement('span', { style: { position: 'absolute', top: '8px', right: '8px', color: '#fbbf24', fontSize: '12px' } }, '\u2605'),
        renaming === file.id ?
          React.createElement('input', { value: renameValue, onChange: function(e) { setRenameValue(e.target.value); }, onBlur: finishRename, onKeyDown: function(e) { if (e.key === 'Enter') finishRename(); }, autoFocus: true, style: { background: '#0a0a1a', color: '#e0e0e0', border: '1px solid #7b8cff', borderRadius: '4px', padding: '4px', fontSize: '12px', width: '100%', textAlign: 'center', boxSizing: 'border-box', marginTop: '8px' } }) :
          React.createElement('div', null,
            React.createElement('div', { style: { fontSize: '36px', marginBottom: '8px' } }, getFileIcon(file.type)),
            React.createElement('div', { style: { fontSize: '12px', fontWeight: '600', color: '#fff', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }, file.name),
            file.type !== 'folder' && React.createElement('div', { style: { fontSize: '11px', color: '#6b7280', marginTop: '4px' } }, formatSize(file.size))
          )
      );
    }

    return React.createElement('div', {
      key: file.id,
      onClick: function() { if (file.type === 'folder') openFolder(file.name); else setSelectedFile(file.id); },
      onContextMenu: function(e) { handleRightClick(e, file); },
      style: { display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 14px', background: isSel ? 'rgba(123,140,255,0.15)' : 'transparent', borderRadius: '8px', cursor: 'pointer', transition: 'background 0.15s', borderBottom: '1px solid rgba(255,255,255,0.04)' }
    },
      React.createElement('span', { style: { fontSize: '22px', width: '32px', textAlign: 'center' } }, getFileIcon(file.type)),
      renaming === file.id ?
        React.createElement('input', { value: renameValue, onChange: function(e) { setRenameValue(e.target.value); }, onBlur: finishRename, onKeyDown: function(e) { if (e.key === 'Enter') finishRename(); }, autoFocus: true, style: { background: '#0a0a1a', color: '#e0e0e0', border: '1px solid #7b8cff', borderRadius: '4px', padding: '4px 8px', fontSize: '13px', flex: 1 } }) :
        React.createElement('span', { style: { flex: 1, fontSize: '13px', fontWeight: '500', color: '#fff' } }, file.name),
      file.starred && React.createElement('span', { style: { color: '#fbbf24', fontSize: '14px' } }, '\u2605'),
      React.createElement('span', { style: { fontSize: '12px', color: '#6b7280', width: '80px', textAlign: 'right' } }, file.type !== 'folder' ? formatSize(file.size) : '--'),
      React.createElement('span', { style: { fontSize: '12px', color: '#6b7280', width: '100px', textAlign: 'right' } }, file.modified)
    );
  };

  return React.createElement('div', { style: containerStyle, onClick: function() { setContextMenu(null); } },
    React.createElement('a', { href: '/projects', style: backLinkStyle }, '\u2190 Back to Projects'),
    React.createElement('div', { style: { display: 'flex', gap: '20px' } },
      // Sidebar
      React.createElement('div', { style: { width: '220px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '12px' } },
        React.createElement('h2', { style: { fontSize: '24px', fontWeight: '800', color: '#fff', margin: '0 0 8px' } }, 'CloudDrive'),
        React.createElement('button', { onClick: handleUpload, style: { padding: '10px', background: '#7b8cff', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer', width: '100%' } }, '+ Upload File'),
        React.createElement('div', { style: { marginTop: '8px' } },
          [{ label: 'All Files', val: 'all' }, { label: 'Starred', val: 'starred' }, { label: 'Recent', val: 'recent' }].map(function(item) {
            return React.createElement('div', { key: item.val, onClick: function() { setFilter(item.val); setCurrentPath('/'); }, style: { padding: '8px 12px', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', color: filter === item.val ? '#7b8cff' : '#9ca3af', background: filter === item.val ? 'rgba(123,140,255,0.1)' : 'transparent', fontWeight: filter === item.val ? '600' : '400', marginBottom: '2px' } }, item.label);
          })
        ),
        React.createElement('div', { style: Object.assign({}, cardStyle, { marginTop: 'auto' }) },
          React.createElement('div', { style: { fontSize: '12px', color: '#9ca3af', marginBottom: '8px' } }, 'Storage'),
          React.createElement('div', { style: { height: '8px', background: 'rgba(0,0,0,0.3)', borderRadius: '4px', overflow: 'hidden', marginBottom: '6px' } },
            React.createElement('div', { style: { width: usedPct + '%', height: '100%', background: parseFloat(usedPct) > 80 ? '#f87171' : 'linear-gradient(90deg, #7b8cff, #4ade80)', borderRadius: '4px' } })
          ),
          React.createElement('div', { style: { fontSize: '11px', color: '#6b7280' } }, formatSize(usedStorage) + ' of ' + formatSize(totalStorage) + ' used')
        )
      ),

      // Main
      React.createElement('div', { style: { flex: 1 } },
        // Breadcrumbs + view toggle
        React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' } },
          React.createElement('div', { style: { display: 'flex', gap: '4px', alignItems: 'center', fontSize: '14px' } },
            breadcrumbs.map(function(bc, i) {
              return React.createElement('span', { key: i, style: { display: 'flex', alignItems: 'center', gap: '4px' } },
                i > 0 && React.createElement('span', { style: { color: '#4a4a6a' } }, '/'),
                React.createElement('span', { onClick: function() { setCurrentPath(bc.path); setFilter('all'); }, style: { color: i === breadcrumbs.length - 1 ? '#fff' : '#7b8cff', cursor: 'pointer', fontWeight: i === breadcrumbs.length - 1 ? '600' : '400' } }, bc.label)
              );
            })
          ),
          React.createElement('div', { style: { display: 'flex', gap: '4px' } },
            React.createElement('button', { onClick: function() { setViewMode('grid'); }, style: { padding: '6px 12px', background: viewMode === 'grid' ? 'rgba(123,140,255,0.2)' : 'transparent', color: viewMode === 'grid' ? '#7b8cff' : '#6b7280', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' } }, '\u25A6'),
            React.createElement('button', { onClick: function() { setViewMode('list'); }, style: { padding: '6px 12px', background: viewMode === 'list' ? 'rgba(123,140,255,0.2)' : 'transparent', color: viewMode === 'list' ? '#7b8cff' : '#6b7280', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' } }, '\u2630')
          )
        ),

        // File grid/list
        viewMode === 'grid' ?
          React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: '10px' } },
            currentFiles.map(renderFile)
          ) :
          React.createElement('div', null,
            React.createElement('div', { style: { display: 'flex', padding: '6px 14px', fontSize: '11px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', borderBottom: '1px solid rgba(255,255,255,0.06)' } },
              React.createElement('span', { style: { width: '32px' } }),
              React.createElement('span', { style: { flex: 1, marginLeft: '12px' } }, 'Name'),
              React.createElement('span', { style: { width: '80px', textAlign: 'right' } }, 'Size'),
              React.createElement('span', { style: { width: '100px', textAlign: 'right' } }, 'Modified')
            ),
            currentFiles.map(renderFile)
          ),

        currentFiles.length === 0 && React.createElement('div', { style: { textAlign: 'center', padding: '60px 0', color: '#6b7280' } },
          React.createElement('div', { style: { fontSize: '40px', marginBottom: '12px' } }, '\uD83D\uDCC2'),
          React.createElement('div', { style: { fontSize: '14px' } }, filter === 'starred' ? 'No starred files' : 'This folder is empty')
        )
      )
    ),

    // Context menu
    contextMenu && React.createElement('div', { style: { position: 'fixed', left: contextMenu.x + 'px', top: contextMenu.y + 'px', background: '#1e1e3a', borderRadius: '8px', boxShadow: '0 8px 32px rgba(0,0,0,0.6)', border: '1px solid rgba(255,255,255,0.1)', zIndex: 1000, padding: '4px', minWidth: '160px' } },
      [
        { label: (contextMenu.file.starred ? 'Unstar' : 'Star'), action: function() { toggleStar(contextMenu.file.id); } },
        { label: 'Rename', action: function() { startRename(contextMenu.file); } },
        { label: 'Download', action: function() { setContextMenu(null); } },
        { label: 'Share', action: function() { setContextMenu(null); } },
        { label: 'Delete', action: function() { deleteFile(contextMenu.file.id); }, color: '#f87171' }
      ].map(function(item) {
        return React.createElement('div', { key: item.label, onClick: item.action, style: { padding: '8px 14px', fontSize: '13px', cursor: 'pointer', borderRadius: '6px', color: item.color || '#e0e0e0' } }, item.label);
      })
    )
  );
}

var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
