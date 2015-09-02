var getFormData = function(selector) {
    var data = $(selector).serializeArray();
    return _.object(_.pluck(data, 'name'), _.pluck(data, 'value'));
};

var clearForm = function(formSelector) {
   _.each($(formSelector), function(input) {
       $(input).val('');
   });    
}

Template.Editor.helpers({
	editorOptions: function() {
         return {
		    lineNumbers: true,
            mode: "markdown"
        }		
	},
    fetchPreview: function() {
        var current = Session.get('currentSlide');
        if(current) return current;
        return ' ';
    }
});

Template.Editor.events({
   'click #slideshow-create': function(e) {
       e.preventDefault();
       var slideShow = getFormData('#slideshow-form');
       
       var existing = SlideShows.findOne({name: slideShow.name});
       
       if(typeof(existing) === 'undefined') {
           SlideShows.insert(slideShow);
           console.log('inserted new', slideShow);
           clearForm('#slideshow-form input[type="text"]');
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
       }
   }
});