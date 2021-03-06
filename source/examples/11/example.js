/**
 * Имплементация эффекта takeLatest могла-бы выглядеть где-то так.
 */

// Core
import { take, put, call, apply, fork, cancel } from 'redux-saga/effects';

// Instruments
import { types } from '../../bus/swapi/types';
import { swapiActions } from '../../bus/swapi/actions';
import { api } from '../../API';

function* fetchVehicles(action) {
    const response = yield call(api.fetchVehicles, action.payload);
    const data = yield apply(response, response.json);

    yield put(swapiActions.fillVehicles(data.results));
}

export function* runExample() {
    let task = null;

    while (true) {
        const action = yield take(types.FETCH_VEHICLES_ASYNC);

        if (task) {
            yield cancel(task);
            task = null;
        }

        task = yield fork(fetchVehicles, action);
    }
}
