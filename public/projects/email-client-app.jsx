const { useState, useCallback, useMemo } = React;

var backLinkStyle = { color: '#8be9fd', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '16px' };
var baseStyle = { minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%)', color: '#e0e0e0', fontFamily: "'Segoe UI', sans-serif", display: 'flex', flexDirection: 'column' };
var inputStyle = { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', padding: '8px 12px', color: '#e0e0e0', fontSize: '14px', width: '100%', boxSizing: 'border-box', marginBottom: '10px' };
var btnStyle = function (c) { return { background: c || '#8be9fd', color: '#0a0a1a', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }; };

var mockEmails = [
  { id: 1, from: 'Sarah Chen', to: 'me@example.com', subject: 'Q1 Report Ready for Review', body: 'Hi,\n\nThe Q1 financial report is ready for your review. Key highlights include a 15% increase in revenue and improved customer retention rates.\n\nPlease review and let me know your thoughts by Friday.\n\nBest,\nSarah', date: 'Feb 17', folder: 'inbox', starred: true, read: true },
  { id: 2, from: 'DevOps Team', to: 'me@example.com', subject: 'Server Migration Scheduled', body: 'Team,\n\nWe will be migrating the production servers this weekend (Feb 21-22). Expected downtime is 2-4 hours.\n\nPlease ensure all pending deployments are completed before Friday EOD.\n\nThanks,\nDevOps', date: 'Feb 16', folder: 'inbox', starred: false, read: false },
  { id: 3, from: 'Alex Rivera', to: 'me@example.com', subject: 'Design Review Meeting', body: 'Hey,\n\nCan we schedule a design review for the new dashboard? I have mockups ready.\n\nLet me know your availability this week.\n\nCheers,\nAlex', date: 'Feb 16', folder: 'inbox', starred: false, read: false },
  { id: 4, from: 'Newsletter', to: 'me@example.com', subject: 'Weekly Tech Digest', body: 'This week in tech:\n\n- AI breakthroughs in code generation\n- New React 20 features announced\n- Cloud computing trends for 2026\n\nRead more on our website.', date: 'Feb 15', folder: 'inbox', starred: false, read: true },
  { id: 5, from: 'me@example.com', to: 'team@example.com', subject: 'Sprint Planning Notes', body: 'Team,\n\nHere are the notes from today\'s sprint planning:\n\n1. Complete API refactoring\n2. Fix dashboard performance\n3. Add export functionality\n\nLet me know if I missed anything.', date: 'Feb 14', folder: 'sent', starred: false, read: true },
  { id: 6, from: 'me@example.com', to: 'sarah@example.com', subject: 'Re: Q1 Report', body: 'Hi Sarah,\n\nGreat work on the report. I have a few suggestions:\n\n- Add a comparison with Q4\n- Include projected Q2 targets\n\nThanks!', date: 'Feb 14', folder: 'sent', starred: false, read: true },
  { id: 7, from: 'me@example.com', to: 'hr@example.com', subject: 'Draft: Vacation Request', body: 'Hi HR,\n\nI would like to request PTO for March 10-14.\n\nPlease let me know if this needs approval.\n\nThanks', date: 'Feb 13', folder: 'drafts', starred: false, read: true },
];

function App() {
  var _s1 = useState(mockEmails), emails = _s1[0], setEmails = _s1[1];
  var _s2 = useState('inbox'), folder = _s2[0], setFolder = _s2[1];
  var _s3 = useState(null), selected = _s3[0], setSelected = _s3[1];
  var _s4 = useState(false), composing = _s4[0], setComposing = _s4[1];
  var _s5 = useState({ to: '', subject: '', body: '' }), draft = _s5[0], setDraft = _s5[1];

  var folders = useMemo(function () {
    var counts = { inbox: 0, sent: 0, drafts: 0, trash: 0 };
    emails.forEach(function (e) { counts[e.folder] = (counts[e.folder] || 0) + 1; });
    return [
      { key: 'inbox', label: 'Inbox', icon: '\uD83D\uDCE5', count: counts.inbox },
      { key: 'sent', label: 'Sent', icon: '\uD83D\uDCE4', count: counts.sent },
      { key: 'drafts', label: 'Drafts', icon: '\uD83D\uDCC4', count: counts.drafts },
      { key: 'trash', label: 'Trash', icon: '\uD83D\uDDD1', count: counts.trash }
    ];
  }, [emails]);

  var filteredEmails = useMemo(function () {
    return emails.filter(function (e) { return e.folder === folder; });
  }, [emails, folder]);

  var unreadCount = useMemo(function () {
    return emails.filter(function (e) { return e.folder === 'inbox' && !e.read; }).length;
  }, [emails]);

  var toggleStar = useCallback(function (id, ev) {
    ev.stopPropagation();
    setEmails(function (prev) { return prev.map(function (e) { return e.id === id ? Object.assign({}, e, { starred: !e.starred }) : e; }); });
  }, []);

  var toggleRead = useCallback(function (id) {
    setEmails(function (prev) { return prev.map(function (e) { return e.id === id ? Object.assign({}, e, { read: !e.read }) : e; }); });
  }, []);

  var deleteEmail = useCallback(function (id) {
    setEmails(function (prev) { return prev.map(function (e) { return e.id === id ? Object.assign({}, e, { folder: 'trash' }) : e; }); });
    setSelected(null);
  }, []);

  var selectEmail = useCallback(function (email) {
    setSelected(email);
    setComposing(false);
    if (!email.read) {
      setEmails(function (prev) { return prev.map(function (e) { return e.id === email.id ? Object.assign({}, e, { read: true }) : e; }); });
    }
  }, []);

  var sendEmail = useCallback(function () {
    if (!draft.to.trim() || !draft.subject.trim()) return;
    var newEmail = { id: Date.now(), from: 'me@example.com', to: draft.to, subject: draft.subject, body: draft.body, date: 'Feb 17', folder: 'sent', starred: false, read: true };
    setEmails(function (prev) { return [newEmail].concat(prev); });
    setDraft({ to: '', subject: '', body: '' });
    setComposing(false);
  }, [draft]);

  var sidebarStyle = { width: '200px', background: 'rgba(255,255,255,0.05)', borderRight: '1px solid rgba(255,255,255,0.1)', padding: '16px 0', flexShrink: 0 };

  return React.createElement('div', { style: baseStyle },
    React.createElement('div', { style: { padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', gap: '20px' } },
      React.createElement('a', { href: '/projects', style: backLinkStyle }, '\u2190 Back to Projects'),
      React.createElement('h2', { style: { margin: 0, color: '#8be9fd', flex: 1 } }, 'Email Client'),
      unreadCount > 0 && React.createElement('span', { style: { background: '#ff5555', color: '#fff', borderRadius: '12px', padding: '2px 10px', fontSize: '12px', fontWeight: 'bold' } }, unreadCount + ' unread'),
      React.createElement('button', { style: btnStyle('#50fa7b'), onClick: function () { setComposing(true); setSelected(null); } }, 'Compose')
    ),
    React.createElement('div', { style: { display: 'flex', flex: 1, overflow: 'hidden' } },
      React.createElement('div', { style: sidebarStyle },
        folders.map(function (f) {
          return React.createElement('div', { key: f.key, onClick: function () { setFolder(f.key); setSelected(null); }, style: { padding: '10px 16px', cursor: 'pointer', background: folder === f.key ? 'rgba(139,233,253,0.15)' : 'transparent', borderLeft: folder === f.key ? '3px solid #8be9fd' : '3px solid transparent', display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px', color: folder === f.key ? '#8be9fd' : '#ccc' } },
            React.createElement('span', null, f.icon),
            React.createElement('span', { style: { flex: 1 } }, f.label),
            f.count > 0 && React.createElement('span', { style: { background: 'rgba(255,255,255,0.15)', borderRadius: '10px', padding: '1px 8px', fontSize: '11px' } }, f.count)
          );
        })
      ),
      React.createElement('div', { style: { width: '320px', borderRight: '1px solid rgba(255,255,255,0.1)', overflowY: 'auto', flexShrink: 0 } },
        filteredEmails.length === 0 && React.createElement('div', { style: { padding: '40px 20px', textAlign: 'center', color: '#666' } }, 'No emails in this folder'),
        filteredEmails.map(function (email) {
          var isActive = selected && selected.id === email.id;
          return React.createElement('div', { key: email.id, onClick: function () { selectEmail(email); }, style: { padding: '12px 16px', cursor: 'pointer', background: isActive ? 'rgba(139,233,253,0.1)' : !email.read ? 'rgba(255,255,255,0.04)' : 'transparent', borderBottom: '1px solid rgba(255,255,255,0.05)', borderLeft: isActive ? '3px solid #8be9fd' : '3px solid transparent' } },
            React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' } },
              React.createElement('span', { onClick: function (ev) { toggleStar(email.id, ev); }, style: { cursor: 'pointer', fontSize: '14px' } }, email.starred ? '\u2605' : '\u2606'),
              React.createElement('span', { style: { fontWeight: email.read ? 'normal' : 'bold', fontSize: '13px', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, folder === 'sent' ? 'To: ' + email.to : email.from),
              React.createElement('span', { style: { fontSize: '11px', color: '#888' } }, email.date)
            ),
            React.createElement('div', { style: { fontSize: '13px', fontWeight: email.read ? 'normal' : 'bold', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginBottom: '2px' } }, email.subject),
            React.createElement('div', { style: { fontSize: '12px', color: '#777', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, email.body.substring(0, 60) + '...')
          );
        })
      ),
      React.createElement('div', { style: { flex: 1, overflowY: 'auto', padding: '24px' } },
        composing ? React.createElement('div', null,
          React.createElement('h3', { style: { color: '#8be9fd', marginTop: 0 } }, 'New Email'),
          React.createElement('input', { style: inputStyle, placeholder: 'To', value: draft.to, onChange: function (e) { setDraft(Object.assign({}, draft, { to: e.target.value })); } }),
          React.createElement('input', { style: inputStyle, placeholder: 'Subject', value: draft.subject, onChange: function (e) { setDraft(Object.assign({}, draft, { subject: e.target.value })); } }),
          React.createElement('textarea', { style: Object.assign({}, inputStyle, { minHeight: '200px', resize: 'vertical' }), placeholder: 'Write your email...', value: draft.body, onChange: function (e) { setDraft(Object.assign({}, draft, { body: e.target.value })); } }),
          React.createElement('div', { style: { display: 'flex', gap: '8px' } },
            React.createElement('button', { style: btnStyle('#50fa7b'), onClick: sendEmail }, 'Send'),
            React.createElement('button', { style: btnStyle('#ff5555'), onClick: function () { setComposing(false); } }, 'Discard')
          )
        ) : selected ? React.createElement('div', null,
          React.createElement('div', { style: { display: 'flex', gap: '8px', marginBottom: '20px' } },
            React.createElement('button', { style: btnStyle('#bd93f9'), onClick: function () { toggleRead(selected.id); } }, selected.read ? 'Mark Unread' : 'Mark Read'),
            React.createElement('button', { style: btnStyle('#ff5555'), onClick: function () { deleteEmail(selected.id); } }, 'Delete'),
            React.createElement('button', { style: btnStyle('#ffb86c'), onClick: function () { setComposing(true); setDraft({ to: selected.from === 'me@example.com' ? selected.to : selected.from, subject: 'Re: ' + selected.subject, body: '' }); } }, 'Reply')
          ),
          React.createElement('h2', { style: { margin: '0 0 8px', color: '#fff' } }, selected.subject),
          React.createElement('div', { style: { fontSize: '13px', color: '#999', marginBottom: '4px' } }, 'From: ' + selected.from),
          React.createElement('div', { style: { fontSize: '13px', color: '#999', marginBottom: '4px' } }, 'To: ' + selected.to),
          React.createElement('div', { style: { fontSize: '13px', color: '#999', marginBottom: '20px' } }, 'Date: ' + selected.date),
          React.createElement('div', { style: { background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '20px', whiteSpace: 'pre-wrap', lineHeight: '1.6', fontSize: '14px' } }, selected.body)
        ) : React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#555', fontSize: '16px' } }, 'Select an email to read')
      )
    )
  );
}

var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
