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

function colorTask(elem) {

    let nowDate = Date.now();
    let taskDate = Date.parse(elem['endDate']);
    let res = taskDate - nowDate;
    let myClass = "";
    if (res < 86400000 && res > 0)
        myClass = 'yellow';
    else if (res < 0)
        myClass = 'red';
    else
        myClass = 'green';
    return myClass;
}

function delTask(tasker) {

    
}

(function() {
    document.getElementById("createTask").addEventListener("click", addTask);

    function addTask(e) {
        e.preventDefault()
        var currTask = {
            name: `${document.getElementById("name").value}`,
            endDate: `${document.getElementById("endDate").value}`,
            description: `${document.getElementById("description").value}`,
            type: `${document.getElementById("type").value}`,
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
            $('form input[type="text"], form input[type="datetime-local"], textarea, select').val('');
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
                let myClass = colorTask(elem);
                let str = "" + curTask(elem)
                str += '<hr>' + elem['type'] + '<hr><button class="done">Выполнено</button>' +
                    '<button class="delete">Удалить</button>' +
                    '<button class="edit">Редактировать</button>';
                list.innerHTML += `<li class=${myClass}>${str}</li>`;
                if (elem.type === "Личная задача") {
                    let str = "" + curTask(elem) + '<hr><button class="done">Выполнено</button>' +
                        '<button class="delete">Удалить</button>' +
                        '<button class="edit">Редактировать</button>';
                    personalList.innerHTML += `<li class=${myClass}>${str}</li>`;
                }
                if (elem.type === "Рабочая задача") {
                    let str = "" + curTask(elem) +'<hr><button class="done">Выполнено</button>' +
                        '<button class="delete">Удалить</button>' +
                        '<button class="edit">Редактировать</button>';
                    workList.innerHTML += `<li class=${myClass}>${str}</li>`;
                }
            });
        }
    }
    showTask()
    date();
})();
