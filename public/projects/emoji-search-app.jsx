const { useState, useEffect, useRef } = React;

var emojiData = [
  { emoji: '\ud83d\ude00', name: 'Grinning Face', category: 'Smileys' },
  { emoji: '\ud83d\ude02', name: 'Tears of Joy', category: 'Smileys' },
  { emoji: '\ud83d\ude0d', name: 'Heart Eyes', category: 'Smileys' },
  { emoji: '\ud83e\udd14', name: 'Thinking Face', category: 'Smileys' },
  { emoji: '\ud83d\ude0e', name: 'Sunglasses', category: 'Smileys' },
  { emoji: '\ud83d\ude0a', name: 'Smiling Blush', category: 'Smileys' },
  { emoji: '\ud83d\ude09', name: 'Winking Face', category: 'Smileys' },
  { emoji: '\ud83d\ude2d', name: 'Crying Face', category: 'Smileys' },
  { emoji: '\ud83d\ude21', name: 'Angry Face', category: 'Smileys' },
  { emoji: '\ud83e\udd2f', name: 'Mind Blown', category: 'Smileys' },
  { emoji: '\ud83d\ude31', name: 'Screaming', category: 'Smileys' },
  { emoji: '\ud83e\udd73', name: 'Party Face', category: 'Smileys' },
  { emoji: '\ud83d\udc36', name: 'Dog Face', category: 'Animals' },
  { emoji: '\ud83d\udc31', name: 'Cat Face', category: 'Animals' },
  { emoji: '\ud83e\udd81', name: 'Lion', category: 'Animals' },
  { emoji: '\ud83d\udc3b', name: 'Bear', category: 'Animals' },
  { emoji: '\ud83d\udc28', name: 'Koala', category: 'Animals' },
  { emoji: '\ud83d\udc2c', name: 'Dolphin', category: 'Animals' },
  { emoji: '\ud83e\udd8b', name: 'Butterfly', category: 'Animals' },
  { emoji: '\ud83d\udc22', name: 'Turtle', category: 'Animals' },
  { emoji: '\ud83d\udc27', name: 'Penguin', category: 'Animals' },
  { emoji: '\ud83e\udd89', name: 'Owl', category: 'Animals' },
  { emoji: '\ud83c\udf55', name: 'Pizza', category: 'Food' },
  { emoji: '\ud83c\udf54', name: 'Hamburger', category: 'Food' },
  { emoji: '\ud83c\udf89', name: 'Party Popper', category: 'Food' },
  { emoji: '\ud83c\udf70', name: 'Cake', category: 'Food' },
  { emoji: '\ud83c\udf69', name: 'Donut', category: 'Food' },
  { emoji: '\ud83c\udf53', name: 'Strawberry', category: 'Food' },
  { emoji: '\ud83c\udf4e', name: 'Apple', category: 'Food' },
  { emoji: '\ud83c\udf5c', name: 'Noodles', category: 'Food' },
  { emoji: '\u2615', name: 'Coffee', category: 'Food' },
  { emoji: '\ud83c\udf7a', name: 'Beer', category: 'Food' },
  { emoji: '\u26bd', name: 'Soccer', category: 'Activities' },
  { emoji: '\ud83c\udfc0', name: 'Basketball', category: 'Activities' },
  { emoji: '\ud83c\udfbe', name: 'Tennis', category: 'Activities' },
  { emoji: '\ud83c\udfaf', name: 'Dart', category: 'Activities' },
  { emoji: '\ud83c\udfb8', name: 'Guitar', category: 'Activities' },
  { emoji: '\ud83c\udfae', name: 'Game Controller', category: 'Activities' },
  { emoji: '\ud83c\udfb3', name: 'Bowling', category: 'Activities' },
  { emoji: '\ud83c\udfc4', name: 'Surfing', category: 'Activities' },
  { emoji: '\ud83d\udca1', name: 'Light Bulb', category: 'Objects' },
  { emoji: '\ud83d\udcbb', name: 'Laptop', category: 'Objects' },
  { emoji: '\ud83d\udcf1', name: 'Phone', category: 'Objects' },
  { emoji: '\ud83d\udd11', name: 'Key', category: 'Objects' },
  { emoji: '\ud83d\udcda', name: 'Books', category: 'Objects' },
  { emoji: '\u2702', name: 'Scissors', category: 'Objects' },
  { emoji: '\ud83d\udd2e', name: 'Crystal Ball', category: 'Objects' },
  { emoji: '\ud83d\ude80', name: 'Rocket', category: 'Objects' },
  { emoji: '\u2764', name: 'Red Heart', category: 'Objects' },
  { emoji: '\u2b50', name: 'Star', category: 'Objects' },
  { emoji: '\ud83c\udf1f', name: 'Glowing Star', category: 'Objects' },
  { emoji: '\ud83d\udd25', name: 'Fire', category: 'Objects' },
];

