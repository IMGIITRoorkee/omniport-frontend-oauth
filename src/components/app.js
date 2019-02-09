import React from 'react'
import { connect } from 'react-redux'
import { Scrollbars } from 'react-custom-scrollbars'
import { Grid, Container } from 'semantic-ui-react'

import { AppHeader, AppFooter, AppMain } from 'formula_one'
import AuthorisationBox from './authorisationbox'

import main from 'formula_one/src/css/app.css'
import blocks from '../css/app.css'

class App extends React.PureComponent {
  render () {
    const creators = [
      {
        name: 'Dhruv Bhanushali',
        role: 'Backend developer',
        link: 'https://dhruvkb.github.io/'
      },
      {
        name: 'Praduman Goyal',
        role: 'Frontend developer',
        link: 'https://pradumangoyal.github.io'
      }
    ]
    return (
      <React.Fragment>
        <div styleName='main.app'>
          <AppHeader />
          <AppMain>
            <div styleName='main.app-main'>
              <Scrollbars autoHide>
                <Container styleName='blocks.app-container'>
                  <AuthorisationBox history={this.props.history} />
                </Container>
              </Scrollbars>
            </div>
          </AppMain>
          <AppFooter creators={creators} />
        </div>
      </React.Fragment>
    )
  }
}

function mapStateToProps (state) {
  return {
    linkList: state.linkList
  }
}

export default connect(mapStateToProps)(App)
