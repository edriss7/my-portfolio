const { useState, useEffect, useRef } = React;

function timeAgo(dateStr) {
  var now = Date.now();
  var then = new Date(dateStr).getTime();
  var diff = Math.floor((now - then) / 1000);
  if (diff < 60) return 'just now';
  if (diff < 3600) return Math.floor(diff / 60) + ' minutes ago';
  if (diff < 86400) return Math.floor(diff / 3600) + ' hours ago';
  if (diff < 604800) return Math.floor(diff / 86400) + ' days ago';
  return Math.floor(diff / 604800) + ' weeks ago';
}

var now = Date.now();
var initialPosts = [
  {
    id: 1,
    author: 'Alice Chen',
    content: 'Just finished building a React app from scratch! The feeling of seeing your code come to life is unmatched.',
    timestamp: new Date(now - 2 * 3600000).toISOString(),
    likes: 12,
    liked: false,
    comments: [
      { id: 1, author: 'Bob Smith', text: 'Awesome work! What did you build?', timestamp: new Date(now - 1 * 3600000).toISOString() }
    ],
    showComments: false
  },
  {
    id: 2,
    author: 'Bob Smith',
    content: 'Beautiful sunset today. Sometimes you need to step away from the screen and appreciate nature.',
    timestamp: new Date(now - 5 * 3600000).toISOString(),
    likes: 24,
    liked: false,
    comments: [],
    showComments: false
  },
  {
    id: 3,
    author: 'Carol Davis',
    content: 'Pro tip: Always write tests before you push to production. Future you will thank present you!',
    timestamp: new Date(now - 12 * 3600000).toISOString(),
    likes: 45,
    liked: false,
    comments: [
      { id: 1, author: 'Dave Wilson', text: 'So true! Learned this the hard way last week.', timestamp: new Date(now - 10 * 3600000).toISOString() },
      { id: 2, author: 'Alice Chen', text: 'TDD for the win!', timestamp: new Date(now - 8 * 3600000).toISOString() }
    ],
    showComments: false
  },
  {
    id: 4,
    author: 'Dave Wilson',
    content: 'Started learning Rust this week. The borrow checker is both my enemy and my best friend. Anyone have good resources?',
    timestamp: new Date(now - 24 * 3600000).toISOString(),
    likes: 18,
    liked: false,
    comments: [],
    showComments: false
  },
  {
    id: 5,
    author: 'Eva Martinez',
    content: 'Deployed my first microservice architecture today. Docker + Kubernetes is a game changer for scalability.',
    timestamp: new Date(now - 48 * 3600000).toISOString(),
    likes: 33,
    liked: false,
    comments: [
      { id: 1, author: 'Bob Smith', text: 'K8s is incredible once you get past the learning curve!', timestamp: new Date(now - 40 * 3600000).toISOString() }
    ],
    showComments: false
  }
];

