const { useState, useEffect, useRef, useCallback } = React;

var backLinkStyle = { color: '#8be9fd', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '20px' };
var containerStyle = { minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%)', color: '#e0e0e0', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", padding: '30px' };
var btnStyle = { background: 'linear-gradient(135deg, #6c5ce7, #a29bfe)', border: 'none', borderRadius: '8px', color: '#fff', padding: '8px 16px', cursor: 'pointer', fontSize: '13px', fontWeight: '600' };
var cardStyle = { background: 'rgba(30,30,58,0.8)', borderRadius: '12px', border: '1px solid #2a2a4a' };

var playlist = [
  { id: 1, title: 'Cosmic Journey', duration: 245, color1: '#6c5ce7', color2: '#a29bfe', desc: 'A voyage through the stars' },
  { id: 2, title: 'Ocean Waves', duration: 183, color1: '#00cec9', color2: '#1e90ff', desc: 'Calming ocean scenery' },
  { id: 3, title: 'Mountain Sunrise', duration: 312, color1: '#ffa502', color2: '#ff6b6b', desc: 'Dawn breaking over peaks' },
  { id: 4, title: 'City Lights', duration: 198, color1: '#fd79a8', color2: '#6c5ce7', desc: 'Urban nightscape timelapse' },
  { id: 5, title: 'Northern Lights', duration: 267, color1: '#2ed573', color2: '#1e90ff', desc: 'Aurora borealis display' }
];

function formatTime(sec) {
  var m = Math.floor(sec / 60);
  var s = Math.floor(sec % 60);
  return (m < 10 ? '0' : '') + m + ':' + (s < 10 ? '0' : '') + s;
}

