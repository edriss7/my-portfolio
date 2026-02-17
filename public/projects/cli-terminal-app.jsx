const { useState, useRef, useEffect, useCallback } = React;

var backLinkStyle = { color: '#8be9fd', textDecoration: 'none', fontSize: '14px', marginBottom: '20px', display: 'inline-block' };

var MOCK_FILES = {
  'readme.txt': 'Welcome to the CLI Terminal Emulator!\nThis is a mock file system for demonstration.\nType "help" to see available commands.',
  'notes.txt': 'Meeting Notes - Feb 2026\n- Reviewed Q1 targets\n- Discussed new product launch\n- Action items assigned to team leads',
  'config.json': '{\n  "theme": "dark",\n  "fontSize": 14,\n  "autoSave": true,\n  "language": "en-US"\n}',
  'script.sh': '#!/bin/bash\necho "Hello World"\ndate\nls -la\nexit 0',
  'data.csv': 'name,age,city\nAlice,30,New York\nBob,25,San Francisco\nCharlie,35,Chicago\nDiana,28,Austin',
  'todo.md': '# TODO List\n- [x] Setup project\n- [x] Write tests\n- [ ] Deploy to staging\n- [ ] Code review\n- [ ] Update docs'
};

var HELP_TEXT = [
  'Available commands:',
  '  help        - Show this help message',
  '  clear       - Clear the terminal',
  '  echo [msg]  - Print a message',
  '  date        - Show current date and time',
  '  ls          - List files in current directory',
  '  cat [file]  - Display file contents',
  '  whoami      - Display current user',
  '  pwd         - Print working directory',
  '  history     - Show command history',
  '  uname       - System information',
  '  wc [file]   - Word count for a file',
  '  uptime      - Show system uptime',
  ''
];