function App() {
  var _s1 = useState(initialPosts);
  var posts = _s1[0], setPosts = _s1[1];
  var _s2 = useState('');
  var newPostContent = _s2[0], setNewPostContent = _s2[1];
  var _s3 = useState('You');
  var currentUser = _s3[0], setCurrentUser = _s3[1];
  var commentRefs = useRef({});
  var nextPostId = useRef(6);
  var nextCommentId = useRef(10);

  function getAvatarColor(name) {
    var colors = ['#e74c3c', '#3498db', '#2ecc71', '#e67e22', '#9b59b6', '#1abc9c', '#f39c12', '#e91e63'];
    var idx = 0;
    for (var i = 0; i < name.length; i++) { idx += name.charCodeAt(i); }
    return colors[idx % colors.length];
  }

  function toggleLike(postId) {
    setPosts(function(prev) {
      return prev.map(function(p) {
        if (p.id !== postId) return p;
        return Object.assign({}, p, {
          liked: !p.liked,
          likes: p.liked ? p.likes - 1 : p.likes + 1
        });
      });
    });
  }

  function toggleComments(postId) {
    setPosts(function(prev) {
      return prev.map(function(p) {
        if (p.id !== postId) return p;
        return Object.assign({}, p, { showComments: !p.showComments });
      });
    });
  }

  function addComment(postId) {
    var input = commentRefs.current[postId];
    if (!input || !input.value.trim()) return;
    var text = input.value.trim();
    input.value = '';
    setPosts(function(prev) {
      return prev.map(function(p) {
        if (p.id !== postId) return p;
        var newComment = {
          id: nextCommentId.current++,
          author: currentUser,
          text: text,
          timestamp: new Date().toISOString()
        };
        return Object.assign({}, p, { comments: p.comments.concat([newComment]), showComments: true });
      });
    });
  }

  function createPost() {
    if (!newPostContent.trim()) return;
    var newPost = {
      id: nextPostId.current++,
      author: currentUser,
      content: newPostContent.trim(),
      timestamp: new Date().toISOString(),
      likes: 0,
      liked: false,
      comments: [],
      showComments: false
    };
    setPosts(function(prev) { return [newPost].concat(prev); });
    setNewPostContent('');
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
    content: { maxWidth: '600px', margin: '0 auto', padding: '0 20px' },
    createPost: {
      background: 'rgba(255,255,255,0.06)',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '20px'
    },
    createHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '12px'
    },
    avatar: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '18px',
      fontWeight: 'bold',
      color: '#fff',
      flexShrink: 0
    },
    textarea: {
      width: '100%',
      padding: '12px',
      borderRadius: '8px',
      border: '1px solid rgba(255,255,255,0.15)',
      background: 'rgba(255,255,255,0.08)',
      color: '#fff',
      fontSize: '14px',
      outline: 'none',
      resize: 'vertical',
      minHeight: '80px',
      fontFamily: 'inherit',
      boxSizing: 'border-box'
    },
    postBtn: {
      marginTop: '10px',
      padding: '10px 24px',
      borderRadius: '8px',
      border: 'none',
      background: 'linear-gradient(135deg, #9b59b6, #3498db)',
      color: '#fff',
      fontSize: '14px',
      cursor: 'pointer',
      fontWeight: '600',
      float: 'right'
    },
    post: {
      background: 'rgba(255,255,255,0.06)',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '15px'
    },
    postHeader: {
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      marginBottom: '12px'
    },
    postAuthor: { fontSize: '15px', fontWeight: '600', color: '#fff' },
    postTime: { fontSize: '12px', color: '#888' },
    postContent: { fontSize: '14px', lineHeight: '1.6', color: '#ddd', marginBottom: '15px' },
    postActions: {
      display: 'flex',
      gap: '15px',
      borderTop: '1px solid rgba(255,255,255,0.08)',
      paddingTop: '12px'
    },
    actionBtn: {
      background: 'none',
      border: 'none',
      color: '#888',
      fontSize: '14px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      padding: '6px 12px',
      borderRadius: '6px'
    },
    commentSection: {
      marginTop: '12px',
      paddingTop: '12px',
      borderTop: '1px solid rgba(255,255,255,0.08)'
    },
    comment: {
      display: 'flex',
      gap: '10px',
      marginBottom: '10px',
      padding: '8px',
      borderRadius: '8px',
      background: 'rgba(255,255,255,0.04)'
    },
    commentAvatar: {
      width: '30px',
      height: '30px',
      borderRadius: '50%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '13px',
      fontWeight: 'bold',
      color: '#fff',
      flexShrink: 0
    },
    commentContent: { flex: 1 },
    commentAuthor: { fontSize: '13px', fontWeight: '600', color: '#ccc' },
    commentText: { fontSize: '13px', color: '#aaa', marginTop: '2px' },
    commentTime: { fontSize: '11px', color: '#666', marginTop: '2px' },
    commentInput: {
      display: 'flex',
      gap: '8px',
      marginTop: '10px'
    },
    commentInputField: {
      flex: 1,
      padding: '8px 12px',
      borderRadius: '20px',
      border: '1px solid rgba(255,255,255,0.15)',
      background: 'rgba(255,255,255,0.08)',
      color: '#fff',
      fontSize: '13px',
      outline: 'none'
    },
    commentSendBtn: {
      padding: '8px 16px',
      borderRadius: '20px',
      border: 'none',
      background: '#9b59b6',
      color: '#fff',
      fontSize: '13px',
      cursor: 'pointer'
    }
  };

  return React.createElement('div', { style: styles.container },
    React.createElement('a', { href: '/projects', style: styles.backLink }, '\u2190 Back to Projects'),
    React.createElement('h1', { style: styles.header }, 'Social Feed'),
    React.createElement('div', { style: styles.content },
      React.createElement('div', { style: styles.createPost },
        React.createElement('div', { style: styles.createHeader },
          React.createElement('div', { style: Object.assign({}, styles.avatar, { background: getAvatarColor(currentUser) }) }, currentUser[0]),
          React.createElement('span', { style: { color: '#fff', fontWeight: '600' } }, currentUser)
        ),
        React.createElement('textarea', {
          style: styles.textarea,
          placeholder: "What's on your mind?",
          value: newPostContent,
          onChange: function(e) { setNewPostContent(e.target.value); }
        }),
        React.createElement('div', { style: { overflow: 'hidden' } },
          React.createElement('button', { style: styles.postBtn, onClick: createPost }, 'Post')
        )
      ),
      posts.map(function(post) {
        return React.createElement('div', { key: post.id, style: styles.post },
          React.createElement('div', { style: styles.postHeader },
            React.createElement('div', { style: Object.assign({}, styles.avatar, { background: getAvatarColor(post.author) }) }, post.author[0]),
            React.createElement('div', null,
              React.createElement('div', { style: styles.postAuthor }, post.author),
              React.createElement('div', { style: styles.postTime }, timeAgo(post.timestamp))
            )
          ),
          React.createElement('div', { style: styles.postContent }, post.content),
          React.createElement('div', { style: styles.postActions },
            React.createElement('button', {
              style: Object.assign({}, styles.actionBtn, { color: post.liked ? '#e74c3c' : '#888' }),
              onClick: function() { toggleLike(post.id); },
              onMouseEnter: function(e) { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; },
              onMouseLeave: function(e) { e.currentTarget.style.background = 'none'; }
            }, (post.liked ? '\u2665' : '\u2661') + ' ' + post.likes),
            React.createElement('button', {
              style: styles.actionBtn,
              onClick: function() { toggleComments(post.id); },
              onMouseEnter: function(e) { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; },
              onMouseLeave: function(e) { e.currentTarget.style.background = 'none'; }
            }, '💬 ' + post.comments.length + ' Comments')
          ),
          post.showComments ? React.createElement('div', { style: styles.commentSection },
            post.comments.map(function(comment) {
              return React.createElement('div', { key: comment.id, style: styles.comment },
                React.createElement('div', { style: Object.assign({}, styles.commentAvatar, { background: getAvatarColor(comment.author) }) }, comment.author[0]),
                React.createElement('div', { style: styles.commentContent },
                  React.createElement('div', { style: styles.commentAuthor }, comment.author),
                  React.createElement('div', { style: styles.commentText }, comment.text),
                  React.createElement('div', { style: styles.commentTime }, timeAgo(comment.timestamp))
                )
              );
            }),
            React.createElement('div', { style: styles.commentInput },
              React.createElement('input', {
                style: styles.commentInputField,
                placeholder: 'Write a comment...',
                ref: function(el) { commentRefs.current[post.id] = el; },
                onKeyDown: function(e) { if (e.key === 'Enter') addComment(post.id); }
              }),
              React.createElement('button', {
                style: styles.commentSendBtn,
                onClick: function() { addComment(post.id); }
              }, 'Send')
            )
          ) : null
        );
      })
    )
  );
}

var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
