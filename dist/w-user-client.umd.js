/*!
 * w-user-client v1.0.19
 * (c) 2018-2021 yuda-lyu(semisphere)
 * Released under the MIT License.
 */
!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?module.exports=e():"function"==typeof define&&define.amd?define(e):(t="undefined"!=typeof globalThis?globalThis:t||self)["w-user-client"]=e()}(this,(function(){"use strict";function t(e){return(t="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(e)}var e=function(t,e){return function(){for(var n=new Array(arguments.length),r=0;r<n.length;r++)n[r]=arguments[r];return t.apply(e,n)}},n=Object.prototype.toString;function r(t){return"[object Array]"===n.call(t)}function o(t){return void 0===t}function i(e){return null!==e&&"object"===t(e)}function a(t){if("[object Object]"!==n.call(t))return!1;var e=Object.getPrototypeOf(t);return null===e||e===Object.prototype}function s(t){return"[object Function]"===n.call(t)}function u(e,n){if(null!=e)if("object"!==t(e)&&(e=[e]),r(e))for(var o=0,i=e.length;o<i;o++)n.call(null,e[o],o,e);else for(var a in e)Object.prototype.hasOwnProperty.call(e,a)&&n.call(null,e[a],a,e)}var c={isArray:r,isArrayBuffer:function(t){return"[object ArrayBuffer]"===n.call(t)},isBuffer:function(t){return null!==t&&!o(t)&&null!==t.constructor&&!o(t.constructor)&&"function"==typeof t.constructor.isBuffer&&t.constructor.isBuffer(t)},isFormData:function(t){return"undefined"!=typeof FormData&&t instanceof FormData},isArrayBufferView:function(t){return"undefined"!=typeof ArrayBuffer&&ArrayBuffer.isView?ArrayBuffer.isView(t):t&&t.buffer&&t.buffer instanceof ArrayBuffer},isString:function(t){return"string"==typeof t},isNumber:function(t){return"number"==typeof t},isObject:i,isPlainObject:a,isUndefined:o,isDate:function(t){return"[object Date]"===n.call(t)},isFile:function(t){return"[object File]"===n.call(t)},isBlob:function(t){return"[object Blob]"===n.call(t)},isFunction:s,isStream:function(t){return i(t)&&s(t.pipe)},isURLSearchParams:function(t){return"undefined"!=typeof URLSearchParams&&t instanceof URLSearchParams},isStandardBrowserEnv:function(){return("undefined"==typeof navigator||"ReactNative"!==navigator.product&&"NativeScript"!==navigator.product&&"NS"!==navigator.product)&&("undefined"!=typeof window&&"undefined"!=typeof document)},forEach:u,merge:function t(){var e={};function n(n,o){a(e[o])&&a(n)?e[o]=t(e[o],n):a(n)?e[o]=t({},n):r(n)?e[o]=n.slice():e[o]=n}for(var o=0,i=arguments.length;o<i;o++)u(arguments[o],n);return e},extend:function(t,n,r){return u(n,(function(n,o){t[o]=r&&"function"==typeof n?e(n,r):n})),t},trim:function(t){return t.trim?t.trim():t.replace(/^\s+|\s+$/g,"")},stripBOM:function(t){return 65279===t.charCodeAt(0)&&(t=t.slice(1)),t}};function f(t){return encodeURIComponent(t).replace(/%3A/gi,":").replace(/%24/g,"$").replace(/%2C/gi,",").replace(/%20/g,"+").replace(/%5B/gi,"[").replace(/%5D/gi,"]")}var l=function(t,e,n){if(!e)return t;var r;if(n)r=n(e);else if(c.isURLSearchParams(e))r=e.toString();else{var o=[];c.forEach(e,(function(t,e){null!=t&&(c.isArray(t)?e+="[]":t=[t],c.forEach(t,(function(t){c.isDate(t)?t=t.toISOString():c.isObject(t)&&(t=JSON.stringify(t)),o.push(f(e)+"="+f(t))})))})),r=o.join("&")}if(r){var i=t.indexOf("#");-1!==i&&(t=t.slice(0,i)),t+=(-1===t.indexOf("?")?"?":"&")+r}return t};function p(){this.handlers=[]}p.prototype.use=function(t,e,n){return this.handlers.push({fulfilled:t,rejected:e,synchronous:!!n&&n.synchronous,runWhen:n?n.runWhen:null}),this.handlers.length-1},p.prototype.eject=function(t){this.handlers[t]&&(this.handlers[t]=null)},p.prototype.forEach=function(t){c.forEach(this.handlers,(function(e){null!==e&&t(e)}))};var h=p,d=function(t,e){c.forEach(t,(function(n,r){r!==e&&r.toUpperCase()===e.toUpperCase()&&(t[e]=n,delete t[r])}))},v=function(t,e,n,r,o){return t.config=e,n&&(t.code=n),t.request=r,t.response=o,t.isAxiosError=!0,t.toJSON=function(){return{message:this.message,name:this.name,description:this.description,number:this.number,fileName:this.fileName,lineNumber:this.lineNumber,columnNumber:this.columnNumber,stack:this.stack,config:this.config,code:this.code,status:this.response&&this.response.status?this.response.status:null}},t},y=function(t,e,n,r,o){var i=new Error(t);return v(i,e,n,r,o)},m=c.isStandardBrowserEnv()?{write:function(t,e,n,r,o,i){var a=[];a.push(t+"="+encodeURIComponent(e)),c.isNumber(n)&&a.push("expires="+new Date(n).toGMTString()),c.isString(r)&&a.push("path="+r),c.isString(o)&&a.push("domain="+o),!0===i&&a.push("secure"),document.cookie=a.join("; ")},read:function(t){var e=document.cookie.match(new RegExp("(^|;\\s*)("+t+")=([^;]*)"));return e?decodeURIComponent(e[3]):null},remove:function(t){this.write(t,"",Date.now()-864e5)}}:{write:function(){},read:function(){return null},remove:function(){}},g=["age","authorization","content-length","content-type","etag","expires","from","host","if-modified-since","if-unmodified-since","last-modified","location","max-forwards","proxy-authorization","referer","retry-after","user-agent"],b=c.isStandardBrowserEnv()?function(){var t,e=/(msie|trident)/i.test(navigator.userAgent),n=document.createElement("a");function r(t){var r=t;return e&&(n.setAttribute("href",r),r=n.href),n.setAttribute("href",r),{href:n.href,protocol:n.protocol?n.protocol.replace(/:$/,""):"",host:n.host,search:n.search?n.search.replace(/^\?/,""):"",hash:n.hash?n.hash.replace(/^#/,""):"",hostname:n.hostname,port:n.port,pathname:"/"===n.pathname.charAt(0)?n.pathname:"/"+n.pathname}}return t=r(window.location.href),function(e){var n=c.isString(e)?r(e):e;return n.protocol===t.protocol&&n.host===t.host}}():function(){return!0};function _(t){this.message=t}_.prototype.toString=function(){return"Cancel"+(this.message?": "+this.message:"")},_.prototype.__CANCEL__=!0;var w=_,j=x,O=function(t){return new Promise((function(e,n){var r,o=t.data,i=t.headers,a=t.responseType;function s(){t.cancelToken&&t.cancelToken.unsubscribe(r),t.signal&&t.signal.removeEventListener("abort",r)}c.isFormData(o)&&delete i["Content-Type"];var u=new XMLHttpRequest;if(t.auth){var f=t.auth.username||"",p=t.auth.password?unescape(encodeURIComponent(t.auth.password)):"";i.Authorization="Basic "+btoa(f+":"+p)}var h,d,v=(h=t.baseURL,d=t.url,h&&!/^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(d)?function(t,e){return e?t.replace(/\/+$/,"")+"/"+e.replace(/^\/+/,""):t}(h,d):d);function _(){if(u){var r,o,i,f,l,p="getAllResponseHeaders"in u?(r=u.getAllResponseHeaders(),l={},r?(c.forEach(r.split("\n"),(function(t){if(f=t.indexOf(":"),o=c.trim(t.substr(0,f)).toLowerCase(),i=c.trim(t.substr(f+1)),o){if(l[o]&&g.indexOf(o)>=0)return;l[o]="set-cookie"===o?(l[o]?l[o]:[]).concat([i]):l[o]?l[o]+", "+i:i}})),l):l):null;!function(t,e,n){var r=n.config.validateStatus;n.status&&r&&!r(n.status)?e(y("Request failed with status code "+n.status,n.config,null,n.request,n)):t(n)}((function(t){e(t),s()}),(function(t){n(t),s()}),{data:a&&"text"!==a&&"json"!==a?u.response:u.responseText,status:u.status,statusText:u.statusText,headers:p,config:t,request:u}),u=null}}if(u.open(t.method.toUpperCase(),l(v,t.params,t.paramsSerializer),!0),u.timeout=t.timeout,"onloadend"in u?u.onloadend=_:u.onreadystatechange=function(){u&&4===u.readyState&&(0!==u.status||u.responseURL&&0===u.responseURL.indexOf("file:"))&&setTimeout(_)},u.onabort=function(){u&&(n(y("Request aborted",t,"ECONNABORTED",u)),u=null)},u.onerror=function(){n(y("Network Error",t,null,u)),u=null},u.ontimeout=function(){var e="timeout of "+t.timeout+"ms exceeded",r=t.transitional||j.transitional;t.timeoutErrorMessage&&(e=t.timeoutErrorMessage),n(y(e,t,r.clarifyTimeoutError?"ETIMEDOUT":"ECONNABORTED",u)),u=null},c.isStandardBrowserEnv()){var O=(t.withCredentials||b(v))&&t.xsrfCookieName?m.read(t.xsrfCookieName):void 0;O&&(i[t.xsrfHeaderName]=O)}"setRequestHeader"in u&&c.forEach(i,(function(t,e){void 0===o&&"content-type"===e.toLowerCase()?delete i[e]:u.setRequestHeader(e,t)})),c.isUndefined(t.withCredentials)||(u.withCredentials=!!t.withCredentials),a&&"json"!==a&&(u.responseType=t.responseType),"function"==typeof t.onDownloadProgress&&u.addEventListener("progress",t.onDownloadProgress),"function"==typeof t.onUploadProgress&&u.upload&&u.upload.addEventListener("progress",t.onUploadProgress),(t.cancelToken||t.signal)&&(r=function(t){u&&(n(!t||t&&t.type?new w("canceled"):t),u.abort(),u=null)},t.cancelToken&&t.cancelToken.subscribe(r),t.signal&&(t.signal.aborted?r():t.signal.addEventListener("abort",r))),o||(o=null),u.send(o)}))},S={"Content-Type":"application/x-www-form-urlencoded"};function E(t,e){!c.isUndefined(t)&&c.isUndefined(t["Content-Type"])&&(t["Content-Type"]=e)}var T,N={transitional:{silentJSONParsing:!0,forcedJSONParsing:!0,clarifyTimeoutError:!1},adapter:(("undefined"!=typeof XMLHttpRequest||"undefined"!=typeof process&&"[object process]"===Object.prototype.toString.call(process))&&(T=O),T),transformRequest:[function(t,e){return d(e,"Accept"),d(e,"Content-Type"),c.isFormData(t)||c.isArrayBuffer(t)||c.isBuffer(t)||c.isStream(t)||c.isFile(t)||c.isBlob(t)?t:c.isArrayBufferView(t)?t.buffer:c.isURLSearchParams(t)?(E(e,"application/x-www-form-urlencoded;charset=utf-8"),t.toString()):c.isObject(t)||e&&"application/json"===e["Content-Type"]?(E(e,"application/json"),function(t,e,n){if(c.isString(t))try{return(e||JSON.parse)(t),c.trim(t)}catch(t){if("SyntaxError"!==t.name)throw t}return(n||JSON.stringify)(t)}(t)):t}],transformResponse:[function(t){var e=this.transitional||N.transitional,n=e&&e.silentJSONParsing,r=e&&e.forcedJSONParsing,o=!n&&"json"===this.responseType;if(o||r&&c.isString(t)&&t.length)try{return JSON.parse(t)}catch(t){if(o){if("SyntaxError"===t.name)throw v(t,this,"E_JSON_PARSE");throw t}}return t}],timeout:0,xsrfCookieName:"XSRF-TOKEN",xsrfHeaderName:"X-XSRF-TOKEN",maxContentLength:-1,maxBodyLength:-1,validateStatus:function(t){return t>=200&&t<300},headers:{common:{Accept:"application/json, text/plain, */*"}}};c.forEach(["delete","get","head"],(function(t){N.headers[t]={}})),c.forEach(["post","put","patch"],(function(t){N.headers[t]=c.merge(S)}));var x=N,A=function(t,e,n){var r=this||j;return c.forEach(n,(function(n){t=n.call(r,t,e)})),t},C=function(t){return!(!t||!t.__CANCEL__)};function P(t){if(t.cancelToken&&t.cancelToken.throwIfRequested(),t.signal&&t.signal.aborted)throw new w("canceled")}var R=function(t){return P(t),t.headers=t.headers||{},t.data=A.call(t,t.data,t.headers,t.transformRequest),t.headers=c.merge(t.headers.common||{},t.headers[t.method]||{},t.headers),c.forEach(["delete","get","head","post","put","patch","common"],(function(e){delete t.headers[e]})),(t.adapter||j.adapter)(t).then((function(e){return P(t),e.data=A.call(t,e.data,e.headers,t.transformResponse),e}),(function(e){return C(e)||(P(t),e&&e.response&&(e.response.data=A.call(t,e.response.data,e.response.headers,t.transformResponse))),Promise.reject(e)}))},U=function(t,e){e=e||{};var n={};function r(t,e){return c.isPlainObject(t)&&c.isPlainObject(e)?c.merge(t,e):c.isPlainObject(e)?c.merge({},e):c.isArray(e)?e.slice():e}function o(n){return c.isUndefined(e[n])?c.isUndefined(t[n])?void 0:r(void 0,t[n]):r(t[n],e[n])}function i(t){if(!c.isUndefined(e[t]))return r(void 0,e[t])}function a(n){return c.isUndefined(e[n])?c.isUndefined(t[n])?void 0:r(void 0,t[n]):r(void 0,e[n])}function s(n){return n in e?r(t[n],e[n]):n in t?r(void 0,t[n]):void 0}var u={url:i,method:i,data:i,baseURL:a,transformRequest:a,transformResponse:a,paramsSerializer:a,timeout:a,timeoutMessage:a,withCredentials:a,adapter:a,responseType:a,xsrfCookieName:a,xsrfHeaderName:a,onUploadProgress:a,onDownloadProgress:a,decompress:a,maxContentLength:a,maxBodyLength:a,transport:a,httpAgent:a,httpsAgent:a,cancelToken:a,socketPath:a,responseEncoding:a,validateStatus:s};return c.forEach(Object.keys(t).concat(Object.keys(e)),(function(t){var e=u[t]||o,r=e(t);c.isUndefined(r)&&e!==s||(n[t]=r)})),n},k="0.22.0",B=k,L={};["object","boolean","number","function","string","symbol"].forEach((function(e,n){L[e]=function(r){return t(r)===e||"a"+(n<1?"n ":" ")+e}}));var F={};L.transitional=function(t,e,n){function r(t,e){return"[Axios v"+B+"] Transitional option '"+t+"'"+e+(n?". "+n:"")}return function(n,o,i){if(!1===t)throw new Error(r(o," has been removed"+(e?" in "+e:"")));return e&&!F[o]&&(F[o]=!0,console.warn(r(o," has been deprecated since v"+e+" and will be removed in the near future"))),!t||t(n,o,i)}};var q={assertOptions:function(e,n,r){if("object"!==t(e))throw new TypeError("options must be an object");for(var o=Object.keys(e),i=o.length;i-- >0;){var a=o[i],s=n[a];if(s){var u=e[a],c=void 0===u||s(u,a,e);if(!0!==c)throw new TypeError("option "+a+" must be "+c)}else if(!0!==r)throw Error("Unknown option "+a)}},validators:L},z=q.validators;function D(t){this.defaults=t,this.interceptors={request:new h,response:new h}}D.prototype.request=function(t){"string"==typeof t?(t=arguments[1]||{}).url=arguments[0]:t=t||{},(t=U(this.defaults,t)).method?t.method=t.method.toLowerCase():this.defaults.method?t.method=this.defaults.method.toLowerCase():t.method="get";var e=t.transitional;void 0!==e&&q.assertOptions(e,{silentJSONParsing:z.transitional(z.boolean),forcedJSONParsing:z.transitional(z.boolean),clarifyTimeoutError:z.transitional(z.boolean)},!1);var n=[],r=!0;this.interceptors.request.forEach((function(e){"function"==typeof e.runWhen&&!1===e.runWhen(t)||(r=r&&e.synchronous,n.unshift(e.fulfilled,e.rejected))}));var o,i=[];if(this.interceptors.response.forEach((function(t){i.push(t.fulfilled,t.rejected)})),!r){var a=[R,void 0];for(Array.prototype.unshift.apply(a,n),a=a.concat(i),o=Promise.resolve(t);a.length;)o=o.then(a.shift(),a.shift());return o}for(var s=t;n.length;){var u=n.shift(),c=n.shift();try{s=u(s)}catch(t){c(t);break}}try{o=R(s)}catch(t){return Promise.reject(t)}for(;i.length;)o=o.then(i.shift(),i.shift());return o},D.prototype.getUri=function(t){return t=U(this.defaults,t),l(t.url,t.params,t.paramsSerializer).replace(/^\?/,"")},c.forEach(["delete","get","head","options"],(function(t){D.prototype[t]=function(e,n){return this.request(U(n||{},{method:t,url:e,data:(n||{}).data}))}})),c.forEach(["post","put","patch"],(function(t){D.prototype[t]=function(e,n,r){return this.request(U(r||{},{method:t,url:e,data:n}))}}));var $=D;function I(t){if("function"!=typeof t)throw new TypeError("executor must be a function.");var e;this.promise=new Promise((function(t){e=t}));var n=this;this.promise.then((function(t){if(n._listeners){var e,r=n._listeners.length;for(e=0;e<r;e++)n._listeners[e](t);n._listeners=null}})),this.promise.then=function(t){var e,r=new Promise((function(t){n.subscribe(t),e=t})).then(t);return r.cancel=function(){n.unsubscribe(e)},r},t((function(t){n.reason||(n.reason=new w(t),e(n.reason))}))}I.prototype.throwIfRequested=function(){if(this.reason)throw this.reason},I.prototype.subscribe=function(t){this.reason?t(this.reason):this._listeners?this._listeners.push(t):this._listeners=[t]},I.prototype.unsubscribe=function(t){if(this._listeners){var e=this._listeners.indexOf(t);-1!==e&&this._listeners.splice(e,1)}},I.source=function(){var t;return{token:new I((function(e){t=e})),cancel:t}};var J=I;var M=function t(n){var r=new $(n),o=e($.prototype.request,r);return c.extend(o,$.prototype,r),c.extend(o,r),o.create=function(e){return t(U(n,e))},o}(j);M.Axios=$,M.Cancel=w,M.CancelToken=J,M.isCancel=C,M.VERSION=k,M.all=function(t){return Promise.all(t)},M.spread=function(t){return function(e){return t.apply(null,e)}},M.isAxiosError=function(e){return"object"===t(e)&&!0===e.isAxiosError};var H=M,V=M;H.default=V;var X=H,W=Array.isArray,G="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{},K="object"==t(G)&&G&&G.Object===Object&&G,Q="object"==("undefined"==typeof self?"undefined":t(self))&&self&&self.Object===Object&&self,Y=K||Q||Function("return this")(),Z=Y.Symbol,tt=Object.prototype,et=tt.hasOwnProperty,nt=tt.toString,rt=Z?Z.toStringTag:void 0;var ot=function(t){var e=et.call(t,rt),n=t[rt];try{t[rt]=void 0;var r=!0}catch(t){}var o=nt.call(t);return r&&(e?t[rt]=n:delete t[rt]),o},it=Object.prototype.toString;var at=function(t){return it.call(t)},st=Z?Z.toStringTag:void 0;var ut=function(t){return null==t?void 0===t?"[object Undefined]":"[object Null]":st&&st in Object(t)?ot(t):at(t)};var ct=function(e){return null!=e&&"object"==t(e)};var ft=function(e){return"symbol"==t(e)||ct(e)&&"[object Symbol]"==ut(e)},lt=/\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,pt=/^\w*$/;var ht=function(e,n){if(W(e))return!1;var r=t(e);return!("number"!=r&&"symbol"!=r&&"boolean"!=r&&null!=e&&!ft(e))||(pt.test(e)||!lt.test(e)||null!=n&&e in Object(n))};var dt=function(e){var n=t(e);return null!=e&&("object"==n||"function"==n)};var vt,yt=function(t){if(!dt(t))return!1;var e=ut(t);return"[object Function]"==e||"[object GeneratorFunction]"==e||"[object AsyncFunction]"==e||"[object Proxy]"==e},mt=Y["__core-js_shared__"],gt=(vt=/[^.]+$/.exec(mt&&mt.keys&&mt.keys.IE_PROTO||""))?"Symbol(src)_1."+vt:"";var bt=function(t){return!!gt&&gt in t},_t=Function.prototype.toString;var wt=function(t){if(null!=t){try{return _t.call(t)}catch(t){}try{return t+""}catch(t){}}return""},jt=/^\[object .+?Constructor\]$/,Ot=Function.prototype,St=Object.prototype,Et=Ot.toString,Tt=St.hasOwnProperty,Nt=RegExp("^"+Et.call(Tt).replace(/[\\^$.*+?()[\]{}|]/g,"\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g,"$1.*?")+"$");var xt=function(t){return!(!dt(t)||bt(t))&&(yt(t)?Nt:jt).test(wt(t))};var At=function(t,e){return null==t?void 0:t[e]};var Ct=function(t,e){var n=At(t,e);return xt(n)?n:void 0},Pt=Ct(Object,"create");var Rt=function(){this.__data__=Pt?Pt(null):{},this.size=0};var Ut=function(t){var e=this.has(t)&&delete this.__data__[t];return this.size-=e?1:0,e},kt=Object.prototype.hasOwnProperty;var Bt=function(t){var e=this.__data__;if(Pt){var n=e[t];return"__lodash_hash_undefined__"===n?void 0:n}return kt.call(e,t)?e[t]:void 0},Lt=Object.prototype.hasOwnProperty;var Ft=function(t){var e=this.__data__;return Pt?void 0!==e[t]:Lt.call(e,t)};var qt=function(t,e){var n=this.__data__;return this.size+=this.has(t)?0:1,n[t]=Pt&&void 0===e?"__lodash_hash_undefined__":e,this};function zt(t){var e=-1,n=null==t?0:t.length;for(this.clear();++e<n;){var r=t[e];this.set(r[0],r[1])}}zt.prototype.clear=Rt,zt.prototype.delete=Ut,zt.prototype.get=Bt,zt.prototype.has=Ft,zt.prototype.set=qt;var Dt=zt;var $t=function(){this.__data__=[],this.size=0};var It=function(t,e){return t===e||t!=t&&e!=e};var Jt=function(t,e){for(var n=t.length;n--;)if(It(t[n][0],e))return n;return-1},Mt=Array.prototype.splice;var Ht=function(t){var e=this.__data__,n=Jt(e,t);return!(n<0)&&(n==e.length-1?e.pop():Mt.call(e,n,1),--this.size,!0)};var Vt=function(t){var e=this.__data__,n=Jt(e,t);return n<0?void 0:e[n][1]};var Xt=function(t){return Jt(this.__data__,t)>-1};var Wt=function(t,e){var n=this.__data__,r=Jt(n,t);return r<0?(++this.size,n.push([t,e])):n[r][1]=e,this};function Gt(t){var e=-1,n=null==t?0:t.length;for(this.clear();++e<n;){var r=t[e];this.set(r[0],r[1])}}Gt.prototype.clear=$t,Gt.prototype.delete=Ht,Gt.prototype.get=Vt,Gt.prototype.has=Xt,Gt.prototype.set=Wt;var Kt=Gt,Qt=Ct(Y,"Map");var Yt=function(){this.size=0,this.__data__={hash:new Dt,map:new(Qt||Kt),string:new Dt}};var Zt=function(e){var n=t(e);return"string"==n||"number"==n||"symbol"==n||"boolean"==n?"__proto__"!==e:null===e};var te=function(t,e){var n=t.__data__;return Zt(e)?n["string"==typeof e?"string":"hash"]:n.map};var ee=function(t){var e=te(this,t).delete(t);return this.size-=e?1:0,e};var ne=function(t){return te(this,t).get(t)};var re=function(t){return te(this,t).has(t)};var oe=function(t,e){var n=te(this,t),r=n.size;return n.set(t,e),this.size+=n.size==r?0:1,this};function ie(t){var e=-1,n=null==t?0:t.length;for(this.clear();++e<n;){var r=t[e];this.set(r[0],r[1])}}ie.prototype.clear=Yt,ie.prototype.delete=ee,ie.prototype.get=ne,ie.prototype.has=re,ie.prototype.set=oe;var ae=ie;function se(t,e){if("function"!=typeof t||null!=e&&"function"!=typeof e)throw new TypeError("Expected a function");var n=function n(){var r=arguments,o=e?e.apply(this,r):r[0],i=n.cache;if(i.has(o))return i.get(o);var a=t.apply(this,r);return n.cache=i.set(o,a)||i,a};return n.cache=new(se.Cache||ae),n}se.Cache=ae;var ue=se;var ce=/[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g,fe=/\\(\\)?/g,le=function(t){var e=ue(t,(function(t){return 500===n.size&&n.clear(),t})),n=e.cache;return e}((function(t){var e=[];return 46===t.charCodeAt(0)&&e.push(""),t.replace(ce,(function(t,n,r,o){e.push(r?o.replace(fe,"$1"):n||t)})),e}));var pe=function(t,e){for(var n=-1,r=null==t?0:t.length,o=Array(r);++n<r;)o[n]=e(t[n],n,t);return o},he=Z?Z.prototype:void 0,de=he?he.toString:void 0;var ve=function t(e){if("string"==typeof e)return e;if(W(e))return pe(e,t)+"";if(ft(e))return de?de.call(e):"";var n=e+"";return"0"==n&&1/e==-Infinity?"-0":n};var ye=function(t){return null==t?"":ve(t)};var me=function(t,e){return W(t)?t:ht(t,e)?[t]:le(ye(t))};var ge=function(t){if("string"==typeof t||ft(t))return t;var e=t+"";return"0"==e&&1/t==-Infinity?"-0":e};var be=function(t,e){for(var n=0,r=(e=me(e,t)).length;null!=t&&n<r;)t=t[ge(e[n++])];return n&&n==r?t:void 0};var _e=function(t,e,n){var r=null==t?void 0:be(t,e);return void 0===r?n:r},we=function(){try{var t=Ct(Object,"defineProperty");return t({},"",{}),t}catch(t){}}();var je=function(t,e,n){"__proto__"==e&&we?we(t,e,{configurable:!0,enumerable:!0,value:n,writable:!0}):t[e]=n},Oe=Object.prototype.hasOwnProperty;var Se=function(t,e,n){var r=t[e];Oe.call(t,e)&&It(r,n)&&(void 0!==n||e in t)||je(t,e,n)},Ee=/^(?:0|[1-9]\d*)$/;var Te=function(e,n){var r=t(e);return!!(n=null==n?9007199254740991:n)&&("number"==r||"symbol"!=r&&Ee.test(e))&&e>-1&&e%1==0&&e<n};var Ne=function(t,e,n,r){if(!dt(t))return t;for(var o=-1,i=(e=me(e,t)).length,a=i-1,s=t;null!=s&&++o<i;){var u=ge(e[o]),c=n;if("__proto__"===u||"constructor"===u||"prototype"===u)return t;if(o!=a){var f=s[u];void 0===(c=r?r(f,u,s):void 0)&&(c=dt(f)?f:Te(e[o+1])?[]:{})}Se(s,u,c),s=s[u]}return t};var xe=function(t,e,n){return null==t?t:Ne(t,e,n)};function Ae(){var t,e,n=new Promise((function(){t=arguments[0],e=arguments[1]}));return n.resolve=t,n.reject=e,n}function Ce(t){var e=Object.prototype.toString.call(t);return"[object Function]"===e||"[object AsyncFunction]"===e}function Pe(t){return!(!function(t){return"[object String]"===Object.prototype.toString.call(t)}(t)||""===t)}function Re(t,e){return n=t,"[object Object]"===Object.prototype.toString.call(n)&&(!!Pe(e)&&e in t);var n}var Ue=/\s/;var ke=function(t){for(var e=t.length;e--&&Ue.test(t.charAt(e)););return e},Be=/^\s+/;var Le=function(t){return t?t.slice(0,ke(t)+1).replace(Be,""):t},Fe=/^[-+]0x[0-9a-f]+$/i,qe=/^0b[01]+$/i,ze=/^0o[0-7]+$/i,De=parseInt;var $e=function(t){if("number"==typeof t)return t;if(ft(t))return NaN;if(dt(t)){var e="function"==typeof t.valueOf?t.valueOf():t;t=dt(e)?e+"":e}if("string"!=typeof t)return 0===t?t:+t;t=Le(t);var n=qe.test(t);return n||ze.test(t)?De(t.slice(2),n?2:8):Fe.test(t)?NaN:+t},Ie=1/0;var Je=function(t){return t?(t=$e(t))===Ie||t===-1/0?17976931348623157e292*(t<0?-1:1):t==t?t:0:0===t?t:0};var Me=function(t){var e=Je(t),n=e%1;return e==e?n?e-n:e:0};var He=function(t){return"number"==typeof t&&t==Me(t)};function Ve(t){var e=!1;return Pe(t)?e=!isNaN(Number(t)):function(t){return"[object Number]"===Object.prototype.toString.call(t)}(t)&&(e=!0),e}function Xe(t){return Ve(t)?Je(t):0}var We=Y.isFinite,Ge=Math.min;var Ke=function(t){var e=Math[t];return function(t,n){if(t=$e(t),(n=null==n?0:Ge(Me(n),292))&&We(t)){var r=(ye(t)+"e").split("e"),o=e(r[0]+"e"+(+r[1]+n));return+((r=(ye(o)+"e").split("e"))[0]+"e"+(+r[1]-n))}return e(t)}}("round");function Qe(t){if(!Ve(t))return 0;t=Xe(t);var e=Ke(t);return"0"===String(e)?0:e}function Ye(t){return!!function(t){return!!Ve(t)&&(t=Xe(t),He(t))}(t)&&Qe(t)>0}var Ze="0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz".split(""),tn=Ze.length;return function(t){var e=Ae(),n={},r=function(){var t=arguments.length>0&&void 0!==arguments[0]?arguments[0]:32,e=[];t=Ye(t)?Qe(t):32;for(var n=0;n<t;n++)e[n]=Ze[0|Math.random()*tn];return e.join("")}();function o(){function o(e,n){var r=Ae(),o={method:"POST",url:t.url,data:e};return"upload file"===n&&(o.headers={"Content-Type":"multipart/form-data"}),"download file"===n&&(o.responseType="blob"),X(o).then((function(t){r.resolve(t.data.output)})).catch((function(t){var e=_e(t,"response.data");t=e||"can not connection",r.reject(t)})),r}function a(e){var n=arguments.length>1&&void 0!==arguments[1]?arguments[1]:null,i={clientId:r,token:t.token,func:e,input:n},a="";return _e(n,"mode")&&(a=n.mode),o(i,a)}t.url||(t.url="http://localhost:8080/api"),t.token||(t.token="*"),a("getFuncs").then((function(r){if("sys"===_e(r,"sys")&&Re(r,"funcs")){var o=r.funcs;n={};for(var s=function(t){var e=o[t];xe(n,e,(function(t){return a(e,t)}))},u=0;u<o.length;u++)s(u);e.resolve(n)}else{Ce(t.error)&&t.error("no funcs"),i()}})).catch((function(e){Ce(t.error)&&t.error(e),i()}))}function i(){setTimeout((function(){Ce(t.reconn)&&t.reconn(),o()}),1e3)}return o(),e}}));
//# sourceMappingURL=w-user-client.umd.js.map