var CATEGORIES = ['All', 'Smileys', 'Animals', 'Food', 'Activities', 'Objects'];

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
    maxWidth: '650px',
    margin: '0 auto',
    background: 'rgba(255,255,255,0.06)',
    borderRadius: '16px',
    padding: '30px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
  },
  searchInput: {
    width: '100%',
    padding: '14px 18px',
    borderRadius: '10px',
    border: '1px solid rgba(255,255,255,0.2)',
    background: 'rgba(255,255,255,0.08)',
    color: '#fff',
    fontSize: '16px',
    outline: 'none',
    marginBottom: '16px',
    boxSizing: 'border-box',
  },
  catRow: {
    display: 'flex',
    gap: '6px',
    marginBottom: '20px',
    flexWrap: 'wrap',
  },
  catBtn: {
    padding: '6px 14px',
    borderRadius: '16px',
    border: '1px solid rgba(255,255,255,0.15)',
    background: 'transparent',
    color: '#aaa',
    cursor: 'pointer',
    fontSize: '13px',
  },
  catBtnActive: {
    background: '#7c4dff',
    color: '#fff',
    border: '1px solid #7c4dff',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(90px, 1fr))',
    gap: '10px',
  },
  emojiCell: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '14px 6px',
    borderRadius: '10px',
    background: 'rgba(255,255,255,0.05)',
    cursor: 'pointer',
    transition: 'background 0.2s, transform 0.1s',
    border: '1px solid transparent',
  },
  emojiChar: {
    fontSize: '2rem',
    marginBottom: '4px',
  },
  emojiName: {
    fontSize: '10px',
    color: '#999',
    textAlign: 'center',
    lineHeight: '1.2',
  },
  toast: {
    position: 'fixed',
    bottom: '30px',
    left: '50%',
    transform: 'translateX(-50%)',
    padding: '12px 28px',
    borderRadius: '10px',
    background: '#00c853',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '15px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
    zIndex: 1000,
    transition: 'opacity 0.3s',
  },
  noResults: {
    textAlign: 'center',
    color: '#666',
    padding: '30px',
    fontSize: '15px',
  },
};

function App() {
  var _search = useState('');
  var search = _search[0], setSearch = _search[1];
  var _cat = useState('All');
  var cat = _cat[0], setCat = _cat[1];
  var _toast = useState('');
  var toast = _toast[0], setToast = _toast[1];
  var _hoverId = useState(null);
  var hoverId = _hoverId[0], setHoverId = _hoverId[1];

  function handleCopy(emoji, name) {
    navigator.clipboard.writeText(emoji).then(function () {
      setToast('Copied ' + emoji + ' ' + name + '!');
      setTimeout(function () { setToast(''); }, 1500);
    });
  }

  var filtered = emojiData.filter(function (item) {
    var matchCat = cat === 'All' || item.category === cat;
    var matchSearch = !search || item.name.toLowerCase().indexOf(search.toLowerCase()) !== -1;
    return matchCat && matchSearch;
  });

  return React.createElement('div', { style: styles.container },
    React.createElement('a', { href: '/projects', style: styles.backLink }, '\u2190 Back to Projects'),
    React.createElement('h1', { style: styles.title }, '\ud83d\ude00 Emoji Search'),
    React.createElement('div', { style: styles.card },
      React.createElement('input', {
        style: styles.searchInput,
        value: search,
        onChange: function (e) { setSearch(e.target.value); },
        placeholder: 'Search emojis...',
      }),
      React.createElement('div', { style: styles.catRow },
        CATEGORIES.map(function (c) {
          return React.createElement('button', {
            key: c,
            style: Object.assign({}, styles.catBtn, cat === c ? styles.catBtnActive : {}),
            onClick: function () { setCat(c); },
          }, c);
        })
      ),
      filtered.length === 0
        ? React.createElement('div', { style: styles.noResults }, 'No emojis found')
        : React.createElement('div', { style: styles.grid },
            filtered.map(function (item, i) {
              var isHovered = hoverId === i;
              return React.createElement('div', {
                key: i,
                style: Object.assign({}, styles.emojiCell, isHovered ? {
                  background: 'rgba(124,77,255,0.2)',
                  border: '1px solid rgba(124,77,255,0.4)',
                  transform: 'scale(1.05)',
                } : {}),
                onClick: function () { handleCopy(item.emoji, item.name); },
                onMouseEnter: function () { setHoverId(i); },
                onMouseLeave: function () { setHoverId(null); },
              },
                React.createElement('span', { style: styles.emojiChar }, item.emoji),
                React.createElement('span', { style: styles.emojiName }, item.name)
              );
            })
          )
    ),
    toast && React.createElement('div', { style: styles.toast }, toast)
  );
}

var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
