/* Cookies Directive - The rewrite. Now a jQuery plugin
 * Version: 2.0.1
 * Author: Ollie Phillips
 * 24 October 2013
 */

;(function($) {
	$.cookiesDirective = function(options) {
			
		// Default Cookies Directive Settings
		var settings = $.extend({
			//Options
			explicitConsent: true,
			position: 'top',
			duration: 10,
			limit: 0,
			message: null,				
			cookieScripts: null,
			privacyPolicyUri: 'privacy.html',
			scriptWrapper: function(){},	
			// Styling
			fontFamily: 'helvetica',
			fontColor: '#FFFFFF',
			fontSize: '13px',
			backgroundColor: '#000000',
			backgroundOpacity: '80',
			linkColor: '#CA0000'
		}, options);
		
		// Perform consent checks
		if(!getCookie('cookiesDirective')) {
			if(settings.limit > 0) {
				// Display limit in force, record the view
				if(!getCookie('cookiesDisclosureCount')) {
					setCookie('cookiesDisclosureCount',1,1);		
				} else {
					var disclosureCount = getCookie('cookiesDisclosureCount');
					disclosureCount ++;
					setCookie('cookiesDisclosureCount',disclosureCount,1);
				}
				
				// Have we reached the display limit, if not make disclosure
				if(settings.limit >= getCookie('cookiesDisclosureCount')) {
					disclosure(settings);		
				}
			} else {
				// No display limit
				disclosure(settings);
			}		
			
			// If we don't require explicit consent, load up our script wrapping function
			if(!settings.explicitConsent) {
				settings.scriptWrapper.call();
			}	
		} else {
			// Cookies accepted, load script wrapping function
			settings.scriptWrapper.call();
		}		
	};
	
	// Used to load external javascript files into the DOM
	$.cookiesDirective.loadScript = function(options) {
		var settings = $.extend({
			uri: 		'', 
			appendTo: 	'body'
		}, options);	
		
		var elementId = String(settings.appendTo);
		var sA = document.createElement("script");
		sA.src = settings.uri;
		sA.type = "text/javascript";
		sA.onload = sA.onreadystatechange = function() {
			if ((!sA.readyState || sA.readyState == "loaded" || sA.readyState == "complete")) {
				return;
			} 	
		}
		switch(settings.appendTo) {
			case 'head':			
				$('head').append(sA);
			  	break;
			case 'body':
				$('body').append(sA);
			  	break;
			default: 
				$('#' + elementId).append(sA);
		}
	}	 
	
	// Helper scripts
	// Get cookie
	var getCookie = function(name) {
		var nameEQ = name + "=";
		var ca = document.cookie.split(';');
		for(var i=0;i < ca.length;i++) {
			var c = ca[i];
			while (c.charAt(0)==' ') c = c.substring(1,c.length);
			if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
		}
		return null;
	}
	
	// Set cookie
	var setCookie = function(name,value,days) {
		if (days) {
			var date = new Date();
			date.setTime(date.getTime()+(days*24*60*60*1000));
			var expires = "; expires="+date.toGMTString();
		}
		else var expires = "";
		document.cookie = name+"="+value+expires+"; path=/";
	}
	
	// Detect IE < 9
	var checkIE = function(){
		var version;
		if (navigator.appName == 'Microsoft Internet Explorer') {
	        var ua = navigator.userAgent;
	        var re = new RegExp("MSIE ([0-9]{1,}[\.0-9]{0,})");
	        if (re.exec(ua) != null) {
	            version = parseFloat(RegExp.$1);
			}	
			if (version <= 8.0) {
				return true;
			} else {
				if(version == 9.0) {
					if(document.compatMode == "BackCompat") {
						// IE9 in quirks mode won't run the script properly, set to emulate IE8	
						var mA = document.createElement("meta");
						mA.content = "IE=EmulateIE8";				
						document.getElementsByTagName('head')[0].appendChild(mA);
						return true;
					} else {
						return false;
					}
				}	
				return false;
			}		
	    } else {
			return false;
		}
	}
	
    function replaceAll(find, replace, str) 
    {
      while( str.indexOf(find) > -1)
      {
        str = str.replace(find, replace);
      }
      return str;
    }		

	// Disclosure routines
	var disclosure = function(options) {
		var settings = options;
		settings.css = 'fixed';
		
		if(checkIE()) {
			settings.position = 'top';
			settings.css = 'absolute';
		}
	
		// Create overlay
		var html = ''; 
		html += '<div id="epd">';
		html += '<div id="cookiesdirective" style="position:'+ settings.css +';'+ settings.position + ':-300px;left:0px;width:100%;'
		html += 'height:auto;background:' + settings.backgroundColor + ';opacity:.' + settings.backgroundOpacity + ';';
		html += '-ms-filter: "alpha(opacity=' + settings.backgroundOpacity + ')"';
		html += 'filter: alpha(opacity=' + settings.backgroundOpacity + ');';
		html += '-khtml-opacity: .' + settings.backgroundOpacity + '; -moz-opacity: .' + settings.backgroundOpacity + ';';
		html += 'color:' + settings.fontColor + ';font-family:' + settings.fontFamily + ';font-size:' + settings.fontSize + ';';
		html += 'text-align:center;z-index:1000;">';
		html += '<div style="position:relative;height:auto;width:90%;padding:10px;margin-left:auto;margin-right:auto;">';
	
		// Adjust cookie consent link based on site
		var urlCookie = "/infos/?pg=confidentialite";
		var libCookie = "cookies";
		if (document.getElementById('idSite')) {
			var idSite = document.getElementById('idSite').value;
		} else {
			var idSite = 0;
		}
	
		if (idSite == "10") {
			urlCookie = "/datenschutz/";
			libCookie = "Cookies";
		}
	
		var local = replaceAll('%LIENCOOKIE%', '<a style="color:'+ settings.linkColor + ';font-weight:bold;font-family:' + settings.fontFamily + ';font-size:' + settings.fontSize + ';" href="'+urlCookie+'">'+libCookie+'</a>', local_msg_cookie);
	
		html += local;
		html += '<div style="margin-top:5px;"><input type="submit" name="impliedsubmit" id="impliedsubmit" value="'+local_msg_fermer_cookie+'"/></div></div>';    
	
		html += '</div></div>';
		$('body').append(html);
	
		var dp = settings.position.toLowerCase();
		if(dp != 'top' && dp!= 'bottom') {
			dp = 'top';
		}
	
		var opts = new Array();
		if(dp == 'top') {
			opts['in'] = {'top':'0'};
			opts['out'] = {'top':'-300'};
		} else {
			opts['in'] = {'bottom':'0'};
			opts['out'] = {'bottom':'-300'};
		}
	
		// Start animation
		$('#cookiesdirective').animate(opts['in'], 1000, function() {
			console.log('test gtag');
			if(settings.explicitConsent) {
				// Explicit consent: user checks box and clicks submit
				$('#explicitsubmit').click(function() {
					if($('#epdagree').is(':checked')) {
						// User accepts cookies - update the Google Ads consent
						gtag('consent', 'update', {
							'ad_storage': 'granted', // or 'denied' if they don't accept
							'ad_user_data': 'denied',
							'ad_personalization': 'denied',
							'analytics_storage': 'denied'
						});
						// Set a cookie to prevent this being displayed again
						setCookie('cookiesDirective',1,365);    
						// Close the overlay
						$('#cookiesdirective').animate(opts['out'],1000,function() { 
							$('#cookiesdirective').remove();
							location.reload(true);
						});
					} else {
						// We need the box checked for explicit consent
						$('#epdnotick').css('display', 'block'); 
					}
				});
			} else {
				// Implied consent: just a button to close it
				$('#impliedsubmit').click(function() {
					// User accepts cookies - update the Google Ads consent
					gtag('consent', 'update', {
						'ad_storage': 'granted', // or 'denied' if they don't accept
						'ad_user_data': 'denied',
						'ad_personalization': 'denied',
						'analytics_storage': 'denied'
					});
					// Set a cookie to prevent this being displayed again
					setCookie('cookiesDirective',1,365);    
					// Close the overlay
					$('#cookiesdirective').animate(opts['out'],1000,function() { 
						$('#cookiesdirective').remove();
					});
				});
			}
	
			// Set a timer to remove the warning after 'settings.duration' seconds
			setTimeout(function(){
				$('#cookiesdirective').animate({
					opacity:'0'
				},2000, function(){
					$('#cookiesdirective').css(dp,'-300px');
				});
			}, settings.duration * 1000);
		});
	}
	
})(jQuery);
