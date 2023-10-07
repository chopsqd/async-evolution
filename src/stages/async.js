//==========    ASYNC/AWAIT    ==========//
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

const fetchData = async (search) => {
    if(!distinct(search)) {
        try {
            const res = await fetch(`${url.value}?search=${search}`)
        
            if (res.status === 200) {
                const response = await res.json();
    
                renderData(response.users)
            } else {
                throw new Error(`Ошибка ${res.status}`);
            }
            changeLoading(false)
        } catch(err) {
            changeLoading(false)
        }
    } 
}