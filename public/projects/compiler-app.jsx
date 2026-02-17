const { useState, useCallback, useEffect } = React;

var backLinkStyle = { color: '#7b8cff', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '20px' };
var containerStyle = { minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%)', color: '#e0e0e0', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", padding: '20px', display: 'flex', flexDirection: 'column' };

var samplePrograms = {
  javascript: {
    'Hello World': 'console.log("Hello, World!");\nconsole.log("Welcome to the playground!");',
    'Fibonacci': 'function fibonacci(n) {\n  if (n <= 1) return n;\n  return fibonacci(n - 1) + fibonacci(n - 2);\n}\n\nfor (let i = 0; i < 10; i++) {\n  console.log("fib(" + i + ") = " + fibonacci(i));\n}',
    'FizzBuzz': 'for (let i = 1; i <= 30; i++) {\n  if (i % 15 === 0) console.log("FizzBuzz");\n  else if (i % 3 === 0) console.log("Fizz");\n  else if (i % 5 === 0) console.log("Buzz");\n  else console.log(i);\n}',
    'Array Sort': 'const arr = [64, 34, 25, 12, 22, 11, 90];\nconsole.log("Before:", arr.join(", "));\narr.sort((a, b) => a - b);\nconsole.log("After:", arr.join(", "));'
  },
  python: {
    'Hello World': 'print("Hello, World!")\nprint("Welcome to the playground!")',
    'Fibonacci': 'def fibonacci(n):\n    if n <= 1:\n        return n\n    return fibonacci(n - 1) + fibonacci(n - 2)\n\nfor i in range(10):\n    print(f"fib({i}) = {fibonacci(i)}")',
    'FizzBuzz': 'for i in range(1, 31):\n    if i % 15 == 0:\n        print("FizzBuzz")\n    elif i % 3 == 0:\n        print("Fizz")\n    elif i % 5 == 0:\n        print("Buzz")\n    else:\n        print(i)',
    'List Comp': 'squares = [x**2 for x in range(10)]\nprint("Squares:", squares)\nevens = [x for x in squares if x % 2 == 0]\nprint("Even squares:", evens)'
  }
};

