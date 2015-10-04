// Library Functions
module.exports = {

	//Tabs
main: [
{
	tag: "prev",
	html: " Hello &larr; World &rarr; ",
	
},

{
	tag: "a",
	inner: [
	{
		html: function(a) {
			return "%html% Yep";
		}
	}
	],
},

	
/*
{
	tag: " > markdown",
	html: "%html%",
},
{
	tag: "boxa",
	attr: ['a','b'],
	html: '<div class="boxa">a = %a% , b = %b% %html%</div>',
	inner: [{
		tag: " > innera",
		attrInherit: ['a','b'],
		html: '<span class="innera">a = %a% , b = %b% %html%</span>',
	}],
},
{
	tag: "boxb",
	attr: {
		'a': 'a = %val%',
		'b': 'b = %val%',
	},
	html: '<div class="boxb">%a% : %b% %html%</div>',
	inner: [{
		tag: "innerb",
		attrInherit: ['a','b'],
		html: ['<span class="innerb">%a% : %b% %html%</span>','<header></header>'],
	}],
},
{
	tag: "boxc",
	attr: {
		'a': 'a = %val%',
		'b': 'b = %val%',
		'c': ['d','e','f'],
	},
	html: '<div class="boxc">%a% : %b% %c% %html%</div>',
	inner: [{
		tag: "innerc",
		attrInherit: ['a','b','c'],
		html: '<span class="innerc">%a% : %b% %c%  %html%</span>',
	}],
},
{
	tag: "boxd",
	async: true,
	html: function(a,b) {
		b({html:['<div class="boxd">'+a.index+'%html%</div>'],css: '.boxd {background:green;}'});
	},
},

	{
		tag: "tab-group",
		attr: {
			pills: 'pills',
			fade: ' fade',
			justified: ' nav-justified'
		},
		attrDefault: {
			pills: 'tabs',
		},
		html: function(a) {
			//if no tab is set as 'active', set the first tab
			if(a.obj.find(' > tab[active]').length == 0) a.obj.find(' > tab').first().attr('active','');
			
			return '<div role="tab" %attr%>%html%</div>';
		},
		inner: [ {
			tag: "tab",
			attr: {
				'title': '%val%',
				'active': ' active'
			},
			attrInherit: ['pills','fade','justified'],
			html: function(a) {
				//if tab doesn't have a title, search for h-tag
				var title;
				if(a.attr.title) title = a.attr.title
				else {
					var b = a.obj.find('h1,h2,h3,h4,h5,h6,hgroup,header').first();
					title = b.length ? b.text() : "Tab "+(a.index+1);
				}
				
				var tabList = (a.first ? '\n<ul class="nav nav-%pills%%justified%" role="tablist">' : '')
					+ '\n\t<li role="presentation"><a href="#%id%" aria-controls="%id%" role="tab" data-toggle="%pills%">'+title+'</a></li>';
				
				var tabBody = '<div role="tabpanel" class="tab-pane%fade%%active%" id="%id%" %attr%>%html%</div>';				
				if(a.last) return  [tabBody,tabList+'\n</ul>\n<div class="tab-content">','</div>\n'];
				else return [tabBody,tabList];
			},
		}],
	},

	{
		tag: "tabs,pills",
		attr: {
			'justified' : ' nav-justified',
			'vertical': ' nav-stacked',
		},
		html: '<ul class="nav nav-%tag%%justified%%vertical%" %attr%>%html%</ul>',
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

*/


]

};	
