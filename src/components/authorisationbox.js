import React from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import axios from 'axios'
import { startCase } from 'lodash'
import {
  Icon,
  Image,
  Segment,
  Header,
  Button,
  Label,
  Accordion
} from 'semantic-ui-react'

import { getTheme, urlWhoAmI, UserCard, getCookie } from 'formula_one'
import { urlSiteBranding, urlAuthoriseUser } from '../urls'
import { setApp } from '../actions'

import blocks from '../css/app.css'

class AuthorisationBox extends React.Component {
  constructor (props) {
    super(props)
    this.state = {
      site: null,
      user: null,
      loaded: false,
      activeIndex: -1
    }
  }
  componentDidMount () {
    this.setState(
      {
        clientId: this.getURLParam('client_id'),
        responseType: this.getURLParam('response_type') || 'code',
        state: this.getURLParam('state') || 'state',
        redirectUri: this.getURLParam('redirect_uri')
      },
      () => {
        this.props.SetApp(this.state.clientId, res => {
          this.setState({
            redirectUri:
              this.state.redirectUri ||
              res.data.redirectUris.split(' ')[0] ||
              '/'
          })
        })
      }
    )
    this.addBranding()
  }
  getURLParam = param => {
    const url_string = window.location.href
    const url = new URL(url_string)
    return url.searchParams.get(param)
  }
  getSiteBranding () {
    return axios.get(urlSiteBranding())
  }
  getUser () {
    return axios.get(urlWhoAmI())
  }
  addBranding = () => {
    const api_array = [this.getSiteBranding(), this.getUser()]
    axios.all(api_array).then(
      axios.spread((site, user) => {
        this.setState({
          site: site.data,
          user: user.data,
          loaded: true
        })
      })
    )
  }
  /**
   * Renders the logo on the left in the header
   loaded && */
  headerLogoRenderer = () => {
    const { site, loaded } = this.state

    // Wait for the 200 response from all the APIs
    if (loaded) {
      //  By default, selected mode is 'site'
      // Check if site logo is provided and set site logo as logo
      if (site.imagery.logo) {
        return (
          <Image
            src={site.imagery.logo}
            inline
            alt={site.nomenclature.verboseName}
            styleName='blocks.site-logo'
          />
        )
      }

      // If site logo is not present use site wordmark instead
      else if (site.imagery.wordmark) {
        return (
          <Image
            src={site.imagery.wordmark}
            inline
            alt={site.nomenclature.verboseName}
            styleName='blocks.site-logo'
          />
        )
      }

      // If site wordmark is not present use site name instead
      else {
        return (
          <div styleName='blocks.logo-text'>
            <Header as='h2'>{site.nomenclature.verboseName}</Header>
          </div>
        )
      }
    }
  }
  handleClick = (e, titleProps) => {
    const { index } = titleProps
    const { activeIndex } = this.state
    const newIndex = activeIndex === index ? -1 : index

    this.setState({ activeIndex: newIndex })
  }
  convertDictionary = options => {
    let dict = {}
    for (let i = 0; i < options.length; i++) {
      if (!dict[options[i].split('.')[0]]) {
        dict[options[i].split('.')[0]] = []
      }
      dict[options[i].split('.')[0]].push(options[i])
    }
    return dict
  }
  render () {
    const { user, loaded, site, activeIndex } = this.state
    const { oauthApp } = this.props
    const { data, error } = oauthApp
    return (
      <React.Fragment>
        {loaded && oauthApp.isLoaded ? (
          !error ? (
            <React.Fragment>
              <Segment textAlign='left' color={getTheme()} attached='top'>
                <Header as='h3'>Authorise external app</Header>
              </Segment>
              <Segment attached textAlign='center'>
                <div styleName='relation-image-container'>
                  <div styleName='relation-image-wrapper blocks.insert-it-to-right'>
                    {this.headerLogoRenderer()}
                  </div>
                  <div styleName='relation-image-wrapper'>
                    <Icon name='add' />
                  </div>
                  <div styleName='relation-image-wrapper blocks.insert-it-to-left'>
                    <Image
                      src={data.logo}
                      styleName='blocks.site-logo'
                      alt='App logo'
                    />
                  </div>
                </div>
                <div styleName='desc-container'>
                  <Segment compact basic>
                    <UserCard
                      name={user.fullName}
                      image={user.displayPicture}
                      roles={user.roles.map(role => {
                        return role.role
                      })}
                    />
                  </Segment>
                </div>
                The <strong>{data.name}</strong> app wants to connect to your
                <strong> {site.nomenclature.verboseName}</strong> account. It
                will recieve the following information, if you authorise it.
                <Accordion styled styleName='blocks.data-points'>
                  {Object.keys(
                    this.convertDictionary(Object.keys(data.dataPoints))
                  ).map((category, i) => {
                    return (
                      <React.Fragment key={i}>
                        <Accordion.Title
                          active={activeIndex === i}
                          index={i}
                          onClick={this.handleClick}
                        >
                          <Icon name='dropdown' />
                          {startCase(category)}
                        </Accordion.Title>
                        <Accordion.Content active={activeIndex === i}>
                          <Label.Group color={getTheme()}>
                            {this.convertDictionary(
                              Object.keys(data.dataPoints)
                            )[category].map(scope => {
                              return (
                                <Label key={data.dataPoints[scope]}>
                                  {data.dataPoints[scope]}
                                </Label>
                              )
                            })}
                          </Label.Group>
                        </Accordion.Content>
                      </React.Fragment>
                    )
                  })}
                </Accordion>
              </Segment>
              <Segment textAlign='right' attached='bottom'>
                <Button
                  basic
                  negative
                  content='Deny'
                  icon='hand paper outline'
                  as={Link}
                  to='/'
                />
                <form
                  styleName='blocks.form'
                  method='POST'
                  action={urlAuthoriseUser()}
                >
                  <input
                    type='hidden'
                    name='csrfmiddlewaretoken'
                    value={getCookie('csrftoken')}
                  />
                  <input
                    type='hidden'
                    name='redirect_uri'
                    value={this.state.redirectUri}
                  />
                  <input
                    type='hidden'
                    name='client_id'
                    value={this.state.clientId}
                  />
                  <input type='hidden' name='state' value={this.state.state} />
                  <input
                    type='hidden'
                    name='response_type'
                    value={this.state.responseType}
                  />
                  <input type='hidden' name='allow' value='Authorize' />
                  <input type='hidden' name='scope' value='read write' />
                  <Button
                    type='submit'
                    basic
                    primary
                    content='Allow'
                    icon='handshake outline'
                  />
                </form>
              </Segment>
            </React.Fragment>
          ) : (
            'Error'
          )
        ) : (
          'Loading'
        )}
      </React.Fragment>
    )
  }
}

function mapStateToProps (state) {
  return {
    oauthApp: state.oauthApp
  }
}
const mapDispatchToProps = dispatch => {
  return {
    SetApp: (clientId, callback) => {
      dispatch(setApp(clientId, callback))
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthorisationBox)