function mockExecute(code, lang, stdin) {
  var start = Date.now();
  var output = [];
  var hasError = false;

  if (lang === 'javascript') {
    try {
      var lines = code.split('\n');
      var consoleLogs = [];
      var modifiedCode = code.replace(/console\.log\(/g, '__log__(');
      var __log__ = function() {
        consoleLogs.push(Array.prototype.slice.call(arguments).map(function(a) { return String(a); }).join(' '));
      };
      try {
        var fn = new Function('__log__', 'stdin', modifiedCode);
        fn(__log__, stdin);
      } catch (e) {
        hasError = true;
        consoleLogs.push('Error: ' + e.message);
      }
      output = consoleLogs;
    } catch (e) {
      hasError = true;
      output = ['SyntaxError: ' + e.message];
    }
  } else {
    // Mock Python execution
    var pyLines = code.split('\n');
    pyLines.forEach(function(line) {
      var trimmed = line.trim();
      var printMatch = trimmed.match(/^print\((.+)\)$/);
      if (printMatch) {
        var arg = printMatch[1];
        arg = arg.replace(/f"([^"]*)\{([^}]*)\}([^"]*)"/g, function(_, before, expr, after) {
          return '"' + before + '[' + expr + ']' + after + '"';
        });
        try {
          var val = arg.replace(/^["']|["']$/g, '');
          output.push(val);
        } catch (e) {
          output.push(arg);
        }
      }
    });
    if (output.length === 0 && code.trim().length > 0) {
      output = ['[Python mock] Execution complete. (Print statements parsed only)'];
    }
  }

  var elapsed = Date.now() - start;
  return { output: output, hasError: hasError, time: Math.max(elapsed, Math.floor(Math.random() * 50 + 5)) };
}

function App() {
  var s1 = useState('javascript'), lang = s1[0], setLang = s1[1];
  var s2 = useState(samplePrograms.javascript['Hello World']), code = s2[0], setCode = s2[1];
  var s3 = useState([]), output = s3[0], setOutput = s3[1];
  var s4 = useState(''), stdin = s4[0], setStdin = s4[1];
  var s5 = useState(null), execTime = s5[0], setExecTime = s5[1];
  var s6 = useState(false), hasError = s6[0], setHasError = s6[1];
  var s7 = useState(false), running = s7[0], setRunning = s7[1];

  var runCode = useCallback(function() {
    setRunning(true);
    setOutput([]);
    setExecTime(null);
    setHasError(false);
    setTimeout(function() {
      var result = mockExecute(code, lang, stdin);
      setOutput(result.output);
      setHasError(result.hasError);
      setExecTime(result.time);
      setRunning(false);
    }, 300 + Math.random() * 200);
  }, [code, lang, stdin]);

  var loadSample = useCallback(function(name) {
    var progs = samplePrograms[lang];
    if (progs[name]) {
      setCode(progs[name]);
      setOutput([]);
      setExecTime(null);
      setHasError(false);
    }
  }, [lang]);

  var changeLang = useCallback(function(newLang) {
    setLang(newLang);
    var progs = samplePrograms[newLang];
    var firstKey = Object.keys(progs)[0];
    setCode(progs[firstKey]);
    setOutput([]);
    setExecTime(null);
    setHasError(false);
  }, []);

  var codeLines = code.split('\n');
  var sampleNames = Object.keys(samplePrograms[lang]);

  return React.createElement('div', { style: containerStyle },
    React.createElement('a', { href: '/projects', style: backLinkStyle }, '\u2190 Back to Projects'),

    // Top bar
    React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' } },
      React.createElement('h1', { style: { fontSize: '28px', fontWeight: '800', color: '#fff', margin: 0 } }, 'Code Playground'),
      React.createElement('div', { style: { display: 'flex', gap: '10px', alignItems: 'center' } },
        React.createElement('select', { value: lang, onChange: function(e) { changeLang(e.target.value); }, style: { padding: '8px 14px', background: '#1e1e3a', color: '#e0e0e0', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', fontSize: '14px' } },
          React.createElement('option', { value: 'javascript' }, 'JavaScript'),
          React.createElement('option', { value: 'python' }, 'Python (Mock)')
        ),
        React.createElement('button', { onClick: runCode, disabled: running, style: { padding: '8px 20px', background: running ? '#6b7280' : '#4ade80', color: '#000', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '700', cursor: running ? 'default' : 'pointer', display: 'flex', alignItems: 'center', gap: '6px' } },
          React.createElement('span', null, '\u25B6'),
          React.createElement('span', null, running ? 'Running...' : 'Run')
        )
      )
    ),

    // Sample programs
    React.createElement('div', { style: { display: 'flex', gap: '8px', marginBottom: '12px', flexWrap: 'wrap' } },
      React.createElement('span', { style: { fontSize: '12px', color: '#6b7280', alignSelf: 'center', marginRight: '4px' } }, 'Samples:'),
      sampleNames.map(function(name) {
        return React.createElement('button', { key: name, onClick: function() { loadSample(name); }, style: { padding: '5px 12px', background: 'rgba(123,140,255,0.15)', color: '#7b8cff', border: '1px solid rgba(123,140,255,0.3)', borderRadius: '6px', fontSize: '12px', cursor: 'pointer', fontWeight: '500' } }, name);
      })
    ),

    // Editor + Output
    React.createElement('div', { style: { display: 'flex', gap: '16px', flex: 1, minHeight: '400px' } },
      // Editor
      React.createElement('div', { style: { flex: 1, display: 'flex', flexDirection: 'column', background: '#0d0d1f', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' } },
        React.createElement('div', { style: { padding: '8px 14px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: '12px', color: '#6b7280', display: 'flex', justifyContent: 'space-between' } },
          React.createElement('span', null, lang === 'javascript' ? 'main.js' : 'main.py'),
          React.createElement('span', null, codeLines.length + ' lines')
        ),
        React.createElement('div', { style: { display: 'flex', flex: 1, overflow: 'auto' } },
          // Line numbers
          React.createElement('div', { style: { padding: '12px 0', background: 'rgba(0,0,0,0.2)', minWidth: '44px', textAlign: 'right', userSelect: 'none' } },
            codeLines.map(function(_, i) {
              return React.createElement('div', { key: i, style: { padding: '0 10px', fontSize: '13px', lineHeight: '21px', color: '#4a4a6a', fontFamily: 'monospace' } }, i + 1);
            })
          ),
          // Code area
          React.createElement('textarea', {
            value: code,
            onChange: function(e) { setCode(e.target.value); },
            spellCheck: false,
            style: { flex: 1, padding: '12px', background: 'transparent', color: '#e0e0e0', border: 'none', outline: 'none', fontSize: '13px', lineHeight: '21px', fontFamily: "'Fira Code', 'Cascadia Code', 'Consolas', monospace", resize: 'none', whiteSpace: 'pre', overflowWrap: 'normal', overflowX: 'auto', tabSize: 2 }
          })
        )
      ),

      // Right side: output + stdin
      React.createElement('div', { style: { flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' } },
        // Output
        React.createElement('div', { style: { flex: 1, background: '#0d0d1f', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column' } },
          React.createElement('div', { style: { padding: '8px 14px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: '12px', color: '#6b7280', display: 'flex', justifyContent: 'space-between' } },
            React.createElement('span', null, 'Output'),
            execTime !== null && React.createElement('span', { style: { color: hasError ? '#f87171' : '#4ade80' } }, execTime + 'ms')
          ),
          React.createElement('div', { style: { flex: 1, padding: '12px', overflow: 'auto', fontFamily: 'monospace', fontSize: '13px', lineHeight: '20px' } },
            running ? React.createElement('div', { style: { color: '#fbbf24' } }, 'Executing...') :
            output.length === 0 ? React.createElement('div', { style: { color: '#4a4a6a' } }, 'Run code to see output here') :
            output.map(function(line, i) {
              return React.createElement('div', { key: i, style: { color: hasError ? '#f87171' : '#e0e0e0', padding: '1px 0' } }, line);
            })
          )
        ),

        // Stdin
        React.createElement('div', { style: { background: '#0d0d1f', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)' } },
          React.createElement('div', { style: { padding: '8px 14px', background: 'rgba(255,255,255,0.03)', borderBottom: '1px solid rgba(255,255,255,0.06)', fontSize: '12px', color: '#6b7280' } }, 'Standard Input (stdin)'),
          React.createElement('textarea', {
            value: stdin,
            onChange: function(e) { setStdin(e.target.value); },
            placeholder: 'Enter input data here...',
            style: { width: '100%', minHeight: '80px', padding: '12px', background: 'transparent', color: '#e0e0e0', border: 'none', outline: 'none', fontSize: '13px', fontFamily: 'monospace', resize: 'vertical', boxSizing: 'border-box' }
          })
        ),

        // Execution info
        execTime !== null && React.createElement('div', { style: { background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '12px 16px', border: '1px solid rgba(255,255,255,0.08)', display: 'flex', justifyContent: 'space-between', fontSize: '13px' } },
          React.createElement('span', { style: { color: '#9ca3af' } }, 'Language: ' + (lang === 'javascript' ? 'JavaScript' : 'Python')),
          React.createElement('span', { style: { color: '#9ca3af' } }, 'Lines: ' + codeLines.length),
          React.createElement('span', { style: { color: hasError ? '#f87171' : '#4ade80' } }, hasError ? '\u2717 Error' : '\u2713 Success'),
          React.createElement('span', { style: { color: '#fbbf24' } }, execTime + 'ms')
        )
      )
    )
  );
}

var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
