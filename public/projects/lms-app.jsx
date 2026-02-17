const { useState, useMemo } = React;

var backLinkStyle = { color: '#8be9fd', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '16px' };
var containerStyle = { minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%)', color: '#e0e0e0', fontFamily: "'Segoe UI', Tahoma, sans-serif", padding: '24px' };
var cardStyle = { background: 'rgba(255,255,255,0.06)', borderRadius: '12px', padding: '16px', border: '1px solid rgba(255,255,255,0.1)' };

var COURSES = [
  { id: 1, title: 'React Masterclass', instructor: 'Sarah Chen', category: 'Frontend', duration: '12h', rating: 4.8, students: 3420, progress: 75, enrolled: true, color: '#6c5ce7',
    lessons: [
      { id: 1, title: 'Introduction to React', duration: '45m', type: 'video', completed: true },
      { id: 2, title: 'Components & Props', duration: '1h 10m', type: 'video', completed: true },
      { id: 3, title: 'State & Lifecycle', duration: '55m', type: 'video', completed: true },
      { id: 4, title: 'Hooks Deep Dive', duration: '1h 30m', type: 'video', completed: false },
      { id: 5, title: 'Quiz: React Fundamentals', duration: '20m', type: 'quiz', completed: false },
      { id: 6, title: 'Advanced Patterns', duration: '1h 15m', type: 'video', completed: false },
      { id: 7, title: 'Performance Optimization', duration: '50m', type: 'video', completed: false },
      { id: 8, title: 'Final Project', duration: '2h', type: 'project', completed: false }
    ]
  },
  { id: 2, title: 'Python for Data Science', instructor: 'James Park', category: 'Data Science', duration: '20h', rating: 4.9, students: 5100, progress: 100, enrolled: true, color: '#00b894',
    lessons: [
      { id: 1, title: 'Python Basics', duration: '1h', type: 'video', completed: true },
      { id: 2, title: 'NumPy & Pandas', duration: '2h', type: 'video', completed: true },
      { id: 3, title: 'Data Visualization', duration: '1h 30m', type: 'video', completed: true },
      { id: 4, title: 'Final Quiz', duration: '30m', type: 'quiz', completed: true }
    ]
  },
  { id: 3, title: 'Node.js Backend Development', instructor: 'Mike Johnson', category: 'Backend', duration: '15h', rating: 4.7, students: 2800, progress: 30, enrolled: true, color: '#e74c3c',
    lessons: [
      { id: 1, title: 'Node.js Fundamentals', duration: '50m', type: 'video', completed: true },
      { id: 2, title: 'Express Framework', duration: '1h 20m', type: 'video', completed: false },
      { id: 3, title: 'REST APIs', duration: '1h', type: 'video', completed: false },
      { id: 4, title: 'Database Integration', duration: '1h 30m', type: 'video', completed: false }
    ]
  },
  { id: 4, title: 'AWS Cloud Fundamentals', instructor: 'Lisa Wang', category: 'Cloud', duration: '10h', rating: 4.6, students: 1900, progress: 0, enrolled: false, color: '#ffd93d',
    lessons: [
      { id: 1, title: 'Cloud Computing Basics', duration: '40m', type: 'video', completed: false },
      { id: 2, title: 'EC2 & S3', duration: '1h 10m', type: 'video', completed: false },
      { id: 3, title: 'Lambda & Serverless', duration: '55m', type: 'video', completed: false }
    ]
  },
  { id: 5, title: 'Docker & Kubernetes', instructor: 'David Kim', category: 'DevOps', duration: '18h', rating: 4.8, students: 4200, progress: 0, enrolled: false, color: '#4a9eff',
    lessons: [
      { id: 1, title: 'Container Basics', duration: '45m', type: 'video', completed: false },
      { id: 2, title: 'Dockerfiles', duration: '1h', type: 'video', completed: false },
      { id: 3, title: 'Kubernetes Intro', duration: '1h 20m', type: 'video', completed: false }
    ]
  },
  { id: 6, title: 'UI/UX Design Principles', instructor: 'Elena Rossi', category: 'Design', duration: '8h', rating: 4.5, students: 1500, progress: 0, enrolled: false, color: '#fd79a8',
    lessons: [
      { id: 1, title: 'Design Thinking', duration: '50m', type: 'video', completed: false },
      { id: 2, title: 'Color Theory', duration: '40m', type: 'video', completed: false },
      { id: 3, title: 'Typography', duration: '35m', type: 'video', completed: false }
    ]
  }
];

