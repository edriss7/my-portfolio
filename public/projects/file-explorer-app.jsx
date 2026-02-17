const { useState, useEffect, useRef } = React;

var initialFileSystem = {
  name: 'root',
  type: 'folder',
  children: [
    {
      name: 'Documents',
      type: 'folder',
      children: [
        { name: 'resume.pdf', type: 'document', size: '245 KB', modified: '2026-02-10' },
        { name: 'notes.txt', type: 'document', size: '12 KB', modified: '2026-02-15' },
        {
          name: 'Projects',
          type: 'folder',
          children: [
            { name: 'proposal.docx', type: 'document', size: '89 KB', modified: '2026-01-28' },
            { name: 'budget.xlsx', type: 'document', size: '34 KB', modified: '2026-02-01' }
          ]
        }
      ]
    },
    {
      name: 'Photos',
      type: 'folder',
      children: [
        { name: 'vacation.jpg', type: 'image', size: '3.2 MB', modified: '2026-01-15' },
        { name: 'profile.png', type: 'image', size: '1.1 MB', modified: '2026-02-05' },
        { name: 'screenshot.png', type: 'image', size: '456 KB', modified: '2026-02-12' }
      ]
    },
    {
      name: 'Code',
      type: 'folder',
      children: [
        { name: 'index.html', type: 'code', size: '4 KB', modified: '2026-02-14' },
        { name: 'styles.css', type: 'code', size: '8 KB', modified: '2026-02-14' },
        { name: 'app.js', type: 'code', size: '15 KB', modified: '2026-02-16' },
        {
          name: 'components',
          type: 'folder',
          children: [
            { name: 'Header.jsx', type: 'code', size: '2 KB', modified: '2026-02-13' },
            { name: 'Footer.jsx', type: 'code', size: '1.5 KB', modified: '2026-02-13' }
          ]
        }
      ]
    },
    { name: 'readme.md', type: 'document', size: '6 KB', modified: '2026-02-16' },
    { name: 'config.json', type: 'code', size: '1 KB', modified: '2026-02-15' }
  ]
};

