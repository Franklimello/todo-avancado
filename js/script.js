//capturando os elementos

const todoForm = document.querySelector('#todo-form');
const todoInput = document.querySelector('#todo-input');
const todoList = document.querySelector('#todo-list');
const editForm = document.querySelector('#edit-form');
const editInput = document.querySelector('#edit-input');
const cancelEditBtn = document.querySelector('#cancel-edit-btn');
const searchInput = document.querySelector('#search-input');
const eraseBtn = document.querySelector('#erase-button');
const filterBtn = document.querySelector('#filter-select');

let oldInputValue;

// funcoes
const saveTodo = (text, done=0, save=1) => {
    const todo = document.createElement('div');
    todo.classList.add('todo');

    const todoTitle = document.createElement('h3');
    todoTitle.innerHTML = text;
    todo.appendChild(todoTitle);

    const doneBtn = document.createElement('button');
    doneBtn.classList.add('finish-todo');
    doneBtn.innerHTML = '<i class="fas fa-check"></i>';
    todo.appendChild(doneBtn);

    const editBtn = document.createElement('button');
    editBtn.classList.add('edit-todo');
    editBtn.innerHTML = '<i class="fas fa-edit"></i>';
    todo.appendChild(editBtn)

    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('remove-todo');
    deleteBtn.innerHTML = '<i class="fas fa-trash"></i>';
    todo.appendChild(deleteBtn)

    if(done){
        todo.classList.add('done');
        doneBtn.innerHTML = '<i class="fas fa-undo-alt"></i>';
    }

    if(save){
        saveTodoLocalStorage({text, done});
    }
        


    todoList.appendChild(todo);

    // limpa input
    todoInput.value = '';
    todoInput.focus();

}

const toggleForms = () => {
    editForm.classList.toggle('hide');
    todoForm.classList.toggle('hide');
    todoList.classList.toggle('hide');
}

const updateTodo = (text) => {
    const todos = document.querySelectorAll('.todo');

    todos.forEach((todo) => {
        let todoTitle = todo.querySelector('h3')
        if (todoTitle.innerText === oldInputValue){
            todoTitle.innerText = text;

            updateTodosLocalStorage(oldInputValue,text)
        }
    })
}

const getSearchTodos = (search) => { 
    const todos = document.querySelectorAll('.todo');

    todos.forEach((todo) => {
        let todoTitle = todo.querySelector('h3').innerText.toLowerCase();
        
        todo.style.display = 'flex';

        if(!todoTitle.includes(search.toLowerCase())){
            todo.style.display = 'none';
        }
       
    })

}

const filterTodos = (filterValue) => {
    const todos = document.querySelectorAll('.todo');

    switch (filterValue){
        case 'all':
            todos.forEach((todo) => todo.style.display = 'flex');
            break;
        
        case 'done':
            todos.forEach((todo) => todo.classList.contains('done')? todo.style.display = 'flex' : todo.style.display = 'none');
            break;
        
        case 'todo':
            todos.forEach((todo) => todo.classList.contains('done')? todo.style.display = 'none' : todo.style.display = 'flex');
            break;

        default:
            break

    }
}

const getTodosLocalStorage = () => {
    const todos = JSON.parse(localStorage.getItem('todos')) || [];

    return todos;
}

const saveTodoLocalStorage = (todo) => {

    const todos = getTodosLocalStorage();

    todos.push(todo)

    localStorage.setItem('todos', JSON.stringify(todos));
}

const loadTodos = () => {
    const todos = getTodosLocalStorage();
    
    todos.forEach((todo) => saveTodo(todo.text, todo.done, 0))


}

const removeTodo = (todoText) => {
    const todos = getTodosLocalStorage();

    const filteredTodos = todos.filter((todo) =>{
        return todo.text!== todoText
    })
    localStorage.setItem('todos', JSON.stringify(filteredTodos));

}

const updateTodosStatusLocalStorage = (todoText) => {
    const todos = getTodosLocalStorage(); 

    todos.map((todo)=>
        todo.text === todoText ? (todo.done = !todo.done) : null
        
    )
    localStorage.setItem('todos', JSON.stringify(todos));

}

const updateTodosLocalStorage = (todoOldText, todoNewText) => {
    const todos = getTodosLocalStorage();

    todos.map((todo)=>
        todo.text === todoOldText? (todo.text = todoNewText) : null
        
    )
    localStorage.setItem('todos', JSON.stringify(todos));

}

//fim das funcoes

// eventos
todoForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const inputValue = todoInput.value.trim();

    if (inputValue){
        saveTodo(inputValue)
    }
})


document.addEventListener('click', (event) => {
    const targetEl = event.target;
    const parentEl = targetEl.closest('div')
    let todoTitle;

    if (parentEl && parentEl.querySelector('h3')){
        todoTitle = parentEl.querySelector('h3').innerText
    }

    if (targetEl.classList.contains('finish-todo')){
        parentEl.classList.toggle('done')

        updateTodosStatusLocalStorage(todoTitle)

    }

    if (targetEl.classList.contains('remove-todo')){
        parentEl.remove()

        removeTodo(todoTitle)
    }

    if (targetEl.classList.contains('edit-todo')){
        toggleForms()

        editInput.value= todoTitle;
        oldInputValue = todoTitle;
    }
        
});

cancelEditBtn.addEventListener('click', (e) => {
    e.preventDefault();

    toggleForms()
    
})

editForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const editInputValue = editInput.value.trim();

    if (editInputValue){
        updateTodo(editInputValue)
        
    }

    toggleForms()
})

searchInput.addEventListener('keyup', (event) => {
    const search = event.target.value

    getSearchTodos(search)

})

eraseBtn.addEventListener('click', (event) => {
    event.preventDefault();

    searchInput.value = '';

    searchInput.dispatchEvent(new Event('keyup'))
})

filterBtn.addEventListener('change', (event) => {

    const filterValue = event.target.value;

    filterTodos(filterValue)
}) 

//fim dos eventos

//local storage

loadTodos()

