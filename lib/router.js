Router.configure({
	layoutTemplate: "Layout",
	notFoundTemplate: '404'
});

Router.route('/', function() {
	this.render('Slides');
});

Router.route('/messages', function() {
	this.render('Messages')
});