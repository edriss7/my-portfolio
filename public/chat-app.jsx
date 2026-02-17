const { useState, useRef, useEffect, useCallback } = React;

const EMOJIS = ['\u{1F600}', '\u{1F602}', '\u{2764}\u{FE0F}', '\u{1F44D}', '\u{1F525}', '\u{1F389}', '\u{1F60E}', '\u{1F914}', '\u{1F44B}', '\u{1F4AF}', '\u{1F622}', '\u{1F64C}', '\u{1F680}', '\u{2705}', '\u{1F440}', '\u{1F3B5}'];

const AVATAR_COLORS = ['#4caf50', '#2196f3', '#ff9800', '#e91e63', '#9c27b0', '#00bcd4', '#ff5722', '#607d8b'];

const CHANNELS = {
  general: {
    name: 'general',
    desc: 'Company-wide announcements and work-based matters',
    messages: [
      { id: 1, user: 'Alice', text: 'Hey team! Welcome to the new workspace \u{1F44B}', time: '9:30 AM' },
      { id: 2, user: 'Bob', text: 'Thanks Alice! Excited to be here.', time: '9:32 AM' },
      { id: 3, user: 'Charlie', text: 'This looks great! Love the new setup \u{1F525}', time: '9:35 AM' },
      { id: 4, user: 'Alice', text: 'Reminder: standup at 10am today', time: '9:45 AM' },
    ],
  },
  random: {
    name: 'random',
    desc: 'Non-work banter and water cooler conversation',
    messages: [
      { id: 1, user: 'Bob', text: 'Anyone watch the game last night? \u{26BD}', time: '11:00 AM' },
      { id: 2, user: 'Diana', text: 'Yes! That last minute goal was insane', time: '11:02 AM' },
      { id: 3, user: 'Charlie', text: 'I fell asleep at halftime lol \u{1F602}', time: '11:05 AM' },
    ],
  },
  engineering: {
    name: 'engineering',
    desc: 'Engineering team discussions',
    messages: [
      { id: 1, user: 'Charlie', text: 'PR #142 is ready for review', time: '10:00 AM' },
      { id: 2, user: 'Alice', text: 'On it! Give me 15 mins', time: '10:02 AM' },
      { id: 3, user: 'Charlie', text: 'Also, should we migrate to TypeScript?', time: '10:10 AM' },
      { id: 4, user: 'Bob', text: 'Definitely. Let\'s discuss in the next sprint planning', time: '10:15 AM' },
      { id: 5, user: 'Diana', text: 'I can draft a migration plan \u{1F4DD}', time: '10:18 AM' },
    ],
  },
  design: {
    name: 'design',
    desc: 'Design team and UI/UX discussions',
    messages: [
      { id: 1, user: 'Diana', text: 'New mockups are in Figma \u{1F3A8}', time: '2:00 PM' },
      { id: 2, user: 'Alice', text: 'These look amazing Diana!', time: '2:05 PM' },
    ],
  },
};

const DM_CHANNELS = {
  alice: {
    name: 'Alice',
    online: true,
    messages: [
      { id: 1, user: 'Alice', text: 'Hey! Can you review my PR?', time: '3:00 PM' },
      { id: 2, user: 'You', text: 'Sure, which repo?', time: '3:02 PM' },
      { id: 3, user: 'Alice', text: 'The main frontend one', time: '3:03 PM' },
    ],
  },
  bob: {
    name: 'Bob',
    online: true,
    messages: [
      { id: 1, user: 'Bob', text: 'Lunch today?', time: '11:30 AM' },
      { id: 2, user: 'You', text: 'Sounds good! 12pm?', time: '11:32 AM' },
    ],
  },
  charlie: {
    name: 'Charlie',
    online: false,
    messages: [],
  },
  diana: {
    name: 'Diana',
    online: false,
    messages: [
      { id: 1, user: 'Diana', text: 'Sent you the design files', time: '4:00 PM' },
    ],
  },
};

