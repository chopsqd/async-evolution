import { throwError, catchError, fromEvent } from 'rxjs';
import {map, debounceTime, distinctUntilChanged, switchMap, finalize, tap, retry} from 'rxjs/operators'
import {ajax} from 'rxjs/ajax'
import {showLog, clearLog} from './utils/log'

document.addEventListener('DOMContentLoaded', () => 
    M.FormSelect.init(document.querySelectorAll('select'))
);

//==========    BASE    ==========//
const BASE_URL = "https://api.slingacademy.com/v1/sample-data/users"

let input = document.getElementById('username')
let list = document.getElementById('list')
let url = document.getElementById('url')
let reset = document.getElementById('reset')
let clear = document.getElementById('clear')
let select = document.getElementById('select')

url.value = BASE_URL

function changeLoading(flag) {
    if(flag) {
        list.innerHTML = `
            <div class="preloader-wrapper big active loader" style="margin: 0 auto">
                <div class="spinner-layer spinner-blue-only">
                    <div class="circle-clipper left">
                        <div class="circle"></div>
                    </div>
                    <div class="gap-patch">
                        <div class="circle"></div>
                    </div>
                    <div class="circle-clipper right">
                        <div class="circle"></div>
                    </div>
                </div>
            </div>
        `
    } else {
        if(document.querySelector('.loader'))
            document.querySelector('.loader').remove()
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

function onTechnoChange(e) {
    lastSearchValue = ''
    input.value = ''
    list.innerHTML = ''
    changeTechnology(input.value, e.target.value)
    clearLog()
}

let sub;
function changeTechnology(value, method) {
    if(sub && method === 'RxJS') {
        return
    } else if(sub) {
        sub.unsubscribe();
    }

    switch(method) {
        case 'XHR': 
            return getByXhr(value);
        case 'Fetch': 
            return getByFetch(value);
        case 'Async/Await': 
            return getByAsync(value);
        case 'RxJS': 
            sub = input$.subscribe(response => renderData(response.users));
            break;
        case 'OFF': return () => {}
    }
}

reset.addEventListener('click', () => url.value = BASE_URL)
clear.addEventListener('click', clearLog)
input.addEventListener('input', debounce(e => changeTechnology(e.target.value, select.value), 1000));
select.addEventListener('change', onTechnoChange);
input.addEventListener('input', e => showLog('input.addEventListener', e.target.value, 'cyan accent-1', 'input'));

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
    changeLoading(true)

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
        
        changeLoading(true)
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
        } catch(err) {            
            showLog('try..catch(err)', `${err}`, 'red', 'err-req')
        } finally {
            changeLoading(false)
        }
    } else {
        showLog('distinct', 'lastSearchValue === search', 'red', 'distinct')
        return
    }
}

const input$ = fromEvent(input, 'input')
    .pipe(
        map(e => e.target.value),
        debounceTime(1000),
        distinctUntilChanged(),
        tap(() => showLog('distinctUntilChanged', 'lastSearchValue !== search', 'light-green accent-3', 'distinct')),
        tap(() => changeLoading(true)),
        switchMap(search => {
            showLog('ajax.getJSON', search, 'green', 'to-server')
            showLog('DATABASE', search, 'deep-purple', 'load-server') 
            return ajax.getJSON(`${url.value}?search=${search}`)
                .pipe(
                    catchError(err => {
                        console.log('Ошибка: ', err)
                        showLog('catchError', `Ошибка: ${err.message}`, 'red', 'err-res')
                        return throwError(() => new Error(`Ошибка: ${err.message}`))
                    }),
                    tap(() => showLog('ajax.getJSON', 'res.status === 200', 'green', 'from-server'))
                )
        }),
        finalize(() => changeLoading(false)),
        retry(),
    )