var _ = require('underscore');
var fs = require('fs');
var async = require('async');
var jsdom = require('jsdom');
var jQuery = require('jquery');
var JSONfn = require('json-fn');
var he = require('he');
var $;

module.exports = OctoML;

/* ---------------------------
		  Main Function
   --------------------------- */

// Initialised with a Language Object or filename of a Language file.

function OctoML(langIn) {
	this.lang = new Language(langIn);
}


// Public method: load(filename, callback, [options])
// Loads OctoML file and converts it

OctoML.prototype.load = function(filename,callback,options) {
	
	var text = fs.readFileSync(filename,'utf-8');
	this.load(text,filename,callback,options);
};
	
OctoML.prototype.parse = function(text,filename,callback,options) {
	var self = this;
	var global = {head:"",body:""};
	for(var i in self.lang.global) {
		var j = self.lang.global[i];
		if(_.isArray(j)) global[i] = j.slice();
		else if(_.isObject(j)) global[i] = _.clone(j);
		else global[i] = j
	}
	global.path = filename.replace(/[^\\\/]*$/,'');
	global.src = filename.replace(/^(.*[\\\/])[^\\\/]*$/,'$1');
	global.opts = options || {};
	var octo = new Parser(global);
	octo.convert(self.lang,text,callback);
}




/* ---------------------------
		    Language
   --------------------------- */

// Initialised with a Language Object or filename.
// Alternatively can be called with an array of tags
// Returns a Language Object, precomputed with attribute objects

/* Language Object:

{
	global: { global data },
	pre: [{tag}, ... ],
	main: [{tag} ... ],
	post: [{tag} ... ],
}
*/
 
function Language(langIn) {
   
	var self = this;
	if(_.isArray(langIn)) {
		//Called with an array of tags
		//This is used when an 'inner' is created dynamically by a function
		self.processLang(langIn,{});
		return langIn;
	} else if(_.isString(langIn)) {
		var langList = [langIn];
		var lang = {};
		for(var i=0;i<langList.length;i++) {
			var b = loadLangObj(langList[i]);
			if(_.has(b,'include')) {
				//add these in
				langList = langList.slice(0,i+1).concat(b.include).concat(langList.slice(i+1))
			}
			append(lang , b);
		}

		return this.process(lang);
	} else return this.process(langIn);
}

Language.prototype.process = function(lang) {
	var self = this;
	var single = [];
	// now pre-process languages
	if(_.has(lang,'pre') && _.isArray(lang.pre)) {
		lang.pre.forEach(function(a) {
			//create regex
			if(a.hasOwnProperty('tag')) {
				if(a.hasOwnProperty('single') && a.single == true) {
					a.tagRegex = new RegExp('(<'+a.tag+'[^>]*>)','igm');
					single.push(a.tag);
				} else {
					a.tagRegex = new RegExp('(<'+a.tag+'[^>]*>[\\s\\S]*?<\/'+a.tag+'>)','igm');
				}
			}
			
			//processAttr(a,{});
			self.attr(a,{});
		});
	}
	if(_.has(lang,'main') && _.isArray(lang.main)) {
		self.processLang(lang.main,{},single);
	}
	if(_.has(lang,'post') && _.isArray(lang.post)) {
		self.processLang(lang.post,{},single);
	}

	lang.single = _.uniq(single)
	return lang;
}

   
   
