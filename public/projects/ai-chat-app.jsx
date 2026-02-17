const { useState, useEffect, useRef, useCallback } = React;

var backLinkStyle = { color: '#8be9fd', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '16px' };
var containerStyle = { minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%)', color: '#e0e0e0', fontFamily: "'Segoe UI', Tahoma, sans-serif", padding: '0' };

var SUGGESTED = ['Explain quantum computing', 'Write a Python function', 'Compare React vs Vue', 'How does blockchain work?'];
var MODELS = ['GPT-4 Turbo', 'Claude 3.5 Sonnet', 'Gemini Ultra', 'Llama 3 70B'];

var INITIAL_CONVOS = [
  { id: 1, title: 'Python Help', messages: [
    { role: 'user', text: 'How do I read a CSV file in Python?', time: '10:30 AM' },
    { role: 'ai', text: 'You can use the built-in `csv` module or the popular `pandas` library:\n\n```python\nimport pandas as pd\ndf = pd.read_csv("data.csv")\nprint(df.head())\n```\n\nOr with the csv module:\n\n```python\nimport csv\nwith open("data.csv") as f:\n    reader = csv.reader(f)\n    for row in reader:\n        print(row)\n```', time: '10:30 AM' }
  ]},
  { id: 2, title: 'React Patterns', messages: [
    { role: 'user', text: 'What are the best React design patterns?', time: '9:15 AM' },
    { role: 'ai', text: 'Here are the most important React design patterns:\n\n1. **Container/Presentational** - Separate logic from UI\n2. **Custom Hooks** - Extract reusable stateful logic\n3. **Compound Components** - Components that work together\n4. **Render Props** - Share code via a prop that is a function\n5. **Higher-Order Components** - Wrap components to add behavior\n\nCustom Hooks are the most modern and recommended approach for most use cases.', time: '9:15 AM' }
  ]},
  { id: 3, title: 'SQL Queries', messages: [] }
];

