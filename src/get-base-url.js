import getOptionalUrlParam from './get-optional-url-param'

export default function getBaseUrl(trackingId, userId) {
  return (
    (window.ga_api ? window.ga_api : 'https://www.google-analytics.com/collect') +
    '?v=1' +
    `&ul=${window.navigator.language ? window.navigator.language : 'en-us'}` +
    '&de=UTF-8' +
    getOptionalUrlParam('dl', [document.location.href]) +
    getOptionalUrlParam('dt', [document.title]) +
    getOptionalUrlParam('sd', [window.screen.colorDepth, '-bit']) +
    getOptionalUrlParam('sr', [
      window.screen.availWidth,
      'x',
      window.screen.availHeight
    ]) +
    getOptionalUrlParam('vp', [window.innerWidth, 'x', window.innerHeight]) +
    getOptionalUrlParam('dr', [document.referrer])
  )
}
