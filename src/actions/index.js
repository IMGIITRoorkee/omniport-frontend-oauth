import axios from 'axios'

import { urlAuthoriseRequest } from '../urls'

export const setApp = (clientId, callback) => {
  return dispatch => {
    axios
      .get(urlAuthoriseRequest(clientId))
      .then(res => {
        callback(res)
        dispatch({
          type: 'SET_APP',
          payload: {
            isLoaded: true,
            data: res.data,
            error: false
          }
        })
      })
      .catch(() => {
        dispatch({
          type: 'SET_APP',
          payload: {
            isLoaded: true,
            data: {},
            error: true
          }
        })
      })
  }
}
