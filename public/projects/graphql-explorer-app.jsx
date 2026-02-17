const { useState, useCallback, useMemo } = React;

var backLinkStyle = { color: '#8be9fd', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '20px' };
var containerStyle = { minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%)', color: '#e0e0e0', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", padding: '30px' };
var inputStyle = { background: '#1e1e3a', border: '1px solid #3a3a5c', borderRadius: '8px', color: '#e0e0e0', padding: '10px 14px', fontSize: '14px', width: '100%', boxSizing: 'border-box', outline: 'none' };
var btnStyle = { background: 'linear-gradient(135deg, #e535ab, #6c5ce7)', border: 'none', borderRadius: '8px', color: '#fff', padding: '10px 20px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' };
var cardStyle = { background: 'rgba(30,30,58,0.8)', borderRadius: '12px', padding: '16px', border: '1px solid #2a2a4a' };

var schema = {
  Query: {
    desc: 'Root query type',
    fields: [
      { name: 'users', type: '[User!]!', args: 'limit: Int', desc: 'List all users' },
      { name: 'user', type: 'User', args: 'id: ID!', desc: 'Get user by ID' },
      { name: 'posts', type: '[Post!]!', args: 'userId: ID', desc: 'List all posts' },
      { name: 'post', type: 'Post', args: 'id: ID!', desc: 'Get post by ID' },
      { name: 'comments', type: '[Comment!]!', args: 'postId: ID!', desc: 'Comments for a post' }
    ]
  },
  User: {
    desc: 'A registered user',
    fields: [
      { name: 'id', type: 'ID!', desc: 'Unique identifier' },
      { name: 'name', type: 'String!', desc: 'Full name' },
      { name: 'email', type: 'String!', desc: 'Email address' },
      { name: 'role', type: 'Role!', desc: 'User role' },
      { name: 'posts', type: '[Post!]!', desc: 'User posts' },
      { name: 'createdAt', type: 'DateTime!', desc: 'Registration date' }
    ]
  },
  Post: {
    desc: 'A blog post',
    fields: [
      { name: 'id', type: 'ID!', desc: 'Unique identifier' },
      { name: 'title', type: 'String!', desc: 'Post title' },
      { name: 'content', type: 'String!', desc: 'Post body' },
      { name: 'author', type: 'User!', desc: 'Post author' },
      { name: 'published', type: 'Boolean!', desc: 'Published status' },
      { name: 'tags', type: '[String!]!', desc: 'Post tags' },
      { name: 'comments', type: '[Comment!]!', desc: 'Post comments' }
    ]
  },
  Comment: {
    desc: 'A comment on a post',
    fields: [
      { name: 'id', type: 'ID!', desc: 'Unique identifier' },
      { name: 'text', type: 'String!', desc: 'Comment text' },
      { name: 'author', type: 'User!', desc: 'Comment author' },
      { name: 'createdAt', type: 'DateTime!', desc: 'Comment date' }
    ]
  },
  Role: {
    desc: 'User role enum',
    fields: [
      { name: 'ADMIN', type: 'enum', desc: 'Administrator' },
      { name: 'EDITOR', type: 'enum', desc: 'Content editor' },
      { name: 'VIEWER', type: 'enum', desc: 'Read-only user' }
    ]
  }
};

