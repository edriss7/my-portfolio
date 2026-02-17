const { useState, useCallback } = React;

var backLinkStyle = { color: '#8be9fd', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '20px' };
var containerStyle = { minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%)', color: '#e0e0e0', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", padding: '30px' };
var cardStyle = { background: 'rgba(30,30,58,0.8)', borderRadius: '12px', padding: '20px', border: '1px solid #2a2a4a' };

var colorMap = { purple: '#6c5ce7', blue: '#1e90ff', green: '#2ed573', red: '#ff6b6b', orange: '#ffa502', pink: '#fd79a8', teal: '#00cec9' };
var colorNames = Object.keys(colorMap);
var sizes = ['small', 'medium', 'large'];
var variants = ['solid', 'outline', 'ghost'];

var components = [
  { name: 'Button', icon: '\u25a3', desc: 'Interactive button with variants' },
  { name: 'Input', icon: '\u25a1', desc: 'Text input field' },
  { name: 'Card', icon: '\u25a2', desc: 'Content container card' },
  { name: 'Badge', icon: '\u25cf', desc: 'Status badge/label' },
  { name: 'Avatar', icon: '\u25d4', desc: 'User avatar display' },
  { name: 'Toggle', icon: '\u25d1', desc: 'Switch toggle control' },
  { name: 'Tooltip', icon: '\u25b3', desc: 'Hover tooltip' },
  { name: 'Modal', icon: '\u25a8', desc: 'Dialog modal overlay' },
  { name: 'Tabs', icon: '\u25a4', desc: 'Tab navigation' },
  { name: 'Progress', icon: '\u25ac', desc: 'Progress bar indicator' }
];

function getSizeValues(size) {
  if (size === 'small') return { padding: '6px 12px', fontSize: '12px', radius: '6px', height: '28px' };
  if (size === 'large') return { padding: '14px 28px', fontSize: '16px', radius: '12px', height: '48px' };
  return { padding: '10px 20px', fontSize: '14px', radius: '8px', height: '38px' };
}

