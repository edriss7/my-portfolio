const { useState, useCallback } = React;

var backLinkStyle = { color: '#8be9fd', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '20px' };
var containerStyle = { minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%)', color: '#e0e0e0', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", padding: '30px' };
var inputStyle = { background: '#1e1e3a', border: '1px solid #3a3a5c', borderRadius: '8px', color: '#e0e0e0', padding: '10px 14px', fontSize: '14px', width: '100%', boxSizing: 'border-box', outline: 'none' };
var btnStyle = { background: 'linear-gradient(135deg, #6c5ce7, #a29bfe)', border: 'none', borderRadius: '8px', color: '#fff', padding: '10px 20px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' };
var cardStyle = { background: 'rgba(30,30,58,0.8)', borderRadius: '12px', padding: '20px', marginBottom: '16px', border: '1px solid #2a2a4a' };

var barColors = ['#6c5ce7', '#00cec9', '#fd79a8', '#ffa502', '#2ed573', '#ff6b6b', '#a29bfe', '#fdcb6e'];

var defaultPolls = [
  { id: 1, question: 'What is your favorite programming language?', options: [
    { id: 1, text: 'JavaScript', votes: 42 }, { id: 2, text: 'Python', votes: 38 },
    { id: 3, text: 'TypeScript', votes: 35 }, { id: 4, text: 'Rust', votes: 22 }, { id: 5, text: 'Go', votes: 18 }
  ], voted: false },
  { id: 2, question: 'Best frontend framework in 2026?', options: [
    { id: 1, text: 'React', votes: 55 }, { id: 2, text: 'Vue', votes: 28 },
    { id: 3, text: 'Svelte', votes: 32 }, { id: 4, text: 'Angular', votes: 15 }
  ], voted: false },
  { id: 3, question: 'Preferred development environment?', options: [
    { id: 1, text: 'VS Code', votes: 60 }, { id: 2, text: 'JetBrains IDEs', votes: 25 },
    { id: 3, text: 'Vim/Neovim', votes: 20 }, { id: 4, text: 'Zed', votes: 12 }
  ], voted: false }
];

