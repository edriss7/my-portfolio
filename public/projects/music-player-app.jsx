const { useState, useEffect, useRef, useCallback } = React;

const songs = [
  { id: 1, title: 'Midnight Drive', artist: 'Neon Pulse', album: 'City Lights', duration: 234 },
  { id: 2, title: 'Ocean Breeze', artist: 'Coastal Waves', album: 'Tidal', duration: 198 },
  { id: 3, title: 'Electric Dreams', artist: 'Synth Valley', album: 'Retrowave', duration: 267 },
  { id: 4, title: 'Mountain Echo', artist: 'Alpine Sound', album: 'Peaks', duration: 312 },
  { id: 5, title: 'Starlight Serenade', artist: 'Luna Project', album: 'Cosmos', duration: 185 },
  { id: 6, title: 'Urban Jungle', artist: 'Beat Collective', album: 'Concrete', duration: 220 },
  { id: 7, title: 'Rainy Afternoon', artist: 'Mellow Haze', album: 'Drizzle', duration: 253 },
  { id: 8, title: 'Solar Flare', artist: 'Astro Beat', album: 'Supernova', duration: 289 }
];

function formatTime(seconds) {
  var m = Math.floor(seconds / 60);
  var s = Math.floor(seconds % 60);
  return m + ':' + (s < 10 ? '0' : '') + s;
}