function App() {
  var _cur = useState(0), curIdx = _cur[0], setCurIdx = _cur[1];
  var _play = useState(false), playing = _play[0], setPlaying = _play[1];
  var _time = useState(0), currentTime = _time[0], setCurrentTime = _time[1];
  var _vol = useState(80), volume = _vol[0], setVolume = _vol[1];
  var _speed = useState(1), speed = _speed[0], setSpeed = _speed[1];
  var _fs = useState(false), fullscreen = _fs[0], setFullscreen = _fs[1];
  var _muted = useState(false), muted = _muted[0], setMuted = _muted[1];
  var _hue = useState(0), hue = _hue[0], setHue = _hue[1];
  var intervalRef = useRef(null);

  var video = playlist[curIdx];

  useEffect(function() {
    if (playing) {
      intervalRef.current = setInterval(function() {
        setCurrentTime(function(t) {
          if (t >= video.duration) {
            setPlaying(false);
            return video.duration;
          }
          return t + 0.1 * speed;
        });
        setHue(function(h) { return (h + 0.5 * speed) % 360; });
      }, 100);
    } else {
      clearInterval(intervalRef.current);
    }
    return function() { clearInterval(intervalRef.current); };
  }, [playing, speed, video.duration]);

  var togglePlay = function() { setPlaying(!playing); };
  var seek = function(e) {
    var rect = e.currentTarget.getBoundingClientRect();
    var pct = (e.clientX - rect.left) / rect.width;
    setCurrentTime(pct * video.duration);
  };
  var changeVolume = function(e) {
    var rect = e.currentTarget.getBoundingClientRect();
    var pct = (e.clientX - rect.left) / rect.width;
    setVolume(Math.max(0, Math.min(100, Math.round(pct * 100))));
  };
  var selectVideo = function(idx) {
    setCurIdx(idx); setCurrentTime(0); setPlaying(false);
  };
  var nextVideo = function() {
    var next = (curIdx + 1) % playlist.length;
    selectVideo(next);
  };
  var prevVideo = function() {
    var prev = (curIdx - 1 + playlist.length) % playlist.length;
    selectVideo(prev);
  };

  var progress = (currentTime / video.duration) * 100;
  var speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];

  return React.createElement('div', { style: containerStyle },
    React.createElement('a', { href: '/projects', style: backLinkStyle }, '\u2190 Back to Projects'),
    React.createElement('h1', { style: { fontSize: '32px', fontWeight: '700', marginBottom: '8px', background: 'linear-gradient(90deg, #ff6b6b, #ffa502)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } }, 'Video Player'),
    React.createElement('p', { style: { color: '#888', marginBottom: '24px' } }, 'Custom player with simulated video'),

    React.createElement('div', { style: { display: 'flex', gap: '20px', flexWrap: 'wrap' } },
      // Main player
      React.createElement('div', { style: { flex: '1', minWidth: '400px' } },
        // Video display area
        React.createElement('div', { style: Object.assign({}, cardStyle, { overflow: 'hidden', marginBottom: '0', borderRadius: fullscreen ? '0' : '12px 12px 0 0', position: 'relative' }) },
          React.createElement('div', { style: {
            width: '100%', height: fullscreen ? '500px' : '340px',
            background: 'linear-gradient(' + (hue) + 'deg, ' + video.color1 + ', ' + video.color2 + ', ' + video.color1 + ')',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
            transition: 'height 0.3s', cursor: 'pointer', position: 'relative'
          }, onClick: togglePlay },
            !playing && React.createElement('div', { style: { width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', backdropFilter: 'blur(10px)' } },
              React.createElement('div', { style: { width: 0, height: 0, borderTop: '18px solid transparent', borderBottom: '18px solid transparent', borderLeft: '30px solid #fff', marginLeft: '6px' } })
            ),
            playing && React.createElement('div', { style: { position: 'absolute', top: '16px', right: '16px', background: 'rgba(0,0,0,0.5)', borderRadius: '8px', padding: '4px 10px', fontSize: '12px', color: '#fff' } }, 'Playing'),
            React.createElement('div', { style: { position: 'absolute', bottom: '16px', left: '16px', background: 'rgba(0,0,0,0.5)', borderRadius: '8px', padding: '6px 12px', fontSize: '14px', fontWeight: '600' } }, video.title)
          )
        ),

        // Controls
        React.createElement('div', { style: { background: 'rgba(20,20,40,0.95)', padding: '14px 18px', borderRadius: '0 0 12px 12px', border: '1px solid #2a2a4a', borderTop: 'none' } },
          // Progress bar
          React.createElement('div', { style: { marginBottom: '12px', cursor: 'pointer', padding: '4px 0' }, onClick: seek },
            React.createElement('div', { style: { background: '#1a1a3a', borderRadius: '4px', height: '6px', position: 'relative', overflow: 'hidden' } },
              React.createElement('div', { style: { width: progress + '%', height: '100%', background: 'linear-gradient(90deg, ' + video.color1 + ', ' + video.color2 + ')', borderRadius: '4px', transition: 'width 0.1s linear' } }),
              React.createElement('div', { style: { position: 'absolute', top: '-4px', left: 'calc(' + progress + '% - 7px)', width: '14px', height: '14px', borderRadius: '50%', background: '#fff', boxShadow: '0 0 6px rgba(0,0,0,0.5)', transition: 'left 0.1s linear' } })
            )
          ),

          // Time display
          React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#888', marginBottom: '12px' } },
            React.createElement('span', null, formatTime(currentTime)),
            React.createElement('span', null, formatTime(video.duration))
          ),

          // Buttons row
          React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' } },
            // Prev
            React.createElement('button', { style: { background: 'none', border: 'none', color: '#ccc', cursor: 'pointer', fontSize: '18px', padding: '4px' }, onClick: prevVideo }, '\u23ee'),
            // Play/Pause
            React.createElement('button', { style: { background: 'linear-gradient(135deg, ' + video.color1 + ', ' + video.color2 + ')', border: 'none', borderRadius: '50%', width: '42px', height: '42px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '16px' }, onClick: togglePlay },
              playing ? '\u23f8' : '\u25b6'
            ),
            // Next
            React.createElement('button', { style: { background: 'none', border: 'none', color: '#ccc', cursor: 'pointer', fontSize: '18px', padding: '4px' }, onClick: nextVideo }, '\u23ed'),

            // Volume
            React.createElement('button', { style: { background: 'none', border: 'none', color: muted ? '#ff6b6b' : '#ccc', cursor: 'pointer', fontSize: '14px', padding: '4px' }, onClick: function() { setMuted(!muted); } }, muted ? '\ud83d\udd07' : '\ud83d\udd0a'),
            React.createElement('div', { style: { width: '80px', cursor: 'pointer', padding: '4px 0' }, onClick: changeVolume },
              React.createElement('div', { style: { background: '#1a1a3a', borderRadius: '3px', height: '4px', position: 'relative' } },
                React.createElement('div', { style: { width: (muted ? 0 : volume) + '%', height: '100%', background: '#a29bfe', borderRadius: '3px' } })
              )
            ),
            React.createElement('span', { style: { fontSize: '12px', color: '#888', minWidth: '32px' } }, (muted ? 0 : volume) + '%'),

            // Spacer
            React.createElement('div', { style: { flex: '1' } }),

            // Speed
            React.createElement('div', { style: { display: 'flex', gap: '4px', alignItems: 'center' } },
              speeds.map(function(s) {
                return React.createElement('button', { key: s, style: { background: speed === s ? '#6c5ce7' : 'transparent', border: '1px solid ' + (speed === s ? '#6c5ce7' : '#3a3a5c'), borderRadius: '4px', color: speed === s ? '#fff' : '#888', cursor: 'pointer', padding: '2px 6px', fontSize: '11px' }, onClick: function() { setSpeed(s); } }, s + 'x');
              })
            ),

            // Fullscreen
            React.createElement('button', { style: { background: 'none', border: '1px solid #3a3a5c', borderRadius: '6px', color: '#ccc', cursor: 'pointer', padding: '4px 10px', fontSize: '12px' }, onClick: function() { setFullscreen(!fullscreen); } }, fullscreen ? 'Exit FS' : 'Fullscreen')
          )
        )
      ),

      // Playlist sidebar
      React.createElement('div', { style: { width: '260px', flexShrink: 0 } },
        React.createElement('div', { style: Object.assign({}, cardStyle, { padding: '16px' }) },
          React.createElement('h3', { style: { margin: '0 0 16px 0', color: '#ffa502', fontSize: '16px' } }, 'Playlist (' + playlist.length + ')'),
          playlist.map(function(v, i) {
            var active = i === curIdx;
            return React.createElement('div', { key: v.id, onClick: function() { selectVideo(i); }, style: { display: 'flex', gap: '12px', padding: '10px', borderRadius: '8px', marginBottom: '6px', cursor: 'pointer', background: active ? 'rgba(108,92,231,0.2)' : 'transparent', border: active ? '1px solid #6c5ce740' : '1px solid transparent', transition: 'all 0.2s' } },
              // Thumbnail
              React.createElement('div', { style: { width: '60px', height: '40px', borderRadius: '6px', background: 'linear-gradient(135deg, ' + v.color1 + ', ' + v.color2 + ')', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', color: '#fff' } }, active && playing ? '\u25b6' : (i + 1)),
              React.createElement('div', { style: { minWidth: 0 } },
                React.createElement('div', { style: { fontSize: '13px', fontWeight: active ? '700' : '500', color: active ? '#fff' : '#ccc', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' } }, v.title),
                React.createElement('div', { style: { fontSize: '11px', color: '#666' } }, v.desc),
                React.createElement('div', { style: { fontSize: '11px', color: '#888', marginTop: '2px' } }, formatTime(v.duration))
              )
            );
          })
        ),
        // Now playing info
        React.createElement('div', { style: Object.assign({}, cardStyle, { padding: '16px', marginTop: '12px' }) },
          React.createElement('div', { style: { fontSize: '12px', color: '#888', marginBottom: '6px' } }, 'Now Playing'),
          React.createElement('div', { style: { fontSize: '16px', fontWeight: '700', color: '#fff', marginBottom: '4px' } }, video.title),
          React.createElement('div', { style: { fontSize: '12px', color: '#666' } }, video.desc),
          React.createElement('div', { style: { display: 'flex', gap: '16px', marginTop: '12px', fontSize: '12px', color: '#888' } },
            React.createElement('span', null, 'Speed: ' + speed + 'x'),
            React.createElement('span', null, 'Vol: ' + (muted ? 0 : volume) + '%')
          )
        )
      )
    )
  );
}

var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
