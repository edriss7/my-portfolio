const { useState, useCallback, useRef, useEffect } = React;

var backLinkStyle = { color: '#8be9fd', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '16px' };
var baseStyle = { minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%)', color: '#e0e0e0', fontFamily: "'Segoe UI', sans-serif", padding: '24px', display: 'flex', flexDirection: 'column', alignItems: 'center' };

var mockFeed = [
  { id: 1, user: 'Alice Chen', avatar: 'A', text: 'Just shipped a new feature! The dark mode is looking great.', time: '2m ago', likes: 24, comments: 5 },
  { id: 2, user: 'Bob Rivera', avatar: 'B', text: 'Anyone else excited about the new React updates? The performance improvements are incredible.', time: '15m ago', likes: 42, comments: 12 },
  { id: 3, user: 'Carol Kim', avatar: 'C', text: 'Beautiful sunset from the office today. Working late has its perks!', time: '1h ago', likes: 89, comments: 8 },
  { id: 4, user: 'Dave Patel', avatar: 'D', text: 'Just completed my 100th pull request this year. Consistency is key!', time: '2h ago', likes: 156, comments: 23 }
];

var mockNotifications = [
  { id: 1, text: 'Alice liked your post', time: '5m ago', read: false },
  { id: 2, text: 'Bob commented on your photo', time: '30m ago', read: false },
  { id: 3, text: 'Carol started following you', time: '1h ago', read: true },
  { id: 4, text: 'Your post reached 100 likes!', time: '2h ago', read: true },
  { id: 5, text: 'Dave mentioned you in a comment', time: '3h ago', read: true }
];

var searchCategories = ['Trending', 'Technology', 'Design', 'Music', 'Food', 'Travel'];

