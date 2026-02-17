const { useState, useEffect, useRef } = React;

var CATEGORIES = ['All', 'Produce', 'Dairy', 'Meat', 'Bakery', 'Other'];

var styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%)',
    color: '#e0e0e0',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: '20px',
  },
  backLink: {
    color: '#7eb8ff',
    textDecoration: 'none',
    fontSize: '14px',
    display: 'inline-block',
    marginBottom: '20px',
  },
  title: {
    textAlign: 'center',
    fontSize: '2rem',
    color: '#ffffff',
    marginBottom: '30px',
  },
  card: {
    maxWidth: '600px',
    margin: '0 auto',
    background: 'rgba(255,255,255,0.06)',
    borderRadius: '16px',
    padding: '30px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
  },
  addRow: {
    display: 'flex',
    gap: '8px',
    marginBottom: '16px',
    flexWrap: 'wrap',
  },
  input: {
    flex: '1',
    minWidth: '120px',
    padding: '10px 14px',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.2)',
    background: 'rgba(255,255,255,0.08)',
    color: '#fff',
    fontSize: '14px',
    outline: 'none',
  },
  qtyInput: {
    width: '60px',
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.2)',
    background: 'rgba(255,255,255,0.08)',
    color: '#fff',
    fontSize: '14px',
    outline: 'none',
    textAlign: 'center',
  },
  select: {
    padding: '10px',
    borderRadius: '8px',
    border: '1px solid rgba(255,255,255,0.2)',
    background: 'rgba(255,255,255,0.08)',
    color: '#fff',
    fontSize: '14px',
    outline: 'none',
  },
  addBtn: {
    padding: '10px 20px',
    borderRadius: '8px',
    border: 'none',
    background: '#00c853',
    color: '#fff',
    fontSize: '14px',
    fontWeight: 'bold',
    cursor: 'pointer',
  },
  catTabs: {
    display: 'flex',
    gap: '6px',
    marginBottom: '16px',
    flexWrap: 'wrap',
  },
  catTab: {
    padding: '6px 14px',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.15)',
    background: 'transparent',
    color: '#aaa',
    cursor: 'pointer',
    fontSize: '13px',
  },
  catTabActive: {
    background: '#7c4dff',
    color: '#fff',
    border: '1px solid #7c4dff',
  },
  stats: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '16px',
    fontSize: '14px',
    color: '#888',
  },
  itemRow: {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 12px',
    marginBottom: '6px',
    background: 'rgba(255,255,255,0.04)',
    borderRadius: '8px',
    gap: '10px',
    transition: 'background 0.2s',
  },
  checkbox: {
    width: '20px',
    height: '20px',
    cursor: 'pointer',
    accentColor: '#00c853',
  },
  itemName: {
    flex: '1',
    fontSize: '15px',
  },
  checked: {
    textDecoration: 'line-through',
    color: '#666',
  },
  qty: {
    color: '#aaa',
    fontSize: '13px',
    marginRight: '8px',
  },
  catBadge: {
    padding: '2px 8px',
    borderRadius: '10px',
    fontSize: '11px',
    background: 'rgba(124,77,255,0.2)',
    color: '#b388ff',
  },
  deleteBtn: {
    padding: '4px 10px',
    borderRadius: '6px',
    border: 'none',
    background: 'rgba(255,23,68,0.2)',
    color: '#ff5252',
    cursor: 'pointer',
    fontSize: '13px',
  },
  emptyMsg: {
    textAlign: 'center',
    color: '#666',
    padding: '30px',
    fontSize: '15px',
  },
};

function App() {
  var _items = useState([]);
  var items = _items[0], setItems = _items[1];
  var _name = useState('');
  var name = _name[0], setName = _name[1];
  var _qty = useState('1');
  var qty = _qty[0], setQty = _qty[1];
  var _cat = useState('Other');
  var cat = _cat[0], setCat = _cat[1];
  var _filter = useState('All');
  var filter = _filter[0], setFilter = _filter[1];

  function addItem() {
    if (!name.trim()) return;
    var newItem = {
      id: Date.now(),
      name: name.trim(),
      quantity: parseInt(qty) || 1,
      category: cat,
      checked: false,
    };
    setItems(function (prev) { return prev.concat([newItem]); });
    setName('');
    setQty('1');
  }

  function toggleItem(id) {
    setItems(function (prev) {
      return prev.map(function (item) {
        return item.id === id ? Object.assign({}, item, { checked: !item.checked }) : item;
      });
    });
  }

  function deleteItem(id) {
    setItems(function (prev) {
      return prev.filter(function (item) { return item.id !== id; });
    });
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') addItem();
  }

  var filtered = filter === 'All' ? items : items.filter(function (i) { return i.category === filter; });
  var checkedCount = items.filter(function (i) { return i.checked; }).length;

  return React.createElement('div', { style: styles.container },
    React.createElement('a', { href: '/projects', style: styles.backLink }, '\u2190 Back to Projects'),
    React.createElement('h1', { style: styles.title }, '\ud83d\uded2 Grocery List'),
    React.createElement('div', { style: styles.card },
      React.createElement('div', { style: styles.addRow },
        React.createElement('input', {
          style: styles.input,
          value: name,
          onChange: function (e) { setName(e.target.value); },
          onKeyDown: handleKeyDown,
          placeholder: 'Item name...',
        }),
        React.createElement('input', {
          style: styles.qtyInput,
          type: 'number',
          min: '1',
          value: qty,
          onChange: function (e) { setQty(e.target.value); },
        }),
        React.createElement('select', {
          style: styles.select,
          value: cat,
          onChange: function (e) { setCat(e.target.value); },
        },
          CATEGORIES.slice(1).map(function (c) {
            return React.createElement('option', { key: c, value: c }, c);
          })
        ),
        React.createElement('button', { style: styles.addBtn, onClick: addItem }, 'Add')
      ),
      React.createElement('div', { style: styles.catTabs },
        CATEGORIES.map(function (c) {
          return React.createElement('button', {
            key: c,
            style: Object.assign({}, styles.catTab, filter === c ? styles.catTabActive : {}),
            onClick: function () { setFilter(c); },
          }, c);
        })
      ),
      React.createElement('div', { style: styles.stats },
        React.createElement('span', null, 'Total: ' + items.length + ' items'),
        React.createElement('span', null, 'Checked: ' + checkedCount + ' / ' + items.length)
      ),
      filtered.length === 0
        ? React.createElement('div', { style: styles.emptyMsg }, 'No items yet. Add some groceries!')
        : filtered.map(function (item) {
            return React.createElement('div', {
              key: item.id,
              style: Object.assign({}, styles.itemRow, item.checked ? { opacity: 0.6 } : {}),
            },
              React.createElement('input', {
                type: 'checkbox',
                style: styles.checkbox,
                checked: item.checked,
                onChange: function () { toggleItem(item.id); },
              }),
              React.createElement('span', {
                style: Object.assign({}, styles.itemName, item.checked ? styles.checked : {}),
              }, item.name),
              React.createElement('span', { style: styles.qty }, 'x' + item.quantity),
              React.createElement('span', { style: styles.catBadge }, item.category),
              React.createElement('button', {
                style: styles.deleteBtn,
                onClick: function () { deleteItem(item.id); },
              }, '\u2715')
            );
          })
    )
  );
}

var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
