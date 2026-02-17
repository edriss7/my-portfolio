const express = require('express');
const path = require('path');

const app = express();
const PORT = 8080;

// Define /projects route BEFORE static middleware
// (otherwise express.static sees the public/projects/ directory and redirects)
app.get('/projects', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'projects.html'));
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api', (req, res) => {
  res.json({ message: 'Hello World', status: 'ok' });
});

app.get('/storybook', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'storybook.html'));
});

app.get('/project/:name', (req, res) => {
  const valid = [
    'todo','counter','calculator','weather','clock','colorpicker','tip','quiz','quotes','bmi',
    'stopwatch','unit-converter','grocery','flashcard','password-gen','emoji-search',
    'accordion-faq','image-gallery','countdown','tictactoe','dice','theme-switcher',
    'form-validator','pomodoro','markdown','blog','movie-db','chat-app','ecommerce',
    'recipe-finder','music-player','kanban','expense-tracker','social-feed','calendar',
    'file-explorer','code-editor','drawing','survey','url-shortener','vegetarian-recipes',
    'notification-system','auth-flow','dashboard-layout','multi-step-form','infinite-scroll',
    'search-autocomplete','photo-editor','portfolio','data-table','drag-drop-list',
    'notes-tags','currency-converter','voting-poll','bookmark-manager',
    'project-management','video-player','realtime-collab','graphql-explorer',
    'animation-library','component-storybook','state-machine','websocket-dashboard',
    'virtual-keyboard','spreadsheet','mind-map','audio-visualizer','pdf-viewer',
    'cli-terminal','chess','3d-viewer','cms-dashboard','email-client','api-tester',
    'db-designer','code-snippets','browser-extension','mobile-app','pwa','cicd-pipeline',
    'ide','design-system','multiplayer-game','ml-ui','video-editor','map-app',
    'social-network','compiler','cloud-storage','realtime-analytics','ar-vr',
    'blockchain-explorer','smart-home','healthcare-portal','erp-system','stock-trading',
    'ai-chat','devops-dashboard','lms','os-ui'
  ];
  if (valid.includes(req.params.name)) {
    res.sendFile(path.join(__dirname, 'public', 'projects', req.params.name + '.html'));
  } else {
    res.status(404).send('Project not found');
  }
});

app.get('/vegetarian-recipes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'vegetarian-recipes.html'));
});

app.get('/ashpazi', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'ashpazi.html'));
});

app.get('/stocks', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'stocks.html'));
});

app.get('/chat', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'chat.html'));
});

app.get('/notes', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'notes.html'));
});

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
