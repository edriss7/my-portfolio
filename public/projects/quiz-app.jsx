const { useState, useEffect, useRef, useCallback } = React;

const questions = [
  {
    question: 'What React hook is used to manage component state?',
    options: ['useEffect', 'useState', 'useContext', 'useReducer'],
    correct: 1,
  },
  {
    question: 'What does JSX stand for?',
    options: ['JavaScript Extended', 'JavaScript XML', 'Java Syntax Extension', 'JSON XML Schema'],
    correct: 1,
  },
  {
    question: 'What is the primary purpose of the Virtual DOM?',
    options: ['Security enhancement', 'Performance optimization', 'Styling components', 'Server rendering'],
    correct: 1,
  },
  {
    question: 'When does the useEffect hook run?',
    options: ['Before render', 'After render', 'During render', 'Only on mount'],
    correct: 1,
  },
  {
    question: 'What is the key prop used for in React lists?',
    options: ['Styling elements', 'Event handling', 'List item identification', 'State management'],
    correct: 2,
  },
  {
    question: 'Which method renders a React component to the DOM?',
    options: ['React.mount()', 'ReactDOM.render()', 'React.display()', 'DOM.create()'],
    correct: 1,
  },
  {
    question: 'In React, props are:',
    options: ['Mutable', 'Read-only', 'Write-only', 'Optional always'],
    correct: 1,
  },
  {
    question: 'What is a React Fragment used for?',
    options: ['Error handling', 'Wrapping elements without extra DOM node', 'State management', 'Side effects'],
    correct: 1,
  },
  {
    question: 'The Context API in React is primarily used for:',
    options: ['Routing', 'Global state sharing', 'API calls', 'Animations'],
    correct: 1,
  },
  {
    question: 'What does the useMemo hook do?',
    options: ['Manages state', 'Memoizes computed values', 'Handles side effects', 'Creates refs'],
    correct: 1,
  },
];

const TIMER_SECONDS = 15;

