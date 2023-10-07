import {showLog, clearLog} from './utils/log'

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

const getByXhr = (search) => {
    if(distinct(search)) {
        showLog('distinct', 'lastSearchValue === search', 'red', 'distinct')
        return
    } 
    showLog('distinct', 'lastSearchValue !== search', 'light-green accent-3', 'distinct')

    const xhr = new XMLHttpRequest();

    xhr.onloadstart = function() {
        changeLoading(true)
    }
    
    xhr.open('GET', `${url.value}?search=${search}`)
    xhr.send();
    showLog('xhr.send()', search, 'green', 'to-server')
    showLog('DATABASE', search, 'deep-purple', 'load-server')

    xhr.onloadend = function() {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          showLog('xhr.onloadend', 'xhr.status === 200', 'green', 'from-server')

          renderData(response.users)
        } else {
            showLog('xhr.onloadend', 'xhr.status !== 200', 'red', 'err-res')
        }
        changeLoading(false)
    };

    xhr.onerror = function() {
        changeLoading(false)
        showLog('xhr.onerror', 'Запрос не удался', 'red', 'err-req')
    }
}

const getByFetch = (search) => {
    if(distinct(search)) {
        showLog('distinct', 'lastSearchValue === search', 'red', 'distinct')
        return
    } 
    showLog('distinct', 'lastSearchValue !== search', 'light-green accent-3', 'distinct')

    showLog('fetch', search, 'green', 'to-server')
    showLog('DATABASE', search, 'deep-purple', 'load-server') 
    fetch(`${url.value}?search=${search}`)
        .then(res => {
            if (res.status === 200) {
                showLog('then(res)', 'res.status === 200', 'green', 'from-server')
                return res.json();
            } else {
                showLog('then(res)', 'res.status !== 200', 'red', 'err-res')
                throw new Error(`Ошибка ${res.status}`);
            }
        })
        .then(data => {
            renderData(data.users)
        })
        .catch(err => {
            showLog('catch(err)', `${err}`, 'red', 'err-req')
        })
        .finally(() => {
            changeLoading(false)
        })
}

const getByAsync = async (search) => {
    if(!distinct(search)) {
        showLog('distinct', 'lastSearchValue !== search', 'light-green accent-3', 'distinct')

        try {
            showLog('async', search, 'green', 'to-server')
            showLog('DATABASE', search, 'deep-purple', 'load-server') 
            const res = await fetch(`${url.value}?search=${search}`)
        
            if (res.status === 200) {
                const response = await res.json();
                showLog('await', 'res.status === 200', 'green', 'from-server')

                renderData(response.users)
            } else {
                showLog('await', 'res.status !== 200', 'red', 'err-res')
                throw new Error(`Ошибка ${res.status}`);
            }
            changeLoading(false)
        } catch(err) {
            changeLoading(false)
            showLog('try..catch(err)', `${err}`, 'red', 'err-req')
        }
    } else {
        showLog('distinct', 'lastSearchValue === search', 'red', 'distinct')
        return
    }
}

const fetchData = async (search) => {
    if(!distinct(search)) {
        showLog('distinct', 'lastSearchValue !== search', 'light-green accent-3', 'distinct')

        try {
            showLog('async', search, 'green', 'to-server')
            showLog('DATABASE', search, 'deep-purple', 'load-server') 
            const res = await fetch(`${url.value}?search=${search}`)
        
            if (res.status === 200) {
                const response = await res.json();
                showLog('await', 'res.status === 200', 'green', 'from-server')

                renderData(response.users)
            } else {
                showLog('await', 'res.status !== 200', 'red', 'err-res')
                throw new Error(`Ошибка ${res.status}`);
            }
            changeLoading(false)
        } catch(err) {
            changeLoading(false)
            showLog('try..catch(err)', `${err}`, 'red', 'err-req')
        }
    } else {
        showLog('distinct', 'lastSearchValue === search', 'red', 'distinct')
        return
    }
}