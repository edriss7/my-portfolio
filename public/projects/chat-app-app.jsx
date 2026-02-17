const { useState, useEffect, useRef } = React;

var mockUsers = [
  { id: 1, name: 'Alice Johnson', avatar: 'A', status: 'online', color: '#22c55e' },
  { id: 2, name: 'Bob Smith', avatar: 'B', status: 'online', color: '#3b82f6' },
  { id: 3, name: 'Carol Davis', avatar: 'C', status: 'away', color: '#f59e0b' }
];

var autoReplies = {
  1: [
    'That sounds great!',
    'I was just thinking the same thing.',
    'Let me check and get back to you.',
    'Interesting perspective! Tell me more.',
    'Ha, that is funny!',
    'Sure, I am on board with that.',
    'Good point. I agree completely.'
  ],
  2: [
    'Hey, nice to hear from you!',
    'I will look into that right away.',
    'Could you elaborate a bit more?',
    'Awesome, thanks for sharing!',
    'Let me think about that for a moment.',
    'That makes a lot of sense.',
    'Great idea, let us do it!'
  ],
  3: [
    'Oh wow, really?',
    'Thanks for letting me know!',
    'I have been meaning to ask about that.',
    'That is so cool!',
    'I will send you the details later.',
    'Sounds like a plan!',
    'Perfect, thanks!'
  ]
};

var initialMessages = {
  1: [
    { id: 1, text: 'Hey! How are you doing today?', sender: 1, time: '10:30 AM' },
    { id: 2, text: 'I am doing great, thanks! Just working on some projects.', sender: 'me', time: '10:32 AM' },
    { id: 3, text: 'Nice! What kind of projects are you working on?', sender: 1, time: '10:33 AM' },
    { id: 4, text: 'Building some React mini-apps. Pretty fun stuff!', sender: 'me', time: '10:35 AM' },
    { id: 5, text: 'That sounds awesome! I love React.', sender: 1, time: '10:36 AM' }
  ],
  2: [
    { id: 1, text: 'Hi there! Did you see the new feature release?', sender: 2, time: '9:15 AM' },
    { id: 2, text: 'Not yet! What is new?', sender: 'me', time: '9:20 AM' },
    { id: 3, text: 'They added dark mode support and better performance.', sender: 2, time: '9:21 AM' }
  ],
  3: [
    { id: 1, text: 'Good morning! Ready for the meeting?', sender: 3, time: '8:00 AM' },
    { id: 2, text: 'Morning Carol! Yes, all prepared.', sender: 'me', time: '8:05 AM' },
    { id: 3, text: 'Great, see you there in 10 minutes.', sender: 3, time: '8:06 AM' },
    { id: 4, text: 'Perfect, see you soon!', sender: 'me', time: '8:07 AM' }
  ]
};

