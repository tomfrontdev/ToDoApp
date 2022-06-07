const addTask = document.querySelector(".input__addBtn");
const addInput = document.querySelector(".input__activity");
const activeTasks = document.querySelector(".app__activetasks");
const doneTasks = document.querySelector(".app__completedtasks");
const searchForm = document.querySelector(".input__search");
const tasks = document.querySelector(".app__tasks");
const app = document.querySelector(".app");

let taskList = [];

document.addEventListener("DOMContentLoaded", () => {
	const ref = localStorage.getItem("taskList");
	if (ref) {
		taskList = JSON.parse(ref);
		taskList.forEach((task) => {
			renderTask(task);
		});
	}
	clearText();
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

clearText = (event) => {
	const activeText = document.querySelector(".app__activetext");
	const doneText = document.querySelector(".app__donetext");

	if (activeTasks.querySelector(".app__task"))
		activeText.classList.add("hidden");
	if (!activeTasks.querySelector(".app__task"))
		activeText.classList.remove("hidden");
	if (doneTasks.querySelector(".app__task")) doneText.classList.add("hidden");
	if (!doneTasks.querySelector(".app__task"))
		doneText.classList.remove("hidden");
};

renderTask = (task) => {
	const li = document.createElement("li");
	li.setAttribute("data-id", task.id);
	li.setAttribute("class", "app__task");
	li.innerHTML = `<p class="app__value">${task.text}</p>
    	<i class="fa fa-trash app__deleteicon"></i>
    	<i class="fa-regular fa-circle-check app__completeicon"></i>
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

app.addEventListener("click", (event) => clearText(event));

searchForm.addEventListener("input", findTask);