var mockResponses = {
  users: { data: { users: [
    { id: '1', name: 'Alice Chen', email: 'alice@example.com', role: 'ADMIN' },
    { id: '2', name: 'Bob Martinez', email: 'bob@example.com', role: 'EDITOR' },
    { id: '3', name: 'Carol White', email: 'carol@example.com', role: 'VIEWER' }
  ]}},
  user: { data: { user: { id: '1', name: 'Alice Chen', email: 'alice@example.com', role: 'ADMIN', createdAt: '2026-01-15T10:00:00Z' }}},
  posts: { data: { posts: [
    { id: '1', title: 'Getting Started with GraphQL', content: 'GraphQL is a query language...', published: true, tags: ['graphql', 'api'] },
    { id: '2', title: 'React Best Practices', content: 'When building React apps...', published: true, tags: ['react', 'javascript'] }
  ]}},
  post: { data: { post: { id: '1', title: 'Getting Started with GraphQL', content: 'GraphQL is a query language for APIs...', author: { name: 'Alice Chen' }, published: true, tags: ['graphql', 'api'], comments: [{ id: '1', text: 'Great article!', author: { name: 'Bob Martinez' } }] }}},
  comments: { data: { comments: [
    { id: '1', text: 'Great article!', author: { name: 'Bob Martinez' }, createdAt: '2026-02-10T14:30:00Z' },
    { id: '2', text: 'Very helpful, thanks!', author: { name: 'Carol White' }, createdAt: '2026-02-11T09:15:00Z' }
  ]}}
};

var defaultQuery = 'query GetUsers {\n  users(limit: 10) {\n    id\n    name\n    email\n    role\n  }\n}';