function App() {
  const [selectedUser, setSelectedUser] = useState(1);
  const [messages, setMessages] = useState(initialMessages);
  const [inputText, setInputText] = useState('');
  const [typing, setTyping] = useState(null);
  const messagesEndRef = useRef(null);
  const timeoutRef = useRef(null);

  var scrollToBottom = function() {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(scrollToBottom, [messages, selectedUser]);

  var getTimestamp = function() {
    var now = new Date();
    var h = now.getHours();
    var m = now.getMinutes();
    var ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12;
    h = h ? h : 12;
    return h + ':' + (m < 10 ? '0' : '') + m + ' ' + ampm;
  };

  var sendMessage = function() {
    if (!inputText.trim()) return;
    var newMsg = {
      id: Date.now(),
      text: inputText.trim(),
      sender: 'me',
      time: getTimestamp()
    };
    setMessages(function(prev) {
      var updated = Object.assign({}, prev);
      updated[selectedUser] = (updated[selectedUser] || []).concat([newMsg]);
      return updated;
    });
    setInputText('');

    var userId = selectedUser;
    setTyping(userId);
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(function() {
      var replies = autoReplies[userId];
      var reply = replies[Math.floor(Math.random() * replies.length)];
      var replyMsg = {
        id: Date.now() + 1,
        text: reply,
        sender: userId,
        time: getTimestamp()
      };
      setMessages(function(prev) {
        var updated = Object.assign({}, prev);
        updated[userId] = (updated[userId] || []).concat([replyMsg]);
        return updated;
      });
      setTyping(null);
    }, 1000 + Math.random() * 1000);
  };

  var handleKeyPress = function(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  var getLastMessage = function(userId) {
    var msgs = messages[userId] || [];
    if (msgs.length === 0) return '';
    return msgs[msgs.length - 1].text;
  };

  var getUnread = function(userId) {
    var msgs = messages[userId] || [];
    var last = msgs[msgs.length - 1];
    return last && last.sender !== 'me' && userId !== selectedUser ? 1 : 0;
  };

  var currentUser = mockUsers.find(function(u) { return u.id === selectedUser; });
  var currentMessages = messages[selectedUser] || [];

  var styles = {
    container: { minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%)', color: '#e0e0ff', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", padding: '20px' },
    backLink: { color: '#8888ff', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '20px' },
    title: { textAlign: 'center', fontSize: '32px', marginBottom: '10px', color: '#ffffff' },
    subtitle: { textAlign: 'center', fontSize: '16px', color: '#aaa', marginBottom: '25px' },
    chatLayout: { maxWidth: '900px', margin: '0 auto', display: 'flex', height: '550px', background: 'rgba(255,255,255,0.04)', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' },
    sidebar: { width: '260px', borderRight: '1px solid rgba(255,255,255,0.1)', display: 'flex', flexDirection: 'column', background: 'rgba(0,0,0,0.2)' },
    sidebarHeader: { padding: '16px', borderBottom: '1px solid rgba(255,255,255,0.08)', fontSize: '16px', fontWeight: 'bold', color: '#ccc' },
    userList: { flex: 1, overflow: 'auto' },
    userItem: { display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', cursor: 'pointer', transition: 'background 0.2s', borderBottom: '1px solid rgba(255,255,255,0.04)' },
    avatar: { width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 'bold', color: '#fff', flexShrink: 0, position: 'relative' },
    statusDot: { position: 'absolute', bottom: '0', right: '0', width: '12px', height: '12px', borderRadius: '50%', border: '2px solid #0a0a1a' },
    userInfo: { flex: 1, overflow: 'hidden' },
    userName: { fontSize: '14px', fontWeight: 'bold', color: '#ddd', marginBottom: '2px' },
    lastMsg: { fontSize: '12px', color: '#777', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' },
    unreadBadge: { width: '20px', height: '20px', borderRadius: '50%', background: '#6366f1', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold' },
    chatArea: { flex: 1, display: 'flex', flexDirection: 'column' },
    chatHeader: { padding: '14px 20px', borderBottom: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', gap: '12px', background: 'rgba(0,0,0,0.1)' },
    chatHeaderName: { fontSize: '16px', fontWeight: 'bold' },
    chatHeaderStatus: { fontSize: '12px', color: '#22c55e' },
    messagesArea: { flex: 1, overflow: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: '8px' },
    messageBubble: { maxWidth: '70%', padding: '10px 16px', borderRadius: '18px', fontSize: '14px', lineHeight: '1.5', wordBreak: 'break-word' },
    sentBubble: { background: '#6366f1', color: '#fff', alignSelf: 'flex-end', borderBottomRightRadius: '4px' },
    receivedBubble: { background: 'rgba(255,255,255,0.1)', color: '#e0e0ff', alignSelf: 'flex-start', borderBottomLeftRadius: '4px' },
    messageTime: { fontSize: '10px', color: 'rgba(255,255,255,0.4)', marginTop: '4px' },
    typingIndicator: { alignSelf: 'flex-start', padding: '10px 16px', background: 'rgba(255,255,255,0.08)', borderRadius: '18px', borderBottomLeftRadius: '4px', color: '#888', fontSize: '13px', fontStyle: 'italic' },
    inputArea: { padding: '14px 16px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', gap: '10px', background: 'rgba(0,0,0,0.1)' },
    textInput: { flex: 1, padding: '10px 16px', fontSize: '14px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '24px', color: '#e0e0ff', outline: 'none' },
    sendBtn: { padding: '10px 20px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: '24px', cursor: 'pointer', fontWeight: 'bold', fontSize: '14px' }
  };

  return React.createElement('div', { style: styles.container },
    React.createElement('a', { href: '/projects', style: styles.backLink }, '\u2190 Back to Projects'),
    React.createElement('h1', { style: styles.title }, 'Chat Application'),
    React.createElement('p', { style: styles.subtitle }, 'Select a contact and start messaging'),

    React.createElement('div', { style: styles.chatLayout },
      React.createElement('div', { style: styles.sidebar },
        React.createElement('div', { style: styles.sidebarHeader }, 'Contacts'),
        React.createElement('div', { style: styles.userList },
          mockUsers.map(function(user) {
            var isActive = selectedUser === user.id;
            var unread = getUnread(user.id);
            return React.createElement('div', {
              key: user.id,
              onClick: function() { setSelectedUser(user.id); },
              style: Object.assign({}, styles.userItem, { background: isActive ? 'rgba(99,102,241,0.15)' : 'transparent' })
            },
              React.createElement('div', { style: Object.assign({}, styles.avatar, { background: user.color }) },
                user.avatar,
                React.createElement('div', { style: Object.assign({}, styles.statusDot, { background: user.status === 'online' ? '#22c55e' : '#f59e0b' }) })
              ),
              React.createElement('div', { style: styles.userInfo },
                React.createElement('div', { style: styles.userName }, user.name),
                React.createElement('div', { style: styles.lastMsg }, typing === user.id ? 'typing...' : getLastMessage(user.id))
              ),
              unread > 0 && React.createElement('div', { style: styles.unreadBadge }, unread)
            );
          })
        )
      ),

      React.createElement('div', { style: styles.chatArea },
        React.createElement('div', { style: styles.chatHeader },
          React.createElement('div', { style: Object.assign({}, styles.avatar, { background: currentUser.color, width: '36px', height: '36px', fontSize: '14px' }) }, currentUser.avatar),
          React.createElement('div', null,
            React.createElement('div', { style: styles.chatHeaderName }, currentUser.name),
            React.createElement('div', { style: Object.assign({}, styles.chatHeaderStatus, { color: currentUser.status === 'online' ? '#22c55e' : '#f59e0b' }) }, currentUser.status)
          )
        ),

        React.createElement('div', { style: styles.messagesArea },
          currentMessages.map(function(msg) {
            var isSent = msg.sender === 'me';
            return React.createElement('div', {
              key: msg.id,
              style: { display: 'flex', flexDirection: 'column', alignItems: isSent ? 'flex-end' : 'flex-start' }
            },
              React.createElement('div', {
                style: Object.assign({}, styles.messageBubble, isSent ? styles.sentBubble : styles.receivedBubble)
              }, msg.text),
              React.createElement('div', { style: Object.assign({}, styles.messageTime, { textAlign: isSent ? 'right' : 'left' }) }, msg.time)
            );
          }),
          typing === selectedUser && React.createElement('div', { style: styles.typingIndicator }, currentUser.name.split(' ')[0] + ' is typing...'),
          React.createElement('div', { ref: messagesEndRef })
        ),

        React.createElement('div', { style: styles.inputArea },
          React.createElement('input', {
            type: 'text',
            placeholder: 'Type a message...',
            value: inputText,
            onChange: function(e) { setInputText(e.target.value); },
            onKeyPress: handleKeyPress,
            style: styles.textInput
          }),
          React.createElement('button', { onClick: sendMessage, style: Object.assign({}, styles.sendBtn, { opacity: inputText.trim() ? 1 : 0.5 }) }, 'Send')
        )
      )
    )
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
