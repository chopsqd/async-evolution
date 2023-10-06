//==========    CALLBACKS    ==========//
input.addEventListener('input', debounce(e => fetchData(e.target.value), 1000));

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
        return
    }

    const xhr = new XMLHttpRequest();

    xhr.onloadstart = function() {
        changeLoading(true)
    }
    
    xhr.open('GET', `https://api.slingacademy.com/v1/sample-data/users?search=${search}`)
    xhr.send();

    xhr.onloadend = function() {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);

          renderData(response.users)
          changeLoading(false)
        } else {
            changeLoading(false)
            console.log(`Ошибка ${xhr.status}: ${JSON.parse(xhr.responseText).detail}`, xhr)
        }
    };

    xhr.onerror = function() {
        changeLoading(false)
        console.log('Запрос не удался')
    }
}