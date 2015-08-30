Router.configure({
	layoutTemplate: 'Layout',
	notFoundTemplate: '404'
});

Router.plugin('dataNotFound', {notFoundTemplate: '404'});

Router.map(function() {
	this.route('Index', {
		path: '/'
	});
	this.route('Slide', {
		path: 'slideshow/:number/:page',
		waitOn: function() {
			return [
				Meteor.subscribe('slideShows'),
				Meteor.subscribe('slides')
			];
		},
		data: function() {
			if(this.ready()) {
				var slideShow = SlideShows.findOne({number: this.params.number});
				if(typeof(slideShow) === 'undefined') return null;
				var slide = Slides.findOne({slideShowId: slideShow._id, page: this.params.page});
				if(typeof(slide) === 'undefined') return null;
				var totalPages = Slides.find({slideShowId: slideShow._id}).count();
				return {
					title: slideShow.title,
					markdown: slide.markdown,
					author: slideShow.author,
					page: slide.page,
					totalPages: totalPages
				};
			}
			
		}
	});
});
