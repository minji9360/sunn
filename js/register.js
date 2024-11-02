import { settingData } from './script.js';

export let applicantId = parseInt(localStorage.getItem("applicantId")) || 0;
export let applicantList = JSON.parse(localStorage.getItem("applicantList")) || [];
let selectedTimes = {};
let isListenerAdded = false;
let isRegistering = false;
let isComposing = false;

export function registerInit() {
    const inputElement = document.getElementById("nameInput");

    initializeSeatSelection();

    if (inputElement && !isListenerAdded) {
        inputElement.addEventListener("compositionstart", () => {
            isComposing = true;
        });

        inputElement.addEventListener("compositionend", () => {
            isComposing = false;
        });

        inputElement.addEventListener("keydown", (event) => {
            if (event.key === 'Enter' && !isRegistering && !isComposing) {
                register();
            }
        });

        isListenerAdded = true;
    } else if (!inputElement) {
        console.error("nameInput 요소를 찾을 수 없습니다.");
    }
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
                    selectedTimes[time] = 0;
                else
                    delete selectedTimes[time];
            });
        }
    });
}

function register() {
    const name = document.getElementById("nameInput").value;

    if (isRegistering) {
        console.log("중복 호출 방지: register 함수가 이미 실행 중입니다.");
        return;
    }

    isRegistering = true;

    if (!name) {
        alert("이름을 입력해주세요.");
        isRegistering = false;
        return;
    }

    if (Object.keys(selectedTimes).length === 0) {
        alert("시간을 선택해주세요.");
        isRegistering = false;
        return;
    }

    const registerData = {
        id: applicantId
        , name: name
        , timeInfo: { ...selectedTimes }
        , createdAt: getCurrDateTime()
        , updatedAt: getCurrDateTime()
    };

    applicantList.push(registerData);
    localStorage.setItem("applicantList", JSON.stringify(applicantList));

    alert(`${name}님 등록 완료`);

    applicantId += 1;
    localStorage.setItem("applicantId", applicantId);

    selectedTimes = {};
    document.querySelectorAll("td[data-time].selected").forEach(cell => {
        cell.classList.remove("selected");
    });

    isRegistering = false;
}

function getCurrDateTime() {
    return new Date().toISOString();
}

window.registerInit = registerInit;
window.applicantId = applicantId;
window.register = register;
