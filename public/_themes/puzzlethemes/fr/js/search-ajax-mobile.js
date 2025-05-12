getWS = function (req){
	jreqmobile = new JSONscriptRequest(req);
	jreqmobile.buildScriptTag();
	jreqmobile.addScriptTag(); 
}

var objQmobile;

$(function(){
 if ($('#moteurrecherchemobile').length) {
 objQmobile = document.getElementById('moteurrecherchemobile');

 objQmobile.onkeydown = function (event){	
		var keymobile =getKeyCodemobile(event);
		
		var TAB = 9;
		var ESC = 27;
		var KEYUP = 38;
		var KEYDN = 40;
		var ENTER = 13;
		//if (key > 0) 
		clearInterval(rythmmobile);
		
		switch(keymobile)
		{
			case ENTER:
			submitSuggestmobile(objQmobile);
			break;
			
			case TAB:
			hideSuggestmobile();
			break;

			case ESC:
			hideSuggestmobile();
			break;

			case KEYUP:
			highlightedmobile--;
			changeHighlightmobile();
			break;

			case KEYDN:
			highlightedmobile++;
			changeHighlightmobile();
			break;
			
			default:
			startSuggestmobile();
			break;
		}	
	}

}});



var cache_q = ""; 
var rythmmobile;
var highlightedmobile = -1;

JSONscriptRequest = function (fullUrl) {
    this.fullUrl = fullUrl; 
    this.noCacheIE = '&noCacheIE=' + (new Date()).getTime();
    this.headLoc = document.getElementsByTagName("head").item(0);
    this.scriptId = 'JscriptId' + JSONscriptRequest.scriptCounter++;
}
JSONscriptRequest.scriptCounter = 1;
JSONscriptRequest.prototype.buildScriptTag = function () {
    this.scriptObj = document.createElement("script");
    this.scriptObj.setAttribute("type", "text/javascript");
    this.scriptObj.setAttribute("charset", "utf-8");
    this.scriptObj.setAttribute("src", this.fullUrl + this.noCacheIE);
    this.scriptObj.setAttribute("id", this.scriptId);
}
 
JSONscriptRequest.prototype.removeScriptTag = function () {
    this.headLoc.removeChild(this.scriptObj);  
}

JSONscriptRequest.prototype.addScriptTag = function () {
    this.headLoc.appendChild(this.scriptObj);
}


getSuggestionsmobile = function (qm){

	var resultmobile = getWS('/websvc/search-suggestions-mobile.ws.php?q='+qm+'&nocache='+Math.random());

}

startSuggestmobile = function () { 

	rythmmobile = setInterval("checkSuggestmobile()",200);
}

submitSuggestmobile = function (item) { 
	objQmobile.value = item.title == '' ? item.value:item.title;
	hideSuggestmobile();
	var regPcentmobile = new RegExp('\%', 'gi');
	var regEspmobile = new RegExp('\ ', 'gi');
	var subprefixmobile = 's';
	if ($('#subprefixmobile').length>0) subprefixmobile = $('#subprefixmobile').val();
	if ($('#searchparams').length>0) {
		doSearchCount();
	} else {
		window.location.href = "/"+subprefixmobile+"/"+encodeURIComponent(objQmobile.value.replace(regEspmobile,'+').replace(regPcentmobile,''))+'?src=1';
	}
}

hideSuggestmobile = function () { 
	clearInterval(rythmmobile);
	$('#divautosuggestmobile').css({'visibility':'hidden'});
}

checkSuggestmobile = function () {

	if (cache_q == objQmobile.value) return false; 
	cache_q = objQmobile.value;

	getSuggestionsmobile(cache_q);
}

window.onresize = function(){}

changeHighlightmobile = function (){
	var items = $('#divautosuggestmobile').find('a');
	if(highlightedmobile >= items.length ) highlightedmobile=0;
	if(highlightedmobile < 0 ) highlightedmobile=items.length-1;
	for (i in items)
	{
		var a = items[i];

		if (highlightedmobile == i)
		{
			a.className = "selected";
			objQmobile.value = a.title;
			clearInterval(rythmmobile);
		}
		else
		{
			a.className = "";
		}
	}
	
}

highlightSuggestmobile = function(item){
	highlightedmobile = item;
	var items = $('#divautosuggestmobile').find('a');
	for (i in items)
	{
		var a = items[i];

		if (highlightedmobile == i)
		{
			a.className = "selected";
		}
		else
		{
			a.className = "";
		}
	}
}
	
getKeyCodemobile = function (e){
	if(window.event) // IE
	{
		return window.event.keyCode;
	}
	else if(e.which) // Netscape/Firefox/Opera
	{
		return e.which;
	}
}


