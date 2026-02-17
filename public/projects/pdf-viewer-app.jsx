const { useState, useCallback, useMemo } = React;

var backLinkStyle = { color: '#8be9fd', textDecoration: 'none', fontSize: '14px', marginBottom: '20px', display: 'inline-block' };

var PAGES = [
  { title: 'Introduction to React', content: 'React is a JavaScript library for building user interfaces. It was developed by Facebook and is now maintained by Meta and a community of individual developers and companies.\n\nReact allows developers to create large web applications that can change data without reloading the page. The main purpose of React is to be fast, scalable, and simple. It works only on user interfaces in the application, which corresponds to the view in the MVC template.\n\nReact uses a virtual DOM to efficiently update and render components. When state changes occur, React first updates the virtual DOM, then compares it with the real DOM, and only applies the necessary changes.\n\nKey concepts in React include:\n- Components: Reusable pieces of UI\n- Props: Data passed from parent to child\n- State: Mutable data within a component\n- Lifecycle methods: Hooks into component events\n- Hooks: Functions for state and effects in functional components' },
  { title: 'Components and Props', content: 'Components let you split the UI into independent, reusable pieces and think about each piece in isolation. Conceptually, components are like JavaScript functions.\n\nThey accept arbitrary inputs called props and return React elements describing what should appear on the screen. The simplest way to define a component is to write a JavaScript function.\n\nFunction components are the modern standard:\n\nfunction Welcome(props) {\n  return <h1>Hello, {props.name}</h1>;\n}\n\nProps are read-only. Whether you declare a component as a function or a class, it must never modify its own props. All React components must act like pure functions with respect to their props.\n\nComposition vs Inheritance:\nReact has a powerful composition model, and it is recommended to use composition instead of inheritance to reuse code between components.' },
  { title: 'State and Lifecycle', content: 'State is similar to props, but it is private and fully controlled by the component. State allows React components to change their output over time in response to user actions, network responses, and anything else.\n\nWith React Hooks, you can use the useState hook to add state to function components:\n\nconst [count, setCount] = useState(0);\n\nThe useEffect hook lets you perform side effects in function components. It serves the same purpose as componentDidMount, componentDidUpdate, and componentWillUnmount in React class lifecycle methods.\n\nuseEffect(() => {\n  document.title = `You clicked ${count} times`;\n}, [count]);\n\nState updates may be asynchronous. React may batch multiple setState calls into a single update for performance. Because state updates may be asynchronous, you should not rely on their values for calculating the next state.' },
  { title: 'Handling Events', content: 'Handling events with React elements is very similar to handling events on DOM elements. There are some syntax differences:\n\nReact events are named using camelCase rather than lowercase. With JSX you pass a function as the event handler, rather than a string.\n\nFor example:\n- HTML: <button onclick="handleClick()">Click</button>\n- React: <button onClick={handleClick}>Click</button>\n\nAnother difference is that you cannot return false to prevent default behavior in React. You must call preventDefault explicitly.\n\nWhen using React, you generally do not need to call addEventListener to add listeners to a DOM element after it is created. Instead, just provide a listener when the element is initially rendered.\n\nEvent handlers are passed instances of SyntheticEvent, a cross-browser wrapper around the browser native event.' },
  { title: 'Conditional Rendering', content: 'In React, you can create distinct components that encapsulate behavior you need. Then, you can render only some of them, depending on the state of your application.\n\nConditional rendering in React works the same way conditions work in JavaScript. Use JavaScript operators like if or the conditional operator to create elements representing the current state.\n\nInline conditions with logical && operator:\n{unreadMessages.length > 0 &&\n  <h2>You have {unreadMessages.length} messages.</h2>\n}\n\nInline If-Else with conditional operator:\n{isLoggedIn\n  ? <LogoutButton />\n  : <LoginButton />\n}\n\nIn rare cases you might want a component to hide itself even though it was rendered by another component. To do this, return null instead of its render output.' },
  { title: 'Lists and Keys', content: 'You can build collections of elements and include them in JSX using curly braces. Keys help React identify which items have changed, are added, or are removed.\n\nKeys should be given to the elements inside the array to give the elements a stable identity. The best way to pick a key is to use a string that uniquely identifies a list item among its siblings.\n\nMost often you would use IDs from your data as keys:\n\nconst listItems = items.map((item) =>\n  <li key={item.id}>{item.text}</li>\n);\n\nWhen you do not have stable IDs for rendered items, you may use the item index as a key as a last resort. It is not recommended to use indexes for keys if the order of items may change.\n\nKeys must only be unique among siblings. Keys used within arrays should be unique among their siblings. However, they do not need to be globally unique.' },
  { title: 'Forms in React', content: 'HTML form elements work a bit differently from other DOM elements in React, because form elements naturally keep some internal state.\n\nControlled Components: In HTML, form elements such as input, textarea, and select typically maintain their own state. In React, mutable state is kept in the state property of components and only updated with setState.\n\nWe can combine the two by making the React state be the single source of truth. Then the React component that renders a form also controls what happens in that form on subsequent user input.\n\nconst [value, setValue] = useState("");\n\n<input type="text" value={value}\n  onChange={(e) => setValue(e.target.value)} />\n\nThe textarea, select, and file input tags all have slight variations in how they work with controlled components, but the general principle remains the same.' }
];

