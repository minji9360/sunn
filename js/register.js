import { days, settingData } from './script.js';
export let applicantId = parseInt(localStorage.getItem("applicantId")) || 0;
let selectedTimes = {};

export function registerInit() {
    initializeSeatSelection();
}

function loadSeatInfoFromCookie() {
    const cookies = document.cookie.split("; ");
    const reservationDataCookie = cookies.find(cookie => cookie.startsWith("reservationData="));
    if (!reservationDataCookie) {
        console.warn("저장된 seatInfo 데이터가 없습니다.");
        return {};
    }

    const reservationData = JSON.parse(decodeURIComponent(reservationDataCookie.split("=")[1]));
    return reservationData.seatInfo || {};
}

function initializeSeatSelection() {
    const seatInfo = loadSeatInfoFromCookie();

    document.querySelectorAll("td[data-time]").forEach(cell => {
        const time = cell.getAttribute("data-time");

        if (!seatInfo[time]) {
            cell.classList.add("disabled");
            cell.style.pointerEvents = "none";
        } else {
            cell.classList.remove("disabled");
            cell.style.pointerEvents = "";
            cell.addEventListener("click", () => {
                if (cell.classList.toggle("selected")) {
                    selectedTimes[time] = true;
                } else {
                    delete selectedTimes[time];
                }
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

    const selectedList = Object.keys(selectedTimes).join(", ");
    alert(`${name}님 등록 완료`);

    applicantId += 1;
    localStorage.setItem("applicantId", applicantId);
}

// 전역에 등록
window.registerInit = registerInit;
window.applicantId = applicantId;
window.register = register;
