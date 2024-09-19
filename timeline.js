const addTimeLine = document.querySelector("#addTimeline");
addTimeLine.addEventListener("click", () => {
    window.location.href = '/SwabhavTimeline/addTimeline.html';
});
const url = "https://localhost:7042/api/TimeLine";

const fetchAllTimeLine = async () => {
    const token = localStorage.getItem('authToken');
    try {
        let response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        let data = await response.json();
        console.log(data);
        addTableBody(data);
    } catch (error) {
        console.error('Error fetching timeline data:', error);
    }
}

fetchAllTimeLine();

const addTableBody = (timelineData) => {
    console.log(timelineData);

    const timelineBody = document.querySelector("#timelineList");
    timelineBody.innerHTML = "";
    timelineData.forEach(element => {
        if (element.onLeave) {
            const row = document.createElement("tr");


            const date = document.createElement("td");
            date.innerText = element.date;
            row.appendChild(date);

            const leave = document.createElement("td");
            leave.innerText = element.onLeave ? "Yes" : "No";
            row.appendChild(leave);

            const activityList = document.createElement("td");
            row.appendChild(activityList);

            const totalHourTd = document.createElement("td");
            const delteTimelineButton = document.createElement("button");
            const delteIcon = document.createElement("i");
            delteIcon.classList = "fas fa-trash-alt";
            delteTimelineButton.appendChild(delteIcon);
            delteTimelineButton.addEventListener("click", () => deleteOnLeaveTimeline(element));
            totalHourTd.appendChild(delteTimelineButton);
            row.appendChild(totalHourTd);

            timelineBody.appendChild(row);

        }
        else {
            let totalHours = 0;
            let totalMins = 0;

            const row = document.createElement("tr");


            const date = document.createElement("td");
            date.innerText = element.date;
            row.appendChild(date);


            const leave = document.createElement("td");
            leave.innerText = element.onLeave ? "Yes" : "No";
            row.appendChild(leave);


            const activityList = document.createElement("td");
            activityList.classList.add("p-0");

            const activityTable = document.createElement("table");
            activityTable.classList.add("table", "table-sm", "table-bordered", "mb-0");

            const activityTableHead = document.createElement("thead");
            const theadRow = document.createElement("tr");
            const theadCells = ["Project", "Sub-Project", "Batch", "Comment", "Hours", "Minutes", "Action"];
            theadCells.forEach(cell => {
                const cellHeadTh = document.createElement("th");
                cellHeadTh.innerText = cell;
                theadRow.appendChild(cellHeadTh);
            });
            activityTableHead.appendChild(theadRow);
            activityTable.appendChild(activityTableHead);

            const activityTableBody = document.createElement("tbody");
            element.activityList.forEach((activity) => {
                totalHours += activity.hours;
                totalMins += activity.minutes;

                const activitySingle = document.createElement("tr");

                const cells = [
                    activity.projectName,
                    activity.subProjectName,
                    activity.batchName,
                    activity.comments,
                    activity.hours,
                    activity.minutes
                ];
                cells.forEach(cell => {
                    const cellTd = document.createElement("td");
                    cellTd.innerText = cell;
                    activitySingle.appendChild(cellTd);
                });

                const buttonCellTd = document.createElement("td");
                buttonCellTd.classList = "d-flex gap-2 w-10";
                const editActivityButton = document.createElement("button");
                const editIcon = document.createElement("i");
                editIcon.classList = "fas fa-edit";
                editActivityButton.appendChild(editIcon);
                editActivityButton.addEventListener("click", () => editNewActivity(activity));
                buttonCellTd.appendChild(editActivityButton);

                const delteActivityButton = document.createElement("button");
                const delteIcon = document.createElement("i");
                delteIcon.classList = "fas fa-trash-alt";
                delteActivityButton.appendChild(delteIcon);
                delteActivityButton.addEventListener("click", () => deleteNewActivity(activity));
                buttonCellTd.appendChild(delteActivityButton);

                activitySingle.appendChild(buttonCellTd);

                activityTableBody.appendChild(activitySingle);
            });
            activityTable.appendChild(activityTableBody);
            activityList.appendChild(activityTable);
            row.appendChild(activityList);

            const totalMinutes = totalHours * 60 + totalMins;
            const finalHours = Math.floor(totalMinutes / 60);
            const finalMinutes = totalMinutes % 60;
            const totalHourTd = document.createElement("td");
            totalHourTd.innerText = `${finalHours} Hours ${finalMinutes} Minutes`;
            row.appendChild(totalHourTd);

            timelineBody.appendChild(row);

        }

    });
}

