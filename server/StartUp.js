
Meteor.startup(function(){
    Accounts.loginServiceConfiguration.remove({"service": "twitter"});
    Accounts.loginServiceConfiguration.insert({
        "service": "twitter",
        "consumerKey" : "dFRLANjDN2q6yEODMmGV84xOp",
        "secret" : "YQGi0nAt6N1ghJSaCCVkyG3c2uQxwzh7knX8JQY2Y5O38WA8Qr",
        "loginStyle" : "popup"
    });
});
