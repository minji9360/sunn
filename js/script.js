const days = ["mon", "tue", "wed", "thu", "fri"];
const times = [2, 2, 2, 2, 1];
let settingData = {};

function createOptions() {
    const options = [];
    for (let i = 0; i <= 10; i++) {
        options.push(`<option value="${i}">${i}</option>`);
    }
    return options.join("");
}

function loadPage(page) {
    fetch(page)
        .then(response => response.text())
        .then(data => {
            document.getElementById("content").innerHTML = data;

            // 화면 로드된 후 select 요소에 옵션 추가
            document.querySelectorAll("select").forEach(select => {
                select.innerHTML = createOptions();
                select.value = "0";
            });
        })
        .catch(error => {
            console.error("페이지 로드 중 오류 발생:", error);
        });
}

document.addEventListener("DOMContentLoaded", () => {
    // 필요한 이벤트 리스너 또는 초기화 코드 추가
});
