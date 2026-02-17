const { useState, useMemo } = React;

var movies = [
  { id: 1, title: 'Stellar Odyssey', year: 2024, genre: 'Sci-Fi', rating: 8.7, description: 'A crew of astronauts embarks on a perilous journey beyond our solar system to find a new home for humanity. Along the way they encounter phenomena that challenge everything they know about physics and existence.', director: 'Elena Vasquez', duration: '2h 28m' },
  { id: 2, title: 'Shadow Protocol', year: 2023, genre: 'Action', rating: 7.9, description: 'A retired intelligence operative is pulled back into the world of espionage when a ghost from her past threatens global security. Packed with breathtaking stunts and twists.', director: 'Marcus Chen', duration: '2h 12m' },
  { id: 3, title: 'The Last Laugh', year: 2025, genre: 'Comedy', rating: 8.1, description: 'A struggling stand-up comedian discovers that the audience at a mysterious comedy club literally cannot stop laughing. A hilarious yet touching exploration of what makes us human.', director: 'Sophie Martin', duration: '1h 48m' },
  { id: 4, title: 'Crimson Depths', year: 2024, genre: 'Horror', rating: 7.4, description: 'Marine biologists exploring an uncharted trench discover an ancient creature that has been waiting in the darkness for millennia. Terror lurks in every shadow of the deep.', director: 'Jake Morrison', duration: '1h 55m' },
  { id: 5, title: 'Echoes of Tomorrow', year: 2025, genre: 'Drama', rating: 9.1, description: 'An elderly musician with dementia relives the defining moments of her life through her music. A profound meditation on memory, love, and the power of art.', director: 'Akira Tanaka', duration: '2h 15m' },
  { id: 6, title: 'Velocity', year: 2023, genre: 'Action', rating: 7.6, description: 'An underground street racer must outrun a corrupt police force and rival gangs to deliver a package that could expose a massive conspiracy.', director: 'Luis Rodriguez', duration: '2h 05m' },
  { id: 7, title: 'Quantum Ghost', year: 2024, genre: 'Sci-Fi', rating: 8.3, description: 'When a quantum computing experiment goes wrong, a physicist finds herself existing in multiple realities simultaneously, each with different versions of the people she loves.', director: 'Nina Patel', duration: '2h 20m' },
  { id: 8, title: 'Wedding Crashers Club', year: 2025, genre: 'Comedy', rating: 7.2, description: 'Four friends start a business crashing weddings to help the bride or groom realize they are making a mistake. Chaos and romance ensue at every ceremony.', director: 'Tom Anderson', duration: '1h 52m' },
  { id: 9, title: 'The Reckoning', year: 2023, genre: 'Drama', rating: 8.5, description: 'A small-town lawyer takes on a powerful corporation poisoning the local water supply. Based on inspiring true events of courage against overwhelming odds.', director: 'Rachel Kim', duration: '2h 32m' },
  { id: 10, title: 'Nightmare Alley: Reborn', year: 2024, genre: 'Horror', rating: 7.8, description: 'A traveling carnival harbors dark secrets. When a young journalist investigates the disappearance of several visitors, she uncovers horrors beyond imagination.', director: 'David Crow', duration: '2h 01m' },
  { id: 11, title: 'Mars Rising', year: 2025, genre: 'Sci-Fi', rating: 8.0, description: 'The first colonists on Mars face an existential crisis when they discover evidence of ancient intelligent life beneath the planet surface. Everything they planned changes overnight.', director: 'Sarah Liu', duration: '2h 40m' },
  { id: 12, title: 'Fists of Fury 2', year: 2024, genre: 'Action', rating: 7.1, description: 'A martial arts champion enters an underground tournament to save her kidnapped brother. Each round brings more dangerous opponents and darker revelations about the organizers.', director: 'Kenji Watanabe', duration: '1h 58m' },
  { id: 13, title: 'Love in Rewind', year: 2023, genre: 'Comedy', rating: 7.8, description: 'A couple experiencing relationship troubles finds a mysterious remote that can rewind time. They attempt to fix every argument, only to create increasingly absurd situations.', director: 'Mia Collins', duration: '1h 45m' },
  { id: 14, title: 'Whispers in the Dark', year: 2025, genre: 'Horror', rating: 8.2, description: 'After moving into a centuries-old mansion, a family begins hearing whispers that reveal terrifying truths about the previous inhabitants and the house dark history.', director: 'Robert Black', duration: '2h 10m' },
  { id: 15, title: 'The Bridge', year: 2024, genre: 'Drama', rating: 8.8, description: 'Two families on opposite sides of a border form an unlikely bond when both face personal tragedies. A powerful story about empathy, connection, and shared humanity.', director: 'Carmen Diaz', duration: '2h 18m' }
];

var genres = ['All', 'Action', 'Comedy', 'Drama', 'Sci-Fi', 'Horror'];

