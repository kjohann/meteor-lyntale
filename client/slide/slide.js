Template.Slide.helpers({
	content: function(markdown) {
		return parseMarkdown(markdown);
	},
	currentDate: function() {
		return new Date().toLocaleDateString();
	}
});

Template.Slide.onRendered(function() {
	_.each(this.findAll('pre code'), function(node) {
		hljs.highlightBlock(node);
		node.className += ' code';
	});
});