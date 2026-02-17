const { useState, useEffect, useRef } = React;

var defaultCards = [
  { front: 'What is the Virtual DOM?', back: 'A lightweight JavaScript copy of the real DOM that React uses to optimize rendering by comparing changes before updating the actual DOM.' },
  { front: 'What is a React Hook?', back: 'Functions that let you use state and lifecycle features in functional components. Examples: useState, useEffect, useContext.' },
  { front: 'What does useEffect do?', back: 'Performs side effects in functional components like data fetching, subscriptions, or DOM changes. Runs after render by default.' },
  { front: 'What is JSX?', back: 'A syntax extension for JavaScript that lets you write HTML-like code in JavaScript. It gets transpiled to React.createElement() calls.' },
  { front: 'What is the difference between state and props?', back: 'Props are read-only data passed from parent to child. State is mutable data managed within a component that triggers re-renders when changed.' },
  { front: 'What is a closure in JavaScript?', back: 'A function that has access to variables from its outer (enclosing) function scope, even after the outer function has returned.' },
  { front: 'What is the purpose of keys in React lists?', back: 'Keys help React identify which items changed, were added, or removed, enabling efficient re-rendering of list elements.' },
  { front: 'What is useRef used for?', back: 'Creates a mutable reference that persists across renders without causing re-renders. Commonly used for DOM element references.' },
  { front: 'What is the event loop in JavaScript?', back: 'A mechanism that handles asynchronous callbacks by checking the call stack and task queue, executing queued callbacks when the stack is empty.' },
  { front: 'What is React.memo?', back: 'A higher-order component that memoizes a component, preventing re-renders if props have not changed. Used for performance optimization.' },
];

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
  cardWrapper: {
    maxWidth: '550px',
    margin: '0 auto',
    perspective: '1000px',
  },
  cardInner: {
    width: '100%',
    minHeight: '280px',
    position: 'relative',
    cursor: 'pointer',
    transformStyle: 'preserve-3d',
    transition: 'transform 0.6s',
  },
  cardFlipped: {
    transform: 'rotateY(180deg)',
  },
  cardFace: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    minHeight: '280px',
    backfaceVisibility: 'hidden',
    borderRadius: '16px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '30px',
    boxSizing: 'border-box',
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
  },
  cardFront: {
    background: 'linear-gradient(135deg, #1a237e, #283593)',
  },
  cardBack: {
    background: 'linear-gradient(135deg, #004d40, #00695c)',
    transform: 'rotateY(180deg)',
  },
  cardLabel: {
    fontSize: '12px',
    textTransform: 'uppercase',
    letterSpacing: '2px',
    marginBottom: '16px',
    opacity: 0.7,
  },
  cardText: {
    fontSize: '1.2rem',
    textAlign: 'center',
    lineHeight: '1.6',
  },
  controls: {
    display: 'flex',
    justifyContent: 'center',
    gap: '12px',
    marginTop: '24px',
    flexWrap: 'wrap',
  },
  btn: {
    padding: '10px 24px',
    borderRadius: '8px',
    border: 'none',
    fontSize: '15px',
    fontWeight: 'bold',
    cursor: 'pointer',
    color: '#fff',
  },
  prevBtn: {
    background: '#455a64',
  },
  nextBtn: {
    background: '#2979ff',
  },
  shuffleBtn: {
    background: '#7c4dff',
  },
  progress: {
    textAlign: 'center',
    marginTop: '20px',
    color: '#888',
    fontSize: '14px',
  },
  progressBar: {
    width: '100%',
    maxWidth: '550px',
    height: '6px',
    background: 'rgba(255,255,255,0.1)',
    borderRadius: '3px',
    margin: '10px auto 0',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(90deg, #00e5ff, #7c4dff)',
    borderRadius: '3px',
    transition: 'width 0.3s',
  },
  clickHint: {
    textAlign: 'center',
    marginTop: '12px',
    color: '#666',
    fontSize: '13px',
  },
};

function App() {
  var _cards = useState(defaultCards.slice());
  var cards = _cards[0], setCards = _cards[1];
  var _idx = useState(0);
  var idx = _idx[0], setIdx = _idx[1];
  var _flipped = useState(false);
  var flipped = _flipped[0], setFlipped = _flipped[1];

  function handleFlip() {
    setFlipped(!flipped);
  }

  function handlePrev() {
    setFlipped(false);
    setIdx(function (prev) { return prev > 0 ? prev - 1 : cards.length - 1; });
  }

  function handleNext() {
    setFlipped(false);
    setIdx(function (prev) { return prev < cards.length - 1 ? prev + 1 : 0; });
  }

  function handleShuffle() {
    var shuffled = cards.slice();
    for (var i = shuffled.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var temp = shuffled[i];
      shuffled[i] = shuffled[j];
      shuffled[j] = temp;
    }
    setCards(shuffled);
    setIdx(0);
    setFlipped(false);
  }

  var card = cards[idx];
  var progressPct = ((idx + 1) / cards.length) * 100;

  return React.createElement('div', { style: styles.container },
    React.createElement('a', { href: '/projects', style: styles.backLink }, '\u2190 Back to Projects'),
    React.createElement('h1', { style: styles.title }, '\ud83d\udcda Flashcards'),
    React.createElement('div', { style: styles.cardWrapper },
      React.createElement('div', {
        style: Object.assign({}, styles.cardInner, flipped ? styles.cardFlipped : {}),
        onClick: handleFlip,
      },
        React.createElement('div', { style: Object.assign({}, styles.cardFace, styles.cardFront) },
          React.createElement('div', { style: styles.cardLabel }, 'Question'),
          React.createElement('div', { style: styles.cardText }, card.front)
        ),
        React.createElement('div', { style: Object.assign({}, styles.cardFace, styles.cardBack) },
          React.createElement('div', { style: styles.cardLabel }, 'Answer'),
          React.createElement('div', { style: styles.cardText }, card.back)
        )
      )
    ),
    React.createElement('div', { style: styles.clickHint }, 'Click the card to flip'),
    React.createElement('div', { style: styles.controls },
      React.createElement('button', {
        style: Object.assign({}, styles.btn, styles.prevBtn),
        onClick: handlePrev,
      }, '\u2190 Previous'),
      React.createElement('button', {
        style: Object.assign({}, styles.btn, styles.shuffleBtn),
        onClick: handleShuffle,
      }, 'Shuffle'),
      React.createElement('button', {
        style: Object.assign({}, styles.btn, styles.nextBtn),
        onClick: handleNext,
      }, 'Next \u2192')
    ),
    React.createElement('div', { style: styles.progress },
      'Card ' + (idx + 1) + ' of ' + cards.length
    ),
    React.createElement('div', { style: styles.progressBar },
      React.createElement('div', { style: Object.assign({}, styles.progressFill, { width: progressPct + '%' }) })
    )
  );
}

var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
