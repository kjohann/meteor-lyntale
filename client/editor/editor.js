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