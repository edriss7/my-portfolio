const { useState, useEffect, useRef } = React;

var initialSurvey = {
  title: 'Developer Preferences Survey',
  questions: [
    {
      id: 1,
      text: 'What is your favorite programming language?',
      options: ['JavaScript', 'Python', 'TypeScript', 'Rust', 'Go']
    },
    {
      id: 2,
      text: 'Which frontend framework do you prefer?',
      options: ['React', 'Vue', 'Angular', 'Svelte']
    },
    {
      id: 3,
      text: 'What is your preferred code editor?',
      options: ['VS Code', 'Vim/Neovim', 'IntelliJ', 'Sublime Text', 'Emacs']
    },
    {
      id: 4,
      text: 'How many years of coding experience do you have?',
      options: ['Less than 1', '1-3 years', '3-5 years', '5-10 years', '10+ years']
    },
    {
      id: 5,
      text: 'What type of development do you primarily do?',
      options: ['Frontend', 'Backend', 'Full Stack', 'DevOps', 'Mobile']
    }
  ]
};

function App() {
  var _s1 = useState('build');
  var mode = _s1[0], setMode = _s1[1];
  var _s2 = useState(JSON.parse(JSON.stringify(initialSurvey)));
  var survey = _s2[0], setSurvey = _s2[1];
  var _s3 = useState(0);
  var currentQuestion = _s3[0], setCurrentQuestion = _s3[1];
  var _s4 = useState({});
  var answers = _s4[0], setAnswers = _s4[1];
  var _s5 = useState([]);
  var results = _s5[0], setResults = _s5[1];
  var _s6 = useState('');
  var newQuestionText = _s6[0], setNewQuestionText = _s6[1];
  var _s7 = useState(['', '']);
  var newOptions = _s7[0], setNewOptions = _s7[1];
  var nextId = useRef(6);

  function addQuestion() {
    if (!newQuestionText.trim()) return;
    var validOptions = newOptions.filter(function(o) { return o.trim() !== ''; });
    if (validOptions.length < 2) return;
    var newQ = {
      id: nextId.current++,
      text: newQuestionText.trim(),
      options: validOptions.map(function(o) { return o.trim(); })
    };
    setSurvey(function(prev) {
      return Object.assign({}, prev, { questions: prev.questions.concat([newQ]) });
    });
    setNewQuestionText('');
    setNewOptions(['', '']);
  }

  function removeQuestion(id) {
    setSurvey(function(prev) {
      return Object.assign({}, prev, { questions: prev.questions.filter(function(q) { return q.id !== id; }) });
    });
  }

  function addOptionField() {
    setNewOptions(function(prev) { return prev.concat(['']); });
  }

  function updateOptionField(index, value) {
    setNewOptions(function(prev) {
      var next = prev.slice();
      next[index] = value;
      return next;
    });
  }

  function removeOptionField(index) {
    if (newOptions.length <= 2) return;
    setNewOptions(function(prev) { return prev.filter(function(_, i) { return i !== index; }); });
  }

  function selectAnswer(questionId, option) {
    setAnswers(function(prev) {
      var next = Object.assign({}, prev);
      next[questionId] = option;
      return next;
    });
  }

  function nextQuestion() {
    if (currentQuestion < survey.questions.length - 1) {
      setCurrentQuestion(function(c) { return c + 1; });
    }
  }

  function prevQuestion() {
    if (currentQuestion > 0) {
      setCurrentQuestion(function(c) { return c - 1; });
    }
  }

  function submitSurvey() {
    var newResults = survey.questions.map(function(q) {
      return {
        question: q.text,
        answer: answers[q.id] || 'No answer'
      };
    });
    setResults(function(prev) { return prev.concat([newResults]); });
    setAnswers({});
    setCurrentQuestion(0);
    setMode('results');
  }

  function startTaking() {
    if (survey.questions.length === 0) return;
    setCurrentQuestion(0);
    setAnswers({});
    setMode('take');
  }

  function getResultsData() {
    var data = {};
    survey.questions.forEach(function(q) {
      data[q.id] = { question: q.text, options: {} };
      q.options.forEach(function(opt) {
        data[q.id].options[opt] = 0;
      });
    });
    results.forEach(function(submission) {
      submission.forEach(function(answer) {
        var q = survey.questions.find(function(qq) { return qq.text === answer.question; });
        if (q && data[q.id] && data[q.id].options[answer.answer] !== undefined) {
          data[q.id].options[answer.answer]++;
        }
      });
    });
    return data;
  }

  var styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%)',
      color: '#e0e0e0',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      padding: '0 0 40px'
    },
    backLink: { color: '#888', textDecoration: 'none', padding: '15px 20px', display: 'inline-block', fontSize: '14px' },
    header: { textAlign: 'center', fontSize: '28px', color: '#fff', margin: '0 0 20px' },
    content: { maxWidth: '700px', margin: '0 auto', padding: '0 20px' },
    tabs: {
      display: 'flex',
      gap: '5px',
      marginBottom: '25px',
      background: 'rgba(255,255,255,0.05)',
      borderRadius: '10px',
      padding: '5px'
    },
    tab: {
      flex: 1,
      padding: '10px',
      borderRadius: '8px',
      border: 'none',
      fontSize: '14px',
      cursor: 'pointer',
      fontWeight: '600',
      textAlign: 'center',
      transition: 'background 0.2s'
    },
    panel: {
      background: 'rgba(255,255,255,0.06)',
      borderRadius: '12px',
      padding: '25px'
    },
    panelTitle: { fontSize: '18px', fontWeight: 'bold', color: '#fff', marginBottom: '20px' },
    questionCard: {
      background: 'rgba(255,255,255,0.05)',
      borderRadius: '10px',
      padding: '15px',
      marginBottom: '12px',
      position: 'relative'
    },
    questionText: { fontSize: '14px', color: '#ddd', marginBottom: '8px', paddingRight: '30px' },
    optionTag: {
      display: 'inline-block',
      padding: '4px 10px',
      borderRadius: '15px',
      background: 'rgba(155,89,182,0.2)',
      color: '#9b59b6',
      fontSize: '12px',
      margin: '3px 3px 3px 0'
    },
    removeBtn: {
      position: 'absolute',
      top: '10px',
      right: '10px',
      background: 'none',
      border: 'none',
      color: '#e74c3c',
      fontSize: '16px',
      cursor: 'pointer'
    },
    formSection: {
      borderTop: '1px solid rgba(255,255,255,0.1)',
      marginTop: '20px',
      paddingTop: '20px'
    },
    formLabel: { fontSize: '14px', fontWeight: '600', color: '#ccc', marginBottom: '8px' },
    input: {
      width: '100%',
      padding: '10px 14px',
      borderRadius: '8px',
      border: '1px solid rgba(255,255,255,0.15)',
      background: 'rgba(255,255,255,0.08)',
      color: '#fff',
      fontSize: '14px',
      outline: 'none',
      marginBottom: '10px',
      boxSizing: 'border-box'
    },
    optionInputRow: {
      display: 'flex',
      gap: '8px',
      marginBottom: '6px',
      alignItems: 'center'
    },
    smallBtn: {
      padding: '6px 12px',
      borderRadius: '6px',
      border: 'none',
      fontSize: '12px',
      cursor: 'pointer',
      fontWeight: '600'
    },
    addBtn: {
      width: '100%',
      padding: '12px',
      borderRadius: '8px',
      border: 'none',
      background: 'linear-gradient(135deg, #9b59b6, #3498db)',
      color: '#fff',
      fontSize: '14px',
      cursor: 'pointer',
      fontWeight: '600',
      marginTop: '10px'
    },
    takeQuestion: {
      textAlign: 'center'
    },
    takeProgress: {
      fontSize: '13px',
      color: '#888',
      marginBottom: '15px'
    },
    takeQText: {
      fontSize: '20px',
      fontWeight: 'bold',
      color: '#fff',
      marginBottom: '25px'
    },
    optionBtn: {
      display: 'block',
      width: '100%',
      padding: '14px',
      borderRadius: '10px',
      border: '2px solid transparent',
      fontSize: '15px',
      cursor: 'pointer',
      marginBottom: '10px',
      textAlign: 'left',
      transition: 'all 0.2s'
    },
    navBtns: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '25px',
      gap: '10px'
    },
    navBtn: {
      padding: '10px 24px',
      borderRadius: '8px',
      border: 'none',
      fontSize: '14px',
      cursor: 'pointer',
      fontWeight: '600'
    },
    barChart: {
      marginBottom: '20px'
    },
    barRow: {
      display: 'flex',
      alignItems: 'center',
      marginBottom: '6px',
      gap: '8px'
    },
    barLabel: { flex: '0 0 120px', fontSize: '13px', color: '#ccc', textAlign: 'right' },
    barTrack: { flex: 1, height: '22px', background: 'rgba(255,255,255,0.05)', borderRadius: '11px', overflow: 'hidden' },
    barFill: { height: '100%', borderRadius: '11px', transition: 'width 0.5s ease', minWidth: '2px' },
    barCount: { flex: '0 0 30px', fontSize: '13px', color: '#aaa' }
  };

  var barColors = ['#e74c3c', '#3498db', '#2ecc71', '#e67e22', '#9b59b6', '#1abc9c', '#f39c12', '#e91e63'];

  function renderBuild() {
    return React.createElement('div', { style: styles.panel },
      React.createElement('div', { style: styles.panelTitle }, 'Survey Questions (' + survey.questions.length + ')'),
      survey.questions.map(function(q, qi) {
        return React.createElement('div', { key: q.id, style: styles.questionCard },
          React.createElement('div', { style: styles.questionText }, (qi + 1) + '. ' + q.text),
          React.createElement('div', null,
            q.options.map(function(opt) {
              return React.createElement('span', { key: opt, style: styles.optionTag }, opt);
            })
          ),
          React.createElement('button', { style: styles.removeBtn, onClick: function() { removeQuestion(q.id); } }, '\u2715')
        );
      }),
      survey.questions.length === 0 ? React.createElement('div', { style: { textAlign: 'center', color: '#666', padding: '20px' } }, 'No questions yet. Add one below!') : null,
      React.createElement('div', { style: styles.formSection },
        React.createElement('div', { style: styles.formLabel }, 'Add New Question'),
        React.createElement('input', {
          style: styles.input,
          placeholder: 'Question text...',
          value: newQuestionText,
          onChange: function(e) { setNewQuestionText(e.target.value); }
        }),
        React.createElement('div', { style: Object.assign({}, styles.formLabel, { marginTop: '5px' }) }, 'Answer Options'),
        newOptions.map(function(opt, i) {
          return React.createElement('div', { key: i, style: styles.optionInputRow },
            React.createElement('input', {
              style: Object.assign({}, styles.input, { marginBottom: 0 }),
              placeholder: 'Option ' + (i + 1),
              value: opt,
              onChange: function(e) { updateOptionField(i, e.target.value); }
            }),
            newOptions.length > 2 ? React.createElement('button', {
              style: Object.assign({}, styles.smallBtn, { background: 'rgba(231,76,60,0.2)', color: '#e74c3c' }),
              onClick: function() { removeOptionField(i); }
            }, '\u2715') : null
          );
        }),
        React.createElement('button', {
          style: Object.assign({}, styles.smallBtn, { background: 'rgba(255,255,255,0.1)', color: '#ccc', marginTop: '5px' }),
          onClick: addOptionField
        }, '+ Add Option'),
        React.createElement('button', { style: styles.addBtn, onClick: addQuestion }, 'Add Question')
      )
    );
  }

  function renderTake() {
    if (survey.questions.length === 0) {
      return React.createElement('div', { style: styles.panel },
        React.createElement('div', { style: { textAlign: 'center', color: '#666', padding: '40px' } }, 'No questions in the survey. Go to Build mode to add questions.')
      );
    }
    var q = survey.questions[currentQuestion];
    var selectedAnswer = answers[q.id];
    var allAnswered = survey.questions.every(function(qq) { return answers[qq.id] !== undefined; });

    return React.createElement('div', { style: styles.panel },
      React.createElement('div', { style: styles.takeQuestion },
        React.createElement('div', { style: styles.takeProgress }, 'Question ' + (currentQuestion + 1) + ' of ' + survey.questions.length),
        React.createElement('div', {
          style: { width: '100%', height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '2px', marginBottom: '25px' }
        },
          React.createElement('div', {
            style: {
              height: '100%',
              width: ((currentQuestion + 1) / survey.questions.length * 100) + '%',
              background: 'linear-gradient(90deg, #9b59b6, #3498db)',
              borderRadius: '2px',
              transition: 'width 0.3s ease'
            }
          })
        ),
        React.createElement('div', { style: styles.takeQText }, q.text)
      ),
      q.options.map(function(opt) {
        var isSelected = selectedAnswer === opt;
        return React.createElement('button', {
          key: opt,
          style: Object.assign({}, styles.optionBtn, {
            background: isSelected ? 'rgba(155,89,182,0.25)' : 'rgba(255,255,255,0.06)',
            borderColor: isSelected ? '#9b59b6' : 'transparent',
            color: isSelected ? '#9b59b6' : '#ddd'
          }),
          onClick: function() { selectAnswer(q.id, opt); },
          onMouseEnter: function(e) { if (!isSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.1)'; },
          onMouseLeave: function(e) { if (!isSelected) e.currentTarget.style.background = isSelected ? 'rgba(155,89,182,0.25)' : 'rgba(255,255,255,0.06)'; }
        }, opt);
      }),
      React.createElement('div', { style: styles.navBtns },
        React.createElement('button', {
          style: Object.assign({}, styles.navBtn, {
            background: currentQuestion > 0 ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.03)',
            color: currentQuestion > 0 ? '#ccc' : '#555'
          }),
          onClick: prevQuestion,
          disabled: currentQuestion === 0
        }, '\u2190 Previous'),
        currentQuestion < survey.questions.length - 1
          ? React.createElement('button', {
              style: Object.assign({}, styles.navBtn, { background: 'rgba(255,255,255,0.1)', color: '#ccc' }),
              onClick: nextQuestion
            }, 'Next \u2192')
          : React.createElement('button', {
              style: Object.assign({}, styles.navBtn, {
                background: allAnswered ? 'linear-gradient(135deg, #9b59b6, #3498db)' : 'rgba(255,255,255,0.05)',
                color: allAnswered ? '#fff' : '#555'
              }),
              onClick: submitSurvey,
              disabled: !allAnswered
            }, 'Submit Survey')
      )
    );
  }

  function renderResults() {
    var data = getResultsData();
    return React.createElement('div', { style: styles.panel },
      React.createElement('div', { style: styles.panelTitle }, 'Survey Results (' + results.length + ' submissions)'),
      results.length === 0
        ? React.createElement('div', { style: { textAlign: 'center', color: '#666', padding: '30px' } }, 'No submissions yet. Take the survey first!')
        : survey.questions.map(function(q, qi) {
            var qData = data[q.id];
            if (!qData) return null;
            var maxCount = Math.max.apply(null, Object.values(qData.options).concat([1]));
            return React.createElement('div', { key: q.id, style: { marginBottom: '25px' } },
              React.createElement('div', { style: { fontSize: '14px', fontWeight: '600', color: '#ddd', marginBottom: '10px' } },
                (qi + 1) + '. ' + q.text
              ),
              React.createElement('div', { style: styles.barChart },
                Object.keys(qData.options).map(function(opt, oi) {
                  var count = qData.options[opt];
                  var pct = results.length > 0 ? (count / results.length * 100) : 0;
                  return React.createElement('div', { key: opt, style: styles.barRow },
                    React.createElement('div', { style: styles.barLabel }, opt),
                    React.createElement('div', { style: styles.barTrack },
                      React.createElement('div', { style: Object.assign({}, styles.barFill, {
                        width: pct + '%',
                        background: barColors[oi % barColors.length]
                      }) })
                    ),
                    React.createElement('div', { style: styles.barCount }, count)
                  );
                })
              )
            );
          })
    );
  }

  return React.createElement('div', { style: styles.container },
    React.createElement('a', { href: '/projects', style: styles.backLink }, '\u2190 Back to Projects'),
    React.createElement('h1', { style: styles.header }, 'Survey Builder'),
    React.createElement('div', { style: styles.content },
      React.createElement('div', { style: styles.tabs },
        ['build', 'take', 'results'].map(function(m) {
          var labels = { build: 'Build', take: 'Take Survey', results: 'Results' };
          return React.createElement('button', {
            key: m,
            style: Object.assign({}, styles.tab, {
              background: mode === m ? 'linear-gradient(135deg, #9b59b6, #3498db)' : 'transparent',
              color: mode === m ? '#fff' : '#888'
            }),
            onClick: function() {
              if (m === 'take') startTaking();
              else setMode(m);
            }
          }, labels[m]);
        })
      ),
      mode === 'build' ? renderBuild() : null,
      mode === 'take' ? renderTake() : null,
      mode === 'results' ? renderResults() : null
    )
  );
}

var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
