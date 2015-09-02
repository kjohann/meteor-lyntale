var getFormData = function(selector) {
    var data = $(selector).serializeArray();
    return _.object(_.pluck(data, 'name'), _.pluck(data, 'value'));
};

var createEmptySlide = function (slideShowId) {
    var id = Slides.insert({slideShowId: slideShowId, page: '1'});
    return Slides.findOne(id);
}

Template.Editor.helpers({
	editorOptions: function() {
         return {
		    lineNumbers: true,
            mode: "markdown"
        }		
	},
    test: function() {console.log('test');return 'hei';},
    fetchPreview: function() {
        var current = Session.get('workingDoc');
        if(current) return current;
        return ' ';
    },
    submitSlideText: function() {
        return Session.get('currentSlide') ? 'Update slide' : 'Create slide';
    },
    setOrClearSlideshowText: function() {
        return Session.get('currentShow') ? 'Clear current slideshow' : 'Set current slideshow';
    }
});

Template.Editor.events({
   'click #slideshow-create': function(e) {
       e.preventDefault();
       var slideShow = getFormData('#slideshow-form');
       
       var existing = SlideShows.findOne({name: slideShow.name});
       
       if(typeof(existing) === 'undefined') {
           var id = SlideShows.insert(slideShow);
           var slide = createEmptySlide(id);
           Router.go('/editor/' + slideShow.name + '/' + slide.page);
       } else {
           alert('A slideshow with that name already exists!'); //yep - that's user firendly and secure right there :)
       }
   },
   'click #slideshow-fetch': function(e) {
       e.preventDefault();
       
       var slideShowName = getFormData('#slideshow-form').name;
       console.log(slideShowName);
       var existing = SlideShows.findOne({name: slideShowName});
       
       if(typeof(existing) !== 'undefined') {
           console.log('current slideshow set');
           Session.set('currentShow', existing);
       } else if(typeof(Session.get('currentShow')) !== 'undefined' && !slideShowName) {
           Router.go('/');           
       }
   },
   'click #slide-submit': function(e) {
       e.preventDefault();
       
       var slide = getFormData('#slide-form');
       console.log(slide);
   }
});