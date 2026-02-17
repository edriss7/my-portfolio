const { useState, useMemo } = React;

var sampleMarkdown = '# Welcome to Markdown Previewer\n\nThis is a **live markdown** editor. Type on the left and see the *rendered output* on the right.\n\n## Features\n\n- **Bold text** using double asterisks\n- *Italic text* using single asterisks\n- Headers using # symbols\n- Lists using dashes\n- `Inline code` using backticks\n- Links and blockquotes\n\n### Code Example\n\n```\nfunction greet(name) {\n  return "Hello, " + name;\n}\nconsole.log(greet("World"));\n```\n\n> This is a blockquote. It can span\n> multiple lines and is great for\n> highlighting important text.\n\n## Links\n\nVisit [OpenAI](https://openai.com) for more info.\n\n## More Examples\n\n1. First ordered item\n2. Second ordered item\n3. Third ordered item\n\n---\n\nThat\'s it! Start editing to see changes in real-time.';

function parseMarkdown(md) {
  var html = md;

  // Code blocks
  html = html.replace(/```([\s\S]*?)```/g, function(match, code) {
    return '<pre style="background:rgba(255,255,255,0.08);border-radius:8px;padding:15px;overflow-x:auto;font-family:monospace;font-size:13px;border:1px solid rgba(255,255,255,0.1);"><code>' + code.replace(/</g, '&lt;').replace(/>/g, '&gt;').trim() + '</code></pre>';
  });

  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code style="background:rgba(255,255,255,0.1);padding:2px 6px;border-radius:4px;font-family:monospace;font-size:13px;">$1</code>');

  // Headers
  html = html.replace(/^###### (.+)$/gm, '<h6 style="color:#c084fc;margin:12px 0 8px;">$1</h6>');
  html = html.replace(/^##### (.+)$/gm, '<h5 style="color:#c084fc;margin:12px 0 8px;">$1</h5>');
  html = html.replace(/^#### (.+)$/gm, '<h4 style="color:#a78bfa;margin:14px 0 8px;">$1</h4>');
  html = html.replace(/^### (.+)$/gm, '<h3 style="color:#a78bfa;margin:16px 0 10px;font-size:18px;">$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2 style="color:#8b5cf6;margin:20px 0 12px;font-size:22px;border-bottom:1px solid rgba(255,255,255,0.1);padding-bottom:8px;">$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1 style="color:#8b5cf6;margin:20px 0 14px;font-size:28px;">$1</h1>');

  // Horizontal rule
  html = html.replace(/^---$/gm, '<hr style="border:none;border-top:1px solid rgba(255,255,255,0.15);margin:20px 0;">');

  // Bold and italic
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong style="color:#e0e0ff;">$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');

  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" style="color:#60a5fa;text-decoration:underline;" target="_blank">$1</a>');

  // Blockquotes
  html = html.replace(/^> (.+)$/gm, '<blockquote style="border-left:4px solid #8b5cf6;margin:10px 0;padding:8px 16px;background:rgba(139,92,246,0.08);border-radius:0 8px 8px 0;color:#c4b5fd;">$1</blockquote>');

  // Ordered lists
  html = html.replace(/^\d+\. (.+)$/gm, '<li style="margin:4px 0;margin-left:20px;list-style-type:decimal;">$1</li>');

  // Unordered lists
  html = html.replace(/^- (.+)$/gm, '<li style="margin:4px 0;margin-left:20px;">$1</li>');

  // Paragraphs - wrap lines that aren't already HTML tags
  var lines = html.split('\n');
  var result = [];
  var inBlock = false;
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i].trim();
    if (line.startsWith('<pre') || line.startsWith('<h') || line.startsWith('<blockquote') || line.startsWith('<hr') || line.startsWith('<li') || line.startsWith('<ul') || line.startsWith('<ol')) {
      result.push(line);
    } else if (line === '') {
      result.push('<br>');
    } else if (!line.startsWith('<')) {
      result.push('<p style="margin:8px 0;line-height:1.7;">' + line + '</p>');
    } else {
      result.push(line);
    }
  }
  return result.join('\n');
}

function App() {
  const [markdown, setMarkdown] = useState(sampleMarkdown);
  var renderedHtml = useMemo(function() { return parseMarkdown(markdown); }, [markdown]);

  var styles = {
    container: { minHeight: '100vh', background: 'linear-gradient(135deg, #0a0a1a 0%, #1a1a3e 100%)', color: '#e0e0ff', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", padding: '20px', display: 'flex', flexDirection: 'column' },
    backLink: { color: '#8888ff', textDecoration: 'none', fontSize: '14px', display: 'inline-block', marginBottom: '20px' },
    title: { textAlign: 'center', fontSize: '32px', marginBottom: '10px', color: '#ffffff' },
    subtitle: { textAlign: 'center', fontSize: '16px', color: '#aaa', marginBottom: '20px' },
    splitView: { display: 'flex', gap: '20px', flex: 1, minHeight: '500px' },
    paneHeader: { background: 'rgba(255,255,255,0.08)', padding: '10px 16px', borderRadius: '12px 12px 0 0', fontSize: '13px', fontWeight: 'bold', color: '#aaa', textTransform: 'uppercase', letterSpacing: '1px', borderBottom: '1px solid rgba(255,255,255,0.1)' },
    editorPane: { flex: 1, display: 'flex', flexDirection: 'column' },
    previewPane: { flex: 1, display: 'flex', flexDirection: 'column' },
    textarea: { flex: 1, width: '100%', padding: '20px', fontSize: '14px', fontFamily: "'Fira Code', 'Consolas', monospace", background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderTop: 'none', borderRadius: '0 0 12px 12px', color: '#e0e0ff', outline: 'none', resize: 'none', lineHeight: '1.6', boxSizing: 'border-box' },
    preview: { flex: 1, padding: '20px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderTop: 'none', borderRadius: '0 0 12px 12px', overflow: 'auto', lineHeight: '1.6', fontSize: '15px', color: '#d0d0f0' },
    stats: { display: 'flex', justifyContent: 'center', gap: '20px', marginBottom: '20px' },
    stat: { fontSize: '13px', color: '#777' }
  };

  var wordCount = markdown.trim() ? markdown.trim().split(/\s+/).length : 0;
  var lineCount = markdown.split('\n').length;
  var charCount = markdown.length;

  return React.createElement('div', { style: styles.container },
    React.createElement('a', { href: '/projects', style: styles.backLink }, '\u2190 Back to Projects'),
    React.createElement('h1', { style: styles.title }, 'Markdown Previewer'),
    React.createElement('p', { style: styles.subtitle }, 'Write Markdown on the left, see rendered HTML on the right'),

    React.createElement('div', { style: styles.stats },
      React.createElement('span', { style: styles.stat }, wordCount + ' words'),
      React.createElement('span', { style: styles.stat }, lineCount + ' lines'),
      React.createElement('span', { style: styles.stat }, charCount + ' characters')
    ),

    React.createElement('div', { style: styles.splitView },
      React.createElement('div', { style: styles.editorPane },
        React.createElement('div', { style: styles.paneHeader }, 'Editor'),
        React.createElement('textarea', {
          value: markdown,
          onChange: function(e) { setMarkdown(e.target.value); },
          style: styles.textarea,
          spellCheck: false
        })
      ),
      React.createElement('div', { style: styles.previewPane },
        React.createElement('div', { style: styles.paneHeader }, 'Preview'),
        React.createElement('div', {
          style: styles.preview,
          dangerouslySetInnerHTML: { __html: renderedHtml }
        })
      )
    )
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(React.createElement(App));
