import { combineReducers } from 'redux'

// stores
import profit from './profit'
import loading from './loading'

export default combineReducers({
    profit,
    loading
})