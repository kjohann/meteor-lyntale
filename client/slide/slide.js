Template.Slide.helpers({
	content: function(markdown) {
		return parseMarkdown(markdown);
	},
	currentDate: function() {
		return new Date().toLocaleDateString();
	},
	hack: function() { //using this to highlight code when I change slides.. :/
		Session.set('hack', Math.random())
	}
});

Template.Slide.onRendered(function() {
	this.autorun(function() {
		Session.get('hack');
		_.each(this.findAll('pre code'), function(node) {
			hljs.highlightBlock(node);
			node.className += ' code';
		});
	}.bind(this));
});