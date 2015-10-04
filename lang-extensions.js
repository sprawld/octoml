"use strict"

// Library Functions
var _ = require('underscore');
var getOpts = function(opts) {
var o = {};
opts.split(',').forEach(function(a) {
	a.replace(/^([^:]*):([^:]*)$/,function(b,c) {
		o[b] = c;
	});
});
return o;
};

var getOptText = function(opts) {
if(_.isString(opts)) return opts.split(';').map(function(a) {
	
	return a.replace(/^\s*([^:]*)\s*:\s*([^:]*)\s*$/,function(x,b,c) {
		if(c.match(/^[0-9]+$|^[0-9]*\.[0-9]+$/)) return '"'+b+'":'+c+',';
		else return '"'+b+'":'+'"'+c.replace(/"/g,'\"')+'",';
	});
}).join('');
else return "";
};


module.exports = {

main: [
	
/* ------------------------
   ------------------------
	  3rd Party Plugins
   ------------------------ 
   ------------------------ */


	// Font Awesome
	{
		tag: "fa[icon]",
		attr: {
			icon: '%val%',
			size: ' fa-%val%',
			'fa-rotation': ' fa-%val%',
			'fa-align': ' fa-%val%',
			brand: ' %val%',
		},
		attrType: {
			size: ['lg','2x','3x','4x','5x'],
			brand: ['text-primary','text-info','text-success','text-warning','text-danger'],
			'fa-rotation': ['rotate-90','rotate-180','rotate-270'],
			'fa-align': ['align-center','align-justify','align-left','align-right'],     
		},
		single: true,
		html: function(a) {
			
			return '<span class="fa-stack%size%%brand%%fa-rotation%%fa-align%">' + a.attr.icon.split(',').map(function(b) {
				var text = '<fa stack '+b+'></fa>';
				//console.log(text);
				return text;
			}).join('') + '</span>';
		},
	},
	{
		tag: "fa",
		single: true,
		attr: {
			'fw': ' fa-fw',
			'border': ' fa-border',
			'inverse': ' fa-inverse',
			'spin': ' fa-spin',
			'mirror': ' fa-flip-horizontal',
			'flip': ' fa-flip-vertical',
			'adjust': ' fa-adjust',
			'adn': ' fa-adn',
			'stack': '%val%',
			'fa-rotation': ' fa-%val%',
			'fa-align': ' fa-%val%',
			icon: ['500px','adjust','adn','align-center','align-justify','align-left','align-right','amazon','ambulance','anchor','android','angellist','angle-double-down','angle-double-left','angle-double-right','angle-double-up','angle-down','angle-left','angle-right','angle-up','apple','archive','area-chart','arrow-circle-down','arrow-circle-left','arrow-circle-o-down','arrow-circle-o-left','arrow-circle-o-right','arrow-circle-o-up','arrow-circle-right','arrow-circle-up','arrow-down','arrow-left','arrow-right','arrow-up','arrows','arrows-alt','arrows-h','arrows-v','asterisk','at','automobile','backward','balance-scale','ban','bank','bar-chart','bar-chart-o','barcode','bars','battery-0','battery-1','battery-2','battery-3','battery-4','battery-empty','battery-full','battery-half','battery-quarter','battery-three-quarters','bed','beer','behance','behance-square','bell','bell-o','bell-slash','bell-slash-o','bicycle','binoculars','birthday-cake','bitbucket','bitbucket-square','bitcoin','black-tie','bold','bolt','bomb','book','bookmark','bookmark-o','briefcase','btc','bug','building','building-o','bullhorn','bullseye','bus','buysellads','cab','calculator','calendar','calendar-check-o','calendar-minus-o','calendar-o','calendar-plus-o','calendar-times-o','camera','camera-retro','car','caret-down','caret-left','caret-right','caret-square-o-down','caret-square-o-left','caret-square-o-right','caret-square-o-up','caret-up','cart-arrow-down','cart-plus','cc','cc-amex','cc-diners-club','cc-discover','cc-jcb','cc-mastercard','cc-paypal','cc-stripe','cc-visa','certificate','chain','chain-broken','check','check-circle','check-circle-o','check-square','check-square-o','chevron-circle-down','chevron-circle-left','chevron-circle-right','chevron-circle-up','chevron-down','chevron-left','chevron-right','chevron-up','child','chrome','circle','circle-o','circle-o-notch','circle-thin','clipboard','clock-o','clone','close','cloud','cloud-download','cloud-upload','cny','code','code-fork','codepen','coffee','cog','cogs','columns','comment','comment-o','commenting','commenting-o','comments','comments-o','compass','compress','connectdevelop','contao','copy','copyright','creative-commons','credit-card','crop','crosshairs','css3','cube','cubes','cut','cutlery','dashboard','dashcube','database','dedent','delicious','desktop','deviantart','diamond','digg','dollar','dot-circle-o','download','dribbble','dropbox','drupal','edit','eject','ellipsis-h','ellipsis-v','empire','envelope','envelope-o','envelope-square','eraser','eur','euro','exchange','exclamation','exclamation-circle','exclamation-triangle','expand','expeditedssl','external-link','external-link-square','eye','eye-slash','eyedropper','facebook','facebook-f','facebook-official','facebook-square','fast-backward','fast-forward','fax','feed','female','fighter-jet','file','file-archive-o','file-audio-o','file-code-o','file-excel-o','file-image-o','file-movie-o','file-o','file-pdf-o','file-photo-o','file-picture-o','file-powerpoint-o','file-sound-o','file-text','file-text-o','file-video-o','file-word-o','file-zip-o','files-o','film','filter','fire','fire-extinguisher','firefox','flag','flag-checkered','flag-o','flash','flask','flickr','floppy-o','folder','folder-o','folder-open','folder-open-o','font','fonticons','forumbee','forward','foursquare','frown-o','futbol-o','gamepad','gavel','gbp','ge','gear','gears','genderless','get-pocket','gg','gg-circle','gift','git','git-square','github','github-alt','github-square','gittip','glass','globe','google','google-plus','google-plus-square','google-wallet','graduation-cap','gratipay','group','h-square','hacker-news','hand-grab-o','hand-lizard-o','hand-o-down','hand-o-left','hand-o-right','hand-o-up','hand-paper-o','hand-peace-o','hand-pointer-o','hand-rock-o','hand-scissors-o','hand-spock-o','hand-stop-o','hdd-o','header','headphones','heart','heart-o','heartbeat','history','home','hospital-o','hotel','hourglass','hourglass-1','hourglass-2','hourglass-3','hourglass-end','hourglass-half','hourglass-o','hourglass-start','houzz','html5','i-cursor','ils','image','inbox','indent','industry','info','info-circle','inr','instagram','institution','internet-explorer','intersex','ioxhost','italic','joomla','jpy','jsfiddle','key','keyboard-o','krw','language','laptop','lastfm','lastfm-square','leaf','leanpub','legal','lemon-o','level-down','level-up','life-bouy','life-buoy','life-ring','life-saver','lightbulb-o','line-chart','link','linkedin','linkedin-square','linux','list','list-alt','list-ol','list-ul','location-arrow','lock','long-arrow-down','long-arrow-left','long-arrow-right','long-arrow-up','magic','magnet','mail-forward','mail-reply','mail-reply-all','male','map','map-marker','map-o','map-pin','map-signs','mars','mars-double','mars-stroke','mars-stroke-h','mars-stroke-v','maxcdn','meanpath','medium','medkit','meh-o','mercury','microphone','microphone-slash','minus','minus-circle','minus-square','minus-square-o','mobile','mobile-phone','money','moon-o','mortar-board','motorcycle','mouse-pointer','music','navicon','neuter','newspaper-o','object-group','object-ungroup','odnoklassniki','odnoklassniki-square','opencart','openid','opera','optin-monster','outdent','pagelines','paint-brush','paper-plane','paper-plane-o','paperclip','paragraph','paste','pause','paw','paypal','pencil','pencil-square','pencil-square-o','phone','phone-square','photo','picture-o','pie-chart','pied-piper','pied-piper-alt','pinterest','pinterest-p','pinterest-square','plane','play','play-circle','play-circle-o','plug','plus','plus-circle','plus-square','plus-square-o','power-off','print','puzzle-piece','qq','qrcode','question','question-circle','quote-left','quote-right','ra','random','rebel','recycle','reddit','reddit-square','refresh','registered','remove','renren','reorder','repeat','reply','reply-all','retweet','rmb','road','rocket','rotate-left','rotate-right','rouble','rss','rss-square','rub','ruble','rupee','safari','save','scissors','search','search-minus','search-plus','sellsy','send','send-o','server','share','share-alt','share-alt-square','share-square','share-square-o','shekel','sheqel','shield','ship','shirtsinbulk','shopping-cart','sign-in','sign-out','signal','simplybuilt','sitemap','skyatlas','skype','slack','sliders','slideshare','smile-o','soccer-ball-o','sort','sort-alpha-asc','sort-alpha-desc','sort-amount-asc','sort-amount-desc','sort-asc','sort-desc','sort-down','sort-numeric-asc','sort-numeric-desc','sort-up','soundcloud','space-shuttle','spinner','spoon','spotify','square','square-o','stack-exchange','stack-overflow','star','star-half','star-half-empty','star-half-full','star-half-o','star-o','steam','steam-square','step-backward','step-forward','stethoscope','sticky-note','sticky-note-o','stop','street-view','strikethrough','stumbleupon','stumbleupon-circle','subscript','subway','suitcase','sun-o','superscript','support','table','tablet','tachometer','tag','tags','tasks','taxi','television','tencent-weibo','terminal','text-height','text-width','th','th-large','th-list','thumb-tack','thumbs-down','thumbs-o-down','thumbs-o-up','thumbs-up','ticket','times','times-circle','times-circle-o','tint','toggle-down','toggle-left','toggle-off','toggle-on','toggle-right','toggle-up','trademark','train','transgender','transgender-alt','trash','trash-o','tree','trello','tripadvisor','trophy','truck','try','tty','tumblr','tumblr-square','turkish-lira','tv','twitch','twitter','twitter-square','umbrella','underline','undo','university','unlink','unlock','unlock-alt','unsorted','upload','usd','user','user-md','user-plus','user-secret','user-times','users','venus','venus-double','venus-mars','viacoin','video-camera','vimeo','vimeo-square','vine','vk','volume-down','volume-off','volume-up','warning','wechat','weibo','weixin','whatsapp','wheelchair','wifi','wikipedia-w','windows','won','wordpress','wrench','xing','xing-square','y-combinator','y-combinator-square','yahoo','yc','yc-square','yelp','yen','youtube','youtube-play','fa-youtube-square'],
			'sr' : '<span class="sr-only">%val%</span>',
			brand: ' %val%',
		},
		attrType: {
			brand: ['text-primary','text-info','text-success','text-warning','text-danger'],
			'fa-size': ['lg','1x','2x','3x','4x','5x'],			
			'fa-rotation': ['rotate-90','rotate-180','rotate-270'],
			'fa-align': ['align-center','align-justify','align-left','align-right'],     
		},
		html: function(a) {
			var text;
			var size = a.attr['fa-size'] ? ( a.attr.stack ? ' fa-stack-'+a.attr['fa-size'] : ' fa-'+a.attr['fa-size'] ) : a.attr.stack ? ' fa-stack-1x' : '';
			if(a.attr.icon) {
				text = '<i class="fa fa-%icon%%fw%%border%%inverse%%brand%%spin%%mirror%%flip%%adjust%%adn%%fa-rotation%%fa-align%'+size+'">%sr%</i>'; 
			} else {
				//return '<!-- invalid FA -->';
				text = '<!-- invalid FontAwesome icon: ' + _.keys(a.attrOther) + ' -->';
			}
			if(a.first) return {
				stylesheets: { 'fontawesome': 'https://maxcdn.bootstrapcdn.com/font-awesome/4.4.0/css/font-awesome.min.css' },
				html: text,
			};
			else return text;
		},
		
	},
	

	// Google fonts
	{
		tag: "google[font]",
		attr: ["font"],
		single:true,
		html: function(a) {
			var fonts = 'https://fonts.googleapis.com/css?family=' + 
			a.attr["font"].replace(/[ ]*,[ ]*/g,'|').replace(/^[ ]*/,'').replace(/;/g,',')
			.replace(/[ ]*$/,'').replace(/[ -]/g,'+');
			return {
				stylesheets: {
					'google-font': fonts,
				},
				html: '',
			};
		},
	},

	
	// Holder.js	
	{
		tag: "img[holder]",
		attr: {
			holder:'%val%',
			theme:['sky','vine','lava','gray','industrial','social'],
		},
		single: true,
		html: function(a) {
			var holder = a.attr.holder.match(/^[0-9]+$/) ? '%holder%x%holder%' : '%holder%';
			var theme = a.attr.theme ? '/%theme%' : '';
			var html = '<img data-src="holder.js/'+holder+theme+'" alt="Placeholder image" %attr%>';
			if(a.first) return {
				js: [{
					name: 'holder',
					src: 'https://cdnjs.cloudflare.com/ajax/libs/holder/2.6.0/holder.min.js',
				}],
				html: html,
			};
			else return html;
		},
	},	


	// wow.js
	
	{
		tag: "*[wow]",

		attr: {
		'wow':'%val%',
		'duration':' data-wow-duration="%val%"',
		'delay':' data-wow-delay="%val%"',
		'offset':' data-wow-offset="%val%"',
		'iteration':' data-wow-iteration="%val%"',
		},
		html: function(a) {
			var wow = '<%tag% class="wow '+
				a.attr.wow.replace(/( \w)/g, function(m){return m[1].toUpperCase();}) +
				'"%duration%%delay%%offset%%iteration% %attr%>%html%</%tag%>';
			if(a.first) return {
				scripts: {
					
				},
				stylesheets: {
					'animate' : 'https://cdnjs.cloudflare.com/ajax/libs/animate.css/3.2.0/animate.min.css',
				},
				js: [
				{name: 'wow', src: 'https://cdnjs.cloudflare.com/ajax/libs/wow/1.0.3/wow.min.js'},
				{code:"new WOW().init();", require: ['wow']},
				],
			};
			else return wow;
		},
	},
	
	// Trianglify
	{
		tag: "*[trianglify]",
		attr: ['trianglify','resize'],
		html: function(a) {
			var opts = getOptText(a.attr.trianglify);
			var jscript = "(function(a,b) {\n\
			var c = Trianglify({"+opts+"width:a.width(),height:a.height()});\n\
			a.data(b,c.opts).addClass(b).prepend(c.canvas());\n\
			})($('#%id%'),'trianglify');\n\
			";

			if(a.attr.resize) jscript += "\
			$(window).on('resize.trianglify',function() {\n\
			$('.trianglify').each(function() {\n\
			var a = $(this), b = a.find('canvas'), c = a.data('trianglify');\n\
			if(a.width() > b.width()) b.replaceWith(Trianglify($.extend(c,{width:a.width(),height:a.height()})).canvas());\n\
			});\n\
			});\n\
			";
			
			var js = [
			{
				require: ['trianglify'],
				code: jscript,
				out: "$(window).off('resize.trianglify');",
			}];
			
			if(a.first) {
				
				var css = '.trianglify {position:relative;overflow:hidden;}\n\
				.trianglify canvas {position:absolute;top:0;left:0;right:0;bottom:0;}\n'
				js.push({
					name: 'trianglify',
					require: ['jquery'],
					src: 'https://cdnjs.cloudflare.com/ajax/libs/trianglify/0.2.1/trianglify.min.js',
				});
				return {
					css: css,
					js: js,
					html: '<%tag% id="%id%" %attr%>%html%</%tag%>',
				};
			} else return {
				js:js,
				html: '<%tag% id="%id%" %attr%>%html%</%tag%>',
			};
		},
	},
],


};	

