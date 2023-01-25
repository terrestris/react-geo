/*! For license information please see 173.60660efd.js.LICENSE.txt */
(self.webpackChunk_terrestris_react_geo=self.webpackChunk_terrestris_react_geo||[]).push([[173],{67197:(e,t)=>{var r,i,a,n,s,l,f,o,u,c,d,h,m;i={defaultNoDataValue:-34027999387901484e22,decode:function(e,t){var r=(t=t||{}).encodedMaskData||null===t.encodedMaskData,f=l(e,t.inputOffset||0,r),o=null!==t.noDataValue?t.noDataValue:i.defaultNoDataValue,u=a(f,t.pixelType||Float32Array,t.encodedMaskData,o,t.returnMask),c={width:f.width,height:f.height,pixelData:u.resultPixels,minValue:u.minValue,maxValue:f.pixels.maxValue,noDataValue:o};return u.resultMask&&(c.maskData=u.resultMask),t.returnEncodedMask&&f.mask&&(c.encodedMaskData=f.mask.bitset?f.mask.bitset:null),t.returnFileInfo&&(c.fileInfo=n(f),t.computeUsedBitDepths&&(c.fileInfo.bitDepths=s(f))),c}},a=function(e,t,r,i,a){var n,s,l,o=0,u=e.pixels.numBlocksX,c=e.pixels.numBlocksY,d=Math.floor(e.width/u),h=Math.floor(e.height/c),m=2*e.maxZError,p=Number.MAX_VALUE;r=r||(e.mask?e.mask.bitset:null),s=new t(e.width*e.height),a&&r&&(l=new Uint8Array(e.width*e.height));for(var g,x,w=new Float32Array(d*h),k=0;k<=c;k++){var y=k!==c?h:e.height%c;if(0!==y)for(var b=0;b<=u;b++){var v=b!==u?d:e.width%u;if(0!==v){var U,I,V,M,D=k*e.width*h+b*d,A=e.width-v,B=e.pixels.blocks[o];if(B.encoding<2?(0===B.encoding?U=B.rawData:(f(B.stuffedData,B.bitsPerPixel,B.numValidPixels,B.offset,m,w,e.pixels.maxValue),U=w),I=0):V=2===B.encoding?0:B.offset,r)for(x=0;x<y;x++){for(7&D&&(M=r[D>>3],M<<=7&D),g=0;g<v;g++)7&D||(M=r[D>>3]),128&M?(l&&(l[D]=1),p=p>(n=B.encoding<2?U[I++]:V)?n:p,s[D++]=n):(l&&(l[D]=0),s[D++]=i),M<<=1;D+=A}else if(B.encoding<2)for(x=0;x<y;x++){for(g=0;g<v;g++)p=p>(n=U[I++])?n:p,s[D++]=n;D+=A}else for(p=p>V?V:p,x=0;x<y;x++){for(g=0;g<v;g++)s[D++]=V;D+=A}if(1===B.encoding&&I!==B.numValidPixels)throw"Block and Mask do not match";o++}}}return{resultPixels:s,resultMask:l,minValue:p}},n=function(e){return{fileIdentifierString:e.fileIdentifierString,fileVersion:e.fileVersion,imageType:e.imageType,height:e.height,width:e.width,maxZError:e.maxZError,eofOffset:e.eofOffset,mask:e.mask?{numBlocksX:e.mask.numBlocksX,numBlocksY:e.mask.numBlocksY,numBytes:e.mask.numBytes,maxValue:e.mask.maxValue}:null,pixels:{numBlocksX:e.pixels.numBlocksX,numBlocksY:e.pixels.numBlocksY,numBytes:e.pixels.numBytes,maxValue:e.pixels.maxValue,noDataValue:e.noDataValue}}},s=function(e){for(var t=e.pixels.numBlocksX*e.pixels.numBlocksY,r={},i=0;i<t;i++){var a=e.pixels.blocks[i];0===a.encoding?r.float32=!0:1===a.encoding?r[a.bitsPerPixel]=!0:r[0]=!0}return Object.keys(r)},l=function(e,t,r){var i={},a=new Uint8Array(e,t,10);if(i.fileIdentifierString=String.fromCharCode.apply(null,a),"CntZImage"!==i.fileIdentifierString.trim())throw"Unexpected file identifier string: "+i.fileIdentifierString;t+=10;var n=new DataView(e,t,24);if(i.fileVersion=n.getInt32(0,!0),i.imageType=n.getInt32(4,!0),i.height=n.getUint32(8,!0),i.width=n.getUint32(12,!0),i.maxZError=n.getFloat64(16,!0),t+=24,!r)if(n=new DataView(e,t,16),i.mask={},i.mask.numBlocksY=n.getUint32(0,!0),i.mask.numBlocksX=n.getUint32(4,!0),i.mask.numBytes=n.getUint32(8,!0),i.mask.maxValue=n.getFloat32(12,!0),t+=16,i.mask.numBytes>0){var s=new Uint8Array(Math.ceil(i.width*i.height/8)),l=(n=new DataView(e,t,i.mask.numBytes)).getInt16(0,!0),f=2,o=0;do{if(l>0)for(;l--;)s[o++]=n.getUint8(f++);else{var u=n.getUint8(f++);for(l=-l;l--;)s[o++]=u}l=n.getInt16(f,!0),f+=2}while(f<i.mask.numBytes);if(-32768!==l||o<s.length)throw"Unexpected end of mask RLE encoding";i.mask.bitset=s,t+=i.mask.numBytes}else 0==(i.mask.numBytes|i.mask.numBlocksY|i.mask.maxValue)&&(i.mask.bitset=new Uint8Array(Math.ceil(i.width*i.height/8)));n=new DataView(e,t,16),i.pixels={},i.pixels.numBlocksY=n.getUint32(0,!0),i.pixels.numBlocksX=n.getUint32(4,!0),i.pixels.numBytes=n.getUint32(8,!0),i.pixels.maxValue=n.getFloat32(12,!0),t+=16;var c=i.pixels.numBlocksX,d=i.pixels.numBlocksY,h=c+(i.width%c>0?1:0),m=d+(i.height%d>0?1:0);i.pixels.blocks=new Array(h*m);for(var p=0,g=0;g<m;g++)for(var x=0;x<h;x++){var w=0,k=e.byteLength-t;n=new DataView(e,t,Math.min(10,k));var y={};i.pixels.blocks[p++]=y;var b=n.getUint8(0);if(w++,y.encoding=63&b,y.encoding>3)throw"Invalid block encoding ("+y.encoding+")";if(2!==y.encoding){if(0!==b&&2!==b){if(b>>=6,y.offsetType=b,2===b)y.offset=n.getInt8(1),w++;else if(1===b)y.offset=n.getInt16(1,!0),w+=2;else{if(0!==b)throw"Invalid block offset type";y.offset=n.getFloat32(1,!0),w+=4}if(1===y.encoding)if(b=n.getUint8(w),w++,y.bitsPerPixel=63&b,b>>=6,y.numValidPixelsType=b,2===b)y.numValidPixels=n.getUint8(w),w++;else if(1===b)y.numValidPixels=n.getUint16(w,!0),w+=2;else{if(0!==b)throw"Invalid valid pixel count type";y.numValidPixels=n.getUint32(w,!0),w+=4}}var v;if(t+=w,3!==y.encoding)if(0===y.encoding){var U=(i.pixels.numBytes-1)/4;if(U!==Math.floor(U))throw"uncompressed block has invalid length";v=new ArrayBuffer(4*U),new Uint8Array(v).set(new Uint8Array(e,t,4*U));var I=new Float32Array(v);y.rawData=I,t+=4*U}else if(1===y.encoding){var V=Math.ceil(y.numValidPixels*y.bitsPerPixel/8),M=Math.ceil(V/4);v=new ArrayBuffer(4*M),new Uint8Array(v).set(new Uint8Array(e,t,V)),y.stuffedData=new Uint32Array(v),t+=V}}else t++}return i.eofOffset=t,i},f=function(e,t,r,i,a,n,s){var l,f,o,u=(1<<t)-1,c=0,d=0,h=Math.ceil((s-i)/a),m=4*e.length-Math.ceil(t*r/8);for(e[e.length-1]<<=8*m,l=0;l<r;l++){if(0===d&&(o=e[c++],d=32),d>=t)f=o>>>d-t&u,d-=t;else{var p=t-d;f=(o&u)<<p&u,f+=(o=e[c++])>>>(d=32-p)}n[l]=f<h?i+f*a:s}return n},c=i,d=function(){"use strict";var BitStuffer_unstuff=function(e,t,r,i,a,n,s,l){var f,o,u,c,d,h=(1<<r)-1,m=0,p=0,g=4*e.length-Math.ceil(r*i/8);if(e[e.length-1]<<=8*g,a)for(f=0;f<i;f++)0===p&&(u=e[m++],p=32),p>=r?(o=u>>>p-r&h,p-=r):(o=(u&h)<<(c=r-p)&h,o+=(u=e[m++])>>>(p=32-c)),t[f]=a[o];else for(d=Math.ceil((l-n)/s),f=0;f<i;f++)0===p&&(u=e[m++],p=32),p>=r?(o=u>>>p-r&h,p-=r):(o=(u&h)<<(c=r-p)&h,o+=(u=e[m++])>>>(p=32-c)),t[f]=o<d?n+o*s:l},BitStuffer_unstuffLUT=function(e,t,r,i,a,n){var s,l=(1<<t)-1,f=0,o=0,u=0,c=0,d=0,h=[],m=4*e.length-Math.ceil(t*r/8);e[e.length-1]<<=8*m;var p=Math.ceil((n-i)/a);for(o=0;o<r;o++)0===c&&(s=e[f++],c=32),c>=t?(d=s>>>c-t&l,c-=t):(d=(s&l)<<(u=t-c)&l,d+=(s=e[f++])>>>(c=32-u)),h[o]=d<p?i+d*a:n;return h.unshift(i),h},BitStuffer_unstuff2=function(e,t,r,i,a,n,s,l){var f,o,u,c,d=(1<<r)-1,h=0,m=0,p=0;if(a)for(f=0;f<i;f++)0===m&&(u=e[h++],m=32,p=0),m>=r?(o=u>>>p&d,m-=r,p+=r):(o=u>>>p&d,m=32-(c=r-m),o|=((u=e[h++])&(1<<c)-1)<<r-c,p=c),t[f]=a[o];else{var g=Math.ceil((l-n)/s);for(f=0;f<i;f++)0===m&&(u=e[h++],m=32,p=0),m>=r?(o=u>>>p&d,m-=r,p+=r):(o=u>>>p&d,m=32-(c=r-m),o|=((u=e[h++])&(1<<c)-1)<<r-c,p=c),t[f]=o<g?n+o*s:l}return t},BitStuffer_unstuffLUT2=function(e,t,r,i,a,n){var s,l=(1<<t)-1,f=0,o=0,u=0,c=0,d=0,h=0,m=[],p=Math.ceil((n-i)/a);for(o=0;o<r;o++)0===c&&(s=e[f++],c=32,h=0),c>=t?(d=s>>>h&l,c-=t,h+=t):(d=s>>>h&l,c=32-(u=t-c),d|=((s=e[f++])&(1<<u)-1)<<t-u,h=u),m[o]=d<p?i+d*a:n;return m.unshift(i),m},BitStuffer_originalUnstuff=function(e,t,r,i){var a,n,s,l,f=(1<<r)-1,o=0,u=0,c=4*e.length-Math.ceil(r*i/8);for(e[e.length-1]<<=8*c,a=0;a<i;a++)0===u&&(s=e[o++],u=32),u>=r?(n=s>>>u-r&f,u-=r):(n=(s&f)<<(l=r-u)&f,n+=(s=e[o++])>>>(u=32-l)),t[a]=n;return t},BitStuffer_originalUnstuff2=function(e,t,r,i){var a,n,s,l,f=(1<<r)-1,o=0,u=0,c=0;for(a=0;a<i;a++)0===u&&(s=e[o++],u=32,c=0),u>=r?(n=s>>>c&f,u-=r,c+=r):(n=s>>>c&f,u=32-(l=r-u),n|=((s=e[o++])&(1<<l)-1)<<r-l,c=l),t[a]=n;return t},e={HUFFMAN_LUT_BITS_MAX:12,computeChecksumFletcher32:function(e){for(var t=65535,r=65535,i=e.length,a=Math.floor(i/2),n=0;a;){var s=a>=359?359:a;a-=s;do{t+=e[n++]<<8,r+=t+=e[n++]}while(--s);t=(65535&t)+(t>>>16),r=(65535&r)+(r>>>16)}return 1&i&&(r+=t+=e[n]<<8),((r=(65535&r)+(r>>>16))<<16|(t=(65535&t)+(t>>>16)))>>>0},readHeaderInfo:function(e,t){var r=t.ptr,i=new Uint8Array(e,r,6),a={};if(a.fileIdentifierString=String.fromCharCode.apply(null,i),0!==a.fileIdentifierString.lastIndexOf("Lerc2",0))throw"Unexpected file identifier string (expect Lerc2 ): "+a.fileIdentifierString;r+=6;var n,s=new DataView(e,r,8),l=s.getInt32(0,!0);if(a.fileVersion=l,r+=4,l>=3&&(a.checksum=s.getUint32(4,!0),r+=4),s=new DataView(e,r,12),a.height=s.getUint32(0,!0),a.width=s.getUint32(4,!0),r+=8,l>=4?(a.numDims=s.getUint32(8,!0),r+=4):a.numDims=1,s=new DataView(e,r,40),a.numValidPixel=s.getUint32(0,!0),a.microBlockSize=s.getInt32(4,!0),a.blobSize=s.getInt32(8,!0),a.imageType=s.getInt32(12,!0),a.maxZError=s.getFloat64(16,!0),a.zMin=s.getFloat64(24,!0),a.zMax=s.getFloat64(32,!0),r+=40,t.headerInfo=a,t.ptr=r,l>=3&&(n=l>=4?52:48,this.computeChecksumFletcher32(new Uint8Array(e,r-n,a.blobSize-14))!==a.checksum))throw"Checksum failed.";return!0},checkMinMaxRanges:function(e,t){var r=t.headerInfo,i=this.getDataTypeArray(r.imageType),a=r.numDims*this.getDataTypeSize(r.imageType),n=this.readSubArray(e,t.ptr,i,a),s=this.readSubArray(e,t.ptr+a,i,a);t.ptr+=2*a;var l,f=!0;for(l=0;l<r.numDims;l++)if(n[l]!==s[l]){f=!1;break}return r.minValues=n,r.maxValues=s,f},readSubArray:function(e,t,r,i){var a;if(r===Uint8Array)a=new Uint8Array(e,t,i);else{var n=new ArrayBuffer(i);new Uint8Array(n).set(new Uint8Array(e,t,i)),a=new r(n)}return a},readMask:function(e,t){var r,i,a=t.ptr,n=t.headerInfo,s=n.width*n.height,l=n.numValidPixel,f=new DataView(e,a,4),o={};if(o.numBytes=f.getUint32(0,!0),a+=4,(0===l||s===l)&&0!==o.numBytes)throw"invalid mask";if(0===l)r=new Uint8Array(Math.ceil(s/8)),o.bitset=r,i=new Uint8Array(s),t.pixels.resultMask=i,a+=o.numBytes;else if(o.numBytes>0){r=new Uint8Array(Math.ceil(s/8));var u=(f=new DataView(e,a,o.numBytes)).getInt16(0,!0),c=2,d=0,h=0;do{if(u>0)for(;u--;)r[d++]=f.getUint8(c++);else for(h=f.getUint8(c++),u=-u;u--;)r[d++]=h;u=f.getInt16(c,!0),c+=2}while(c<o.numBytes);if(-32768!==u||d<r.length)throw"Unexpected end of mask RLE encoding";i=new Uint8Array(s);var m=0,p=0;for(p=0;p<s;p++)7&p?(m=r[p>>3],m<<=7&p):m=r[p>>3],128&m&&(i[p]=1);t.pixels.resultMask=i,o.bitset=r,a+=o.numBytes}return t.ptr=a,t.mask=o,!0},readDataOneSweep:function(t,r,i,a){var n,s=r.ptr,l=r.headerInfo,f=l.numDims,o=l.width*l.height,u=l.imageType,c=l.numValidPixel*e.getDataTypeSize(u)*f,d=r.pixels.resultMask;if(i===Uint8Array)n=new Uint8Array(t,s,c);else{var h=new ArrayBuffer(c);new Uint8Array(h).set(new Uint8Array(t,s,c)),n=new i(h)}if(n.length===o*f)r.pixels.resultPixels=a?e.swapDimensionOrder(n,o,f,i,!0):n;else{r.pixels.resultPixels=new i(o*f);var m=0,p=0,g=0,x=0;if(f>1){if(a){for(p=0;p<o;p++)if(d[p])for(x=p,g=0;g<f;g++,x+=o)r.pixels.resultPixels[x]=n[m++]}else for(p=0;p<o;p++)if(d[p])for(x=p*f,g=0;g<f;g++)r.pixels.resultPixels[x+g]=n[m++]}else for(p=0;p<o;p++)d[p]&&(r.pixels.resultPixels[p]=n[m++])}return s+=c,r.ptr=s,!0},readHuffmanTree:function(t,r){var i=this.HUFFMAN_LUT_BITS_MAX,a=new DataView(t,r.ptr,16);if(r.ptr+=16,a.getInt32(0,!0)<2)throw"unsupported Huffman version";var n=a.getInt32(4,!0),s=a.getInt32(8,!0),l=a.getInt32(12,!0);if(s>=l)return!1;var f=new Uint32Array(l-s);e.decodeBits(t,r,f);var o,u,c,d,h=[];for(o=s;o<l;o++)h[u=o-(o<n?0:n)]={first:f[o-s],second:null};var m=t.byteLength-r.ptr,p=Math.ceil(m/4),g=new ArrayBuffer(4*p);new Uint8Array(g).set(new Uint8Array(t,r.ptr,m));var x,w=new Uint32Array(g),k=0,y=0;for(x=w[0],o=s;o<l;o++)(d=h[u=o-(o<n?0:n)].first)>0&&(h[u].second=x<<k>>>32-d,32-k>=d?32===(k+=d)&&(k=0,x=w[++y]):(k+=d-32,x=w[++y],h[u].second|=x>>>32-k));var b=0,v=0,U=new TreeNode;for(o=0;o<h.length;o++)void 0!==h[o]&&(b=Math.max(b,h[o].first));v=b>=i?i:b;var I,V,M,D,A,B=[];for(o=s;o<l;o++)if((d=h[u=o-(o<n?0:n)].first)>0)if(I=[d,u],d<=v)for(V=h[u].second<<v-d,M=1<<v-d,c=0;c<M;c++)B[V|c]=I;else for(V=h[u].second,A=U,D=d-1;D>=0;D--)V>>>D&1?(A.right||(A.right=new TreeNode),A=A.right):(A.left||(A.left=new TreeNode),A=A.left),0!==D||A.val||(A.val=I[1]);return{decodeLut:B,numBitsLUTQick:v,numBitsLUT:b,tree:U,stuffedData:w,srcPtr:y,bitPos:k}},readHuffman:function(t,r,i,a){var n,s,l,f,o,u,c,d,h,m=r.headerInfo.numDims,p=r.headerInfo.height,g=r.headerInfo.width,x=g*p,w=this.readHuffmanTree(t,r),k=w.decodeLut,y=w.tree,b=w.stuffedData,v=w.srcPtr,U=w.bitPos,I=w.numBitsLUTQick,V=w.numBitsLUT,M=0===r.headerInfo.imageType?128:0,D=r.pixels.resultMask,A=0;U>0&&(v++,U=0);var B,P=b[v],T=1===r.encodeMode,S=new i(x*m),z=S;if(m<2||T){for(B=0;B<m;B++)if(m>1&&(z=new i(S.buffer,x*B,x),A=0),r.headerInfo.numValidPixel===g*p)for(d=0,u=0;u<p;u++)for(c=0;c<g;c++,d++){if(s=0,o=f=P<<U>>>32-I,32-U<I&&(o=f|=b[v+1]>>>64-U-I),k[o])s=k[o][1],U+=k[o][0];else for(o=f=P<<U>>>32-V,32-U<V&&(o=f|=b[v+1]>>>64-U-V),n=y,h=0;h<V;h++)if(!(n=f>>>V-h-1&1?n.right:n.left).left&&!n.right){s=n.val,U=U+h+1;break}U>=32&&(U-=32,P=b[++v]),l=s-M,T?(l+=c>0?A:u>0?z[d-g]:A,l&=255,z[d]=l,A=l):z[d]=l}else for(d=0,u=0;u<p;u++)for(c=0;c<g;c++,d++)if(D[d]){if(s=0,o=f=P<<U>>>32-I,32-U<I&&(o=f|=b[v+1]>>>64-U-I),k[o])s=k[o][1],U+=k[o][0];else for(o=f=P<<U>>>32-V,32-U<V&&(o=f|=b[v+1]>>>64-U-V),n=y,h=0;h<V;h++)if(!(n=f>>>V-h-1&1?n.right:n.left).left&&!n.right){s=n.val,U=U+h+1;break}U>=32&&(U-=32,P=b[++v]),l=s-M,T?(c>0&&D[d-1]?l+=A:u>0&&D[d-g]?l+=z[d-g]:l+=A,l&=255,z[d]=l,A=l):z[d]=l}}else for(d=0,u=0;u<p;u++)for(c=0;c<g;c++)if(d=u*g+c,!D||D[d])for(B=0;B<m;B++,d+=x){if(s=0,o=f=P<<U>>>32-I,32-U<I&&(o=f|=b[v+1]>>>64-U-I),k[o])s=k[o][1],U+=k[o][0];else for(o=f=P<<U>>>32-V,32-U<V&&(o=f|=b[v+1]>>>64-U-V),n=y,h=0;h<V;h++)if(!(n=f>>>V-h-1&1?n.right:n.left).left&&!n.right){s=n.val,U=U+h+1;break}U>=32&&(U-=32,P=b[++v]),l=s-M,z[d]=l}r.ptr=r.ptr+4*(v+1)+(U>0?4:0),r.pixels.resultPixels=S,m>1&&!a&&(r.pixels.resultPixels=e.swapDimensionOrder(S,x,m,i))},decodeBits:function(e,t,r,i,a){var n=t.headerInfo,s=n.fileVersion,l=0,f=e.byteLength-t.ptr>=5?5:e.byteLength-t.ptr,o=new DataView(e,t.ptr,f),u=o.getUint8(0);l++;var c=u>>6,d=0===c?4:3-c,h=(32&u)>0,m=31&u,p=0;if(1===d)p=o.getUint8(l),l++;else if(2===d)p=o.getUint16(l,!0),l+=2;else{if(4!==d)throw"Invalid valid pixel count type";p=o.getUint32(l,!0),l+=4}var g,x,w,k,y,b,v,U,I,V=2*n.maxZError,M=n.numDims>1?n.maxValues[a]:n.zMax;if(h){for(t.counter.lut++,U=o.getUint8(l),l++,k=Math.ceil((U-1)*m/8),y=Math.ceil(k/4),x=new ArrayBuffer(4*y),w=new Uint8Array(x),t.ptr+=l,w.set(new Uint8Array(e,t.ptr,k)),v=new Uint32Array(x),t.ptr+=k,I=0;U-1>>>I;)I++;k=Math.ceil(p*I/8),y=Math.ceil(k/4),x=new ArrayBuffer(4*y),(w=new Uint8Array(x)).set(new Uint8Array(e,t.ptr,k)),g=new Uint32Array(x),t.ptr+=k,b=s>=3?BitStuffer_unstuffLUT2(v,m,U-1,i,V,M):BitStuffer_unstuffLUT(v,m,U-1,i,V,M),s>=3?BitStuffer_unstuff2(g,r,I,p,b):BitStuffer_unstuff(g,r,I,p,b)}else t.counter.bitstuffer++,I=m,t.ptr+=l,I>0&&(k=Math.ceil(p*I/8),y=Math.ceil(k/4),x=new ArrayBuffer(4*y),(w=new Uint8Array(x)).set(new Uint8Array(e,t.ptr,k)),g=new Uint32Array(x),t.ptr+=k,s>=3?null==i?BitStuffer_originalUnstuff2(g,r,I,p):BitStuffer_unstuff2(g,r,I,p,!1,i,V,M):null==i?BitStuffer_originalUnstuff(g,r,I,p):BitStuffer_unstuff(g,r,I,p,!1,i,V,M))},readTiles:function(t,r,i,a){var n=r.headerInfo,s=n.width,l=n.height,f=s*l,o=n.microBlockSize,u=n.imageType,c=e.getDataTypeSize(u),d=Math.ceil(s/o),h=Math.ceil(l/o);r.pixels.numBlocksY=h,r.pixels.numBlocksX=d,r.pixels.ptr=0;var m,p,g,x,w,k,y,b,v,U,I=0,V=0,M=0,D=0,A=0,B=0,P=0,T=0,S=0,z=0,C=0,F=0,O=0,L=0,E=0,X=new i(o*o),Y=l%o||o,_=s%o||o,Z=n.numDims,H=r.pixels.resultMask,N=r.pixels.resultPixels,R=n.fileVersion>=5?14:15,Q=n.zMax;for(M=0;M<h;M++)for(A=M!==h-1?o:Y,D=0;D<d;D++)for(z=M*s*o+D*o,C=s-(B=D!==d-1?o:_),b=0;b<Z;b++){if(Z>1?(U=N,z=M*s*o+D*o,N=new i(r.pixels.resultPixels.buffer,f*b*c,f),Q=n.maxValues[b]):U=null,P=t.byteLength-r.ptr,p={},E=0,T=(m=new DataView(t,r.ptr,Math.min(10,P))).getUint8(0),E++,v=n.fileVersion>=5?4&T:0,S=T>>6&255,(T>>2&R)!=(D*o>>3&R))throw"integrity issue";if(v&&0===b)throw"integrity issue";if((w=3&T)>3)throw r.ptr+=E,"Invalid block encoding ("+w+")";if(2!==w)if(0===w){if(v)throw"integrity issue";if(r.counter.uncompressed++,r.ptr+=E,F=(F=A*B*c)<(O=t.byteLength-r.ptr)?F:O,g=new ArrayBuffer(F%c==0?F:F+c-F%c),new Uint8Array(g).set(new Uint8Array(t,r.ptr,F)),x=new i(g),L=0,H)for(I=0;I<A;I++){for(V=0;V<B;V++)H[z]&&(N[z]=x[L++]),z++;z+=C}else for(I=0;I<A;I++){for(V=0;V<B;V++)N[z++]=x[L++];z+=C}r.ptr+=L*c}else if(k=e.getDataTypeUsed(v&&u<6?4:u,S),y=e.getOnePixel(p,E,k,m),E+=e.getDataTypeSize(k),3===w)if(r.ptr+=E,r.counter.constantoffset++,H)for(I=0;I<A;I++){for(V=0;V<B;V++)H[z]&&(N[z]=v?Math.min(Q,U[z]+y):y),z++;z+=C}else for(I=0;I<A;I++){for(V=0;V<B;V++)N[z]=v?Math.min(Q,U[z]+y):y,z++;z+=C}else if(r.ptr+=E,e.decodeBits(t,r,X,y,b),E=0,v)if(H)for(I=0;I<A;I++){for(V=0;V<B;V++)H[z]&&(N[z]=X[E++]+U[z]),z++;z+=C}else for(I=0;I<A;I++){for(V=0;V<B;V++)N[z]=X[E++]+U[z],z++;z+=C}else if(H)for(I=0;I<A;I++){for(V=0;V<B;V++)H[z]&&(N[z]=X[E++]),z++;z+=C}else for(I=0;I<A;I++){for(V=0;V<B;V++)N[z++]=X[E++];z+=C}else{if(v)if(H)for(I=0;I<A;I++)for(V=0;V<B;V++)H[z]&&(N[z]=U[z]),z++;else for(I=0;I<A;I++)for(V=0;V<B;V++)N[z]=U[z],z++;r.counter.constant++,r.ptr+=E}}Z>1&&!a&&(r.pixels.resultPixels=e.swapDimensionOrder(r.pixels.resultPixels,f,Z,i))},formatFileInfo:function(t){return{fileIdentifierString:t.headerInfo.fileIdentifierString,fileVersion:t.headerInfo.fileVersion,imageType:t.headerInfo.imageType,height:t.headerInfo.height,width:t.headerInfo.width,numValidPixel:t.headerInfo.numValidPixel,microBlockSize:t.headerInfo.microBlockSize,blobSize:t.headerInfo.blobSize,maxZError:t.headerInfo.maxZError,pixelType:e.getPixelType(t.headerInfo.imageType),eofOffset:t.eofOffset,mask:t.mask?{numBytes:t.mask.numBytes}:null,pixels:{numBlocksX:t.pixels.numBlocksX,numBlocksY:t.pixels.numBlocksY,maxValue:t.headerInfo.zMax,minValue:t.headerInfo.zMin,noDataValue:t.noDataValue}}},constructConstantSurface:function(e,t){var r=e.headerInfo.zMax,i=e.headerInfo.zMin,a=e.headerInfo.maxValues,n=e.headerInfo.numDims,s=e.headerInfo.height*e.headerInfo.width,l=0,f=0,o=0,u=e.pixels.resultMask,c=e.pixels.resultPixels;if(u)if(n>1){if(t)for(l=0;l<n;l++)for(o=l*s,r=a[l],f=0;f<s;f++)u[f]&&(c[o+f]=r);else for(f=0;f<s;f++)if(u[f])for(o=f*n,l=0;l<n;l++)c[o+n]=a[l]}else for(f=0;f<s;f++)u[f]&&(c[f]=r);else if(n>1&&i!==r)if(t)for(l=0;l<n;l++)for(o=l*s,r=a[l],f=0;f<s;f++)c[o+f]=r;else for(f=0;f<s;f++)for(o=f*n,l=0;l<n;l++)c[o+l]=a[l];else for(f=0;f<s*n;f++)c[f]=r},getDataTypeArray:function(e){var t;switch(e){case 0:t=Int8Array;break;case 1:t=Uint8Array;break;case 2:t=Int16Array;break;case 3:t=Uint16Array;break;case 4:t=Int32Array;break;case 5:t=Uint32Array;break;case 6:default:t=Float32Array;break;case 7:t=Float64Array}return t},getPixelType:function(e){var t;switch(e){case 0:t="S8";break;case 1:t="U8";break;case 2:t="S16";break;case 3:t="U16";break;case 4:t="S32";break;case 5:t="U32";break;case 6:default:t="F32";break;case 7:t="F64"}return t},isValidPixelValue:function(e,t){if(null==t)return!1;var r;switch(e){case 0:r=t>=-128&&t<=127;break;case 1:r=t>=0&&t<=255;break;case 2:r=t>=-32768&&t<=32767;break;case 3:r=t>=0&&t<=65536;break;case 4:r=t>=-2147483648&&t<=2147483647;break;case 5:r=t>=0&&t<=4294967296;break;case 6:r=t>=-34027999387901484e22&&t<=34027999387901484e22;break;case 7:r=t>=-17976931348623157e292&&t<=17976931348623157e292;break;default:r=!1}return r},getDataTypeSize:function(e){var t=0;switch(e){case 0:case 1:t=1;break;case 2:case 3:t=2;break;case 4:case 5:case 6:t=4;break;case 7:t=8;break;default:t=e}return t},getDataTypeUsed:function(e,t){var r=e;switch(e){case 2:case 4:r=e-t;break;case 3:case 5:r=e-2*t;break;case 6:r=0===t?e:1===t?2:1;break;case 7:r=0===t?e:e-2*t+1;break;default:r=e}return r},getOnePixel:function(e,t,r,i){var a=0;switch(r){case 0:a=i.getInt8(t);break;case 1:a=i.getUint8(t);break;case 2:a=i.getInt16(t,!0);break;case 3:a=i.getUint16(t,!0);break;case 4:a=i.getInt32(t,!0);break;case 5:a=i.getUInt32(t,!0);break;case 6:a=i.getFloat32(t,!0);break;case 7:a=i.getFloat64(t,!0);break;default:throw"the decoder does not understand this pixel type"}return a},swapDimensionOrder:function(e,t,r,i,a){var n=0,s=0,l=0,f=0,o=e;if(r>1)if(o=new i(t*r),a)for(n=0;n<t;n++)for(f=n,l=0;l<r;l++,f+=t)o[f]=e[s++];else for(n=0;n<t;n++)for(f=n,l=0;l<r;l++,f+=t)o[s++]=e[f];return o}},TreeNode=function(e,t,r){this.val=e,this.left=t,this.right=r};return{decode:function(t,r){var i=(r=r||{}).noDataValue,a=0,n={};if(n.ptr=r.inputOffset||0,n.pixels={},e.readHeaderInfo(t,n)){var s=n.headerInfo,l=s.fileVersion,f=e.getDataTypeArray(s.imageType);if(l>5)throw"unsupported lerc version 2."+l;e.readMask(t,n),s.numValidPixel===s.width*s.height||n.pixels.resultMask||(n.pixels.resultMask=r.maskData);var o=s.width*s.height;n.pixels.resultPixels=new f(o*s.numDims),n.counter={onesweep:0,uncompressed:0,lut:0,bitstuffer:0,constant:0,constantoffset:0};var u,c=!r.returnPixelInterleavedDims;if(0!==s.numValidPixel)if(s.zMax===s.zMin)e.constructConstantSurface(n,c);else if(l>=4&&e.checkMinMaxRanges(t,n))e.constructConstantSurface(n,c);else{var d=new DataView(t,n.ptr,2),h=d.getUint8(0);if(n.ptr++,h)e.readDataOneSweep(t,n,f,c);else if(l>1&&s.imageType<=1&&Math.abs(s.maxZError-.5)<1e-5){var m=d.getUint8(1);if(n.ptr++,n.encodeMode=m,m>2||l<4&&m>1)throw"Invalid Huffman flag "+m;m?e.readHuffman(t,n,f,c):e.readTiles(t,n,f,c)}else e.readTiles(t,n,f,c)}n.eofOffset=n.ptr,r.inputOffset?(u=n.headerInfo.blobSize+r.inputOffset-n.ptr,Math.abs(u)>=1&&(n.eofOffset=r.inputOffset+n.headerInfo.blobSize)):(u=n.headerInfo.blobSize-n.ptr,Math.abs(u)>=1&&(n.eofOffset=n.headerInfo.blobSize));var p={width:s.width,height:s.height,pixelData:n.pixels.resultPixels,minValue:s.zMin,maxValue:s.zMax,validPixelCount:s.numValidPixel,dimCount:s.numDims,dimStats:{minValues:s.minValues,maxValues:s.maxValues},maskData:n.pixels.resultMask};if(n.pixels.resultMask&&e.isValidPixelValue(s.imageType,i)){var g=n.pixels.resultMask;for(a=0;a<o;a++)g[a]||(p.pixelData[a]=i);p.noDataValue=i}return n.noDataValue=i,r.returnFileInfo&&(p.fileInfo=e.formatFileInfo(n)),p}},getBandCount:function(t){for(var r=0,i=0,a={ptr:0,pixels:{}};i<t.byteLength-58;)e.readHeaderInfo(t,a),i+=a.headerInfo.blobSize,r++,a.ptr=i;return r}}}(),o=new ArrayBuffer(4),u=new Uint8Array(o),new Uint32Array(o)[0]=1,h=1===u[0],m={decode:function(e,t){if(!h)throw"Big endian system is not supported.";var r,i,a=(t=t||{}).inputOffset||0,n=new Uint8Array(e,a,10),s=String.fromCharCode.apply(null,n);if("CntZImage"===s.trim())r=c,i=1;else{if("Lerc2"!==s.substring(0,5))throw"Unexpected file identifier string: "+s;r=d,i=2}for(var l,f,o,u,m,p,g=0,x=e.byteLength-10,w=[],k={width:0,height:0,pixels:[],pixelType:t.pixelType,mask:null,statistics:[]},y=0;a<x;){var b=r.decode(e,{inputOffset:a,encodedMaskData:l,maskData:o,returnMask:0===g,returnEncodedMask:0===g,returnFileInfo:!0,returnPixelInterleavedDims:t.returnPixelInterleavedDims,pixelType:t.pixelType||null,noDataValue:t.noDataValue||null});a=b.fileInfo.eofOffset,o=b.maskData,0===g&&(l=b.encodedMaskData,k.width=b.width,k.height=b.height,k.dimCount=b.dimCount||1,k.pixelType=b.pixelType||b.fileInfo.pixelType,k.mask=o),i>1&&(o&&w.push(o),b.fileInfo.mask&&b.fileInfo.mask.numBytes>0&&y++),g++,k.pixels.push(b.pixelData),k.statistics.push({minValue:b.minValue,maxValue:b.maxValue,noDataValue:b.noDataValue,dimStats:b.dimStats})}if(i>1&&y>1){for(p=k.width*k.height,k.bandMasks=w,(o=new Uint8Array(p)).set(w[0]),u=1;u<w.length;u++)for(f=w[u],m=0;m<p;m++)o[m]=o[m]&f[m];k.maskData=o}return k}},void 0===(r=function(){return m}.apply(t,[]))||(e.exports=r)},74173:(e,t,r)=>{"use strict";r.r(t),r.d(t,{default:()=>l});var i=r(27885),a=r(67197),n=r(67737),s=r(82499);class l extends n.Z{constructor(e){super(),this.planarConfiguration=void 0!==e.PlanarConfiguration?e.PlanarConfiguration:1,this.samplesPerPixel=void 0!==e.SamplesPerPixel?e.SamplesPerPixel:1,this.addCompression=e.LercParameters[s.L5.AddCompression]}decodeBlock(e){switch(this.addCompression){case s.Qb.None:break;case s.Qb.Deflate:e=(0,i.rr)(new Uint8Array(e)).buffer;break;default:throw new Error(`Unsupported LERC additional compression method identifier: ${this.addCompression}`)}return a.decode(e,{returnPixelInterleavedDims:1===this.planarConfiguration}).pixels[0].buffer}}}}]);