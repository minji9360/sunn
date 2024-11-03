import { settingData } from './script.js';
import { applicantList } from './register.js';

const dayMapping = {
    "mon": "월",
    "tue": "화",
    "wed": "수",
    "thu": "목",
    "fri": "금"
};

export function applicantListInit() {
    renderApplicantTable();
}

function renderApplicantTable() {
    const savedSettingData = localStorage.getItem("settingData");
    const seatInfo = savedSettingData ? JSON.parse(savedSettingData) : {};
    const applicantTableBody = document.getElementById("applicantTableBody");

    if (!applicantTableBody) {
        console.error("applicantTableBody 요소를 찾을 수 없습니다.");
        return;
    }

    applicantTableBody.innerHTML = "";

    Object.keys(seatInfo).forEach(key => {
        let seatsRemaining = parseInt(seatInfo[key], 10);

        if (!seatsRemaining || isNaN(seatsRemaining)) {
            console.log(`잘못된 데이터 건너뜀: key=${key}, value=${seatInfo[key]}`);
            return;
        }

        const day = key.slice(0, 3);
        const timeNum = key.slice(3);
        const realTime = timeNum === "1" ? "17:30" : "19:30";
        const dayKorean = dayMapping[day];
        const timeBasedApplicants = applicantList.filter(applicant => applicant.timeInfo[key] !== undefined);
        const completedPaymentsCount = timeBasedApplicants.filter(applicant => applicant.timeInfo[key] === 2).length;

        seatsRemaining -= completedPaymentsCount;

        const createApplicantEntry = (list, status) => {
            return list.length > 0 ? list.map(applicant => {
                const paymentStartTime = applicant.timeInfo[key]?.paymentStartTime;
                const timeLeft = paymentStartTime ? calculateTimeLeft(paymentStartTime) : 0;
                const isTimeOver = status === 1 && timeLeft <= 0;
                const timeDisplay = status === 1
                    ? `<div style="color: ${isTimeOver ? 'gray' : 'red'}; font-size: small; padding-left: 20px;" id="timer-${applicant.id}-${key}">
                        ${isTimeOver ? '(시간초과)' : `남은 시간: ${formatTime(timeLeft)}`}
                       </div>`
                    : '';

                return `
                    <div>
                        <input type="checkbox" onclick="updateStatus('${applicant.id}', '${key}', this)" ${status === applicant.timeInfo[key] ? '' : 'checked'}>
                        <span>${applicant.name}</span>
                        <button class="delete-btn" onclick="removeEntry(this, '${applicant.id}', '${key}')">X</button>
                        ${timeDisplay}
                    </div>
                `;
            }).join('') : '없음';
        };

        const row = document.createElement("tr");
        row.innerHTML = `
            <td style="${seatsRemaining === 0 ? 'background-color: lightgray;' : ''}">${dayKorean}</td>
            <td style="${seatsRemaining === 0 ? 'background-color: lightgray;' : ''}">${realTime}</td>
            <td style="${seatsRemaining === 0 ? 'background-color: lightgray;' : ''}">${seatsRemaining}</td>
            <td style="text-align: left; ${seatsRemaining === 0 ? 'background-color: lightgray;' : ''}">
                ${createApplicantEntry(timeBasedApplicants.filter(applicant => applicant.timeInfo[key] === 0), 0)}
            </td>
            <td style="text-align: left; ${seatsRemaining === 0 ? 'background-color: lightgray;' : ''}">
                ${createApplicantEntry(timeBasedApplicants.filter(applicant => applicant.timeInfo[key] === 1), 1)}
            </td>
            <td style="text-align: left; ${seatsRemaining === 0 ? 'background-color: lightgray;' : ''}">
                ${createApplicantEntry(timeBasedApplicants.filter(applicant => applicant.timeInfo[key] === 2), 2)}
            </td>
        `;
        applicantTableBody.appendChild(row);
    });

    setInterval(updateTimers, 1000);
}

