function l(b,a,d,c){b.i.ja(b.M,a,d,c,void 0)}function m(b,a,d,c){b.i.u?l(b,a,d,c):b.i.ob()._OnMessageFromDOM({type:"event",component:b.M,handler:a,dispatchOpts:c||null,data:d,responseId:null})}function n(b,a,d){b.i.g(b.M,a,d)}function aa(b,a){for(const [d,c]of a)n(b,d,c)}window.ha=class{constructor(b,a){this.i=b;this.M=a}Ba(){}};window.fb=class{constructor(b){this.Na=b;this.Bb=5;this.I=-1;this.Y=-Infinity;this.Gb=()=>{this.I=-1;this.Y=Date.now();this.N=!0;this.Na();this.N=!1};this.Oa=this.N=!1}};
"use strict";function ba(b,a){n(b,"get-element",d=>{const c=b.s.get(d.elementId);return a(c,d)})}
window.Vb=class extends self.ha{constructor(b,a){super(b,a);this.s=new Map;this.oa=!0;aa(this,[["create",()=>{throw Error("required override");}],["destroy",d=>{d=d.elementId;const c=this.s.get(d);this.oa&&c.parentElement.removeChild(c);this.s.delete(d)}],["set-visible",d=>{this.oa&&(this.s.get(d.elementId).style.display=d.isVisible?"":"none")}],["update-position",d=>{if(this.oa){var c=this.s.get(d.elementId);c.style.left=d.left+"px";c.style.top=d.top+"px";c.style.width=d.width+"px";c.style.height=
d.height+"px";d=d.fontSize;null!==d&&(c.style.fontSize=d+"em")}}],["update-state",d=>{this.s.get(d.elementId);throw Error("required override");}],["focus",d=>{const c=this.s.get(d.elementId);d.focus?c.focus():c.blur()}],["set-css-style",d=>{this.s.get(d.elementId).style[d.prop]=d.val}],["set-attribute",d=>{this.s.get(d.elementId).setAttribute(d.name,d.val)}],["remove-attribute",d=>{this.s.get(d.elementId).removeAttribute(d.name)}]]);ba(this,d=>d)}};"use strict";
const p=/(iphone|ipod|ipad|macos|macintosh|mac os x)/i.test(navigator.userAgent),q=/android/i.test(navigator.userAgent);let t=0;function u(b){const a=document.createElement("script");a.async=!1;a.type="module";return b.Lb?new Promise(d=>{const c="c3_resolve_"+t;++t;self[c]=d;a.textContent=b.Pb+`\n\nself["${c}"]();`;document.head.appendChild(a)}):new Promise((d,c)=>{a.onload=d;a.onerror=c;a.src=b;document.head.appendChild(a)})}let v=!1,w=!1;
function ca(){if(!v){try{new Worker("blob://",{get type(){w=!0}})}catch(b){}v=!0}return w}let x=new Audio;const da={"audio/webm; codecs=opus":!!x.canPlayType("audio/webm; codecs=opus"),"audio/ogg; codecs=opus":!!x.canPlayType("audio/ogg; codecs=opus"),"audio/webm; codecs=vorbis":!!x.canPlayType("audio/webm; codecs=vorbis"),"audio/ogg; codecs=vorbis":!!x.canPlayType("audio/ogg; codecs=vorbis"),"audio/mp4":!!x.canPlayType("audio/mp4"),"audio/mpeg":!!x.canPlayType("audio/mpeg")};x=null;
async function ea(b){b=await y(b);return(new TextDecoder("utf-8")).decode(b)}function y(b){return new Promise((a,d)=>{const c=new FileReader;c.onload=e=>a(e.target.result);c.onerror=e=>d(e);c.readAsArrayBuffer(b)})}const z=[];let A=0;window.RealFile=window.File;const B=[],C=new Map,D=new Map;let fa=0;const E=[];self.runOnStartup=function(b){if("function"!==typeof b)throw Error("runOnStartup called without a function");E.push(b)};const F=new Set(["cordova","playable-ad","instant-games"]);let H=!1;
window.ka=class b{constructor(a){this.u=a.Rb;this.P=null;this.o="";this.da=a.Ob;this.U={};this.ta=this.Wa=null;this.X=[];this.j=this.wa=null;this.Ra=!1;this.O=null;this.G=-1;this.Fb=()=>this.vb();this.Va=[];this.h=a.Xa;this.sa="file"===location.protocol.substr(0,4);!this.u||"undefined"!==typeof OffscreenCanvas&&navigator.userActivation&&ca()||(this.u=!1);if("playable-ad"===this.h||"instant-games"===this.h)this.u=!1;if("cordova"===this.h&&this.u)if(q){const d=/Chrome\/(\d+)/i.exec(navigator.userAgent);
d&&90<=parseInt(d[1],10)||(this.u=!1)}else this.u=!1;this.$=this.A=null;"html5"!==this.h||window.isSecureContext||console.warn("[Construct] Warning: the browser indicates this is not a secure context. Some features may be unavailable. Use secure (HTTPS) hosting to ensure all features are available.");this.g("runtime","cordova-fetch-local-file",d=>this.rb(d));this.g("runtime","create-job-worker",()=>this.sb());"cordova"===this.h?document.addEventListener("deviceready",()=>this.Ga(a)):this.Ga(a)}bb(){return p&&
"cordova"===this.h}ia(){const a=navigator.userAgent;return p&&F.has(this.h)||navigator.standalone||/crios\/|fxios\/|edgios\//i.test(a)}$a(){return q}Da(){return q&&F.has(this.h)}async Ga(a){"macos-wkwebview"===this.h&&this.zb();if("playable-ad"===this.h){this.A=self.c3_base64files;this.$={};await this.kb();for(let c=0,e=a.J.length;c<e;++c){var d=a.J[c].toLowerCase();this.$.hasOwnProperty(d)?a.J[c]={Lb:!0,Pb:this.$[d]}:this.A.hasOwnProperty(d)&&(a.J[c]=URL.createObjectURL(this.A[d]))}}a.Nb?this.o=
a.Nb:(d=location.origin,this.o=("null"===d?"file:///":d)+location.pathname,d=this.o.lastIndexOf("/"),-1!==d&&(this.o=this.o.substr(0,d+1)));a.Tb&&(this.U=a.Tb);d=new MessageChannel;this.P=d.port1;this.P.onmessage=c=>this._OnMessageFromRuntime(c.data);window.c3_addPortMessageHandler&&window.c3_addPortMessageHandler(c=>this.ub(c));this.O=new self.cb(this);await ia(this.O);"object"===typeof window.StatusBar&&window.StatusBar.hide();if("object"===typeof window.AndroidFullScreen)try{await new Promise((c,
e)=>{window.AndroidFullScreen.immersiveMode(c,e)})}catch(c){console.error("Failed to enter Android immersive mode: ",c)}this.u?await this.qb(a,d.port2):await this.pb(a,d.port2)}ma(a){a=this.U.hasOwnProperty(a)?this.U[a]:a.endsWith("/workermain.js")&&this.U.hasOwnProperty("workermain.js")?this.U["workermain.js"]:"playable-ad"===this.h&&this.A.hasOwnProperty(a.toLowerCase())?this.A[a.toLowerCase()]:a;a instanceof Blob&&(a=URL.createObjectURL(a));return a}async ga(a,d,c){if(a.startsWith("blob:"))return new Worker(a,
c);if("cordova"===this.h&&this.sa)return a=await this.fa(c.Kb?a:this.da+a),new Worker(URL.createObjectURL(new Blob([a],{type:"application/javascript"})),c);a=new URL(a,d);if(location.origin!==a.origin){a=await fetch(a);if(!a.ok)throw Error("failed to fetch worker script");a=await a.blob();return new Worker(URL.createObjectURL(a),c)}return new Worker(a,c)}B(){return Math.max(window.innerWidth,1)}v(){return Math.max(window.innerHeight,1)}Fa(a){var d=this.o,c=location.href,e=this.B(),f=this.v(),g=window.devicePixelRatio,
h=b.K(),k=a.Zb,r=window.cr_previewImageBlobs||this.A,qa=window.cr_previewProjectFileBlobs,ra=window.cr_previewProjectFiles,sa=window.Xb||"";a=a.Xa;var ta=(new URLSearchParams(self.location.search)).has("debug"),G=this.O;return{runtimeBaseUrl:d,previewUrl:c,windowInnerWidth:e,windowInnerHeight:f,devicePixelRatio:g,isFullscreen:h,projectData:k,previewImageBlobs:r,previewProjectFileBlobs:qa,previewProjectFileSWUrls:ra,swClientId:sa,exportType:a,isDebug:ta,ife:!!self.Yb,jobScheduler:{inputPort:G.ra,outputPort:G.va,
maxNumWorkers:G.Db},supportedAudioFormats:da,opusWasmScriptUrl:window.cr_opusWasmScriptUrl||this.da+"opus.wasm.js",opusWasmBinaryUrl:window.cr_opusWasmBinaryUrl||this.da+"opus.wasm.wasm",isFileProtocol:this.sa,isiOSCordova:this.bb(),isiOSWebView:this.ia(),isFBInstantAvailable:"undefined"!==typeof self.FBInstant}}async qb(a,d){var c=this.ma(a.Sb);this.Wa=await this.ga(c,this.o,{type:"module",name:"Runtime",Kb:!0});this.j=document.createElement("canvas");this.j.style.display="none";c=this.j.transferControlToOffscreen();
document.body.appendChild(this.j);window.c3canvas=this.j;self.C3_InsertHTMLPlaceholders&&self.C3_InsertHTMLPlaceholders();let e=a.za||[],f=a.J;e=await Promise.all(e.map(g=>this.D(g)));f=await Promise.all(f.map(g=>this.D(g)));if("cordova"===this.h)for(let g=0,h=a.ea.length;g<h;++g){const k=a.ea[g],r=k[0];if(r===a.ya||"scriptsInEvents.js"===r||r.endsWith("/scriptsInEvents.js"))k[1]=await this.D(r)}this.Wa.postMessage(Object.assign(this.Fa(a),{type:"init-runtime",isInWorker:!0,messagePort:d,canvas:c,
workerDependencyScripts:e,engineScripts:f,projectScripts:a.ea,mainProjectScript:a.ya,projectScriptsStatus:self.C3_ProjectScriptsStatus}),[d,c,...ja(this.O)]);this.X=B.map(g=>new g(this));this.Ea();self.c3_callFunction=(g,h)=>{var k=this.wa;return k.i.eb(k.M,{name:g,params:h})};"preview"===this.h&&(self.goToLastErrorScript=()=>this.ja("runtime","go-to-last-error-script"))}async pb(a,d){this.j=document.createElement("canvas");this.j.style.display="none";document.body.appendChild(this.j);window.c3canvas=
this.j;self.C3_InsertHTMLPlaceholders&&self.C3_InsertHTMLPlaceholders();this.X=B.map(g=>new g(this));this.Ea();var c=a.J.map(g=>"string"===typeof g?(new URL(g,this.o)).toString():g);Array.isArray(a.za)&&c.unshift(...a.za);c=await Promise.all(c.map(g=>this.D(g)));await Promise.all(c.map(g=>u(g)));c=self.C3_ProjectScriptsStatus;const e=a.ya,f=a.ea;for(let [g,h]of f)if(h||(h=g),g===e)try{h=await this.D(h),await u(h),"preview"!==this.h||c[g]||this.Ia(g,"main script did not run to completion")}catch(k){this.Ia(g,
k)}else if("scriptsInEvents.js"===g||g.endsWith("/scriptsInEvents.js"))h=await this.D(h),await u(h);"preview"===this.h&&"object"!==typeof self.Ub.Wb?(this.W(),console.error("[C3 runtime] Failed to load JavaScript code used in events. Check all your JavaScript code has valid syntax."),alert("Failed to load JavaScript code used in events. Check all your JavaScript code has valid syntax.")):(a=Object.assign(this.Fa(a),{isInWorker:!1,messagePort:d,canvas:this.j,runOnStartupFunctions:E}),this.Ha(),this.ta=
self.C3_CreateRuntime(a),await self.C3_InitRuntime(this.ta,a))}Ia(a,d){this.W();console.error(`[Preview] Failed to load project main script (${a}): `,d);alert(`Failed to load project main script (${a}). Check all your JavaScript code has valid syntax. Press F12 and check the console for error details.`)}Ha(){this.W()}W(){const a=window.Ib;a&&(a.parentElement.removeChild(a),window.Ib=null)}async sb(){const a=await I(this.O);return{outputPort:a,transferables:[a]}}ob(){if(this.u)throw Error("not available in worker mode");
return this.ta}ja(a,d,c,e,f){this.P.postMessage({type:"event",component:a,handler:d,dispatchOpts:e||null,data:c,responseId:null},f)}eb(a,d){const c=fa++,e=new Promise((f,g)=>{D.set(c,{resolve:f,reject:g})});this.P.postMessage({type:"event",component:a,handler:"js-invoke-function",dispatchOpts:null,data:d,responseId:c},void 0);return e}_OnMessageFromRuntime(a){const d=a.type;if("event"===d)return this.tb(a);if("result"===d)this.wb(a);else if("runtime-ready"===d)this.xb();else if("alert-error"===d)this.W(),
alert(a.message);else if("creating-runtime"===d)this.Ha();else throw Error(`unknown message '${d}'`);}tb(a){const d=a.component,c=a.handler,e=a.data,f=a.responseId;if(a=C.get(d))if(a=a.get(c)){var g=null;try{g=a(e)}catch(h){console.error(`Exception in '${d}' handler '${c}':`,h);null!==f&&this.V(f,!1,""+h);return}if(null===f)return g;g&&g.then?g.then(h=>this.V(f,!0,h)).catch(h=>{console.error(`Rejection from '${d}' handler '${c}':`,h);this.V(f,!1,""+h)}):this.V(f,!0,g)}else console.warn(`[DOM] No handler '${c}' for component '${d}'`);
else console.warn(`[DOM] No event handlers for component '${d}'`)}V(a,d,c){let e;c&&c.transferables&&(e=c.transferables);this.P.postMessage({type:"result",responseId:a,isOk:d,result:c},e)}wb(a){const d=a.responseId,c=a.isOk;a=a.result;const e=D.get(d);c?e.resolve(a):e.reject(a);D.delete(d)}g(a,d,c){let e=C.get(a);e||(e=new Map,C.set(a,e));if(e.has(d))throw Error(`[DOM] Component '${a}' already has handler '${d}'`);e.set(d,c)}static Aa(a){if(B.includes(a))throw Error("DOM handler already added");B.push(a)}Ea(){for(const a of this.X)if("runtime"===
a.M){this.wa=a;return}throw Error("cannot find runtime DOM handler");}ub(a){this.ja("debugger","message",a)}xb(){for(const a of this.X)a.Ba()}static K(){return!!(document.fullscreenElement||document.webkitFullscreenElement||document.mozFullScreenElement||H)}static Ka(a){H=!!a}Ja(){-1===this.G&&this.Va.length&&(this.G=requestAnimationFrame(this.Fb))}ib(){-1!==this.G&&(cancelAnimationFrame(this.G),this.G=-1)}vb(){this.G=-1;for(const a of this.Va)a();this.Ja()}na(){this.wa.na()}gb(){this.Ra=!0}Za(a){return/^(?:[a-z\-]+:)?\/\//.test(a)||
"data:"===a.substr(0,5)||"blob:"===a.substr(0,5)}ab(a){return!this.Za(a)}async D(a){return"cordova"===this.h&&(a.startsWith("file:")||this.sa&&this.ab(a))?(a.startsWith(this.o)&&(a=a.substr(this.o.length)),a=await this.fa(a),URL.createObjectURL(new Blob([a],{type:"application/javascript"}))):a}async rb(a){const d=a.filename;switch(a.as){case "text":return await this.Ya(d);case "buffer":return await this.fa(d);default:throw Error("unsupported type");}}Ca(a){const d=window.cordova.file.applicationDirectory+
"www/"+a.toLowerCase();return new Promise((c,e)=>{window.resolveLocalFileSystemURL(d,f=>{f.file(c,e)},e)})}async Ya(a){a=await this.Ca(a);return await ea(a)}la(){if(z.length&&!(8<=A)){A++;var a=z.shift();this.lb(a.filename,a.Qb,a.Jb)}}fa(a){return new Promise((d,c)=>{z.push({filename:a,Qb:e=>{A--;this.la();d(e)},Jb:e=>{A--;this.la();c(e)}});this.la()})}async lb(a,d,c){try{const e=await this.Ca(a),f=await y(e);d(f)}catch(e){c(e)}}zb(){var a={type:"ready"};if("windows-webview2"===this.h)window.chrome.webview.postMessage(JSON.stringify(a));
else if("macos-wkwebview"===this.h)window.webkit.messageHandlers.C3Wrapper.postMessage(JSON.stringify(a));else throw Error("cannot send wrapper message");}async kb(){const a=[];for(const [d,c]of Object.entries(this.A))a.push(this.jb(d,c));await Promise.all(a)}async jb(a,d){if("object"===typeof d)this.A[a]=new Blob([d.str],{type:d.type}),this.$[a]=d.str;else{let c=await this.nb(d);c||(c=this.mb(d));this.A[a]=c}}async nb(a){try{return await (await fetch(a)).blob()}catch(d){return console.warn("Failed to fetch a data: URI. Falling back to a slower workaround. This is probably because the Content Security Policy unnecessarily blocked it. Allow data: URIs in your CSP to avoid this.",
d),null}}mb(a){a=this.yb(a);return this.hb(a.data,a.Mb)}yb(a){var d=a.indexOf(",");if(0>d)throw new URIError("expected comma in data: uri");var c=a.substring(d+1);d=a.substring(5,d).split(";");a=d[0]||"";const e=d[2];c="base64"===d[1]||"base64"===e?atob(c):decodeURIComponent(c);return{Mb:a,data:c}}hb(a,d){var c=a.length;let e=c>>2,f=new Uint8Array(c),g=new Uint32Array(f.buffer,0,e),h,k;for(k=h=0;h<e;++h)g[h]=a.charCodeAt(k++)|a.charCodeAt(k++)<<8|a.charCodeAt(k++)<<16|a.charCodeAt(k++)<<24;for(c&=
3;c--;)f[k]=a.charCodeAt(k),++k;return new Blob([f],{type:d})}};"use strict";const J=self.ka;function K(b){return b.sourceCapabilities&&b.sourceCapabilities.firesTouchEvents||b.originalEvent&&b.originalEvent.sourceCapabilities&&b.originalEvent.sourceCapabilities.firesTouchEvents}const la=new Map([["OSLeft","MetaLeft"],["OSRight","MetaRight"]]),L={dispatchRuntimeEvent:!0,dispatchUserScriptEvent:!0},ma={dispatchUserScriptEvent:!0},M={dispatchRuntimeEvent:!0};
function na(b){return new Promise((a,d)=>{const c=document.createElement("link");c.onload=()=>a(c);c.onerror=e=>d(e);c.rel="stylesheet";c.href=b;document.head.appendChild(c)})}function oa(b){return new Promise((a,d)=>{const c=new Image;c.onload=()=>a(c);c.onerror=e=>d(e);c.src=b})}async function N(b){b=URL.createObjectURL(b);try{return await oa(b)}finally{URL.revokeObjectURL(b)}}
function pa(b){return new Promise((a,d)=>{let c=new FileReader;c.onload=e=>a(e.target.result);c.onerror=e=>d(e);c.readAsText(b)})}
async function ua(b,a,d){if(!/firefox/i.test(navigator.userAgent))return await N(b);var c=await pa(b);c=(new DOMParser).parseFromString(c,"image/svg+xml");const e=c.documentElement;if(e.hasAttribute("width")&&e.hasAttribute("height")){const f=e.getAttribute("width"),g=e.getAttribute("height");if(!f.includes("%")&&!g.includes("%"))return await N(b)}e.setAttribute("width",a+"px");e.setAttribute("height",d+"px");c=(new XMLSerializer).serializeToString(c);b=new Blob([c],{type:"image/svg+xml"});return await N(b)}
function O(b){do{if(b.parentNode&&b.hasAttribute("contenteditable"))return!0;b=b.parentNode}while(b);return!1}const va=new Set(["input","textarea","datalist","select"]),wa=new Set(["canvas","body","html"]);function P(b){wa.has(b.target.tagName.toLowerCase())&&b.preventDefault()}function xa(b){(b.metaKey||b.ctrlKey)&&b.preventDefault()}
self.C3_GetSvgImageSize=async function(b){b=await N(b);if(0<b.width&&0<b.height)return[b.width,b.height];b.style.position="absolute";b.style.left="0px";b.style.top="0px";b.style.visibility="hidden";document.body.appendChild(b);const a=b.getBoundingClientRect();document.body.removeChild(b);return[a.width,a.height]};self.C3_RasterSvgImageBlob=async function(b,a,d,c,e){b=await ua(b,a,d);const f=document.createElement("canvas");f.width=c;f.height=e;f.getContext("2d").drawImage(b,0,0,a,d);return f};
let Q=!1;document.addEventListener("pause",()=>Q=!0);document.addEventListener("resume",()=>Q=!1);async function ya(b){var a=b.imageBitmapOpts;b=await self.C3_RasterSvgImageBlob(b.blob,b.imageWidth,b.imageHeight,b.surfaceWidth,b.surfaceHeight);a=a?await createImageBitmap(b,a):await createImageBitmap(b);return{imageBitmap:a,transferables:[a]}}async function za(b){return await self.C3_GetSvgImageSize(b.blob)}
function Aa(b){window.c3_postToMessagePort&&(b.from="runtime",window.c3_postToMessagePort(b))}function Ba(b){self.setTimeout(()=>{b.Pa=!0},1E3);"cordova"===b.i.h?(document.addEventListener("pause",()=>R(b,!0)),document.addEventListener("resume",()=>R(b,!1))):document.addEventListener("visibilitychange",()=>R(b,document.hidden));return{isSuspended:!(!document.hidden&&!Q)}}
function Ca(b){b.Ma||(b.Ma=!0,window.addEventListener("deviceorientation",a=>{b.l||l(b,"deviceorientation",{absolute:!!a.absolute,alpha:a.alpha||0,beta:a.beta||0,gamma:a.gamma||0,timeStamp:a.timeStamp,webkitCompassHeading:a.webkitCompassHeading,webkitCompassAccuracy:a.webkitCompassAccuracy},L)}),window.addEventListener("deviceorientationabsolute",a=>{b.l||l(b,"deviceorientationabsolute",{absolute:!!a.absolute,alpha:a.alpha||0,beta:a.beta||0,gamma:a.gamma||0,timeStamp:a.timeStamp},L)}))}
function Da(b){b.La||(b.La=!0,window.addEventListener("devicemotion",a=>{if(!b.l){var d=null,c=a.acceleration;c&&(d={x:c.x||0,y:c.y||0,z:c.z||0});c=null;var e=a.accelerationIncludingGravity;e&&(c={x:e.x||0,y:e.y||0,z:e.z||0});e=null;var f=a.rotationRate;f&&(e={alpha:f.alpha||0,beta:f.beta||0,gamma:f.gamma||0});l(b,"devicemotion",{acceleration:d,accelerationIncludingGravity:c,rotationRate:e,interval:a.interval,timeStamp:a.timeStamp},L)}}))}async function Ea(b){await na(b.url)}
function Fa(b,a){b.Qa=a.message;-1===b.qa&&(b.qa=setTimeout(()=>{b.qa=-1;const d=document.getElementById("exportToVideoMessage");d&&(d.textContent=b.Qa)},250))}function S(b){if(!b.l){var a=J.K();a&&"any"!==b.xa&&Ga(b);l(b,"fullscreenchange",{isFullscreen:a,innerWidth:b.B(),innerHeight:b.v()})}}function T(b,a){console.warn("[Construct] Fullscreen request failed: ",a);l(b,"fullscreenerror",{isFullscreen:J.K(),innerWidth:b.B(),innerHeight:b.v()})}
function R(b,a){a?b.i.ib():b.i.Ja();l(b,"visibilitychange",{hidden:a})}function Ha(b,a,d){"Backspace"===d.key&&P(d);if(!b.l){var c=la.get(d.code)||d.code;m(b,a,{code:c,key:d.key,which:d.which,repeat:d.repeat,altKey:d.altKey,ctrlKey:d.ctrlKey,metaKey:d.metaKey,shiftKey:d.shiftKey,timeStamp:d.timeStamp},L)}}
function U(b,a,d,c){b.l||K(d)||m(b,a,{button:d.button,buttons:d.buttons,clientX:d.clientX,clientY:d.clientY+b.m,pageX:d.pageX,pageY:d.pageY+b.m,movementX:d.movementX||0,movementY:d.movementY||0,timeStamp:d.timeStamp},c)}function V(b){window!==window.top&&window.focus();Ia(b.target)&&document.activeElement&&!Ia(document.activeElement)&&document.activeElement.blur()}
function W(b,a,d){if(!b.l){if(b.S&&"pointermove"!==a){var c=b.S;c.N||(-1!==c.I&&(self.clearTimeout(c.I),c.I=-1),c.Y=Date.now())}c=0;"mouse"===d.pointerType&&(c=b.R);m(b,a,{pointerId:d.pointerId,pointerType:d.pointerType,button:d.button,buttons:d.buttons,lastButtons:c,clientX:d.clientX,clientY:d.clientY+b.m,pageX:d.pageX,pageY:d.pageY+b.m,movementX:(d.movementX||0)+b.aa,movementY:(d.movementY||0)+b.ba,width:d.width||0,height:d.height||0,pressure:d.pressure||0,tangentialPressure:d.tangentialPressure||
0,tiltX:d.tiltX||0,tiltY:d.tiltY||0,twist:d.twist||0,timeStamp:d.timeStamp},L);b.aa=0;b.ba=0;"mouse"===d.pointerType&&(c="mousemove","pointerdown"===a?c="mousedown":"pointerup"===a&&(c="mouseup"),U(b,c,d,ma),b.R=d.buttons)}}
function X(b,a,d){if(!b.l&&!K(d)){var c=b.R;"pointerdown"===a&&0!==c?a="pointermove":"pointerup"===a&&0!==d.buttons&&(a="pointermove");m(b,a,{pointerId:1,pointerType:"mouse",button:d.button,buttons:d.buttons,lastButtons:c,clientX:d.clientX,clientY:d.clientY+b.m,pageX:d.pageX,pageY:d.pageY+b.m,movementX:d.movementX||0,movementY:d.movementY||0,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,timeStamp:d.timeStamp},L);b.R=d.buttons;U(b,d.type,d,ma)}}
function Y(b,a,d){if(!b.l)for(let c=0,e=d.changedTouches.length;c<e;++c){const f=d.changedTouches[c];m(b,a,{pointerId:f.identifier,pointerType:"touch",button:0,buttons:0,lastButtons:0,clientX:f.clientX,clientY:f.clientY+b.m,pageX:f.pageX,pageY:f.pageY+b.m,movementX:d.movementX||0,movementY:d.movementY||0,width:2*(f.radiusX||f.webkitRadiusX||0),height:2*(f.radiusY||f.webkitRadiusY||0),pressure:f.force||f.webkitForce||0,tangentialPressure:0,tiltX:0,tiltY:0,twist:f.rotationAngle||0,timeStamp:d.timeStamp},
L)}}function Z(b,a,d){document.body.style.transform="";b.m=0;if(0<d){var c=document.activeElement;c&&(c=c.getBoundingClientRect(),a=(c.top+c.bottom)/2-(a-d)/2,a>d&&(a=d),0>a&&(a=0),0<a&&(document.body.style.transform=`translateY(${-a}px)`,b.m=a))}}function Ja(b,a,d,c){const e=b.B(),f=b.v();b.H=-1;e!=a||f!=d?l(b,"window-resize",{innerWidth:e,innerHeight:f,devicePixelRatio:window.devicePixelRatio,isFullscreen:J.K()}):10>c&&Ka(b,e,f,c+1)}
function Ka(b,a,d,c){-1!==b.H&&clearTimeout(b.H);b.H=setTimeout(()=>Ja(b,a,d,c),48)}
function Ga(b){b=b.xa;if(screen.orientation&&screen.orientation.lock)screen.orientation.lock(b).catch(a=>console.warn("[Construct] Failed to lock orientation: ",a));else try{let a=!1;screen.lockOrientation?a=screen.lockOrientation(b):screen.webkitLockOrientation?a=screen.webkitLockOrientation(b):screen.mozLockOrientation?a=screen.mozLockOrientation(b):screen.msLockOrientation&&(a=screen.msLockOrientation(b));a||console.warn("[Construct] Failed to lock orientation")}catch(a){console.warn("[Construct] Failed to lock orientation: ",a)}}
function Ia(b){return!b||b===document||b===window||b===document.body||"canvas"===b.tagName.toLowerCase()}
J.Aa(class extends self.ha{constructor(b){super(b,"runtime");this.Sa=!0;this.H=-1;this.xa="any";this.La=this.Ma=!1;this.C=null;this.l=!1;this.Qa="";this.qa=-1;this.F=this.S=null;this.ba=this.aa=0;this.Pa=!1;this.Ua=b.B();this.Z=b.v();this.m=this.T=0;b.g("canvas","update-size",c=>{var e=this.i;e.Ra||(e=e.j,e.style.width=c.styleWidth+"px",e.style.height=c.styleHeight+"px",e.style.marginLeft=c.marginLeft+"px",e.style.marginTop=c.marginTop+"px",this.Sa&&(e.style.display="",this.Sa=!1))});b.g("runtime",
"invoke-download",c=>{const e=c.url;c=c.filename;const f=document.createElement("a"),g=document.body;f.textContent=c;f.href=e;f.download=c;g.appendChild(f);f.click();g.removeChild(f)});b.g("runtime","raster-svg-image",c=>ya(c));b.g("runtime","get-svg-image-size",c=>za(c));b.g("runtime","set-target-orientation",c=>{this.xa=c.targetOrientation});b.g("runtime","register-sw",()=>{window.C3_RegisterSW&&window.C3_RegisterSW()});b.g("runtime","post-to-debugger",c=>Aa(c));b.g("runtime","go-to-script",c=>
Aa(c));b.g("runtime","before-start-ticking",()=>Ba(this));b.g("runtime","debug-highlight",c=>{if(c.show){this.C||(this.C=document.createElement("div"),this.C.id="inspectOutline",document.body.appendChild(this.C));var e=this.C;e.style.display="";e.style.left=c.left-1+"px";e.style.top=c.top-1+"px";e.style.width=c.width+2+"px";e.style.height=c.height+2+"px";e.textContent=c.name}else this.C&&(this.C.style.display="none")});b.g("runtime","enable-device-orientation",()=>Ca(this));b.g("runtime","enable-device-motion",
()=>Da(this));b.g("runtime","add-stylesheet",c=>Ea(c));b.g("runtime","alert",c=>{alert(c.message)});b.g("runtime","hide-cordova-splash",()=>{navigator.splashscreen&&navigator.splashscreen.hide&&navigator.splashscreen.hide()});b.g("runtime","set-exporting-to-video",c=>{this.l=!0;const e=document.createElement("h1");e.id="exportToVideoMessage";e.textContent=c.message;document.body.prepend(e);document.body.classList.add("exportingToVideo");this.i.j.style.display="";this.i.gb()});b.g("runtime","export-to-video-progress",
c=>Fa(this,c));b.g("runtime","exported-to-video",c=>{window.Hb({type:"exported-video",blob:c.blob,time:c.time})});b.g("runtime","exported-to-image-sequence",c=>{window.Hb({type:"exported-image-sequence",blobArr:c.blobArr,time:c.time,gif:c.gif})});const a=new Set(["input","textarea","datalist"]);window.addEventListener("contextmenu",c=>{const e=c.target;a.has(e.tagName.toLowerCase())||O(e)||c.preventDefault()});const d=b.j;window.addEventListener("selectstart",P);window.addEventListener("gesturehold",
P);d.addEventListener("selectstart",P);d.addEventListener("gesturehold",P);window.addEventListener("touchstart",P,{passive:!1});"undefined"!==typeof PointerEvent?(window.addEventListener("pointerdown",P,{passive:!1}),d.addEventListener("pointerdown",P)):d.addEventListener("touchstart",P);this.R=0;window.addEventListener("mousedown",c=>{1===c.button&&c.preventDefault()});window.addEventListener("mousewheel",xa,{passive:!1});window.addEventListener("wheel",xa,{passive:!1});window.addEventListener("resize",
()=>{a:{if(!this.l){var c=this.B();var e=this.v();if(this.i.Da()){if(this.Pa){if(this.Ua===c&&e<this.Z){this.T=this.Z-e;Z(this,this.Z,this.T);c=void 0;break a}0<this.T&&(this.T=0,Z(this,e,this.T))}this.Ua=c;this.Z=e}l(this,"window-resize",{innerWidth:c,innerHeight:e,devicePixelRatio:window.devicePixelRatio,isFullscreen:J.K()});this.i.ia()&&(-1!==this.H&&clearTimeout(this.H),Ja(this,c,e,0))}c=void 0}return c});window.addEventListener("fullscreenchange",()=>S(this));window.addEventListener("webkitfullscreenchange",
()=>S(this));window.addEventListener("mozfullscreenchange",()=>S(this));window.addEventListener("fullscreenerror",c=>T(this,c));window.addEventListener("webkitfullscreenerror",c=>T(this,c));window.addEventListener("mozfullscreenerror",c=>T(this,c));if(b.ia())if(window.visualViewport){let c=Infinity;window.visualViewport.addEventListener("resize",()=>{const e=window.visualViewport.height;e>c&&(document.scrollingElement.scrollTop=0);c=e})}else window.addEventListener("focusout",()=>{{const f=document.activeElement;
if(f){var c=f.tagName.toLowerCase();var e=new Set("email number password search tel text url".split(" "));c="textarea"===c?!0:"input"===c?e.has(f.type.toLowerCase()||"text"):O(f)}else c=!1}c||(document.scrollingElement.scrollTop=0)});self.C3WrapperOnMessage=c=>{"entered-fullscreen"===c?(J.Ka(!0),S(this)):"exited-fullscreen"===c?(J.Ka(!1),S(this)):console.warn("Unknown wrapper message: ",c)};this.ua=new Set;this.Eb=new WeakSet;this.Cb=!1}Ba(){window.addEventListener("focus",()=>{l(this,"window-focus",
null,M)});window.addEventListener("blur",()=>{try{var a=window.parent&&window.parent.document.hasFocus()}catch(d){a=!1}l(this,"window-blur",{parentHasFocus:a},M);this.R=0});window.addEventListener("focusin",a=>{a=a.target;(va.has(a.tagName.toLowerCase())||O(a))&&l(this,"keyboard-blur",null,M)});window.addEventListener("keydown",a=>Ha(this,"keydown",a));window.addEventListener("keyup",a=>Ha(this,"keyup",a));window.addEventListener("dblclick",a=>U(this,"dblclick",a,L));window.addEventListener("wheel",
a=>{this.l||l(this,"wheel",{clientX:a.clientX,clientY:a.clientY+this.m,pageX:a.pageX,pageY:a.pageY+this.m,deltaX:a.deltaX,deltaY:a.deltaY,deltaZ:a.deltaZ,deltaMode:a.deltaMode,timeStamp:a.timeStamp},L)});"undefined"!==typeof PointerEvent?(window.addEventListener("pointerdown",a=>{V(a);W(this,"pointerdown",a)}),this.i.u&&"undefined"!==typeof window.onpointerrawupdate&&self===self.top?(this.S=new self.fb(()=>{W(this,"pointermove",this.F);this.F=null}),this.S.Oa=!0,window.addEventListener("pointerrawupdate",
a=>{this.F&&(this.aa+=this.F.movementX||0,this.ba+=this.F.movementY||0);this.F=a;a=this.S;if(-1===a.I){var d=Date.now(),c=d-a.Y,e=a.Bb;c>=e&&a.Oa?(a.Y=d,a.N=!0,a.Na(),a.N=!1):a.I=self.setTimeout(a.Gb,Math.max(e-c,4))}})):window.addEventListener("pointermove",a=>W(this,"pointermove",a)),window.addEventListener("pointerup",a=>W(this,"pointerup",a)),window.addEventListener("pointercancel",a=>W(this,"pointercancel",a))):(window.addEventListener("mousedown",a=>{V(a);X(this,"pointerdown",a)}),window.addEventListener("mousemove",
a=>X(this,"pointermove",a)),window.addEventListener("mouseup",a=>X(this,"pointerup",a)),window.addEventListener("touchstart",a=>{V(a);Y(this,"pointerdown",a)}),window.addEventListener("touchmove",a=>Y(this,"pointermove",a)),window.addEventListener("touchend",a=>Y(this,"pointerup",a)),window.addEventListener("touchcancel",a=>Y(this,"pointercancel",a)));const b=()=>this.na();window.addEventListener("pointerup",b,!0);window.addEventListener("touchend",b,!0);window.addEventListener("click",b,!0);window.addEventListener("keydown",
b,!0);window.addEventListener("gamepadconnected",b,!0);this.i.$a()&&!this.i.Da()&&navigator.virtualKeyboard&&(navigator.virtualKeyboard.overlaysContent=!0,navigator.virtualKeyboard.addEventListener("geometrychange",()=>{Z(this,this.v(),navigator.virtualKeyboard.boundingRect.height)}))}B(){return this.i.B()}v(){return this.i.v()}na(){var b=[...this.ua];this.ua.clear();if(!this.Cb)for(const a of b)(b=a.play())&&b.catch(()=>{this.Eb.has(a)||this.ua.add(a)})}});"use strict";
async function ia(b){if(b.Ab)throw Error("already initialised");b.Ab=!0;var a=b.ca.ma("dispatchworker.js");b.pa=await b.ca.ga(a,b.L,{name:"DispatchWorker"});a=new MessageChannel;b.ra=a.port1;b.pa.postMessage({type:"_init","in-port":a.port2},[a.port2]);b.va=await I(b)}function ja(b){return[b.ra,b.va]}
async function I(b){const a=b.Ta.length;var d=b.ca.ma("jobworker.js");d=await b.ca.ga(d,b.L,{name:"JobWorker"+a});const c=new MessageChannel,e=new MessageChannel;b.pa.postMessage({type:"_addJobWorker",port:c.port1},[c.port1]);d.postMessage({type:"init",number:a,"dispatch-port":c.port2,"output-port":e.port2},[c.port2,e.port2]);b.Ta.push(d);return e.port1}
self.cb=class{constructor(b){this.ca=b;this.L=b.o;this.L="preview"===b.h?this.L+"workers/":this.L+b.da;this.Db=Math.min(navigator.hardwareConcurrency||2,16);this.pa=null;this.Ta=[];this.va=this.ra=null}};"use strict";window.C3_IsSupported&&(window.c3_runtimeInterface=new self.ka({Rb:!0,Sb:"workermain.js",J:["scripts/c3runtime.js"],ea:[],ya:"",Ob:"scripts/",za:[],Xa:"html5"}));"use strict";
async function La(b,a){a=a.type;let d=!0;0===a?d=await Ma():1===a&&(d=await Na());l(b,"permission-result",{type:a,result:d})}async function Ma(){if(!self.DeviceOrientationEvent||!self.DeviceOrientationEvent.requestPermission)return!0;try{return"granted"===await self.DeviceOrientationEvent.requestPermission()}catch(b){return console.warn("[Touch] Failed to request orientation permission: ",b),!1}}
async function Na(){if(!self.DeviceMotionEvent||!self.DeviceMotionEvent.requestPermission)return!0;try{return"granted"===await self.DeviceMotionEvent.requestPermission()}catch(b){return console.warn("[Touch] Failed to request motion permission: ",b),!1}}self.ka.Aa(class extends self.ha{constructor(b){super(b,"touch");n(this,"request-permission",a=>La(this,a))}});
