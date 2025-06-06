const tabs = document.querySelectorAll('nav button.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

const projectsContainer = document.getElementById('projects-container');
const addProjectBtn = document.getElementById('add-project-btn');
const projectTitleInput = document.getElementById('project-title');
const projectCodeInput = document.getElementById('project-code');
const toggleAddProjectBtn = document.getElementById('toggle-add-project');
const newProjectForm = document.getElementById('new-project');

function fetchProjects() {
  fetch('/api/projects')
    .then(res => res.json())
    .then(renderProjects);
}

function renderProjects(projects) {
  projectsContainer.innerHTML = '';
  projects.forEach(proj => {
    const projDiv = document.createElement('div');
    projDiv.classList.add('project');
    projDiv.innerHTML = `
      <h3>${proj.title}</h3>
      <pre class="project-code">${proj.code}</pre>
      <div class="comments">
        <h4>Comentarii:</h4>
        <div class="comments-list">
          ${proj.comments.map(c => `<div class="comment">${c.comment}</div>`).join('')}
        </div>
        <div class="comment-input">
          <textarea placeholder="Scrie un comentariu..."></textarea>
          <button>Adaugă comentariu</button>
        </div>
      </div>
    `;

    const commentBtn = projDiv.querySelector('button');
    const commentTextarea = projDiv.querySelector('textarea');

    commentBtn.addEventListener('click', () => {
      const commentText = commentTextarea.value.trim();
      if (!commentText) return alert('Comentariul este gol!');

      fetch(`/api/projects/${proj.id}/comments`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ comment: commentText })
      })
        .then(res => res.json())
        .then(() => fetchProjects())
        .catch(() => alert('Eroare la trimiterea comentariului.'));
    });

    projectsContainer.appendChild(projDiv);
  });
}

tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    tab.classList.add('active');

    tabContents.forEach(tc => tc.classList.remove('active'));
    document.getElementById(tab.dataset.tab).classList.add('active');
  });
});

toggleAddProjectBtn.addEventListener('click', () => {
  newProjectForm.classList.toggle('hidden');
  if (!newProjectForm.classList.contains('hidden')) {
    projectTitleInput.focus();
  }
});

addProjectBtn.addEventListener('click', () => {
  const title = projectTitleInput.value.trim();
  const code = projectCodeInput.value.trim();

  if (!title || !code) {
    alert('Completează titlul și codul proiectului!');
    return;
  }

  fetch('/api/projects', {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({ title, code })
  })
    .then(res => res.json())
    .then(() => {
      projectTitleInput.value = '';
      projectCodeInput.value = '';
      newProjectForm.classList.add('hidden');
      fetchProjects();
    })
    .catch(() => alert('Eroare la adăugarea proiectului.'));
});

fetchProjects();
