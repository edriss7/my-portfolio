const { useState, useCallback, useEffect, useRef } = React;

var backLinkStyle = { color: '#8be9fd', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '16px' };
var baseStyle = { minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%)', color: '#e0e0e0', fontFamily: "'Segoe UI', sans-serif", padding: '24px' };
var cardStyle = { background: 'rgba(255,255,255,0.07)', borderRadius: '8px', padding: '16px', border: '1px solid rgba(255,255,255,0.08)', marginBottom: '16px' };
var btnStyle = function (c) { return { background: c || '#8be9fd', color: '#0a0a1a', border: 'none', padding: '8px 16px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold', fontSize: '13px' }; };

var statusColors = { pending: '#888', running: '#8be9fd', passed: '#50fa7b', failed: '#ff5555' };
var statusIcons = { pending: '\u25CB', running: '\u25CE', passed: '\u2713', failed: '\u2717' };

var stageNames = ['Source', 'Build', 'Test', 'Security', 'Deploy'];

var mockLogs = {
  Source: ['[09:00:01] Fetching source from main branch...', '[09:00:02] Cloning repository...', '[09:00:04] Checkout commit abc1234', '[09:00:05] Source fetched successfully (142 files)'],
  Build: ['[09:00:06] Installing dependencies...', '[09:00:12] npm install completed (234 packages)', '[09:00:13] Compiling TypeScript...', '[09:00:18] Building production bundle...', '[09:00:22] Bundle size: 245 KB (gzipped: 78 KB)', '[09:00:23] Build completed successfully'],
  Test: ['[09:00:24] Running unit tests...', '[09:00:30] 142 tests passed, 0 failed', '[09:00:31] Running integration tests...', '[09:00:38] 28 integration tests passed', '[09:00:39] Code coverage: 87.3%', '[09:00:40] All tests passed'],
  Security: ['[09:00:41] Running security scan...', '[09:00:45] Checking dependencies for vulnerabilities...', '[09:00:48] No critical vulnerabilities found', '[09:00:49] 2 low-severity warnings (acknowledged)', '[09:00:50] Security scan passed'],
  Deploy: ['[09:00:51] Preparing deployment...', '[09:00:53] Uploading to staging environment...', '[09:00:58] Running health checks...', '[09:01:02] Health check passed (200 OK)', '[09:01:03] Promoting to production...', '[09:01:08] Deployment successful!', '[09:01:09] Application live at https://app.example.com']
};

function generatePipeline(id, status) {
  var stages = stageNames.map(function (name, i) {
    var stageStatus;
    if (status === 'passed') {
      stageStatus = 'passed';
    } else if (status === 'failed') {
      if (i <= 2) stageStatus = 'passed';
      else if (i === 3) stageStatus = 'failed';
      else stageStatus = 'pending';
    } else if (status === 'running') {
      if (i <= 1) stageStatus = 'passed';
      else if (i === 2) stageStatus = 'running';
      else stageStatus = 'pending';
    } else {
      stageStatus = 'pending';
    }
    return { name: name, status: stageStatus, duration: stageStatus === 'passed' ? Math.floor(Math.random() * 30 + 5) + 's' : stageStatus === 'running' ? '...' : '-' };
  });
  var commits = ['Fix auth flow', 'Update dashboard', 'Add export feature', 'Refactor API', 'Fix styling bug', 'Add dark mode'];
  return { id: id, branch: ['main', 'develop', 'feature/auth', 'hotfix/login'][Math.floor(Math.random() * 4)], commit: commits[Math.floor(Math.random() * commits.length)], author: ['Alice', 'Bob', 'Carol', 'Dave'][Math.floor(Math.random() * 4)], status: status, stages: stages, timestamp: 'Feb 17, 2026' };
}

var initialPipelines = [
  generatePipeline(1, 'passed'),
  generatePipeline(2, 'running'),
  generatePipeline(3, 'failed'),
  generatePipeline(4, 'passed'),
  generatePipeline(5, 'passed')
];

