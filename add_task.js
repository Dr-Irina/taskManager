function date(endDate) {
    let dateTime = new Date(endDate);
    let dateStr = dateTime.toDateString();
    let timeH = dateTime.getHours();
    let timeM = dateTime.getMinutes();
    if (timeH < 10)
        timeH = "0" + timeH;
    if (timeM < 10)
        timeM = "0" + timeM;
    return dateStr + '  ' + timeH + ':' + timeM;
};

function curTask(elem) {
    let str = "" + '<b>' + elem['name'] + '</b>';
    if (elem['endDate']){
        str += '<hr>' + 'Выполнить до: ' + date(elem['endDate']);
    }
    if (elem['description']){
        str += '<hr>' + elem['description'];
    }
    return str;
}

// function nowTime() {
//     let nowDate = new Date();
//     console.log(nowDate);
//     return nowDate;
// }

function colorTask(elem) {

    let nowDate = Date.now();
    let taskDate = Date.parse(elem['endDate']);
    let res = taskDate - nowDate;
    let colorClass = "";
    if (res < 86400000 && res > 0)
        colorClass = 'yellow';
    else if (res < 0)
        colorClass = 'red';
    else
        colorClass = 'green';
    return colorClass;
}

function delTask(elem) {
    let tasker = JSON.parse(localStorage.getItem("tasks"));
    let id = elem.parentElement.dataset.id;
    for (let i = 0; i < tasker.length; i++){
        let obj = tasker[i];
        if (obj.id === id) {
            tasker.splice(i, 1);
            break;
        }
    }
    localStorage.setItem("tasks", JSON.stringify(tasker));
    showTask();
}

function doneTask(elem) {
    let tasker = JSON.parse(localStorage.getItem("tasks"));
    let id = elem.parentElement.dataset.id;
    for (let i = 0; i < tasker.length; i++) {
        let obj = tasker[i];
        if (obj.id === id) {
            if (obj.doneT === "process") {
                obj.doneT = "doneTask";
                tasker.splice(i, 1, obj);
                break;
            }
            else if (obj.doneT === "doneTask") {
                obj.doneT = "process";
                tasker.splice(i, 1, obj);
                break;
            }
        }
    }
    localStorage.setItem("tasks", JSON.stringify(tasker));
    showTask();
}

// function editTask(elem) {
//     let tasker = JSON.parse(localStorage.getItem("tasks"));
//     let id = elem.parentElement.dataset.id;
//     for (let i = 0; i < tasker.length; i++) {
//         let obj = tasker[i];
//         if (obj.id === id) {
//             openPage('addTask', this, '#e7e2e2');
//             co
//             $('form input[type="text"]').val(obj.name);
//             $('form input[type="datetime-local"]').val(obj.endDate);
//             $('form textarea').val(obj.description);
//             $('form select').val(obj.type);
//             tasker.splice(i, 1);
//             break;
//         }
//     }
//     localStorage.setItem("tasks", JSON.stringify(tasker));
//     showTask();
// }

function makeId(length) {
    let text = "";
    let possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

document.getElementById("createTask").addEventListener("click", addTask);

function addTask(e) {
    e.preventDefault()
    var currTask = {
        id: makeId(40),
        name: `${document.getElementById("name").value}`,
        endDate: `${document.getElementById("endDate").value}`,
        description: `${document.getElementById("description").value}`,
        type: `${document.getElementById("type").value}`,
        doneT: "process",
    };
    var fail = false;
    if (currTask.name == "" || currTask.name == " "){
        fail = "Введите название задачи";
        alert(fail);
    }
    else if (currTask.endDate == ""){
        fail = "Укажите дедлайн";
        alert(fail);
    }
    if (fail === false) {
        if (localStorage.getItem("tasks") == null) {
            let task = [];
            task.push(currTask);
            localStorage.setItem("tasks", JSON.stringify(task))
        } else {
            let myTask = JSON.parse(localStorage.getItem("tasks"));
            myTask.push(currTask);
            localStorage.setItem("tasks", JSON.stringify(myTask))
        }
        showTask();
        $('form input[type="text"], textarea').val('');
        $('form input[type="datetime-local"]').val('2019-04-19T12:00');
        $('form select').val("Личная задача");
        alert("Задача создана");
    }
}

function showTask() {
    let tasker = JSON.parse(localStorage.getItem("tasks"));
    let list = document.getElementById("taskList");
    let workList = document.getElementById("workTask");
    let personalList = document.getElementById("personalTask");
    list.innerHTML = "";
    workList.innerHTML = "";
    personalList.innerHTML = "";
    if (tasker) {

        tasker.map((elem) => {
            let colorClass = colorTask(elem);
            let str = "" + curTask(elem);

            str += '<hr>' + elem['type'] + '<hr>' + '<button class="done" onclick="doneTask(this)">Выполнено</button>' +
                // '<button class="edit" onclick="editTask(this)">Редактировать</button>' +
                '<button class="delete" onclick="delTask(this)">Удалить</button>';
            if (elem.doneT === "doneTask")
                list.innerHTML += `<li data-id=${elem.id} class=\"${colorClass} doneTask\">${str}</li>`;
            else
                list.innerHTML += `<li data-id=${elem.id} class=${colorClass}>${str}</li>`;
            if (elem.type === "Личная задача") {
                let str = "" + curTask(elem) + '<hr><button class="done" onclick="doneTask(this)">Выполнено</button>' +
                    '<button class="delete" onclick="delTask(this)">Удалить</button>';
                    // '<button class="edit">Редактировать</button>';
                if (elem.doneT === "doneTask")
                    personalList.innerHTML += `<li data-id=${elem.id} class=\"${colorClass} doneTask\">${str}</li>`;
                else {
                    personalList.innerHTML += `<li data-id=${elem.id} class=${colorClass}>${str}</li>`;
                }
            }
            if (elem.type === "Рабочая задача") {
                let str = "" + curTask(elem) +'<hr><button class="done" onclick="doneTask(this)">Выполнено</button>' +
                    '<button class="delete" onclick="delTask(this)">Удалить</button>';
                    // '<button class="edit">Редактировать</button>';
                // console.log(elem);
                if (elem.doneT === "doneTask")
                    workList.innerHTML += `<li data-id=${elem.id} class=\"${colorClass} doneTask\">${str}</li>`;
                else
                    workList.innerHTML += `<li data-id=${elem.id} class=${colorClass}>${str}</li>`;

            }
        });
        if (tasker.length == 0){
            localStorage.clear();
        }
    }
}
showTask()
date();