function loadLangObj(a) {
	if(_.isString(a)) {
		if(a.match(/^\.\//)) {
			return require(a.replace(/^\.\//,process.cwd()+'/'));
		} else {
			return require(__dirname+'/'+a);
		}
	} else if(_.isObject(a)) {
		return a;
	} else return {};
}


Language.prototype.processLang = function(lang,parent,single) {
	var self = this;
	lang.forEach(function(a) {
		self.attr(a,parent);
		if(single && _.has(a,'single') && a.single == true) {
			single.push(a.tag);			
		}
		if(_.has(a,'inner') && _.isArray(a.inner)) {
			self.processLang(a.inner,a,single);
		}
	});
}


Language.prototype.attr = function(a,parent) {
	a.attrList = [];
	a.attrObj = {};
	a.attrRegex = {};
	a.attrGroup = {};
	if(!_.has(a,'attrDefault') || !_.isObject(a.attrDefault)) a.attrDefault = {};
	a.attrInheritList = [];

	var attrType = _.has(a,'attr') ? (_.isArray(a.attr) ? 'array' : (_.isObject(a.attr) ? "object" : "unknown")) : false;
	var inheritType = _.has(a,'attrInherit') ? (_.isArray(a.attrInherit) ? 'array' : (_.isObject(a.attrInherit) ? "object" : "unknown")) : false;
	
	if(attrType === "object") {
		a.attrObj = _.clone(a.attr);
	}

	if(inheritType === "object") {
		_.extend(a.attrObj,a.attrInherit);
		a.attrInheritList = _.keys(a.attrInherit);
	} else if(inheritType === "array") {
		a.attrInherit.forEach(function(b) {
			if(!_.has(a.attrObj,b)) {
				if(_.has(parent.attrObj,b)) a.attrObj[b] = parent.attrObj[b];
				else a.attrObj[b] = "%val%";
			}
			if(!_.has(a.attrDefault,b) && _.has(parent.attrDefault,b)) a.attrDefault[b] = parent.attrDefault[b]; 
		});
		a.attrInheritList = a.attrInherit.slice();
	}
	if(attrType === "array") {
		a.attr.forEach(function(b) {
			if(!_.has(a.attrObj,b)) a.attrObj[b] = "%val%";
		});
	}
	
	var allReg = ['%tag%','%id%','%attr%'].concat(_.keys(a.attrObj).map(function(a) {
		return '%' + escapeRegExp(a) + '%';
	})).join('|');
	a.attrAllRegex = new RegExp(allReg,'img');

	if(_.has(a,'attrType')) {
		for(var i in a.attrType) {
			if(_.isArray(a.attrType[i])) {
				a.attrType[i].forEach(function(j) {
					a.attrGroup[j] = i;
				});
				if(!_.has(a.attrObj,i)) {
					a.attrObj[i] = "%val%";
				}
			}
			
		}
	}
	for(var i in a.attrObj) {
		a.attrRegex[i] = new RegExp('%'+escapeRegExp(i)+'%','g');
		if(_.isArray(a.attrObj[i])) {
			a.attrObj[i].forEach(function(j) {
				a.attrGroup[j] = i;
			});
		}
		if(!_.has(a.attrDefault,i)) a.attrDefault[i] = "";
	}	
}


function append(a,b) {
	//append object b to object a
	for(var i in b) {
		if(i !== 'include') {
			if(_.has(a,i)) {
				//if also in b
				if(_.isArray(a[i]) && _.isArray(b[i])) {
					a[i] = a[i].concat(b[i]);
				} else if(_.isObject(a[i]) && _.isObject(b[i])) {
					_.extend(a[i],b[i]);
				} else if(_.isString(a[i]) && _.isString(b[i])) {
					a[i] += b[i];
				} else {
					console.log('err appendObj do not recognise datatype '+(typeof a[i])+', '+(typeof b[i]));
				}
			} else {
				a[i] = b[i];
			}
		}
	}
	return a;
}

/*
	Tag Object:
{
	tag: 'css selector(s)',
	
	single: true|false,
	async: true|false,	//async function - only of root tag (not in inner)
	
	attr: ['attr1','attr2',...]
	or :  { attr1: '%val%'|function(data),
		    attr2: '%val%'|function(data) },
	attrDefault: {
		attr1: 'alternative'|function(data),
		attr2: ''|function(data)
	},
	attrType: {
		fruit: ['apples','oranges']
	},
	
	first:
	last:
	html:
		'html string',
	or	{
			html: 'html string',
			css: 'other global data',
		}
	or	function(data)
	or  function(data,callback)	//if async
	
	inner: [ {tag},{tag},... ]
	or	   function(data) 		//always sync
}

Precomputed Values
{
	attrObj: { allAttrObjects
	},
	attrType
}

*/


/* ---------------------------
		OctoML Parser
   --------------------------- */

function Parser(global) {

	this.global = global;
	this.index = 0;
	this.output = {};
}

Parser.prototype.convert = function(lang,text,callback) {
	var self = this;
	self.pre(text,lang.pre,function(a) {
		self.main(a,lang.main,lang.single,function(b) {
			self.post(b,lang.post,function(c) {
				//window.close();
				callback(c);
			});
		});
	});	
}


/* ---------------------------
		Text Preprocessor
   --------------------------- */

Parser.prototype.pre = function(text,pre,callback) {
	var self = this;
	if(pre && _.isArray(pre) && pre.length) {
		self.preRerun(pre,text,0,callback);
	} else callback(text);
}

Parser.prototype.preRerun = function(tagList,text,num,callback) {
	var self = this;
	if(num > 5) callback(text); 
	else self.preTagList(tagList,text,function(a) {
		//console.log('prerun '+num+' '+a.found);
		if(a.found) self.preRerun(tagList,a.text,num+1,callback);
		else callback(a.text);
	},num);
}

Parser.prototype.preTagList = function(tagList,text,callback,rerun) {
	var self = this;
	var found = false;
	if(tagList && _.isArray(tagList) && tagList.length) {
		
		async.eachSeries(tagList,function(a,cb) {
			if(rerun && a.rerun !== true) cb();
			else self.preTag(a,text,function(b) {
				if(b) {
					text = b;
					found = true;
				}
				cb();
			});
		},function() {
			callback({text:text,found:found});
		});
	} else callback({text:text,found:found});
}

Parser.prototype.preTag = function(tag,text,callback) {
	var self = this;
	if(tag.hasOwnProperty('tag')) {
		//between tags
		var textList = text.split(tag.tagRegex);
		var length = parseInt(textList.length/2);
		var i = -1;
		//console.log(tag.tag+' : '+length);
		if(length) {
			async.mapSeries(textList,function(a,b) {
				i++;
				if(i%2==0) b(null,a);
				else {
					self.preRun({tag:tag,html:a,index:i,length:length},b)
				}
			},function(err,c) {
				setTimeout(function() { callback(c.join('')); },0);
			});
		} else {
			callback(false);
		}
	} else {
		setTimeout(function() { callback(tag.html({html:text})); },0);
	}
}


Parser.prototype.preRun = function(data,callback) {
	
	var self = this,
		text = data.html,
		lang = data.tag,
		single = lang.hasOwnProperty('single') && lang.single,
		html = single ? "" : text.replace(/^<[^>]*>([\s\S]*)<\/[^>]*>$/m,'$1'),
		openTag = single ? text : text.replace(/^(<[^>]*>)[\s\S]*/m,'$1'),
		attr = {};
	
	openTag.replace(/\s(\S+)\s*=\s*("[^"]+"|'[^']+'|[^'"\s<>]+)/g,function(a,b,c) {
		attr[b] = c.replace(/^"(.*)"$|^'(.*)'$/,'$1');
	});

	var attrGroup = mainAttrSplit(attr,lang,{});
	var first = (data.index==0);
	var last = (data.index == data.length-1);
	var id = attrGroup.attr.id ? attrGroup.attr.id : attrGroup.attrOther.id ? attrGroup.attrOther.id : false;
	var props = _.extend(attrGroup,{
		tag: lang.tag,
		html: html,
		text: html,
		first: first,
		last: last,
		index: data.index,
		length: data.length,
		global: self.global,
		id: function() {
			if(!id) id = self.getID();
			return id;
		},
		top: "",
		bottom: "",
	});


	var data = {tag: lang,props:props};
	if(_.isFunction(lang.html)) {
		if(lang.hasOwnProperty('async') && lang.async == true) {
			lang.html(props,function(a) {
					self.preWrite(data,a,callback);
			});
		} else {
			var a = lang.html(props);
			self.preWrite(data,a,callback);
		}
	} else if(_.isObject(lang.html)) {
			var a = _.extend({},lang.html);
			self.preWrite(data,a,callback);
	} else if(_.isString(lang.html)) {
		var a = {html:lang.html};
			self.preWrite(data,a,callback);
	} else {
		console.log('err cannot recognise output from '+lang.tag);
		callback();
	}
}

Parser.prototype.preWrite = function(data,output,callback) {
	var self = this;
	var obj = _.isString(output) ? {html:output} : output;
	var result = replaceObj(data.tag,data.props,obj,self.convertText);
	self.addConfig(result);
	callback(null,result.html);
}












/* ---------------------------

			 Main

   --------------------------- */

Parser.prototype.main = function(text,main,single,callback) {
	var self = this;

	//Create DOM
	jsdom.env(text, function (errors, window) {
		//jquery
		$ = jQuery(window);

		var body = $('body');
		if(body.length == 0) {
			$('> *').first().before('<body>');
			$('> *').last().after('</body>');
			body = $('body');
		}

		self.global.obj = body;
		var bHTML = body[0].outerHTML;
		self.global.body = bHTML
		var head = $('head');		
		if(head.length) {
			self.global.head += head.html();
		}
		self.global.doctype = text.match(/^[\s\r\n]*<\!doctype/mi) ? text.replace(/^[\s\r\n]*(<\![^>]*>)[\s\S]*/mi,'$1') : ""
		if(main && _.isArray(main) && main.length) {
			//the DOM will have created </close> tags for single tags,
			//this will mess with your parse tree (particularly any
			//immediate descendant ( > ) selectors). To clean this up
			//go through each known single tag and put the </close>
			//tag immediately after
			self.processSingle(body,single);
			var mainOpts = {
				obj:body,
				html:self.global.body,
				top:"",
				bottom:""
			};
			self.mainRerun(main,mainOpts,0,function() {					
				var bodyHTML = $('body')[0].outerHTML;
				//free memory
				$ = null;
				window.close();
				callback([bodyHTML,mainOpts.top,mainOpts.bottom]);
			});
		} else {
			$ = null;
			window.close();
			callback([bHTML]);
		}
	});
}

Parser.prototype.mainRerun = function(tagList,parent,num,callback) {
	var self = this;
	if(num > 5) callback(); 
	else self.mainLang(tagList,parent,function(a) {
		//console.log('run '+num+' '+a);
		if(a) self.mainRerun(tagList,parent,num+1,callback);
		else callback();
	},num);
}

Parser.prototype.mainLang = function(tagList,parent,callback,rerun) {
	var self = this;
	// Go through list of root tags.
	// Some may be async functions
	var found = false; // has any of the tags been found?
	if(tagList && _.isArray(tagList) && tagList.length) {
		async.eachSeries(tagList,function(a,b) {
			//console.log(a.tag);
			if(rerun && a.rerun !== true) b();
			else if(_.has(a,'async') && a.async == true) {	
				self.mainTag(a,parent,function(c) {
					if(c) found = true;
					b()
				});
			} else {
				if(self.mainTag(a,parent)) found = true;
				b();
			}
		},function() {
			callback(found);
		});
	} else {
		callback(found);
	}
}


Parser.prototype.mainTag = function(tag,parent,callback) {
	var self = this;
	//for a single tag. find all instances of selector
	var list = self.find(parent,tag);
	if(callback) {
		//if async
		if(list.length) {
			async.eachSeries(list,function(props,b) {
				if(props.length) self.mainRun(tag,props,b);
				else b();
			},function() {
				callback(true);
			});
		} else callback(false);
	} else {
		//else if sync
		if(list.length) {
			list.forEach(function(props) {
				if(props.obj.length) self.mainRun(tag,props);
			});
			return true;
		} else {
			return false;
		}		
	}
}



Parser.prototype.mainRun = function(tag,props,callback) {
var self = this;
//for object data.obj
//run data.tag.html on this data, get output code (inc outer)
//if this is nested, run mainTag on the inside of this obj
//if this has an inner, run mainTagList on that
//all of these need to give back an outer
//apply what you can, and return the outer
if(callback) {
	self.mainHTML(tag,props,function(a) {

		//you've run the tag, now is it nested?
		if(_.has(tag,'nested') && tag.nested == true) {
			self.mainTag(tag,props,function() {
				self.mainInner(tag,props,a);
				callback();
			});
		} else {
			self.mainInner(tag,props,a);
			callback();
		}
	});
} else {
	var a = self.mainHTML(tag,props);

	//you've run the tag, now is it nested?
	if(_.has(tag,'nested') && tag.nested == true) {
		self.mainTag(tag,props);
		self.mainInner(tag,props,a);
	} else self.mainInner(tag,props,a);
}

}


Parser.prototype.mainHTML = function(tag,props,callback) {
//take html (object / function)
//return answer in callback
	var self = this;
	var html = self.props(tag,props);
	if(callback) {
		if(_.isFunction(html)) {
			html(props,function(a) {
				callback(self.mainParseOutput(a));
			});
		} else callback(self.mainParseOutput(html));	
	} else {
		if(_.isFunction(html)) {
			var a = html(props);
			var b = self.mainParseOutput(a);
		} else {
			var b = self.mainParseOutput(html);
		}
		return b;
	}
}

Parser.prototype.props = function(tag,props) {
	var self = this;
	var attr = self.mainAttr(props,tag);
	var first = (props.index==0);
	var last = (props.index==props.length-1);
	var id = attr.attr.id ? attr.attr.id : (attr.attrOther.id ? attr.attrOther.id : '');
	_.extend(props,attr,{
		//jquery
		$: $,
		tag: 	props.obj[0].tagName.toLowerCase(),
		html: 	props.obj.html(),
		text:	props.obj.text(),
		global: self.global,
		first:	first,
		last:	last,
		attrText: {},
		attrDefaultText: {},
		top: 	"",
		bottom:	"",
		id:		function() {
					if(!id) id = self.getID();
					return id;
				},
	});	
	//now run the correct function with these props

	for(var i in tag.attrObj) {
		var j = tag.attrObj[i];
		if(_.isArray(j)) props.attrText[i] = "%val%";
		else if(_.isFunction(j)) props.attrText[i] = j(props);
		else props.attrText[i] = j;
	}
	for(var i in tag.attrDefault) {
		var j = tag.attrDefault[i];
		if(_.isFunction(j)) props.attrDefaultText[i] = j(props);
		else props.attrDefaultText[i] = j;
	}	

	var html = (props.first && _.has(tag,'first')) ? tag.first :
		( (props.last && _.has(tag,'last')) ? tag.last :
			( _.has(tag,'html') ? tag.html : '<%tag% %attr%>%html%</%tag%>') );
	return html;
}

Parser.prototype.mainParseOutput = function(output) {
	
	var result = {};
	if(_.isArray(output)) {
		result.html = output;
	} else if(_.isString(output)) {
		result.html = [output];
	} else if(_.isObject(output)) {
		if(_.has(output,'html') && _.isString(output.html)) output.html = [output.html];
		result = output;
	}
	for(var i in result) {
		if(_.isFunction(result[i])) result[i] = result[i].toString().replace(/^\s*function\s*\(\s*\)\s*{([\s\S]*)}\s*$/,'$1');
	}
	return result;
}







Parser.prototype.find = function(parent,tag) {
	if(_.has(tag,'tag') && tag.tag) {
		var obj = parent.obj.find(tag.tag),
			objLength = obj.length,
			list = [];
		if(objLength) {
			list.push({obj: obj.eq(0),index:0,parent:parent});
			for(var i=1;i<objLength;i++) {
				var a = list[list.length-1].obj,
					b = obj.eq(i);
				//jquery
				if(!$.contains(a[0],b[0]) && !$.contains(b[0],a[0])) {
					list.push({obj:b,index:list.length,parent:parent});
				}
			}
		}
		var length = list.length;
		list.forEach(function(a) {
			a['length'] = length;
		});
		return list;
	} else return [{
		obj: parent.obj,
		index: 0,
		length: 1,
		parent:parent,
	}];
}


Parser.prototype.mainAttr = function(props,tag) {
	var attr = {};
	//jquery
	$.each(props.obj[0].attributes, function() {
		if(this.specified) attr[this.name] = this.value;
	});
	return mainAttrSplit(attr,tag,props);
}


function mainAttrSplit(attr,tag,props) {
	var attrMain = {},
		attrOther = {};
	for(var i in tag.attrObj) attrMain[i] = false;

	for(var attrName in attr) {
		var attrVal = attr[attrName];
		if(_.has(tag.attrObj,attrName)) {
			if(attrVal) attrMain[attrName] = attrVal;
			else attrMain[attrName] = true;
		} else if(_.has(tag.attrGroup,attrName)) {
			attrMain[tag.attrGroup[attrName]] = attrName;
		} else if(attrVal) {
			attrOther[attrName] = attrVal;
		} else attrOther[attrName] = true;

	}

	if(_.has(tag,'attrInheritList') && tag.attrInheritList.length && _.has(props,'parent') && _.has(props.parent,'attr')) {
		tag.attrInheritList.forEach(function(a) {
			if(attrMain[a] == false) {
				if(_.has(props.parent.attr,a)) attrMain[a] = props.parent.attr[a];
				else if(_.has(props.parent.attrOther,a)) attrMain[a] = props.parent.attrOther[a];
			}
		});
	}


	return {attr:attrMain,attrOther:attrOther};
}


Parser.prototype.processSingle = function(obj,single) {
	var self = this;
	single.forEach(function(a) {
		var b = obj.find(a);
		if(b.length) {
			//jquery
			b.each(function(index) {
				$(this).attr('octoml-single',index);
			});
			
			for(var i=0;i<b.length;i++) {
				var c = obj.find('[octoml-single='+i+']');
				c.after(c.contents()).removeAttr('octoml-single');
			}
			
		}
	});
}




Parser.prototype.mainInner = function(tag,props,a) {
	var self = this;
	if(_.has(tag,'inner')) {
		var inner;
		if(_.isFunction(tag.inner)) {
			//console.log('function '+tag.tag);
			inner = new Language(tag.inner(props));
			
		} else {
			inner = tag.inner;
		}
		if(_.isArray(inner)) {
			inner.forEach(function(b) {
				self.mainTag(b,props);
			});
			//self.mainTagList(inner,props);
			self.mainWrite(tag,props,a);
		} else if(_.isObject(inner)) {
			self.mainTag(inner,props);
			self.mainWrite(tag,props,a);
		} else {
			self.mainWrite(tag,props,a);
		}
	} else {
		self.mainWrite(tag,props,a);
	}
}

Parser.prototype.mainWrite = function(tag,props,output) {
	var self = this;
	var result = (tag.replace === false) ? output : self.convertObj(tag,props,output);
	//now may have html with outer, and other things
	//add in everything but the html
	self.addConfig(result);
	//now the html, go through
	if(_.has(result,'html')) {
		if(_.isArray(result.html) && result.html.length) {
			//ok, first just replace the object with html[0]
//			if(_.has(data,'noTag') && data.noTag == true)
//				data.props.obj.html(result.html[0]);
			//else
			if(tag.tag) props.obj.replaceWith(result.html[0]);
			else {
				//console.log('notag '+result.html[0]);
				props.obj.html(result.html[0]);
			}
			var working = true;
			var currentParent = props.parent || false;
			for(var i=1;i<result.html.length && currentParent;i++) {
				if(i%2) {
					//odd (top)
					currentParent.top += result.html[i];
				} else {
					currentParent.bottom = result.html[i] + currentParent.bottom;
					currentParent = props.parent || false;
				}
			}
		} else {
			console.log('err, resulting html has not been made into an Array');
		}
	}
}


Parser.prototype.convertObj = function(tag,props,output) {
	var self = this;
	props.html = props.obj.html();
	var result = replaceObj(tag,props,output,self.convertText);
	return result;
}


Parser.prototype.convertText = function(tag,props,result) {
	//go through and replace all %var%
	if(tag.replace === false) return result;
	var self = this;
	var id;
	var allRegex = tag.attrAllRegex;
	while(result.match(allRegex)) {
		
		result = result.replace(/%tag%/ig,escapeReplace(props.tag));

		// need %id% and %attr% done properly
		// first id, does it have it as a property
		if(result.match(/%id%/i)) {
			if(!id) id = props.id();
			result = result.replace(/%id%/ig,escapeReplace(id));
		}
	
		//replace any attr variables
		for(var i in props.attr) {
			//result = result.replace(new RegExp('%'+i+'%','g'), props.attr[i]);
			//console.log('trying attr '+JSON.stringify(tag));
			if(props.attr[i] === false) result = result.replace(tag.attrRegex[i], props.attrDefaultText[i]);
			else {
				if(!_.has(props.attrText,i)) console.log('err cannot find '+i+' : '+props.tag+' - '+JSON.stringify(props.attrText));
				if(props.attr[i] === true) {
					result = result.replace(tag.attrRegex[i], escapeReplace(props.attrText[i].replace(/%val%/g,escapeReplace(''))));
				} else {
					result = result.replace(tag.attrRegex[i], escapeReplace(props.attrText[i].replace(/%val%/g,escapeReplace(props.attr[i]))));
				}
			}
		}

		//replace %attr%,
	
		if(result.match(/%attr%/i)) {
			if(result.match(/<(=\s*"[^"]*"|=\s*'[^']*'|[^>])*%attr%(=\s*"[^"]*"|=\s*'[^']*'|[^>])*>/i)) {
				result = result.replace(/<([^\s>]+)((=\s*"[^"]*"|=\s*'[^']*'|[^>])*)%attr%((=\s*"[^"]*"|=\s*'[^']*'|[^>])*)>/igm, function(a,b,c,d,e) {
					var x = addAttr('<'+b+c+e+'></'+b+'>',props.attrOther);
					return escapeReplace(x);
				});
				
			}
			if(result.match(/%attr%/i)) {
				console.log('err %attr% in the wild! '+tag.tag);
				break;
			}
		}
	
	
	}
	if(tag.single === true) {
		result = result.replace(/%html%/ig,'') + props.html;
	} else {
		result = result.replace(/%html%/ig,escapeReplace(props.top + props.html + props.bottom));
	}
	return result;
}

function addAttr(html,attr) {

	//jquery
	if($) {
		//console.log('add attr');
		var obj = $(html);
		if(obj[0].outerHTML) {
			for(var i in attr) {
				var a = _.isString(attr[i]) ? attr[i] : ""; 
				if((i == "class" || i == "id") && obj.attr(i)) {
					var current = obj.attr(i).split(/\s+/);
					var added = a.split(/\s+/);
					obj.attr(i,_.uniq(current.concat(added)).join(' '));
				} else if(i == "style" && obj.attr(i)) {
					var current = obj.attr(i).split(';');
					var added = a.split(';');
					obj.attr(i,_.uniq(current.concat(added)).join(';'));				
				} else {
					obj.attr(i,a);
				}
			}
			
			return obj[0].outerHTML.replace(/><\/[^>]*>$/,'>');	
		}
	}		
	var textAttr = "";
	for(var i in attr) {
		var a = _.isString(attr[i]) ? attr[i] : ""; 
		textAttr += ' '+i+'="'+a.replace(/"/g,'\"')+'"';
	}
	return html.replace(/><\/[^>]*>$/,textAttr+'>');
}


Parser.prototype.getID = function() {
	return 'octoml-'+this.index++;	
}





Parser.prototype.addConfig = function(dataIn) {
	//for all data (other the html) add in, depending on type
	var self = this;
	var data = _.omit(dataIn,['html']);
	for(var i in data) {
		//if(i=="css") console.log('adding '+data.css+' : '+dataIn.html);
		if(_.has(self.global,i)) {
			var global = self.global[i];
			var globalType = getType(global);
			var dataType = getType(data[i]);
			if(globalType == dataType) {
				if(globalType == "array") self.global[i] = self.global[i].concat(data[i]);
				else if(globalType == "object") _.extend(self.global[i],data[i]);
				else if(globalType == "string") self.global[i] += data[i];
				else console.log('err addConfig, unknown types for '+i+' : '+(typeof global)+' , '+(typeof data[i]));
			} else {
				console.log('err addConfig, different types for '+i+' : '+globalType+' , '+dataType);
			}
		} else {
			//doesn't exist yet
			self.global[i] = data[i];
		}
	}
}




function replaceObj(lang,props,object,fun) {
	
	if(_.isString(object)) return fun(lang,props,object);
	else if(_.isArray(object)) return object.map(function(a) {
		return replaceObj(lang,props,a,fun);
	});
	else if(_.isObject(object)) {
		var result = {};
		for(var i in object) {
			result[i] = replaceObj(lang,props,object[i],fun);
		}
		return result;
	} else return object;	
}









/* ---------------------------

		  Post processor

   --------------------------- */

Parser.prototype.post = function(html,post,callback) {
	var self = this;
	var text = html.map(function(a) {
		return he.encode(a.replace(/\t/g,'  '),{'allowUnsafeSymbols': true,'useNamedReferences':true});
	});
	if(text.length) {
			
		self.global.body = text[0];
		self.global.top = text.length > 1 ? text[1] : "";
		self.global.bottom = text.length > 2 ? text[2] : "";
		self.global.html = (self.global.doctype||"")+'\n<html>\n<head>\n'+self.global.head+'</head>\n'+self.global.top+self.global.body+self.global.bottom+'\n</html>';
	}		
	//self.global.obj = obj;
	if(post && _.isArray(post) && post.length) {
		async.eachSeries(post,function(a,cb) {
			self.postTag(a,cb);
		},function() {
			if(!_.has(self.output,'html')) self.output.html = self.global.html;
			self.output.html = he.encode(self.output.html.replace(/\t/g,'  '),{'allowUnsafeSymbols': true,'useNamedReferences':true});
			callback(_.clone(self.output));	
		});
	} else {
		callback(self.global.html);
	}
}


Parser.prototype.postTag = function(lang,callback) {
	var self = this;
	if(_.has(lang,'html')) {
		if(_.has(lang,'async') && lang.async == true) {
			lang.html(self.global,function(result) {
				self.postRun(result,callback);
			});
		} else {
			var result = lang.html(self.global);
			self.postRun(result,callback);
		}
	} else {
		callback();
	}
}

Parser.prototype.postRun = function(result,callback) {
	var self = this;
	if(result) {
		if(typeof result === "string") {
			self.output.html = result;
			self.global.html = result;
		} else if(typeof result === "object") {
			_.extend(self.output,result);
			if(_.has(result,'html')) {
				self.global.html = result.html;
			} else {
				//self.global.html = self.global.obj[0].outerHTML;
			}
		} else {
			//self.output.html = self.global.obj[0].outerHTML;
		}
	} else {
		//self.output.html = self.global.obj[0].outerHTML;
	}
	callback();

}























/* ---------------------------

		Library Functions

   --------------------------- */




function getType(obj) {	
	return _.isArray(obj) ? 'array' : _.isFunction(obj) ? 'function' : _.isObject(obj) ? 'object' : _.isString(obj) ? 'string' : '';
}


function replaceText(str, text, replacement, opts) {
var options = opts || "igm";
return str.replace(new RegExp(text.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"),options),replacement.replace(/\$/g,'$$$$'));
}

function escapeRegExp(str) {
  return str.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&");
}
function escapeReplace(str) {
	return str.replace(/\$/g,'$$$$');
}






