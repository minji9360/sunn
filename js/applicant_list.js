const dayMapping = {
    "mon": "월",
    "tue": "화",
    "wed": "수",
    "thu": "목",
    "fri": "금"
};

function loadSeatInfoFromCookie() {
    const cookies = document.cookie.split("; ");
    const reservationDataCookie = cookies.find(cookie => cookie.startsWith("reservationData="));
    if (!reservationDataCookie) return {};

    const reservationData = JSON.parse(decodeURIComponent(reservationDataCookie.split("=")[1]));
    return reservationData.seatInfo || {};
}

function renderApplicantTable() {
    const seatInfo = loadSeatInfoFromCookie();
    const applicantTableBody = document.getElementById("applicantTableBody");

    applicantTableBody.innerHTML = "";

    Object.keys(seatInfo).forEach(key => {
        const seatsRemaining = seatInfo[key];
        if (seatsRemaining == 0) return;

        const day = key.slice(0, 3);
        const timeNum = key.slice(3);
        const realTime = timeNum === "1" ? "17:30" : "19:30";
        const dayKorean = dayMapping[day];

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${dayKorean}</td>
            <td>${realTime}</td>
            <td>${seatsRemaining}</td>
            <td style="text-align: left">
                <input type="checkbox">
                <span>대기자 이름</span>
                <button class="delete-btn" onclick="removeEntry(this)">X</button>
            </td>
            <td style="text-align: left">
                <input type="checkbox">
                <span>입금 안내 이름</span>
                <button class="delete-btn" onclick="removeEntry(this)">X</button>
            </td>
            <td style="text-align: left">
                <input type="checkbox">
                <span>입금 완료 이름</span>
                <button class="delete-btn" onclick="removeEntry(this)">X</button>
            </td>
        `;
        applicantTableBody.appendChild(row);
    });
}

function removeEntry(button) {
    // 삭제 로직
}

renderApplicantTable();
