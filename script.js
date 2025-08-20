// Elementos principais
const listElement = document.querySelector("#listaTarefas");
const inputElement = document.querySelector("#tarefaInput");
const buttonElement = document.querySelector("#addBtn");
const filtroBtns = document.querySelectorAll(".filtros button");

// Estado da aplicação
let tarefas = JSON.parse(localStorage.getItem("@listaTarefas")) || [];
let filtroAtual = "todas";

// Renderizar tarefas
function renderTarefas() {
    listElement.innerHTML = "";

    let tarefasFiltradas = tarefas.filter((tarefa) => {
        if (filtroAtual === "pendentes") return !tarefa.concluida;
        if (filtroAtual === "concluidas") return tarefa.concluida;
        return true;
    });

    tarefasFiltradas.forEach((todo, index) =>{
        const liElement = document.createElement("li");

        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = todo.concluida;
        checkbox.addEventListener("change", () => toggleTarefa(index));

        const span = document.createElement("span");
        span.textContent = todo.texto;
        if (todo.concluida) {
            span.classList.add("concluida");
        }

        const deleteBtn = document.createElement("a");
        deleteBtn.textContent = "Excluir";
        deleteBtn.onclick = () => deletarTarefas(index);

        liElement.appendChild(checkbox);
        liElement.appendChild(span);
        liElement.appendChild(deleteBtn);
        listElement.appendChild(liElement);
    });
}

// Adicionar tarefa
function adicionarTarefas() {
    const novaTarefa = inputElement.value.trim();

    if (!novaTarefa) {
        alert("Digite uma tarefa válida!");
        return;
    }

    tarefas.push({ texto: novaTarefa, concluida: false});
    inputElement.value = "";
    renderTarefas();
    salvarDados();
}

// Marcar/Desmarcar como concluída
function toggleTarefa(index) {
    tarefas[index].concluida = !tarefas[index].concluida;
    renderTarefas();
    salvarDados();
}

// Excluir tarefa
function deletarTarefas(posicao) {
    const li = listElement.children[posicao];
    li.classList.add("removendo");

    setTimeout(() => {
        tarefas.splice(posicao, 1);
        renderTarefas();
        salvarDados();
    }, 300);
}

// Salvar no localStorage
function salvarDados() {
    localStorage.setItem("@listaTarefas", JSON.stringify(tarefas));
}

// Eventos
buttonElement.addEventListener("click", adicionarTarefas);
inputElement.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        adicionarTarefas();
    }
});

filtroBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
        filtroAtual = btn.dataset.filter;

        filtroBtns.forEach((b) => b.classList.remove("ativo"));
        btn.classList.add("ativo");

        renderTarefas();
    })
})

// Inicialização
renderTarefas();