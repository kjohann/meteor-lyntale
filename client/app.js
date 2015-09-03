Meteor.startup(function () {
    if(Meteor.isClient) {
        _.extend(Notifications.defaultOptions, {
            timeout: 2500
        });    
    }
});