function App() {
  var _s1 = useState(initialPipelines), pipelines = _s1[0], setPipelines = _s1[1];
  var _s2 = useState(null), selectedPipeline = _s2[0], setSelectedPipeline = _s2[1];
  var _s3 = useState(null), viewingLogs = _s3[0], setViewingLogs = _s3[1];
  var _s4 = useState(0), pulseAnim = _s4[0], setPulseAnim = _s4[1];

  useEffect(function () {
    var timer = setInterval(function () { setPulseAnim(function (p) { return p + 1; }); }, 800);
    return function () { clearInterval(timer); };
  }, []);

  var triggerBuild = useCallback(function () {
    var newPipeline = generatePipeline(Date.now(), 'running');
    newPipeline.commit = 'Manual trigger';
    newPipeline.branch = 'main';
    newPipeline.author = 'You';
    setPipelines(function (prev) { return [newPipeline].concat(prev); });

    setTimeout(function () {
      setPipelines(function (prev) { return prev.map(function (p) {
        if (p.id !== newPipeline.id) return p;
        var success = Math.random() > 0.3;
        return generatePipeline(p.id, success ? 'passed' : 'failed');
      }); });
    }, 4000);
  }, []);

  var retryPipeline = useCallback(function (id) {
    setPipelines(function (prev) { return prev.map(function (p) {
      if (p.id !== id) return p;
      var retried = generatePipeline(p.id, 'running');
      retried.branch = p.branch;
      retried.commit = p.commit + ' (retry)';
      retried.author = p.author;
      return retried;
    }); });
    setTimeout(function () {
      setPipelines(function (prev) { return prev.map(function (p) {
        if (p.id !== id) return p;
        if (p.status !== 'running') return p;
        return generatePipeline(p.id, 'passed');
      }); });
    }, 3000);
  }, []);

  var selected = selectedPipeline ? pipelines.find(function (p) { return p.id === selectedPipeline; }) : null;

  var renderStageNode = function (stage, idx, total) {
    var isRunning = stage.status === 'running';
    var pulse = isRunning && pulseAnim % 2 === 0;
    return React.createElement('div', { key: idx, style: { display: 'flex', alignItems: 'center' } },
      React.createElement('div', { style: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' } },
        React.createElement('div', { style: { width: '48px', height: '48px', borderRadius: '50%', background: statusColors[stage.status] + (isRunning ? '33' : '22'), border: '2px solid ' + statusColors[stage.status], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', color: statusColors[stage.status], transition: 'all 0.3s', boxShadow: isRunning ? '0 0 ' + (pulse ? '16' : '8') + 'px ' + statusColors[stage.status] + '55' : 'none' } },
          isRunning ? React.createElement('div', { style: { width: '16px', height: '16px', border: '2px solid #8be9fd', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'none', transform: 'rotate(' + (pulseAnim * 45) + 'deg)' } }) : statusIcons[stage.status]
        ),
        React.createElement('div', { style: { fontSize: '12px', fontWeight: 'bold', color: statusColors[stage.status] } }, stage.name),
        React.createElement('div', { style: { fontSize: '10px', color: '#666' } }, stage.duration)
      ),
      idx < total - 1 && React.createElement('div', { style: { width: '60px', height: '2px', background: stage.status === 'passed' ? statusColors.passed : 'rgba(255,255,255,0.15)', margin: '0 8px', marginBottom: '32px', position: 'relative' } },
        React.createElement('div', { style: { position: 'absolute', right: '-4px', top: '-3px', width: 0, height: 0, borderTop: '4px solid transparent', borderBottom: '4px solid transparent', borderLeft: '6px solid ' + (stage.status === 'passed' ? statusColors.passed : 'rgba(255,255,255,0.15)') } })
      )
    );
  };

  return React.createElement('div', { style: baseStyle },
    React.createElement('a', { href: '/projects', style: backLinkStyle }, '\u2190 Back to Projects'),
    React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' } },
      React.createElement('h1', { style: { color: '#8be9fd', margin: 0, fontSize: '24px' } }, 'CI/CD Pipeline'),
      React.createElement('button', { style: btnStyle('#50fa7b'), onClick: triggerBuild }, '\u25B6 Trigger Build')
    ),

    selected && React.createElement('div', { style: Object.assign({}, cardStyle, { marginBottom: '20px' }) },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' } },
        React.createElement('div', null,
          React.createElement('h3', { style: { margin: '0 0 4px', color: '#fff' } }, 'Pipeline #' + selected.id.toString().slice(-4)),
          React.createElement('div', { style: { fontSize: '13px', color: '#888' } }, selected.branch + ' \u2022 ' + selected.commit + ' \u2022 ' + selected.author)
        ),
        React.createElement('div', { style: { display: 'flex', gap: '8px', alignItems: 'center' } },
          React.createElement('span', { style: { background: statusColors[selected.status] + '33', color: statusColors[selected.status], padding: '4px 12px', borderRadius: '12px', fontSize: '12px', fontWeight: 'bold', textTransform: 'capitalize' } }, selected.status),
          selected.status === 'failed' && React.createElement('button', { style: Object.assign({}, btnStyle('#ffb86c'), { padding: '4px 12px', fontSize: '11px' }), onClick: function () { retryPipeline(selected.id); } }, 'Retry'),
          React.createElement('button', { style: { background: 'transparent', border: 'none', color: '#888', cursor: 'pointer', fontSize: '16px' }, onClick: function () { setSelectedPipeline(null); setViewingLogs(null); } }, '\u00D7')
        )
      ),
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px 0', overflowX: 'auto' } },
        selected.stages.map(function (stage, idx) { return renderStageNode(stage, idx, selected.stages.length); })
      ),
      React.createElement('div', { style: { display: 'flex', gap: '8px', marginTop: '12px' } },
        selected.stages.map(function (stage) {
          return React.createElement('button', { key: stage.name, style: Object.assign({}, btnStyle(viewingLogs === stage.name ? '#8be9fd' : 'rgba(255,255,255,0.1)'), { color: viewingLogs === stage.name ? '#0a0a1a' : '#ccc', padding: '6px 12px', fontSize: '11px' }), onClick: function () { setViewingLogs(viewingLogs === stage.name ? null : stage.name); } }, stage.name + ' Logs');
        })
      ),
      viewingLogs && React.createElement('div', { style: { marginTop: '12px', background: 'rgba(0,0,0,0.4)', borderRadius: '8px', padding: '12px', fontFamily: 'monospace', fontSize: '12px', maxHeight: '200px', overflowY: 'auto' } },
        (mockLogs[viewingLogs] || ['No logs available']).map(function (line, i) {
          var color = '#ccc';
          if (line.indexOf('successfully') !== -1 || line.indexOf('passed') !== -1 || line.indexOf('completed') !== -1 || line.indexOf('live') !== -1) color = '#50fa7b';
          if (line.indexOf('failed') !== -1 || line.indexOf('error') !== -1) color = '#ff5555';
          if (line.indexOf('warning') !== -1) color = '#ffb86c';
          return React.createElement('div', { key: i, style: { padding: '2px 0', color: color } }, line);
        })
      )
    ),

    React.createElement('div', { style: { display: 'flex', gap: '8px', marginBottom: '16px', fontSize: '13px' } },
      ['all', 'passed', 'running', 'failed', 'pending'].map(function (f) {
        return React.createElement('span', { key: f, style: { padding: '4px 12px', borderRadius: '12px', background: 'rgba(255,255,255,0.08)', color: '#ccc', textTransform: 'capitalize', cursor: 'default', fontSize: '12px' } }, f + ' (' + (f === 'all' ? pipelines.length : pipelines.filter(function (p) { return p.status === f; }).length) + ')');
      })
    ),

    pipelines.map(function (pipeline) {
      return React.createElement('div', { key: pipeline.id, onClick: function () { setSelectedPipeline(pipeline.id); setViewingLogs(null); }, style: Object.assign({}, cardStyle, { cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px', transition: 'background 0.2s', borderLeft: '3px solid ' + statusColors[pipeline.status] }) },
        React.createElement('div', { style: { width: '36px', height: '36px', borderRadius: '50%', background: statusColors[pipeline.status] + '22', border: '2px solid ' + statusColors[pipeline.status], display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', color: statusColors[pipeline.status], flexShrink: 0 } },
          pipeline.status === 'running' ? React.createElement('div', { style: { width: '12px', height: '12px', border: '2px solid #8be9fd', borderTop: '2px solid transparent', borderRadius: '50%', transform: 'rotate(' + (pulseAnim * 45) + 'deg)' } }) : statusIcons[pipeline.status]
        ),
        React.createElement('div', { style: { flex: 1 } },
          React.createElement('div', { style: { fontWeight: 'bold', fontSize: '14px', marginBottom: '2px' } }, pipeline.commit),
          React.createElement('div', { style: { fontSize: '12px', color: '#888' } }, pipeline.branch + ' \u2022 ' + pipeline.author + ' \u2022 ' + pipeline.timestamp)
        ),
        React.createElement('div', { style: { display: 'flex', gap: '4px' } },
          pipeline.stages.map(function (s, i) {
            return React.createElement('div', { key: i, style: { width: '24px', height: '24px', borderRadius: '4px', background: statusColors[s.status] + '33', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: statusColors[s.status] }, title: s.name }, s.name.charAt(0));
          })
        ),
        React.createElement('span', { style: { background: statusColors[pipeline.status] + '33', color: statusColors[pipeline.status], padding: '3px 10px', borderRadius: '10px', fontSize: '11px', fontWeight: 'bold', textTransform: 'capitalize', minWidth: '60px', textAlign: 'center' } }, pipeline.status)
      );
    })
  );
}

var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
