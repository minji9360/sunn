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

        const createApplicantEntry = (list) => {
            return list.length > 0 ? list.map(applicant => `
                <div>
                    <input type="checkbox">
                    <span>${applicant.name}</span>
                    <button class="delete-btn" onclick="removeEntry(this, '${applicant.id}')">X</button>
                </div>
            `).join('') : '없음';
        };

        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${dayKorean}</td>
            <td>${realTime}</td>
            <td>${seatsRemaining}</td>
            <td style="text-align: left">
                ${createApplicantEntry(timeBasedApplicants.filter(applicant => applicant.timeInfo[key] === 0))}
            </td>
            <td style="text-align: left">
                ${createApplicantEntry(timeBasedApplicants.filter(applicant => applicant.timeInfo[key] === 1))}
            </td>
            <td style="text-align: left">
                ${createApplicantEntry(timeBasedApplicants.filter(applicant => [2, 3].includes(applicant.timeInfo[key])))}
            </td>
        `;
        applicantTableBody.appendChild(row);
    });
}

function removeEntry(button, applicantId) {
    console.log(`삭제 버튼 클릭 - 신청자 ID: ${applicantId}`);
    // 삭제 로직 추가 필요
}

window.applicantListInit = applicantListInit;
window.removeEntry = removeEntry;
