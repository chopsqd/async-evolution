const log = document.getElementById('log')

export function showLog(fun, value, color, icon) {
    let showIcon = ''
    switch(icon) {
        case 'input': 
            showIcon = `<i class="material-icons">touch_app</i>`
            break;
        case 'distinct': 
            showIcon = `<i class="material-icons">layers_clear</i>`
            break;
        case 'to-server': 
            showIcon = `<i class="material-icons">arrow_forward</i><i class="material-icons">storage</i>`
            break;
        case 'load-server': 
            showIcon = `<i class="material-icons">cached</i><i class="material-icons">storage</i>`
            break;
        case 'from-server': 
            showIcon = `<i class="material-icons">arrow_back</i><i class="material-icons">storage</i>`
            break;
        case 'err-req': 
            showIcon = `<i class="material-icons">arrow_forward</i><i class="material-icons">highlight_off</i>`
            break;
        case 'err-res': 
            showIcon = `<i class="material-icons">arrow_back</i><i class="material-icons">highlight_off</i>`
            break;
        case 'show-users': 
            showIcon = `<i class="material-icons">clear_all</i>`
            break;
        case 'no-users': 
            showIcon = `<i class="material-icons">border_clear</i>`
            break;
    }
    log.insertAdjacentHTML(
        'beforeend', 
        `<div class="card ${color}" style="border-radius: 10px">
            <div class="card-content" style="padding: 10px 5px">
                <div style="display:flex;justify-content:space-between;align-items:center">
                    <span>${fun}: <b>${value}</b></span>
                    ${showIcon}
                </div>
            </div>
      </div>`
    )
    log.scrollTop = log.scrollHeight;
}

export function clearLog() {
    log.innerHTML = ''
}