const { useState, useEffect, useRef } = React;

var skills = [
  { name: 'React', level: 92 },
  { name: 'JavaScript', level: 88 },
  { name: 'TypeScript', level: 82 },
  { name: 'Node.js', level: 78 },
  { name: 'Python', level: 70 },
  { name: 'CSS/Design', level: 85 }
];

var projects = [
  { title: 'E-Commerce Platform', desc: 'Full-stack online store with cart, payments, and admin dashboard.', tags: ['React', 'Node.js', 'PostgreSQL'], color: '#bd93f9' },
  { title: 'Task Management App', desc: 'Kanban-style project manager with real-time collaboration features.', tags: ['TypeScript', 'Socket.io', 'MongoDB'], color: '#ff79c6' },
  { title: 'Weather Dashboard', desc: 'Beautiful weather app with 5-day forecasts and location search.', tags: ['React', 'API', 'Charts'], color: '#50fa7b' },
  { title: 'Chat Application', desc: 'Real-time messaging app with rooms, file sharing, and notifications.', tags: ['WebSocket', 'Express', 'Redis'], color: '#8be9fd' },
  { title: 'Portfolio Generator', desc: 'CLI tool that generates beautiful portfolio sites from a JSON config.', tags: ['Node.js', 'CLI', 'Templates'], color: '#ffb86c' },
  { title: 'Fitness Tracker', desc: 'Mobile-first fitness app with workout logging and progress charts.', tags: ['React Native', 'Firebase'], color: '#f1fa8c' }
];

var navLinks = ['Home', 'About', 'Skills', 'Projects', 'Contact'];

