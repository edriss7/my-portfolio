const { useState, useMemo, useEffect } = React;

// ============ DEMO LINKS (first 10 projects are built) ============
const DEMO_LINKS = {
  1: '/project/todo',
  2: '/project/counter',
  3: '/project/calculator',
  4: '/project/weather',
  5: '/project/clock',
  6: '/project/colorpicker',
  7: '/project/tip',
  8: '/project/quiz',
  9: '/project/quotes',
  10: '/project/bmi',
  11: '/project/stopwatch',
  12: '/project/unit-converter',
  13: '/project/grocery',
  14: '/project/flashcard',
  15: '/project/password-gen',
  16: '/project/emoji-search',
  17: '/project/accordion-faq',
  18: '/project/image-gallery',
  19: '/project/countdown',
  20: '/project/tictactoe',
  21: '/project/dice',
  22: '/project/theme-switcher',
  23: '/project/form-validator',
  24: '/project/pomodoro',
  25: '/project/markdown',
  26: '/project/blog',
  27: '/project/movie-db',
  28: '/project/chat-app',
  29: '/project/ecommerce',
  30: '/project/recipe-finder',
  31: '/project/music-player',
  32: '/project/kanban',
  33: '/project/expense-tracker',
  34: '/project/social-feed',
  35: '/project/calendar',
  36: '/project/file-explorer',
  37: '/project/code-editor',
  38: '/project/drawing',
  39: '/project/survey',
  40: '/project/url-shortener',
  41: '/project/vegetarian-recipes',
  42: '/project/notification-system',
  43: '/project/auth-flow',
  44: '/project/dashboard-layout',
  45: '/project/multi-step-form',
  46: '/project/infinite-scroll',
  47: '/project/search-autocomplete',
  48: '/project/photo-editor',
  49: '/project/portfolio',
  50: '/project/data-table',
  51: '/project/drag-drop-list',
  52: '/project/notes-tags',
  53: '/project/currency-converter',
  54: '/project/voting-poll',
  55: '/project/bookmark-manager',
  56: '/project/project-management',
  57: '/project/video-player',
  58: '/project/realtime-collab',
  59: '/project/graphql-explorer',
  60: '/project/animation-library',
  61: '/project/component-storybook',
  62: '/project/state-machine',
  63: '/project/websocket-dashboard',
  64: '/project/virtual-keyboard',
  65: '/project/spreadsheet',
  66: '/project/mind-map',
  67: '/project/audio-visualizer',
  68: '/project/pdf-viewer',
  69: '/project/cli-terminal',
  70: '/project/chess',
  71: '/project/3d-viewer',
  72: '/project/cms-dashboard',
  73: '/project/email-client',
  74: '/project/api-tester',
  75: '/project/db-designer',
  76: '/project/code-snippets',
  77: '/project/browser-extension',
  78: '/project/mobile-app',
  79: '/project/pwa',
  80: '/project/cicd-pipeline',
  81: '/project/ide',
  82: '/project/design-system',
  83: '/project/multiplayer-game',
  84: '/project/ml-ui',
  85: '/project/video-editor',
  86: '/project/map-app',
  87: '/project/social-network',
  88: '/project/compiler',
  89: '/project/cloud-storage',
  90: '/project/realtime-analytics',
  91: '/project/ar-vr',
  92: '/project/blockchain-explorer',
  93: '/project/smart-home',
  94: '/project/healthcare-portal',
  95: '/project/erp-system',
  96: '/project/stock-trading',
  97: '/project/ai-chat',
  98: '/project/devops-dashboard',
  99: '/project/lms',
  100: '/project/os-ui',
};