function App() {
  const [gameState, setGameState] = useState('start'); // start, playing, finished
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);
  const [fadeIn, setFadeIn] = useState(true);
  const timerRef = useRef(null);

  const startGame = () => {
    setGameState('playing');
    setCurrentQ(0);
    setSelected(null);
    setAnswered(false);
    setScore(0);
    setAnswers([]);
    setTimeLeft(TIMER_SECONDS);
    setFadeIn(true);
  };

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (gameState !== 'playing' || answered) {
      clearTimer();
      return;
    }

    setTimeLeft(TIMER_SECONDS);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearTimer();
          // Time's up - mark as wrong
          setAnswered(true);
          setSelected(-1);
          setAnswers(prev => [...prev, { question: currentQ, selected: -1, correct: questions[currentQ].correct, timedOut: true }]);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return clearTimer;
  }, [currentQ, gameState, answered, clearTimer]);

  const handleAnswer = (index) => {
    if (answered) return;
    clearTimer();
    setSelected(index);
    setAnswered(true);
    const isCorrect = index === questions[currentQ].correct;
    if (isCorrect) setScore(s => s + 1);
    setAnswers(prev => [...prev, { question: currentQ, selected: index, correct: questions[currentQ].correct, timedOut: false }]);
  };

  const nextQuestion = () => {
    if (currentQ + 1 >= questions.length) {
      setGameState('finished');
    } else {
      setFadeIn(false);
      setTimeout(() => {
        setCurrentQ(q => q + 1);
        setSelected(null);
        setAnswered(false);
        setFadeIn(true);
      }, 200);
    }
  };

  const getScoreReaction = () => {
    const pct = (score / questions.length) * 100;
    if (pct >= 80) return { emoji: '\uD83C\uDF89', text: 'Amazing!', color: '#43e97b', sub: 'You really know your React!' };
    if (pct >= 60) return { emoji: '\uD83D\uDC4D', text: 'Good Job!', color: '#f9ca24', sub: 'Pretty solid knowledge!' };
    if (pct >= 40) return { emoji: '\uD83E\uDD14', text: 'Not Bad', color: '#ffa502', sub: 'Room for improvement!' };
    return { emoji: '\uD83D\uDCDA', text: 'Keep Learning!', color: '#ff6b6b', sub: 'Review the React docs and try again!' };
  };

  const timerColor = timeLeft > 10 ? '#43e97b' : timeLeft > 5 ? '#f9ca24' : '#ff6b6b';
  const progressPct = ((currentQ + (answered ? 1 : 0)) / questions.length) * 100;

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%)',
      color: '#e0e0e0',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      padding: '20px',
    },
    backLink: {
      display: 'inline-flex',
      alignItems: 'center',
      color: '#8888ff',
      textDecoration: 'none',
      fontSize: '14px',
      marginBottom: '20px',
      gap: '6px',
    },
    content: {
      maxWidth: '650px',
      margin: '0 auto',
    },
    startScreen: {
      textAlign: 'center',
      padding: '60px 20px',
    },
    startIcon: {
      fontSize: '4rem',
      marginBottom: '16px',
    },
    startTitle: {
      fontSize: '2.5rem',
      fontWeight: '800',
      background: 'linear-gradient(90deg, #667eea, #764ba2)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      margin: '0 0 12px 0',
    },
    startSub: {
      color: '#8888aa',
      fontSize: '1.1rem',
      marginBottom: '8px',
    },
    startDetail: {
      color: '#666',
      fontSize: '0.9rem',
      marginBottom: '32px',
    },
    startBtn: {
      padding: '16px 48px',
      fontSize: '1.2rem',
      fontWeight: '700',
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      color: '#fff',
      border: 'none',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'transform 0.2s, box-shadow 0.2s',
      boxShadow: '0 4px 20px rgba(102,126,234,0.4)',
    },
    progressBar: {
      height: '6px',
      background: 'rgba(255,255,255,0.08)',
      borderRadius: '3px',
      marginBottom: '24px',
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      background: 'linear-gradient(90deg, #667eea, #764ba2)',
      borderRadius: '3px',
      transition: 'width 0.5s ease',
      width: `${progressPct}%`,
    },
    topBar: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '16px',
    },
    questionNum: {
      fontSize: '0.85rem',
      color: '#8888aa',
      textTransform: 'uppercase',
      letterSpacing: '1.5px',
    },
    timer: {
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '1.1rem',
      fontWeight: '700',
      color: timerColor,
    },
    timerCircle: {
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      border: `3px solid ${timerColor}`,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '0.95rem',
      fontWeight: '700',
      transition: 'all 0.3s',
    },
    questionCard: {
      background: 'rgba(255,255,255,0.05)',
      borderRadius: '16px',
      padding: '30px',
      border: '1px solid rgba(255,255,255,0.08)',
      marginBottom: '20px',
      opacity: fadeIn ? 1 : 0,
      transform: fadeIn ? 'translateY(0)' : 'translateY(10px)',
      transition: 'all 0.3s ease',
    },
    questionText: {
      fontSize: '1.3rem',
      fontWeight: '600',
      lineHeight: 1.5,
      marginBottom: '24px',
      color: '#fff',
    },
    optionsGrid: {
      display: 'flex',
      flexDirection: 'column',
      gap: '12px',
    },
    option: (index) => {
      let bg = 'rgba(255,255,255,0.04)';
      let borderColor = 'rgba(255,255,255,0.08)';
      let textColor = '#ddd';

      if (answered) {
        if (index === questions[currentQ].correct) {
          bg = 'rgba(67,233,123,0.15)';
          borderColor = '#43e97b';
          textColor = '#43e97b';
        } else if (index === selected && index !== questions[currentQ].correct) {
          bg = 'rgba(255,107,107,0.15)';
          borderColor = '#ff6b6b';
          textColor = '#ff6b6b';
        }
      }

      return {
        padding: '16px 20px',
        borderRadius: '12px',
        border: `2px solid ${borderColor}`,
        background: bg,
        color: textColor,
        fontSize: '1rem',
        cursor: answered ? 'default' : 'pointer',
        transition: 'all 0.2s',
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        fontWeight: answered && index === questions[currentQ].correct ? '600' : '400',
      };
    },
    optionLetter: (index) => {
      let bg = 'rgba(255,255,255,0.08)';
      let color = '#aaa';

      if (answered && index === questions[currentQ].correct) {
        bg = '#43e97b';
        color = '#000';
      } else if (answered && index === selected && index !== questions[currentQ].correct) {
        bg = '#ff6b6b';
        color = '#fff';
      }

      return {
        width: '32px',
        height: '32px',
        borderRadius: '8px',
        background: bg,
        color: color,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: '700',
        fontSize: '0.85rem',
        flexShrink: 0,
      };
    },
    feedback: {
      textAlign: 'center',
      padding: '12px',
      borderRadius: '10px',
      marginBottom: '16px',
      fontSize: '0.95rem',
      fontWeight: '600',
    },
    nextBtn: {
      display: 'block',
      width: '100%',
      padding: '16px',
      fontSize: '1.1rem',
      fontWeight: '700',
      background: 'linear-gradient(135deg, #667eea, #764ba2)',
      color: '#fff',
      border: 'none',
      borderRadius: '12px',
      cursor: 'pointer',
      transition: 'transform 0.2s',
    },
    finishScreen: {
      textAlign: 'center',
      padding: '40px 20px',
    },
    scoreCircle: {
      width: '160px',
      height: '160px',
      borderRadius: '50%',
      margin: '0 auto 24px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      border: `4px solid ${getScoreReaction().color}`,
      boxShadow: `0 0 40px ${getScoreReaction().color}33`,
    },
    scoreNum: {
      fontSize: '3rem',
      fontWeight: '800',
      color: getScoreReaction().color,
    },
    scoreTotal: {
      fontSize: '0.9rem',
      color: '#888',
    },
    reviewSection: {
      marginTop: '30px',
      textAlign: 'left',
    },
    reviewItem: (isCorrect) => ({
      padding: '12px 16px',
      borderRadius: '10px',
      marginBottom: '8px',
      background: isCorrect ? 'rgba(67,233,123,0.08)' : 'rgba(255,107,107,0.08)',
      border: `1px solid ${isCorrect ? 'rgba(67,233,123,0.2)' : 'rgba(255,107,107,0.2)'}`,
      display: 'flex',
      alignItems: 'center',
      gap: '10px',
    }),
    reviewIcon: {
      fontSize: '1.2rem',
      flexShrink: 0,
    },
    reviewText: {
      fontSize: '0.85rem',
      color: '#bbb',
      flex: 1,
    },
  };

  // START SCREEN
  if (gameState === 'start') {
    return (
      React.createElement('div', { style: styles.container },
        React.createElement('a', { href: '/projects', style: styles.backLink }, '\u2190 Back to Projects'),
        React.createElement('div', { style: styles.content },
          React.createElement('div', { style: styles.startScreen },
            React.createElement('div', { style: styles.startIcon }, '\uD83E\uDDE0'),
            React.createElement('h1', { style: styles.startTitle }, 'React & JS Quiz'),
            React.createElement('p', { style: styles.startSub }, '10 questions to test your knowledge'),
            React.createElement('p', { style: styles.startDetail }, '15 seconds per question \u00B7 Multiple choice \u00B7 Instant feedback'),
            React.createElement('button', {
              style: styles.startBtn,
              onClick: startGame,
              onMouseEnter: (e) => { e.target.style.transform = 'scale(1.05)'; e.target.style.boxShadow = '0 6px 30px rgba(102,126,234,0.5)'; },
              onMouseLeave: (e) => { e.target.style.transform = 'scale(1)'; e.target.style.boxShadow = '0 4px 20px rgba(102,126,234,0.4)'; },
            }, 'Start Quiz')
          )
        )
      )
    );
  }

  // FINISHED SCREEN
  if (gameState === 'finished') {
    const reaction = getScoreReaction();
    return (
      React.createElement('div', { style: styles.container },
        React.createElement('a', { href: '/projects', style: styles.backLink }, '\u2190 Back to Projects'),
        React.createElement('div', { style: styles.content },
          React.createElement('div', { style: styles.finishScreen },
            React.createElement('div', { style: { fontSize: '3rem', marginBottom: '12px' } }, reaction.emoji),
            React.createElement('h2', { style: { fontSize: '2rem', fontWeight: '700', color: reaction.color, margin: '0 0 8px 0' } }, reaction.text),
            React.createElement('p', { style: { color: '#888', marginBottom: '24px' } }, reaction.sub),
            React.createElement('div', { style: styles.scoreCircle },
              React.createElement('div', { style: styles.scoreNum }, score),
              React.createElement('div', { style: styles.scoreTotal }, `out of ${questions.length}`)
            ),
            React.createElement('p', { style: { fontSize: '1.2rem', color: '#aaa', marginBottom: '24px' } },
              `${Math.round((score / questions.length) * 100)}% correct`
            ),
            React.createElement('button', {
              style: styles.startBtn,
              onClick: startGame,
              onMouseEnter: (e) => e.target.style.transform = 'scale(1.05)',
              onMouseLeave: (e) => e.target.style.transform = 'scale(1)',
            }, 'Try Again'),

            // Review
            React.createElement('div', { style: styles.reviewSection },
              React.createElement('div', { style: { fontSize: '0.85rem', color: '#8888aa', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '12px', fontWeight: '600' } }, 'Review'),
              answers.map((a, i) => {
                const isCorrect = a.selected === a.correct;
                return React.createElement('div', { key: i, style: styles.reviewItem(isCorrect) },
                  React.createElement('span', { style: styles.reviewIcon }, isCorrect ? '\u2705' : '\u274C'),
                  React.createElement('span', { style: styles.reviewText },
                    `Q${i + 1}: ${questions[i].question}`
                  ),
                  !isCorrect && React.createElement('span', { style: { fontSize: '0.75rem', color: '#43e97b' } },
                    a.timedOut ? 'Time\'s up!' : questions[i].options[a.correct]
                  )
                );
              })
            )
          )
        )
      )
    );
  }

  // PLAYING
  const q = questions[currentQ];
  const feedbackCorrect = answered && selected === q.correct;
  const feedbackWrong = answered && selected !== q.correct;

  return (
    React.createElement('div', { style: styles.container },
      React.createElement('a', { href: '/projects', style: styles.backLink }, '\u2190 Back to Projects'),
      React.createElement('div', { style: styles.content },

        // Progress bar
        React.createElement('div', { style: styles.progressBar },
          React.createElement('div', { style: styles.progressFill })
        ),

        // Top bar
        React.createElement('div', { style: styles.topBar },
          React.createElement('span', { style: styles.questionNum }, `Question ${currentQ + 1} of ${questions.length}`),
          React.createElement('div', { style: styles.timer },
            React.createElement('div', { style: styles.timerCircle }, timeLeft)
          ),
          React.createElement('span', { style: { fontSize: '0.9rem', color: '#43e97b', fontWeight: '600' } }, `Score: ${score}`)
        ),

        // Question
        React.createElement('div', { style: styles.questionCard },
          React.createElement('div', { style: styles.questionText }, q.question),
          React.createElement('div', { style: styles.optionsGrid },
            q.options.map((opt, i) =>
              React.createElement('div', {
                key: i,
                style: styles.option(i),
                onClick: () => handleAnswer(i),
                onMouseEnter: (e) => {
                  if (!answered) e.currentTarget.style.background = 'rgba(255,255,255,0.08)';
                },
                onMouseLeave: (e) => {
                  if (!answered) e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                },
              },
                React.createElement('span', { style: styles.optionLetter(i) }, String.fromCharCode(65 + i)),
                React.createElement('span', null, opt)
              )
            )
          )
        ),

        // Feedback
        answered && React.createElement('div', {
          style: {
            ...styles.feedback,
            background: feedbackCorrect ? 'rgba(67,233,123,0.12)' : 'rgba(255,107,107,0.12)',
            color: feedbackCorrect ? '#43e97b' : '#ff6b6b',
            border: `1px solid ${feedbackCorrect ? 'rgba(67,233,123,0.3)' : 'rgba(255,107,107,0.3)'}`,
          }
        }, feedbackCorrect ? '\u2705 Correct! Well done!' :
          (selected === -1 ? '\u23F0 Time\'s up! The answer was: ' + q.options[q.correct] : '\u274C Wrong! The correct answer was: ' + q.options[q.correct])
        ),

        // Next button
        answered && React.createElement('button', {
          style: styles.nextBtn,
          onClick: nextQuestion,
          onMouseEnter: (e) => e.target.style.transform = 'scale(1.02)',
          onMouseLeave: (e) => e.target.style.transform = 'scale(1)',
        }, currentQ + 1 >= questions.length ? 'See Results' : 'Next Question')
      )
    )
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
