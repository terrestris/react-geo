/*! For license information please see 856.72232767.js.LICENSE.txt */
(self.webpackChunk_terrestris_react_geo=self.webpackChunk_terrestris_react_geo||[]).push([[856],{27856:function(e){e.exports=function(){"use strict";function _typeof(e){return _typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},_typeof(e)}function _setPrototypeOf(e,t){return _setPrototypeOf=Object.setPrototypeOf||function _setPrototypeOf(e,t){return e.__proto__=t,e},_setPrototypeOf(e,t)}function _isNativeReflectConstruct(){if("undefined"==typeof Reflect||!Reflect.construct)return!1;if(Reflect.construct.sham)return!1;if("function"==typeof Proxy)return!0;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return!1}}function _construct(e,t,n){return _construct=_isNativeReflectConstruct()?Reflect.construct:function _construct(e,t,n){var r=[null];r.push.apply(r,t);var o=new(Function.bind.apply(e,r));return n&&_setPrototypeOf(o,n.prototype),o},_construct.apply(null,arguments)}function _toConsumableArray(e){return _arrayWithoutHoles(e)||_iterableToArray(e)||_unsupportedIterableToArray(e)||_nonIterableSpread()}function _arrayWithoutHoles(e){if(Array.isArray(e))return _arrayLikeToArray(e)}function _iterableToArray(e){if("undefined"!=typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}function _unsupportedIterableToArray(e,t){if(e){if("string"==typeof e)return _arrayLikeToArray(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?_arrayLikeToArray(e,t):void 0}}function _arrayLikeToArray(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}var e=Object.hasOwnProperty,t=Object.setPrototypeOf,n=Object.isFrozen,r=Object.getPrototypeOf,o=Object.getOwnPropertyDescriptor,a=Object.freeze,i=Object.seal,l=Object.create,c="undefined"!=typeof Reflect&&Reflect,u=c.apply,s=c.construct;u||(u=function apply(e,t,n){return e.apply(t,n)}),a||(a=function freeze(e){return e}),i||(i=function seal(e){return e}),s||(s=function construct(e,t){return _construct(e,_toConsumableArray(t))});var p=unapply(Array.prototype.forEach),d=unapply(Array.prototype.pop),m=unapply(Array.prototype.push),f=unapply(String.prototype.toLowerCase),y=unapply(String.prototype.toString),h=unapply(String.prototype.match),g=unapply(String.prototype.replace),T=unapply(String.prototype.indexOf),b=unapply(String.prototype.trim),_=unapply(RegExp.prototype.test),S=unconstruct(TypeError);function unapply(e){return function(t){for(var n=arguments.length,r=new Array(n>1?n-1:0),o=1;o<n;o++)r[o-1]=arguments[o];return u(e,t,r)}}function unconstruct(e){return function(){for(var t=arguments.length,n=new Array(t),r=0;r<t;r++)n[r]=arguments[r];return s(e,n)}}function addToSet(e,r,o){o=o||f,t&&t(e,null);for(var a=r.length;a--;){var i=r[a];if("string"==typeof i){var l=o(i);l!==i&&(n(r)||(r[a]=l),i=l)}e[i]=!0}return e}function clone(t){var n,r=l(null);for(n in t)u(e,t,[n])&&(r[n]=t[n]);return r}function lookupGetter(e,t){for(;null!==e;){var n=o(e,t);if(n){if(n.get)return unapply(n.get);if("function"==typeof n.value)return unapply(n.value)}e=r(e)}function fallbackValue(e){return console.warn("fallback value for",e),null}return fallbackValue}var A=a(["a","abbr","acronym","address","area","article","aside","audio","b","bdi","bdo","big","blink","blockquote","body","br","button","canvas","caption","center","cite","code","col","colgroup","content","data","datalist","dd","decorator","del","details","dfn","dialog","dir","div","dl","dt","element","em","fieldset","figcaption","figure","font","footer","form","h1","h2","h3","h4","h5","h6","head","header","hgroup","hr","html","i","img","input","ins","kbd","label","legend","li","main","map","mark","marquee","menu","menuitem","meter","nav","nobr","ol","optgroup","option","output","p","picture","pre","progress","q","rp","rt","ruby","s","samp","section","select","shadow","small","source","spacer","span","strike","strong","style","sub","summary","sup","table","tbody","td","template","textarea","tfoot","th","thead","time","tr","track","tt","u","ul","var","video","wbr"]),v=a(["svg","a","altglyph","altglyphdef","altglyphitem","animatecolor","animatemotion","animatetransform","circle","clippath","defs","desc","ellipse","filter","font","g","glyph","glyphref","hkern","image","line","lineargradient","marker","mask","metadata","mpath","path","pattern","polygon","polyline","radialgradient","rect","stop","style","switch","symbol","text","textpath","title","tref","tspan","view","vkern"]),N=a(["feBlend","feColorMatrix","feComponentTransfer","feComposite","feConvolveMatrix","feDiffuseLighting","feDisplacementMap","feDistantLight","feFlood","feFuncA","feFuncB","feFuncG","feFuncR","feGaussianBlur","feImage","feMerge","feMergeNode","feMorphology","feOffset","fePointLight","feSpecularLighting","feSpotLight","feTile","feTurbulence"]),E=a(["animate","color-profile","cursor","discard","fedropshadow","font-face","font-face-format","font-face-name","font-face-src","font-face-uri","foreignobject","hatch","hatchpath","mesh","meshgradient","meshpatch","meshrow","missing-glyph","script","set","solidcolor","unknown","use"]),k=a(["math","menclose","merror","mfenced","mfrac","mglyph","mi","mlabeledtr","mmultiscripts","mn","mo","mover","mpadded","mphantom","mroot","mrow","ms","mspace","msqrt","mstyle","msub","msup","msubsup","mtable","mtd","mtext","mtr","munder","munderover"]),w=a(["maction","maligngroup","malignmark","mlongdiv","mscarries","mscarry","msgroup","mstack","msline","msrow","semantics","annotation","annotation-xml","mprescripts","none"]),C=a(["#text"]),x=a(["accept","action","align","alt","autocapitalize","autocomplete","autopictureinpicture","autoplay","background","bgcolor","border","capture","cellpadding","cellspacing","checked","cite","class","clear","color","cols","colspan","controls","controlslist","coords","crossorigin","datetime","decoding","default","dir","disabled","disablepictureinpicture","disableremoteplayback","download","draggable","enctype","enterkeyhint","face","for","headers","height","hidden","high","href","hreflang","id","inputmode","integrity","ismap","kind","label","lang","list","loading","loop","low","max","maxlength","media","method","min","minlength","multiple","muted","name","nonce","noshade","novalidate","nowrap","open","optimum","pattern","placeholder","playsinline","poster","preload","pubdate","radiogroup","readonly","rel","required","rev","reversed","role","rows","rowspan","spellcheck","scope","selected","shape","size","sizes","span","srclang","start","src","srcset","step","style","summary","tabindex","title","translate","type","usemap","valign","value","width","xmlns","slot"]),O=a(["accent-height","accumulate","additive","alignment-baseline","ascent","attributename","attributetype","azimuth","basefrequency","baseline-shift","begin","bias","by","class","clip","clippathunits","clip-path","clip-rule","color","color-interpolation","color-interpolation-filters","color-profile","color-rendering","cx","cy","d","dx","dy","diffuseconstant","direction","display","divisor","dur","edgemode","elevation","end","fill","fill-opacity","fill-rule","filter","filterunits","flood-color","flood-opacity","font-family","font-size","font-size-adjust","font-stretch","font-style","font-variant","font-weight","fx","fy","g1","g2","glyph-name","glyphref","gradientunits","gradienttransform","height","href","id","image-rendering","in","in2","k","k1","k2","k3","k4","kerning","keypoints","keysplines","keytimes","lang","lengthadjust","letter-spacing","kernelmatrix","kernelunitlength","lighting-color","local","marker-end","marker-mid","marker-start","markerheight","markerunits","markerwidth","maskcontentunits","maskunits","max","mask","media","method","mode","min","name","numoctaves","offset","operator","opacity","order","orient","orientation","origin","overflow","paint-order","path","pathlength","patterncontentunits","patterntransform","patternunits","points","preservealpha","preserveaspectratio","primitiveunits","r","rx","ry","radius","refx","refy","repeatcount","repeatdur","restart","result","rotate","scale","seed","shape-rendering","specularconstant","specularexponent","spreadmethod","startoffset","stddeviation","stitchtiles","stop-color","stop-opacity","stroke-dasharray","stroke-dashoffset","stroke-linecap","stroke-linejoin","stroke-miterlimit","stroke-opacity","stroke","stroke-width","style","surfacescale","systemlanguage","tabindex","targetx","targety","transform","transform-origin","text-anchor","text-decoration","text-rendering","textlength","type","u1","u2","unicode","values","viewbox","visibility","version","vert-adv-y","vert-origin-x","vert-origin-y","width","word-spacing","wrap","writing-mode","xchannelselector","ychannelselector","x","x1","x2","xmlns","y","y1","y2","z","zoomandpan"]),D=a(["accent","accentunder","align","bevelled","close","columnsalign","columnlines","columnspan","denomalign","depth","dir","display","displaystyle","encoding","fence","frame","height","href","id","largeop","length","linethickness","lspace","lquote","mathbackground","mathcolor","mathsize","mathvariant","maxsize","minsize","movablelimits","notation","numalign","open","rowalign","rowlines","rowspacing","rowspan","rspace","rquote","scriptlevel","scriptminsize","scriptsizemultiplier","selection","separator","separators","stretchy","subscriptshift","supscriptshift","symmetric","voffset","width","xmlns"]),L=a(["xlink:href","xml:id","xlink:title","xml:space","xmlns:xlink"]),M=i(/\{\{[\w\W]*|[\w\W]*\}\}/gm),R=i(/<%[\w\W]*|[\w\W]*%>/gm),I=i(/\${[\w\W]*}/gm),F=i(/^data-[\-\w.\u00B7-\uFFFF]/),H=i(/^aria-[\-\w]+$/),U=i(/^(?:(?:(?:f|ht)tps?|mailto|tel|callto|cid|xmpp):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i),z=i(/^(?:\w+script|data):/i),P=i(/[\u0000-\u0020\u00A0\u1680\u180E\u2000-\u2029\u205F\u3000]/g),B=i(/^html$/i),G=function getGlobal(){return"undefined"==typeof window?null:window},j=function _createTrustedTypesPolicy(e,t){if("object"!==_typeof(e)||"function"!=typeof e.createPolicy)return null;var n=null,r="data-tt-policy-suffix";t.currentScript&&t.currentScript.hasAttribute(r)&&(n=t.currentScript.getAttribute(r));var o="dompurify"+(n?"#"+n:"");try{return e.createPolicy(o,{createHTML:function createHTML(e){return e},createScriptURL:function createScriptURL(e){return e}})}catch(e){return console.warn("TrustedTypes policy "+o+" could not be created."),null}};function createDOMPurify(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:G(),t=function DOMPurify(e){return createDOMPurify(e)};if(t.version="2.4.1",t.removed=[],!e||!e.document||9!==e.document.nodeType)return t.isSupported=!1,t;var n=e.document,r=e.document,o=e.DocumentFragment,i=e.HTMLTemplateElement,l=e.Node,c=e.Element,u=e.NodeFilter,s=e.NamedNodeMap,W=void 0===s?e.NamedNodeMap||e.MozNamedAttrMap:s,q=e.HTMLFormElement,V=e.DOMParser,Y=e.trustedTypes,$=c.prototype,K=lookupGetter($,"cloneNode"),X=lookupGetter($,"nextSibling"),Z=lookupGetter($,"childNodes"),J=lookupGetter($,"parentNode");if("function"==typeof i){var Q=r.createElement("template");Q.content&&Q.content.ownerDocument&&(r=Q.content.ownerDocument)}var ee=j(Y,n),te=ee?ee.createHTML(""):"",ne=r,re=ne.implementation,oe=ne.createNodeIterator,ae=ne.createDocumentFragment,ie=ne.getElementsByTagName,le=n.importNode,ce={};try{ce=clone(r).documentMode?r.documentMode:{}}catch(e){}var ue={};t.isSupported="function"==typeof J&&re&&void 0!==re.createHTMLDocument&&9!==ce;var se,pe,de=M,me=R,fe=I,ye=F,he=H,ge=z,Te=P,be=U,_e=null,Se=addToSet({},[].concat(_toConsumableArray(A),_toConsumableArray(v),_toConsumableArray(N),_toConsumableArray(k),_toConsumableArray(C))),Ae=null,ve=addToSet({},[].concat(_toConsumableArray(x),_toConsumableArray(O),_toConsumableArray(D),_toConsumableArray(L))),Ne=Object.seal(Object.create(null,{tagNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},attributeNameCheck:{writable:!0,configurable:!1,enumerable:!0,value:null},allowCustomizedBuiltInElements:{writable:!0,configurable:!1,enumerable:!0,value:!1}})),Ee=null,ke=null,we=!0,Ce=!0,xe=!1,Oe=!1,De=!1,Le=!1,Me=!1,Re=!1,Ie=!1,Fe=!1,He=!0,Ue=!1,ze="user-content-",Pe=!0,Be=!1,Ge={},je=null,We=addToSet({},["annotation-xml","audio","colgroup","desc","foreignobject","head","iframe","math","mi","mn","mo","ms","mtext","noembed","noframes","noscript","plaintext","script","style","svg","template","thead","title","video","xmp"]),qe=null,Ve=addToSet({},["audio","video","img","source","image","track"]),Ye=null,$e=addToSet({},["alt","class","for","id","label","name","pattern","placeholder","role","summary","title","value","style","xmlns"]),Ke="http://www.w3.org/1998/Math/MathML",Xe="http://www.w3.org/2000/svg",Ze="http://www.w3.org/1999/xhtml",Je=Ze,Qe=!1,et=null,tt=addToSet({},[Ke,Xe,Ze],y),nt=["application/xhtml+xml","text/html"],rt="text/html",ot=null,at=r.createElement("form"),it=function isRegexOrFunction(e){return e instanceof RegExp||e instanceof Function},lt=function _parseConfig(e){ot&&ot===e||(e&&"object"===_typeof(e)||(e={}),e=clone(e),se=se=-1===nt.indexOf(e.PARSER_MEDIA_TYPE)?rt:e.PARSER_MEDIA_TYPE,pe="application/xhtml+xml"===se?y:f,_e="ALLOWED_TAGS"in e?addToSet({},e.ALLOWED_TAGS,pe):Se,Ae="ALLOWED_ATTR"in e?addToSet({},e.ALLOWED_ATTR,pe):ve,et="ALLOWED_NAMESPACES"in e?addToSet({},e.ALLOWED_NAMESPACES,y):tt,Ye="ADD_URI_SAFE_ATTR"in e?addToSet(clone($e),e.ADD_URI_SAFE_ATTR,pe):$e,qe="ADD_DATA_URI_TAGS"in e?addToSet(clone(Ve),e.ADD_DATA_URI_TAGS,pe):Ve,je="FORBID_CONTENTS"in e?addToSet({},e.FORBID_CONTENTS,pe):We,Ee="FORBID_TAGS"in e?addToSet({},e.FORBID_TAGS,pe):{},ke="FORBID_ATTR"in e?addToSet({},e.FORBID_ATTR,pe):{},Ge="USE_PROFILES"in e&&e.USE_PROFILES,we=!1!==e.ALLOW_ARIA_ATTR,Ce=!1!==e.ALLOW_DATA_ATTR,xe=e.ALLOW_UNKNOWN_PROTOCOLS||!1,Oe=e.SAFE_FOR_TEMPLATES||!1,De=e.WHOLE_DOCUMENT||!1,Re=e.RETURN_DOM||!1,Ie=e.RETURN_DOM_FRAGMENT||!1,Fe=e.RETURN_TRUSTED_TYPE||!1,Me=e.FORCE_BODY||!1,He=!1!==e.SANITIZE_DOM,Ue=e.SANITIZE_NAMED_PROPS||!1,Pe=!1!==e.KEEP_CONTENT,Be=e.IN_PLACE||!1,be=e.ALLOWED_URI_REGEXP||be,Je=e.NAMESPACE||Ze,e.CUSTOM_ELEMENT_HANDLING&&it(e.CUSTOM_ELEMENT_HANDLING.tagNameCheck)&&(Ne.tagNameCheck=e.CUSTOM_ELEMENT_HANDLING.tagNameCheck),e.CUSTOM_ELEMENT_HANDLING&&it(e.CUSTOM_ELEMENT_HANDLING.attributeNameCheck)&&(Ne.attributeNameCheck=e.CUSTOM_ELEMENT_HANDLING.attributeNameCheck),e.CUSTOM_ELEMENT_HANDLING&&"boolean"==typeof e.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements&&(Ne.allowCustomizedBuiltInElements=e.CUSTOM_ELEMENT_HANDLING.allowCustomizedBuiltInElements),Oe&&(Ce=!1),Ie&&(Re=!0),Ge&&(_e=addToSet({},_toConsumableArray(C)),Ae=[],!0===Ge.html&&(addToSet(_e,A),addToSet(Ae,x)),!0===Ge.svg&&(addToSet(_e,v),addToSet(Ae,O),addToSet(Ae,L)),!0===Ge.svgFilters&&(addToSet(_e,N),addToSet(Ae,O),addToSet(Ae,L)),!0===Ge.mathMl&&(addToSet(_e,k),addToSet(Ae,D),addToSet(Ae,L))),e.ADD_TAGS&&(_e===Se&&(_e=clone(_e)),addToSet(_e,e.ADD_TAGS,pe)),e.ADD_ATTR&&(Ae===ve&&(Ae=clone(Ae)),addToSet(Ae,e.ADD_ATTR,pe)),e.ADD_URI_SAFE_ATTR&&addToSet(Ye,e.ADD_URI_SAFE_ATTR,pe),e.FORBID_CONTENTS&&(je===We&&(je=clone(je)),addToSet(je,e.FORBID_CONTENTS,pe)),Pe&&(_e["#text"]=!0),De&&addToSet(_e,["html","head","body"]),_e.table&&(addToSet(_e,["tbody"]),delete Ee.tbody),a&&a(e),ot=e)},ct=addToSet({},["mi","mo","mn","ms","mtext"]),ut=addToSet({},["foreignobject","desc","title","annotation-xml"]),st=addToSet({},["title","style","font","a","script"]),pt=addToSet({},v);addToSet(pt,N),addToSet(pt,E);var dt=addToSet({},k);addToSet(dt,w);var mt=function _checkValidNamespace(e){var t=J(e);t&&t.tagName||(t={namespaceURI:Je,tagName:"template"});var n=f(e.tagName),r=f(t.tagName);return!!et[e.namespaceURI]&&(e.namespaceURI===Xe?t.namespaceURI===Ze?"svg"===n:t.namespaceURI===Ke?"svg"===n&&("annotation-xml"===r||ct[r]):Boolean(pt[n]):e.namespaceURI===Ke?t.namespaceURI===Ze?"math"===n:t.namespaceURI===Xe?"math"===n&&ut[r]:Boolean(dt[n]):e.namespaceURI===Ze?!(t.namespaceURI===Xe&&!ut[r])&&!(t.namespaceURI===Ke&&!ct[r])&&!dt[n]&&(st[n]||!pt[n]):!("application/xhtml+xml"!==se||!et[e.namespaceURI]))},ft=function _forceRemove(e){m(t.removed,{element:e});try{e.parentNode.removeChild(e)}catch(t){try{e.outerHTML=te}catch(t){e.remove()}}},yt=function _removeAttribute(e,n){try{m(t.removed,{attribute:n.getAttributeNode(e),from:n})}catch(e){m(t.removed,{attribute:null,from:n})}if(n.removeAttribute(e),"is"===e&&!Ae[e])if(Re||Ie)try{ft(n)}catch(e){}else try{n.setAttribute(e,"")}catch(e){}},ht=function _initDocument(e){var t,n;if(Me)e="<remove></remove>"+e;else{var o=h(e,/^[\r\n\t ]+/);n=o&&o[0]}"application/xhtml+xml"===se&&Je===Ze&&(e='<html xmlns="http://www.w3.org/1999/xhtml"><head></head><body>'+e+"</body></html>");var a=ee?ee.createHTML(e):e;if(Je===Ze)try{t=(new V).parseFromString(a,se)}catch(e){}if(!t||!t.documentElement){t=re.createDocument(Je,"template",null);try{t.documentElement.innerHTML=Qe?"":a}catch(e){}}var i=t.body||t.documentElement;return e&&n&&i.insertBefore(r.createTextNode(n),i.childNodes[0]||null),Je===Ze?ie.call(t,De?"html":"body")[0]:De?t.documentElement:i},gt=function _createIterator(e){return oe.call(e.ownerDocument||e,e,u.SHOW_ELEMENT|u.SHOW_COMMENT|u.SHOW_TEXT,null,!1)},Tt=function _isClobbered(e){return e instanceof q&&("string"!=typeof e.nodeName||"string"!=typeof e.textContent||"function"!=typeof e.removeChild||!(e.attributes instanceof W)||"function"!=typeof e.removeAttribute||"function"!=typeof e.setAttribute||"string"!=typeof e.namespaceURI||"function"!=typeof e.insertBefore||"function"!=typeof e.hasChildNodes)},bt=function _isNode(e){return"object"===_typeof(l)?e instanceof l:e&&"object"===_typeof(e)&&"number"==typeof e.nodeType&&"string"==typeof e.nodeName},_t=function _executeHook(e,n,r){ue[e]&&p(ue[e],(function(e){e.call(t,n,r,ot)}))},St=function _sanitizeElements(e){var n;if(_t("beforeSanitizeElements",e,null),Tt(e))return ft(e),!0;if(_(/[\u0080-\uFFFF]/,e.nodeName))return ft(e),!0;var r=pe(e.nodeName);if(_t("uponSanitizeElement",e,{tagName:r,allowedTags:_e}),e.hasChildNodes()&&!bt(e.firstElementChild)&&(!bt(e.content)||!bt(e.content.firstElementChild))&&_(/<[/\w]/g,e.innerHTML)&&_(/<[/\w]/g,e.textContent))return ft(e),!0;if("select"===r&&_(/<template/i,e.innerHTML))return ft(e),!0;if(!_e[r]||Ee[r]){if(!Ee[r]&&vt(r)){if(Ne.tagNameCheck instanceof RegExp&&_(Ne.tagNameCheck,r))return!1;if(Ne.tagNameCheck instanceof Function&&Ne.tagNameCheck(r))return!1}if(Pe&&!je[r]){var o=J(e)||e.parentNode,a=Z(e)||e.childNodes;if(a&&o)for(var i=a.length-1;i>=0;--i)o.insertBefore(K(a[i],!0),X(e))}return ft(e),!0}return e instanceof c&&!mt(e)?(ft(e),!0):"noscript"!==r&&"noembed"!==r||!_(/<\/no(script|embed)/i,e.innerHTML)?(Oe&&3===e.nodeType&&(n=e.textContent,n=g(n,de," "),n=g(n,me," "),n=g(n,fe," "),e.textContent!==n&&(m(t.removed,{element:e.cloneNode()}),e.textContent=n)),_t("afterSanitizeElements",e,null),!1):(ft(e),!0)},At=function _isValidAttribute(e,t,n){if(He&&("id"===t||"name"===t)&&(n in r||n in at))return!1;if(Ce&&!ke[t]&&_(ye,t));else if(we&&_(he,t));else if(!Ae[t]||ke[t]){if(!(vt(e)&&(Ne.tagNameCheck instanceof RegExp&&_(Ne.tagNameCheck,e)||Ne.tagNameCheck instanceof Function&&Ne.tagNameCheck(e))&&(Ne.attributeNameCheck instanceof RegExp&&_(Ne.attributeNameCheck,t)||Ne.attributeNameCheck instanceof Function&&Ne.attributeNameCheck(t))||"is"===t&&Ne.allowCustomizedBuiltInElements&&(Ne.tagNameCheck instanceof RegExp&&_(Ne.tagNameCheck,n)||Ne.tagNameCheck instanceof Function&&Ne.tagNameCheck(n))))return!1}else if(Ye[t]);else if(_(be,g(n,Te,"")));else if("src"!==t&&"xlink:href"!==t&&"href"!==t||"script"===e||0!==T(n,"data:")||!qe[e])if(xe&&!_(ge,g(n,Te,"")));else if(n)return!1;return!0},vt=function _basicCustomElementTest(e){return e.indexOf("-")>0},Nt=function _sanitizeAttributes(e){var n,r,o,a;_t("beforeSanitizeAttributes",e,null);var i=e.attributes;if(i){var l={attrName:"",attrValue:"",keepAttr:!0,allowedAttributes:Ae};for(a=i.length;a--;){var c=n=i[a],u=c.name,s=c.namespaceURI;if(r="value"===u?n.value:b(n.value),o=pe(u),l.attrName=o,l.attrValue=r,l.keepAttr=!0,l.forceKeepAttr=void 0,_t("uponSanitizeAttribute",e,l),r=l.attrValue,!l.forceKeepAttr&&(yt(u,e),l.keepAttr))if(_(/\/>/i,r))yt(u,e);else{Oe&&(r=g(r,de," "),r=g(r,me," "),r=g(r,fe," "));var p=pe(e.nodeName);if(At(p,o,r)){if(!Ue||"id"!==o&&"name"!==o||(yt(u,e),r=ze+r),ee&&"object"===_typeof(Y)&&"function"==typeof Y.getAttributeType)if(s);else switch(Y.getAttributeType(p,o)){case"TrustedHTML":r=ee.createHTML(r);break;case"TrustedScriptURL":r=ee.createScriptURL(r)}try{s?e.setAttributeNS(s,u,r):e.setAttribute(u,r),d(t.removed)}catch(e){}}}}_t("afterSanitizeAttributes",e,null)}},Et=function _sanitizeShadowDOM(e){var t,n=gt(e);for(_t("beforeSanitizeShadowDOM",e,null);t=n.nextNode();)_t("uponSanitizeShadowNode",t,null),St(t)||(t.content instanceof o&&_sanitizeShadowDOM(t.content),Nt(t));_t("afterSanitizeShadowDOM",e,null)};return t.sanitize=function(r){var a,i,c,u,s,p=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};if((Qe=!r)&&(r="\x3c!--\x3e"),"string"!=typeof r&&!bt(r)){if("function"!=typeof r.toString)throw S("toString is not a function");if("string"!=typeof(r=r.toString()))throw S("dirty is not a string, aborting")}if(!t.isSupported){if("object"===_typeof(e.toStaticHTML)||"function"==typeof e.toStaticHTML){if("string"==typeof r)return e.toStaticHTML(r);if(bt(r))return e.toStaticHTML(r.outerHTML)}return r}if(Le||lt(p),t.removed=[],"string"==typeof r&&(Be=!1),Be){if(r.nodeName){var d=pe(r.nodeName);if(!_e[d]||Ee[d])throw S("root node is forbidden and cannot be sanitized in-place")}}else if(r instanceof l)1===(i=(a=ht("\x3c!----\x3e")).ownerDocument.importNode(r,!0)).nodeType&&"BODY"===i.nodeName||"HTML"===i.nodeName?a=i:a.appendChild(i);else{if(!Re&&!Oe&&!De&&-1===r.indexOf("<"))return ee&&Fe?ee.createHTML(r):r;if(!(a=ht(r)))return Re?null:Fe?te:""}a&&Me&&ft(a.firstChild);for(var m=gt(Be?r:a);c=m.nextNode();)3===c.nodeType&&c===u||St(c)||(c.content instanceof o&&Et(c.content),Nt(c),u=c);if(u=null,Be)return r;if(Re){if(Ie)for(s=ae.call(a.ownerDocument);a.firstChild;)s.appendChild(a.firstChild);else s=a;return Ae.shadowroot&&(s=le.call(n,s,!0)),s}var f=De?a.outerHTML:a.innerHTML;return De&&_e["!doctype"]&&a.ownerDocument&&a.ownerDocument.doctype&&a.ownerDocument.doctype.name&&_(B,a.ownerDocument.doctype.name)&&(f="<!DOCTYPE "+a.ownerDocument.doctype.name+">\n"+f),Oe&&(f=g(f,de," "),f=g(f,me," "),f=g(f,fe," ")),ee&&Fe?ee.createHTML(f):f},t.setConfig=function(e){lt(e),Le=!0},t.clearConfig=function(){ot=null,Le=!1},t.isValidAttribute=function(e,t,n){ot||lt({});var r=pe(e),o=pe(t);return At(r,o,n)},t.addHook=function(e,t){"function"==typeof t&&(ue[e]=ue[e]||[],m(ue[e],t))},t.removeHook=function(e){if(ue[e])return d(ue[e])},t.removeHooks=function(e){ue[e]&&(ue[e]=[])},t.removeAllHooks=function(){ue={}},t}return createDOMPurify()}()}}]);