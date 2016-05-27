define("import-style",[],function(e,t,n){"use strict";function i(e){return"[object String]"==={}.toString.call(e)}function l(){var e=d.createElement("style");if(e.type="text/css",void 0!==e.styleSheet&&d.getElementsByTagName("style").length>31)throw new Error("Exceed the maximal count of style tags in IE");return h.appendChild(e),e}function s(e,t){void 0!==e.styleSheet?e.styleSheet.cssText=t:(t=d.createTextNode(t),e.firstChild?e.replaceChild(t,e.firstChild):e.appendChild(t))}function r(e){e&&i(e)&&(u+=e,c||(c=l()),s(c,u))}function o(e){e&&i(e)&&(f+=e,a||(a=l()),s(a,f))}var c,a,d=document,h=d.getElementsByTagName("head")[0]||d.documentElement,u="",f="";n.exports.css=r,n.exports.link=o});define("css/toast.css.js",["import-style"],function(a,e,i){var t=a("import-style");t.css(".ui-toast{position:fixed;background:none repeat scroll 0 0 transparent;top:20px;left:50%;margin:0;padding:0;pointer-events:none;z-index:2147483647}.ui-toast>div{position:relative;top:0;right:50%;margin:0;padding:0;pointer-events:visiblepainted}@-webkit-keyframes zoomIn{0%{opacity:0;-webkit-transform:scale3d(.3,.3,.3);transform:scale3d(.3,.3,.3)}50%{opacity:1}}@keyframes zoomIn{0%{opacity:0;transform:scale3d(.3,.3,.3)}50%{opacity:1}}.ui-toast-message{padding:7px 10px 7px 44px;margin:0;color:#222;border:1px solid #f0c36d;border-radius:2px;box-shadow:0 0 4px rgba(0,0,0,.2);background:#f9edbe no-repeat 10px;max-width:606px;font-size:15px;font-weight:700;line-height:24px;-webkit-animation-fill-mode:both;animation-fill-mode:both;-webkit-animation-duration:.16s;animation-duration:.16s;-webkit-animation-name:zoomIn;animation-name:zoomIn}.ui-toast-type-info .ui-toast-message{background-image:url(./examples/images/info.png)}.ui-toast-type-success .ui-toast-message{background-image:url(./examples/images/success.png)}.ui-toast-type-error .ui-toast-message{background-image:url(./examples/images/error.png)}.ui-toast-type-warn .ui-toast-message{background-image:url(./examples/images/warn.png)}.ui-toast-type-ask .ui-toast-message{background-image:url(./examples/images/ask.png)}.ui-toast-type-lock .ui-toast-message{background-image:url(./examples/images/lock.png)}.ui-toast-type-sad .ui-toast-message{background-image:url(./examples/images/sad.png)}.ui-toast-type-smile .ui-toast-message{background-image:url(./examples/images/smile.png)}.ui-toast-type-loading .ui-toast-message{background-image:url(./examples/images/loading.gif)}.ui-toast-mask{width:100%;height:100%;position:fixed;top:0;left:0;background:#fff;opacity:.65;z-index:2147483646;-ms-filter:progid:DXImageTransform.Microsoft.Alpha(Opacity=65);filter:progid:DXImageTransform.Microsoft.Alpha(Opacity=65)}:root .ui-toast-mask{filter:none\\9}")});define("toast",["./css/toast.css.js","jquery"],function(t,e,i){"use strict";function s(t,e,i){i=[].slice.call(i,0),i.unshift(e),t.emit.apply(t,i)}function n(t,e){return this instanceof n?(t=t||"言宜慢，心宜善。",e=o.extend({id:h,lock:!1,type:"info",timeout:3e3},e),e.timeout=Math.abs(Number(e.timeout))||3e3,r.has(e.id)&&r.get(e.id).hide(),this.events={},this.locked=!1,this.id=e.id,this.options=e,this.visibility=!1,this.type=e.type,this.toast=o('<div class="ui-toast ui-toast-type-'+e.type+'">  <div>    <div class="ui-toast-message">'+t+"</div>  </div></div>"),this.show("INITIALIZE"),void r.add(e.id,this)):new n(t,e)}t("./css/toast.css.js");var o=t("jquery"),h=(new Date).getTime(),c={reference:0,mask:o('<div class="ui-toast-mask"></div>'),show:function(){0===c.reference&&c.mask.appendTo(document.body),c.reference++},hide:function(){c.reference--,0===c.reference&&c.mask.remove()}},r={cache:{},add:function(t,e){r.cache[t]=e},remove:function(t){delete r.cache[t]},has:function(t){return r.cache.hasOwnProperty(t)},get:function(t){return r.cache[t]}};n.prototype={lock:function(){return c.show(),this.locked=!0,s(this,"lock",arguments),this},unlock:function(){return this.locked&&(c.hide(),this.locked=!1,s(this,"unlock",arguments)),this},show:function(){if(!this.visibility){var t=this;this.options.lock&&this.lock.apply(this,arguments),this.toast.appendTo(document.body),this.visibility=!0,this.options.timeout>0&&(clearTimeout(this.timer),this.timer=setTimeout(function(){t.hide("TIMEOUT")},this.options.timeout)),s(this,"show",arguments)}return this},hide:function(){return this.visibility&&(this.unlock.apply(this,arguments),this.toast.remove(),this.visibility=!1,clearTimeout(this.timer),s(this,"hide",arguments)),this},on:function(t,e){return this.events[t]=this.events[t]||o.Callbacks("memory stopOnFalse"),this.events[t].add(e),this},off:function(t,e){switch(arguments.length){case 0:this.events={};break;case 1:delete this.events[t];break;default:this.events[t]&&this.events[t].remove(e)}return this},emit:function(t){var e=[].slice.call(arguments,0);return this.events[t]=this.events[t]||o.Callbacks("memory stopOnFalse"),this.events[t].fireWith(this,e),this}},n.query=r.get,o.each(["info","ask","warn","success","error","loading"],function(t,e){n[e]=function(t,i){return new n(t,o.extend({},i,{type:e}))}}),i.exports=n});