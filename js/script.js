// Capturando os elementos do DOM
const formularioTarefa = document.querySelector('#todo-form');
const entradaTarefa = document.querySelector('#todo-input');
const listaTarefas = document.querySelector('#todo-list');
const formularioEdicao = document.querySelector('#edit-form');
const entradaEdicao = document.querySelector('#edit-input');
const botaoCancelarEdicao = document.querySelector('#cancel-edit-btn');
const entradaPesquisa = document.querySelector('#search-input');
const botaoLimparPesquisa = document.querySelector('#erase-button');
const seletorFiltro = document.querySelector('#filter-select');

let valorAntigoEntrada;

// Função para salvar uma nova tarefa
const salvarTarefa = (texto, concluida = 0, salvar = 1) => {
    const tarefa = document.createElement('div');
    tarefa.classList.add('todo');

    const tituloTarefa = document.createElement('h3');
    tituloTarefa.innerHTML = texto;
    tarefa.appendChild(tituloTarefa);

    const botaoConcluir = document.createElement('button');
    botaoConcluir.classList.add('finish-todo');
    botaoConcluir.innerHTML = '<i class="fas fa-check"></i>';
    tarefa.appendChild(botaoConcluir);

    const botaoEditar = document.createElement('button');
    botaoEditar.classList.add('edit-todo');
    botaoEditar.innerHTML = '<i class="fas fa-edit"></i>';
    tarefa.appendChild(botaoEditar);

    const botaoExcluir = document.createElement('button');
    botaoExcluir.classList.add('remove-todo');
    botaoExcluir.innerHTML = '<i class="fas fa-trash"></i>';
    tarefa.appendChild(botaoExcluir);

    if (concluida) {
        tarefa.classList.add('done');
        botaoConcluir.innerHTML = '<i class="fas fa-undo-alt"></i>';
    }

    if (salvar) {
        salvarTarefaNoLocalStorage({ texto, concluida });
    }

    listaTarefas.appendChild(tarefa);
    
    entradaTarefa.value = '';
    entradaTarefa.focus();
};

// Alterna entre os formulários de edição e de adição de tarefa
const alternarFormularios = () => {
    formularioEdicao.classList.toggle('hide');
    formularioTarefa.classList.toggle('hide');
    listaTarefas.classList.toggle('hide');
};

// Atualiza uma tarefa já existente
const atualizarTarefa = (texto) => {
    const tarefas = document.querySelectorAll('.todo');

    tarefas.forEach((tarefa) => {
        let tituloTarefa = tarefa.querySelector('h3');
        if (tituloTarefa.innerText === valorAntigoEntrada) {
            tituloTarefa.innerText = texto;
            atualizarTarefasNoLocalStorage(valorAntigoEntrada, texto);
        }
    });
};

// Filtra tarefas com base no termo pesquisado
const pesquisarTarefas = (termoPesquisa) => {
    const tarefas = document.querySelectorAll('.todo');
    
    tarefas.forEach((tarefa) => {
        let tituloTarefa = tarefa.querySelector('h3').innerText.toLowerCase();
        tarefa.style.display = 'flex';

        if (!tituloTarefa.includes(termoPesquisa.toLowerCase())) {
            tarefa.style.display = 'none';
        }
    });
};

// Filtra tarefas com base no status (todas, concluídas, pendentes)
const filtrarTarefas = (filtro) => {
    const tarefas = document.querySelectorAll('.todo');

    switch (filtro) {
        case 'all':
            tarefas.forEach((tarefa) => (tarefa.style.display = 'flex'));
            break;
        case 'done':
            tarefas.forEach((tarefa) => tarefa.classList.contains('done') ? tarefa.style.display = 'flex' : tarefa.style.display = 'none');
            break;
        case 'todo':
            tarefas.forEach((tarefa) => tarefa.classList.contains('done') ? tarefa.style.display = 'none' : tarefa.style.display = 'flex');
            break;
    }
};

// Recupera as tarefas armazenadas no localStorage
const obterTarefasLocalStorage = () => {
    return JSON.parse(localStorage.getItem('tarefas')) || [];
};

// Salva uma nova tarefa no localStorage
const salvarTarefaNoLocalStorage = (tarefa) => {
    const tarefas = obterTarefasLocalStorage();
    tarefas.push(tarefa);
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
};

// Carrega as tarefas do localStorage ao iniciar
const carregarTarefas = () => {
    const tarefas = obterTarefasLocalStorage();
    tarefas.forEach((tarefa) => salvarTarefa(tarefa.texto, tarefa.concluida, 0));
};

// Remove uma tarefa do localStorage
const removerTarefa = (textoTarefa) => {
    const tarefas = obterTarefasLocalStorage();
    const tarefasFiltradas = tarefas.filter((tarefa) => tarefa.texto !== textoTarefa);
    localStorage.setItem('tarefas', JSON.stringify(tarefasFiltradas));
};

// Atualiza o status de uma tarefa no localStorage (concluída/não concluída)
const atualizarStatusTarefaNoLocalStorage = (textoTarefa) => {
    const tarefas = obterTarefasLocalStorage();
    tarefas.forEach((tarefa) => {
        if (tarefa.texto === textoTarefa) {
            tarefa.concluida = !tarefa.concluida;
        }
    });
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
};

// Atualiza o texto de uma tarefa no localStorage
const atualizarTarefasNoLocalStorage = (textoAntigo, textoNovo) => {
    const tarefas = obterTarefasLocalStorage();
    tarefas.forEach((tarefa) => {
        if (tarefa.texto === textoAntigo) {
            tarefa.texto = textoNovo;
        }
    });
    localStorage.setItem('tarefas', JSON.stringify(tarefas));
};

// Eventos
formularioTarefa.addEventListener('submit', (event) => {
    event.preventDefault();
    const valorEntrada = entradaTarefa.value.trim();
    if (valorEntrada) {
        salvarTarefa(valorEntrada);
    }
});

document.addEventListener('click', (event) => {
    const elementoClicado = event.target;
    const elementoPai = elementoClicado.closest('div');
    let tituloTarefa;

    if (elementoPai && elementoPai.querySelector('h3')) {
        tituloTarefa = elementoPai.querySelector('h3').innerText;
    }

    if (elementoClicado.classList.contains('finish-todo')) {
        elementoPai.classList.toggle('done');
        atualizarStatusTarefaNoLocalStorage(tituloTarefa);
    }

    if (elementoClicado.classList.contains('remove-todo')) {
        elementoPai.remove();
        removerTarefa(tituloTarefa);
    }

    if (elementoClicado.classList.contains('edit-todo')) {
        alternarFormularios();
        entradaEdicao.value = tituloTarefa;
        valorAntigoEntrada = tituloTarefa;
    }
});

// Inicializa as tarefas ao carregar a página
carregarTarefas();
