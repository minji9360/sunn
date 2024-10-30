window.seatInfo = window.seatInfo || loadSeatInfoFromCookie();
window.selectedTimes = window.selectedTimes || {};

function loadSeatInfoFromCookie() {
    const cookies = document.cookie.split("; ");
    const reservationDataCookie = cookies.find(cookie => cookie.startsWith("reservationData="));
    if (!reservationDataCookie) {
        console.warn("저장된 seatInfo 데이터가 없습니다.");
        return {};
    }

    const reservationData = JSON.parse(decodeURIComponent(reservationDataCookie.split("=")[1]));
    console.log("불러온 seatInfo 데이터:", reservationData.seatInfo);
    return reservationData.seatInfo || {};
}

document.querySelectorAll("td[data-time]").forEach(cell => {
    const time = cell.getAttribute("data-time");

    if (!seatInfo[time]) {
        cell.classList.add("disabled");
        cell.style.pointerEvents = "none";
    } else {
        cell.addEventListener("click", () => {
            if (cell.classList.toggle("selected")) {
                selectedTimes[time] = true;
            } else {
                delete selectedTimes[time];
            }
        });
    }
});

function register() {
    const name = document.getElementById("nameInput").value;
    if (!name) {
        alert("이름을 입력해주세요.");
        return;
    }

    // 선택된 시간 목록을 알림으로 표시
    const selectedList = Object.keys(selectedTimes).join(", ");
    alert(`등록 완료: ${name}님, 선택 시간 - ${selectedList}`);
}
