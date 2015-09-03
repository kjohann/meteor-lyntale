Meteor.publish('slides', function() {
	return Slides.find({});
});

Meteor.publish('messages', function() {
	return Messages.find({});
});