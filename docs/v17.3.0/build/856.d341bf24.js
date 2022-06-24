/*! For license information please see 856.d341bf24.js.LICENSE.txt */
(self.webpackChunk_terrestris_react_geo=self.webpackChunk_terrestris_react_geo||[]).push([[856],{27856:function(e){e.exports=function(){"use strict";function _typeof(e){return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},_typeof(e)}function _setPrototypeOf(e,t){return _setPrototypeOf=Object.setPrototypeOf||function _setPrototypeOf(e,t){return e.__proto__=t,e},_setPrototypeOf(e,t)}function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}function _construct(e,t,n){return _construct=_isNativeReflectConstruct()?Reflect.construct:function _construct(e,t,n){var r=[null];r.push.apply(r,t);var o=new(Function.bind.apply(e,r));return n&&_setPrototypeOf(o,n.prototype),o},_construct.apply(null,arguments)}function _toConsumableArray(e){return _arrayWithoutHoles(e)||_iterableToArray(e)||_unsupportedIterableToArray(e)||_nonIterableSpread()}function _arrayWithoutHoles(e){if(Array.isArray(e))return _arrayLikeToArray(e)}function _iterableToArray(e){if("undefined"!=typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}function _unsupportedIterableToArray(e,t){if(e){if("string"==typeof e)return _arrayLikeToArray(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?_arrayLikeToArray(e,t):void 0}}function _arrayLikeToArray(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var e=Object.hasOwnProperty,t=Object.setPrototypeOf,n=Object.isFrozen,r=Object.getPrototypeOf,o=Object.getOwnPropertyDescriptor,a=Object.freeze,i=Object.seal,l=Object.create,c="undefined"!=typeof Reflect&&Reflect,u=c.apply,s=c.construct;u||(u=function apply(e,t,n){return e.apply(t,n)}),a||(a=function freeze(e){return e}),i||(i=function seal(e){return e}),s||(s=function construct(e,t){return _construct(e,_toConsumableArray(t))});var m=unapply(Array.prototype.forEach),d=unapply(Array.prototype.pop),p=unapply(Array.prototype.push),f=unapply(String.prototype.toLowerCase),y=unapply(String.prototype.match),h=unapply(String.prototype.replace),g=unapply(String.prototype.indexOf),b=unapply(String.prototype.trim),T=unapply(RegExp.prototype.test),_=unconstruct(TypeError);function unapply(e){return function(t){for(var n=arguments.length,r=new Array(n>1?n-1:0),o=1;o<n;o++)r[o-1]=arguments[o];return u(e,t,r)}}function unconstruct(e){return function(){for(var t=arguments.length,n=new Array(t),r=0;r<t;r++)n[r]=arguments[r];return s(e,n)}}function addToSet(e,r){t&&t(e,null);for(var o=r.length;o--;){var a=r[o];if("string"==typeof a){var i=f(a);i!==a&&(n(r)||(r[o]=i),a=i)}e[a]=!0}return e}function clone(t){var n,r=l(null);for(n in t)u(e,t,[n])&&(r[n]=t[n]);return r}function lookupGetter(e,t){for(;null!==e;){var n=o(e,t);if(n){if(n.get)return unapply(n.get);if("function"==typeof n.value)return unapply(n.value)}e=r(e)}function fallbackValue(e){return console.warn("fallback value for",e),null}return fallbackValue}var v=a(["a","abbr","acronym","address","area","article","aside","audio","b","bdi","bdo","big","blink","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","content","data","datalist","dd","decorator","del","details","dfn","dialog","dir","div","dl","dt","element","em","fieldset","figcaption","figure","font","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","img","input","ins","kbd","label","legend","li","main","map","mark","marquee","menu","menuitem","meter","nav","nobr","ol","optgroup","option","output","p","picture","pre","progress","q","rp","rt","ruby","s","samp","section","select","shadow","small","source","spacer","span","strike","strong","style","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th","thead","time","tr","track","tt","u","ul","var","video","wbr"]),A=a(["svg","a","altglyph","altglyphdef","altglyphitem","animatecolor","animatemotion","animatetransform","circle","clippath","defs","desc","ellipse","filter","font","g","glyph","glyphref","hkern","image","line","lineargradient","marker","mask","metadata","mpath","path","pattern","polygon","polyline","radialgradient","rect","stop","style","switch","symbol","text","textpath","title","tref","tspan","view","vkern"]),S=a(["feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence"]),N=a(["animate","color-profile","cursor","discard","fedropshadow","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","foreignobject","hatch","hatchpath","mesh","meshgradient","meshpatch","meshrow","missing-glyph","script","set","solidcolor","unknown","use"]),E=a(["math","menclose","merror","mfenced","mfrac","mglyph","mi","mlabeledtr","mmultiscripts","mn","mo","mover","mpadded","mphantom","mroot","mrow","ms","mspace","msqrt","mstyle","msub","msup","msubsup","mtable","mtd","mtext","mtr","munder","munderover"]),k=a(["maction","maligngroup","malignmark","mlongdiv","mscarries","mscarry","msgroup","mstack","msline","msrow","semantics","annotation","annotation-xml","mprescripts","none"]),w=a(["#text"]),C=a(["accept","action","align","alt","autocapitalize","autocomplete","autopictureinpicture","autoplay","background","bgcolor","border","capture","cellpadding","cellspacing","checked","cite","class","clear","color","cols","colspan","controls","controlslist","coords","crossorigin","datetime","decoding","default","dir","disabled","disablepictureinpicture","disableremoteplayback","download","draggable","enctype","enterkeyhint","face","for","headers","height","hidden","high","href","hreflang","id","inputmode","integrity","ismap","kind","label","lang","list","loading","loop","low","max","maxlength","media","method","min","minlength","multiple","muted","name","nonce","noshade","novalidate","nowrap","open","optimum","pattern","placeholder","playsinline","poster","preload","pubdate","radiogroup","readonly","rel","required","rev","reversed","role","rows","rowspan","spellcheck","scope","selected","shape","size","sizes","span","srclang","start","src","srcset","step","style","summary","tabindex","title","translate","type","usemap","valign","value","width","xmlns","slot"]),x=a(["accent-height","accumulate","additive","alignment-baseline","ascent","attributename","attributetype","azimuth","basefrequency","baseline-shift","begin","bias","by","class","clip","clippathunits","clip-path","clip-rule","color","color-interpolation","color-interpolation-filters","color-profile","color-rendering","cx","cy","d","dx","dy","diffuseconstant","direction","display","divisor","dur","edgemode","elevation","end","fill","fill-opacity","fill-rule","filter","filterunits","flood-color","flood-opacity","font-family","font-size","font-size-adjust","font-stretch","font-style","font-variant","font-weight","fx","fy","g1","g2","glyph-name","glyphref","gradientunits","gradienttransform","height","href","id","image-rendering","in","in2","k","k1","k2","k3","k4","kerning","keypoints","keysplines","keytimes","lang","lengthadjust","letter-spacing","kernelmatrix","kernelunitlength","lighting-color","local","marker-end","marker-mid","marker-start","markerheight","markerunits","markerwidth","maskcontentunits","maskunits","max","mask","media","method","mode","min","name","numoctaves","offset","operator","opacity","order","orient","orientation","origin","overflow","paint-order","path","pathlength","patterncontentunits","patterntransform","patternunits","points","preservealpha","preserveaspectratio","primitiveunits","r","rx","ry","radius","refx","refy","repeatcount","repeatdur","restart","result","rotate","scale","seed","shape-rendering","specularconstant","specularexponent","spreadmethod","startoffset","stddeviation","stitchtiles","stop-color","stop-opacity","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke","stroke-width","style","surfacescale","systemlanguage","tabindex","targetx","targety","transform","transform-origin","text-anchor","text-decoration","text-rendering","textlength","type","u1","u2","unicode","values","viewbox","visibility","version","vert-adv-y","vert-origin-x","vert-origin-y","width","word-spacing","wrap","writing-mode","xchannelselector","ychannelselector","x","x1","x2","xmlns","y","y1","y2","z","zoomandpan"]),O=a(["accent","accentunder","align","bevelled","close","columnsalign","columnlines","columnspan","denomalign","depth","dir","display","displaystyle","encoding","fence","frame","height","href","id","largeop","length","linethickness","lspace","lquote","mathbackground","mathcolor","mathsize","mathvariant","maxsize","minsize","movablelimits","notation","numalign","open","rowalign","rowlines","rowspacing","rowspan","rspace","rquote","scriptlevel","scriptminsize","scriptsizemultiplier","selection","separator","separators","stretchy","subscriptshift","supscriptshift","symmetric","voffset","width","xmlns"]),D=a(["xlink:href","xml:id","xlink:title","xml:space","xmlns:xlink"]),M=i(/\{\{[\w\W]*|[\w\W]*\}\}/gm),R=i(/<%[\w\W]*|[\w\W]*%>/gm),L=i(/^data-[\-\w.\u00B7-\uFFFF]/),I=i(/^aria-[\-\w]+$/),F=i(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i),H=i(/^(?:\w+script|data):/i),z=i(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g),U=i(/^html$/i),P=function getGlobal(){return"undefined"==typeof window?null:window},B=function _createTrustedTypesPolicy(e,t){if("object"!==_typeof(e)||"function"!=typeof e.createPolicy)return null;var n=null,r="data-tt-policy-suffix";t.currentScript&&t.currentScript.hasAttribute(r)&&(n=t.currentScript.getAttribute(r));var o="dompurify"+(n?"#"+n:"");try{return e.createPolicy(o,{createHTML:function createHTML(e){return e}})}catch(e){return console.warn("TrustedTypes policy "+o+" could not be created."),null}};function createDOMPurify(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:P(),t=function DOMPurify(e){return createDOMPurify(e)};if(t.version="2.3.8",t.removed=[],!e||!e.document||9!==e.document.nodeType)return t.isSupported=!1,t;var n=e.document,r=e.document,o=e.DocumentFragment,i=e.HTMLTemplateElement,l=e.Node,c=e.Element,u=e.NodeFilter,s=e.NamedNodeMap,G=void 0===s?e.NamedNodeMap||e.MozNamedAttrMap:s,j=e.HTMLFormElement,W=e.DOMParser,q=e.trustedTypes,V=c.prototype,Y=lookupGetter(V,"cloneNode"),K=lookupGetter(V,"nextSibling"),$=lookupGetter(V,"childNodes"),X=lookupGetter(V,"parentNode");if("function"==typeof i){var Z=r.createElement("template");Z.content&&Z.content.ownerDocument&&(r=Z.content.ownerDocument)}var J=B(q,n),Q=J?J.createHTML(""):"",ee=r,te=ee.implementation,ne=ee.createNodeIterator,re=ee.createDocumentFragment,oe=ee.getElementsByTagName,ae=n.importNode,ie={};try{ie=clone(r).documentMode?r.documentMode:{}}catch(e){}var le={};t.isSupported="function"==typeof X&&te&&void 0!==te.createHTMLDocument&&9!==ie;var ce,ue,se=M,me=R,de=L,pe=I,fe=H,ye=z,he=F,ge=null,be=addToSet({},[].concat(_toConsumableArray(v),_toConsumableArray(A),_toConsumableArray(S),_toConsumableArray(E),_toConsumableArray(w))),Te=null,_e=addToSet({},[].concat(_toConsumableArray(C),_toConsumableArray(x),_toConsumableArray(O),_toConsumableArray(D))),ve=Object.seal(Object.create(null,{tagNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},allowCustomizedBuiltInElements:{writable:!0,configurable:!1,enumerable:!0,value:!1}})),Ae=null,Se=null,Ne=!0,Ee=!0,ke=!1,we=!1,Ce=!1,xe=!1,Oe=!1,De=!1,Me=!1,Re=!1,Le=!0,Ie=!0,Fe=!1,He={},ze=null,Ue=addToSet({},["annotation-xml","audio","colgroup","desc","foreignobject","head","iframe","math","mi","mn","mo","ms","mtext","noembed","noframes","noscript","plaintext","script","style","svg","template","thead","title","video","xmp"]),Pe=null,Be=addToSet({},["audio","video","img","source","image","track"]),Ge=null,je=addToSet({},["alt","class","for","id","label","name","pattern","placeholder","role","summary","title","value","style","xmlns"]),We="http://www.w3.org/1998/Math/MathML",qe="http://www.w3.org/2000/svg",Ve="http://www.w3.org/1999/xhtml",Ye=Ve,Ke=!1,$e=["application/xhtml+xml","text/html"],Xe="text/html",Ze=null,Je=r.createElement("form"),Qe=function isRegexOrFunction(e){return e instanceof RegExp||e instanceof Function},et=function _parseConfig(e){Ze&&Ze===e||(e&&"object"===_typeof(e)||(e={}),e=clone(e),ge="ALLOWED_TAGS"in e?addToSet({},e.ALLOWED_TAGS):be,Te="ALLOWED_ATTR"in e?addToSet({},e.ALLOWED_ATTR):_e,Ge="ADD_URI_SAFE_ATTR"in e?addToSet(clone(je),e.ADD_URI_SAFE_ATTR):je,Pe="ADD_DATA_URI_TAGS"in e?addToSet(clone(Be),e.ADD_DATA_URI_TAGS):Be,ze="FORBID_CONTENTS"in e?addToSet({},e.FORBID_CONTENTS):Ue,Ae="FORBID_TAGS"in e?addToSet({},e.FORBID_TAGS):{},Se="FORBID_ATTR"in e?addToSet({},e.FORBID_ATTR):{},He="USE_PROFILES"in e&&e.USE_PROFILES,Ne=!1!==e.ALLOW_ARIA_ATTR,Ee=!1!==e.ALLOW_DATA_ATTR,ke=e.ALLOW_UNKNOWN_PROTOCOLS||!1,we=e.SAFE_FOR_TEMPLATES||!1,Ce=e.WHOLE_DOCUMENT||!1,De=e.RETURN_DOM||!1,Me=e.RETURN_DOM_FRAGMENT||!1,Re=e.RETURN_TRUSTED_TYPE||!1,Oe=e.FORCE_BODY||!1,Le=!1!==e.SANITIZE_DOM,Ie=!1!==e.KEEP_CONTENT,Fe=e.IN_PLACE||!1,he=e.ALLOWED_URI_REGEXP||he,Ye=e.NAMESPACE||Ve,e.CUSTOM_ELEMENT_HANDLING&&Qe(e.CUSTOM_ELEMENT_HANDLING.tagNameCheck)&&(ve.tagNameCheck=e.CUSTOM_ELEMENT_HANDLING.tagNameCheck),e.CUSTOM_ELEMENT_HANDLING&&Qe(e.CUSTOM_ELEMENT_HANDLING.attributeNameCheck)&&(ve.attributeNameCheck=e.CUSTOM_ELEMENT_HANDLING.attributeNameCheck),e.CUSTOM_ELEMENT_HANDLING&&"boolean"==typeof e.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements&&(ve.allowCustomizedBuiltInElements=e.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements),ce=ce=-1===$e.indexOf(e.PARSER_MEDIA_TYPE)?Xe:e.PARSER_MEDIA_TYPE,ue="application/xhtml+xml"===ce?function(e){return e}:f,we&&(Ee=!1),Me&&(De=!0),He&&(ge=addToSet({},_toConsumableArray(w)),Te=[],!0===He.html&&(addToSet(ge,v),addToSet(Te,C)),!0===He.svg&&(addToSet(ge,A),addToSet(Te,x),addToSet(Te,D)),!0===He.svgFilters&&(addToSet(ge,S),addToSet(Te,x),addToSet(Te,D)),!0===He.mathMl&&(addToSet(ge,E),addToSet(Te,O),addToSet(Te,D))),e.ADD_TAGS&&(ge===be&&(ge=clone(ge)),addToSet(ge,e.ADD_TAGS)),e.ADD_ATTR&&(Te===_e&&(Te=clone(Te)),addToSet(Te,e.ADD_ATTR)),e.ADD_URI_SAFE_ATTR&&addToSet(Ge,e.ADD_URI_SAFE_ATTR),e.FORBID_CONTENTS&&(ze===Ue&&(ze=clone(ze)),addToSet(ze,e.FORBID_CONTENTS)),Ie&&(ge["#text"]=!0),Ce&&addToSet(ge,["html","head","body"]),ge.table&&(addToSet(ge,["tbody"]),delete Ae.tbody),a&&a(e),Ze=e)},tt=addToSet({},["mi","mo","mn","ms","mtext"]),nt=addToSet({},["foreignobject","desc","title","annotation-xml"]),rt=addToSet({},["title","style","font","a","script"]),ot=addToSet({},A);addToSet(ot,S),addToSet(ot,N);var at=addToSet({},E);addToSet(at,k);var it=function _checkValidNamespace(e){var t=X(e);t&&t.tagName||(t={namespaceURI:Ve,tagName:"template"});var n=f(e.tagName),r=f(t.tagName);return e.namespaceURI===qe?t.namespaceURI===Ve?"svg"===n:t.namespaceURI===We?"svg"===n&&("annotation-xml"===r||tt[r]):Boolean(ot[n]):e.namespaceURI===We?t.namespaceURI===Ve?"math"===n:t.namespaceURI===qe?"math"===n&&nt[r]:Boolean(at[n]):e.namespaceURI===Ve&&!(t.namespaceURI===qe&&!nt[r])&&!(t.namespaceURI===We&&!tt[r])&&!at[n]&&(rt[n]||!ot[n])},lt=function _forceRemove(e){p(t.removed,{element:e});try{e.parentNode.removeChild(e)}catch(t){try{e.outerHTML=Q}catch(t){e.remove()}}},ct=function _removeAttribute(e,n){try{p(t.removed,{attribute:n.getAttributeNode(e),from:n})}catch(e){p(t.removed,{attribute:null,from:n})}if(n.removeAttribute(e),"is"===e&&!Te[e])if(De||Me)try{lt(n)}catch(e){}else try{n.setAttribute(e,"")}catch(e){}},ut=function _initDocument(e){var t,n;if(Oe)e="<remove></remove>"+e;else{var o=y(e,/^[\r\n\t ]+/);n=o&&o[0]}"application/xhtml+xml"===ce&&(e='<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>'+e+"</body></html>");var a=J?J.createHTML(e):e;if(Ye===Ve)try{t=(new W).parseFromString(a,ce)}catch(e){}if(!t||!t.documentElement){t=te.createDocument(Ye,"template",null);try{t.documentElement.innerHTML=Ke?"":a}catch(e){}}var i=t.body||t.documentElement;return e&&n&&i.insertBefore(r.createTextNode(n),i.childNodes[0]||null),Ye===Ve?oe.call(t,Ce?"html":"body")[0]:Ce?t.documentElement:i},st=function _createIterator(e){return ne.call(e.ownerDocument||e,e,u.SHOW_ELEMENT|u.SHOW_COMMENT|u.SHOW_TEXT,null,!1)},mt=function _isClobbered(e){return e instanceof j&&("string"!=typeof e.nodeName||"string"!=typeof e.textContent||"function"!=typeof e.removeChild||!(e.attributes instanceof G)||"function"!=typeof e.removeAttribute||"function"!=typeof e.setAttribute||"string"!=typeof e.namespaceURI||"function"!=typeof e.insertBefore)},dt=function _isNode(e){return"object"===_typeof(l)?e instanceof l:e&&"object"===_typeof(e)&&"number"==typeof e.nodeType&&"string"==typeof e.nodeName},pt=function _executeHook(e,n,r){le[e]&&m(le[e],(function(e){e.call(t,n,r,Ze)}))},ft=function _sanitizeElements(e){var n;if(pt("beforeSanitizeElements",e,null),mt(e))return lt(e),!0;if(T(/[\u0080-\uFFFF]/,e.nodeName))return lt(e),!0;var r=ue(e.nodeName);if(pt("uponSanitizeElement",e,{tagName:r,allowedTags:ge}),e.hasChildNodes()&&!dt(e.firstElementChild)&&(!dt(e.content)||!dt(e.content.firstElementChild))&&T(/<[/\w]/g,e.innerHTML)&&T(/<[/\w]/g,e.textContent))return lt(e),!0;if("select"===r&&T(/<template/i,e.innerHTML))return lt(e),!0;if(!ge[r]||Ae[r]){if(!Ae[r]&&ht(r)){if(ve.tagNameCheck instanceof RegExp&&T(ve.tagNameCheck,r))return!1;if(ve.tagNameCheck instanceof Function&&ve.tagNameCheck(r))return!1}if(Ie&&!ze[r]){var o=X(e)||e.parentNode,a=$(e)||e.childNodes;if(a&&o)for(var i=a.length-1;i>=0;--i)o.insertBefore(Y(a[i],!0),K(e))}return lt(e),!0}return e instanceof c&&!it(e)?(lt(e),!0):"noscript"!==r&&"noembed"!==r||!T(/<\/no(script|embed)/i,e.innerHTML)?(we&&3===e.nodeType&&(n=e.textContent,n=h(n,se," "),n=h(n,me," "),e.textContent!==n&&(p(t.removed,{element:e.cloneNode()}),e.textContent=n)),pt("afterSanitizeElements",e,null),!1):(lt(e),!0)},yt=function _isValidAttribute(e,t,n){if(Le&&("id"===t||"name"===t)&&(n in r||n in Je))return!1;if(Ee&&!Se[t]&&T(de,t));else if(Ne&&T(pe,t));else if(!Te[t]||Se[t]){if(!(ht(e)&&(ve.tagNameCheck instanceof RegExp&&T(ve.tagNameCheck,e)||ve.tagNameCheck instanceof Function&&ve.tagNameCheck(e))&&(ve.attributeNameCheck instanceof RegExp&&T(ve.attributeNameCheck,t)||ve.attributeNameCheck instanceof Function&&ve.attributeNameCheck(t))||"is"===t&&ve.allowCustomizedBuiltInElements&&(ve.tagNameCheck instanceof RegExp&&T(ve.tagNameCheck,n)||ve.tagNameCheck instanceof Function&&ve.tagNameCheck(n))))return!1}else if(Ge[t]);else if(T(he,h(n,ye,"")));else if("src"!==t&&"xlink:href"!==t&&"href"!==t||"script"===e||0!==g(n,"data:")||!Pe[e])if(ke&&!T(fe,h(n,ye,"")));else if(n)return!1;return!0},ht=function _basicCustomElementTest(e){return e.indexOf("-")>0},gt=function _sanitizeAttributes(e){var n,r,o,a;pt("beforeSanitizeAttributes",e,null);var i=e.attributes;if(i){var l={attrName:"",attrValue:"",keepAttr:!0,allowedAttributes:Te};for(a=i.length;a--;){var c=n=i[a],u=c.name,s=c.namespaceURI;if(r="value"===u?n.value:b(n.value),o=ue(u),l.attrName=o,l.attrValue=r,l.keepAttr=!0,l.forceKeepAttr=void 0,pt("uponSanitizeAttribute",e,l),r=l.attrValue,!l.forceKeepAttr&&(ct(u,e),l.keepAttr))if(T(/\/>/i,r))ct(u,e);else{we&&(r=h(r,se," "),r=h(r,me," "));var m=ue(e.nodeName);if(yt(m,o,r))try{s?e.setAttributeNS(s,u,r):e.setAttribute(u,r),d(t.removed)}catch(e){}}}pt("afterSanitizeAttributes",e,null)}},bt=function _sanitizeShadowDOM(e){var t,n=st(e);for(pt("beforeSanitizeShadowDOM",e,null);t=n.nextNode();)pt("uponSanitizeShadowNode",t,null),ft(t)||(t.content instanceof o&&_sanitizeShadowDOM(t.content),gt(t));pt("afterSanitizeShadowDOM",e,null)};return t.sanitize=function(r,a){var i,c,u,s,m;if((Ke=!r)&&(r="\x3c!--\x3e"),"string"!=typeof r&&!dt(r)){if("function"!=typeof r.toString)throw _("toString is not a function");if("string"!=typeof(r=r.toString()))throw _("dirty is not a string, aborting")}if(!t.isSupported){if("object"===_typeof(e.toStaticHTML)||"function"==typeof e.toStaticHTML){if("string"==typeof r)return e.toStaticHTML(r);if(dt(r))return e.toStaticHTML(r.outerHTML)}return r}if(xe||et(a),t.removed=[],"string"==typeof r&&(Fe=!1),Fe){if(r.nodeName){var d=ue(r.nodeName);if(!ge[d]||Ae[d])throw _("root node is forbidden and cannot be sanitized in-place")}}else if(r instanceof l)1===(c=(i=ut("\x3c!----\x3e")).ownerDocument.importNode(r,!0)).nodeType&&"BODY"===c.nodeName||"HTML"===c.nodeName?i=c:i.appendChild(c);else{if(!De&&!we&&!Ce&&-1===r.indexOf("<"))return J&&Re?J.createHTML(r):r;if(!(i=ut(r)))return De?null:Re?Q:""}i&&Oe&&lt(i.firstChild);for(var p=st(Fe?r:i);u=p.nextNode();)3===u.nodeType&&u===s||ft(u)||(u.content instanceof o&&bt(u.content),gt(u),s=u);if(s=null,Fe)return r;if(De){if(Me)for(m=re.call(i.ownerDocument);i.firstChild;)m.appendChild(i.firstChild);else m=i;return Te.shadowroot&&(m=ae.call(n,m,!0)),m}var f=Ce?i.outerHTML:i.innerHTML;return Ce&&ge["!doctype"]&&i.ownerDocument&&i.ownerDocument.doctype&&i.ownerDocument.doctype.name&&T(U,i.ownerDocument.doctype.name)&&(f="<!DOCTYPE "+i.ownerDocument.doctype.name+">\n"+f),we&&(f=h(f,se," "),f=h(f,me," ")),J&&Re?J.createHTML(f):f},t.setConfig=function(e){et(e),xe=!0},t.clearConfig=function(){Ze=null,xe=!1},t.isValidAttribute=function(e,t,n){Ze||et({});var r=ue(e),o=ue(t);return yt(r,o,n)},t.addHook=function(e,t){"function"==typeof t&&(le[e]=le[e]||[],p(le[e],t))},t.removeHook=function(e){if(le[e])return d(le[e])},t.removeHooks=function(e){le[e]&&(le[e]=[])},t.removeAllHooks=function(){le={}},t}return createDOMPurify()}()}}]);