let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

function saveTasks() {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function addTask() {
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const timeLimit = parseInt(document.getElementById('timeLimit').value);
  
    if (!title || isNaN(timeLimit)) return alert('Please enter title and valid time.');
  
    const now = Date.now();
    tasks.push({
      id: Date.now(),
      title,
      description,
      timeLimit,
      addedAt: now,
      completed: false
    });
  
    saveTasks();
    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('timeLimit').value = '';
  
    showToast('Task added successfully! ✅');
  }
  

function toggleComplete(id) {
  const task = tasks.find(t => t.id === id);
  task.completed = !task.completed;
  saveTasks();
  renderTasks();
}

function deleteTask(id) {
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  renderTasks();
}

function renderTasks() {
  if (!document.getElementById('taskList')) return;
  const filter = document.getElementById('filter')?.value || 'all';
  const container = document.getElementById('taskList');
  container.innerHTML = '';
  const now = Date.now();

  tasks.forEach(task => {
    const elapsed = (now - task.addedAt) / 60000;
    const remaining = Math.max(task.timeLimit - elapsed, 0);
    const isOverdue = remaining <= 0 && !task.completed;

    if (filter === 'completed' && !task.completed) return;
    if (filter === 'pending' && (task.completed || isOverdue)) return;
    if (filter === 'overdue' && !isOverdue) return;

    const taskDiv = document.createElement('div');
    taskDiv.className = 'task';
    if (task.completed) taskDiv.classList.add('completed');
    if (isOverdue) taskDiv.classList.add('overdue');

    const timerText = isOverdue ? 'Overdue' : formatClockTime(task.timeLimit * 60 - Math.floor(elapsed * 60));

    taskDiv.innerHTML = `
      <div class="task-title">${task.title}</div>
      <div>${task.description || ''}</div>
      <div class="timer">${timerText}</div>
      <div class="actions">
        <button onclick="toggleComplete(${task.id})">${task.completed ? 'Undo' : 'Mark Done'}</button>
        <button onclick="deleteTask(${task.id})">Delete</button>
      </div>
    `;
    container.appendChild(taskDiv);
  });
}

function formatClockTime(seconds) {
  const sec = Math.max(0, Math.floor(seconds));
  const hrs = Math.floor(sec / 3600).toString().padStart(2, '0');
  const mins = Math.floor((sec % 3600) / 60).toString().padStart(2, '0');
  const secs = (sec % 60).toString().padStart(2, '0');
  return `${hrs}:${mins}:${secs}`;
}

setInterval(renderTasks, 1000);
renderTasks();

function showSection(sectionId) {
    document.querySelectorAll('.section').forEach(s => s.style.display = 'none');
    document.getElementById(sectionId).style.display = 'block';
  }

  function showToast(message) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3000); // Hide after 3 seconds
  }
  
