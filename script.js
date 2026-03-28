const input = document.getElementById('todo-input');
const addBtn = document.getElementById('add-btn');
const todoList = document.getElementById('todo-list');

function createTodoItem(text) {
  const li = document.createElement('li');
  li.className = 'todo-item';

  const span = document.createElement('span');
  span.textContent = text;
  span.style.cursor = 'pointer';

  span.addEventListener('click', () => {
    li.classList.toggle('completed');
  });

  const deleteButton = document.createElement('button');
  deleteButton.className = 'delete-btn';
  deleteButton.textContent = 'Delete';

  deleteButton.addEventListener('click', () => {
    li.remove();
  });

  li.appendChild(span);
  li.appendChild(deleteButton);

  return li;
}

function addTodo() {
  const value = input.value.trim();
  if (!value) {
    return;
  }
  const todoItem = createTodoItem(value);
  todoList.appendChild(todoItem);
  input.value = '';
  input.focus();
}

addBtn.addEventListener('click', addTodo);
input.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    addTodo();
  }
});
