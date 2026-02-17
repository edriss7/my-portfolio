const { useState, useCallback } = React;

var backLinkStyle = { color: '#8be9fd', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '16px' };
var baseStyle = { minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%)', color: '#e0e0e0', fontFamily: "'Segoe UI', sans-serif", padding: '24px' };
var inputStyle = { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', padding: '8px 12px', color: '#e0e0e0', fontSize: '14px', width: '100%', boxSizing: 'border-box' };
var btnStyle = function (c) { return { background: c || '#8be9fd', color: '#0a0a1a', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }; };
var cardStyle = { background: 'rgba(255,255,255,0.07)', borderRadius: '8px', padding: '16px', border: '1px solid rgba(255,255,255,0.08)' };

var mockResponses = {
  GET: { '/api/users': { status: 200, data: [{ id: 1, name: 'Alice', email: 'alice@example.com' }, { id: 2, name: 'Bob', email: 'bob@example.com' }, { id: 3, name: 'Charlie', email: 'charlie@example.com' }] }, '/api/posts': { status: 200, data: [{ id: 1, title: 'Hello World', author: 'Alice' }, { id: 2, title: 'React Tips', author: 'Bob' }] } },
  POST: { '/api/users': { status: 201, data: { id: 4, message: 'User created successfully' } }, '/api/posts': { status: 201, data: { id: 3, message: 'Post created successfully' } } },
  PUT: { '/api/users': { status: 200, data: { message: 'User updated successfully' } } },
  DELETE: { '/api/users': { status: 200, data: { message: 'User deleted successfully' } } }
};

var methodColors = { GET: '#50fa7b', POST: '#ffb86c', PUT: '#8be9fd', DELETE: '#ff5555' };

function App() {
  var _s1 = useState('GET'), method = _s1[0], setMethod = _s1[1];
  var _s2 = useState('/api/users'), url = _s2[0], setUrl = _s2[1];
  var _s3 = useState([{ key: 'Content-Type', value: 'application/json', id: 1 }]), headers = _s3[0], setHeaders = _s3[1];
  var _s4 = useState('{\n  "name": "New User",\n  "email": "user@example.com"\n}'), body = _s4[0], setBody = _s4[1];
  var _s5 = useState(null), response = _s5[0], setResponse = _s5[1];
  var _s6 = useState([]), history = _s6[0], setHistory = _s6[1];
  var _s7 = useState(false), loading = _s7[0], setLoading = _s7[1];
  var _s8 = useState('params'), activeTab = _s8[0], setActiveTab = _s8[1];

  var sendRequest = useCallback(function () {
    setLoading(true);
    setTimeout(function () {
      var methodResponses = mockResponses[method] || {};
      var matchedUrl = Object.keys(methodResponses).find(function (u) { return url.includes(u); });
      var resp;
      if (matchedUrl) {
        resp = { status: methodResponses[matchedUrl].status, statusText: methodResponses[matchedUrl].status === 200 ? 'OK' : 'Created', headers: { 'content-type': 'application/json', 'x-request-id': 'req_' + Math.random().toString(36).substr(2, 9), 'x-response-time': Math.floor(Math.random() * 200 + 50) + 'ms' }, body: methodResponses[matchedUrl].data, time: Math.floor(Math.random() * 200 + 50) };
      } else {
        resp = { status: 404, statusText: 'Not Found', headers: { 'content-type': 'application/json' }, body: { error: 'Endpoint not found', message: 'The requested URL was not found on this server' }, time: Math.floor(Math.random() * 100 + 20) };
      }
      setResponse(resp);
      setHistory(function (prev) { return [{ id: Date.now(), method: method, url: url, status: resp.status, time: resp.time }].concat(prev).slice(0, 20); });
      setLoading(false);
    }, 600);
  }, [method, url]);

  var addHeader = useCallback(function () {
    setHeaders(function (prev) { return prev.concat([{ key: '', value: '', id: Date.now() }]); });
  }, []);

  var removeHeader = useCallback(function (id) {
    setHeaders(function (prev) { return prev.filter(function (h) { return h.id !== id; }); });
  }, []);

  var updateHeader = useCallback(function (id, field, val) {
    setHeaders(function (prev) { return prev.map(function (h) { return h.id === id ? Object.assign({}, h, (function () { var o = {}; o[field] = val; return o; })()) : h; }); });
  }, []);

  var statusColor = function (s) { return s < 300 ? '#50fa7b' : s < 400 ? '#ffb86c' : '#ff5555'; };
  var methods = ['GET', 'POST', 'PUT', 'DELETE'];
  var tabs = ['params', 'headers', 'body'];

  return React.createElement('div', { style: baseStyle },
    React.createElement('a', { href: '/projects', style: backLinkStyle }, '\u2190 Back to Projects'),
    React.createElement('h1', { style: { color: '#8be9fd', margin: '0 0 20px', fontSize: '24px' } }, 'API Tester'),
    React.createElement('div', { style: { display: 'flex', gap: '20px' } },
      React.createElement('div', { style: { flex: 1 } },
        React.createElement('div', { style: Object.assign({}, cardStyle, { display: 'flex', gap: '8px', alignItems: 'center', marginBottom: '16px' }) },
          React.createElement('select', { value: method, onChange: function (e) { setMethod(e.target.value); }, style: Object.assign({}, inputStyle, { width: '120px', fontWeight: 'bold', color: methodColors[method] }) },
            methods.map(function (m) { return React.createElement('option', { key: m, value: m, style: { color: '#000' } }, m); })
          ),
          React.createElement('input', { style: Object.assign({}, inputStyle, { flex: 1 }), value: url, onChange: function (e) { setUrl(e.target.value); }, placeholder: 'Enter URL...' }),
          React.createElement('button', { style: Object.assign({}, btnStyle('#50fa7b'), { padding: '8px 24px', opacity: loading ? 0.6 : 1 }), onClick: sendRequest, disabled: loading }, loading ? 'Sending...' : 'Send')
        ),
        React.createElement('div', { style: Object.assign({}, cardStyle, { marginBottom: '16px' }) },
          React.createElement('div', { style: { display: 'flex', gap: '0', marginBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.1)' } },
            tabs.map(function (t) {
              return React.createElement('div', { key: t, onClick: function () { setActiveTab(t); }, style: { padding: '8px 16px', cursor: 'pointer', borderBottom: activeTab === t ? '2px solid #8be9fd' : '2px solid transparent', color: activeTab === t ? '#8be9fd' : '#888', fontSize: '13px', textTransform: 'capitalize' } }, t);
            })
          ),
          activeTab === 'headers' && React.createElement('div', null,
            headers.map(function (h) {
              return React.createElement('div', { key: h.id, style: { display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' } },
                React.createElement('input', { style: Object.assign({}, inputStyle, { flex: 1 }), placeholder: 'Key', value: h.key, onChange: function (e) { updateHeader(h.id, 'key', e.target.value); } }),
                React.createElement('input', { style: Object.assign({}, inputStyle, { flex: 1 }), placeholder: 'Value', value: h.value, onChange: function (e) { updateHeader(h.id, 'value', e.target.value); } }),
                React.createElement('button', { style: Object.assign({}, btnStyle('#ff5555'), { padding: '6px 10px', fontSize: '12px' }), onClick: function () { removeHeader(h.id); } }, '\u00D7')
              );
            }),
            React.createElement('button', { style: Object.assign({}, btnStyle('#bd93f9'), { fontSize: '12px' }), onClick: addHeader }, '+ Add Header')
          ),
          activeTab === 'body' && React.createElement('textarea', { style: Object.assign({}, inputStyle, { minHeight: '150px', fontFamily: 'monospace', resize: 'vertical' }), value: body, onChange: function (e) { setBody(e.target.value); } }),
          activeTab === 'params' && React.createElement('div', { style: { color: '#888', fontSize: '13px', padding: '12px' } }, 'Query parameters are parsed from the URL. Try: /api/users?page=1&limit=10')
        ),
        response && React.createElement('div', { style: cardStyle },
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '12px' } },
            React.createElement('span', { style: { fontSize: '14px', fontWeight: 'bold' } }, 'Response'),
            React.createElement('span', { style: { background: statusColor(response.status), color: '#000', padding: '2px 12px', borderRadius: '12px', fontWeight: 'bold', fontSize: '13px' } }, response.status + ' ' + response.statusText),
            React.createElement('span', { style: { fontSize: '12px', color: '#888' } }, response.time + 'ms')
          ),
          React.createElement('div', { style: { fontSize: '12px', color: '#888', marginBottom: '8px' } }, 'Headers:'),
          React.createElement('div', { style: { marginBottom: '12px' } },
            Object.keys(response.headers).map(function (k) {
              return React.createElement('div', { key: k, style: { fontSize: '12px', fontFamily: 'monospace', padding: '2px 0' } },
                React.createElement('span', { style: { color: '#bd93f9' } }, k + ': '),
                React.createElement('span', { style: { color: '#f1fa8c' } }, response.headers[k])
              );
            })
          ),
          React.createElement('div', { style: { fontSize: '12px', color: '#888', marginBottom: '4px' } }, 'Body:'),
          React.createElement('pre', { style: { background: 'rgba(0,0,0,0.3)', borderRadius: '6px', padding: '12px', fontSize: '13px', fontFamily: 'monospace', overflow: 'auto', maxHeight: '300px', margin: 0, color: '#f8f8f2' } }, JSON.stringify(response.body, null, 2))
        )
      ),
      React.createElement('div', { style: { width: '280px', flexShrink: 0 } },
        React.createElement('div', { style: cardStyle },
          React.createElement('h3', { style: { margin: '0 0 12px', color: '#8be9fd', fontSize: '15px' } }, 'Request History'),
          history.length === 0 && React.createElement('div', { style: { color: '#666', fontSize: '13px' } }, 'No requests yet'),
          history.map(function (h) {
            return React.createElement('div', { key: h.id, onClick: function () { setMethod(h.method); setUrl(h.url); }, style: { padding: '8px', borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer', fontSize: '12px' } },
              React.createElement('div', { style: { display: 'flex', gap: '8px', alignItems: 'center' } },
                React.createElement('span', { style: { color: methodColors[h.method], fontWeight: 'bold', fontSize: '11px', minWidth: '42px' } }, h.method),
                React.createElement('span', { style: { flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#ccc' } }, h.url),
                React.createElement('span', { style: { color: statusColor(h.status), fontWeight: 'bold' } }, h.status)
              ),
              React.createElement('div', { style: { color: '#666', fontSize: '11px', marginTop: '2px' } }, h.time + 'ms')
            );
          })
        )
      )
    )
  );
}

var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
