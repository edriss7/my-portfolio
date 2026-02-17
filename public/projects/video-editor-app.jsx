const { useState, useCallback, useRef, useEffect } = React;

var backLinkStyle = { color: '#7b8cff', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '20px' };
var containerStyle = { minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%)', color: '#e0e0e0', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", padding: '20px', display: 'flex', flexDirection: 'column' };

var initialClips = [
  { id: 1, name: 'Intro.mp4', color: '#7b8cff', start: 0, duration: 120, track: 0 },
  { id: 2, name: 'Scene1.mp4', color: '#4ade80', start: 120, duration: 200, track: 0 },
  { id: 3, name: 'Overlay.png', color: '#fbbf24', start: 140, duration: 100, track: 1 },
  { id: 4, name: 'Scene2.mp4', color: '#f87171', start: 320, duration: 180, track: 0 },
  { id: 5, name: 'Music.mp3', color: '#a78bfa', start: 0, duration: 500, track: 2 },
  { id: 6, name: 'Title.mov', color: '#38bdf8', start: 50, duration: 70, track: 1 },
  { id: 7, name: 'Outro.mp4', color: '#f0abfc', start: 500, duration: 100, track: 0 }
];

var trackLabels = ['Video', 'Overlay', 'Audio'];
var toolbarItems = [
  { icon: '\u2702', label: 'Cut', action: 'cut' },
  { icon: '\u2194', label: 'Split', action: 'split' },
  { icon: '\u2717', label: 'Delete', action: 'delete' },
  { icon: '\uD83D\uDD04', label: 'Undo', action: 'undo' }
];