function App() {
  var _p = useState(defaultPolls), polls = _p[0], setPolls = _p[1];
  var _q = useState(''), newQ = _q[0], setNewQ = _q[1];
  var _o = useState(['', '', '']), newOpts = _o[0], setNewOpts = _o[1];
  var _s = useState(false), showCreate = _s[0], setShowCreate = _s[1];

  var totalAllVotes = polls.reduce(function(sum, p) {
    return sum + p.options.reduce(function(s, o) { return s + o.votes; }, 0);
  }, 0);

  var vote = useCallback(function(pollId, optId) {
    setPolls(function(prev) {
      return prev.map(function(p) {
        if (p.id !== pollId || p.voted) return p;
        return Object.assign({}, p, { voted: true, options: p.options.map(function(o) {
          return o.id === optId ? Object.assign({}, o, { votes: o.votes + 1 }) : o;
        })});
      });
    });
  }, []);

  var resetPoll = useCallback(function(pollId) {
    setPolls(function(prev) {
      return prev.map(function(p) {
        if (p.id !== pollId) return p;
        return Object.assign({}, p, { voted: false, options: p.options.map(function(o) { return Object.assign({}, o, { votes: 0 }); }) });
      });
    });
  }, []);

  var deletePoll = useCallback(function(pollId) {
    setPolls(function(prev) { return prev.filter(function(p) { return p.id !== pollId; }); });
  }, []);

  var updateOpt = function(idx, val) {
    var copy = newOpts.slice();
    copy[idx] = val;
    setNewOpts(copy);
  };

  var addOption = function() { setNewOpts(newOpts.concat([''])); };
  var removeOption = function(idx) {
    if (newOpts.length <= 2) return;
    setNewOpts(newOpts.filter(function(_, i) { return i !== idx; }));
  };

  var createPoll = function() {
    var validOpts = newOpts.filter(function(o) { return o.trim(); });
    if (!newQ.trim() || validOpts.length < 2) return;
    var poll = {
      id: Date.now(),
      question: newQ,
      options: validOpts.map(function(o, i) { return { id: i + 1, text: o, votes: 0 }; }),
      voted: false
    };
    setPolls(function(p) { return [poll].concat(p); });
    setNewQ(''); setNewOpts(['', '', '']); setShowCreate(false);
  };

  return React.createElement('div', { style: containerStyle },
    React.createElement('a', { href: '/projects', style: backLinkStyle }, '\u2190 Back to Projects'),
    React.createElement('h1', { style: { fontSize: '32px', fontWeight: '700', marginBottom: '8px', background: 'linear-gradient(90deg, #fd79a8, #a29bfe)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } }, 'Voting Polls'),
    React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' } },
      React.createElement('p', { style: { color: '#888', margin: 0 } }, polls.length + ' polls \u00b7 ' + totalAllVotes + ' total votes'),
      React.createElement('button', { style: btnStyle, onClick: function() { setShowCreate(!showCreate); } }, showCreate ? 'Cancel' : '+ Create Poll')
    ),

    showCreate && React.createElement('div', { style: Object.assign({}, cardStyle, { border: '1px solid #6c5ce7', marginBottom: '24px' }) },
      React.createElement('h3', { style: { margin: '0 0 16px 0', color: '#a29bfe' } }, 'Create New Poll'),
      React.createElement('input', { style: Object.assign({}, inputStyle, { marginBottom: '14px', fontSize: '16px' }), placeholder: 'Enter your question...', value: newQ, onChange: function(e) { setNewQ(e.target.value); } }),
      React.createElement('div', { style: { marginBottom: '14px' } },
        React.createElement('label', { style: { fontSize: '13px', color: '#888', display: 'block', marginBottom: '8px' } }, 'Options (minimum 2):'),
        newOpts.map(function(o, i) {
          return React.createElement('div', { key: i, style: { display: 'flex', gap: '8px', marginBottom: '8px', alignItems: 'center' } },
            React.createElement('div', { style: { width: '12px', height: '12px', borderRadius: '50%', background: barColors[i % barColors.length], flexShrink: 0 } }),
            React.createElement('input', { style: Object.assign({}, inputStyle, { flex: '1' }), placeholder: 'Option ' + (i + 1), value: o, onChange: function(e) { updateOpt(i, e.target.value); } }),
            newOpts.length > 2 && React.createElement('button', { style: { background: 'none', border: 'none', color: '#ff6b6b', cursor: 'pointer', fontSize: '18px', padding: '4px 8px' }, onClick: function() { removeOption(i); } }, '\u00d7')
          );
        })
      ),
      React.createElement('div', { style: { display: 'flex', gap: '10px' } },
        React.createElement('button', { style: Object.assign({}, btnStyle, { background: '#2a2a4a', fontSize: '13px' }), onClick: addOption }, '+ Add Option'),
        React.createElement('button', { style: btnStyle, onClick: createPoll }, 'Create Poll')
      )
    ),

    polls.map(function(poll) {
      var totalVotes = poll.options.reduce(function(s, o) { return s + o.votes; }, 0);
      var maxVotes = Math.max.apply(null, poll.options.map(function(o) { return o.votes; }));
      return React.createElement('div', { key: poll.id, style: cardStyle },
        React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' } },
          React.createElement('h2', { style: { margin: 0, fontSize: '20px', color: '#fff', flex: '1' } }, poll.question),
          React.createElement('div', { style: { display: 'flex', gap: '8px', flexShrink: 0 } },
            React.createElement('button', { style: { background: 'none', border: '1px solid #3a3a5c', borderRadius: '6px', color: '#888', cursor: 'pointer', padding: '4px 10px', fontSize: '12px' }, onClick: function() { resetPoll(poll.id); } }, 'Reset'),
            React.createElement('button', { style: { background: 'none', border: '1px solid #ff6b6b33', borderRadius: '6px', color: '#ff6b6b', cursor: 'pointer', padding: '4px 10px', fontSize: '12px' }, onClick: function() { deletePoll(poll.id); } }, 'Delete')
          )
        ),
        React.createElement('div', { style: { fontSize: '13px', color: '#888', marginBottom: '16px' } }, totalVotes + ' votes' + (poll.voted ? ' \u00b7 You voted!' : '')),

        poll.options.map(function(opt, i) {
          var pct = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
          var isMax = opt.votes === maxVotes && totalVotes > 0;
          return React.createElement('div', { key: opt.id, style: { marginBottom: '10px', cursor: poll.voted ? 'default' : 'pointer', position: 'relative' }, onClick: function() { if (!poll.voted) vote(poll.id, opt.id); } },
            React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '4px', alignItems: 'center' } },
              React.createElement('span', { style: { fontSize: '14px', color: isMax ? '#fff' : '#ccc', fontWeight: isMax ? '600' : '400' } }, opt.text),
              React.createElement('span', { style: { fontSize: '14px', color: barColors[i % barColors.length], fontWeight: '600' } }, pct + '% (' + opt.votes + ')')
            ),
            React.createElement('div', { style: { background: '#1a1a3a', borderRadius: '6px', height: '28px', overflow: 'hidden', position: 'relative' } },
              React.createElement('div', { style: { width: pct + '%', height: '100%', background: 'linear-gradient(90deg, ' + barColors[i % barColors.length] + ', ' + barColors[i % barColors.length] + '88)', borderRadius: '6px', transition: 'width 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)', minWidth: pct > 0 ? '4px' : '0' } }),
              !poll.voted && React.createElement('div', { style: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: '#666' } }, 'Click to vote')
            )
          );
        })
      );
    })
  );
}

var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
