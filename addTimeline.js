const getData = async (link) => {
    let response = await fetch(link);
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    let data = await response.json();
    return data;
}

const populateBatch = async () => {
    const url = "https://localhost:7042/api/Batch";
    const batchData = await getData(url);
    console.log(batchData);
    const batchSelect = document.querySelectorAll("#batch");

    batchSelect.forEach((batchDataElement) => {
        const optionsCheck = batchDataElement.querySelectorAll("option");
        if(optionsCheck.length==0){
            const defaultOption = document.createElement("option");
            defaultOption.value = "";
            defaultOption.textContent = "Select Batch";
            batchDataElement.appendChild(defaultOption);
            batchData.forEach((data) => {
            const option = document.createElement("option");
            option.innerText = data.name;
            batchDataElement.appendChild(option);
        })
        }
    })

};
populateBatch();

const populateProject = async () => {
    const url = "https://localhost:7042/api/Project";

    const projectData = await getData(url);
    console.log(projectData);
    const projectSelect = document.querySelectorAll("#project");
    projectSelect.forEach((projectSelectElement) => {
        const optionsCheck = projectSelectElement.querySelectorAll("option");
        if(optionsCheck.length==0){
            const defaultOption = document.createElement("option");
            defaultOption.value = "";
            defaultOption.textContent = "Select Project";
            projectSelectElement.appendChild(defaultOption);
            projectData.forEach((data) => {
            const option = document.createElement("option");
            option.innerText = data.name;
            projectSelectElement.appendChild(option);
        })
        } 
    })
};
populateProject();

const populateSubProject = async () => {
    const url = "https://localhost:7042/api/SubProject";

    const subProjectData = await getData(url);
    console.log(subProjectData);
    const subProjectSelect = document.querySelectorAll("#subProject");

    subProjectSelect.forEach((subProjectElement) => {
        const optionsCheck = subProjectElement.querySelectorAll("option");
        if (optionsCheck.length==0) {
            const defaultOption = document.createElement("option");
            defaultOption.value = "";
            defaultOption.textContent = "Select Sub-Project";
            subProjectElement.appendChild(defaultOption);
            subProjectData.forEach((data) => {
                const option = document.createElement("option");
                option.innerText = data.name;
                subProjectElement.appendChild(option);
            })

        }


    })

};
populateSubProject();

const addActivityForm = async () => {
    const activityColumn = document.querySelector("#activitiesList");
    const formDiv = document.createElement("div");
    formDiv.classList.add("mb-3");
    formDiv.innerHTML = ` <div class="mb-3">
                                <label for="project" class="form-label">Project</label>
                                <select id="project" class="form-select">
                                </select>
                            </div>
                            <div class="mb-3">
                                <label for="subProject" class="form-label">SubProject</label>
                                <select id="subProject" class="form-select">
                                </select>
                            </div>
                            <div class="mb-3">
                                <label for="batch" class="form-label">Batch</label>
                                <select id="batch" class="form-select">
                                </select>
                            </div>
                            <div class="mb-3">
                                <label for="hours" class="form-label">Hours</label>
                                <input type="text" id="hours" class="form-control"
                                    placeholder="00" />
                                    <label for="minutes" class="form-label">Minutes</label>
                                <input type="text" id="minutes" class="form-control" placeholder="00" />
                            </div>
                            <div class="mb-3">
                                <label for="comments" class="form-label">Comments</label>
                                <textarea id="comments" class="form-control" rows="3"
                                    placeholder="Enter activities"></textarea>
                            </div>`;

    const deleteActivity = document.createElement("button");
    deleteActivity.innerText = "Delete Activity";
    deleteActivity.classList = "btn btn-danger";
    deleteActivity.addEventListener("click", () => deleteNewActivity(formDiv));
    formDiv.appendChild(deleteActivity);

    const button = document.querySelector("#buttonDiv");
    activityColumn.insertBefore(formDiv, button);
    populateSubProject();
    populateProject();
    populateBatch();
}

const deleteNewActivity = (formDiv) => {
    formDiv.remove();
}

const previewButton = () => {
    const date = document.querySelector("#date").value;
    const holiday = document.querySelector("#holiday").value === "true" ? true : false;
    const projects = document.querySelectorAll("#project");
    const subProjects = document.querySelectorAll("#subProject");
    const batchs = document.querySelectorAll("#batch");
    const hours = document.querySelectorAll("#hours");
    const minutes = document.querySelectorAll("#minutes");
    const comments = document.querySelectorAll("#comments");

    const activityList = [];
    for (let i = 0; i < projects.length; i++) {
        const activity = {
            date: date,
            projectName: projects[i].value,
            subProjectName: subProjects[i].value,
            batchName: batchs[i].value,
            hours: isNaN(parseInt(hours[i].value)) ? 0 : parseInt(hours[i].value),
            minutes: isNaN(parseInt(minutes[i].value)) ? 0 : parseInt(minutes[i].value),
            comments: comments[i].value
        }
        activityList.push(activity);
    }
    console.log(activityList);


    previewFunction(activityList, holiday, date);

}

