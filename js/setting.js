import { days, times } from './script.js';

export function settingInit() {
    initializeSelectOptions();
    loadSettingData();
}

function initializeSelectOptions() {
    document.querySelectorAll("select").forEach(select => {
        select.innerHTML = createOptions();
        select.value = "0";
    });
}

function createOptions() {
    const options = [];

    for (let i = 0; i <= 10; i++) {
        options.push(`<option value="${i}">${i}</option>`);
    }

    return options.join("");
}

function loadSettingData() {
    const reservationData = localStorage.getItem("reservationData");

    if (!reservationData) {
        console.log("저장된 데이터가 없습니다.");
        return;
    }

    const parsedData = JSON.parse(reservationData);
    const seatInfo = parsedData.seatInfo;

    for (const inputId in seatInfo) {
        const selectElement = document.getElementById(inputId);

        if (selectElement) selectElement.value = seatInfo[inputId];
        else console.warn(`해당 ID를 가진 요소가 없습니다: ${inputId}`);
    }

    console.log("데이터가 화면에 로드되었습니다.");
}

function saveSettingData() {
    let seatInfo = {};
    let settingData = {};

    days.forEach((day, index) => {
        settingData[day] = {};

        for (let i = 1; i <= times[index]; i++) {
            const inputId = `${day}${i}`;
            const inputElement = document.getElementById(inputId);

            if (inputElement) {
                const value = inputElement.value || "0";
                settingData[day][i] = value;

                if (value !== "0") seatInfo[inputId] = value;
            }
        }
    });

    const dataToSave = {
        seatsData: settingData,
        seatInfo: seatInfo
    };

    localStorage.setItem("reservationData", JSON.stringify(dataToSave));
    alert("등록 가능 인원 정보가 저장되었습니다.");
    console.log("등록 가능 인원 정보가 localStorage에 저장되었습니다:", dataToSave);
}

window.settingInit = settingInit;
window.saveSettingData = saveSettingData;
