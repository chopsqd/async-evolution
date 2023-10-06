import {showLog, clearLog} from './log'

//==========    BASE    ==========//
const BASE_URL = "https://api.slingacademy.com/v1/sample-data/users"

let loader = document.getElementById('loader')
let input = document.getElementById('username')
let list = document.getElementById('list')
let url = document.getElementById('url')
let reset = document.getElementById('reset')
let clear = document.getElementById('clear')

url.value = BASE_URL

function changeLoading(flag) {
    if(flag) {
        loader.style.display = 'block'   
    } else {
        loader.style.display = 'none'   
    }
}

function renderData(data) {
    list.innerHTML = ''
    if(data.length) {
        showLog('renderData', '[{}, {}, ...]', 'lime accent-3', 'show-users')
        data.map(user => {
            list.insertAdjacentHTML(
                'beforeend',
                `<div class="card" style="border-radius: 5">
                    <div class="card-content" style="display:flex;gap:20px">
                        <img width="100" src="${user.profile_picture}">
                        <div style="text-align:left">
                            <h5>${user.first_name} ${user.last_name}</h5>
                            <p>${user.email}</p>
                            <a href="${user.profile_picture}">Subscribe</a>
                        </div>
                    </div>
              </div>`
            )
        })
    } else {
        showLog('renderData', 'Пользователь не найден', 'lime darken-3', 'no-users')
        list.innerHTML = 'Пользователь не найден'
    }
}

//==========    CALLBACKS    ==========//
reset.addEventListener('click', () => url.value = BASE_URL)
clear.addEventListener('click', clearLog)
input.addEventListener('input', debounce(e => fetchData(e.target.value), 1000));
input.addEventListener('input', e => showLog('input.addEventListener', e.target.value, 'cyan accent-1', 'input'));

function debounce(func, timeout) {
    let timer;
    return function(...args) {
        clearTimeout(timer);
            timer = setTimeout(() => {
            func(...args);
        }, timeout);
    };
}

let lastSearchValue = ''
function distinct(search) {
    if(search !== lastSearchValue) {
        lastSearchValue = search
        return false
    } else return true
}

const fetchData = (search) => {
    if(distinct(search)) {
        showLog('distinct', 'lastSearchValue === search', 'red', 'distinct')
        return
    } 
    showLog('distinct', 'lastSearchValue !== search', 'light-green accent-3', 'distinct')

    const xhr = new XMLHttpRequest();

    xhr.onloadstart = function() {
        changeLoading(true)
    }
    
    console.log(url)
    xhr.open('GET', `${url.value}?search=${search}`)
    xhr.send();
    showLog('fetchData', search, 'green', 'to-server')
    showLog('fetchData', search, 'deep-purple', 'load-server')

    xhr.onloadend = function() {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          showLog('fetchData', search, 'green', 'from-server')

          renderData(response.users)
          changeLoading(false)
        } else {
            changeLoading(false)
            console.log(`Ошибка ${xhr.status}: ${JSON.parse(xhr.responseText).detail}`, xhr)
            showLog('fetchData', `Ошибка ${xhr.status}: ${JSON.parse(xhr.responseText).detail}`, 'red', 'err-res')
        }
    };

    xhr.onerror = function() {
        changeLoading(false)
        console.log('Запрос не удался')
        showLog('fetchData', 'Запрос не удался', 'red', 'err-req')
    }
}

