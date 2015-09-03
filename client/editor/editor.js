var getFormData = function(selector) {
    var data = $(selector).serializeArray();
    return _.object(_.pluck(data, 'name'), _.pluck(data, 'value'));
};

var getNextPageNumber = function(slideShowId) {
    var slideShow = SlideShows.findOne(slideShowId);
    if(!slideShow) throw 'This should not happen :('
    
    return ''+Slides.find({slideShowId: slideShow._id}).count();
}

var createEmptySlide = function (slideShowId, isNew) {
    var page = isNew ? getNextPageNumber(slideShowId) : '1';
    var id = Slides.insert({slideShowId: slideShowId, page: page, markdown: '# Write some markdown..', slideType: 'default'});
    return Slides.findOne(id);
}

var getCurrentShowAndNotifyIfNotSet = function() {
   var currentSlideshow = Session.get('currentShow');
    if(typeof(currentSlideshow) === 'undefined') {
       Notifications.error('No active slideshow set!');
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
    fetchPreview: function() {
        var current = Session.get('workingDoc');
        if(current) return current;
        return ' ';
    },
    setOrClearSlideshowText: function() {
        return Session.get('currentShow') ? 'Clear current slideshow' : 'Set current slideshow';
    },
    updateOrCreateSlideshowText: function() {
        return Session.get('currentShow') ? 'Update slideshow' : 'Create slideshow';
    },
    checked: function(radioVal) {
        var currentSlide = Session.get('currentSlide');
        if(!currentSlide) return '';
        return currentSlide.slideType === radioVal ? 'checked' : '';
    }
});

Template.Editor.events({
    'click #slideshow-create': function(e) {
        e.preventDefault();
        var slideShow = getFormData('#slideshow-form');
       
        if(!slideShow.name) {
            Notifications.error('Name is required');
            return;
        }
       
        var existing = SlideShows.findOne({name: slideShow.name});
        var currentShow = Session.get('currentShow');
        
        if(typeof(existing) === 'undefined') {
            var id = SlideShows.insert(slideShow);
            var slide = createEmptySlide(id);
            Router.go('EditSlide', {slideshow: slideShow.name, page: slide.page});
        } else if(currentShow) {
            SlideShows.update(currentShow._id, {$set: {author: slideShow.author, title: slideShow.title}});
        } else {
            Notifications.error('A slideshow with that name already exists!'); 
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
    'click #slide-update': function(e) {
        e.preventDefault();
       
        var slide = getFormData('#slide-form');
        if(!slide.page) {
            Notifications.error('Need to have a page number');
            return;
        }
        var currentShow = getCurrentShowAndNotifyIfNotSet();
        if(!currentShow) return;
       
        var existingInSession = Session.get('currentSlide');
        var existing = Slides.findOne({slideShowId: currentShow._id, page: slide.page});
        if(existing && existingInSession._id !== existing._id) {
            Notifications.error('A slide with page ' + existing.page + ' already exists in this slideshow');
            return;
        }
        if(!existingInSession) {
            Notifications.error('No such slide');
            return; 
        }
        
        Slides.update(existingInSession._id, {$set: {page: slide.page, markdown: slide.markdown, slideType: slide.slideType}});
        Router.go('EditSlide', {slideshow: currentShow.name, page: slide.page});  
    },
    'click #slide-fetch': function(e) {
        e.preventDefault();
       
        var currentSlideshow = getCurrentShowAndNotifyIfNotSet();
        if(!currentSlideshow) return;
       
        var slideData = getFormData('#slide-form');
        var slide = Slides.findOne({slideShowId: currentSlideshow._id, page: slideData.page});
        if(typeof(slide) === 'undefined') {
            Notifications.error('No such slide on slideshow with name ' + currentSlideshow.name);
            return;
        }
        Router.go('EditSlide', {slideshow: currentSlideshow.name, page: slide.page});
    },
    'click #slide-create': function(e) {
        e.preventDefault();
        
        var currentSlideShow = getCurrentShowAndNotifyIfNotSet();
        if(!currentSlideShow) return;
        
        var slide = createEmptySlide(currentSlideShow._id, true);
        Router.go('EditSlide', {slideshow: currentSlideShow.name, page: slide.page});      
    }
});