var express = require('express'); 

var options = {
  login_url: '/login',
  consent_url: '/user/consent',
  scopes: {
    foo: 'Access to foo special resource',
    bar: 'Access to bar special resource'
  },
  //when this line is enabled, user email appears in tokens sub field. By default, id is used as sub.
  models:{user:{attributes:{sub:function(){return this.email;}}}},
  app: express()
};
var oidc = require('../../index').oidc(options);

module.exports = oidc; 