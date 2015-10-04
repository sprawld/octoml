"use strict"

// Library Functions
var _ = require('underscore');
module.exports = {

pre: [
	{
		tag: "mirror",
		html: function(a) {
			return '<div class="mirror-demo">'+a.html+'</div><div class="mirror-code"><pre><code highlight="xml">'+_.escape(a.html)+'</code></pre></div>';
		}
	},
],

main: [
	
	{
		tag: "example",
		attr: ['col','hide','above'],
		html: function(a) {
			var codeObj = a.obj.find('.mirror-code');
			var demoObj = a.obj.find('.mirror-demo');
			var extraTab = a.obj.find('.extra-tab');
			var extraHTML = "";
			extraTab.each(function() {extraHTML += a.$(this)[0].outerHTML;});
			if(codeObj.length && demoObj.length) {
				var code = codeObj.html();
				var demo = demoObj.html();
				if(a.attr.col) {
					if(typeof a.attr.col === "string" && a.attr.col.match(/^[0-9]+,[0-9]+$/)) {
						var b = parseInt( a.attr.col.replace(/^([0-9]+),([0-9]+)$/,'$1') );
						var c = parseInt( a.attr.col.replace(/^([0-9]+),([0-9]+)$/,'$2') );
						if(b+c < 13) return '<div class="example"><row><column id="%id%" sm="'+b+'" class="example-col" %attr%>'+demo+'</column><column sm="'+c+'" class="example-col"><tab-group><tab title="OctoML" class="example-octoml">'+code+'</tab><tab title="HTML"><div clone-html="#%id%"></div></tab>'+extraHTML+'</tab-group></column></row></div><hr>';
					}
					return '<div class="example" highlight="xml"><row><column id="%id%" class="example-col" %attr%>'+demo+'</column><column class="example-col"><tab-group><tab title="OctoML" class="example-octoml">'+code+'</tab><tab title="HTML"><div clone-html="#%id%"></div></tab>'+extraHTML+'</tab-group></column></row></div><hr>';
					
				} else if(a.attr.above) {
					return '<div class="example" highlight="xml"><div id="%id%" %attr%>'+demo+'</div></div><tab-group><tab title="OctoML" class="example-octoml">'+code+'</tab><tab title="HTML"><div clone-html="#%id%"></div></tab>'+extraHTML+'</tab-group><div class="example-demo-block"></div><hr>';
				} else {
					return '<div class="example" highlight="xml"><tab-group><tab title="OctoML" class="example-octoml">'+code+'</tab><tab title="HTML"><div clone-html="#%id%"></div></tab>'+extraHTML+'</tab-group><div class="example-demo-block"><div id="%id%" %attr%>'+demo+'</div></div></div><hr>';
				}
			} else {
				return '<%tag% %attr%>%html%</%tag%>';
			}
		}
	},


],

};	