function App() {
  var _s = useState('');
  var activeSection = _s[0]; var setActiveSection = _s[1];
  var _s2 = useState(false);
  var menuOpen = _s2[0]; var setMenuOpen = _s2[1];
  var _s3 = useState({ name: '', email: '', message: '' });
  var form = _s3[0]; var setForm = _s3[1];
  var _s4 = useState(false);
  var sent = _s4[0]; var setSent = _s4[1];
  var _s5 = useState(-1);
  var hoverProject = _s5[0]; var setHoverProject = _s5[1];

  var scrollTo = function(id) {
    var el = document.getElementById(id.toLowerCase());
    if (el) el.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  var containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%)',
    color: '#e0e0e0',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
  };
  var backLinkStyle = { color: '#8be9fd', textDecoration: 'none', fontSize: '14px' };

  var navStyle = {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
    background: 'rgba(10,10,26,0.9)', backdropFilter: 'blur(10px)',
    padding: '12px 24px',
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    borderBottom: '1px solid rgba(255,255,255,0.06)'
  };

  var sectionStyle = { padding: '80px 24px', maxWidth: '900px', margin: '0 auto' };
  var headingStyle = { fontSize: '28px', color: '#fff', marginBottom: '8px' };
  var subStyle = { color: '#888', fontSize: '14px', marginBottom: '32px' };
  var accentLine = { width: '50px', height: '3px', background: 'linear-gradient(90deg, #bd93f9, #ff79c6)', borderRadius: '2px', marginBottom: '24px' };

  var inputStyle = {
    width: '100%', padding: '12px 14px',
    background: 'rgba(255,255,255,0.08)',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '8px', color: '#e0e0e0', fontSize: '14px',
    outline: 'none', boxSizing: 'border-box', marginBottom: '12px'
  };

  return React.createElement('div', { style: containerStyle },
    React.createElement('nav', { style: navStyle },
      React.createElement('div', { style: { display: 'flex', alignItems: 'center', gap: '16px' } },
        React.createElement('a', { href: '/projects', style: backLinkStyle }, '\u2190 Back to Projects'),
        React.createElement('span', { style: { color: '#bd93f9', fontWeight: 'bold', fontSize: '18px' } }, 'JD')
      ),
      React.createElement('div', { style: { display: 'flex', gap: '24px' } },
        navLinks.map(function(link) {
          return React.createElement('span', {
            key: link,
            onClick: function() { scrollTo(link); },
            style: { color: '#aaa', cursor: 'pointer', fontSize: '14px', transition: 'color 0.2s' }
          }, link);
        })
      )
    ),

    React.createElement('div', { id: 'home', style: { paddingTop: '100px', textAlign: 'center', padding: '160px 24px 80px' } },
      React.createElement('div', { style: {
        width: '100px', height: '100px', borderRadius: '50%', margin: '0 auto 24px',
        background: 'linear-gradient(135deg, #bd93f9, #ff79c6)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '36px', fontWeight: 'bold', color: '#fff'
      } }, 'JD'),
      React.createElement('h1', { style: { fontSize: '42px', color: '#fff', marginBottom: '12px' } }, 'Jane Developer'),
      React.createElement('p', { style: { fontSize: '18px', color: '#bd93f9', marginBottom: '16px' } }, 'Full-Stack Developer & UI Designer'),
      React.createElement('p', { style: { fontSize: '15px', color: '#888', maxWidth: '500px', margin: '0 auto 32px', lineHeight: '1.6' } },
        'I build beautiful, performant web applications with modern technologies. Passionate about clean code and great user experiences.'
      ),
      React.createElement('div', { style: { display: 'flex', gap: '12px', justifyContent: 'center' } },
        React.createElement('button', { onClick: function() { scrollTo('Projects'); }, style: {
          padding: '12px 28px', background: 'linear-gradient(135deg, #bd93f9, #ff79c6)',
          border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px'
        } }, 'View My Work'),
        React.createElement('button', { onClick: function() { scrollTo('Contact'); }, style: {
          padding: '12px 28px', background: 'transparent',
          border: '1px solid rgba(255,255,255,0.2)', borderRadius: '8px', color: '#aaa', cursor: 'pointer', fontSize: '14px'
        } }, 'Get In Touch')
      )
    ),

    React.createElement('div', { id: 'about', style: sectionStyle },
      React.createElement('div', { style: accentLine }),
      React.createElement('h2', { style: headingStyle }, 'About Me'),
      React.createElement('p', { style: { color: '#aaa', lineHeight: '1.8', fontSize: '15px', marginBottom: '16px' } },
        'With over 5 years of experience in web development, I specialize in building scalable applications using React, Node.js, and modern cloud infrastructure. I love turning complex problems into simple, elegant solutions.'
      ),
      React.createElement('p', { style: { color: '#aaa', lineHeight: '1.8', fontSize: '15px' } },
        'When not coding, you can find me contributing to open-source projects, writing technical blog posts, or exploring new frameworks and tools.'
      )
    ),

    React.createElement('div', { id: 'skills', style: sectionStyle },
      React.createElement('div', { style: accentLine }),
      React.createElement('h2', { style: headingStyle }, 'Skills'),
      React.createElement('p', { style: subStyle }, 'Technologies I work with daily'),
      React.createElement('div', { style: { display: 'grid', gap: '16px' } },
        skills.map(function(skill) {
          return React.createElement('div', { key: skill.name },
            React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '6px' } },
              React.createElement('span', { style: { fontSize: '14px', color: '#ccc' } }, skill.name),
              React.createElement('span', { style: { fontSize: '13px', color: '#bd93f9' } }, skill.level + '%')
            ),
            React.createElement('div', { style: { height: '8px', background: 'rgba(255,255,255,0.08)', borderRadius: '4px', overflow: 'hidden' } },
              React.createElement('div', { style: {
                height: '100%', width: skill.level + '%',
                background: 'linear-gradient(90deg, #bd93f9, #ff79c6)',
                borderRadius: '4px', transition: 'width 1s ease'
              } })
            )
          );
        })
      )
    ),

    React.createElement('div', { id: 'projects', style: sectionStyle },
      React.createElement('div', { style: accentLine }),
      React.createElement('h2', { style: headingStyle }, 'Projects'),
      React.createElement('p', { style: subStyle }, 'Some of my recent work'),
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '16px' } },
        projects.map(function(proj, i) {
          var isHover = hoverProject === i;
          return React.createElement('div', {
            key: i,
            onMouseEnter: function() { setHoverProject(i); },
            onMouseLeave: function() { setHoverProject(-1); },
            style: {
              background: 'rgba(255,255,255,0.05)',
              borderRadius: '12px', padding: '24px',
              border: '1px solid ' + (isHover ? proj.color + '44' : 'rgba(255,255,255,0.08)'),
              transform: isHover ? 'translateY(-4px)' : 'translateY(0)',
              transition: 'all 0.3s ease',
              boxShadow: isHover ? '0 8px 24px rgba(0,0,0,0.3)' : 'none'
            }
          },
            React.createElement('div', { style: { width: '40px', height: '4px', background: proj.color, borderRadius: '2px', marginBottom: '16px' } }),
            React.createElement('h3', { style: { color: '#fff', fontSize: '16px', marginBottom: '8px' } }, proj.title),
            React.createElement('p', { style: { color: '#888', fontSize: '13px', lineHeight: '1.5', marginBottom: '14px' } }, proj.desc),
            React.createElement('div', { style: { display: 'flex', gap: '6px', flexWrap: 'wrap' } },
              proj.tags.map(function(tag) {
                return React.createElement('span', { key: tag, style: {
                  padding: '4px 10px', borderRadius: '12px', fontSize: '11px',
                  background: 'rgba(255,255,255,0.08)', color: '#aaa'
                } }, tag);
              })
            )
          );
        })
      )
    ),

    React.createElement('div', { id: 'contact', style: sectionStyle },
      React.createElement('div', { style: accentLine }),
      React.createElement('h2', { style: headingStyle }, 'Get In Touch'),
      React.createElement('p', { style: subStyle }, 'Have a project in mind? Let us talk!'),
      sent
        ? React.createElement('div', { style: { textAlign: 'center', padding: '40px', background: 'rgba(80,250,123,0.1)', borderRadius: '12px' } },
            React.createElement('div', { style: { fontSize: '36px', color: '#50fa7b', marginBottom: '12px' } }, '\u2713'),
            React.createElement('h3', { style: { color: '#50fa7b' } }, 'Message Sent!'),
            React.createElement('p', { style: { color: '#888', marginTop: '8px' } }, 'I will get back to you soon.')
          )
        : React.createElement('div', { style: { maxWidth: '500px' } },
            React.createElement('input', { placeholder: 'Your Name', value: form.name, onChange: function(e) { setForm(Object.assign({}, form, { name: e.target.value })); }, style: inputStyle }),
            React.createElement('input', { placeholder: 'Your Email', value: form.email, onChange: function(e) { setForm(Object.assign({}, form, { email: e.target.value })); }, style: inputStyle }),
            React.createElement('textarea', { placeholder: 'Your Message', value: form.message, onChange: function(e) { setForm(Object.assign({}, form, { message: e.target.value })); }, rows: 5, style: Object.assign({}, inputStyle, { resize: 'vertical' }) }),
            React.createElement('button', {
              onClick: function() { if (form.name && form.email && form.message) setSent(true); },
              style: {
                padding: '12px 28px', background: 'linear-gradient(135deg, #bd93f9, #ff79c6)',
                border: 'none', borderRadius: '8px', color: '#fff', fontWeight: 'bold', cursor: 'pointer', fontSize: '14px'
              }
            }, 'Send Message')
          )
    ),

    React.createElement('footer', { style: { textAlign: 'center', padding: '30px', borderTop: '1px solid rgba(255,255,255,0.06)', color: '#666', fontSize: '13px' } },
      '\u00A9 2026 Jane Developer. Built with React.'
    )
  );
}

var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
