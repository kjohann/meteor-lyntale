var getFormData = function(selector) {
    var data = $(selector).serializeArray();
    return _.object(_.pluck(data, 'name'), _.pluck(data, 'value'));
};

var createEmptySlide = function (slideShowId) {
    var id = Slides.insert({slideShowId: slideShowId, page: '1'});
    return Slides.findOne(id);
}

var getCurrentShowAndNotifyIfNotSet = function() {
   var currentSlideshow = Session.get('currentShow');
    if(typeof(currentSlideshow) === 'undefined') {
       alert('No active slideshow set!');
       return null;
    }
    return currentSlideshow;
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
       
       if(!slideShow.name) {
           alert('Name is required');
           return;
       }
       
       var existing = SlideShows.findOne({name: slideShow.name});
       
       if(typeof(existing) === 'undefined') {
           var id = SlideShows.insert(slideShow);
           var slide = createEmptySlide(id);
           Router.go('EditSlide', {slideshow: slideShow.name, page: slide.page});
       } else {
           alert('A slideshow with that name already exists!'); //yep - that's user firendly and secure right there :)
       }
   },
   'click #slideshow-fetch': function(e) {
       e.preventDefault();
       
       var currentShow = Session.get('currentShow');
       if(currentShow) {
           Router.go('Editor')
           return;
       }
       
       var slideShowName = getFormData('#slideshow-form').name;
       var existing = SlideShows.findOne({name: slideShowName});
       if(typeof(existing) !== 'undefined') {
           Router.go('EditSlide', {slideshow: existing.name, page: '1'});   
       } else if(typeof(Session.get('currentShow')) !== 'undefined' && !slideShowName) {
           Router.go('Editor');           
       }
   },
   'click #slide-submit': function(e) {
       e.preventDefault();
       
       var slide = getFormData('#slide-form');
       console.log(slide);
   },
   'click #slide-fetch': function(e) {
       e.preventDefault();
       
       var currentSlideshow = getCurrentShowAndNotifyIfNotSet();
       if(!currentSlideshow) return;
       
       var slideData = getFormData('#slide-form');
       var slide = Slides.findOne({slideShowId: currentSlideshow._id, page: slideData.page});
       if(typeof(slide) === 'undefined') {
           alert('No such slide on slideshow with name' + currentSlideshow.name);
           return;
       }
       Router.go('EditSlide', {slideshow: currentSlideshow.name, page: slide.page});
   },
   'click #slide-create': function(e) {
       e.preventDefault();
       
       
   }
});