const { useState, useEffect, useRef } = React;

var winLines = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

function checkWinner(board) {
  for (var i = 0; i < winLines.length; i++) {
    var a = winLines[i][0], b = winLines[i][1], c = winLines[i][2];
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a], line: winLines[i] };
    }
  }
  return null;
}

function checkDraw(board) {
  return board.every(function (cell) { return cell !== null; });
}

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
    maxWidth: '420px',
    margin: '0 auto',
    background: 'rgba(255,255,255,0.06)',
    borderRadius: '16px',
    padding: '30px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
    textAlign: 'center',
  },
  status: {
    fontSize: '1.3rem',
    marginBottom: '20px',
    fontWeight: 'bold',
    minHeight: '36px',
  },
  board: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '8px',
    maxWidth: '300px',
    margin: '0 auto 24px',
  },
  cell: {
    width: '90px',
    height: '90px',
    borderRadius: '12px',
    border: '2px solid rgba(255,255,255,0.15)',
    background: 'rgba(255,255,255,0.04)',
    fontSize: '2.5rem',
    fontWeight: 'bold',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.2s, transform 0.1s, border-color 0.2s',
    color: '#fff',
    padding: 0,
  },
  cellX: {
    color: '#00e5ff',
  },
  cellO: {
    color: '#ff6ec7',
  },
  cellWin: {
    background: 'rgba(124,77,255,0.3)',
    borderColor: '#7c4dff',
    transform: 'scale(1.05)',
  },
  cellHover: {
    background: 'rgba(255,255,255,0.1)',
  },
  scores: {
    display: 'flex',
    justifyContent: 'center',
    gap: '30px',
    marginBottom: '20px',
  },
  scoreItem: {
    textAlign: 'center',
  },
  scoreLabel: {
    fontSize: '13px',
    color: '#888',
    marginBottom: '4px',
  },
  scoreValue: {
    fontSize: '1.8rem',
    fontWeight: 'bold',
  },
  btnRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '12px',
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
  newGameBtn: {
    background: '#2979ff',
  },
  resetBtn: {
    background: '#455a64',
  },
};

function App() {
  var _board = useState(Array(9).fill(null));
  var board = _board[0], setBoard = _board[1];
  var _isX = useState(true);
  var isX = _isX[0], setIsX = _isX[1];
  var _scores = useState({ X: 0, O: 0, draws: 0 });
  var scores = _scores[0], setScores = _scores[1];
  var _gameOver = useState(false);
  var gameOver = _gameOver[0], setGameOver = _gameOver[1];
  var _hovered = useState(null);
  var hovered = _hovered[0], setHovered = _hovered[1];

  var result = checkWinner(board);
  var isDraw = !result && checkDraw(board);

  useEffect(function () {
    if (result && !gameOver) {
      setGameOver(true);
      setScores(function (prev) {
        var updated = Object.assign({}, prev);
        updated[result.winner] = prev[result.winner] + 1;
        return updated;
      });
    }
    if (isDraw && !gameOver) {
      setGameOver(true);
      setScores(function (prev) {
        return Object.assign({}, prev, { draws: prev.draws + 1 });
      });
    }
  }, [board]);

  function handleClick(idx) {
    if (board[idx] || gameOver) return;
    var newBoard = board.slice();
    newBoard[idx] = isX ? 'X' : 'O';
    setBoard(newBoard);
    setIsX(!isX);
  }

  function handleNewGame() {
    setBoard(Array(9).fill(null));
    setIsX(true);
    setGameOver(false);
  }

  function handleResetScores() {
    handleNewGame();
    setScores({ X: 0, O: 0, draws: 0 });
  }

  var statusText = '';
  if (result) {
    statusText = 'Player ' + result.winner + ' wins!';
  } else if (isDraw) {
    statusText = 'It\'s a draw!';
  } else {
    statusText = 'Player ' + (isX ? 'X' : 'O') + '\'s turn';
  }

  var statusColor = result
    ? (result.winner === 'X' ? '#00e5ff' : '#ff6ec7')
    : (isDraw ? '#ffab00' : '#e0e0e0');

  return React.createElement('div', { style: styles.container },
    React.createElement('a', { href: '/projects', style: styles.backLink }, '\u2190 Back to Projects'),
    React.createElement('h1', { style: styles.title }, '\u274c\u2b55 Tic-Tac-Toe'),
    React.createElement('div', { style: styles.card },
      React.createElement('div', { style: styles.scores },
        React.createElement('div', { style: styles.scoreItem },
          React.createElement('div', { style: styles.scoreLabel }, 'Player X'),
          React.createElement('div', { style: Object.assign({}, styles.scoreValue, { color: '#00e5ff' }) }, scores.X)
        ),
        React.createElement('div', { style: styles.scoreItem },
          React.createElement('div', { style: styles.scoreLabel }, 'Draws'),
          React.createElement('div', { style: Object.assign({}, styles.scoreValue, { color: '#ffab00' }) }, scores.draws)
        ),
        React.createElement('div', { style: styles.scoreItem },
          React.createElement('div', { style: styles.scoreLabel }, 'Player O'),
          React.createElement('div', { style: Object.assign({}, styles.scoreValue, { color: '#ff6ec7' }) }, scores.O)
        )
      ),
      React.createElement('div', { style: Object.assign({}, styles.status, { color: statusColor }) }, statusText),
      React.createElement('div', { style: styles.board },
        board.map(function (cell, idx) {
          var isWinCell = result && result.line.indexOf(idx) !== -1;
          var isHov = hovered === idx && !cell && !gameOver;
          var cellStyle = Object.assign({}, styles.cell,
            cell === 'X' ? styles.cellX : {},
            cell === 'O' ? styles.cellO : {},
            isWinCell ? styles.cellWin : {},
            isHov ? styles.cellHover : {}
          );
          return React.createElement('button', {
            key: idx,
            style: cellStyle,
            onClick: function () { handleClick(idx); },
            onMouseEnter: function () { setHovered(idx); },
            onMouseLeave: function () { setHovered(null); },
          }, cell || '');
        })
      ),
      React.createElement('div', { style: styles.btnRow },
        React.createElement('button', {
          style: Object.assign({}, styles.btn, styles.newGameBtn),
          onClick: handleNewGame,
        }, 'New Game'),
        React.createElement('button', {
          style: Object.assign({}, styles.btn, styles.resetBtn),
          onClick: handleResetScores,
        }, 'Reset Scores')
      )
    )
  );
}

var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
