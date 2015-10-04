// Library Functions
var _ = require('underscore'),
	marked = require('marked'),
	fs = require("fs"),
	glob = require("glob"),
	async = require("async"),
	highlightjs = require("highlight.js"),
	beautify = require('js-beautify').html,
	less = require("less"),
	sass = require('node-sass');

	
_.mixin({
 
    move: function (array, fromIndex, toIndex) {
	    array.splice(toIndex, 0, array.splice(fromIndex, 1)[0] );
	    return array;
    } 
    
});
	
module.exports = {

global: {
	"head":			'',
	"css":			"",
	"stylesheets":	{},
	"scripts":		{},
	"js":			[],
	"googlefont":	[],
	"doctype":		"",
	"body":			'',
	"ignore":		[],
	"less":			"",
	"sass":			"",
	"lessfiles":	[],
	"sassfiles":	[],
	"cssfiles":		[],
	"columns":		{},
	"ajax":			"",
	"title":		"",
},

main: [
{
	tag: "ajax",
	html: function(a) {
		a.global.opts.ajax = true;
		var title = a.$('title').text();
		return {
			js: [{
				name: 'ajax',
				src: 'js/ajax.js',
				require: ['jquery'],
			}],
			ajax: '<div class="ajax-wrap ajax-hide" %attr%>%html%</div>',
			html: '<div class="ajax-wrap" %attr%>%html%</div>',
			title: title,
		};
	},
}
],

post: [
{
	html: function(a) {
		var less = "",
			lesspath = ['.'];
		
		//var files = glob.sync(a.path+a.attr.files).map(function(b) {return b.replace(pathRe,'');});
		
		a.lessfiles.forEach(function(c) {
			var files = glob.sync(c);
			files.forEach(function(d) {
				var path = d.split(/^(.*[\/\\])([^\/\\]*)$/);
				if(path.length > 3) lesspath.push(path[1]);
				
				var e = fs.readFileSync(d,'utf-8');
				if(e) less += e;
				
			});
		});
		a.less = less + a.less;
		a.lesspath = _.uniq(lesspath);
	}
},
{
	async: true,
	html: function(a,b) {
		less.render(a.less, { paths: a.lesspath }, function(e,output) {
			if(e) console.log('err '+e);
			else a.css += output.css;
			b()
		});
	}
},
{
	html: function(a) {
		
		if(a.opts.noCSS !== true) a.head += _.map(a.stylesheets,function(b) {
			var c = _.isString(b) ? b : _.isObject(b) && _.has(b,'cdn') ? b.cdn : '';
			if(c) return '\n\t<link rel="stylesheet" href="'+c+'">';
			else return "";
		}).join('');
	}
},
{
	html: function(a) {
		if((a.opts.inline === true || a.opts.inlineCSS === true) && a.css) {
			a.head += '<style>\n'+a.css+'\n</style>';
		} else {
			return {css: a.css }
		}
	},
},
{
	html: function(a) {
		var length = a.js.length;
		var oldLength = 0;
		var jsNew = [];
		var jsText = [];
		//console.log('old '+length);
		//go through the list of scripts and move any required thing before each item
		while(jsNew.length < length) {
			a.js.forEach(function(b) {
				//console.log('loop');
				if(b.complete !== true) {
					if(_.has(b,'require') && _.isArray(b.require) && b.require.length) {
						var requireWrapper;
						if(_.every(b.require, function(c) {
							var fw = _.findIndex(jsNew,{name:c});
							//if(fw == -1) console.log('not found '+c);
							if(_.has(jsNew[fw],'wrapper')) requireWrapper = jsNew[fw].wrapper;
							return fw != -1;
						})) {
							//console.log('adding a '+b);
							//find a wrapper
							jsNew.push(b);
							b.complete = true;
							if(!_.has(b,'wrapper') && requireWrapper) b.wrapper = requireWrapper;
						}
					} else {
						//console.log('adding b '+b);
						jsNew.push(b);
						b.complete = true;
					}
				}
			});
			if(jsNew.length == oldLength) {
				//none have been added
				//console.log('emergency!');
				jsNew = jsNew.concat(_.pluck(jsOld,function(c) {
					return c.complete == false;
				}));
			}
			//console.log('newLength '+jsNew.length);
		}

		//console.log('length '+length);
		
		a.js = jsNew;
		
		
	},
},
{
	html: function(a) {
		if(a.opts.ajax === true) {
			//create a list of all the ajax file locations, also get any 'out' code
			var init = [];
			var plugins = [];
			var exit = [];
			a.js.forEach(function(b) {
				if(b.src) plugins.push(b.src);
				else if(b.code) {
					if(_.has(b,'wrapper') && _.isArray(b.wrapper) && b.wrapper.length > 1)
						init.push(b.wrapper[0]+b.code+b.wrapper[1]);
					else init.push(b.code);
				}
				if(b.out) {
					exit.push(b.out);
				}
			});
			if(exit.length) {
				var code = '$(window).one("ajax:exit",function() {'+exit.join('\n')+'});';
				
				a.js.push({code: code});
				init.push(code);
			}
			var css = _.map(a.stylesheets,function(b) {
				return _.isString(b) ? b : _.isObject(b) && _.has(b,'cdn') ? b.cdn : '';
			});
			
			return {
				json: JSON.stringify({
					html: a.ajax,
					title: a.title,
					css: a.css,
					stylesheets: css,
					scripts: plugins,
					js: init,
				}),
			};
		}
	},
},
{
	html: function(a) {
		var length = a.js.length;
		var jsText = [];
			//console.log('ajax!');
		for(var i=0;i<length;i++) {
			var js = a.js[i];
			if(js.src) {
				if(js.name !== "jquery" && js.name !== "ajax-navigation") jsText.push('<script src="'+js.src+'"></script>');
				else jsText.push('<script src="'+js.src+'"></script>');
			}
			else if(js.code) {
				if(_.has(js,'wrapper') && _.isArray(js.wrapper) && js.wrapper.length > 1)
					jsText.push('<script>'+js.wrapper[0]+js.code+js.wrapper[1]+'</script>');
				else jsText.push('<script>'+js.code+'</script>');
			}
		}
		//console.log('text '+jsText);
		
		a.body = a.body.replace(/<\s*\/body\s*>\s*$/i,'')
			+ jsText.join('\n') + '\n</body>';
	}

},
{
	text: true,
	html: function(a) {
		//console.log('bjax!');
		var html = (a.doctype || '<html>') + '\n<head>\n'+a.head+'\n</head>\n' + a.top+a.body +a.bottom+ '\n</html>\n';
		return {html:html.replace(/\n\n+/g,'\n')};
	},
},

],
};	


