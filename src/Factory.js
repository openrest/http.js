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
		
		if (typeof(XDomainRequest) !== "undefined") { // IE
		    var xdr = new XDomainRequest();
		    
		    xdr.timeout = timeout;
		    xdr.onload = onload;
		    xdr.onerror = onerror;
		    xdr.onprogress = onprogress;
		    xdr.ontimeout = ontimeout;
		    
		    xdr.setRequestHeader = function(header, value){};
		    xdr.setUserAgent = function(userAgent){};
		    
		    return xdr;
		} else if (typeof(XMLHttpRequest) !== "undefined") { // All other modern browsers
			var xhr = new XMLHttpRequest();
			
		    xhr.timeout = timeout;
		    xhr.onload = onload;
		    xhr.onerror = onerror;
		    xhr.onprogress = onprogress;
		    xhr.ontimeout = ontimeout;
		    
		    xhr.setUserAgent = function(userAgent){};
		    
			return xhr;
		} else if (typeof(Ti) !== "undefined") { // Appcelerator Titanium
			var client = Ti.Network.createHTTPClient({
				timeout : timeout,
				onload : onload,
				onerror : onerror,
				onprogress : onprogress,
				ontimeout : ontimeout
			});
			
		    client.setUserAgent = function(userAgent) {
				client.setRequestHeader("User-Agent", userAgent);
		    };

			return client;
		} else {
			throw new Error("Could not find an HttpClient implementation.");
		}
	};

	return self;
}());

// Syntactic sugar
http.create = http.create || http.Factory.create;