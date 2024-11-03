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
        const seatsRemaining = parseInt(seatInfo[key], 10);

        if (!seatsRemaining || isNaN(seatsRemaining)) {
            console.log(`잘못된 데이터 건너뜀: key=${key}, value=${seatInfo[key]}`);
            return;
        }

        const day = key.slice(0, 3);
        const timeNum = key.slice(3);
        const realTime = timeNum === "1" ? "17:30" : "19:30";
        const dayKorean = dayMapping[day];
        const timeBasedApplicants = applicantList.filter(applicant => applicant.timeInfo[key] !== undefined);

        const createApplicantEntry = (list, status) => {
            return list.length > 0 ? list.map(applicant => `
                <div>
                    <input type="checkbox" onclick="updateStatus('${applicant.id}', '${key}', this)" ${status === applicant.timeInfo[key] ? '' : 'checked'}>
                    <span>${applicant.name}</span>
                    <button class="delete-btn" onclick="removeEntry(this, '${applicant.id}', '${key}')">X</button>
                </div>
            `).join('') : '없음';
        };

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${dayKorean}</td>
            <td>${realTime}</td>
            <td>${seatsRemaining}</td>
            <td style="text-align: left">
                ${createApplicantEntry(timeBasedApplicants.filter(applicant => applicant.timeInfo[key] === 0), 0)}
            </td>
            <td style="text-align: left">
                ${createApplicantEntry(timeBasedApplicants.filter(applicant => applicant.timeInfo[key] === 1), 1)}
            </td>
            <td style="text-align: left">
                ${createApplicantEntry(timeBasedApplicants.filter(applicant => applicant.timeInfo[key] === 2), 2)}
            </td>
        `;
        applicantTableBody.appendChild(row);
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

    if (originalStatus === 2 && newStatus === 0) {
        const confirmReset = confirm(`${dayKorean}요일 ${realTime}의 ${name} 신청자를 대기 상태로 변경하시겠습니까?`);

        if (!confirmReset) {
            checkboxElement.checked = false;
            return;
        }
    }

    applicant.timeInfo[key] = newStatus;
    applicant.updatedAt = getCurrDateTime();
    localStorage.setItem("applicantList", JSON.stringify(applicantList));

    renderApplicantTable();
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
