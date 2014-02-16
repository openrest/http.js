var http = http || {};

http.Factory = http.Factory || (function() {
	var self = {};
	
	self.create = function(params) {
		params = params || {};
		var timeout = params.timeout || 60000;
		var onload = params.onload || function(e){};
		var onerror = params.onerror || function(e){};
		var onprogress = params.onprogress || function(e){};
		var ontimeout = params.ontimeout || function(e){};
		
		if (typeof(XDomainRequest) !== "undefined") { // IE8, IE9
		    var xdr = new XDomainRequest();
		    
		    xdr.timeout = timeout;
		    /**
		     * Try this on IE9:
		     * 
		     * var x1 = new XDomainRequest();
		     * x1.onprogress = function() {};
		     * x1.onerror = function() {};
		     * x1.ontimeout = function() {};
		     * x1.onload = function() {};
		     * x1.timeout = 60000;
		     * x1.open("POST", "https://[domain]/[path]");
		     * x1.send(JSON.stringify({}));
		     * 
		     * function ie9_bug() {
		     *    var x2 = new XDomainRequest();
		     *    x2.onprogress = function() {};
		     *    x2.onerror = function() {};
		     *    x2.ontimeout = function() {};
		     *    x2.onload = function() {};
		     *    x2.timeout = 60000;
		     *    x2.open("POST", "https://[domain]/[path]");
		     *    x2.send(JSON.stringify({}));
		     * }
		     * ie9_bug();
		     * 
		     * View the Network tab in the debug console and notice that the second call is
		     * immediately aborted. If x2 is defined globally, everything works.
		     * 
		     * It appears that IE9 ignores the pending request and garbage-collects x2 when
		     * the function returns. @see https://github.com/faye/faye/pull/98
		     * 
		     * The code below seems to workaround the bug without making xdr global.
		     */
		    xdr.onload = function() {
		    	xdr.fix = true;
		    	onload();
		    };
		    xdr.onerror = onerror;
		    xdr.onprogress = onprogress;
		    xdr.ontimeout = ontimeout;
		    
		    xdr.setRequestHeader = function(header, value){};
		    xdr.setUserAgent = function(userAgent){};
		    
		    return xdr;
		}
		
		// All other modern browsers
		var xhr = new XMLHttpRequest();
		
	    xhr.onload = onload;
	    xhr.onerror = onerror;
	    xhr.onprogress = onprogress;
	    xhr.ontimeout = ontimeout;
	    
	    xhr.setUserAgent = function(userAgent){};
	    
	    /**
	     * IE10 throws InvalidStateError when timeout is set before open.
	     * @see https://github.com/google/tracing-framework/issues/407
	     */
	   	var _open = xhr.open;
	    xhr.open = function() {
	    	var result = _open.apply(xhr, arguments);
		    xhr.timeout = timeout;
		    return result;
	    };
	    
		return xhr;
	};

	return self;
}());

// Syntactic sugar
http.create = http.create || http.Factory.create;