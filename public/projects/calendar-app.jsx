const { useState, useEffect, useRef } = React;

var DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
var MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

function formatDate(year, month, day) {
  return year + '-' + (month + 1 < 10 ? '0' : '') + (month + 1) + '-' + (day < 10 ? '0' : '') + day;
}

var today = new Date();

function App() {
  var _s1 = useState(today.getFullYear());
  var year = _s1[0], setYear = _s1[1];
  var _s2 = useState(today.getMonth());
  var month = _s2[0], setMonth = _s2[1];
  var _s3 = useState(null);
  var selectedDate = _s3[0], setSelectedDate = _s3[1];
  var _s4 = useState({
    '2026-02-14': [{ id: 1, title: "Valentine's Day Dinner", time: '19:00' }],
    '2026-02-17': [{ id: 2, title: 'Team Meeting', time: '10:00' }, { id: 3, title: 'Gym Session', time: '18:00' }],
    '2026-02-20': [{ id: 4, title: 'Project Deadline', time: '23:59' }]
  });
  var events = _s4[0], setEvents = _s4[1];
  var _s5 = useState('');
  var newEventTitle = _s5[0], setNewEventTitle = _s5[1];
  var _s6 = useState('12:00');
  var newEventTime = _s6[0], setNewEventTime = _s6[1];
  var nextId = useRef(5);

  var daysInMonth = getDaysInMonth(year, month);
  var firstDay = getFirstDayOfMonth(year, month);
  var todayStr = formatDate(today.getFullYear(), today.getMonth(), today.getDate());

  function prevMonth() {
    if (month === 0) { setYear(function(y) { return y - 1; }); setMonth(11); }
    else { setMonth(function(m) { return m - 1; }); }
  }

  function nextMonth() {
    if (month === 11) { setYear(function(y) { return y + 1; }); setMonth(0); }
    else { setMonth(function(m) { return m + 1; }); }
  }

  function selectDay(day) {
    var dateStr = formatDate(year, month, day);
    setSelectedDate(dateStr);
  }

  function addEvent() {
    if (!selectedDate || !newEventTitle.trim()) return;
    var newEvent = { id: nextId.current++, title: newEventTitle.trim(), time: newEventTime };
    setEvents(function(prev) {
      var updated = Object.assign({}, prev);
      if (!updated[selectedDate]) updated[selectedDate] = [];
      updated[selectedDate] = updated[selectedDate].concat([newEvent]);
      return updated;
    });
    setNewEventTitle('');
    setNewEventTime('12:00');
  }

  function deleteEvent(dateStr, eventId) {
    setEvents(function(prev) {
      var updated = Object.assign({}, prev);
      if (updated[dateStr]) {
        updated[dateStr] = updated[dateStr].filter(function(e) { return e.id !== eventId; });
        if (updated[dateStr].length === 0) delete updated[dateStr];
      }
      return updated;
    });
  }

  var calendarCells = [];
  for (var i = 0; i < firstDay; i++) calendarCells.push(null);
  for (var d = 1; d <= daysInMonth; d++) calendarCells.push(d);

  var selectedEvents = selectedDate && events[selectedDate] ? events[selectedDate] : [];

  var styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%)',
      color: '#e0e0e0',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      padding: '0 0 40px'
    },
    backLink: { color: '#888', textDecoration: 'none', padding: '15px 20px', display: 'inline-block', fontSize: '14px' },
    header: { textAlign: 'center', fontSize: '28px', color: '#fff', margin: '0 0 25px' },
    content: { maxWidth: '800px', margin: '0 auto', padding: '0 20px', display: 'flex', gap: '25px', flexWrap: 'wrap' },
    calendarPanel: { flex: '1 1 450px' },
    navRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' },
    navBtn: {
      background: 'rgba(255,255,255,0.1)',
      border: 'none',
      color: '#fff',
      fontSize: '18px',
      cursor: 'pointer',
      padding: '8px 14px',
      borderRadius: '8px'
    },
    monthTitle: { fontSize: '20px', fontWeight: 'bold', color: '#fff' },
    todayBtn: {
      background: 'rgba(155,89,182,0.3)',
      border: 'none',
      color: '#9b59b6',
      fontSize: '12px',
      cursor: 'pointer',
      padding: '5px 12px',
      borderRadius: '6px',
      marginLeft: '10px'
    },
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(7, 1fr)',
      gap: '4px',
      background: 'rgba(255,255,255,0.03)',
      borderRadius: '12px',
      padding: '10px'
    },
    dayHeader: {
      textAlign: 'center',
      padding: '8px',
      fontSize: '12px',
      fontWeight: '600',
      color: '#888'
    },
    dayCell: {
      textAlign: 'center',
      padding: '10px 4px',
      borderRadius: '8px',
      cursor: 'pointer',
      minHeight: '42px',
      position: 'relative',
      fontSize: '14px'
    },
    eventDot: {
      width: '6px',
      height: '6px',
      borderRadius: '50%',
      background: '#9b59b6',
      margin: '3px auto 0',
      display: 'block'
    },
    sidePanel: {
      flex: '1 1 280px',
      background: 'rgba(255,255,255,0.06)',
      borderRadius: '12px',
      padding: '20px'
    },
    sidePanelTitle: { fontSize: '16px', fontWeight: '600', color: '#fff', marginBottom: '15px' },
    eventItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '10px 12px',
      background: 'rgba(255,255,255,0.06)',
      borderRadius: '8px',
      marginBottom: '8px'
    },
    eventTitle: { fontSize: '14px', color: '#fff' },
    eventTime: { fontSize: '12px', color: '#9b59b6', marginTop: '2px' },
    eventDeleteBtn: {
      background: 'none',
      border: 'none',
      color: '#e74c3c',
      fontSize: '14px',
      cursor: 'pointer',
      padding: '4px'
    },
    addForm: { marginTop: '15px', borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '15px' },
    input: {
      width: '100%',
      padding: '10px 12px',
      borderRadius: '8px',
      border: '1px solid rgba(255,255,255,0.15)',
      background: 'rgba(255,255,255,0.08)',
      color: '#fff',
      fontSize: '14px',
      outline: 'none',
      marginBottom: '8px',
      boxSizing: 'border-box'
    },
    addBtn: {
      width: '100%',
      padding: '10px',
      borderRadius: '8px',
      border: 'none',
      background: 'linear-gradient(135deg, #9b59b6, #3498db)',
      color: '#fff',
      fontSize: '14px',
      cursor: 'pointer',
      fontWeight: '600'
    },
    noSelection: { textAlign: 'center', color: '#666', padding: '30px', fontSize: '14px' }
  };

  return React.createElement('div', { style: styles.container },
    React.createElement('a', { href: '/projects', style: styles.backLink }, '\u2190 Back to Projects'),
    React.createElement('h1', { style: styles.header }, 'Calendar'),
    React.createElement('div', { style: styles.content },
      React.createElement('div', { style: styles.calendarPanel },
        React.createElement('div', { style: styles.navRow },
          React.createElement('button', { style: styles.navBtn, onClick: prevMonth }, '\u2039'),
          React.createElement('div', { style: { display: 'flex', alignItems: 'center' } },
            React.createElement('span', { style: styles.monthTitle }, MONTHS[month] + ' ' + year),
            React.createElement('button', { style: styles.todayBtn, onClick: function() {
              setYear(today.getFullYear());
              setMonth(today.getMonth());
              setSelectedDate(todayStr);
            } }, 'Today')
          ),
          React.createElement('button', { style: styles.navBtn, onClick: nextMonth }, '\u203A')
        ),
        React.createElement('div', { style: styles.grid },
          DAYS.map(function(day) {
            return React.createElement('div', { key: day, style: styles.dayHeader }, day);
          }),
          calendarCells.map(function(day, idx) {
            if (day === null) {
              return React.createElement('div', { key: 'empty-' + idx, style: styles.dayCell });
            }
            var dateStr = formatDate(year, month, day);
            var isToday = dateStr === todayStr;
            var isSelected = dateStr === selectedDate;
            var hasEvents = events[dateStr] && events[dateStr].length > 0;
            var cellStyle = Object.assign({}, styles.dayCell, {
              background: isSelected ? 'rgba(155,89,182,0.35)' : isToday ? 'rgba(52,152,219,0.25)' : 'transparent',
              color: isToday ? '#3498db' : '#ddd',
              fontWeight: isToday ? 'bold' : 'normal',
              border: isSelected ? '2px solid #9b59b6' : isToday ? '2px solid #3498db' : '2px solid transparent'
            });
            return React.createElement('div', {
              key: day,
              style: cellStyle,
              onClick: function() { selectDay(day); },
              onMouseEnter: function(e) { if (!isSelected) e.currentTarget.style.background = 'rgba(255,255,255,0.08)'; },
              onMouseLeave: function(e) { if (!isSelected) e.currentTarget.style.background = isToday ? 'rgba(52,152,219,0.25)' : 'transparent'; }
            },
              React.createElement('span', null, day),
              hasEvents ? React.createElement('span', { style: styles.eventDot }) : null
            );
          })
        )
      ),
      React.createElement('div', { style: styles.sidePanel },
        selectedDate
          ? React.createElement('div', null,
              React.createElement('div', { style: styles.sidePanelTitle }, 'Events for ' + selectedDate),
              selectedEvents.length === 0
                ? React.createElement('div', { style: { color: '#666', fontSize: '14px', padding: '10px 0' } }, 'No events for this day')
                : selectedEvents.map(function(ev) {
                    return React.createElement('div', { key: ev.id, style: styles.eventItem },
                      React.createElement('div', null,
                        React.createElement('div', { style: styles.eventTitle }, ev.title),
                        React.createElement('div', { style: styles.eventTime }, ev.time)
                      ),
                      React.createElement('button', {
                        style: styles.eventDeleteBtn,
                        onClick: function() { deleteEvent(selectedDate, ev.id); }
                      }, '\u2715')
                    );
                  }),
              React.createElement('div', { style: styles.addForm },
                React.createElement('div', { style: { fontSize: '14px', fontWeight: '600', color: '#ccc', marginBottom: '8px' } }, 'Add Event'),
                React.createElement('input', {
                  style: styles.input,
                  placeholder: 'Event title',
                  value: newEventTitle,
                  onChange: function(e) { setNewEventTitle(e.target.value); },
                  onKeyDown: function(e) { if (e.key === 'Enter') addEvent(); }
                }),
                React.createElement('input', {
                  style: styles.input,
                  type: 'time',
                  value: newEventTime,
                  onChange: function(e) { setNewEventTime(e.target.value); }
                }),
                React.createElement('button', { style: styles.addBtn, onClick: addEvent }, 'Add Event')
              )
            )
          : React.createElement('div', { style: styles.noSelection }, 'Click on a day to view and add events')
      )
    )
  );
}

var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