function App() {
  const [search, setSearch] = useState('');
  const [genre, setGenre] = useState('All');
  const [sortBy, setSortBy] = useState('rating');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedMovie, setSelectedMovie] = useState(null);

  var filtered = useMemo(function() {
    var result = movies.filter(function(m) {
      var matchesSearch = m.title.toLowerCase().includes(search.toLowerCase());
      var matchesGenre = genre === 'All' || m.genre === genre;
      return matchesSearch && matchesGenre;
    });
    result.sort(function(a, b) {
      if (sortBy === 'rating') return b.rating - a.rating;
      return b.year - a.year;
    });
    return result;
  }, [search, genre, sortBy]);

  var ratingColor = function(r) {
    if (r >= 8.5) return '#22c55e';
    if (r >= 7.5) return '#f59e0b';
    return '#ef4444';
  };

  var genreColor = function(g) {
    var colors = { Action: '#ef4444', Comedy: '#f59e0b', Drama: '#3b82f6', 'Sci-Fi': '#8b5cf6', Horror: '#ec4899' };
    return colors[g] || '#6366f1';
  };

  var styles = {
    container: { minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%)', color: '#e0e0ff', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", padding: '20px' },
    backLink: { color: '#8888ff', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '20px' },
    title: { textAlign: 'center', fontSize: '32px', marginBottom: '10px', color: '#ffffff' },
    subtitle: { textAlign: 'center', fontSize: '16px', color: '#aaa', marginBottom: '25px' },
    controls: { maxWidth: '1000px', margin: '0 auto 25px', display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' },
    searchInput: { flex: 1, minWidth: '200px', padding: '10px 16px', fontSize: '14px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', color: '#e0e0ff', outline: 'none' },
    filterBtn: { padding: '8px 16px', fontSize: '13px', border: '2px solid transparent', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold', transition: 'all 0.3s' },
    sortSelect: { padding: '10px 16px', fontSize: '14px', background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', color: '#e0e0ff', outline: 'none' },
    viewToggle: { display: 'flex', gap: '4px' },
    viewBtn: { padding: '8px 12px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '14px' },
    grid: { maxWidth: '1000px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '20px' },
    list: { maxWidth: '1000px', margin: '0 auto' },
    movieCard: { background: 'rgba(255,255,255,0.06)', borderRadius: '14px', padding: '20px', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', transition: 'all 0.3s' },
    movieListItem: { background: 'rgba(255,255,255,0.06)', borderRadius: '14px', padding: '20px', marginBottom: '12px', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', display: 'flex', gap: '20px', alignItems: 'center', transition: 'all 0.3s' },
    posterPlaceholder: { width: '100%', height: '160px', background: 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.3))', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '40px', marginBottom: '14px' },
    posterSmall: { width: '80px', height: '100px', background: 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.3))', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: 0 },
    movieTitle: { fontSize: '18px', fontWeight: 'bold', color: '#fff', marginBottom: '6px' },
    movieMeta: { display: 'flex', gap: '10px', alignItems: 'center', marginBottom: '8px', flexWrap: 'wrap' },
    badge: { padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold' },
    ratingBadge: { fontSize: '14px', fontWeight: 'bold' },
    overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' },
    modal: { background: 'linear-gradient(135deg, #0f0f2e, #1a1a3e)', borderRadius: '20px', padding: '30px', maxWidth: '600px', width: '100%', maxHeight: '80vh', overflow: 'auto', border: '1px solid rgba(255,255,255,0.15)' },
    closeBtn: { background: 'rgba(255,255,255,0.1)', border: 'none', color: '#aaa', fontSize: '20px', cursor: 'pointer', borderRadius: '50%', width: '36px', height: '36px', display: 'flex', alignItems: 'center', justifyContent: 'center' },
    count: { textAlign: 'center', color: '#666', marginBottom: '20px', fontSize: '14px' }
  };

  var filmIcon = '\u25B6';

  return React.createElement('div', { style: styles.container },
    selectedMovie && React.createElement('div', { style: styles.overlay, onClick: function() { setSelectedMovie(null); } },
      React.createElement('div', { style: styles.modal, onClick: function(e) { e.stopPropagation(); } },
        React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '20px' } },
          React.createElement('div', null,
            React.createElement('h2', { style: { fontSize: '26px', color: '#fff', marginBottom: '6px' } }, selectedMovie.title),
            React.createElement('div', { style: { color: '#888', fontSize: '14px' } }, 'Directed by ' + selectedMovie.director)
          ),
          React.createElement('button', { onClick: function() { setSelectedMovie(null); }, style: styles.closeBtn }, '\u2715')
        ),
        React.createElement('div', { style: { width: '100%', height: '200px', background: 'linear-gradient(135deg, rgba(99,102,241,0.3), rgba(139,92,246,0.3))', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '60px', marginBottom: '20px' } }, filmIcon),
        React.createElement('div', { style: { display: 'flex', gap: '12px', marginBottom: '20px', flexWrap: 'wrap', alignItems: 'center' } },
          React.createElement('span', { style: Object.assign({}, styles.badge, { background: genreColor(selectedMovie.genre) + '30', color: genreColor(selectedMovie.genre) }) }, selectedMovie.genre),
          React.createElement('span', { style: { color: '#aaa' } }, selectedMovie.year),
          React.createElement('span', { style: { color: '#aaa' } }, selectedMovie.duration),
          React.createElement('span', { style: Object.assign({}, styles.ratingBadge, { color: ratingColor(selectedMovie.rating) }) }, '\u2605 ' + selectedMovie.rating)
        ),
        React.createElement('p', { style: { fontSize: '15px', lineHeight: '1.8', color: '#c0c0e0' } }, selectedMovie.description)
      )
    ),

    React.createElement('a', { href: '/projects', style: styles.backLink }, '\u2190 Back to Projects'),
    React.createElement('h1', { style: styles.title }, 'Movie Database'),
    React.createElement('p', { style: styles.subtitle }, 'Browse, search, and filter movies'),

    React.createElement('div', { style: styles.controls },
      React.createElement('input', { type: 'text', placeholder: 'Search movies...', value: search, onChange: function(e) { setSearch(e.target.value); }, style: styles.searchInput }),
      genres.map(function(g) {
        var active = genre === g;
        return React.createElement('button', {
          key: g,
          onClick: function() { setGenre(g); },
          style: Object.assign({}, styles.filterBtn, {
            background: active ? genreColor(g === 'All' ? '' : g) + '30' : 'rgba(255,255,255,0.06)',
            color: active ? (g === 'All' ? '#8b5cf6' : genreColor(g)) : '#888',
            borderColor: active ? (g === 'All' ? '#8b5cf6' : genreColor(g)) : 'transparent'
          })
        }, g);
      }),
      React.createElement('select', { value: sortBy, onChange: function(e) { setSortBy(e.target.value); }, style: styles.sortSelect },
        React.createElement('option', { value: 'rating' }, 'Sort by Rating'),
        React.createElement('option', { value: 'year' }, 'Sort by Year')
      ),
      React.createElement('div', { style: styles.viewToggle },
        React.createElement('button', { onClick: function() { setViewMode('grid'); }, style: Object.assign({}, styles.viewBtn, { background: viewMode === 'grid' ? '#6366f1' : 'rgba(255,255,255,0.1)', color: viewMode === 'grid' ? '#fff' : '#888' }) }, 'Grid'),
        React.createElement('button', { onClick: function() { setViewMode('list'); }, style: Object.assign({}, styles.viewBtn, { background: viewMode === 'list' ? '#6366f1' : 'rgba(255,255,255,0.1)', color: viewMode === 'list' ? '#fff' : '#888' }) }, 'List')
      )
    ),

    React.createElement('div', { style: styles.count }, filtered.length + ' movie' + (filtered.length !== 1 ? 's' : '') + ' found'),

    viewMode === 'grid' ? React.createElement('div', { style: styles.grid },
      filtered.map(function(m) {
        return React.createElement('div', { key: m.id, style: styles.movieCard, onClick: function() { setSelectedMovie(m); } },
          React.createElement('div', { style: styles.posterPlaceholder }, filmIcon),
          React.createElement('div', { style: styles.movieTitle }, m.title),
          React.createElement('div', { style: styles.movieMeta },
            React.createElement('span', { style: Object.assign({}, styles.badge, { background: genreColor(m.genre) + '30', color: genreColor(m.genre) }) }, m.genre),
            React.createElement('span', { style: { color: '#888', fontSize: '13px' } }, m.year),
            React.createElement('span', { style: Object.assign({}, styles.ratingBadge, { color: ratingColor(m.rating) }) }, '\u2605 ' + m.rating)
          )
        );
      })
    ) : React.createElement('div', { style: styles.list },
      filtered.map(function(m) {
        return React.createElement('div', { key: m.id, style: styles.movieListItem, onClick: function() { setSelectedMovie(m); } },
          React.createElement('div', { style: styles.posterSmall }, filmIcon),
          React.createElement('div', { style: { flex: 1 } },
            React.createElement('div', { style: styles.movieTitle }, m.title),
            React.createElement('div', { style: styles.movieMeta },
              React.createElement('span', { style: Object.assign({}, styles.badge, { background: genreColor(m.genre) + '30', color: genreColor(m.genre) }) }, m.genre),
              React.createElement('span', { style: { color: '#888', fontSize: '13px' } }, m.year),
              React.createElement('span', { style: { color: '#888', fontSize: '13px' } }, m.duration)
            )
          ),
          React.createElement('span', { style: Object.assign({}, styles.ratingBadge, { color: ratingColor(m.rating), fontSize: '18px' }) }, '\u2605 ' + m.rating)
        );
      })
    )
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
