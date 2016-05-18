
function setSize() {




}

function restoreDefaults() {

    try {
        var psvc = Components.classes["@mozilla.org/preferences-service;1"]
                         .getService(Components.interfaces.nsIPrefBranch);

        psvc.setCharPref("pip.default_width", 120 );       
                       
    } catch (i) { alert(i) }
    
}


