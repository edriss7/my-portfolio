const { useState, useCallback, useMemo } = React;

var backLinkStyle = { color: '#8be9fd', textDecoration: 'none', fontSize: '14px', marginBottom: '20px', display: 'inline-block' };

var PIECES = { K: '\u2654', Q: '\u2655', R: '\u2656', B: '\u2657', N: '\u2658', P: '\u2659', k: '\u265A', q: '\u265B', r: '\u265C', b: '\u265D', n: '\u265E', p: '\u265F' };

function initialBoard() {
  return [
    ['r','n','b','q','k','b','n','r'],
    ['p','p','p','p','p','p','p','p'],
    [null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
    [null,null,null,null,null,null,null,null],
    ['P','P','P','P','P','P','P','P'],
    ['R','N','B','Q','K','B','N','R']
  ];
}

function isWhite(piece) { return piece && piece === piece.toUpperCase(); }
function isBlack(piece) { return piece && piece === piece.toLowerCase(); }
function isFriendly(piece, whiteTurn) { return whiteTurn ? isWhite(piece) : isBlack(piece); }
function isEnemy(piece, whiteTurn) { return whiteTurn ? isBlack(piece) : isWhite(piece); }

function getValidMoves(board, row, col, whiteTurn) {
  var piece = board[row][col];
  if (!piece) return [];
  if (whiteTurn && !isWhite(piece)) return [];
  if (!whiteTurn && !isBlack(piece)) return [];

  var moves = [];
  var type = piece.toLowerCase();
  var dir = isWhite(piece) ? -1 : 1;

  var addIfValid = function(r, c) {
    if (r < 0 || r > 7 || c < 0 || c > 7) return false;
    if (isFriendly(board[r][c], whiteTurn)) return false;
    moves.push([r, c]);
    return !board[r][c];
  };

  var addSliding = function(dr, dc) {
    for (var i = 1; i <= 7; i++) {
      if (!addIfValid(row + dr * i, col + dc * i)) break;
    }
  };

  switch (type) {
    case 'p':
      var startRow = isWhite(piece) ? 6 : 1;
      if (!board[row + dir] || board[row + dir][col] !== undefined) {
        if (row + dir >= 0 && row + dir <= 7 && !board[row + dir][col]) {
          moves.push([row + dir, col]);
          if (row === startRow && !board[row + 2 * dir][col]) {
            moves.push([row + 2 * dir, col]);
          }
        }
      } else if (!board[row + dir][col]) {
        moves.push([row + dir, col]);
        if (row === startRow && !board[row + 2 * dir][col]) {
          moves.push([row + 2 * dir, col]);
        }
      }
      if (col > 0 && isEnemy(board[row + dir][col - 1], whiteTurn)) moves.push([row + dir, col - 1]);
      if (col < 7 && isEnemy(board[row + dir][col + 1], whiteTurn)) moves.push([row + dir, col + 1]);
      break;
    case 'r':
      addSliding(1, 0); addSliding(-1, 0); addSliding(0, 1); addSliding(0, -1);
      break;
    case 'b':
      addSliding(1, 1); addSliding(1, -1); addSliding(-1, 1); addSliding(-1, -1);
      break;
    case 'q':
      addSliding(1, 0); addSliding(-1, 0); addSliding(0, 1); addSliding(0, -1);
      addSliding(1, 1); addSliding(1, -1); addSliding(-1, 1); addSliding(-1, -1);
      break;
    case 'n':
      [[2,1],[2,-1],[-2,1],[-2,-1],[1,2],[1,-2],[-1,2],[-1,-2]].forEach(function(d) {
        addIfValid(row + d[0], col + d[1]);
      });
      break;
    case 'k':
      [[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]].forEach(function(d) {
        addIfValid(row + d[0], col + d[1]);
      });
      break;
  }
  return moves;
}

function colLetter(c) { return String.fromCharCode(97 + c); }
function rowNum(r) { return String(8 - r); }

function App() {
  var _board = useState(initialBoard), board = _board[0], setBoard = _board[1];
  var _sel = useState(null), selected = _sel[0], setSelected = _sel[1];
  var _turn = useState(true), whiteTurn = _turn[0], setWhiteTurn = _turn[1];
  var _hist = useState([]), history = _hist[0], setHistory = _hist[1];
  var _capW = useState([]), capturedWhite = _capW[0], setCapturedWhite = _capW[1];
  var _capB = useState([]), capturedBlack = _capB[0], setCapturedBlack = _capB[1];
  var _valid = useState([]), validMoves = _valid[0], setValidMoves = _valid[1];

  var handleClick = useCallback(function(row, col) {
    var piece = board[row][col];

    if (selected) {
      var isValidMove = validMoves.some(function(m) { return m[0] === row && m[1] === col; });
      if (isValidMove) {
        var newBoard = board.map(function(r) { return r.slice(); });
        var movingPiece = newBoard[selected[0]][selected[1]];
        var captured = newBoard[row][col];
        newBoard[row][col] = movingPiece;
        newBoard[selected[0]][selected[1]] = null;

        // Pawn promotion
        if (movingPiece.toLowerCase() === 'p' && (row === 0 || row === 7)) {
          newBoard[row][col] = isWhite(movingPiece) ? 'Q' : 'q';
        }

        if (captured) {
          if (isWhite(captured)) {
            setCapturedWhite(function(c) { return c.concat([captured]); });
          } else {
            setCapturedBlack(function(c) { return c.concat([captured]); });
          }
        }

        var moveStr = (PIECES[movingPiece] || '') + colLetter(selected[1]) + rowNum(selected[0]) + (captured ? 'x' : '\u2192') + colLetter(col) + rowNum(row);
        setHistory(function(h) { return h.concat([moveStr]); });
        setBoard(newBoard);
        setWhiteTurn(!whiteTurn);
        setSelected(null);
        setValidMoves([]);
        return;
      }

      if (piece && isFriendly(piece, whiteTurn)) {
        setSelected([row, col]);
        setValidMoves(getValidMoves(board, row, col, whiteTurn));
        return;
      }

      setSelected(null);
      setValidMoves([]);
      return;
    }

    if (piece && isFriendly(piece, whiteTurn)) {
      setSelected([row, col]);
      setValidMoves(getValidMoves(board, row, col, whiteTurn));
    }
  }, [board, selected, whiteTurn, validMoves]);

  var newGame = useCallback(function() {
    setBoard(initialBoard());
    setSelected(null);
    setWhiteTurn(true);
    setHistory([]);
    setCapturedWhite([]);
    setCapturedBlack([]);
    setValidMoves([]);
  }, []);

  var containerStyle = { minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a1a, #1a1a3e)', color: '#e2e8f0', fontFamily: "'Segoe UI', sans-serif", padding: '20px' };

  var boardContainerStyle = { display: 'flex', gap: '24px', flexWrap: 'wrap', justifyContent: 'center' };

  var renderBoard = function() {
    var rows = [];
    // Column labels top
    var colLabels = [React.createElement('div', { key: 'corner', style: { width: '32px', height: '24px' } })];
    for (var c = 0; c < 8; c++) {
      colLabels.push(React.createElement('div', { key: 'col' + c, style: { width: '60px', height: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: '#64748b' } }, colLetter(c)));
    }
    rows.push(React.createElement('div', { key: 'colLabelsTop', style: { display: 'flex' } }, colLabels));

    for (var r = 0; r < 8; r++) {
      (function(row) {
        var cells = [
          React.createElement('div', { key: 'rh', style: { width: '32px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: '#64748b' } }, rowNum(row))
        ];
        for (var c = 0; c < 8; c++) {
          (function(col) {
            var piece = board[row][col];
            var isLight = (row + col) % 2 === 0;
            var isSel = selected && selected[0] === row && selected[1] === col;
            var isMove = validMoves.some(function(m) { return m[0] === row && m[1] === col; });
            var isCapture = isMove && piece;

            var bg = isLight ? '#b58863' : '#6d4c3b';
            if (isSel) bg = '#6366f1';
            if (isMove && !piece) bg = isLight ? '#c5d47e' : '#8aa64e';
            if (isCapture) bg = '#ef4444aa';

            cells.push(React.createElement('div', {
              key: col,
              onClick: function() { handleClick(row, col); },
              style: {
                width: '60px', height: '60px', background: bg, display: 'flex',
                alignItems: 'center', justifyContent: 'center', cursor: 'pointer',
                fontSize: '36px', position: 'relative', transition: 'background 0.15s',
                userSelect: 'none'
              }
            }, [
              piece ? React.createElement('span', {
                key: 'piece',
                style: { textShadow: '1px 1px 2px rgba(0,0,0,0.5)', filter: isWhite(piece) ? 'drop-shadow(0 0 1px #000)' : 'none' }
              }, PIECES[piece]) : null,
              isMove && !piece ? React.createElement('div', {
                key: 'dot',
                style: { width: '16px', height: '16px', borderRadius: '50%', background: 'rgba(0,0,0,0.3)' }
              }) : null
            ]));
          })(c);
        }
        rows.push(React.createElement('div', { key: 'row' + row, style: { display: 'flex' } }, cells));
      })(r);
    }
    return React.createElement('div', {
      style: { borderRadius: '8px', overflow: 'hidden', boxShadow: '0 8px 30px rgba(0,0,0,0.4)', border: '2px solid #475569' }
    }, rows);
  };

  var sidePanel = React.createElement('div', {
    style: { width: '220px', display: 'flex', flexDirection: 'column', gap: '12px' }
  }, [
    React.createElement('div', { key: 'turn', style: { background: 'rgba(30,41,59,0.8)', borderRadius: '10px', padding: '14px', textAlign: 'center', border: '1px solid #334155' } }, [
      React.createElement('div', { key: 'l', style: { fontSize: '12px', color: '#94a3b8', marginBottom: '6px' } }, 'Current Turn'),
      React.createElement('div', { key: 'v', style: { fontSize: '24px' } }, whiteTurn ? '\u2654 White' : '\u265A Black')
    ]),
    React.createElement('button', { key: 'new', onClick: newGame, style: { padding: '10px', background: '#22c55e', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '14px', fontWeight: 'bold' } }, 'New Game'),
    React.createElement('div', { key: 'capB', style: { background: 'rgba(30,41,59,0.8)', borderRadius: '10px', padding: '12px', border: '1px solid #334155' } }, [
      React.createElement('div', { key: 'l', style: { fontSize: '11px', color: '#94a3b8', marginBottom: '6px' } }, 'Captured by White'),
      React.createElement('div', { key: 'v', style: { fontSize: '22px', minHeight: '30px', display: 'flex', flexWrap: 'wrap', gap: '2px' } },
        capturedBlack.map(function(p, i) { return React.createElement('span', { key: i }, PIECES[p]); })
      )
    ]),
    React.createElement('div', { key: 'capW', style: { background: 'rgba(30,41,59,0.8)', borderRadius: '10px', padding: '12px', border: '1px solid #334155' } }, [
      React.createElement('div', { key: 'l', style: { fontSize: '11px', color: '#94a3b8', marginBottom: '6px' } }, 'Captured by Black'),
      React.createElement('div', { key: 'v', style: { fontSize: '22px', minHeight: '30px', display: 'flex', flexWrap: 'wrap', gap: '2px' } },
        capturedWhite.map(function(p, i) { return React.createElement('span', { key: i }, PIECES[p]); })
      )
    ]),
    React.createElement('div', { key: 'hist', style: { background: 'rgba(30,41,59,0.8)', borderRadius: '10px', padding: '12px', border: '1px solid #334155', flex: 1, overflowY: 'auto', maxHeight: '200px' } }, [
      React.createElement('div', { key: 'l', style: { fontSize: '11px', color: '#94a3b8', marginBottom: '6px' } }, 'Move History'),
      React.createElement('div', { key: 'moves', style: { fontSize: '12px', fontFamily: 'monospace' } },
        history.map(function(m, i) {
          return React.createElement('div', { key: i, style: { padding: '2px 0', color: i % 2 === 0 ? '#e2e8f0' : '#94a3b8' } },
            (Math.floor(i / 2) + 1) + '.' + (i % 2 === 0 ? '' : '..') + ' ' + m
          );
        })
      )
    ])
  ]);

  return React.createElement('div', { style: containerStyle }, [
    React.createElement('a', { key: 'back', href: '/projects', style: backLinkStyle }, '\u2190 Back to Projects'),
    React.createElement('h1', { key: 'title', style: { fontSize: '28px', fontWeight: 'bold', color: '#fbbf24', marginBottom: '15px', textAlign: 'center' } }, 'Chess'),
    React.createElement('div', { key: 'board', style: boardContainerStyle }, [
      React.createElement('div', { key: 'b' }, renderBoard()),
      sidePanel
    ])
  ]);
}

var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
