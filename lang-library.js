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
		replace: false,
		rerun: true,
		attr: ['highlight'],
		html: function(a) {
			if(a.attr.highlight) return '<highlight lang="'+a.attr.highlight+'">'+marked(a.html)+'</highlight>';
			else return marked(a.html);
		},
	},
	
	{
		tag: "import",
		rerun: true,
		attr: ['src','text'],
		single: true,
		replace: false,
		html: function(a) {
			if(a.attr.text) {
				return _.escape(fs.readFileSync(a.global.path+a.attr.text).toString());
			} else {
				return fs.readFileSync(a.global.path+a.attr.src).toString();
			}
		},
	},
	{
		tag: "template",
		rerun: true,
		attr: ['marker','src'],
		replace: false,
		html: function(a) {
			var template = fs.readFileSync(a.global.path+a.attr.src).toString();
			//console.log('loaded template '+template);
			var marker = (a.attr.marker || '%html%').replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
			var html = template.replace(new RegExp(marker,'g'),a.html.replace(/\$/g,'$$$$'));
			for(var i in a.attrOther) {
				html = html.replace(new RegExp(('%'+i+'%').replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"),'g'),a.attrOther[i].replace(/\$/g,'$$$$'));
			}
			return html;
		},
	},
	{
		tag: "css",
		attr: ['src'],
		rerun: true,
		html: function(a) {
			if(a.attr.src) {
				var style = {};
				var id = a.id();
				style[id] = a.attr.src;
				//console.log('adding stylesheet '+JSON.stringify(style));
				return {stylesheets: style };
			} else return {css: '%html%'};
		},
	},
	{
		tag: "js",
		attr: ['require','src','name'],
		html: function(a) {
			var js = {};
			if(a.attr.src) js.src = a.attr.src;
			if(_.isString(a.attr.require) && a.attr.require.length)
				js.require = a.attr.require.split(',');
			if(a.html.trim().length) js.code = a.html;
			if(a.attr.name) js.name = a.attr.name;
			return {js: [js]};
		}
	},
	{
		tag: "less",
		attr: ['src'],
		html: function(a) {
			if(a.attr.src) {
				var lessfiles = a.attr.src.split(',').map(function(b) {
					return a.global.path+b;
				});
				return {less: '%html%',lessfiles: lessfiles };
			} else return {less: '%html%'};
		},
	},		
],

main: [
	{
		tag:"*[highlight-style]",
		attr: ['highlight-style'],
		first: {
				stylesheets: { highlight: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/8.4/styles/%highlight-style%.min.css' },
				html:"<%tag% %attr%>%html%</%tag%>",
		},
	},
	{
		tag: "highlight",
		attr: ['lang'],
		html: '%html%',
		inner: [{
			tag: "code",
			attrInherit: ['lang'],
			html: '<code highlight="%lang%" %attr%>%html%</code>',
		}],
	},
	{
		tag: "*:not(code)[highlight]",
		attr: ['highlight'],
		inner: [{
			tag: "code",
			attrInherit: ['highlight'],
			html: function(a) {
				//yonsole.log('hl');
				return '<code highlight="%highlight%" %attr%>%html%</code>';
			}
		}],
	},
	{
		tag: "code[highlight]",
		attr: ['highlight'],
		replace: false,
		html: function(a) {
			var attr = _.map(a.attrOther,function(value,name) {
				return name+'="'+value.replace(/"/g,'\"')+'"';
			}).join(' ');
			var text = highlight(a.attr.highlight,a.obj.text());
			if(_.has(a.global.stylesheets,'highlight')) return "<code "+attr+">"+text+"</code>";
			else return {
				stylesheets: { highlight: 'https://cdnjs.cloudflare.com/ajax/libs/highlight.js/8.4/styles/github.min.css' },
				html: "<code "+attr+">"+text+"</code>",
			};
		},
	},



	{
		tag: "lorem",
		attr: ['length'],
		attrDefault: {
			length: '100',
		},
		single: true,
		html: '<p lorem="%length%" %attr%></p>',
	},
	{
		tag: "*[lorem]",
		attr: ['lorem'],
		html: function(a) {
			var prepend = typeof a.attr.lorem === "string" && a.attr.lorem.match(/prepend/i);
			var length = prepend ? a.attr.lorem.replace(/\s*prepend\s*$/i,'') : a.attr.lorem;
			var nobreak = ( typeof length === "string" && length.match(/break/i) ) ? false : true;
			if(!nobreak) length = length.repace(/\s*break\s*/i,'');
			if( typeof length === "string" && length.match(/short/i)) length = 10;
			var lorem = ['Lorem ipsum dolor sit amet, sea ea sint minimum eligendi.','Ea nisl errem est, ex vel eripuit placerat urbanitas.','Eam te aperiam lucilius electram.','Quodsi corpora rationibus mea ex.','Vis facete tibique eu, ex his ipsum nulla aeterno.','Qui expetendis consetetur in, te mea aeque tamquam.','Has essent salutandi argumentum an.','In ius nominavi intellegat, id homero postea vituperata mea, vero ullum error et pro.','Verterem conclusionemque mei te, probo assum ut vim.','Bonorum adipisci quo ad, has enim doming audiam ex.','Eu quaeque perfecto appellantur mea, ex cum porro populo.','Ex diam cetero abhorreant pro, sit tritani ullamcorper complectitur ex, an quo ceteros accusata incorrupte.','Labores tibique theophrastus nec te, eam an tale erat ullum, eum id nobis oratio officiis.','Id duo reque decore appetere, his vocent consequat voluptatibus ne, meis recteque eu sed.','Ei eum fugit iriure, sit ex ipsum oporteat.','At vel illud tollit populo, malis dissentias sadipscing nam eu.','Eu elit intellegam cum, erat bonorum inciderint id per.','Magna veritus propriae his ei.','Mel facer oblique ne, eum cu quod semper, duo ei causae concludaturque.','Hinc facer duo ut, mazim quidam ius ad.','Mel no modo movet, ne dolor epicurei vel.','Id dicant mentitum suscipit ius, id singulis deserunt reprimique cum.','Labore mediocrem dissentiet pro in, quo prima altera id, vim ornatus constituto efficiendi ei.','An postulant elaboraret sea.','Autem pertinacia sententiae at quo, in quo posse omnium, in sit duis aliquam.','Zril altera putent usu eu, quidam omittantur reformidans sit no.','Id vel novum splendide intellegebat, ne natum iudicabit eum, ut per doctus deleniti suavitate.','Dictas percipit at duo.','Suas zril vitae et cum.','Est ne diam viris intellegam.','Vim ne alii autem, stet inani tibique ei qui.','Sit scaevola adolescens inciderint ad, convenire deseruisse pri at, nisl labores explicari at his.','Vel errem similique id, at per pertinax corrumpit complectitur.','Iracundia intellegat ad pro, eam affert aliquip antiopam cu.','Vis id harum oportere, vel ne nullam sapientem.','Vel at everti audiam, ne pro quod verear suscipit, commodo posidonium incorrupte in pro.','Duo an hinc nobis hendrerit, amet constituam ex quo.','Adhuc laboramus complectitur cu sed, vix illud integre expetenda ad.','Et mel meis debitis phaedrum.','Sonet doming detracto cu mea.','Vim no antiopam explicari.','Ut eius solum appareat vim, ut dicta singulis indoctum sed, no esse omnis verterem mei.','Per at simul graecis lucilius, nec stet brute voluptatibus ad.','Vel tale consectetuer ei, his reque impetus in.','Ne meis graeco mandamus qui, ad everti probatus vix.','Habeo tacimates est no, ea justo utroque nec.','Vel alterum definitionem ei, sea ei bonorum ancillae.','Patrioque moderatius eos id, ad noluisse efficiendi interpretaris sed, nam stet mazim sonet ei.','Ut has conceptam reprimique, quodsi aliquid appareat cu duo.','Pro no labitur vivendo minimum.','Elit conclusionemque cum et, per ut dico consul omnesque, eum ipsum euismod ei.','Id quot neglegentur usu, pri nostrum scripserit no.','Eam ex enim pertinax, in has vivendum pertinacia, tota utinam usu in.','Nibh falli qui et, eum natum causae te, mea tation possit abhorreant te.','Labore senserit accusamus cu vim, at his viris utroque.','Saepe euripidis referrentur his te, his eu nusquam mandamus.','Ignota regione urbanitas nec in, eam id utroque civibus atomorum.','Quo saepe praesent ei.','Aperiam dissentiunt an nam.','In pri alia tamquam laoreet, amet theophrastus at est.','Ut usu oratio homero, ad discere accusamus similique eum.','Graece corrumpit qui no, et deserunt democritum per.','Sea te liber aliquam, te debitis disputando pro, vis ea veniam assentior.','Dico timeam expetendis te mel, vel solum liber tantas in.','Cibo legimus concludaturque ne mea, te sea mollis laoreet.','Ne soluta semper deseruisse vel, sea nusquam partiendo molestiae ad, eu oratio iriure assueverit vis.','Eu vidit aliquando usu.','Te mea quem efficiantur.','Eu case quodsi eum, nec in debet insolens moderatius.','Saepe euismod pertinacia et sea, ad vix mundi nullam salutatus.','Probo mazim audiam ea duo, tale putant omnesque vis eu.','Eu facer neglegentur sea.','Eu vim quem blandit.','Nobis accusata pertinacia ei pro, sit oratio epicuri lobortis ea, vix ei oblique mediocrem.','No soleat feugiat efficiantur per, his eripuit inermis intellegat ei, sed eu noster labitur aliquando.','Partem facete audiam nec id, pri augue bonorum legimus an.','Has ludus ridens ut, ut vim simul constituam.','Usu vocent offendit principes eu, posse postulant disputationi ex sit, qui ea mutat brute menandri.','Eu consequat posidonium qui.','Veniam bonorum at his, cu menandri suavitate efficiantur sed.','Doming nostro suavitate qui te, pri id causae menandri.','Ex quot case malis cum, qui ei ipsum labitur urbanitas, mei putent sensibus maluisset ei.','Scripta temporibus mea no.','Cu augue volumus eam, purto simul malorum no sit.','Pro eu laudem percipit facilisis, has semper habemus appareat no.','Est te delenit antiopam, atqui nusquam officiis nam te.','Ne sea iriure suavitate definitiones, persius placerat at quo, inani debet mundi vix no.','Sed ne elitr virtute, ne vis elitr omnes corpora, mei in dico novum ponderum.','No paulo consulatu honestatis vis, no mel fierent corrumpit.','Eam exerci conclusionemque eu, prompta inermis id sit, saepe iudico ex ius.','Sit ex civibus fabellas, ad est malorum eruditi antiopam.','Id hendrerit mediocritatem ius, nec ad elit vidisse, sed an eleifend deterruisset.','Quem gubergren consequuntur ex vel, ex has nobis tibique.','Ad qui appareat hendrerit.','Dolore albucius intellegat ex ius, ei per appellantur delicatissimi.','Has ex vitae invidunt, omnes oratio integre eu sea.','Posse docendi oporteat eos ea.','Eam eu dicat tollit consetetur, pericula dissentiunt vis in.','Sonet facilis deseruisse at qui, ceteros mentitum usu et.','Mea maiorum lucilius ex, has pertinax vulputate ut.','Habeo iuvaret te usu, doctus sensibus iracundia ad pri.','Quas integre referrentur est at, quando ponderum eloquentiam mea ut.','Cum agam causae scripserit cu.','Id qui stet omnis, ut everti accusata cum, an altera animal comprehensam est.','Iudico ridens te sea, malis semper ut his, cu sed facilisi sententiae consectetuer.','Dicat integre pertinacia et pro, cum sanctus delectus periculis no.','Ferri malis novum vix at, tota oblique fabulas vix ne.','Eos et nihil cetero, ei duo ignota quidam mentitum.','Sit eu omnium facilisi prodesset.','His tempor accumsan id, pri eu utamur assueverit.','Ferri omnis percipit est ne.','Mel ne iuvaret equidem constituto.','Sint vero legendos eu vim, pro expetenda similique vituperata ea.','Quis electram ei qui, ei debet tamquam perpetua sea.','Ipsum senserit sea id, eam vocent referrentur an, id vivendum delicata ius.','Ex liber splendide constituam vis.','Dicit iriure postulant no quo, mei id inani minim nostrud, meliore euripidis ex vis.','Putant vivendo perpetua vim te, sea augue tincidunt appellantur at, labore aliquam volutpat mel te.','Cum aeque aliquid dissentiunt te.','Mea adhuc aliquam te, sea equidem commune ei.','Vel in amet similique omittantur, ad quo malorum copiosae.','In nam prompta gloriatur, sanctus deleniti ut vel.','Ludus homero habemus te nam.','Ad tota integre sed.','Iusto dissentiunt id usu, et sit esse blandit nominavi.','Vero honestatis eu has, has habeo imperdiet signiferumque ex, porro eripuit deseruisse et est.','Ius illud consulatu te, eu veniam soluta detraxit vim, at pri harum omittam.','Cu his noster volutpat, vel cu solet delectus atomorum, has audire admodum et.','At nam inani everti equidem, ut has regione aliquam.','Has habemus mediocrem facilisis id, ferri fuisset efficiendi sea te, ne nam dicit mundi omnes.','Aeterno lobortis suavitate quo ne.','In vix mundi saperet platonem.','Vel in sumo minimum.','Vel ea veniam qualisque quaerendum, his habemus eloquentiam definitionem ne, ea illum nihil periculis est.','Has id mutat essent liberavisse.','Oporteat legendos delicatissimi ei ius.','Pri omittam consequat ex, id alienum perfecto antiopam mei.','Sed tale scripta et, vel et debet iuvaret accusata, cu feugait accusam ocurreret has.','Cu ubique nusquam sea, duo eu veniam facilisi.','Cum aeque laboramus evertitur in, corrumpit ullamcorper mel no.','Vidit abhorreant no vel, ius dicta persecuti ne, pri clita impetus bonorum eu.','Sea in commodo feugiat quaestio, an per nibh viris facilisis.','Vocibus propriae pri ne.','Mea et percipit recusabo facilisis, ea vix inermis laboramus eloquentiam.','Et nec modus everti, omnis errem cetero ius ut.','Quo eirmod nominavi et, eu vis alterum dolorum ullamcorper.','Et quot admodum ocurreret has, prima congue pro ex.','Epicuri adipiscing vituperatoribus sea cu, virtute eligendi ut pro.','At mea omnesque liberavisse, eros inani deleniti id eos.','Nam propriae contentiones te, pri te munere contentiones.','Sea ex solum tollit mucius, albucius delectus dissentias eam et, sed ea neglegentur signiferumque.','Vim stet ipsum iuvaret ut, no nam alterum euismod admodum.','Clita prodesset id eam, doctus latine scriptorem qui ne.','Eum libris causae diceret eu.','In simul accusata sed.','Ei sit facilisi democritum, alia interesset has ut.','Natum laoreet expetendis vim at, audiam sensibus sapientem mei ne.','Dictas diceret repudiare ea pro, modus nihil mea ei, ad eam agam vidit.','Ex suas unum aperiri sea, dico cibo consectetuer sit at, vix sumo oratio quidam no.','Qui et dolores urbanitas.','Graeco perpetua elaboraret te his, exerci utinam graece ut nec, per ad everti aliquando.','Pro diam persius at, an possim inciderint vel.','Te utinam vivendo mei.','Quodsi suscipiantur ei vim, sea ridens pericula scribentur ea.','Ei modus veniam praesent quo, in eam possit temporibus, rebum idque phaedrum usu cu.','Novum veniam alienum sed id.','Iusto persius maiorum ex sea, his posidonium scripserit vituperatoribus eu.','Possim maiestatis in vis.','Quo an stet voluptua facilisis, at eos vocibus scaevola ponderum.','Vim affert homero et.','Et eum stet civibus, ei rebum sapientem gubergren nam.','Ne mei odio delectus, eam id aperiri impedit incorrupte.','Pri impedit patrioque philosophia ut, sea iisque detraxit adipisci in, odio ipsum voluptaria at sea.','Mei ei homero iuvaret abhorreant, inermis persecuti at mea.','Soluta eripuit eu eam.','Eirmod epicuri at his, latine euripidis no ius, cetero nominati conclusionemque sed ea.','Ea his vero option persecuti, no nusquam perpetua constituto nec, in aliquip virtute salutandi vis.','Ei nusquam laboramus philosophia mel, eam mundi partiendo adversarium at.','Te mea docendi volumus neglegentur.','Usu scripta iuvaret et, per an iudico feugait.','In vix doctus tibique salutatus, at mel erat albucius fabellas, melius consequat vim cu.','Vix ex dicta diceret alterum, id accumsan detracto theophrastus nec.','Quando placerat temporibus est in.','Ignota ornatus at mel.','Elitr dolorem facilisis id his, causae verterem quo no.','Dolorum indoctum reformidans eos et, cu eam partem impedit.','Vix ea porro possim prompta, vide utinam an eos.','Cu qui tritani deseruisse, at tritani expetenda conceptam sed, te his iriure aliquando.','Ne vocent corrumpit accommodare vis.','Doctus iriure intellegam nec in, homero adolescens conclusionemque quo ut, magna semper democritum mel eu.','In graece graecis nec, sit te ornatus epicurei, ludus similique ex nam.','Duo et habemus scribentur, ne libris omnium consetetur pri, ei solum brute vim.','No vim dicam dolorum pertinacia.','Equidem voluptaria id cum.','Nam id summo moderatius.','Vel assum impetus et.','At habeo utamur usu, error salutandi qui te.','Stet tritani duo ne, eius phaedrum signiferumque eum ad.','Docendi postulant et vim, id eam conceptam consequuntur.','Eu harum omnium delicatissimi per.','Ad voluptaria rationibus honestatis vel.','Cum cu meliore evertitur, mei at natum nemore honestatis.','Utinam nominavi fabellas eos ex, id sit nostrud quaeque verterem.','Pri ad eros eruditi, hinc legimus iracundia eam ad.','Usu natum iudico vocibus ut, omnis nulla et sed.','Cum eu tota nonumes, diam solum illum pri at.','Animal ceteros ea eum, stet iisque appareat vis eu.','Ea nam essent tibique omittantur, dicit probatus mediocritatem mea cu.','Integre debitis sed eu, augue placerat ut ius, maiorum copiosae eu sea.','Nec ne congue latine.','Sed at equidem necessitatibus.','Ius ad quodsi oporteat, nec doming quaerendum eu.','Decore instructior ne nam, ne eum oratio altera, qui ei enim cetero euismod.','Vix nonumy ubique nonumes ex.','Eum maiorum delectus ad, nullam accusam at eos.','Elaboraret inciderint quaerendum eam ne.','At purto euismod pri, ea falli quaestio pri, diam habeo sententiae ut vis.','An nam dicat etiam sanctus.','Duo et graeci aeterno efficiantur.','Et putent moderatius duo, veritus definitionem ea vel.','Ea has omnis putant saperet, wisi sonet ad mea.','Dico eripuit assueverit his ut, malorum luptatum complectitur ea eam, semper iuvaret expetenda mel ex.','Qui no oportere definitionem, ex modus quidam adolescens sea.','Autem postulant no has, mundi impedit nam et, usu ei vide quaerendum.','Mei vidit consectetuer te.','Nam populo graeco in, vel solet primis recusabo an.','Vel pericula rationibus te, his id salutatus vituperata.','Mea veniam senserit vituperata in.','Ex malis nullam pri, eos melius accusam dolores in.','Et mea choro appellantur consequuntur, sit inciderint contentiones ei, cum ne brute feugait consulatu.','Ex dicam instructior his.','Id cibo ubique percipitur quo, dico probatus liberavisse ad mea.','Id semper fabellas qui, te usu impetus malorum.','Placerat mnesarchum eu est, an pro alii deterruisset, sed ea everti reformidans.','Mea soleat appetere et, eos id graeci detracto.','Veri illud no mel, illud dolores scriptorem no sit.','Facer splendide in est, no mea zril corpora assentior.','Te posse labores scripserit qui.','Nemore phaedrum liberavisse ei eam.','An mea natum conclusionemque, quo adhuc affert nostrum ut, eum no antiopam torquatos scriptorem.','Elit docendi conceptam ea vix, id vocent aliquid persecuti eos.','Nisl offendit in sea, est quem vitae ne, fastidii appareat accusamus pro an.','Per at percipit petentium voluptaria.','Ne nec atqui impetus, ius te diam tation everti.','Nemore perfecto eu nec, eam adolescens quaerendum in, usu ceteros pertinax ut.','His modus melius at, ei vix atqui liber theophrastus.','Pri eu zril vivendo, audiam rationibus vituperatoribus no duo, in ullum vivendo duo.','Eligendi molestiae eam no, cu feugiat commune reprehendunt per.','Tollit numquam per ne, saepe admodum iracundia eu mel, vix at legimus philosophia consequuntur.','Quem nusquam no mei, an legendos consectetuer conclusionemque mea, an viris volutpat reformidans mea.','An sumo urbanitas vel, ad has impedit copiosae constituto.','Cum ad brute soleat utroque, tantas scriptorem at cum.','Est iriure qualisque et, unum scaevola molestiae sea at, sit ea quem mucius praesent.','Ea eam copiosae tractatos, vis an aperiam delicata interpretaris, in usu summo molestiae.','Te iudico impetus regione qui, ius cu partem consetetur conclusionemque.','Sit doctus evertitur ad.','Id tale suavitate his, per similique maiestatis interpretaris an.','Liber propriae sit et, eos vidit aperiri inimicus et.','Mundi ludus populo et mei, ne wisi appareat vix, an inimicus oportere eam.','Ex harum comprehensam quo, in vix ullum mentitum appareat.','Eu harum tamquam expetendis nam.','Primis singulis pro ei, at eam dolores omittam voluptatum, an viris consul causae pri.','Vim at sapientem salutandi, id vide fugit scribentur vel.','No case signiferumque nam, id atqui prompta detracto vel.','Has quot eius scripta in, pri in esse essent, scribentur mediocritatem no nec.','Graeco inimicus intellegam cu usu.','Vix ne quod volumus deserunt, verear delectus no has.','Audire forensibus duo no, wisi reque velit ea mea, ad eirmod bonorum mea.','Cum in sapientem pertinacia.','Graeci dicunt mediocritatem at sed, wisi prima integre nec cu, at eos clita saperet.','No quo sensibus similique.','Quo ex sint nullam menandri.','Pro novum mundi rationibus in.','In lorem omnesque repudiare qui, in purto pertinax ius.','Id mei facete honestatis appellantur, at sit epicurei intellegam, ullum ocurreret constituto in mei.','Impedit principes rationibus cu eam.','Eu has sonet nullam interesset, quidam eligendi ex sed.','Ei nec malorum sententiae definiebas, has laoreet efficiantur at.','Pri te timeam mediocrem.','No mel scripta adipisci.','Novum vivendo ut vim, ei pro euismod corrumpit, ei nec fierent incorrupte.','Has ea inimicus temporibus, has at posse probatus consulatu.','Dolore audire percipit mel at.','Saepe numquam nominavi mei an, at modus laoreet deleniti per.','Ex duo deleniti iracundia, pri aliquando voluptatum ut.','Ferri euismod cotidieque et his, id soluta quodsi facilisi eam.','Exerci facilisis ea his.','Lucilius iracundia ut duo, ea meis fuisset nominati sed.','Usu ut ludus doctus virtute, et case invidunt elaboraret cum.','Dissentiet necessitatibus in sea, menandri atomorum intellegat cu per.','Est molestie menandri no.','Alii fierent corrumpit in sed, pri incorrupte assueverit ex.','Ut eros noluisse lobortis usu.','Per ea eirmod equidem minimum, cu sit prima iudico.','His te mentitum erroribus, eum at dolorem hendrerit instructior, sea indoctum suavitate vituperatoribus ea.','Commune scaevola mediocrem no quo, iudico offendit sensibus id vel, constituto expetendis eu vis.','Simul tincidunt in his, eum porro malis inciderint an.','Mei cibo quando tempor ex, vis audiam hendrerit no.','Cu mel debitis impedit dissentias, in clita iudico atomorum sea, case intellegam philosophia ex qui.','In feugiat nostrum appetere pri, quod vide fierent ei cum.','Ad est ridens minimum, cum id errem repudiandae ullamcorper, illud dolore iisque cum ad.','Ex dico mucius accommodare eos, dicat aliquip meliore mei ei.','Vix constituto signiferumque ex, alia legimus id vim.','Has eu nonumy possit patrioque.','Usu ne porro congue lobortis.','Quo cu esse dolor, mei salutandi tincidunt constituto an, usu ea assum viderer.','Ei vel sapientem similique.','At dicam senserit eam.','Altera labitur lucilius ea nec, soleat nominati ne qui.','Ea mel sadipscing persequeris, autem etiam vivendum vis ut.','Et mei aliquam veritus, affert audiam quaestio at vix.','At dolor doming reformidans est, duo vidisse volumus dolores ne.','Nam ut solum lobortis laboramus, quem dolorem ancillae ei ius, ut movet tempor argumentum mea.','Oblique euripidis sententiae cu vim.','Ad pro cetero vocibus temporibus.','Cum audiam facilis facilisis ad.','Quod tempor constituto ad pri.','Qui aliquid legimus id, ius sale simul an.','Per summo graeci denique ne, prompta vituperata accommodare eu mea.','An labore facilisi sententiae pro, an vel oratio atomorum.','Utinam aliquam mea ea.','Ei sea elitr mnesarchum honestatis.','An cibo dicta tamquam duo, option accumsan nam et.','Officiis complectitur ex sea.','Agam nullam malorum vel ut, quo sint ponderum pericula ea.','Ut homero contentiones qui, ne sea atomorum voluptatum, eruditi nominati dissentiet qui at.','Ius movet signiferumque ut, ad utamur quaestio vim.','Ius id vidit dicant.','Mei no melius utroque aliquando.','Audiam persequeris at pri.','Ne modo omittantur est.','Epicurei vituperatoribus cum id, id vim quot aperiri salutandi.','Te pro illum utinam, at eos legimus menandri maluisset.','Docendi lucilius mel eu, id mea dicta interpretaris.','In electram vituperata vis, corpora consulatu vis an, ut sea quot nostrum vulputate.','Nam ne iuvaret oportere, dolore oporteat ex vis.','Adhuc brute facilis duo ad, eum eu percipitur signiferumque.','An mea justo iuvaret, dolore virtute legimus mel ea, eius posse scriptorem nec ea.','Ex dicat minim disputando est, noluisse urbanitas torquatos sed id.','In mazim deterruisset sea.','Te zril expetenda consulatu his, falli munere mel ne.','Nibh case mediocrem an eos.','Quas aeque iudicabit his eu, ex omnis interpretaris vix.','No mel impetus quaerendum disputationi, an solet ponderum interpretaris duo.','Eam labitur vivendo at, ex saperet instructior vel.','Ut brute eirmod disputationi nam, blandit intellegam eam et, inani mandamus inciderint nam id.','Ei vis unum altera oblique, ea dolorum adversarium duo.','Elit persius eum ut, vix no tollit ancillae, pro id habeo graeci saperet.','Habeo persius usu id, ad sea eius reque, ius ut solum dicam.','Ex duo partem consetetur, vix legere euismod detraxit an.','Dolorum legendos eos ex.','Vel veri soluta quaestio an, no legimus interesset pro.','Populo essent vituperatoribus vis ea, ei eam animal nominavi assueverit, at dicunt hendrerit similique est.','Nam dolore senserit ea, ius ea porro insolens suscipiantur.','Cu nec paulo congue, et per hinc expetendis liberavisse, mei populo oportere tincidunt te.','Et sed sumo cotidieque, cu per platonem conceptam mnesarchum, qui ex nostrud feugait denique.','Cu audiam efficiendi sea, eos at causae impetus suscipiantur, simul officiis cu mei.','Mel quem equidem ut.','Vis nominavi luptatum atomorum ne, te ignota regione nam.','Nonumy tamquam his no.','Et purto debet perpetua mel, quo lorem error aeterno in.','Id eum quis labores officiis, sed cu ullum utroque albucius.','Graeco suavitate duo ne, tincidunt democritum eos ex.','Mel no elitr liberavisse.','Facer persequeris eum ut.','Mutat qualisque appellantur quo ei, per porro iusto appetere cu, ius quod verear at.','Per ex putant civibus blandit, assum delectus imperdiet ex eam.','Nibh epicurei eleifend per no.','Nibh vocent consectetuer pro et.','Ut his debitis appareat, delenit albucius maluisset eu his.','Minim dicit salutandi ei usu.','Eos ad corpora scripserit, ex possit inermis pertinax nec, an qui eius signiferumque.','Amet tritani sed ne, vix eu alterum scriptorem.','Vim justo suscipit ei, pri eu elit adipisci.','Duo ne alia graeci.','Ad dolore delicatissimi mei, solum velit pericula pri ne.','Reque platonem eu sit, suavitate scriptorem cu vix.','Te cibo mutat affert vix.','Pri omnis illud vocibus ea, vim at illum quando maluisset.','An his everti feugait, sanctus oportere ullamcorper et eam, eos elitr reformidans te.','Pri eu regione expetenda, mel cu sint docendi efficiendi.','An duo lorem aliquando, usu nibh minimum id.','Eos ea mutat sonet evertitur, per dolore vivendo reformidans an, cum labores dolorem eleifend ut.','Ex mea iudico dolore, mea minim nullam an.','Nec ut brute soluta complectitur.','Nam in facilisis repudiare vulputate, atqui commune te cum.','Cu usu singulis constituam.','Id aliquip apeirian sea, inimicus volutpat in est, pri duis suavitate eu.','Eu has cetero petentium argumentum, ullum verterem pertinax et ius.','At sea oblique aliquando, minimum mediocrem maluisset duo at.','Ex nec idque elitr mollis, et per eros gloriatur comprehensam.','Equidem oporteat pro no.','Te est ubique posidonium.','Stet ludus usu no, tempor aliquam lobortis has ea.','At mel veniam volumus, eos et laudem labitur inciderint, ne his magna detracto.','No utinam disputando cum.','Libris percipit hendrerit vis no.','An his option antiopam volutpat.','Id quem quodsi eruditi eum, te adhuc temporibus qui.','Has splendide rationibus consectetuer id.','Vis at idque tation reprimique, at dolor congue maiorum mel.','Est oblique delenit te.','Vix option eruditi eleifend et, vis invidunt sententiae ex, quando sanctus instructior ne eam.','Nec ut epicuri vulputate.','Usu cu mollis comprehensam, sed ad doctus indoctum.','Doming saperet no vim.','Nostro eleifend ea mel, sit in autem graeco denique.','Cu diam blandit efficiantur mea, ocurreret laboramus intellegebat cu quo, malis facer graece id mea.','Praesent electram duo an, malis elaboraret has ne.','Nonumy disputando dissentiet ea eos, ei eos quod case reprimique, an ius sumo nostrud omittam.','An vim impetus molestie, vix ipsum exerci delicata ad, elitr laudem rationibus an pro.','Vim ei aliquip luptatum, utamur fabulas abhorreant has te.','Deserunt mediocritatem vis id, pro suas graeci aeterno no, mazim elitr noster id quo.','Ut mea nemore vocibus.','Nec at odio percipit.','Dico alterum referrentur ad nam, duo posse saepe cu.','In duo agam vidisse debitis.','Prompta suscipit necessitatibus et vim, id nusquam copiosae eos.','Ut eam ludus antiopam patrioque.','Eius ipsum senserit id per.','Mazim aliquip apeirian mei in, no usu iuvaret petentium euripidis, ea nec docendi iudicabit definitiones.','Vis summo recteque ut, liber eloquentiam delicatissimi cu pri, ex usu habeo appareat persecuti.','Vim eleifend salutatus delicatissimi ad, sea nostro consulatu in.','Legere putent temporibus per id, et qui dolorem voluptatum.','Scripta gubergren referrentur vim te.','An qui similique dissentiunt.','Et nonumes petentium pro, usu option volumus ne, per no ridens inciderint.','Te duo viris senserit volutpat.','At periculis sententiae nec.','Per illud tamquam splendide ei, ne vix vero tamquam euismod.','In has tollit tempor.','Abhorreant ullamcorper an mei.','Eam brute legere sapientem in, harum volutpat no sea.','Ne nec utinam suscipit expetenda.','Dicant torquatos ad quo, ius habeo expetendis suscipiantur cu.','Ex sea maiorum argumentum, ne eam veri forensibus persequeris.','Et est scaevola nominati, te blandit accusamus mei.','No nec fuisset pertinacia scriptorem, dicta novum salutatus no his.','Quaeque ornatus praesent sit ex.','Pro id novum appetere signiferumque, assum luptatum te eos.','Aperiam impedit ad mea, his quot novum id, at eam novum omnesque rationibus.','Elit labores ea est, vim ad sanctus pericula concludaturque.','Nusquam partiendo scripserit ne has, sed eleifend indoctum at.','Molestie reprehendunt usu ut.','Sit ei quis quot molestie.','Ne eos assum legimus officiis, ex ancillae patrioque intellegam duo.','Est impetus alterum deserunt cu, in propriae referrentur intellegebat mea.','Graeco aperiri mei id, mentitum legendos ut has, nec vocibus liberavisse et.','Eu erant libris noster pro, dictas consetetur mea te.','Te mea wisi ceteros.','Cu alii repudiare has, sententiae disputando ei vim, eum ut percipit necessitatibus.','Has quodsi vocibus no, tota brute etiam ea mea.','Agam volumus nec ei, te est detracto tacimates, eu mea modo nullam democritum.','Inani platonem pro te, eum ad sumo definiebas persequeris.','Posse dolore salutandi usu ei, nulla persius cu eum.','Pro no fabellas scribentur, nam et partiendo elaboraret necessitatibus.','Eros gubergren an sit.'];
			if(a.tag == "table") {
				var dim = length.split('x');
				var text = ['\n<tr>'];
				for(var j=0;j<dim[0];j++) {
					text.push('<th>Heading '+(j+1)+'</th>');
				}
				text.push("</tr>");
				
				for(var i=1;i<dim[1];i++) {
					text.push("<tr>")
					for(var j=0;j<dim[0];j++) {
						text.push( i==0 ? "<th>" : "<td>" );
						text.push(lorem[parseInt(Math.random() * 457)]);
						text.push( i==0 ? "</th>" : "</td>" );
					}
					text.push("</tr>\n");
				}
				if(prepend) return "<table %attr%>"+text.join('')+'%html%</table>';
				else return "<table %attr%>%html%"+text.join('')+'</table>';
			} else if(a.tag == "ul" || a.tag == "ol" || a.tag == "tr") {
				var text = ['<%tag% %attr%>'];
				if(!prepend) text.push('%html%');
				for(var i=0;i<length;i++) {
					text.push( a.tag == "tr" ? "<td>" : "<li>" );
					text.push(lorem[parseInt(Math.random() * 457)]);
					text.push( a.tag == "tr" ? "</td>" : "</li>" );
				}
				if(prepend) text.push('%html%');
				text.push('</%tag%>');
				return text.join('');
			} else {
				if(length== true) length = 80;
				var rand = parseInt(Math.random() * 457);
				var text = [];
				var para = parseInt(Math.random()*5) + 1;
				while(text.length < length) {
					text = text.concat(lorem[rand%457].split(' '));
					if(para-- == 0 && length-rand > 5 && !nobreak) {
						para = parseInt(Math.random()*5) + 1;
						text.push('</%tag%><%tag% %attr%>');
					}
					rand++;
				}
				if(prepend) return '<%tag% %attr%>'+text.slice(0,length).join(' ')+'.%html%</%tag%>';
				else return '<%tag% %attr%>%html% '+text.slice(0,length).join(' ')+'.</%tag%>';
			}
		},
	},
	{
		tag: "*[populate]",
		attr: ['populate'],
		html: function(a) {
			var text = [];
			var $ = a.$;
			var target = $(a.attr.populate);
			if(target.length) {
				target.each(function(index) {
					if($(this).attr('id') !== undefined) {
						text.push('<a href="#'+$(this).attr('id')+'">'+$(this).html()+'</a>');
					} else {
						var idName = $(this).text().replace(/[^a-zA-Z\- ]/g,'').toLowerCase().replace(/\-/g,' ').replace(/ +/g,'-');
						if($('#'+idName).length) {
							if(!idName) idName = 'octoml-page';
							var idVal = 1;
							while( $('#'+idName+'-'+idVal).length && idVal < 100) idVal++;
							//$(this).attr('id',a.id+'-'+index);
							if(idVal<100) {
								text.push('<a href="#'+idName+'-'+idVal+'">'+$(this).html()+'</a></li>');
								$(this).attr('id',idName+'-'+idVal);
							}
						} else {
							$(this).attr('id',idName);
							text.push('<a href="#'+idName+'">'+$(this).html()+'</a></li>');
						}
					}
				});
				//yonsole.log('populate '+a.tag);
				if(a.tag == "pills" || a.tag == "tabs") {
					return '<%tag% %attr%>%html%'+text.join('')+'</%tag%>';					
				} else if(a.tag == "ul") {
					return '<%tag% %attr%>'+text.map(function(b) { return '<li>'+b+'</li>'; }).join('')+'</%tag%>';
				} else if(a.tag == "li") {
					return text.map(function(b) { return '<li %attr%>'+b+'</li>'; }).join('');					
				} else if(a.tag == "a") {
					return text.map(function(b) { return b.replace(/<a href/,'<a %attr% href'); }).join('');					
				} else {
					return '<%tag% %attr%>%html%'+text.join('\n')+'</%tag%>';
				}
			} else return '<%tag% %attr%>%html%</%tag%>';
		},
	},		
	{
		tag: "*[clone]",
		attr: ['clone'],
		html: function(a) {
			var $ = a.$;
			var clone = a.attr.clone.replace(/:outer[; ]*$/,'').replace(/:text[; ]*$/,'');
			var target = $(clone);
			if(target.length) {
				if(a.attr.clone.match(/:outer[; ]*$/)) {
					var outer = [];
					target.each(function() {
						outer.push( this.outerHTML );
					});
					return '<%tag% %attr%>%html%'+outer.join('\n')+'</%tag%>';
				} else if(a.attr.clone.match(/:text[; ]*$/)) {
					var outer = [];
					target.each(function() {
						outer.push( $(this).text() );
					});
					
					return '<%tag% %attr%>%html%'+outer.join('\n')+'</%tag%>';
					
				} else {
					var outer = [];
					target.each(function() {
						outer.push( $(this).html() );
					});
					
					return '<%tag% %attr%>%html%'+outer.join('\n')+'</%tag%>';
					
				}
			} else {
				return '<%tag% %attr%>%html%</%tag%>'
			}
		}
	},
	
	{
		tag: "gallery",
		attr: ['files','folder','extension','pics','alts'],
		html: function(a) {
			var list = [];
			var alts = a.attr.alts ? a.attr.alts.split(',') : [];
			if(a.attr.files) {
				var pathRe = new RegExp("^" + a.global.path.replace(/\\/g,'/').replace(/[\-\[\]\{\}\(\)\*\+\?\.\^\$\|]/g, "\\$&").replace(/\//g,'[\\\/]'));
				var files = glob.sync(a.global.path+a.attr.files).map(function(b) {return b.replace(pathRe,'');});
				for(var i=0;i<files.length;i++) {
					if(alts.length) {
						list.push('<img src="'+files[i]+'" alt="'+alts[0]+'" %attr%>');
						alts.shift();
					} else list.push('<img src="'+files[i]+'" alt="Image '+(i+1)+'" %attr%>');
				}
			}
			if(a.attr.pics) {
				var folder = a.attr.folder ? (a.attr.folder.match(/\/$/) ? a.attr.folder : a.attr.folder+'/') : "";
				var extension = a.attr.extension ? (a.attr.extension.match(/^\./) ? a.attr.extension : '.'+a.attr.extension) : "";
				//has a list of pics to add
				var picList = a.attr.pics.split(',');
				for(var i=0;i<picList.length;i++) {
					if(picList[i].match(/[0-9]+-[0-9]+$/)) {
						//expand range
						var start = parseInt(picList[i].replace(/(.*)?([0-9]+)-[0-9]+$/, '$2'));
						var end = parseInt(picList[i].replace(/(.*)?[0-9]+-([0-9]+)$/, '$2'));
						var root = picList[i].replace(/(.*)?[0-9]+-([0-9]+)$/, '$1');
						for(var j=start;j<end+1;j++) {
							if(alts.length) {
								list.push('<img src="'+folder+root+j+extension+'" alt="'+alts[0]+'" %attr%>');
								alts.shift();
							} else list.push('<img src="'+folder+root+j+extension+'" alt="Image Gallery: '+root+j+'" %attr%>');
							//list.push('hello')
						}
					}
				}  
			}
			return '<gallery>%html%' + list.join('\n') + '</gallery>';
		},
	},
	{
		tag: "carousel > gallery",
		html : "%html%",
		inner: [
		{
			tag: "img",
			html: "<slide><img center responsive %attr%></slide>%html%",
		}
		],
	},
	{
		tag: "thumbnails > gallery",
		html : "%html%",
		inner: [
		{
			tag: "img",
			html: "<thumb><img %attr%></thumb>%html%",
		}
		],
	},
	{
		tag: "gallery",
		html: '%html%',
	},

	{
		tag: "pic",
		attr: {'center':'','circle':'','wow':' wow="%val%"','duration':' duration="%val%"','delay':' delay="%val%"','offset':' offset="%val%"','iteration':' iteration="%val%"'},
		html: function(a) {
			if(a.attr.center) {
				if(a.attr.circle) return '<div class="center-block"><div style="display:inline-block;position:relative;border-radius:100%;" %wow%%duration%%delay%%offset%%iteration%><img center circle %attr%><div style="position:absolute;top:0;left:0;width:100%;height:100%;">%html%</div></div></div>';
				else return '<div class="center-block"><div style="position:relative;display:inline-block;"%wow%%duration%%delay%%offset%%iteration%><img center %attr%><div style="position:absolute;top:0;left:0;width:100%;height:100%;">%html%</div></div></div>';
				
			} else {
				if(a.attr.circle) return '<div style="display:inline-block;position:relative;border-radius:100%;" %wow%%duration%%delay%%offset%%iteration%><img circle %attr%><div style="position:absolute;top:0;left:0;width:100%;height:100%;">%html%</div></div>';
				else return '<div style="position:relative;display:inline-block;"%wow%%duration%%delay%%offset%%iteration%><img %attr%><div style="position:absolute;top:0;left:0;width:100%;height:100%;">%html%</div></div>';
			}
		},
	},
	{
		tag: "hero",
		html: '<div class="hero" %attr%>%html%</div>',
		first: function(a) {
			a.global.css += "\n.hero {text-align:center;position:absolute;top:50%;left:50%;transform: translate3d(-50%,-50%,0);}";
			return '<div class="hero" %attr%>%html%</div>';
		},
	},
	
	{
		tag: "circle",
		attr: {
		'src':'%val%',
		'bg':'background:%val%;',
		'size':'width:%val%px;height:%val%px;',
		},
		html: '<div style="display:inline-block;vertical-align:bottom;position:relative;border-radius:50%;%bg%%size%" %attr%><div style="position:absolute;top:50%;left:50%;text-align:center;transform:translate(-50%,-50%);">%html%</div></div>'
	},

	{
		tag: "triangle",
		attr: {
		'src':'%val%',
		'bg':'%val%',
		'size':'%val%',
		'width':'%val%',
		'height':'%val%',
		direction: ['up','down','left','right'],
		},
		html: function(a) {
			var w,h;
			if(a.attr.width && a.attr.height) {
				w = a.attr.width;
				h = a.attr.height;
			} else {
				h = a.attr.size || 200;
				w = h*0.577;
			}
			
			var d = a.attr.direction || 'up';
			var e = (d=='up') ? [0,h,'left','right','bottom',(h/1.6),0] :
					(d=='down') ? [0,h,'left','right','top',-(h/1.6),0] :
					(d=='left') ? [w,0,'top','bottom','right',0,(w/0.9)] :
						[w,0,'top','bottom','left',0,-(w/0.9)];
			return '<div style="display:inline-block;vertical-align:bottom;position:relative;' + 
			'width:'+e[0]+'px;height:'+e[1]+'px;border-'+e[2]+':'+w+'px solid transparent;border-'+e[3]+':'+w+'px solid transparent;border-'+e[4]+':'+h+'px solid %bg%;" %attr%><div style="position:absolute;top:'+e[5]+'px;left:'+e[6]+'px;text-align:center;transform:translate(-50%,-50%);">%html%</div></div>';
		}
	},

	
	

],

};	

