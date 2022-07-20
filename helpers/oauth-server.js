let oauthserver = require('./oauth2-server'),
          model = require('./oauth'),

oauth = oauthserver({
  model: model,
  grants: ['password', 'refresh_token'],
  debug: true,
  allowBearerTokensInQueryString: true,
  // accessTokenLifetime: 40
  accessTokenLifetime: 9900
});

oauth.errorHandler();

module.exports = oauth;
