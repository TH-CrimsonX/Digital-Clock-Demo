const display = document.getElementById('clock');
const audio = new Audio('sounds/TheCrimsonX - Crimson Metal Gaming.mp3');
audio.loop = true;
let alarmTime = null;
let alarmTimeout = null;
let countdownInterval = null;

const alarmControls = document.getElementById('alarmControls');
const toggleAlarmSetupBtn = document.getElementById('toggleAlarmSetupBtn');
const cancelAlarmSetupBtn = document.getElementById('cancelAlarmSetupBtn');
const alarmInput = document.querySelector('#alarmControls input[type="datetime-local"]');
const countdownDisplay = document.getElementById('countdownDisplay');
const mainClearAlarmBtn = document.getElementById('mainClearAlarmBtn');

const thaiMonths = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
    "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
];

function updateTime() {
    const date = new Date();

    const hour = formatTime(date.getHours());
    const minutes = formatTime(date.getMinutes());
    const seconds = formatTime(date.getSeconds());

    display.innerText=`${hour} : ${minutes} : ${seconds}`
}

function formatTime(time) {
    if ( time < 10 ) {
        return '0' + time;
    }
    return time;
}

function setAlarmTime(value) {
    alarmTime = value;
}

function toggleAlarmControls() {
    if (alarmControls.style.display === 'none' || alarmControls.style.display === '') {
        alarmControls.style.display = 'block';
        toggleAlarmSetupBtn.style.display = 'none';
    } else {
        alarmControls.style.display = 'none';
        toggleAlarmSetupBtn.style.display = 'block';
        alarmInput.value = '';
    }
}

function startCountdown() {
    stopCountdown();
    updateCountdown();
    countdownInterval = setInterval(updateCountdown, 1000);
}

function stopCountdown() {
    clearInterval(countdownInterval);
    countdownInterval = null;
    countdownDisplay.innerText = '';
}

function updateCountdown() {
    if (!alarmTime) {
        stopCountdown();
        return;
    }

    const timeToAlarm = new Date(alarmTime).getTime();
    const currentTime = new Date().getTime();
    const timeRemaining = timeToAlarm - currentTime;

    const alarmDate = new Date(alarmTime);
    const alarmHour = formatTime(alarmDate.getHours());
    const alarmMinute = formatTime(alarmDate.getMinutes());
    const alarmSecond = formatTime(alarmDate.getSeconds());
    const formattedAlarmTime = `${alarmHour}:${alarmMinute}:${alarmSecond}`;

    const alarmDay = alarmDate.getDate();
    const alarmMonth = thaiMonths[alarmDate.getMonth()];
    const alarmYear = alarmDate.getFullYear();

    if (timeRemaining <= 0) {
        stopCountdown();
        if (audio.paused) {
             countdownDisplay.innerHTML = '';
        } else {
            countdownDisplay.innerHTML = 'ปลุกแล้ว!';
        }
        return;
    }

    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

    let countdownText = `นาฬิกาปลุกได้ถูกตั้งค่าไว้แล้วที่ ${alarmDay} ${alarmMonth} ${alarmYear} เวลา ${formattedAlarmTime}<br>`;
    let remainingTimePart = '';
    if (days > 0) {
        remainingTimePart += `${days} วัน `;
    }
    remainingTimePart += `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`;
    
    countdownText += `เหลือเวลาอีก ${remainingTimePart} นาฬิกาปลุกจะทำงาน`;
    
    countdownDisplay.innerHTML = countdownText;
}


function setAlarm() {
    if(alarmTime) {
        const current = new Date();
        const timeToAlarm = new Date(alarmTime);

        if (timeToAlarm > current) {
            const timeout = timeToAlarm.getTime() - current.getTime();
            alarmTimeout = setTimeout(() => {
                audio.play();
                stopCountdown();
                mainClearAlarmBtn.style.display = 'block';
                countdownDisplay.innerHTML = 'ปลุกแล้ว!'; 
            }, timeout);
            
            startCountdown();
            const messageBox = document.createElement('div');
            messageBox.innerText = 'ตั้งปลุก เรียบร้อย';
            messageBox.classList.add('custom-message-box');
            document.body.appendChild(messageBox);
            setTimeout(() => {
                document.body.removeChild(messageBox);
            }, 2000);

            toggleAlarmControls();
            mainClearAlarmBtn.style.display = 'block';
        } else {
            const messageBox = document.createElement('div');
            messageBox.innerText = 'ไม่สามารถตั้งปลุกในอดีตได้ กรุณาเลือกเวลาในอนาคต';
            messageBox.classList.add('custom-message-box');
            document.body.appendChild(messageBox);
            setTimeout(() => {
                document.body.removeChild(messageBox);
            }, 3000);
        }
    } else {
        const messageBox = document.createElement('div');
        messageBox.innerText = 'กรุณาเลือกเวลาที่จะตั้งปลุกก่อน';
        messageBox.classList.add('custom-message-box');
        document.body.appendChild(messageBox);
        setTimeout(() => {
            document.body.removeChild(messageBox);
        }, 2000);
    }
}

function clearAlarm() {
    audio.pause();
    if (alarmTimeout) {
        clearTimeout(alarmTimeout);
        const messageBox = document.createElement('div');
        messageBox.innerText = 'เคลียข้อมูลนาฬิกาปลุก เรียบร้อย';
        messageBox.classList.add('custom-message-box');
        document.body.appendChild(messageBox);
        setTimeout(() => {
            document.body.removeChild(messageBox);
        }, 2000);

        alarmTimeout = null;
    } else {
        const messageBox = document.createElement('div');
        messageBox.innerText = 'ไม่มีนาฬิกาปลุกที่ตั้งไว้';
        messageBox.classList.add('custom-message-box');
        document.body.appendChild(messageBox);
        setTimeout(() => {
            document.body.removeChild(messageBox);
        }, 2000);
    }
    stopCountdown();
    mainClearAlarmBtn.style.display = 'none';
    alarmTime = null;
}

toggleAlarmSetupBtn.addEventListener('click', toggleAlarmControls);
cancelAlarmSetupBtn.addEventListener('click', () => {
    toggleAlarmControls();
});

mainClearAlarmBtn.addEventListener('click', clearAlarm);

setInterval(updateTime, 1000);

document.addEventListener('DOMContentLoaded', () => {
    mainClearAlarmBtn.style.display = 'none';
});