var QUIZ_QUESTIONS = [
  { q: 'What hook is used for side effects in React?', options: ['useState', 'useEffect', 'useRef', 'useMemo'], correct: 1 },
  { q: 'Which method creates a React element?', options: ['React.create()', 'React.createElement()', 'React.render()', 'React.build()'], correct: 1 },
  { q: 'What is the virtual DOM?', options: ['A browser API', 'A lightweight copy of the real DOM', 'A CSS framework', 'A testing tool'], correct: 1 },
  { q: 'How do you pass data to a child component?', options: ['State', 'Props', 'Context only', 'Redux only'], correct: 1 }
];

function App() {
  var _view = useState('catalog'), view = _view[0], setView = _view[1];
  var _sel = useState(null), selectedCourse = _sel[0], setSelectedCourse = _sel[1];
  var _quiz = useState(false), quizMode = _quiz[0], setQuizMode = _quiz[1];
  var _qIdx = useState(0), qIdx = _qIdx[0], setQIdx = _qIdx[1];
  var _answers = useState({}), answers = _answers[0], setAnswers = _answers[1];
  var _submitted = useState(false), submitted = _submitted[0], setSubmitted = _submitted[1];
  var _showCert = useState(false), showCert = _showCert[0], setShowCert = _showCert[1];

  var enrolledCourses = COURSES.filter(function(c) { return c.enrolled; });

  var openCourse = function(c) { setSelectedCourse(c); setView('detail'); setQuizMode(false); setSubmitted(false); setQIdx(0); setAnswers({}); };
  var startQuiz = function() { setQuizMode(true); setQIdx(0); setAnswers({}); setSubmitted(false); };

  var selectAnswer = function(qi, ai) {
    if (submitted) return;
    setAnswers(function(prev) { var c = Object.assign({}, prev); c[qi] = ai; return c; });
  };

  var submitQuiz = function() { setSubmitted(true); };
  var score = Object.keys(answers).filter(function(k) { return answers[k] === QUIZ_QUESTIONS[k].correct; }).length;

  // Catalog view
  if (view === 'catalog') {
    return React.createElement('div', { style: containerStyle },
      React.createElement('a', { href: '/projects', style: backLinkStyle }, '\u2190 Back to Projects'),
      React.createElement('h1', { style: { fontSize: '28px', fontWeight: 'bold', marginBottom: '6px', background: 'linear-gradient(90deg, #6c5ce7, #fd79a8)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } }, 'Learning Management System'),
      React.createElement('p', { style: { color: '#888', marginBottom: '24px', fontSize: '14px' } }, 'Expand your skills with expert-led courses'),

      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 280px', gap: '24px', alignItems: 'start' } },
        React.createElement('div', null,
          React.createElement('h2', { style: { fontSize: '18px', marginBottom: '16px' } }, 'Course Catalog'),
          React.createElement('div', { style: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '16px' } },
            COURSES.map(function(c) {
              return React.createElement('div', { key: c.id, onClick: function() { openCourse(c); }, style: Object.assign({}, cardStyle, { cursor: 'pointer', transition: 'transform 0.2s', borderTop: '3px solid ' + c.color }) },
                React.createElement('div', { style: { fontSize: '11px', color: c.color, fontWeight: '600', marginBottom: '6px' } }, c.category),
                React.createElement('h3', { style: { margin: '0 0 8px 0', fontSize: '16px' } }, c.title),
                React.createElement('div', { style: { fontSize: '13px', color: '#888', marginBottom: '10px' } }, c.instructor + ' \u2022 ' + c.duration),
                React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' } },
                  React.createElement('div', { style: { fontSize: '13px' } },
                    React.createElement('span', { style: { color: '#ffd93d' } }, '\u2605 '),
                    React.createElement('span', null, c.rating),
                    React.createElement('span', { style: { color: '#888', marginLeft: '8px' } }, '(' + c.students.toLocaleString() + ')')
                  ),
                  c.enrolled ? React.createElement('span', { style: { fontSize: '11px', padding: '2px 8px', borderRadius: '10px', background: '#00b89422', color: '#00b894' } }, 'Enrolled') : null
                ),
                c.enrolled && c.progress > 0 ? React.createElement('div', null,
                  React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: '#888', marginBottom: '4px' } },
                    React.createElement('span', null, 'Progress'),
                    React.createElement('span', null, c.progress + '%')
                  ),
                  React.createElement('div', { style: { height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px' } },
                    React.createElement('div', { style: { height: '100%', width: c.progress + '%', background: c.progress === 100 ? '#00b894' : c.color, borderRadius: '2px', transition: 'width 0.5s' } })
                  )
                ) : null
              );
            })
          )
        ),

        // Enrolled sidebar
        React.createElement('div', { style: cardStyle },
          React.createElement('h3', { style: { margin: '0 0 16px 0', fontSize: '15px' } }, 'My Courses'),
          enrolledCourses.map(function(c) {
            return React.createElement('div', { key: c.id, onClick: function() { openCourse(c); }, style: { padding: '10px', borderRadius: '8px', cursor: 'pointer', marginBottom: '8px', background: 'rgba(255,255,255,0.04)', borderLeft: '3px solid ' + c.color } },
              React.createElement('div', { style: { fontWeight: 'bold', fontSize: '13px' } }, c.title),
              React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' } },
                React.createElement('div', { style: { flex: 1, height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', marginRight: '8px' } },
                  React.createElement('div', { style: { height: '100%', width: c.progress + '%', background: c.color, borderRadius: '2px' } })
                ),
                React.createElement('span', { style: { fontSize: '11px', color: '#888' } }, c.progress + '%')
              ),
              c.progress === 100 ? React.createElement('div', { onClick: function(e) { e.stopPropagation(); setShowCert(true); setSelectedCourse(c); }, style: { fontSize: '11px', color: '#ffd93d', marginTop: '6px', cursor: 'pointer' } }, '\uD83C\uDFC6 View Certificate') : null
            );
          })
        )
      ),

      // Certificate modal
      showCert && selectedCourse ? React.createElement('div', { onClick: function() { setShowCert(false); }, style: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 } },
        React.createElement('div', { onClick: function(e) { e.stopPropagation(); }, style: { background: 'linear-gradient(135deg, #1a1a3e, #2a1a5e)', borderRadius: '16px', padding: '40px', maxWidth: '500px', width: '90%', textAlign: 'center', border: '2px solid #ffd93d', position: 'relative' } },
          React.createElement('div', { style: { fontSize: '12px', color: '#ffd93d', letterSpacing: '4px', marginBottom: '12px' } }, 'CERTIFICATE OF COMPLETION'),
          React.createElement('div', { style: { width: '60px', height: '2px', background: '#ffd93d', margin: '0 auto 20px' } }),
          React.createElement('div', { style: { fontSize: '14px', color: '#888', marginBottom: '8px' } }, 'This certifies that'),
          React.createElement('div', { style: { fontSize: '24px', fontWeight: 'bold', color: '#fff', marginBottom: '8px' } }, 'Student Name'),
          React.createElement('div', { style: { fontSize: '14px', color: '#888', marginBottom: '20px' } }, 'has successfully completed'),
          React.createElement('div', { style: { fontSize: '20px', fontWeight: 'bold', color: selectedCourse.color, marginBottom: '8px' } }, selectedCourse.title),
          React.createElement('div', { style: { fontSize: '13px', color: '#888' } }, 'Instructor: ' + selectedCourse.instructor + ' \u2022 ' + selectedCourse.duration),
          React.createElement('div', { style: { fontSize: '13px', color: '#888', marginTop: '20px' } }, 'Issued: February 17, 2026'),
          React.createElement('button', { onClick: function() { setShowCert(false); }, style: { marginTop: '20px', padding: '8px 24px', borderRadius: '8px', border: 'none', background: '#ffd93d', color: '#000', cursor: 'pointer', fontWeight: 'bold' } }, 'Close')
        )
      ) : null
    );
  }

  // Course detail / quiz
  if (view === 'detail' && selectedCourse) {
    var c = selectedCourse;
    if (quizMode) {
      return React.createElement('div', { style: containerStyle },
        React.createElement('a', { href: '/projects', style: backLinkStyle }, '\u2190 Back to Projects'),
        React.createElement('button', { onClick: function() { setQuizMode(false); }, style: { background: 'none', border: 'none', color: '#8be9fd', cursor: 'pointer', fontSize: '14px', marginBottom: '16px', padding: 0 } }, '\u2190 Back to Course'),
        React.createElement('h2', { style: { marginBottom: '20px' } }, 'Quiz: ' + c.title),
        submitted ? React.createElement('div', { style: Object.assign({}, cardStyle, { textAlign: 'center', marginBottom: '20px' }) },
          React.createElement('div', { style: { fontSize: '48px', marginBottom: '12px' } }, score >= 3 ? '\uD83C\uDF89' : '\uD83D\uDCDA'),
          React.createElement('div', { style: { fontSize: '24px', fontWeight: 'bold', color: score >= 3 ? '#00b894' : '#ffd93d' } }, 'Score: ' + score + '/' + QUIZ_QUESTIONS.length),
          React.createElement('div', { style: { color: '#888', marginTop: '8px' } }, score >= 3 ? 'Congratulations! You passed!' : 'Keep studying and try again!')
        ) : null,
        QUIZ_QUESTIONS.map(function(q, qi) {
          return React.createElement('div', { key: qi, style: Object.assign({}, cardStyle, { marginBottom: '16px' }) },
            React.createElement('div', { style: { fontWeight: 'bold', fontSize: '15px', marginBottom: '12px' } }, (qi + 1) + '. ' + q.q),
            q.options.map(function(opt, oi) {
              var isSelected = answers[qi] === oi;
              var isCorrect = submitted && oi === q.correct;
              var isWrong = submitted && isSelected && oi !== q.correct;
              var bg = isCorrect ? 'rgba(0,184,148,0.15)' : isWrong ? 'rgba(255,107,107,0.15)' : isSelected ? 'rgba(108,92,231,0.15)' : 'rgba(255,255,255,0.04)';
              var border = isCorrect ? '1px solid #00b894' : isWrong ? '1px solid #ff6b6b' : isSelected ? '1px solid #6c5ce7' : '1px solid rgba(255,255,255,0.08)';
              return React.createElement('div', {
                key: oi, onClick: function() { selectAnswer(qi, oi); },
                style: { padding: '10px 14px', borderRadius: '8px', marginBottom: '6px', cursor: submitted ? 'default' : 'pointer', background: bg, border: border, fontSize: '14px', transition: 'all 0.2s' }
              }, opt);
            })
          );
        }),
        !submitted ? React.createElement('button', { onClick: submitQuiz, style: { padding: '12px 32px', borderRadius: '10px', border: 'none', background: '#6c5ce7', color: '#fff', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' } }, 'Submit Quiz') : null
      );
    }

    var completedCount = c.lessons.filter(function(l) { return l.completed; }).length;
    return React.createElement('div', { style: containerStyle },
      React.createElement('a', { href: '/projects', style: backLinkStyle }, '\u2190 Back to Projects'),
      React.createElement('button', { onClick: function() { setView('catalog'); setSelectedCourse(null); }, style: { background: 'none', border: 'none', color: '#8be9fd', cursor: 'pointer', fontSize: '14px', marginBottom: '16px', padding: 0 } }, '\u2190 Back to Catalog'),
      React.createElement('div', { style: { display: 'grid', gridTemplateColumns: '1fr 320px', gap: '24px', alignItems: 'start' } },
        React.createElement('div', null,
          React.createElement('div', { style: { fontSize: '12px', color: c.color, fontWeight: '600', marginBottom: '4px' } }, c.category),
          React.createElement('h1', { style: { margin: '0 0 8px 0', fontSize: '26px' } }, c.title),
          React.createElement('div', { style: { fontSize: '14px', color: '#888', marginBottom: '20px' } }, 'By ' + c.instructor + ' \u2022 ' + c.duration + ' \u2022 ' + React.createElement('span', { style: { color: '#ffd93d' } }, '\u2605 ' + c.rating)),

          // Video placeholder
          React.createElement('div', { style: { background: 'linear-gradient(135deg, #111, #222)', borderRadius: '12px', height: '280px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', position: 'relative', border: '1px solid rgba(255,255,255,0.08)' } },
            React.createElement('div', { style: { width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(255,255,255,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', cursor: 'pointer' } }, '\u25B6'),
            React.createElement('div', { style: { position: 'absolute', bottom: '12px', left: '12px', fontSize: '12px', color: '#888' } }, 'Lesson Preview'),
            React.createElement('div', { style: { position: 'absolute', bottom: '12px', right: '12px', fontSize: '12px', background: 'rgba(0,0,0,0.5)', padding: '2px 8px', borderRadius: '4px' } }, '45:00')
          ),

          // Lesson list
          React.createElement('div', { style: cardStyle },
            React.createElement('h3', { style: { margin: '0 0 16px 0', fontSize: '16px' } }, 'Course Content (' + completedCount + '/' + c.lessons.length + ')'),
            c.lessons.map(function(l, i) {
              var icon = l.type === 'quiz' ? '\uD83D\uDCDD' : l.type === 'project' ? '\uD83D\uDCC1' : '\u25B6';
              return React.createElement('div', { key: l.id, style: { display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderRadius: '8px', marginBottom: '4px', background: 'rgba(255,255,255,0.04)', cursor: 'pointer' } },
                React.createElement('div', { style: { width: '28px', height: '28px', borderRadius: '50%', border: '2px solid ' + (l.completed ? '#00b894' : '#444'), background: l.completed ? '#00b894' : 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', flexShrink: 0 } }, l.completed ? '\u2713' : (i + 1)),
                React.createElement('div', { style: { flex: 1 } },
                  React.createElement('div', { style: { fontSize: '14px', fontWeight: l.completed ? 'normal' : '600', opacity: l.completed ? 0.6 : 1 } }, icon + ' ' + l.title),
                  React.createElement('div', { style: { fontSize: '11px', color: '#888' } }, l.duration + ' \u2022 ' + l.type)
                ),
                l.type === 'quiz' && !l.completed ? React.createElement('button', { onClick: function(e) { e.stopPropagation(); startQuiz(); }, style: { padding: '4px 12px', borderRadius: '6px', border: 'none', background: c.color + '33', color: c.color, cursor: 'pointer', fontSize: '12px', fontWeight: 'bold' } }, 'Start') : null
              );
            })
          )
        ),

        // Progress sidebar
        React.createElement('div', null,
          React.createElement('div', { style: Object.assign({}, cardStyle, { textAlign: 'center', marginBottom: '16px' }) },
            React.createElement('div', { style: { position: 'relative', width: '100px', height: '100px', margin: '0 auto 12px' } },
              React.createElement('svg', { width: 100, height: 100, viewBox: '0 0 100 100' },
                React.createElement('circle', { cx: 50, cy: 50, r: 42, fill: 'none', stroke: 'rgba(255,255,255,0.08)', strokeWidth: 6 }),
                React.createElement('circle', { cx: 50, cy: 50, r: 42, fill: 'none', stroke: c.color, strokeWidth: 6, strokeDasharray: (c.progress / 100 * 264) + ' 264', strokeLinecap: 'round', transform: 'rotate(-90 50 50)' })
              ),
              React.createElement('div', { style: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '22px', fontWeight: 'bold', color: c.color } }, c.progress + '%')
            ),
            React.createElement('div', { style: { fontSize: '14px', fontWeight: 'bold' } }, 'Course Progress'),
            React.createElement('div', { style: { fontSize: '12px', color: '#888', marginTop: '4px' } }, completedCount + ' of ' + c.lessons.length + ' lessons completed')
          ),
          c.enrolled ? React.createElement('button', { style: { width: '100%', padding: '14px', borderRadius: '10px', border: 'none', background: c.color, color: '#fff', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' } }, 'Continue Learning') :
          React.createElement('button', { style: { width: '100%', padding: '14px', borderRadius: '10px', border: 'none', background: c.color, color: '#fff', cursor: 'pointer', fontWeight: 'bold', fontSize: '15px' } }, 'Enroll Now - Free'),
          React.createElement('div', { style: Object.assign({}, cardStyle, { marginTop: '16px' }) },
            React.createElement('h4', { style: { margin: '0 0 10px 0', fontSize: '14px' } }, 'Course Info'),
            [['Students', c.students.toLocaleString()], ['Duration', c.duration], ['Lessons', c.lessons.length], ['Category', c.category], ['Rating', '\u2605 ' + c.rating]].map(function(r) {
              return React.createElement('div', { key: r[0], style: { display: 'flex', justifyContent: 'space-between', padding: '6px 0', fontSize: '13px', borderBottom: '1px solid rgba(255,255,255,0.05)' } },
                React.createElement('span', { style: { color: '#888' } }, r[0]),
                React.createElement('span', null, r[1])
              );
            })
          )
        )
      )
    );
  }

  return React.createElement('div', { style: containerStyle }, 'Loading...');
}

var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
