const display = document.getElementById('clock');
const audio = new Audio('sounds/TheCrimsonX - Crimson Metal Gaming.mp3');
audio.loop = true;
let alarmTime = null;
let alarmTimeout = null;
let countdownInterval = null; // สำหรับเก็บ ID ของ setInterval การนับถอยหลัง

// อ้างอิงถึง element ใหม่ (สำหรับควบคุมการแสดงผลของนาฬิกาปลุก)
const alarmControls = document.getElementById('alarmControls');
const toggleAlarmSetupBtn = document.getElementById('toggleAlarmSetupBtn');
const cancelAlarmSetupBtn = document.getElementById('cancelAlarmSetupBtn');
const alarmInput = document.querySelector('#alarmControls input[type="datetime-local"]'); // อ้างอิงถึง input เพื่อรีเซ็ตค่า
const countdownDisplay = document.getElementById('countdownDisplay'); // อ้างอิงถึงพื้นที่แสดงการนับถอยหลัง
const mainClearAlarmBtn = document.getElementById('mainClearAlarmBtn'); // อ้างอิงถึงปุ่มปิดนาฬิกาปลุกบนหน้าแรก

function updateTime() {
    // ฟังก์ชันสำหรับอัปเดตเวลาบนหน้าจอ
    const date = new Date();

    const hour = formatTime(date.getHours());
    const minutes = formatTime(date.getMinutes());
    const seconds = formatTime(date.getSeconds());

    display.innerText=`${hour} : ${minutes} : ${seconds}`
}

function formatTime(time) {
    // ฟังก์ชันช่วยสำหรับจัดรูปแบบเวลาให้มีเลข 0 นำหน้า (เช่น 05 แทน 5)
    if ( time < 10 ) {
        return '0' + time;
    }
    return time;
}

function setAlarmTime(value) {
    // ตั้งค่าเวลาที่จะปลุก
    alarmTime = value;
}

// ฟังก์ชันสำหรับสลับการแสดงผลของกลุ่มควบคุมการตั้งปลุก
function toggleAlarmControls() {
    if (alarmControls.style.display === 'none' || alarmControls.style.display === '') {
        alarmControls.style.display = 'block'; // แสดงกลุ่มควบคุม
        toggleAlarmSetupBtn.style.display = 'none'; // ซ่อนปุ่ม "ตั้งค่า"
        countdownDisplay.innerText = ''; // ล้างข้อความนับถอยหลังเมื่อเปิดแผงตั้งค่า (เผื่อมีค้างอยู่)
    } else {
        alarmControls.style.display = 'none'; // ซ่อนกลุ่มควบคุม
        toggleAlarmSetupBtn.style.display = 'block'; // แสดงปุ่ม "ตั้งค่า"
        alarmInput.value = ''; // ล้างค่าใน input field
        // ไม่ต้องล้าง alarmTime ที่นี่ เพราะอาจมี alarm ที่ถูกตั้งไว้แล้ว
    }
}

function startCountdown() {
    // เริ่มต้นการนับถอยหลัง
    stopCountdown(); // หยุดการนับถอยหลังเดิม (ถ้ามี) ก่อนเริ่มใหม่
    updateCountdown(); // อัปเดตการนับถอยหลังทันที
    countdownInterval = setInterval(updateCountdown, 1000); // ตั้งค่าให้เรียก updateCountdown ทุก 1 วินาที
}

function stopCountdown() {
    // หยุดการนับถอยหลังและล้างข้อความ
    clearInterval(countdownInterval);
    countdownInterval = null;
    countdownDisplay.innerText = '';
}

function updateCountdown() {
    // อัปเดตข้อความการนับถอยหลัง
    if (!alarmTime) {
        stopCountdown();
        return;
    }

    const timeToAlarm = new Date(alarmTime).getTime();
    const currentTime = new Date().getTime();
    const timeRemaining = timeToAlarm - currentTime;

    if (timeRemaining <= 0) {
        stopCountdown();
        countdownDisplay.innerText = 'ปลุกแล้ว!'; // หรือข้อความอื่นๆ เมื่อถึงเวลาปลุก
        // ตรวจสอบว่าเสียงปลุกกำลังเล่นอยู่หรือไม่ หากไม่ ให้หยุดการแสดงข้อความ "ปลุกแล้ว!" หลังจากการกดปิด
        if (audio.paused) {
             countdownDisplay.innerText = ''; // ล้างข้อความเมื่อเสียงหยุดแล้ว
        }
        return;
    }

    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

    let countdownText = 'นาฬิกาปลุกได้ถูกตั้งค่าแล้ว เหลือเวลาอีก '; // แก้ไขข้อความที่นี่
    if (days > 0) {
        countdownText += `${days} วัน `;
    }
    countdownText += `${formatTime(hours)}:${formatTime(minutes)}:${formatTime(seconds)}`;
    
    countdownDisplay.innerText = countdownText;
}


