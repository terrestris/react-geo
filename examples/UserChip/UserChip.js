!function(e){function r(r){for(var n,a,l=r[0],c=r[1],i=r[2],f=0,s=[];f<l.length;f++)a=l[f],o[a]&&s.push(o[a][0]),o[a]=0;for(n in c)Object.prototype.hasOwnProperty.call(c,n)&&(e[n]=c[n]);for(p&&p(r);s.length;)s.shift()();return u.push.apply(u,i||[]),t()}function t(){for(var e,r=0;r<u.length;r++){for(var t=u[r],n=!0,l=1;l<t.length;l++){var c=t[l];0!==o[c]&&(n=!1)}n&&(u.splice(r--,1),e=a(a.s=t[0]))}return e}var n={},o={5:0},u=[];function a(r){if(n[r])return n[r].exports;var t=n[r]={i:r,l:!1,exports:{}};return e[r].call(t.exports,t,t.exports,a),t.l=!0,t.exports}a.m=e,a.c=n,a.d=function(e,r,t){a.o(e,r)||Object.defineProperty(e,r,{configurable:!1,enumerable:!0,get:t})},a.r=function(e){Object.defineProperty(e,"__esModule",{value:!0})},a.n=function(e){var r=e&&e.__esModule?function(){return e.default}:function(){return e};return a.d(r,"a",r),r},a.o=function(e,r){return Object.prototype.hasOwnProperty.call(e,r)},a.p="";var l=window.webpackJsonp=window.webpackJsonp||[],c=l.push.bind(l);l.push=r,l=l.slice();for(var i=0;i<l.length;i++)r(l[i]);var p=c;u.push([446,1,0]),t()}({446:function(e,r,t){"use strict";var n=l(t(2)),o=t(16),u=l(t(240)),a=t(36);function l(e){return e&&e.__esModule?e:{default:e}}(0,o.render)(n.default.createElement("div",null,n.default.createElement(a.UserChip,{userName:"John Doe"}),n.default.createElement(a.UserChip,{userName:"John Doe",imageSrc:u.default,style:{marginTop:"10px"}})),document.getElementById("exampleContainer"))}});