class ToDoItem {
  constructor(title, description, done, id) {
    this.title = title;
    this.description = description;
    this.done = done;
    this.id = id;
  }

  createItem() {
    return `
        <article class="list-item list-item--${this.done ? 'done' : 'active'}" id="${this.id}">
            <section class="list-item__done-icon">
                <i class="list-item__done-icon--show-${this.done} fas fa-check-circle"></i>
            </section>
            <section class="list-item__text">
                <h2 class="list-item__text--title">${this.title}</h2>
                <p class="list-item__text--description">${this.description}</p>
            </section>
            <section class="list-item__action--show-${this.done}">
                <button class="list-item__action--remove-btn-${this.done}" id="${this.id}">Remove</button>
            </section>
        </article>`;
  }
}

let state = [];

const createID = () => {
  if (state.length === 0) {
    return 0;
  }
  const idArr = state.map((obj) => obj.id);
  return Math.max(...idArr) + 1;
};

// Get items from localStorage on page load
document.addEventListener('DOMContentLoaded', () => {
  const storage = JSON.parse(localStorage.getItem('toDo'));
  if (storage !== null) {
    storage.forEach((item) => {
      state.push(new ToDoItem(item.title, item.description, item.done, item.id));
    });
    window.dispatchEvent(new Event('statechange'));
  }
});

// Add items
document.querySelector('#add').addEventListener('click', (e) => {
  e.preventDefault();
  const title = document.querySelector('#title');
  const description = document.querySelector('#description');
  const formattedDescription = description.value.replace(/(\r\n|\n|\r)/gm, '<br>');
  const item = new ToDoItem(title.value, formattedDescription, false, createID());
  state = [...state, item];
  window.dispatchEvent(new Event('statechange'));
  title.value = '';
  description.value = '';
});

const createList = (arr, el) => {
  const element = el;
  const list = arr.map((item) => item.createItem()).join('');
  element.innerHTML = list;
};

const storeLocalStorage = (arr) => {
  localStorage.setItem('toDo', JSON.stringify(arr));
};

// Toggle 'done' and 'active'
document.addEventListener('click', (e) => {
  if (e.target.tagName === 'ARTICLE') {
    const item = state.filter((obj) => obj.id === parseInt(e.target.id, 10));
    if (!item[0].done) {
      item[0].done = true;
    } else {
      item[0].done = false;
    }
    window.dispatchEvent(new Event('statechange'));
  }
});

// Remove item
document.addEventListener('click', (e) => {
  if (e.target.tagName === 'BUTTON') {
    const item = state.filter((obj) => obj.id !== parseInt(e.target.id, 10));
    state.splice(0, state.length, ...item);
    window.dispatchEvent(new Event('statechange'));
  }
});

window.addEventListener('statechange', () => {
  state.sort((a, b) => (a.done - b.done) || (b.id - a.id));
  createList(state, document.querySelector('#list'));
  storeLocalStorage(state);
});