function setAlarm() {
    // ฟังก์ชันสำหรับตั้งนาฬิกาปลุก
    if(alarmTime) {
        const current = new Date();
        const timeToAlarm = new Date(alarmTime);

        if (timeToAlarm > current) {
            const timeout = timeToAlarm.getTime() - current.getTime();
            alarmTimeout = setTimeout(() => {
                audio.play();
                stopCountdown(); // หยุดการนับถอยหลังเมื่อเสียงปลุกดัง
                mainClearAlarmBtn.style.display = 'block'; // แสดงปุ่มปิดนาฬิกาปลุกเมื่อเสียงดัง
            }, timeout);
            
            startCountdown(); // เริ่มนับถอยหลังก่อน
            alert('ตั้งปลุก เรียบร้อย'); // การแจ้งเตือน
            toggleAlarmControls(); // แล้วค่อยซ่อนกลุ่มควบคุม
            mainClearAlarmBtn.style.display = 'block'; // แสดงปุ่มปิดนาฬิกาปลุกบนหน้าแรก
        } else {
            alert('ไม่สามารถตั้งปลุกในอดีตได้ กรุณาเลือกเวลาในอนาคต'); // การแจ้งเตือน
        }
    } else {
        alert('กรุณาเลือกเวลาที่จะตั้งปลุกก่อน'); // กรณีที่ผู้ใช้กดตั้งปลุกโดยไม่ได้เลือกเวลา
    }
}

function clearAlarm() {
    // ฟังก์ชันสำหรับยกเลิกนาฬิกาปลุก
    audio.pause(); // หยุดเสียงปลุก
    if (alarmTimeout) {
        clearTimeout(alarmTimeout); // ยกเลิก setTimeout
        alert('เคลียข้อมูลนาฬิกาปลุก เรียบร้อย'); // การแจ้งเตือน
        alarmTimeout = null; // ล้างค่า alarmTimeout
    } else {
        alert('ไม่มีนาฬิกาปลุกที่ตั้งไว้'); // กรณีที่ไม่มีปลุกให้เคลียร์
    }
    stopCountdown(); // หยุดการนับถอยหลัง
    // ไม่ต้องเรียก toggleAlarmControls() ที่นี่ เพราะปุ่มนี้อยู่บนหน้าหลัก ไม่ใช่ในแผงตั้งค่า
    mainClearAlarmBtn.style.display = 'none'; // ซ่อนปุ่มปิดนาฬิกาปลุกบนหน้าแรก
    alarmTime = null; // ล้างค่า alarmTime
}

// เพิ่ม Event Listener ให้ปุ่ม
toggleAlarmSetupBtn.addEventListener('click', toggleAlarmControls); // เมื่อคลิกปุ่ม "ตั้งค่า" จะแสดงกลุ่มควบคุม
cancelAlarmSetupBtn.addEventListener('click', () => {
    // เมื่อคลิกปุ่ม "ยกเลิก" จะซ่อนกลุ่มควบคุมและล้างค่า
    toggleAlarmControls(); 
    alarmTime = null; // ล้างค่า alarmTime เมื่อยกเลิก
    stopCountdown(); // หยุดการนับถอยหลังเมื่อยกเลิก
    // ไม่ต้องซ่อน mainClearAlarmBtn ที่นี่ เพราะมันอาจถูกซ่อนไปแล้วโดย clearAlarm หรือไม่เคยแสดงอยู่แล้ว
});

// เพิ่ม Event Listener ให้ปุ่มปิดนาฬิกาปลุกบนหน้าแรก
mainClearAlarmBtn.addEventListener('click', clearAlarm);

// เริ่มต้นอัปเดตเวลาทุกๆ 1 วินาที
setInterval(updateTime, 1000);

// ซ่อนปุ่มปิดนาฬิกาปลุกเมื่อโหลดหน้าครั้งแรก
document.addEventListener('DOMContentLoaded', () => {
    mainClearAlarmBtn.style.display = 'none';
});
