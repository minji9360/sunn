function saveSettingData() {
    days.forEach((day, index) => {
        settingData[day] = {};
        for (let i = 1; i <= times[index]; i++) {
            const inputId = `${day}${i}`;
            const inputElement = document.getElementById(inputId);
            if (inputElement) {
                settingData[day][i] = inputElement.value || "0";
            }
        }
    });

    document.cookie = `seatsData=${JSON.stringify(settingData)}; path=/; max-age=31536000`;
    console.log(document.cookie);
    alert("좌석 정보가 저장되었습니다.");
}