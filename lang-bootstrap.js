"use strict"

// Library Functions
var _ = require('underscore');

module.exports = {

main: [

	// Frameworks
	
	{
		tag: "boilerplate,bootstrap",
		attr: {
			'title':'%val%',
			'description': '%val%',
			'keywords': '<meta name="keywords" content="%val%">',
			'css': '',
			'less': '',
			'ajax': '',
			'sass': '',
			'lang': '%val%',
			'no-zoom': ', maximum-scale=1.0, minimum-scale=1.0, target-densitydpi=device-dpi, user-scalable=no',
			'jquery': '%val%',
			'icon' : '\n\t<link rel="icon" href="%val%">',
			'version': '%val%',
			'happy':'\n\t<!--[if lt IE 8]>\n\t\t<p class="browserupgrade">You are using an <strong>outdated</strong> browser. Please <a href="http://browsehappy.com/">upgrade your browser</a> to improve your experience.</p>\n\t<![endif]-->',
			'analytics':"\n<script>\n(function(b,o,i,l,e,r){b.GoogleAnalyticsObject=l;b[l]||(b[l]=\nfunction(){(b[l].q=b[l].q||[]).push(arguments)});b[l].l=+new Date;\ne=o.createElement(i);r=o.getElementsByTagName(i)[0];\ne.src='https://www.google-analytics.com/analytics.js';\nr.parentNode.insertBefore(e,r)}(window,document,'script','ga'));\nga('create','UA-%val%','auto');ga('send','pageview');\n</script>\n",
			'shiv':'\n\t<!--[if lt IE 9]>\n\t\t<script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>\n<script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>\n\t<![endif]-->\n',
			'theme': ['cerulean','cosmo','cyborg','darkly','flatly','journal','lumen','paper','readable','sandstone','simplex','slate','spacelab','superhero','united','yeti','material'],
		},
		attrDefault: {
			'lang' : 'en',
			'jquery' : '1.11.3',		//Latest jQuery version
			'version' : '3.3.5',	//Latest Bootstrap version
		},
		html: function(a) {
			var head = '\n\t<meta charset="utf-8">\n\t<meta http-equiv="x-ua-compatible" content="ie=edge">\n\t<title>%title%</title>\n\t<meta name="description" content="%description%">%keywords%\n\t<meta name="viewport" content="width=device-width, initial-scale=1%no-zoom%">%icon%%shiv%',
				bootstrap = (a.tag == "bootstrap"),
				stylesheets = {},
				scripts = [];
			if(bootstrap) stylesheets['bootstrap'] = 'https://maxcdn.bootstrapcdn.com/bootstrap/%version%/css/bootstrap.min.css';
			if(a.attr.jquery !== "none") {
				scripts.push({
					name: 'jquery',
					src: 'https://ajax.googleapis.com/ajax/libs/jquery/%jquery%/jquery.min.js',
					wrapper: ["$(function() {","});"],
				});
				if(bootstrap) scripts.push({
					name: 'bootstrap',
					src:'https://maxcdn.bootstrapcdn.com/bootstrap/%version%/js/bootstrap.min.js',
					require: ['jquery'],
				});
			}
			if(bootstrap && a.attr.theme != "none") {
				stylesheets['theme'] = a.attr.theme ?
					(a.attr.theme.match(/^(https?:)?\/\//) ? 
						a.attr.theme : 'https://maxcdn.bootstrapcdn.com/bootswatch/%version%/%theme%/bootstrap.min.css'
					) : 'https://maxcdn.bootstrapcdn.com/bootstrap/%version%/css/bootstrap-theme.min.css';
			}
			if(a.attr.css) a.attr.css.split(',').forEach(function(b) {
				stylesheets[b] = b;
			});
			var lessfiles = bootstrap ? ['node_modules/bootstrap/less/variables.less','node_modules/bootstrap/less/mixins.less'] : [];
			if(a.attr.less) lessfiles = lessfiles.concat(a.attr.less.split(','));
			return {
				head: head,
				stylesheets: stylesheets,
				doctype: '<!doctype html>\n<html lang="%lang%">',
				js: scripts,
				html: ['%happy%%html%','','\n%analytics%\n'],
				lessfiles: lessfiles,
			};
		},
	},	

	
	// Navbar
	
	{ 
		tag: "navbar",
		attr: {
			'inverse':' navbar-inverse',
			'fixed-top': ' navbar-fixed-top',
			'fixed-bottom': ' navbar-fixed-bottom',
			'fluid': '-fluid',
			'collapse': '',
			'static-top': ' navbar-static-top'
		},
		attrDefault: {
			'inverse': ' navbar-default',
		},
		html: function(a) {
				if(a.attr.collapse && a.obj.find('brand').length == 0) {
				return '<nav class="navbar%inverse%%fixed-top%%static-top%%fixed-bottom%" %attr%><div class="container%fluid%"><div class="navbar-header"><btn class="navbar-toggle%inverse% collapsed" data-toggle="collapse" data-target="#%id%" aria-expanded="false" aria-controls="%id%"><span class="sr-only">Toggle navigation</span><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></btn>        </div><div id="%id%" class="collapse navbar-collapse">%html%</div></div></nav>';
			} else {
				return '<nav class="navbar%inverse%%fixed-top%%static-top%%fixed-bottom%" %attr%><div class="container%fluid%">%html%</div></nav>';
			}
		},
		inner: [
			{
				tag: " > form",
				attr: {'left':'','right':' navbar-right'},
				attrDefault: {'right':' navbar-left'},
				html: '<form class="navbar-form%right%" %attr%>%html%</form>'
			},
			{
				tag: " > dropdown",
				attr: {'left':'navbar-left ','right':'navbar-right ','active':'active '},
				html: function(a) {
					if(a.attr.active || a.attr.left || a.attr.right) return '<ul class="%active%%left%%right%"><dropdown %attr%>%html%</dropdown></ul>';
					else return '<ul><dropdown %attr%>%html%</dropdown></ul>';
				},
			},
			
			{
				tag: " > ul",
				attr: {'left':' navbar-left','right':' navbar-right'},
				html: '<ul class="nav navbar-nav%left%%right%" %attr%>%html%</ul>',
				inner: [
				{
					tag: "li[active]",
					attr: ['active'],
					html: '<li class="active" %attr%>%html%</li>',
				},
				],
			},
			{
				tag: "> button, > btn, > a[btn]",
				attr: {'left':' navbar-left','right':' navbar-right'},
				html: '<%tag% class="navbar-btn%left%%right%" %attr%>%html%</%tag%>',
			},
			
			{
				tag: " > p",
				attr: {'left':' navbar-left','right':' navbar-right'},
				html: '<p class="navbar-text%left%%right%" %attr%>%html%</p>',
				inner: [ {
					tag: "a",
					attr: {'left':' navbar-left','right':' navbar-right'},
					html: '<a class="navbar-link%left%%right%" %attr%>%html%</a>',
				} ],
			},
			{
				tag: " > a",
				attr: {'left':' navbar-left','right':' navbar-right'},
				html: '<a class="navbar-link%left%%right%" %attr%>%html%</a>',
			},
			{
				tag: "brand",
				html: function(a) {
					var b = a.parent.attr.inverse ? ' navbar-inverse' : '';
					if(a.parent.attr.collapse) {
						return ['','<div class="navbar-header" %attr%><btn class="navbar-toggle'+b+' collapsed" data-toggle="collapse" data-target="#%id%" aria-expanded="false" aria-controls="%id%"><span class="sr-only">Toggle navigation</span><span class="icon-bar"></span><span class="icon-bar"></span><span class="icon-bar"></span></btn>%html%</div><div id="%id%" class="collapse navbar-collapse">','</div>'];
					} else {
						return ['','<div class="navbar-header" %attr%>%html%</div>'];
					}
				},
				inner:
				[
					{
						tag: 'a',
						attr: {'left':' navbar-left','right':' navbar-right'},
						html: '<a class="navbar-brand%left%%right%" %attr%>%html%</a>',
					}
				],
			},
		],
 
	},
	
	
	/* ------------------------
	          Javascript
	   ------------------------ */

	// Modal
	
	{
		tag: "modal",
		attr: {
			'no-fade':'',
			'close': '<close data-dismiss="modal">',
			'show': '',
			'lg': ' modal-lg',
			'sm': ' modal-sm',
		},
		attrDefault: {
			'no-fade': ' fade',
			'show': ' aria-hidden="true"',
		},
		html: function(a) {
			if(a.attr.close && a.obj.find('header,hgroup,h1,h2,h3,h4,h5,h6').length == 0) a.obj.prepend('<h4> &nbsp; </h4>');
			return '<div class="modal%no-fade%" id="%id%" role="dialog" tabindex="-1" %show%%attr%><div class="modal-dialog%lg%%sm%"><div class="modal-content">%html%</div></div></div>';
		},
		inner: [
		{
			tag: "a[close], button[close], btn[close]",
			attr: ['close'],
			html: '<%tag% data-dismiss="modal" %attr%>%html%</%tag%>',
		},
		{
			tag: "header,hgroup,h1,h2,h3,h4,h5,h6",
			attrInherit: ['close'],
			first: ['','<div class="modal-header"><%tag% class="modal-title" %attr%>%close%%html%</%tag%></div>'],
		},
		{
			tag: "footer",
			last: ['','','<div class="modal-footer">%html%</div>'],
		},
		{
			html: '<div class="modal-body">%html%</div>',
		},
		],
	},
	{
		tag: 'button[modal],btn[modal],a[modal],input[modal]',
		attr: ['modal'],
		html: '<%tag% data-toggle="modal" data-target="%modal%" %attr%>%html%</%tag%>',
	},

	// Dropdown
	
	{
		tag: "ul,list,pills,tabs",
		inner: [{
			tag: "> dropdown",
			html: "<dropdown li %attr%>%html%</dropdown>",
		},
		],
	},
	{
		tag: 'dropdown',
		attr: {
			'title':'%val%',
			'a':'a ',
			'btn':'btn ',
			'split':'',
			'up':' class="dropup"',
			'active': ' class="active"',
			'right': ' dropdown-menu-right',
			'octoml-size': ['lg','sm'],
			'li': '',
		},
		html: function(a) {
			var li = a.attr.li//(a.obj.parent()[0].tagName == "UL");
			var wrap = li ? (a.attr.btn ? 
				['<li%active%><btn-group','</btn-group></li>'] : 
				['<li','</li>']) : (a.attr.btn ? 
				['<btn-group','</btn-group>'] : 
				['<div','</div>']);
			var btn = a.attr.btn ? ( a.attr.a ?
				['<a btn','</a>'] : 
				['<btn','</btn>'] ) : 
				['<a','</a>'];
			
			if(a.attr.btn) {
				if(a.attr.split) {
					return wrap[0]+' %octoml-size%%up%>'+btn[0]+' %attr%>%title%'+btn[1]+btn[0]+' class="dropdown-toggle" id="%id%" data-toggle="dropdown" aria-expanded="false" %attr%><span class="caret"></span><span class="sr-only">Toggle Dropdown</span>'+btn[1]+'<ul class="dropdown-menu%right%" role="menu" aria-labelledby="%id%">%html%</ul>'+wrap[1];
				} else {
					return wrap[0]+' %octoml-size%%up%>'+btn[0]+' class="dropdown-toggle" id="%id%" data-toggle="dropdown" aria-expanded="false" %attr%>%title% <span class="caret"></span><span class="sr-only">Toggle Dropdown</span>'+btn[1]+'<ul class="dropdown-menu%right%" role="menu" aria-labelledby="%id%">%html%</ul>'+wrap[1];
				}
			} else {
				return wrap[0]+' class="'+(a.attr.up ? 'dropup' : 'dropdown')+(a.attr.active ? ' active' : '')+'"><a class="dropdown-toggle" type="button" id="%id%" data-toggle="dropdown" aria-expanded="false" %attr%>%title% <span class="caret"></span><span class="sr-only">Toggle Dropdown</span></a><ul class="dropdown-menu%right%" role="menu" aria-labelledby="%id%">%html%</ul>'+wrap[1];				
			}
		},
		inner: [
		{
			tag: "li",
			html: function(a) {
				if(a.obj.find('a').attr('disabled') !== undefined) return '<li role="presentation" class="disabled" %attr%>%html%</li>';
				return '<li role="presentation" %attr%>%html%</li>';
			},
			inner: [
			{
				tag: "a",
				html: '<a role="menuitem" tabindex="-1" %attr%>%html%</a>',
			},
			],
		},
		{
			tag: 'a:not([role="menuitem"])',
			attr: {'disabled':' class="disabled"'},
			html: '<li role="presentation"%disabled%><a role="menuitem" tabindex="-1" %attr%>%html%</a></li>',
		},
		{
			tag: "divider",
			single: true,
			html: '<li class="divider"></li>',
		},
		{
			tag: "header",
			html: '<li class="dropdown-header">%html%</li>',
		}
		],
	},

	
	// Tabs
	
	{
		tag: "tab-group",
		attr: {
			pills: 'pills',
			fade: ' fade',
			justified: ' nav-justified',
			stacked: ' nav-stacked',
		},
		attrDefault: {
			pills: 'tabs',
		},
		html: function(a) {
			//if no tab is set as 'active', set the first tab
			if(a.obj.find(' > tab[active]').length == 0) a.obj.find(' > tab').first().attr('active','');
			
			return '<div role="tabpanel" %attr%>%html%</div>';
		},
		inner: [ {
			tag: "tab",
			attr: {
				title: '%val%',
				active: ' active',
			},
			attrInherit: ['pills','fade','justified','stacked'],
			attrDefault: {
				title: function(a) {
					var b = a.obj.find('h1,h2,h3,h4,h5,h6,hgroup,header').first();
					return b.length ? b.text() : "Tab "+(a.index+1);					
				},
			},
			html: function(a) {
				var fade = a.attr.fade ? (a.attr.active ?
					' fade in active' : ' fade') : (a.attr.active ?
					' active' : '');
				//if tab doesn't have a title, search for h-tag
				var tabList = (a.first ? '\n<ul class="nav nav-%pills%%justified%%stacked%" role="tablist">' : '')
					+ '\n\t<li role="presentation"><a href="#%id%" aria-controls="%id%" role="tab" data-toggle="tab">%title%</a></li>';
				var tabBody = '<div role="tabpanel" class="tab-pane'+fade+'" id="%id%" %attr%>%html%</div>';				
				
				if(a.last) return  [tabBody,tabList+'\n</ul>\n<div class="tab-content">','</div>\n'];
				else return [tabBody,tabList];
			},
		}],
	},
	{
		tag: "tabs,pills",
		attr: {
			'justified' : ' nav-justified',
			'stacked': ' nav-stacked',
		},
		html: '<ul class="nav nav-%tag%%justified%%stacked%" %attr%>%html%</ul>',
		inner: [
		{
			tag: " > li",
			attr: {'active': ' class="active"'},
			html: '<li role="presentation"%active% %attr%>%html%</li>',
		},
		{
			tag: " > a",
			attr: {'active': ' class="active"'},
			html: '<li role="presentation"%active%><a %attr%>%html%</a></li>',
		},
		],
	},

	
	// Tooltip

	{
		tag: "*[tooltip]",
		attr: {
			'tooltip':'%val%',
			'placement':['top','bottom','left','right'],
			'auto': 'auto',
		},
		html: function(a) {
			var html = (a.attr.placement && a.attr.auto) ? '<%tag% data-toggle="tooltip" data-placement="%auto% %placement%" title="%tooltip%" %attr%>%html%</%tag%>' :
				(a.attr.placement || a.attr.auto) ? '<%tag% data-toggle="tooltip" data-placement="%auto%%placement%" title="%tooltip%" %attr%>%html%</%tag%>' :
				'<%tag% data-toggle="tooltip" title="%tooltip%" %attr%>%html%</%tag%>';
			if(a.first) return {
				html: html,
				js: [{code: '$(\'[data-toggle="tooltip"]\').tooltip()',
					require: ['bootstrap'],
				}],
			};
			else return html;
		}
	},

	
	// Popover
	
	{
		tag: "a[popover],button[popover],btn[popover]",
		attr: {
			'popover':'%val%',
			'placement':['top','bottom','left','right'],
			'container':'%val%',
			'close': '',
			'title': '%val%',
		},
		attrDefault: {
			'container':'body',
		},
		html: function(a) {
			var placement = a.attr.placement ? ' data-placement="%placement%"' : '';
			var text;
			if(a.attr.close) {
				//if a btn, change to an a with btn
				var title = a.attr.title ? '%title%' : a.obj.text();
				if(a.tag !== 'a') text = '<a tabindex="0" btn data-container="%container%" data-toggle="popover" data-trigger="focus"'+placement+' title="'+title+'" data-content="%popover%" %attr%>%html%</a>';
							 else text = '<a tabindex="0"     data-container="%container%" data-toggle="popover" data-trigger="focus"'+placement+' title="'+title+'" data-content="%popover%" %attr%>%html%</a>';
			} else {
				var title = a.attr.title ? ' title="%title%"' : '';
				text = '<%tag% data-container="%container%" data-toggle="popover"'+placement+title+' data-content="%popover%" %attr%>%html%</%tag%>';
			}
			if(a.first) return {
				js: [{code: '$(\'[data-toggle="popover"]\').popover();', require: ['bootstrap']}],
				html: text,
			};
			else return text;
		},
	},

	{
		tag: "accordion",
		attr: ['closed'],
		html: function(a) {
			if(a.obj.find('panel[active]').length==0 && !a.attr.closed) {
				a.obj.find('panel').first().attr('active','');
			}
			return '<panel-group id="%id%" role="tablist" aria-multiselectable="true" %attr%>%html%</panel-group>';
		},
		inner: [
		{
			tag: "panel",
			attr: {'active':'collapse'},
			attrDefault: {'active':'collapsed'},
			html: function(a) {
				return '<panel accordion="'+a.parent.id()+'" %active% %attr%>%html%</panel>';
			},
		},
		],
	},
	{
		tag: "panel-group",
		attr: {
			brand: ['default','primary','success','info','warning','danger'],
		},
		attrDefault: {
			brand: 'default'
		},
		html: '<div class="panel-group" %attr%>%html%</div>',
		inner: [
		{
			tag: "panel",
			attrInherit: ['brand'],
			html: '<panel %brand% %attr%>%html%</panel>',
		}],
	},

	{
		tag: "panel",
		attr: {
			brand: ['default','primary','success','info','warning','danger'],
			collapse: ' collapse',
			collapsed : ' collapse in',
			accordion : ' data-parent="#%val%"',
		},
		attrDefault: {
			brand: 'default',
		},
		html: function(a) {
			//grap any header there is
			if(a.obj.find('h1,h2,h3,h4,h5,h6,header,hgroup').length == 0 && (a.attr.collapse || a.attr.collapsed)) a.obj.prepend('<h4 empty>&nbsp;</h4>');
			return '<div class="panel panel-%brand%">%html%</div>';
		},
		inner: [{
			tag: "h1,h2,h3,h4,h5,h6,header,hgroup",
			attr: ['empty'],
			attrInherit: ['collapse','collapsed','accordion'],
			first: function(a) {
				var id = a.parent.id();
				if(a.attr.empty) {
					if(a.attr.collapse) return ['','<div class="panel-heading" role="tab" id="'+id+'-head"><a data-toggle="collapse"%accordion% href="#'+id+'" aria-expanded="true" aria-controls="'+id+'"><%tag% class="panel-title" %attr%>%html%</%tag%></a></div>'];
					else if(a.attr.collapsed) return ['','<div class="panel-heading" role="tab" id="'+id+'-head"><a data-toggle="collapse"%accordion% href="#'+id+'" aria-expanded="false" aria-controls="'+id+'"><%tag% class="panel-title" %attr%>%html%</%tag%></a></div>'];
					else return ['','<div class="panel-heading"><%tag% class="panel-title" %attr%>%html%</%tag%></div>'];
				} else {
					if(a.attr.collapse) return ['','<div class="panel-heading" role="tab" id="'+id+'-head"><%tag% class="panel-title" %attr%><a data-toggle="collapse"%accordion% href="#'+id+'" aria-expanded="true" aria-controls="'+id+'">%html%</a></%tag%></div>'];
					else if(a.attr.collapsed) return ['','<div class="panel-heading" role="tab" id="'+id+'-head"><%tag% class="panel-title" %attr%><a data-toggle="collapse"%accordion% href="#'+id+'" aria-expanded="false" aria-controls="'+id+'">%html%</a></%tag%></div>'];
					else return ['','<div class="panel-heading"><%tag% class="panel-title" %attr%>%html%</%tag%></div>'];				
				}
			},
		},
		{
			tag: "footer",
			last: ['','','<div class="panel-footer" %attr%>%html%</div>'],
		},
		{
			html: function(a) {
				var elems = a.obj.find('> *');
				var tables = a.obj.find('> table');
				var lists = a.obj.find('> list');
				if(elems.length == 1 && (tables.length || lists.length)) {
					return '%html%';
				} else if(lists.length == 1 && elems.last().is(lists.eq(0))) {
					var text = lists.eq(0)[0].outerHTML;
					lists.eq(0).remove();
					return '<div class="panel-body">%html%</div>'+text;	
				} else if(tables.length == 1 && elems.last().is(tables.eq(0))) {
					var text = tables.eq(0)[0].outerHTML;
					tables.eq(0).remove();
					return '<div class="panel-body">%html%</div>'+text;	
				} else {
					return '<div class="panel-body">%html%</div>';	
				}
			},
		},
		{
			attrInherit: ['collapse','collapsed','accordion'],
			html: function(a) {
				var id = a.parent.id();
				if(a.attr.collapse) return '<div id="'+id+'" class="panel-collapse collapse in" role="tabpanel" aria-labelledby="'+id+'-head">%html%</div>';
				else if(a.attr.collapsed) return '<div id="'+id+'" class="panel-collapse collapse" role="tabpanel" aria-labelledby="'+id+'-head">%html%</div>';
				else return '%html%';
			},
		},
		],
	},

	
	// Collapse
	
	{
		tag: "a[collapse],btn[collapse]",
		attr: ['collapse'],
		html: function(a) {
			var id = a.attr.collapse.replace(/^#/,''),
				target = a.parent.obj.find('#'+id);
			if(target.length) {
				var text = (a.tag == "a") ? '<a href="#' : '<btn data-target="#';
				var ob = target.eq(0);
				if(ob.attr('collapse') !== undefined) {
					return text + id + '" data-toggle="collapse" aria-expanded="false" aria-controls="'+id+'" %attr%>%html%</%tag%>'
				} else if(ob.attr('collapsed') !== undefined) {
					return text + id + '" data-toggle="collapse" aria-expanded="true" aria-controls="'+id+'" %attr%>%html%</%tag%>'
				} else {
					ob.attr('collapsed','');
					return text + id + '" data-toggle="collapse" aria-expanded="true" aria-controls="'+id+'" %attr%>%html%</%tag%>'
				}
			} else {
				// err - couldn't find target
				//donsole.log("err - couldn't find target");
				
			}
		},
	},
	{
		tag: "*[collapse]",
		attr: ['collapse'],
		html: '<%tag% class="collapse in" aria-expanded="true" %attr%>%html%</%tag%>',
	},
	{
		tag: "*[collapsed]",
		attr: ['collapsed'],
		html: '<%tag% class="collapse" aria-expanded="false" %attr%>%html%</%tag%>',
	},
   
 	

	// Carousel
	
	{
		tag: "carousel",
		attr: {
			'auto': ' data-ride="carousel"',
			'no-controls': '',
			'no-left' : '',
			'no-right': '',
			'no-indicators':'',
		},
		attrDefault: {
			'no-indicators': function(a) {
				var length = a.obj.find(' > slide').length;
				if(length) {
					var text = ['\n<ol class="carousel-indicators">\n\t<li data-target="#%id%" data-slide-to="0" class="active"></li>'];
					for(var i=1;i<length;i++) {
						text.push('\n\t<li data-target="#%id%" data-slide-to="'+i+'"></li>')
					}
					text.push('\n</ol>');
					return text.join('');
				} else return "";
			},
			'no-left': '\n<a class="left carousel-control" href="#%id%" role="button" data-slide="prev"><span class="glyphicon glyphicon-chevron-left" aria-hidden="true"></span><span class="sr-only">Previous</span></a>\n',
			'no-right': '\n<a class="right carousel-control" href="#%id%" role="button" data-slide="next"><span class="glyphicon glyphicon-chevron-right" aria-hidden="true"></span><span class="sr-only">Next</span></a>\n',
		},
		html: function(a) {
			if(a.obj.find('> slide[active]').length == 0 && a.obj.find('> slide').length) a.obj.find('> slide').first().attr('active','');
			if(a.attr["no-controls"]) return '<div id="%id%" class="carousel slide"%auto% %attr%>%no-indicators%\n<div class="carousel-inner" role="listbox">%html%</div></div>';
			else return '<div id="%id%" class="carousel slide"%auto% %attr%>%no-indicators%\n<div class="carousel-inner" role="listbox">%html%</div>%no-left%%no-right%</div>';
		},
		inner: [{  
				tag: " > slide",
				attr: {'active':' active'},
				html: '<div class="item%active%">%html%</div>',
				inner: [
					{  
						tag: "capt",
						html: '<div class="carousel-caption">%html%</div>',
					},
				],
		},
		],
	},

	
	// Affix
	
	{
		tag: "*[affix],*[affix-top],*[affix-bottom]",
		attr: ['affix','affix-top','affix-bottom','target','css-top','css-bottom','gap-top','gap-bottom'],
		html: function(a) {
			//yonsole.log('affixing '+a.index+JSON.stringify(a.attr));
			var top = a.attr["affix"] || a.attr["affix-top"],
				bottom = a.attr["affix-bottom"],
				html = '<div id="%id%-wrap"><%tag% id="%id%" %attr%>%html%</%tag%></div>',
				js = "$('#%id%').affix({offset:{",
				css = "";
			//var id = a.id();
			if(top === true) {
				js += "top: $('#%id%-wrap').offset().top"+(a.attr['gap-top'] ? ' - '+a.attr['gap-top'] : "" ) + ",";
			} else if(top.match(/^\s*[0-9]+\s*$/)) {
				js += 'top: '+top+',';
			} else if(top.length) {
				js += "top: $('"+top+"').offset().top,";
			} else {
				// err
			}
			if(bottom) {
				if(bottom === true) {
					js += 'bottom:0,';
				} else if(bottom.match(/^\s*[0-9]+\s*$/)) {
					js += 'bottom:'+bottom+',';
				} else if(bottom.length) {
					js += "bottom: ( $(document).height() - $('"+bottom+"').offset().top"+(a.attr['gap-bottom'] ? ' + '+a.attr['gap-bottom'] : '' )+"),";
				}
			}
			js += "},";
			if(a.attr.target) js += 'target: "'+a.attr.target+'",';
			js += "});";
				
			if(a.attr["css-top"]) {
				if(a.attr["css-top"] !== true && a.attr["css-top"].length) {
					css += "#%id%.affix {position:fixed !important;"+a.attr["css-top"]+"}\n";
				}
			} else if(a.attr['gap-top']) {
				css += "#%id%.affix {position:fixed !important;top:"+a.attr['gap-top']+"px;}\n";
			} else css += "#%id%.affix {position:fixed !important;top:0}\n";
		  
			if(a.attr["css-bottom"]) {
				if(a.attr["css-bottom"] !== true && a.attr["css-bottom"].length) {
					css += "#%id%.affix-bottom {"+a.attr["css-bottom"]+"}\n";
				}
			} else css += "#%id%.affix-bottom {position:absolute;}\n";

			if(js.length) {
				var sizeJS = "$('#%id%-wrap').css('height',$('#%id%').height()+'px').css('width',$('#%id%').width()+'px');"
				 + "\n$('#%id%').css('height',$('#%id%-wrap').height()+'px').css('width',$('#%id%-wrap').width()+'px');";
				//a.global["jquery"] += sizeJS+"\n$('#%id%').affix().data('bs.affix').options.offset = {"+js+"};";
				//a.global["jquery-resize"] += sizeJS;
				return {
					html:html,
					css:css,
					js:[{
						require: ['bootstrap'],
						code: sizeJS+"\n"+js+"\n$(window).on('resize.affix',function() {"+sizeJS+" }); ",
						out: "$(window).off('resize.affix');"
					}],
				};
			}
			// all done
			else return {html:html,css:css};
		},
	},

	// ScrollSpy
	// (put near the end?)
	{
		tag: "*[spy]",
		attr: ['spy'],
		html: function(a) {
			//add <$tag$ data-spy="scroll" data-target="$spy$"
			//donsole.log('spy');
			var spy = a.attr.spy === true ? 'body' : a.attr.spy;
			var anchor = a.$(spy).first();
			var id = a.id();
			if(anchor.length) {
				if(anchor.attr('data-spy') == "scroll") {
					anchor.removeAttr('data-target');
				} else {
					anchor.attr('data-spy','scroll').attr('data-target','#'+id+'-spy');
				}
			} else {
				//console.log('error - ScrollSpy - cannot find anchor: '+a.attr.spy);
				return '<%tag% spy="%spy%" %attr%>%html%</%tag%>';
			}
			if(a.tag == "ul") return '<div id="%id%-spy"><ul class="nav" %attr%>%html%</ul></div>';
			else return '<div id="%id%-spy"><%tag% %attr%>%html%</%tag%><div id="%id%-spy">';
		},
	},

	
	
	
	
	
	
	
	
	
	
/* ------------------------
   ------------------------
	    Components
   ------------------------ 
   ------------------------ */

	
	// Glyphicons
	
	{
		tag: "icon",
		single: true,
		attr: {
			'sr': '<span class="sr-only">%val%</span>',
			'icon-type' : ['asterisk','plus','euro','eur','minus','cloud','envelope','pencil','glass','music','search','heart','star','star-empty','user','film','th-large','th','th-list','ok','remove','zoom-in','zoom-out','off','signal','cog','trash','home','file','time','road','download-alt','download','upload','inbox','play-circle','repeat','refresh','list-alt','lock','flag','headphones','volume-off','volume-down','volume-up','qrcode','barcode','tag','tags','book','bookmark','print','camera','font','bold','italic','text-height','text-width','align-left','align-center','align-right','align-justify','list','indent-left','indent-right','facetime-video','picture','map-marker','adjust','tint','edit','share','check','move','step-backward','fast-backward','backward','play','pause','stop','forward','fast-forward','step-forward','eject','chevron-left','chevron-right','plus-sign','minus-sign','remove-sign','ok-sign','question-sign','info-sign','screenshot','remove-circle','ok-circle','ban-circle','arrow-left','arrow-right','arrow-up','arrow-down','share-alt','resize-full','resize-small','exclamation-sign','gift','leaf','fire','eye-open','eye-close','warning-sign','plane','calendar','random','comment','magnet','chevron-up','chevron-down','retweet','shopping-cart','folder-close','folder-open','resize-vertical','resize-horizontal','hdd','bullhorn','bell','certificate','thumbs-up','thumbs-down','hand-right','hand-left','hand-up','hand-down','circle-arrow-right','circle-arrow-left','circle-arrow-up','circle-arrow-down','globe','wrench','tasks','filter','briefcase','fullscreen','dashboard','paperclip','heart-empty','link','phone','pushpin','usd','gbp','sort','sort-by-alphabet','sort-by-alphabet-alt','sort-by-order','sort-by-order-alt','sort-by-attributes','sort-by-attributes-alt','unchecked','expand','collapse-down','collapse-up','log-in','flash','log-out','new-window','record','save','open','saved','import','export','send','floppy-disk','floppy-saved','floppy-remove','floppy-save','floppy-open','credit-card','transfer','cutlery','header','compressed','earphone','phone-alt','tower','stats','sd-video','hd-video','subtitles','sound-stereo','sound-dolby','sound-5-1','sound-6-1','sound-7-1','copyright-mark','registration-mark','cloud-download','cloud-upload','tree-conifer','tree-deciduous','cd','save-file','open-file','level-up','copy','paste','alert','equalizer','king','queen','pawn','bishop','knight','baby-formula','tent','blackboard','bed','apple','erase','hourglass','lamp','duplicate','piggy-bank','scissors','bitcoin','yen','ruble','scale','ice-lolly','ice-lolly-tasted','education','option-horizontal','option-vertical','menu-hamburger','modal-window','oil','grain','sunglasses','text-size','text-color','text-background','object-align-top','object-align-bottom','object-align-horizontal','object-align-left','object-align-vertical','object-align-right','triangle-right','triangle-left','triangle-bottom','triangle-top','console','superscript','subscript','menu-left','menu-right','menu-down','menu-up'],
			'2x': ' style="font-size:2em;"',
			'3x': ' style="font-size:3em;"',
			'4x': ' style="font-size:4em;"',
			'5x': ' style="font-size:5em;"',
		},
		html: function(a) {
			if(a.attr["icon-type"]) return '<span class="glyphicon glyphicon-%icon-type%" aria-hidden="true" %2x%%3x%%4x%%5x%>%sr%</span>';
			else {
				var text = '<!-- invalid Glyphicon: ';
				for(var i in a.attrOther) {
					if(a.attrOther[i]===true) text += i+' ';
					else text += i+'="'+a.attrOther[i]+'" ';
				}
				return text + ' -->';
			}
		},
	 
	},
	
	// Button Groups
	{
		tag: "btn-toolbar",
		attr: {
			size : ['lg','sm','xs'],
			brand: ['default','primary','success','info','warning','danger','link'],		
			vertical: ' vertical',
			justified: ' justified',
			label: ' aria-label="%val%"',         
		},
		html: '<div class="btn-toolbar" role="toolbar" %label% %attr%>%html%</div>',
		inner: [{
			tag: " > btn-group",
			attrInherit: ['size','brand','vertical','justified'],
			html: "<btn-group %size% %brand%%vertical%%justified% %attr%>%html%</btn-group>",
		}
		],
	},

	{
		tag: "btn-group",
		attr: {
			'size' : ['lg','sm','xs'],
			'brand': ['default','primary','success','info','warning','danger','link'],
		},
		html: '<btn-group %size% %brand% %attr%>%html%</btn-group>',
		inner: [{
			tag: "btn-group",
			nested: true,
			attrInherit: ['size','brand'],
			html: '<btn-group %size% %brand% %attr%>%html%</btn-group>',
		}],
	},
			

	
	{
		tag: "btn-group",
		nested: true,
		attr: {
			'vertical': 'btn-group-vertical',
			'justified':' btn-group-justified',
			'label':' aria-label="%val%"',         
			'size' : ['lg','sm','xs'],
			'brand': ['default','primary','success','info','warning','danger','link'],
		},
		attrDefault: {
			'vertical': 'btn-group',
		},
		html: function(a) {
			var size = a.attr.size ? ' btn-group-%size%' : ''
			return '<div class="%vertical%%justified%'+size+'" role="group" %label% %attr%>%html%</div>';
		},
		inner: [
		{
			tag: " > btn, > button, > a[btn]",
			attrInherit: ['brand','justified'],
			html: function(a) {
				if(a.attr.justified) {
					return ' <div class="btn-group" role="group"><%tag% %brand% %attr%>%html%</%tag%></div>';				
				} else {				
					return '<%tag% %brand% %attr%>%html%</%tag%>';
				}
			},
		},
		],
	},
	


   
	// Navs
	
	{
		tag: "tabs,pills",
		attr: {
			'justified' : ' nav-justified',
			'vertical': ' nav-stacked',
		},
		html: function(a) {
			var text = "";
			return '<ul class="nav nav-%tag%%justified%%vertical%" %attr%>%html%'+text+'</ul>';      
		},
		inner: [
		{
			tag: "a",
			attr: {'active': ' class="active"'},
			html: function(a) {
				if(a.obj.parent().prop('tagName') !== "LI") return '<li role="presentation"%active%><a %attr%>%html%</a></li>';
				else return "<a %active% %attr%>%html%</a>";
			},
		},
		],
	},

	
	// Breadcrumbs

	{
		tag: "breadcrumb",
		html: '<ol class="breadcrumb">%html%</ol>',
		inner: [ {
				tag: 'a',
				html: '<li><a %attr%>%html%</a></li>',
				last: function(a) {
					if(a.obj.attr('href')) return '<li class="active"><a %attr%>%html%</a></li>';
					else return '<li class="active">%html%</li>';
				}
			}],		 
	},


	// Pagination
	
	{
		tag: "pagination",
		attr: {
			'prev': '%val%',
			'next': '%val%',
			'prev-disabled':' class="disabled"',
			'next-disabled':' class="disabled"',
			'lg': ' pagination-lg',
			'sm': ' pagination-sm',
		},
		attrDefault: {
			'prev': '#',
			'next': '#',
		},
		html: '<nav %attr%><ul class="pagination%lg%%sm%"><li%prev-disabled%><a href="%prev%" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a></li>%html%<li%next-disabled%><a href="%next%" aria-label="Next"><span aria-hidden="true">&raquo;</span></a></li></ul></nav>',
		inner: [
		{
			tag: "a",
			attr: ['disabled','active'],
			html: function(a) {
				if(a.attr.disabled) {
					return '<li class="disabled"><a %attr%>%html%</a></li>';
				} else if(a.attr.active) {
					return '<li class="active"><a %attr%>%html% <span class="sr-only">(current)</span></a></li>';
				} else return '<li><a %attr%>%html%</a></li>';
			},	 
		}],
	},


	{ 
		tag: "pager",
		attr: {
			'lg': ' pagination-lg',
			'sm': ' pagination-sm',
			'align': '',
		},
		html: function(a) {
			if(a.obj.find('a').length) return '<nav %attr%><ul class="pagination%lg%%sm%">%html%</ul></nav>';
			return '<nav %attr%><ul class="pager%lg%%sm%">%html%</ul></nav>';
		},
		inner: [{
			tag: "prev",
			attr: {
				state: ['active','disabled'],
			},
			attrInherit: {
				align: 'previous',
			},
			html: function(a) {
				var text = a.obj.html();
				if(text.match(/^\s*$/m)) text = '&laquo;';
				var li = (a.attr.align || a.attr.state) ? ( (a.attr.align && a.attr.state) ? 
					'<li class="%align% %state%">' : '<li class="%align%">' ) : '<li>';
				return li+'<a aria-label="Previous" %attr%><span aria-hidden="true">'+text+'</span></a></li>';
			},
		},
		{
			tag: "next",
			attr: {
				state: ['active','disabled'],
			},
			attrInherit: {
				align: 'next',
			},
			html: function(a) {
				var text = a.obj.html();
				if(text.match(/^\s*$/m)) text = '&raquo;';
				var li = (a.attr.align || a.attr.state) ? ( (a.attr.align && a.attr.state) ? 
					'<li class="%align% %state%">' : '<li class="%align%">' ) : '<li>';
				return li+'<a aria-label="Next" %attr%><span aria-hidden="true">'+text+'</span></a></li>';
			},
		},
		{
			tag: " > a",
			attr: {
				state: ['disabled','active'],
			},
			html: function(a) {
				if(a.attr.state) return '<li class="%state%"><a %attr%>%html%</a></li>';
				return '<li><a %attr%>%html%</a></li>';
			},
		},],
	},
	

	// Labels
	
	{
		tag: "lbl",
		attr: {
			brand: ['default','primary','success','info','warning','danger']
		},
		attrDefault: {brand: 'default'},
		html: '<span class="label label-%brand%" %attr%>%html%</span>',
	},


	// Badges
	
	{
		tag: "badge",
		html: '<span class="badge" %attr%>%html%</span>',
	},
	
  
	// Jumbotron
	
	{
		tag: "jumbotron",
		html: '<div class="jumbotron" %attr%>%html%</div>',
	},

	
	// Page Header
	
	{
		tag: "h1[page],h2[page],h3[page],h4[page],h5[page],h6[page]",
		attr: ['page'],
		html: '<div class="page-header"><%tag% %attr%>%html%</%tag%></div>',
	},


	// Thumbnails

   {
		tag: "thumbnails",
		html: "<%tag% %attr%>%html%</%tag%>",
		inner: [
		{
			tag: " > img",
			html: "<thumb><img %attr%></thumb>%html%",
		},
		{
			tag: " > a",
			html: "<thumb><a %attr%>%html%</a></thumb>",
		},
		],
	},

	{
		tag: "thumbnails",
		//attr: {'cols':' cols="%val%"','xs':' xs="%val%"','sm':' sm="%val%"','md':' md="%val%"','lg':' lg="%val%"'},
		attr: {
			'xs': ' xs="%val%"',
			'sm': ' sm="%val%"',
			'md': ' md="%val%"',
			'lg': ' lg="%val%"',
		},
		html: function(a) {
			if(!a.attr.xs && !a.attr.sm && !a.attr.md && !a.attr.lg) {
				a.attr.xs = "6";
				a.attr.sm = "4";
				a.attr.md = "3";
				a.attr.lg = "2";
			}
			return "<row>%html%</row>";
		},
		inner: [
		{
			tag: "thumb",
			attrInherit: ['xs','sm','md','lg'],
			html: '<column %xs%%sm%%md%%lg%><div class="thumbnail" %attr%>%html%</div></column>',
			inner: [
			{
				tag: "a",
				html: function(a) {
					if(a.obj.find('img')) return ['','<a %attr%>%html%</a>'];
					else return "<a %attr%>%html%</a>";
				},
			},
			{
				tag: "img",
				html: ['','<img %attr%>%html%'],
			},
			{
				html: function(a) {
					if(a.html.match(/^\s*$/m)) return '';
					else return '<div class="caption">%html%</div>';
				},
			},
			],
		},
		],
	},

	
	// Alerts
	
	{
		tag: "alert",
		attr: {
			brand: ['success','info','warning','danger'],
			close: '',
		},
		attrDefault: {
			brand: 'danger',
		},
		html: function(a) {
			if(a.attr.close) {
				return '<div class="alert alert-%brand% alert-dismissible fade in" role="alert" %attr%><close data-dismiss="alert">%html%</div>';
			} else {
				return '<div class="alert alert-%brand%" role="alert" %attr%>%html%</div>';
			}
		},
		inner: [
		{
			tag: "a",
			html: '<a class="alert-link" %attr%>%html%</a>',
		}
		],
	},


	// Progress
	
	{
		tag: "progress",
		attr: {
			brand: ['success','info','warning','danger'],
			val: '%val%',
			max: '%val%',
			min: '%val%',
			label: '',
			striped: ' progress-bar-striped',
			animated: ' active',
		},
		attrDefault: {
			label: ' class="sr-only"',
			max: '100',
			min: '0',
		},
		html: function(a) {
			var brand = a.attr.brand ? ' progress-bar-%brand%' : '';
			var label = a.attr.label ? ';min-width:2em' : '';
			return '<div class="progress"><div class="progress-bar'+brand+'%striped%%animated%" role="progressbar" aria-valuenow="%val%" aria-valuemin="%min%" aria-valuemax="%max%" style="width: %val%%'+label+'"><span%label%>%val%%</span></div></div>';
		},
	},
	
	
	// List (may be media, link or li)

	{
		tag: "list",
		html: function(a) {
			if(a.obj.find(' > li').length) return '<list li %attr%>%html%</list>';
			if(a.obj.find(' > media').length) return '<list media %attr%>%html%</list>';
			if(a.obj.find(' > a').length) return '<list a %attr%>%html%</list>';
			else return '<list %attr%>%html%</list>';
		},
	},
	
	
	// Media

	{
		tag: "list[media]",
		attr: {
			vertical: ['top','middle','bottom'],
			horizontal: ['left','right'],
		},
		html: '<ul class="media-list">%html%</ul>',
		inner: [{
			tag: " > media",
			html: '<media li %attr%>%html%</media>',
		},
		{
			tag: "list[media],media",
			nested: true,
			attrInherit: ['vertical','horizontal'],
			html: function(a) {
				if(a.tag == "list") return '%html%';
				else return '<%tag% %vertical% %horizontal% %attr%>%html%</%tag%>';
			},
		}],
	},
	{
		tag: "media",
		nested: true,
		attr: {
			vertical: ['top','middle','bottom'],
			horizontal: ['left','right'],
			li: '',
		},
		attrDefault: {
			horizontal: 'left',
		},
		html: function(a) {
			if(a.attr.li) return '<li class="media">%html%</li>';
			else return '<div class="media">%html%</div>';
		},
		inner:[{
			tag: " > img",
			attrInherit: ['horizontal','vertical'],
			html: function(a) {
				var vertical = (a.attr.vertical && a.attr.vertical !== 'top') ? ' media-'+a.attr.vertical : '';
				if(a.attr.horizontal == 'right') return ['','','<div class="media-right'+vertical+'"><img class="media-object" %attr%></div>'];
				else return ['','<div class="media-left'+vertical+'"><img class="media-object" %attr%></div>'];
			},
		},
		{
			html: function(a) {
				var vertical = a.parent.attr.vertical ? ' media-' + a.parent.attr.vertical : '';
				return '<div class="media-body'+vertical+'">%html%</div>'
			},
		},
		{
			tag: "> h1,> h2,> h3,> h4,> h5,> h6,> hgroup,> header",
			first: '<%tag% class="media-header" %attr%>%html%</%tag%>',
		},
		],
	},
		   
	
	// List Groups


	{
		tag: "list[li]",
		attr: ['li'],
		html: '<ul class="list-group" %attr%>%html%</ul>',
		inner: [
		{
			tag: " > li",
			attr: {
				brand: ['success','info','warning','danger'],
				disabled: ' disabled',
				active: ' active',
			},
			html: function(a) {
				var brand = a.attr.brand ? ' list-group-item-%brand%' : '';
				return '<li class="list-group-item'+brand+'%disabled%%active%" %attr%>%html%</li>';
			},
			inner: [
			{
				tag: "p",
				html: '<p class="list-group-item-text" %attr%>%html%</p>',
			},
			{
				tag: "h1,h2,h3,h4,h5,h6",
				html: '<%tag% class="list-group-item-header" %attr%>%html%</%tag%>',
			},
			]
		},
		]
	},
	
	{
		tag: "list[a]",
		attr: ['a'],
		html: '<div class="list-group" %attr%>%html%</div>',
		inner: [
		{
			tag: " > a",
			attr: {
				disabled: ' disabled',
				active: ' active',
				brand: ['success','info','warning','danger'],
			},
			html: function(a) {
				var brand = a.attr.brand ? ' list-group-item-%brand%' : '';
				return '<a class="list-group-item'+brand+'%active%%disabled%" %attr%>%html%</a>';
			},
			inner: [
			{
				tag: "p",
				html: '<p class="list-group-item-text" %attr%>%html%</p>',
			},
			{
				tag: "h1,h2,h3,h4,h5,h6",
				html: '<%tag% class="list-group-item-header" %attr%>%html%</%tag%>',
			},
			],
		},
		],
	},
	
	
	// Responsive Embeds
	{
		tag: "responsive",
		attr: ['ratio'],
		html: function(a) {
			var ratio = a.attr.ratio.match(/4[\/x]3/) ? '4by3' : '16by9';
			return '<div class="embed-responsive embed-responsive-'+ratio+'">%html%</div>';
		},
		inner: [
		{
			tag: "iframe,video,embed,object",
			html: '<%tag% class="embed-responsive-item" %attr%>%html%</%tag%>',
		},
		]
	},
	
	// Wells
	{
		tag: "well",
		attr: {
			'lg':' well-lg',
			'sm':' well-sm'
		},
		html: '<div class="well%sm%%lg%" %attr%>%html%</div>',
	},
	










	
/* ------------------------
   ------------------------
	         CSS
   ------------------------ 
   ------------------------ */


	// Container
	
	{
		tag: "container",
		attr: {'fluid':'-fluid'},
		html: '<div class="container%fluid%" %attr%>%html%</div>',
	},

	
	// Grid System
	
	{
		tag: "row",
		nested: true,
		attr: ['xs','sm','md','lg'],
		html: function(a) {
			//get all the sizes
			if(a.first) a.global.columns = {
			'xs': {size: [], offset: [], push: [], pull: [],'less': "",'lessSuffix':""},
			'sm': {size: [], offset: [], push: [], pull: [],'less': "",'lessSuffix':""},
			'md': {size: [], offset: [], push: [], pull: [],'less': "",'lessSuffix':""},
			'lg': {size: [], offset: [], push: [], pull: [],'less': "",'lessSuffix':""},
			};
			var cols = a.obj.find(' > column'),
				length = cols.length;

			var sizes = ['xs','sm','md','lg'];
			sizes
				.filter(function(b) { return a.attr[b]; })
				.forEach(function(b) {
					cols.each(function() {
						if(a.$(this).attr(b) === undefined) a.$(this).attr(b,a.attr[b]);
					});
				});
			var specifiedLength = a.obj.find(' > column[xs], > column[sm], > column[md], > column[lg]').length;
			if(specifiedLength == 0 && length > 0) {
				//just give all the same
				var tempSize = parseInt(12/length);
				if(tempSize*length !== 12) {
					//donsole.log('err odd number of columns ('+length+')');
					tempSize = "1-"+length;
				}
				cols.each(function() {
					a.$(this).attr('xs',tempSize);
				});
			}
			//go through each size, see if there is a size, see if there's an order
			//work your way up, if you don't have a size, apart from earlier
			//what you want is the right pushes and pulls
			// and the line breaks,
			var data = new Array(4);
			sizes.forEach(function(b,c) {
				data[c] = {
					row: [[]],
					order: 0,
					attr: 0
				};
				var currentRow = 0,
					totalWidth = 0,
					totalWidthNum = 0,
					totalWidthDen = 12;
				cols.each(function(index) {
					var attr = a.$(this).attr(b);
					if(attr !== undefined) {
						data[c].attr++;
						var offset = parseInt(a.$(this).attr(b+'-offset')) || 0;
						var order = parseInt(a.$(this).attr(b+'-order')) || 0;
						var currentLeft;
						if(order) data[c].order++;
						
						var currentWidth, currentDen;
						if(attr.match(/^\s*([0-9]+)[-\/]([0-9]+)\s*$/)) {
							currentDen = parseInt(attr.replace(/^\s*([0-9]+)[-\/]([0-9]+)\s*$/,'$2'));
							currentWidth = (parseInt(attr.replace(/^\s*([0-9]+)[-\/]([0-9]+)\s*$/,'$1'))+offset) * 12 / currentDen;
							//donsole.log('currentDen: '+currentDen);
						} else {
							currentWidth = parseInt(attr) + offset;
							currentDen = 12;
						}
						if(totalWidth + currentWidth > 12) {
							currentRow++;
							data[c].row.push([]);
							totalWidth = currentWidth;
							currentLeft = 0;
						} else {
							currentLeft = totalWidth;
							totalWidth += currentWidth;
						}
						data[c].row[currentRow].push({
							width: currentWidth,
							left: currentLeft,
							size: parseInt(attr),
							offset: parseInt(offset),
							order: parseInt(order),
							denominator: currentDen,
							obj: a.$(this),
							index: index,
						});
					}
				});
			});
			
			var hasReorder = false;
			data.forEach(function(b,c) {
				//go through each size
				if(b.attr) {
					//this one is specified,
					//go through each row adding breakpoints
					var points = [sizes[c].replace(/(.*)/,'visible-$1-block')];
					for(var i=c+1;i<4;i++) {
						if(data[i].attr == 0) points.push(sizes[i].replace(/(.*)/,'visible-$1-block'));
						else break;
					}
					var breakpoint = '<div class="'+points.join(' ')+' clearfix"></div>';
					for(var i=1;i<b.row.length;i++) {
						b.row[i][0].obj.before(breakpoint);//+'<!-- '+sizes[c]+' -->');
					}
					// now check for ordering in each row
					b.row.forEach(function(d,e) {
						//for each row
						var isReordered = d.every(function(f) {
							return f.order;
						});
						if(isReordered) {
							//if all ordered
							d.sort(function(f,g) {
								return f.order - g.order;
							});
							var currentLeft = 0;
							d.forEach(function(f,g) {
								if(f.left > currentLeft) {
									f.obj.attr(sizes[c]+'-pull',Math.round((f.left-currentLeft)*f.denominator/12));
								} else if(hasReorder) {
									f.obj.attr(sizes[c]+'-pull','0');
								}
								if(currentLeft > f.left) {
									f.obj.attr(sizes[c]+'-push',Math.round((currentLeft-f.left)*f.denominator/12));
								} else if(hasReorder) {
									f.obj.attr(sizes[c]+'-push','0');
								}
								currentLeft += f.width;
							});
							hasReorder = true;
						
						} else if(hasReorder) {
							//a previous one was reordered, so reset.
							d.forEach(function(f,g) {
								f.obj.attr(sizes[c]+'-pull','0').attr(sizes[c]+'-push','0');
							});
						}
					});
				}
			});
			return '<div class="row" %attr%>%html%</div>';
		},

		inner: [
			{
				tag: ' > column',
				attr: [
					'xs','sm','md','lg',
					'xs-offset','sm-offset','md-offset','lg-offset',
					'xs-push','sm-push','md-push','lg-push',
					'xs-pull','sm-pull','md-pull','lg-pull',
					'xs-order','sm-order','md-order','lg-order',
				],
				html: function(a) {
					//if(a.attr['md-order']) yonsole.log('md order ' + a.attr['md-order'])
					var sizes = ['xs','sm','md','lg'];
					var suffix = ['offset','push','pull'];
					var oddColumns = sizes.filter(function(b) {
						return a.attr[b] && a.attr[b].match(/^\s*[0-9]+[-\/][0-9]+\s*$/);
					});
					if(oddColumns.length) {
						oddColumns.forEach(function(b) {
							//donsole.log('odd size');
							var start = parseInt(a.attr[b].replace(/^\s*([0-9]+)[-\/]([0-9]+)\s*$/,'$1'));
							var end = parseInt(a.attr[b].replace(/^\s*([0-9]+)[-\/]([0-9]+)\s*$/,'$2'));
							if( a.global.columns[b].size.indexOf(a.attr[b]) == -1) {
							//donsole.log('odder size');
								a.global.columns[b].size.push(a.attr[b]);
								var ratio = 12 * start / end;
								var less = ".col-"+b+"-"+start+"-"+end+" { .make-"+b+"-column("+ratio+"); } \n";
								//a.global.less += less;
								a.global.columns[b].less += less;
								//donsole.log('less added: '+less);
							}
							//now do the same for offset
							suffix.forEach(function(c) {
								var d = a.attr[b+'-'+c];
								if(d) {
									var ratio = 12 * parseInt(d) / end;
									if(ratio>0) {
									if(!d.match(/^\s*([0-9]+)[-\/]([0-9]+)\s*$/)) d = d + '-'+ end;
									a.attr[b+'-'+c] = d;
									//set it to "-"
									if(a.global.columns[b][c].indexOf(d) == -1 ) {
										a.global.columns[b][c].push(d);
										var less = ".col-"+b+"-"+c+"-"+d+" { .make-"+b+"-column-"+c+"("+ratio+"); } \n";
										//a.global.less += less;
										a.global.columns[b].lessSuffix += less;
										//donsole.log('less added '+less);
									}
									} 
								}
							});	
							
						});
					}
					var result = [];
					sizes.forEach(function(s) {
						if(a.attr[s]) result.push('col-'+s+'-'+a.attr[s].replace(/\//,'-'));
						//var end = parseInt(a.attr[s].replace(/^\s*([0-9]+)[-\/]([0-9]+)\s*$/,'$2'));
						suffix.forEach(function(t) {
							if(a.attr[s+'-'+t]) {
								if(a.attr[s+'-'+t]=="0-") result.push('col-'+s+'-'+t+'-'+a.attr[s+'-'+t]);
								else result.push('col-'+s+'-'+t+'-'+a.attr[s+'-'+t]);
							}
						});
					});
					return '<div class="'+result.join(' ')+'" %attr%>%html%</div>';
				},
			},
		]
	},


	// Typography

	{
		tag: "p,h1,h2,h3,h4,h5,h6",
		attr: {
			'lead': 'lead',
			'alignment': 'text-%val%',
			'nowrap': 'text-nowrap',
			'capital': 'text-%val%',
		},
		attrType: {
			'alignment':	['left','right','center','justify'],
			'capital': ['lowercase','uppercase','capitalize'],
		},
		html: function(a) {
			var text = [];
			for(var i in a.attr) {
				if(a.attr[i]) text.push('%'+i+'%');
			}
			if(text.length) return '<%tag% class="'+text.join(' ')+'" %attr%>%html%</%tag%>';
			else return '<%tag% %attr%>%html%</%tag%>';
		}
 
	},
	
	{
		tag: "blockquote",
		attr: {'reverse':' class="blockquote-reverse"'},
		html: '<blockquote%reverse% %attr%>%html%</blockquote>',
		inner: [ {
			tag: "> cite",
			html: '<footer><cite %attr%>%html%</cite></footer>',
		},
		{
			tag: "cite",
			attr: ['title'],
			attrDefault: {
				'title': '%text%'
			},
			html: '<cite title="%title%" %attr%>%html%</cite>',
			
		}],
	},

	{
		tag: "ul[unstyled], ul[inline]",
		attr: {
			'unstyled': 'list-unstyled',
			'inline':' list-inline',
		},
		html: '<ul class="%unstyled%%inline%" %attr%>%html%</ul>',
	},

	{
		tag: "dl[horizontal]",
		attr: {"horizontal":"dl-horizontal"},
		html: '<dl class="%horizontal%" %attr%>%html%</dl>',
	},


	// Tables
	
	{
		tag: "table:not(.table)",
		attr: {
			'striped': ' table-striped',
			'bordered': ' table-bordered',
			'hover': ' table-hover',
			'condensed': ' table-condensed',
			'responsive': '',
		},
		html: function(a) {
			var text = '<table class="table%striped%%bordered%%hover%%condensed%" %attr%>%html%</table>';
			if(a.attr.responsive) return '<div class="table-responsive">'+text+'</div>';
			else return text;
		},
		inner: [
		{
			tag: "tr,td,th",
			attr: {
				brand: ['active','info','success','warning','danger'],
			},
			html: function(a) {
				if(a.attr.brand) return '<%tag% class="%brand%" %attr%>%html%</%tag%>';
				else return "<%tag% %attr%>%html%</%tag%>";
			},
		},
		],
	},


	// Forms
	
	{
		tag: "form:not(.form)",
		attr: {
			'inline': ' class="form-inline"',
		},
		html: '<form%inline% %attr%>%html%</form>',
		inner: [
		{
			tag: "grid",
			attr: ['md','lg','octoml-offset','octoml-text','octoml-label','size'],
			html: function(a) {
				var sizes = ['md','lg'];
				var label = [], text = [], offset = [];
				sizes.forEach(function(b) {
					if(a.attr[b]) {
						var grid = a.attr[b].split(',');
						if(grid.length==2) {
							text.push('col-'+b+'-'+grid[1]);
							label.push('col-'+b+'-'+grid[0]);
							offset.push('col-'+b+'-offset-'+grid[0]+' col-'+b+'-'+grid[1]);
						}
					}
				});
				a.attr['octoml-text'] = text.join(' ');
				a.attr['octoml-label'] = label.join(' ');
				a.attr['octoml-offset'] = offset.join(' ');
				//a.obj.find('check').each(function() {
					//$(this).attr('octoml-offset',cOffset);
				//});
				return '<div class="form-horizontal">%html%</div>';
			},
			inner: [
			{
				tag: "> :not(group):not(input):not(textarea):not(check):not(radio):not(select):not(p[label]):not(p[sr])",
				html: function(a) {
					return '<div class="'+a.parent.attr['octoml-offset']+'"><%tag% %attr%>%html%</%tag%></div>'
				}
			},
			{
				tag: " > p[label], > p[sr]",
				attr: ['label','sr'],
				html: function(a) {
					if(a.attr.label) {
						var sr = a.attr.sr ? ' <span class="sr-only">'+a.attr.sr+'</span>' : '';
						return '<div class="form-group">\n<label class="'+a.parent.attr["octoml-label"]+' control-label"	>\n%label%'+sr+'\n</label>\n<div class="'+a.parent.attr['octoml-text']+'"><p class="form-control-static" %attr%>%html%</p></div></div>';
					} else if(a.attr.sr) {
						return '<div class="form-group"><div class="'+a.parent.attr['octoml-offset']+'"><label class="sr-only">%sr%</label><p class="form-control-static" %attr%>%html%</p></div></div>';
					} else {
						return '<div class="form-group"><div class="'+a.parent.attr['octoml-offset']+'"><p class="form-control-static" %attr%>%html%</p></div></div>';
					}
				},
			},
			{
				tag: " > group",
				attr: {
					'label':'%val%',
					'octoml-size': ['lg','sm'],
				},
				html: function(a) {
					var size = a.attr["octoml-size"] ? ' form-group-'+a.attr["octoml-size"] : a.parent.attr.size ? ' form-group-'+a.parent.attr.size : '';
					if(a.attr.label) {
						return '<div class="form-group'+size+'">\n<label class="'+a.parent.attr["octoml-label"]+' control-label">\n%label%\n</label>\n<div class="'+a.parent.attr['octoml-text']+'"><group %attr%>%html%</group></div></div>';
					} else {
						return '<div class="form-group'+size+'"><div class="'+a.parent.attr['octoml-offset']+'"><group %attr%>%html%</group></div></div>';
					}
				},
			},
			{
				tag: " > input",
				attr: {
					'label': '%val%',
					'sr': '%val%',
					'placeholder': '%val%',
					'label-placeholder': '%val%',
					'sr-placeholder': '%val%',
					'placeholder-label': '%val%',
					'placeholder-sr': '%val%',
					'octoml-size': ['lg','sm'],
					'octoml-feedback': ['success','warning','error'],
					'icon': '%val%',
				},
				html: function(a) {
				
					var label = a.attr.label || a.attr["placeholder-label"] || a.attr["label-placeholder"] || "";
					var sr = a.attr.sr || a.attr["placeholder-sr"] || a.attr["sr-placeholder"] || "";
					var placeholder = a.attr.placeholder || a.attr["placeholder-label"] || a.attr["label-placeholder"] || a.attr["placeholder-sr"] || a.attr["sr-placeholder"] || "";
					
					var attr = (label ? ' label="'+label+'"' : '') + (sr ? ' sr="'+sr+'"' : '') + (placeholder ? ' placeholder="'+placeholder+'"' : '');						
					var feedback = a.attr["octoml-feedback"] ? ' has-'+a.attr["octoml-feedback"]+' has-feedback' : '';
					var passIcon = (a.attr["octoml-feedback"] && a.attr["icon"]) ? ' '+a.attr["octoml-feedback"]+'-icon' : '';
					var size = a.attr["octoml-size"] ? ' form-group-'+a.attr["octoml-size"] : a.parent.attr.size ? ' form-group-'+a.parent.attr.size : '';
					if(label) {
						var cSR = sr ? '<span class="sr-only">'+sr+'</span>' : '';
						var cPlaceholder = placeholder ? ' placeholder="'+placeholder+'"' : '';
						return '<div class="form-group'+size+feedback+'">\n<label class="'+a.parent.attr["octoml-label"]+' control-label" for="%id%">\n'+label+cSR+'\n</label>\n<div class="'+a.parent.attr['octoml-text']+'"><input id="%id%"'+cPlaceholder+passIcon+' %attr%></div></div>';
					} else {
						var input = (label ? ' label="'+label+'"' : '') + (sr ? ' sr="'+sr+'"' : '') + (placeholder ? ' placeholder="'+placeholder+'"' : '');
						return '<div class="form-group'+size+feedback+'"><div class="'+a.parent.attr['octoml-offset']+'"><input id="%id%"'+input+passIcon+' %attr%></div></div>';
					}
				},
			},
			{
				tag: " > textarea",
				attr: ['label'],
				html: function(a) {
					if(a.attr.label) {
						return '<div class="form-group">\n<label for="%id%" class="'+a.parent.attr["octoml-label"]+' control-label">\n%label%\n</label>\n<div class="'+a.parent.attr['octoml-text']+'"><textarea %attr%>%html%</textarea></div></div>';		
					} else {
						return '<div class="form-group"><div class="'+a.parent.attr['octoml-offset']+'"><textarea %attr%>%html%</textarea></div></div>';
					}
				},
			},
			{
				single:true,
				tag: "> check",
				html: function(a) {
					//return '<check octoml-offset="'+a.parent.attr['octoml-offset']+'" %attr%></check>';
					return '<div class="form-group"><div class="'+a.parent.attr['octoml-offset']+'"><check %attr%></check></div></div>';
				},
			},
			{
				single:true,
				tag: "> radio",
				html: function(a) {
					//return '<radio octoml-offset="'+a.parent.attr['octoml-offset']+'" %attr%></radio>';
					return '<div class="form-group"><div class="'+a.parent.attr['octoml-offset']+'"><radio %attr%></check></div></div>';
				}
			},
			{
				tag: "> select",
				attr: {
					'label':'%val%',
					'octoml-size': ['lg','sm'],
				},
				html: function(a) {
					var size = a.attr["octoml-size"] ? ' form-group-'+a.attr["octoml-size"] : a.parent.attr.size ? ' form-group-'+a.parent.attr.size : '';
					//return '<select octoml-offset="'+a.parent.attr['octoml-offset']+'" %attr%>%html%</select>';
					//return '<div class="form-group"><div class="'+a.parent.attr['octoml-offset']+'"><select %attr%>%html%</select></div></div>';
					if(a.attr.label) {
						return '<div class="form-group'+size+'">\n<label for="%id%" class="'+a.parent.attr["octoml-label"]+' control-label">\n%label%\n</label>\n<div class="'+a.parent.attr['octoml-text']+'"><select %attr%>%html%</select></div></div>';		
					} else {
						return '<div class="form-group'+size+'"><div class="'+a.parent.attr['octoml-offset']+'"><select %attr%>%html%</select></div>';
					}
				},
			},

			],
			
		},
/*			
		{
			tag: "group",
			nested: false,
			inner: [{
				tag: "group",
				html: function(a) {
					for(var i in a.parent.attrOther) {
						if(a.obj.attr(i) === undefined) a.obj.attr(i,a.parent.attrOther);
					}
					return '<%tag% %attr%>%html%</%tag%>';
				},
			},
			],
		},
*/
		{
			tag: "group[inline]",
			attr: ['inline'],
			html: function(a) {
				return '<div class="form-inline"><group %attr%>%html%</group></div>';
			},
			inner: [
			{
				single:true,
				tag: "check,radio",
				html: "<%tag% inline %attr%>",
			},
			],
		},
		{
			tag: "group",
			attr: ['disabled'],
			html: function(a) {
				var b = a.obj.find(' > input');
				if(b.length) {
					var c = b.first();
					var d = a.obj.find(' > before');
					var e = a.obj.find(' > after');
					if(d.length) {
						c.attr('before',d.first().html());
						d.remove();
					}
					if(e.length) {
						c.attr('after',e.first().html());
						e.remove();							
					}
					//return '<div class="input-group">%html%</div>';
				}
				var f = a.obj.find(' > *');
				var g = a.obj.find('> input,> check,> radio, > select, > textarea');
				var h = a.obj.find('> help');
				if(f.length == 1) {
					
				}
				if(a.attr.disabled) return '<fieldset disabled>%html%</fieldset>';
				else return "%html%";
			}, 
			inner: [
			{
				tag: "check,radio",
				single:true,
				html: function(a) {
					var attr = a.parent.attrOther;
					var text = ['<%tag%'];
					for(var i in attr) {
						if(attr[i] == '') text.push(i);
						else text.push(i+'="'+attr[i]+'"');
					}
					return text.join(' ')+' %attr%></%tag%>';
				},
			},	
			{
				tag: "input,select,textarea",

				html: function(a) {
					var attr = a.parent.attrOther;
					var text = ['<%tag%'];
					for(var i in attr) {
						if(attr[i] == '') text.push(i);
						else text.push(i+'="'+attr[i]+'"');
					}
					return text.join(' ')+' %attr%>%html%</%tag%>';
				},
			},
			],
		},
		{
			tag: "p[label],p[sr]",
			attr: ['label','sr'],
			html: function(a) {
				if(a.attr.label) {
					var sr = a.attr.sr ? ' <span class="sr-only">'+a.attr.sr+'</span>' : '';
					return '<div class="form-group">\n<label class="control-label">\n%label%'+sr+'\n</label>\n<p class="form-control-static" %attr%>%html%</p></div>';
				} else if(a.attr.sr) {
					return '<div class="form-group"><label class="sr-only">%sr%</label><p class="form-control-static" %attr%>%html%</p></div>';
				} else {
					return '<p class="form-control-static" %attr%>%html%</p>';
				}
			},
		},
		{
			tag: "input:not(.form-control)",
			single: true,
			attr: {
				'help': '<p class="help-block" id="%id%-help">%val%</p>',
				'help-before': '<p class="help-block" id="%id%-helpbefore">%val%</p>',
				'before': '<span class="input-group-addon">%val%</span>',
				'after': '<span class="input-group-addon">%val%</span>',
				'octoml-size': ['lg','sm'],
				'octoml-feedback': ['success','warning','error'],
				'octoml-feedback-icon': ['success-icon','warning-icon','error-icon'],
				'icon': '',
				'label': '%val%',
				'sr': '%val%',
				'placeholder': '%val%',
				'label-placeholder': '%val%',
				'sr-placeholder': '%val%',
				'placeholder-label': '%val%',
				'placeholder-sr': '%val%',
				'type': '%val%',
			},
			html: function(a) {
				var start = '', end = '', size = '';
				var sr = a.attr.sr ? ' sr-only' : '';
				var feedback = '';
				var textInputs = ['text','password','datetime','datetime-local','date','month','time','week','number','email','url','search','tel','color'];
				var control = (a.attr.type && textInputs.indexOf(a.attr.type) != -1) ? 'form-control' : ''; 
				var feedbackIcon = a.attr["octoml-feedback-icon"];
				if(a.attr["octoml-feedback"]) {
					if(!feedbackIcon && a.attr.icon) feedbackIcon = a.attr["octoml-feedback"]+'-icon'; 
					if(feedbackIcon) feedback = ' has-'+a.attr["octoml-feedback"]+' has-feedback';
					else feedback = ' has-'+a.attr["octoml-feedback"];
				} else if(feedbackIcon) {
					feedback = '';
				}
				var icon = '';
				var link = '';
				if(feedbackIcon) {
					icon = (feedbackIcon=="success-icon") ? '\n<span class="glyphicon glyphicon-ok form-control-feedback" aria-hidden="true"></span>\n<span id="%id%-status" class="sr-only">(success)</span>\n'
							: (feedbackIcon=="warning-icon") ? '\n<span class="glyphicon glyphicon-warning-sign form-control-feedback" aria-hidden="true">\n</span><span id="%id%-status" class="sr-only">(warning)</span>\n'
							: (feedbackIcon=="error-icon") ? '\n<span class="glyphicon glyphicon-remove form-control-feedback" aria-hidden="true"></span>\n<span id="%id%-status" class="sr-only">(error)</span>\n' : '';
					link = ' aria-describedby="%id%-status"';
				} else {
					link = (a.attr["help"]) ? ' aria-describedby="%id%-help"' : (a.attr["help-before"]) ? ' aria-describedby="%id%-helpbefore"' : '';
				}
				
				var cLabel = a.attr.label || a.attr["placeholder-label"] || a.attr["label-placeholder"] || "";
				var cSR = a.attr.sr || a.attr["placeholder-sr"] || a.attr["sr-placeholder"] || "";
				var cPlaceholder = a.attr.placeholder || a.attr["placeholder-label"] || a.attr["label-placeholder"] || a.attr["placeholder-sr"] || a.attr["sr-placeholder"] || "";
				var cAttr = cPlaceholder ? ' placeholder="'+cPlaceholder+'"' : '';


				if(cLabel) {
					if(cSR) {
						var tempSize = (a.attr["octoml-size"]) ? ' form-group-'+a.attr["octoml-size"] : '';
						start = '<div class="form-group'+tempSize+feedback+'">\n<label class="control-label" for="%id%">\n'+cLabel+'\n<span class="sr-only">'+cSR+'</span></label>\n';
						end = '</div>';
					} else {
						var tempSize = (a.attr["octoml-size"]) ? ' form-group-'+a.attr["octoml-size"] : '';
						start = '<div class="form-group'+tempSize+feedback+'">\n<label class="control-label" for="%id%">\n'+cLabel+'\n</label>\n';
						end = '</div>';
					}
				} else if(cSR) {
					var tempSize = (a.attr["octoml-size"]) ? ' form-group-'+a.attr["octoml-size"] : '';
					start = '<div class="form-group'+tempSize+feedback+'">\n<label class="control-label sr-only" for="%id%">\n'+cSR+'\n</label>\n';
					end = '</div>';
				} else if(feedback) {
					var tempSize = (a.attr["octoml-size"]) ? ' form-group-'+a.attr["octoml-size"] : '';
					start = '<div class="form-group'+tempSize+feedback+'">';
					end = '</div>';						
				} else {
					size = (a.attr["octoml-size"]) ? ' input-'+a.attr["octoml-size"] : '';
				}
				var text = (a.attr.before || a.attr.after) ?
					'%help-before%<div class="input-group">%before%\n<input type="%type%" '+cAttr+' id="%id%"'+link+' class="'+control+size+'" %attr%>%after%</div>'+icon+'\n%help%' :
					'%help-before%<input type="%type%" '+cAttr+' id="%id%"'+link+' class="'+control+size+'" %attr%>'+icon+'\n%help%';
				
				return start+text+end;
			},	
		},
		{
			tag: "textarea:not(.form-control)",
			attr: {
				'label':'\n<label class="control-label" for="%id%">\n%val%\n</label>\n',
				'help': '<p class="help-block">%val%</p>',
				'help-before': '<p class="help-block">%val%</p>',
			},
			html: '%label%%help-before%<textarea class="form-control" id="%id%" %attr%>%html%</textarea>%help%',
		},
		{
			single: true,
			tag: ".input-group-addon > check",
			html: '<input type="checkbox" %attr%>',
		},
		{
			single: true,
			tag: ".input-group-addon > radio",
			html: '<input type="radio" %attr%>',
		},
		{
			tag: "check",
			single:true,
			attr: {
				'disabled': ' disabled',
				'label': '%val%',
				'help': '<p class="help-block">%val%</p>',
				'help-before': '<p class="help-block">%val%</p>',
				'octoml-feedback': ['success','warning','error'],
				'sr': '<span class="sr-only">%val%</span>',
				'inline': '-inline',
			},
			html: function(a) {
				if(a.attr["octoml-feedback"]) {
					if(a.attr.inline) {
						return '<div class="has-'+a.attr["octoml-feedback"]+'" style="display:inline-block;">%help-before%\n<label class="checkbox%inline%%disabled%">\n<input type="checkbox"%disabled% %attr%>\n%label%%sr%\n</label>\n%help%</div>';
					}
					return '<div class="has-'+a.attr["octoml-feedback"]+'"><div class="checkbox%inline%%disabled%">%help-before%\n<label>\n<input type="checkbox"%disabled% %attr%>\n%label%%sr%\n</label>\n%help%</div></div>';
				}
				if(a.attr.inline) {
					return '%help-before%\n<label class="checkbox%inline%%disabled%">\n<input type="checkbox"%disabled% %attr%>\n%label%%sr%\n</label>\n%help%';
				}
				return '<div class="checkbox%inline%%disabled%">%help-before%\n<label>\n<input type="checkbox"%disabled% %attr%>\n%label%%sr%\n</label>\n%help%	</div>';
			},
		},
		{
			tag: "radio",
			attr: {
				'label':' %val% ',
				'disabled': ' disabled',
				'help': '<p class="help-block">%val%</p>',
				'help-before': '<p class="help-block">%val%</p>',
				'octoml-feedback': ['success','warning','error'],
				'sr': '<span class="sr-only">%val%</span>',
				'inline': '-inline',
			},
			single: true,
			html: function(a) {
				if(a.attr["octoml-feedback"]) {
					if(a.attr.inline) {
						return '<div class="has-%octoml-feedback%" style="display:inline-block;">\n<label class="radio%inline%%disabled%">\n<input type="radio"%disabled% %attr%>\n%label%%sr%\n</label>\n</div>';
					}
					return '<div class="has-%octoml-feedback%"><div class="radio%inline%%disabled%">\n<label>\n<input type="radio"%disabled% %attr%>\n%label%%sr%\n</label>\n</div></div>';
				}
				if(a.attr.inline) {
					return '\n<label class="radio%inline%%disabled%">\n<input type="radio"%disabled% %attr%>\n%label%%sr%\n</label>\n';
				}
				return '<div class="radio%inline%%disabled%">\n<label>\n<input type="radio"%disabled% %attr%>\n%label%%sr%\n</label>\n</div>';
			},
		},
		{
			tag: "submit",
			attr: {
				brand: ['default','primary','success','info','warning','danger','link'],		
			},
			attrDefault: {
				brand: 'default',
			},
			html: '<button type="submit" class="btn btn-%brand%">%html%</button>',
		},
		{
			tag: "select:not(.form-control)",
			attr: {
				'label':'%val%',
				'disabled': ' disabled',
				'help': '<p class="help-block">%val%</p>',
				'help-before': '<p class="help-block">%val%</p>',
				'octoml-feedback': ['success','warning','error'],
				'octoml-size':['sm','lg'],
				'sr': '%val%'
			},
			html: function(a) {
				var text = '';
				if(a.attr.label) {
					if(a.attr.sr) {
						text = '\n<label for="%id%" class="control-label">\n%label%<span class="sr-only">%sr%</span>\n</label>\n';
					} else {
						text = '\n<label for="%id%" class="control-label">\n%label%\n</label>\n';
					}
				} else if(a.attr.sr) {
					text = '\n<label for="%id%" class="control-label sr-only">\n%sr%\n</label>\n';
				}
				
				var size = a.attr["octoml-size"] ? ' input-'+a.attr["octoml-size"] : '';
				text = text+'%help-before%<select %attr% %disabled% class="form-control'+size+'">%html%</select>%help%';
				
				if(a.attr["octoml-feedback"]) text = '<div class="has-'+a.attr["octoml-feedback"]+'">'+text+'</div>';
				return text;
			},
			
		},
		{
			tag: "select[options]",
			attr: {
				'options':'%val%',
			},
			html: function(a) {
				if(a.attr.options) {
					var ranges = [
						['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'],
						['Mon','Tue','Wed','Thur','Fri','Sat','Sun'],
						['January','February','March','April','May','June','July','August','September','October','November','December'],
						['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'],
					];
					var text = "";
					var opts = a.attr.options.split(',');
					opts.forEach(function(b) {
						if(b.match(/^\s*[a-zA-Z0-9]+\s*-\s*[a-zA-Z0-9]+\s*$/)) {
							//contains a range
							var start = b.replace(/^\s*([a-zA-Z0-9]+)\s*-\s*([a-zA-Z0-9]+)\s*$/,'$1');
							var end = b.replace(/^\s*([a-zA-Z0-9]+)\s*-\s*([a-zA-Z0-9]+)\s*$/,'$2');
						   
							if(start.match(/^[0-9]+$/) && end.match(/^[0-9]+$/)) {
								for(var j=parseInt(start);j<parseInt(end)+1;j++) {
									text += '<option>'+j+'</option>';
								}
							} else {
								var hasRange = ranges.some(function(c) {
									var d = c.indexOf(start);
									var e = c.indexOf(end);
									if(d !== -1 && e !== -1) {
										if(d<e) {
											for(var i=d;i<=e;i++) {
												text += '<option>'+c[i]+'</option>';
											}
											return true;
										}
									}
									return false;
								});
							   if(!hasRange) {
								//err
							   }
							
							}
						   
						} else {
							text += '<option>'+b+'</option>';
						}
					});
					return '<select %attr%>'+text+'%html%</select>';
				} else {
					return '<select %attr%>%html%</select>';
				}   
			},   
		},
		{
			tag: " > input",
			single: true,
			html: '<div class="form-group"><input %attr%></div>',
		},
		{
			tag: " > textarea",
			html: '<div class="form-group"><textarea %attr%>%html%</textarea></div>',
		},
		{
			tag: " > select",
			html: '<div class="form-group"><select %attr%>%html%</select></div>',
		},
		]
	},

	
	// Buttons
	
	{
		tag: 'a[btn],input[btn],btn',
		attr: {
			brand: ['default','primary','success','info','warning','danger','link'],
			block: ' btn-block',
			size: ' btn-%val%',
			active: ' active',
			disabled: ' disabled',
			btn: '',
		},
		attrType: {
			size: ['xs', 'sm', 'lg'],
		},
		attrDefault: {
			brand: 'default',
		},
		html: function(a) {
			if(a.tag == "a") return '<a role="button" class="btn btn-%brand%%size%%disabled%%block%%active%" %attr%>%html%</a>';
			else if(a.tag == "btn") return '<button type="button" class="btn btn-%brand%%block%%active%%size%"%disabled% %attr%>%html%</button>';
			else return '<input type="button" class="btn btn-%brand%%size%%block%%active%"%disabled% %attr%>';
		},

	},


	// Images
	
	{
		tag: "img",
		attr: {
			'responsive': 'img-responsive',
			'center': 'center-block',
			'circle': 'img-circle',
			'rounded': 'img-rounded',
			'thumbnail': 'img-thumbnail',
		},
		html: function(a) {
			var attr = _.chain(a.attr).pick(function(b) { return b; }).keys()
				.map(function(b) { return '%'+b+'%' }).value().join(' ');
			return attr ? '<img class="'+attr+'" %attr%>' : '<img %attr%>';
		},
	},
	
	
	// Helper Utilities
	
	{
		'tag': "*[text-color],*[bg-primary],*[bg-success],*[bg-info],*[bg-warning],*[bg-danger],*[pull],*[pull-left],*[pull-right],*[center-block],*[clearfix]",
		'attr': {
			'text-color': 'text-%val%',
			'bg-brand': ['bg-primary','bg-success','bg-info','bg-warning','bg-danger'],
			'pull': ['pull-left','pull-right','center-block'],
			'clearfix': 'clearfix',
		},
		html: function(a) {
			var attr = _.chain(a.attr).pick(function(b) { return b; }).keys()
				.map(function(b) { return '%'+b+'%' }).value().join(' ');
			return attr ? '<%tag% class="'+attr+'" %attr%>%html%</%tag%>' : '<%tag% %attr%>%html%</%tag%>';
		},
	},
	
	{
		tag: "close",
		single: true,
		html: '<button type="button" class="close" aria-label="Close" %attr%><span aria-hidden="true">&times;</span></button>',
	},

	{
		tag: "caret",
		single: true,
		html: '<span class="caret"></span>',
	},
	

	// Responsive Utilities
	
	{
		tag: "*[hide]",
		attr: ['hide'],
		html: function(a) {
			var attr = a.attr.hide.split(',').map(function(b) {
				return 'hidden-'+b;
			}).join(' ');
			if(attr) return '<%tag% class="'+attr+'" %attr%>%html%</%tag%>';
			else return '<%tag% class="hide" %attr%>%html%</%tag%>';
		},
	},
	{
		tag: "*[show]",
		attr: ['show'],
		html: function(a) {
			var attr = _.isString(a.attr.show) ?
			a.attr.show.split(',')
			.map(function(b) { return 'visible-'+b;}).join(' ') :
			'';
			if(attr) return '<%tag% class="'+attr+'" %attr%>%html%</%tag%>';
			else return '<%tag% class="show" %attr%>%html%</%tag%>';
		},
	},
	
	
],

post: [
{
	html: function(a) {
		if(a.columns.hasOwnProperty('xs')) {
			var s = {
				'xs':['',' .make-grid(xs);'],
				'sm':['@media (min-width: @screen-sm-min) {',' .make-grid(sm); }'],
				'md':['@media (min-width: @screen-md-min) {',' .make-grid(md); }'],
				'lg':['@media (min-width: @screen-lg-min) {',' .make-grid(lg); }'],
				},
				t = {
				'offset':'margin-left:0;',
				'push':'left:auto;',
				'pull':'right:auto;',
				},
				u = [0,0,0];
			var text = "";;
			for(var i in s) {
				var index = 0;
				for(var j in t) {
					text += a.columns[i].less;
					text += a.columns[i].lessSuffix;
					if(u[index] || a.columns[i][j].length) {
						u[index] = 1;
						var css = s[i][0]+".col-"+i+"-"+j+"-0 { "+t[j]+" } " + s[i][1];
						
						
						text += css;
						//donsole.log('addd '+css);
					}
					
					index++;
				}
			}
			a.less += text;
				//console.log('adding less: '+text);
		}

	},
},
],

};	

