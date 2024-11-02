import { days, times, settingData } from './script.js';

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
    const savedData = localStorage.getItem("settingData");

    if (savedData) {
        const parsedData = JSON.parse(savedData);
        Object.assign(settingData, parsedData);

        days.forEach((day, index) => {
            for (let i = 1; i <= times[index]; i++) {
                const inputId = `${day}${i}`;
                const selectElement = document.getElementById(inputId);

                if (selectElement && parsedData[inputId] !== undefined)
                    selectElement.value = parsedData[inputId];
                else if (!selectElement)
                    console.warn(`해당 ID를 가진 요소가 없습니다: ${inputId}`);
            }
        });
    } else {
        console.log("저장된 데이터가 없습니다.");
    }
}

function saveSettingData() {
    let seatInfo = {};

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

    localStorage.setItem("settingData", JSON.stringify(seatInfo));

    alert("등록 가능 인원 정보가 저장되었습니다.");
}

window.settingInit = settingInit;
window.saveSettingData = saveSettingData;
