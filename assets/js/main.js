let toDo = {
    taskId: "",
    taskValueMas: [],
    complTaskMas: [],
    openFormAddTask: function() {
        let addTaskForm = document.getElementById("addTask");
        addTaskForm.style.transform = "scale(1)";
        addTaskForm.style.zIndex = 1;
    },
    closeFormAddTask: function() {
        let closeTaskForm = document.getElementById("addTask");
        closeTaskForm.style.transform = "scale(0)";
        closeTaskForm.style.zIndex = -1;
    },
    addTask: function() {
        let tittle = document.getElementById("title_task").value;
        let task = document.getElementById("text_task").value;
        let radioButton = document.getElementsByName("priority");
        let priority;
        let today = new Date();
        today = String(today.getDate()).padStart(2, '0') + ' '
                + String(today.getMonth() + 1).padStart(2, '0') + ' ' 
                + today.getFullYear() + ' ' 
                + String(today.getHours() + 1).padStart(2, '0') + ':' 
                + String(today.getMinutes() + 1).padStart(2, '0');

        for (let i = 0; i < radioButton.length; i ++) {
            if (radioButton[i].checked){
                priority = radioButton[i].value;
                break;
            }
        }
        let color;
        if (priority == "Hight Priority") {
            color = "red";
        } else if (priority == "Medium Priority") {
            color = "yellow";
        } else if (priority == "Low Priority") {
            color = "green";
        }
        let div = document.createElement("div");
        div.className = "task"; 
        div.innerHTML = `<div class="color_task_wrapper"><div class="color_task" style="background:${color};"></div></div>
                        <h2 class="title_task">${tittle}</h2> 
                        <p class="text_task">${task}</p>
                        <p class="priority_task">${priority}</p>
                        <p class="date_task">${today}</p>
                        <p class="menu_task" onclick="toDo.showMenuTaskPanel(this)"><i class="fas fa-ellipsis-v"></i></p>
                        <p class="task_id"></p>
                        <div class="menu_task_panel">
                            <p class="menu_task_panel_edit" onclick="toDo.editTask(this)">edit</p>
                            <p class="menu_task_panel_del" onclick="toDo.delTask(this)">delete</p>
                            <p class="menu_task_panel_compl" onclick="toDo.completeTask(this)">completed</p>
                        </div>`;
        if (tittle == "" || task == "" || priority == "") {
            alert("Пожалуйста, заполните все поля");
        } else {
            document.getElementById("active_task").append(div);
            toDo.closeFormAddTask();
            toDo.saveTask();
        }
        let str = JSON.parse(localStorage.getItem ("taskMas"));
        document.getElementById("active_task_counter").innerHTML = `(${str.length})`;
    },
    saveTask: function() {
        let str = "";
        this.taskValueMas = [];
        let taskMas = document.getElementsByClassName("task").length;
        for (let i = 0; i < taskMas; i ++) {
            let masValue = document.getElementsByClassName("task")[i];
            document.getElementsByClassName("task_id")[i].innerHTML = i;
            str = masValue.innerHTML;
            this.taskValueMas.push(str);
        }
        
        localStorage.setItem ("taskMas", JSON.stringify(this.taskValueMas));
    },
    loadTask: function() {
        let str = JSON.parse(localStorage.getItem ("taskMas"));
        if (str) {
            document.getElementById("active_task_counter").innerHTML = `( ${str.length} )`;
            for (let i = 0; i < str.length; i ++) {
                let div = document.createElement("div");
                div.className = "task"; 
                div.innerHTML = str[i];
                document.getElementById("active_task").append(div);
            }
        }
    },
    showMenuTaskPanel: function(obj) {
        obj = obj.parentNode;
        obj = obj.lastElementChild;
        if (obj.style.transform == "scale(1)") {
            obj.style.transform = "scale(0)";
        } else {
            obj.style.transform = "scale(1)";
        }
        toDo.saveTask();
    },
    hideMenuTaskPanel: function(target) {
        console.log(target.target.className);
        if (target.target.className == "menu_task_panel" || target.target.className == "fas fa-ellipsis-v" 
            || target.target.className == "menu_task" ) {
        } else {    
            let obj = document.getElementsByClassName("menu_task_panel");
            for (let i = 0; i < obj.length; i ++) {
                obj[i].style.transform = "scale(0)";
            }
        } 
    },
    delTask: function(obj) {
        obj = obj.parentNode;
        obj = obj.parentNode;
        obj.remove();
        toDo.saveTask();
        let str = JSON.parse(localStorage.getItem ("taskMas"));
        document.getElementById("active_task_counter").innerHTML = `(${str.length})`;

        toDo.saveCompleteTask();
        let str2 = JSON.parse(localStorage.getItem ("completeTaskMas"));
        document.getElementById("completed_task_counter").innerHTML = `(${str2.length})`;
    },
    editTask: function(obj) {
        obj = obj.parentNode;
        obj = obj.parentNode;
        this.taskId = obj.children[6].innerHTML;
        let title = obj.children[1].innerHTML;
        let text = obj.children[2].innerHTML;
        document.getElementById("title_task").value = title;
        document.getElementById("text_task").value = text;
        document.getElementById("add_task_btn").style.transform = "scale(0)";
        document.getElementById("rewrite_task_btn").style.transform = "scale(1)";
        let addTaskForm = document.getElementById("addTask");
        addTaskForm.style.transform = "scale(1)";
        addTaskForm.style.zIndex = 1;
    },
    rewriteTask: function(obj) {
        let tittle = document.getElementById("title_task").value;
        let task = document.getElementById("text_task").value;
        let radioButton = document.getElementsByName("priority");
        let priority;
        for (let i = 0; i < radioButton.length; i ++) {
            if (radioButton[i].checked){
                priority = radioButton[i].value;
                break;
            }
        }
        let color;
        if (priority == "Hight Priority") {
            color = "red";
        } else if (priority == "Medium Priority") {
            color = "yellow";
        } else if (priority == "Low Priority") {
            color = "green";
        }
        document.getElementsByClassName("title_task")[this.taskId].innerHTML = tittle;
        document.getElementsByClassName("text_task")[this.taskId].innerHTML = task;
        document.getElementsByClassName("priority_task")[this.taskId].innerHTML = priority;  
        document.getElementsByClassName("color_task")[this.taskId].style.background = color;  
        toDo.saveTask();
        toDo.closeFormAddTask();
        document.getElementById("add_task_btn").style.transform = "scale(1)";
        document.getElementById("rewrite_task_btn").style.transform = "scale(0)";
        document.getElementsByClassName("menu_task_panel")[this.taskId].style.transform = "scale(0)";
    },
    completeTask: function(obj) {
        obj = obj.parentNode;
        obj = obj.parentNode;
        obj.children[3].innerHTML = "";
        obj.children[4].innerHTML = "Completed";
        obj.children[4].style.color = "green";
        let taskBlock = obj.innerHTML;
        obj.remove();
        let div = document.createElement("div");
        div.className = "task_completed"; 
        div.innerHTML = taskBlock;
        document.getElementById("completed_task").append(div);
        toDo.saveTask();
        toDo.saveCompleteTask();
        let str = JSON.parse(localStorage.getItem ("completeTaskMas"));
        document.getElementById("completed_task_counter").innerHTML = `(${str.length})`;
        let str2 = JSON.parse(localStorage.getItem ("taskMas"));
        document.getElementById("active_task_counter").innerHTML = `(${str2.length})`;
    },
    saveCompleteTask: function() {
        let str = "";
        this.complTaskMas = [];
        let taskMas = document.getElementsByClassName("task_completed").length;
        for (let i = 0; i < taskMas; i ++) {
            let masValue = document.getElementsByClassName("task_completed")[i];
            document.getElementsByClassName("task_id")[i].innerHTML = i;
            str = masValue.innerHTML;
            this.complTaskMas.push(str);
        }
        
        localStorage.setItem ("completeTaskMas", JSON.stringify(this.complTaskMas));
    },
    loadCompleteTask: function() {
        let str = JSON.parse(localStorage.getItem ("completeTaskMas"));
        if (str){
            document.getElementById("completed_task_counter").innerHTML = `(${str.length})`;
        }
        if (str) {
            this.complTaskMas = str;
            for (let i = 0; i < this.complTaskMas.length; i ++) {
                let div = document.createElement("div");
                div.className = "task_completed"; 
                div.innerHTML = this.complTaskMas[i];
                document.getElementById("completed_task").append(div);
            }
        }
    },
    priorityFilter: function(object) {
        let str = JSON.parse(localStorage.getItem ("taskMas"));
        localStorage.removeItem("taskMas");
        let masTask = document.getElementsByClassName("priority_task");
        let priority;
        let masPriority = [];
        
        for (let i = 0; i < masTask.length; i ++) {
            if (masTask[i].innerHTML == "Hight Priority") {
                priority = 3;
            } else if (masTask[i].innerHTML == "Medium Priority") {
                priority = 2;
            } else if (masTask[i].innerHTML == "Low Priority") {
                priority = 1;
            }
            masPriority.push(priority);
        }
        // if (object.id == "hight_prority") {
        //     sort(masPriority, str);
        //     object.className += " hidden"; 
        // }
        
        localStorage.setItem ("taskMas", JSON.stringify(str));
        let obj = document.getElementsByClassName("task");
        for (let i = obj.length - 1; i >= 0; i --) {
            obj[i].parentNode.removeChild(obj[i]);
        }
        toDo.loadTask();

        function sort(masPriority, str) {
            for (let j = 0; j < masPriority.length; j ++) {
                if (masPriority[j] < masPriority[j + 1]) {
                    let wrapper = masPriority[j + 1];
                    masPriority[j + 1] = masPriority[j];
                    masPriority[j] = wrapper;
                    let wrapper2 = str[j + 1];
                    str[j + 1] = str[j];
                    str[j] = wrapper2;
                    sort(masPriority, str);
                }
            }
        }
    },
};

window.onload =  function() {
    toDo.loadTask();
    toDo.loadCompleteTask();
    let window = document.getElementsByClassName("menu_task_panel");
    for (let i = 0; i < window.length; i ++){
        window[i].style.transform = "scale(0)";
    }
};

addEventListener("click", toDo.hideMenuTaskPanel);