// ============ PROJECT DATA ============
const PROJECTS = [
  // BEGINNER (1-25)
  { id: 1, name: 'Todo List App', desc: 'Classic task manager with add, delete, complete', difficulty: 'beginner', types: ['Full Apps', 'Productivity'], time: '2-4 hours' },
  { id: 2, name: 'Counter App', desc: 'Increment, decrement with animations', difficulty: 'beginner', types: ['UI Components'], time: '1-2 hours' },
  { id: 3, name: 'Calculator', desc: 'Basic arithmetic operations', difficulty: 'beginner', types: ['Tools'], time: '3-5 hours' },
  { id: 4, name: 'Weather Display', desc: 'Show weather data with icons', difficulty: 'beginner', types: ['Full Apps', 'Data Visualization'], time: '3-5 hours' },
  { id: 5, name: 'Digital Clock', desc: 'Real-time clock with themes', difficulty: 'beginner', types: ['UI Components'], time: '1-3 hours' },
  { id: 6, name: 'Color Picker', desc: 'RGB/HEX color selector', difficulty: 'beginner', types: ['Tools', 'UI Components'], time: '2-4 hours' },
  { id: 7, name: 'Tip Calculator', desc: 'Split bills and calculate tips', difficulty: 'beginner', types: ['Tools'], time: '2-3 hours' },
  { id: 8, name: 'Quiz App', desc: 'Multiple choice questions with score', difficulty: 'beginner', types: ['Full Apps', 'Games'], time: '4-6 hours' },
  { id: 9, name: 'Random Quote Generator', desc: 'Display inspirational quotes', difficulty: 'beginner', types: ['UI Components'], time: '1-3 hours' },
  { id: 10, name: 'BMI Calculator', desc: 'Calculate body mass index', difficulty: 'beginner', types: ['Tools'], time: '2-3 hours' },
  { id: 11, name: 'Stopwatch', desc: 'Start, stop, lap timer', difficulty: 'beginner', types: ['Tools', 'UI Components'], time: '2-4 hours' },
  { id: 12, name: 'Unit Converter', desc: 'Convert between units', difficulty: 'beginner', types: ['Tools'], time: '3-5 hours' },
  { id: 13, name: 'Grocery List', desc: 'Shopping list with quantities', difficulty: 'beginner', types: ['Full Apps', 'Productivity'], time: '2-4 hours' },
  { id: 14, name: 'Flashcard App', desc: 'Study cards with flip animation', difficulty: 'beginner', types: ['Full Apps', 'UI Components'], time: '3-5 hours' },
  { id: 15, name: 'Password Generator', desc: 'Generate secure passwords', difficulty: 'beginner', types: ['Tools'], time: '2-3 hours' },
  { id: 16, name: 'Emoji Search', desc: 'Search and copy emojis', difficulty: 'beginner', types: ['Tools', 'UI Components'], time: '2-4 hours' },
  { id: 17, name: 'Accordion FAQ', desc: 'Expandable FAQ sections', difficulty: 'beginner', types: ['UI Components'], time: '1-3 hours' },
  { id: 18, name: 'Image Gallery', desc: 'Grid of images with lightbox', difficulty: 'beginner', types: ['UI Components'], time: '3-5 hours' },
  { id: 19, name: 'Countdown Timer', desc: 'Event countdown', difficulty: 'beginner', types: ['UI Components', 'Tools'], time: '2-3 hours' },
  { id: 20, name: 'Tic-Tac-Toe', desc: 'Classic 2-player game', difficulty: 'beginner', types: ['Games'], time: '3-5 hours' },
  { id: 21, name: 'Dice Roller', desc: 'Animated dice roll', difficulty: 'beginner', types: ['Games', 'UI Components'], time: '2-3 hours' },
  { id: 22, name: 'Theme Switcher', desc: 'Dark/light mode toggle', difficulty: 'beginner', types: ['UI Components'], time: '1-2 hours' },
  { id: 23, name: 'Form Validator', desc: 'Input validation with feedback', difficulty: 'beginner', types: ['UI Components', 'Tools'], time: '3-5 hours' },
  { id: 24, name: 'Pomodoro Timer', desc: 'Focus timer with breaks', difficulty: 'beginner', types: ['Productivity', 'Tools'], time: '3-5 hours' },
  { id: 25, name: 'Markdown Previewer', desc: 'Live markdown rendering', difficulty: 'beginner', types: ['Tools'], time: '3-5 hours' },

  // INTERMEDIATE (26-55)
  { id: 26, name: 'Blog Platform', desc: 'Create, edit, delete posts', difficulty: 'intermediate', types: ['Full Apps', 'Social'], time: '1-2 days' },
  { id: 27, name: 'Movie Database', desc: 'Search and browse movies', difficulty: 'intermediate', types: ['Full Apps', 'Data Visualization'], time: '1-2 days' },
  { id: 28, name: 'Chat Application', desc: 'Real-time messaging', difficulty: 'intermediate', types: ['Full Apps', 'Social'], time: '2-3 days' },
  { id: 29, name: 'E-commerce Cart', desc: 'Product listing with cart', difficulty: 'intermediate', types: ['E-commerce', 'Full Apps'], time: '2-3 days' },
  { id: 30, name: 'Recipe Finder', desc: 'Search recipes by ingredients', difficulty: 'intermediate', types: ['Full Apps', 'Tools'], time: '1-2 days' },
  { id: 31, name: 'Music Player', desc: 'Audio player with playlist', difficulty: 'intermediate', types: ['Full Apps', 'UI Components'], time: '2-3 days' },
  { id: 32, name: 'Kanban Board', desc: 'Drag and drop task board', difficulty: 'intermediate', types: ['Productivity', 'Full Apps'], time: '2-3 days' },
  { id: 33, name: 'Expense Tracker', desc: 'Track income and expenses', difficulty: 'intermediate', types: ['Full Apps', 'Data Visualization'], time: '2-3 days' },
  { id: 34, name: 'Social Media Feed', desc: 'Post, like, comment feed', difficulty: 'intermediate', types: ['Social', 'Full Apps'], time: '2-3 days' },
  { id: 35, name: 'Calendar App', desc: 'Event scheduling', difficulty: 'intermediate', types: ['Productivity', 'Full Apps'], time: '2-3 days' },
  { id: 36, name: 'File Explorer', desc: 'Directory tree navigation', difficulty: 'intermediate', types: ['Tools', 'UI Components'], time: '1-2 days' },
  { id: 37, name: 'Code Editor', desc: 'Syntax highlighted editor', difficulty: 'intermediate', types: ['Tools'], time: '2-3 days' },
  { id: 38, name: 'Drawing App', desc: 'Canvas-based drawing tool', difficulty: 'intermediate', types: ['Tools', 'Games'], time: '2-3 days' },
  { id: 39, name: 'Survey Builder', desc: 'Create and take surveys', difficulty: 'intermediate', types: ['Full Apps', 'Tools'], time: '2-3 days' },
  { id: 40, name: 'URL Shortener', desc: 'Shorten and track links', difficulty: 'intermediate', types: ['Tools', 'Full Apps'], time: '1-2 days' },
  { id: 41, name: 'Vegetarian Recipes', desc: '100 high-protein, low-carb vegetarian recipes with nutritional info', difficulty: 'intermediate', types: ['Full Apps', 'Data Visualization'], time: '2-3 days' },
  { id: 42, name: 'Notification System', desc: 'Toast notifications', difficulty: 'intermediate', types: ['UI Components'], time: '1 day' },
  { id: 43, name: 'Authentication Flow', desc: 'Login, register, forgot password', difficulty: 'intermediate', types: ['Full Apps', 'UI Components'], time: '2-3 days' },
  { id: 44, name: 'Dashboard Layout', desc: 'Admin panel with charts', difficulty: 'intermediate', types: ['Full Apps', 'Data Visualization'], time: '2-3 days' },
  { id: 45, name: 'Multi-step Form', desc: 'Wizard-style form', difficulty: 'intermediate', types: ['UI Components'], time: '1-2 days' },
  { id: 46, name: 'Infinite Scroll Feed', desc: 'Lazy loading content', difficulty: 'intermediate', types: ['UI Components', 'Social'], time: '1 day' },
  { id: 47, name: 'Search Autocomplete', desc: 'Type-ahead suggestions', difficulty: 'intermediate', types: ['UI Components', 'Tools'], time: '1 day' },
  { id: 48, name: 'Photo Editor', desc: 'Filters and adjustments', difficulty: 'intermediate', types: ['Tools', 'Full Apps'], time: '3-4 days' },
  { id: 49, name: 'Portfolio Website', desc: 'Personal portfolio with sections', difficulty: 'intermediate', types: ['Full Apps', 'UI Components'], time: '2-3 days' },
  { id: 50, name: 'Data Table', desc: 'Sortable, filterable table', difficulty: 'intermediate', types: ['UI Components', 'Data Visualization'], time: '1-2 days' },
  { id: 51, name: 'Drag & Drop List', desc: 'Reorderable list', difficulty: 'intermediate', types: ['UI Components'], time: '1 day' },
  { id: 52, name: 'Notes with Tags', desc: 'Tagged note taking', difficulty: 'intermediate', types: ['Productivity', 'Full Apps'], time: '2-3 days' },
  { id: 53, name: 'Currency Converter', desc: 'Live exchange rates', difficulty: 'intermediate', types: ['Tools', 'Data Visualization'], time: '1 day' },
  { id: 54, name: 'Voting Poll App', desc: 'Create and vote on polls', difficulty: 'intermediate', types: ['Social', 'Full Apps'], time: '1-2 days' },
  { id: 55, name: 'Bookmark Manager', desc: 'Save and organize links', difficulty: 'intermediate', types: ['Productivity', 'Tools'], time: '1-2 days' },

  // ADVANCED (56-80)
  { id: 56, name: 'Project Management Tool', desc: 'Gantt charts, sprints', difficulty: 'advanced', types: ['Productivity', 'Full Apps'], time: '1-2 weeks' },
  { id: 57, name: 'Video Streaming App', desc: 'Video player with playlist', difficulty: 'advanced', types: ['Full Apps'], time: '1-2 weeks' },
  { id: 58, name: 'Real-time Collaboration', desc: 'Shared document editing', difficulty: 'advanced', types: ['Productivity', 'Social'], time: '2-3 weeks' },
  { id: 59, name: 'GraphQL Explorer', desc: 'API query builder', difficulty: 'advanced', types: ['Tools'], time: '1-2 weeks' },
  { id: 60, name: 'Animation Library', desc: 'Reusable animation components', difficulty: 'advanced', types: ['UI Components'], time: '1-2 weeks' },
  { id: 61, name: 'Component Storybook', desc: 'Live component documentation', difficulty: 'advanced', types: ['Tools', 'UI Components'], time: '1-2 weeks' },
  { id: 62, name: 'State Machine Visualizer', desc: 'XState visualization', difficulty: 'advanced', types: ['Tools', 'Data Visualization'], time: '1-2 weeks' },
  { id: 63, name: 'WebSocket Dashboard', desc: 'Real-time data monitoring', difficulty: 'advanced', types: ['Data Visualization', 'Tools'], time: '1 week' },
  { id: 64, name: 'Virtual Keyboard', desc: 'On-screen keyboard', difficulty: 'advanced', types: ['UI Components', 'Tools'], time: '1 week' },
  { id: 65, name: 'Spreadsheet App', desc: 'Excel-like grid', difficulty: 'advanced', types: ['Productivity', 'Tools'], time: '2-3 weeks' },
  { id: 66, name: 'Mind Map Creator', desc: 'Visual brainstorming tool', difficulty: 'advanced', types: ['Productivity', 'Data Visualization'], time: '1-2 weeks' },
  { id: 67, name: 'Audio Visualizer', desc: 'Sound wave animations', difficulty: 'advanced', types: ['Data Visualization', 'UI Components'], time: '1 week' },
  { id: 68, name: 'PDF Viewer', desc: 'Document rendering', difficulty: 'advanced', types: ['Tools'], time: '1-2 weeks' },
  { id: 69, name: 'CLI Terminal', desc: 'Browser-based terminal', difficulty: 'advanced', types: ['Tools'], time: '1-2 weeks' },
  { id: 70, name: 'Chess Game', desc: 'Full chess with AI', difficulty: 'advanced', types: ['Games'], time: '2-3 weeks' },
  { id: 71, name: '3D Product Viewer', desc: 'Three.js product showcase', difficulty: 'advanced', types: ['E-commerce', 'UI Components'], time: '1-2 weeks' },
  { id: 72, name: 'CMS Dashboard', desc: 'Content management system', difficulty: 'advanced', types: ['Full Apps', 'Productivity'], time: '2-3 weeks' },
  { id: 73, name: 'Email Client', desc: 'Email interface with folders', difficulty: 'advanced', types: ['Full Apps', 'Productivity'], time: '2-3 weeks' },
  { id: 74, name: 'API Testing Tool', desc: 'Postman-like interface', difficulty: 'advanced', types: ['Tools'], time: '1-2 weeks' },
  { id: 75, name: 'Database Designer', desc: 'ERD diagram tool', difficulty: 'advanced', types: ['Tools', 'Data Visualization'], time: '2-3 weeks' },
  { id: 76, name: 'Code Snippet Manager', desc: 'Save and share code', difficulty: 'advanced', types: ['Tools', 'Productivity'], time: '1 week' },
  { id: 77, name: 'Browser Extension', desc: 'Chrome extension with React', difficulty: 'advanced', types: ['Tools'], time: '1-2 weeks' },
  { id: 78, name: 'Mobile App (RN)', desc: 'React Native cross-platform', difficulty: 'advanced', types: ['Full Apps'], time: '2-4 weeks' },
  { id: 79, name: 'Progressive Web App', desc: 'Offline-capable app', difficulty: 'advanced', types: ['Full Apps'], time: '1-2 weeks' },
  { id: 80, name: 'CI/CD Pipeline UI', desc: 'Build pipeline visualization', difficulty: 'advanced', types: ['Tools', 'Data Visualization'], time: '1-2 weeks' },

  // EXPERT (81-100)
  { id: 81, name: 'IDE in Browser', desc: 'Full VS Code clone', difficulty: 'expert', types: ['Tools', 'Full Apps'], time: '1-2 months' },
  { id: 82, name: 'Design System', desc: 'Complete component library', difficulty: 'expert', types: ['UI Components', 'Tools'], time: '1-2 months' },
  { id: 83, name: 'Multiplayer Game Engine', desc: 'Real-time game framework', difficulty: 'expert', types: ['Games'], time: '2-3 months' },
  { id: 84, name: 'Machine Learning UI', desc: 'ML model training interface', difficulty: 'expert', types: ['Tools', 'Data Visualization'], time: '1-2 months' },
  { id: 85, name: 'Video Editor', desc: 'Timeline-based video editing', difficulty: 'expert', types: ['Tools', 'Full Apps'], time: '2-3 months' },
  { id: 86, name: 'Map Application', desc: 'Interactive map with layers', difficulty: 'expert', types: ['Full Apps', 'Data Visualization'], time: '1-2 months' },
  { id: 87, name: 'Social Network', desc: 'Full social platform', difficulty: 'expert', types: ['Social', 'Full Apps'], time: '2-3 months' },
  { id: 88, name: 'Compiler Playground', desc: 'Code compilation in browser', difficulty: 'expert', types: ['Tools'], time: '1-2 months' },
  { id: 89, name: 'Cloud Storage UI', desc: 'Dropbox-like file manager', difficulty: 'expert', types: ['Full Apps', 'Productivity'], time: '1-2 months' },
  { id: 90, name: 'Real-time Analytics', desc: 'Live data visualization', difficulty: 'expert', types: ['Data Visualization', 'Full Apps'], time: '1-2 months' },
  { id: 91, name: 'AR/VR Experience', desc: 'WebXR with React', difficulty: 'expert', types: ['Games', 'Full Apps'], time: '2-3 months' },
  { id: 92, name: 'Blockchain Explorer', desc: 'Crypto transaction viewer', difficulty: 'expert', types: ['Data Visualization', 'Tools'], time: '1-2 months' },
  { id: 93, name: 'Smart Home Dashboard', desc: 'IoT device control', difficulty: 'expert', types: ['Full Apps', 'Data Visualization'], time: '1-2 months' },
  { id: 94, name: 'Healthcare Portal', desc: 'Patient management', difficulty: 'expert', types: ['Full Apps', 'Productivity'], time: '2-3 months' },
  { id: 95, name: 'ERP System', desc: 'Enterprise resource planning', difficulty: 'expert', types: ['Full Apps', 'Productivity'], time: '3-6 months' },
  { id: 96, name: 'Stock Trading Platform', desc: 'Real-time trading UI', difficulty: 'expert', types: ['Full Apps', 'Data Visualization'], time: '2-3 months' },
  { id: 97, name: 'AI Chat Assistant', desc: 'GPT-powered chatbot', difficulty: 'expert', types: ['Full Apps', 'Tools'], time: '1-2 months' },
  { id: 98, name: 'DevOps Dashboard', desc: 'Infrastructure monitoring', difficulty: 'expert', types: ['Tools', 'Data Visualization'], time: '1-2 months' },
  { id: 99, name: 'Learning Management System', desc: 'Course platform', difficulty: 'expert', types: ['Full Apps', 'Productivity'], time: '2-3 months' },
  { id: 100, name: 'Operating System UI', desc: 'Desktop environment in browser', difficulty: 'expert', types: ['Full Apps', 'UI Components'], time: '3-6 months' },
];

