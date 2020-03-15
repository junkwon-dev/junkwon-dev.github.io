const USER_LC = "currentLocation",
    SHOWING_CN = "showing";
const maskTable = document.querySelector("table"),
    form = document.querySelector(".js-form"),
    input = form.querySelector("input");

function getType(text) {
    if (text === '01') {
        return "약국";
    }
    else if (text === '02') {
        return "우체국";
    }
    else if (text === '03') {
        return "농협";
    }
    return "X"
}

function getRemain(text) {
    if (text === 'plenty') {
        return "100개 이상";
    }
    else if (text === 'some') {
        return "30개 이상 100개 미만";
    }
    else if (text === 'few') {
        return "2개 이상 30개 미만";
    }
    else if (text === 'empty') {
        return "없음";
    }
    else if (text === 'break') {
        return "판매 중지";
    }
    return "X"
}

function showMask(location) {
    fetch(`https://8oi9s0nnth.apigw.ntruss.com/corona19-masks/v1/storesByAddr/json?address=${location}`)
        .then(function (response) {
            return response.json();
        })
        .then(function (myJson) {
            const arr = myJson.stores;


            for (let i = 0; i < arr.length; i++) {
                const ch = document.createElement("tr");
                const ad = document.createElement("td");
                const whenSt = document.createElement("td");
                const whenCr = document.createElement("td");
                const st = document.createElement("td");
                const type = document.createElement("td");
                whenSt.innerText = arr[i].stock_at;
                whenCr.innerText = arr[i].created_at;
                ad.innerText = arr[i].addr;
                st.innerText = getRemain(arr[i].remain_stat);
                type.innerText=getType(arr[i].type);
                ch.appendChild(ad);
                ch.appendChild(type);
                ch.appendChild(whenCr);
                ch.appendChild(whenSt);
                ch.appendChild(st);
                maskTable.appendChild(ch);
            }

        });
    getLocation();
}

function saveLocation(text) {
    localStorage.setItem(USER_LC, text);
}

function handleSubmit(event) {
    const currentValue = input.value;
    saveLocation(currentValue);
    showMask(currentValue);
}

function getLocation() {
    form.classList.add(SHOWING_CN);
    form.addEventListener("submit", handleSubmit);
}

function whereIsMask() {
    const currentLocation = localStorage.getItem(USER_LC);
    if (currentLocation === null) {
        getLocation();
    }
    else {
        showMask(currentLocation);
    }
}

function init() {
    whereIsMask();
}
init();