const { useState, useEffect, useRef } = React;

const App = () => {
  const [unit, setUnit] = useState('F');
  const [selectedCity, setSelectedCity] = useState(0);

  const cities = [
    {
      name: 'New York',
      country: 'USA',
      tempF: 72,
      condition: 'Sunny',
      emoji: '\u2600\uFE0F',
      humidity: 45,
      windMph: 8,
      forecast: [
        { day: 'Mon', tempF: 72, emoji: '\u2600\uFE0F' },
        { day: 'Tue', tempF: 68, emoji: '\u26C5' },
        { day: 'Wed', tempF: 65, emoji: '🌧\uFE0F' },
        { day: 'Thu', tempF: 70, emoji: '\u2600\uFE0F' },
        { day: 'Fri', tempF: 74, emoji: '\u2600\uFE0F' },
      ],
    },
    {
      name: 'London',
      country: 'UK',
      tempF: 58,
      condition: 'Cloudy',
      emoji: '\u2601\uFE0F',
      humidity: 78,
      windMph: 14,
      forecast: [
        { day: 'Mon', tempF: 58, emoji: '\u2601\uFE0F' },
        { day: 'Tue', tempF: 55, emoji: '🌧\uFE0F' },
        { day: 'Wed', tempF: 54, emoji: '🌧\uFE0F' },
        { day: 'Thu', tempF: 57, emoji: '\u2601\uFE0F' },
        { day: 'Fri', tempF: 60, emoji: '\u26C5' },
      ],
    },
    {
      name: 'Tokyo',
      country: 'Japan',
      tempF: 68,
      condition: 'Rainy',
      emoji: '🌧\uFE0F',
      humidity: 82,
      windMph: 11,
      forecast: [
        { day: 'Mon', tempF: 68, emoji: '🌧\uFE0F' },
        { day: 'Tue', tempF: 70, emoji: '\u26C5' },
        { day: 'Wed', tempF: 72, emoji: '\u2600\uFE0F' },
        { day: 'Thu', tempF: 69, emoji: '🌧\uFE0F' },
        { day: 'Fri', tempF: 67, emoji: '\u2601\uFE0F' },
      ],
    },
    {
      name: 'Dubai',
      country: 'UAE',
      tempF: 95,
      condition: 'Clear',
      emoji: '\u2600\uFE0F',
      humidity: 30,
      windMph: 6,
      forecast: [
        { day: 'Mon', tempF: 95, emoji: '\u2600\uFE0F' },
        { day: 'Tue', tempF: 97, emoji: '\u2600\uFE0F' },
        { day: 'Wed', tempF: 94, emoji: '\u2600\uFE0F' },
        { day: 'Thu', tempF: 96, emoji: '\u2600\uFE0F' },
        { day: 'Fri', tempF: 93, emoji: '\u26C5' },
      ],
    },
    {
      name: 'Paris',
      country: 'France',
      tempF: 62,
      condition: 'Partly Cloudy',
      emoji: '\u26C5',
      humidity: 65,
      windMph: 10,
      forecast: [
        { day: 'Mon', tempF: 62, emoji: '\u26C5' },
        { day: 'Tue', tempF: 64, emoji: '\u2600\uFE0F' },
        { day: 'Wed', tempF: 60, emoji: '\u2601\uFE0F' },
        { day: 'Thu', tempF: 58, emoji: '🌧\uFE0F' },
        { day: 'Fri', tempF: 63, emoji: '\u26C5' },
      ],
    },
  ];

  const toC = (f) => Math.round((f - 32) * 5 / 9);
  const displayTemp = (f) => unit === 'F' ? f + '\u00B0F' : toC(f) + '\u00B0C';
  const toKmh = (mph) => Math.round(mph * 1.609);

  const current = cities[selectedCity];

  const getConditionGradient = (condition) => {
    switch (condition) {
      case 'Sunny':
      case 'Clear': return 'linear-gradient(135deg, rgba(251, 191, 36, 0.15), rgba(245, 158, 11, 0.05))';
      case 'Cloudy': return 'linear-gradient(135deg, rgba(148, 163, 184, 0.15), rgba(100, 116, 139, 0.05))';
      case 'Rainy': return 'linear-gradient(135deg, rgba(96, 165, 250, 0.15), rgba(59, 130, 246, 0.05))';
      case 'Partly Cloudy': return 'linear-gradient(135deg, rgba(196, 181, 253, 0.15), rgba(139, 92, 246, 0.05))';
      default: return 'rgba(255,255,255,0.05)';
    }
  };

  const styles = {
    wrapper: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%)',
      fontFamily: "'Inter', 'Segoe UI', system-ui, -apple-system, sans-serif",
      padding: '20px',
      boxSizing: 'border-box',
    },
    backLink: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '8px',
      color: '#8b8bc4',
      textDecoration: 'none',
      fontSize: '14px',
      marginBottom: '30px',
      transition: 'color 0.2s',
    },
    container: {
      maxWidth: '700px',
      margin: '0 auto',
    },
    header: {
      textAlign: 'center',
      marginBottom: '30px',
    },
    title: {
      fontSize: '42px',
      fontWeight: '700',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      margin: '0 0 8px 0',
    },
    subtitle: {
      color: '#6b6b9e',
      fontSize: '16px',
      margin: 0,
    },
    unitToggle: {
      display: 'flex',
      justifyContent: 'center',
      gap: '4px',
      marginBottom: '24px',
      background: 'rgba(255,255,255,0.05)',
      borderRadius: '12px',
      padding: '4px',
      width: 'fit-content',
      margin: '0 auto 24px auto',
    },
    unitBtn: (active) => ({
      padding: '8px 20px',
      borderRadius: '10px',
      border: 'none',
      background: active ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'transparent',
      color: active ? '#fff' : '#8b8bc4',
      fontSize: '14px',
      fontWeight: '600',
      cursor: 'pointer',
      transition: 'all 0.2s',
    }),
    mainCard: {
      background: getConditionGradient(current.condition),
      backdropFilter: 'blur(20px)',
      borderRadius: '24px',
      border: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '36px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
      marginBottom: '20px',
      textAlign: 'center',
      transition: 'all 0.4s ease',
    },
    mainEmoji: {
      fontSize: '72px',
      marginBottom: '12px',
      filter: 'drop-shadow(0 4px 20px rgba(0,0,0,0.3))',
    },
    mainCity: {
      fontSize: '28px',
      fontWeight: '700',
      color: '#fff',
      margin: '0 0 4px 0',
    },
    mainCountry: {
      fontSize: '14px',
      color: '#8b8bc4',
      margin: '0 0 16px 0',
    },
    mainTemp: {
      fontSize: '64px',
      fontWeight: '200',
      color: '#fff',
      margin: '0 0 8px 0',
      lineHeight: 1,
    },
    mainCondition: {
      fontSize: '18px',
      color: '#b0b0e0',
      margin: '0 0 24px 0',
    },
    statsRow: {
      display: 'flex',
      justifyContent: 'center',
      gap: '40px',
    },
    statItem: {
      textAlign: 'center',
    },
    statLabel: {
      fontSize: '12px',
      color: '#6b6b9e',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      marginBottom: '4px',
    },
    statValue: {
      fontSize: '20px',
      fontWeight: '600',
      color: '#e0e0ff',
    },
    forecastBar: {
      display: 'flex',
      gap: '8px',
      marginTop: '24px',
      justifyContent: 'center',
    },
    forecastDay: {
      flex: 1,
      maxWidth: '90px',
      background: 'rgba(255,255,255,0.05)',
      borderRadius: '14px',
      padding: '14px 8px',
      textAlign: 'center',
      border: '1px solid rgba(255,255,255,0.04)',
    },
    forecastDayLabel: {
      fontSize: '12px',
      color: '#6b6b9e',
      marginBottom: '8px',
      fontWeight: '500',
    },
    forecastEmoji: {
      fontSize: '24px',
      marginBottom: '8px',
      display: 'block',
    },
    forecastTemp: {
      fontSize: '15px',
      color: '#e0e0ff',
      fontWeight: '600',
    },
    citiesGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
      gap: '10px',
    },
    cityCard: (isActive) => ({
      background: isActive ? 'rgba(102, 126, 234, 0.15)' : 'rgba(255,255,255,0.04)',
      backdropFilter: 'blur(10px)',
      borderRadius: '16px',
      border: isActive ? '1px solid rgba(102, 126, 234, 0.3)' : '1px solid rgba(255,255,255,0.06)',
      padding: '18px 14px',
      textAlign: 'center',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
    }),
    cityEmoji: {
      fontSize: '28px',
      marginBottom: '8px',
      display: 'block',
    },
    cityName: {
      fontSize: '14px',
      fontWeight: '600',
      color: '#e0e0ff',
      margin: '0 0 4px 0',
    },
    cityTemp: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#fff',
      margin: '0 0 2px 0',
    },
    cityCondition: {
      fontSize: '11px',
      color: '#6b6b9e',
    },
  };

  return React.createElement('div', { style: styles.wrapper },
    React.createElement('style', null, `
      .back-link:hover { color: #a5a5e0 !important; }
      .city-card:hover { background: rgba(102, 126, 234, 0.1) !important; transform: translateY(-2px); }
    `),
    React.createElement('div', { style: styles.container },
      React.createElement('a', {
        href: '/projects',
        style: styles.backLink,
        className: 'back-link',
      }, '\u2190 Back to Projects'),
      React.createElement('div', { style: styles.header },
        React.createElement('h1', { style: styles.title }, 'Weather'),
        React.createElement('p', { style: styles.subtitle }, 'Global weather at a glance')
      ),
      React.createElement('div', { style: styles.unitToggle },
        React.createElement('button', {
          style: styles.unitBtn(unit === 'F'),
          onClick: () => setUnit('F'),
        }, '\u00B0F'),
        React.createElement('button', {
          style: styles.unitBtn(unit === 'C'),
          onClick: () => setUnit('C'),
        }, '\u00B0C')
      ),
      React.createElement('div', { style: styles.mainCard },
        React.createElement('div', { style: styles.mainEmoji }, current.emoji),
        React.createElement('h2', { style: styles.mainCity }, current.name),
        React.createElement('p', { style: styles.mainCountry }, current.country),
        React.createElement('div', { style: styles.mainTemp }, displayTemp(current.tempF)),
        React.createElement('p', { style: styles.mainCondition }, current.condition),
        React.createElement('div', { style: styles.statsRow },
          React.createElement('div', { style: styles.statItem },
            React.createElement('div', { style: styles.statLabel }, 'Humidity'),
            React.createElement('div', { style: styles.statValue }, current.humidity + '%')
          ),
          React.createElement('div', { style: styles.statItem },
            React.createElement('div', { style: styles.statLabel }, 'Wind'),
            React.createElement('div', { style: styles.statValue },
              unit === 'F' ? current.windMph + ' mph' : toKmh(current.windMph) + ' km/h'
            )
          ),
          React.createElement('div', { style: styles.statItem },
            React.createElement('div', { style: styles.statLabel }, 'Feels Like'),
            React.createElement('div', { style: styles.statValue },
              displayTemp(current.tempF + (current.humidity > 70 ? 3 : -2))
            )
          )
        ),
        React.createElement('div', { style: styles.forecastBar },
          current.forecast.map((day, i) =>
            React.createElement('div', { key: i, style: styles.forecastDay },
              React.createElement('div', { style: styles.forecastDayLabel }, day.day),
              React.createElement('span', { style: styles.forecastEmoji }, day.emoji),
              React.createElement('div', { style: styles.forecastTemp }, displayTemp(day.tempF))
            )
          )
        )
      ),
      React.createElement('div', { style: styles.citiesGrid },
        cities.map((city, idx) =>
          React.createElement('div', {
            key: idx,
            style: styles.cityCard(selectedCity === idx),
            className: 'city-card',
            onClick: () => setSelectedCity(idx),
          },
            React.createElement('span', { style: styles.cityEmoji }, city.emoji),
            React.createElement('div', { style: styles.cityName }, city.name),
            React.createElement('div', { style: styles.cityTemp }, displayTemp(city.tempF)),
            React.createElement('div', { style: styles.cityCondition }, city.condition)
          )
        )
      )
    )
  );
};

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
