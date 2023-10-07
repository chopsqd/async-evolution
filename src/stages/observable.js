import { throwError, catchError, fromEvent } from 'rxjs';
import {map, debounceTime, distinctUntilChanged, switchMap, finalize, tap, retry} from 'rxjs/operators'
import {ajax} from 'rxjs/ajax'

//==========    OBSERVABLE    ==========//
fromEvent(input, 'input')
    .pipe(
        map(e => e.target.value),
        debounceTime(1000),
        distinctUntilChanged(),
        tap(() => changeLoading(true)),
        switchMap(search => ajax.getJSON(`${url.value}?search=${search}`).pipe(
            catchError(err => {
                return throwError(() => new Error(`Ошибка: ${err.message}`))
            }),
        )),
        finalize(() => changeLoading(false)),
        retry()
    )
    .subscribe(response => renderData(response.users))