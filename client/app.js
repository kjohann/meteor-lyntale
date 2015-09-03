Meteor.startup(function () {
    if(Meteor.isClient) {
        _.extend(Notifications.defaultOptions, {
            timeout: 2500
        });
        
        window.onkeyup = function(e) {
            if(Router.current().route.getName() !== 'SlideShow') return;
            var currentShow = Session.get('currentShow');
            var currentSlide = Session.get('currentSlide');
            var totalPages = Slides.find({slideShowId: currentShow._id}).count();
            
            if(e.which == 39 && parseInt(currentSlide.page) !== totalPages) { //next
                Router.go('SlideShow', {slideshow: currentShow.name, page: (parseInt(currentSlide.page) + 1)+''});
            } else if(e.which == 37 && currentSlide.page !== '1') { //previous
                Router.go('SlideShow', {slideshow: currentShow.name, page: (parseInt(currentSlide.page) - 1)+''});
            }
        }    
    }
});