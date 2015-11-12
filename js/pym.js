/*! pym.js - v0.4.4 - 2015-07-16 */
!function(a){"function"==typeof define&&define.amd?define(a):"undefined"!=typeof module&&module.exports?module.exports=a():window.pym=a.call(this)}(function(){var a="xPYMx",b={},c=function(a){var b=new RegExp("[\\?&]"+a.replace(/[\[]/,"\\[").replace(/[\]]/,"\\]")+"=([^&#]*)"),c=b.exec(location.search);return null===c?"":decodeURIComponent(c[1].replace(/\+/g," "))},d=function(a,b){return"*"===b.xdomain||a.origin.match(new RegExp(b.xdomain+"$"))?!0:void 0},e=function(b,c,d){var e=["pym",b,c,d];return e.join(a)},f=function(b){var c=["pym",b,"(\\S+)","(.+)"];return new RegExp("^"+c.join(a)+"$")},g=function(){for(var a=document.querySelectorAll("[data-pym-src]:not([data-pym-auto-initialized])"),c=a.length,d=0;c>d;++d){var e=a[d];e.setAttribute("data-pym-auto-initialized",""),""===e.id&&(e.id="pym-"+d);var f=e.getAttribute("data-pym-src"),g=e.getAttribute("data-pym-xdomain"),h={};g&&(h.xdomain=g),new b.Parent(e.id,f,h)}};return b.Parent=function(a,b,c){this.id=a,this.url=b,this.el=document.getElementById(a),this.iframe=null,this.settings={xdomain:"*"},this.messageRegex=f(this.id),this.messageHandlers={},c=c||{},this._constructIframe=function(){var a=this.el.offsetWidth.toString();this.iframe=document.createElement("iframe");var b="",c=this.url.indexOf("#");c>-1&&(b=this.url.substring(c,this.url.length),this.url=this.url.substring(0,c)),this.url.indexOf("?")<0?this.url+="?":this.url+="&",this.iframe.src=this.url+"initialWidth="+a+"&childId="+this.id+"&parentUrl="+encodeURIComponent(window.location.href)+b,this.iframe.setAttribute("width","100%"),this.iframe.setAttribute("scrolling","no"),this.iframe.setAttribute("marginheight","0"),this.iframe.setAttribute("frameborder","0"),this.el.appendChild(this.iframe),window.addEventListener("resize",this._onResize)},this._onResize=function(){this.sendWidth()}.bind(this),this._fire=function(a,b){if(a in this.messageHandlers)for(var c=0;c<this.messageHandlers[a].length;c++)this.messageHandlers[a][c].call(this,b)},this.remove=function(){window.removeEventListener("message",this._processMessage),window.removeEventListener("resize",this._onResize),this.el.removeChild(this.iframe)},this._processMessage=function(a){if(d(a,this.settings)&&"string"==typeof a.data){var b=a.data.match(this.messageRegex);if(!b||3!==b.length)return!1;var c=b[1],e=b[2];this._fire(c,e)}}.bind(this),this._onHeightMessage=function(a){var b=parseInt(a);this.iframe.setAttribute("height",b+"px")},this._onNavigateToMessage=function(a){document.location.href=a},this.onMessage=function(a,b){a in this.messageHandlers||(this.messageHandlers[a]=[]),this.messageHandlers[a].push(b)},this.sendMessage=function(a,b){this.el.getElementsByTagName("iframe")[0].contentWindow.postMessage(e(this.id,a,b),"*")},this.sendWidth=function(){var a=this.el.offsetWidth.toString();this.sendMessage("width",a)};for(var g in c)this.settings[g]=c[g];return this.onMessage("height",this._onHeightMessage),this.onMessage("navigateTo",this._onNavigateToMessage),window.addEventListener("message",this._processMessage,!1),this._constructIframe(),this},b.Child=function(b){this.parentWidth=null,this.id=null,this.parentUrl=null,this.settings={renderCallback:null,xdomain:"*",polling:0},this.messageRegex=null,this.messageHandlers={},b=b||{},this.onMessage=function(a,b){a in this.messageHandlers||(this.messageHandlers[a]=[]),this.messageHandlers[a].push(b)},this._fire=function(a,b){if(a in this.messageHandlers)for(var c=0;c<this.messageHandlers[a].length;c++)this.messageHandlers[a][c].call(this,b)},this._processMessage=function(a){if(d(a,this.settings)&&"string"==typeof a.data){var b=a.data.match(this.messageRegex);if(b&&3===b.length){var c=b[1],e=b[2];this._fire(c,e)}}}.bind(this),this._onWidthMessage=function(a){var b=parseInt(a);b!==this.parentWidth&&(this.parentWidth=b,this.settings.renderCallback&&this.settings.renderCallback(b),this.sendHeight())},this.sendMessage=function(a,b){window.parent.postMessage(e(this.id,a,b),"*")},this.sendHeight=function(){var a=document.getElementsByTagName("body")[0].offsetHeight.toString();this.sendMessage("height",a)}.bind(this),this.scrollParentTo=function(a){this.sendMessage("navigateTo","#"+a)},this.navigateParentTo=function(a){this.sendMessage("navigateTo",a)},this.id=c("childId")||b.id,this.messageRegex=new RegExp("^pym"+a+this.id+a+"(\\S+)"+a+"(.+)$");var f=parseInt(c("initialWidth"));this.parentUrl=c("parentUrl"),this.onMessage("width",this._onWidthMessage);for(var g in b)this.settings[g]=b[g];return window.addEventListener("message",this._processMessage,!1),this.settings.renderCallback&&this.settings.renderCallback(f),this.sendHeight(),this.settings.polling&&window.setInterval(this.sendHeight,this.settings.polling),this},g(),b});
