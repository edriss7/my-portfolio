const { useState, useEffect, useRef } = React;

var images = [
  { id: 1, label: 'Mountain Sunrise', gradient: 'linear-gradient(135deg, #ff6b35, #f7c948)' },
  { id: 2, label: 'Ocean Waves', gradient: 'linear-gradient(135deg, #0077b6, #00e5ff)' },
  { id: 3, label: 'Forest Path', gradient: 'linear-gradient(135deg, #2d6a4f, #95d5b2)' },
  { id: 4, label: 'Desert Dunes', gradient: 'linear-gradient(135deg, #e09f3e, #9e2a2b)' },
  { id: 5, label: 'Northern Lights', gradient: 'linear-gradient(135deg, #7209b7, #4cc9f0)' },
  { id: 6, label: 'Cherry Blossoms', gradient: 'linear-gradient(135deg, #ff69b4, #ffb3d1)' },
  { id: 7, label: 'City Skyline', gradient: 'linear-gradient(135deg, #1a1a2e, #6c63ff)' },
  { id: 8, label: 'Autumn Leaves', gradient: 'linear-gradient(135deg, #d35400, #f39c12)' },
  { id: 9, label: 'Snowy Peaks', gradient: 'linear-gradient(135deg, #b0c4de, #ffffff)' },
  { id: 10, label: 'Tropical Beach', gradient: 'linear-gradient(135deg, #00bfa5, #e0f7fa)' },
  { id: 11, label: 'Starry Night', gradient: 'linear-gradient(135deg, #0d1b2a, #1b263b)' },
  { id: 12, label: 'Lavender Fields', gradient: 'linear-gradient(135deg, #6a0dad, #d8b4fe)' },
];

var styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%)',
    color: '#e0e0e0',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    padding: '20px',
  },
  backLink: {
    color: '#7eb8ff',
    textDecoration: 'none',
    fontSize: '14px',
    display: 'inline-block',
    marginBottom: '20px',
  },
  title: {
    textAlign: 'center',
    fontSize: '2rem',
    color: '#ffffff',
    marginBottom: '30px',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
    gap: '16px',
    maxWidth: '1000px',
    margin: '0 auto',
  },
  imageCard: {
    borderRadius: '12px',
    overflow: 'hidden',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    boxShadow: '0 4px 16px rgba(0,0,0,0.3)',
  },
  imagePlaceholder: {
    width: '100%',
    height: '180px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  imageLabel: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#fff',
    textShadow: '0 2px 8px rgba(0,0,0,0.5)',
    textAlign: 'center',
    padding: '0 10px',
  },
  imageFooter: {
    padding: '10px 14px',
    background: 'rgba(255,255,255,0.06)',
    fontSize: '13px',
    color: '#aaa',
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.9)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1000,
  },
  lightboxContent: {
    position: 'relative',
    maxWidth: '90vw',
    maxHeight: '90vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  lightboxImage: {
    width: '70vw',
    height: '60vh',
    maxWidth: '800px',
    borderRadius: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lightboxLabel: {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#fff',
    textShadow: '0 2px 12px rgba(0,0,0,0.5)',
  },
  lightboxInfo: {
    marginTop: '16px',
    textAlign: 'center',
  },
  lightboxTitle: {
    fontSize: '1.3rem',
    color: '#fff',
    marginBottom: '6px',
  },
  lightboxCounter: {
    color: '#aaa',
    fontSize: '14px',
  },
  closeBtn: {
    position: 'absolute',
    top: '-40px',
    right: '0',
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    background: 'rgba(255,255,255,0.15)',
    color: '#fff',
    fontSize: '20px',
    cursor: 'pointer',
  },
  navBtn: {
    position: 'absolute',
    top: '50%',
    transform: 'translateY(-50%)',
    padding: '16px 20px',
    borderRadius: '50%',
    border: 'none',
    background: 'rgba(255,255,255,0.15)',
    color: '#fff',
    fontSize: '24px',
    cursor: 'pointer',
    zIndex: 10,
  },
  prevBtn: {
    left: '-60px',
  },
  nextBtn: {
    right: '-60px',
  },
};

function App() {
  var _lightbox = useState(null);
  var lightboxIdx = _lightbox[0], setLightboxIdx = _lightbox[1];
  var _hovered = useState(null);
  var hovered = _hovered[0], setHovered = _hovered[1];

  function openLightbox(idx) {
    setLightboxIdx(idx);
  }

  function closeLightbox() {
    setLightboxIdx(null);
  }

  function goNext() {
    setLightboxIdx(function (prev) { return (prev + 1) % images.length; });
  }

  function goPrev() {
    setLightboxIdx(function (prev) { return prev > 0 ? prev - 1 : images.length - 1; });
  }

  useEffect(function () {
    function handleKey(e) {
      if (lightboxIdx === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') goNext();
      if (e.key === 'ArrowLeft') goPrev();
    }
    window.addEventListener('keydown', handleKey);
    return function () { window.removeEventListener('keydown', handleKey); };
  }, [lightboxIdx]);

  return React.createElement('div', { style: styles.container },
    React.createElement('a', { href: '/projects', style: styles.backLink }, '\u2190 Back to Projects'),
    React.createElement('h1', { style: styles.title }, '\ud83d\uddbc Image Gallery'),
    React.createElement('div', { style: styles.grid },
      images.map(function (img, idx) {
        var isHovered = hovered === idx;
        return React.createElement('div', {
          key: img.id,
          style: Object.assign({}, styles.imageCard, isHovered ? {
            transform: 'scale(1.03)',
            boxShadow: '0 8px 30px rgba(124,77,255,0.3)',
          } : {}),
          onClick: function () { openLightbox(idx); },
          onMouseEnter: function () { setHovered(idx); },
          onMouseLeave: function () { setHovered(null); },
        },
          React.createElement('div', {
            style: Object.assign({}, styles.imagePlaceholder, { background: img.gradient }),
          },
            React.createElement('span', { style: styles.imageLabel }, img.label)
          ),
          React.createElement('div', { style: styles.imageFooter }, 'Image ' + img.id + ' of ' + images.length)
        );
      })
    ),
    lightboxIdx !== null && React.createElement('div', {
      style: styles.overlay,
      onClick: function (e) { if (e.target === e.currentTarget) closeLightbox(); },
    },
      React.createElement('div', { style: styles.lightboxContent },
        React.createElement('button', {
          style: styles.closeBtn,
          onClick: closeLightbox,
        }, '\u2715'),
        React.createElement('button', {
          style: Object.assign({}, styles.navBtn, styles.prevBtn),
          onClick: goPrev,
        }, '\u2039'),
        React.createElement('div', {
          style: Object.assign({}, styles.lightboxImage, {
            background: images[lightboxIdx].gradient,
          }),
        },
          React.createElement('span', { style: styles.lightboxLabel }, images[lightboxIdx].label)
        ),
        React.createElement('button', {
          style: Object.assign({}, styles.navBtn, styles.nextBtn),
          onClick: goNext,
        }, '\u203a'),
        React.createElement('div', { style: styles.lightboxInfo },
          React.createElement('div', { style: styles.lightboxTitle }, images[lightboxIdx].label),
          React.createElement('div', { style: styles.lightboxCounter },
            (lightboxIdx + 1) + ' of ' + images.length
          )
        )
      )
    )
  );
}

var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
