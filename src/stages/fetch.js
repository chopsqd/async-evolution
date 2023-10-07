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

    fetch(`https://api.slingacademy.com/v1/sample-data/users?search=${search}`)
        .then(res => {
            if (res.status === 200) {
                return res.json();
            } else {
                throw new Error(`Ошибка ${res.status}`);
            }
        })
        .then(data => {
            renderData(data.users)
        })
        .catch(err => {
            console.log(err)
        })
        .finally(() => {
            changeLoading(false)
        })
}