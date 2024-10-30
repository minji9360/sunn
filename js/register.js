window.selectedTimes = window.selectedTimes || {};

document.querySelectorAll("td[data-time]").forEach(cell => {
    cell.addEventListener("click", () => {
        const time = cell.getAttribute("data-time");
        if (cell.classList.toggle("selected")) {
            selectedTimes[time] = true;
        } else {
            delete selectedTimes[time];
        }
    });
});

function register() {
    const name = document.getElementById("nameInput").value;
    if (!name) {
        alert("이름을 입력해주세요.");
        return;
    }

    const selectedList = Object.keys(selectedTimes).join(", ");
    alert(`등록 완료: ${name}님, 선택 시간 - ${selectedList}`);
}