const deleteOnLeaveTimeline = async (timeline) => {
    console.log("hrllo");
    
    const url = "https://localhost:7042/api/Timeline";
    const token = localStorage.getItem('authToken');
    await fetch(`${url}/${timeline.id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    window.location.reload();


}


const deleteNewActivity = async (activity) => {
    const url = "https://localhost:7042/api/Activity";
    const token = localStorage.getItem('authToken');
    await fetch(`${url}/${activity.id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${token}`
        }
    })
    window.location.reload();
}

const editNewActivity = async (activity) => {
    console.log(activity);

    const modal = document.getElementById('activityEditModal');
    modal.setAttribute("style", "display:flex");

    //project
    const projectActivity = document.querySelector("#project");
    projectActivity.innerHTML = "";
    const projectDefaultOption = document.createElement("option");
    projectDefaultOption.innerText = activity.projectName;
    projectDefaultOption.value = activity.projectName;

    projectActivity.appendChild(projectDefaultOption);

    const urlProject = "https://localhost:7042/api/Project";
    let projectResponse = await fetch(urlProject);
    let projectData = await projectResponse.json();
    console.log(projectData);

    let projectDataNew = projectData.filter((projectElement) => {
        return projectElement.name != activity.projectName;
    })

    projectDataNew.forEach((proData) => {
        const projectOption = document.createElement("option");
        projectOption.innerText = proData.name;
        projectOption.value = proData.name;
        projectActivity.appendChild(projectOption);
    }
    )

    //SubProject
    const subProjectActivity = document.querySelector("#subProject");
    subProjectActivity.innerHTML = "";
    const subProjectDefaultOption = document.createElement("option");
    subProjectDefaultOption.innerText = activity.subProjectName;
    subProjectDefaultOption.value = activity.subProjectName;

    subProjectActivity.appendChild(subProjectDefaultOption);

    const urlSubProject = "https://localhost:7042/api/SubProject";
    let subProjectResponse = await fetch(urlSubProject);
    let subProjectData = await subProjectResponse.json();
    console.log(projectData);

    let subProjectDataNew = subProjectData.filter((subProjectElement) => {
        return subProjectElement.name != activity.subProjectName;
    })

    subProjectDataNew.forEach((proData) => {
        const subProjectOption = document.createElement("option");
        subProjectOption.innerText = proData.name;
        subProjectOption.value = proData.name;
        subProjectActivity.appendChild(subProjectOption);
    }
    )

    //Batch
    const batchActivity = document.querySelector("#batch");
    batchActivity.innerHTML = "";
    const batchDefaultOption = document.createElement("option");
    batchDefaultOption.innerText = activity.batchName;
    batchDefaultOption.value = activity.batchName;

    batchActivity.appendChild(batchDefaultOption);

    const urlBatch = "https://localhost:7042/api/Batch";
    let batchResponse = await fetch(urlBatch);
    let batchData = await batchResponse.json();
    console.log(batchData);

    let batchDataNew = batchData.filter((batchElement) => {
        return batchElement.name != activity.batchName;
    })

    batchDataNew.forEach((proData) => {
        const batchOption = document.createElement("option");
        batchOption.innerText = proData.name;
        batchOption.value = proData.name;
        batchActivity.appendChild(batchOption);
    }
    )

    //hours
    const hourActivity = document.querySelector("#hours");
    hourActivity.value = activity.hours;

    //Minutes
    const minutesActivity = document.querySelector("#minutes");
    minutesActivity.value = activity.minutes;

    //Comments
    const commentsActivity = document.querySelector("#comments");
    commentsActivity.value = activity.comments;

    //Add Buttons
    const buttonRow = document.querySelector("#buttonDiv");
    buttonRow.setAttribute("style", "display: flex; justify-content: center; align-items: center; flex-direction: row;");
    buttonRow.innerHTML = ' ';

    const submitButtonPost = document.createElement("button");
    submitButtonPost.classList = "btn btn-primary";
    submitButtonPost.innerText = "Submit";
    submitButtonPost.addEventListener("click", () => putActivity(activity.id, activity.date))
    buttonRow.appendChild(submitButtonPost);

    const closeButton = document.createElement("button");
    closeButton.classList = "btn btn-danger";
    closeButton.innerText = "Close";
    buttonRow.appendChild(closeButton);
    closeButton.addEventListener("click", () => {
        modal.setAttribute("style", "display:none");
    })
}

let putActivity = async (activityId, activityDate) => {
    const url = "https://localhost:7042/api/Activity";
    const token = localStorage.getItem('authToken');

    let updatedActivity = {

        id: activityId,
        date: activityDate,
        projectName: document.querySelector("#project").value,
        subProjectName: document.querySelector("#subProject").value,
        batchName: document.querySelector("#batch").value,
        hours: parseInt(document.querySelector("#hours").value),
        minutes: parseInt(document.querySelector("#minutes").value),
        comments: document.querySelector("#comments").value

    }
    console.log(updatedActivity);

    let response = await fetch(`${url}/${activityId}`, {
        method: 'PUT',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedActivity)
    });
    let data = await response.text();
    console.log(response);
    console.log(data);

    const modal = document.getElementById('activityEditModal');
    modal.setAttribute("style", "display:none");

    window.location.reload();

}

const logOutUser = () => {
    localStorage.removeItem("authToken");
    window.location.href = "/SwabhavTimeline/index.html";
}