function App() {
  var _lines = useState([
    { type: 'system', text: '  Terminal Emulator v2.0' },
    { type: 'system', text: '  Type "help" for available commands.' },
    { type: 'system', text: '' }
  ]), lines = _lines[0], setLines = _lines[1];
  var _input = useState(''), input = _input[0], setInput = _input[1];
  var _hist = useState([]), cmdHistory = _hist[0], setCmdHistory = _hist[1];
  var _hi = useState(-1), histIdx = _hi[0], setHistIdx = _hi[1];
  var _blink = useState(true), blink = _blink[0], setBlink = _blink[1];
  var termRef = useRef(null);
  var inputRef = useRef(null);
  var startTime = useRef(Date.now());

  useEffect(function() {
    var iv = setInterval(function() { setBlink(function(b) { return !b; }); }, 530);
    return function() { clearInterval(iv); };
  }, []);

  useEffect(function() {
    if (termRef.current) termRef.current.scrollTop = termRef.current.scrollHeight;
  }, [lines]);

  var addOutput = useCallback(function(textLines) {
    setLines(function(prev) {
      return prev.concat(textLines.map(function(t) { return { type: 'output', text: t }; }));
    });
  }, []);

  var processCommand = useCallback(function(cmd) {
    var trimmed = cmd.trim();
    if (!trimmed) return;

    setCmdHistory(function(h) { return h.concat([trimmed]); });
    setHistIdx(-1);

    setLines(function(prev) {
      return prev.concat([{ type: 'command', text: 'guest@terminal:~$ ' + trimmed }]);
    });

    var parts = trimmed.split(/\s+/);
    var command = parts[0].toLowerCase();
    var args = parts.slice(1);

    switch (command) {
      case 'help':
        addOutput(HELP_TEXT);
        break;
      case 'clear':
        setLines([]);
        break;
      case 'echo':
        addOutput([args.join(' ') || '']);
        break;
      case 'date':
        addOutput([new Date().toString()]);
        break;
      case 'ls':
        var fileList = Object.keys(MOCK_FILES);
        var rows = [];
        var perRow = 3;
        for (var i = 0; i < fileList.length; i += perRow) {
          var row = fileList.slice(i, i + perRow).map(function(f) {
            return (f + '                ').slice(0, 16);
          }).join('');
          rows.push(row);
        }
        addOutput(['total ' + fileList.length].concat(rows).concat(['']));
        break;
      case 'cat':
        if (args.length === 0) {
          addOutput(['cat: missing file operand', 'Usage: cat [filename]']);
        } else {
          var fileName = args[0];
          if (MOCK_FILES[fileName]) {
            addOutput(MOCK_FILES[fileName].split('\n').concat(['']));
          } else {
            addOutput(['cat: ' + fileName + ': No such file or directory']);
          }
        }
        break;
      case 'whoami':
        addOutput(['guest']);
        break;
      case 'pwd':
        addOutput(['/home/guest']);
        break;
      case 'history':
        var histLines = cmdHistory.concat([trimmed]).map(function(c, i) {
          return '  ' + (i + 1) + '  ' + c;
        });
        addOutput(histLines.concat(['']));
        break;
      case 'uname':
        addOutput(['TerminalOS 2.0.0 x86_64 Virtual Machine']);
        break;
      case 'wc':
        if (args.length === 0) {
          addOutput(['wc: missing file operand']);
        } else {
          var f = args[0];
          if (MOCK_FILES[f]) {
            var content = MOCK_FILES[f];
            var lineCount = content.split('\n').length;
            var wordCount = content.split(/\s+/).filter(Boolean).length;
            var charCount = content.length;
            addOutput(['  ' + lineCount + '  ' + wordCount + '  ' + charCount + '  ' + f]);
          } else {
            addOutput(['wc: ' + f + ': No such file or directory']);
          }
        }
        break;
      case 'uptime':
        var elapsed = Math.floor((Date.now() - startTime.current) / 1000);
        var mins = Math.floor(elapsed / 60);
        var secs = elapsed % 60;
        addOutput(['up ' + mins + ' min ' + secs + ' sec, 1 user, load average: 0.42, 0.38, 0.35']);
        break;
      default:
        addOutput([command + ': command not found. Type "help" for available commands.']);
    }
  }, [cmdHistory, addOutput]);

  var handleKeyDown = useCallback(function(e) {
    if (e.key === 'Enter') {
      processCommand(input);
      setInput('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      var allHist = cmdHistory;
      if (allHist.length === 0) return;
      var newIdx = histIdx === -1 ? allHist.length - 1 : Math.max(0, histIdx - 1);
      setHistIdx(newIdx);
      setInput(allHist[newIdx] || '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      var allHist2 = cmdHistory;
      if (histIdx === -1) return;
      var newIdx2 = histIdx + 1;
      if (newIdx2 >= allHist2.length) {
        setHistIdx(-1);
        setInput('');
      } else {
        setHistIdx(newIdx2);
        setInput(allHist2[newIdx2] || '');
      }
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  }, [input, cmdHistory, histIdx, processCommand]);

  var containerStyle = { minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a1a, #1a1a3e)', color: '#e2e8f0', fontFamily: "'Segoe UI', sans-serif", padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' };

  var terminalStyle = {
    width: '100%', maxWidth: '850px', background: '#0c0c0c', borderRadius: '12px',
    border: '1px solid #333', overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.5)'
  };

  var titleBarStyle = {
    display: 'flex', alignItems: 'center', padding: '8px 14px', background: '#1a1a2e',
    borderBottom: '1px solid #333', gap: '8px'
  };

  var dotStyle = function(color) { return { width: '12px', height: '12px', borderRadius: '50%', background: color }; };

  var outputStyle = {
    padding: '16px', height: '500px', overflowY: 'auto', fontFamily: "'Courier New', Consolas, monospace",
    fontSize: '14px', lineHeight: '1.5'
  };

  var renderLine = function(line, idx) {
    var color = '#33ff33';
    if (line.type === 'system') color = '#67e8f9';
    if (line.type === 'command') color = '#33ff33';
    if (line.type === 'output') color = '#cccccc';

    return React.createElement('div', { key: idx, style: { color: color, whiteSpace: 'pre-wrap', wordBreak: 'break-all' } }, line.text);
  };

  var inputLine = React.createElement('div', {
    style: { display: 'flex', alignItems: 'center', color: '#33ff33', whiteSpace: 'nowrap' }
  }, [
    React.createElement('span', { key: 'prompt', style: { color: '#22c55e', marginRight: '0' } }, 'guest@terminal'),
    React.createElement('span', { key: 'colon', style: { color: '#64748b' } }, ':'),
    React.createElement('span', { key: 'path', style: { color: '#6366f1' } }, '~'),
    React.createElement('span', { key: 'dollar', style: { color: '#e2e8f0', marginRight: '8px' } }, '$ '),
    React.createElement('input', {
      key: 'input',
      ref: inputRef,
      value: input,
      onChange: function(e) { setInput(e.target.value); },
      onKeyDown: handleKeyDown,
      autoFocus: true,
      spellCheck: false,
      style: {
        flex: 1, background: 'transparent', border: 'none', outline: 'none',
        color: '#33ff33', fontFamily: "'Courier New', Consolas, monospace", fontSize: '14px',
        caretColor: blink ? '#33ff33' : 'transparent'
      }
    })
  ]);

  return React.createElement('div', { style: containerStyle }, [
    React.createElement('a', { key: 'back', href: '/projects', style: Object.assign({}, backLinkStyle, { alignSelf: 'flex-start' }) }, '\u2190 Back to Projects'),
    React.createElement('h1', { key: 'title', style: { fontSize: '26px', fontWeight: 'bold', color: '#22c55e', marginBottom: '20px' } }, 'CLI Terminal'),
    React.createElement('div', { key: 'term', style: terminalStyle, onClick: function() { if (inputRef.current) inputRef.current.focus(); } }, [
      React.createElement('div', { key: 'titlebar', style: titleBarStyle }, [
        React.createElement('div', { key: 'd1', style: dotStyle('#ff5f57') }),
        React.createElement('div', { key: 'd2', style: dotStyle('#ffbd2e') }),
        React.createElement('div', { key: 'd3', style: dotStyle('#28c840') }),
        React.createElement('span', { key: 'title', style: { marginLeft: '10px', color: '#64748b', fontSize: '12px' } }, 'guest@terminal: ~')
      ]),
      React.createElement('div', { key: 'output', ref: termRef, style: outputStyle }, [
        React.createElement('div', { key: 'lines' }, lines.map(renderLine)),
        React.createElement('div', { key: 'input' }, inputLine)
      ])
    ]),
    React.createElement('div', { key: 'hints', style: { maxWidth: '850px', width: '100%', marginTop: '12px', display: 'flex', gap: '12px', flexWrap: 'wrap' } }, [
      React.createElement('span', { key: 'h1', style: { fontSize: '11px', color: '#475569', background: 'rgba(30,41,59,0.5)', padding: '4px 8px', borderRadius: '4px' } }, '\u2191\u2193 History'),
      React.createElement('span', { key: 'h2', style: { fontSize: '11px', color: '#475569', background: 'rgba(30,41,59,0.5)', padding: '4px 8px', borderRadius: '4px' } }, 'Ctrl+L Clear'),
      React.createElement('span', { key: 'h3', style: { fontSize: '11px', color: '#475569', background: 'rgba(30,41,59,0.5)', padding: '4px 8px', borderRadius: '4px' } }, 'Enter Execute')
    ])
  ]);
}

var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
