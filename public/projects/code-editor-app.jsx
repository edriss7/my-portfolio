const { useState, useEffect, useRef, useCallback } = React;

var sampleCode = '// Simple JavaScript Example\nfunction fibonacci(n) {\n  if (n <= 1) return n;\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}\n\n// Calculate first 10 fibonacci numbers\nvar results = [];\nfor (var i = 0; i < 10; i++) {\n  results.push(fibonacci(i));\n}\n\nconsole.log("Fibonacci sequence:");\nconsole.log(results.join(", "));\n\n// Simple math\nvar x = 42;\nvar y = 58;\nconsole.log("Sum: " + (x + y));\nconsole.log("Product: " + (x * y));\n\n// String operations\nvar greeting = "Hello, World!";\nconsole.log(greeting.toUpperCase());\nconsole.log("Length: " + greeting.length);';

function highlightCode(code) {
  var keywords = ['function', 'var', 'let', 'const', 'if', 'else', 'for', 'while', 'return', 'true', 'false', 'null', 'undefined', 'new', 'this', 'typeof', 'class', 'extends', 'import', 'export', 'default', 'switch', 'case', 'break', 'continue', 'try', 'catch', 'throw', 'finally', 'do', 'in', 'of'];

  var lines = code.split('\n');
  return lines.map(function(line) {
    var segments = [];
    var remaining = line;
    var idx = 0;

    while (remaining.length > 0) {
      // Check for single-line comments
      if (remaining.indexOf('//') === 0) {
        segments.push({ type: 'comment', text: remaining });
        remaining = '';
        continue;
      }

      // Check for strings (double quotes)
      if (remaining[0] === '"') {
        var endIdx = remaining.indexOf('"', 1);
        if (endIdx === -1) endIdx = remaining.length - 1;
        var str = remaining.substring(0, endIdx + 1);
        segments.push({ type: 'string', text: str });
        remaining = remaining.substring(endIdx + 1);
        continue;
      }

      // Check for strings (single quotes)
      if (remaining[0] === "'") {
        var endIdx2 = remaining.indexOf("'", 1);
        if (endIdx2 === -1) endIdx2 = remaining.length - 1;
        var str2 = remaining.substring(0, endIdx2 + 1);
        segments.push({ type: 'string', text: str2 });
        remaining = remaining.substring(endIdx2 + 1);
        continue;
      }

      // Check for numbers
      var numMatch = remaining.match(/^(\d+\.?\d*)/);
      if (numMatch && (idx === 0 || /[\s(,=+\-*/<>!&|^%]/.test(line[line.length - remaining.length - 1] || ' '))) {
        segments.push({ type: 'number', text: numMatch[1] });
        remaining = remaining.substring(numMatch[1].length);
        continue;
      }

      // Check for keywords
      var foundKeyword = false;
      for (var k = 0; k < keywords.length; k++) {
        var kw = keywords[k];
        if (remaining.indexOf(kw) === 0) {
          var nextChar = remaining[kw.length];
          if (!nextChar || /[^a-zA-Z0-9_$]/.test(nextChar)) {
            segments.push({ type: 'keyword', text: kw });
            remaining = remaining.substring(kw.length);
            foundKeyword = true;
            break;
          }
        }
      }
      if (foundKeyword) continue;

      // Check for function calls
      var funcMatch = remaining.match(/^([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\(/);
      if (funcMatch) {
        segments.push({ type: 'function', text: funcMatch[1] });
        remaining = remaining.substring(funcMatch[1].length);
        continue;
      }

      // Default: plain text character by character until next special
      var plainEnd = 1;
      while (plainEnd < remaining.length) {
        var ch = remaining[plainEnd];
        if (ch === '"' || ch === "'" || ch === '/' || /\d/.test(ch)) break;
        var isKw = false;
        for (var kk = 0; kk < keywords.length; kk++) {
          if (remaining.indexOf(keywords[kk], plainEnd) === plainEnd) {
            var prevCh = remaining[plainEnd - 1];
            if (/[^a-zA-Z0-9_$]/.test(prevCh)) { isKw = true; break; }
          }
        }
        if (isKw) break;
        plainEnd++;
      }
      segments.push({ type: 'plain', text: remaining.substring(0, plainEnd) });
      remaining = remaining.substring(plainEnd);
    }

    return segments;
  });
}

var colorMap = {
  keyword: '#c678dd',
  string: '#98c379',
  number: '#d19a66',
  comment: '#5c6370',
  function: '#61afef',
  plain: '#abb2bf'
};

function App() {
  var _s1 = useState(sampleCode);
  var code = _s1[0], setCode = _s1[1];
  var _s2 = useState('');
  var output = _s2[0], setOutput = _s2[1];
  var textareaRef = useRef(null);
  var highlightRef = useRef(null);

  var lines = code.split('\n');
  var lineCount = lines.length;
  var charCount = code.length;

  var highlighted = highlightCode(code);

  function runCode() {
    var logs = [];
    var fakeConsole = {
      log: function() {
        var args = Array.prototype.slice.call(arguments);
        logs.push(args.map(function(a) { return typeof a === 'object' ? JSON.stringify(a) : String(a); }).join(' '));
      }
    };
    try {
      var fn = new Function('console', code);
      fn(fakeConsole);
      setOutput(logs.join('\n') || '(no output)');
    } catch (e) {
      setOutput('Error: ' + e.message);
    }
  }

  function clearCode() {
    setCode('');
    setOutput('');
  }

  function handleScroll(e) {
    if (highlightRef.current) {
      highlightRef.current.scrollTop = e.target.scrollTop;
      highlightRef.current.scrollLeft = e.target.scrollLeft;
    }
  }

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
    content: { maxWidth: '900px', margin: '0 auto', padding: '0 20px' },
    toolbar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '10px',
      flexWrap: 'wrap',
      gap: '10px'
    },
    toolbarBtns: { display: 'flex', gap: '8px' },
    btn: {
      padding: '8px 18px',
      borderRadius: '8px',
      border: 'none',
      fontSize: '13px',
      cursor: 'pointer',
      fontWeight: '600'
    },
    runBtn: {
      background: 'linear-gradient(135deg, #2ecc71, #27ae60)',
      color: '#fff'
    },
    clearBtn: {
      background: 'rgba(231,76,60,0.2)',
      color: '#e74c3c'
    },
    stats: { fontSize: '13px', color: '#888' },
    editorWrapper: {
      position: 'relative',
      display: 'flex',
      background: '#282c34',
      borderRadius: '12px',
      overflow: 'hidden',
      marginBottom: '20px',
      border: '1px solid rgba(255,255,255,0.1)'
    },
    lineNumbers: {
      padding: '15px 0',
      background: '#21252b',
      textAlign: 'right',
      userSelect: 'none',
      minWidth: '45px',
      flexShrink: 0,
      overflowY: 'hidden'
    },
    lineNumber: {
      padding: '0 10px 0 8px',
      fontSize: '14px',
      lineHeight: '1.5',
      color: '#636d83',
      fontFamily: "'Consolas', 'Monaco', 'Courier New', monospace"
    },
    editorContainer: {
      flex: 1,
      position: 'relative',
      overflow: 'hidden'
    },
    textarea: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      padding: '15px',
      fontSize: '14px',
      lineHeight: '1.5',
      fontFamily: "'Consolas', 'Monaco', 'Courier New', monospace",
      background: 'transparent',
      color: 'transparent',
      caretColor: '#fff',
      border: 'none',
      outline: 'none',
      resize: 'none',
      overflow: 'auto',
      whiteSpace: 'pre',
      boxSizing: 'border-box',
      zIndex: 2
    },
    highlightLayer: {
      padding: '15px',
      fontSize: '14px',
      lineHeight: '1.5',
      fontFamily: "'Consolas', 'Monaco', 'Courier New', monospace",
      whiteSpace: 'pre',
      overflow: 'hidden',
      minHeight: '300px',
      pointerEvents: 'none',
      zIndex: 1
    },
    outputPanel: {
      background: '#1e1e1e',
      borderRadius: '12px',
      padding: '15px 20px',
      border: '1px solid rgba(255,255,255,0.1)'
    },
    outputTitle: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#888',
      marginBottom: '8px'
    },
    outputContent: {
      fontFamily: "'Consolas', 'Monaco', 'Courier New', monospace",
      fontSize: '13px',
      lineHeight: '1.5',
      color: '#2ecc71',
      whiteSpace: 'pre-wrap',
      maxHeight: '200px',
      overflowY: 'auto'
    }
  };

  return React.createElement('div', { style: styles.container },
    React.createElement('a', { href: '/projects', style: styles.backLink }, '\u2190 Back to Projects'),
    React.createElement('h1', { style: styles.header }, 'Code Editor'),
    React.createElement('div', { style: styles.content },
      React.createElement('div', { style: styles.toolbar },
        React.createElement('div', { style: styles.toolbarBtns },
          React.createElement('button', { style: Object.assign({}, styles.btn, styles.runBtn), onClick: runCode }, '\u25B6 Run'),
          React.createElement('button', { style: Object.assign({}, styles.btn, styles.clearBtn), onClick: clearCode }, 'Clear')
        ),
        React.createElement('div', { style: styles.stats },
          'Lines: ' + lineCount + ' | Characters: ' + charCount
        )
      ),
      React.createElement('div', { style: styles.editorWrapper },
        React.createElement('div', { style: styles.lineNumbers },
          lines.map(function(_, i) {
            return React.createElement('div', { key: i, style: styles.lineNumber }, i + 1);
          })
        ),
        React.createElement('div', { style: styles.editorContainer },
          React.createElement('div', { ref: highlightRef, style: styles.highlightLayer },
            highlighted.map(function(lineSegments, lineIdx) {
              return React.createElement('div', { key: lineIdx },
                lineSegments.length === 0
                  ? React.createElement('span', null, '\u00A0')
                  : lineSegments.map(function(seg, segIdx) {
                      return React.createElement('span', {
                        key: segIdx,
                        style: { color: colorMap[seg.type] || '#abb2bf' }
                      }, seg.text);
                    })
              );
            })
          ),
          React.createElement('textarea', {
            ref: textareaRef,
            style: styles.textarea,
            value: code,
            onChange: function(e) { setCode(e.target.value); },
            onScroll: handleScroll,
            spellCheck: false
          })
        )
      ),
      React.createElement('div', { style: styles.outputPanel },
        React.createElement('div', { style: styles.outputTitle }, 'Output'),
        React.createElement('div', { style: styles.outputContent },
          output || 'Click "Run" to execute your code...'
        )
      )
    )
  );
}

var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
