"use strict"

// Library Functions
var _ = require('underscore'),
	fs = require("fs"),
	glob = require("glob"),
	async = require("async"),
	marked = require('marked'),
	highlightjs = require("highlight.js");
	
// marked.js - prevent it from adding ids to h-tags	
var renderer = new marked.Renderer();
renderer.heading = function(text,level) { return '<h'+level+'>'+text+'</h'+level+'>' };
marked.setOptions({ renderer: renderer });

// highlight.js - auto-detect when no value is given
var highlight = function(a,b) {
	var b = (a == true) ? highlightjs.highlightAuto(b) : highlightjs.highlight(a,b);
	return b.value.replace(/(    |\t)/g,'&nbsp;&nbsp;&nbsp;');
}

module.exports = {

pre: [
	{
		tag: "markdown",
		text: true,
		html: function(a) {
			//return a.text;
			//yonsole.log('markdown '+b);
			return '<markdown %attr%>' + marked(a.html) + '</markdown>';
		},
	},
	

],

};	

