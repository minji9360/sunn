const days = ["mon", "tue", "wed", "thu", "fri"];
const times = [2, 2, 2, 2, 1];
let settingData = {};

function loadInitialPage() {
    const cookies = document.cookie.split("; ");
    const reservationDataCookie = cookies.find(cookie => cookie.startsWith("reservationData="));

    if (reservationDataCookie)
        loadPage('register.html', document.querySelector(".menu button:nth-child(2)"));
    else
        loadPage('setting.html', document.querySelector(".menu button:nth-child(1)"));
}

function loadPage(page, buttonElement) {
    fetch(page)
        .then(response => response.text())
        .then(data => {
            document.getElementById("content").innerHTML = data;
            loadScript(`js/${page.replace('.html', '.js')}`);
            updateMenuSelection(buttonElement);
        })
        .catch(error => {
            console.error("페이지 로드 중 오류 발생:", error);
        });
}

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

function resetCookie() {
    const confirmReset = confirm("모든 데이터가 리셋됩니다. 진행하시겠습니까?");

    if (confirmReset) {
        document.cookie = "reservationData=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
        alert("쿠키가 리셋되었습니다.");

        loadInitialPage();
    } else {
        alert("리셋이 취소되었습니다.");
    }
}


window.onload = loadInitialPage;
