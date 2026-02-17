const { useState, useCallback, useMemo } = React;

const MOCK_BLOCKS = [
  { id: 6, hash: '0x7f3a...e8b1', prevHash: '0x4c2d...a9f3', timestamp: '2026-02-17 14:32:01', nonce: 84729, miner: '0xAb5...F3e', txCount: 5, gasUsed: '12,450,000' },
  { id: 5, hash: '0x4c2d...a9f3', prevHash: '0x9e1b...c7d4', timestamp: '2026-02-17 14:31:48', nonce: 62184, miner: '0x8cD...21a', txCount: 3, gasUsed: '8,230,000' },
  { id: 4, hash: '0x9e1b...c7d4', prevHash: '0x2f8a...b5e6', timestamp: '2026-02-17 14:31:35', nonce: 93471, miner: '0x3Ef...9b7', txCount: 7, gasUsed: '18,900,000' },
  { id: 3, hash: '0x2f8a...b5e6', prevHash: '0x6d4c...f2a8', timestamp: '2026-02-17 14:31:20', nonce: 15638, miner: '0xAb5...F3e', txCount: 2, gasUsed: '5,120,000' },
  { id: 2, hash: '0x6d4c...f2a8', prevHash: '0x1a9e...d3c7', timestamp: '2026-02-17 14:31:05', nonce: 47852, miner: '0x7Bc...4d2', txCount: 4, gasUsed: '10,780,000' },
  { id: 1, hash: '0x1a9e...d3c7', prevHash: '0x0000...0000', timestamp: '2026-02-17 14:30:50', nonce: 71293, miner: '0x8cD...21a', txCount: 1, gasUsed: '2,100,000' },
];

const MOCK_TXS = [
  { hash: '0xabc1...def1', blockId: 6, from: '0xAb5c...F3eD', to: '0x8cDe...21aB', amount: '2.450', fee: '0.0021', status: 'confirmed' },
  { hash: '0xabc2...def2', blockId: 6, from: '0x3Ef1...9b7C', to: '0x7Bc8...4d2E', amount: '0.780', fee: '0.0018', status: 'confirmed' },
  { hash: '0xabc3...def3', blockId: 6, from: '0x7Bc8...4d2E', to: '0xAb5c...F3eD', amount: '15.200', fee: '0.0032', status: 'confirmed' },
  { hash: '0xabc4...def4', blockId: 5, from: '0x8cDe...21aB', to: '0x3Ef1...9b7C', amount: '1.100', fee: '0.0015', status: 'confirmed' },
  { hash: '0xabc5...def5', blockId: 5, from: '0xAb5c...F3eD', to: '0x8cDe...21aB', amount: '0.330', fee: '0.0012', status: 'confirmed' },
  { hash: '0xabc6...def6', blockId: 4, from: '0x3Ef1...9b7C', to: '0x7Bc8...4d2E', amount: '5.670', fee: '0.0025', status: 'confirmed' },
  { hash: '0xabc7...def7', blockId: 4, from: '0x7Bc8...4d2E', to: '0xAb5c...F3eD', amount: '0.990', fee: '0.0019', status: 'confirmed' },
  { hash: '0xabc8...def8', blockId: 3, from: '0x8cDe...21aB', to: '0x3Ef1...9b7C', amount: '8.420', fee: '0.0028', status: 'confirmed' },
  { hash: '0xabc9...def9', blockId: 2, from: '0xAb5c...F3eD', to: '0x7Bc8...4d2E', amount: '3.150', fee: '0.0022', status: 'confirmed' },
  { hash: '0xabca...defa', blockId: 1, from: '0x0000...0000', to: '0x8cDe...21aB', amount: '50.000', fee: '0.0000', status: 'confirmed' },
];