function formatMessage(text) {
  var parts = [];
  var segments = text.split('```');
  segments.forEach(function(seg, i) {
    if (i % 2 === 1) {
      var lines = seg.split('\n');
      var lang = lines[0].trim();
      var code = lines.slice(lang ? 1 : 0).join('\n');
      parts.push(React.createElement('div', { key: 'code-' + i, style: { background: '#0d1117', borderRadius: '8px', padding: '12px', margin: '8px 0', fontFamily: 'Consolas, monospace', fontSize: '13px', overflowX: 'auto', border: '1px solid rgba(255,255,255,0.1)' } },
        lang ? React.createElement('div', { style: { fontSize: '10px', color: '#888', marginBottom: '6px', textTransform: 'uppercase' } }, lang) : null,
        React.createElement('pre', { style: { margin: 0, color: '#e6db74', whiteSpace: 'pre-wrap' } }, code)
      ));
    } else {
      var textParts = seg.split(/(\*\*[^*]+\*\*)/g);
      var formatted = textParts.map(function(tp, j) {
        if (tp.startsWith('**') && tp.endsWith('**')) {
          return React.createElement('strong', { key: 'b-' + i + '-' + j, style: { color: '#fff' } }, tp.slice(2, -2));
        }
        var inlineParts = tp.split(/(`[^`]+`)/g);
        return inlineParts.map(function(ip, k) {
          if (ip.startsWith('`') && ip.endsWith('`')) {
            return React.createElement('code', { key: 'ic-' + i + '-' + j + '-' + k, style: { background: 'rgba(139,233,253,0.15)', color: '#8be9fd', padding: '2px 5px', borderRadius: '4px', fontSize: '13px' } }, ip.slice(1, -1));
          }
          return ip;
        });
      });
      parts.push(React.createElement('span', { key: 'text-' + i }, formatted));
    }
  });
  return parts;
}

var AI_RESPONSES = [
  'That\'s a great question! Let me break it down for you.\n\nThe key concepts to understand are:\n\n1. **State Management** - How data flows through your application\n2. **Component Lifecycle** - When and how components update\n3. **Performance** - Optimizing re-renders and memory usage\n\nWould you like me to elaborate on any of these?',
  'Here\'s a simple example:\n\n```javascript\nfunction greet(name) {\n  return `Hello, ${name}!`;\n}\n\nconsole.log(greet("World"));\n```\n\nThis function takes a `name` parameter and returns a greeting string using template literals.',
  'I\'d be happy to help with that! Here are some tips:\n\n- **Start simple** and iterate\n- Use `console.log` for debugging\n- Write tests early\n- Read documentation thoroughly\n\nLet me know if you need more specific guidance!'
];

function App() {
  var _convos = useState(INITIAL_CONVOS), convos = _convos[0], setConvos = _convos[1];
  var _active = useState(1), activeId = _active[0], setActiveId = _active[1];
  var _input = useState(''), input = _input[0], setInput = _input[1];
  var _model = useState('Claude 3.5 Sonnet'), model = _model[0], setModel = _model[1];
  var _typing = useState(false), typing = _typing[0], setTyping = _typing[1];
  var _sidebar = useState(true), showSidebar = _sidebar[0], setShowSidebar = _sidebar[1];
  var chatEndRef = useRef(null);
  var responseIdx = useRef(0);

  var activeConvo = convos.find(function(c) { return c.id === activeId; }) || convos[0];

  useEffect(function() {
    if (chatEndRef.current) chatEndRef.current.scrollIntoView({ behavior: 'smooth' });
  }, [activeConvo.messages.length, typing]);

  var sendMessage = useCallback(function(text) {
    if (!text.trim()) return;
    var now = new Date();
    var timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setConvos(function(prev) {
      return prev.map(function(c) {
        if (c.id !== activeId) return c;
        var msgs = c.messages.concat([{ role: 'user', text: text, time: timeStr }]);
        var title = c.messages.length === 0 ? text.slice(0, 25) + '...' : c.title;
        return Object.assign({}, c, { messages: msgs, title: title });
      });
    });
    setInput('');
    setTyping(true);

    setTimeout(function() {
      var resp = AI_RESPONSES[responseIdx.current % AI_RESPONSES.length];
      responseIdx.current++;
      setConvos(function(prev) {
        return prev.map(function(c) {
          if (c.id !== activeId) return c;
          return Object.assign({}, c, { messages: c.messages.concat([{ role: 'ai', text: resp, time: timeStr }]) });
        });
      });
      setTyping(false);
    }, 1500);
  }, [activeId]);

  var newChat = function() {
    var newId = Math.max.apply(null, convos.map(function(c) { return c.id; })) + 1;
    setConvos(function(prev) { return [{ id: newId, title: 'New Chat', messages: [] }].concat(prev); });
    setActiveId(newId);
  };

  // Sidebar
  var sidebarEl = showSidebar ? React.createElement('div', { style: { width: '260px', background: 'rgba(0,0,0,0.3)', borderRight: '1px solid rgba(255,255,255,0.08)', display: 'flex', flexDirection: 'column', flexShrink: 0 } },
    React.createElement('div', { style: { padding: '16px' } },
      React.createElement('a', { href: '/projects', style: backLinkStyle }, '\u2190 Back to Projects'),
      React.createElement('button', { onClick: newChat, style: { width: '100%', padding: '12px', borderRadius: '10px', border: '1px dashed rgba(139,233,253,0.3)', background: 'transparent', color: '#8be9fd', cursor: 'pointer', fontSize: '14px', fontWeight: '600' } }, '+ New Chat')
    ),
    React.createElement('div', { style: { flex: 1, overflowY: 'auto', padding: '0 8px' } },
      convos.map(function(c) {
        return React.createElement('div', {
          key: c.id, onClick: function() { setActiveId(c.id); },
          style: { padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', marginBottom: '4px', background: activeId === c.id ? 'rgba(139,233,253,0.1)' : 'transparent', color: activeId === c.id ? '#8be9fd' : '#888', fontSize: '13px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }
        }, c.title);
      })
    ),
    React.createElement('div', { style: { padding: '12px 16px', borderTop: '1px solid rgba(255,255,255,0.08)' } },
      React.createElement('select', {
        value: model, onChange: function(e) { setModel(e.target.value); },
        style: { width: '100%', padding: '8px', borderRadius: '8px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#e0e0e0', fontSize: '12px' }
      }, MODELS.map(function(m) { return React.createElement('option', { key: m, value: m, style: { background: '#1a1a3e' } }, m); }))
    )
  ) : null;

  // Typing indicator
  var typingEl = typing ? React.createElement('div', { style: { display: 'flex', justifyContent: 'flex-start', marginBottom: '12px' } },
    React.createElement('div', { style: { maxWidth: '70%', padding: '12px 16px', borderRadius: '16px 16px 16px 4px', background: 'rgba(139,233,253,0.08)' } },
      React.createElement('div', { style: { display: 'flex', gap: '4px', alignItems: 'center' } },
        [0, 1, 2].map(function(i) {
          return React.createElement('div', { key: i, style: { width: '8px', height: '8px', borderRadius: '50%', background: '#8be9fd', opacity: 0.4, animation: 'none' } });
        }),
        React.createElement('span', { style: { fontSize: '12px', color: '#888', marginLeft: '8px' } }, model + ' is thinking...')
      )
    )
  ) : null;

  // Chat area
  var chatArea = React.createElement('div', { style: { flex: 1, display: 'flex', flexDirection: 'column', height: '100vh' } },
    // Header
    React.createElement('div', { style: { padding: '12px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: '12px' } },
      React.createElement('button', { onClick: function() { setShowSidebar(!showSidebar); }, style: { background: 'none', border: 'none', color: '#888', cursor: 'pointer', fontSize: '20px', padding: '4px' } }, '\u2630'),
      React.createElement('h2', { style: { margin: 0, fontSize: '16px', flex: 1 } }, activeConvo.title),
      React.createElement('span', { style: { fontSize: '12px', color: '#888', background: 'rgba(139,233,253,0.1)', padding: '4px 10px', borderRadius: '12px', color: '#8be9fd' } }, model)
    ),
    // Messages
    React.createElement('div', { style: { flex: 1, overflowY: 'auto', padding: '20px' } },
      activeConvo.messages.length === 0 && !typing ? React.createElement('div', { style: { textAlign: 'center', paddingTop: '80px' } },
        React.createElement('div', { style: { fontSize: '48px', marginBottom: '16px' } }, '\uD83E\uDD16'),
        React.createElement('h2', { style: { fontSize: '24px', fontWeight: 'bold', marginBottom: '8px', background: 'linear-gradient(90deg, #8be9fd, #bd93f9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } }, 'How can I help you today?'),
        React.createElement('p', { style: { color: '#888', marginBottom: '28px' } }, 'Choose a suggestion or type your message below'),
        React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', maxWidth: '500px', margin: '0 auto' } },
          SUGGESTED.map(function(s) {
            return React.createElement('button', {
              key: s, onClick: function() { sendMessage(s); },
              style: { padding: '12px', borderRadius: '10px', border: '1px solid rgba(139,233,253,0.2)', background: 'rgba(139,233,253,0.05)', color: '#8be9fd', cursor: 'pointer', fontSize: '13px', textAlign: 'left' }
            }, s);
          })
        )
      ) : null,
      activeConvo.messages.map(function(msg, i) {
        var isUser = msg.role === 'user';
        return React.createElement('div', { key: i, style: { display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', marginBottom: '16px' } },
          !isUser ? React.createElement('div', { style: { width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #8be9fd, #bd93f9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', marginRight: '10px', flexShrink: 0, marginTop: '2px' } }, '\uD83E\uDD16') : null,
          React.createElement('div', { style: { maxWidth: '70%' } },
            React.createElement('div', { style: { padding: '12px 16px', borderRadius: isUser ? '16px 16px 4px 16px' : '16px 16px 16px 4px', background: isUser ? 'linear-gradient(135deg, #6c5ce7, #a29bfe)' : 'rgba(255,255,255,0.06)', lineHeight: '1.5', fontSize: '14px', whiteSpace: 'pre-wrap' } },
              isUser ? msg.text : formatMessage(msg.text)
            ),
            React.createElement('div', { style: { fontSize: '10px', color: '#666', marginTop: '4px', textAlign: isUser ? 'right' : 'left' } }, msg.time)
          ),
          isUser ? React.createElement('div', { style: { width: '32px', height: '32px', borderRadius: '50%', background: 'linear-gradient(135deg, #6c5ce7, #a29bfe)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '14px', marginLeft: '10px', flexShrink: 0, marginTop: '2px' } }, '\uD83D\uDC64') : null
        );
      }),
      typingEl,
      React.createElement('div', { ref: chatEndRef })
    ),
    // Input
    React.createElement('div', { style: { padding: '16px 20px', borderTop: '1px solid rgba(255,255,255,0.08)' } },
      React.createElement('div', { style: { display: 'flex', gap: '10px', maxWidth: '800px', margin: '0 auto' } },
        React.createElement('input', {
          type: 'text', value: input,
          onChange: function(e) { setInput(e.target.value); },
          onKeyDown: function(e) { if (e.key === 'Enter' && !typing) sendMessage(input); },
          placeholder: 'Type your message...',
          style: { flex: 1, padding: '14px 18px', borderRadius: '12px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: '#fff', fontSize: '14px', outline: 'none' }
        }),
        React.createElement('button', {
          onClick: function() { if (!typing) sendMessage(input); },
          disabled: typing,
          style: { padding: '14px 24px', borderRadius: '12px', border: 'none', background: typing ? '#555' : 'linear-gradient(135deg, #6c5ce7, #a29bfe)', color: '#fff', cursor: typing ? 'default' : 'pointer', fontWeight: 'bold', fontSize: '14px' }
        }, '\u2191')
      )
    )
  );

  return React.createElement('div', { style: Object.assign({}, containerStyle, { display: 'flex' }) },
    sidebarEl,
    chatArea
  );
}

var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
