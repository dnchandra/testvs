const input = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');
const themeToggle = document.getElementById('theme-toggle');
const todoCount = document.getElementById('todo-count');
const emptyState = document.getElementById('empty-state');
const filterBtns = document.querySelectorAll('.filter-btn');

let currentFilter = 'all';

// Persist and apply theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
  document.body.classList.add('dark');
  themeToggle.textContent = '☀️';
}

themeToggle.addEventListener('click', () => {
  const isDark = document.body.classList.toggle('dark');
  themeToggle.textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

function updateCount() {
  const all = todoList.querySelectorAll('.todo-item').length;
  const completed = todoList.querySelectorAll('.todo-item.completed').length;
  const active = all - completed;
  if (currentFilter === 'active') {
    todoCount.textContent = `${active} task${active !== 1 ? 's' : ''}`;
  } else if (currentFilter === 'completed') {
    todoCount.textContent = `${completed} task${completed !== 1 ? 's' : ''}`;
  } else {
    todoCount.textContent = `${all} task${all !== 1 ? 's' : ''}`;
  }
}

function updateEmptyState() {
  const visible = todoList.querySelectorAll('.todo-item:not([hidden])').length;
  emptyState.classList.toggle('hidden', visible > 0);

  if (visible === 0) {
    if (currentFilter === 'active') {
      emptyState.textContent = 'No active tasks — great job!';
    } else if (currentFilter === 'completed') {
      emptyState.textContent = 'No completed tasks yet.';
    } else {
      emptyState.textContent = 'No tasks yet — add one above!';
    }
  }
}

function applyFilter() {
  const items = todoList.querySelectorAll('.todo-item');
  items.forEach((item) => {
    const isCompleted = item.classList.contains('completed');
    if (currentFilter === 'all') {
      item.hidden = false;
    } else if (currentFilter === 'active') {
      item.hidden = isCompleted;
    } else {
      item.hidden = !isCompleted;
    }
  });
  updateCount();
  updateEmptyState();
}

filterBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    filterBtns.forEach((b) => {
      b.classList.remove('active');
      b.setAttribute('aria-selected', 'false');
    });
    btn.classList.add('active');
    btn.setAttribute('aria-selected', 'true');
    currentFilter = btn.dataset.filter;
    applyFilter();
  });
});

function createTodoItem(text) {
  const li = document.createElement('li');
  li.className = 'todo-item';

  const check = document.createElement('div');
  check.className = 'todo-check';
  check.setAttribute('role', 'checkbox');
  check.setAttribute('aria-checked', 'false');
  check.setAttribute('tabindex', '0');
  check.title = 'Toggle complete';

  const span = document.createElement('span');
  span.textContent = text;

  function toggleComplete() {
    const isCompleted = li.classList.toggle('completed');
    check.setAttribute('aria-checked', String(isCompleted));
    applyFilter();
  }

  check.addEventListener('click', toggleComplete);
  check.addEventListener('keydown', (e) => {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      toggleComplete();
    }
  });
  span.addEventListener('click', toggleComplete);

  const deleteButton = document.createElement('button');
  deleteButton.className = 'delete-btn';
  deleteButton.setAttribute('aria-label', 'Delete task');
  deleteButton.innerHTML =
    '<svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';

  deleteButton.addEventListener('click', () => {
    li.classList.add('removing');
    li.addEventListener('animationend', () => {
      li.remove();
      updateCount();
      updateEmptyState();
    }, { once: true });
  });

  li.appendChild(check);
  li.appendChild(span);
  li.appendChild(deleteButton);

  return li;
}

function addTodo() {
  const value = input.value.trim();
  if (!value) {
    input.focus();
    return;
  }
  const todoItem = createTodoItem(value);
  todoList.appendChild(todoItem);
  input.value = '';
  input.focus();
  applyFilter();
}

addBtn.addEventListener('click', addTodo);
input.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    addTodo();
  }
});

// Initial state
updateEmptyState();
updateCount();
