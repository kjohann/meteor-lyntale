Template.Slide.helpers({
	content: function(markdown) {
		return parseMarkdown(markdown);
	},
	currentDate: function() {
		return new Date().toLocaleDateString();
	}
});