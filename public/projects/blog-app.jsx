const { useState, useMemo } = React;

var initialPosts = [
  {
    id: 1,
    title: 'Getting Started with React',
    content: 'React is a powerful JavaScript library for building user interfaces. It uses a component-based architecture that makes it easy to create reusable UI elements.\n\nOne of the key concepts in React is the virtual DOM, which allows React to efficiently update only the parts of the page that need to change. This makes React applications fast and responsive.\n\nTo get started, you can use Create React App or set up your own build configuration with tools like Vite or Webpack.',
    date: '2026-02-15',
    author: 'Jane Developer'
  },
  {
    id: 2,
    title: 'Understanding State Management',
    content: 'State management is one of the most important concepts in modern web development. As applications grow in complexity, managing state becomes increasingly challenging.\n\nReact provides several built-in tools for state management, including useState for local component state and useContext for sharing state across components. For more complex applications, libraries like Redux or Zustand can help manage global state.\n\nThe key is to choose the right tool for the job and keep your state as simple as possible.',
    date: '2026-02-12',
    author: 'John Coder'
  },
  {
    id: 3,
    title: 'CSS-in-JS: Pros and Cons',
    content: 'CSS-in-JS is an approach to styling that has gained popularity in the React ecosystem. Instead of writing CSS in separate files, styles are defined directly in JavaScript.\n\nPros include scoped styles, dynamic styling based on props, and no class name conflicts. However, there are downsides such as increased bundle size, runtime overhead, and a steeper learning curve.\n\nPopular CSS-in-JS libraries include styled-components, Emotion, and vanilla-extract. Each has its own trade-offs and use cases.',
    date: '2026-02-10',
    author: 'Sarah Styler'
  }
];

