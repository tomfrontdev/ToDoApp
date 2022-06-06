const addTask = document.querySelector(".input__addBtn");
const addInput = document.querySelector(".input__activity");
const activeTasks = document.querySelector(".app__activetasks");
const doneTasks = document.querySelector(".app__completedtasks");
const searchForm = document.querySelector(".input__search");
const tasks = document.querySelector(".app__tasks");

let taskList = [];

document.addEventListener("DOMContentLoaded", () => {
	const ref = localStorage.getItem("taskList");
	if (ref) {
		taskList = JSON.parse(ref);
		taskList.forEach((task) => {
			renderTask(task);
		});
	}
});

updateLocalstorage = () =>
	localStorage.setItem("taskList", JSON.stringify(taskList));

removeTask = (item) => item.remove();

removeAllTasksFromHTML = () =>
	document.querySelectorAll(".app__task").forEach((task) => task.remove());

addText = (text) => {
	const task = {
		text: text,
		done: false,
		deleted: false,
		id: Date.now(),
	};
	taskList.push(task);
	updateLocalstorage();
	renderTask(task);
};

renderTask = (task) => {
	const li = document.createElement("li");
	const item = document.querySelector(`[data-id="${task.id}"]`);
	li.setAttribute("data-id", task.id);
	li.setAttribute("class", "app__task");
	li.innerHTML = `<p class="app__value">${task.text}</p>
    	<button class="app__deleteicon">close</button>
    	<button class="app__completeicon">ok</button>
    `;
	if (!task.done) activeTasks.appendChild(li);
	if (task.done) doneTasks.appendChild(li);
};

deleteTask = (key) => {
	const index = taskList.findIndex((item) => item.id == key);
	taskList[index].deleted = true;
	const task = {
		...taskList[index],
	};
	taskList = taskList.filter((task) => task !== taskList[index]);
	updateLocalstorage();
};

switchTask = (key) => {
	const index = taskList.findIndex((item) => item.id == key);
	taskList[index].done = true;
	const task = {
		...taskList[index],
	};
	updateLocalstorage();
	renderTask(task);
};

findTask = () => {
	const searchInput = searchForm.value;
	foundTasks = taskList.filter((task) =>
		task.text.toLowerCase().includes(searchInput.toLowerCase())
	);
	removeAllTasksFromHTML();
	foundTasks.forEach((element) => renderTask(element));
};

addTask.addEventListener("click", (event) => {
	event.preventDefault();
	const text = addInput.value;
	if (text !== "") {
		addText(text);
		addInput.value = "";
		addInput.focus();
	}
});

tasks.addEventListener("click", (event) => {
	const key = event.target.parentNode.dataset.id;

	if (event.target.classList.contains("app__deleteicon")) {
		event.target.parentNode.remove();
		deleteTask(key);
	}
	if (event.target.classList.contains("app__completeicon")) {
		if (
			!event.target.parentNode.classList.contains("app__completedtasks")
		) {
			event.target.parentNode.remove();
			switchTask(key);
		}
	}
});

searchForm.addEventListener("input", findTask);
