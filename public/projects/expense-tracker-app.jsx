const { useState, useEffect, useRef } = React;

var categories = ['Food', 'Transport', 'Entertainment', 'Bills', 'Shopping', 'Other'];
var categoryColors = {
  Food: '#e74c3c',
  Transport: '#3498db',
  Entertainment: '#9b59b6',
  Bills: '#e67e22',
  Shopping: '#1abc9c',
  Other: '#95a5a6'
};

var initialTransactions = [
  { id: 1, description: 'Salary', amount: 3500, type: 'income', category: 'Other', date: '2026-02-01' },
  { id: 2, description: 'Grocery Shopping', amount: 85.50, type: 'expense', category: 'Food', date: '2026-02-03' },
  { id: 3, description: 'Bus Pass', amount: 45, type: 'expense', category: 'Transport', date: '2026-02-05' },
  { id: 4, description: 'Netflix Subscription', amount: 15.99, type: 'expense', category: 'Entertainment', date: '2026-02-06' },
  { id: 5, description: 'Freelance Project', amount: 800, type: 'income', category: 'Other', date: '2026-02-10' }
];

function App() {
  var _s1 = useState(initialTransactions);
  var transactions = _s1[0], setTransactions = _s1[1];
  var _s2 = useState('');
  var description = _s2[0], setDescription = _s2[1];
  var _s3 = useState('');
  var amount = _s3[0], setAmount = _s3[1];
  var _s4 = useState('expense');
  var type = _s4[0], setType = _s4[1];
  var _s5 = useState('Food');
  var category = _s5[0], setCategory = _s5[1];
  var nextId = useRef(6);

  var totalIncome = transactions.filter(function(t) { return t.type === 'income'; }).reduce(function(s, t) { return s + t.amount; }, 0);
  var totalExpenses = transactions.filter(function(t) { return t.type === 'expense'; }).reduce(function(s, t) { return s + t.amount; }, 0);
  var balance = totalIncome - totalExpenses;

  function addTransaction() {
    if (!description.trim() || !amount || Number(amount) <= 0) return;
    var newTx = {
      id: nextId.current++,
      description: description.trim(),
      amount: parseFloat(parseFloat(amount).toFixed(2)),
      type: type,
      category: category,
      date: new Date().toISOString().split('T')[0]
    };
    setTransactions(function(prev) { return [newTx].concat(prev); });
    setDescription('');
    setAmount('');
  }

  function deleteTransaction(id) {
    setTransactions(function(prev) { return prev.filter(function(t) { return t.id !== id; }); });
  }

  var maxBar = Math.max(totalIncome, totalExpenses, 1);

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
    content: { maxWidth: '700px', margin: '0 auto', padding: '0 20px' },
    balanceCard: {
      background: 'rgba(255,255,255,0.06)',
      borderRadius: '12px',
      padding: '25px',
      textAlign: 'center',
      marginBottom: '25px'
    },
    balanceLabel: { fontSize: '14px', color: '#aaa', marginBottom: '5px' },
    balanceAmount: { fontSize: '36px', fontWeight: 'bold' },
    summaryRow: { display: 'flex', gap: '15px', marginBottom: '25px' },
    summaryCard: {
      flex: 1,
      padding: '15px',
      borderRadius: '10px',
      textAlign: 'center'
    },
    summaryLabel: { fontSize: '13px', color: '#ccc', marginBottom: '4px' },
    summaryValue: { fontSize: '22px', fontWeight: 'bold' },
    barContainer: {
      background: 'rgba(255,255,255,0.06)',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '25px'
    },
    barRow: { display: 'flex', alignItems: 'center', marginBottom: '10px', gap: '10px' },
    barLabel: { width: '80px', fontSize: '13px', color: '#aaa' },
    barTrack: { flex: 1, height: '24px', background: 'rgba(255,255,255,0.05)', borderRadius: '12px', overflow: 'hidden' },
    barFill: { height: '100%', borderRadius: '12px', transition: 'width 0.5s ease' },
    barAmount: { width: '100px', textAlign: 'right', fontSize: '13px', fontWeight: '600' },
    form: {
      background: 'rgba(255,255,255,0.06)',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '25px'
    },
    formTitle: { fontSize: '16px', fontWeight: '600', marginBottom: '15px', color: '#fff' },
    formRow: { display: 'flex', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' },
    input: {
      flex: '1 1 200px',
      padding: '10px 14px',
      borderRadius: '8px',
      border: '1px solid rgba(255,255,255,0.15)',
      background: 'rgba(255,255,255,0.08)',
      color: '#fff',
      fontSize: '14px',
      outline: 'none'
    },
    select: {
      padding: '10px 14px',
      borderRadius: '8px',
      border: '1px solid rgba(255,255,255,0.15)',
      background: 'rgba(255,255,255,0.08)',
      color: '#fff',
      fontSize: '14px',
      outline: 'none'
    },
    typeToggle: {
      display: 'flex',
      gap: '5px',
      marginBottom: '10px'
    },
    typeBtn: {
      flex: 1,
      padding: '8px',
      borderRadius: '8px',
      border: '2px solid transparent',
      fontSize: '14px',
      cursor: 'pointer',
      fontWeight: '600',
      textAlign: 'center'
    },
    addBtn: {
      width: '100%',
      padding: '12px',
      borderRadius: '8px',
      border: 'none',
      background: 'linear-gradient(135deg, #9b59b6, #3498db)',
      color: '#fff',
      fontSize: '15px',
      cursor: 'pointer',
      fontWeight: '600',
      marginTop: '5px'
    },
    txList: {
      background: 'rgba(255,255,255,0.06)',
      borderRadius: '12px',
      padding: '20px'
    },
    txTitle: { fontSize: '16px', fontWeight: '600', marginBottom: '15px', color: '#fff' },
    txItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '12px',
      borderRadius: '8px',
      background: 'rgba(255,255,255,0.04)',
      marginBottom: '8px'
    },
    txInfo: { display: 'flex', flexDirection: 'column', flex: 1 },
    txDesc: { fontSize: '14px', color: '#fff', fontWeight: '500' },
    txMeta: { fontSize: '12px', color: '#888', marginTop: '3px' },
    txAmount: { fontSize: '16px', fontWeight: 'bold', marginRight: '10px' },
    txDelete: {
      background: 'none',
      border: 'none',
      color: '#e74c3c',
      fontSize: '16px',
      cursor: 'pointer',
      padding: '4px 8px'
    },
    catBadge: {
      display: 'inline-block',
      padding: '2px 8px',
      borderRadius: '10px',
      fontSize: '11px',
      marginLeft: '8px'
    }
  };

  return React.createElement('div', { style: styles.container },
    React.createElement('a', { href: '/projects', style: styles.backLink }, '\u2190 Back to Projects'),
    React.createElement('h1', { style: styles.header }, 'Expense Tracker'),
    React.createElement('div', { style: styles.content },
      React.createElement('div', { style: styles.balanceCard },
        React.createElement('div', { style: styles.balanceLabel }, 'Current Balance'),
        React.createElement('div', { style: Object.assign({}, styles.balanceAmount, { color: balance >= 0 ? '#2ecc71' : '#e74c3c' }) },
          '$' + balance.toFixed(2)
        )
      ),
      React.createElement('div', { style: styles.summaryRow },
        React.createElement('div', { style: Object.assign({}, styles.summaryCard, { background: 'rgba(46,204,113,0.15)' }) },
          React.createElement('div', { style: styles.summaryLabel }, 'Income'),
          React.createElement('div', { style: Object.assign({}, styles.summaryValue, { color: '#2ecc71' }) }, '$' + totalIncome.toFixed(2))
        ),
        React.createElement('div', { style: Object.assign({}, styles.summaryCard, { background: 'rgba(231,76,60,0.15)' }) },
          React.createElement('div', { style: styles.summaryLabel }, 'Expenses'),
          React.createElement('div', { style: Object.assign({}, styles.summaryValue, { color: '#e74c3c' }) }, '$' + totalExpenses.toFixed(2))
        )
      ),
      React.createElement('div', { style: styles.barContainer },
        React.createElement('div', { style: { fontSize: '14px', fontWeight: '600', color: '#fff', marginBottom: '12px' } }, 'Income vs Expenses'),
        React.createElement('div', { style: styles.barRow },
          React.createElement('div', { style: styles.barLabel }, 'Income'),
          React.createElement('div', { style: styles.barTrack },
            React.createElement('div', { style: Object.assign({}, styles.barFill, { width: (totalIncome / maxBar * 100) + '%', background: '#2ecc71' }) })
          ),
          React.createElement('div', { style: Object.assign({}, styles.barAmount, { color: '#2ecc71' }) }, '$' + totalIncome.toFixed(2))
        ),
        React.createElement('div', { style: styles.barRow },
          React.createElement('div', { style: styles.barLabel }, 'Expenses'),
          React.createElement('div', { style: styles.barTrack },
            React.createElement('div', { style: Object.assign({}, styles.barFill, { width: (totalExpenses / maxBar * 100) + '%', background: '#e74c3c' }) })
          ),
          React.createElement('div', { style: Object.assign({}, styles.barAmount, { color: '#e74c3c' }) }, '$' + totalExpenses.toFixed(2))
        )
      ),
      React.createElement('div', { style: styles.form },
        React.createElement('div', { style: styles.formTitle }, 'Add Transaction'),
        React.createElement('div', { style: styles.typeToggle },
          React.createElement('button', {
            style: Object.assign({}, styles.typeBtn, {
              background: type === 'income' ? 'rgba(46,204,113,0.25)' : 'rgba(255,255,255,0.05)',
              borderColor: type === 'income' ? '#2ecc71' : 'transparent',
              color: type === 'income' ? '#2ecc71' : '#888'
            }),
            onClick: function() { setType('income'); }
          }, '+ Income'),
          React.createElement('button', {
            style: Object.assign({}, styles.typeBtn, {
              background: type === 'expense' ? 'rgba(231,76,60,0.25)' : 'rgba(255,255,255,0.05)',
              borderColor: type === 'expense' ? '#e74c3c' : 'transparent',
              color: type === 'expense' ? '#e74c3c' : '#888'
            }),
            onClick: function() { setType('expense'); }
          }, '- Expense')
        ),
        React.createElement('div', { style: styles.formRow },
          React.createElement('input', {
            style: styles.input,
            placeholder: 'Description',
            value: description,
            onChange: function(e) { setDescription(e.target.value); }
          }),
          React.createElement('input', {
            style: Object.assign({}, styles.input, { flex: '0 1 120px' }),
            type: 'number',
            placeholder: 'Amount',
            min: '0',
            step: '0.01',
            value: amount,
            onChange: function(e) { setAmount(e.target.value); }
          })
        ),
        React.createElement('div', { style: styles.formRow },
          React.createElement('select', {
            style: Object.assign({}, styles.select, { flex: 1 }),
            value: category,
            onChange: function(e) { setCategory(e.target.value); }
          },
            categories.map(function(cat) {
              return React.createElement('option', { key: cat, value: cat }, cat);
            })
          )
        ),
        React.createElement('button', {
          style: styles.addBtn,
          onClick: addTransaction
        }, 'Add Transaction')
      ),
      React.createElement('div', { style: styles.txList },
        React.createElement('div', { style: styles.txTitle }, 'Transactions (' + transactions.length + ')'),
        transactions.length === 0
          ? React.createElement('div', { style: { textAlign: 'center', color: '#666', padding: '20px' } }, 'No transactions yet')
          : transactions.map(function(tx) {
            return React.createElement('div', { key: tx.id, style: styles.txItem },
              React.createElement('div', { style: styles.txInfo },
                React.createElement('div', { style: styles.txDesc },
                  tx.description,
                  React.createElement('span', {
                    style: Object.assign({}, styles.catBadge, {
                      background: (categoryColors[tx.category] || '#888') + '33',
                      color: categoryColors[tx.category] || '#888'
                    })
                  }, tx.category)
                ),
                React.createElement('div', { style: styles.txMeta }, tx.date)
              ),
              React.createElement('div', {
                style: Object.assign({}, styles.txAmount, {
                  color: tx.type === 'income' ? '#2ecc71' : '#e74c3c'
                })
              }, (tx.type === 'income' ? '+' : '-') + '$' + tx.amount.toFixed(2)),
              React.createElement('button', {
                style: styles.txDelete,
                onClick: function() { deleteTransaction(tx.id); }
              }, '\u2715')
            );
          })
      )
    )
  );
}

var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
