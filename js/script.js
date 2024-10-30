const days = ["mon", "tue", "wed", "thu", "fri"];
const times = [2, 2, 2, 2, 1];
let settingData = {};

function loadPage(page, buttonElement) {
    fetch(page)
        .then(response => response.text())
        .then(data => {
            document.getElementById("content").innerHTML = data;
            updateMenuSelection(buttonElement);

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

function updateMenuSelection(selectedButton) {
    const buttons = document.querySelectorAll(".menuBtn");
    buttons.forEach(button => {
        button.classList.remove("selected");
        button.classList.add("unselected");
    });

    selectedButton.classList.add("selected");
    selectedButton.classList.remove("unselected");
}
