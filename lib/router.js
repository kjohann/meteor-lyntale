function fetchSlide(slideShowName, page) {
	var slideShow = SlideShows.findOne({name: slideShowName});
				if(typeof(slideShow) === 'undefined') return null;
				var slide = Slides.findOne({slideShowId: slideShow._id, page: page});
				Session.set('currentShow', slideShow);
				if(typeof(slide) === 'undefined') return null;
				Session.set('currentSlide', slide);
				var totalPages = Slides.find({slideShowId: slideShow._id}).count();
				return {
					title: slideShow.title,
					name: slideShow.name,
					markdown: slide.markdown,
					author: slideShow.author,
					page: slide.page,
					slideType: slide.slideType,
					totalPages: totalPages
				};
}

Router.configure({
	layoutTemplate: 'Layout',
	notFoundTemplate: '404',
	waitOn: function() {
		return [
			Meteor.subscribe('slideShows'),
			Meteor.subscribe('slides')
		];
	}
});

Router.onBeforeAction(function() {
	Session.set('currentShow', undefined);
	Session.set('currentSlide', undefined);
	Session.set('workingDoc', '');
	this.next();
});

Router.plugin('dataNotFound', {notFoundTemplate: '404'});

Router.map(function() {
	this.route('Editor', {
		path: '/'
	});
	this.route('EditSlide', {
		path: 'editor/:slideshow/:page',
		template: 'Editor',
		data: function() {
			var slide = fetchSlide(this.params.slideshow, this.params.page);
			if(slide) {
				Session.set('workingDoc', slide.markdown);				
			}
			return slide;
		}
	});
	this.route('Slide', {
		path: 'slideshow/:slideshow/:page',
		data: function() {
			if(this.ready()) {
				return fetchSlide(this.params.slideshow, this.params.page);
			}
			
		}
	});
});
