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
            document.querySelectorAll("select").forEach(select => {
                select.innerHTML = createOptions();
                select.value = "0";
            });

            if (page === 'setting.html') loadScript('js/setting.js');
        })
        .catch(error => {
            console.error("페이지 로드 중 오류 발생:", error);
        });
}

// 외부 스크립트를 동적으로 로드
function loadScript(src) {
    const script = document.createElement("script");
    script.src = src;
    document.head.appendChild(script);
}
