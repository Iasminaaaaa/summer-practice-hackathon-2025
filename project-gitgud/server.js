const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static('public'));

const DATA_PATH = path.join(__dirname, 'data.json');

function readData() {
  try {
    return JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));
  } catch {
    return { projects: [] };
  }
}

function saveData(data) {
  fs.writeFileSync(DATA_PATH, JSON.stringify(data, null, 2));
}

app.get('/api/projects', (req, res) => {
  const data = readData();
  res.json(data.projects);
});

app.post('/api/projects', (req, res) => {
  const { title, code } = req.body;
  if (!title || !code) return res.status(400).json({ error: 'Missing fields' });

  const data = readData();
  const newProject = {
    id: Date.now(),
    title,
    code,
    comments: []
  };
  data.projects.push(newProject);
  saveData(data);
  res.json(newProject);
});

app.post('/api/projects/:id/comments', (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;
  if (!comment) return res.status(400).json({ error: 'Comment missing' });

  const data = readData();
  const project = data.projects.find(p => p.id == id);
  if (!project) return res.status(404).json({ error: 'Project not found' });

  const newComment = {
    id: Date.now(),
    comment
  };
  project.comments.push(newComment);
  saveData(data);
  res.json(newComment);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
