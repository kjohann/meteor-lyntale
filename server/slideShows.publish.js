Meteor.publish('slideShows', function() {
	return SlideShows.find({});
});