const { useState, useEffect, useCallback, useRef } = React;

var avatarColors = ['#bd93f9', '#ff79c6', '#50fa7b', '#8be9fd', '#ffb86c', '#ff5555', '#f1fa8c'];
var firstNames = ['Alice', 'Bob', 'Carol', 'Dave', 'Eve', 'Frank', 'Grace', 'Hank', 'Ivy', 'Jack', 'Kate', 'Leo', 'Mia', 'Nick', 'Olga'];
var topics = ['the future of AI', 'remote work tips', 'healthy eating habits', 'learning to code', 'travel adventures', 'book recommendations', 'photography basics', 'music production', 'startup culture', 'mindfulness practice', 'home gardening', 'fitness routines', 'cooking experiments', 'sustainable living', 'digital art'];

function generatePost(id) {
  var name = firstNames[id % firstNames.length];
  var topic = topics[id % topics.length];
  var color = avatarColors[id % avatarColors.length];
  var hours = Math.floor(Math.random() * 48) + 1;
  return {
    id: id,
    author: name + ' ' + String.fromCharCode(65 + (id % 26)),
    avatar: color,
    initial: name[0],
    title: 'Thoughts on ' + topic,
    content: 'I have been exploring ' + topic + ' lately and wanted to share some insights. There are so many interesting aspects to consider, from the basics to advanced concepts. What do you all think about this? I would love to hear different perspectives and learn from the community.',
    likes: Math.floor(Math.random() * 200) + 5,
    comments: Math.floor(Math.random() * 50),
    time: hours + 'h ago',
    liked: false
  };
}

function App() {
  var _s = useState([]);
  var posts = _s[0]; var setPosts = _s[1];
  var _s2 = useState(false);
  var loading = _s2[0]; var setLoading = _s2[1];
  var _s3 = useState(false);
  var showTop = _s3[0]; var setShowTop = _s3[1];
  var nextIdRef = useRef(0);
  var containerRef = useRef(null);

  var loadMore = useCallback(function() {
    setLoading(true);
    setTimeout(function() {
      var newPosts = [];
      for (var i = 0; i < 10; i++) {
        newPosts.push(generatePost(nextIdRef.current));
        nextIdRef.current++;
      }
      setPosts(function(prev) { return prev.concat(newPosts); });
      setLoading(false);
    }, 800);
  }, []);

  useEffect(function() { loadMore(); }, []);

  useEffect(function() {
    var handleScroll = function() {
      setShowTop(window.scrollY > 600);
      if (loading) return;
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 400) {
        loadMore();
      }
    };
    window.addEventListener('scroll', handleScroll);
    return function() { window.removeEventListener('scroll', handleScroll); };
  }, [loading, loadMore]);

  var toggleLike = function(id) {
    setPosts(function(prev) {
      return prev.map(function(p) {
        if (p.id !== id) return p;
        return Object.assign({}, p, { liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 });
      });
    });
  };

  var scrollToTop = function() { window.scrollTo({ top: 0, behavior: 'smooth' }); };

  var containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%)',
    color: '#e0e0e0',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: '20px'
  };
  var backLinkStyle = { color: '#8be9fd', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '20px' };
  var feedStyle = { maxWidth: '600px', margin: '0 auto' };
  var postStyle = {
    background: 'rgba(255,255,255,0.05)',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '16px',
    border: '1px solid rgba(255,255,255,0.08)'
  };

  return React.createElement('div', { style: containerStyle, ref: containerRef },
    React.createElement('a', { href: '/projects', style: backLinkStyle }, '\u2190 Back to Projects'),
    React.createElement('h1', { style: { textAlign: 'center', fontSize: '28px', color: '#fff', marginBottom: '8px' } }, 'Infinite Scroll Feed'),
    React.createElement('div', { style: { textAlign: 'center', color: '#888', fontSize: '13px', marginBottom: '24px' } }, posts.length + ' posts loaded'),
    React.createElement('div', { style: feedStyle },
      posts.map(function(post) {
        return React.createElement('div', { key: post.id, style: postStyle },
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' } },
            React.createElement('div', { style: {
              width: '40px', height: '40px', borderRadius: '50%',
              background: post.avatar,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: 'bold', fontSize: '16px', color: '#fff', flexShrink: 0
            } }, post.initial),
            React.createElement('div', { style: { flex: 1 } },
              React.createElement('div', { style: { fontWeight: 'bold', color: '#fff', fontSize: '14px' } }, post.author),
              React.createElement('div', { style: { fontSize: '12px', color: '#666' } }, post.time)
            )
          ),
          React.createElement('h3', { style: { fontSize: '16px', color: '#fff', marginBottom: '8px' } }, post.title),
          React.createElement('p', { style: { fontSize: '14px', color: '#aaa', lineHeight: '1.5', marginBottom: '14px' } }, post.content),
          React.createElement('div', { style: { display: 'flex', gap: '20px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px' } },
            React.createElement('button', {
              onClick: function() { toggleLike(post.id); },
              style: {
                background: 'none', border: 'none', cursor: 'pointer',
                color: post.liked ? '#ff79c6' : '#888', fontSize: '13px',
                display: 'flex', alignItems: 'center', gap: '6px'
              }
            }, post.liked ? '\u2665' : '\u2661', ' ' + post.likes),
            React.createElement('span', { style: { color: '#888', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' } },
              '\u2637 ' + post.comments + ' comments'
            )
          )
        );
      }),
      loading && React.createElement('div', { style: { textAlign: 'center', padding: '30px' } },
        React.createElement('div', { style: {
          width: '36px', height: '36px', border: '3px solid rgba(189,147,249,0.3)',
          borderTop: '3px solid #bd93f9', borderRadius: '50%',
          margin: '0 auto', animation: 'spin 0.8s linear infinite'
        } }),
        React.createElement('div', { style: { marginTop: '10px', color: '#888', fontSize: '13px' } }, 'Loading more posts...')
      )
    ),
    showTop && React.createElement('button', {
      onClick: scrollToTop,
      style: {
        position: 'fixed', bottom: '30px', right: '30px',
        width: '48px', height: '48px', borderRadius: '50%',
        background: 'linear-gradient(135deg, #bd93f9, #ff79c6)',
        border: 'none', color: '#fff', fontSize: '20px',
        cursor: 'pointer', boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }
    }, '\u2191')
  );
}

var styleTag = document.createElement('style');
styleTag.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
document.head.appendChild(styleTag);

var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
