const SalesforceClient = require('./salesforce-node-client');

// Settings for Salesforce connection
  const sfdcConfig = {
    // OAuth authentication domain
    // For production or a Developer Edition (DE) use
    domain: 'https://login.salesforce.com',
    // For a sandbox use
    //domain : 'https://test.salesforce.com',

    // URL called by Salesforce after authorization and used to extract an authorization code.
    // This should point to your app and match the value configured in your App in SFDC setup)
    // callbackUrl: 'http://localhost:8081/salesforce/addOrg_authenticate',
    // callbackUrl: 'https://feedbackwow-server.us-west-2.elasticbeanstalk.com/salesforce/addOrg_authenticate',
    callbackUrl: 'https://server.feedbackwow.org/salesforce/addOrg_authenticate',
    // callbackUrl: 'https://b07ee386.ngrok.io/salesforce/addOrg_authenticate',

    // Set of secret keys that allow your app to authenticate with Salesforce
    // These values are retrieved from your App configuration in SFDC setup.
    // NEVER share them with a client.
    consumerKey: '3MVG9ZL0ppGP5UrAEIl8l1tM16Q7LZZ2MuOIf3.GnuN7AlNkAbqjdNlGalDsuACaEaqb2XCw_w_wu.59kN4zA',
    consumerSecret: '3288310040573449690',

    // Salesforce API version
    apiVersion: 'v41.0'
  };

   const sfdcClient = new SalesforceClient(sfdcConfig);

module.exports= sfdcClient;
