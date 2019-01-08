import { combineReducers } from 'redux'

import OauthApp from './oauthApp'

const rootReducers = combineReducers({
  oauthApp: OauthApp
})

export default rootReducers
