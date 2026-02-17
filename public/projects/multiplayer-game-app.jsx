const { useState, useCallback, useEffect } = React;

var ROWS = 6, COLS = 7;
var EMPTY = 0, P1 = 1, P2 = 2;
var backLinkStyle = { color: '#7b8cff', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '20px' };
var containerStyle = { minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%)', color: '#e0e0e0', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", padding: '30px', display: 'flex', flexDirection: 'column', alignItems: 'center' };

function createBoard() {
  var b = [];
  for (var r = 0; r < ROWS; r++) { b.push(new Array(COLS).fill(EMPTY)); }
  return b;
}

function checkWin(board, player) {
  var r, c;
  for (r = 0; r < ROWS; r++) for (c = 0; c <= COLS - 4; c++) {
    if (board[r][c] === player && board[r][c+1] === player && board[r][c+2] === player && board[r][c+3] === player) return true;
  }
  for (r = 0; r <= ROWS - 4; r++) for (c = 0; c < COLS; c++) {
    if (board[r][c] === player && board[r+1][c] === player && board[r+2][c] === player && board[r+3][c] === player) return true;
  }
  for (r = 0; r <= ROWS - 4; r++) for (c = 0; c <= COLS - 4; c++) {
    if (board[r][c] === player && board[r+1][c+1] === player && board[r+2][c+2] === player && board[r+3][c+3] === player) return true;
  }
  for (r = 3; r < ROWS; r++) for (c = 0; c <= COLS - 4; c++) {
    if (board[r][c] === player && board[r-1][c+1] === player && board[r-2][c+2] === player && board[r-3][c+3] === player) return true;
  }
  return false;
}

function isFull(board) {
  for (var c = 0; c < COLS; c++) if (board[0][c] === EMPTY) return false;
  return true;
}