function getIcon(type) {
  if (type === 'folder') return '📁';
  if (type === 'image') return '🖼';
  if (type === 'code') return '📄';
  return '📃';
}

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function App() {
  var _s1 = useState(deepClone(initialFileSystem));
  var fs = _s1[0], setFs = _s1[1];
  var _s2 = useState(['root']);
  var path = _s2[0], setPath = _s2[1];
  var _s3 = useState({});
  var expanded = _s3[0], setExpanded = _s3[1];
  var _s4 = useState(null);
  var selectedFile = _s4[0], setSelectedFile = _s4[1];
  var _s5 = useState(false);
  var showNewModal = _s5[0], setShowNewModal = _s5[1];
  var _s6 = useState('file');
  var newType = _s6[0], setNewType = _s6[1];
  var _s7 = useState('');
  var newName = _s7[0], setNewName = _s7[1];

  function getNodeAtPath(root, pathArr) {
    var node = root;
    for (var i = 1; i < pathArr.length; i++) {
      if (!node.children) return null;
      var found = node.children.find(function(c) { return c.name === pathArr[i]; });
      if (!found) return null;
      node = found;
    }
    return node;
  }

  var currentNode = getNodeAtPath(fs, path);
  var currentItems = currentNode && currentNode.children ? currentNode.children : [];

  function navigateTo(name) {
    setPath(function(p) { return p.concat([name]); });
    setSelectedFile(null);
  }

  function navigateToBreadcrumb(index) {
    setPath(function(p) { return p.slice(0, index + 1); });
    setSelectedFile(null);
  }

  function toggleExpand(key) {
    setExpanded(function(prev) {
      var next = Object.assign({}, prev);
      next[key] = !next[key];
      return next;
    });
  }

  function handleItemClick(item) {
    if (item.type === 'folder') {
      navigateTo(item.name);
    } else {
      setSelectedFile(item);
    }
  }

  function createNewItem() {
    if (!newName.trim()) return;
    var newFs = deepClone(fs);
    var node = getNodeAtPath(newFs, path);
    if (!node || !node.children) return;
    var existing = node.children.find(function(c) { return c.name === newName.trim(); });
    if (existing) return;
    if (newType === 'folder') {
      node.children.push({ name: newName.trim(), type: 'folder', children: [] });
    } else {
      node.children.push({ name: newName.trim(), type: 'document', size: '0 KB', modified: new Date().toISOString().split('T')[0] });
    }
    setFs(newFs);
    setNewName('');
    setShowNewModal(false);
  }

  function renderTree(node, pathStr, depth) {
    if (node.type !== 'folder') {
      return React.createElement('div', {
        key: pathStr,
        style: {
          paddingLeft: (depth * 18) + 'px',
          padding: '4px 4px 4px ' + (depth * 18) + 'px',
          fontSize: '13px',
          color: '#aaa',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px'
        },
        onClick: function() { setSelectedFile(node); }
      },
        React.createElement('span', null, getIcon(node.type)),
        React.createElement('span', null, node.name)
      );
    }
    var isExpanded = expanded[pathStr] !== false;
    return React.createElement('div', { key: pathStr },
      React.createElement('div', {
        style: {
          paddingLeft: (depth * 18) + 'px',
          padding: '4px 4px 4px ' + (depth * 18) + 'px',
          fontSize: '13px',
          color: '#ddd',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          fontWeight: '600'
        },
        onClick: function() { toggleExpand(pathStr); }
      },
        React.createElement('span', { style: { fontSize: '10px', width: '14px', display: 'inline-block' } }, isExpanded ? '\u25BC' : '\u25B6'),
        React.createElement('span', null, '📁'),
        React.createElement('span', null, node.name)
      ),
      isExpanded && node.children ? node.children.map(function(child) {
        return renderTree(child, pathStr + '/' + child.name, depth + 1);
      }) : null
    );
  }

  var sortedItems = currentItems.slice().sort(function(a, b) {
    if (a.type === 'folder' && b.type !== 'folder') return -1;
    if (a.type !== 'folder' && b.type === 'folder') return 1;
    return a.name.localeCompare(b.name);
  });

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
    mainLayout: { maxWidth: '1000px', margin: '0 auto', padding: '0 20px', display: 'flex', gap: '20px', flexWrap: 'wrap' },
    treePanel: {
      flex: '0 0 220px',
      background: 'rgba(255,255,255,0.05)',
      borderRadius: '12px',
      padding: '15px',
      maxHeight: '500px',
      overflowY: 'auto'
    },
    treePanelTitle: { fontSize: '14px', fontWeight: '600', color: '#9b59b6', marginBottom: '10px' },
    mainPanel: { flex: 1, minWidth: '300px' },
    breadcrumb: {
      display: 'flex',
      alignItems: 'center',
      gap: '5px',
      marginBottom: '15px',
      flexWrap: 'wrap',
      fontSize: '14px'
    },
    breadcrumbItem: {
      color: '#3498db',
      cursor: 'pointer',
      background: 'none',
      border: 'none',
      fontSize: '14px',
      padding: '0'
    },
    breadcrumbSep: { color: '#666' },
    toolbar: { display: 'flex', gap: '8px', marginBottom: '15px' },
    toolbarBtn: {
      padding: '8px 14px',
      borderRadius: '8px',
      border: 'none',
      background: 'rgba(255,255,255,0.1)',
      color: '#ccc',
      fontSize: '13px',
      cursor: 'pointer'
    },
    filesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
      gap: '10px'
    },
    fileCard: {
      background: 'rgba(255,255,255,0.06)',
      borderRadius: '10px',
      padding: '15px',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'background 0.2s'
    },
    fileIcon: { fontSize: '32px', marginBottom: '8px' },
    fileName: { fontSize: '13px', color: '#ddd', wordBreak: 'break-word' },
    detailPanel: {
      background: 'rgba(255,255,255,0.06)',
      borderRadius: '12px',
      padding: '20px',
      marginTop: '20px'
    },
    detailTitle: { fontSize: '16px', fontWeight: '600', color: '#fff', marginBottom: '12px' },
    detailRow: { display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid rgba(255,255,255,0.06)' },
    detailLabel: { color: '#888', fontSize: '13px' },
    detailValue: { color: '#ddd', fontSize: '13px' },
    modal: {
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: 'rgba(0,0,0,0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000
    },
    modalContent: {
      background: '#1a1a3e',
      borderRadius: '12px',
      padding: '25px',
      width: '350px',
      maxWidth: '90%'
    },
    modalTitle: { fontSize: '18px', fontWeight: '600', color: '#fff', marginBottom: '15px' },
    input: {
      width: '100%',
      padding: '10px 12px',
      borderRadius: '8px',
      border: '1px solid rgba(255,255,255,0.15)',
      background: 'rgba(255,255,255,0.08)',
      color: '#fff',
      fontSize: '14px',
      outline: 'none',
      marginBottom: '10px',
      boxSizing: 'border-box'
    },
    select: {
      width: '100%',
      padding: '10px 12px',
      borderRadius: '8px',
      border: '1px solid rgba(255,255,255,0.15)',
      background: 'rgba(255,255,255,0.08)',
      color: '#fff',
      fontSize: '14px',
      outline: 'none',
      marginBottom: '10px',
      boxSizing: 'border-box'
    },
    modalBtns: { display: 'flex', gap: '10px', marginTop: '5px' },
    modalBtn: {
      flex: 1,
      padding: '10px',
      borderRadius: '8px',
      border: 'none',
      fontSize: '14px',
      cursor: 'pointer',
      fontWeight: '600'
    }
  };

  return React.createElement('div', { style: styles.container },
    React.createElement('a', { href: '/projects', style: styles.backLink }, '\u2190 Back to Projects'),
    React.createElement('h1', { style: styles.header }, 'File Explorer'),
    React.createElement('div', { style: styles.mainLayout },
      React.createElement('div', { style: styles.treePanel },
        React.createElement('div', { style: styles.treePanelTitle }, 'File Tree'),
        renderTree(fs, 'root', 0)
      ),
      React.createElement('div', { style: styles.mainPanel },
        React.createElement('div', { style: styles.breadcrumb },
          path.map(function(segment, idx) {
            return React.createElement(React.Fragment, { key: idx },
              idx > 0 ? React.createElement('span', { style: styles.breadcrumbSep }, '/') : null,
              React.createElement('button', {
                style: Object.assign({}, styles.breadcrumbItem, idx === path.length - 1 ? { color: '#fff', fontWeight: '600' } : {}),
                onClick: function() { navigateToBreadcrumb(idx); }
              }, segment === 'root' ? 'Home' : segment)
            );
          })
        ),
        React.createElement('div', { style: styles.toolbar },
          React.createElement('button', {
            style: styles.toolbarBtn,
            onClick: function() { setShowNewModal(true); }
          }, '+ New'),
          path.length > 1 ? React.createElement('button', {
            style: styles.toolbarBtn,
            onClick: function() { setPath(function(p) { return p.slice(0, -1); }); setSelectedFile(null); }
          }, '\u2191 Up') : null
        ),
        React.createElement('div', { style: styles.filesGrid },
          sortedItems.map(function(item) {
            return React.createElement('div', {
              key: item.name,
              style: styles.fileCard,
              onClick: function() { handleItemClick(item); },
              onMouseEnter: function(e) { e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; },
              onMouseLeave: function(e) { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; }
            },
              React.createElement('div', { style: styles.fileIcon }, getIcon(item.type)),
              React.createElement('div', { style: styles.fileName }, item.name)
            );
          }),
          sortedItems.length === 0 ? React.createElement('div', { style: { gridColumn: '1 / -1', textAlign: 'center', color: '#666', padding: '30px' } }, 'Empty folder') : null
        ),
        selectedFile ? React.createElement('div', { style: styles.detailPanel },
          React.createElement('div', { style: styles.detailTitle }, 'File Details'),
          React.createElement('div', { style: styles.detailRow },
            React.createElement('span', { style: styles.detailLabel }, 'Name'),
            React.createElement('span', { style: styles.detailValue }, selectedFile.name)
          ),
          React.createElement('div', { style: styles.detailRow },
            React.createElement('span', { style: styles.detailLabel }, 'Type'),
            React.createElement('span', { style: styles.detailValue }, selectedFile.type)
          ),
          selectedFile.size ? React.createElement('div', { style: styles.detailRow },
            React.createElement('span', { style: styles.detailLabel }, 'Size'),
            React.createElement('span', { style: styles.detailValue }, selectedFile.size)
          ) : null,
          selectedFile.modified ? React.createElement('div', { style: styles.detailRow },
            React.createElement('span', { style: styles.detailLabel }, 'Modified'),
            React.createElement('span', { style: styles.detailValue }, selectedFile.modified)
          ) : null
        ) : null
      )
    ),
    showNewModal ? React.createElement('div', { style: styles.modal, onClick: function() { setShowNewModal(false); } },
      React.createElement('div', { style: styles.modalContent, onClick: function(e) { e.stopPropagation(); } },
        React.createElement('div', { style: styles.modalTitle }, 'Create New'),
        React.createElement('select', {
          style: styles.select,
          value: newType,
          onChange: function(e) { setNewType(e.target.value); }
        },
          React.createElement('option', { value: 'file' }, 'File'),
          React.createElement('option', { value: 'folder' }, 'Folder')
        ),
        React.createElement('input', {
          style: styles.input,
          placeholder: 'Name...',
          value: newName,
          onChange: function(e) { setNewName(e.target.value); },
          onKeyDown: function(e) { if (e.key === 'Enter') createNewItem(); }
        }),
        React.createElement('div', { style: styles.modalBtns },
          React.createElement('button', {
            style: Object.assign({}, styles.modalBtn, { background: 'rgba(255,255,255,0.1)', color: '#ccc' }),
            onClick: function() { setShowNewModal(false); }
          }, 'Cancel'),
          React.createElement('button', {
            style: Object.assign({}, styles.modalBtn, { background: 'linear-gradient(135deg, #9b59b6, #3498db)', color: '#fff' }),
            onClick: createNewItem
          }, 'Create')
        )
      )
    ) : null
  );
}

var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
