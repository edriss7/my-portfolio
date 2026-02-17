const { useState, useCallback } = React;

var backLinkStyle = { color: '#7b8cff', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '20px' };
var containerStyle = { minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%)', color: '#e0e0e0', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", padding: '20px' };
var cardStyle = { background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '12px' };

var avatarColors = ['#7b8cff', '#f87171', '#4ade80', '#fbbf24', '#a78bfa', '#38bdf8', '#f0abfc', '#fb923c'];
function avatarStyle(size, idx) {
  return { width: size + 'px', height: size + 'px', borderRadius: '50%', background: avatarColors[idx % avatarColors.length], display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: (size * 0.4) + 'px', color: '#fff', flexShrink: 0 };
}

var stories = [
  { name: 'You', initials: 'ME', isOwn: true }, { name: 'Alice', initials: 'AL' }, { name: 'Bob', initials: 'BO' },
  { name: 'Carol', initials: 'CA' }, { name: 'Dave', initials: 'DA' }, { name: 'Eve', initials: 'EV' },
  { name: 'Frank', initials: 'FR' }, { name: 'Grace', initials: 'GR' }
];

var initialPosts = [
  { id: 1, author: 'Alice Chen', initials: 'AC', idx: 1, time: '2h ago', content: 'Just shipped a major update to our design system! The new dark theme looks incredible. What do you all think?', likes: 42, comments: [{ author: 'Bob', text: 'Looks amazing!' }, { author: 'Carol', text: 'Love the gradients' }], shares: 8 },
  { id: 2, author: 'Bob Martinez', initials: 'BM', idx: 2, time: '4h ago', content: 'Weekend hiking trip was absolutely worth it. Nothing beats being in nature to clear your mind and recharge.', likes: 67, comments: [{ author: 'Dave', text: 'Where did you go?' }], shares: 12 },
  { id: 3, author: 'Carol Kim', initials: 'CK', idx: 3, time: '6h ago', content: 'New blog post: "Why TypeScript Changed How I Think About Code." Link in bio! Would love your feedback.', likes: 23, comments: [], shares: 5 }
];

var friendSuggestions = [
  { name: 'Diana Ross', initials: 'DR', idx: 4, mutuals: 12 },
  { name: 'Eric Wong', initials: 'EW', idx: 5, mutuals: 8 },
  { name: 'Fiona Lee', initials: 'FL', idx: 6, mutuals: 5 },
  { name: 'George Patel', initials: 'GP', idx: 7, mutuals: 3 }
];

var trending = ['#DarkMode', '#WebDev', '#ReactJS', '#AI2026', '#OpenSource'];

var notifications = [
  { text: 'Alice liked your post', time: '5m ago' },
  { text: 'Bob commented on your photo', time: '20m ago' },
  { text: 'Carol sent you a friend request', time: '1h ago' },
  { text: 'Dave shared your post', time: '2h ago' },
  { text: '3 new followers this week', time: '3h ago' }
];