function App() {
  var _page = useState(0), page = _page[0], setPage = _page[1];
  var _zoom = useState(100), zoom = _zoom[0], setZoom = _zoom[1];
  var _search = useState(''), search = _search[0], setSearch = _search[1];
  var _sidebar = useState(true), sidebarOpen = _sidebar[0], setSidebarOpen = _sidebar[1];
  var _jump = useState(''), jumpTo = _jump[0], setJumpTo = _jump[1];

  var highlightText = useCallback(function(text) {
    if (!search.trim()) return [React.createElement('span', { key: 0 }, text)];
    var parts = text.split(new RegExp('(' + search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + ')', 'gi'));
    return parts.map(function(part, i) {
      if (part.toLowerCase() === search.toLowerCase()) {
        return React.createElement('mark', { key: i, style: { background: '#fbbf24', color: '#0a0a1a', padding: '1px 2px', borderRadius: '2px' } }, part);
      }
      return React.createElement('span', { key: i }, part);
    });
  }, [search]);

  var searchResults = useMemo(function() {
    if (!search.trim()) return [];
    var results = [];
    PAGES.forEach(function(p, i) {
      var combined = p.title + ' ' + p.content;
      if (combined.toLowerCase().indexOf(search.toLowerCase()) >= 0) {
        results.push(i);
      }
    });
    return results;
  }, [search]);

  var goToPage = function(p) { setPage(Math.max(0, Math.min(PAGES.length - 1, p))); };

  var containerStyle = { minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a1a, #1a1a3e)', color: '#e2e8f0', fontFamily: "'Segoe UI', sans-serif", padding: '20px' };

  var toolbarStyle = { display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(30,41,59,0.9)', padding: '10px 16px', borderRadius: '10px', marginBottom: '15px', flexWrap: 'wrap' };

  var btnStyle = function(bg) { return { padding: '6px 12px', background: bg || '#334155', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px' }; };

  var sidebarStyle = {
    width: '180px', background: 'rgba(15,23,42,0.9)', borderRadius: '10px', padding: '12px',
    border: '1px solid #334155', overflowY: 'auto', maxHeight: '600px', flexShrink: 0
  };

  var pageStyle = {
    flex: 1, background: '#fff', borderRadius: '8px', padding: (30 * zoom / 100) + 'px',
    color: '#1a1a2e', fontSize: (14 * zoom / 100) + 'px', lineHeight: '1.7',
    maxHeight: '600px', overflowY: 'auto', whiteSpace: 'pre-wrap', fontFamily: 'Georgia, serif',
    boxShadow: '0 4px 20px rgba(0,0,0,0.3)', minHeight: '500px'
  };

  var toolbar = React.createElement('div', { style: toolbarStyle }, [
    React.createElement('button', { key: 'sb', onClick: function() { setSidebarOpen(!sidebarOpen); }, style: btnStyle(sidebarOpen ? '#6366f1' : '#334155') }, sidebarOpen ? 'Hide Sidebar' : 'Show Sidebar'),
    React.createElement('span', { key: 'sep1', style: { color: '#334155' } }, '|'),
    React.createElement('button', { key: 'prev', onClick: function() { goToPage(page - 1); }, disabled: page === 0, style: btnStyle(page === 0 ? '#1e293b' : '#334155') }, '\u25C0 Prev'),
    React.createElement('span', { key: 'pn', style: { fontSize: '13px', minWidth: '100px', textAlign: 'center' } }, 'Page ' + (page + 1) + ' of ' + PAGES.length),
    React.createElement('button', { key: 'next', onClick: function() { goToPage(page + 1); }, disabled: page === PAGES.length - 1, style: btnStyle(page === PAGES.length - 1 ? '#1e293b' : '#334155') }, 'Next \u25B6'),
    React.createElement('span', { key: 'sep2', style: { color: '#334155' } }, '|'),
    React.createElement('span', { key: 'jl', style: { fontSize: '12px', color: '#94a3b8' } }, 'Go to:'),
    React.createElement('input', {
      key: 'jump', type: 'number', min: 1, max: PAGES.length, value: jumpTo, placeholder: '#',
      onChange: function(e) { setJumpTo(e.target.value); },
      onKeyDown: function(e) { if (e.key === 'Enter' && jumpTo) { goToPage(parseInt(jumpTo, 10) - 1); setJumpTo(''); } },
      style: { width: '45px', background: '#0f172a', border: '1px solid #334155', borderRadius: '4px', color: '#e2e8f0', padding: '4px', fontSize: '12px', textAlign: 'center' }
    }),
    React.createElement('span', { key: 'sep3', style: { color: '#334155' } }, '|'),
    React.createElement('button', { key: 'zi', onClick: function() { setZoom(function(z) { return Math.min(150, z + 10); }); }, style: btnStyle('#334155') }, 'Zoom +'),
    React.createElement('span', { key: 'zv', style: { fontSize: '12px', minWidth: '40px', textAlign: 'center' } }, zoom + '%'),
    React.createElement('button', { key: 'zo', onClick: function() { setZoom(function(z) { return Math.max(60, z - 10); }); }, style: btnStyle('#334155') }, 'Zoom -'),
    React.createElement('span', { key: 'sep4', style: { color: '#334155' } }, '|'),
    React.createElement('input', {
      key: 'search', type: 'text', value: search, placeholder: 'Search document...',
      onChange: function(e) { setSearch(e.target.value); },
      style: { background: '#0f172a', border: '1px solid #334155', borderRadius: '4px', color: '#e2e8f0', padding: '6px 10px', fontSize: '12px', width: '150px' }
    }),
    search ? React.createElement('span', { key: 'sr', style: { fontSize: '11px', color: '#fbbf24' } }, searchResults.length + ' page(s)') : null
  ]);

  var sidebar = sidebarOpen ? React.createElement('div', { style: sidebarStyle }, [
    React.createElement('div', { key: 'title', style: { fontSize: '12px', color: '#94a3b8', marginBottom: '10px', fontWeight: 'bold' } }, 'Pages'),
  ].concat(PAGES.map(function(p, i) {
    var isMatch = searchResults.indexOf(i) >= 0;
    return React.createElement('div', {
      key: i,
      onClick: function() { setPage(i); },
      style: {
        padding: '8px', marginBottom: '6px', borderRadius: '6px', cursor: 'pointer',
        background: page === i ? '#6366f1' : (isMatch ? 'rgba(251,191,36,0.2)' : 'rgba(51,65,85,0.3)'),
        border: '1px solid ' + (page === i ? '#818cf8' : isMatch ? '#fbbf24' : 'transparent'),
        fontSize: '11px', transition: 'all 0.2s'
      }
    }, [
      React.createElement('div', { key: 'num', style: { color: '#64748b', fontSize: '10px' } }, 'Page ' + (i + 1)),
      React.createElement('div', { key: 'title', style: { color: page === i ? '#fff' : '#cbd5e1', marginTop: '2px' } }, p.title)
    ]);
  }))) : null;

  var currentPage = PAGES[page];
  var pageContent = React.createElement('div', { style: pageStyle }, [
    React.createElement('h2', { key: 'title', style: { fontSize: (22 * zoom / 100) + 'px', color: '#1e293b', borderBottom: '2px solid #e2e8f0', paddingBottom: '10px', marginTop: 0, marginBottom: '16px', fontFamily: "'Segoe UI', sans-serif" } },
      search ? highlightText(currentPage.title) : currentPage.title),
    React.createElement('div', { key: 'content', style: { color: '#334155' } },
      search ? highlightText(currentPage.content) : currentPage.content),
    React.createElement('div', { key: 'footer', style: { marginTop: '30px', paddingTop: '10px', borderTop: '1px solid #e2e8f0', textAlign: 'center', color: '#94a3b8', fontSize: (11 * zoom / 100) + 'px', fontFamily: "'Segoe UI', sans-serif" } },
      'Page ' + (page + 1) + ' of ' + PAGES.length)
  ]);

  return React.createElement('div', { style: containerStyle }, [
    React.createElement('a', { key: 'back', href: '/projects', style: backLinkStyle }, '\u2190 Back to Projects'),
    React.createElement('h1', { key: 'title', style: { fontSize: '26px', fontWeight: 'bold', color: '#f59e0b', marginBottom: '15px' } }, 'Document Viewer'),
    toolbar,
    React.createElement('div', { key: 'main', style: { display: 'flex', gap: '15px' } }, [
      sidebar,
      pageContent
    ])
  ]);
}

var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
