
const title=document.querySelector("#title");
const CLICkED_CLASS = "clicked";

function handleClick(){
    const hasClass=title.classList.contains(CLICkED_CLASS)
    if(!hasClass){
        title.classList.add(CLICkED_CLASS);
    }
    else{
        title.classList.remove(CLICkED_CLASS);
    }
}

function init(){
    title.addEventListener("click",handleClick);
}
init();