function App() {
  var _sel = useState('Button'), selected = _sel[0], setSelected = _sel[1];
  var _color = useState('purple'), color = _color[0], setColor = _color[1];
  var _size = useState('medium'), size = _size[0], setSize = _size[1];
  var _variant = useState('solid'), variant = _variant[0], setVariant = _variant[1];
  var _disabled = useState(false), disabled = _disabled[0], setDisabled = _disabled[1];
  var _toggleOn = useState(false), toggleOn = _toggleOn[0], setToggleOn = _toggleOn[1];
  var _showModal = useState(false), showModal = _showModal[0], setShowModal = _showModal[1];
  var _activeTab = useState(0), activeTab = _activeTab[0], setActiveTab = _activeTab[1];
  var _progress = useState(65), progressVal = _progress[0], setProgressVal = _progress[1];
  var _tooltipShow = useState(false), tooltipShow = _tooltipShow[0], setTooltipShow = _tooltipShow[1];
  var _inputVal = useState(''), inputVal = _inputVal[0], setInputVal = _inputVal[1];

  var c = colorMap[color];
  var sv = getSizeValues(size);
  var op = disabled ? 0.5 : 1;

  var renderPreview = function() {
    var baseBtn = {
      padding: sv.padding, fontSize: sv.fontSize, borderRadius: sv.radius, fontWeight: '600',
      cursor: disabled ? 'not-allowed' : 'pointer', opacity: op, transition: 'all 0.2s', border: 'none'
    };

    switch (selected) {
      case 'Button':
        var btnBg = variant === 'solid' ? c : 'transparent';
        var btnColor = variant === 'solid' ? '#fff' : c;
        var btnBorder = variant === 'outline' ? '2px solid ' + c : variant === 'ghost' ? '2px solid transparent' : 'none';
        return React.createElement('div', { style: { display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' } },
          React.createElement('button', { style: Object.assign({}, baseBtn, { background: btnBg, color: btnColor, border: btnBorder }), disabled: disabled }, 'Primary'),
          React.createElement('button', { style: Object.assign({}, baseBtn, { background: btnBg, color: btnColor, border: btnBorder, borderRadius: '20px' }), disabled: disabled }, 'Rounded'),
          React.createElement('button', { style: Object.assign({}, baseBtn, { background: btnBg, color: btnColor, border: btnBorder }), disabled: disabled }, '\u2713 With Icon')
        );

      case 'Input':
        var inputBorder = variant === 'solid' ? '2px solid ' + c : variant === 'outline' ? '2px solid ' + c + '60' : '2px solid transparent';
        return React.createElement('div', { style: { display: 'flex', flexDirection: 'column', gap: '12px', maxWidth: '350px' } },
          React.createElement('label', { style: { fontSize: sv.fontSize, color: c, fontWeight: '600' } }, 'Label'),
          React.createElement('input', { style: { background: '#1e1e3a', border: inputBorder, borderRadius: sv.radius, color: '#e0e0e0', padding: sv.padding, fontSize: sv.fontSize, outline: 'none', opacity: op, boxSizing: 'border-box' }, placeholder: 'Type here...', value: inputVal, onChange: function(e) { setInputVal(e.target.value); }, disabled: disabled }),
          React.createElement('span', { style: { fontSize: '11px', color: '#888' } }, inputVal.length > 0 ? inputVal.length + ' characters' : 'Helper text')
        );

      case 'Card':
        return React.createElement('div', { style: { background: variant === 'solid' ? c + '15' : 'rgba(30,30,58,0.5)', border: '1px solid ' + (variant === 'outline' ? c : '#2a2a4a'), borderRadius: sv.radius, padding: sv.padding, maxWidth: '350px', opacity: op } },
          React.createElement('h3', { style: { margin: '0 0 8px 0', fontSize: sv.fontSize, color: c } }, 'Card Title'),
          React.createElement('p', { style: { margin: '0 0 12px 0', fontSize: '13px', color: '#bbb', lineHeight: '1.5' } }, 'This is a card component with customizable styles and content area.'),
          React.createElement('button', { style: { background: c, border: 'none', borderRadius: sv.radius, color: '#fff', padding: '6px 16px', fontSize: '12px', cursor: 'pointer' } }, 'Action')
        );

      case 'Badge':
        var badgePad = size === 'small' ? '2px 8px' : size === 'large' ? '6px 16px' : '4px 12px';
        return React.createElement('div', { style: { display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center' } },
          React.createElement('span', { style: { background: variant === 'solid' ? c : 'transparent', border: variant !== 'solid' ? '1px solid ' + c : 'none', color: variant === 'solid' ? '#fff' : c, borderRadius: '20px', padding: badgePad, fontSize: sv.fontSize, fontWeight: '600', opacity: op } }, 'Default'),
          React.createElement('span', { style: { background: '#2ed57333', color: '#2ed573', borderRadius: '20px', padding: badgePad, fontSize: sv.fontSize, fontWeight: '600' } }, 'Success'),
          React.createElement('span', { style: { background: '#ff6b6b33', color: '#ff6b6b', borderRadius: '20px', padding: badgePad, fontSize: sv.fontSize, fontWeight: '600' } }, 'Error'),
          React.createElement('span', { style: { background: '#ffa50233', color: '#ffa502', borderRadius: '20px', padding: badgePad, fontSize: sv.fontSize, fontWeight: '600' } }, 'Warning')
        );

      case 'Avatar':
        var avSize = size === 'small' ? 32 : size === 'large' ? 64 : 44;
        var avFont = size === 'small' ? 12 : size === 'large' ? 22 : 16;
        return React.createElement('div', { style: { display: 'flex', gap: '16px', alignItems: 'center' } },
          ['AC', 'BM', 'CW'].map(function(initials, i) {
            var colors = [c, '#00cec9', '#fd79a8'];
            return React.createElement('div', { key: i, style: { width: avSize + 'px', height: avSize + 'px', borderRadius: variant === 'outline' ? sv.radius : '50%', background: variant === 'solid' ? colors[i] : 'transparent', border: variant !== 'solid' ? '2px solid ' + colors[i] : 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: avFont + 'px', fontWeight: '700', color: variant === 'solid' ? '#fff' : colors[i], opacity: op } }, initials);
          }),
          React.createElement('div', { style: { display: 'flex' } },
            [0, 1, 2].map(function(i) {
              return React.createElement('div', { key: 'stack' + i, style: { width: avSize + 'px', height: avSize + 'px', borderRadius: '50%', background: [c, '#00cec9', '#fd79a8'][i], border: '3px solid #1e1e3a', marginLeft: i > 0 ? '-12px' : '0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: avFont + 'px', fontWeight: '700', color: '#fff', zIndex: 3 - i, position: 'relative' } }, ['A', 'B', 'C'][i]);
            })
          )
        );

      case 'Toggle':
        var tW = size === 'small' ? 36 : size === 'large' ? 56 : 46;
        var tH = size === 'small' ? 20 : size === 'large' ? 30 : 24;
        var tDot = tH - 6;
        return React.createElement('div', { style: { display: 'flex', gap: '20px', alignItems: 'center' } },
          React.createElement('div', { onClick: function() { if (!disabled) setToggleOn(!toggleOn); }, style: { width: tW + 'px', height: tH + 'px', borderRadius: tH + 'px', background: toggleOn ? c : '#3a3a5c', cursor: disabled ? 'not-allowed' : 'pointer', position: 'relative', transition: 'background 0.3s', opacity: op } },
            React.createElement('div', { style: { width: tDot + 'px', height: tDot + 'px', borderRadius: '50%', background: '#fff', position: 'absolute', top: '3px', left: toggleOn ? (tW - tDot - 3) + 'px' : '3px', transition: 'left 0.3s', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' } })
          ),
          React.createElement('span', { style: { fontSize: sv.fontSize, color: toggleOn ? c : '#888' } }, toggleOn ? 'Enabled' : 'Disabled')
        );

      case 'Tooltip':
        return React.createElement('div', { style: { display: 'flex', gap: '20px', alignItems: 'center', position: 'relative' } },
          React.createElement('div', { onMouseEnter: function() { setTooltipShow(true); }, onMouseLeave: function() { setTooltipShow(false); }, style: { padding: sv.padding, background: c, borderRadius: sv.radius, cursor: 'pointer', color: '#fff', fontSize: sv.fontSize, fontWeight: '600', position: 'relative', display: 'inline-block' } },
            'Hover Me',
            tooltipShow && React.createElement('div', { style: { position: 'absolute', bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: '8px', background: '#1a1a3a', border: '1px solid #3a3a5c', borderRadius: '6px', padding: '8px 14px', fontSize: '12px', color: '#e0e0e0', whiteSpace: 'nowrap', zIndex: 10, boxShadow: '0 4px 12px rgba(0,0,0,0.3)' } },
              'This is a tooltip!',
              React.createElement('div', { style: { position: 'absolute', top: '100%', left: '50%', transform: 'translateX(-50%)', width: 0, height: 0, borderLeft: '6px solid transparent', borderRight: '6px solid transparent', borderTop: '6px solid #3a3a5c' } })
            )
          ),
          React.createElement('span', { style: { fontSize: '13px', color: '#888' } }, 'Hover the button to see the tooltip')
        );

      case 'Modal':
        return React.createElement('div', null,
          React.createElement('button', { style: { background: c, border: 'none', borderRadius: sv.radius, color: '#fff', padding: sv.padding, fontSize: sv.fontSize, cursor: 'pointer', fontWeight: '600' }, onClick: function() { setShowModal(true); } }, 'Open Modal'),
          showModal && React.createElement('div', { style: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }, onClick: function() { setShowModal(false); } },
            React.createElement('div', { style: { background: '#1e1e3a', borderRadius: '16px', padding: '30px', maxWidth: '420px', width: '90%', border: '1px solid ' + c + '40', boxShadow: '0 20px 60px rgba(0,0,0,0.5)' }, onClick: function(e) { e.stopPropagation(); } },
              React.createElement('h2', { style: { margin: '0 0 12px 0', color: c, fontSize: '20px' } }, 'Modal Title'),
              React.createElement('p', { style: { margin: '0 0 20px 0', color: '#bbb', lineHeight: '1.5' } }, 'This is a modal dialog. Click outside or press the button below to close it.'),
              React.createElement('div', { style: { display: 'flex', justifyContent: 'flex-end', gap: '10px' } },
                React.createElement('button', { style: { background: '#2a2a4a', border: 'none', borderRadius: '8px', color: '#ccc', padding: '8px 20px', cursor: 'pointer', fontSize: '14px' }, onClick: function() { setShowModal(false); } }, 'Cancel'),
                React.createElement('button', { style: { background: c, border: 'none', borderRadius: '8px', color: '#fff', padding: '8px 20px', cursor: 'pointer', fontSize: '14px', fontWeight: '600' }, onClick: function() { setShowModal(false); } }, 'Confirm')
              )
            )
          )
        );

      case 'Tabs':
        var tabLabels = ['Overview', 'Settings', 'Analytics'];
        return React.createElement('div', { style: { maxWidth: '400px' } },
          React.createElement('div', { style: { display: 'flex', borderBottom: '2px solid #2a2a4a', marginBottom: '16px' } },
            tabLabels.map(function(label, i) {
              var isActive = activeTab === i;
              return React.createElement('button', { key: i, style: { background: 'none', border: 'none', borderBottom: isActive ? '2px solid ' + c : '2px solid transparent', color: isActive ? c : '#888', padding: sv.padding, fontSize: sv.fontSize, cursor: 'pointer', fontWeight: isActive ? '600' : '400', marginBottom: '-2px', transition: 'all 0.2s' }, onClick: function() { setActiveTab(i); } }, label);
            })
          ),
          React.createElement('div', { style: { padding: '12px', color: '#bbb', fontSize: sv.fontSize, lineHeight: '1.5' } },
            activeTab === 0 && 'This is the Overview tab content. Click other tabs to switch.',
            activeTab === 1 && 'Settings panel with configuration options would go here.',
            activeTab === 2 && 'Analytics dashboard showing charts and metrics.'
          )
        );

      case 'Progress':
        return React.createElement('div', { style: { maxWidth: '400px' } },
          React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', marginBottom: '8px' } },
            React.createElement('span', { style: { fontSize: sv.fontSize, color: c, fontWeight: '600' } }, 'Progress'),
            React.createElement('span', { style: { fontSize: sv.fontSize, color: '#888' } }, progressVal + '%')
          ),
          React.createElement('div', { style: { background: '#1a1a3a', borderRadius: sv.radius, height: size === 'small' ? '8px' : size === 'large' ? '20px' : '12px', overflow: 'hidden', marginBottom: '16px' } },
            React.createElement('div', { style: { width: progressVal + '%', height: '100%', background: variant === 'solid' ? 'linear-gradient(90deg, ' + c + ', ' + c + '88)' : c, borderRadius: sv.radius, transition: 'width 0.5s ease' } })
          ),
          React.createElement('input', { type: 'range', min: 0, max: 100, value: progressVal, onChange: function(e) { setProgressVal(parseInt(e.target.value)); }, style: { width: '100%', accentColor: c } })
        );

      default: return null;
    }
  };

  return React.createElement('div', { style: containerStyle },
    React.createElement('a', { href: '/projects', style: backLinkStyle }, '\u2190 Back to Projects'),
    React.createElement('h1', { style: { fontSize: '32px', fontWeight: '700', marginBottom: '8px', background: 'linear-gradient(90deg, #6c5ce7, #00cec9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' } }, 'Component Storybook'),
    React.createElement('p', { style: { color: '#888', marginBottom: '24px' } }, 'Interactive component library with prop controls'),

    React.createElement('div', { style: { display: 'flex', gap: '20px', flexWrap: 'wrap' } },
      // Sidebar
      React.createElement('div', { style: { width: '220px', flexShrink: 0 } },
        React.createElement('div', { style: Object.assign({}, cardStyle, { padding: '12px' }) },
          React.createElement('h3', { style: { margin: '0 0 12px 0', color: '#a29bfe', fontSize: '14px', paddingLeft: '8px' } }, 'Components'),
          components.map(function(comp) {
            var isSelected = selected === comp.name;
            return React.createElement('div', { key: comp.name, onClick: function() { setSelected(comp.name); }, style: { padding: '10px 12px', cursor: 'pointer', borderRadius: '8px', marginBottom: '2px', background: isSelected ? 'rgba(108,92,231,0.2)' : 'transparent', borderLeft: isSelected ? '3px solid #6c5ce7' : '3px solid transparent', transition: 'all 0.2s' } },
              React.createElement('div', { style: { fontSize: '14px', color: isSelected ? '#a29bfe' : '#ccc', fontWeight: isSelected ? '600' : '400' } }, comp.icon + ' ' + comp.name),
              React.createElement('div', { style: { fontSize: '11px', color: '#666', marginTop: '2px' } }, comp.desc)
            );
          })
        )
      ),

      // Main content
      React.createElement('div', { style: { flex: '1', minWidth: '300px' } },
        // Controls bar
        React.createElement('div', { style: Object.assign({}, cardStyle, { marginBottom: '16px' }) },
          React.createElement('h3', { style: { margin: '0 0 14px 0', color: '#a29bfe', fontSize: '15px' } }, 'Props'),
          React.createElement('div', { style: { display: 'flex', gap: '20px', flexWrap: 'wrap' } },
            // Color
            React.createElement('div', null,
              React.createElement('label', { style: { fontSize: '12px', color: '#888', display: 'block', marginBottom: '6px' } }, 'Color'),
              React.createElement('div', { style: { display: 'flex', gap: '4px' } },
                colorNames.map(function(cn) {
                  return React.createElement('div', { key: cn, onClick: function() { setColor(cn); }, style: { width: '24px', height: '24px', borderRadius: '50%', background: colorMap[cn], cursor: 'pointer', border: color === cn ? '3px solid #fff' : '3px solid transparent', transition: 'border 0.2s', boxSizing: 'border-box' } });
                })
              )
            ),
            // Size
            React.createElement('div', null,
              React.createElement('label', { style: { fontSize: '12px', color: '#888', display: 'block', marginBottom: '6px' } }, 'Size'),
              React.createElement('div', { style: { display: 'flex', gap: '4px' } },
                sizes.map(function(s) {
                  return React.createElement('button', { key: s, style: { background: size === s ? '#6c5ce7' : '#1e1e3a', border: '1px solid ' + (size === s ? '#6c5ce7' : '#3a3a5c'), borderRadius: '6px', color: size === s ? '#fff' : '#888', cursor: 'pointer', padding: '4px 12px', fontSize: '12px', textTransform: 'capitalize' }, onClick: function() { setSize(s); } }, s);
                })
              )
            ),
            // Variant
            React.createElement('div', null,
              React.createElement('label', { style: { fontSize: '12px', color: '#888', display: 'block', marginBottom: '6px' } }, 'Variant'),
              React.createElement('div', { style: { display: 'flex', gap: '4px' } },
                variants.map(function(v) {
                  return React.createElement('button', { key: v, style: { background: variant === v ? '#6c5ce7' : '#1e1e3a', border: '1px solid ' + (variant === v ? '#6c5ce7' : '#3a3a5c'), borderRadius: '6px', color: variant === v ? '#fff' : '#888', cursor: 'pointer', padding: '4px 12px', fontSize: '12px', textTransform: 'capitalize' }, onClick: function() { setVariant(v); } }, v);
                })
              )
            ),
            // Disabled
            React.createElement('div', null,
              React.createElement('label', { style: { fontSize: '12px', color: '#888', display: 'block', marginBottom: '6px' } }, 'Disabled'),
              React.createElement('div', { onClick: function() { setDisabled(!disabled); }, style: { width: '40px', height: '22px', borderRadius: '11px', background: disabled ? '#ff6b6b' : '#3a3a5c', cursor: 'pointer', position: 'relative', transition: 'background 0.3s' } },
                React.createElement('div', { style: { width: '16px', height: '16px', borderRadius: '50%', background: '#fff', position: 'absolute', top: '3px', left: disabled ? '21px' : '3px', transition: 'left 0.3s' } })
              )
            )
          )
        ),

        // Preview area
        React.createElement('div', { style: Object.assign({}, cardStyle) },
          React.createElement('div', { style: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' } },
            React.createElement('h3', { style: { margin: 0, color: '#fff', fontSize: '18px' } }, selected + ' Preview'),
            React.createElement('span', { style: { fontSize: '12px', color: '#666', background: '#1a1a3a', padding: '4px 10px', borderRadius: '6px', fontFamily: 'monospace' } }, '<' + selected + ' color="' + color + '" size="' + size + '" variant="' + variant + '" />')
          ),
          React.createElement('div', { style: { background: '#0a0a1a', borderRadius: '10px', padding: '40px', minHeight: '150px', display: 'flex', alignItems: 'center', justifyContent: 'center' } },
            renderPreview()
          )
        )
      )
    )
  );
}

var root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