/*
{
	html: function(a) {
		if(a.opts.noJS !== true) {
			var scripts = [], oldScripts = [],
				oldJS = [], scriptText = [],
				jsLeft = _.range(a.js.length),
				remainingScripts = _.keys(a.scripts);
			while( (remainingScripts.length || jsLeft.length) && (remainingScripts.length != oldScripts.length || jsLeft.length != oldJS.length) ) {
				oldScripts = remainingScripts.slice();
				remainingScripts = [];
				oldScripts.forEach(function(i) {
					if( _.has(a.scripts[i],'require') && _.isArray(a.scripts[i]['require']) &&
						!a.scripts[i]['require'].every(function(c) { return (scripts.indexOf(c) !== -1) }) ) {
						remainingScripts.push(i);
					} else {
						scriptText.push('\n\t<script src="'+a.scripts[i].cdn+'"></script>')
						scripts.push(i);	
						oldJS = jsLeft.slice();
						jsLeft = [];
						var extraJS = [];
						oldJS.forEach(function(j) {
							if( _.has(a.js[j],'require') && _.isArray(a.js[j]['require']) &&
								!a.js[j]['require'].every(function(c) { return (scripts.indexOf(c) !== -1) }) ) {
								jsLeft.push(j);
							} else {
								extraJS.push(a.js[j].code);
							}
							
						});
						if(extraJS.length) {
							if(_.has(a.scripts[i],'wrapper') && _.isArray(a.scripts[i].wrapper) && a.scripts[i].wrapper.length > 1)
								scriptText.push('\n\t<script>\n'+a.scripts[i].wrapper[0]+extraJS.join('\n')+a.scripts[i].wrapper[1]+'\n</script>');
							else scriptText.push('\n\t<script>\n'+extraJS.join('\n')+'\n</script>');
						}
					}
				});
			}
			a.body = a.body.replace(/<\s*\/body\s*>\s*$/i,'')
				+ scriptText.join('\n') + '\n</body>';
		}	
	}
},
*/
