import { NoticeList } from './noticeList.js';

const URL_API = './avisosDia.json';

////// FETCHING DATA //////
// Fetch JSON archive
async function fetchJsonNotices(jsonNotices) {
    const response = await fetch(jsonNotices);
    const infos = await response.json();
    return infos;
}
const response = await fetchJsonNotices(URL_API)

// Create the list of notices
let noticeList = new NoticeList(response);

// UPDATE the list of notices
// Fetch JSON archive each 30s to update 'noticeList'
setInterval(() => {
    fetchJsonNotices(URL_API)
    .then(resp => noticeList.mergeJsonNotices(resp));
}, 3000);


////// Load Pages //////
// Switch pages
const horariosPage = document.querySelector("#horarios");
const avisosPage = document.querySelector("#notices");

setInterval(() => {
    // console.log('aviso: ' + (new Date()).getSeconds()); //Apenas para debug

    loadInfos(noticeList.getNextFiveNotices());

    horariosPage.classList.add("hidden");
    avisosPage.classList.remove("hidden");

    // setTimeout(switchPage, noticesShown[0].duration*100);
}, 1000); // Intervalo de tempo definido para page horários de 40s, no max.

/*
    Troca da página de avisos para paǵina de horários 
*/
function switchPage(){
    // console.log('horarios: ' + (new Date()).getSeconds()); //Apenas para debug

    horariosPage.classList.remove("hidden");
    avisosPage.classList.add("hidden");
}

/*
    Carrega informações na página de avisos
*/
function loadInfos(notices){
    const firstNotice = notices[0];
    loadFirstNotice(firstNotice);

    const sidebarNotices = notices.slice(1);
    loadSidebarNotices(sidebarNotices);
}


//// DEBUG: Retirar setAtribute('src', ...) # Muito feio
// Load main notice
function loadFirstNotice(firstNotice) {
    let noticeType;
    if (firstNotice.type == 1) {
        noticeType = 'warning'
        document.querySelector('#main-image').setAttribute('src', "./img/avisos/notice-icon.png")
    } else if(firstNotice.type == 2) {
        noticeType = 'information'
        document.querySelector('#main-image').setAttribute('src', "./img/avisos/info-icon.png")
    } else if(firstNotice.type == 3) {
        noticeType = 'event'
        document.querySelector('#main-image').setAttribute('src', "./img/avisos/event-icon.png")
    }
    
    // Modifies the entire main-board according to the type
    let elMainBoard = document.querySelector('.main-board');
    elMainBoard.classList.remove('warning');
    elMainBoard.classList.remove('information');
    elMainBoard.classList.remove('event');
    elMainBoard.classList.add(noticeType);

    // Load main-notice fields with the firstNotice atributes
    document.querySelector('#sender').textContent = firstNotice.sender;
    document.querySelector('#subject-h2').textContent = firstNotice.title;
    document.querySelector('#text-notice-p').textContent = firstNotice.content;
    document.querySelector('#post-timestamp').textContent = firstNotice.timestamp;
}

// Load left-board with four notices
function loadSidebarNotices(sidebarNotices) {
    // Get the 'ul' element on the left-board
    const elNoticesList = document.querySelector('.left-board__content');

    // Clean the content inside this 'ul' element
    elNoticesList.innerHTML = ""

    // Append all 'left-board' notices to the 'ul' element
    sidebarNotices.forEach(notice => {
        const elNotice = document.createElement('li');
        const elNoticeImg = document.createElement('img');
        const elNoticeSpan = document.createElement('span');
        const elNoticeTitle = document.createElement('p');

        // console.log(notice.type);
        if (notice.type == 1) {
            elNoticeImg.setAttribute('src', "./img/avisos/notice-icon.png")
            elNotice.classList.add("message-warning");
        } else if (notice.type == 2) {
            elNoticeImg.setAttribute('src', "./img/avisos/info-icon.png")
            elNotice.classList.add("message-information");
        } else {
            elNoticeImg.setAttribute('src', "./img/avisos/event-icon.png")
            elNotice.classList.add("message-event");
        }
        elNoticeTitle.textContent = notice.title;

        elNoticeSpan.appendChild(elNoticeTitle);
        elNotice.appendChild(elNoticeImg);
        elNotice.appendChild(elNoticeSpan);
        elNoticesList.appendChild(elNotice);

        elNotice.classList.add("message");
        elNoticeSpan.classList = "message_text";
    })
}

// Update header date and time
function updateCurrentDate() {
    const time = new Date();

    const formatTime = (time) => {
        return (time < 10) ? "0" + time : time;
    }

    // Format the date as "DD/MM/YYYY - HH:MM"
    let formattedDate = formatTime(time.getDate()) + '/' + 
                        formatTime(time.getMonth() +1) + '/' + 
                        time.getFullYear() + ' - ' + 
                        formatTime(time.getHours()) + ':' + 
                        formatTime(time.getMinutes());

    // Update the content of the element with id="currentDate"
    let elDateAndTime = document.querySelector('header .header__content__time p');
    elDateAndTime.textContent = formattedDate;
}

// Call the function initially
updateCurrentDate();

// Update the current date and time every 5 seconds
setInterval(updateCurrentDate, 5000);