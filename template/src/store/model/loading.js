const STATE = {
    isLoading: false
}
  
  export default function (state = STATE, action) {
    switch (action.type) {
      case 'SET_LOADING':
        return {
            ...state, 
            isLoading: action.isLoading
        }
      default:
        return state
    }
  }
  