function App() {
  var s1 = useState(initialPosts), posts = s1[0], setPosts = s1[1];
  var s2 = useState(''), newPost = s2[0], setNewPost = s2[1];
  var s3 = useState(false), showNotifs = s3[0], setShowNotifs = s3[1];
  var s4 = useState({}), likedPosts = s4[0], setLikedPosts = s4[1];
  var s5 = useState({}), commentInputs = s5[0], setCommentInputs = s5[1];
  var s6 = useState(null), showComments = s6[0], setShowComments = s6[1];

  var handlePost = useCallback(function() {
    if (!newPost.trim()) return;
    var post = { id: Date.now(), author: 'You', initials: 'ME', idx: 0, time: 'Just now', content: newPost, likes: 0, comments: [], shares: 0 };
    setPosts(function(p) { return [post].concat(p); });
    setNewPost('');
  }, [newPost]);

  var toggleLike = useCallback(function(id) {
    setLikedPosts(function(prev) {
      var next = Object.assign({}, prev);
      next[id] = !prev[id];
      return next;
    });
    setPosts(function(prev) {
      return prev.map(function(p) {
        if (p.id === id) {
          var delta = likedPosts[id] ? -1 : 1;
          return Object.assign({}, p, { likes: p.likes + delta });
        }
        return p;
      });
    });
  }, [likedPosts]);

  var addComment = useCallback(function(id) {
    var text = commentInputs[id];
    if (!text || !text.trim()) return;
    setPosts(function(prev) {
      return prev.map(function(p) {
        if (p.id === id) return Object.assign({}, p, { comments: p.comments.concat([{ author: 'You', text: text.trim() }]) });
        return p;
      });
    });
    setCommentInputs(function(prev) { var n = Object.assign({}, prev); n[id] = ''; return n; });
  }, [commentInputs]);

  var btnBase = { padding: '6px 14px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' };

  return React.createElement('div', { style: containerStyle },
    React.createElement('a', { href: '/projects', style: backLinkStyle }, '\u2190 Back to Projects'),

    // Header bar
    React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', padding: '12px 20px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)' } },
      React.createElement('h1', { style: { fontSize: '24px', fontWeight: '800', color: '#7b8cff', margin: 0 } }, 'SocialNet'),
      React.createElement('div', { style: { display: 'flex', gap: '16px', alignItems: 'center' } },
        React.createElement('input', { placeholder: 'Search...', style: { padding: '8px 14px', background: 'rgba(0,0,0,0.3)', color: '#e0e0e0', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', fontSize: '13px', width: '200px' } }),
        React.createElement('div', { style: { position: 'relative' } },
          React.createElement('button', { onClick: function() { setShowNotifs(!showNotifs); }, style: { background: 'none', border: 'none', fontSize: '22px', cursor: 'pointer', position: 'relative', color: '#e0e0e0' } },
            '\uD83D\uDD14',
            React.createElement('span', { style: { position: 'absolute', top: '-4px', right: '-4px', width: '16px', height: '16px', background: '#f87171', borderRadius: '50%', fontSize: '10px', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700' } }, '5')
          ),
          showNotifs && React.createElement('div', { style: { position: 'absolute', top: '36px', right: 0, width: '280px', background: '#1e1e3a', borderRadius: '10px', boxShadow: '0 8px 32px rgba(0,0,0,0.6)', zIndex: 100, border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden' } },
            React.createElement('div', { style: { padding: '12px 14px', borderBottom: '1px solid rgba(255,255,255,0.08)', fontWeight: '600', fontSize: '14px', color: '#fff' } }, 'Notifications'),
            notifications.map(function(n, i) {
              return React.createElement('div', { key: i, style: { padding: '10px 14px', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: '13px' } },
                React.createElement('div', { style: { color: '#e0e0e0' } }, n.text),
                React.createElement('div', { style: { color: '#6b7280', fontSize: '11px', marginTop: '2px' } }, n.time)
              );
            })
          )
        ),
        React.createElement('div', { style: avatarStyle(36, 0) }, 'ME')
      )
    ),

    React.createElement('div', { style: { display: 'flex', gap: '20px' } },
      // Main column
      React.createElement('div', { style: { flex: 1, maxWidth: '600px' } },
        // Stories
        React.createElement('div', { style: Object.assign({}, cardStyle, { display: 'flex', gap: '12px', overflowX: 'auto', padding: '14px' }) },
          stories.map(function(s, i) {
            return React.createElement('div', { key: i, style: { textAlign: 'center', cursor: 'pointer', flexShrink: 0 } },
              React.createElement('div', { style: { width: '56px', height: '56px', borderRadius: '50%', padding: '2px', background: s.isOwn ? 'rgba(255,255,255,0.2)' : 'linear-gradient(135deg, #7b8cff, #ff7bca)', display: 'flex', alignItems: 'center', justifyContent: 'center' } },
                React.createElement('div', { style: Object.assign({}, avatarStyle(50, i), { border: '2px solid #0a0a1a' }) }, s.initials)
              ),
              React.createElement('div', { style: { fontSize: '11px', color: '#9ca3af', marginTop: '4px' } }, s.name)
            );
          })
        ),

        // Create Post
        React.createElement('div', { style: cardStyle },
          React.createElement('div', { style: { display: 'flex', gap: '12px', alignItems: 'flex-start' } },
            React.createElement('div', { style: avatarStyle(40, 0) }, 'ME'),
            React.createElement('div', { style: { flex: 1 } },
              React.createElement('textarea', { value: newPost, onChange: function(e) { setNewPost(e.target.value); }, placeholder: "What's on your mind?", style: { width: '100%', minHeight: '60px', padding: '10px', background: 'rgba(0,0,0,0.3)', color: '#e0e0e0', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '14px', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' } }),
              React.createElement('div', { style: { display: 'flex', justifyContent: 'flex-end', marginTop: '8px' } },
                React.createElement('button', { onClick: handlePost, style: Object.assign({}, btnBase, { background: '#7b8cff', color: '#fff', padding: '8px 20px' }) }, 'Post')
              )
            )
          )
        ),

        // Feed
        posts.map(function(post) {
          return React.createElement('div', { key: post.id, style: cardStyle },
            React.createElement('div', { style: { display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '12px' } },
              React.createElement('div', { style: avatarStyle(42, post.idx) }, post.initials),
              React.createElement('div', null,
                React.createElement('div', { style: { fontWeight: '600', color: '#fff', fontSize: '14px' } }, post.author),
                React.createElement('div', { style: { fontSize: '11px', color: '#6b7280' } }, post.time)
              )
            ),
            React.createElement('p', { style: { margin: '0 0 14px', lineHeight: '1.5', fontSize: '14px' } }, post.content),
            React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px' } },
              React.createElement('button', { onClick: function() { toggleLike(post.id); }, style: Object.assign({}, btnBase, { background: 'none', color: likedPosts[post.id] ? '#f87171' : '#9ca3af' }) }, (likedPosts[post.id] ? '\u2665' : '\u2661') + ' ' + post.likes),
              React.createElement('button', { onClick: function() { setShowComments(showComments === post.id ? null : post.id); }, style: Object.assign({}, btnBase, { background: 'none', color: '#9ca3af' }) }, '\uD83D\uDCAC ' + post.comments.length),
              React.createElement('button', { style: Object.assign({}, btnBase, { background: 'none', color: '#9ca3af' }) }, '\u21AA ' + post.shares)
            ),
            showComments === post.id && React.createElement('div', { style: { marginTop: '10px', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '10px' } },
              post.comments.map(function(c, ci) {
                return React.createElement('div', { key: ci, style: { display: 'flex', gap: '8px', marginBottom: '8px', fontSize: '13px' } },
                  React.createElement('span', { style: { fontWeight: '600', color: '#7b8cff' } }, c.author + ':'),
                  React.createElement('span', null, c.text)
                );
              }),
              React.createElement('div', { style: { display: 'flex', gap: '8px', marginTop: '4px' } },
                React.createElement('input', { value: commentInputs[post.id] || '', onChange: function(e) { var o = {}; o[post.id] = e.target.value; setCommentInputs(function(p) { return Object.assign({}, p, o); }); }, onKeyDown: function(e) { if (e.key === 'Enter') addComment(post.id); }, placeholder: 'Write a comment...', style: { flex: 1, padding: '8px', background: 'rgba(0,0,0,0.3)', color: '#e0e0e0', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', fontSize: '13px' } }),
                React.createElement('button', { onClick: function() { addComment(post.id); }, style: Object.assign({}, btnBase, { background: '#7b8cff', color: '#fff' }) }, 'Reply')
              )
            )
          );
        })
      ),

      // Right sidebar
      React.createElement('div', { style: { width: '280px', flexShrink: 0, display: 'flex', flexDirection: 'column', gap: '12px' } },
        // Profile card
        React.createElement('div', { style: Object.assign({}, cardStyle, { textAlign: 'center' }) },
          React.createElement('div', { style: { width: '72px', height: '72px', borderRadius: '50%', background: '#7b8cff', margin: '0 auto 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', fontWeight: '700', color: '#fff' } }, 'ME'),
          React.createElement('div', { style: { fontWeight: '700', color: '#fff', fontSize: '16px' } }, 'Your Name'),
          React.createElement('div', { style: { fontSize: '13px', color: '#9ca3af', marginBottom: '12px' } }, 'Full-stack developer & designer'),
          React.createElement('div', { style: { display: 'flex', justifyContent: 'space-around', borderTop: '1px solid rgba(255,255,255,0.06)', paddingTop: '12px' } },
            React.createElement('div', { style: { textAlign: 'center' } }, React.createElement('div', { style: { fontWeight: '700', color: '#fff', fontSize: '16px' } }, '248'), React.createElement('div', { style: { fontSize: '11px', color: '#6b7280' } }, 'Posts')),
            React.createElement('div', { style: { textAlign: 'center' } }, React.createElement('div', { style: { fontWeight: '700', color: '#fff', fontSize: '16px' } }, '1.2K'), React.createElement('div', { style: { fontSize: '11px', color: '#6b7280' } }, 'Friends')),
            React.createElement('div', { style: { textAlign: 'center' } }, React.createElement('div', { style: { fontWeight: '700', color: '#fff', fontSize: '16px' } }, '3.4K'), React.createElement('div', { style: { fontSize: '11px', color: '#6b7280' } }, 'Followers'))
          )
        ),

        // Friend Suggestions
        React.createElement('div', { style: cardStyle },
          React.createElement('div', { style: { fontWeight: '600', color: '#fff', fontSize: '14px', marginBottom: '12px' } }, 'Friend Suggestions'),
          friendSuggestions.map(function(f) {
            return React.createElement('div', { key: f.name, style: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' } },
              React.createElement('div', { style: avatarStyle(36, f.idx) }, f.initials),
              React.createElement('div', { style: { flex: 1 } },
                React.createElement('div', { style: { fontSize: '13px', fontWeight: '600', color: '#fff' } }, f.name),
                React.createElement('div', { style: { fontSize: '11px', color: '#6b7280' } }, f.mutuals + ' mutual friends')
              ),
              React.createElement('button', { style: Object.assign({}, btnBase, { background: 'rgba(123,140,255,0.2)', color: '#7b8cff', fontSize: '11px', padding: '4px 10px' }) }, 'Add')
            );
          })
        ),

        // Trending
        React.createElement('div', { style: cardStyle },
          React.createElement('div', { style: { fontWeight: '600', color: '#fff', fontSize: '14px', marginBottom: '12px' } }, 'Trending Topics'),
          trending.map(function(t, i) {
            return React.createElement('div', { key: t, style: { display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: i < trending.length - 1 ? '1px solid rgba(255,255,255,0.04)' : 'none' } },
              React.createElement('span', { style: { fontSize: '13px', color: '#7b8cff', fontWeight: '600' } }, t),
              React.createElement('span', { style: { fontSize: '11px', color: '#6b7280' } }, Math.floor(Math.random() * 50 + 10) + 'K posts')
            );
          })
        )
      )
    )
  );
}

var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
