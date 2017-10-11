/* eslint-disable */
require('eventsource-polyfill')
var hotClient = require('webpack-hot-middleware/client?noInfo=true&reload=true')
try {
  var secret = require('./secret');
  window.localStorage.token = secret.token;
} catch (ex) {
  console.log('Create secret file in build directory with module.exports = { token: ... }');
}
hotClient.subscribe(function (event) {
  if (event.action === 'reload') {
    window.location.reload()
  }
})
