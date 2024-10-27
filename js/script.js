const days = ["mon", "tue", "wed", "thu", "fri"];
const times = [2, 2, 2, 2, 1];
let settingData = {};

function loadPage(page) {
    fetch(page)
        .then(response => response.text())
        .then(data => {
            document.getElementById("content").innerHTML = data;
        })
        .catch(error => {
            console.error("페이지 로드 중 오류 발생:", error);
        });
}
function saveData() {
    days.forEach((day, index) => {
        settingData[day] = {};
        for (let i = 1; i <= times[index]; i++) {
            const inputId = `${day}${i}`;
            const inputElement = document.getElementById(inputId);
            if (inputElement) {
                settingData[day][i] = inputElement.value || "0";
            }
        }
    });

    document.cookie = `seatsData=${JSON.stringify(settingData)}; path=/; max-age=31536000`;
    console.log(document.cookie);
    alert("좌석 정보가 저장되었습니다.");
}