const DIFFICULTIES = ['beginner', 'intermediate', 'advanced', 'expert'];

const DIFFICULTY_CONFIG = {
  beginner:     { color: '#4caf50', bg: 'rgba(76,175,80,0.15)',  label: 'Beginner',     icon: '🌱', range: '1-25' },
  intermediate: { color: '#2196f3', bg: 'rgba(33,150,243,0.15)', label: 'Intermediate', icon: '🔧', range: '26-55' },
  advanced:     { color: '#ff9800', bg: 'rgba(255,152,0,0.15)',  label: 'Advanced',     icon: '🚀', range: '56-80' },
  expert:       { color: '#ef5350', bg: 'rgba(239,83,80,0.15)',  label: 'Expert',       icon: '💎', range: '81-100' },
};

const TYPE_LIST = ['UI Components', 'Full Apps', 'Games', 'Tools', 'Data Visualization', 'Social', 'E-commerce', 'Productivity'];

const TYPE_ICONS = {
  'UI Components': '🧩',
  'Full Apps': '📱',
  'Games': '🎮',
  'Tools': '🔨',
  'Data Visualization': '📊',
  'Social': '👥',
  'E-commerce': '🛒',
  'Productivity': '📋',
};

// ============ SIDEBAR COMPONENT ============
function Sidebar({ selectedDifficulty, setSelectedDifficulty, expandedSections, toggleSection }) {
  return (
    <div style={styles.sidebar}>
      <div style={styles.sideHeader}>
        <a href="/" style={styles.homeLink}>←</a>
        <div>
          <div style={styles.sideTitle}>⚛️ Project Ideas</div>
          <div style={styles.sideSub}>100 React Projects</div>
        </div>
      </div>

      <div style={styles.sideSection}>
        <div style={styles.sideSectionTitle}>Difficulty Levels</div>
        <div
          style={{
            ...styles.sideItem,
            background: selectedDifficulty === 'all' ? 'rgba(255,255,255,0.1)' : 'transparent',
            color: selectedDifficulty === 'all' ? '#fff' : 'rgba(255,255,255,0.55)',
          }}
          onClick={() => setSelectedDifficulty('all')}
        >
          <span>📚</span> All Projects
          <span style={styles.sideCount}>{PROJECTS.length}</span>
        </div>

        {DIFFICULTIES.map(diff => {
          const config = DIFFICULTY_CONFIG[diff];
          const count = PROJECTS.filter(p => p.difficulty === diff).length;
          const isExpanded = expandedSections[diff];
          const isSelected = selectedDifficulty === diff;

          return (
            <div key={diff}>
              <div
                style={{
                  ...styles.sideItem,
                  background: isSelected ? 'rgba(255,255,255,0.1)' : 'transparent',
                  color: isSelected ? '#fff' : 'rgba(255,255,255,0.55)',
                }}
                onClick={() => {
                  setSelectedDifficulty(diff);
                  toggleSection(diff);
                }}
              >
                <span style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.2s', display: 'inline-block', fontSize: 10 }}>▶</span>
                <span>{config.icon}</span>
                <span style={{ flex: 1 }}>{config.label}</span>
                <span style={{ ...styles.sideCount, background: config.bg, color: config.color }}>{count}</span>
              </div>
              {isExpanded && (
                <div style={styles.treeItems}>
                  {PROJECTS.filter(p => p.difficulty === diff).map(p => (
                    <div key={p.id} style={styles.treeItem}>
                      <span style={{ color: 'rgba(255,255,255,0.25)' }}>#{p.id}</span> {p.name}
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ============ PROJECT CARD ============
function ProjectCard({ project, hoveredId, setHoveredId }) {
  const config = DIFFICULTY_CONFIG[project.difficulty];
  const isHovered = hoveredId === project.id;

  return (
    <div
      style={{
        ...styles.card,
        transform: isHovered ? 'translateY(-4px) scale(1.02)' : 'translateY(0) scale(1)',
        borderColor: isHovered ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.06)',
        boxShadow: isHovered ? '0 12px 40px rgba(0,0,0,0.4)' : '0 2px 8px rgba(0,0,0,0.2)',
      }}
      onMouseEnter={() => setHoveredId(project.id)}
      onMouseLeave={() => setHoveredId(null)}
    >
      {/* Card Header */}
      <div style={styles.cardHeader}>
        <div style={{ ...styles.cardNumber, background: config.bg, color: config.color }}>
          #{project.id}
        </div>
        <div style={{ ...styles.diffBadge, background: config.bg, color: config.color, borderColor: config.color }}>
          {config.icon} {config.label}
        </div>
      </div>

      {/* Card Body */}
      <h3 style={styles.cardTitle}>{project.name}</h3>
      <p style={styles.cardDesc}>{project.desc}</p>

      {/* Tags */}
      <div style={styles.cardTags}>
        {project.types.map(type => (
          <span key={type} style={styles.cardTag}>
            {TYPE_ICONS[type]} {type}
          </span>
        ))}
      </div>

      {/* Footer */}
      <div style={styles.cardFooter}>
        <span style={styles.cardTime}>⏱️ {project.time}</span>
        {DEMO_LINKS[project.id] && (
          <a
            href={DEMO_LINKS[project.id]}
            style={styles.demoLink}
            onClick={e => e.stopPropagation()}
          >
            ▶ View Demo
          </a>
        )}
      </div>
    </div>
  );
}

// ============ MAIN APP ============
function ProjectsApp() {
  const [search, setSearch] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);
  const [expandedSections, setExpandedSections] = useState({
    beginner: false,
    intermediate: false,
    advanced: false,
    expert: false,
  });

  const toggleSection = (diff) => {
    setExpandedSections(prev => ({ ...prev, [diff]: !prev[diff] }));
  };

  const toggleType = (type) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const filtered = useMemo(() => {
    return PROJECTS.filter(p => {
      const matchesDifficulty = selectedDifficulty === 'all' || p.difficulty === selectedDifficulty;
      const matchesType = selectedTypes.length === 0 || p.types.some(t => selectedTypes.includes(t));
      const matchesSearch = search === '' ||
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.desc.toLowerCase().includes(search.toLowerCase()) ||
        p.types.some(t => t.toLowerCase().includes(search.toLowerCase())) ||
        String(p.id).includes(search);
      return matchesDifficulty && matchesType && matchesSearch;
    });
  }, [search, selectedDifficulty, selectedTypes]);

  return (
    <div style={styles.layout}>
      {/* Sidebar */}
      <Sidebar
        selectedDifficulty={selectedDifficulty}
        setSelectedDifficulty={setSelectedDifficulty}
        expandedSections={expandedSections}
        toggleSection={toggleSection}
      />

      {/* Main Content */}
      <div style={styles.main}>
        {/* Header */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.title}>
              <span style={styles.titleGradient}>100 React Project Ideas</span>
            </h1>
            <p style={styles.subtitle}>
              From beginner to expert - find your next React project to build
            </p>
          </div>
          <div style={styles.statsRow}>
            {DIFFICULTIES.map(d => {
              const config = DIFFICULTY_CONFIG[d];
              const count = PROJECTS.filter(p => p.difficulty === d).length;
              return (
                <div key={d} style={{ ...styles.statBadge, background: config.bg, color: config.color }}>
                  {config.icon} {count} {config.label}
                </div>
              );
            })}
          </div>
        </div>

        {/* Search Bar */}
        <div style={styles.searchContainer}>
          <div style={styles.searchWrap}>
            <span style={styles.searchIcon}>🔍</span>
            <input
              type="text"
              placeholder="Search projects by name, description, or number..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={styles.searchInput}
            />
            {search && (
              <button style={styles.clearBtn} onClick={() => setSearch('')}>✕</button>
            )}
          </div>
        </div>

        {/* Type Filter Pills */}
        <div style={styles.filterRow}>
          <span style={styles.filterLabel}>Filter by type:</span>
          {TYPE_LIST.map(type => {
            const isActive = selectedTypes.includes(type);
            return (
              <button
                key={type}
                onClick={() => toggleType(type)}
                style={{
                  ...styles.filterPill,
                  background: isActive ? 'rgba(33,150,243,0.25)' : 'rgba(255,255,255,0.05)',
                  color: isActive ? '#64b5f6' : 'rgba(255,255,255,0.45)',
                  borderColor: isActive ? 'rgba(33,150,243,0.4)' : 'rgba(255,255,255,0.08)',
                }}
              >
                {TYPE_ICONS[type]} {type}
              </button>
            );
          })}
          {selectedTypes.length > 0 && (
            <button style={styles.clearFilters} onClick={() => setSelectedTypes([])}>
              Clear filters
            </button>
          )}
        </div>

        {/* Results Count */}
        <div style={styles.resultsBar}>
          <span style={styles.resultsCount}>
            Showing <strong style={{ color: '#fff' }}>{filtered.length}</strong> of <strong style={{ color: '#fff' }}>{PROJECTS.length}</strong> projects
          </span>
          {selectedDifficulty !== 'all' && (
            <span style={{ ...styles.activeFilter, background: DIFFICULTY_CONFIG[selectedDifficulty].bg, color: DIFFICULTY_CONFIG[selectedDifficulty].color }}>
              {DIFFICULTY_CONFIG[selectedDifficulty].icon} {DIFFICULTY_CONFIG[selectedDifficulty].label}
              <span style={{ cursor: 'pointer', marginLeft: 6 }} onClick={() => setSelectedDifficulty('all')}>✕</span>
            </span>
          )}
        </div>

        {/* Project Grid */}
        {filtered.length > 0 ? (
          <div style={styles.grid}>
            {filtered.map(project => (
              <ProjectCard
                key={project.id}
                project={project}
                hoveredId={hoveredId}
                setHoveredId={setHoveredId}
              />
            ))}
          </div>
        ) : (
          <div style={styles.emptyState}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
            <h3 style={{ color: '#fff', marginBottom: 8 }}>No projects found</h3>
            <p style={{ color: 'rgba(255,255,255,0.4)' }}>Try adjusting your search or filters</p>
            <button
              style={{ ...styles.filterPill, marginTop: 16, background: 'rgba(33,150,243,0.2)', color: '#64b5f6', borderColor: 'rgba(33,150,243,0.3)' }}
              onClick={() => { setSearch(''); setSelectedDifficulty('all'); setSelectedTypes([]); }}
            >
              Reset all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

// ============ STYLES ============
const styles = {
  // Layout
  layout: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: "'Segoe UI', Arial, sans-serif",
  },

  // Sidebar
  sidebar: {
    width: 260,
    background: '#0a0a1e',
    borderRight: '1px solid rgba(255,255,255,0.06)',
    overflowY: 'auto',
    flexShrink: 0,
    maxHeight: '100vh',
    position: 'sticky',
    top: 0,
  },
  sideHeader: {
    padding: '16px 14px',
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  },
  homeLink: {
    color: 'rgba(255,255,255,0.5)',
    textDecoration: 'none',
    fontSize: 18,
    padding: '4px 8px',
    borderRadius: 6,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  sideTitle: {
    color: '#fff',
    fontSize: 15,
    fontWeight: 700,
  },
  sideSub: {
    color: 'rgba(255,255,255,0.35)',
    fontSize: 11,
  },
  sideSection: {
    padding: '8px 0',
  },
  sideSectionTitle: {
    padding: '12px 14px 6px',
    fontSize: 10,
    fontWeight: 700,
    color: 'rgba(255,255,255,0.3)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sideItem: {
    padding: '7px 14px',
    fontSize: 13,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    borderRadius: 4,
    margin: '1px 6px',
    transition: 'background 0.15s',
  },
  sideCount: {
    fontSize: 10,
    fontWeight: 700,
    padding: '2px 7px',
    borderRadius: 10,
    background: 'rgba(255,255,255,0.08)',
    color: 'rgba(255,255,255,0.5)',
    marginLeft: 'auto',
  },
  treeItems: {
    maxHeight: 300,
    overflowY: 'auto',
    paddingLeft: 20,
  },
  treeItem: {
    padding: '3px 14px',
    fontSize: 11,
    color: 'rgba(255,255,255,0.4)',
    cursor: 'default',
    display: 'flex',
    gap: 6,
    alignItems: 'center',
  },

  // Main
  main: {
    flex: 1,
    overflowY: 'auto',
    padding: '28px 32px',
    maxHeight: '100vh',
  },

  // Header
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 32,
    fontWeight: 800,
    margin: '0 0 6px',
  },
  titleGradient: {
    background: 'linear-gradient(135deg, #64b5f6, #ce93d8, #f48fb1)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 14,
    margin: 0,
  },
  statsRow: {
    display: 'flex',
    gap: 8,
    marginTop: 16,
    flexWrap: 'wrap',
  },
  statBadge: {
    padding: '5px 12px',
    borderRadius: 20,
    fontSize: 12,
    fontWeight: 600,
    display: 'flex',
    alignItems: 'center',
    gap: 5,
  },

  // Search
  searchContainer: {
    marginBottom: 16,
  },
  searchWrap: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  searchIcon: {
    position: 'absolute',
    left: 14,
    fontSize: 16,
    pointerEvents: 'none',
  },
  searchInput: {
    width: '100%',
    padding: '12px 40px 12px 44px',
    fontSize: 14,
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid rgba(255,255,255,0.1)',
    borderRadius: 10,
    color: '#fff',
    outline: 'none',
    transition: 'border-color 0.2s, background 0.2s',
    fontFamily: "'Segoe UI', Arial, sans-serif",
  },
  clearBtn: {
    position: 'absolute',
    right: 12,
    background: 'rgba(255,255,255,0.1)',
    border: 'none',
    color: 'rgba(255,255,255,0.5)',
    cursor: 'pointer',
    fontSize: 12,
    width: 22,
    height: 22,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Filters
  filterRow: {
    display: 'flex',
    gap: 6,
    flexWrap: 'wrap',
    alignItems: 'center',
    marginBottom: 16,
  },
  filterLabel: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.35)',
    fontWeight: 600,
    marginRight: 4,
  },
  filterPill: {
    padding: '5px 12px',
    fontSize: 12,
    border: '1px solid',
    borderRadius: 20,
    cursor: 'pointer',
    fontWeight: 500,
    transition: 'all 0.2s',
    fontFamily: "'Segoe UI', Arial, sans-serif",
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
  },
  clearFilters: {
    padding: '5px 12px',
    fontSize: 11,
    background: 'transparent',
    border: 'none',
    color: '#ef5350',
    cursor: 'pointer',
    fontWeight: 600,
    fontFamily: "'Segoe UI', Arial, sans-serif",
  },

  // Results
  resultsBar: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  resultsCount: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.4)',
  },
  activeFilter: {
    padding: '3px 10px',
    borderRadius: 12,
    fontSize: 11,
    fontWeight: 600,
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
  },

  // Grid
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: 16,
  },

  // Card
  card: {
    background: 'rgba(255,255,255,0.04)',
    backdropFilter: 'blur(12px)',
    WebkitBackdropFilter: 'blur(12px)',
    borderRadius: 14,
    border: '1px solid rgba(255,255,255,0.06)',
    padding: 20,
    transition: 'all 0.25s ease',
    cursor: 'default',
    display: 'flex',
    flexDirection: 'column',
  },
  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardNumber: {
    fontSize: 13,
    fontWeight: 800,
    padding: '3px 10px',
    borderRadius: 8,
  },
  diffBadge: {
    fontSize: 11,
    fontWeight: 600,
    padding: '3px 10px',
    borderRadius: 12,
    border: '1px solid',
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },
  cardTitle: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 700,
    margin: '0 0 6px',
    lineHeight: 1.3,
  },
  cardDesc: {
    color: 'rgba(255,255,255,0.45)',
    fontSize: 13,
    margin: '0 0 14px',
    lineHeight: 1.5,
    flex: 1,
  },
  cardTags: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 14,
  },
  cardTag: {
    padding: '3px 9px',
    borderRadius: 6,
    fontSize: 11,
    background: 'rgba(255,255,255,0.06)',
    color: 'rgba(255,255,255,0.5)',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 3,
  },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTop: '1px solid rgba(255,255,255,0.06)',
  },
  cardTime: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.35)',
    display: 'flex',
    alignItems: 'center',
    gap: 4,
  },

  demoLink: {
    fontSize: 12,
    fontWeight: 600,
    color: '#64b5f6',
    background: 'rgba(33,150,243,0.15)',
    padding: '4px 12px',
    borderRadius: 8,
    textDecoration: 'none',
    display: 'inline-flex',
    alignItems: 'center',
    gap: 4,
    border: '1px solid rgba(33,150,243,0.3)',
    transition: 'all 0.2s',
  },

  // Empty State
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    background: 'rgba(255,255,255,0.02)',
    borderRadius: 16,
    border: '1px solid rgba(255,255,255,0.05)',
  },
};

// ============ RENDER ============
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<ProjectsApp />);