function updateTimers() {
    applicantList.forEach(applicant => {
        for (const key in applicant.timeInfo) {
            if (applicant.timeInfo[key] === 1) {
                const timeLeft = calculateTimeLeft(applicant.paymentStartTime);
                const timerElement = document.getElementById(`timer-${applicant.id}-${key}`);

                if (timerElement) {
                    if (timeLeft > 0) {
                        timerElement.textContent = `남은 시간: ${formatTime(timeLeft)}`;
                        timerElement.style.color = 'red';
                    } else {
                        timerElement.textContent = '(시간초과)';
                        timerElement.style.color = 'gray';
                    }
                }
            }
        }
    });
}

function updateStatus(applicantId, key, checkboxElement) {
    const applicantIndex = applicantList.findIndex(applicant => applicant.id === parseInt(applicantId, 10));

    const applicant = applicantList[applicantIndex];
    const originalStatus = applicant.timeInfo[key];
    const newStatus = (originalStatus + 1) % 3;

    const day = key.slice(0, 3);
    const timeNum = key.slice(3);
    const realTime = timeNum === "1" ? "17:30" : "19:30";
    const dayKorean = dayMapping[day];
    const name = applicant.name || "알 수 없음";

    if (applicantIndex === -1) {
        console.warn(`ID ${applicantId}에 해당하는 신청자를 찾을 수 없습니다.`);
        return;
    }

    if (originalStatus === 1 && newStatus === 2) {
        const savedSettingData = localStorage.getItem("settingData");
        const seatInfo = savedSettingData ? JSON.parse(savedSettingData) : {};
        let seatsRemaining = parseInt(seatInfo[key], 10);
        const completedPaymentsCount = applicantList.filter(applicant => applicant.timeInfo[key] === 2).length;

        seatsRemaining -= completedPaymentsCount;

        if (seatsRemaining <= 0) {
            alert(`${dayKorean}요일 ${realTime}이 마감되었습니다.`);
            checkboxElement.checked = false;
            return;
        }
    }

    if (originalStatus === 2 && newStatus === 0) {
        const confirmReset = confirm(`${dayKorean}요일 ${realTime}의 ${name} 신청자를 대기 상태로 변경하시겠습니까?`);

        if (!confirmReset) {
            checkboxElement.checked = false;
            return;
        }
    }

    if (newStatus === 1) {
        applicant.paymentStartTime = getCurrDateTime();
    }

    applicant.timeInfo[key] = newStatus;
    applicant.updatedAt = getCurrDateTime();
    localStorage.setItem("applicantList", JSON.stringify(applicantList));

    renderApplicantTable();
}

function calculateTimeLeft(startTime) {
    const start = new Date(startTime);
    const now = new Date();
    const diff = 10 * 60 * 1000 - (now - start);

    return diff > 0 ? diff : 0;
}

function formatTime(ms) {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);

    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
}

function getCurrDateTime() {
    return new Date().toISOString();
}

function removeEntry(button, applicantId, key) {
    const day = key.slice(0, 3);
    const timeNum = key.slice(3);
    const realTime = timeNum === "1" ? "17:30" : "19:30";
    const dayKorean = dayMapping[day];
    const applicant = applicantList.find(applicant => applicant.id === parseInt(applicantId, 10));
    const name = applicant ? applicant.name : "알 수 없음";
    const confirmRemove = confirm(`${dayKorean}요일 ${realTime}의 ${name} 신청자를 삭제하시겠습니까?`);

    if (confirmRemove) {
        const updatedApplicantList = applicantList.map(applicant => {
            if (applicant.id === parseInt(applicantId, 10)) {
                delete applicant.timeInfo[key];

                if (Object.keys(applicant.timeInfo).length === 0)
                    return null;
            }
            return applicant;
        }).filter(applicant => applicant !== null);

        localStorage.setItem("applicantList", JSON.stringify(updatedApplicantList));

        renderApplicantTable();
    } else {
        alert("취소되었습니다.");
    }
}

window.applicantListInit = applicantListInit;
window.removeEntry = removeEntry;
window.updateStatus = updateStatus;
