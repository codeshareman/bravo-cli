const STATE = {
    name: 'captain'
}

export default function (state = STATE, action) {
    switch(action.type) {
        case 'SET_USER_NAME': 
            return {
                ...state,
                name: action.name
            }
        default: 
            return { ...state }
    }
}