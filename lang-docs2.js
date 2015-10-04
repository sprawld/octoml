"use strict"

// Library Functions
var _ = require('underscore'),
	highlightjs = require("highlight.js");
// highlight.js - auto-detect when no value is given
var highlight = function(a,b) {
	var b = (a == true) ? highlightjs.highlightAuto(b) : highlightjs.highlight(a,b);
	return b.value.replace(/(    |\t)/g,'&nbsp;&nbsp;&nbsp;');
}

module.exports = {

main: [

	// Frameworks
	

	{
		tag: "*[clone-html]",
		attr: ['clone-html'],
		html: function(a) {
			var html = a.$(a.attr['clone-html']);
			if(html.length) {
				return '<%tag% %attr%><pre><code>'+highlight('xml',html.html())+'</code></pre></%tag%>';
			} else {
				return '<%tag% %attr%><h1>No HTML Found</h1></%tag%>';
			}
		},
	},	

],

};	