function App() {
  const [posts, setPosts] = useState(initialPosts);
  const [view, setView] = useState('list');
  const [editingPost, setEditingPost] = useState(null);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  var filteredPosts = useMemo(function() {
    if (!searchQuery.trim()) return posts;
    var q = searchQuery.toLowerCase();
    return posts.filter(function(p) {
      return p.title.toLowerCase().includes(q) || p.content.toLowerCase().includes(q) || p.author.toLowerCase().includes(q);
    });
  }, [posts, searchQuery]);

  var handleCreate = function() {
    setView('create');
    setNewTitle('');
    setNewContent('');
    setEditingPost(null);
  };

  var handleEdit = function(post) {
    setView('create');
    setNewTitle(post.title);
    setNewContent(post.content);
    setEditingPost(post);
  };

  var handleSave = function() {
    if (!newTitle.trim() || !newContent.trim()) return;
    if (editingPost) {
      setPosts(function(prev) {
        return prev.map(function(p) {
          if (p.id === editingPost.id) {
            return Object.assign({}, p, { title: newTitle, content: newContent, date: new Date().toISOString().split('T')[0] });
          }
          return p;
        });
      });
    } else {
      var newPost = {
        id: Date.now(),
        title: newTitle,
        content: newContent,
        date: new Date().toISOString().split('T')[0],
        author: 'You'
      };
      setPosts(function(prev) { return [newPost].concat(prev); });
    }
    setView('list');
    setEditingPost(null);
  };

  var handleDelete = function(id) {
    setPosts(function(prev) { return prev.filter(function(p) { return p.id !== id; }); });
    setDeleteConfirm(null);
  };

  var getExcerpt = function(content) {
    return content.length > 150 ? content.substring(0, 150) + '...' : content;
  };

  var styles = {
    container: { minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%)', color: '#e0e0ff', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", padding: '20px' },
    backLink: { color: '#8888ff', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '20px' },
    title: { textAlign: 'center', fontSize: '32px', marginBottom: '10px', color: '#ffffff' },
    subtitle: { textAlign: 'center', fontSize: '16px', color: '#aaa', marginBottom: '30px' },
    topBar: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', maxWidth: '800px', margin: '0 auto 25px', gap: '15px', flexWrap: 'wrap' },
    searchInput: { flex: 1, minWidth: '200px', padding: '10px 16px', fontSize: '14px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', color: '#e0e0ff', outline: 'none' },
    createBtn: { padding: '10px 24px', fontSize: '14px', fontWeight: 'bold', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', border: 'none', borderRadius: '10px', cursor: 'pointer', whiteSpace: 'nowrap' },
    postList: { maxWidth: '800px', margin: '0 auto' },
    postCard: { background: 'rgba(255,255,255,0.06)', borderRadius: '14px', padding: '24px', marginBottom: '16px', border: '1px solid rgba(255,255,255,0.08)', transition: 'all 0.3s' },
    postTitle: { fontSize: '22px', fontWeight: 'bold', color: '#fff', marginBottom: '8px', cursor: 'pointer' },
    postMeta: { display: 'flex', gap: '15px', marginBottom: '12px', fontSize: '13px', color: '#888' },
    postExcerpt: { fontSize: '15px', lineHeight: '1.7', color: '#b0b0d0', marginBottom: '15px' },
    postActions: { display: 'flex', gap: '10px' },
    actionBtn: { padding: '6px 16px', fontSize: '13px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' },
    formContainer: { maxWidth: '800px', margin: '0 auto', background: 'rgba(255,255,255,0.06)', borderRadius: '16px', padding: '30px', border: '1px solid rgba(255,255,255,0.1)' },
    formTitle: { fontSize: '22px', marginBottom: '20px' },
    formInput: { width: '100%', padding: '12px 16px', fontSize: '16px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', color: '#e0e0ff', outline: 'none', marginBottom: '16px', boxSizing: 'border-box' },
    formTextarea: { width: '100%', padding: '14px 16px', fontSize: '15px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', color: '#e0e0ff', outline: 'none', marginBottom: '20px', minHeight: '250px', resize: 'vertical', lineHeight: '1.6', fontFamily: 'inherit', boxSizing: 'border-box' },
    formButtons: { display: 'flex', gap: '12px' },
    overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
    confirmCard: { background: 'linear-gradient(135deg, #0a0a1a, #1a1a3e)', borderRadius: '16px', padding: '30px', border: '1px solid rgba(255,255,255,0.15)', textAlign: 'center', maxWidth: '400px' },
    emptyState: { textAlign: 'center', color: '#666', padding: '60px 20px', fontSize: '16px' }
  };

  if (view === 'create') {
    return React.createElement('div', { style: styles.container },
      React.createElement('a', { href: '/projects', style: styles.backLink }, '\u2190 Back to Projects'),
      React.createElement('h1', { style: styles.title }, editingPost ? 'Edit Post' : 'New Post'),
      React.createElement('div', { style: styles.formContainer },
        React.createElement('input', {
          type: 'text',
          placeholder: 'Post title...',
          value: newTitle,
          onChange: function(e) { setNewTitle(e.target.value); },
          style: styles.formInput
        }),
        React.createElement('textarea', {
          placeholder: 'Write your post content here...',
          value: newContent,
          onChange: function(e) { setNewContent(e.target.value); },
          style: styles.formTextarea
        }),
        React.createElement('div', { style: styles.formButtons },
          React.createElement('button', {
            onClick: handleSave,
            disabled: !newTitle.trim() || !newContent.trim(),
            style: Object.assign({}, styles.createBtn, {
              opacity: (!newTitle.trim() || !newContent.trim()) ? 0.5 : 1,
              cursor: (!newTitle.trim() || !newContent.trim()) ? 'not-allowed' : 'pointer'
            })
          }, editingPost ? 'Update Post' : 'Publish Post'),
          React.createElement('button', {
            onClick: function() { setView('list'); setEditingPost(null); },
            style: Object.assign({}, styles.actionBtn, { background: 'rgba(255,255,255,0.1)', color: '#aaa', padding: '10px 24px', fontSize: '14px' })
          }, 'Cancel')
        )
      )
    );
  }

  return React.createElement('div', { style: styles.container },
    deleteConfirm && React.createElement('div', { style: styles.overlay, onClick: function() { setDeleteConfirm(null); } },
      React.createElement('div', { style: styles.confirmCard, onClick: function(e) { e.stopPropagation(); } },
        React.createElement('h3', { style: { marginBottom: '10px', color: '#ef4444' } }, 'Delete Post?'),
        React.createElement('p', { style: { color: '#aaa', marginBottom: '20px' } }, 'This action cannot be undone.'),
        React.createElement('div', { style: { display: 'flex', gap: '10px', justifyContent: 'center' } },
          React.createElement('button', {
            onClick: function() { handleDelete(deleteConfirm); },
            style: Object.assign({}, styles.actionBtn, { background: '#ef4444', color: '#fff', padding: '10px 24px' })
          }, 'Delete'),
          React.createElement('button', {
            onClick: function() { setDeleteConfirm(null); },
            style: Object.assign({}, styles.actionBtn, { background: 'rgba(255,255,255,0.1)', color: '#aaa', padding: '10px 24px' })
          }, 'Cancel')
        )
      )
    ),

    React.createElement('a', { href: '/projects', style: styles.backLink }, '\u2190 Back to Projects'),
    React.createElement('h1', { style: styles.title }, 'Blog Platform'),
    React.createElement('p', { style: styles.subtitle }, 'Create, edit, and manage your blog posts'),

    React.createElement('div', { style: styles.topBar },
      React.createElement('input', {
        type: 'text',
        placeholder: 'Search posts...',
        value: searchQuery,
        onChange: function(e) { setSearchQuery(e.target.value); },
        style: styles.searchInput
      }),
      React.createElement('button', { onClick: handleCreate, style: styles.createBtn }, '+ New Post')
    ),

    React.createElement('div', { style: styles.postList },
      filteredPosts.length === 0 && React.createElement('div', { style: styles.emptyState },
        searchQuery ? 'No posts match your search.' : 'No posts yet. Create your first post!'
      ),
      filteredPosts.map(function(post) {
        return React.createElement('div', { key: post.id, style: styles.postCard },
          React.createElement('div', { style: styles.postTitle }, post.title),
          React.createElement('div', { style: styles.postMeta },
            React.createElement('span', null, 'By ' + post.author),
            React.createElement('span', null, post.date)
          ),
          React.createElement('div', { style: styles.postExcerpt }, getExcerpt(post.content)),
          React.createElement('div', { style: styles.postActions },
            React.createElement('button', {
              onClick: function() { handleEdit(post); },
              style: Object.assign({}, styles.actionBtn, { background: '#6366f1', color: '#fff' })
            }, 'Edit'),
            React.createElement('button', {
              onClick: function() { setDeleteConfirm(post.id); },
              style: Object.assign({}, styles.actionBtn, { background: 'rgba(239,68,68,0.2)', color: '#ef4444' })
            }, 'Delete')
          )
        );
      })
    )
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
