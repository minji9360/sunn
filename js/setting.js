function createOptions() {
    const options = [];
    for (let i = 0; i <= 10; i++) {
        options.push(`<option value="${i}">${i}</option>`);
    }
    return options.join("");
}

function initializeSelectOptions() {
    document.querySelectorAll("select").forEach(select => {
        select.innerHTML = createOptions();
        select.value = "0";
    });
}

function loadSettingData() {
    const cookies = document.cookie.split("; ");
    const reservationDataCookie = cookies.find(cookie => cookie.startsWith("reservationData="));

    if (!reservationDataCookie) {
        console.log("저장된 데이터가 없습니다.");
        return;
    }

    const reservationData = JSON.parse(decodeURIComponent(reservationDataCookie.split("=")[1]));
    const seatInfo = reservationData.seatInfo;

    for (const inputId in seatInfo) {
        const selectElement = document.getElementById(inputId);
        if (selectElement) {
            selectElement.value = seatInfo[inputId];
            console.log(`설정: ${inputId} = ${seatInfo[inputId]}`);
        } else {
            console.warn(`해당 ID를 가진 요소가 없습니다: ${inputId}`);
        }
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

    document.cookie = `reservationData=${encodeURIComponent(JSON.stringify(dataToSave))}; path=/; max-age=31536000`;

    alert("좌석 정보가 저장되었습니다.");
}

initializeSelectOptions();
loadSettingData();