function App() {
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(75);
  const [shuffle, setShuffle] = useState(false);
  const [repeat, setRepeat] = useState(false);
  const intervalRef = useRef(null);

  var currentSong = songs[currentSongIndex];

  useEffect(function() {
    if (isPlaying) {
      intervalRef.current = setInterval(function() {
        setProgress(function(prev) {
          if (prev >= currentSong.duration) {
            if (repeat) {
              return 0;
            }
            handleNext();
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return function() {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isPlaying, currentSongIndex, repeat]);

  function handlePlayPause() {
    setIsPlaying(function(p) { return !p; });
  }

  function handleNext() {
    setProgress(0);
    if (shuffle) {
      var nextIndex;
      do {
        nextIndex = Math.floor(Math.random() * songs.length);
      } while (nextIndex === currentSongIndex && songs.length > 1);
      setCurrentSongIndex(nextIndex);
    } else {
      setCurrentSongIndex(function(i) { return (i + 1) % songs.length; });
    }
  }

  function handlePrev() {
    setProgress(0);
    if (shuffle) {
      var prevIndex;
      do {
        prevIndex = Math.floor(Math.random() * songs.length);
      } while (prevIndex === currentSongIndex && songs.length > 1);
      setCurrentSongIndex(prevIndex);
    } else {
      setCurrentSongIndex(function(i) { return (i - 1 + songs.length) % songs.length; });
    }
  }

  function handleSongSelect(index) {
    setCurrentSongIndex(index);
    setProgress(0);
    setIsPlaying(true);
  }

  function handleProgressClick(e) {
    var rect = e.currentTarget.getBoundingClientRect();
    var ratio = (e.clientX - rect.left) / rect.width;
    setProgress(Math.floor(ratio * currentSong.duration));
  }

  var styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%)',
      color: '#e0e0e0',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      display: 'flex',
      flexDirection: 'column'
    },
    backLink: {
      color: '#888',
      textDecoration: 'none',
      padding: '15px 20px',
      display: 'inline-block',
      fontSize: '14px'
    },
    main: {
      display: 'flex',
      flex: 1,
      maxWidth: '1000px',
      width: '100%',
      margin: '0 auto',
      padding: '0 20px',
      gap: '30px',
      flexWrap: 'wrap'
    },
    sidebar: {
      flex: '1 1 300px',
      background: 'rgba(255,255,255,0.05)',
      borderRadius: '12px',
      padding: '20px',
      maxHeight: '500px',
      overflowY: 'auto'
    },
    sidebarTitle: {
      fontSize: '18px',
      fontWeight: 'bold',
      marginBottom: '15px',
      color: '#9b59b6'
    },
    songItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 12px',
      borderRadius: '8px',
      cursor: 'pointer',
      marginBottom: '4px',
      transition: 'background 0.2s'
    },
    songItemActive: {
      background: 'rgba(155, 89, 182, 0.3)'
    },
    songItemHover: {
      background: 'rgba(255,255,255,0.05)'
    },
    songInfo: {
      display: 'flex',
      flexDirection: 'column'
    },
    songTitle: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#fff'
    },
    songArtist: {
      fontSize: '12px',
      color: '#888',
      marginTop: '2px'
    },
    songDuration: {
      fontSize: '12px',
      color: '#888'
    },
    player: {
      flex: '1 1 400px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '30px'
    },
    albumArt: {
      width: '200px',
      height: '200px',
      borderRadius: '16px',
      background: 'linear-gradient(135deg, #9b59b6 0%, #3498db 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '60px',
      marginBottom: '25px',
      boxShadow: '0 10px 30px rgba(0,0,0,0.4)'
    },
    nowPlayingTitle: {
      fontSize: '22px',
      fontWeight: 'bold',
      color: '#fff',
      textAlign: 'center'
    },
    nowPlayingArtist: {
      fontSize: '15px',
      color: '#aaa',
      marginTop: '5px',
      textAlign: 'center'
    },
    nowPlayingAlbum: {
      fontSize: '13px',
      color: '#777',
      marginTop: '3px',
      textAlign: 'center'
    },
    progressContainer: {
      width: '100%',
      maxWidth: '400px',
      marginTop: '25px'
    },
    progressBar: {
      width: '100%',
      height: '6px',
      background: 'rgba(255,255,255,0.1)',
      borderRadius: '3px',
      cursor: 'pointer',
      position: 'relative'
    },
    progressFill: {
      height: '100%',
      background: 'linear-gradient(90deg, #9b59b6, #3498db)',
      borderRadius: '3px',
      transition: 'width 0.3s linear'
    },
    progressTime: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '12px',
      color: '#888',
      marginTop: '5px'
    },
    controls: {
      display: 'flex',
      alignItems: 'center',
      gap: '20px',
      marginTop: '20px'
    },
    controlBtn: {
      background: 'none',
      border: 'none',
      color: '#ccc',
      fontSize: '20px',
      cursor: 'pointer',
      padding: '8px',
      borderRadius: '50%',
      transition: 'color 0.2s'
    },
    controlBtnActive: {
      color: '#9b59b6'
    },
    playBtn: {
      background: 'linear-gradient(135deg, #9b59b6, #3498db)',
      border: 'none',
      color: '#fff',
      width: '56px',
      height: '56px',
      borderRadius: '50%',
      fontSize: '22px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      boxShadow: '0 4px 15px rgba(155, 89, 182, 0.4)'
    },
    volumeContainer: {
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
      marginTop: '20px',
      width: '100%',
      maxWidth: '300px'
    },
    volumeLabel: {
      fontSize: '16px',
      color: '#aaa'
    },
    volumeSlider: {
      flex: 1,
      WebkitAppearance: 'none',
      appearance: 'none',
      height: '5px',
      background: 'rgba(255,255,255,0.15)',
      borderRadius: '3px',
      outline: 'none',
      cursor: 'pointer'
    }
  };

  var progressPercent = currentSong.duration > 0 ? (progress / currentSong.duration) * 100 : 0;

  return React.createElement('div', { style: styles.container },
    React.createElement('a', { href: '/projects', style: styles.backLink }, '\u2190 Back to Projects'),
    React.createElement('h1', { style: { textAlign: 'center', fontSize: '28px', color: '#fff', margin: '0 0 30px' } }, 'Music Player'),
    React.createElement('div', { style: styles.main },
      React.createElement('div', { style: styles.sidebar },
        React.createElement('div', { style: styles.sidebarTitle }, 'Playlist (' + songs.length + ' songs)'),
        songs.map(function(song, index) {
          var isActive = index === currentSongIndex;
          var itemStyle = Object.assign({}, styles.songItem, isActive ? styles.songItemActive : {});
          return React.createElement('div', {
            key: song.id,
            style: itemStyle,
            onClick: function() { handleSongSelect(index); },
            onMouseEnter: function(e) { if (!isActive) e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; },
            onMouseLeave: function(e) { if (!isActive) e.currentTarget.style.background = 'transparent'; }
          },
            React.createElement('div', { style: styles.songInfo },
              React.createElement('div', { style: Object.assign({}, styles.songTitle, isActive ? { color: '#9b59b6' } : {}) },
                (isActive && isPlaying ? '\u266B ' : '') + song.title
              ),
              React.createElement('div', { style: styles.songArtist }, song.artist + ' - ' + song.album)
            ),
            React.createElement('div', { style: styles.songDuration }, formatTime(song.duration))
          );
        })
      ),
      React.createElement('div', { style: styles.player },
        React.createElement('div', { style: styles.albumArt }, '\u266B'),
        React.createElement('div', { style: styles.nowPlayingTitle }, currentSong.title),
        React.createElement('div', { style: styles.nowPlayingArtist }, currentSong.artist),
        React.createElement('div', { style: styles.nowPlayingAlbum }, currentSong.album),
        React.createElement('div', { style: styles.progressContainer },
          React.createElement('div', { style: styles.progressBar, onClick: handleProgressClick },
            React.createElement('div', { style: Object.assign({}, styles.progressFill, { width: progressPercent + '%' }) })
          ),
          React.createElement('div', { style: styles.progressTime },
            React.createElement('span', null, formatTime(progress)),
            React.createElement('span', null, formatTime(currentSong.duration))
          )
        ),
        React.createElement('div', { style: styles.controls },
          React.createElement('button', {
            style: Object.assign({}, styles.controlBtn, shuffle ? styles.controlBtnActive : {}),
            onClick: function() { setShuffle(function(s) { return !s; }); },
            title: 'Shuffle'
          }, '\u21C5'),
          React.createElement('button', {
            style: styles.controlBtn,
            onClick: handlePrev,
            title: 'Previous'
          }, '\u23EE'),
          React.createElement('button', {
            style: styles.playBtn,
            onClick: handlePlayPause,
            title: isPlaying ? 'Pause' : 'Play'
          }, isPlaying ? '\u23F8' : '\u25B6'),
          React.createElement('button', {
            style: styles.controlBtn,
            onClick: handleNext,
            title: 'Next'
          }, '\u23ED'),
          React.createElement('button', {
            style: Object.assign({}, styles.controlBtn, repeat ? styles.controlBtnActive : {}),
            onClick: function() { setRepeat(function(r) { return !r; }); },
            title: 'Repeat'
          }, '\u21BB')
        ),
        React.createElement('div', { style: styles.volumeContainer },
          React.createElement('span', { style: styles.volumeLabel }, volume === 0 ? '🔇' : '🔊'),
          React.createElement('input', {
            type: 'range',
            min: 0,
            max: 100,
            value: volume,
            onChange: function(e) { setVolume(Number(e.target.value)); },
            style: styles.volumeSlider
          }),
          React.createElement('span', { style: { fontSize: '12px', color: '#888' } }, volume + '%')
        )
      )
    )
  );
}

var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
