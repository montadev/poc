getWS = function (req){
	jreq = new JSONscriptRequest(req);
	jreq.buildScriptTag();
	jreq.addScriptTag(); 
}

var objQ;

$(function(){
 if ($('#moteurrecherche').length) {
 objQ = document.getElementById('moteurrecherche');
 objQ.onkeydown = function (event){	
		var key =getKeyCode(event);
		
		var TAB = 9;
		var ESC = 27;
		var KEYUP = 38;
		var KEYDN = 40;
		var ENTER = 13;
		//if (key > 0) 
		clearInterval(rythm);
	
		switch(key)
		{
			case ENTER:
			submitSuggest(objQ);
			break;
			
			case TAB:
			hideSuggest();
			break;

			case ESC:
			hideSuggest();
			break;

			case KEYUP:
			highlighted--;
			changeHighlight();
			break;

			case KEYDN:
			highlighted++;
			changeHighlight();
			break;
			
			default:
			startSuggest();
			break;
		}	
	}

}});

var cache_q = ""; 
var rythm;
var highlighted = -1;

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


getSuggestions = function (q){

	var result = getWS('/websvc/search-suggestions.ws.php?q='+q+'&nocache='+Math.random());
}

startSuggest = function () { 
	rythm = setInterval("checkSuggest()",200);
}

submitSuggest = function (item) { 
	objQ.value = item.title == '' ? item.value:item.title;
	hideSuggest();
	var regPcent = new RegExp('\%', 'gi');
	var regEsp = new RegExp('\ ', 'gi');
	var subprefix = 's';
	if ($('#subprefix').length>0) subprefix = $('#subprefix').val();
	if ($('#searchparams').length>0) {
		doSearchCount();
	} else {
		var x = encodeURIComponent(objQ.value.replace(regEsp,'+').replace(regPcent,'')).replace('%2F','/');
		window.location.href = "/"+subprefix+"/"+x+'?src=1';
	}
}

var idSite = document.getElementById('idSite').value;

if (idSite == 2) {
	hideSuggest = function () { 
		clearInterval(rythm);
		$('#divautosuggest').css({'display':'none'});
		checkDisplay();
	}
} else {
	hideSuggest = function () { 
		clearInterval(rythm);
		$('#divautosuggest').css({'visibility':'hidden'});
	}
}


checkSuggest = function () {
	if (cache_q == objQ.value) return false; 
	cache_q = objQ.value;
	getSuggestions(cache_q);
}

window.onresize = function(){}

changeHighlight = function (){
	var items = $('#divautosuggest').find('a');
	if(highlighted >= items.length ) highlighted=0;
	if(highlighted < 0 ) highlighted=items.length-1;
	for (i in items)
	{
		var a = items[i];

		if (highlighted == i)
		{
			a.className = "selected";
			objQ.value = a.title;
			clearInterval(rythm);
		}
		else
		{
			a.className = "";
		}
	}
	
}

highlightSuggest = function(item){
	highlighted = item;
	var items = $('#divautosuggest').find('a');
	for (i in items)
	{
		var a = items[i];

		if (highlighted == i)
		{
			a.className = "selected";
		}
		else
		{
			a.className = "";
		}
	}
}
	
getKeyCode = function (e){
	if(window.event) // IE
	{
		return window.event.keyCode;
	}
	else if(e.which) // Netscape/Firefox/Opera
	{
		return e.which;
	}
}

function checkDisplay() {
	var div = document.getElementById('divautosuggest');
	var form = document.querySelector('.form_searchbox');

	if (window.getComputedStyle(div).display === 'block') {
			form.style.border = '1px solid #359AA5';
			form.style.borderRadius = '12px';
	} else {
			form.style.border = '';
			form.style.borderRadius = '';
	}
}
