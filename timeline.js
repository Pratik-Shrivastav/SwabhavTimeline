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
    timelineBody.innerHTML="";
    timelineData.forEach(element => {
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
        const theadCells = ["Project", "Sub-Project", "Batch", "Comment", "Hours", "Minutes","Action"];
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
            buttonCellTd.classList ="d-flex gap-2 w-10";
            const editActivityButton = document.createElement("button");
            const editIcon = document.createElement("i");
            editIcon.classList = "fas fa-edit";
            editActivityButton.appendChild(editIcon);
            buttonCellTd.appendChild(editActivityButton);

            const delteActivityButton = document.createElement("button");
            const delteIcon = document.createElement("i");
            delteIcon.classList = "fas fa-trash-alt";
            delteActivityButton.appendChild(delteIcon);
            delteActivityButton.addEventListener("click", ()=>deleteNewActivity(activity))
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
    });
}


const deleteNewActivity = async(activity)=>{
    const url = "https://localhost:7042/api/Activity";
    const token = localStorage.getItem('authToken');
    fetch(`${url}/${activity.id}`,{
        method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
    })
    window.location.reload();
}