function ChatApp() {
  const [channels, setChannels] = useState(CHANNELS);
  const [dmChannels, setDmChannels] = useState(DM_CHANNELS);
  const [activeChannel, setActiveChannel] = useState('general');
  const [activeType, setActiveType] = useState('channel');
  const [users, setUsers] = useState(['You', 'Alice', 'Bob', 'Charlie', 'Diana']);
  const [currentUser, setCurrentUser] = useState('You');
  const [input, setInput] = useState('');
  const [showEmojis, setShowEmojis] = useState(false);
  const [showNewUser, setShowNewUser] = useState(false);
  const [showNewChannel, setShowNewChannel] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newChannelName, setNewChannelName] = useState('');
  const [expandChannels, setExpandChannels] = useState(true);
  const [expandDMs, setExpandDMs] = useState(true);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const messagesEndRef = useRef(null);

  // Resize listener for mobile detection
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const activeData = activeType === 'channel' ? channels[activeChannel] : dmChannels[activeChannel];
  const activeMessages = activeData?.messages || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages.length, activeChannel]);

  const sendMessage = () => {
    const text = input.trim();
    if (!text) return;
    const now = new Date();
    const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg = { id: Date.now(), user: currentUser, text, time };

    if (activeType === 'channel') {
      setChannels({
        ...channels,
        [activeChannel]: {
          ...channels[activeChannel],
          messages: [...channels[activeChannel].messages, newMsg],
        },
      });
    } else {
      setDmChannels({
        ...dmChannels,
        [activeChannel]: {
          ...dmChannels[activeChannel],
          messages: [...dmChannels[activeChannel].messages, newMsg],
        },
      });
    }
    setInput('');
    setShowEmojis(false);
  };

  const addUser = () => {
    const name = newUserName.trim();
    if (!name || users.includes(name)) return;
    setUsers([...users, name]);
    const key = name.toLowerCase();
    setDmChannels({ ...dmChannels, [key]: { name, online: true, messages: [] } });
    setNewUserName('');
    setShowNewUser(false);
  };

  const addChannel = () => {
    const name = newChannelName.trim().toLowerCase().replace(/\s+/g, '-');
    if (!name || channels[name]) return;
    setChannels({ ...channels, [name]: { name, desc: 'New channel', messages: [] } });
    setNewChannelName('');
    setShowNewChannel(false);
    setActiveChannel(name);
    setActiveType('channel');
    if (isMobile) setSidebarOpen(false);
  };

  const getAvatarColor = (user) => {
    const idx = users.indexOf(user);
    return AVATAR_COLORS[Math.abs(idx) % AVATAR_COLORS.length];
  };

  const handleChannelSelect = (key, type) => {
    setActiveChannel(key);
    setActiveType(type);
    if (isMobile) setSidebarOpen(false);
  };

  const channelLabel = activeType === 'channel'
    ? '# ' + activeData?.name
    : activeData?.name;

  // Dynamic styles based on mobile state
  const sidebarStyle = isMobile ? {
    position: 'fixed',
    top: 0,
    left: 0,
    width: 280,
    height: '100vh',
    background: '#1a1035',
    borderRight: '1px solid rgba(255,255,255,0.06)',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    flexShrink: 0,
    zIndex: 1000,
    transform: sidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
    transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    boxShadow: sidebarOpen ? '4px 0 24px rgba(0,0,0,0.5)' : 'none',
  } : s.sidebar;

  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.5)',
    zIndex: 999,
    opacity: sidebarOpen ? 1 : 0,
    pointerEvents: sidebarOpen ? 'auto' : 'none',
    transition: 'opacity 0.3s ease',
  };

  return (
    <div style={s.wrapper}>
      {/* Mobile overlay */}
      {isMobile && (
        <div
          style={overlayStyle}
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div style={sidebarStyle}>
        <div style={s.sidebarHeader}>
          <a href="/" style={s.backLink}>{'\u2190'}</a>
          <div style={{ flex: 1 }}>
            <div style={s.workspaceName}>Edris's Workspace</div>
            <div style={s.userStatus}>
              <span style={s.onlineDot} />
              <select
                style={s.userSelect}
                value={currentUser}
                onChange={(e) => setCurrentUser(e.target.value)}
              >
                {users.map((u) => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>
          {isMobile && (
            <button
              style={s.closeSidebarBtn}
              onClick={() => setSidebarOpen(false)}
              title="Close sidebar"
            >
              {'\u2715'}
            </button>
          )}
        </div>

        {/* Channels */}
        <div style={s.sectionHeader} onClick={() => setExpandChannels(!expandChannels)}>
          <span style={{ fontSize: 10, marginRight: 6 }}>{expandChannels ? '\u25BC' : '\u25B6'}</span>
          Channels
          <button
            style={s.addBtn}
            onClick={(e) => { e.stopPropagation(); setShowNewChannel(!showNewChannel); }}
            title="Add channel"
          >+</button>
        </div>
        {showNewChannel && (
          <div style={s.newItemRow}>
            <input
              style={s.newItemInput}
              placeholder="channel-name"
              value={newChannelName}
              onChange={(e) => setNewChannelName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') addChannel(); }}
            />
            <button style={s.newItemBtn} onClick={addChannel}>Add</button>
          </div>
        )}
        {expandChannels && Object.keys(channels).map((key) => (
          <div
            key={key}
            style={{
              ...s.channelItem,
              ...(isMobile ? s.channelItemMobile : {}),
              background: activeType === 'channel' && activeChannel === key ? 'rgba(255,255,255,0.1)' : 'transparent',
              color: activeType === 'channel' && activeChannel === key ? '#fff' : 'rgba(255,255,255,0.6)',
            }}
            onClick={() => handleChannelSelect(key, 'channel')}
          >
            <span style={{ opacity: 0.5, marginRight: 6 }}>#</span> {channels[key].name}
          </div>
        ))}

        {/* DMs */}
        <div style={{ ...s.sectionHeader, marginTop: 16 }} onClick={() => setExpandDMs(!expandDMs)}>
          <span style={{ fontSize: 10, marginRight: 6 }}>{expandDMs ? '\u25BC' : '\u25B6'}</span>
          Direct Messages
          <button
            style={s.addBtn}
            onClick={(e) => { e.stopPropagation(); setShowNewUser(!showNewUser); }}
            title="Add user"
          >+</button>
        </div>
        {showNewUser && (
          <div style={s.newItemRow}>
            <input
              style={s.newItemInput}
              placeholder="Username"
              value={newUserName}
              onChange={(e) => setNewUserName(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') addUser(); }}
            />
            <button style={s.newItemBtn} onClick={addUser}>Add</button>
          </div>
        )}
        {expandDMs && Object.keys(dmChannels).map((key) => (
          <div
            key={key}
            style={{
              ...s.channelItem,
              ...(isMobile ? s.channelItemMobile : {}),
              background: activeType === 'dm' && activeChannel === key ? 'rgba(255,255,255,0.1)' : 'transparent',
              color: activeType === 'dm' && activeChannel === key ? '#fff' : 'rgba(255,255,255,0.6)',
            }}
            onClick={() => handleChannelSelect(key, 'dm')}
          >
            <span style={{ ...s.presenceDot, background: dmChannels[key].online ? '#44b700' : '#777' }} />
            {dmChannels[key].name}
          </div>
        ))}
      </div>

      {/* Main Chat */}
      <div style={s.main}>
        {/* Channel Header */}
        <div style={isMobile ? { ...s.chatHeader, ...s.chatHeaderMobile } : s.chatHeader}>
          {isMobile && (
            <button
              style={s.hamburgerBtn}
              onClick={() => setSidebarOpen(true)}
              title="Open menu"
            >
              <span style={s.hamburgerLine} />
              <span style={s.hamburgerLine} />
              <span style={s.hamburgerLine} />
            </button>
          )}
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={isMobile ? { ...s.chatHeaderTitle, ...s.chatHeaderTitleMobile } : s.chatHeaderTitle}>{channelLabel}</div>
            {activeType === 'channel' && (
              <div style={isMobile ? { ...s.chatHeaderDesc, ...s.chatHeaderDescMobile } : s.chatHeaderDesc}>{activeData?.desc}</div>
            )}
          </div>
          <div style={s.memberCount}>
            {activeType === 'channel' ? (
              <span>{'\u{1F464}'} {isMobile ? users.length : users.length + ' members'}</span>
            ) : (
              <span style={{ color: dmChannels[activeChannel]?.online ? '#44b700' : '#777' }}>
                {dmChannels[activeChannel]?.online ? 'Online' : 'Offline'}
              </span>
            )}
          </div>
        </div>

        {/* Messages */}
        <div style={isMobile ? { ...s.messages, ...s.messagesMobile } : s.messages}>
          {activeMessages.length === 0 && (
            <div style={s.emptyState}>
              <div style={{ fontSize: isMobile ? 32 : 40, marginBottom: 10 }}>{activeType === 'channel' ? '#' : '\u{1F4AC}'}</div>
              <div style={{ fontSize: isMobile ? 16 : 18, fontWeight: 600, color: '#fff', marginBottom: 4 }}>
                {activeType === 'channel'
                  ? 'Welcome to #' + activeData?.name
                  : 'Start a conversation with ' + activeData?.name}
              </div>
              <div style={{ color: 'rgba(255,255,255,0.4)' }}>
                Send a message to get started
              </div>
            </div>
          )}
          {activeMessages.map((msg, idx) => {
            const showHeader = idx === 0 || activeMessages[idx - 1].user !== msg.user;
            return (
              <div key={msg.id} style={{ ...s.messageRow, marginTop: showHeader ? (isMobile ? 12 : 16) : 2 }}>
                {showHeader ? (
                  <div style={{
                    ...s.avatar,
                    ...(isMobile ? s.avatarMobile : {}),
                    background: getAvatarColor(msg.user),
                  }}>
                    {msg.user[0].toUpperCase()}
                  </div>
                ) : (
                  <div style={isMobile ? s.avatarSpacerMobile : s.avatarSpacer} />
                )}
                <div style={{ flex: 1, minWidth: 0 }}>
                  {showHeader && (
                    <div style={s.msgHeader}>
                      <span style={isMobile ? { ...s.msgUser, ...s.msgUserMobile } : s.msgUser}>{msg.user}</span>
                      <span style={isMobile ? { ...s.msgTime, ...s.msgTimeMobile } : s.msgTime}>{msg.time}</span>
                    </div>
                  )}
                  <div style={isMobile ? { ...s.msgText, ...s.msgTextMobile } : s.msgText}>{msg.text}</div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Emoji picker */}
        {showEmojis && (
          <div style={isMobile ? { ...s.emojiPicker, ...s.emojiPickerMobile } : s.emojiPicker}>
            {EMOJIS.map((emoji) => (
              <button key={emoji} style={isMobile ? { ...s.emojiBtn, ...s.emojiBtnMobile } : s.emojiBtn} onClick={() => setInput(input + emoji)}>
                {emoji}
              </button>
            ))}
          </div>
        )}

        {/* Input */}
        <div style={isMobile ? { ...s.inputArea, ...s.inputAreaMobile } : s.inputArea}>
          <div style={isMobile ? { ...s.inputBar, ...s.inputBarMobile } : s.inputBar}>
            <button
              style={s.emojiToggle}
              onClick={() => setShowEmojis(!showEmojis)}
            >
              {'\u{1F600}'}
            </button>
            <input
              style={isMobile ? { ...s.input, ...s.inputMobile } : s.input}
              type="text"
              placeholder={'Message ' + channelLabel}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(); }}
            />
            <button
              style={{
                ...s.sendBtn,
                ...(isMobile ? s.sendBtnMobile : {}),
                opacity: input.trim() ? 1 : 0.4,
              }}
              onClick={sendMessage}
            >
              {'\u27A4'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const s = {
  wrapper: {
    display: 'flex',
    height: '100vh',
    fontFamily: "'Segoe UI', Arial, sans-serif",
    overflow: 'hidden',
    position: 'relative',
  },
  // Sidebar
  sidebar: {
    width: 240,
    background: '#1a1035',
    borderRight: '1px solid rgba(255,255,255,0.06)',
    display: 'flex',
    flexDirection: 'column',
    overflowY: 'auto',
    flexShrink: 0,
  },
  sidebarHeader: {
    padding: '16px 14px',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  backLink: {
    color: 'rgba(255,255,255,0.5)',
    textDecoration: 'none',
    fontSize: 18,
    padding: '4px 8px',
    borderRadius: 4,
    display: 'flex',
    alignItems: 'center',
  },
  workspaceName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 700,
  },
  userStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  onlineDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    background: '#44b700',
    display: 'inline-block',
  },
  userSelect: {
    background: 'transparent',
    border: 'none',
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
    cursor: 'pointer',
    outline: 'none',
  },
  sectionHeader: {
    padding: '10px 14px 4px',
    fontSize: 12,
    fontWeight: 700,
    color: 'rgba(255,255,255,0.5)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    userSelect: 'none',
  },
  addBtn: {
    marginLeft: 'auto',
    background: 'none',
    border: 'none',
    color: 'rgba(255,255,255,0.5)',
    fontSize: 16,
    cursor: 'pointer',
    padding: '0 4px',
    borderRadius: 4,
  },
  channelItem: {
    padding: '5px 14px 5px 20px',
    fontSize: 14,
    cursor: 'pointer',
    borderRadius: 4,
    margin: '1px 6px',
    display: 'flex',
    alignItems: 'center',
    transition: 'background 0.15s',
  },
  channelItemMobile: {
    padding: '10px 14px 10px 20px',
    fontSize: 15,
  },
  presenceDot: {
    width: 8,
    height: 8,
    borderRadius: '50%',
    display: 'inline-block',
    marginRight: 8,
    flexShrink: 0,
  },
  newItemRow: {
    display: 'flex',
    gap: 4,
    padding: '4px 14px',
  },
  newItemInput: {
    flex: 1,
    padding: '4px 8px',
    fontSize: 12,
    background: 'rgba(255,255,255,0.1)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: 4,
    color: '#fff',
    outline: 'none',
  },
  newItemBtn: {
    padding: '4px 10px',
    fontSize: 11,
    background: '#4caf50',
    color: '#fff',
    border: 'none',
    borderRadius: 4,
    cursor: 'pointer',
  },
  closeSidebarBtn: {
    background: 'none',
    border: 'none',
    color: 'rgba(255,255,255,0.6)',
    fontSize: 20,
    cursor: 'pointer',
    padding: '4px 8px',
    borderRadius: 4,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  // Hamburger menu button
  hamburgerBtn: {
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 8,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 4,
    marginRight: 8,
    borderRadius: 6,
    flexShrink: 0,
  },
  hamburgerLine: {
    display: 'block',
    width: 20,
    height: 2,
    background: 'rgba(255,255,255,0.7)',
    borderRadius: 1,
  },
  // Main
  main: {
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    background: '#222244',
    minWidth: 0,
  },
  chatHeader: {
    padding: '12px 20px',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: 'rgba(255,255,255,0.03)',
  },
  chatHeaderMobile: {
    padding: '10px 12px',
    gap: 8,
  },
  chatHeaderTitle: {
    fontSize: 17,
    fontWeight: 700,
    color: '#fff',
  },
  chatHeaderTitleMobile: {
    fontSize: 16,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  chatHeaderDesc: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
    marginTop: 2,
  },
  chatHeaderDescMobile: {
    fontSize: 11,
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
  memberCount: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    flexShrink: 0,
  },
  // Messages
  messages: {
    flex: 1,
    overflowY: 'auto',
    padding: '8px 20px 20px',
  },
  messagesMobile: {
    padding: '8px 12px 16px',
  },
  emptyState: {
    textAlign: 'center',
    marginTop: 80,
    color: 'rgba(255,255,255,0.5)',
  },
  messageRow: {
    display: 'flex',
    gap: 10,
    padding: '2px 0',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 6,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#fff',
    fontWeight: 700,
    fontSize: 15,
    flexShrink: 0,
  },
  avatarMobile: {
    width: 32,
    height: 32,
    fontSize: 13,
    borderRadius: 5,
  },
  avatarSpacer: {
    width: 36,
    flexShrink: 0,
  },
  avatarSpacerMobile: {
    width: 32,
    flexShrink: 0,
  },
  msgHeader: {
    display: 'flex',
    alignItems: 'baseline',
    gap: 8,
  },
  msgUser: {
    fontWeight: 700,
    fontSize: 14,
    color: '#fff',
  },
  msgUserMobile: {
    fontSize: 14,
  },
  msgTime: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.3)',
  },
  msgTimeMobile: {
    fontSize: 10,
  },
  msgText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.8)',
    lineHeight: 1.5,
  },
  msgTextMobile: {
    fontSize: 15,
    lineHeight: 1.5,
    wordBreak: 'break-word',
  },
  // Emoji
  emojiPicker: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 2,
    padding: '8px 20px',
    background: 'rgba(255,255,255,0.04)',
    borderTop: '1px solid rgba(255,255,255,0.06)',
  },
  emojiPickerMobile: {
    padding: '8px 12px',
    gap: 4,
    justifyContent: 'center',
  },
  emojiBtn: {
    background: 'none',
    border: 'none',
    fontSize: 22,
    cursor: 'pointer',
    padding: 4,
    borderRadius: 4,
  },
  emojiBtnMobile: {
    fontSize: 26,
    padding: 6,
  },
  // Input
  inputArea: {
    padding: '10px 20px 16px',
  },
  inputAreaMobile: {
    padding: '8px 10px 12px',
  },
  inputBar: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    background: 'rgba(255,255,255,0.07)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: 10,
    padding: '4px 8px',
  },
  inputBarMobile: {
    padding: '6px 10px',
    borderRadius: 12,
    gap: 6,
  },
  emojiToggle: {
    background: 'none',
    border: 'none',
    fontSize: 20,
    cursor: 'pointer',
    padding: '4px',
  },
  input: {
    flex: 1,
    padding: '10px 4px',
    fontSize: 14,
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: '#fff',
  },
  inputMobile: {
    padding: '12px 4px',
    fontSize: 16,
  },
  sendBtn: {
    background: '#4caf50',
    border: 'none',
    color: '#fff',
    fontSize: 16,
    width: 34,
    height: 34,
    borderRadius: 8,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sendBtnMobile: {
    width: 40,
    height: 40,
    borderRadius: 10,
    fontSize: 18,
  },
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<ChatApp />);
