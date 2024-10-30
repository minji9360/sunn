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
            if (page === 'setting.html') loadScript('js/setting.js');

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

window.onload = loadInitialPage;