function App() {
  var _q = useState(defaultQuery), query = _q[0], setQuery = _q[1];
  var _v = useState('{\n  "limit": 10\n}'), variables = _v[0], setVariables = _v[1];
  var _r = useState(null), result = _r[0], setResult = _r[1];
  var _l = useState(false), loading = _l[0], setLoading = _l[1];
  var _st = useState(null), selType = _st[0], setSelType = _st[1];
  var _hist = useState([]), queryHistory = _hist[0], setQueryHistory = _hist[1];
  var _sv = useState(false), showVars = _sv[0], setShowVars = _sv[1];
  var _sh = useState(false), showHist = _sh[0], setShowHist = _sh[1];

  var runQuery = useCallback(function() {
    setLoading(true);
    setResult(null);
    setTimeout(function() {
      var matchKey = null;
      var lower = query.toLowerCase();
      var keys = Object.keys(mockResponses);
      for (var i = 0; i < keys.length; i++) {
        if (lower.indexOf(keys[i]) > -1) { matchKey = keys[i]; break; }
      }
      var response = matchKey ? mockResponses[matchKey] : { data: null, errors: [{ message: 'Unknown query - try querying users, posts, or comments' }] };
      setResult(response);
      setLoading(false);
      setQueryHistory(function(prev) {
        return [{ id: Date.now(), query: query.substring(0, 60) + '...', time: new Date().toLocaleTimeString(), status: matchKey ? 'success' : 'error' }].concat(prev).slice(0, 20);
      });
    }, 600);
  }, [query]);

  var colorize = function(text) {
    var parts = [];
    var lines = text.split('\n');
    for (var li = 0; li < lines.length; li++) {
      var line = lines[li];
      var colored = [];
      var tokens = line.split(/(\b(?:query|mutation|subscription|fragment|on|type|enum|input|interface|union|scalar)\b|[{}()\[\]]|"[^"]*"|\b(?:true|false|null)\b|#.*$|\$\w+|\w+:)/g);
      for (var ti = 0; ti < tokens.length; ti++) {
        var tok = tokens[ti];
        if (!tok) continue;
        var sty = { color: '#e0e0e0' };
        if (/^(query|mutation|subscription|fragment|on|type|enum|input|interface|union|scalar)$/.test(tok)) sty = { color: '#e535ab', fontWeight: '600' };
        else if (/^[{}()\[\]]$/.test(tok)) sty = { color: '#ffa502' };
        else if (/^"/.test(tok)) sty = { color: '#2ed573' };
        else if (/^(true|false|null)$/.test(tok)) sty = { color: '#ff6b6b' };
        else if (/^#/.test(tok)) sty = { color: '#666', fontStyle: 'italic' };
        else if (/^\$/.test(tok)) sty = { color: '#00cec9' };
        else if (/\w+:$/.test(tok)) sty = { color: '#a29bfe' };
        colored.push(React.createElement('span', { key: li + '-' + ti, style: sty }, tok));
      }
      if (li > 0) parts.push(React.createElement('br', { key: 'br-' + li }));
      parts = parts.concat(colored);
    }
    return parts;
  };

  var typeNames = Object.keys(schema);

  return React.createElement('div', { style: containerStyle },
    React.createElement('a', { href: '/projects', style: backLinkStyle }, '\u2190 Back to Projects'),
    React.createElement('h1', { style: { fontSize: '32px', fontWeight: '700', marginBottom: '8px', background: 'linear-gradient(90deg, #e535ab, #6c5ce7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } }, 'GraphQL Explorer'),
    React.createElement('p', { style: { color: '#888', marginBottom: '24px' } }, 'Build and test GraphQL queries with mock data'),

    React.createElement('div', { style: { display: 'flex', gap: '16px', flexWrap: 'wrap' } },
      // Schema sidebar
      React.createElement('div', { style: { width: '240px', flexShrink: 0 } },
        React.createElement('div', { style: Object.assign({}, cardStyle, { marginBottom: '12px' }) },
          React.createElement('h3', { style: { margin: '0 0 12px 0', color: '#e535ab', fontSize: '15px' } }, 'Schema Explorer'),
          typeNames.map(function(name) {
            var type = schema[name];
            var isSelected = selType === name;
            return React.createElement('div', { key: name },
              React.createElement('div', { onClick: function() { setSelType(isSelected ? null : name); }, style: { padding: '8px 10px', cursor: 'pointer', borderRadius: '6px', marginBottom: '2px', background: isSelected ? '#e535ab22' : 'transparent', borderLeft: isSelected ? '3px solid #e535ab' : '3px solid transparent' } },
                React.createElement('span', { style: { fontSize: '13px', color: isSelected ? '#e535ab' : '#ccc', fontWeight: '600' } }, (isSelected ? '\u25be ' : '\u25b8 ') + name),
                React.createElement('div', { style: { fontSize: '11px', color: '#666', marginTop: '2px' } }, type.desc)
              ),
              isSelected && React.createElement('div', { style: { paddingLeft: '16px', paddingBottom: '8px' } },
                type.fields.map(function(f) {
                  return React.createElement('div', { key: f.name, style: { padding: '4px 8px', fontSize: '12px', borderLeft: '1px solid #2a2a4a', marginBottom: '2px' } },
                    React.createElement('span', { style: { color: '#a29bfe' } }, f.name),
                    f.args ? React.createElement('span', { style: { color: '#666' } }, '(' + f.args + ')') : null,
                    React.createElement('span', { style: { color: '#00cec9' } }, ': ' + f.type),
                    React.createElement('div', { style: { color: '#555', fontSize: '11px' } }, f.desc)
                  );
                })
              )
            );
          })
        )
      ),

      // Main editor area
      React.createElement('div', { style: { flex: '1', minWidth: '300px' } },
        // Query editor with syntax highlight overlay
        React.createElement('div', { style: Object.assign({}, cardStyle, { marginBottom: '12px', position: 'relative' }) },
          React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' } },
            React.createElement('h3', { style: { margin: 0, color: '#e535ab', fontSize: '15px' } }, 'Query Editor'),
            React.createElement('div', { style: { display: 'flex', gap: '8px' } },
              React.createElement('button', { style: { background: showVars ? '#6c5ce7' : '#2a2a4a', border: '1px solid #3a3a5c', borderRadius: '6px', color: '#ccc', cursor: 'pointer', padding: '4px 10px', fontSize: '12px' }, onClick: function() { setShowVars(!showVars); } }, 'Variables'),
              React.createElement('button', { style: { background: showHist ? '#6c5ce7' : '#2a2a4a', border: '1px solid #3a3a5c', borderRadius: '6px', color: '#ccc', cursor: 'pointer', padding: '4px 10px', fontSize: '12px' }, onClick: function() { setShowHist(!showHist); } }, 'History')
            )
          ),
          // Highlighted preview
          React.createElement('div', { style: { background: '#0a0a1a', borderRadius: '8px', padding: '12px', marginBottom: '8px', fontFamily: "'Consolas', 'Monaco', monospace", fontSize: '13px', lineHeight: '1.6', minHeight: '80px', whiteSpace: 'pre-wrap', wordBreak: 'break-all', pointerEvents: 'none' } }, colorize(query)),
          // Actual textarea
          React.createElement('textarea', { style: Object.assign({}, inputStyle, { height: '140px', fontFamily: "'Consolas', 'Monaco', monospace", fontSize: '13px', lineHeight: '1.6', background: '#0a0a1a', resize: 'vertical' }), value: query, onChange: function(e) { setQuery(e.target.value); }, spellCheck: false }),
          React.createElement('div', { style: { display: 'flex', justifyContent: 'flex-end', marginTop: '10px' } },
            React.createElement('button', { style: Object.assign({}, btnStyle, { display: 'flex', alignItems: 'center', gap: '8px' }), onClick: runQuery, disabled: loading },
              loading ? 'Running...' : '\u25b6 Run Query'
            )
          )
        ),

        // Variables panel
        showVars && React.createElement('div', { style: Object.assign({}, cardStyle, { marginBottom: '12px' }) },
          React.createElement('h3', { style: { margin: '0 0 10px 0', color: '#00cec9', fontSize: '14px' } }, 'Query Variables (JSON)'),
          React.createElement('textarea', { style: Object.assign({}, inputStyle, { height: '80px', fontFamily: "'Consolas', 'Monaco', monospace", fontSize: '13px', background: '#0a0a1a' }), value: variables, onChange: function(e) { setVariables(e.target.value); } })
        ),

        // Query history
        showHist && React.createElement('div', { style: Object.assign({}, cardStyle, { marginBottom: '12px', maxHeight: '200px', overflowY: 'auto' }) },
          React.createElement('h3', { style: { margin: '0 0 10px 0', color: '#ffa502', fontSize: '14px' } }, 'Query History'),
          queryHistory.length === 0
            ? React.createElement('div', { style: { color: '#666', fontSize: '13px' } }, 'No queries run yet')
            : queryHistory.map(function(h) {
                return React.createElement('div', { key: h.id, style: { display: 'flex', alignItems: 'center', gap: '10px', padding: '6px 0', borderBottom: '1px solid #1a1a3a', fontSize: '12px' } },
                  React.createElement('span', { style: { width: '8px', height: '8px', borderRadius: '50%', background: h.status === 'success' ? '#2ed573' : '#ff6b6b', flexShrink: 0 } }),
                  React.createElement('span', { style: { color: '#888', minWidth: '80px' } }, h.time),
                  React.createElement('span', { style: { color: '#ccc', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, h.query)
                );
              })
        ),

        // Result
        React.createElement('div', { style: Object.assign({}, cardStyle) },
          React.createElement('h3', { style: { margin: '0 0 10px 0', color: '#2ed573', fontSize: '15px' } }, 'Response'),
          loading
            ? React.createElement('div', { style: { textAlign: 'center', padding: '30px', color: '#888' } }, 'Executing query...')
            : result
              ? React.createElement('pre', { style: { background: '#0a0a1a', borderRadius: '8px', padding: '14px', fontFamily: "'Consolas', 'Monaco', monospace", fontSize: '13px', lineHeight: '1.5', overflow: 'auto', maxHeight: '300px', color: result.errors ? '#ff6b6b' : '#2ed573', margin: 0 } }, JSON.stringify(result, null, 2))
              : React.createElement('div', { style: { textAlign: 'center', padding: '30px', color: '#666' } }, 'Run a query to see results')
        )
      )
    )
  );
}

var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