function App() {
  var _s1 = useState(0), activeTab = _s1[0], setActiveTab = _s1[1];
  var _s2 = useState(0), prevTab = _s2[0], setPrevTab = _s2[1];
  var _s3 = useState(false), animating = _s3[0], setAnimating = _s3[1];
  var _s4 = useState(''), searchQuery = _s4[0], setSearchQuery = _s4[1];
  var _s5 = useState(mockFeed.map(function (f) { return Object.assign({}, f, { liked: false }); })), feed = _s5[0], setFeed = _s5[1];
  var _s6 = useState(mockNotifications), notifs = _s6[0], setNotifs = _s6[1];

  var switchTab = useCallback(function (idx) {
    if (idx === activeTab || animating) return;
    setPrevTab(activeTab);
    setActiveTab(idx);
    setAnimating(true);
    setTimeout(function () { setAnimating(false); }, 300);
  }, [activeTab, animating]);

  var toggleLike = useCallback(function (id) {
    setFeed(function (prev) { return prev.map(function (f) {
      return f.id === id ? Object.assign({}, f, { liked: !f.liked, likes: f.liked ? f.likes - 1 : f.likes + 1 }) : f;
    }); });
  }, []);

  var markAllRead = useCallback(function () {
    setNotifs(function (prev) { return prev.map(function (n) { return Object.assign({}, n, { read: true }); }); });
  }, []);

  var unreadCount = notifs.filter(function (n) { return !n.read; }).length;

  var tabs = [
    { label: 'Home', icon: '\uD83C\uDFE0' },
    { label: 'Search', icon: '\uD83D\uDD0D' },
    { label: 'Alerts', icon: '\uD83D\uDD14' },
    { label: 'Profile', icon: '\uD83D\uDC64' }
  ];

  var phoneWidth = 375;
  var phoneHeight = 740;
  var statusBarH = 44;
  var tabBarH = 56;
  var contentH = phoneHeight - statusBarH - tabBarH;

  var direction = activeTab > prevTab ? 1 : -1;

  var renderStatusBar = function () {
    return React.createElement('div', { style: { height: statusBarH, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0 20px', fontSize: '13px', fontWeight: 'bold', background: 'rgba(0,0,0,0.3)', borderTopLeftRadius: '36px', borderTopRightRadius: '36px' } },
      React.createElement('span', null, '9:41'),
      React.createElement('div', { style: { width: '120px', height: '28px', background: '#000', borderRadius: '14px', position: 'absolute', left: '50%', transform: 'translateX(-50%)', top: '8px' } }),
      React.createElement('div', { style: { display: 'flex', gap: '6px', fontSize: '12px' } },
        React.createElement('span', null, '\u25CF\u25CF\u25CF\u25CF'),
        React.createElement('span', null, 'WiFi'),
        React.createElement('span', null, '87%')
      )
    );
  };

  var renderHome = function () {
    return React.createElement('div', { style: { padding: '16px' } },
      React.createElement('h2', { style: { margin: '0 0 16px', fontSize: '22px', color: '#fff' } }, 'Feed'),
      feed.map(function (post) {
        return React.createElement('div', { key: post.id, style: { background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '14px', marginBottom: '12px' } },
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' } },
            React.createElement('div', { style: { width: '36px', height: '36px', borderRadius: '50%', background: 'linear-gradient(135deg, #8be9fd, #bd93f9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '15px', color: '#0a0a1a' } }, post.avatar),
            React.createElement('div', null,
              React.createElement('div', { style: { fontWeight: 'bold', fontSize: '14px' } }, post.user),
              React.createElement('div', { style: { fontSize: '11px', color: '#888' } }, post.time)
            )
          ),
          React.createElement('div', { style: { fontSize: '14px', lineHeight: '1.5', marginBottom: '10px' } }, post.text),
          React.createElement('div', { style: { display: 'flex', gap: '20px', fontSize: '13px' } },
            React.createElement('span', { onClick: function () { toggleLike(post.id); }, style: { cursor: 'pointer', color: post.liked ? '#ff5555' : '#888' } }, (post.liked ? '\u2665' : '\u2661') + ' ' + post.likes),
            React.createElement('span', { style: { color: '#888' } }, '\uD83D\uDCAC ' + post.comments)
          )
        );
      })
    );
  };

  var renderSearch = function () {
    return React.createElement('div', { style: { padding: '16px' } },
      React.createElement('h2', { style: { margin: '0 0 16px', fontSize: '22px', color: '#fff' } }, 'Explore'),
      React.createElement('input', { style: { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '20px', padding: '10px 16px', color: '#e0e0e0', fontSize: '14px', width: '100%', boxSizing: 'border-box', marginBottom: '16px' }, placeholder: 'Search...', value: searchQuery, onChange: function (e) { setSearchQuery(e.target.value); } }),
      React.createElement('div', { style: { display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' } },
        searchCategories.map(function (cat) {
          return React.createElement('span', { key: cat, style: { background: 'rgba(139,233,253,0.15)', color: '#8be9fd', padding: '6px 14px', borderRadius: '16px', fontSize: '12px', cursor: 'pointer' } }, cat);
        })
      ),
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' } },
        [1, 2, 3, 4, 5, 6].map(function (i) {
          var colors = ['#ff79c6', '#50fa7b', '#8be9fd', '#ffb86c', '#bd93f9', '#f1fa8c'];
          return React.createElement('div', { key: i, style: { background: colors[i - 1] + '22', borderRadius: '12px', height: i % 3 === 0 ? '100px' : '80px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' } }, ['\uD83C\uDF05', '\uD83C\uDFA8', '\uD83C\uDFB5', '\uD83C\uDF55', '\u2708', '\uD83D\uDCF7'][i - 1]);
        })
      )
    );
  };

  var renderNotifications = function () {
    return React.createElement('div', { style: { padding: '16px' } },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' } },
        React.createElement('h2', { style: { margin: 0, fontSize: '22px', color: '#fff' } }, 'Notifications'),
        unreadCount > 0 && React.createElement('span', { onClick: markAllRead, style: { fontSize: '13px', color: '#8be9fd', cursor: 'pointer' } }, 'Mark all read')
      ),
      notifs.map(function (n) {
        return React.createElement('div', { key: n.id, style: { padding: '12px', borderRadius: '10px', marginBottom: '8px', background: n.read ? 'transparent' : 'rgba(139,233,253,0.08)', borderLeft: n.read ? '3px solid transparent' : '3px solid #8be9fd' } },
          React.createElement('div', { style: { fontSize: '14px', color: n.read ? '#888' : '#e0e0e0' } }, n.text),
          React.createElement('div', { style: { fontSize: '11px', color: '#666', marginTop: '4px' } }, n.time)
        );
      })
    );
  };

  var renderProfile = function () {
    return React.createElement('div', { style: { padding: '16px', textAlign: 'center' } },
      React.createElement('div', { style: { width: '80px', height: '80px', borderRadius: '50%', background: 'linear-gradient(135deg, #8be9fd, #bd93f9)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '32px', color: '#0a0a1a', margin: '20px auto 12px' } }, 'J'),
      React.createElement('h2', { style: { margin: '0 0 4px', fontSize: '20px', color: '#fff' } }, 'John Doe'),
      React.createElement('div', { style: { fontSize: '13px', color: '#888', marginBottom: '20px' } }, '@johndoe \u2022 Full-Stack Developer'),
      React.createElement('div', { style: { display: 'flex', justifyContent: 'center', gap: '30px', marginBottom: '24px' } },
        [{ label: 'Posts', val: '142' }, { label: 'Followers', val: '1.2K' }, { label: 'Following', val: '384' }].map(function (s, i) {
          return React.createElement('div', { key: i },
            React.createElement('div', { style: { fontWeight: 'bold', fontSize: '18px', color: '#8be9fd' } }, s.val),
            React.createElement('div', { style: { fontSize: '12px', color: '#888' } }, s.label)
          );
        })
      ),
      React.createElement('div', { style: { textAlign: 'left' } },
        ['Edit Profile', 'Settings', 'Privacy', 'Help', 'Log Out'].map(function (item, i) {
          return React.createElement('div', { key: i, style: { padding: '14px 12px', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '14px', display: 'flex', justifyContent: 'space-between', cursor: 'pointer', color: item === 'Log Out' ? '#ff5555' : '#e0e0e0' } },
            React.createElement('span', null, item),
            React.createElement('span', { style: { color: '#666' } }, '\u203A')
          );
        })
      )
    );
  };

  var contentViews = [renderHome, renderSearch, renderNotifications, renderProfile];

  return React.createElement('div', { style: baseStyle },
    React.createElement('a', { href: '/projects', style: backLinkStyle }, '\u2190 Back to Projects'),
    React.createElement('h1', { style: { color: '#8be9fd', margin: '0 0 20px', fontSize: '24px' } }, 'Mobile App Mockup'),
    React.createElement('div', { style: { width: phoneWidth, height: phoneHeight, borderRadius: '40px', border: '4px solid #333', background: '#0d0d1e', position: 'relative', overflow: 'hidden', boxShadow: '0 0 0 2px #555, 0 20px 60px rgba(0,0,0,0.5)' } },
      renderStatusBar(),
      React.createElement('div', { style: { height: contentH, overflow: 'hidden', position: 'relative' } },
        React.createElement('div', { style: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflowY: 'auto', transition: animating ? 'transform 0.3s ease, opacity 0.3s ease' : 'none', transform: animating ? 'translateX(0)' : 'none', opacity: 1 } },
          contentViews[activeTab]()
        )
      ),
      React.createElement('div', { style: { height: tabBarH, display: 'flex', alignItems: 'center', justifyContent: 'space-around', background: 'rgba(10,10,26,0.95)', borderTop: '1px solid rgba(255,255,255,0.1)', borderBottomLeftRadius: '36px', borderBottomRightRadius: '36px', paddingBottom: '4px' } },
        tabs.map(function (tab, i) {
          return React.createElement('div', { key: i, onClick: function () { switchTab(i); }, style: { cursor: 'pointer', textAlign: 'center', flex: 1, position: 'relative', padding: '4px 0' } },
            React.createElement('div', { style: { fontSize: '20px', opacity: activeTab === i ? 1 : 0.5, transition: 'opacity 0.2s' } }, tab.icon),
            i === 2 && unreadCount > 0 && React.createElement('span', { style: { position: 'absolute', top: '0', right: '50%', marginRight: '-18px', background: '#ff5555', color: '#fff', borderRadius: '50%', width: '14px', height: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '9px', fontWeight: 'bold' } }, unreadCount),
            React.createElement('div', { style: { fontSize: '10px', color: activeTab === i ? '#8be9fd' : '#666', marginTop: '2px' } }, tab.label),
            activeTab === i && React.createElement('div', { style: { position: 'absolute', bottom: '0', left: '50%', transform: 'translateX(-50%)', width: '20px', height: '3px', background: '#8be9fd', borderRadius: '2px' } })
          );
        })
      )
    )
  );
}

var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