const previewFunction = (activityList, holiday, date) => {
    const tableBody = document.querySelector('#tableBodyModal');
    let totalHours = 0;
    let totalMinutes = 0;
    tableBody.innerHTML = '';

    const rowMain = document.createElement('tr');
    const dateColumn = document.createElement('td');
    dateColumn.innerText = date;
    const holidayColumn = document.createElement('td');
    holidayColumn.innerText = holiday;
    rowMain.appendChild(dateColumn);
    rowMain.appendChild(holidayColumn);

    const detailsColumn = document.createElement('td');
    const detailsTable = document.createElement('table');
    detailsTable.className = 'table table-sm';
    const detailsTableBody = document.createElement('tbody');

    if (activityList && activityList.length > 0) {
        activityList.forEach(activity => {
            const hours = parseInt(activity.hours, 10) || 0;
            const minutes = parseInt(activity.minutes, 10) || 0;
            totalHours += hours;
            totalMinutes += minutes;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td>
                    <strong>Project:</strong> ${activity.projectName}<br>
                    <strong>SubProject:</strong> ${activity.subProjectName}<br>
                    <strong>Batch:</strong> ${activity.batchName}<br>
                    <strong>Comment:</strong> ${activity.comments}
                </td>
            `;
            detailsTableBody.appendChild(row);
        });

        detailsTable.appendChild(detailsTableBody);
        detailsColumn.appendChild(detailsTable);

        const totalMinutesFinal = totalHours * 60 + totalMinutes;
        const finalHours = Math.floor(totalMinutesFinal / 60);
        const finalMinutes = totalMinutesFinal % 60;
        const totalHoursColumn = document.createElement('td');
        totalHoursColumn.innerHTML = `<strong>${finalHours} hours ${finalMinutes} minutes</strong>`;

        rowMain.appendChild(detailsColumn);
        rowMain.appendChild(totalHoursColumn);

        tableBody.appendChild(rowMain);

        const buttonRow = document.querySelector("#modelButtonDiv");
        buttonRow.setAttribute("style", "display: flex; justify-content: center; align-items: center; flex-direction: row;");
        buttonRow.innerHTML = ' ';

        const submitButtonPost = document.createElement("button");
        submitButtonPost.classList = "btn btn-primary";
        submitButtonPost.innerText = "Submit";
        submitButtonPost.addEventListener("click", () => postTimeLine(date, holiday, activityList))
        buttonRow.appendChild(submitButtonPost);

        const closeButton = document.createElement("button");
        closeButton.classList = "btn btn-danger";
        closeButton.innerText = "Close";
        buttonRow.appendChild(closeButton);
        closeButton.addEventListener("click", () => {
            const modal = document.getElementById('activityModal');
            modal.setAttribute("style", "display:none");
        })

        const modalBody = document.querySelector(".modal-body");
        modalBody.appendChild(buttonRow);

        const modal = document.getElementById('activityModal');
        modal.setAttribute("style", "display:flex");
    }
    // else {
    //     tableBody.innerHTML = '<tr><td colspan="4">No activities to display.</td></tr>';
    //     const modal = new bootstrap.Modal(document.getElementById('activityModal'));
    //     modal.show();
    // }
}


const postTimeLine = async (date, onLeave, activityList) => {
    const url = "https://localhost:7042/api/TimeLine";
    const token = localStorage.getItem('authToken');
    let requestData = {};
    if (onLeave) {
        requestData = {
            date: date,
            onLeave: onLeave
        };
    } else {
        requestData = {
            date: date,
            onLeave: onLeave,
            activityList: activityList
        };
    }

    console.log(requestData);

    // const testData ={
    //     date: "30-08-2024",
    //     onLeave: false,
    //     activityList: [
    //       {
    //         date: "30-08-2024",
    //         projectName: "Java",
    //         subProjectName: "Inheritence",
    //         batchName: "SCM",
    //         hours: 2,
    //         minutes: 0,
    //         comments: "Method Overriding"
    //       }
    //     ]
    //   }
    //   console.log(testData);


    const response = await fetch(url, {
        method: "Post",
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
    })

    const data = await response.json();
    console.log(data);
    window.location.href = '/SwabhavTimeline/timeline.html';

}
