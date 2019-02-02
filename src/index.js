import React, { Component } from 'react'
import { createStore, applyMiddleware } from 'redux'
import { Provider, connect } from 'react-redux'
import { Route, Redirect, Switch } from 'react-router-dom'
import thunk from 'redux-thunk'

import PRoute from 'services/auth/pRoute'
import { whoami } from 'services/auth/src/actions'

import App from './components/app'
import rootReducers from './reducers'

const mapDisPatchToProps = dispatch => {
  return {
    whoami: () => dispatch(whoami()),
  }
}
@connect(
  null,
  mapDisPatchToProps
)
export default class AppRouter extends Component {
  constructor(props) {
    super(props)
    this.store = createStore(rootReducers, applyMiddleware(thunk))
  }

  componentDidMount() {
    this.props.whoami()
  }

  render() {
    const { match } = this.props
    return (
      <Provider store={this.store}>
        <Switch>
          <PRoute exact path={`${match.path}/authorise`} component={App} />
          <Route
            path={`${match.path}/:slug`}
            render={props => <Redirect to="/404" />}
          />
        </Switch>
      </Provider>
    )
  }
}
