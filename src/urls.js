export function urlAuthoriseRequest (clientId) {
  return `/open_auth/application/${clientId}/`
}

export function urlAuthoriseUser () {
  return '/open_auth/authorise/'
}

export function urlSiteBranding () {
  return '/bootstrap/site_branding/'
}