function App() {
  var s1 = useState(createBoard), board = s1[0], setBoard = s1[1];
  var s2 = useState(P1), current = s2[0], setCurrent = s2[1];
  var s3 = useState(null), winner = s3[0], setWinner = s3[1];
  var s4 = useState({ p1: 0, p2: 0 }), scores = s4[0], setScores = s4[1];
  var s5 = useState(null), lastDrop = s5[0], setLastDrop = s5[1];
  var s6 = useState(-1), hoverCol = s6[0], setHoverCol = s6[1];
  var s7 = useState(false), isDraw = s7[0], setIsDraw = s7[1];

  var dropPiece = useCallback(function(col) {
    if (winner || isDraw) return;
    var newBoard = board.map(function(row) { return row.slice(); });
    for (var r = ROWS - 1; r >= 0; r--) {
      if (newBoard[r][col] === EMPTY) {
        newBoard[r][col] = current;
        setBoard(newBoard);
        setLastDrop({ row: r, col: col });
        if (checkWin(newBoard, current)) {
          setWinner(current);
          setScores(function(prev) {
            var ns = { p1: prev.p1, p2: prev.p2 };
            if (current === P1) ns.p1++; else ns.p2++;
            return ns;
          });
        } else if (isFull(newBoard)) {
          setIsDraw(true);
        } else {
          setCurrent(current === P1 ? P2 : P1);
        }
        return;
      }
    }
  }, [board, current, winner, isDraw]);

  var newGame = useCallback(function() {
    setBoard(createBoard());
    setCurrent(P1);
    setWinner(null);
    setLastDrop(null);
    setIsDraw(false);
  }, []);

  var resetAll = useCallback(function() {
    newGame();
    setScores({ p1: 0, p2: 0 });
  }, [newGame]);

  var p1Color = '#f87171', p2Color = '#fbbf24';

  var statusText = winner ? ('Player ' + winner + ' Wins!') : isDraw ? 'Draw!' : ('Player ' + current + "'s Turn");
  var statusColor = winner === P1 ? p1Color : winner === P2 ? p2Color : current === P1 ? p1Color : p2Color;

  return React.createElement('div', { style: containerStyle },
    React.createElement('a', { href: '/projects', style: backLinkStyle }, '\u2190 Back to Projects'),
    React.createElement('h1', { style: { fontSize: '36px', fontWeight: '800', color: '#fff', marginBottom: '8px' } }, 'Connect Four'),
    React.createElement('p', { style: { color: '#9ca3af', marginBottom: '24px' } }, 'Drop pieces to connect 4 in a row!'),

    // Scoreboard
    React.createElement('div', { style: { display: 'flex', gap: '40px', marginBottom: '20px', alignItems: 'center' } },
      React.createElement('div', { style: { textAlign: 'center' } },
        React.createElement('div', { style: { fontSize: '14px', color: p1Color, fontWeight: '700', marginBottom: '4px' } }, 'Player 1'),
        React.createElement('div', { style: { fontSize: '32px', fontWeight: '800', color: '#fff' } }, scores.p1)
      ),
      React.createElement('div', { style: { fontSize: '20px', color: '#6b7280' } }, 'VS'),
      React.createElement('div', { style: { textAlign: 'center' } },
        React.createElement('div', { style: { fontSize: '14px', color: p2Color, fontWeight: '700', marginBottom: '4px' } }, 'Player 2'),
        React.createElement('div', { style: { fontSize: '32px', fontWeight: '800', color: '#fff' } }, scores.p2)
      )
    ),

    // Status
    React.createElement('div', { style: { fontSize: '22px', fontWeight: '700', color: statusColor, marginBottom: '16px', minHeight: '32px', transition: 'color 0.3s' } }, statusText),

    // Column hover indicators
    React.createElement('div', { style: { display: 'flex', gap: '6px', marginBottom: '4px' } },
      Array.from({ length: COLS }, function(_, c) {
        var show = hoverCol === c && !winner && !isDraw && board[0][c] === EMPTY;
        return React.createElement('div', { key: c, style: { width: '60px', height: '30px', display: 'flex', alignItems: 'center', justifyContent: 'center' } },
          show ? React.createElement('div', { style: { fontSize: '20px', color: current === P1 ? p1Color : p2Color, animation: 'bounce 0.6s infinite' } }, '\u25BC') : null
        );
      })
    ),

    // Board
    React.createElement('div', { style: { background: '#1a237e', borderRadius: '12px', padding: '10px', boxShadow: '0 8px 32px rgba(0,0,0,0.6)' } },
      board.map(function(row, r) {
        return React.createElement('div', { key: r, style: { display: 'flex', gap: '6px', marginBottom: r < ROWS - 1 ? '6px' : '0' } },
          row.map(function(cell, c) {
            var isLast = lastDrop && lastDrop.row === r && lastDrop.col === c;
            var bg = cell === P1 ? p1Color : cell === P2 ? p2Color : '#0a0a1a';
            var shadow = cell !== EMPTY ? ('inset 0 -4px 8px rgba(0,0,0,0.3), 0 2px 4px rgba(0,0,0,0.2)') : 'inset 0 4px 8px rgba(0,0,0,0.4)';
            return React.createElement('div', {
              key: c,
              onClick: function() { dropPiece(c); },
              onMouseEnter: function() { setHoverCol(c); },
              onMouseLeave: function() { setHoverCol(-1); },
              style: { width: '60px', height: '60px', borderRadius: '50%', background: bg, cursor: winner || isDraw ? 'default' : 'pointer', boxShadow: shadow, transition: 'background 0.2s, transform 0.2s', transform: isLast ? 'scale(1.08)' : 'scale(1)' }
            });
          })
        );
      })
    ),

    // Buttons
    React.createElement('div', { style: { display: 'flex', gap: '12px', marginTop: '24px' } },
      React.createElement('button', { onClick: newGame, style: { padding: '10px 24px', background: '#7b8cff', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' } }, 'New Game'),
      React.createElement('button', { onClick: resetAll, style: { padding: '10px 24px', background: 'rgba(255,255,255,0.1)', color: '#e0e0e0', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' } }, 'Reset Scores')
    ),

    // Instructions
    React.createElement('div', { style: { marginTop: '24px', padding: '16px', background: 'rgba(255,255,255,0.05)', borderRadius: '10px', maxWidth: '450px', textAlign: 'center' } },
      React.createElement('div', { style: { fontSize: '14px', color: '#9ca3af', lineHeight: '1.6' } },
        'Click a column to drop your piece. First to connect four in a row (horizontal, vertical, or diagonal) wins!'
      )
    )
  );
}

var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
