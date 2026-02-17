const { useState, useEffect, useCallback } = React;

var backLinkStyle = { color: '#7b8cff', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '20px' };
var containerStyle = { minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%)', color: '#e0e0e0', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", padding: '30px' };
var panelStyle = { background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '20px', border: '1px solid rgba(255,255,255,0.08)' };
var labelStyle = { fontSize: '12px', color: '#9ca3af', marginBottom: '6px', display: 'block', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' };
var btnStyle = { padding: '10px 20px', background: '#7b8cff', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '600', cursor: 'pointer' };

var mockCSV = [
  ['age', 'income', 'education', 'purchased'],
  ['25', '35000', '12', '0'], ['30', '55000', '16', '1'], ['35', '72000', '18', '1'],
  ['22', '28000', '12', '0'], ['45', '92000', '20', '1'], ['28', '41000', '14', '0'],
  ['52', '105000', '22', '1'], ['33', '63000', '16', '1'], ['40', '85000', '18', '1'],
  ['27', '32000', '12', '0'], ['38', '78000', '16', '1'], ['24', '30000', '14', '0']
];
var models = ['Linear Regression', 'Decision Tree', 'Random Forest', 'Neural Network', 'SVM', 'K-Nearest Neighbors'];
var confMatrix = [[42, 8], [5, 45]];

function App() {
  var s1 = useState(false), dataLoaded = s1[0], setDataLoaded = s1[1];
  var s2 = useState('Neural Network'), selectedModel = s2[0], setSelectedModel = s2[1];
  var s3 = useState(false), training = s3[0], setTraining = s3[1];
  var s4 = useState(0), epoch = s4[0], setEpoch = s4[1];
  var s5 = useState(false), trained = s5[0], setTrained = s5[1];
  var s6 = useState([]), lossHistory = s6[0], setLossHistory = s6[1];
  var s7 = useState([]), accHistory = s7[0], setAccHistory = s7[1];
  var s8 = useState({ age: '30', income: '55000', education: '16' }), predInput = s8[0], setPredInput = s8[1];
  var s9 = useState(null), prediction = s9[0], setPrediction = s9[1];
  var totalEpochs = 50;

  useEffect(function() {
    if (!training) return;
    if (epoch >= totalEpochs) { setTraining(false); setTrained(true); return; }
    var timer = setTimeout(function() {
      var newEpoch = epoch + 1;
      var loss = 1.0 * Math.exp(-newEpoch * 0.06) + Math.random() * 0.05;
      var acc = Math.min(0.95, 0.5 + newEpoch * 0.009 + Math.random() * 0.02);
      setEpoch(newEpoch);
      setLossHistory(function(p) { return p.concat([loss]); });
      setAccHistory(function(p) { return p.concat([acc]); });
    }, 80);
    return function() { clearTimeout(timer); };
  }, [training, epoch]);

  var startTraining = useCallback(function() {
    if (!dataLoaded) return;
    setTraining(true); setTrained(false); setEpoch(0); setLossHistory([]); setAccHistory([]); setPrediction(null);
  }, [dataLoaded]);

  var predict = useCallback(function() {
    var val = (parseInt(predInput.income) > 50000 && parseInt(predInput.education) > 14) ? 1 : 0;
    var conf = (0.75 + Math.random() * 0.2).toFixed(2);
    setPrediction({ class: val, confidence: conf });
  }, [predInput]);

  var maxLoss = lossHistory.length ? Math.max.apply(null, lossHistory) : 1;

  return React.createElement('div', { style: containerStyle },
    React.createElement('a', { href: '/projects', style: backLinkStyle }, '\u2190 Back to Projects'),
    React.createElement('h1', { style: { fontSize: '36px', fontWeight: '800', color: '#fff', marginBottom: '8px' } }, 'ML Studio'),
    React.createElement('p', { style: { color: '#9ca3af', marginBottom: '24px' } }, 'Train and evaluate machine learning models'),

    React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' } },
      // Data Panel
      React.createElement('div', { style: panelStyle },
        React.createElement('h3', { style: { color: '#fff', marginBottom: '12px', fontSize: '16px' } }, 'Dataset'),
        !dataLoaded ?
          React.createElement('div', { style: { textAlign: 'center', padding: '30px' } },
            React.createElement('div', { style: { fontSize: '40px', marginBottom: '12px' } }, '\uD83D\uDCC1'),
            React.createElement('button', { onClick: function() { setDataLoaded(true); }, style: btnStyle }, 'Load Sample CSV')
          ) :
          React.createElement('div', null,
            React.createElement('div', { style: { fontSize: '12px', color: '#4ade80', marginBottom: '8px' } }, '\u2713 customer_data.csv loaded (' + (mockCSV.length - 1) + ' rows)'),
            React.createElement('div', { style: { overflowX: 'auto', maxHeight: '220px', overflowY: 'auto' } },
              React.createElement('table', { style: { width: '100%', fontSize: '11px', borderCollapse: 'collapse' } },
                React.createElement('thead', null,
                  React.createElement('tr', null, mockCSV[0].map(function(h, i) {
                    return React.createElement('th', { key: i, style: { padding: '6px 8px', textAlign: 'left', background: 'rgba(123,140,255,0.2)', color: '#7b8cff', borderBottom: '1px solid rgba(255,255,255,0.1)' } }, h);
                  }))
                ),
                React.createElement('tbody', null, mockCSV.slice(1).map(function(row, ri) {
                  return React.createElement('tr', { key: ri }, row.map(function(cell, ci) {
                    return React.createElement('td', { key: ci, style: { padding: '5px 8px', borderBottom: '1px solid rgba(255,255,255,0.04)', fontFamily: 'monospace' } }, cell);
                  }));
                }))
              )
            )
          )
      ),

      // Model Selection & Training
      React.createElement('div', { style: panelStyle },
        React.createElement('h3', { style: { color: '#fff', marginBottom: '12px', fontSize: '16px' } }, 'Model Configuration'),
        React.createElement('label', { style: labelStyle }, 'Select Model'),
        React.createElement('select', {
          value: selectedModel,
          onChange: function(e) { setSelectedModel(e.target.value); },
          style: { width: '100%', padding: '10px', background: '#0a0a1a', color: '#e0e0e0', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', marginBottom: '16px', fontSize: '14px' }
        }, models.map(function(m) { return React.createElement('option', { key: m, value: m }, m); })),

        React.createElement('label', { style: labelStyle }, 'Training Progress'),
        React.createElement('div', { style: { background: 'rgba(0,0,0,0.3)', borderRadius: '8px', height: '28px', overflow: 'hidden', marginBottom: '8px', position: 'relative' } },
          React.createElement('div', { style: { width: (epoch / totalEpochs * 100) + '%', height: '100%', background: 'linear-gradient(90deg, #7b8cff, #4ade80)', borderRadius: '8px', transition: 'width 0.1s' } }),
          React.createElement('span', { style: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', fontSize: '12px', fontWeight: '600', color: '#fff' } }, 'Epoch ' + epoch + '/' + totalEpochs)
        ),
        React.createElement('div', { style: { display: 'flex', gap: '8px', marginTop: '12px' } },
          React.createElement('button', { onClick: startTraining, disabled: !dataLoaded || training, style: Object.assign({}, btnStyle, { opacity: (!dataLoaded || training) ? 0.5 : 1 }) }, training ? 'Training...' : 'Train Model'),
          trained && React.createElement('span', { style: { color: '#4ade80', fontSize: '13px', alignSelf: 'center' } }, '\u2713 Complete')
        )
      ),

      // Charts
      React.createElement('div', { style: panelStyle },
        React.createElement('h3', { style: { color: '#fff', marginBottom: '12px', fontSize: '16px' } }, 'Loss Chart'),
        React.createElement('div', { style: { display: 'flex', alignItems: 'flex-end', gap: '1px', height: '120px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', padding: '8px', overflow: 'hidden' } },
          lossHistory.map(function(l, i) {
            return React.createElement('div', { key: i, style: { flex: 1, minWidth: '2px', height: Math.max(2, (l / maxLoss) * 100) + '%', background: '#f87171', borderRadius: '1px 1px 0 0', transition: 'height 0.1s' } });
          }),
          lossHistory.length === 0 && React.createElement('div', { style: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', fontSize: '12px' } }, 'Train to see loss curve')
        )
      ),

      React.createElement('div', { style: panelStyle },
        React.createElement('h3', { style: { color: '#fff', marginBottom: '12px', fontSize: '16px' } }, 'Accuracy Chart'),
        React.createElement('div', { style: { display: 'flex', alignItems: 'flex-end', gap: '1px', height: '120px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', padding: '8px', overflow: 'hidden' } },
          accHistory.map(function(a, i) {
            return React.createElement('div', { key: i, style: { flex: 1, minWidth: '2px', height: (a * 100) + '%', background: '#4ade80', borderRadius: '1px 1px 0 0', transition: 'height 0.1s' } });
          }),
          accHistory.length === 0 && React.createElement('div', { style: { flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#6b7280', fontSize: '12px' } }, 'Train to see accuracy curve')
        )
      ),

      // Prediction
      React.createElement('div', { style: panelStyle },
        React.createElement('h3', { style: { color: '#fff', marginBottom: '12px', fontSize: '16px' } }, 'Prediction'),
        ['age', 'income', 'education'].map(function(field) {
          return React.createElement('div', { key: field, style: { marginBottom: '10px' } },
            React.createElement('label', { style: labelStyle }, field),
            React.createElement('input', {
              type: 'number', value: predInput[field],
              onChange: function(e) { var o = {}; o[field] = e.target.value; setPredInput(function(p) { return Object.assign({}, p, o); }); },
              style: { width: '100%', padding: '8px 10px', background: '#0a0a1a', color: '#e0e0e0', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '6px', fontSize: '14px', boxSizing: 'border-box' }
            })
          );
        }),
        React.createElement('button', { onClick: predict, disabled: !trained, style: Object.assign({}, btnStyle, { opacity: trained ? 1 : 0.5, marginTop: '8px' }) }, 'Predict'),
        prediction && React.createElement('div', { style: { marginTop: '12px', padding: '12px', background: 'rgba(74,222,128,0.1)', borderRadius: '8px', border: '1px solid rgba(74,222,128,0.3)' } },
          React.createElement('div', { style: { fontSize: '20px', fontWeight: '700', color: prediction.class === 1 ? '#4ade80' : '#f87171' } }, prediction.class === 1 ? 'Will Purchase' : 'Will Not Purchase'),
          React.createElement('div', { style: { fontSize: '12px', color: '#9ca3af', marginTop: '4px' } }, 'Confidence: ' + (prediction.confidence * 100).toFixed(0) + '%')
        )
      ),

      // Confusion Matrix
      React.createElement('div', { style: panelStyle },
        React.createElement('h3', { style: { color: '#fff', marginBottom: '12px', fontSize: '16px' } }, 'Confusion Matrix'),
        trained ? React.createElement('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center' } },
          React.createElement('div', { style: { display: 'flex', gap: '0', marginBottom: '4px' } },
            React.createElement('div', { style: { width: '50px' } }),
            React.createElement('div', { style: { width: '80px', textAlign: 'center', fontSize: '11px', color: '#9ca3af' } }, 'Pred 0'),
            React.createElement('div', { style: { width: '80px', textAlign: 'center', fontSize: '11px', color: '#9ca3af' } }, 'Pred 1')
          ),
          [0, 1].map(function(r) {
            return React.createElement('div', { key: r, style: { display: 'flex', gap: '0', alignItems: 'center' } },
              React.createElement('div', { style: { width: '50px', fontSize: '11px', color: '#9ca3af', textAlign: 'right', paddingRight: '8px' } }, 'True ' + r),
              [0, 1].map(function(c) {
                var val = confMatrix[r][c];
                var isCorrect = r === c;
                return React.createElement('div', { key: c, style: { width: '80px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: isCorrect ? 'rgba(74,222,128,0.2)' : 'rgba(248,113,113,0.2)', border: '1px solid rgba(255,255,255,0.1)', fontSize: '20px', fontWeight: '700', color: isCorrect ? '#4ade80' : '#f87171' } }, val);
              })
            );
          }),
          React.createElement('div', { style: { marginTop: '12px', fontSize: '13px', color: '#9ca3af' } }, 'Accuracy: ' + ((confMatrix[0][0] + confMatrix[1][1]) / (confMatrix[0][0] + confMatrix[0][1] + confMatrix[1][0] + confMatrix[1][1]) * 100).toFixed(1) + '%')
        ) : React.createElement('div', { style: { textAlign: 'center', padding: '30px', color: '#6b7280', fontSize: '13px' } }, 'Train a model to see the confusion matrix')
      )
    )
  );
}

var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
