
const clockContainer = document.querySelector(".js-clock"),
    clockTitle = clockContainer.querySelector("h1");

function getTime(){
    const date = new Date();
    const hour= date.getHours();
    const minutes = date.getMinutes();
    const seconds= date.getSeconds();
    clockTitle.innerText=`${hour}:${minutes}:${
        seconds < 10 ? `0${seconds}` : seconds
    }`;
}

function init(){
    getTime();
    setInterval(getTime,1000);
}
init();