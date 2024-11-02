import { settingData } from './script.js';

export let applicantId = parseInt(localStorage.getItem("applicantId")) || 0;
export let applicantList = [];
let selectedTimes = {};

export function registerInit() {
    initializeSeatSelection();
}

function initializeSeatSelection() {
    const savedData = localStorage.getItem("settingData");

    if (savedData)
        Object.assign(settingData, JSON.parse(savedData));

    const seatInfo = settingData;

    document.querySelectorAll("td[data-time]").forEach(cell => {
        const time = cell.getAttribute("data-time");

        if (!seatInfo[time]) {
            cell.classList.add("disabled");
            cell.classList.remove("clickable");
            cell.style.pointerEvents = "none";
        } else {
            cell.classList.remove("disabled");
            cell.classList.add("clickable");
            cell.style.pointerEvents = "";
            cell.addEventListener("click", () => {
                if (cell.classList.toggle("selected"))
                    selectedTimes[time] = true;
                else
                    delete selectedTimes[time];
            });
        }
    });
}

function register() {
    const name = document.getElementById("nameInput").value;

    if (!name) {
        alert("이름을 입력해주세요.");
        return;
    }

    if (Object.keys(selectedTimes).length === 0) {
        alert("시간을 선택해주세요.");
        return;
    }

    const registerData = {
        id: applicantId
        , name: name
        , timeInfo: selectedTimes
        , createdAt: getCurrDateTime()
        , updatedAt: getCurrDateTime()
    };

    applicantList.push(registerData);
    localStorage.setItem("applicantList", JSON.stringify(applicantList));

    alert(`${name}님 등록 완료`);

    applicantId += 1;
    localStorage.setItem("applicantId", applicantId);
}

function getCurrDateTime() {
    return new Date().toISOString();
}

window.registerInit = registerInit;
window.applicantId = applicantId;
window.register = register;
