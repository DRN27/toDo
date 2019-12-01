'use strict';
let toDo = {
    currentObj: null,
    isGridView: false,
    hideSidebar(currnetElem) {
        const aside = document.querySelector('aside');
        aside.classList.add('aside_min');
        currnetElem.setAttribute('onclick', 'toDo.showSidebar(this)');
        currnetElem.setAttribute('data-tooltip', 'show sidebar');

        logo_img.classList.add('logo_img_min');
        logo_text.classList.add('logo_text_min');

        const menuButtonText = 
            document.querySelectorAll('.menu_button > .menu_button--item > span');
        menuButtonText.forEach(item => item.hidden = true);
    },
    showSidebar(currnetElem) {
        const aside = document.querySelector('aside');
        aside.classList.remove('aside_min');
        currnetElem.setAttribute('onclick', 'toDo.hideSidebar(this)');
        currnetElem.setAttribute('data-tooltip', 'hide sidebar');

        logo_img.classList.remove('logo_img_min');
        logo_text.classList.remove('logo_text_min');

        const menuButtonText = 
            document.querySelectorAll('.menu_button > .menu_button--item > span');
        menuButtonText.forEach(item => item.hidden = false);
    },
    showFormAddTask() {
        document.getElementById("title_task").value = '';
        document.getElementById("text_task").value = '';
        document.querySelector('input[type = radio]').checked = true;

        add_task_btn.setAttribute('onclick','toDo.addTask()');
        add_task_btn.innerHTML = 'Add task';

        add_task_form.classList.add('add_task_form_show');
    },
    hideFormAddTask() {
        add_task_form.classList.remove('add_task_form_show');
    },
    addTask() {
        const tittle = document.getElementById("title_task").value;
        const task = document.getElementById("text_task").value;
        const radioButton = document.querySelectorAll('.radiobutton_wrapper > input');
        let priority = null;
        radioButton.forEach(function(item) {
            if (item.checked)
                priority = item.value;
        });
        let today = new Date();
        today = String(today.getDate()).padStart(2, '0') + ' '
                + String(today.getMonth() + 1).padStart(2, '0') + ' ' 
                + today.getFullYear() + ' ' 
                + String(today.getHours() + 1).padStart(2, '0') + ':' 
                + String(today.getMinutes() + 1).padStart(2, '0');
        let color;
        if (priority == "Hight Priority") {
            color = "red";
        } else if (priority == "Medium Priority") {
            color = "orange";
        } else if (priority == "Low Priority") {
            color = "green";
        }
        
        if (tittle == "" || task == "") {
            alert('Please fill all fields!');
        } else {
            const div = document.createElement("div");
            div.className = "task"; 
            if (toDo.isGridView == true) {
                div.classList.add('grid_view');
            }
            div.setAttribute('draggable','true');
            div.innerHTML = `<h2 class="title_task">${tittle}</h2> 
                            <p class="text_task">${task}</p>
                            <p class="priority_task" style="color:${color}">${priority}</p>
                            <p class="date_task">${today}</p>
                            <p class="menu_task" onclick="toDo.showTaskMenu(this)"><i class="fas fa-ellipsis-v"></i></p>
                            <p class="task_id"></p>
                            <div class="menu_task_panel">
                                <p class="menu_task_panel_edit" onclick="toDo.editTask(this)">edit</p>
                                <p class="menu_task_panel_del" onclick="toDo.delTask(this)">delete</p>
                                <p class="menu_task_panel_compl" onclick="toDo.completedTask(this)">completed</p>
                            </div>`;
            document.getElementById("active_task").append(div);
            toDo.hideFormAddTask();
            toDo.saveActiveTask();
            toDo.counterTask();
            toDo.dragAndDrop();
        }
    },
    saveActiveTask() {
        let arrayOfActiveTasks = [];
        const ActiveTask = document.querySelectorAll('.task');
        ActiveTask.forEach(function(element) {
            arrayOfActiveTasks.push(element.innerHTML);
        });
        localStorage.setItem ("arrayOfActiveTasks", JSON.stringify(arrayOfActiveTasks));
    },
    loadActiveTask() {
        const arrayOfActiveTasks = JSON.parse(localStorage.getItem ("arrayOfActiveTasks"));
        if (arrayOfActiveTasks) {
            for (let i = 0; i < arrayOfActiveTasks.length; i ++) {
                const div = document.createElement("div");
                div.className = "task"; 
                if (toDo.isGridView == true) {
                    div.classList.add('grid_view');
                }
                div.setAttribute('draggable','true');
                div.innerHTML = arrayOfActiveTasks[i];
                document.getElementById("active_task").append(div);
            }
        }
        toDo.counterTask();
    },
    saveCompletedTask() {
        let arrayOfCompletedTasks = [];
        const completedTask = document.querySelectorAll('.completed_task');
        completedTask.forEach(function(element) {
            arrayOfCompletedTasks.push(element.innerHTML);
        });
        localStorage.setItem ("arrayOfCompletedTasks", JSON.stringify(arrayOfCompletedTasks));
    },
    loadCompletedTask() {
        const arrayOfCompletedTasks = JSON.parse(localStorage.getItem ("arrayOfCompletedTasks"));
        if (arrayOfCompletedTasks) {
            for (let i = 0; i < arrayOfCompletedTasks.length; i ++) {
                const div = document.createElement("div");
                div.className = "completed_task"; 
                if (toDo.isGridView == true) {
                    div.classList.add('grid_view');
                }
                div.innerHTML = arrayOfCompletedTasks[i];
                document.getElementById("done_task").append(div);
            }
        }
        toDo.counterTask();
    },
    counterTask() {
        const arrayOfActiveTasks = JSON.parse(localStorage.getItem ("arrayOfActiveTasks"));
        document.getElementById("active_task_counter").innerHTML = `(${arrayOfActiveTasks.length})`;

        const arrayOfCompletedTasks = JSON.parse(localStorage.getItem ("arrayOfCompletedTasks"));
        document.getElementById("done_task_counter").innerHTML = `(${arrayOfCompletedTasks.length})`;
    },
    showTaskMenu(obj) {
        obj = obj.parentNode;
        obj = obj.lastElementChild;
        if (obj.style.transform == "scale(1)") {
            obj.style.transform = "scale(0)";
        } else {
                document.querySelectorAll('.menu_task_panel').forEach(function(item){
                    item.style.transform = 'scale(0)';
                });
                obj.style.transform = "scale(1)";
        }
    },
    hideTaskMenu(event) {
        if (event.target.className != "fas fa-ellipsis-v" && event.target.className != "menu_task") {
            document.querySelectorAll('.menu_task_panel').forEach(function(item){
                item.style.transform = 'scale(0)';
            });
        }
    },
    delTask(obj) {
        obj = obj.parentNode;
        obj = obj.parentNode;
        obj.remove();
        toDo.saveActiveTask();
        toDo.saveCompletedTask();
        toDo.counterTask();
    },
    editTask(obj) {
        toDo.showFormAddTask();
        add_task_btn.setAttribute('onclick','toDo.rewriteTask()');
        add_task_btn.innerHTML = 'Save';

        obj = obj.parentNode;
        obj = obj.parentNode;
        title_task.value = obj.children[0].innerHTML;
        text_task.value = obj.children[1].innerHTML;
        const priority = obj.children[2].innerHTML;
        const radioButton = document.querySelectorAll('input[type = radio]');
        if (priority == "Hight Priority") {
            radioButton[0].checked = true;
        } else if (priority == "Medium Priority") {
            radioButton[1].checked = true;
        } else if (priority == "Low Priority") {
            radioButton[2].checked = true;
        }
        this.currentObj = obj;
    },
    rewriteTask() {
        if (title_task.value == "" || text_task.value == "") {
            alert('Please fill all fields!');
        } else{
            this.currentObj.children[0].innerHTML = title_task.value;
            this.currentObj.children[1].innerHTML = text_task.value;
            const radioButton = document.querySelectorAll('.radiobutton_wrapper > input');
            let priority = null;
            radioButton.forEach(function(item) {
                if (item.checked)
                    priority = item.value;
            });
            let color = null;
            if (priority == "Hight Priority") {
                color = "red";
            } else if (priority == "Medium Priority") {
                color = "orange";
            } else if (priority == "Low Priority") {
                color = "green";
            }
            this.currentObj.children[2].innerHTML = priority;
            this.currentObj.children[2].style.color = color;
            toDo.hideFormAddTask();
            toDo.saveActiveTask();
            toDo.counterTask();
        }
    },
    completedTask(obj) {
        obj = obj.parentNode;
        obj = obj.parentNode;
        obj.children[3].innerHTML = "";
        obj.children[2].innerHTML = "Completed";
        obj.children[2].style.color = "green";
        obj.children[6].style.transform = "scale(0)";
        obj.children[6].innerHTML = '<p class="menu_task_panel_del" onclick="toDo.delTask(this)">delete</p>';

        const completedTask = obj.innerHTML;
        obj.remove();
        const div = document.createElement("div");
        div.className = "completed_task"; 
        console.log(toDo.isGridView);
        if (toDo.isGridView == true) {
            div.classList.add('grid_view');
        }
        div.innerHTML = completedTask;
        document.getElementById("done_task").append(div);
        toDo.saveActiveTask();
        toDo.saveCompletedTask();
        toDo.counterTask();
    },
    sortImportent() {
        const objectOfActiveTasks = document.querySelectorAll('.task');
        const arrayOfActiveTasks = [ ...objectOfActiveTasks];
        const arrayOfProirity = [];
        arrayOfActiveTasks.forEach(function(element) {
            arrayOfProirity.push(element.children[2].innerHTML);
        });
        arrayOfProirity.forEach( function(element, index) {
            if (element == 'Hight Priority'){
                arrayOfProirity[index] = 3;
            } else if (element == 'Medium Priority'){
                arrayOfProirity[index] = 2;
            } else {
                arrayOfProirity[index] = 1;
            } 
        });
        (function sort() {
            for (let i = 0; i < arrayOfProirity.length; i++) {
                if (arrayOfProirity[i] < arrayOfProirity[i + 1]) {
                    let a = arrayOfProirity[i + 1];
                    arrayOfProirity[i + 1] = arrayOfProirity[i];
                    arrayOfProirity[i] = a;
                    a = arrayOfActiveTasks[i + 1];
                    arrayOfActiveTasks[i + 1] = arrayOfActiveTasks[i];
                    arrayOfActiveTasks[i] = a;
                    sort();
                }
            }
        })(arrayOfActiveTasks, arrayOfProirity);
        
        objectOfActiveTasks.forEach(function(element) {
            element.remove();
        });

        hight_prority.classList.add("hidden_btn");
        low_prority.classList.remove("hidden_btn");

        arrayOfActiveTasks.forEach(function(element) {
            const div = document.createElement("div");
            div.className = "task";
            if (toDo.isGridView == 'true') {
                div.classList.add('grid_view');
            } 
            div.setAttribute('draggable','true');
            div.innerHTML = element.innerHTML;
            document.getElementById("active_task").append(div);
        });
    },
    sortUnimportent() {
        const objectOfActiveTasks = document.querySelectorAll('.task');
        const arrayOfActiveTasks = [ ...objectOfActiveTasks];
        const arrayOfProirity = [];
        arrayOfActiveTasks.forEach(function(element) {
            arrayOfProirity.push(element.children[2].innerHTML);
        });
        arrayOfProirity.forEach( function(element, index) {
            if (element == 'Hight Priority'){
                arrayOfProirity[index] = 1;
            } else if (element == 'Medium Priority'){
                arrayOfProirity[index] = 2;
            } else {
                arrayOfProirity[index] = 3;
            } 
        });
        (function sort() {
            for (let i = 0; i < arrayOfProirity.length; i++) {
                if (arrayOfProirity[i] < arrayOfProirity[i + 1]) {
                    let a = arrayOfProirity[i + 1];
                    arrayOfProirity[i + 1] = arrayOfProirity[i];
                    arrayOfProirity[i] = a;
                    a = arrayOfActiveTasks[i + 1];
                    arrayOfActiveTasks[i + 1] = arrayOfActiveTasks[i];
                    arrayOfActiveTasks[i] = a;
                    sort();
                }
            }
        })(arrayOfActiveTasks, arrayOfProirity);
        
        objectOfActiveTasks.forEach(function(element) {
            element.remove();
        });

        hight_prority.classList.remove("hidden_btn");
        low_prority.classList.add("hidden_btn");

        arrayOfActiveTasks.forEach(function(element) {
            const div = document.createElement("div");
            div.className = "task"; 
            if (toDo.isGridView == 'true') {
                div.classList.add('grid_view');
            } 
            div.setAttribute('draggable','true');
            div.innerHTML = element.innerHTML;
            document.getElementById("active_task").append(div);
        });
    },
    sortByNewTasks() {
        const objectOfActiveTasks = document.querySelectorAll('.task');
        const arrayOfActiveTasks = [ ...objectOfActiveTasks];
        const arrayOfDates = [];
        arrayOfActiveTasks.forEach(function(element) {
            arrayOfDates.push(element.children[3].innerHTML);
        });

        (function sort() {
            for (let i = 0; i < arrayOfDates.length; i++) {
                if (arrayOfDates[i] < arrayOfDates[i + 1]) {
                    let a = arrayOfDates[i + 1];
                    arrayOfDates[i + 1] = arrayOfDates[i];
                    arrayOfDates[i] = a;
                    a = arrayOfActiveTasks[i + 1];
                    arrayOfActiveTasks[i + 1] = arrayOfActiveTasks[i];
                    arrayOfActiveTasks[i] = a;
                    sort();
                }
            }
        })(arrayOfActiveTasks, arrayOfDates);

        objectOfActiveTasks.forEach(function(element) {
            element.remove();
        });

        new_tasks.classList.add("hidden_btn");
        old_tasks.classList.remove("hidden_btn");

        arrayOfActiveTasks.forEach(function(element) {
            const div = document.createElement("div");
            div.className = "task"; 
            if (toDo.isGridView == 'true') {
                div.classList.add('grid_view');
            } 
            div.setAttribute('draggable','true');
            div.innerHTML = element.innerHTML;
            document.getElementById("active_task").append(div);
        });
    },
    sortByOldTasks() {
        const objectOfActiveTasks = document.querySelectorAll('.task');
        const arrayOfActiveTasks = [ ...objectOfActiveTasks];
        const arrayOfDates = [];
        arrayOfActiveTasks.forEach(function(element) {
            arrayOfDates.push(element.children[3].innerHTML);
        });

        (function sort() {
            for (let i = 0; i < arrayOfDates.length; i++) {
                if (arrayOfDates[i] > arrayOfDates[i + 1]) {
                    let a = arrayOfDates[i + 1];
                    arrayOfDates[i + 1] = arrayOfDates[i];
                    arrayOfDates[i] = a;
                    a = arrayOfActiveTasks[i + 1];
                    arrayOfActiveTasks[i + 1] = arrayOfActiveTasks[i];
                    arrayOfActiveTasks[i] = a;
                    sort();
                }
            }
        })(arrayOfActiveTasks, arrayOfDates);

        objectOfActiveTasks.forEach(function(element) {
            element.remove();
        });

        new_tasks.classList.remove("hidden_btn");
        old_tasks.classList.add("hidden_btn");

        arrayOfActiveTasks.forEach(function(element) {
            const div = document.createElement("div");
            div.className = "task";
            if (toDo.isGridView == 'true') {
                div.classList.add('grid_view');
            } 
            div.setAttribute('draggable','true'); 
            div.innerHTML = element.innerHTML;
            document.getElementById("active_task").append(div);
        });
    },
    dragAndDrop() {
        const container = document.querySelectorAll('#done_task');
        const tasks = document.querySelectorAll('.task');
        let currentTask = null;

        tasks.forEach( (element) => {
            element.addEventListener('dragstart', function() {
                currentTask = element;
                setTimeout(function() {
                    element.classList.add('hidden');
                }, 0);
            });

            element.addEventListener('dragend', function() {
                setTimeout(function() {
                    element.classList.remove('hidden');
                    currentTask = null;
                }, 0);
            });
            
            container.forEach( (element) => {
                element.addEventListener('dragover', function(elem) {
                    elem.preventDefault();
                    element.classList.add('border');
                } );
                element.addEventListener('dragenter', function(elem) {
                    elem.preventDefault();
                } );
                element.addEventListener('dragleave', function(elem) {
                    elem.preventDefault();
                    element.classList.remove('border');
                } );
                element.addEventListener('drop', function(elem) {
                    if (currentTask != null) { 
                        currentTask.children[3].innerHTML = "";
                        currentTask.children[2].innerHTML = "Completed";
                        currentTask.children[2].style.color = "green";
                        currentTask.children[6].style.transform = "scale(0)";
                        currentTask.children[6].innerHTML = '<p class="menu_task_panel_del" onclick="toDo.delTask(this)">delete</p>';
                        currentTask.className = 'completed_task';
                        if (toDo.isGridView == true) {
                            currentTask.classList.add('grid_view');
                        }
                        this.append(currentTask);
                        element.classList.remove('border');

                        toDo.saveActiveTask();
                        toDo.saveCompletedTask();
                        toDo.counterTask();
                    }
                } );
            });
        });
    },
    gridView() {
        const activeTasks = document.querySelectorAll('.task');
        activeTasks.forEach( (element) => element.classList.add('grid_view'));

        const complitedTasks = document.querySelectorAll('.completed_task');
        complitedTasks.forEach( (element) => element.classList.add('grid_view'));

        localStorage.setItem ("isGridView", true);
        toDo.isGridView = true;
    },
    listView() {
        const activeTasks = document.querySelectorAll('.task');
        activeTasks.forEach( (element) => element.classList.remove('grid_view'));

        const complitedTasks = document.querySelectorAll('.completed_task');
        complitedTasks.forEach( (element) => element.classList.remove('grid_view'));

        localStorage.setItem ("isGridView", false);
        toDo.isGridView = false;
    },
    settings() {
        const block = document.querySelector('.settings');
        block.classList.add('show_block');

        const hiddenBlock = document.querySelector('.task_wrapper');
        hiddenBlock.classList.add('hide_block');
    },
    home() {
        const hiddenBlock = document.querySelector('.settings');
        hiddenBlock.classList.remove('show_block');

        const block = document.querySelector('.task_wrapper');
        block.classList.remove('hide_block');
    },
    colorTheme1() {
        document.querySelector('aside').style.background = 'rgb(11, 28, 83)';
        document.querySelector('.add_new_task').style.background = 'rgb(111, 141, 224)';
    },
    colorTheme2() {
        document.querySelector('aside').style.background = '#5C0DAC';
        document.querySelector('.add_new_task').style.background = '#9F69D6';
    },
};

window.onload =  function() {
    toDo.loadActiveTask();
    toDo.loadCompletedTask();
    toDo.dragAndDrop();

    toDo.isGridView = localStorage.getItem ("isGridView");
    if (toDo.isGridView === 'true') {
        toDo.gridView();
    }   
};

document.addEventListener('keydown', function(event) {
    if (event.code == 'Escape')
        toDo.hideFormAddTask();
  });

document.addEventListener("click", toDo.hideTaskMenu);