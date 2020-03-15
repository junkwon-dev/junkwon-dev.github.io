const USER_LC = "currentLocation",
    SHOWING_CN="showing";
const maskTable = document.querySelector("table"),
    form=document.querySelector(".js-form"),
    input=form.querySelector("input");



function showMask(location){
    fetch(`https://8oi9s0nnth.apigw.ntruss.com/corona19-masks/v1/storesByAddr/json?address=${location}`)
  .then(function(response) {
    return response.json();
  })
  .then(function(myJson) {
      const arr= myJson.stores;
      
      
      for(let i=0;i<arr.length;i++){
        const ch=document.createElement("tr");
        const ad=document.createElement("td");
        const whenSt=document.createElement("td");
        const whenCr=document.createElement("td");
        const st=document.createElement("td");
        whenSt.innerText=arr[i].stock_at;
        whenCr.innerText=arr[i].created_at;
        ad.innerText=arr[i].addr;
        st.innerText=arr[i].remain_stat;
        ch.appendChild(ad);
        ch.appendChild(whenCr);
        ch.appendChild(whenSt);
        ch.appendChild(st);
        maskTable.appendChild(ch);
      }
      
  });
  getLocation();
}

function saveLocation(text){
    localStorage.setItem(USER_LC,text);
}

function handleSubmit(event){
    const currentValue = input.value;
    saveLocation(currentValue);
    showMask(currentValue);
}

function getLocation(){
    form.classList.add(SHOWING_CN);
    form.addEventListener("submit",handleSubmit);
}

function whereIsMask(){
    const currentLocation = localStorage.getItem(USER_LC);
    if(currentLocation === null){
        getLocation();
    }
    else{
        showMask(currentLocation);
    }
}

function init(){
    whereIsMask();
}
init();