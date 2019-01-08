const initialState = {
  isLoaded: false,
  data: {}
}
const oauthApp = (state = initialState, action) => {
  switch (action.type) {
    case 'SET_APP':
      return action.payload
    default:
      return state
  }
}

export default oauthApp
