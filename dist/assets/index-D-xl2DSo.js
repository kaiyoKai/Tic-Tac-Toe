(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const r of document.querySelectorAll('link[rel="modulepreload"]'))i(r);new MutationObserver(r=>{for(const n of r)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&i(o)}).observe(document,{childList:!0,subtree:!0});function t(r){const n={};return r.integrity&&(n.integrity=r.integrity),r.referrerPolicy&&(n.referrerPolicy=r.referrerPolicy),r.crossOrigin==="use-credentials"?n.credentials="include":r.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function i(r){if(r.ep)return;r.ep=!0;const n=t(r);fetch(r.href,n)}})();const f={UI:{CellClicked:"ui:cell-clicked",ResetRequested:"ui:reset-requested",SettingsChangeRequested:"ui:settings-change-requested",ThemeChanged:"ui:theme-changed",ButtonShapeChanged:"ui:shape-changed",RotateRequested:"ui:rotate-requested",ProfileChangeRequested:"ui:profile-change-requested",DialogOpenRequested:"ui:dialog-open-requested",GameStartRequested:"ui:game-start-requested",AppEndRequested:"ui:app-end-reqeusted",ToastRequested:"ui:toast-requested",LobbyCreateRequested:"ui:lobby-create-requested",LobbyJoinRequested:"ui:lobby-join-requested",LobbyListRefreshRequested:"ui:lobby-list-refresh-requested",LobbiesUpdated:"ui:lobbies-updated",LobbySettingsChanged:"ui:lobby-settings-changed"},Game:{BoardState:"game:board-state",MoveMade:"game:move-made",MoveRequested:"game:move-requested",RotateRequested:"game:rotate-requested",MoveApplied:"game:move-applied",MoveRejected:"game:move-rejected",Finished:"game:finished",Reset:"game:reset",SettingsChanged:"game:settings-changed",Start:"game:start",BoardSnapshotUpdated:"game:board-snapshot-updated"},Sys:{Error:"sys:error"},Chat:{MessageSent:"chat:message-sent",MessageReceived:"chat:message-received",MessageReactionRequested:"chat:reaction-requested",MessageReactionReceived:"chat:reaction-received"}},g={Controller:"controller",WebUI:"webui",LocalPlayer:"localPlayer",Game:"game",Anonymous:"anonymous",Bot:"bot",Bus:"bus"},Lt={[g.Controller]:"color: #ff00ff; font-weight: bold;",[g.WebUI]:"color: #00ffff; font-weight: bold;",[g.LocalPlayer]:"color: #00ff00; font-weight: bold;",[g.Anonymous]:"color: #ffffff;",[g.Game]:"color: #ff8800; font-weight: bold;",[g.Bus]:"color: #aaaaaa; font-style: italic;",[g.Bot]:"color: #ff0000;",reset:"color: inherit;"},Et=class Et{constructor(){}static register(e){this.registeredScopes.add(e)}static unregister(e){this.registeredScopes.delete(e)}static setScopeAll(){Object.values(g).forEach(t=>this.register(t))}static setScopeNone(){this.registeredScopes.clear()}static formatAndLog(e,t,...i){if(this.isDebug&&this.registeredScopes.has(t)){const r=Lt[t]||Lt.reset;console[e](`%c[${t}]%c`,r,Lt.reset,...i)}}static log(e,...t){this.formatAndLog("log",e,...t)}static info(e,...t){this.formatAndLog("info",e,...t)}static warn(e,...t){this.formatAndLog("warn",e,...t)}static table(e,t){this.isDebug&&this.registeredScopes.has(e)&&(this.info(e,"Table:"),console.table(t))}static error(e,...t){this.formatAndLog("error",e,...t)}};Et.isDebug=!1,Et.registeredScopes=new Set;let Z=Et;const ut=globalThis,cs=ut.ShadowRoot&&(ut.ShadyCSS===void 0||ut.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ds=Symbol(),js=new WeakMap;let vi=class{constructor(e,t,i){if(this._$cssResult$=!0,i!==ds)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=e,this.t=t}get styleSheet(){let e=this.o;const t=this.t;if(cs&&e===void 0){const i=t!==void 0&&t.length===1;i&&(e=js.get(t)),e===void 0&&((this.o=e=new CSSStyleSheet).replaceSync(this.cssText),i&&js.set(t,e))}return e}toString(){return this.cssText}};const Sr=s=>new vi(typeof s=="string"?s:s+"",void 0,ds),te=(s,...e)=>{const t=s.length===1?s[0]:e.reduce((i,r,n)=>i+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(r)+s[n+1],s[0]);return new vi(t,s,ds)},Er=(s,e)=>{if(cs)s.adoptedStyleSheets=e.map(t=>t instanceof CSSStyleSheet?t:t.styleSheet);else for(const t of e){const i=document.createElement("style"),r=ut.litNonce;r!==void 0&&i.setAttribute("nonce",r),i.textContent=t.cssText,s.appendChild(i)}},Ms=cs?s=>s:s=>s instanceof CSSStyleSheet?(e=>{let t="";for(const i of e.cssRules)t+=i.cssText;return Sr(t)})(s):s;const{is:kr,defineProperty:xr,getOwnPropertyDescriptor:$r,getOwnPropertyNames:Ar,getOwnPropertySymbols:Tr,getPrototypeOf:Ir}=Object,kt=globalThis,Bs=kt.trustedTypes,Rr=Bs?Bs.emptyScript:"",Or=kt.reactiveElementPolyfillSupport,We=(s,e)=>s,vt={toAttribute(s,e){switch(e){case Boolean:s=s?Rr:null;break;case Object:case Array:s=s==null?s:JSON.stringify(s)}return s},fromAttribute(s,e){let t=s;switch(e){case Boolean:t=s!==null;break;case Number:t=s===null?null:Number(s);break;case Object:case Array:try{t=JSON.parse(s)}catch{t=null}}return t}},us=(s,e)=>!kr(s,e),Ds={attribute:!0,type:String,converter:vt,reflect:!1,useDefault:!1,hasChanged:us};Symbol.metadata??=Symbol("metadata"),kt.litPropertyMetadata??=new WeakMap;let Ie=class extends HTMLElement{static addInitializer(e){this._$Ei(),(this.l??=[]).push(e)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(e,t=Ds){if(t.state&&(t.attribute=!1),this._$Ei(),this.prototype.hasOwnProperty(e)&&((t=Object.create(t)).wrapped=!0),this.elementProperties.set(e,t),!t.noAccessor){const i=Symbol(),r=this.getPropertyDescriptor(e,i,t);r!==void 0&&xr(this.prototype,e,r)}}static getPropertyDescriptor(e,t,i){const{get:r,set:n}=$r(this.prototype,e)??{get(){return this[t]},set(o){this[t]=o}};return{get:r,set(o){const a=r?.call(this);n?.call(this,o),this.requestUpdate(e,a,i)},configurable:!0,enumerable:!0}}static getPropertyOptions(e){return this.elementProperties.get(e)??Ds}static _$Ei(){if(this.hasOwnProperty(We("elementProperties")))return;const e=Ir(this);e.finalize(),e.l!==void 0&&(this.l=[...e.l]),this.elementProperties=new Map(e.elementProperties)}static finalize(){if(this.hasOwnProperty(We("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(We("properties"))){const t=this.properties,i=[...Ar(t),...Tr(t)];for(const r of i)this.createProperty(r,t[r])}const e=this[Symbol.metadata];if(e!==null){const t=litPropertyMetadata.get(e);if(t!==void 0)for(const[i,r]of t)this.elementProperties.set(i,r)}this._$Eh=new Map;for(const[t,i]of this.elementProperties){const r=this._$Eu(t,i);r!==void 0&&this._$Eh.set(r,t)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(e){const t=[];if(Array.isArray(e)){const i=new Set(e.flat(1/0).reverse());for(const r of i)t.unshift(Ms(r))}else e!==void 0&&t.push(Ms(e));return t}static _$Eu(e,t){const i=t.attribute;return i===!1?void 0:typeof i=="string"?i:typeof e=="string"?e.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),this.constructor.l?.forEach(e=>e(this))}addController(e){(this._$EO??=new Set).add(e),this.renderRoot!==void 0&&this.isConnected&&e.hostConnected?.()}removeController(e){this._$EO?.delete(e)}_$E_(){const e=new Map,t=this.constructor.elementProperties;for(const i of t.keys())this.hasOwnProperty(i)&&(e.set(i,this[i]),delete this[i]);e.size>0&&(this._$Ep=e)}createRenderRoot(){const e=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Er(e,this.constructor.elementStyles),e}connectedCallback(){this.renderRoot??=this.createRenderRoot(),this.enableUpdating(!0),this._$EO?.forEach(e=>e.hostConnected?.())}enableUpdating(e){}disconnectedCallback(){this._$EO?.forEach(e=>e.hostDisconnected?.())}attributeChangedCallback(e,t,i){this._$AK(e,i)}_$ET(e,t){const i=this.constructor.elementProperties.get(e),r=this.constructor._$Eu(e,i);if(r!==void 0&&i.reflect===!0){const n=(i.converter?.toAttribute!==void 0?i.converter:vt).toAttribute(t,i.type);this._$Em=e,n==null?this.removeAttribute(r):this.setAttribute(r,n),this._$Em=null}}_$AK(e,t){const i=this.constructor,r=i._$Eh.get(e);if(r!==void 0&&this._$Em!==r){const n=i.getPropertyOptions(r),o=typeof n.converter=="function"?{fromAttribute:n.converter}:n.converter?.fromAttribute!==void 0?n.converter:vt;this._$Em=r;const a=o.fromAttribute(t,n.type);this[r]=a??this._$Ej?.get(r)??a,this._$Em=null}}requestUpdate(e,t,i,r=!1,n){if(e!==void 0){const o=this.constructor;if(r===!1&&(n=this[e]),i??=o.getPropertyOptions(e),!((i.hasChanged??us)(n,t)||i.useDefault&&i.reflect&&n===this._$Ej?.get(e)&&!this.hasAttribute(o._$Eu(e,i))))return;this.C(e,t,i)}this.isUpdatePending===!1&&(this._$ES=this._$EP())}C(e,t,{useDefault:i,reflect:r,wrapped:n},o){i&&!(this._$Ej??=new Map).has(e)&&(this._$Ej.set(e,o??t??this[e]),n!==!0||o!==void 0)||(this._$AL.has(e)||(this.hasUpdated||i||(t=void 0),this._$AL.set(e,t)),r===!0&&this._$Em!==e&&(this._$Eq??=new Set).add(e))}async _$EP(){this.isUpdatePending=!0;try{await this._$ES}catch(t){Promise.reject(t)}const e=this.scheduleUpdate();return e!=null&&await e,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??=this.createRenderRoot(),this._$Ep){for(const[r,n]of this._$Ep)this[r]=n;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[r,n]of i){const{wrapped:o}=n,a=this[r];o!==!0||this._$AL.has(r)||a===void 0||this.C(r,void 0,n,a)}}let e=!1;const t=this._$AL;try{e=this.shouldUpdate(t),e?(this.willUpdate(t),this._$EO?.forEach(i=>i.hostUpdate?.()),this.update(t)):this._$EM()}catch(i){throw e=!1,this._$EM(),i}e&&this._$AE(t)}willUpdate(e){}_$AE(e){this._$EO?.forEach(t=>t.hostUpdated?.()),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(e)),this.updated(e)}_$EM(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(e){return!0}update(e){this._$Eq&&=this._$Eq.forEach(t=>this._$ET(t,this[t])),this._$EM()}updated(e){}firstUpdated(e){}};Ie.elementStyles=[],Ie.shadowRootOptions={mode:"open"},Ie[We("elementProperties")]=new Map,Ie[We("finalized")]=new Map,Or?.({ReactiveElement:Ie}),(kt.reactiveElementVersions??=[]).push("2.1.2");const hs=globalThis,Us=s=>s,wt=hs.trustedTypes,Ns=wt?wt.createPolicy("lit-html",{createHTML:s=>s}):void 0,wi="$lit$",fe=`lit$${Math.random().toFixed(9).slice(2)}$`,Ci="?"+fe,Lr=`<${Ci}>`,xe=document,Ye=()=>xe.createComment(""),Je=s=>s===null||typeof s!="object"&&typeof s!="function",ps=Array.isArray,Pr=s=>ps(s)||typeof s?.[Symbol.iterator]=="function",Pt=`[ 	
\f\r]`,ze=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,zs=/-->/g,qs=/>/g,ve=RegExp(`>|${Pt}(?:([^\\s"'>=/]+)(${Pt}*=${Pt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Fs=/'/g,Gs=/"/g,_i=/^(?:script|style|textarea|title)$/i,jr=s=>(e,...t)=>({_$litType$:s,strings:e,values:t}),C=jr(1),be=Symbol.for("lit-noChange"),T=Symbol.for("lit-nothing"),Vs=new WeakMap,ke=xe.createTreeWalker(xe,129);function Si(s,e){if(!ps(s)||!s.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ns!==void 0?Ns.createHTML(e):e}const Mr=(s,e)=>{const t=s.length-1,i=[];let r,n=e===2?"<svg>":e===3?"<math>":"",o=ze;for(let a=0;a<t;a++){const l=s[a];let c,h,u=-1,p=0;for(;p<l.length&&(o.lastIndex=p,h=o.exec(l),h!==null);)p=o.lastIndex,o===ze?h[1]==="!--"?o=zs:h[1]!==void 0?o=qs:h[2]!==void 0?(_i.test(h[2])&&(r=RegExp("</"+h[2],"g")),o=ve):h[3]!==void 0&&(o=ve):o===ve?h[0]===">"?(o=r??ze,u=-1):h[1]===void 0?u=-2:(u=o.lastIndex-h[2].length,c=h[1],o=h[3]===void 0?ve:h[3]==='"'?Gs:Fs):o===Gs||o===Fs?o=ve:o===zs||o===qs?o=ze:(o=ve,r=void 0);const b=o===ve&&s[a+1].startsWith("/>")?" ":"";n+=o===ze?l+Lr:u>=0?(i.push(c),l.slice(0,u)+wi+l.slice(u)+fe+b):l+fe+(u===-2?a:b)}return[Si(s,n+(s[t]||"<?>")+(e===2?"</svg>":e===3?"</math>":"")),i]};class Xe{constructor({strings:e,_$litType$:t},i){let r;this.parts=[];let n=0,o=0;const a=e.length-1,l=this.parts,[c,h]=Mr(e,t);if(this.el=Xe.createElement(c,i),ke.currentNode=this.el.content,t===2||t===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(r=ke.nextNode())!==null&&l.length<a;){if(r.nodeType===1){if(r.hasAttributes())for(const u of r.getAttributeNames())if(u.endsWith(wi)){const p=h[o++],b=r.getAttribute(u).split(fe),E=/([.?@])?(.*)/.exec(p);l.push({type:1,index:n,name:E[2],strings:b,ctor:E[1]==="."?Dr:E[1]==="?"?Ur:E[1]==="@"?Nr:xt}),r.removeAttribute(u)}else u.startsWith(fe)&&(l.push({type:6,index:n}),r.removeAttribute(u));if(_i.test(r.tagName)){const u=r.textContent.split(fe),p=u.length-1;if(p>0){r.textContent=wt?wt.emptyScript:"";for(let b=0;b<p;b++)r.append(u[b],Ye()),ke.nextNode(),l.push({type:2,index:++n});r.append(u[p],Ye())}}}else if(r.nodeType===8)if(r.data===Ci)l.push({type:2,index:n});else{let u=-1;for(;(u=r.data.indexOf(fe,u+1))!==-1;)l.push({type:7,index:n}),u+=fe.length-1}n++}}static createElement(e,t){const i=xe.createElement("template");return i.innerHTML=e,i}}function Le(s,e,t=s,i){if(e===be)return e;let r=i!==void 0?t._$Co?.[i]:t._$Cl;const n=Je(e)?void 0:e._$litDirective$;return r?.constructor!==n&&(r?._$AO?.(!1),n===void 0?r=void 0:(r=new n(s),r._$AT(s,t,i)),i!==void 0?(t._$Co??=[])[i]=r:t._$Cl=r),r!==void 0&&(e=Le(s,r._$AS(s,e.values),r,i)),e}class Br{constructor(e,t){this._$AV=[],this._$AN=void 0,this._$AD=e,this._$AM=t}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(e){const{el:{content:t},parts:i}=this._$AD,r=(e?.creationScope??xe).importNode(t,!0);ke.currentNode=r;let n=ke.nextNode(),o=0,a=0,l=i[0];for(;l!==void 0;){if(o===l.index){let c;l.type===2?c=new Be(n,n.nextSibling,this,e):l.type===1?c=new l.ctor(n,l.name,l.strings,this,e):l.type===6&&(c=new zr(n,this,e)),this._$AV.push(c),l=i[++a]}o!==l?.index&&(n=ke.nextNode(),o++)}return ke.currentNode=xe,r}p(e){let t=0;for(const i of this._$AV)i!==void 0&&(i.strings!==void 0?(i._$AI(e,i,t),t+=i.strings.length-2):i._$AI(e[t])),t++}}class Be{get _$AU(){return this._$AM?._$AU??this._$Cv}constructor(e,t,i,r){this.type=2,this._$AH=T,this._$AN=void 0,this._$AA=e,this._$AB=t,this._$AM=i,this.options=r,this._$Cv=r?.isConnected??!0}get parentNode(){let e=this._$AA.parentNode;const t=this._$AM;return t!==void 0&&e?.nodeType===11&&(e=t.parentNode),e}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(e,t=this){e=Le(this,e,t),Je(e)?e===T||e==null||e===""?(this._$AH!==T&&this._$AR(),this._$AH=T):e!==this._$AH&&e!==be&&this._(e):e._$litType$!==void 0?this.$(e):e.nodeType!==void 0?this.T(e):Pr(e)?this.k(e):this._(e)}O(e){return this._$AA.parentNode.insertBefore(e,this._$AB)}T(e){this._$AH!==e&&(this._$AR(),this._$AH=this.O(e))}_(e){this._$AH!==T&&Je(this._$AH)?this._$AA.nextSibling.data=e:this.T(xe.createTextNode(e)),this._$AH=e}$(e){const{values:t,_$litType$:i}=e,r=typeof i=="number"?this._$AC(e):(i.el===void 0&&(i.el=Xe.createElement(Si(i.h,i.h[0]),this.options)),i);if(this._$AH?._$AD===r)this._$AH.p(t);else{const n=new Br(r,this),o=n.u(this.options);n.p(t),this.T(o),this._$AH=n}}_$AC(e){let t=Vs.get(e.strings);return t===void 0&&Vs.set(e.strings,t=new Xe(e)),t}k(e){ps(this._$AH)||(this._$AH=[],this._$AR());const t=this._$AH;let i,r=0;for(const n of e)r===t.length?t.push(i=new Be(this.O(Ye()),this.O(Ye()),this,this.options)):i=t[r],i._$AI(n),r++;r<t.length&&(this._$AR(i&&i._$AB.nextSibling,r),t.length=r)}_$AR(e=this._$AA.nextSibling,t){for(this._$AP?.(!1,!0,t);e!==this._$AB;){const i=Us(e).nextSibling;Us(e).remove(),e=i}}setConnected(e){this._$AM===void 0&&(this._$Cv=e,this._$AP?.(e))}}class xt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(e,t,i,r,n){this.type=1,this._$AH=T,this._$AN=void 0,this.element=e,this.name=t,this._$AM=r,this.options=n,i.length>2||i[0]!==""||i[1]!==""?(this._$AH=Array(i.length-1).fill(new String),this.strings=i):this._$AH=T}_$AI(e,t=this,i,r){const n=this.strings;let o=!1;if(n===void 0)e=Le(this,e,t,0),o=!Je(e)||e!==this._$AH&&e!==be,o&&(this._$AH=e);else{const a=e;let l,c;for(e=n[0],l=0;l<n.length-1;l++)c=Le(this,a[i+l],t,l),c===be&&(c=this._$AH[l]),o||=!Je(c)||c!==this._$AH[l],c===T?e=T:e!==T&&(e+=(c??"")+n[l+1]),this._$AH[l]=c}o&&!r&&this.j(e)}j(e){e===T?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,e??"")}}class Dr extends xt{constructor(){super(...arguments),this.type=3}j(e){this.element[this.name]=e===T?void 0:e}}class Ur extends xt{constructor(){super(...arguments),this.type=4}j(e){this.element.toggleAttribute(this.name,!!e&&e!==T)}}class Nr extends xt{constructor(e,t,i,r,n){super(e,t,i,r,n),this.type=5}_$AI(e,t=this){if((e=Le(this,e,t,0)??T)===be)return;const i=this._$AH,r=e===T&&i!==T||e.capture!==i.capture||e.once!==i.once||e.passive!==i.passive,n=e!==T&&(i===T||r);r&&this.element.removeEventListener(this.name,this,i),n&&this.element.addEventListener(this.name,this,e),this._$AH=e}handleEvent(e){typeof this._$AH=="function"?this._$AH.call(this.options?.host??this.element,e):this._$AH.handleEvent(e)}}class zr{constructor(e,t,i){this.element=e,this.type=6,this._$AN=void 0,this._$AM=t,this.options=i}get _$AU(){return this._$AM._$AU}_$AI(e){Le(this,e)}}const qr={I:Be},Fr=hs.litHtmlPolyfillSupport;Fr?.(Xe,Be),(hs.litHtmlVersions??=[]).push("3.3.2");const Gr=(s,e,t)=>{const i=t?.renderBefore??e;let r=i._$litPart$;if(r===void 0){const n=t?.renderBefore??null;i._$litPart$=r=new Be(e.insertBefore(Ye(),n),n,void 0,t??{})}return r._$AI(s),r};const fs=globalThis;let B=class extends Ie{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){const e=super.createRenderRoot();return this.renderOptions.renderBefore??=e.firstChild,e}update(e){const t=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(e),this._$Do=Gr(t,this.renderRoot,this.renderOptions)}connectedCallback(){super.connectedCallback(),this._$Do?.setConnected(!0)}disconnectedCallback(){super.disconnectedCallback(),this._$Do?.setConnected(!1)}render(){return be}};B._$litElement$=!0,B.finalized=!0,fs.litElementHydrateSupport?.({LitElement:B});const Vr=fs.litElementPolyfillSupport;Vr?.({LitElement:B});(fs.litElementVersions??=[]).push("4.2.2");const J=s=>(e,t)=>{t!==void 0?t.addInitializer(()=>{customElements.define(s,e)}):customElements.define(s,e)};const Hr={attribute:!0,type:String,converter:vt,reflect:!1,hasChanged:us},Wr=(s=Hr,e,t)=>{const{kind:i,metadata:r}=t;let n=globalThis.litPropertyMetadata.get(r);if(n===void 0&&globalThis.litPropertyMetadata.set(r,n=new Map),i==="setter"&&((s=Object.create(s)).wrapped=!0),n.set(t.name,s),i==="accessor"){const{name:o}=t;return{set(a){const l=e.get.call(this);e.set.call(this,a),this.requestUpdate(o,l,s,!0,a)},init(a){return a!==void 0&&this.C(o,void 0,s,a),a}}}if(i==="setter"){const{name:o}=t;return function(a){const l=this[o];e.call(this,a),this.requestUpdate(o,l,s,!0,a)}}throw Error("Unsupported decorator location: "+i)};function se(s){return(e,t)=>typeof t=="object"?Wr(s,e,t):((i,r,n)=>{const o=r.hasOwnProperty(n);return r.constructor.createProperty(n,i),o?Object.getOwnPropertyDescriptor(r,n):void 0})(s,e,t)}function A(s){return se({...s,state:!0,attribute:!1})}const Kr=(s,e,t)=>(t.configurable=!0,t.enumerable=!0,Reflect.decorate&&typeof e!="object"&&Object.defineProperty(s,e,t),t);function k(s,e){return(t,i,r)=>{const n=o=>o.renderRoot?.querySelector(s)??null;return Kr(t,i,{get(){return n(this)}})}}const Ei={ATTRIBUTE:1,CHILD:2},ms=s=>(...e)=>({_$litDirective$:s,values:e});let gs=class{constructor(e){}get _$AU(){return this._$AM._$AU}_$AT(e,t,i){this._$Ct=e,this._$AM=t,this._$Ci=i}_$AS(e,t){return this.update(e,t)}update(e,t){return this.render(...t)}};const ki=ms(class extends gs{constructor(s){if(super(s),s.type!==Ei.ATTRIBUTE||s.name!=="class"||s.strings?.length>2)throw Error("`classMap()` can only be used in the `class` attribute and must be the only part in the attribute.")}render(s){return" "+Object.keys(s).filter(e=>s[e]).join(" ")+" "}update(s,[e]){if(this.st===void 0){this.st=new Set,s.strings!==void 0&&(this.nt=new Set(s.strings.join(" ").split(/\s/).filter(i=>i!=="")));for(const i in e)e[i]&&!this.nt?.has(i)&&this.st.add(i);return this.render(e)}const t=s.element.classList;for(const i of this.st)i in e||(t.remove(i),this.st.delete(i));for(const i in e){const r=!!e[i];r===this.st.has(i)||this.nt?.has(i)||(r?(t.add(i),this.st.add(i)):(t.remove(i),this.st.delete(i)))}return be}}),xi={Catppuccin:"catppuccin",Dracula:"dracula",Gruvbox:"gruvbox",Dark:"dark",Light:"light",Sakura:"sakura",Matcha:"matcha",Lavender:"lavender"};class Zr{constructor(){this.listeners=new Map}on(e,t=g.Anonymous,i){this.listeners.has(e)||this.listeners.set(e,[]);const r=this.listeners.get(e);return r.push({callBack:i,subscriberName:t}),Z.log(g.Bus,`On: "${String(e)}" | Registriert von: [${t}] (Gesamt: ${r.length})`),{unsubscribe:()=>this.off(e,i)}}off(e,t){const i=this.listeners.get(e);if(!i)return;const r=i.filter(n=>n.callBack!==t);r.length===0?this.listeners.delete(e):this.listeners.set(e,r)}emit(e,t=g.Anonymous,...i){const r=i[0],n=this.listeners.get(e)||[];if(Z.log(g.Bus,`Emit: "${String(e)}" | Von: [${t}] | Empfänger: ${n.length}`),n.length===0){Z.warn(g.Bus,`[Bus]  Warnung: Niemand hört auf "${String(e)}"!`);return}[...n].forEach(o=>{Z.log(g.Bus,`==> Zustellung an: [${o.subscriberName}]`),o.callBack(r)})}once(e,t=g.Anonymous,i){const r=n=>{this.off(e,r),i(n)};this.on(e,t,r)}}const y=new Zr;function D(s,e=g.WebUI){return function(t,i,r){const n=t.connectedCallback,o=t.disconnectedCallback,a=Symbol(`sub_${i}`);t.connectedCallback=function(){n&&n.call(this);const l=r.value.bind(this);this[a]=y.on(s,e,l)},t.disconnectedCallback=function(){this[a]&&this[a].unsubscribe(),o&&o.call(this)}}}function st(s,e=g.WebUI){return function(t,i,r){const n=r.value;return r.value=function(...o){const a=n.apply(this,o);return a instanceof Promise?a.then(l=>{y.emit(s,e,a)}):y.emit(s,e,a),a},r}}function*Yr(s,e){if(s!==void 0){let t=0;for(const i of s)yield e(i,t++)}}const me={Logo:C` <svg class="logo-icon sidebar-logo" viewBox="0 0 1000 1000">
    <use href="./logo.svg#main-logo"></use>
  </svg>`,Home:C` <svg
    xmlns="http://www.w3.org/2000/svg"
    height="24"
    viewBox="0 -960 960 960"
    width="24"
    fill="currentColor"
  >
    <path d="M160-120v-480l320-240 320 240v480H520v-280h-80v280H160Z" />
  </svg>`,Lobby:C` <svg
    xmlns="http://www.w3.org/2000/svg"
    height="24"
    viewBox="0 -960 960 960"
    width="24"
    fill="currentColor"
  >
    <path
      d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h207q16 0 30.5 6t25.5 17l57 57h320q33 0 56.5 23.5T880-640v400q0 33-23.5 56.5T800-160H160Z"
    />
  </svg>`,Profile:C` <svg
    xmlns="http://www.w3.org/2000/svg"
    height="24"
    viewBox="0 -960 960 960"
    width="24"
    fill="currentColor"
  >
    <path
      d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-240v-32q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v32q0 33-23.5 56.5T720-160H240q-33 0-56.5-23.5T160-240Z"
    />
  </svg>`,Chevron:C` <svg
    xmlns="http://www.w3.org/2000/svg"
    height="24"
    viewBox="0 -960 960 960"
    width="24"
    fill="currentColor"
  >
    <path d="M480-345 240-585l56-56 184 184 184-184 56 56-240 240Z" />
  </svg>`,Toggle:C` <svg
    xmlns="http://www.w3.org/2000/svg"
    height="24"
    viewBox="0 -960 960 960"
    width="24"
    fill="none"
  >
    <path
      d="M440-240 200-480l240-240 56 56-183 184 183 184-56 56Zm264 0L464-480l240-240 56 56-183 184 183 184-56 56Z"
    />
  </svg>`,Browser:C` <svg
    width="800px"
    height="800px"
    viewBox="0 0 192 192"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
  >
    <circle cx="96" cy="96" r="74" stroke="#000000" stroke-width="12" />
    <ellipse
      cx="96"
      cy="96"
      stroke="#000000"
      stroke-width="12"
      rx="30"
      ry="74"
    />
    <path
      stroke="#000000"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="12"
      d="M28 72h136M28 120h136"
    />
  </svg>`,Settings:C`<svg
    width="800px"
    height="800px"
    viewBox="-2.4 -2.4 28.80 28.80"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    stroke="#000000"
    stroke-width="0.00024000000000000003"
  >
    <g
      id="SVGRepo_bgCarrier"
      stroke-width="0"
      transform="translate(0,0), scale(1)"
    >
      <rect
        x="-2.4"
        y="-2.4"
        width="28.80"
        height="28.80"
        rx="14.4"
        fill="#ffffff"
        strokewidth="0"
      />
    </g>

    <g
      id="SVGRepo_tracerCarrier"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke="#ffffff"
      stroke-width="2.976"
    >
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M12 8.25C9.92894 8.25 8.25 9.92893 8.25 12C8.25 14.0711 9.92894 15.75 12 15.75C14.0711 15.75 15.75 14.0711 15.75 12C15.75 9.92893 14.0711 8.25 12 8.25ZM9.75 12C9.75 10.7574 10.7574 9.75 12 9.75C13.2426 9.75 14.25 10.7574 14.25 12C14.25 13.2426 13.2426 14.25 12 14.25C10.7574 14.25 9.75 13.2426 9.75 12Z"
        fill="#000000"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M11.9747 1.25C11.5303 1.24999 11.1592 1.24999 10.8546 1.27077C10.5375 1.29241 10.238 1.33905 9.94761 1.45933C9.27379 1.73844 8.73843 2.27379 8.45932 2.94762C8.31402 3.29842 8.27467 3.66812 8.25964 4.06996C8.24756 4.39299 8.08454 4.66251 7.84395 4.80141C7.60337 4.94031 7.28845 4.94673 7.00266 4.79568C6.64714 4.60777 6.30729 4.45699 5.93083 4.40743C5.20773 4.31223 4.47642 4.50819 3.89779 4.95219C3.64843 5.14353 3.45827 5.3796 3.28099 5.6434C3.11068 5.89681 2.92517 6.21815 2.70294 6.60307L2.67769 6.64681C2.45545 7.03172 2.26993 7.35304 2.13562 7.62723C1.99581 7.91267 1.88644 8.19539 1.84541 8.50701C1.75021 9.23012 1.94617 9.96142 2.39016 10.5401C2.62128 10.8412 2.92173 11.0602 3.26217 11.2741C3.53595 11.4461 3.68788 11.7221 3.68786 12C3.68785 12.2778 3.53592 12.5538 3.26217 12.7258C2.92169 12.9397 2.62121 13.1587 2.39007 13.4599C1.94607 14.0385 1.75012 14.7698 1.84531 15.4929C1.88634 15.8045 1.99571 16.0873 2.13552 16.3727C2.26983 16.6469 2.45535 16.9682 2.67758 17.3531L2.70284 17.3969C2.92507 17.7818 3.11058 18.1031 3.28089 18.3565C3.45817 18.6203 3.64833 18.8564 3.89769 19.0477C4.47632 19.4917 5.20763 19.6877 5.93073 19.5925C6.30717 19.5429 6.647 19.3922 7.0025 19.2043C7.28833 19.0532 7.60329 19.0596 7.8439 19.1986C8.08452 19.3375 8.24756 19.607 8.25964 19.9301C8.27467 20.3319 8.31403 20.7016 8.45932 21.0524C8.73843 21.7262 9.27379 22.2616 9.94761 22.5407C10.238 22.661 10.5375 22.7076 10.8546 22.7292C11.1592 22.75 11.5303 22.75 11.9747 22.75H12.0252C12.4697 22.75 12.8407 22.75 13.1454 22.7292C13.4625 22.7076 13.762 22.661 14.0524 22.5407C14.7262 22.2616 15.2616 21.7262 15.5407 21.0524C15.686 20.7016 15.7253 20.3319 15.7403 19.93C15.7524 19.607 15.9154 19.3375 16.156 19.1985C16.3966 19.0596 16.7116 19.0532 16.9974 19.2042C17.3529 19.3921 17.6927 19.5429 18.0692 19.5924C18.7923 19.6876 19.5236 19.4917 20.1022 19.0477C20.3516 18.8563 20.5417 18.6203 20.719 18.3565C20.8893 18.1031 21.0748 17.7818 21.297 17.3969L21.3223 17.3531C21.5445 16.9682 21.7301 16.6468 21.8644 16.3726C22.0042 16.0872 22.1135 15.8045 22.1546 15.4929C22.2498 14.7697 22.0538 14.0384 21.6098 13.4598C21.3787 13.1586 21.0782 12.9397 20.7378 12.7258C20.464 12.5538 20.3121 12.2778 20.3121 11.9999C20.3121 11.7221 20.464 11.4462 20.7377 11.2742C21.0783 11.0603 21.3788 10.8414 21.6099 10.5401C22.0539 9.96149 22.2499 9.23019 22.1547 8.50708C22.1136 8.19546 22.0043 7.91274 21.8645 7.6273C21.7302 7.35313 21.5447 7.03183 21.3224 6.64695L21.2972 6.60318C21.0749 6.21825 20.8894 5.89688 20.7191 5.64347C20.5418 5.37967 20.3517 5.1436 20.1023 4.95225C19.5237 4.50826 18.7924 4.3123 18.0692 4.4075C17.6928 4.45706 17.353 4.60782 16.9975 4.79572C16.7117 4.94679 16.3967 4.94036 16.1561 4.80144C15.9155 4.66253 15.7524 4.39297 15.7403 4.06991C15.7253 3.66808 15.686 3.2984 15.5407 2.94762C15.2616 2.27379 14.7262 1.73844 14.0524 1.45933C13.762 1.33905 13.4625 1.29241 13.1454 1.27077C12.8407 1.24999 12.4697 1.24999 12.0252 1.25H11.9747ZM10.5216 2.84515C10.5988 2.81319 10.716 2.78372 10.9567 2.76729C11.2042 2.75041 11.5238 2.75 12 2.75C12.4762 2.75 12.7958 2.75041 13.0432 2.76729C13.284 2.78372 13.4012 2.81319 13.4783 2.84515C13.7846 2.97202 14.028 3.21536 14.1548 3.52165C14.1949 3.61826 14.228 3.76887 14.2414 4.12597C14.271 4.91835 14.68 5.68129 15.4061 6.10048C16.1321 6.51968 16.9974 6.4924 17.6984 6.12188C18.0143 5.9549 18.1614 5.90832 18.265 5.89467C18.5937 5.8514 18.9261 5.94047 19.1891 6.14228C19.2554 6.19312 19.3395 6.27989 19.4741 6.48016C19.6125 6.68603 19.7726 6.9626 20.0107 7.375C20.2488 7.78741 20.4083 8.06438 20.5174 8.28713C20.6235 8.50382 20.6566 8.62007 20.6675 8.70287C20.7108 9.03155 20.6217 9.36397 20.4199 9.62698C20.3562 9.70995 20.2424 9.81399 19.9397 10.0041C19.2684 10.426 18.8122 11.1616 18.8121 11.9999C18.8121 12.8383 19.2683 13.574 19.9397 13.9959C20.2423 14.186 20.3561 14.29 20.4198 14.373C20.6216 14.636 20.7107 14.9684 20.6674 15.2971C20.6565 15.3799 20.6234 15.4961 20.5173 15.7128C20.4082 15.9355 20.2487 16.2125 20.0106 16.6249C19.7725 17.0373 19.6124 17.3139 19.474 17.5198C19.3394 17.72 19.2553 17.8068 19.189 17.8576C18.926 18.0595 18.5936 18.1485 18.2649 18.1053C18.1613 18.0916 18.0142 18.045 17.6983 17.8781C16.9973 17.5075 16.132 17.4803 15.4059 17.8995C14.68 18.3187 14.271 19.0816 14.2414 19.874C14.228 20.2311 14.1949 20.3817 14.1548 20.4784C14.028 20.7846 13.7846 21.028 13.4783 21.1549C13.4012 21.1868 13.284 21.2163 13.0432 21.2327C12.7958 21.2496 12.4762 21.25 12 21.25C11.5238 21.25 11.2042 21.2496 10.9567 21.2327C10.716 21.2163 10.5988 21.1868 10.5216 21.1549C10.2154 21.028 9.97201 20.7846 9.84514 20.4784C9.80512 20.3817 9.77195 20.2311 9.75859 19.874C9.72896 19.0817 9.31997 18.3187 8.5939 17.8995C7.86784 17.4803 7.00262 17.5076 6.30158 17.8781C5.98565 18.0451 5.83863 18.0917 5.73495 18.1053C5.40626 18.1486 5.07385 18.0595 4.81084 17.8577C4.74458 17.8069 4.66045 17.7201 4.52586 17.5198C4.38751 17.314 4.22736 17.0374 3.98926 16.625C3.75115 16.2126 3.59171 15.9356 3.4826 15.7129C3.37646 15.4962 3.34338 15.3799 3.33248 15.2971C3.28921 14.9684 3.37828 14.636 3.5801 14.373C3.64376 14.2901 3.75761 14.186 4.0602 13.9959C4.73158 13.5741 5.18782 12.8384 5.18786 12.0001C5.18791 11.1616 4.73165 10.4259 4.06021 10.004C3.75769 9.81389 3.64385 9.70987 3.58019 9.62691C3.37838 9.3639 3.28931 9.03149 3.33258 8.7028C3.34348 8.62001 3.37656 8.50375 3.4827 8.28707C3.59181 8.06431 3.75125 7.78734 3.98935 7.37493C4.22746 6.96253 4.3876 6.68596 4.52596 6.48009C4.66055 6.27983 4.74468 6.19305 4.81093 6.14222C5.07395 5.9404 5.40636 5.85133 5.73504 5.8946C5.83873 5.90825 5.98576 5.95483 6.30173 6.12184C7.00273 6.49235 7.86791 6.51962 8.59394 6.10045C9.31998 5.68128 9.72896 4.91837 9.75859 4.12602C9.77195 3.76889 9.80512 3.61827 9.84514 3.52165C9.97201 3.21536 10.2154 2.97202 10.5216 2.84515Z"
        fill="#000000"
      />
    </g>

    <g id="SVGRepo_iconCarrier">
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M12 8.25C9.92894 8.25 8.25 9.92893 8.25 12C8.25 14.0711 9.92894 15.75 12 15.75C14.0711 15.75 15.75 14.0711 15.75 12C15.75 9.92893 14.0711 8.25 12 8.25ZM9.75 12C9.75 10.7574 10.7574 9.75 12 9.75C13.2426 9.75 14.25 10.7574 14.25 12C14.25 13.2426 13.2426 14.25 12 14.25C10.7574 14.25 9.75 13.2426 9.75 12Z"
        fill="#000000"
      />
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M11.9747 1.25C11.5303 1.24999 11.1592 1.24999 10.8546 1.27077C10.5375 1.29241 10.238 1.33905 9.94761 1.45933C9.27379 1.73844 8.73843 2.27379 8.45932 2.94762C8.31402 3.29842 8.27467 3.66812 8.25964 4.06996C8.24756 4.39299 8.08454 4.66251 7.84395 4.80141C7.60337 4.94031 7.28845 4.94673 7.00266 4.79568C6.64714 4.60777 6.30729 4.45699 5.93083 4.40743C5.20773 4.31223 4.47642 4.50819 3.89779 4.95219C3.64843 5.14353 3.45827 5.3796 3.28099 5.6434C3.11068 5.89681 2.92517 6.21815 2.70294 6.60307L2.67769 6.64681C2.45545 7.03172 2.26993 7.35304 2.13562 7.62723C1.99581 7.91267 1.88644 8.19539 1.84541 8.50701C1.75021 9.23012 1.94617 9.96142 2.39016 10.5401C2.62128 10.8412 2.92173 11.0602 3.26217 11.2741C3.53595 11.4461 3.68788 11.7221 3.68786 12C3.68785 12.2778 3.53592 12.5538 3.26217 12.7258C2.92169 12.9397 2.62121 13.1587 2.39007 13.4599C1.94607 14.0385 1.75012 14.7698 1.84531 15.4929C1.88634 15.8045 1.99571 16.0873 2.13552 16.3727C2.26983 16.6469 2.45535 16.9682 2.67758 17.3531L2.70284 17.3969C2.92507 17.7818 3.11058 18.1031 3.28089 18.3565C3.45817 18.6203 3.64833 18.8564 3.89769 19.0477C4.47632 19.4917 5.20763 19.6877 5.93073 19.5925C6.30717 19.5429 6.647 19.3922 7.0025 19.2043C7.28833 19.0532 7.60329 19.0596 7.8439 19.1986C8.08452 19.3375 8.24756 19.607 8.25964 19.9301C8.27467 20.3319 8.31403 20.7016 8.45932 21.0524C8.73843 21.7262 9.27379 22.2616 9.94761 22.5407C10.238 22.661 10.5375 22.7076 10.8546 22.7292C11.1592 22.75 11.5303 22.75 11.9747 22.75H12.0252C12.4697 22.75 12.8407 22.75 13.1454 22.7292C13.4625 22.7076 13.762 22.661 14.0524 22.5407C14.7262 22.2616 15.2616 21.7262 15.5407 21.0524C15.686 20.7016 15.7253 20.3319 15.7403 19.93C15.7524 19.607 15.9154 19.3375 16.156 19.1985C16.3966 19.0596 16.7116 19.0532 16.9974 19.2042C17.3529 19.3921 17.6927 19.5429 18.0692 19.5924C18.7923 19.6876 19.5236 19.4917 20.1022 19.0477C20.3516 18.8563 20.5417 18.6203 20.719 18.3565C20.8893 18.1031 21.0748 17.7818 21.297 17.3969L21.3223 17.3531C21.5445 16.9682 21.7301 16.6468 21.8644 16.3726C22.0042 16.0872 22.1135 15.8045 22.1546 15.4929C22.2498 14.7697 22.0538 14.0384 21.6098 13.4598C21.3787 13.1586 21.0782 12.9397 20.7378 12.7258C20.464 12.5538 20.3121 12.2778 20.3121 11.9999C20.3121 11.7221 20.464 11.4462 20.7377 11.2742C21.0783 11.0603 21.3788 10.8414 21.6099 10.5401C22.0539 9.96149 22.2499 9.23019 22.1547 8.50708C22.1136 8.19546 22.0043 7.91274 21.8645 7.6273C21.7302 7.35313 21.5447 7.03183 21.3224 6.64695L21.2972 6.60318C21.0749 6.21825 20.8894 5.89688 20.7191 5.64347C20.5418 5.37967 20.3517 5.1436 20.1023 4.95225C19.5237 4.50826 18.7924 4.3123 18.0692 4.4075C17.6928 4.45706 17.353 4.60782 16.9975 4.79572C16.7117 4.94679 16.3967 4.94036 16.1561 4.80144C15.9155 4.66253 15.7524 4.39297 15.7403 4.06991C15.7253 3.66808 15.686 3.2984 15.5407 2.94762C15.2616 2.27379 14.7262 1.73844 14.0524 1.45933C13.762 1.33905 13.4625 1.29241 13.1454 1.27077C12.8407 1.24999 12.4697 1.24999 12.0252 1.25H11.9747ZM10.5216 2.84515C10.5988 2.81319 10.716 2.78372 10.9567 2.76729C11.2042 2.75041 11.5238 2.75 12 2.75C12.4762 2.75 12.7958 2.75041 13.0432 2.76729C13.284 2.78372 13.4012 2.81319 13.4783 2.84515C13.7846 2.97202 14.028 3.21536 14.1548 3.52165C14.1949 3.61826 14.228 3.76887 14.2414 4.12597C14.271 4.91835 14.68 5.68129 15.4061 6.10048C16.1321 6.51968 16.9974 6.4924 17.6984 6.12188C18.0143 5.9549 18.1614 5.90832 18.265 5.89467C18.5937 5.8514 18.9261 5.94047 19.1891 6.14228C19.2554 6.19312 19.3395 6.27989 19.4741 6.48016C19.6125 6.68603 19.7726 6.9626 20.0107 7.375C20.2488 7.78741 20.4083 8.06438 20.5174 8.28713C20.6235 8.50382 20.6566 8.62007 20.6675 8.70287C20.7108 9.03155 20.6217 9.36397 20.4199 9.62698C20.3562 9.70995 20.2424 9.81399 19.9397 10.0041C19.2684 10.426 18.8122 11.1616 18.8121 11.9999C18.8121 12.8383 19.2683 13.574 19.9397 13.9959C20.2423 14.186 20.3561 14.29 20.4198 14.373C20.6216 14.636 20.7107 14.9684 20.6674 15.2971C20.6565 15.3799 20.6234 15.4961 20.5173 15.7128C20.4082 15.9355 20.2487 16.2125 20.0106 16.6249C19.7725 17.0373 19.6124 17.3139 19.474 17.5198C19.3394 17.72 19.2553 17.8068 19.189 17.8576C18.926 18.0595 18.5936 18.1485 18.2649 18.1053C18.1613 18.0916 18.0142 18.045 17.6983 17.8781C16.9973 17.5075 16.132 17.4803 15.4059 17.8995C14.68 18.3187 14.271 19.0816 14.2414 19.874C14.228 20.2311 14.1949 20.3817 14.1548 20.4784C14.028 20.7846 13.7846 21.028 13.4783 21.1549C13.4012 21.1868 13.284 21.2163 13.0432 21.2327C12.7958 21.2496 12.4762 21.25 12 21.25C11.5238 21.25 11.2042 21.2496 10.9567 21.2327C10.716 21.2163 10.5988 21.1868 10.5216 21.1549C10.2154 21.028 9.97201 20.7846 9.84514 20.4784C9.80512 20.3817 9.77195 20.2311 9.75859 19.874C9.72896 19.0817 9.31997 18.3187 8.5939 17.8995C7.86784 17.4803 7.00262 17.5076 6.30158 17.8781C5.98565 18.0451 5.83863 18.0917 5.73495 18.1053C5.40626 18.1486 5.07385 18.0595 4.81084 17.8577C4.74458 17.8069 4.66045 17.7201 4.52586 17.5198C4.38751 17.314 4.22736 17.0374 3.98926 16.625C3.75115 16.2126 3.59171 15.9356 3.4826 15.7129C3.37646 15.4962 3.34338 15.3799 3.33248 15.2971C3.28921 14.9684 3.37828 14.636 3.5801 14.373C3.64376 14.2901 3.75761 14.186 4.0602 13.9959C4.73158 13.5741 5.18782 12.8384 5.18786 12.0001C5.18791 11.1616 4.73165 10.4259 4.06021 10.004C3.75769 9.81389 3.64385 9.70987 3.58019 9.62691C3.37838 9.3639 3.28931 9.03149 3.33258 8.7028C3.34348 8.62001 3.37656 8.50375 3.4827 8.28707C3.59181 8.06431 3.75125 7.78734 3.98935 7.37493C4.22746 6.96253 4.3876 6.68596 4.52596 6.48009C4.66055 6.27983 4.74468 6.19305 4.81093 6.14222C5.07395 5.9404 5.40636 5.85133 5.73504 5.8946C5.83873 5.90825 5.98576 5.95483 6.30173 6.12184C7.00273 6.49235 7.86791 6.51962 8.59394 6.10045C9.31998 5.68128 9.72896 4.91837 9.75859 4.12602C9.77195 3.76889 9.80512 3.61827 9.84514 3.52165C9.97201 3.21536 10.2154 2.97202 10.5216 2.84515Z"
        fill="#000000"
      />
    </g>
  </svg>`};var Jr=Object.defineProperty,Xr=Object.getOwnPropertyDescriptor,it=(s,e,t,i)=>{for(var r=i>1?void 0:i?Xr(e,t):e,n=s.length-1,o;n>=0;n--)(o=s[n])&&(r=(i?o(e,t,r):o(r))||r);return i&&r&&Jr(e,t,r),r};const Qr=[{id:"game",label:"Spiel",icon:me.Home},{id:"lobby",label:"Lobby",icon:me.Lobby,children:[{id:"lobby-browser",label:"Lobby Liste",icon:me.Browser,dialog:"browser-dialog"},{id:"lobby-settings",label:"Einstellungen",icon:me.Settings,dialog:"lobby-dialog"}]},{id:"profile",label:"Profil",icon:me.Profile,dialog:"profile-dialog"}];let $e=class extends B{constructor(){super(...arguments),this.collapsed=!1,this.openDropdown=null,this.activeTab="game"}requestDialog(s){return s}handleNav(s){this.collapsed&&this.toggleCollapse(!1),s.children?this.openDropdown=this.openDropdown===s.id?null:s.id:(this.activeTab=s.id,s.dialog&&this.requestDialog(s.dialog))}toggleCollapse(s){this.collapsed=s!==void 0?s:!this.collapsed,this.collapsed?this.setAttribute("collapsed",""):this.removeAttribute("collapsed")}renderMenuItem(s,e=!1){const t=this.activeTab===s.id,i=!!s.children,r=this.openDropdown===s.id;return C`
      <div
        class="menu-item ${e?"sub-item":""} ${t?"active":""}"
        @click="${()=>this.handleNav(s)}"
      >
        ${s.icon?C`<span class="icon">${s.icon}</span>`:""}
        <span class="label">${s.label}</span>
        ${i?C`<span class="chevron ${r?"open":""}"
              >${me.Chevron}</span
            >`:""}
      </div>
      ${i?C`<div class="sub-menu ${r?"show":""}">
            <div class="sub-menu-inner">
              ${s.children.map(n=>this.renderMenuItem(n,!0))}
            </div>
          </div>`:""}
    `}render(){return C`
      <nav>
        <div class="header">
          <span class="icon">${me.Logo}</span>
          <button class="toggle-btn" @click="${()=>this.toggleCollapse()}">
            ${me.Toggle}
          </button>
        </div>
        ${Yr(Qr,s=>this.renderMenuItem(s))}
      </nav>
    `}};$e.styles=te`
    :host {
      --sidebar-width: 14rem;
      --sidebar-collapsed-width: 4rem;
      --anim-speed: 300ms;

      display: flex;
      flex-direction: column;
      width: var(--sidebar-width);
      height: 100dvh;
      padding: 0.5rem;
      background-color: var(--cell-bg, #1a1a1a);
      border-right: 1px solid var(--border-color, #333);
      transition: width var(--anim-speed) ease-in-out;
      box-sizing: border-box;
      overflow-x: hidden;
      overflow-y: auto;
      white-space: nowrap;
      flex-shrink: 0;
      z-index: 200;
    }

    :host([collapsed]) {
      width: var(--sidebar-collapsed-width);
    }

    nav {
      display: flex;
      flex-direction: column;
      height: 100%;
      gap: 0.25rem;
    }

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
      padding: 0 0.5rem;
    }

    .icon {
      flex-shrink: 0;
      width: 1.25rem;
      height: 1.25rem;
      fill: var(--text-main, #fff);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .menu-item {
      border-radius: 0.5rem;
      padding: 0.5rem;
      color: var(--text-main, #fff);
      display: flex;
      align-items: center;
      gap: 0.75rem;
      cursor: pointer;
      transition:
        background-color 0.2s,
        color 0.2s;
      user-select: none;
      overflow: hidden;
    }

    .menu-item:hover {
      background-color: var(--cell-hover, rgba(255, 255, 255, 0.1));
    }
    .menu-item.active {
      color: var(--primary-accent, #007bff);
      background-color: color-mix(
        in srgb,
        var(--primary-accent) 15%,
        transparent
      );
    }
    .menu-item.active .icon {
      fill: var(--primary-accent, #007bff);
    }

    .label {
      flex-grow: 1;
      opacity: 1;
      max-width: 10rem;
      transition:
        opacity var(--anim-speed),
        max-width var(--anim-speed);
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 0.9rem;
    }

    .sub-menu {
      display: grid;
      grid-template-rows: 0fr;
      opacity: 0;
      transition:
        grid-template-rows var(--anim-speed) ease,
        opacity var(--anim-speed) ease;
    }
    .sub-menu.show {
      grid-template-rows: 1fr;
      opacity: 1;
    }
    .sub-menu-inner {
      overflow: hidden;
      display: flex;
      flex-direction: column;
      gap: 0.125rem;
    }
    .sub-item {
      padding-left: 2.5rem;
      font-size: 0.8rem;
      opacity: 0.8;
    }

    .chevron {
      display: flex;
      flex-shrink: 0;
      transition:
        transform var(--anim-speed) ease,
        opacity var(--anim-speed);
    }
    .chevron.open {
      transform: rotate(180deg);
    }

    button.toggle-btn {
      background: transparent;
      border: none;
      color: var(--text-main);
      cursor: pointer;
      padding: 0.25rem;
      border-radius: 0.25rem;
      display: flex;
      align-items: center;
      flex-shrink: 0;
    }
    button.toggle-btn:hover {
      background-color: var(--cell-hover);
    }

    :host([collapsed]) .label,
    :host([collapsed]) .chevron {
      opacity: 0;
      max-width: 0;
      margin: 0;
    }
    :host([collapsed]) .sub-menu {
      display: none;
    }
    :host([collapsed]) button.toggle-btn svg {
      transform: rotate(180deg);
    }

    /* --- MOBILE --- */
    @media (max-width: 37.5rem) {
      :host {
        width: 100%;
        height: 3.5rem;
        bottom: 0;
        top: auto;
        position: fixed;
        border-right: none;
        border-top: 0.5px solid var(--border-color);
        padding: 0;
        flex-direction: row;
        z-index: 1000;
        overflow-y: visible;
      }
      nav {
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        width: 100%;
        height: 100%;
        padding: 0;
        gap: 0;
      }
      .header {
        display: none;
      }
      .menu-item {
        flex-direction: column;
        gap: 0.15rem;
        border-radius: 0;
        padding: 0;
        justify-content: center;
        align-items: center;
        flex: 1;
        min-width: 0;
        height: 70%;
      }
      .icon {
        width: 1.1rem;
        height: 1.1rem;
      }
      .icon svg {
        transform: scale(1);
      }
      .label {
        font-size: 0.65rem;
        display: block;
        max-width: 100%;
        opacity: 1;
        text-align: center;
      }
      .sub-menu {
        position: absolute;
        bottom: 3.5rem;
        left: 0;
        width: 100%;
        background: var(--cell-bg, #1a1a1a);
        border-top: 1px solid var(--border-color);
        box-shadow: 0 -4px 10px rgba(0, 0, 0, 0.2);
      }
      .sub-menu.show {
        display: block;
      }
      .sub-item {
        padding: 0.75rem;
        justify-content: center;
        border-bottom: 1px solid var(--border-color);
        font-size: 0.85rem;
      }
      .chevron {
        display: none !important;
      }
    }
  `;it([A()],$e.prototype,"collapsed",2);it([A()],$e.prototype,"openDropdown",2);it([A()],$e.prototype,"activeTab",2);it([st(f.UI.DialogOpenRequested,g.WebUI)],$e.prototype,"requestDialog",1);$e=it([J("side-bar")],$e);function ue(s){if([...new Intl.Segmenter().segment(s)].length!==1)throw new Error(`Invalides symbol:${s} es darf nur eine anzeige length von 1 haben`);return s}ue("X");const ht={Easy:"easy",Medium:"medium",Hard:"hard"},ee={Horizontal:"horizontal",Vertical:"vertical",DiagonalMain:"diag-main",DiagonalAnti:"diag-anti",Draw:"draw"},Zt={Local:"local",Bot:"bot"},re={SUCCESS:"SUCCESS",OCCUPIED:"OCCUPIED",GAME_OVER:"GAME_OVER"};class V{constructor(e=Zt.Local,t=3,i=3,r=ht.Medium,n=!1,o=!1,a=0){this.mode=e,this.boardSize=t,this.winCon=i,this.difficulty=r,this.gravityEnabled=n,this.rotationEnabled=o,this.moveTimeoutMs=a,this.fixInvalidValues()}isValid(){return this.winCon<=this.boardSize}fixInvalidValues(){this.isValid()||(this.winCon=this.boardSize),(!Number.isInteger(this.moveTimeoutMs)||this.moveTimeoutMs<0)&&(this.moveTimeoutMs=0)}}var en=Object.getOwnPropertyDescriptor,tn=(s,e,t,i)=>{for(var r=i>1?void 0:i?en(e,t):e,n=s.length-1,o;n>=0;n--)(o=s[n])&&(r=o(r)||r);return r};let Yt=class extends B{render(){return C`
      <svg viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
        <g transform="matrix(1.876138,0,0,1.876138,-34.699454,-18.752277)">
          <path
            fill="var(--logo-base, currentColor)"
            d="M255.263,375.624C253.687,375.639 253.765,375.994 253.525,377.522C251.486,390.493 237.538,409.464 226.199,417.063C166.914,456.798 99.227,405.797 109.229,344.448C117.722,292.354 173.506,273.126 207.46,286.603C270.828,311.754 251.744,375.636 258.822,356.721C261.372,349.905 265.6,347.548 264.205,345.68C255.598,334.153 252.235,334.293 251.785,290.492C251.766,288.562 251.599,272.379 268.52,273.107C289.582,274.012 282.346,301.774 284.943,318.403C285.586,322.526 291.366,330.3 300.529,328.656C314.094,326.221 311.611,313.037 311.014,290.51C310.358,265.739 332.971,269.299 339.271,276.692C345.39,283.871 344.04,319.759 342.031,327.386C338.148,342.124 331.311,342.495 334.576,346.437C345.79,359.974 345.463,369.093 345.957,389.487C346.044,393.075 350.283,417.568 332.542,418.843C311.132,420.381 314.232,397.644 314.015,389.51C313.878,384.334 316.472,359.786 297.52,362.614C282.304,364.884 287.143,383.888 287.138,404.494C287.136,417.846 275.556,420.52 272.52,420.714C248.822,422.224 255.421,389.663 255.263,375.624L214.012,385.066C216.305,382.357 230.992,365.004 221.789,341.386C206.84,303.026 155.289,309.943 143.894,339.66C126.059,386.173 182.439,418.62 214.012,385.066L255.263,375.624Z"
          />
          <path
            fill="var(--logo-base, currentColor)"
            d="M229.984,139.991C264.687,108.755 312.875,115.803 339.049,147.87C370.514,186.418 352.228,245.404 311.334,262.092C251.573,286.48 199.329,236.239 207.422,183.491C211.014,160.076 221.11,149.248 229.984,139.991L252.027,224.984C291.098,257.403 336.332,215.198 319.264,176.601C302.634,138.993 238.275,144.588 238.922,196.469C239.109,211.463 250.292,223.169 252.027,224.984L229.984,139.991Z"
          />
          <path
            fill="var(--logo-base, currentColor)"
            d="M196.014,272.004C185.24,280.121 171.545,277.861 168.366,261.526C164.798,243.196 165.923,224.187 149.465,225.173C135.001,226.038 137.479,241.739 137.75,243.454C140.966,263.824 148.014,283.143 128.452,286.205C110.653,288.99 110.063,272.278 106.253,249.545C101.508,221.223 115.057,217.164 110.218,212.817C97.823,201.681 96.862,195.193 91.223,161.55C90.877,159.486 87.892,141.674 106.492,140.303C134.322,138.252 114.858,194.36 141.489,192.379C159.947,191.007 152.174,166.883 151.277,161.541C150.342,155.972 143.054,133.06 163.494,130.449C180.952,128.22 181.537,147.642 184.815,167.443C189.901,198.165 175.964,200.11 180.59,204.407C193.608,216.501 193.991,221.176 199.684,254.466C201.514,265.165 199.664,267.421 196.014,272.004Z"
          />
          <path
            fill="var(--logo-base, currentColor)"
            d="M233.967,191.518C234.397,184.855 234.481,184.925 236.234,178.419C239.392,166.696 254.568,150.681 270.45,148.213C320.408,140.452 334.36,187.78 325.276,210.42C305.482,259.751 232.667,247.34 233.967,191.518L252.027,224.984C291.098,257.403 336.332,215.198 319.264,176.601C302.634,138.993 238.275,144.588 238.922,196.469C239.109,211.463 250.292,223.169 252.027,224.984L233.967,191.518Z"
          />
          fill="var(--logo-base, currentColor)"
          <path
            d="M178.528,309.954C180.562,309.943 195.089,309.867 203.557,314.399C204.864,315.098 213.097,319.503 218.238,325.705C245.972,359.159 219.752,405.9 180.49,403.872C144.134,401.994 130.002,365.677 137.268,343.419C147.551,311.917 174.751,310.622 178.528,309.954L214.012,385.066C216.305,382.357 230.992,365.004 221.789,341.386C206.84,303.026 155.289,309.943 143.894,339.66C126.059,386.173 182.439,418.62 214.012,385.066L178.528,309.954Z"
          />
          <path
            fill="var(--logo-red, #fe0000)"
            d="M286.536,262.963C211.967,267.934 184.264,173.466 244.755,134.899C283.119,110.438 346.874,132.792 349.853,190.474C352.037,232.752 319.574,251.74 317.771,252.91C303.108,262.424 288.026,262.771 286.536,262.963L252.027,224.984C291.098,257.403 336.332,215.198 319.264,176.601C302.634,138.993 238.275,144.588 238.922,196.469C239.109,211.463 250.292,223.169 252.027,224.984L286.536,262.963Z"
          />
          <path
            fill="var(--logo-red, #fe0000)"
            d="M191.541,288.045C276.69,302.033 270.043,424.323 180.503,425.909C144.467,426.547 107.781,391.096 113.963,346.559C118.446,314.264 147.217,286.443 185.498,287.616C187.516,287.678 189.522,287.984 191.541,288.045L214.012,385.066C216.305,382.357 230.992,365.004 221.789,341.386C206.84,303.026 155.289,309.943 143.894,339.66C126.059,386.173 182.439,418.62 214.012,385.066L191.541,288.045Z"
          />
          <path
            fill="var(--logo-green, #1eb100)"
            d="M319.035,390.512C318.442,378.587 320.15,368.798 312.21,361.841C307.14,357.398 299.486,356.278 293.49,358.473C276.188,364.809 282.644,385.3 282.105,405.476C281.835,415.562 268.694,418.981 262.778,412.26C260.932,410.163 259.852,408.936 259.371,377.499C259.068,357.62 270.693,349.492 270.631,346.497C270.491,339.779 258.721,343.096 257.338,311.506C256.341,288.732 255.563,278.636 266.467,278.147C282.054,277.447 278.391,293.639 279.471,314.501C280.364,331.748 294.457,335.325 302.463,333.352C322.242,328.478 315.532,305.368 315.922,287.507C316.219,273.889 337.206,269.441 338.006,289.511C339.524,327.605 337.663,330.357 328.808,341.73C322.642,349.651 339.298,347.886 340.648,377.495C341.984,406.82 341.589,412.755 332.547,413.783C317.042,415.545 319.173,399.246 319.035,390.512Z"
          />
          <path
            fill="var(--logo-green, #1eb100)"
            d="M154.039,146.516C154.139,145.239 154.871,135.884 165.499,135.325C174.139,134.871 176.06,146.256 176.277,147.541C181.928,181.036 183.994,183.218 174.692,200.608C170.146,209.105 186.341,207.003 191.037,233.575C195.884,261.001 197.857,268.97 187.398,271.055C170.909,274.342 173.285,254.716 168.746,234.434C166.506,224.422 155.824,218.548 147.478,220.391C113.443,227.908 151.35,273.723 129.598,280.826C115.084,285.566 114.497,268.126 111.985,253.425C106.5,221.331 116.513,222.502 117.573,214.511C118.493,207.574 105.212,212.609 99.766,181.451C96.056,160.225 92.714,149.758 101.502,146.505C119.702,139.77 117.879,161.412 122.262,182.558C125.234,196.899 140.602,200.252 149.374,195.262C166.066,185.768 155.913,167.615 154.039,146.516Z"
          />
          <path
            fill="var(--logo-blue, #0010e8)"
            d="M474.106,323.107C467.197,329.985 452.988,331.683 444.441,323.561C425.031,305.114 447.802,276.588 470.27,288.917C474.567,291.275 488.862,305.941 474.106,323.107L452.097,313.892C466.391,326.708 476.064,300.017 459.47,297.861C453.641,297.104 444.578,306.15 452.097,313.892L474.106,323.107Z"
          />
          <path
            fill="var(--logo-blue, #0010e8)"
            d="M413.11,315.899C424.414,326.105 435.096,315.17 434.851,327.523C434.643,337.994 406.602,333.133 398.93,317.284C386.573,291.754 410.905,270.076 424.521,273.427C429.263,274.594 429.077,283.357 423.524,284.595C405.649,288.578 403.204,305.913 413.11,315.899Z"
          />
          <path
            fill="var(--logo-blue, #0010e8)"
            d="M414.331,252.587C414.27,251.171 413.992,251.217 414.436,246.474C414.516,245.619 415.077,239.629 421.469,238.357C430.041,236.65 428.408,243.219 426.573,243.694C425.534,243.962 424.434,243.935 423.397,244.21C421.448,244.727 416.85,249.436 422.326,252.855C431.25,258.426 429.666,232.904 432.529,231.545C439.56,228.21 436.433,240.036 435.616,247.51C434.132,261.1 419.628,264.711 414.331,252.587Z"
          />
          <path
            fill="var(--logo-blue, #0010e8)"
            d="M390.113,234.899C396.323,241.309 391.283,254.377 390.525,254.592C381.845,257.063 392.476,238.254 382.503,238.584C377.08,238.764 376.429,246.068 382.736,248.057C386.123,249.125 384.796,257.52 376.356,251.713C365.689,244.374 376.613,224.979 390.113,234.899Z"
          />
          <path
            fill="var(--logo-blue, #0010e8)"
            d="M411.846,251.578C411.794,252.084 411.271,257.157 409.497,257.486C401.992,258.882 409.449,244.34 405.337,241.803C399.299,238.077 401.279,254.608 397.534,255.614C392.672,256.921 393.833,252.795 395.188,244.451L395.261,243.429Z"
          />
          <path
            fill="var(--logo-blue, #0010e8)"
            d="M486.883,312.894C494.725,307.363 501.081,315.712 498.125,321.31C493.152,330.726 479.486,320.718 486.883,312.894Z"
          />
        </g>
      </svg>
    `}};Yt.styles=te`
    :host {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      aspect-ratio: 1 / 1;
      color: inherit;
      fill: inherit;
    }
    svg {
      width: 120%;
      height: 120%;
      display: block;
    }
  `;Yt=tn([J("game-logo")],Yt);const{I:sn}=qr,Hs=s=>s,Ws=()=>document.createComment(""),qe=(s,e,t)=>{const i=s._$AA.parentNode,r=e===void 0?s._$AB:e._$AA;if(t===void 0){const n=i.insertBefore(Ws(),r),o=i.insertBefore(Ws(),r);t=new sn(n,o,s,s.options)}else{const n=t._$AB.nextSibling,o=t._$AM,a=o!==s;if(a){let l;t._$AQ?.(s),t._$AM=s,t._$AP!==void 0&&(l=s._$AU)!==o._$AU&&t._$AP(l)}if(n!==r||a){let l=t._$AA;for(;l!==n;){const c=Hs(l).nextSibling;Hs(i).insertBefore(l,r),l=c}}}return t},we=(s,e,t=s)=>(s._$AI(e,t),s),rn={},$i=(s,e=rn)=>s._$AH=e,nn=s=>s._$AH,jt=s=>{s._$AR(),s._$AA.remove()};const on=ms(class extends gs{constructor(){super(...arguments),this.key=T}render(s,e){return this.key=s,e}update(s,[e,t]){return e!==this.key&&($i(s),this.key=e),t}});var an=Object.defineProperty,ln=Object.getOwnPropertyDescriptor,q=(s,e,t,i)=>{for(var r=i>1?void 0:i?ln(e,t):e,n=s.length-1,o;n>=0;n--)(o=s[n])&&(r=(i?o(e,t,r):o(r))||r);return i&&r&&an(e,t,r),r};let P=class extends B{constructor(){super(),this.settings=new V,this.cellRadius="5%",this.turnNumber=1,this.currentPlayer="",this.winnerMessage="",this.gameId=0,this.cells=[]}willUpdate(s){s.has("settings")&&(this.initBoard(),this.winnerMessage="",this.turnNumber=1,this.gameId++)}initBoard(){this.cells=Array.from({length:this.settings.boardSize},()=>Array(this.settings.boardSize).fill(""))}onBoardState(s){this.cells=s.grid.map(e=>e.map(t=>t||""))}onMoveMade(s){if(this.turnNumber=s.turn,this.currentPlayer=s.nextPlayerSymbol,s?.grid){this.cells=s.grid.map(e=>[...e]);return}typeof s.row=="number"&&typeof s.col=="number"&&this.updateCell(s.row,s.col,s.symbol)}onMoveApplied(s){if(this.turnNumber=s.turn,s?.board&&(s.action==="rotate"||s.row<0||s.col<0)){this.applyBoardSnapshot(s.board);return}typeof s.row=="number"&&typeof s.col=="number"&&s.row>=0&&s.col>=0&&this.updateCell(s.row,s.col,s.symbol??"")}async onGameFinished(s){this.winnerMessage=s.winner?`${s.winner} hat gewonnen!`:"Unentschieden!",await this.showWinAnimation(s)}onSettingsChanged(s){JSON.stringify(this.settings)!==JSON.stringify(s)&&(this.settings=Object.assign(new V,s)),this.initBoard()}onBoardSnapshotUpdated(s){!s?.size||!Array.isArray(s.state)||this.applyBoardSnapshot(s)}onReset(s){s?.settings&&JSON.stringify(this.settings)!==JSON.stringify(s.settings)&&(this.settings=Object.assign(new V,s.settings)),this.resetBoard()}render(){return C`
      <style>
        .grid {
          display: grid;
          gap: 0.5rem;
          grid-template-columns: repeat(${this.settings.boardSize}, 1fr);
          grid-template-rows: repeat(${this.settings.boardSize}, 1fr);
          width: min(100%, 60vh);
          aspect-ratio: 1 / 1;
          margin: 0 auto;
        }
        button.cell-btn {
          border-radius: ${this.cellRadius};
          font-size: calc((60vh / ${this.settings.boardSize}) * 0.6);
        }
      </style>
      <header class="game-header">
        <div class="status-container">
          <span>Spieler: ${this.currentPlayer}</span>
          <span>Zug: ${this.turnNumber}</span>
        </div>
        <div class="victory-message">${this.winnerMessage}</div>
      </header>

      <div class="board-wrapper">
        ${on(this.gameId,C`
            <div class="grid" @click="${this._handleCellClick}">
              ${this.cells.map((s,e)=>s.map((t,i)=>C`
                    <button
                      class="cell-btn"
                      data-row="${e}"
                      data-col="${i}"
                      id="btn-${e}-${i}"
                    >
                      ${t}
                    </button>
                  `))}
            </div>
          `)}
      </div>

      <div class="action-panel">
        <button class="reset-btn" @click="${this._handleResetClick}">
          Neu starten
        </button>
        ${this.settings.rotationEnabled?C`
              <button
                class="reset-btn"
                @click="${()=>this._handleRotateClick(90)}"
              >
                ↻ 90°
              </button>
              <button
                class="reset-btn"
                @click="${()=>this._handleRotateClick(180)}"
              >
                ↻ 180°
              </button>
            `:null}
        <button
          class="reset-btn end-btn"
          @click="${this._handleEndClick}"
          style="margin-left: 1rem; border-color: #f38ba8;"
        >
          Beenden
        </button>
      </div>
    `}_handleEndClick(){y.emit(f.UI.AppEndRequested,g.WebUI)}_handleCellClick(s){const e=s.target.closest("button.cell-btn");if(!e)return;e.classList.contains("spin")&&(e.classList.remove("spin"),requestAnimationFrame(()=>{requestAnimationFrame(()=>{e.classList.add("spin")})}));const t={row:parseInt(e.dataset.row),col:parseInt(e.dataset.col)};this.cells[t.row][t.col]===""&&this.winnerMessage===""&&y.emit(f.UI.CellClicked,g.WebUI,t)}_handleResetClick(){y.emit(f.UI.ResetRequested,g.WebUI)}_handleRotateClick(s){y.emit(f.UI.RotateRequested,g.WebUI,s)}updateCell(s,e,t){const i=[...this.cells];i[s][e]=t,this.cells=i}applyBoardSnapshot(s,e=""){const t=Array.from({length:s.size},()=>Array(s.size).fill(""));s.state.forEach((i,r)=>{const n=Math.floor(r/s.size),o=r%s.size;t[n][o]=i?e||String(i):""}),this.cells=t}resetBoard(){this.gameId++,this.initBoard(),this.winnerMessage="",this.turnNumber=1}async showWinAnimation(s){const e=this.gameId;if(s.type===ee.Draw||!s.positions)return;s.type===ee.DiagonalAnti&&s.positions.sort((n,o)=>o.row-n.row);const t=this.getLineConfig(s.type),i=s.positions.map(n=>this.shadowRoot?.getElementById(`btn-${n.row}-${n.col}`)).filter(n=>!!n),r=i.map(n=>(n.classList.add("win","spin"),new Promise(o=>{n.addEventListener("animationend",()=>o(),{once:!0})})));if(await Promise.all(r),this.gameId===e&&(i.forEach(n=>{n.style.setProperty("--after-width",t.width),n.style.setProperty("--line-top",t.top),n.style.setProperty("--line-left",t.left),n.style.setProperty("--angle",t.angle)}),await new Promise(n=>setTimeout(n,200)),this.gameId===e))for(const n of i)n.classList.add("draw-line"),await new Promise(o=>{n.addEventListener("transitionend",()=>o(),{once:!0})})}getLineConfig(s){const t=this.cellRadius==="50%"?1.17:1;switch(s){case ee.Horizontal:return{top:"50%",left:"0%",angle:"0deg",width:"100%"};case ee.Vertical:return{top:"0%",left:"50%",angle:"90deg",width:"100%"};case ee.DiagonalMain:return{top:"0%",left:"0%",angle:"45deg",width:`${t*141}%`};case ee.DiagonalAnti:return{top:"100%",left:"0%",angle:"-45deg",width:`${t*141}%`};default:return{top:"50%",left:"0%",angle:"0deg",width:"100%"}}}};P.styles=te`
    :host {
      display: flex;
      flex-direction: column;
      width: 100%;
      height: 100%;
      overflow: hidden;
      box-sizing: border-box;
    }
    .game-header {
      flex-shrink: 0;
      text-align: center;
      padding: 1rem 0;
    }
    .status-container {
      display: flex;
      gap: 2rem;
      justify-content: center;
      font-size: 1.1rem;
      font-weight: 600;
    }
    .victory-message {
      font-size: 1.5rem;
      font-weight: 900;
      color: var(--color-win);
      min-height: 2.2rem;
      text-transform: uppercase;
    }
    .board-wrapper {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 0;
      padding: 1rem;
      container-type: inline-size;
    }
    .grid {
      display: grid;
      gap: 0.5rem;
      max-width: 100%;
      max-height: 100%;
      aspect-ratio: 1 / 1;
    }
    button.cell-btn {
      width: 100%;
      height: 100%;
      aspect-ratio: 1 / 1;
      background-color: var(--cell-bg);
      border: 0.25rem solid var(--border-color);
      color: var(--text-main);
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
      cursor: pointer;
      transition: all 0.2s ease;
      font-family: inherit;
      overflow: hidden;
    }
    button.cell-btn:hover {
      background-color: var(--cell-hover);
      border-color: var(--primary-accent);
      z-index: 10;
      transform: scale(1.03);
    }
    button.cell-btn::after {
      content: "";
      position: absolute;
      top: var(--line-top, 50%);
      left: var(--line-left, 0%);
      width: var(--after-width, 100%);
      height: 0.4rem;
      background-color: var(--text-main);
      transform-origin: left center;
      transform: translate(0, -50%) rotate(var(--angle, 0deg)) scaleX(0);
      transition: transform 0.6s cubic-bezier(0.65, 0, 0.35, 1);
      pointer-events: none;
      z-index: 20;
      border-radius: 1rem;
    }
    button.draw-line::after {
      transform: translate(0, -50%) rotate(var(--angle, 0deg)) scaleX(1);
    }
    button.cell-btn.win {
      background-color: var(--color-win) !important;
      border-color: var(--text-main);
      filter: drop-shadow(0 0 1rem var(--glow-core));
    }

    button.spin {
      animation: winRotate 0.8s forwards;
    }
    @keyframes winRotate {
      from {
        transform: rotateY(0deg);
      }
      to {
        transform: rotateY(360deg);
      }
    }
    .action-panel {
      flex-shrink: 0;
      padding: 1rem 0 2rem 0;
      display: flex;
      justify-content: center;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .reset-btn {
      padding: 0.8rem 2rem;
      font-weight: 700;
      background: var(--cell-bg);
      color: var(--text-main);
      border: 0.2rem solid var(--border-color);
      border-radius: 1rem;
      cursor: pointer;
    }
  `;q([se({type:Object})],P.prototype,"settings",2);q([se({type:String})],P.prototype,"cellRadius",2);q([se({type:Number})],P.prototype,"turnNumber",2);q([se({type:String})],P.prototype,"currentPlayer",2);q([se({type:String})],P.prototype,"winnerMessage",2);q([A()],P.prototype,"gameId",2);q([A()],P.prototype,"cells",2);q([D(f.Game.BoardState,g.Controller)],P.prototype,"onBoardState",1);q([D(f.Game.MoveMade,g.Controller)],P.prototype,"onMoveMade",1);q([D(f.Game.MoveApplied,g.Controller)],P.prototype,"onMoveApplied",1);q([D(f.Game.Finished,g.Controller)],P.prototype,"onGameFinished",1);q([D(f.Game.SettingsChanged,g.Controller)],P.prototype,"onSettingsChanged",1);q([D(f.Game.BoardSnapshotUpdated,g.Controller)],P.prototype,"onBoardSnapshotUpdated",1);q([D(f.Game.Reset,g.WebUI)],P.prototype,"onReset",1);P=q([J("game-board")],P);const Ks=(s,e,t)=>{const i=new Map;for(let r=e;r<=t;r++)i.set(s[r],r);return i},cn=ms(class extends gs{constructor(s){if(super(s),s.type!==Ei.CHILD)throw Error("repeat() can only be used in text expressions")}dt(s,e,t){let i;t===void 0?t=e:e!==void 0&&(i=e);const r=[],n=[];let o=0;for(const a of s)r[o]=i?i(a,o):o,n[o]=t(a,o),o++;return{values:n,keys:r}}render(s,e,t){return this.dt(s,e,t).values}update(s,[e,t,i]){const r=nn(s),{values:n,keys:o}=this.dt(e,t,i);if(!Array.isArray(r))return this.ut=o,n;const a=this.ut??=[],l=[];let c,h,u=0,p=r.length-1,b=0,E=n.length-1;for(;u<=p&&b<=E;)if(r[u]===null)u++;else if(r[p]===null)p--;else if(a[u]===o[b])l[b]=we(r[u],n[b]),u++,b++;else if(a[p]===o[E])l[E]=we(r[p],n[E]),p--,E--;else if(a[u]===o[E])l[E]=we(r[u],n[E]),qe(s,l[E+1],r[u]),u++,E--;else if(a[p]===o[b])l[b]=we(r[p],n[b]),qe(s,r[u],r[p]),p--,b++;else if(c===void 0&&(c=Ks(o,b,E),h=Ks(a,u,p)),c.has(a[u]))if(c.has(a[p])){const $=h.get(o[b]),U=$!==void 0?r[$]:null;if(U===null){const ce=qe(s,r[u]);we(ce,n[b]),l[b]=ce}else l[b]=we(U,n[b]),qe(s,r[u],U),r[$]=null;b++}else jt(r[p]),p--;else jt(r[u]),u++;for(;b<=E;){const $=qe(s,l[E+1]);we($,n[b]),l[b++]=$}for(;u<=p;){const $=r[u++];$!==null&&jt($)}return this.ut=o,$i(s,l),be}}),Ce={Profile:"xoxo.profile",Theme:"user-theme",ButtonRadius:"btn-shape-radius"},Se={Rounded:"50%",Square:"5%"},Zs={themeName:"Catppuccin",buttonRadius:Se.Square,chatOpenByDefault:!1};class dn{load(){const e=localStorage.getItem(Ce.Profile);if(!e)return null;try{const t=JSON.parse(e);return!t?.username||!t?.symbol?null:this.normalize(t)}catch{return null}}save(e){const t=this.normalize({id:this.load()?.id??crypto.randomUUID(),username:e.username.trim(),symbol:e.symbol,preferences:{...Zs,...e.preferences},updatedAt:Date.now()});return localStorage.setItem(Ce.Profile,JSON.stringify(t)),localStorage.setItem(Ce.Theme,t.preferences.themeName),localStorage.setItem(Ce.ButtonRadius,t.preferences.buttonRadius),t}clear(){localStorage.removeItem(Ce.Profile)}ensure(){return this.load()??this.save(this.getDefaultDraft())}isComplete(){return this.load()!==null}updatePreferences(e){const t=this.ensure();return this.save({username:t.username,symbol:t.symbol,preferences:{...t.preferences,...e}})}getDefaultDraft(){return{username:"Kai",symbol:this.getSavedSymbol()??this.defaultSymbol(),preferences:{themeName:localStorage.getItem(Ce.Theme)??"Catppuccin",buttonRadius:localStorage.getItem(Ce.ButtonRadius)??Se.Square}}}getSavedSymbol(){return this.load()?.symbol??null}defaultSymbol(){return ue("X")}normalize(e){return{...e,username:e.username.trim(),symbol:ue(e.symbol),preferences:{...Zs,...e.preferences},updatedAt:e.updatedAt||Date.now()}}}const he=new dn,Mt="xoxo.current-lobby";class un{getCurrentLobbyId(){return localStorage.getItem(Mt)}setCurrentLobbyId(e){if(!e){localStorage.removeItem(Mt);return}localStorage.setItem(Mt,e)}isActive(){return this.getCurrentLobbyId()!==null}}const Ee=new un;function nt(s){if(typeof s!="string"||!s)throw new Error("expected a non-empty string, got: "+s)}function Bt(s){if(typeof s!="number")throw new Error("expected a number, got: "+s)}const hn=1,pn=1,Te="emoji",Pe="keyvalue",bs="favorites",fn="tokens",Ai="tokens",mn="unicode",Ti="count",gn="group",bn="order",Ii="group-order",Jt="eTag",Ct="url",Ys="skinTone",De="readonly",ys="readwrite",Ri="skinUnicodes",yn="skinUnicodes",vn="https://cdn.jsdelivr.net/npm/emoji-picker-element-data@^1/en/emojibase/data.json",wn="en";function Cn(s,e){const t=new Set,i=[];for(const r of s){const n=e(r);t.has(n)||(t.add(n),i.push(r))}return i}function Js(s){return Cn(s,e=>e.unicode)}function _n(s){function e(t,i,r){const n=i?s.createObjectStore(t,{keyPath:i}):s.createObjectStore(t);if(r)for(const[o,[a,l]]of Object.entries(r))n.createIndex(o,a,{multiEntry:l});return n}e(Pe),e(Te,mn,{[Ai]:[fn,!0],[Ii]:[[gn,bn]],[Ri]:[yn,!0]}),e(bs,void 0,{[Ti]:[""]})}const Xt={},pt={},_t={};function Oi(s,e,t){t.onerror=()=>e(t.error),t.onblocked=()=>e(new Error("IDB blocked")),t.onsuccess=()=>s(t.result)}async function Sn(s){const e=await new Promise((t,i)=>{const r=indexedDB.open(s,hn);Xt[s]=r,r.onupgradeneeded=n=>{n.oldVersion<pn&&_n(r.result)},Oi(t,i,r)});return e.onclose=()=>vs(s),e}function En(s){return pt[s]||(pt[s]=Sn(s)),pt[s]}function pe(s,e,t,i){return new Promise((r,n)=>{const o=s.transaction(e,t,{durability:"relaxed"}),a=typeof e=="string"?o.objectStore(e):e.map(c=>o.objectStore(c));let l;i(a,o,c=>{l=c}),o.oncomplete=()=>r(l),o.onerror=()=>n(o.error)})}function vs(s){const e=Xt[s],t=e&&e.result;if(t){t.close();const i=_t[s];if(i)for(const r of i)r()}delete Xt[s],delete pt[s],delete _t[s]}function kn(s){return new Promise((e,t)=>{vs(s);const i=indexedDB.deleteDatabase(s);Oi(e,t,i)})}function xn(s,e){let t=_t[s];t||(t=_t[s]=[]),t.push(e)}const $n=new Set([":D","XD",":'D","O:)",":X",":P",";P","XP",":L",":Z",":j","8D","XO","8)",":B",":O",":S",":'o","Dx","X(","D:",":C",">0)",":3","</3","<3","\\M/",":E","8#"]);function Re(s){return s.split(/[\s_]+/).map(e=>!e.match(/\w/)||$n.has(e)?e.toLowerCase():e.replace(/[)(:,]/g,"").replace(/’/g,"'").toLowerCase()).filter(Boolean)}const An=2;function Li(s){return s.filter(Boolean).map(e=>e.toLowerCase()).filter(e=>e.length>=An)}function Tn(s){return s.map(({annotation:t,emoticon:i,group:r,order:n,shortcodes:o,skins:a,tags:l,emoji:c,version:h})=>{const u=[...new Set(Li([...(o||[]).map(Re).flat(),...(l||[]).map(Re).flat(),...Re(t),i]))].sort(),p={annotation:t,group:r,order:n,tags:l,tokens:u,unicode:c,version:h};if(i&&(p.emoticon=i),o&&(p.shortcodes=o),a){p.skinTones=[],p.skinUnicodes=[],p.skinVersions=[];for(const{tone:b,emoji:E,version:$}of a)p.skinTones.push(b),p.skinUnicodes.push(E),p.skinVersions.push($)}return p})}function Pi(s,e,t,i){s[e](t).onsuccess=r=>i&&i(r.target.result)}function Ae(s,e,t){Pi(s,"get",e,t)}function ji(s,e,t){Pi(s,"getAll",e,t)}function ws(s){s.commit&&s.commit()}function In(s,e){let t=s[0];for(let i=1;i<s.length;i++){const r=s[i];e(t)>e(r)&&(t=r)}return t}function Mi(s,e){const t=In(s,r=>r.length),i=[];for(const r of t)s.some(n=>n.findIndex(o=>e(o)===e(r))===-1)||i.push(r);return i}async function Rn(s){return!await Cs(s,Pe,Ct)}async function On(s,e,t){const[i,r]=await Promise.all([Jt,Ct].map(n=>Cs(s,Pe,n)));return i===t&&r===e}async function Ln(s,e){return pe(s,Te,De,(i,r,n)=>{let o;const a=()=>{i.getAll(o&&IDBKeyRange.lowerBound(o,!0),50).onsuccess=l=>{const c=l.target.result;for(const h of c)if(o=h.unicode,e(h))return n(h);if(c.length<50)return n();a()}};a()})}async function Bi(s,e,t,i){{const r=Tn(e);await pe(s,[Te,Pe],ys,([n,o],a)=>{let l,c,h=0;function u(){++h===2&&p()}function p(){if(!(l===i&&c===t)){n.clear();for(const b of r)n.put(b);o.put(i,Jt),o.put(t,Ct),ws(a)}}Ae(o,Jt,b=>{l=b,u()}),Ae(o,Ct,b=>{c=b,u()})})}}async function Pn(s,e){return pe(s,Te,De,(t,i,r)=>{const n=IDBKeyRange.bound([e,0],[e+1,0],!1,!0);ji(t.index(Ii),n,r)})}async function Di(s,e){const t=Li(Re(e));return t.length?pe(s,Te,De,(i,r,n)=>{const o=[],a=()=>{o.length===t.length&&l()},l=()=>{const c=Mi(o,h=>h.unicode);n(c.sort((h,u)=>h.order<u.order?-1:1))};for(let c=0;c<t.length;c++){const h=t[c],u=c===t.length-1?IDBKeyRange.bound(h,h+"￿",!1,!0):IDBKeyRange.only(h);ji(i.index(Ai),u,p=>{o.push(p),a()})}}):[]}async function jn(s,e){const t=await Di(s,e);return t.length?t.filter(i=>(i.shortcodes||[]).map(n=>n.toLowerCase()).includes(e.toLowerCase()))[0]||null:await Ln(s,r=>(r.shortcodes||[]).includes(e.toLowerCase()))||null}async function Mn(s,e){return pe(s,Te,De,(t,i,r)=>Ae(t,e,n=>{if(n)return r(n);Ae(t.index(Ri),e,o=>r(o||null))}))}function Cs(s,e,t){return pe(s,e,De,(i,r,n)=>Ae(i,t,n))}function Bn(s,e,t,i){return pe(s,e,ys,(r,n)=>{r.put(i,t),ws(n)})}function Dn(s,e){return pe(s,bs,ys,(t,i)=>Ae(t,e,r=>{t.put((r||0)+1,e),ws(i)}))}function Un(s,e,t){return t===0?[]:pe(s,[bs,Te],De,([i,r],n,o)=>{const a=[];i.index(Ti).openCursor(void 0,"prev").onsuccess=l=>{const c=l.target.result;if(!c)return o(a);function h(b){if(a.push(b),a.length===t)return o(a);c.continue()}const u=c.primaryKey,p=e.byName(u);if(p)return h(p);Ae(r,u,b=>{if(b)return h(b);c.continue()})}})}const ot="";function Nn(s,e){const t=new Map;for(const r of s){const n=e(r);for(const o of n){let a=t;for(let c=0;c<o.length;c++){const h=o.charAt(c);let u=a.get(h);u||(u=new Map,a.set(h,u)),a=u}let l=a.get(ot);l||(l=[],a.set(ot,l)),l.push(r)}}return(r,n)=>{let o=t;for(let c=0;c<r.length;c++){const h=r.charAt(c),u=o.get(h);if(u)o=u;else return[]}if(n)return o.get(ot)||[];const a=[],l=[o];for(;l.length;){const h=[...l.shift().entries()].sort((u,p)=>u[0]<p[0]?-1:1);for(const[u,p]of h)u===ot?a.push(...p):l.push(p)}return a}}const zn=["name","url"];function qn(s){const e=s&&Array.isArray(s),t=e&&s.length&&(!s[0]||zn.some(i=>!(i in s[0])));if(!e||t)throw new Error("Custom emojis are in the wrong format")}function Xs(s){qn(s);const e=(p,b)=>p.name.toLowerCase()<b.name.toLowerCase()?-1:1,t=s.sort(e),r=Nn(s,p=>{const b=new Set;if(p.shortcodes)for(const E of p.shortcodes)for(const $ of Re(E))b.add($);return b}),n=p=>r(p,!0),o=p=>r(p,!1),a=p=>{const b=Re(p),E=b.map(($,U)=>(U<b.length-1?n:o)($));return Mi(E,$=>$.name).sort(e)},l=new Map,c=new Map;for(const p of s){c.set(p.name.toLowerCase(),p);for(const b of p.shortcodes||[])l.set(b.toLowerCase(),p)}return{all:t,search:a,byShortcode:p=>l.get(p.toLowerCase()),byName:p=>c.get(p.toLowerCase())}}const Fn=typeof wrappedJSObject<"u";function Fe(s){if(!s)return s;if(Fn&&(s=structuredClone(s)),delete s.tokens,s.skinTones){const e=s.skinTones.length;s.skins=Array(e);for(let t=0;t<e;t++)s.skins[t]={tone:s.skinTones[t],unicode:s.skinUnicodes[t],version:s.skinVersions[t]};delete s.skinTones,delete s.skinUnicodes,delete s.skinVersions}return s}function Ui(s){s||console.warn("emoji-picker-element is more efficient if the dataSource server exposes an ETag header.")}const Gn=["annotation","emoji","group","order","version"];function Vn(s){if(!s||!Array.isArray(s)||!s[0]||typeof s[0]!="object"||Gn.some(e=>!(e in s[0])))throw new Error("Emoji data is in the wrong format")}function Ni(s,e){if(Math.floor(s.status/100)!==2)throw new Error("Failed to fetch: "+e+":  "+s.status)}async function Hn(s){const e=await fetch(s,{method:"HEAD"});Ni(e,s);const t=e.headers.get("etag");return Ui(t),t}async function Qt(s){const e=await fetch(s);Ni(e,s);const t=e.headers.get("etag");Ui(t);const i=await e.json();return Vn(i),[t,i]}function Wn(s){for(var e="",t=new Uint8Array(s),i=t.byteLength,r=-1;++r<i;)e+=String.fromCharCode(t[r]);return e}function Kn(s){for(var e=s.length,t=new ArrayBuffer(e),i=new Uint8Array(t),r=-1;++r<e;)i[r]=s.charCodeAt(r);return t}async function zi(s){const e=JSON.stringify(s);let t=Kn(e);const i=await crypto.subtle.digest("SHA-1",t),r=Wn(i);return btoa(r)}async function Zn(s,e){let t,i=await Hn(e);if(!i){const r=await Qt(e);i=r[0],t=r[1],i||(i=await zi(t))}await On(s,e,i)||(t||(t=(await Qt(e))[1]),await Bi(s,t,e,i))}async function Yn(s,e){let[t,i]=await Qt(e);t||(t=await zi(i)),await Bi(s,i,e,t)}async function Jn(s,e){try{await Zn(s,e)}catch(t){if(t.name!=="InvalidStateError")throw t}}class Xn{constructor({dataSource:e=vn,locale:t=wn,customEmoji:i=[]}={}){this.dataSource=e,this.locale=t,this._dbName=`emoji-picker-element-${this.locale}`,this._db=void 0,this._lazyUpdate=void 0,this._custom=Xs(i),this._clear=this._clear.bind(this),this._ready=this._init()}async _init(){const e=this._db=await En(this._dbName);xn(this._dbName,this._clear);const t=this.dataSource;await Rn(e)?await Yn(e,t):this._lazyUpdate=Jn(e,t)}async ready(){const e=async()=>(this._ready||(this._ready=this._init()),this._ready);await e(),this._db||await e()}async getEmojiByGroup(e){return Bt(e),await this.ready(),Js(await Pn(this._db,e)).map(Fe)}async getEmojiBySearchQuery(e){nt(e),await this.ready();const t=this._custom.search(e),i=Js(await Di(this._db,e)).map(Fe);return[...t,...i]}async getEmojiByShortcode(e){nt(e),await this.ready();const t=this._custom.byShortcode(e);return t||Fe(await jn(this._db,e))}async getEmojiByUnicodeOrName(e){nt(e),await this.ready();const t=this._custom.byName(e);return t||Fe(await Mn(this._db,e))}async getPreferredSkinTone(){return await this.ready(),await Cs(this._db,Pe,Ys)||0}async setPreferredSkinTone(e){return Bt(e),await this.ready(),Bn(this._db,Pe,Ys,e)}async incrementFavoriteEmojiCount(e){return nt(e),await this.ready(),Dn(this._db,e)}async getTopFavoriteEmoji(e){return Bt(e),await this.ready(),(await Un(this._db,this._custom,e)).map(Fe)}set customEmoji(e){this._custom=Xs(e)}get customEmoji(){return this._custom.all}async _shutdown(){await this.ready();try{await this._lazyUpdate}catch{}}_clear(){this._db=this._ready=this._lazyUpdate=void 0}async close(){await this._shutdown(),await vs(this._dbName)}async delete(){await this._shutdown(),await kn(this._dbName)}}const es=[[-1,"✨","custom"],[0,"😀","smileys-emotion"],[1,"👋","people-body"],[3,"🐱","animals-nature"],[4,"🍎","food-drink"],[5,"🏠️","travel-places"],[6,"⚽","activities"],[7,"📝","objects"],[8,"⛔️","symbols"],[9,"🏁","flags"]].map(([s,e,t])=>({id:s,emoji:e,name:t})),Dt=es.slice(1),Qn=2,Qs=6,qi=typeof requestIdleCallback=="function"?requestIdleCallback:setTimeout;function ei(s){return s.unicode.includes("‍")}const eo={"🫪":17,"🫩":16,"🫨":15.1,"🫠":14,"🥲":13.1,"🥻":12.1,"🥰":11,"🤩":5,"👱‍♀️":4,"🤣":3,"👁️‍🗨️":2,"😀":1,"😐️":.7,"😃":.6},to=1e3,so="🖐️",io=8,ro=["😊","😒","❤️","👍️","😍","😂","😭","☺️","😔","😩","😏","💕","🙌","😘"],Fi='"Twemoji Mozilla","Apple Color Emoji","Segoe UI Emoji","Segoe UI Symbol","Noto Color Emoji","EmojiOne Color","Android Emoji",sans-serif',no=(s,e)=>s<e?-1:s>e?1:0,ti=(s,e)=>{const t=document.createElement("canvas");t.width=t.height=1;const i=t.getContext("2d",{willReadFrequently:!0});return i.textBaseline="top",i.font=`100px ${Fi}`,i.fillStyle=e,i.scale(.01,.01),i.fillText(s,0,0),i.getImageData(0,0,1,1).data},oo=(s,e)=>{const t=[...s].join(","),i=[...e].join(",");return t===i&&!t.startsWith("0,0,0,")};function ao(s){const e=ti(s,"#000"),t=ti(s,"#fff");return e&&t&&oo(e,t)}function lo(){const s=Object.entries(eo);try{for(const[e,t]of s)if(ao(e))return t}catch{}return s[0][1]}let Ut;const Nt=()=>(Ut||(Ut=new Promise(s=>qi(()=>s(lo())))),Ut),ts=new Map,co="️",uo="\uD83C",ho="‍",po=127995,fo=57339;function mo(s,e){if(e===0)return s;const t=s.indexOf(ho);return t!==-1?s.substring(0,t)+String.fromCodePoint(po+e-1)+s.substring(t):(s.endsWith(co)&&(s=s.substring(0,s.length-1)),s+uo+String.fromCodePoint(fo+e-1))}function ie(s){s.preventDefault(),s.stopPropagation()}function zt(s,e,t){return e+=s?-1:1,e<0?e=t.length-1:e>=t.length&&(e=0),e}function Gi(s,e){const t=new Set,i=[];for(const r of s){const n=e(r);t.has(n)||(t.add(n),i.push(r))}return i}function go(s,e){const t=i=>{const r={};for(const n of i)typeof n.tone=="number"&&n.version<=e&&(r[n.tone]=n.unicode);return r};return s.map(({unicode:i,skins:r,shortcodes:n,url:o,name:a,category:l,annotation:c})=>({unicode:i,name:a,shortcodes:n,url:o,category:l,annotation:c,id:i||a,skins:r&&t(r)}))}const ft=requestAnimationFrame;let bo=typeof ResizeObserver=="function";function yo(s,e,t){let i;bo?(i=new ResizeObserver(t),i.observe(s)):ft(t),e.addEventListener("abort",()=>{i&&i.disconnect()})}function si(s){{const e=document.createRange();return e.selectNode(s.firstChild),e.getBoundingClientRect().width}}const vo="😀";let qt,_e;function ii(s,e,t){const i=si(e);if(!i){if(!_e){_e=t.cloneNode(!0);const r=getComputedStyle(t);for(const n of["font-family","line-height","width","height","font-size","display","align-items","justify-content"])_e.style.setProperty(n,r.getPropertyValue(n),"important")}try{return document.body.appendChild(_e),_e.firstChild.nodeValue=s,si(_e)}finally{_e.remove()}}return i}function wo(s,e,t){let i=!0;for(const r of s){const n=t(r);if(!n)continue;typeof qt>"u"&&(qt=ii(vo,e,e));const a=ii(r.unicode,n,e)/1.8<qt;ts.set(r.unicode,a),a||(i=!1)}return i}function Co(s){return Gi(s,e=>e)}function _o(s){s&&(s.scrollTop=0)}function Ke(s,e,t){let i=s.get(e);return i||(i=t(),s.set(e,i)),i}function ri(s){return""+s}function So(s){const e=document.createElement("template");return e.innerHTML=s,e}const Eo=new WeakMap,ko=new WeakMap,xo=Symbol("un-keyed"),$o="replaceChildren"in Element.prototype;function Ao(s,e){$o?s.replaceChildren(...e):(s.innerHTML="",s.append(...e))}function To(s,e){let t=s.firstChild,i=0;for(;t;){if(e[i]!==t)return!0;t=t.nextSibling,i++}return i!==e.length}function Io(s,e){const{targetNode:t}=e;let{targetParentNode:i}=e,r=!1;i?r=To(i,s):(r=!0,e.targetNode=void 0,e.targetParentNode=i=t.parentNode),r&&Ao(i,s)}function Ro(s,e){for(const t of e){const{targetNode:i,currentExpression:r,binding:{expressionIndex:n,attributeName:o,attributeValuePre:a,attributeValuePost:l}}=t,c=s[n];if(r!==c)if(t.currentExpression=c,o)if(c===null)i.removeAttribute(o);else{const h=a+ri(c)+l;i.setAttribute(o,h)}else{let h;Array.isArray(c)?Io(c,t):c instanceof Element?(h=c,i.replaceWith(h)):i.nodeValue=ri(c),h&&(t.targetNode=h)}}}function Oo(s){let e="",t=!1,i=!1,r=-1;const n=new Map,o=[];let a=0;for(let c=0,h=s.length;c<h;c++){const u=s[c];if(e+=u.slice(a),c===h-1)break;for(let v=0;v<u.length;v++)switch(u.charAt(v)){case"<":{u.charAt(v+1)==="/"?o.pop():(t=!0,o.push(++r));break}case">":{t=!1,i=!1;break}case"=":{i=!0;break}}const p=o[o.length-1],b=Ke(n,p,()=>[]);let E,$,U;if(i){const v=/(\S+)="?([^"=]*)$/.exec(u);E=v[1],$=v[2];const x=/^([^">]*)("?)/.exec(s[c+1]);U=x[1],e=e.slice(0,-1*v[0].length),a=x[0].length}else a=0;const ce={attributeName:E,attributeValuePre:$,attributeValuePost:U,expressionIndex:c};b.push(ce),!t&&!i&&(e+=" ")}return{template:So(e),elementsToBindings:n}}function ni(s,e,t){for(let i=0;i<s.length;i++){const r=s[i],n=r.attributeName?e:e.firstChild,o={binding:r,targetNode:n,targetParentNode:void 0,currentExpression:void 0};t.push(o)}}function Lo(s,e){const t=[];let i;if(e.size===1&&(i=e.get(0)))ni(i,s,t);else{const r=document.createTreeWalker(s,NodeFilter.SHOW_ELEMENT);let n=s,o=-1;do{const a=e.get(++o);a&&ni(a,n,t)}while(n=r.nextNode())}return t}function Po(s){const{template:e,elementsToBindings:t}=Ke(Eo,s,()=>Oo(s)),i=e.cloneNode(!0).content.firstElementChild,r=Lo(i,t);return function(o){return Ro(o,r),i}}function jo(s){const e=Ke(ko,s,()=>new Map);let t=xo;function i(n,...o){const a=Ke(e,n,()=>new Map);return Ke(a,t,()=>Po(n))(o)}function r(n,o,a){return n.map((l,c)=>{const h=t;t=a(l);try{return o(l,c)}finally{t=h}})}return{map:r,html:i}}function Mo(s,e,t,i,r,n,o,a,l){const{labelWithSkin:c,titleForEmoji:h,unicodeWithSkin:u}=t,{html:p,map:b}=jo(e);function E(v,x,N){return b(v,(W,Ne)=>p`<button role="${x?"option":"menuitem"}" aria-selected="${x?Ne===e.activeSearchItem:null}" aria-label="${c(W,e.currentSkinTone)}" title="${h(W)}" class="${"emoji"+(x&&Ne===e.activeSearchItem?" active":"")+(W.unicode?"":" custom-emoji")}" id="${`${N}-${W.id}`}" style="${W.unicode?null:`--custom-emoji-background: url(${JSON.stringify(W.url)})`}">${W.unicode?u(W,e.currentSkinTone):""}</button>`,W=>`${N}-${W.id}`)}const U=p`<section data-ref="rootElement" class="picker" aria-label="${e.i18n.regionLabel}" style="${e.pickerStyle||""}"><div class="pad-top"></div><div class="search-row"><div class="search-wrapper"><input id="search" class="search" type="search" role="combobox" enterkeyhint="search" placeholder="${e.i18n.searchLabel}" autocapitalize="none" autocomplete="off" spellcheck="true" aria-expanded="${!!(e.searchMode&&e.currentEmojis.length)}" aria-controls="search-results" aria-describedby="search-description" aria-autocomplete="list" aria-activedescendant="${e.activeSearchItemId?`emo-${e.activeSearchItemId}`:null}" data-ref="searchElement" data-on-input="onSearchInput" data-on-keydown="onSearchKeydown"><label class="sr-only" for="search">${e.i18n.searchLabel}</label> <span id="search-description" class="sr-only">${e.i18n.searchDescription}</span></div><div class="skintone-button-wrapper ${e.skinTonePickerExpandedAfterAnimation?"expanded":""}"><button id="skintone-button" class="emoji ${e.skinTonePickerExpanded?"hide-focus":""}" aria-label="${e.skinToneButtonLabel}" title="${e.skinToneButtonLabel}" aria-describedby="skintone-description" aria-haspopup="listbox" aria-expanded="${e.skinTonePickerExpanded}" aria-controls="skintone-list" data-on-click="onClickSkinToneButton">${e.skinToneButtonText||""}</button></div><span id="skintone-description" class="sr-only">${e.i18n.skinToneDescription}</span><div data-ref="skinToneDropdown" id="skintone-list" class="skintone-list hide-focus ${e.skinTonePickerExpanded?"":"hidden no-animate"}" style="transform:translateY(${e.skinTonePickerExpanded?0:"calc(-1 * var(--num-skintones) * var(--total-emoji-size))"})" role="listbox" aria-label="${e.i18n.skinTonesLabel}" aria-activedescendant="skintone-${e.activeSkinTone}" aria-hidden="${!e.skinTonePickerExpanded}" tabIndex="-1" data-on-focusout="onSkinToneOptionsFocusOut" data-on-click="onSkinToneOptionsClick" data-on-keydown="onSkinToneOptionsKeydown" data-on-keyup="onSkinToneOptionsKeyup">${b(e.skinTones,(v,x)=>p`<div id="skintone-${x}" class="emoji ${x===e.activeSkinTone?"active":""}" aria-selected="${x===e.activeSkinTone}" role="option" title="${e.i18n.skinTones[x]}" aria-label="${e.i18n.skinTones[x]}">${v}</div>`,v=>v)}</div></div><div class="nav" role="tablist" style="grid-template-columns:repeat(${e.groups.length},1fr)" aria-label="${e.i18n.categoriesLabel}" data-on-keydown="onNavKeydown" data-on-click="onNavClick">${b(e.groups,v=>p`<button role="tab" class="nav-button" aria-controls="tab-${v.id}" aria-label="${e.i18n.categories[v.name]}" aria-selected="${!e.searchMode&&e.currentGroup.id===v.id}" title="${e.i18n.categories[v.name]}" data-group-id="${v.id}"><div class="nav-emoji emoji">${v.emoji}</div></button>`,v=>v.id)}</div><div class="indicator-wrapper"><div class="indicator" style="transform:translateX(${(e.isRtl?-1:1)*e.currentGroupIndex*100}%)"></div></div><div class="message ${e.message?"":"gone"}" role="alert" aria-live="polite">${e.message||""}</div><div data-ref="tabpanelElement" class="tabpanel ${!e.databaseLoaded||e.message?"gone":""}" role="${e.searchMode?"region":"tabpanel"}" aria-label="${e.searchMode?e.i18n.searchResultsLabel:e.i18n.categories[e.currentGroup.name]}" id="${e.searchMode?null:`tab-${e.currentGroup.id}`}" tabIndex="0" data-on-click="onEmojiClick"><div data-action="calculateEmojiGridStyle">${b(e.currentEmojisWithCategories,(v,x)=>p`<div><div id="menu-label-${x}" class="category ${e.currentEmojisWithCategories.length===1&&e.currentEmojisWithCategories[0].category===""?"gone":""}" aria-hidden="true">${e.searchMode?e.i18n.searchResultsLabel:v.category?v.category:e.currentEmojisWithCategories.length>1?e.i18n.categories.custom:e.i18n.categories[e.currentGroup.name]}</div><div class="emoji-menu ${x!==0&&!e.searchMode&&e.currentGroup.id===-1?"visibility-auto":""}" style="${`--num-rows: ${Math.ceil(v.emojis.length/e.numColumns)}`}" data-action="updateOnIntersection" role="${e.searchMode?"listbox":"menu"}" aria-labelledby="menu-label-${x}" id="${e.searchMode?"search-results":null}">${E(v.emojis,e.searchMode,"emo")}</div></div>`,v=>v.category)}</div></div><div class="favorites onscreen emoji-menu ${e.message?"gone":""}" role="menu" aria-label="${e.i18n.favoritesLabel}" data-on-click="onEmojiClick">${E(e.currentFavorites,!1,"fav")}</div><button data-ref="baselineEmoji" aria-hidden="true" tabindex="-1" class="abs-pos hidden emoji baseline-emoji">😀</button></section>`,ce=(v,x)=>{for(const N of s.querySelectorAll(`[${v}]`))x(N,N.getAttribute(v))};if(l){s.appendChild(U);for(const v of["click","focusout","input","keydown","keyup"])ce(`data-on-${v}`,(x,N)=>{x.addEventListener(v,i[N])});ce("data-ref",(v,x)=>{n[x]=v}),o.addEventListener("abort",()=>{s.removeChild(U)})}ce("data-action",(v,x)=>{let N=a.get(x);N||a.set(x,N=new WeakSet),N.has(v)||(N.add(v),r[x](v))})}const St=typeof queueMicrotask=="function"?queueMicrotask:s=>Promise.resolve().then(s);function Bo(s){let e=!1,t;const i=new Map,r=new Set;let n;const o=()=>{if(e)return;const c=[...r];r.clear();try{for(const h of c)h()}finally{n=!1,r.size&&(n=!0,St(o))}},a=new Proxy({},{get(c,h){if(t){let u=i.get(h);u||(u=new Set,i.set(h,u)),u.add(t)}return c[h]},set(c,h,u){if(c[h]!==u){c[h]=u;const p=i.get(h);if(p){for(const b of p)r.add(b);n||(n=!0,St(o))}}return!0}}),l=c=>{const h=()=>{const u=t;t=h;try{return c()}finally{t=u}};return h()};return s.addEventListener("abort",()=>{e=!0}),{state:a,createEffect:l}}function Ft(s,e,t){if(s.length!==e.length)return!1;for(let i=0;i<s.length;i++)if(!t(s[i],e[i]))return!1;return!0}const oi=new WeakMap;function Do(s,e,t){{const i=s.closest(".tabpanel");let r=oi.get(i);r||(r=new IntersectionObserver(t,{root:i,rootMargin:"50% 0px 50% 0px",threshold:0}),oi.set(i,r),e.addEventListener("abort",()=>{r.disconnect()})),r.observe(s)}}const Gt=[],{assign:at}=Object;function Uo(s,e){const t={},i=new AbortController,r=i.signal,{state:n,createEffect:o}=Bo(r),a=new Map;at(n,{skinToneEmoji:void 0,i18n:void 0,database:void 0,customEmoji:void 0,customCategorySorting:void 0,emojiVersion:void 0}),at(n,e),at(n,{initialLoad:!0,currentEmojis:[],currentEmojisWithCategories:[],rawSearchText:"",searchText:"",searchMode:!1,activeSearchItem:-1,message:void 0,skinTonePickerExpanded:!1,skinTonePickerExpandedAfterAnimation:!1,currentSkinTone:0,activeSkinTone:0,skinToneButtonText:void 0,pickerStyle:void 0,skinToneButtonLabel:"",skinTones:[],currentFavorites:[],defaultFavoriteEmojis:void 0,numColumns:io,isRtl:!1,currentGroupIndex:0,groups:Dt,databaseLoaded:!1,activeSearchItemId:void 0}),o(()=>{n.currentGroup!==n.groups[n.currentGroupIndex]&&(n.currentGroup=n.groups[n.currentGroupIndex])});const l=d=>{s.getElementById(d).focus()},c=d=>s.getElementById(`emo-${d.id}`),h=(d,m)=>{t.rootElement.dispatchEvent(new CustomEvent(d,{detail:m,bubbles:!0,composed:!0}))},u=(d,m)=>d.id===m.id,p=(d,m)=>{const{category:w,emojis:_}=d,{category:L,emojis:M}=m;return w!==L?!1:Ft(_,M,u)},b=d=>{Ft(n.currentEmojis,d,u)||(n.currentEmojis=d)},E=d=>{n.searchMode!==d&&(n.searchMode=d)},$=d=>{Ft(n.currentEmojisWithCategories,d,p)||(n.currentEmojisWithCategories=d)},U=(d,m)=>m&&d.skins&&d.skins[m]||d.unicode,x={labelWithSkin:(d,m)=>Co([d.name||U(d,m),d.annotation,...d.shortcodes||Gt].filter(Boolean)).join(", "),titleForEmoji:d=>d.annotation||(d.shortcodes||Gt).join(", "),unicodeWithSkin:U},N={onClickSkinToneButton:yr,onEmojiClick:gr,onNavClick:pr,onNavKeydown:fr,onSearchKeydown:hr,onSkinToneOptionsClick:br,onSkinToneOptionsFocusOut:Cr,onSkinToneOptionsKeydown:vr,onSkinToneOptionsKeyup:wr,onSearchInput:_r},W={calculateEmojiGridStyle:or,updateOnIntersection:ar};let Ne=!0;o(()=>{Mo(s,n,x,N,W,t,r,a,Ne),Ne=!1}),n.emojiVersion||Nt().then(d=>{d||(n.message=n.i18n.emojiUnsupportedMessage)}),o(()=>{async function d(){let m=!1;const w=setTimeout(()=>{m=!0,n.message=n.i18n.loadingMessage},to);try{await n.database.ready(),n.databaseLoaded=!0}catch(_){console.error(_),n.message=n.i18n.networkErrorMessage}finally{clearTimeout(w),m&&(m=!1,n.message="")}}n.database&&d()}),o(()=>{n.pickerStyle=`
      --num-groups: ${n.groups.length}; 
      --indicator-opacity: ${n.searchMode?0:1}; 
      --num-skintones: ${Qs};`}),o(()=>{n.customEmoji&&n.database&&Rs()}),o(()=>{n.customEmoji&&n.customEmoji.length?n.groups!==es&&(n.groups=es):n.groups!==Dt&&(n.currentGroupIndex&&n.currentGroupIndex--,n.groups=Dt)}),o(()=>{async function d(){n.databaseLoaded&&(n.currentSkinTone=await n.database.getPreferredSkinTone())}d()}),o(()=>{n.skinTones=Array(Qs).fill().map((d,m)=>mo(n.skinToneEmoji,m))}),o(()=>{n.skinToneButtonText=n.skinTones[n.currentSkinTone]}),o(()=>{n.skinToneButtonLabel=n.i18n.skinToneLabel.replace("{skinTone}",n.i18n.skinTones[n.currentSkinTone])}),o(()=>{async function d(){const{database:m}=n,w=(await Promise.all(ro.map(_=>m.getEmojiByUnicodeOrName(_)))).filter(Boolean);n.defaultFavoriteEmojis=w}n.databaseLoaded&&d()});function Rs(){const{customEmoji:d,database:m}=n,w=d||Gt;m.customEmoji!==w&&(m.customEmoji=w)}o(()=>{async function d(){Rs();const{database:m,defaultFavoriteEmojis:w,numColumns:_}=n,L=await m.getTopFavoriteEmoji(_),M=await Rt(Gi([...L,...w],X=>X.unicode||X.name).slice(0,_));n.currentFavorites=M}n.databaseLoaded&&n.defaultFavoriteEmojis&&d()});function or(d){yo(d,r,()=>{{const m=getComputedStyle(t.rootElement),w=parseInt(m.getPropertyValue("--num-columns"),10),_=m.getPropertyValue("direction")==="rtl";n.numColumns=w,n.isRtl=_}})}function ar(d){Do(d,r,m=>{for(const{target:w,isIntersecting:_}of m)w.classList.toggle("onscreen",_)})}o(()=>{async function d(){const{searchText:m,currentGroup:w,databaseLoaded:_,customEmoji:L}=n;if(!_)n.currentEmojis=[],n.searchMode=!1;else if(m.length>=Qn){const M=await ur(m);n.searchText===m&&(b(M),E(!0))}else{const{id:M}=w;if(M!==-1||L&&L.length){const X=await dr(M);n.currentGroup.id===M&&(b(X),E(!1))}}}d()});const Os=()=>{ft(()=>_o(t.tabpanelElement))};o(()=>{const{currentEmojis:d,emojiVersion:m}=n,w=d.filter(_=>_.unicode).filter(_=>ei(_)&&!ts.has(_.unicode));if(!m&&w.length)b(d),ft(()=>lr(w));else{const _=m?d:d.filter(cr);b(_),Os()}});function lr(d){wo(d,t.baselineEmoji,c)?Os():n.currentEmojis=[...n.currentEmojis]}function cr(d){return!d.unicode||!ei(d)||ts.get(d.unicode)}async function Ls(d){const m=n.emojiVersion||await Nt();return d.filter(({version:w})=>!w||w<=m)}async function Rt(d){return go(d,n.emojiVersion||await Nt())}async function dr(d){const m=d===-1?n.customEmoji:await n.database.getEmojiByGroup(d);return Rt(await Ls(m))}async function ur(d){return Rt(await Ls(await n.database.getEmojiBySearchQuery(d)))}o(()=>{}),o(()=>{function d(){const{searchMode:w,currentEmojis:_}=n;if(w)return[{category:"",emojis:_}];const L=new Map;for(const M of _){const X=M.category||"";let rt=L.get(X);rt||(rt=[],L.set(X,rt)),rt.push(M)}return[...L.entries()].map(([M,X])=>({category:M,emojis:X})).sort((M,X)=>n.customCategorySorting(M.category,X.category))}const m=d();$(m)}),o(()=>{n.activeSearchItemId=n.activeSearchItem!==-1&&n.currentEmojis[n.activeSearchItem].id}),o(()=>{const{rawSearchText:d}=n;qi(()=>{n.searchText=(d||"").trim(),n.activeSearchItem=-1})});function hr(d){if(!n.searchMode||!n.currentEmojis.length)return;const m=w=>{ie(d),n.activeSearchItem=zt(w,n.activeSearchItem,n.currentEmojis)};switch(d.key){case"ArrowDown":return m(!1);case"ArrowUp":return m(!0);case"Enter":if(n.activeSearchItem===-1)n.activeSearchItem=0;else return ie(d),Ps(n.currentEmojis[n.activeSearchItem].id)}}function pr(d){const{target:m}=d,w=m.closest(".nav-button");if(!w)return;const _=parseInt(w.dataset.groupId,10);t.searchElement.value="",n.rawSearchText="",n.searchText="",n.activeSearchItem=-1,n.currentGroupIndex=n.groups.findIndex(L=>L.id===_)}function fr(d){const{target:m,key:w}=d,_=L=>{L&&(ie(d),L.focus())};switch(w){case"ArrowLeft":return _(m.previousElementSibling);case"ArrowRight":return _(m.nextElementSibling);case"Home":return _(m.parentElement.firstElementChild);case"End":return _(m.parentElement.lastElementChild)}}async function mr(d){const m=await n.database.getEmojiByUnicodeOrName(d),w=[...n.currentEmojis,...n.currentFavorites].find(L=>L.id===d),_=w.unicode&&U(w,n.currentSkinTone);return await n.database.incrementFavoriteEmojiCount(d),{emoji:m,skinTone:n.currentSkinTone,..._&&{unicode:_},...w.name&&{name:w.name}}}async function Ps(d){const m=mr(d);h("emoji-click-sync",m),h("emoji-click",await m)}function gr(d){const{target:m}=d;if(!m.classList.contains("emoji"))return;ie(d);const w=m.id.substring(4);Ps(w)}function Ot(d){n.currentSkinTone=d,n.skinTonePickerExpanded=!1,l("skintone-button"),h("skin-tone-change",{skinTone:d}),n.database.setPreferredSkinTone(d)}function br(d){const{target:{id:m}}=d,w=m&&m.match(/^skintone-(\d)/);if(!w)return;ie(d);const _=parseInt(w[1],10);Ot(_)}function yr(d){n.skinTonePickerExpanded=!n.skinTonePickerExpanded,n.activeSkinTone=n.currentSkinTone,n.skinTonePickerExpanded&&(ie(d),ft(()=>l("skintone-list")))}o(()=>{n.skinTonePickerExpanded?t.skinToneDropdown.addEventListener("transitionend",()=>{n.skinTonePickerExpandedAfterAnimation=!0},{once:!0}):n.skinTonePickerExpandedAfterAnimation=!1});function vr(d){if(!n.skinTonePickerExpanded)return;const m=async w=>{ie(d),n.activeSkinTone=w};switch(d.key){case"ArrowUp":return m(zt(!0,n.activeSkinTone,n.skinTones));case"ArrowDown":return m(zt(!1,n.activeSkinTone,n.skinTones));case"Home":return m(0);case"End":return m(n.skinTones.length-1);case"Enter":return ie(d),Ot(n.activeSkinTone);case"Escape":return ie(d),n.skinTonePickerExpanded=!1,l("skintone-button")}}function wr(d){if(n.skinTonePickerExpanded&&d.key===" ")return ie(d),Ot(n.activeSkinTone)}async function Cr(d){const{relatedTarget:m}=d;(!m||m.id!=="skintone-list")&&(n.skinTonePickerExpanded=!1)}function _r(d){n.rawSearchText=d.target.value}return{$set(d){at(n,d)},$destroy(){i.abort()}}}const No="https://cdn.jsdelivr.net/npm/emoji-picker-element-data@^1/en/emojibase/data.json",zo="en";var qo={categoriesLabel:"Categories",emojiUnsupportedMessage:"Your browser does not support color emoji.",favoritesLabel:"Favorites",loadingMessage:"Loading…",networkErrorMessage:"Could not load emoji.",regionLabel:"Emoji picker",searchDescription:"When search results are available, press up or down to select and enter to choose.",searchLabel:"Search",searchResultsLabel:"Search results",skinToneDescription:"When expanded, press up or down to select and enter to choose.",skinToneLabel:"Choose a skin tone (currently {skinTone})",skinTonesLabel:"Skin tones",skinTones:["Default","Light","Medium-Light","Medium","Medium-Dark","Dark"],categories:{custom:"Custom","smileys-emotion":"Smileys and emoticons","people-body":"People and body","animals-nature":"Animals and nature","food-drink":"Food and drink","travel-places":"Travel and places",activities:"Activities",objects:"Objects",symbols:"Symbols",flags:"Flags"}},Fo=':host{--emoji-size:1.375rem;--emoji-padding:0.5rem;--category-emoji-size:var(--emoji-size);--category-emoji-padding:var(--emoji-padding);--indicator-height:3px;--input-border-radius:0.5rem;--input-border-size:1px;--input-font-size:1rem;--input-line-height:1.5;--input-padding:0.25rem;--num-columns:8;--outline-size:2px;--border-size:1px;--border-radius:0;--skintone-border-radius:1rem;--category-font-size:1rem;display:flex;width:min-content;height:400px}:host,:host(.light){color-scheme:light;--background:#fff;--border-color:#e0e0e0;--indicator-color:#385ac1;--input-border-color:#999;--input-font-color:#111;--input-placeholder-color:#999;--outline-color:#999;--category-font-color:#111;--button-active-background:#e6e6e6;--button-hover-background:#d9d9d9}:host(.dark){color-scheme:dark;--background:#222;--border-color:#444;--indicator-color:#5373ec;--input-border-color:#ccc;--input-font-color:#efefef;--input-placeholder-color:#ccc;--outline-color:#fff;--category-font-color:#efefef;--button-active-background:#555555;--button-hover-background:#484848}@media (prefers-color-scheme:dark){:host{color-scheme:dark;--background:#222;--border-color:#444;--indicator-color:#5373ec;--input-border-color:#ccc;--input-font-color:#efefef;--input-placeholder-color:#ccc;--outline-color:#fff;--category-font-color:#efefef;--button-active-background:#555555;--button-hover-background:#484848}}:host([hidden]){display:none}button{margin:0;padding:0;border:0;background:0 0;box-shadow:none;-webkit-tap-highlight-color:transparent}button::-moz-focus-inner{border:0}input{padding:0;margin:0;line-height:1.15;font-family:inherit}input[type=search]{-webkit-appearance:none}:focus{outline:var(--outline-color) solid var(--outline-size);outline-offset:calc(-1*var(--outline-size))}:host([data-js-focus-visible]) :focus:not([data-focus-visible-added]){outline:0}:focus:not(:focus-visible){outline:0}.hide-focus{outline:0}*{box-sizing:border-box}.picker{contain:content;display:flex;flex-direction:column;background:var(--background);border:var(--border-size) solid var(--border-color);border-radius:var(--border-radius);width:100%;height:100%;overflow:hidden;--total-emoji-size:calc(var(--emoji-size) + (2 * var(--emoji-padding)));--total-category-emoji-size:calc(var(--category-emoji-size) + (2 * var(--category-emoji-padding)))}.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);border:0}.hidden{opacity:0;pointer-events:none}.abs-pos{position:absolute;left:0;top:0}.gone{display:none!important}.skintone-button-wrapper,.skintone-list{background:var(--background);z-index:3}.skintone-button-wrapper.expanded{z-index:1}.skintone-list{position:absolute;inset-inline-end:0;top:0;z-index:2;overflow:visible;border-bottom:var(--border-size) solid var(--border-color);border-radius:0 0 var(--skintone-border-radius) var(--skintone-border-radius);will-change:transform;transition:transform .2s ease-in-out;transform-origin:center 0}@media (prefers-reduced-motion:reduce){.skintone-list{transition-duration:.001s}}@supports not (inset-inline-end:0){.skintone-list{right:0}}.skintone-list.no-animate{transition:none}.tabpanel{overflow-y:auto;scrollbar-gutter:stable;-webkit-overflow-scrolling:touch;will-change:transform;min-height:0;flex:1;contain:content}.emoji-menu{display:grid;grid-template-columns:repeat(var(--num-columns),var(--total-emoji-size));justify-content:space-around;align-items:flex-start;width:100%}.emoji-menu.visibility-auto{content-visibility:auto;contain-intrinsic-size:calc(var(--num-columns)*var(--total-emoji-size)) calc(var(--num-rows)*var(--total-emoji-size))}.category{padding:var(--emoji-padding);font-size:var(--category-font-size);color:var(--category-font-color)}.emoji,button.emoji{font-size:var(--emoji-size);display:flex;align-items:center;justify-content:center;border-radius:100%;height:var(--total-emoji-size);width:var(--total-emoji-size);line-height:1;overflow:hidden;font-family:var(--emoji-font-family);cursor:pointer}@media (hover:hover) and (pointer:fine){.emoji:hover,button.emoji:hover{background:var(--button-hover-background)}}.emoji.active,.emoji:active,button.emoji.active,button.emoji:active{background:var(--button-active-background)}.onscreen .custom-emoji::after{content:"";width:var(--emoji-size);height:var(--emoji-size);background-repeat:no-repeat;background-position:center center;background-size:contain;background-image:var(--custom-emoji-background)}.nav,.nav-button{align-items:center}.nav{display:grid;justify-content:space-between;contain:content}.nav-button{display:flex;justify-content:center}.nav-emoji{font-size:var(--category-emoji-size);width:var(--total-category-emoji-size);height:var(--total-category-emoji-size)}.indicator-wrapper{display:flex;border-bottom:1px solid var(--border-color)}.indicator{width:calc(100%/var(--num-groups));height:var(--indicator-height);opacity:var(--indicator-opacity);background-color:var(--indicator-color);will-change:transform,opacity;transition:opacity .1s linear,transform .25s ease-in-out}@media (prefers-reduced-motion:reduce){.indicator{will-change:opacity;transition:opacity .1s linear}}.pad-top,input.search{background:var(--background);width:100%}.pad-top{height:var(--emoji-padding);z-index:3}.search-row{display:flex;align-items:center;position:relative;padding-inline-start:var(--emoji-padding);padding-bottom:var(--emoji-padding)}.search-wrapper{flex:1;min-width:0}input.search{padding:var(--input-padding);border-radius:var(--input-border-radius);border:var(--input-border-size) solid var(--input-border-color);color:var(--input-font-color);font-size:var(--input-font-size);line-height:var(--input-line-height)}input.search::placeholder{color:var(--input-placeholder-color)}.favorites{overflow-y:auto;scrollbar-gutter:stable;display:flex;flex-direction:row;border-top:var(--border-size) solid var(--border-color);contain:content}.message{padding:var(--emoji-padding)}';const Vi=["customEmoji","customCategorySorting","database","dataSource","i18n","locale","skinToneEmoji","emojiVersion"],Go=`:host{--emoji-font-family:${Fi}}`;class _s extends HTMLElement{constructor(e){super(),this.attachShadow({mode:"open"});const t=document.createElement("style");t.textContent=Fo+Go,this.shadowRoot.appendChild(t),this._ctx={locale:zo,dataSource:No,skinToneEmoji:so,customCategorySorting:no,customEmoji:null,i18n:qo,emojiVersion:null,...e};for(const i of Vi)i!=="database"&&Object.prototype.hasOwnProperty.call(this,i)&&(this._ctx[i]=this[i],delete this[i]);this._dbFlush()}connectedCallback(){ai(this),this._cmp||(this._cmp=Uo(this.shadowRoot,this._ctx))}disconnectedCallback(){ai(this),St(()=>{if(!this.isConnected&&this._cmp){this._cmp.$destroy(),this._cmp=void 0;const{database:e}=this._ctx;e.close().catch(t=>console.error(t))}})}static get observedAttributes(){return["locale","data-source","skin-tone-emoji","emoji-version"]}attributeChangedCallback(e,t,i){this._set(e.replace(/-([a-z])/g,(r,n)=>n.toUpperCase()),e==="emoji-version"?parseFloat(i):i)}_set(e,t){this._ctx[e]=t,this._cmp&&this._cmp.$set({[e]:t}),["locale","dataSource"].includes(e)&&this._dbFlush()}_dbCreate(){const{locale:e,dataSource:t,database:i}=this._ctx;(!i||i.locale!==e||i.dataSource!==t)&&this._set("database",new Xn({locale:e,dataSource:t}))}_dbFlush(){St(()=>this._dbCreate())}}const Hi={};for(const s of Vi)Hi[s]={get(){return s==="database"&&this._dbCreate(),this._ctx[s]},set(e){if(s==="database")throw new Error("database is read-only");this._set(s,e)}};Object.defineProperties(_s.prototype,Hi);function ai(s){s instanceof _s||Object.setPrototypeOf(s,customElements.get(s.tagName.toLowerCase()).prototype)}customElements.get("emoji-picker")||customElements.define("emoji-picker",_s);var Vo=Object.defineProperty,Ho=Object.getOwnPropertyDescriptor,ye=(s,e,t,i)=>{for(var r=i>1?void 0:i?Ho(e,t):e,n=s.length-1,o;n>=0;n--)(o=s[n])&&(r=(i?o(e,t,r):o(r))||r);return i&&r&&Vo(e,t,r),r};const Wo=["👍","❤️","😂","🎉","😮","🔥"];let oe=class extends B{constructor(){super(...arguments),this.open=!1,this.messages=[],this.emojiPickerOpen=!1}handleKeyDown(s){s.key==="Enter"&&!s.shiftKey&&(s.preventDefault(),this.sendMessage())}updated(s){s.has("messages")&&(this.container.scrollTop=this.container.scrollHeight)}toggle(){this.open=!this.open}sendMessage(){const s=this.input.value.trim();if(!s)return;const e=he.load();if(!e){y.emit(f.UI.DialogOpenRequested,g.WebUI,"profile-dialog");return}const t=Ee.getCurrentLobbyId()??"global",i={id:crypto.randomUUID(),lobbyId:t,senderId:e.id,senderName:e.username,content:s,createdAt:Date.now(),reactions:[]};this.messages=[...this.messages,i],y.emit(f.Chat.MessageSent,g.WebUI,i),this.input.value="",this.input.style.height="auto",this.emojiPickerOpen=!1}handleReactionRequest(s,e){const i={lobbyId:Ee.getCurrentLobbyId()??"global",messageId:s,emoji:e};y.emit(f.Chat.MessageReactionRequested,g.WebUI,i)}toggleEmojiPicker(){this.emojiPickerOpen=!this.emojiPickerOpen}handleEmojiClick(s){const e=s.detail?.unicode??"😀";this.input.value=`${this.input.value}${e}`,this.input.focus(),this.emojiPickerOpen=!1}onChatMessage(s){this.messages.some(e=>e.id===s.id)||(this.messages=[...this.messages,s])}onReaction(s){this.messages=this.messages.map(e=>e.id===s.id?s:e)}render(){return C`
      <button class="chat-toggle-btn" @click="${this.toggle}">💬</button>

      <div class="drawer-header">
        <span>Lobby Chat</span>
        <button class="close-btn" @click="${this.toggle}">x</button>
      </div>

      <div class="chat-content">
        ${cn(this.messages,s=>s.id,s=>C`
            <div class="message">
              <div class="message-header">
                <strong>${s.senderName}</strong>
                <span class="time">
                  ${new Date(s.createdAt).toLocaleTimeString([],{hour:"2-digit",minute:"2-digit"})}
                </span>
              </div>
              <div>${s.content}</div>
              <div class="reaction-row">
                ${s.reactions.map(e=>C`
                    <span class="reaction-pill">
                      ${e.emoji} ${e.userIds.length}
                    </span>
                  `)}
              </div>
              <div class="message-actions">
                ${Wo.map(e=>C`
                    <button
                      class="reaction-btn"
                      title="Reagieren mit ${e}"
                      @click="${()=>this.handleReactionRequest(s.id,e)}"
                    >
                      ${e}
                    </button>
                  `)}
              </div>
            </div>
          `)}
      </div>

      <div class="chat-input-area">
        <textarea
          id="chat-input"
          placeholder="Nachricht..."
          rows="1"
          @keydown="${this.handleKeyDown}"
          @input="${s=>{const e=s.target;e.style.height="auto",e.style.height=e.scrollHeight+"px"}}"
        ></textarea>
        <button
          class="emoji-btn"
          @click="${this.toggleEmojiPicker}"
          title="Emoji einfügen"
        >
          ✨
        </button>
        <button class="send-btn" @click="${this.sendMessage}">Senden</button>
        ${this.emojiPickerOpen?C`
              <div class="emoji-picker-wrap">
                <emoji-picker @emoji-click="${this.handleEmojiClick}"></emoji-picker>
              </div>
            `:null}
      </div>
    `}};oe.styles=te`
    :host {
      width: 0;
      height: 100%;
      background-color: var(--cell-bg);
      border-left: 0 solid transparent;
      transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      overflow: hidden;
      flex-shrink: 0;
      display: flex;
      flex-direction: column;
      position: relative;
      z-index: 100;
    }

    :host([open]) {
      width: 30.75rem;
      border-left: 0.125rem solid var(--border-color);
    }

    .chat-toggle-btn {
      position: fixed;
      right: 1.875rem;
      bottom: 1.875rem;
      width: 3.75rem;
      height: 3.75rem;
      border-radius: 50%;
      background-color: var(--primary-accent);
      color: var(--bg-color);
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 0.25rem 0.9375rem rgba(0, 0, 0, 0.3);
      font-size: 1.5rem;
      cursor: pointer;
      z-index: 200;
      transition:
        transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1),
        box-shadow 0.2s;
    }

    :host([open]) .chat-toggle-btn {
      transform: scale(0);
      opacity: 0;
      pointer-events: none;
    }
    .chat-toggle-btn:hover {
      transform: scale(1.1) rotate(-3deg);
      box-shadow: 0 0.375rem 1.25rem var(--glow-core);
    }
    .chat-toggle-btn:active {
      transform: scale(0.9);
    }

    .drawer-header {
      padding: 0.9375rem;
      font-weight: bold;
      border-bottom: 0.0625rem solid var(--border-color);
      background-color: var(--bg-color);
      color: var(--text-main);
      white-space: nowrap;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }

    .close-btn {
      background: transparent;
      border: none;
      color: var(--text-main);
      font-weight: bold;
      cursor: pointer;
      font-size: 1.2rem;
    }

    .chat-content {
      flex-grow: 1;
      padding: 0.625rem;
      overflow-y: auto;
      background-color: var(--cell-bg);
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .chat-input-area {
      padding: 0.625rem;
      border-top: 0.0625rem solid var(--border-color);
      background-color: var(--bg-color);
      display: flex;
      align-items: flex-end;
      gap: 0.5rem;
      flex-shrink: 0;
      position: relative;
    }

    textarea,
    input {
      flex-grow: 1;
      padding: 0.5rem;
      border-radius: 0.25rem;
      border: 0.0625rem solid var(--border-color);
      font-family: inherit;
      background: var(--cell-bg);
      color: var(--text-main);
    }

    textarea {
      field-sizing: content;
      resize: none;
      min-height: 1.5em;
      max-height: 150px;
      overflow-y: auto;
    }

    button.send-btn,
    button.emoji-btn,
    button.reaction-btn {
      padding: 0.5rem 0.85rem;
      background: var(--primary-accent);
      color: var(--bg-color);
      border: none;
      border-radius: 0.35rem;
      cursor: pointer;
      font-weight: bold;
      flex-shrink: 0;
    }

    button.emoji-btn {
      min-width: 2.6rem;
    }

    .emoji-picker-wrap {
      position: absolute;
      inset-inline-end: 0.75rem;
      bottom: 4.8rem;
      z-index: 30;
    }

    emoji-picker {
      width: min(100%, 22rem);
      height: 22rem;
    }

    .message {
      background-color: var(--bg-color);
      padding: 0.5rem;
      border-radius: 0.5rem;
      border: 1.5px solid var(--border-color);
      word-break: break-word;
    }

    .message-header {
      display: flex;
      justify-content: space-between;
      gap: 0.5rem;
      align-items: center;
      margin-bottom: 0.35rem;
    }

    .time {
      color: var(--primary-accent);
      font-size: 0.8rem;
    }

    .message:hover {
      border: 2px solid var(--border-color);
      filter: drop-shadow(0 0 1rem var(--glow-core));
    }

    .message-actions {
      display: flex;
      gap: 0.35rem;
      flex-wrap: wrap;
      margin-top: 0.5rem;
    }

    .reaction-row {
      display: flex;
      gap: 0.35rem;
      flex-wrap: wrap;
      margin-top: 0.4rem;
    }

    .reaction-pill {
      padding: 0.2rem 0.5rem;
      border-radius: 999px;
      background: color-mix(in srgb, var(--primary-accent) 18%, var(--bg-color));
      border: 1px solid var(--border-color);
      font-size: 0.82rem;
    }

    @media (max-width: 37.5rem) {
      :host {
        position: fixed !important;
        top: 0;
        right: 0;
        bottom: 0;
        height: 100dvh;
        border-left: none !important;
        z-index: 2000;
        box-shadow: -0.3125rem 0 1.25rem rgba(0, 0, 0, 0.5);
        background-color: var(--bg-color);
        opacity: 95%;
      }
      :host([open]) {
        width: 100% !important;
      }
      .chat-toggle-btn {
        bottom: 5.3125rem;
        right: 1.25rem;
        width: 3.125rem;
        height: 3.125rem;
        font-size: 1.2rem;
      }
    }
  `;ye([se({type:Boolean,reflect:!0})],oe.prototype,"open",2);ye([A()],oe.prototype,"messages",2);ye([A()],oe.prototype,"emojiPickerOpen",2);ye([k(".chat-content")],oe.prototype,"container",2);ye([k("#chat-input")],oe.prototype,"input",2);ye([D(f.Chat.MessageReceived,g.WebUI)],oe.prototype,"onChatMessage",1);ye([D(f.Chat.MessageReactionReceived,g.WebUI)],oe.prototype,"onReaction",1);oe=ye([J("chat-drawer")],oe);const Ko=s=>s??T;var Zo=Object.defineProperty,Yo=Object.getOwnPropertyDescriptor,$t=(s,e,t,i)=>{for(var r=i>1?void 0:i?Yo(e,t):e,n=s.length-1,o;n>=0;n--)(o=s[n])&&(r=(i?o(e,t,r):o(r))||r);return i&&r&&Zo(e,t,r),r};let je=class extends B{constructor(){super(...arguments),this.variant="ghost",this.disabled=!1,this.ariaLabel=""}render(){return C`
      <button
        type="button"
        ?disabled=${this.disabled}
        aria-label=${Ko(this.ariaLabel||void 0)}
        class=${ki({primary:this.variant==="primary",ghost:this.variant==="ghost"})}
      >
        <slot></slot>
      </button>
    `}};je.styles=te`
    :host {
      display: inline-block;
    }

    button {
      padding: var(--ui-space-sm) var(--ui-space-lg);
      border-radius: var(--ui-radius-md);
      font-size: var(--ui-font-size-md);
      font-weight: 700;
      border: 2px solid var(--primary-accent);
      cursor: pointer;
      transition:
        background-color var(--ui-transition-fast),
        color var(--ui-transition-fast),
        transform var(--ui-transition-fast),
        opacity var(--ui-transition-fast);
      background: transparent;
      color: var(--primary-accent);
    }

    button.primary {
      background: var(--primary-accent);
      color: var(--bg-color);
    }

    button.ghost:hover {
      background: var(--primary-accent);
      color: var(--bg-color);
    }

    button.primary:hover {
      opacity: 0.92;
      transform: translateY(-1px);
    }

    button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      transform: none;
    }
  `;$t([se()],je.prototype,"variant",2);$t([se({type:Boolean,reflect:!0})],je.prototype,"disabled",2);$t([se({attribute:"aria-label"})],je.prototype,"ariaLabel",2);je=$t([J("app-button")],je);var Jo=Object.defineProperty,Xo=Object.getOwnPropertyDescriptor,Ss=(s,e,t,i)=>{for(var r=i>1?void 0:i?Xo(e,t):e,n=s.length-1,o;n>=0;n--)(o=s[n])&&(r=(i?o(e,t,r):o(r))||r);return i&&r&&Jo(e,t,r),r};let Qe=class extends B{constructor(){super(...arguments),this.title=""}show(){this.dialogElement.showModal()}close(){this.dialogElement.close()}render(){return C`
      <dialog
        @click="${s=>s.target===this.dialogElement&&this.close()}"
      >
        <div class="dialog-header">
          <h3>${this.title}</h3>
          <button class="close-btn" @click="${this.close}">&times;</button>
        </div>

        <div class="dialog-content">
          <slot></slot>
        </div>

        <div class="dialog-footer">
          <slot name="footer"></slot>
        </div>
      </dialog>
    `}};Qe.styles=te`
    :host {
      display: block;
    }

    dialog {
      border: none;
      border-radius: var(--ui-radius-md);
      padding: 0;
      background: var(--bg-color);
      color: var(--text-main);
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
      max-width: 500px;
      width: 90%;
      border: 1px solid var(--border-color);
    }

    dialog::backdrop {
      background: rgba(0, 0, 0, 0.5);
      backdrop-filter: blur(4px);
    }

    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: var(--ui-space-md) var(--ui-space-lg);
      border-bottom: 1px solid var(--border-color);
      background: var(--cell-bg);
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 1.5rem;
      color: var(--text-main);
      cursor: pointer;
      line-height: 1;
    }

    .dialog-content {
      padding: var(--ui-space-lg);
    }

    .dialog-footer {
      padding: var(--ui-space-md) var(--ui-space-lg);
      display: flex;
      justify-content: flex-end;
      gap: var(--ui-space-sm);
      border-top: 1px solid var(--border-color);
    }
  `;Ss([se({type:String})],Qe.prototype,"title",2);Ss([k("dialog")],Qe.prototype,"dialogElement",2);Qe=Ss([J("base-dialog")],Qe);var Qo=Object.defineProperty,ea=Object.getOwnPropertyDescriptor,le=(s,e,t,i)=>{for(var r=i>1?void 0:i?ea(e,t):e,n=s.length-1,o;n>=0;n--)(o=s[n])&&(r=(i?o(e,t,r):o(r))||r);return i&&r&&Qo(e,t,r),r};const li="btn-shape";let Y=class extends B{constructor(){super(),this.selectedThemeName=localStorage.getItem("user-theme")||"Catppuccin",this.buttonShape=localStorage.getItem(li)==="rounded"?"rounded":localStorage.getItem(li)==="square"?"square":localStorage.getItem("btn-shape-radius")==="50%"?"rounded":"square",this.username="",this.symbol="X",this.symbolError="",this.showEmojiPicker=!1;const e=he.load()??he.getDefaultDraft();this.username=e.username,this.symbol=e.symbol,this.selectedThemeName=e.preferences?.themeName||localStorage.getItem("user-theme")||"Catppuccin",this.buttonShape=e.preferences?.buttonRadius===Se.Rounded?"rounded":"square"}show(){this.baseDialog.show()}handleThemeChange(s){const t=s.target.value;this.selectedThemeName=t,y.emit(f.UI.ThemeChanged,g.WebUI,t)}handleShapeChange(s){return this.buttonShape=s,s==="rounded"?Se.Rounded:Se.Square}saveAndClose(){try{const s={username:this.username,symbol:ue(this.symbol),preferences:{themeName:this.selectedThemeName,buttonRadius:this.buttonShape==="rounded"?Se.Rounded:Se.Square}},e=he.save(s);return this.symbolError="",this.baseDialog.close(),e}catch(s){throw this.symbolError=s instanceof Error?s.message:"Ungültiges Symbol",s}}onEmojiClick(s){this.symbol=ue(s.detail?.unicode??"😀"),this.symbolError="",this.showEmojiPicker=!1}render(){return C`
      <base-dialog title="Profil & Design">
        <div class="settings-grid">
          <label>Benutzername:</label>
          <input
            type="text"
            .value="${this.username}"
            @input="${s=>{this.username=s.target.value,this.symbolError=""}}"
          />
          <hr
            style="grid-column: 1 / -1; width: 100%; border: 0; border-top: 1px solid var(--border-color); margin: 0.5rem 0;"
          />

          <label>Farbschema:</label>
          <select @change="${this.handleThemeChange}">
            ${Object.keys(xi).map(s=>C`
                <option
                  value="${s}"
                  ?selected="${s===this.selectedThemeName}"
                >
                  ${s}
                </option>
              `)}
          </select>

          <label>Button-Stil:</label>
          <div class="radio-group">
            <label class="radio-option">
              <input
                type="radio"
                name="shape"
                ?checked="${this.buttonShape==="rounded"}"
                @change="${()=>this.handleShapeChange("rounded")}"
              />
              Rund
            </label>
            <label class="radio-option">
              <input
                type="radio"
                name="shape"
                ?checked="${this.buttonShape==="square"}"
                @change="${()=>this.handleShapeChange("square")}"
              />
              Eckig
              </label>
            </div>

          <label>Symbol:</label>
          <div class="emoji-row">
            <input
              type="text"
              .value="${this.symbol}"
              maxlength="2"
              @input="${s=>{this.symbol=s.target.value,this.symbolError=""}}"
            />
            <div class="emoji-picker-wrap">
              <button
                class="btn"
                @click="${()=>this.showEmojiPicker=!this.showEmojiPicker}"
                type="button"
              >
                😀
              </button>
              ${this.showEmojiPicker?C`<emoji-picker @emoji-click="${this.onEmojiClick}"></emoji-picker>`:null}
            </div>
          </div>
        </div>

        <div slot="footer">
          <button
            class="btn primary"
            @click="${this.saveAndClose}"
            ?disabled="${!!this.symbolError}"
          >
            Fertig
          </button>
        </div>
      </base-dialog>
    `}};Y.styles=te`
    .settings-grid {
      display: grid;
      grid-template-columns: 1fr 1.5fr;
      gap: 1.5rem;
      align-items: center;
    }
    .emoji-row {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .emoji-picker-wrap {
      position: relative;
    }
    .radio-group {
      display: flex;
      gap: 1rem;
    }
    .radio-option {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      cursor: pointer;
    }
    select,
    input[type="text"] {
      padding: 0.5rem;
      border-radius: 8px;
      background: var(--bg-color);
      color: var(--text-main);
      border: 1px solid var(--border-color);
      width: 100%;
    }
    emoji-picker {
      position: absolute;
      inset-inline-start: 0;
      top: 2.75rem;
      z-index: 20;
    }
  `;le([k("base-dialog")],Y.prototype,"baseDialog",2);le([A()],Y.prototype,"selectedThemeName",2);le([A()],Y.prototype,"buttonShape",2);le([A()],Y.prototype,"username",2);le([A()],Y.prototype,"symbol",2);le([A()],Y.prototype,"symbolError",2);le([A()],Y.prototype,"showEmojiPicker",2);le([st(f.UI.ButtonShapeChanged,g.WebUI)],Y.prototype,"handleShapeChange",1);le([st(f.UI.ProfileChangeRequested,g.WebUI)],Y.prototype,"saveAndClose",1);Y=le([J("profile-dialog")],Y);const Oe={Public:"public",Private:"private",Local:"local"};var ta=Object.defineProperty,sa=Object.getOwnPropertyDescriptor,F=(s,e,t,i)=>{for(var r=i>1?void 0:i?sa(e,t):e,n=s.length-1,o;n>=0;n--)(o=s[n])&&(r=(i?o(e,t,r):o(r))||r);return i&&r&&ta(e,t,r),r};let j=class extends B{constructor(){super(...arguments),this.boardSizeLimit=3}show(){this.baseDialog.show()}applySettings(){const s={maxPlayers:parseInt(this.maxPlayers.value),allowedLocalPlayers:parseInt(this.localPlayers.value),maxBots:parseInt(this.bots.value),visibility:this.visibility.value,autoStart:this.autoStart.checked,boardSize:parseInt(this.boardSize.value),winCon:parseInt(this.winCon.value),gravityEnabled:this.gravityEnabled.checked,rotationEnabled:this.rotationEnabled.checked,moveTimeoutMs:parseInt(this.moveTimeout.value||"0"),penaltyMode:this.penaltyMode.value,presetId:null};return this.baseDialog.close(),s}render(){return C`
      <base-dialog title="Lobby & Host">
      <div class="lobby-grid">
          <label>
            Maximale Spieler
            <input id="max-players" type="number" value="4" min="2" max="8" />
          </label>
          <label>
            Lokale Zusatzspieler
            <input id="local-players" type="number" value="1" min="0" max="7" />
          </label>
          <label>
            Bot-Slots
            <input id="bots" type="number" value="0" min="0" max="4" />
          </label>
          <label>
            Spielfeldgröße
            <input
              id="board-size"
              type="number"
              value="3"
              min="2"
              max="10"
              @input="${s=>{const e=parseInt(s.target.value||"3");this.boardSizeLimit=e,this.winCon&&parseInt(this.winCon.value||"3")>e&&(this.winCon.value=String(e))}}"
            />
          </label>
          <label>
            Gewinnbedingung
            <input
              id="win-con"
              type="number"
              value="3"
              min="2"
              max="${this.boardSizeLimit}"
            />
          </label>
          <label>
            Zugzeitlimit (ms)
            <input id="move-timeout" type="number" value="0" min="0" />
          </label>
          <label>
            Strafmodus
            <select id="penalty-mode">
              <option value="warning">Verwarnung</option>
              <option value="random-move">Zufallszug</option>
              <option value="kick">Kick</option>
            </select>
          </label>
          <label style="display: flex; align-items: center; gap: 0.5rem;">
            <input id="gravity-enabled" type="checkbox" />
            Gravitation
          </label>
          <label style="display: flex; align-items: center; gap: 0.5rem;">
            <input id="rotation-enabled" type="checkbox" />
            Rotation erlauben
          </label>
          <label>
            Sichtbarkeit
            <select id="visibility">
              <option value="${Oe.Public}">Öffentlich</option>
              <option value="${Oe.Private}">Privat</option>
              <option value="${Oe.Local}">Lokal</option>
            </select>
          </label>
          <label style="display: flex; align-items: center; gap: 0.5rem;">
            <input id="auto-start" type="checkbox" />
            Automatisch starten, wenn alle Slots belegt sind
          </label>
        </div>
        <div slot="footer">
          <app-button @click="${()=>this.baseDialog.close()}">
            Abbrechen
          </app-button>
          <app-button variant="primary" @click="${this.applySettings}">
            Speichern
          </app-button>
        </div>
      </base-dialog>
    `}};j.styles=te`
    .lobby-grid {
      display: grid;
      gap: 1rem;
      color: var(--text-main);
    }
    label {
      display: grid;
      gap: 0.35rem;
    }
    input,
    select {
      width: 100%;
      padding: 0.5rem;
      background: var(--bg-color);
      border: 1px solid var(--border-color);
      color: white;
      border-radius: 4px;
    }
  `;F([k("base-dialog")],j.prototype,"baseDialog",2);F([k("#max-players")],j.prototype,"maxPlayers",2);F([k("#local-players")],j.prototype,"localPlayers",2);F([k("#bots")],j.prototype,"bots",2);F([k("#visibility")],j.prototype,"visibility",2);F([k("#auto-start")],j.prototype,"autoStart",2);F([k("#board-size")],j.prototype,"boardSize",2);F([k("#win-con")],j.prototype,"winCon",2);F([k("#gravity-enabled")],j.prototype,"gravityEnabled",2);F([k("#rotation-enabled")],j.prototype,"rotationEnabled",2);F([k("#move-timeout")],j.prototype,"moveTimeout",2);F([k("#penalty-mode")],j.prototype,"penaltyMode",2);F([A()],j.prototype,"boardSizeLimit",2);F([st(f.UI.LobbySettingsChanged,g.WebUI)],j.prototype,"applySettings",1);j=F([J("lobby-dialog")],j);const Vt="xoxo.lobby-presets",ia=[{id:"tic-tac-toe",name:"Tic-Tac-Toe",builtIn:!0,createdAt:0,updatedAt:0,settings:{maxPlayers:4,allowedLocalPlayers:1,maxBots:0,visibility:"public",autoStart:!1,boardSize:3,winCon:3,gravityEnabled:!1,rotationEnabled:!1,moveTimeoutMs:0,penaltyMode:"warning",presetId:"tic-tac-toe"}},{id:"connect-four",name:"Connect Four",builtIn:!0,createdAt:0,updatedAt:0,settings:{maxPlayers:4,allowedLocalPlayers:1,maxBots:0,visibility:"public",autoStart:!1,boardSize:6,winCon:4,gravityEnabled:!0,rotationEnabled:!1,moveTimeoutMs:0,penaltyMode:"warning",presetId:"connect-four"}}];class ra{list(){return[...ia,...this.loadCustomPresets()]}get(e){return e?this.list().find(t=>t.id===e)??null:null}save(e,t){const i={id:crypto.randomUUID(),name:e.trim()||"Custom Preset",builtIn:!1,createdAt:Date.now(),updatedAt:Date.now(),settings:{...t,presetId:null}},r=this.loadCustomPresets();return r.push(i),localStorage.setItem(Vt,JSON.stringify(r)),i}delete(e){const t=this.loadCustomPresets().filter(i=>i.id!==e);localStorage.setItem(Vt,JSON.stringify(t))}loadCustomPresets(){const e=localStorage.getItem(Vt);if(!e)return[];try{return JSON.parse(e).filter(i=>!i.builtIn)}catch{return[]}}}const lt=new ra;var na=Object.defineProperty,oa=Object.getOwnPropertyDescriptor,O=(s,e,t,i)=>{for(var r=i>1?void 0:i?oa(e,t):e,n=s.length-1,o;n>=0;n--)(o=s[n])&&(r=(i?o(e,t,r):o(r))||r);return i&&r&&na(e,t,r),r};let R=class extends B{constructor(){super(...arguments),this.presets=lt.list(),this.boardSizeLimit=3}show(){this.baseDialog.show(),this.applyPresetToForm(this.getSelectedPresetId())}getSelectedPresetId(){return this.presetSelect?.value||"tic-tac-toe"}applyPresetToForm(s){const e=lt.get(s);if(!e)return;const t=e.settings;this.playersInput&&(this.playersInput.value=String(t.maxPlayers)),this.localPlayersInput&&(this.localPlayersInput.value=String(t.allowedLocalPlayers)),this.botSlotsInput&&(this.botSlotsInput.value=String(t.maxBots)),this.visibilityInput&&(this.visibilityInput.value=t.visibility),this.autoStartInput&&(this.autoStartInput.checked=t.autoStart),this.boardSizeInput&&(this.boardSizeInput.value=String(t.boardSize)),this.boardSizeLimit=t.boardSize,this.winConInput&&(this.winConInput.value=String(t.winCon)),this.gravityInput&&(this.gravityInput.checked=t.gravityEnabled),this.rotationInput&&(this.rotationInput.checked=t.rotationEnabled),this.moveTimeoutInput&&(this.moveTimeoutInput.value=String(t.moveTimeoutMs)),this.penaltyModeInput&&(this.penaltyModeInput.value=t.penaltyMode)}refreshPresets(){this.presets=lt.list()}handlePresetChange(s){const e=s.target;this.applyPresetToForm(e.value)}readSettings(){return{maxPlayers:parseInt(this.playersInput.value),allowedLocalPlayers:parseInt(this.localPlayersInput.value),maxBots:parseInt(this.botSlotsInput.value),visibility:this.visibilityInput.value,autoStart:this.autoStartInput.checked,boardSize:parseInt(this.boardSizeInput.value),winCon:parseInt(this.winConInput.value),gravityEnabled:this.gravityInput.checked,rotationEnabled:this.rotationInput.checked,moveTimeoutMs:parseInt(this.moveTimeoutInput.value||"0"),penaltyMode:this.penaltyModeInput.value,presetId:this.getSelectedPresetId()}}savePresetFromCurrentForm(){const s=this.presetNameInput.value.trim(),e=lt.save(s,this.readSettings());this.refreshPresets(),this.requestUpdate(),this.presetSelect.value=e.id}requestCreation(){const s=he.load();if(!s){y.emit(f.UI.DialogOpenRequested,g.WebUI,"profile-dialog");return}const e={name:this.nameInput.value||"Neue Lobby",profile:{username:s.username,symbol:s.symbol,preferences:s.preferences},settings:this.readSettings()};y.emit(f.UI.LobbyCreateRequested,g.WebUI,e),this.baseDialog.close()}getDefaultLocalPlayers(s){return Math.min(1,Math.max(0,s-1))}render(){const s=Number(this.playersInput?.value||4);return C`
      <base-dialog title="Neue Lobby erstellen">
        <div style="display: grid; gap: 1rem; color: var(--text-main);">
          <label>
            Preset:
            <select
              id="preset-select"
              style="width: 100%; padding: 0.5rem; margin-top: 0.5rem; background: var(--bg-color); border: 1px solid var(--border-color); color: white; border-radius: 4px;"
              @change="${this.handlePresetChange}"
            >
              ${this.presets.map(e=>C`
                  <option value="${e.id}">${e.name}</option>
                `)}
            </select>
          </label>
          <label>
            Eigene Preset-Bezeichnung:
            <input
              id="preset-name"
              type="text"
              placeholder="Mein Connect-Four"
              style="width: 100%; padding: 0.5rem; margin-top: 0.5rem; background: var(--bg-color); border: 1px solid var(--border-color); color: white; border-radius: 4px;"
            />
          </label>
          <label>
            Name der Lobby:
            <input
              id="lobby-name"
              type="text"
              placeholder="Kais Arena..."
              style="width: 100%; padding: 0.5rem; margin-top: 0.5rem; background: var(--bg-color); border: 1px solid var(--border-color); color: white; border-radius: 4px;"
            />
          </label>
          <label>
            Maximale Spieler:
            <select
              id="max-players"
              style="width: 100%; padding: 0.5rem; margin-top: 0.5rem; background: var(--bg-color); border: 1px solid var(--border-color); color: white; border-radius: 4px;"
            >
              <option value="2">2 Spieler</option>
              <option value="4">4 Spieler</option>
              <option value="6">6 Spieler</option>
              <option value="8">8 Spieler</option>
            </select>
          </label>
          <label>
            Lokale Zusatzspieler:
            <input
              id="local-players"
              type="number"
              min="0"
              max="${Math.max(0,s-1)}"
              value="${this.getDefaultLocalPlayers(s)}"
              style="width: 100%; padding: 0.5rem; margin-top: 0.5rem; background: var(--bg-color); border: 1px solid var(--border-color); color: white; border-radius: 4px;"
            />
          </label>
          <label>
            Bots:
            <input
              id="bot-slots"
              type="number"
              min="0"
              max="4"
              value="0"
              style="width: 100%; padding: 0.5rem; margin-top: 0.5rem; background: var(--bg-color); border: 1px solid var(--border-color); color: white; border-radius: 4px;"
            />
          </label>
          <label>
            Sichtbarkeit:
            <select
              id="visibility"
              style="width: 100%; padding: 0.5rem; margin-top: 0.5rem; background: var(--bg-color); border: 1px solid var(--border-color); color: white; border-radius: 4px;"
            >
              <option value="${Oe.Public}" selected>Öffentlich</option>
              <option value="${Oe.Private}">Privat</option>
              <option value="${Oe.Local}">Lokal</option>
            </select>
          </label>
          <label>
            Spielfeldgröße:
            <input
              id="board-size"
              type="number"
              min="2"
              max="10"
              value="3"
              @input="${e=>{const t=parseInt(e.target.value||"3");this.boardSizeLimit=t,this.winConInput&&parseInt(this.winConInput.value||"3")>t&&(this.winConInput.value=String(t))}}"
              style="width: 100%; padding: 0.5rem; margin-top: 0.5rem; background: var(--bg-color); border: 1px solid var(--border-color); color: white; border-radius: 4px;"
            />
          </label>
          <label>
            Gewinnbedingung:
            <input
              id="win-con"
              type="number"
              min="2"
              max="${this.boardSizeLimit}"
              value="3"
              style="width: 100%; padding: 0.5rem; margin-top: 0.5rem; background: var(--bg-color); border: 1px solid var(--border-color); color: white; border-radius: 4px;"
            />
          </label>
          <label>
            Zugzeitlimit (ms):
            <input
              id="move-timeout"
              type="number"
              min="0"
              value="0"
              style="width: 100%; padding: 0.5rem; margin-top: 0.5rem; background: var(--bg-color); border: 1px solid var(--border-color); color: white; border-radius: 4px;"
            />
          </label>
          <label>
            Strafmodus:
            <select
              id="penalty-mode"
              style="width: 100%; padding: 0.5rem; margin-top: 0.5rem; background: var(--bg-color); border: 1px solid var(--border-color); color: white; border-radius: 4px;"
            >
              <option value="warning">Verwarnung</option>
              <option value="random-move">Zufallszug</option>
              <option value="kick">Kick</option>
            </select>
          </label>
          <label style="display: flex; align-items: center; gap: 0.5rem;">
            <input id="gravity-enabled" type="checkbox" />
            Gravitation nach jedem Zug
          </label>
          <label style="display: flex; align-items: center; gap: 0.5rem;">
            <input id="rotation-enabled" type="checkbox" />
            Board-Rotation erlauben
          </label>
          <label style="display: flex; align-items: center; gap: 0.5rem;">
            <input id="auto-start" type="checkbox" />
            Automatisch starten, sobald alle Slots belegt sind
          </label>
        </div>
        <div slot="footer">
          <app-button @click="${()=>this.baseDialog.close()}">Abbrechen</app-button>
          <app-button @click="${()=>this.savePresetFromCurrentForm()}">
            Preset speichern
          </app-button>
          <app-button variant="primary" @click="${this.requestCreation}"
            >Erstellen & Starten</app-button
          >
        </div>
      </base-dialog>
    `}};O([k("base-dialog")],R.prototype,"baseDialog",2);O([k("#lobby-name")],R.prototype,"nameInput",2);O([k("#max-players")],R.prototype,"playersInput",2);O([k("#local-players")],R.prototype,"localPlayersInput",2);O([k("#bot-slots")],R.prototype,"botSlotsInput",2);O([k("#visibility")],R.prototype,"visibilityInput",2);O([k("#auto-start")],R.prototype,"autoStartInput",2);O([k("#board-size")],R.prototype,"boardSizeInput",2);O([k("#win-con")],R.prototype,"winConInput",2);O([k("#gravity-enabled")],R.prototype,"gravityInput",2);O([k("#rotation-enabled")],R.prototype,"rotationInput",2);O([k("#move-timeout")],R.prototype,"moveTimeoutInput",2);O([k("#penalty-mode")],R.prototype,"penaltyModeInput",2);O([k("#preset-select")],R.prototype,"presetSelect",2);O([k("#preset-name")],R.prototype,"presetNameInput",2);O([A()],R.prototype,"presets",2);O([A()],R.prototype,"boardSizeLimit",2);R=O([J("create-lobby-dialog")],R);var aa=Object.defineProperty,la=Object.getOwnPropertyDescriptor,At=(s,e,t,i)=>{for(var r=i>1?void 0:i?la(e,t):e,n=s.length-1,o;n>=0;n--)(o=s[n])&&(r=(i?o(e,t,r):o(r))||r);return i&&r&&aa(e,t,r),r};let Me=class extends B{constructor(){super(),this.lobbies=[],y.on(f.UI.LobbiesUpdated,g.WebUI,s=>{this.lobbies=s})}show(){this.baseDialog.show(),this.refresh()}refresh(){y.emit(f.UI.LobbyListRefreshRequested,g.WebUI)}openCreateModal(){this.createDialog.show()}joinLobby(s){const e=he.load();if(!e){y.emit(f.UI.DialogOpenRequested,g.WebUI,"profile-dialog");return}y.emit(f.UI.LobbyJoinRequested,g.WebUI,{lobbyId:s,profile:{username:e.username,symbol:e.symbol,preferences:e.preferences}}),this.baseDialog.close()}render(){return C`
      <base-dialog title="Lobby Browser">
        <div class="browser-layout">
          <div class="toolbar">
            <app-button @click="${this.refresh}">🔄 Aktualisieren</app-button>
            <app-button variant="primary" @click="${this.openCreateModal}"
              >+ Neue Lobby</app-button
            >
          </div>

          <div class="lobby-list">
            ${this.lobbies.length===0?C`<p style="text-align: center; color: #666; margin: 2rem;">
                  Keine offenen Lobbys gefunden...
                </p>`:this.lobbies.map(s=>C`
                    <div class="lobby-item">
                      <div>
                        <div class="lobby-name">${s.name}</div>
                        <div class="lobby-meta">
                          Mitglieder: ${s.members.length}/${s.settings.maxPlayers}
                        </div>
                        <div class="lobby-badges">
                          <span class="badge">${s.settings.visibility}</span>
                          <span class="badge">${s.settings.allowedLocalPlayers} lokal</span>
                          <span class="badge">${s.settings.maxBots} bots</span>
                          <span class="badge">${s.settings.boardSize}x${s.settings.boardSize}</span>
                          <span class="badge">Win: ${s.settings.winCon}</span>
                          <span class="badge">${s.settings.gravityEnabled?"Gravity":"No Gravity"}</span>
                          <span class="badge">${s.settings.rotationEnabled?"Rotate":"Static"}</span>
                          <span class="badge">${s.pendingSettingRequests.length} requests</span>
                        </div>
                      </div>
                      <app-button
                        variant="primary"
                        @click="${()=>this.joinLobby(s.id)}"
                        >Beitreten</app-button
                      >
                    </div>
                  `)}
          </div>
        </div>
      </base-dialog>

      <create-lobby-dialog></create-lobby-dialog>
    `}};Me.styles=te`
    .browser-layout {
      display: flex;
      flex-direction: column;
      gap: 1rem;
    }
    .toolbar {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .lobby-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      max-height: 400px;
      overflow-y: auto;
    }
    .lobby-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1rem;
      background: var(--cell-bg, #2a2a3a);
      border: 1px solid var(--border-color, #444);
      border-radius: 8px;
    }
    .lobby-name {
      font-weight: bold;
      color: var(--text-main);
    }
    .lobby-meta {
      font-size: 0.8rem;
      color: #888;
    }
    .lobby-badges {
      display: flex;
      gap: 0.4rem;
      flex-wrap: wrap;
      margin-top: 0.35rem;
    }
    .badge {
      padding: 0.2rem 0.45rem;
      border-radius: 999px;
      background: var(--bg-color, #181825);
      border: 1px solid var(--border-color, #444);
      font-size: 0.75rem;
    }
  `;At([k("base-dialog")],Me.prototype,"baseDialog",2);At([k("create-lobby-dialog")],Me.prototype,"createDialog",2);At([A()],Me.prototype,"lobbies",2);Me=At([J("browser-dialog")],Me);var ca=Object.defineProperty,da=Object.getOwnPropertyDescriptor,Es=(s,e,t,i)=>{for(var r=i>1?void 0:i?da(e,t):e,n=s.length-1,o;n>=0;n--)(o=s[n])&&(r=(i?o(e,t,r):o(r))||r);return i&&r&&ca(e,t,r),r};let et=class extends B{constructor(){super(...arguments),this.messages=[],this.counter=0}onToast(s){const e=this.counter++,t=s.type||"info";this.messages=[...this.messages,{id:e,text:s.message,type:t}],setTimeout(()=>{this.messages=this.messages.filter(i=>i.id!==e)},4e3)}render(){return C`
      ${this.messages.map(s=>C` <div class="toast ${s.type}">${s.text}</div> `)}
    `}};et.styles=te`
    :host {
      position: fixed;
      top: 20px;
      left: 50%;
      transform: translateX(-50%);
      z-index: 9999;
      display: flex;
      flex-direction: column;
      gap: 10px;
      width: auto;
      pointer-events: none; /* Klicks gehen durch den Hintergrund durch */
    }

    .toast {
      pointer-events: auto; /* Klicks auf den Toast selbst erlauben */
      background: var(--cell-bg);
      color: var(--text-main);
      padding: 14px 24px;
      border-radius: 8px;
      border: 1px solid var(--border-color);
      /* Dynamische Border-Farbe basierend auf dem Typ */
      border-left: 6px solid var(--primary-accent);
      box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
      font-weight: 500;
      min-width: 300px;
      max-width: 500px;
      text-align: center;
      animation: slideDown 0.4s cubic-bezier(0.18, 0.89, 0.32, 1.28);
    }

    /* Varianten basierend auf dem Typ */
    .toast.error {
      border-left-color: var(--color-error);
    }
    .toast.success {
      border-left-color: var(--color-win);
    }
    .toast.info {
      border-left-color: var(--primary-accent);
    }

    /* Mobile Version */
    @media (max-width: 600px) {
      :host {
        top: 10px;
        width: 90%;
      }
      .toast {
        min-width: unset;
        width: 100%;
        padding: 12px 16px;
        font-size: 0.9rem;
      }
    }

    @keyframes slideDown {
      from {
        transform: translateY(-100%);
        opacity: 0;
      }
      to {
        transform: translateY(0);
        opacity: 1;
      }
    }
  `;Es([A()],et.prototype,"messages",2);Es([D(f.UI.ToastRequested,g.WebUI)],et.prototype,"onToast",1);et=Es([J("toast-manager")],et);var ua=Object.defineProperty,ha=Object.getOwnPropertyDescriptor,H=(s,e,t,i)=>{for(var r=i>1?void 0:i?ha(e,t):e,n=s.length-1,o;n>=0;n--)(o=s[n])&&(r=(i?o(e,t,r):o(r))||r);return i&&r&&ua(e,t,r),r};const ci="btn-shape";let z=class extends B{constructor(){super(),this.activeSettings=new V,this.pendingSettings=null,this.currentThemeName="Catppuccin",this.isPlaying=!1,this.savedRadius="5%",this.initializeUIState()}handleDialogOpen(s){const e=this.shadowRoot?.querySelector(s);e&&typeof e.show=="function"&&e.show()}saveButtonShape(s){this.savedRadius=s,localStorage.setItem(ci,s==="50%"?"rounded":"square")}changeTheme(s,e=!1){const t=xi[s];if(!t)return;const i=()=>{Object.entries(t).forEach(([r,n])=>document.documentElement.style.setProperty(`--${r}`,n)),document.body.className=s.toLowerCase(),this.currentThemeName=s,localStorage.setItem("user-theme",s)};if(e||!document.startViewTransition){i();return}try{document.startViewTransition(()=>i())}catch{i()}}endApp(){this.isPlaying=!1,this.pendingSettings&&(this.activeSettings=Object.assign(new V,this.pendingSettings),this.pendingSettings=null)}initializeUIState(){const s=he.load(),e=s?.preferences.themeName||"Catppuccin",t=localStorage.getItem("btn-shape-radius"),r=(localStorage.getItem(ci)??(t==="50%"?"rounded":"square"))==="rounded"?"50%":s?.preferences.buttonRadius||"5%";this.changeTheme(e,!0),this.savedRadius=r}OnStartGame(s){s?.settings&&(this.activeSettings=Object.assign(new V,s.settings),this.pendingSettings=null,this.isPlaying=!0,this.requestUpdate())}syncSettingsFromDialog(s){const e=Object.assign(new V,s);if(this.isPlaying){this.pendingSettings=e;return}this.activeSettings=e,this.pendingSettings=null}requestGameStart(){y.emit(f.UI.GameStartRequested,g.WebUI,this.pendingSettings??this.activeSettings)}render(){return C`
      <side-bar></side-bar>
      <main class="${ki({"is-playing":this.isPlaying})}">
        <game-logo></game-logo>

        ${this.isPlaying?C`
              <div class="board-wrapper">
                <game-board
                  .settings="${this.activeSettings}"
                  .cellRadius="${this.savedRadius}"
                ></game-board>
              </div>
            `:C`
              <app-button variant="primary" @click="${this.requestGameStart}">
                SPIEL STARTEN
              </app-button>
            `}
      </main>
      <chat-drawer></chat-drawer>
      <profile-dialog></profile-dialog>
      <toast-manager></toast-manager>
      <lobby-dialog></lobby-dialog>
      <browser-dialog></browser-dialog>
    `}initializeButtonState(){return this.savedRadius}firstUpdated(){this.initializeButtonState(),he.isComplete()||y.emit(f.UI.DialogOpenRequested,g.WebUI,"profile-dialog")}};z.styles=te`
    :host {
      display: flex;
      width: 100vw;
      height: 100vh;
      overflow: hidden;
      background-color: var(--bg-color, #1e1e2e);
      color: var(--text-main, #cdd6f4);
      font-family: sans-serif;
    }
    main {
      flex: 1;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      position: relative;
      min-width: 0;
      transition: all 0.5s ease-in-out;
    }
    main.is-playing {
      justify-content: flex-start;
      padding-top: 1rem;
    }
    game-logo {
      filter: drop-shadow(0 0 1rem var(--glow-core));
      display: block;
      height: clamp(20rem, 18vh, 15rem);
      width: auto;
      margin-bottom: 2rem;
      transition: all 0.5s ease;
    }
    main.is-playing game-logo {
      height: 90px;
      margin-bottom: 0.5rem;
    }
    .board-wrapper {
      width: 100%;
      flex: 1;
      min-height: 0;
      display: flex;
      justify-content: center;
      align-items: stretch;
    }
    game-board {
      display: block;
      width: 100%;
      height: 100%;
    }
    app-button {
      filter: drop-shadow(0 0 1rem var(--glow-core));
    }
  `;H([A()],z.prototype,"activeSettings",2);H([A()],z.prototype,"pendingSettings",2);H([A()],z.prototype,"currentThemeName",2);H([A()],z.prototype,"isPlaying",2);H([A()],z.prototype,"savedRadius",2);H([D(f.UI.DialogOpenRequested,g.WebUI)],z.prototype,"handleDialogOpen",1);H([D(f.UI.ButtonShapeChanged,g.WebUI)],z.prototype,"saveButtonShape",1);H([D(f.UI.ThemeChanged,g.WebUI)],z.prototype,"changeTheme",1);H([D(f.UI.AppEndRequested,g.WebUI)],z.prototype,"endApp",1);H([D(f.Game.Start,g.Controller)],z.prototype,"OnStartGame",1);H([D(f.UI.SettingsChangeRequested,g.WebUI)],z.prototype,"syncSettingsFromDialog",1);H([st(f.UI.ButtonShapeChanged,g.WebUI)],z.prototype,"initializeButtonState",1);z=H([J("xoxo-web-app")],z);class ks{constructor(e=3){this.size=e,this.state=new Uint8Array(this.size*this.size)}getIndex(e,t){return e*this.size+t}getCell(e,t){return this.state[this.getIndex(e,t)]}setCell(e,t,i){this.state[this.getIndex(e,t)]=i}clear(){this.state.fill(0)}rotateClockwise(e=1){const t=(e%4+4)%4;for(let i=0;i<t;i++){const r=new Uint8Array(this.size*this.size);for(let n=0;n<this.size;n++)for(let o=0;o<this.size;o++){const a=o,l=this.size-n-1;r[a*this.size+l]=this.getCell(n,o)}this.state=r}}applyGravity(){for(let e=0;e<this.size;e++){const t=[];for(let i=this.size-1;i>=0;i--){const r=this.getCell(i,e);r!==0&&t.push(r)}for(let i=this.size-1;i>=0;i--)this.setCell(i,e,t[this.size-1-i]??0)}}isFull(){return!this.state.includes(0)}isInsideBounds(e,t){return e>=0&&e<this.size&&t>=0&&t<this.size}copy(){const e=new ks(this.size);return e.state.set(this.state),e}}class tt{constructor(e,t,i){this.winner=e,this.type=t,this.positions=i,this.winner=e,this.type=t,this.positions=i,Object.freeze(this)}static createWin(e,t,i){return new tt(e,t,i)}static createDraw(){return new tt(null,ee.Draw,[])}}const Ge={[ee.Horizontal]:{dRow:0,dCol:1},[ee.Vertical]:{dRow:1,dCol:0},[ee.DiagonalMain]:{dRow:1,dCol:1},[ee.DiagonalAnti]:{dRow:1,dCol:-1}};class pa{constructor(e){this.turn=0,this.isRunning=!0,this.result=null,this.playerSymbols=new Map,this.settings=e,this.board=new ks(e.boardSize)}makeMove(e,t,i,r){return this.isRunning?!this.board.isInsideBounds(e,t)||this.board.getCell(e,t)!==0?re.OCCUPIED:(this.board.setCell(e,t,i),this.playerSymbols.set(i,r),this.turn++,this.settings.gravityEnabled&&this.board.applyGravity(),this.result=this.checkWinOrDraw(),this.result!==null?(this.isRunning=!1,re.GAME_OVER):re.SUCCESS):re.GAME_OVER}checkWinOrDraw(){for(let e=0;e<this.board.size;e++)for(let t=0;t<this.board.size;t++){const i=this.board.getCell(e,t);if(i)for(const r in Ge){const n=r,{dRow:o,dCol:a}=Ge[n],l=e-o,c=t-a;if(this.board.isInsideBounds(l,c)&&this.board.getCell(l,c)===i)continue;const h=this.checkDirection(e,t,n,i);if(h)return h}}return this.board.isFull()?tt.createDraw():null}checkDirection(e,t,i,r){const{dRow:n,dCol:o}=Ge[i],a=[{row:e,col:t}];let l=e+n,c=t+o;for(;this.board.isInsideBounds(l,c)&&this.board.getCell(l,c)===r;)a.push({row:l,col:c}),l+=n,c+=o;for(l=e-n,c=t-o;this.board.isInsideBounds(l,c)&&this.board.getCell(l,c)===r;)a.unshift({row:l,col:c}),l-=n,c-=o;return a.length>=this.settings.winCon?(Z.log(g.Game,`Win detected for player ${r}`),tt.createWin(this.playerSymbols.get(r)??String(r),i,a)):null}getValidMoves(){const e=[];for(let t=0;t<this.board.size;t++)for(let i=0;i<this.board.size;i++)this.board.getCell(t,i)===0&&e.push({row:t,col:i});return e}wouldWin(e,t,i){if(this.board.getCell(e,t)!==0)return!1;this.board.setCell(e,t,i);let r=!1;for(const n in Ge){const{dRow:o,dCol:a}=Ge[n];let l=1;for(const c of[1,-1]){let h=e+o*c,u=t+a*c;for(;this.board.isInsideBounds(h,u)&&this.board.getCell(h,u)===i;)l++,h+=o*c,u+=a*c}if(l>=this.settings.winCon){r=!0;break}}return this.board.setCell(e,t,0),r}getOpponentIds(e){const t=new Set;for(let i=0;i<this.board.state.length;i++){const r=this.board.state[i];r!==0&&r!==e&&t.add(r)}return Array.from(t)}rotateBoard(e=90){if(!this.isRunning)return re.GAME_OVER;const i={90:1,180:2,270:3}[e];return this.board.rotateClockwise(i),(this.settings.gravityEnabled||this.settings.rotationEnabled)&&this.board.applyGravity(),this.turn++,this.result=this.checkWinOrDraw(),this.result!==null?(this.isRunning=!1,re.GAME_OVER):re.SUCCESS}}const Ze=class Ze{constructor(e,t){this.currentIndex=0,this.game=new pa(e),this.players=t,Ze.totalGames++,this.gameId=Ze.totalGames}async startGameLoop(){for(Z.log(g.Controller,`Starte Game-Loop für Spiel ${this.gameId}`),this.emitInitialState();this.game.isRunning;){const e=this.players[this.currentIndex],t=await e.makeMove(this.game);if(!t||!this.game.isRunning)break;const i=t.kind==="rotate"?this.game.rotateBoard(t.degrees):this.game.makeMove(t.position.row,t.position.col,e.userId,e.symbol);if(i===re.SUCCESS||i===re.GAME_OVER){const r=(this.currentIndex+1)%this.players.length,n=this.players[r];y.emit(f.Game.MoveMade,g.Controller,{action:t.kind,row:t.kind==="place"?t.position.row:-1,col:t.kind==="place"?t.position.col:-1,symbol:e.symbol,turn:this.game.turn,nextPlayerSymbol:n.symbol,grid:this.getBoardAsStrings(),rotation:t.kind==="rotate"?t.degrees:void 0}),i===re.GAME_OVER?y.emit(f.Game.Finished,g.Controller,this.game.result):this.currentIndex=r}}}getBoardAsStrings(){const e=this.game.board.size,t=[];for(let i=0;i<e;i++){const r=[];for(let n=0;n<e;n++){const o=this.game.board.getCell(i,n);if(o===0)r.push("");else{const a=this.players.find(l=>l.userId===o);r.push(a?a.symbol:"")}}t.push(r)}return t}emitInitialState(){const e=this.players[this.currentIndex];y.emit(f.Game.Reset,g.Controller,{turn:this.game.turn,nextPlayerSymbol:e.symbol,settings:this.game.settings})}stop(){this.game&&(this.game.isRunning=!1),Z.log(g.Controller,`Spiel ${this.gameId} wurde gestoppt.`)}};Ze.totalGames=0;let ss=Ze;class di{constructor(e,t,i){this.symbol=e,this.userName=t,this.userId=i}async makeMove(e){return new Promise(t=>{let i,r,n;const o=()=>{i.unsubscribe(),r.unsubscribe(),n.unsubscribe()};i=y.on(f.UI.CellClicked,g.LocalPlayer,a=>{o(),t({kind:"place",position:a})}),n=y.on(f.UI.RotateRequested,g.LocalPlayer,a=>{o(),t({kind:"rotate",degrees:a})}),r=y.on(f.UI.ResetRequested,g.LocalPlayer,()=>{o(),t(null)})})}}const fa={async determineMove(s){const e=s.getValidMoves();if(e.length!==0)return await new Promise(t=>setTimeout(t,500)),e[Math.floor(Math.random()*e.length)]}},ui={async determineMove(s,e){const t=s.getValidMoves();if(t.length===0)return;const i=s.getOpponentIds(e),r=[];for(const n of t){if(s.wouldWin(n.row,n.col,e))return n;for(const o of i)s.wouldWin(n.row,n.col,o)&&r.push(n)}return await new Promise(n=>setTimeout(n,500)),r.length>0?r[Math.floor(Math.random()*r.length)]:t[Math.floor(Math.random()*t.length)]}},hi={[ht.Easy]:fa,[ht.Medium]:ui,[ht.Hard]:ui};class pi{constructor(e,t,i,r){this.difficulty=e,this.symbol=t,this.userName=i,this.userId=r,this.strategy=hi[e]}changeDifficulty(e){this.difficulty!==e&&(this.difficulty=e,this.strategy=hi[e],Z.log(g.Bot,`Bot Strategy changed to: ${e}`))}getMove(e){return this.strategy.determineMove(e,this.userId)}async makeMove(e){const t=await this.getMove(e);return t?{kind:"place",position:t}:null}}class ma{constructor(){this.activeGameController=null,this.nextUserId=1,this.settings=new V;const e=g.Controller;y.on(f.UI.ResetRequested,e,()=>{this.startGame()}),y.on(f.UI.GameStartRequested,e,t=>{this.settings=Object.assign(new V,t),this.startGame()}),y.on(f.UI.SettingsChangeRequested,e,t=>{this.settings=t,y.emit(f.UI.ToastRequested,g.Controller,{message:"Einstellungen geändert – wird ab der nächsten Runde angewendet!",type:"info"})})}startGame(){this.activeGameController&&this.activeGameController.stop();const e=this.createPlayersForCurrentMode();this.activeGameController=new ss(this.settings,e),y.emit(f.Game.Start,g.Controller,{settings:Object.assign(new V,{...this.settings}),turn:1,nextPlayerSymbol:e[0].symbol}),setTimeout(()=>{this.activeGameController?.startGameLoop()},50)}createPlayersForCurrentMode(){const e=[];return this.settings.mode===Zt.Local?(e.push(new di(ue("😴"),"Niklas",this.nextUserId++)),e.push(new di(ue("🥺"),"Michi",this.nextUserId++))):this.settings.mode===Zt.Bot&&(e.push(new pi(this.settings.difficulty,ue("😊"),"Kai",this.nextUserId++)),e.push(new pi(this.settings.difficulty,ue("🇺🇲"),"Donald-Trump",this.nextUserId++))),e}}const ae=Object.create(null);ae.open="0";ae.close="1";ae.ping="2";ae.pong="3";ae.message="4";ae.upgrade="5";ae.noop="6";const mt=Object.create(null);Object.keys(ae).forEach(s=>{mt[ae[s]]=s});const is={type:"error",data:"parser error"},Wi=typeof Blob=="function"||typeof Blob<"u"&&Object.prototype.toString.call(Blob)==="[object BlobConstructor]",Ki=typeof ArrayBuffer=="function",Zi=s=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(s):s&&s.buffer instanceof ArrayBuffer,xs=({type:s,data:e},t,i)=>Wi&&e instanceof Blob?t?i(e):fi(e,i):Ki&&(e instanceof ArrayBuffer||Zi(e))?t?i(e):fi(new Blob([e]),i):i(ae[s]+(e||"")),fi=(s,e)=>{const t=new FileReader;return t.onload=function(){const i=t.result.split(",")[1];e("b"+(i||""))},t.readAsDataURL(s)};function mi(s){return s instanceof Uint8Array?s:s instanceof ArrayBuffer?new Uint8Array(s):new Uint8Array(s.buffer,s.byteOffset,s.byteLength)}let Ht;function ga(s,e){if(Wi&&s.data instanceof Blob)return s.data.arrayBuffer().then(mi).then(e);if(Ki&&(s.data instanceof ArrayBuffer||Zi(s.data)))return e(mi(s.data));xs(s,!1,t=>{Ht||(Ht=new TextEncoder),e(Ht.encode(t))})}const gi="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",He=typeof Uint8Array>"u"?[]:new Uint8Array(256);for(let s=0;s<gi.length;s++)He[gi.charCodeAt(s)]=s;const ba=s=>{let e=s.length*.75,t=s.length,i,r=0,n,o,a,l;s[s.length-1]==="="&&(e--,s[s.length-2]==="="&&e--);const c=new ArrayBuffer(e),h=new Uint8Array(c);for(i=0;i<t;i+=4)n=He[s.charCodeAt(i)],o=He[s.charCodeAt(i+1)],a=He[s.charCodeAt(i+2)],l=He[s.charCodeAt(i+3)],h[r++]=n<<2|o>>4,h[r++]=(o&15)<<4|a>>2,h[r++]=(a&3)<<6|l&63;return c},ya=typeof ArrayBuffer=="function",$s=(s,e)=>{if(typeof s!="string")return{type:"message",data:Yi(s,e)};const t=s.charAt(0);return t==="b"?{type:"message",data:va(s.substring(1),e)}:mt[t]?s.length>1?{type:mt[t],data:s.substring(1)}:{type:mt[t]}:is},va=(s,e)=>{if(ya){const t=ba(s);return Yi(t,e)}else return{base64:!0,data:s}},Yi=(s,e)=>e==="blob"?s instanceof Blob?s:new Blob([s]):s instanceof ArrayBuffer?s:s.buffer,Ji="",wa=(s,e)=>{const t=s.length,i=new Array(t);let r=0;s.forEach((n,o)=>{xs(n,!1,a=>{i[o]=a,++r===t&&e(i.join(Ji))})})},Ca=(s,e)=>{const t=s.split(Ji),i=[];for(let r=0;r<t.length;r++){const n=$s(t[r],e);if(i.push(n),n.type==="error")break}return i};function _a(){return new TransformStream({transform(s,e){ga(s,t=>{const i=t.length;let r;if(i<126)r=new Uint8Array(1),new DataView(r.buffer).setUint8(0,i);else if(i<65536){r=new Uint8Array(3);const n=new DataView(r.buffer);n.setUint8(0,126),n.setUint16(1,i)}else{r=new Uint8Array(9);const n=new DataView(r.buffer);n.setUint8(0,127),n.setBigUint64(1,BigInt(i))}s.data&&typeof s.data!="string"&&(r[0]|=128),e.enqueue(r),e.enqueue(t)})}})}let Wt;function ct(s){return s.reduce((e,t)=>e+t.length,0)}function dt(s,e){if(s[0].length===e)return s.shift();const t=new Uint8Array(e);let i=0;for(let r=0;r<e;r++)t[r]=s[0][i++],i===s[0].length&&(s.shift(),i=0);return s.length&&i<s[0].length&&(s[0]=s[0].slice(i)),t}function Sa(s,e){Wt||(Wt=new TextDecoder);const t=[];let i=0,r=-1,n=!1;return new TransformStream({transform(o,a){for(t.push(o);;){if(i===0){if(ct(t)<1)break;const l=dt(t,1);n=(l[0]&128)===128,r=l[0]&127,r<126?i=3:r===126?i=1:i=2}else if(i===1){if(ct(t)<2)break;const l=dt(t,2);r=new DataView(l.buffer,l.byteOffset,l.length).getUint16(0),i=3}else if(i===2){if(ct(t)<8)break;const l=dt(t,8),c=new DataView(l.buffer,l.byteOffset,l.length),h=c.getUint32(0);if(h>Math.pow(2,21)-1){a.enqueue(is);break}r=h*Math.pow(2,32)+c.getUint32(4),i=3}else{if(ct(t)<r)break;const l=dt(t,r);a.enqueue($s(n?l:Wt.decode(l),e)),i=0}if(r===0||r>s){a.enqueue(is);break}}}})}const Xi=4;function I(s){if(s)return Ea(s)}function Ea(s){for(var e in I.prototype)s[e]=I.prototype[e];return s}I.prototype.on=I.prototype.addEventListener=function(s,e){return this._callbacks=this._callbacks||{},(this._callbacks["$"+s]=this._callbacks["$"+s]||[]).push(e),this};I.prototype.once=function(s,e){function t(){this.off(s,t),e.apply(this,arguments)}return t.fn=e,this.on(s,t),this};I.prototype.off=I.prototype.removeListener=I.prototype.removeAllListeners=I.prototype.removeEventListener=function(s,e){if(this._callbacks=this._callbacks||{},arguments.length==0)return this._callbacks={},this;var t=this._callbacks["$"+s];if(!t)return this;if(arguments.length==1)return delete this._callbacks["$"+s],this;for(var i,r=0;r<t.length;r++)if(i=t[r],i===e||i.fn===e){t.splice(r,1);break}return t.length===0&&delete this._callbacks["$"+s],this};I.prototype.emit=function(s){this._callbacks=this._callbacks||{};for(var e=new Array(arguments.length-1),t=this._callbacks["$"+s],i=1;i<arguments.length;i++)e[i-1]=arguments[i];if(t){t=t.slice(0);for(var i=0,r=t.length;i<r;++i)t[i].apply(this,e)}return this};I.prototype.emitReserved=I.prototype.emit;I.prototype.listeners=function(s){return this._callbacks=this._callbacks||{},this._callbacks["$"+s]||[]};I.prototype.hasListeners=function(s){return!!this.listeners(s).length};const Tt=typeof Promise=="function"&&typeof Promise.resolve=="function"?e=>Promise.resolve().then(e):(e,t)=>t(e,0),K=typeof self<"u"?self:typeof window<"u"?window:Function("return this")(),ka="arraybuffer";function Qi(s,...e){return e.reduce((t,i)=>(s.hasOwnProperty(i)&&(t[i]=s[i]),t),{})}const xa=K.setTimeout,$a=K.clearTimeout;function It(s,e){e.useNativeTimers?(s.setTimeoutFn=xa.bind(K),s.clearTimeoutFn=$a.bind(K)):(s.setTimeoutFn=K.setTimeout.bind(K),s.clearTimeoutFn=K.clearTimeout.bind(K))}const Aa=1.33;function Ta(s){return typeof s=="string"?Ia(s):Math.ceil((s.byteLength||s.size)*Aa)}function Ia(s){let e=0,t=0;for(let i=0,r=s.length;i<r;i++)e=s.charCodeAt(i),e<128?t+=1:e<2048?t+=2:e<55296||e>=57344?t+=3:(i++,t+=4);return t}function er(){return Date.now().toString(36).substring(3)+Math.random().toString(36).substring(2,5)}function Ra(s){let e="";for(let t in s)s.hasOwnProperty(t)&&(e.length&&(e+="&"),e+=encodeURIComponent(t)+"="+encodeURIComponent(s[t]));return e}function Oa(s){let e={},t=s.split("&");for(let i=0,r=t.length;i<r;i++){let n=t[i].split("=");e[decodeURIComponent(n[0])]=decodeURIComponent(n[1])}return e}class La extends Error{constructor(e,t,i){super(e),this.description=t,this.context=i,this.type="TransportError"}}class As extends I{constructor(e){super(),this.writable=!1,It(this,e),this.opts=e,this.query=e.query,this.socket=e.socket,this.supportsBinary=!e.forceBase64}onError(e,t,i){return super.emitReserved("error",new La(e,t,i)),this}open(){return this.readyState="opening",this.doOpen(),this}close(){return(this.readyState==="opening"||this.readyState==="open")&&(this.doClose(),this.onClose()),this}send(e){this.readyState==="open"&&this.write(e)}onOpen(){this.readyState="open",this.writable=!0,super.emitReserved("open")}onData(e){const t=$s(e,this.socket.binaryType);this.onPacket(t)}onPacket(e){super.emitReserved("packet",e)}onClose(e){this.readyState="closed",super.emitReserved("close",e)}pause(e){}createUri(e,t={}){return e+"://"+this._hostname()+this._port()+this.opts.path+this._query(t)}_hostname(){const e=this.opts.hostname;return e.indexOf(":")===-1?e:"["+e+"]"}_port(){return this.opts.port&&(this.opts.secure&&Number(this.opts.port)!==443||!this.opts.secure&&Number(this.opts.port)!==80)?":"+this.opts.port:""}_query(e){const t=Ra(e);return t.length?"?"+t:""}}class Pa extends As{constructor(){super(...arguments),this._polling=!1}get name(){return"polling"}doOpen(){this._poll()}pause(e){this.readyState="pausing";const t=()=>{this.readyState="paused",e()};if(this._polling||!this.writable){let i=0;this._polling&&(i++,this.once("pollComplete",function(){--i||t()})),this.writable||(i++,this.once("drain",function(){--i||t()}))}else t()}_poll(){this._polling=!0,this.doPoll(),this.emitReserved("poll")}onData(e){const t=i=>{if(this.readyState==="opening"&&i.type==="open"&&this.onOpen(),i.type==="close")return this.onClose({description:"transport closed by the server"}),!1;this.onPacket(i)};Ca(e,this.socket.binaryType).forEach(t),this.readyState!=="closed"&&(this._polling=!1,this.emitReserved("pollComplete"),this.readyState==="open"&&this._poll())}doClose(){const e=()=>{this.write([{type:"close"}])};this.readyState==="open"?e():this.once("open",e)}write(e){this.writable=!1,wa(e,t=>{this.doWrite(t,()=>{this.writable=!0,this.emitReserved("drain")})})}uri(){const e=this.opts.secure?"https":"http",t=this.query||{};return this.opts.timestampRequests!==!1&&(t[this.opts.timestampParam]=er()),!this.supportsBinary&&!t.sid&&(t.b64=1),this.createUri(e,t)}}let tr=!1;try{tr=typeof XMLHttpRequest<"u"&&"withCredentials"in new XMLHttpRequest}catch{}const ja=tr;function Ma(){}class Ba extends Pa{constructor(e){if(super(e),typeof location<"u"){const t=location.protocol==="https:";let i=location.port;i||(i=t?"443":"80"),this.xd=typeof location<"u"&&e.hostname!==location.hostname||i!==e.port}}doWrite(e,t){const i=this.request({method:"POST",data:e});i.on("success",t),i.on("error",(r,n)=>{this.onError("xhr post error",r,n)})}doPoll(){const e=this.request();e.on("data",this.onData.bind(this)),e.on("error",(t,i)=>{this.onError("xhr poll error",t,i)}),this.pollXhr=e}}class ne extends I{constructor(e,t,i){super(),this.createRequest=e,It(this,i),this._opts=i,this._method=i.method||"GET",this._uri=t,this._data=i.data!==void 0?i.data:null,this._create()}_create(){var e;const t=Qi(this._opts,"agent","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","autoUnref");t.xdomain=!!this._opts.xd;const i=this._xhr=this.createRequest(t);try{i.open(this._method,this._uri,!0);try{if(this._opts.extraHeaders){i.setDisableHeaderCheck&&i.setDisableHeaderCheck(!0);for(let r in this._opts.extraHeaders)this._opts.extraHeaders.hasOwnProperty(r)&&i.setRequestHeader(r,this._opts.extraHeaders[r])}}catch{}if(this._method==="POST")try{i.setRequestHeader("Content-type","text/plain;charset=UTF-8")}catch{}try{i.setRequestHeader("Accept","*/*")}catch{}(e=this._opts.cookieJar)===null||e===void 0||e.addCookies(i),"withCredentials"in i&&(i.withCredentials=this._opts.withCredentials),this._opts.requestTimeout&&(i.timeout=this._opts.requestTimeout),i.onreadystatechange=()=>{var r;i.readyState===3&&((r=this._opts.cookieJar)===null||r===void 0||r.parseCookies(i.getResponseHeader("set-cookie"))),i.readyState===4&&(i.status===200||i.status===1223?this._onLoad():this.setTimeoutFn(()=>{this._onError(typeof i.status=="number"?i.status:0)},0))},i.send(this._data)}catch(r){this.setTimeoutFn(()=>{this._onError(r)},0);return}typeof document<"u"&&(this._index=ne.requestsCount++,ne.requests[this._index]=this)}_onError(e){this.emitReserved("error",e,this._xhr),this._cleanup(!0)}_cleanup(e){if(!(typeof this._xhr>"u"||this._xhr===null)){if(this._xhr.onreadystatechange=Ma,e)try{this._xhr.abort()}catch{}typeof document<"u"&&delete ne.requests[this._index],this._xhr=null}}_onLoad(){const e=this._xhr.responseText;e!==null&&(this.emitReserved("data",e),this.emitReserved("success"),this._cleanup())}abort(){this._cleanup()}}ne.requestsCount=0;ne.requests={};if(typeof document<"u"){if(typeof attachEvent=="function")attachEvent("onunload",bi);else if(typeof addEventListener=="function"){const s="onpagehide"in K?"pagehide":"unload";addEventListener(s,bi,!1)}}function bi(){for(let s in ne.requests)ne.requests.hasOwnProperty(s)&&ne.requests[s].abort()}const Da=(function(){const s=sr({xdomain:!1});return s&&s.responseType!==null})();class Ua extends Ba{constructor(e){super(e);const t=e&&e.forceBase64;this.supportsBinary=Da&&!t}request(e={}){return Object.assign(e,{xd:this.xd},this.opts),new ne(sr,this.uri(),e)}}function sr(s){const e=s.xdomain;try{if(typeof XMLHttpRequest<"u"&&(!e||ja))return new XMLHttpRequest}catch{}if(!e)try{return new K[["Active"].concat("Object").join("X")]("Microsoft.XMLHTTP")}catch{}}const ir=typeof navigator<"u"&&typeof navigator.product=="string"&&navigator.product.toLowerCase()==="reactnative";class Na extends As{get name(){return"websocket"}doOpen(){const e=this.uri(),t=this.opts.protocols,i=ir?{}:Qi(this.opts,"agent","perMessageDeflate","pfx","key","passphrase","cert","ca","ciphers","rejectUnauthorized","localAddress","protocolVersion","origin","maxPayload","family","checkServerIdentity");this.opts.extraHeaders&&(i.headers=this.opts.extraHeaders);try{this.ws=this.createSocket(e,t,i)}catch(r){return this.emitReserved("error",r)}this.ws.binaryType=this.socket.binaryType,this.addEventListeners()}addEventListeners(){this.ws.onopen=()=>{this.opts.autoUnref&&this.ws._socket.unref(),this.onOpen()},this.ws.onclose=e=>this.onClose({description:"websocket connection closed",context:e}),this.ws.onmessage=e=>this.onData(e.data),this.ws.onerror=e=>this.onError("websocket error",e)}write(e){this.writable=!1;for(let t=0;t<e.length;t++){const i=e[t],r=t===e.length-1;xs(i,this.supportsBinary,n=>{try{this.doWrite(i,n)}catch{}r&&Tt(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){typeof this.ws<"u"&&(this.ws.onerror=()=>{},this.ws.close(),this.ws=null)}uri(){const e=this.opts.secure?"wss":"ws",t=this.query||{};return this.opts.timestampRequests&&(t[this.opts.timestampParam]=er()),this.supportsBinary||(t.b64=1),this.createUri(e,t)}}const Kt=K.WebSocket||K.MozWebSocket;class za extends Na{createSocket(e,t,i){return ir?new Kt(e,t,i):t?new Kt(e,t):new Kt(e)}doWrite(e,t){this.ws.send(t)}}class qa extends As{get name(){return"webtransport"}doOpen(){try{this._transport=new WebTransport(this.createUri("https"),this.opts.transportOptions[this.name])}catch(e){return this.emitReserved("error",e)}this._transport.closed.then(()=>{this.onClose()}).catch(e=>{this.onError("webtransport error",e)}),this._transport.ready.then(()=>{this._transport.createBidirectionalStream().then(e=>{const t=Sa(Number.MAX_SAFE_INTEGER,this.socket.binaryType),i=e.readable.pipeThrough(t).getReader(),r=_a();r.readable.pipeTo(e.writable),this._writer=r.writable.getWriter();const n=()=>{i.read().then(({done:a,value:l})=>{a||(this.onPacket(l),n())}).catch(a=>{})};n();const o={type:"open"};this.query.sid&&(o.data=`{"sid":"${this.query.sid}"}`),this._writer.write(o).then(()=>this.onOpen())})})}write(e){this.writable=!1;for(let t=0;t<e.length;t++){const i=e[t],r=t===e.length-1;this._writer.write(i).then(()=>{r&&Tt(()=>{this.writable=!0,this.emitReserved("drain")},this.setTimeoutFn)})}}doClose(){var e;(e=this._transport)===null||e===void 0||e.close()}}const Fa={websocket:za,webtransport:qa,polling:Ua},Ga=/^(?:(?![^:@\/?#]+:[^:@\/]*@)(http|https|ws|wss):\/\/)?((?:(([^:@\/?#]*)(?::([^:@\/?#]*))?)?@)?((?:[a-f0-9]{0,4}:){2,7}[a-f0-9]{0,4}|[^:\/?#]*)(?::(\d*))?)(((\/(?:[^?#](?![^?#\/]*\.[^?#\/.]+(?:[?#]|$)))*\/?)?([^?#\/]*))(?:\?([^#]*))?(?:#(.*))?)/,Va=["source","protocol","authority","userInfo","user","password","host","port","relative","path","directory","file","query","anchor"];function rs(s){if(s.length>8e3)throw"URI too long";const e=s,t=s.indexOf("["),i=s.indexOf("]");t!=-1&&i!=-1&&(s=s.substring(0,t)+s.substring(t,i).replace(/:/g,";")+s.substring(i,s.length));let r=Ga.exec(s||""),n={},o=14;for(;o--;)n[Va[o]]=r[o]||"";return t!=-1&&i!=-1&&(n.source=e,n.host=n.host.substring(1,n.host.length-1).replace(/;/g,":"),n.authority=n.authority.replace("[","").replace("]","").replace(/;/g,":"),n.ipv6uri=!0),n.pathNames=Ha(n,n.path),n.queryKey=Wa(n,n.query),n}function Ha(s,e){const t=/\/{2,9}/g,i=e.replace(t,"/").split("/");return(e.slice(0,1)=="/"||e.length===0)&&i.splice(0,1),e.slice(-1)=="/"&&i.splice(i.length-1,1),i}function Wa(s,e){const t={};return e.replace(/(?:^|&)([^&=]*)=?([^&]*)/g,function(i,r,n){r&&(t[r]=n)}),t}const ns=typeof addEventListener=="function"&&typeof removeEventListener=="function",gt=[];ns&&addEventListener("offline",()=>{gt.forEach(s=>s())},!1);class ge extends I{constructor(e,t){if(super(),this.binaryType=ka,this.writeBuffer=[],this._prevBufferLen=0,this._pingInterval=-1,this._pingTimeout=-1,this._maxPayload=-1,this._pingTimeoutTime=1/0,e&&typeof e=="object"&&(t=e,e=null),e){const i=rs(e);t.hostname=i.host,t.secure=i.protocol==="https"||i.protocol==="wss",t.port=i.port,i.query&&(t.query=i.query)}else t.host&&(t.hostname=rs(t.host).host);It(this,t),this.secure=t.secure!=null?t.secure:typeof location<"u"&&location.protocol==="https:",t.hostname&&!t.port&&(t.port=this.secure?"443":"80"),this.hostname=t.hostname||(typeof location<"u"?location.hostname:"localhost"),this.port=t.port||(typeof location<"u"&&location.port?location.port:this.secure?"443":"80"),this.transports=[],this._transportsByName={},t.transports.forEach(i=>{const r=i.prototype.name;this.transports.push(r),this._transportsByName[r]=i}),this.opts=Object.assign({path:"/engine.io",agent:!1,withCredentials:!1,upgrade:!0,timestampParam:"t",rememberUpgrade:!1,addTrailingSlash:!0,rejectUnauthorized:!0,perMessageDeflate:{threshold:1024},transportOptions:{},closeOnBeforeunload:!1},t),this.opts.path=this.opts.path.replace(/\/$/,"")+(this.opts.addTrailingSlash?"/":""),typeof this.opts.query=="string"&&(this.opts.query=Oa(this.opts.query)),ns&&(this.opts.closeOnBeforeunload&&(this._beforeunloadEventListener=()=>{this.transport&&(this.transport.removeAllListeners(),this.transport.close())},addEventListener("beforeunload",this._beforeunloadEventListener,!1)),this.hostname!=="localhost"&&(this._offlineEventListener=()=>{this._onClose("transport close",{description:"network connection lost"})},gt.push(this._offlineEventListener))),this.opts.withCredentials&&(this._cookieJar=void 0),this._open()}createTransport(e){const t=Object.assign({},this.opts.query);t.EIO=Xi,t.transport=e,this.id&&(t.sid=this.id);const i=Object.assign({},this.opts,{query:t,socket:this,hostname:this.hostname,secure:this.secure,port:this.port},this.opts.transportOptions[e]);return new this._transportsByName[e](i)}_open(){if(this.transports.length===0){this.setTimeoutFn(()=>{this.emitReserved("error","No transports available")},0);return}const e=this.opts.rememberUpgrade&&ge.priorWebsocketSuccess&&this.transports.indexOf("websocket")!==-1?"websocket":this.transports[0];this.readyState="opening";const t=this.createTransport(e);t.open(),this.setTransport(t)}setTransport(e){this.transport&&this.transport.removeAllListeners(),this.transport=e,e.on("drain",this._onDrain.bind(this)).on("packet",this._onPacket.bind(this)).on("error",this._onError.bind(this)).on("close",t=>this._onClose("transport close",t))}onOpen(){this.readyState="open",ge.priorWebsocketSuccess=this.transport.name==="websocket",this.emitReserved("open"),this.flush()}_onPacket(e){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing")switch(this.emitReserved("packet",e),this.emitReserved("heartbeat"),e.type){case"open":this.onHandshake(JSON.parse(e.data));break;case"ping":this._sendPacket("pong"),this.emitReserved("ping"),this.emitReserved("pong"),this._resetPingTimeout();break;case"error":const t=new Error("server error");t.code=e.data,this._onError(t);break;case"message":this.emitReserved("data",e.data),this.emitReserved("message",e.data);break}}onHandshake(e){this.emitReserved("handshake",e),this.id=e.sid,this.transport.query.sid=e.sid,this._pingInterval=e.pingInterval,this._pingTimeout=e.pingTimeout,this._maxPayload=e.maxPayload,this.onOpen(),this.readyState!=="closed"&&this._resetPingTimeout()}_resetPingTimeout(){this.clearTimeoutFn(this._pingTimeoutTimer);const e=this._pingInterval+this._pingTimeout;this._pingTimeoutTime=Date.now()+e,this._pingTimeoutTimer=this.setTimeoutFn(()=>{this._onClose("ping timeout")},e),this.opts.autoUnref&&this._pingTimeoutTimer.unref()}_onDrain(){this.writeBuffer.splice(0,this._prevBufferLen),this._prevBufferLen=0,this.writeBuffer.length===0?this.emitReserved("drain"):this.flush()}flush(){if(this.readyState!=="closed"&&this.transport.writable&&!this.upgrading&&this.writeBuffer.length){const e=this._getWritablePackets();this.transport.send(e),this._prevBufferLen=e.length,this.emitReserved("flush")}}_getWritablePackets(){if(!(this._maxPayload&&this.transport.name==="polling"&&this.writeBuffer.length>1))return this.writeBuffer;let t=1;for(let i=0;i<this.writeBuffer.length;i++){const r=this.writeBuffer[i].data;if(r&&(t+=Ta(r)),i>0&&t>this._maxPayload)return this.writeBuffer.slice(0,i);t+=2}return this.writeBuffer}_hasPingExpired(){if(!this._pingTimeoutTime)return!0;const e=Date.now()>this._pingTimeoutTime;return e&&(this._pingTimeoutTime=0,Tt(()=>{this._onClose("ping timeout")},this.setTimeoutFn)),e}write(e,t,i){return this._sendPacket("message",e,t,i),this}send(e,t,i){return this._sendPacket("message",e,t,i),this}_sendPacket(e,t,i,r){if(typeof t=="function"&&(r=t,t=void 0),typeof i=="function"&&(r=i,i=null),this.readyState==="closing"||this.readyState==="closed")return;i=i||{},i.compress=i.compress!==!1;const n={type:e,data:t,options:i};this.emitReserved("packetCreate",n),this.writeBuffer.push(n),r&&this.once("flush",r),this.flush()}close(){const e=()=>{this._onClose("forced close"),this.transport.close()},t=()=>{this.off("upgrade",t),this.off("upgradeError",t),e()},i=()=>{this.once("upgrade",t),this.once("upgradeError",t)};return(this.readyState==="opening"||this.readyState==="open")&&(this.readyState="closing",this.writeBuffer.length?this.once("drain",()=>{this.upgrading?i():e()}):this.upgrading?i():e()),this}_onError(e){if(ge.priorWebsocketSuccess=!1,this.opts.tryAllTransports&&this.transports.length>1&&this.readyState==="opening")return this.transports.shift(),this._open();this.emitReserved("error",e),this._onClose("transport error",e)}_onClose(e,t){if(this.readyState==="opening"||this.readyState==="open"||this.readyState==="closing"){if(this.clearTimeoutFn(this._pingTimeoutTimer),this.transport.removeAllListeners("close"),this.transport.close(),this.transport.removeAllListeners(),ns&&(this._beforeunloadEventListener&&removeEventListener("beforeunload",this._beforeunloadEventListener,!1),this._offlineEventListener)){const i=gt.indexOf(this._offlineEventListener);i!==-1&&gt.splice(i,1)}this.readyState="closed",this.id=null,this.emitReserved("close",e,t),this.writeBuffer=[],this._prevBufferLen=0}}}ge.protocol=Xi;class Ka extends ge{constructor(){super(...arguments),this._upgrades=[]}onOpen(){if(super.onOpen(),this.readyState==="open"&&this.opts.upgrade)for(let e=0;e<this._upgrades.length;e++)this._probe(this._upgrades[e])}_probe(e){let t=this.createTransport(e),i=!1;ge.priorWebsocketSuccess=!1;const r=()=>{i||(t.send([{type:"ping",data:"probe"}]),t.once("packet",u=>{if(!i)if(u.type==="pong"&&u.data==="probe"){if(this.upgrading=!0,this.emitReserved("upgrading",t),!t)return;ge.priorWebsocketSuccess=t.name==="websocket",this.transport.pause(()=>{i||this.readyState!=="closed"&&(h(),this.setTransport(t),t.send([{type:"upgrade"}]),this.emitReserved("upgrade",t),t=null,this.upgrading=!1,this.flush())})}else{const p=new Error("probe error");p.transport=t.name,this.emitReserved("upgradeError",p)}}))};function n(){i||(i=!0,h(),t.close(),t=null)}const o=u=>{const p=new Error("probe error: "+u);p.transport=t.name,n(),this.emitReserved("upgradeError",p)};function a(){o("transport closed")}function l(){o("socket closed")}function c(u){t&&u.name!==t.name&&n()}const h=()=>{t.removeListener("open",r),t.removeListener("error",o),t.removeListener("close",a),this.off("close",l),this.off("upgrading",c)};t.once("open",r),t.once("error",o),t.once("close",a),this.once("close",l),this.once("upgrading",c),this._upgrades.indexOf("webtransport")!==-1&&e!=="webtransport"?this.setTimeoutFn(()=>{i||t.open()},200):t.open()}onHandshake(e){this._upgrades=this._filterUpgrades(e.upgrades),super.onHandshake(e)}_filterUpgrades(e){const t=[];for(let i=0;i<e.length;i++)~this.transports.indexOf(e[i])&&t.push(e[i]);return t}}let Za=class extends Ka{constructor(e,t={}){const i=typeof e=="object"?e:t;(!i.transports||i.transports&&typeof i.transports[0]=="string")&&(i.transports=(i.transports||["polling","websocket","webtransport"]).map(r=>Fa[r]).filter(r=>!!r)),super(e,i)}};function Ya(s,e="",t){let i=s;t=t||typeof location<"u"&&location,s==null&&(s=t.protocol+"//"+t.host),typeof s=="string"&&(s.charAt(0)==="/"&&(s.charAt(1)==="/"?s=t.protocol+s:s=t.host+s),/^(https?|wss?):\/\//.test(s)||(typeof t<"u"?s=t.protocol+"//"+s:s="https://"+s),i=rs(s)),i.port||(/^(http|ws)$/.test(i.protocol)?i.port="80":/^(http|ws)s$/.test(i.protocol)&&(i.port="443")),i.path=i.path||"/";const n=i.host.indexOf(":")!==-1?"["+i.host+"]":i.host;return i.id=i.protocol+"://"+n+":"+i.port+e,i.href=i.protocol+"://"+n+(t&&t.port===i.port?"":":"+i.port),i}const Ja=typeof ArrayBuffer=="function",Xa=s=>typeof ArrayBuffer.isView=="function"?ArrayBuffer.isView(s):s.buffer instanceof ArrayBuffer,rr=Object.prototype.toString,Qa=typeof Blob=="function"||typeof Blob<"u"&&rr.call(Blob)==="[object BlobConstructor]",el=typeof File=="function"||typeof File<"u"&&rr.call(File)==="[object FileConstructor]";function Ts(s){return Ja&&(s instanceof ArrayBuffer||Xa(s))||Qa&&s instanceof Blob||el&&s instanceof File}function bt(s,e){if(!s||typeof s!="object")return!1;if(Array.isArray(s)){for(let t=0,i=s.length;t<i;t++)if(bt(s[t]))return!0;return!1}if(Ts(s))return!0;if(s.toJSON&&typeof s.toJSON=="function"&&arguments.length===1)return bt(s.toJSON(),!0);for(const t in s)if(Object.prototype.hasOwnProperty.call(s,t)&&bt(s[t]))return!0;return!1}function tl(s){const e=[],t=s.data,i=s;return i.data=os(t,e),i.attachments=e.length,{packet:i,buffers:e}}function os(s,e){if(!s)return s;if(Ts(s)){const t={_placeholder:!0,num:e.length};return e.push(s),t}else if(Array.isArray(s)){const t=new Array(s.length);for(let i=0;i<s.length;i++)t[i]=os(s[i],e);return t}else if(typeof s=="object"&&!(s instanceof Date)){const t={};for(const i in s)Object.prototype.hasOwnProperty.call(s,i)&&(t[i]=os(s[i],e));return t}return s}function sl(s,e){return s.data=as(s.data,e),delete s.attachments,s}function as(s,e){if(!s)return s;if(s&&s._placeholder===!0){if(typeof s.num=="number"&&s.num>=0&&s.num<e.length)return e[s.num];throw new Error("illegal attachments")}else if(Array.isArray(s))for(let t=0;t<s.length;t++)s[t]=as(s[t],e);else if(typeof s=="object")for(const t in s)Object.prototype.hasOwnProperty.call(s,t)&&(s[t]=as(s[t],e));return s}const il=["connect","connect_error","disconnect","disconnecting","newListener","removeListener"];var S;(function(s){s[s.CONNECT=0]="CONNECT",s[s.DISCONNECT=1]="DISCONNECT",s[s.EVENT=2]="EVENT",s[s.ACK=3]="ACK",s[s.CONNECT_ERROR=4]="CONNECT_ERROR",s[s.BINARY_EVENT=5]="BINARY_EVENT",s[s.BINARY_ACK=6]="BINARY_ACK"})(S||(S={}));class rl{constructor(e){this.replacer=e}encode(e){return(e.type===S.EVENT||e.type===S.ACK)&&bt(e)?this.encodeAsBinary({type:e.type===S.EVENT?S.BINARY_EVENT:S.BINARY_ACK,nsp:e.nsp,data:e.data,id:e.id}):[this.encodeAsString(e)]}encodeAsString(e){let t=""+e.type;return(e.type===S.BINARY_EVENT||e.type===S.BINARY_ACK)&&(t+=e.attachments+"-"),e.nsp&&e.nsp!=="/"&&(t+=e.nsp+","),e.id!=null&&(t+=e.id),e.data!=null&&(t+=JSON.stringify(e.data,this.replacer)),t}encodeAsBinary(e){const t=tl(e),i=this.encodeAsString(t.packet),r=t.buffers;return r.unshift(i),r}}class Is extends I{constructor(e){super(),this.opts=Object.assign({reviver:void 0,maxAttachments:10},typeof e=="function"?{reviver:e}:e)}add(e){let t;if(typeof e=="string"){if(this.reconstructor)throw new Error("got plaintext data when reconstructing a packet");t=this.decodeString(e);const i=t.type===S.BINARY_EVENT;i||t.type===S.BINARY_ACK?(t.type=i?S.EVENT:S.ACK,this.reconstructor=new nl(t),t.attachments===0&&super.emitReserved("decoded",t)):super.emitReserved("decoded",t)}else if(Ts(e)||e.base64)if(this.reconstructor)t=this.reconstructor.takeBinaryData(e),t&&(this.reconstructor=null,super.emitReserved("decoded",t));else throw new Error("got binary data when not reconstructing a packet");else throw new Error("Unknown type: "+e)}decodeString(e){let t=0;const i={type:Number(e.charAt(0))};if(S[i.type]===void 0)throw new Error("unknown packet type "+i.type);if(i.type===S.BINARY_EVENT||i.type===S.BINARY_ACK){const n=t+1;for(;e.charAt(++t)!=="-"&&t!=e.length;);const o=e.substring(n,t);if(o!=Number(o)||e.charAt(t)!=="-")throw new Error("Illegal attachments");const a=Number(o);if(!ol(a)||a<0)throw new Error("Illegal attachments");if(a>this.opts.maxAttachments)throw new Error("too many attachments");i.attachments=a}if(e.charAt(t+1)==="/"){const n=t+1;for(;++t&&!(e.charAt(t)===","||t===e.length););i.nsp=e.substring(n,t)}else i.nsp="/";const r=e.charAt(t+1);if(r!==""&&Number(r)==r){const n=t+1;for(;++t;){const o=e.charAt(t);if(o==null||Number(o)!=o){--t;break}if(t===e.length)break}i.id=Number(e.substring(n,t+1))}if(e.charAt(++t)){const n=this.tryParse(e.substr(t));if(Is.isPayloadValid(i.type,n))i.data=n;else throw new Error("invalid payload")}return i}tryParse(e){try{return JSON.parse(e,this.opts.reviver)}catch{return!1}}static isPayloadValid(e,t){switch(e){case S.CONNECT:return yi(t);case S.DISCONNECT:return t===void 0;case S.CONNECT_ERROR:return typeof t=="string"||yi(t);case S.EVENT:case S.BINARY_EVENT:return Array.isArray(t)&&(typeof t[0]=="number"||typeof t[0]=="string"&&il.indexOf(t[0])===-1);case S.ACK:case S.BINARY_ACK:return Array.isArray(t)}}destroy(){this.reconstructor&&(this.reconstructor.finishedReconstruction(),this.reconstructor=null)}}class nl{constructor(e){this.packet=e,this.buffers=[],this.reconPack=e}takeBinaryData(e){if(this.buffers.push(e),this.buffers.length===this.reconPack.attachments){const t=sl(this.reconPack,this.buffers);return this.finishedReconstruction(),t}return null}finishedReconstruction(){this.reconPack=null,this.buffers=[]}}const ol=Number.isInteger||function(s){return typeof s=="number"&&isFinite(s)&&Math.floor(s)===s};function yi(s){return Object.prototype.toString.call(s)==="[object Object]"}const al=Object.freeze(Object.defineProperty({__proto__:null,Decoder:Is,Encoder:rl,get PacketType(){return S}},Symbol.toStringTag,{value:"Module"}));function Q(s,e,t){return s.on(e,t),function(){s.off(e,t)}}const ll=Object.freeze({connect:1,connect_error:1,disconnect:1,disconnecting:1,newListener:1,removeListener:1});class nr extends I{constructor(e,t,i){super(),this.connected=!1,this.recovered=!1,this.receiveBuffer=[],this.sendBuffer=[],this._queue=[],this._queueSeq=0,this.ids=0,this.acks={},this.flags={},this.io=e,this.nsp=t,i&&i.auth&&(this.auth=i.auth),this._opts=Object.assign({},i),this.io._autoConnect&&this.open()}get disconnected(){return!this.connected}subEvents(){if(this.subs)return;const e=this.io;this.subs=[Q(e,"open",this.onopen.bind(this)),Q(e,"packet",this.onpacket.bind(this)),Q(e,"error",this.onerror.bind(this)),Q(e,"close",this.onclose.bind(this))]}get active(){return!!this.subs}connect(){return this.connected?this:(this.subEvents(),this.io._reconnecting||this.io.open(),this.io._readyState==="open"&&this.onopen(),this)}open(){return this.connect()}send(...e){return e.unshift("message"),this.emit.apply(this,e),this}emit(e,...t){var i,r,n;if(ll.hasOwnProperty(e))throw new Error('"'+e.toString()+'" is a reserved event name');if(t.unshift(e),this._opts.retries&&!this.flags.fromQueue&&!this.flags.volatile)return this._addToQueue(t),this;const o={type:S.EVENT,data:t};if(o.options={},o.options.compress=this.flags.compress!==!1,typeof t[t.length-1]=="function"){const h=this.ids++,u=t.pop();this._registerAckCallback(h,u),o.id=h}const a=(r=(i=this.io.engine)===null||i===void 0?void 0:i.transport)===null||r===void 0?void 0:r.writable,l=this.connected&&!(!((n=this.io.engine)===null||n===void 0)&&n._hasPingExpired());return this.flags.volatile&&!a||(l?(this.notifyOutgoingListeners(o),this.packet(o)):this.sendBuffer.push(o)),this.flags={},this}_registerAckCallback(e,t){var i;const r=(i=this.flags.timeout)!==null&&i!==void 0?i:this._opts.ackTimeout;if(r===void 0){this.acks[e]=t;return}const n=this.io.setTimeoutFn(()=>{delete this.acks[e];for(let a=0;a<this.sendBuffer.length;a++)this.sendBuffer[a].id===e&&this.sendBuffer.splice(a,1);t.call(this,new Error("operation has timed out"))},r),o=(...a)=>{this.io.clearTimeoutFn(n),t.apply(this,a)};o.withError=!0,this.acks[e]=o}emitWithAck(e,...t){return new Promise((i,r)=>{const n=(o,a)=>o?r(o):i(a);n.withError=!0,t.push(n),this.emit(e,...t)})}_addToQueue(e){let t;typeof e[e.length-1]=="function"&&(t=e.pop());const i={id:this._queueSeq++,tryCount:0,pending:!1,args:e,flags:Object.assign({fromQueue:!0},this.flags)};e.push((r,...n)=>(this._queue[0],r!==null?i.tryCount>this._opts.retries&&(this._queue.shift(),t&&t(r)):(this._queue.shift(),t&&t(null,...n)),i.pending=!1,this._drainQueue())),this._queue.push(i),this._drainQueue()}_drainQueue(e=!1){if(!this.connected||this._queue.length===0)return;const t=this._queue[0];t.pending&&!e||(t.pending=!0,t.tryCount++,this.flags=t.flags,this.emit.apply(this,t.args))}packet(e){e.nsp=this.nsp,this.io._packet(e)}onopen(){typeof this.auth=="function"?this.auth(e=>{this._sendConnectPacket(e)}):this._sendConnectPacket(this.auth)}_sendConnectPacket(e){this.packet({type:S.CONNECT,data:this._pid?Object.assign({pid:this._pid,offset:this._lastOffset},e):e})}onerror(e){this.connected||this.emitReserved("connect_error",e)}onclose(e,t){this.connected=!1,delete this.id,this.emitReserved("disconnect",e,t),this._clearAcks()}_clearAcks(){Object.keys(this.acks).forEach(e=>{if(!this.sendBuffer.some(i=>String(i.id)===e)){const i=this.acks[e];delete this.acks[e],i.withError&&i.call(this,new Error("socket has been disconnected"))}})}onpacket(e){if(e.nsp===this.nsp)switch(e.type){case S.CONNECT:e.data&&e.data.sid?this.onconnect(e.data.sid,e.data.pid):this.emitReserved("connect_error",new Error("It seems you are trying to reach a Socket.IO server in v2.x with a v3.x client, but they are not compatible (more information here: https://socket.io/docs/v3/migrating-from-2-x-to-3-0/)"));break;case S.EVENT:case S.BINARY_EVENT:this.onevent(e);break;case S.ACK:case S.BINARY_ACK:this.onack(e);break;case S.DISCONNECT:this.ondisconnect();break;case S.CONNECT_ERROR:this.destroy();const i=new Error(e.data.message);i.data=e.data.data,this.emitReserved("connect_error",i);break}}onevent(e){const t=e.data||[];e.id!=null&&t.push(this.ack(e.id)),this.connected?this.emitEvent(t):this.receiveBuffer.push(Object.freeze(t))}emitEvent(e){if(this._anyListeners&&this._anyListeners.length){const t=this._anyListeners.slice();for(const i of t)i.apply(this,e)}super.emit.apply(this,e),this._pid&&e.length&&typeof e[e.length-1]=="string"&&(this._lastOffset=e[e.length-1])}ack(e){const t=this;let i=!1;return function(...r){i||(i=!0,t.packet({type:S.ACK,id:e,data:r}))}}onack(e){const t=this.acks[e.id];typeof t=="function"&&(delete this.acks[e.id],t.withError&&e.data.unshift(null),t.apply(this,e.data))}onconnect(e,t){this.id=e,this.recovered=t&&this._pid===t,this._pid=t,this.connected=!0,this.emitBuffered(),this._drainQueue(!0),this.emitReserved("connect")}emitBuffered(){this.receiveBuffer.forEach(e=>this.emitEvent(e)),this.receiveBuffer=[],this.sendBuffer.forEach(e=>{this.notifyOutgoingListeners(e),this.packet(e)}),this.sendBuffer=[]}ondisconnect(){this.destroy(),this.onclose("io server disconnect")}destroy(){this.subs&&(this.subs.forEach(e=>e()),this.subs=void 0),this.io._destroy(this)}disconnect(){return this.connected&&this.packet({type:S.DISCONNECT}),this.destroy(),this.connected&&this.onclose("io client disconnect"),this}close(){return this.disconnect()}compress(e){return this.flags.compress=e,this}get volatile(){return this.flags.volatile=!0,this}timeout(e){return this.flags.timeout=e,this}onAny(e){return this._anyListeners=this._anyListeners||[],this._anyListeners.push(e),this}prependAny(e){return this._anyListeners=this._anyListeners||[],this._anyListeners.unshift(e),this}offAny(e){if(!this._anyListeners)return this;if(e){const t=this._anyListeners;for(let i=0;i<t.length;i++)if(e===t[i])return t.splice(i,1),this}else this._anyListeners=[];return this}listenersAny(){return this._anyListeners||[]}onAnyOutgoing(e){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.push(e),this}prependAnyOutgoing(e){return this._anyOutgoingListeners=this._anyOutgoingListeners||[],this._anyOutgoingListeners.unshift(e),this}offAnyOutgoing(e){if(!this._anyOutgoingListeners)return this;if(e){const t=this._anyOutgoingListeners;for(let i=0;i<t.length;i++)if(e===t[i])return t.splice(i,1),this}else this._anyOutgoingListeners=[];return this}listenersAnyOutgoing(){return this._anyOutgoingListeners||[]}notifyOutgoingListeners(e){if(this._anyOutgoingListeners&&this._anyOutgoingListeners.length){const t=this._anyOutgoingListeners.slice();for(const i of t)i.apply(this,e.data)}}}function Ue(s){s=s||{},this.ms=s.min||100,this.max=s.max||1e4,this.factor=s.factor||2,this.jitter=s.jitter>0&&s.jitter<=1?s.jitter:0,this.attempts=0}Ue.prototype.duration=function(){var s=this.ms*Math.pow(this.factor,this.attempts++);if(this.jitter){var e=Math.random(),t=Math.floor(e*this.jitter*s);s=(Math.floor(e*10)&1)==0?s-t:s+t}return Math.min(s,this.max)|0};Ue.prototype.reset=function(){this.attempts=0};Ue.prototype.setMin=function(s){this.ms=s};Ue.prototype.setMax=function(s){this.max=s};Ue.prototype.setJitter=function(s){this.jitter=s};class ls extends I{constructor(e,t){var i;super(),this.nsps={},this.subs=[],e&&typeof e=="object"&&(t=e,e=void 0),t=t||{},t.path=t.path||"/socket.io",this.opts=t,It(this,t),this.reconnection(t.reconnection!==!1),this.reconnectionAttempts(t.reconnectionAttempts||1/0),this.reconnectionDelay(t.reconnectionDelay||1e3),this.reconnectionDelayMax(t.reconnectionDelayMax||5e3),this.randomizationFactor((i=t.randomizationFactor)!==null&&i!==void 0?i:.5),this.backoff=new Ue({min:this.reconnectionDelay(),max:this.reconnectionDelayMax(),jitter:this.randomizationFactor()}),this.timeout(t.timeout==null?2e4:t.timeout),this._readyState="closed",this.uri=e;const r=t.parser||al;this.encoder=new r.Encoder,this.decoder=new r.Decoder,this._autoConnect=t.autoConnect!==!1,this._autoConnect&&this.open()}reconnection(e){return arguments.length?(this._reconnection=!!e,e||(this.skipReconnect=!0),this):this._reconnection}reconnectionAttempts(e){return e===void 0?this._reconnectionAttempts:(this._reconnectionAttempts=e,this)}reconnectionDelay(e){var t;return e===void 0?this._reconnectionDelay:(this._reconnectionDelay=e,(t=this.backoff)===null||t===void 0||t.setMin(e),this)}randomizationFactor(e){var t;return e===void 0?this._randomizationFactor:(this._randomizationFactor=e,(t=this.backoff)===null||t===void 0||t.setJitter(e),this)}reconnectionDelayMax(e){var t;return e===void 0?this._reconnectionDelayMax:(this._reconnectionDelayMax=e,(t=this.backoff)===null||t===void 0||t.setMax(e),this)}timeout(e){return arguments.length?(this._timeout=e,this):this._timeout}maybeReconnectOnOpen(){!this._reconnecting&&this._reconnection&&this.backoff.attempts===0&&this.reconnect()}open(e){if(~this._readyState.indexOf("open"))return this;this.engine=new Za(this.uri,this.opts);const t=this.engine,i=this;this._readyState="opening",this.skipReconnect=!1;const r=Q(t,"open",function(){i.onopen(),e&&e()}),n=a=>{this.cleanup(),this._readyState="closed",this.emitReserved("error",a),e?e(a):this.maybeReconnectOnOpen()},o=Q(t,"error",n);if(this._timeout!==!1){const a=this._timeout,l=this.setTimeoutFn(()=>{r(),n(new Error("timeout")),t.close()},a);this.opts.autoUnref&&l.unref(),this.subs.push(()=>{this.clearTimeoutFn(l)})}return this.subs.push(r),this.subs.push(o),this}connect(e){return this.open(e)}onopen(){this.cleanup(),this._readyState="open",this.emitReserved("open");const e=this.engine;this.subs.push(Q(e,"ping",this.onping.bind(this)),Q(e,"data",this.ondata.bind(this)),Q(e,"error",this.onerror.bind(this)),Q(e,"close",this.onclose.bind(this)),Q(this.decoder,"decoded",this.ondecoded.bind(this)))}onping(){this.emitReserved("ping")}ondata(e){try{this.decoder.add(e)}catch(t){this.onclose("parse error",t)}}ondecoded(e){Tt(()=>{this.emitReserved("packet",e)},this.setTimeoutFn)}onerror(e){this.emitReserved("error",e)}socket(e,t){let i=this.nsps[e];return i?this._autoConnect&&!i.active&&i.connect():(i=new nr(this,e,t),this.nsps[e]=i),i}_destroy(e){const t=Object.keys(this.nsps);for(const i of t)if(this.nsps[i].active)return;this._close()}_packet(e){const t=this.encoder.encode(e);for(let i=0;i<t.length;i++)this.engine.write(t[i],e.options)}cleanup(){this.subs.forEach(e=>e()),this.subs.length=0,this.decoder.destroy()}_close(){this.skipReconnect=!0,this._reconnecting=!1,this.onclose("forced close")}disconnect(){return this._close()}onclose(e,t){var i;this.cleanup(),(i=this.engine)===null||i===void 0||i.close(),this.backoff.reset(),this._readyState="closed",this.emitReserved("close",e,t),this._reconnection&&!this.skipReconnect&&this.reconnect()}reconnect(){if(this._reconnecting||this.skipReconnect)return this;const e=this;if(this.backoff.attempts>=this._reconnectionAttempts)this.backoff.reset(),this.emitReserved("reconnect_failed"),this._reconnecting=!1;else{const t=this.backoff.duration();this._reconnecting=!0;const i=this.setTimeoutFn(()=>{e.skipReconnect||(this.emitReserved("reconnect_attempt",e.backoff.attempts),!e.skipReconnect&&e.open(r=>{r?(e._reconnecting=!1,e.reconnect(),this.emitReserved("reconnect_error",r)):e.onreconnect()}))},t);this.opts.autoUnref&&i.unref(),this.subs.push(()=>{this.clearTimeoutFn(i)})}}onreconnect(){const e=this.backoff.attempts;this._reconnecting=!1,this.backoff.reset(),this.emitReserved("reconnect",e)}}const Ve={};function yt(s,e){typeof s=="object"&&(e=s,s=void 0),e=e||{};const t=Ya(s,e.path||"/socket.io"),i=t.source,r=t.id,n=t.path,o=Ve[r]&&n in Ve[r].nsps,a=e.forceNew||e["force new connection"]||e.multiplex===!1||o;let l;return a?l=new ls(i,e):(Ve[r]||(Ve[r]=new ls(i,e)),l=Ve[r]),t.query&&!e.query&&(e.query=t.queryKey),l.socket(t.path,e)}Object.assign(yt,{Manager:ls,Socket:nr,io:yt,connect:yt});function cl(s,e=new V){const t=Object.assign(new V,e,{boardSize:s.boardSize??e.boardSize,winCon:s.winCon??e.winCon,gravityEnabled:s.gravityEnabled??e.gravityEnabled,rotationEnabled:s.rotationEnabled??e.rotationEnabled,moveTimeoutMs:s.moveTimeoutMs??e.moveTimeoutMs});return t.fixInvalidValues(),t}const de={ListLobbies:"lobby:list",CreateLobby:"lobby:create",JoinLobby:"lobby:join",UpdateLobby:"lobby:update",UpdateProfile:"profile:update",SendMessage:"chat:message",ReactToMessage:"chat:reaction",SubmitMove:"game:move",RotateBoard:"game:rotate"},G={LobbyList:"lobby:list",LobbyUpdated:"lobby:updated",LobbyJoined:"lobby:joined",GameStart:"game:start",ChatMessage:"chat:message",ChatReaction:"chat:reaction",MoveAccepted:"game:move-accepted",MoveRejected:"game:move-rejected",BoardRotated:"game:board-rotated",Error:"lobby:error",HostTransferred:"lobby:host-transferred",LobbySettingRequested:"lobby:setting-requested",LobbySettingDecided:"lobby:setting-decided"},dl={};function ul(s={}){const e=dl,t=s.env??e??{},i=t.VITE_SERVER_URL?.trim();if(i)return i.replace(/\/$/,"");const r=t.VITE_SERVER_PORT?.trim()||"3001",n=s.windowOrigin??(typeof window<"u"?window.location.origin:void 0);if(!n)return`http://localhost:${r}`;const o=new URL(n);return o.port=r,o.toString().replace(/\/$/,"")}class hl{constructor(){this.currentLobby=null,this.socket=yt(ul()),this.setupListeners()}setupListeners(){const e=g.Controller;this.socket.on(G.LobbyList,t=>{y.emit(f.UI.LobbiesUpdated,e,t)}),this.socket.on(G.LobbyUpdated,t=>{Ee.setCurrentLobbyId(t.id),this.currentLobby=t,y.emit(f.UI.LobbiesUpdated,e,[t])}),this.socket.on(G.LobbyJoined,t=>{Ee.setCurrentLobbyId(t.id),this.currentLobby=t,y.emit(f.UI.LobbiesUpdated,e,[t])}),this.socket.on(G.GameStart,t=>{const i=Object.assign(new V,t.settings??{}),r=this.currentLobby?.members[0]?.symbol??"";y.emit(f.Game.Start,e,{turn:0,nextPlayerSymbol:r,settings:i}),y.emit(f.UI.ToastRequested,e,{message:"Match gestartet.",type:"success"})}),this.socket.on(G.ChatMessage,t=>{y.emit(f.Chat.MessageReceived,e,t)}),this.socket.on(G.ChatReaction,t=>{y.emit(f.Chat.MessageReactionReceived,e,t)}),this.socket.on(G.MoveAccepted,t=>{y.emit(f.Game.MoveApplied,e,t)}),this.socket.on(G.BoardRotated,t=>{y.emit(f.Game.MoveApplied,e,t)}),this.socket.on(G.MoveRejected,t=>{y.emit(f.Game.MoveRejected,e,t)}),this.socket.on(G.Error,t=>{y.emit(f.Sys.Error,e,t)}),this.socket.on(G.HostTransferred,t=>{y.emit(f.UI.ToastRequested,e,{message:`Host gewechselt an ${t.nextHostId}.`,type:"info"})}),this.socket.on(G.LobbySettingRequested,t=>{y.emit(f.UI.ToastRequested,e,{message:`${t.requesterName} möchte ${t.targetSetting} ändern.`,type:"warning"})}),this.socket.on(G.LobbySettingDecided,t=>{y.emit(f.UI.ToastRequested,e,{message:t.status==="accepted"?`Lobby-Änderung für ${t.targetSetting} übernommen.`:`Lobby-Änderung für ${t.targetSetting} abgelehnt.`,type:t.status==="accepted"?"success":"info"})}),y.on(f.UI.LobbyCreateRequested,e,t=>{this.socket.emit(de.CreateLobby,t)}),y.on(f.UI.LobbyJoinRequested,e,t=>{this.socket.emit(de.JoinLobby,t)}),y.on(f.UI.LobbyListRefreshRequested,e,()=>{this.socket.emit(de.ListLobbies)}),y.on(f.UI.LobbySettingsChanged,e,t=>{const i=Ee.getCurrentLobbyId();if(!i){y.emit(f.UI.SettingsChangeRequested,e,cl(t));return}const r={lobbyId:i,settings:t};this.socket.emit(de.UpdateLobby,r)}),y.on(f.UI.ProfileChangeRequested,e,t=>{const i=he.save({username:t.username,symbol:t.symbol,preferences:t.preferences}),r={username:i.username,symbol:i.symbol,preferences:i.preferences};this.socket.emit(de.UpdateProfile,r)}),y.on(f.Chat.MessageSent,e,t=>{const i=Ee.getCurrentLobbyId();if(!i)return;const r={lobbyId:i,content:t.content,id:t.id,senderId:t.senderId,senderName:t.senderName,createdAt:t.createdAt};this.socket.emit(de.SendMessage,r)}),y.on(f.Chat.MessageReactionRequested,e,t=>{const i=Ee.getCurrentLobbyId();if(!i)return;const r={lobbyId:i,messageId:t.messageId,emoji:t.emoji};this.socket.emit(de.ReactToMessage,r)}),y.on(f.Game.MoveRequested,e,t=>{this.socket.emit(de.SubmitMove,t)}),y.on(f.Game.RotateRequested,e,t=>{this.socket.emit(de.RotateBoard,t)})}}Z.isDebug=!0;Z.setScopeAll();new ma;new hl;
