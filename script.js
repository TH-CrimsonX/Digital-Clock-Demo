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
const themeSelector = document.getElementById('themeSelector'); // อ้างอิงถึง Dropdown เลือกธีม

const thaiMonths = [
    "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
    "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม"
];

// กำหนดชุดสีสำหรับแต่ละธีม - ปรับค่าให้ทึบและนุ่มนวลขึ้น และพื้นหลังเป็นสีดำสนิท
const themeColors = {
    red: {
        '--theme-color-1': '#CC0000', /* แดงเข้ม ทึบ */
        '--theme-color-2': '#AA3939', /* แดงกลาง ทึบ */
        '--theme-color-3': '#800000', /* แดงอ่อน ทึบ */
        '--theme-highlight-color': '#CC0000', /* ไฮไลต์แดง */
        '--theme-hover-color': '#FF6666', /* แดงอ่อนลงเมื่อ hover */
        '--theme-glow-color': 'rgba(204, 0, 0, 0.4)', /* แสงเงาแดงนุ่ม */
        '--theme-message-box-shadow': 'rgba(170, 57, 57, 0.5)', /* เงากล่องข้อความแดง */
        '--theme-powered-by-color': '#CC3333', /* แดงสำหรับ Powered by */
        '--theme-crimson-x-gradient': 'linear-gradient(to right, #CC0000, #FF6666, #FFCC66, #FF6666, #CC0000)', /* Gradient แดงนุ่ม */
        '--body-bg-color': '#000000',
        '--theme-input-bg': '#1A1A1A',
        '--theme-input-border': '#444444',
        '--theme-text-color-light': '#F0F0F0'
    },
    blue: {
        '--theme-color-1': '#0000CC',
        '--theme-color-2': '#3939AA',
        '--theme-color-3': '#000080',
        '--theme-highlight-color': '#0000CC',
        '--theme-hover-color': '#6666FF',
        '--theme-glow-color': 'rgba(0, 0, 204, 0.4)',
        '--theme-message-box-shadow': 'rgba(57, 57, 170, 0.5)',
        '--theme-powered-by-color': '#3333CC',
        '--theme-crimson-x-gradient': 'linear-gradient(to right, #0000CC, #6666FF, #66CCFF, #6666FF, #0000CC)',
        '--body-bg-color': '#000000', /* ดำสนิท */
        '--theme-input-bg': '#1A1A33',
        '--theme-input-border': '#444455',
        '--theme-text-color-light': '#DDEEFF'
    },
    green: {
        '--theme-color-1': '#00CC00',
        '--theme-color-2': '#39AA39',
        '--theme-color-3': '#008000',
        '--theme-highlight-color': '#00CC00',
        '--theme-hover-color': '#66FF66',
        '--theme-glow-color': 'rgba(0, 204, 0, 0.4)',
        '--theme-message-box-shadow': 'rgba(57, 170, 57, 0.5)',
        '--theme-powered-by-color': '#33CC33',
        '--theme-crimson-x-gradient': 'linear-gradient(to right, #00CC00, #66FF66, #66FFCC, #66FF66, #00CC00)',
        '--body-bg-color': '#000000', /* ดำสนิท */
        '--theme-input-bg': '#1A331A',
        '--theme-input-border': '#445544',
        '--theme-text-color-light': '#EEFFEE'
    },
    purple: {
        '--theme-color-1': '#8A2BE2',
        '--theme-color-2': '#9370DB',
        '--theme-color-3': '#4B0082',
        '--theme-highlight-color': '#8A2BE2',
        '--theme-hover-color': '#BA55D3',
        '--theme-glow-color': 'rgba(138, 43, 226, 0.4)',
        '--theme-message-box-shadow': 'rgba(147, 112, 219, 0.5)',
        '--theme-powered-by-color': '#800080',
        '--theme-crimson-x-gradient': 'linear-gradient(to right, #8A2BE2, #9370DB, #BA55D3, #9370DB, #8A2BE2)',
        '--body-bg-color': '#000000', /* ดำสนิท */
        '--theme-input-bg': '#331A33',
        '--theme-input-border': '#553355',
        '--theme-text-color-light': '#FFEEFF'
    },
    orange: {
        '--theme-color-1': '#CC6600',
        '--theme-color-2': '#AA5500',
        '--theme-color-3': '#804000',
        '--theme-highlight-color': '#CC6600',
        '--theme-hover-color': '#FF9933',
        '--theme-glow-color': 'rgba(204, 102, 0, 0.4)',
        '--theme-message-box-shadow': 'rgba(170, 85, 0, 0.5)',
        '--theme-powered-by-color': '#CC7700',
        '--theme-crimson-x-gradient': 'linear-gradient(to right, #CC6600, #FF9933, #FFCC99, #FF9933, #CC6600)',
        '--body-bg-color': '#000000', /* ดำสนิท */
        '--theme-input-bg': '#33221A',
        '--theme-input-border': '#554433',
        '--theme-text-color-light': '#FFF8EE'
    },
    pink: {
        '--theme-color-1': '#FF69B4',
        '--theme-color-2': '#FF1493',
        '--theme-color-3': '#C71585',
        '--theme-highlight-color': '#FF69B4',
        '--theme-hover-color': '#FFC0CB',
        '--theme-glow-color': 'rgba(255, 105, 180, 0.4)',
        '--theme-message-box-shadow': 'rgba(255, 20, 147, 0.5)',
        '--theme-powered-by-color': '#FF3399',
        '--theme-crimson-x-gradient': 'linear-gradient(to right, #FF69B4, #FF1493, #FFC0CB, #FF1493, #FF69B4)',
        '--body-bg-color': '#000000', /* ดำสนิท */
        '--theme-input-bg': '#331A2A',
        '--theme-input-border': '#553344',
        '--theme-text-color-light': '#FFE8F8'
    },
    gold: {
        '--theme-color-1': '#CCAA00',
        '--theme-color-2': '#AA8800',
        '--theme-color-3': '#806600',
        '--theme-highlight-color': '#CCAA00',
        '--theme-hover-color': '#FFDD33',
        '--theme-glow-color': 'rgba(204, 170, 0, 0.4)',
        '--theme-message-box-shadow': 'rgba(170, 136, 0, 0.5)',
        '--theme-powered-by-color': '#CCBB00',
        '--theme-crimson-x-gradient': 'linear-gradient(to right, #CCAA00, #FFDD33, #FFFFCC, #FFDD33, #CCAA00)',
        '--body-bg-color': '#000000', /* ดำสนิท */
        '--theme-input-bg': '#33331A',
        '--theme-input-border': '#555533',
        '--theme-text-color-light': '#FFFFEE'
    },
    cyan: {
        '--theme-color-1': '#00CCCC',
        '--theme-color-2': '#33AAAA',
        '--theme-color-3': '#008080',
        '--theme-highlight-color': '#00CCCC',
        '--theme-hover-color': '#66FFFF',
        '--theme-glow-color': 'rgba(0, 204, 204, 0.4)',
        '--theme-message-box-shadow': 'rgba(51, 170, 170, 0.5)',
        '--theme-powered-by-color': '#33CCCC',
        '--theme-crimson-x-gradient': 'linear-gradient(to right, #00CCCC, #66FFFF, #99FFFF, #66FFFF, #00CCCC)',
        '--body-bg-color': '#000000', /* ดำสนิท */
        '--theme-input-bg': '#1A3333',
        '--theme-input-border': '#445555',
        '--theme-text-color-light': '#EEFFFF'
    }
};

// ฟังก์ชันสำหรับเปลี่ยนธีมสี
function applyTheme(themeName) {
    const root = document.documentElement; // เข้าถึง :root element ใน CSS
    const colors = themeColors[themeName];

    if (colors) {
        for (const prop in colors) {
            root.style.setProperty(prop, colors[prop]);
        }
    }
}

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
    applyTheme('red'); // กำหนดธีมเริ่มต้นเมื่อโหลดหน้าเว็บ
});