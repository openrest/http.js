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
	};

	return self;
}());

// Syntactic sugar
http.create = http.create || http.Factory.create;