function App() {
  var s1 = useState(initialClips), clips = s1[0], setClips = s1[1];
  var s2 = useState(null), selected = s2[0], setSelected = s2[1];
  var s3 = useState(0), playhead = s3[0], setPlayhead = s3[1];
  var s4 = useState(false), playing = s4[0], setPlaying = s4[1];
  var s5 = useState(1), zoom = s5[0], setZoom = s5[1];
  var tlRef = useRef(null);

  var totalDuration = 700;
  var pxPerUnit = 1.2 * zoom;

  useEffect(function() {
    if (!playing) return;
    var timer = setInterval(function() {
      setPlayhead(function(p) {
        if (p >= totalDuration) { setPlaying(false); return 0; }
        return p + 2;
      });
    }, 50);
    return function() { clearInterval(timer); };
  }, [playing]);

  var togglePlay = useCallback(function() { setPlaying(function(p) { return !p; }); }, []);

  var handleTimelineClick = useCallback(function(e) {
    if (!tlRef.current) return;
    var rect = tlRef.current.getBoundingClientRect();
    var x = e.clientX - rect.left;
    var time = Math.max(0, Math.min(totalDuration, x / pxPerUnit));
    setPlayhead(Math.round(time));
  }, [pxPerUnit]);

  var handleAction = useCallback(function(action) {
    if (action === 'delete' && selected) {
      setClips(function(prev) { return prev.filter(function(c) { return c.id !== selected; }); });
      setSelected(null);
    } else if (action === 'split' && selected) {
      setClips(function(prev) {
        var result = [];
        prev.forEach(function(c) {
          if (c.id === selected && playhead > c.start && playhead < c.start + c.duration) {
            var splitPoint = playhead - c.start;
            result.push(Object.assign({}, c, { duration: splitPoint }));
            result.push(Object.assign({}, c, { id: Date.now(), name: c.name + ' (2)', start: playhead, duration: c.duration - splitPoint }));
          } else {
            result.push(c);
          }
        });
        return result;
      });
    }
  }, [selected, playhead]);

  var selectedClip = selected ? clips.find(function(c) { return c.id === selected; }) : null;

  var formatTime = function(t) {
    var m = Math.floor(t / 60);
    var s = Math.floor(t % 60);
    return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
  };

  return React.createElement('div', { style: containerStyle },
    React.createElement('a', { href: '/projects', style: backLinkStyle }, '\u2190 Back to Projects'),
    React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' } },
      React.createElement('h1', { style: { fontSize: '28px', fontWeight: '800', color: '#fff', margin: 0 } }, 'Video Editor'),
      React.createElement('div', { style: { fontSize: '14px', color: '#9ca3af' } }, 'Duration: ' + formatTime(totalDuration))
    ),

    // Main area: preview + properties
    React.createElement('div', { style: { display: 'flex', gap: '16px', marginBottom: '16px', flex: 1 } },
      // Preview
      React.createElement('div', { style: { flex: 2, background: '#000', borderRadius: '12px', overflow: 'hidden', position: 'relative', minHeight: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' } },
        React.createElement('div', { style: { fontSize: '48px', color: '#333', marginBottom: '12px' } }, '\u25B6'),
        React.createElement('div', { style: { color: '#666', fontSize: '14px' } }, 'Preview - ' + formatTime(playhead)),
        clips.filter(function(c) { return playhead >= c.start && playhead < c.start + c.duration; }).length > 0 &&
          React.createElement('div', { style: { position: 'absolute', bottom: '16px', left: '16px', right: '16px', display: 'flex', gap: '8px', flexWrap: 'wrap' } },
            clips.filter(function(c) { return playhead >= c.start && playhead < c.start + c.duration; }).map(function(c) {
              return React.createElement('span', { key: c.id, style: { padding: '4px 10px', background: c.color, borderRadius: '4px', fontSize: '11px', fontWeight: '600', color: '#000' } }, c.name);
            })
          )
      ),
      // Properties
      React.createElement('div', { style: { flex: 1, background: 'rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px', border: '1px solid rgba(255,255,255,0.08)', minWidth: '220px' } },
        React.createElement('h3', { style: { color: '#fff', fontSize: '16px', marginBottom: '12px', marginTop: 0 } }, 'Properties'),
        selectedClip ? React.createElement('div', null,
          React.createElement('div', { style: { marginBottom: '12px' } },
            React.createElement('div', { style: { fontSize: '11px', color: '#9ca3af', marginBottom: '4px', textTransform: 'uppercase' } }, 'Name'),
            React.createElement('div', { style: { fontSize: '14px', fontWeight: '600', color: '#fff' } }, selectedClip.name)
          ),
          React.createElement('div', { style: { marginBottom: '12px' } },
            React.createElement('div', { style: { fontSize: '11px', color: '#9ca3af', marginBottom: '4px', textTransform: 'uppercase' } }, 'Track'),
            React.createElement('div', { style: { fontSize: '14px', color: '#fff' } }, trackLabels[selectedClip.track])
          ),
          React.createElement('div', { style: { marginBottom: '12px' } },
            React.createElement('div', { style: { fontSize: '11px', color: '#9ca3af', marginBottom: '4px', textTransform: 'uppercase' } }, 'Start'),
            React.createElement('div', { style: { fontSize: '14px', color: '#fff', fontFamily: 'monospace' } }, formatTime(selectedClip.start))
          ),
          React.createElement('div', { style: { marginBottom: '12px' } },
            React.createElement('div', { style: { fontSize: '11px', color: '#9ca3af', marginBottom: '4px', textTransform: 'uppercase' } }, 'Duration'),
            React.createElement('div', { style: { fontSize: '14px', color: '#fff', fontFamily: 'monospace' } }, formatTime(selectedClip.duration))
          ),
          React.createElement('div', { style: { marginBottom: '12px' } },
            React.createElement('div', { style: { fontSize: '11px', color: '#9ca3af', marginBottom: '4px', textTransform: 'uppercase' } }, 'Color'),
            React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '8px' } },
              React.createElement('div', { style: { width: '24px', height: '24px', borderRadius: '6px', background: selectedClip.color } }),
              React.createElement('span', { style: { fontSize: '13px', fontFamily: 'monospace', color: '#fff' } }, selectedClip.color)
            )
          )
        ) : React.createElement('div', { style: { color: '#6b7280', fontSize: '13px', textAlign: 'center', padding: '40px 0' } }, 'Select a clip to view properties')
      )
    ),

    // Toolbar
    React.createElement('div', { style: { display: 'flex', gap: '8px', marginBottom: '12px', alignItems: 'center' } },
      React.createElement('button', { onClick: togglePlay, style: { padding: '8px 18px', background: playing ? '#f87171' : '#4ade80', color: '#000', border: 'none', borderRadius: '8px', fontSize: '14px', fontWeight: '700', cursor: 'pointer' } }, playing ? '\u23F8 Pause' : '\u25B6 Play'),
      React.createElement('button', { onClick: function() { setPlayhead(0); setPlaying(false); }, style: { padding: '8px 14px', background: 'rgba(255,255,255,0.1)', color: '#e0e0e0', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px', fontSize: '13px', cursor: 'pointer' } }, '\u23EE Stop'),
      React.createElement('div', { style: { width: '1px', height: '28px', background: 'rgba(255,255,255,0.15)', margin: '0 4px' } }),
      toolbarItems.map(function(t) {
        return React.createElement('button', { key: t.action, onClick: function() { handleAction(t.action); }, style: { padding: '8px 14px', background: 'rgba(255,255,255,0.07)', color: '#e0e0e0', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' } },
          React.createElement('span', null, t.icon), React.createElement('span', null, t.label)
        );
      }),
      React.createElement('div', { style: { flex: 1 } }),
      React.createElement('span', { style: { fontSize: '12px', color: '#9ca3af', marginRight: '8px' } }, 'Zoom'),
      React.createElement('input', { type: 'range', min: '0.5', max: '3', step: '0.1', value: zoom, onChange: function(e) { setZoom(parseFloat(e.target.value)); }, style: { width: '100px' } }),
      React.createElement('span', { style: { fontFamily: 'monospace', fontSize: '18px', color: '#fff', marginLeft: '16px', fontWeight: '700' } }, formatTime(playhead))
    ),

    // Timeline
    React.createElement('div', { style: { background: 'rgba(0,0,0,0.3)', borderRadius: '12px', padding: '12px', overflow: 'auto', border: '1px solid rgba(255,255,255,0.08)' } },
      // Time ruler
      React.createElement('div', { ref: tlRef, onClick: handleTimelineClick, style: { position: 'relative', marginLeft: '70px', height: '24px', background: 'rgba(255,255,255,0.03)', borderRadius: '4px', cursor: 'crosshair', marginBottom: '4px', width: (totalDuration * pxPerUnit) + 'px' } },
        Array.from({ length: Math.ceil(totalDuration / 60) + 1 }, function(_, i) {
          return React.createElement('div', { key: i, style: { position: 'absolute', left: (i * 60 * pxPerUnit) + 'px', top: 0, height: '100%', borderLeft: '1px solid rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', paddingLeft: '4px' } },
            React.createElement('span', { style: { fontSize: '10px', color: '#6b7280' } }, formatTime(i * 60))
          );
        }),
        // Playhead on ruler
        React.createElement('div', { style: { position: 'absolute', left: (playhead * pxPerUnit - 5) + 'px', top: '0', width: '10px', height: '24px', background: '#ff7bca', clipPath: 'polygon(50% 100%, 0 0, 100% 0)', zIndex: 5 } })
      ),

      // Tracks
      trackLabels.map(function(label, trackIdx) {
        var trackClips = clips.filter(function(c) { return c.track === trackIdx; });
        return React.createElement('div', { key: trackIdx, style: { display: 'flex', alignItems: 'center', marginBottom: '4px' } },
          React.createElement('div', { style: { width: '66px', fontSize: '11px', color: '#9ca3af', fontWeight: '600', textAlign: 'right', paddingRight: '8px', flexShrink: 0 } }, label),
          React.createElement('div', { style: { position: 'relative', height: '44px', background: 'rgba(255,255,255,0.02)', borderRadius: '6px', flex: 1, width: (totalDuration * pxPerUnit) + 'px', border: '1px solid rgba(255,255,255,0.05)' } },
            trackClips.map(function(clip) {
              var isSel = selected === clip.id;
              return React.createElement('div', {
                key: clip.id,
                onClick: function(e) { e.stopPropagation(); setSelected(clip.id); },
                style: {
                  position: 'absolute', left: (clip.start * pxPerUnit) + 'px', width: (clip.duration * pxPerUnit) + 'px',
                  top: '3px', height: '38px', background: clip.color, borderRadius: '6px', cursor: 'pointer',
                  opacity: isSel ? 1 : 0.75, border: isSel ? '2px solid #fff' : '2px solid transparent',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden',
                  boxShadow: isSel ? '0 0 12px rgba(255,255,255,0.3)' : 'none', transition: 'opacity 0.2s, box-shadow 0.2s'
                }
              },
                // Trim handles
                React.createElement('div', { style: { position: 'absolute', left: 0, top: 0, width: '6px', height: '100%', background: 'rgba(0,0,0,0.3)', cursor: 'col-resize', borderRadius: '6px 0 0 6px' } }),
                React.createElement('span', { style: { fontSize: '10px', fontWeight: '600', color: '#000', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap', padding: '0 10px' } }, clip.name),
                React.createElement('div', { style: { position: 'absolute', right: 0, top: 0, width: '6px', height: '100%', background: 'rgba(0,0,0,0.3)', cursor: 'col-resize', borderRadius: '0 6px 6px 0' } })
              );
            }),
            // Playhead line
            React.createElement('div', { style: { position: 'absolute', left: (playhead * pxPerUnit) + 'px', top: 0, width: '2px', height: '100%', background: '#ff7bca', zIndex: 4, pointerEvents: 'none' } })
          )
        );
      })
    )
  );
}

var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
