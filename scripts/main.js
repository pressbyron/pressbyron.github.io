'use strict';window.DOMHandler=class{constructor(f,h){this._iRuntime=f;this._componentId=h;this._hasTickCallback=!1;this._tickCallback=()=>this.Tick()}Attach(){}PostToRuntime(f,h,k,m){this._iRuntime.PostToRuntimeComponent(this._componentId,f,h,k,m)}PostToRuntimeAsync(f,h,k,m){return this._iRuntime.PostToRuntimeComponentAsync(this._componentId,f,h,k,m)}_PostToRuntimeMaybeSync(f,h,k){this._iRuntime.UsesWorker()?this.PostToRuntime(f,h,k):this._iRuntime._GetLocalRuntime()._OnMessageFromDOM({type:"event",
component:this._componentId,handler:f,dispatchOpts:k||null,data:h,responseId:null})}AddRuntimeMessageHandler(f,h){this._iRuntime.AddRuntimeComponentMessageHandler(this._componentId,f,h)}AddRuntimeMessageHandlers(f){for(const [h,k]of f)this.AddRuntimeMessageHandler(h,k)}GetRuntimeInterface(){return this._iRuntime}GetComponentID(){return this._componentId}_StartTicking(){this._hasTickCallback||(this._iRuntime._AddRAFCallback(this._tickCallback),this._hasTickCallback=!0)}_StopTicking(){this._hasTickCallback&&
(this._iRuntime._RemoveRAFCallback(this._tickCallback),this._hasTickCallback=!1)}Tick(){}};
window.RateLimiter=class{constructor(f,h){this._callback=f;this._interval=h;this._timerId=-1;this._lastCallTime=-Infinity;this._timerCallFunc=()=>this._OnTimer();this._canRunImmediate=this._ignoreReset=!1}SetCanRunImmediate(f){this._canRunImmediate=!!f}Call(){if(-1===this._timerId){var f=Date.now(),h=f-this._lastCallTime,k=this._interval;h>=k&&this._canRunImmediate?(this._lastCallTime=f,this._RunCallback()):this._timerId=self.setTimeout(this._timerCallFunc,Math.max(k-h,4))}}_RunCallback(){this._ignoreReset=
!0;this._callback();this._ignoreReset=!1}Reset(){this._ignoreReset||(this._CancelTimer(),this._lastCallTime=Date.now())}_OnTimer(){this._timerId=-1;this._lastCallTime=Date.now();this._RunCallback()}_CancelTimer(){-1!==this._timerId&&(self.clearTimeout(this._timerId),this._timerId=-1)}Release(){this._CancelTimer();this._timerCallFunc=this._callback=null}};"use strict";
window.DOMElementHandler=class extends self.DOMHandler{constructor(f,h){super(f,h);this._elementMap=new Map;this._autoAttach=!0;this.AddRuntimeMessageHandlers([["create",k=>this._OnCreate(k)],["destroy",k=>this._OnDestroy(k)],["set-visible",k=>this._OnSetVisible(k)],["update-position",k=>this._OnUpdatePosition(k)],["update-state",k=>this._OnUpdateState(k)],["focus",k=>this._OnSetFocus(k)],["set-css-style",k=>this._OnSetCssStyle(k)],["set-attribute",k=>this._OnSetAttribute(k)],["remove-attribute",
k=>this._OnRemoveAttribute(k)]]);this.AddDOMElementMessageHandler("get-element",k=>k)}SetAutoAttach(f){this._autoAttach=!!f}AddDOMElementMessageHandler(f,h){this.AddRuntimeMessageHandler(f,k=>{const m=this._elementMap.get(k.elementId);return h(m,k)})}_OnCreate(f){const h=f.elementId,k=this.CreateElement(h,f);this._elementMap.set(h,k);f.isVisible||(k.style.display="none");f=this._GetFocusElement(k);f.addEventListener("focus",m=>this._OnFocus(h));f.addEventListener("blur",m=>this._OnBlur(h));this._autoAttach&&
document.body.appendChild(k)}CreateElement(f,h){throw Error("required override");}DestroyElement(f){}_OnDestroy(f){f=f.elementId;const h=this._elementMap.get(f);this.DestroyElement(h);this._autoAttach&&h.parentElement.removeChild(h);this._elementMap.delete(f)}PostToRuntimeElement(f,h,k){k||(k={});k.elementId=h;this.PostToRuntime(f,k)}_PostToRuntimeElementMaybeSync(f,h,k){k||(k={});k.elementId=h;this._PostToRuntimeMaybeSync(f,k)}_OnSetVisible(f){this._autoAttach&&(this._elementMap.get(f.elementId).style.display=
f.isVisible?"":"none")}_OnUpdatePosition(f){if(this._autoAttach){var h=this._elementMap.get(f.elementId);h.style.left=f.left+"px";h.style.top=f.top+"px";h.style.width=f.width+"px";h.style.height=f.height+"px";f=f.fontSize;null!==f&&(h.style.fontSize=f+"em")}}_OnUpdateState(f){const h=this._elementMap.get(f.elementId);this.UpdateState(h,f)}UpdateState(f,h){throw Error("required override");}_GetFocusElement(f){return f}_OnFocus(f){this.PostToRuntimeElement("elem-focused",f)}_OnBlur(f){this.PostToRuntimeElement("elem-blurred",
f)}_OnSetFocus(f){const h=this._GetFocusElement(this._elementMap.get(f.elementId));f.focus?h.focus():h.blur()}_OnSetCssStyle(f){this._elementMap.get(f.elementId).style[f.prop]=f.val}_OnSetAttribute(f){this._elementMap.get(f.elementId).setAttribute(f.name,f.val)}_OnRemoveAttribute(f){this._elementMap.get(f.elementId).removeAttribute(f.name)}GetElementById(f){return this._elementMap.get(f)}};"use strict";
{const f=/(iphone|ipod|ipad|macos|macintosh|mac os x)/i.test(navigator.userAgent);function h(n){if(n.isStringSrc){const c=document.createElement("script");c.async=!1;c.textContent=n.str;document.head.appendChild(c)}else return new Promise((c,d)=>{const a=document.createElement("script");a.onload=c;a.onerror=d;a.async=!1;a.src=n;document.head.appendChild(a)})}let k=new Audio;const m={"audio/webm; codecs=opus":!!k.canPlayType("audio/webm; codecs=opus"),"audio/ogg; codecs=opus":!!k.canPlayType("audio/ogg; codecs=opus"),
"audio/webm; codecs=vorbis":!!k.canPlayType("audio/webm; codecs=vorbis"),"audio/ogg; codecs=vorbis":!!k.canPlayType("audio/ogg; codecs=vorbis"),"audio/mp4":!!k.canPlayType("audio/mp4"),"audio/mpeg":!!k.canPlayType("audio/mpeg")};k=null;async function t(n){n=await z(n);return(new TextDecoder("utf-8")).decode(n)}function z(n){return new Promise((c,d)=>{const a=new FileReader;a.onload=b=>c(b.target.result);a.onerror=b=>d(b);a.readAsArrayBuffer(n)})}const v=[];let u=0;window.RealFile=window.File;const r=
[],w=new Map,x=new Map;let A=0;const B=[];self.runOnStartup=function(n){if("function"!==typeof n)throw Error("runOnStartup called without a function");B.push(n)};const q=new Set(["cordova","playable-ad","instant-games"]);function y(n){return q.has(n)}window.RuntimeInterface=class n{constructor(c){this._useWorker=c.useWorker;this._messageChannelPort=null;this._baseUrl="";this._scriptFolder=c.scriptFolder;this._workerScriptBlobURLs={};this._localRuntime=this._worker=null;this._domHandlers=[];this._jobScheduler=
this._canvas=this._runtimeDomHandler=null;this._rafId=-1;this._rafFunc=()=>this._OnRAFCallback();this._rafCallbacks=[];this._exportType=c.exportType;!this._useWorker||"undefined"!==typeof OffscreenCanvas&&navigator.userActivation||(this._useWorker=!1);y(this._exportType)&&this._useWorker&&(console.warn("[C3 runtime] Worker mode is enabled and supported, but is disabled in WebViews due to crbug.com/923007. Reverting to DOM mode."),this._useWorker=!1);this._transferablesBroken=!1;this._localFileStrings=
this._localFileBlobs=null;"html5"!==this._exportType&&"playable-ad"!==this._exportType||"file"!==location.protocol.substr(0,4)||alert("Exported games won't work until you upload them. (When running on the file: protocol, browsers block many features from working for security reasons.)");this.AddRuntimeComponentMessageHandler("runtime","cordova-fetch-local-file",d=>this._OnCordovaFetchLocalFile(d));this.AddRuntimeComponentMessageHandler("runtime","create-job-worker",d=>this._OnCreateJobWorker(d));
"cordova"===this._exportType?document.addEventListener("deviceready",()=>this._Init(c)):this._Init(c)}Release(){this._CancelAnimationFrame();this._messageChannelPort&&(this._messageChannelPort=this._messageChannelPort.onmessage=null);this._worker&&(this._worker.terminate(),this._worker=null);this._localRuntime&&(this._localRuntime.Release(),this._localRuntime=null);this._canvas&&(this._canvas.parentElement.removeChild(this._canvas),this._canvas=null)}GetCanvas(){return this._canvas}GetBaseURL(){return this._baseUrl}UsesWorker(){return this._useWorker}GetExportType(){return this._exportType}IsiOSCordova(){return f&&
"cordova"===this._exportType}IsiOSWebView(){return f&&y(this._exportType)||navigator.standalone}async _Init(c){if("playable-ad"===this._exportType){this._localFileBlobs=self.c3_base64files;this._localFileStrings={};await this._ConvertDataUrisToBlobs();for(let a=0,b=c.engineScripts.length;a<b;++a){var d=c.engineScripts[a].toLowerCase();this._localFileStrings.hasOwnProperty(d)?c.engineScripts[a]={isStringSrc:!0,str:this._localFileStrings[d]}:this._localFileBlobs.hasOwnProperty(d)&&(c.engineScripts[a]=
URL.createObjectURL(this._localFileBlobs[d]))}}c.baseUrl?this._baseUrl=c.baseUrl:(d=location.origin,this._baseUrl=("null"===d?"file:///":d)+location.pathname,d=this._baseUrl.lastIndexOf("/"),-1!==d&&(this._baseUrl=this._baseUrl.substr(0,d+1)));if(c.workerScripts)for(const [a,b]of Object.entries(c.workerScripts))this._workerScriptBlobURLs[a]=URL.createObjectURL(b);d=new MessageChannel;this._messageChannelPort=d.port1;this._messageChannelPort.onmessage=a=>this._OnMessageFromRuntime(a.data);window.c3_addPortMessageHandler&&
window.c3_addPortMessageHandler(a=>this._OnMessageFromDebugger(a));this._jobScheduler=new self.JobSchedulerDOM(this);await this._jobScheduler.Init();this.MaybeForceBodySize();"object"===typeof window.StatusBar&&window.StatusBar.hide();"object"===typeof window.AndroidFullScreen&&window.AndroidFullScreen.immersiveMode();await this._TestTransferablesWork();this._useWorker?await this._InitWorker(c,d.port2):await this._InitDOM(c,d.port2)}_GetWorkerURL(c){return this._workerScriptBlobURLs.hasOwnProperty(c)?
this._workerScriptBlobURLs[c]:c.endsWith("/workermain.js")&&this._workerScriptBlobURLs.hasOwnProperty("workermain.js")?this._workerScriptBlobURLs["workermain.js"]:"playable-ad"===this._exportType&&this._localFileBlobs.hasOwnProperty(c.toLowerCase())?URL.createObjectURL(this._localFileBlobs[c.toLowerCase()]):c}async CreateWorker(c,d,a){if(c.startsWith("blob:"))return new Worker(c,a);if(this.IsiOSCordova()&&"file:"===location.protocol)return c=await this.CordovaFetchLocalFileAsArrayBuffer(this._scriptFolder+
c),c=new Blob([c],{type:"application/javascript"}),new Worker(URL.createObjectURL(c),a);c=new URL(c,d);if(location.origin!==c.origin){c=await fetch(c);if(!c.ok)throw Error("failed to fetch worker script");c=await c.blob();return new Worker(URL.createObjectURL(c),a)}return new Worker(c,a)}MaybeForceBodySize(){if(this.IsiOSWebView()){const c=document.documentElement.style,d=document.body.style,a=window.innerWidth<window.innerHeight,b=a?window.screen.width:window.screen.height;d.height=c.height=(a?window.screen.height:
window.screen.width)+"px";d.width=c.width=b+"px"}}_GetCommonRuntimeOptions(c){return{baseUrl:this._baseUrl,windowInnerWidth:window.innerWidth,windowInnerHeight:window.innerHeight,devicePixelRatio:window.devicePixelRatio,isFullscreen:n.IsDocumentFullscreen(),projectData:c.projectData,previewImageBlobs:window.cr_previewImageBlobs||this._localFileBlobs,previewProjectFileBlobs:window.cr_previewProjectFileBlobs,exportType:c.exportType,isDebug:-1<self.location.search.indexOf("debug"),ife:!!self.ife,jobScheduler:this._jobScheduler.GetPortData(),
supportedAudioFormats:m,opusWasmScriptUrl:window.cr_opusWasmScriptUrl||this._scriptFolder+"opus.wasm.js",opusWasmBinaryUrl:window.cr_opusWasmBinaryUrl||this._scriptFolder+"opus.wasm.wasm",isiOSCordova:this.IsiOSCordova(),isiOSWebView:this.IsiOSWebView(),isFBInstantAvailable:"undefined"!==typeof self.FBInstant}}async _InitWorker(c,d){var a=this._GetWorkerURL(c.workerMainUrl);this._worker=await this.CreateWorker(a,this._baseUrl,{name:"Runtime"});this._canvas=document.createElement("canvas");this._canvas.style.display=
"none";a=this._canvas.transferControlToOffscreen();document.body.appendChild(this._canvas);window.c3canvas=this._canvas;this._worker.postMessage(Object.assign(this._GetCommonRuntimeOptions(c),{type:"init-runtime",isInWorker:!0,messagePort:d,canvas:a,workerDependencyScripts:c.workerDependencyScripts||[],engineScripts:c.engineScripts,projectScripts:window.cr_allProjectScripts,projectScriptsStatus:self.C3_ProjectScriptsStatus}),[d,a,...this._jobScheduler.GetPortTransferables()]);this._domHandlers=r.map(b=>
new b(this));this._FindRuntimeDOMHandler();self.c3_callFunction=(b,e)=>this._runtimeDomHandler._InvokeFunctionFromJS(b,e);"preview"===this._exportType&&(self.goToLastErrorScript=()=>this.PostToRuntimeComponent("runtime","go-to-last-error-script"))}async _InitDOM(c,d){this._canvas=document.createElement("canvas");this._canvas.style.display="none";document.body.appendChild(this._canvas);window.c3canvas=this._canvas;this._domHandlers=r.map(b=>new b(this));this._FindRuntimeDOMHandler();const a=c.engineScripts.map(b=>
"string"===typeof b?(new URL(b,this._baseUrl)).toString():b);Array.isArray(c.workerDependencyScripts)&&a.unshift(...c.workerDependencyScripts);await Promise.all(a.map(b=>h(b)));if(c.projectScripts&&0<c.projectScripts.length){const b=self.C3_ProjectScriptsStatus;try{if(await Promise.all(c.projectScripts.map(e=>h(e[1]))),Object.values(b).some(e=>!e)){self.setTimeout(()=>this._ReportProjectScriptError(b),100);return}}catch(e){console.error("[Preview] Error loading project scripts: ",e);self.setTimeout(()=>
this._ReportProjectScriptError(b),100);return}}"preview"===this._exportType&&"object"!==typeof self.C3.ScriptsInEvents?(console.error("[C3 runtime] Failed to load JavaScript code used in events. Check all your JavaScript code has valid syntax."),alert("Failed to load JavaScript code used in events. Check all your JavaScript code has valid syntax.")):(c=Object.assign(this._GetCommonRuntimeOptions(c),{isInWorker:!1,messagePort:d,canvas:this._canvas,runOnStartupFunctions:B}),this._localRuntime=self.C3_CreateRuntime(c),
await self.C3_InitRuntime(this._localRuntime,c))}_ReportProjectScriptError(c){c=`Failed to load project script '${Object.entries(c).filter(d=>!d[1]).map(d=>d[0])[0]}'. Check all your JavaScript code has valid syntax.`;console.error("[Preview] "+c);alert(c)}async _OnCreateJobWorker(c){c=await this._jobScheduler._CreateJobWorker();return{outputPort:c,transferables:[c]}}_GetLocalRuntime(){if(this._useWorker)throw Error("not available in worker mode");return this._localRuntime}PostToRuntimeComponent(c,
d,a,b,e){this._messageChannelPort.postMessage({type:"event",component:c,handler:d,dispatchOpts:b||null,data:a,responseId:null},this._transferablesBroken?void 0:e)}PostToRuntimeComponentAsync(c,d,a,b,e){const g=A++,l=new Promise((p,C)=>{x.set(g,{resolve:p,reject:C})});this._messageChannelPort.postMessage({type:"event",component:c,handler:d,dispatchOpts:b||null,data:a,responseId:g},this._transferablesBroken?void 0:e);return l}["_OnMessageFromRuntime"](c){const d=c.type;if("event"===d)return this._OnEventFromRuntime(c);
if("result"===d)this._OnResultFromRuntime(c);else if("runtime-ready"===d)this._OnRuntimeReady();else if("alert"===d)alert(c.message);else throw Error(`unknown message '${d}'`);}_OnEventFromRuntime(c){const d=c.component,a=c.handler,b=c.data,e=c.responseId;if(c=w.get(d))if(c=c.get(a)){var g=null;try{g=c(b)}catch(l){console.error(`Exception in '${d}' handler '${a}':`,l);null!==e&&this._PostResultToRuntime(e,!1,""+l);return}if(null===e)return g;g&&g.then?g.then(l=>this._PostResultToRuntime(e,!0,l)).catch(l=>
{console.error(`Rejection from '${d}' handler '${a}':`,l);this._PostResultToRuntime(e,!1,""+l)}):this._PostResultToRuntime(e,!0,g)}else console.warn(`[DOM] No handler '${a}' for component '${d}'`);else console.warn(`[DOM] No event handlers for component '${d}'`)}_PostResultToRuntime(c,d,a){let b;a&&a.transferables&&(b=a.transferables);this._messageChannelPort.postMessage({type:"result",responseId:c,isOk:d,result:a},b)}_OnResultFromRuntime(c){const d=c.responseId,a=c.isOk;c=c.result;const b=x.get(d);
a?b.resolve(c):b.reject(c);x.delete(d)}AddRuntimeComponentMessageHandler(c,d,a){let b=w.get(c);b||(b=new Map,w.set(c,b));if(b.has(d))throw Error(`[DOM] Component '${c}' already has handler '${d}'`);b.set(d,a)}static AddDOMHandlerClass(c){if(r.includes(c))throw Error("DOM handler already added");r.push(c)}_FindRuntimeDOMHandler(){for(const c of this._domHandlers)if("runtime"===c.GetComponentID()){this._runtimeDomHandler=c;return}throw Error("cannot find runtime DOM handler");}_OnMessageFromDebugger(c){this.PostToRuntimeComponent("debugger",
"message",c)}_OnRuntimeReady(){for(const c of this._domHandlers)c.Attach()}static IsDocumentFullscreen(){return!!(document.fullscreenElement||document.webkitFullscreenElement||document.mozFullScreenElement)}async GetRemotePreviewStatusInfo(){return await this.PostToRuntimeComponentAsync("runtime","get-remote-preview-status-info")}_AddRAFCallback(c){this._rafCallbacks.push(c);this._RequestAnimationFrame()}_RemoveRAFCallback(c){c=this._rafCallbacks.indexOf(c);if(-1===c)throw Error("invalid callback");
this._rafCallbacks.splice(c,1);this._rafCallbacks.length||this._CancelAnimationFrame()}_RequestAnimationFrame(){-1===this._rafId&&this._rafCallbacks.length&&(this._rafId=requestAnimationFrame(this._rafFunc))}_CancelAnimationFrame(){-1!==this._rafId&&(cancelAnimationFrame(this._rafId),this._rafId=-1)}_OnRAFCallback(){this._rafId=-1;for(const c of this._rafCallbacks)c();this._RequestAnimationFrame()}TryPlayMedia(c){this._runtimeDomHandler.TryPlayMedia(c)}RemovePendingPlay(c){this._runtimeDomHandler.RemovePendingPlay(c)}_PlayPendingMedia(){this._runtimeDomHandler._PlayPendingMedia()}SetSilent(c){this._runtimeDomHandler.SetSilent(c)}IsAudioFormatSupported(c){return!!m[c]}async _WasmDecodeWebMOpus(c){c=
await this.PostToRuntimeComponentAsync("runtime","opus-decode",{arrayBuffer:c},null,[c]);return new Float32Array(c)}IsAbsoluteURL(c){return/^(?:[a-z]+:)?\/\//.test(c)||"data:"===c.substr(0,5)||"blob:"===c.substr(0,5)}IsRelativeURL(c){return!this.IsAbsoluteURL(c)}async _OnCordovaFetchLocalFile(c){const d=c.filename;switch(c.as){case "text":return await this.CordovaFetchLocalFileAsText(d);case "buffer":return await this.CordovaFetchLocalFileAsArrayBuffer(d);default:throw Error("unsupported type");}}_GetPermissionAPI(){const c=
window.cordova&&window.cordova.plugins&&window.cordova.plugins.permissions;if("object"!==typeof c)throw Error("Permission API is not loaded");return c}_MapPermissionID(c,d){c=c[d];if("string"!==typeof c)throw Error("Invalid permission name");return c}_HasPermission(c){const d=this._GetPermissionAPI();return new Promise((a,b)=>d.checkPermission(this._MapPermissionID(d,c),e=>a(!!e.hasPermission),b))}_RequestPermission(c){const d=this._GetPermissionAPI();return new Promise((a,b)=>d.requestPermission(this._MapPermissionID(d,
c),e=>a(!!e.hasPermission),b))}async RequestPermissions(c){if("cordova"!==this.GetExportType()||this.IsiOSCordova())return!0;for(const d of c)if(!await this._HasPermission(d)&&!1===await this._RequestPermission(d))return!1;return!0}async RequirePermissions(...c){if(!1===await this.RequestPermissions(c))throw Error("Permission not granted");}CordovaFetchLocalFile(c){const d=window.cordova.file.applicationDirectory+"www/"+c.toLowerCase();return new Promise((a,b)=>{window.resolveLocalFileSystemURL(d,
e=>{e.file(a,b)},b)})}async CordovaFetchLocalFileAsText(c){c=await this.CordovaFetchLocalFile(c);return await t(c)}_CordovaMaybeStartNextArrayBufferRead(){if(v.length&&!(8<=u)){u++;var c=v.shift();this._CordovaDoFetchLocalFileAsAsArrayBuffer(c.filename,c.successCallback,c.errorCallback)}}CordovaFetchLocalFileAsArrayBuffer(c){return new Promise((d,a)=>{v.push({filename:c,successCallback:b=>{u--;this._CordovaMaybeStartNextArrayBufferRead();d(b)},errorCallback:b=>{u--;this._CordovaMaybeStartNextArrayBufferRead();
a(b)}});this._CordovaMaybeStartNextArrayBufferRead()})}async _CordovaDoFetchLocalFileAsAsArrayBuffer(c,d,a){try{const b=await this.CordovaFetchLocalFile(c),e=await z(b);d(e)}catch(b){a(b)}}async _ConvertDataUrisToBlobs(){const c=[];for(const [d,a]of Object.entries(this._localFileBlobs))c.push(this._ConvertDataUriToBlobs(d,a));await Promise.all(c)}async _ConvertDataUriToBlobs(c,d){if("object"===typeof d)this._localFileBlobs[c]=new Blob([d.str],{type:d.type}),this._localFileStrings[c]=d.str;else{let a=
await this._FetchDataUri(d);a||(a=this._DataURIToBinaryBlobSync(d));this._localFileBlobs[c]=a}}async _FetchDataUri(c){try{return await (await fetch(c)).blob()}catch(d){return console.warn("Failed to fetch a data: URI. Falling back to a slower workaround. This is probably because the Content Security Policy unnecessarily blocked it. Allow data: URIs in your CSP to avoid this.",d),null}}_DataURIToBinaryBlobSync(c){c=this._ParseDataURI(c);return this._BinaryStringToBlob(c.data,c.mime_type)}_ParseDataURI(c){var d=
c.indexOf(",");if(0>d)throw new URIError("expected comma in data: uri");var a=c.substring(5,d);c=c.substring(d+1);d=a.split(";");a=d[0]||"";const b=d[2];c="base64"===d[1]||"base64"===b?atob(c):decodeURIComponent(c);return{mime_type:a,data:c}}_BinaryStringToBlob(c,d){var a=c.length;let b=a>>2,e=new Uint8Array(a),g=new Uint32Array(e.buffer,0,b),l,p;for(p=l=0;l<b;++l)g[l]=c.charCodeAt(p++)|c.charCodeAt(p++)<<8|c.charCodeAt(p++)<<16|c.charCodeAt(p++)<<24;for(a&=3;a--;)e[p]=c.charCodeAt(p),++p;return new Blob([e],
{type:d})}_TestTransferablesWork(){let c=null;const d=new Promise(e=>c=e),a=new ArrayBuffer(1),b=new MessageChannel;b.port2.onmessage=e=>{e.data&&e.data.arrayBuffer||(this._transferablesBroken=!0,console.warn("MessageChannel transfers determined to be broken. Disabling transferables."));c()};b.port1.postMessage({arrayBuffer:a},[a]);return d}}}"use strict";
{const f=self.RuntimeInterface;function h(a){return a.sourceCapabilities&&a.sourceCapabilities.firesTouchEvents||a.originalEvent&&a.originalEvent.sourceCapabilities&&a.originalEvent.sourceCapabilities.firesTouchEvents}const k=new Map([["OSLeft","MetaLeft"],["OSRight","MetaRight"]]),m={dispatchRuntimeEvent:!0,dispatchUserScriptEvent:!0},t={dispatchUserScriptEvent:!0},z={dispatchRuntimeEvent:!0};function v(a){return new Promise((b,e)=>{const g=document.createElement("link");g.onload=()=>b(g);g.onerror=
l=>e(l);g.rel="stylesheet";g.href=a;document.head.appendChild(g)})}function u(a){return new Promise((b,e)=>{const g=new Image;g.onload=()=>b(g);g.onerror=l=>e(l);g.src=a})}async function r(a){a=URL.createObjectURL(a);try{return await u(a)}finally{URL.revokeObjectURL(a)}}function w(a){return new Promise((b,e)=>{let g=new FileReader;g.onload=l=>b(l.target.result);g.onerror=l=>e(l);g.readAsText(a)})}async function x(a,b,e){if(!/firefox/i.test(navigator.userAgent))return await r(a);var g=await w(a);g=
(new DOMParser).parseFromString(g,"image/svg+xml");const l=g.documentElement;if(l.hasAttribute("width")&&l.hasAttribute("height")){const p=l.getAttribute("width"),C=l.getAttribute("height");if(!p.includes("%")&&!C.includes("%"))return await r(a)}l.setAttribute("width",b+"px");l.setAttribute("height",e+"px");g=(new XMLSerializer).serializeToString(g);a=new Blob([g],{type:"image/svg+xml"});return await r(a)}function A(a){do{if(a.parentNode&&a.hasAttribute("contenteditable"))return!0;a=a.parentNode}while(a);
return!1}const B=new Set(["canvas","body","html"]);function q(a){const b=a.target.tagName.toLowerCase();B.has(b)&&a.preventDefault()}function y(a){(a.metaKey||a.ctrlKey)&&a.preventDefault()}self.C3_GetSvgImageSize=async function(a){a=await r(a);if(0<a.width&&0<a.height)return[a.width,a.height];{a.style.position="absolute";a.style.left="0px";a.style.top="0px";a.style.visibility="hidden";document.body.appendChild(a);const b=a.getBoundingClientRect();document.body.removeChild(a);return[b.width,b.height]}};
self.C3_RasterSvgImageBlob=async function(a,b,e,g,l){a=await x(a,b,e);const p=document.createElement("canvas");p.width=g;p.height=l;p.getContext("2d").drawImage(a,0,0,b,e);return p};let n=!1;document.addEventListener("pause",()=>n=!0);document.addEventListener("resume",()=>n=!1);function c(){try{return window.parent&&window.parent.document.hasFocus()}catch(a){return!1}}function d(){const a=document.activeElement;if(!a)return!1;const b=a.tagName.toLowerCase(),e=new Set("email number password search tel text url".split(" "));
return"textarea"===b?!0:"input"===b?e.has(a.type.toLowerCase()||"text"):A(a)}f.AddDOMHandlerClass(class extends self.DOMHandler{constructor(a){super(a,"runtime");this._isFirstSizeUpdate=!0;this._simulatedResizeTimerId=-1;this._targetOrientation="any";this._attachedDeviceMotionEvent=this._attachedDeviceOrientationEvent=!1;this._lastPointerRawUpdateEvent=this._pointerRawUpdateRateLimiter=this._debugHighlightElem=null;a.AddRuntimeComponentMessageHandler("canvas","update-size",g=>this._OnUpdateCanvasSize(g));
a.AddRuntimeComponentMessageHandler("runtime","invoke-download",g=>this._OnInvokeDownload(g));a.AddRuntimeComponentMessageHandler("runtime","raster-svg-image",g=>this._OnRasterSvgImage(g));a.AddRuntimeComponentMessageHandler("runtime","get-svg-image-size",g=>this._OnGetSvgImageSize(g));a.AddRuntimeComponentMessageHandler("runtime","set-target-orientation",g=>this._OnSetTargetOrientation(g));a.AddRuntimeComponentMessageHandler("runtime","register-sw",()=>this._OnRegisterSW());a.AddRuntimeComponentMessageHandler("runtime",
"post-to-debugger",g=>this._OnPostToDebugger(g));a.AddRuntimeComponentMessageHandler("runtime","go-to-script",g=>this._OnPostToDebugger(g));a.AddRuntimeComponentMessageHandler("runtime","before-start-ticking",()=>this._OnBeforeStartTicking());a.AddRuntimeComponentMessageHandler("runtime","debug-highlight",g=>this._OnDebugHighlight(g));a.AddRuntimeComponentMessageHandler("runtime","enable-device-orientation",()=>this._AttachDeviceOrientationEvent());a.AddRuntimeComponentMessageHandler("runtime","enable-device-motion",
()=>this._AttachDeviceMotionEvent());a.AddRuntimeComponentMessageHandler("runtime","add-stylesheet",g=>this._OnAddStylesheet(g));a.AddRuntimeComponentMessageHandler("runtime","alert",g=>this._OnAlert(g));a.AddRuntimeComponentMessageHandler("runtime","hide-cordova-splash",()=>this._OnHideCordovaSplash());const b=new Set(["input","textarea","datalist"]);window.addEventListener("contextmenu",g=>{const l=g.target,p=l.tagName.toLowerCase();b.has(p)||A(l)||g.preventDefault()});const e=a.GetCanvas();window.addEventListener("selectstart",
q);window.addEventListener("gesturehold",q);e.addEventListener("selectstart",q);e.addEventListener("gesturehold",q);window.addEventListener("touchstart",q,{passive:!1});"undefined"!==typeof PointerEvent?(window.addEventListener("pointerdown",q,{passive:!1}),e.addEventListener("pointerdown",q)):e.addEventListener("touchstart",q);this._mousePointerLastButtons=0;window.addEventListener("mousedown",g=>{1===g.button&&g.preventDefault()});window.addEventListener("mousewheel",y,{passive:!1});window.addEventListener("wheel",
y,{passive:!1});window.addEventListener("resize",()=>this._OnWindowResize());a.IsiOSWebView()&&window.addEventListener("focusout",()=>{d()||(document.scrollingElement.scrollTop=0)});this._mediaPendingPlay=new Set;this._mediaRemovedPendingPlay=new WeakSet;this._isSilent=!1}_OnBeforeStartTicking(){"cordova"===this._iRuntime.GetExportType()?(document.addEventListener("pause",()=>this._OnVisibilityChange(!0)),document.addEventListener("resume",()=>this._OnVisibilityChange(!1))):document.addEventListener("visibilitychange",
()=>this._OnVisibilityChange(document.hidden));return{isSuspended:!(!document.hidden&&!n)}}Attach(){window.addEventListener("focus",()=>this._PostRuntimeEvent("window-focus"));window.addEventListener("blur",()=>{this._PostRuntimeEvent("window-blur",{parentHasFocus:c()});this._mousePointerLastButtons=0});window.addEventListener("fullscreenchange",()=>this._OnFullscreenChange());window.addEventListener("webkitfullscreenchange",()=>this._OnFullscreenChange());window.addEventListener("mozfullscreenchange",
()=>this._OnFullscreenChange());window.addEventListener("fullscreenerror",b=>this._OnFullscreenError(b));window.addEventListener("webkitfullscreenerror",b=>this._OnFullscreenError(b));window.addEventListener("mozfullscreenerror",b=>this._OnFullscreenError(b));window.addEventListener("keydown",b=>this._OnKeyEvent("keydown",b));window.addEventListener("keyup",b=>this._OnKeyEvent("keyup",b));window.addEventListener("dblclick",b=>this._OnMouseEvent("dblclick",b,m));window.addEventListener("wheel",b=>
this._OnMouseWheelEvent("wheel",b));"undefined"!==typeof PointerEvent?(window.addEventListener("pointerdown",b=>{this._HandlePointerDownFocus(b);this._OnPointerEvent("pointerdown",b)}),this._iRuntime.UsesWorker()&&"undefined"!==typeof window.onpointerrawupdate&&self===self.top?(this._pointerRawUpdateRateLimiter=new self.RateLimiter(()=>this._DoSendPointerRawUpdate(),5),this._pointerRawUpdateRateLimiter.SetCanRunImmediate(!0),window.addEventListener("pointerrawupdate",b=>this._OnPointerRawUpdate(b))):
window.addEventListener("pointermove",b=>this._OnPointerEvent("pointermove",b)),window.addEventListener("pointerup",b=>this._OnPointerEvent("pointerup",b)),window.addEventListener("pointercancel",b=>this._OnPointerEvent("pointercancel",b))):(window.addEventListener("mousedown",b=>{this._HandlePointerDownFocus(b);this._OnMouseEventAsPointer("pointerdown",b)}),window.addEventListener("mousemove",b=>this._OnMouseEventAsPointer("pointermove",b)),window.addEventListener("mouseup",b=>this._OnMouseEventAsPointer("pointerup",
b)),window.addEventListener("touchstart",b=>{this._HandlePointerDownFocus(b);this._OnTouchEvent("pointerdown",b)}),window.addEventListener("touchmove",b=>this._OnTouchEvent("pointermove",b)),window.addEventListener("touchend",b=>this._OnTouchEvent("pointerup",b)),window.addEventListener("touchcancel",b=>this._OnTouchEvent("pointercancel",b)));const a=()=>this._PlayPendingMedia();window.addEventListener("pointerup",a,!0);window.addEventListener("touchend",a,!0);window.addEventListener("click",a,!0);
window.addEventListener("keydown",a,!0);window.addEventListener("gamepadconnected",a,!0)}_PostRuntimeEvent(a,b){this.PostToRuntime(a,b||null,z)}_GetWindowInnerWidth(){return Math.max(window.innerWidth,1)}_GetWindowInnerHeight(){return Math.max(window.innerHeight,1)}_OnWindowResize(){const a=this._GetWindowInnerWidth(),b=this._GetWindowInnerHeight();this._PostRuntimeEvent("window-resize",{innerWidth:a,innerHeight:b,devicePixelRatio:window.devicePixelRatio});this._iRuntime.IsiOSWebView()&&(-1!==this._simulatedResizeTimerId&&
clearTimeout(this._simulatedResizeTimerId),this._OnSimulatedResize(a,b,0))}_ScheduleSimulatedResize(a,b,e){-1!==this._simulatedResizeTimerId&&clearTimeout(this._simulatedResizeTimerId);this._simulatedResizeTimerId=setTimeout(()=>this._OnSimulatedResize(a,b,e),48)}_OnSimulatedResize(a,b,e){const g=this._GetWindowInnerWidth(),l=this._GetWindowInnerHeight();this._simulatedResizeTimerId=-1;g!=a||l!=b?this._PostRuntimeEvent("window-resize",{innerWidth:g,innerHeight:l,devicePixelRatio:window.devicePixelRatio}):
10>e&&this._ScheduleSimulatedResize(g,l,e+1)}_OnSetTargetOrientation(a){this._targetOrientation=a.targetOrientation}_TrySetTargetOrientation(){const a=this._targetOrientation;if(screen.orientation&&screen.orientation.lock)screen.orientation.lock(a).catch(b=>console.warn("[Construct 3] Failed to lock orientation: ",b));else try{let b=!1;screen.lockOrientation?b=screen.lockOrientation(a):screen.webkitLockOrientation?b=screen.webkitLockOrientation(a):screen.mozLockOrientation?b=screen.mozLockOrientation(a):
screen.msLockOrientation&&(b=screen.msLockOrientation(a));b||console.warn("[Construct 3] Failed to lock orientation")}catch(b){console.warn("[Construct 3] Failed to lock orientation: ",b)}}_OnFullscreenChange(){const a=f.IsDocumentFullscreen();a&&"any"!==this._targetOrientation&&this._TrySetTargetOrientation();this.PostToRuntime("fullscreenchange",{isFullscreen:a,innerWidth:this._GetWindowInnerWidth(),innerHeight:this._GetWindowInnerHeight()})}_OnFullscreenError(a){console.warn("[Construct 3] Fullscreen request failed: ",
a);this.PostToRuntime("fullscreenerror",{isFullscreen:f.IsDocumentFullscreen(),innerWidth:this._GetWindowInnerWidth(),innerHeight:this._GetWindowInnerHeight()})}_OnVisibilityChange(a){a?this._iRuntime._CancelAnimationFrame():this._iRuntime._RequestAnimationFrame();this.PostToRuntime("visibilitychange",{hidden:a})}_OnKeyEvent(a,b){"Backspace"===b.key&&q(b);const e=k.get(b.code)||b.code;this._PostToRuntimeMaybeSync(a,{code:e,key:b.key,which:b.which,repeat:b.repeat,altKey:b.altKey,ctrlKey:b.ctrlKey,
metaKey:b.metaKey,shiftKey:b.shiftKey,timeStamp:b.timeStamp},m)}_OnMouseWheelEvent(a,b){this.PostToRuntime(a,{clientX:b.clientX,clientY:b.clientY,pageX:b.pageX,pageY:b.pageY,deltaX:b.deltaX,deltaY:b.deltaY,deltaZ:b.deltaZ,deltaMode:b.deltaMode,timeStamp:b.timeStamp},m)}_OnMouseEvent(a,b,e){h(b)||this._PostToRuntimeMaybeSync(a,{button:b.button,buttons:b.buttons,clientX:b.clientX,clientY:b.clientY,pageX:b.pageX,pageY:b.pageY,timeStamp:b.timeStamp},e)}_OnMouseEventAsPointer(a,b){if(!h(b)){var e=this._mousePointerLastButtons;
"pointerdown"===a&&0!==e?a="pointermove":"pointerup"===a&&0!==b.buttons&&(a="pointermove");this._PostToRuntimeMaybeSync(a,{pointerId:1,pointerType:"mouse",button:b.button,buttons:b.buttons,lastButtons:e,clientX:b.clientX,clientY:b.clientY,pageX:b.pageX,pageY:b.pageY,width:0,height:0,pressure:0,tangentialPressure:0,tiltX:0,tiltY:0,twist:0,timeStamp:b.timeStamp},m);this._mousePointerLastButtons=b.buttons;this._OnMouseEvent(b.type,b,t)}}_OnPointerEvent(a,b){this._pointerRawUpdateRateLimiter&&"pointermove"!==
a&&this._pointerRawUpdateRateLimiter.Reset();var e=0;"mouse"===b.pointerType&&(e=this._mousePointerLastButtons);this._PostToRuntimeMaybeSync(a,{pointerId:b.pointerId,pointerType:b.pointerType,button:b.button,buttons:b.buttons,lastButtons:e,clientX:b.clientX,clientY:b.clientY,pageX:b.pageX,pageY:b.pageY,width:b.width||0,height:b.height||0,pressure:b.pressure||0,tangentialPressure:b.tangentialPressure||0,tiltX:b.tiltX||0,tiltY:b.tiltY||0,twist:b.twist||0,timeStamp:b.timeStamp},m);"mouse"===b.pointerType&&
(e="mousemove","pointerdown"===a?e="mousedown":"pointerup"===a&&(e="pointerup"),this._OnMouseEvent(e,b,t),this._mousePointerLastButtons=b.buttons)}_OnPointerRawUpdate(a){this._lastPointerRawUpdateEvent=a;this._pointerRawUpdateRateLimiter.Call()}_DoSendPointerRawUpdate(){this._OnPointerEvent("pointermove",this._lastPointerRawUpdateEvent);this._lastPointerRawUpdateEvent=null}_OnTouchEvent(a,b){for(let e=0,g=b.changedTouches.length;e<g;++e){const l=b.changedTouches[e];this._PostToRuntimeMaybeSync(a,
{pointerId:l.identifier,pointerType:"touch",button:0,buttons:0,lastButtons:0,clientX:l.clientX,clientY:l.clientY,pageX:l.pageX,pageY:l.pageY,width:2*(l.radiusX||l.webkitRadiusX||0),height:2*(l.radiusY||l.webkitRadiusY||0),pressure:l.force||l.webkitForce||0,tangentialPressure:0,tiltX:0,tiltY:0,twist:l.rotationAngle||0,timeStamp:b.timeStamp},m)}}_HandlePointerDownFocus(a){window!==window.top&&window.focus();this._IsElementCanvasOrDocument(a.target)&&document.activeElement&&!this._IsElementCanvasOrDocument(document.activeElement)&&
document.activeElement.blur()}_IsElementCanvasOrDocument(a){return!a||a===document||a===window||a===document.body||"canvas"===a.tagName.toLowerCase()}_AttachDeviceOrientationEvent(){this._attachedDeviceOrientationEvent||(this._attachedDeviceOrientationEvent=!0,window.addEventListener("deviceorientation",a=>this._OnDeviceOrientation(a)),window.addEventListener("deviceorientationabsolute",a=>this._OnDeviceOrientationAbsolute(a)))}_AttachDeviceMotionEvent(){this._attachedDeviceMotionEvent||(this._attachedDeviceMotionEvent=
!0,window.addEventListener("devicemotion",a=>this._OnDeviceMotion(a)))}_OnDeviceOrientation(a){this.PostToRuntime("deviceorientation",{absolute:!!a.absolute,alpha:a.alpha||0,beta:a.beta||0,gamma:a.gamma||0,timeStamp:a.timeStamp,webkitCompassHeading:a.webkitCompassHeading,webkitCompassAccuracy:a.webkitCompassAccuracy},m)}_OnDeviceOrientationAbsolute(a){this.PostToRuntime("deviceorientationabsolute",{absolute:!!a.absolute,alpha:a.alpha||0,beta:a.beta||0,gamma:a.gamma||0,timeStamp:a.timeStamp},m)}_OnDeviceMotion(a){let b=
null;var e=a.acceleration;e&&(b={x:e.x||0,y:e.y||0,z:e.z||0});e=null;var g=a.accelerationIncludingGravity;g&&(e={x:g.x||0,y:g.y||0,z:g.z||0});g=null;const l=a.rotationRate;l&&(g={alpha:l.alpha||0,beta:l.beta||0,gamma:l.gamma||0});this.PostToRuntime("devicemotion",{acceleration:b,accelerationIncludingGravity:e,rotationRate:g,interval:a.interval,timeStamp:a.timeStamp},m)}_OnUpdateCanvasSize(a){const b=this.GetRuntimeInterface(),e=b.GetCanvas();e.style.width=a.styleWidth+"px";e.style.height=a.styleHeight+
"px";e.style.marginLeft=a.marginLeft+"px";e.style.marginTop=a.marginTop+"px";b.MaybeForceBodySize();this._isFirstSizeUpdate&&(e.style.display="",this._isFirstSizeUpdate=!1)}_OnInvokeDownload(a){const b=a.url;a=a.filename;const e=document.createElement("a"),g=document.body;e.textContent=a;e.href=b;e.download=a;g.appendChild(e);e.click();g.removeChild(e)}async _OnRasterSvgImage(a){var b=a.imageBitmapOpts;a=await self.C3_RasterSvgImageBlob(a.blob,a.imageWidth,a.imageHeight,a.surfaceWidth,a.surfaceHeight);
b=b?await createImageBitmap(a,b):await createImageBitmap(a);return{imageBitmap:b,transferables:[b]}}async _OnGetSvgImageSize(a){return await self.C3_GetSvgImageSize(a.blob)}async _OnAddStylesheet(a){await v(a.url)}_PlayPendingMedia(){var a=[...this._mediaPendingPlay];this._mediaPendingPlay.clear();if(!this._isSilent)for(const b of a)(a=b.play())&&a.catch(e=>{this._mediaRemovedPendingPlay.has(b)||this._mediaPendingPlay.add(b)})}TryPlayMedia(a){if("function"!==typeof a.play)throw Error("missing play function");
this._mediaRemovedPendingPlay.delete(a);let b;try{b=a.play()}catch(e){this._mediaPendingPlay.add(a);return}b&&b.catch(e=>{this._mediaRemovedPendingPlay.has(a)||this._mediaPendingPlay.add(a)})}RemovePendingPlay(a){this._mediaPendingPlay.delete(a);this._mediaRemovedPendingPlay.add(a)}SetSilent(a){this._isSilent=!!a}_OnHideCordovaSplash(){navigator.splashscreen&&navigator.splashscreen.hide&&navigator.splashscreen.hide()}_OnDebugHighlight(a){if(a.show){this._debugHighlightElem||(this._debugHighlightElem=
document.createElement("div"),this._debugHighlightElem.id="inspectOutline",document.body.appendChild(this._debugHighlightElem));var b=this._debugHighlightElem;b.style.display="";b.style.left=a.left-1+"px";b.style.top=a.top-1+"px";b.style.width=a.width+2+"px";b.style.height=a.height+2+"px";b.textContent=a.name}else this._debugHighlightElem&&(this._debugHighlightElem.style.display="none")}_OnRegisterSW(){window.C3_RegisterSW&&window.C3_RegisterSW()}_OnPostToDebugger(a){window.c3_postToMessagePort&&
(a.from="runtime",window.c3_postToMessagePort(a))}_InvokeFunctionFromJS(a,b){return this.PostToRuntimeAsync("js-invoke-function",{name:a,params:b})}_OnAlert(a){alert(a.message)}})}"use strict";
{const f=document.currentScript.src;self.JobSchedulerDOM=class{constructor(h){this._runtimeInterface=h;this._baseUrl=f?f.substr(0,f.lastIndexOf("/")+1):h.GetBaseURL();this._maxNumWorkers=Math.min(navigator.hardwareConcurrency||2,16);this._dispatchWorker=null;this._jobWorkers=[];this._outputPort=this._inputPort=null}async Init(){if(this._hasInitialised)throw Error("already initialised");this._hasInitialised=!0;var h=this._runtimeInterface._GetWorkerURL("dispatchworker.js");this._dispatchWorker=await this._runtimeInterface.CreateWorker(h,
this._baseUrl,{name:"DispatchWorker"});h=new MessageChannel;this._inputPort=h.port1;this._dispatchWorker.postMessage({type:"_init","in-port":h.port2},[h.port2]);this._outputPort=await this._CreateJobWorker()}async _CreateJobWorker(){const h=this._jobWorkers.length;var k=this._runtimeInterface._GetWorkerURL("jobworker.js");k=await this._runtimeInterface.CreateWorker(k,this._baseUrl,{name:"JobWorker"+h});const m=new MessageChannel,t=new MessageChannel;this._dispatchWorker.postMessage({type:"_addJobWorker",
port:m.port1},[m.port1]);k.postMessage({type:"init",number:h,"dispatch-port":m.port2,"output-port":t.port2},[m.port2,t.port2]);this._jobWorkers.push(k);return t.port1}GetPortData(){return{inputPort:this._inputPort,outputPort:this._outputPort,maxNumWorkers:this._maxNumWorkers}}GetPortTransferables(){return[this._inputPort,this._outputPort]}}}"use strict";
window.C3_IsSupported&&(window.c3_runtimeInterface=new self.RuntimeInterface({useWorker:!0,workerMainUrl:"workermain.js",engineScripts:["scripts/c3runtime.js"],scriptFolder:"scripts/",workerDependencyScripts:["box2d.wasm.js"],exportType:"html5"}));