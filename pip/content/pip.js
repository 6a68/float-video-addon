////
/// by Marcio Galli -  Brazil, Evangelism, and more.. 
//  Soon to be released in MPL and adapted for Windows, and Linux
//  Check project updates at code.google.com/p/pip
// 
//  Contributors: Fabricio Zuardi ( @ Ning ) 
//  Help from Roc Moz and Myk / mozilla

/* Special thanks to Robert O'Callahan for input on drawWindow and bug 313462; 
   Thanks to Brian King for the recommendation to keep the global namespace safe methodology;  
*/


if(!com) var com={};
if(!com.taboca) com.taboca={};
if(!com.taboca.pip) com.taboca.pip={};

com.taboca.pip = { 
 
   pip_active : false,
   pip_ctx : null,
   pip_canvas : null,
   pip_videoTab : null,
   pip_panelDocument : null,
   pip_canvasRefId : "pipcanvas",
   gPop_videoWindow : null,
   gPop_x:0,
   gPop_y:0,
   gPop_width:0,
   gPop_height:0,
   gPop_defaultWidth:120,
   gPop_defaultHeight:100,

   dumpConsole: function(aMessage) {
     try {
       var psvc = Components.classes["@mozilla.org/preferences-service;1"]
                            .getService(Components.interfaces.nsIPrefBranch);
       var cs = Components.classes["@mozilla.org/consoleservice;1"]
                            .getService(Components.interfaces.nsIConsoleService);
       cs.logStringMessage("VideoOnTabs: " + aMessage);
     } catch (i) {}
   },

   dumpConsole: function () {

   },

   pip_getWidthPref: function () {
    try {
        var psvc = Components.classes["@mozilla.org/preferences-service;1"]
                         .getService(Components.interfaces.nsIPrefBranch);
        this.gPop_defaultWidth = parseInt (psvc.getCharPref("pip.default_width")) ;
  if ( this.gPop_defaultWidth > 1 ) {
  }  else {
    this.gPop_defaultWidth=120;
  }
    } catch (i) { }
   },

   pip_backToVideo: function () {
  gBrowser.selectedTab = this.pip_videoTab;
   },

   pip_bringBack: function () {
  if (this.pip_active) { 
    document.getElementById("pippanel").openPopup(document.getElementById("pipmenu"),"before_end", -1,-1,false);
  } 
   },

   pip_launchPanel: function () {
  try { 
          if(!this.pip_active) {  
             this.pip_getWidthPref();
             document.getElementById("pippanel").openPopup(document.getElementById("pipmenu"),"before_end", -1,-1,false);
             this.pip_canvasRefId="pipcanvas";
             this.TellDocument(document);
             this.runPopcanvas();
             this.pip_active=true;
         } else { 
             this.pip_active=false;
             document.getElementById("pippanel").hidePopup();
   }
  } catch(i) { alert(i) } 
   },

   runPopcanvas:  function () {
    try { 
  var currentDoc = gBrowser.selectedBrowser.contentDocument;
  this.pip_videoTab = gBrowser.selectedTab; 

        var stampedThis = this; 

        var stampedPopSniffer = com.taboca.pip.Pop_ElementSniffer; 

  var iterator = currentDoc.createTreeWalker( currentDoc, NodeFilter.SHOW_ELEMENT,  stampedPopSniffer  , true ) ;
  setTimeout( function (i) { stampedThis.Pop_Iterator(i) }  , 20, iterator); 

    } catch(i) { alert(i) } 
   },

   Pop_Iterator: function ( iterator ) { 

      for(var i=0; i < 50; i++) { 
         if(!iterator.nextNode()) {
            return;   
         }
      } 
      var stampedThis = this; 
      setTimeout( function (i) { stampedThis.Pop_Iterator(i) } , 20, iterator );
   },

  Pop_ElementSniffer:  function (elem) {

  if(elem instanceof Components.interfaces.nsIDOMHTMLEmbedElement) {
    var embedBox = elem.getBoundingClientRect();

    com.taboca.pip.gPop_x = embedBox.left;
    com.taboca.pip.gPop_y = embedBox.top;
    com.taboca.pip.gPop_width  = embedBox.width;
    com.taboca.pip.gPop_height = embedBox.height;

    if(com.taboca.pip.gPop_x >=0 && com.taboca.pip.gPop_y >= 0 && com.taboca.pip.gPop_width >50 ) { 
      if(elem.getAttribute("wmode")!="transparent") {
        var parentEmbed = elem.parentNode;
        elem.setAttribute("wmode","transparent");
        var elem_brother = elem.cloneNode(true);
        parentEmbed.replaceChild(elem_brother,elem);
      }
      com.taboca.pip.gPop_videoWindow =  gBrowser.selectedBrowser.contentWindow;
      com.taboca.pip.Pop_VideoEnable();
    }
  }
  return NodeFilter.FILTER_ACCEPT; 
   },

   TellDocument: function ( clientDocument ) { 
      this.pip_panelDocument = clientDocument;
   }, 

   Pop_VideoEnable: function () {
     try { 
       var canvas = this.pip_panelDocument.getElementById(this.pip_canvasRefId);
       this.gPop_defaultHeight = parseInt ( ( this.gPop_defaultWidth * this.gPop_height ) / this.gPop_width);
       canvas.width  = this.gPop_defaultWidth;
       canvas.height = this.gPop_defaultHeight;
       canvas.setAttribute("width",this.gPop_defaultWidth);
       canvas.setAttribute("height",this.gPop_defaultHeight);
       canvas.style.width= this.gPop_defaultWidth +" px";
       canvas.style.height= this.gPop_defaultHeight +" px";
       this.pip_ctx = canvas.getContext("2d");
       var scaleFactorW = this.gPop_defaultWidth/this.gPop_width;
       var scaleFactorH = this.gPop_defaultHeight/this.gPop_height;
       this.pip_ctx.scale(scaleFactorW,scaleFactorH);
       this.pip_ctx.clearRect(0, 0, this.gPop_defaultWidth, this.gPop_defaultHeight);
       this.pip_ctx.save();
       this.initZoom();
     } catch(i) { alert(i) } 
   }, 

   initZoom: function () {
    var stampedThis = this; 
    setTimeout( function ()  { stampedThis.doZoom() } ,2600);
   }, 

   doZoom: function () {
     try {
       this.pip_ctx.drawWindow(this.gPop_videoWindow ,this.gPop_x,this.gPop_y,this.gPop_width, this.gPop_height,"rgb(255,0,255)");
       var stampedThis = this; 
       setTimeout( function () { stampedThis.doZoom() } ,150);
     } catch (i) {
       this.dumpConsole(i);
     } 
   }, 
   httpscanner : {
      observe: function(subject,topic,data){
       try {
         var response=subject.QueryInterface(Components.interfaces.nsIHttpChannel);
         var contentType=response.getResponseHeader('Content-Type');         
         this.dumpConsole(contentType);
         function testContentType(types){
                var isMediaFile = false;
                for(var i=types.length;i>=0;i--){
            if(contentType.indexOf(types[i])>-1 || mediaLocation.indexOf('.'+types[i])>-1) isMediaFile = true;
                }
                return isMediaFile;
         }
         if(contentType.indexOf('video')>-1){
            var mediaLocation = subject.QueryInterface(Components.interfaces.nsIChannel).URI;
            mediaLocation=mediaLocation.prePath+mediaLocation.path;
            if(testContentType(['flv','mov','wmv','avi','mpeg'])){
               this.dumpConsole("There is a media " );
               if(contentType.indexOf('video')>-1) {
               }
               g_videoon  = contentType;
               g_mediaurl = mediaLocation;
            }
         }
       } catch (e) { com.taboca.pip.dumpConsole(e)}
      }
   }, 
   observerService: null,
   end:"end"

}; // end of com taboca pip

com.taboca.pip.observerService = Components.classes["@mozilla.org/observer-service;1"].getService(Components.interfaces.nsIObserverService);
com.taboca.pip.observerService.addObserver(com.taboca.pip.httpscanner,"http-on-examine-response",false);