var backLinkStyle = { color: '#8be9fd', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '16px' };
var containerStyle = { minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%)', color: '#e0e0e0', fontFamily: "'Segoe UI', Tahoma, sans-serif", padding: '24px' };
var cardStyle = { background: 'rgba(255,255,255,0.06)', borderRadius: '12px', padding: '16px', border: '1px solid rgba(255,255,255,0.1)' };
var inputStyle = { background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#fff', padding: '10px 14px', fontSize: '14px', width: '100%', boxSizing: 'border-box' };

function App() {
  var _s = useState(''), search = _s[0], setSearch = _s[1];
  var _m = useState(null), modal = _m[0], setModal = _m[1];
  var _t = useState('blocks'), tab = _t[0], setTab = _t[1];

  var filteredBlocks = useMemo(function() {
    if (!search) return MOCK_BLOCKS;
    var s = search.toLowerCase();
    return MOCK_BLOCKS.filter(function(b) { return b.hash.toLowerCase().includes(s) || String(b.id).includes(s); });
  }, [search]);

  var filteredTxs = useMemo(function() {
    if (!search) return MOCK_TXS;
    var s = search.toLowerCase();
    return MOCK_TXS.filter(function(t) { return t.hash.toLowerCase().includes(s) || t.from.toLowerCase().includes(s) || t.to.toLowerCase().includes(s); });
  }, [search]);

  var blockChainViz = React.createElement('div', { style: { display: 'flex', alignItems: 'center', overflowX: 'auto', padding: '20px 0', gap: '0px' } },
    MOCK_BLOCKS.slice().reverse().map(function(block, i) {
      return React.createElement(React.Fragment, { key: block.id },
        React.createElement('div', {
          onClick: function() { setModal(block); },
          style: { minWidth: '130px', background: 'linear-gradient(135deg, #1e3a5f, #2a1a4e)', borderRadius: '10px', padding: '12px', cursor: 'pointer', border: '1px solid #4a9eff55', textAlign: 'center', transition: 'transform 0.2s', flex: '0 0 auto' }
        },
          React.createElement('div', { style: { fontSize: '11px', color: '#4a9eff', fontWeight: 'bold' } }, 'Block #' + block.id),
          React.createElement('div', { style: { fontSize: '10px', color: '#8be9fd', marginTop: '6px', fontFamily: 'monospace' } }, block.hash),
          React.createElement('div', { style: { fontSize: '10px', color: '#aaa', marginTop: '4px' } }, block.txCount + ' txns')
        ),
        i < MOCK_BLOCKS.length - 1 ? React.createElement('div', { style: { color: '#4a9eff', fontSize: '20px', padding: '0 6px', flex: '0 0 auto' } }, '\u2192') : null
      );
    })
  );

  var networkStats = React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', marginBottom: '20px' } },
    [['Latest Block', '#6'], ['Total Txns', '22'], ['Gas Price', '25 Gwei'], ['Network', 'Mainnet']].map(function(s) {
      return React.createElement('div', { key: s[0], style: Object.assign({}, cardStyle, { textAlign: 'center' }) },
        React.createElement('div', { style: { fontSize: '12px', color: '#888' } }, s[0]),
        React.createElement('div', { style: { fontSize: '20px', fontWeight: 'bold', color: '#4a9eff', marginTop: '4px' } }, s[1])
      );
    })
  );

  var tabBtn = function(name, label) {
    return React.createElement('button', {
      onClick: function() { setTab(name); },
      style: { padding: '8px 20px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px', background: tab === name ? '#4a9eff' : 'rgba(255,255,255,0.08)', color: tab === name ? '#fff' : '#aaa' }
    }, label);
  };

  var blocksTable = React.createElement('div', { style: { overflowX: 'auto' } },
    React.createElement('table', { style: { width: '100%', borderCollapse: 'collapse', fontSize: '13px' } },
      React.createElement('thead', null,
        React.createElement('tr', { style: { borderBottom: '1px solid rgba(255,255,255,0.1)' } },
          ['Block', 'Hash', 'Miner', 'Txns', 'Gas Used', 'Time'].map(function(h) {
            return React.createElement('th', { key: h, style: { padding: '10px', textAlign: 'left', color: '#888', fontWeight: '600' } }, h);
          })
        )
      ),
      React.createElement('tbody', null,
        filteredBlocks.map(function(b) {
          return React.createElement('tr', { key: b.id, onClick: function() { setModal(b); }, style: { borderBottom: '1px solid rgba(255,255,255,0.05)', cursor: 'pointer' } },
            React.createElement('td', { style: { padding: '10px', color: '#4a9eff', fontWeight: 'bold' } }, '#' + b.id),
            React.createElement('td', { style: { padding: '10px', fontFamily: 'monospace', color: '#8be9fd', fontSize: '12px' } }, b.hash),
            React.createElement('td', { style: { padding: '10px', fontFamily: 'monospace', fontSize: '12px' } }, b.miner),
            React.createElement('td', { style: { padding: '10px' } }, b.txCount),
            React.createElement('td', { style: { padding: '10px', fontSize: '12px' } }, b.gasUsed),
            React.createElement('td', { style: { padding: '10px', fontSize: '12px', color: '#aaa' } }, b.timestamp.split(' ')[1])
          );
        })
      )
    )
  );

  var txsTable = React.createElement('div', { style: { overflowX: 'auto' } },
    React.createElement('table', { style: { width: '100%', borderCollapse: 'collapse', fontSize: '13px' } },
      React.createElement('thead', null,
        React.createElement('tr', { style: { borderBottom: '1px solid rgba(255,255,255,0.1)' } },
          ['Tx Hash', 'Block', 'From', 'To', 'Amount (ETH)', 'Fee', 'Status'].map(function(h) {
            return React.createElement('th', { key: h, style: { padding: '10px', textAlign: 'left', color: '#888', fontWeight: '600' } }, h);
          })
        )
      ),
      React.createElement('tbody', null,
        filteredTxs.map(function(t) {
          return React.createElement('tr', { key: t.hash, style: { borderBottom: '1px solid rgba(255,255,255,0.05)' } },
            React.createElement('td', { style: { padding: '10px', fontFamily: 'monospace', color: '#8be9fd', fontSize: '12px' } }, t.hash),
            React.createElement('td', { style: { padding: '10px', color: '#4a9eff' } }, '#' + t.blockId),
            React.createElement('td', { style: { padding: '10px', fontFamily: 'monospace', fontSize: '11px' } }, t.from),
            React.createElement('td', { style: { padding: '10px', fontFamily: 'monospace', fontSize: '11px' } }, t.to),
            React.createElement('td', { style: { padding: '10px', fontWeight: 'bold', color: '#50fa7b' } }, t.amount),
            React.createElement('td', { style: { padding: '10px', fontSize: '12px', color: '#aaa' } }, t.fee),
            React.createElement('td', { style: { padding: '10px' } },
              React.createElement('span', { style: { background: '#50fa7b22', color: '#50fa7b', padding: '3px 10px', borderRadius: '12px', fontSize: '11px' } }, t.status)
            )
          );
        })
      )
    )
  );

  var modalOverlay = modal ? React.createElement('div', {
    onClick: function() { setModal(null); },
    style: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }
  },
    React.createElement('div', {
      onClick: function(e) { e.stopPropagation(); },
      style: { background: 'linear-gradient(135deg, #1a1a3e, #0a0a1a)', borderRadius: '16px', padding: '28px', maxWidth: '500px', width: '90%', border: '1px solid rgba(74,158,255,0.3)' }
    },
      React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' } },
        React.createElement('h3', { style: { margin: 0, color: '#4a9eff' } }, 'Block #' + modal.id + ' Details'),
        React.createElement('button', { onClick: function() { setModal(null); }, style: { background: 'none', border: 'none', color: '#ff5555', fontSize: '20px', cursor: 'pointer' } }, '\u2715')
      ),
      [['Hash', modal.hash], ['Previous Hash', modal.prevHash], ['Timestamp', modal.timestamp], ['Nonce', modal.nonce], ['Miner', modal.miner], ['Transactions', modal.txCount], ['Gas Used', modal.gasUsed]].map(function(r) {
        return React.createElement('div', { key: r[0], style: { display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.05)' } },
          React.createElement('span', { style: { color: '#888', fontSize: '13px' } }, r[0]),
          React.createElement('span', { style: { fontFamily: 'monospace', fontSize: '13px', color: '#8be9fd' } }, String(r[1]))
        );
      }),
      React.createElement('div', { style: { marginTop: '16px' } },
        React.createElement('h4', { style: { color: '#aaa', fontSize: '13px', marginBottom: '8px' } }, 'Block Transactions'),
        MOCK_TXS.filter(function(t) { return t.blockId === modal.id; }).map(function(t) {
          return React.createElement('div', { key: t.hash, style: { background: 'rgba(255,255,255,0.04)', borderRadius: '8px', padding: '8px', marginBottom: '6px', fontSize: '12px' } },
            React.createElement('div', { style: { color: '#8be9fd', fontFamily: 'monospace' } }, t.hash),
            React.createElement('div', { style: { color: '#50fa7b', marginTop: '4px' } }, t.amount + ' ETH')
          );
        })
      )
    )
  ) : null;

  return React.createElement('div', { style: containerStyle },
    React.createElement('a', { href: '/projects', style: backLinkStyle }, '\u2190 Back to Projects'),
    React.createElement('h1', { style: { fontSize: '28px', fontWeight: 'bold', marginBottom: '6px', background: 'linear-gradient(90deg, #4a9eff, #8be9fd)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } }, 'Blockchain Explorer'),
    React.createElement('p', { style: { color: '#888', marginBottom: '20px', fontSize: '14px' } }, 'Explore blocks, transactions, and network activity'),
    networkStats,
    React.createElement('div', { style: Object.assign({}, cardStyle, { marginBottom: '20px' }) },
      React.createElement('h3', { style: { margin: '0 0 12px 0', fontSize: '15px', color: '#aaa' } }, 'Block Chain Visualization'),
      blockChainViz
    ),
    React.createElement('div', { style: { marginBottom: '16px' } },
      React.createElement('input', { type: 'text', placeholder: 'Search by block number, hash, or address...', value: search, onChange: function(e) { setSearch(e.target.value); }, style: Object.assign({}, inputStyle, { maxWidth: '450px' }) })
    ),
    React.createElement('div', { style: { display: 'flex', gap: '8px', marginBottom: '16px' } },
      tabBtn('blocks', 'Blocks'),
      tabBtn('transactions', 'Transactions')
    ),
    React.createElement('div', { style: cardStyle },
      tab === 'blocks' ? blocksTable : txsTable
    ),
    modalOverlay
  );
}

var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
