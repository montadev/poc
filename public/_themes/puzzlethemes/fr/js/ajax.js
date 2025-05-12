function my$(id){ return document.getElementById(id); }

var urlSuggest = "";

var RequestAjax = new Object();

RequestAjax.send = function(url,method,callback,data,urlencoded){
	var req;
	if(window.XMLHttpRequest)
		req = new XMLHttpRequest();
	else{
		if(window.ActiveXObject) req = new ActiveXObject("Microsoft.XMLHTTP");
	}

	req.onreadystatechange = function(){
		if(req.readyState == 4){
			if(req.status < 400)
				(method=="POST" ? callback(req) : callback(req,data));
			else
				alert("There was a problem loading data :\n" + req.status+ "/" + req.statusText);
		}
	}

	if(method=="POST"){
		req.open("POST",url,true);
		if(urlencoded) req.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
		req.send(data);
	}else{
		req.open("GET",url,true);
		req.send(null);
	}

	return req;
}

RequestAjax.getAjax     = function(url,callback,args){ return RequestAjax.send(url,"GET",callback,args); }

function hasClass(el,cls){ return el.className.match(new RegExp('(\\s|^)'+cls+'(\\s|$)')); }

function addClass(el,cls){	if(!this.hasClass(el,cls)) el.className += " "+cls; }

function removeClass(el,cls){
	if(hasClass(el,cls)){
    	var reg = new RegExp('(\\s|^)'+cls+'(\\s|$)');
		el.className=el.className.replace(reg,' ');
	}
}

function addEvent(el,e,fc){ return (el ? (window.addEventListener ? el.addEventListener(e,fc,false) : el.attachEvent('on'+e,fc)) : false); }

function removeEvent(el,e,fc){ return (el ? (window.removeEventListener ? el.removeEventListener(e,fc,false) : el.detachEvent('on'+e,fc)) : false); }

function clic_cubecoeur_fdp(i) {
	if (i.attr('src')=='/images/coeur.png') {
		i.attr('src','/images/coeur_gris.png');
		var title = local_title_coeur_gris;
		i.attr('title',title);
		i.attr('alt',title);
		var a = $('#head_a_maliste').html();
		var t = a.split('(');
		var tt = parseInt(t[1].split(')')[0])-1;
		$('#head_a_maliste').html(t[0]+'('+tt+')');
		$.post('/websvc/maliste.ws.php',{del:1,id:i.data('rel')},function(data){

				},'json');
	} else {
		i.attr('src','/images/coeur.png');
		var title = local_title_coeur_rouge;
		i.attr('title',title);
		i.attr('alt',title);
		var a = $('#head_a_maliste').html();
		var t = a.split('(');
		var tt = parseInt(t[1].split(')')[0])+1;
		$('#head_a_maliste').html(t[0]+'('+tt+')');
		$.post('/websvc/maliste.ws.php',{add:1,id:i.data('rel')},function(data){

				},'json');
	}
}

function dialogAttente() {

	if (!$('#dialog-page-load').length) {
		$('<div id="dialog-page-load"></div>').appendTo('body');
	}
	$('#dialog-page-load').html('<p style="text-align:center;display:block;color:#000;"><img src="/_themes/puzzlethemes/fr/images/ajax-loader.gif"/><br/>'+local_wait+'</p>');
	$.colorbox({inline:true, transition:'none', href:'#dialog-page-load', closeButton:false, width:"350", height:"150"});
}

function closeDialogAttente() {
	$.colorbox.close();
}

var modalCloseRedirURL = '';
function additem(stock,idproduit,nbencaddie,redir, qte){
	if (modalCloseRedirURL!='') { redir = 1; }
	if (redir==1 && modalCloseRedirURL=='') { modalCloseRedirURL = '/caddie/'; }
    var qte = parseInt($('#selectFPstock').val());
	var qtem= parseInt($('#modalFPstock').val());
	if (qtem>0) qte = qtem;
    function viewResponse(response){
        var data = eval('('+response.responseText+')');
        if(data.msgE_stock != null)
            alert(data.msgE_stock);
        else if(data.msgE_qte != null)
            alert(data.msgE_qte);
        else{
            if(redir != 2) { //redir == 2 alors on ne fait rien.
				if(redir == 1)
					window.location=modalCloseRedirURL;
				else if(redir == 3)
					window.location=urlSuggest;
				else
					close_modalbox();
			}
        }
    }
    RequestAjax.getAjax("../websvc/additem.ws.php?idproduit="+idproduit+"&qte="+qte+"&nbencaddie="+nbencaddie+"&nbstock="+stock+"&redir="+redir+"&nocache="+Math.random(),viewResponse);
}

$(function () { $("[data-toggle = 'tooltip']").tooltip(); });




function majButtonAddItem(idproduit){
	$('.cubprodpanier-' + idproduit).attr('src','/images/btn-rd-v.jpg');
}

function change_qte(button,form){
    var ligne  = form.id.split('_')[1];
    var qte    = parseInt(form.qte.value);
    var action = button.name;
    if(qte > 1 || action != 'minus'){

		dialogAttente();

        function viewResponse(response){
            var data = eval('('+response.responseText+')');
            if(qte == data.qte){
				closeDialogAttente();
				alert(data.msgE_max);
			}else{
				window.location="/caddie/";
			}
        }
        RequestAjax.getAjax('../websvc/quantite.ws.php?action='+action+'&ligne='+ligne+'&nocache='+Math.random(),viewResponse);
    }
}
function change_qte_select(selectElement) {
	var ligne = selectElement.getAttribute('data-ligne');
	var qte = parseInt(selectElement.value);
	var action = 'update';
	var stockDisponible = parseInt(selectElement.getAttribute('data-stock'));

	if (qte > stockDisponible) {
			alert("Vous avez les " + stockDisponible + " derniers exemplaires dans votre panier.");
			selectElement.value = stockDisponible;
			qte = stockDisponible;
	}

	if (qte > 1 || action != 'minus') {
			dialogAttente();
			function viewResponse(response) {
					var data = JSON.parse(response.responseText);
					var total2Formate = data.total2.replace(/&nbsp;/g, '').replace(/&euro;/g, '€');
					var totalligneFormate = data.totalligne.replace(/&nbsp;/g, '').replace(/&euro;/g, '€');
					closeDialogAttente();

					if (document.getElementById('montant_panier_head')) {
							document.getElementById('total-produit-panier').textContent = data.total;
							document.getElementById('montant_panier_head').textContent = data.total;
							document.getElementById('total-price-panier').textContent = total2Formate.replace('.', ',');

							// Cibler et mettre à jour le total de la ligne spécifique
							var lignePanierElement = document.querySelector('.total-ligne-panier-' + ligne);
							if (lignePanierElement) {
									lignePanierElement.textContent = totalligneFormate.replace('.', ',');
							}
					} else {
							window.location.href = '/caddie/';
					}
			}

			var url = '../websvc/quantite.ws.php?action=' + action + '&ligne=' + ligne + '&qte=' + qte + '&nocache=' + Math.random();
			RequestAjax.getAjax(url, viewResponse);
	}
}




function PopupCentrer(page,largeur,hauteur,btclose) {
	if (btclose=='0') { btclose = 0; } else { btclose = 1; }
	/*$.fancybox.open({
		'href' 				: page,
		'closeBtn'			: btclose,
		'type'				: 'iframe',
		'padding'			: 10,
		'width'				: largeur,
		'height'			: hauteur,
		helpers: {
				overlay: {
					closeClick: btclose
				}
			}
	});

	$(".fancybox-wrap").css('background-color', '#ffffff');*/

	$.colorbox({width:largeur,height:hauteur,href:page,overlayClose:false,escKey:false});
}

function AccentToNoAccent(str){
	var norm = new Array('\300','\301','\302','\303','\304','\305','\306','\307','\310','\311','\312','\313','\314','\315','\316','\317',
	'\320','\321','\322','\323','\324','\325','\326','\330','\331','\332','\333','\334','\335','\336','\337', '\340','\341','\342','\343',
	'\344','\345','\346','\347','\350','\351','\352','\353','\354','\355','\356','\357','\360','\361', '\362','\363','\364','\365','\366',
	'\370','\371','\372','\373','\374','\375','\376','\377');

	var spec = new Array('A','A','A','A','A','A','A','C','E','E','E','E','I','I','I','I', 'D','N','O','O','O','0','O','O','U','U','U','U',
	'Y','b','s', 'a','a','a','a','a','a','a','c','e','e','e','e','i','i','i','i','d','n', 'o','o','o','o','o','o','u','u','u','u','y','b','y');

	for(var i=0,max=spec.length;i<max;++i){
		str = str.replace(norm[i],spec[i]);
	}
	return str;
}

function setCookie(c_name,value,exdays)
{
      var exdate=new Date();
      exdate.setDate(exdate.getDate() + exdays);
      var c_value=escape(value) +
        ((exdays==null) ? "" : ("; expires="+exdate.toUTCString()));
      document.cookie=c_name + "=" + c_value +  "; path=/";
}

function filtre_prix_init(pmin,pmax) {
	$( "#filtre_prix_slider").slider({
	   range: true, step: 0.001,
	   min: pmin, max: pmax,
	   values: [ pmin, pmax ],
	   slide: function( event, ui ) {

			$( "#filtre_prix_slider_amount_min" ).val( localFitrePrixDevise0 + Math.floor(ui.values[0]) + localFitrePrixDevise  );
		    $( "#filtre_prix_slider_amount_max" ).val( localFitrePrixDevise0 + Math.ceil(ui.values[1]) + localFitrePrixDevise  );

			if ($( "#filtre_prix_slider_amount_min" ).val().split(' ')[0] == Math.floor(pmin)) {
				$( "#filtre_prix_slider_amount_min" ).val( localFitrePrixDevise0 + pmin.toFixed(2) + localFitrePrixDevise  );
			}

		    var nbprod = 0;
		    for (i=0;i<slidePrixTable.length;i++) {
				if (slidePrixTable[i] >= ui.values[0].toFixed(1) && slidePrixTable[i] <= ui.values[1].toFixed(2)) {
					nbprod++;
				}
			}
			if (nbprod>1) { nbprod += ' '+localProduits; } else { nbprod += ' '+localProduit; }
			$('#filtre_prix_cpt').html(nbprod);
		}
	});

	$( "#filtre_prix_slider_amount_min" ).val( localFitrePrixDevise0 + $( "#filtre_prix_slider" ).slider( "values", 0 ).toFixed(2) + localFitrePrixDevise );
	$( "#filtre_prix_slider_amount_max" ).val( localFitrePrixDevise0 + $( "#filtre_prix_slider" ).slider( "values", 1 ).toFixed(2) + localFitrePrixDevise );

}


function filtre_prix_init_mobile(pmin,pmax) {

	$( "#filtre_prix_slider_mobile").slider({
	   range: true, step: 0.001,
	   min: pmin, max: pmax,
	   values: [ pmin, pmax ],
	   slide: function( event, ui ) {

			$( "#filtre_prix_slider_amount_min_mobile" ).val(localFitrePrixDevise0 +  Math.floor(ui.values[0]) + localFitrePrixDevise  );
		    $( "#filtre_prix_slider_amount_max_mobile" ).val( localFitrePrixDevise0 + Math.ceil(ui.values[1]) + localFitrePrixDevise  );

			if ($( "#filtre_prix_slider_amount_min_mobile" ).val().split(' ')[0] == Math.floor(pmin)) {
				$( "#filtre_prix_slider_amount_min_mobile" ).val( localFitrePrixDevise0 + pmin.toFixed(2) + localFitrePrixDevise  );
			}

		    var nbprod = 0;

		    for (i=0;i<slidePrixTable.length;i++) {
				if (slidePrixTable[i] >= ui.values[0].toFixed(1) && slidePrixTable[i] <= ui.values[1].toFixed(2)) {
					nbprod++;
				}
			}
			if (nbprod>1) { nbprod += ' '+localProduits; } else { nbprod += ' '+localProduit; }
			$('#filtre_prix_cpt_mobile').html(nbprod);
		}
	});

	$( "#filtre_prix_slider_amount_min_mobile" ).val( localFitrePrixDevise0 + $( "#filtre_prix_slider_mobile" ).slider( "values", 0 ).toFixed(0) + localFitrePrixDevise );
	$( "#filtre_prix_slider_amount_max_mobile" ).val( localFitrePrixDevise0 + $( "#filtre_prix_slider_mobile" ).slider( "values", 1 ).toFixed(0) + localFitrePrixDevise );

}

function deviensmembre() {
		dialogAttente();
		$.get('/websvc/additem.ws.php',{ idproduit : 40368, qte : 1, nbstock : 1, nocache : Math.random() },function(data) {
			window.location.href = '/caddie/';
		});
}

var changes;

function js_form(f) {
	var imail = f.find('input.js_email');
	var errorMessage = f.find('.error-message');
	errorMessage.hide();

	if (imail) {
			var mail = imail.val();
			mail = mail.toLowerCase();
			f.find('input.js_email').val(mail);
			var regex = /^[a-z0-9\_]+([a-z0-9\_\-\.]+)*\@[a-z0-9]+((\.|-)[a-z0-9]+)*\.[a-z]{2,6}$/;
			if (mail.length < 1 || !regex.test(mail)) {
					if ($('#idSite').val() != 2) {
							alert(localClientInvalidMail);
					} else {
							errorMessage.text(localClientInvalidMail).show();
					}
					return false;
			}
	}
	return true;
}

function change_pack(id) {

			$.post('/websvc/quantite.ws.php',{ 'pack' : id },
			function(data){
				dialogAttente();
				window.location.href='/caddie/';
			},'json');
}

function addproduitbundle(idproduit,bundle) {
		var qte = 1;
		var incart = 0;
		var nbstock = 1;
		function viewResponse(response){
			var data = eval('('+response.responseText+')');
			if(data.msgE_stock != null) {
				closeDialogAttente();
				alert(data.msgE_stock);
				$('#fancybox-loading').remove();
			}
			else if(data.msgE_qte != null) {
				closeDialogAttente();
				alert(data.msgE_qte);
				$('#fancybox-loading').remove();
			}
			else{
			 window.location.href = '/caddie/';
			}
		}
		dialogAttente();
		RequestAjax.getAjax("/websvc/additem.ws.php?idproduit="+idproduit+"&bundle="+bundle+"&qte="+qte+"&nbencaddie="+incart+"&nbstock="+nbstock+"&nocache="+Math.random(),viewResponse);
}

function addproduitz(idproduit, qte, incart, nbstock) {
	if (idSite == 2) {
		var $existingProduct = $('#modal-panier .cart-product[data-idproduit="' + idproduit + '"]');
		if ($existingProduct.length > 0) {
			var currentQuantity = parseInt($existingProduct.find('select').val());
			incart = currentQuantity;
		}
	}
	function viewResponse(response){
		var data = JSON.parse(response.responseText); // Utilisez JSON.parse au lieu de eval
		if (data.msgE_stock != null) {
			if (idSite == 2) {
				showNotificationModal(data.msgE_stock);
			} else {
				alert(data.msgE_stock);
			}
		} else if (data.msgE_qte != null) {
			if (idSite == 2) {
				showNotificationModal(data.msgE_qte);
			} else {
				alert(data.msgE_qte);
			}
		} else {
			// Traitement normal de l'ajout au panier
			if (data.total != null) {
				$('#montant_panier').html(data.total);
				$('#montant_panier_head').html(data.nbtotal);
				$('#montant_panier_head_tablette').html(data.nbtotal);
				$('#montant_panier_head_mobile').html(data.nbtotal);
				if (idSite == 2 && data.nbtotal !== 0) {
					$("#montant_panier_head").addClass('flex');
				}
			}
			// Fermer la popup aperçu si existe
			$('div.ekko-lightbox button.close').click();

			var r = document.location.href;
			if (r.match(new RegExp('/caddie/'))) {
				window.location.href = '/caddie/';
			} else {
				if (idSite != 2) {
					$(document).ekkoLightbox({
						remote: '/infos/popup.php?pg=adp&id=' + idproduit
					});
					var isRdP = $('.bouton-web-' + idproduit).length > 0;
					if (isRdP) {
						var $button = $('.bouton-web-' + idproduit);
						$button.css('background-color', '#8ec549');
						$button.html('Ajouté au panier');
					}
				} else {
					$.notify({
						icon: '',
						title: "",
						message: ""
					}, {
						type: 'minimalist',
						delay: 5000,
						icon_type: 'image',
						template: '<div style="padding:14px;" data-notify="container" class="col-xs-11 col-sm-3 success-message-add-panier" role="success">' +
							'<img data-notify="icon" src="/_themes/puzzlethemes/fr/images/check-circle-add-panier.svg" >' +
							'<span style="color:#035D0C;font-size: 12px;" data-notify="message">C\'est dans la boîte !</span>' +
						'</div>'
					});
					var produit = {
						urlProduit: data.urlProduit,
						image_url: data.image_url,
						indexLigne: data.indexLigne,
						designation: data.designation,
						nbpieces: data.nbpieces,
						marque: data.marque,
						prixclient: data.prixclient,
						prix_membre: data.prix_membre,
						totalProduit: data.total,
						totalPanier: data.totalPanier,
						nb_stock: data.nb_stock
					};
					var isMembre = document.getElementById('isMembre').value === '1';
   				var prix = isMembre ? produit.prix_membre : produit.prixclient;

					$('#total-produit-panier').html(data.nbtotal);
					$('#total-price-panier').html(data.totalPanier.toFixed(2).replace('.', ',') + '€');
					updateCartModal(idproduit, qte, produit, prix);
				}
			}
		}
	}
	RequestAjax.getAjax("/websvc/additem.ws.php?idproduit=" + idproduit + "&qte=" + qte + "&nbencaddie=" + incart + "&nbstock=" + nbstock + "&nocache=" + Math.random(), viewResponse);
}

function showNotificationModal(message) {
	document.getElementById('notification-message').innerText = message;
	document.getElementById('notification-modal').style.display = 'flex';
	document.getElementById('popup-background').style.display = 'block';
	document.getElementById('close-notification').onclick = closeNotificationModal;
}

function closeNotificationModal() {
	document.getElementById('notification-modal').style.display = 'none';
	document.getElementById('popup-background').style.display = 'none';
}



function addproduitfdp(idproduit,qte,incart,nbstock) {
		function viewResponse(response){

			var data = eval('('+response.responseText+')');
			if(data.msgE_stock != null) {
				alert(data.msgE_stock);
			}
			else if(data.msgE_qte != null) {
				alert(data.msgE_qte);
			}
			else{
				if (data.total != null) {
					$('#montant_panier').html(data.total);
					$('#montant_panier_head').html(data.nbtotal);
					$('#montant_panier_head_tablette').html(data.nbtotal);
					$('#montant_panier_head_mobile').html(data.nbtotal);
				}
				window.location.href = '/caddie/';

			}
		}
	RequestAjax.getAjax("/websvc/additem.ws.php?idproduit="+idproduit+"&qte="+qte+"&nbencaddie="+incart+"&nbstock="+nbstock+"&nocache="+Math.random(),viewResponse);
}


function addproduitzLotColle(stockProd,idproduitProd,nbencaddieProd,qteProd,stockColle,idproduitColle,nbencaddieColle,qteColle) {


		function viewResponseProduit(response){

			var data = eval('('+response.responseText+')');
			if(data.msgE_stock != null) {
				alert(data.msgE_stock);
			}
			else if(data.msgE_qte != null) {
				alert(data.msgE_qte);
			}
			else{
				if (data.total != null) {
					$('#montant_panier').html(data.total);
					$('#montant_panier_head').html(data.nbtotal);
					$('#montant_panier_head_tablette').html(data.nbtotal);
					$('#montant_panier_head_mobile').html(data.nbtotal);
				}

			}
		}

		function viewResponseColle(response){

			var data = eval('('+response.responseText+')');
			if(data.msgE_stock != null) {
				alert(data.msgE_stock);
			}
			else if(data.msgE_qte != null) {
				alert(data.msgE_qte);
			}
			else{
				if (data.total != null) {
					$('#montant_panier').html(data.total);
					$('#montant_panier_head').html(data.nbtotal);
					$('#montant_panier_head_tablette').html(data.nbtotal);
					$('#montant_panier_head_mobile').html(data.nbtotal);
				}

			}
		}
	// on ajoute le produit
	RequestAjax.getAjax("/websvc/additem.ws.php?idproduit="+idproduitProd+"&qte="+qteProd+"&nbencaddie="+nbencaddieProd+"&nbstock="+stockProd+"&nocache="+Math.random(),viewResponseProduit);
	// on ajoute la colle
	RequestAjax.getAjax("/websvc/additem.ws.php?idproduit="+idproduitColle+"&qte="+qteColle+"&nbencaddie="+nbencaddieColle+"&nbstock="+stockColle+"&nocache="+Math.random(),viewResponseColle);
	// message ok
	var listeProduit = idproduitProd+','+idproduitColle;
	$(document).ekkoLightbox({

		remote:'/infos/popup.php?pg=adpGroupe&listeProduit='+listeProduit
	});

}



function addproduitzLotColleBdt(stockProd,idproduitProd,nbencaddieProd,qteProd,stockColle,idproduitColle,nbencaddieColle,qteColle,stockBdt,idproduitBdt,nbencaddieBdt,qteBdt) {


		function viewResponseProduit(response){

			var data = eval('('+response.responseText+')');
			if(data.msgE_stock != null) {
				alert(data.msgE_stock);
			}
			else if(data.msgE_qte != null) {
				alert(data.msgE_qte);
			}
			else{
				if (data.total != null) {
					$('#montant_panier').html(data.total);
					$('#montant_panier_head').html(data.nbtotal);
					$('#montant_panier_head_tablette').html(data.nbtotal);
					$('#montant_panier_head_mobile').html(data.nbtotal);
				}

			}
		}

		function viewResponseColle(response){

			var data = eval('('+response.responseText+')');
			if(data.msgE_stock != null) {
				alert(data.msgE_stock);
			}
			else if(data.msgE_qte != null) {
				alert(data.msgE_qte);
			}
			else{
				if (data.total != null) {
					$('#montant_panier').html(data.total);
					$('#montant_panier_head').html(data.nbtotal);
					$('#montant_panier_head_tablette').html(data.nbtotal);
					$('#montant_panier_head_mobile').html(data.nbtotal);
				}

			}
		}

		function viewResponseBdt(response){

			var data = eval('('+response.responseText+')');
			if(data.msgE_stock != null) {
				alert(data.msgE_stock);
			}
			else if(data.msgE_qte != null) {
				alert(data.msgE_qte);
			}
			else{
				if (data.total != null) {
					$('#montant_panier').html(data.total);
					$('#montant_panier_head').html(data.nbtotal);
					$('#montant_panier_head_tablette').html(data.nbtotal);
					$('#montant_panier_head_mobile').html(data.nbtotal);
				}

			}
		}
	// on ajoute le produit
	RequestAjax.getAjax("/websvc/additem.ws.php?idproduit="+idproduitProd+"&qte="+qteProd+"&nbencaddie="+nbencaddieProd+"&nbstock="+stockProd+"&nocache="+Math.random(),viewResponseProduit);
	// on ajoute la colle
	RequestAjax.getAjax("/websvc/additem.ws.php?idproduit="+idproduitColle+"&qte="+qteColle+"&nbencaddie="+nbencaddieColle+"&nbstock="+stockColle+"&nocache="+Math.random(),viewResponseColle);
	// on ajoute la boite de tri
	RequestAjax.getAjax("/websvc/additem.ws.php?idproduit="+idproduitBdt+"&qte="+qteBdt+"&nbencaddie="+nbencaddieBdt+"&nbstock="+stockBdt+"&nocache="+Math.random(),viewResponseBdt);
	// message ok
	var listeProduit = idproduitProd+','+idproduitColle+','+idproduitBdt;
	$(document).ekkoLightbox({
		remote:'/infos/popup.php?pg=adpGroupe&listeProduit='+listeProduit
	});

}

function addproduitzLotPeintures(idproduitProd,qteProd,nbencaddieProd,stockProd,listePeintures) {


		function viewResponseProduit(response){

			var data = eval('('+response.responseText+')');
			if(data.msgE_stock != null) {
				alert(data.msgE_stock);
			}
			else if(data.msgE_qte != null) {
				alert(data.msgE_qte);
			}
			else{
				if (data.total != null) {
					$('#montant_panier').html(data.total);
					$('#montant_panier_head').html(data.nbtotal);
					$('#montant_panier_head_tablette').html(data.nbtotal);
					$('#montant_panier_head_mobile').html(data.nbtotal);
				}

			}
		}

	// on ajoute le produit
	RequestAjax.getAjax("/websvc/additem.ws.php?idproduit="+idproduitProd+"&qte="+qteProd+"&nbencaddie="+nbencaddieProd+"&nbstock="+stockProd+"&nocache="+Math.random(),viewResponseProduit);
	var listeProduit = idproduitProd;
	if(listePeintures.length>0){
		var peintures = listePeintures.split(';');
		for (var i=0; i<peintures.length;i++) {
			RequestAjax.getAjax("/websvc/additem.ws.php?idproduit="+peintures[i]+"&qte="+1+"&nbencaddie=-1&nbstock=-1&nocache="+Math.random(),viewResponseProduit);
			listeProduit = listeProduit+','+peintures[i];
		}
	}
	// on ajoute les peintures

	//var listeProduit = idproduitProd+','+51212+','+51212+','+51212+','+51212+','+51212+','+51212;
	$(document).ekkoLightbox({
		remote:'/infos/popup.php?pg=adpPeinture&listeProduit='+listeProduit
	});

}

function applicationRemise(idOffre){
	function viewResponseRemisePanier(response){
		$('div.ekko-lightbox button.close').click();
		window.location.href = '/caddie/';
	}

	RequestAjax.getAjax("/websvc/applicationRemiseOffrePanier.ws.php?idoffre="+idOffre+"&nocache="+Math.random(),viewResponseRemisePanier);

}

function addproduitPanierz(idproduit,qte,incart,nbstock,idOffre) {
		function viewResponse(response){

			var data = eval('('+response.responseText+')');
			if(data.msgE_stock != null) {
				alert(data.msgE_stock);
			}
			else if(data.msgE_qte != null) {
				alert(data.msgE_qte);
			}
			else{
				if (data.total != null) {
					$('#montant_panier').html(data.total);
					$('#montant_panier_head').html(data.nbtotal);
					$('#montant_panier_head_tablette').html(data.nbtotal);
					$('#montant_panier_head_mobile').html(data.nbtotal);
				}
				// fermeture popup apercu si exisite
				$('div.ekko-lightbox button.close').click();

				var r = document.location.href;
				if (r.match(new RegExp('/caddie/'))) {

					window.location.href = '/caddie/';

				} else {

					// ouverture popup ajout produit
					$(document).ekkoLightbox({
						remote:'/infos/popup.php?pg=adp&id='+idproduit
					});

				}

			}
		}
	RequestAjax.getAjax("/websvc/additem.ws.php?idproduit="+idproduit+"&qte="+qte+"&nbencaddie="+incart+"&nbstock="+nbstock+"&offrepanier=1&idOffre="+idOffre+"&nocache="+Math.random(),viewResponse);
}

function addproduitzOffreSpeciale(idproduit,qte,incart,nbstock) {
	if (idSite == 2) {
		var $existingProduct = $('#modal-panier .cart-product[data-idproduit="' + idproduit + '"]');
		if ($existingProduct.length > 0) {
			var currentQuantity = parseInt($existingProduct.find('select').val());
			incart = currentQuantity;
		}
	}
	function viewResponseOffreSpeciale(response){

		var data = eval('('+response.responseText+')');
		if (data.msgE_stock != null) {
			if (idSite == 2) {
				showNotificationModal(data.msgE_stock);
			} else {
				alert(data.msgE_stock);
			}
		} else if (data.msgE_qte != null) {
			if (idSite == 2) {
				showNotificationModal(data.msgE_qte);
			} else {
				alert(data.msgE_qte);
			}
		} else {
			if (data.total != null) {
				$('#montant_panier').html(data.total);
				$('#montant_panier_head').html(data.nbtotal);
				$('#montant_panier_head_tablette').html(data.nbtotal);
				$('#montant_panier_head_mobile').html(data.nbtotal);
				if (idSite == 2 && data.nbtotal !== 0) {
					$("#montant_panier_head").addClass('flex');
				}
			}
			// fermeture popup apercu si exisite
			$('div.ekko-lightbox button.close').click();

			var r = document.location.href;
			if (r.match(new RegExp('/caddie/'))) {

				window.location.href = '/caddie/';

			} else {


				if (idSite != 2) {
					// ouverture popup ajout produit
					$(document).ekkoLightbox({
						remote:'/infos/popup.php?pg=adpOffreSpeciale&id='+idproduit
					});
				} else {
					$.notify({
						icon: '',
						title: "",
						message: ""
					}, {
						type: 'minimalist',
						delay: 5000,
						icon_type: 'image',
						template: '<div style="padding:14px;" data-notify="container" class="col-xs-11 col-sm-3 success-message-add-panier" role="success">' +
							'<img data-notify="icon" src="/_themes/puzzlethemes/fr/images/check-circle-add-panier.svg" >' +
							'<span style="color:#035D0C;font-size: 12px;" data-notify="message">C\'est dans la boîte !</span>' +
						'</div>'
					});
					var produit = {
						urlProduit: data.urlProduit,
						image_url: data.image_url,
						indexLigne: data.indexLigne,
						designation: data.designation,
						nbpieces: data.nbpieces,
						marque: data.marque,
						prixclient: data.prixclient,
						prix_membre: data.prix_membre,
						totalProduit: data.total,
						totalPanier: data.totalPanier,
						nb_stock: data.nb_stock
					};
					var isMembre = document.getElementById('isMembre').value === '1';
   				var prix = isMembre ? produit.prix_membre : produit.prixclient;

					var totalProduitDansPanier = parseInt(incart) + parseInt(qte);
					var $productCard = $('.button-add-cart[data-idproduit="' + idproduit + '"]');
					var imageSrc = totalProduitDansPanier > 0 ? '/images/add-to-cart-vide.svg' : '/images/add-to-cart.svg';

					$productCard.find('img').attr('src', imageSrc);

					var $totalProduitCard = $productCard.find('#total-produit-card-' + idproduit);

					if ($totalProduitCard.length === 0) {
							$productCard.append('<span id="total-produit-card-' + idproduit + '" class="total-produit-card"">' + totalProduitDansPanier + '</span>');
					} else {
							$totalProduitCard.html(totalProduitDansPanier);
					}

					$('#total-produit-panier').html(data.nbtotal);
					$('#total-price-panier').html(data.totalPanier.toFixed(2).replace('.', ',') + '€');
					updateCartModal(idproduit, qte, produit, prix);
				}

			}

		}
	}
RequestAjax.getAjax("/websvc/additem.ws.php?idproduit="+idproduit+"&qte="+qte+"&nbencaddie="+incart+"&nbstock="+nbstock+"&nocache="+Math.random(),viewResponseOffreSpeciale);
}

function addproduitzVentePrivee(idproduit,qte,incart,nbstock) {
	function viewResponseVentePrivee(response){

		var data = eval('('+response.responseText+')');
		if(data.msgE_stock != null) {
			alert(data.msgE_stock);
		}
		else if(data.msgE_qte != null) {
			alert(data.msgE_qte);
		}
		else{
			if (data.total != null) {
				$('#montant_panier').html(data.total);
				$('#montant_panier_head').html(data.nbtotal);
				$('#montant_panier_head_tablette').html(data.nbtotal);
				$('#montant_panier_head_mobile').html(data.nbtotal);
			}
			// fermeture popup apercu si exisite
			$('div.ekko-lightbox button.close').click();

			var r = document.location.href;
			if (r.match(new RegExp('/caddie/'))) {

				window.location.href = '/caddie/';

			} else {

				// ouverture popup ajout produit
				$(document).ekkoLightbox({
					remote:'/infos/popup.php?pg=adpVentePrivee&id='+idproduit
				});

			}

		}
	}
RequestAjax.getAjax("/websvc/additem.ws.php?idproduit="+idproduit+"&qte="+qte+"&nbencaddie="+incart+"&nbstock="+nbstock+"&vp="+1+"&nocache="+Math.random(),viewResponseVentePrivee);
}


function adp(idproduit,qte,incart,nbstock) {
		if (idproduit==2203 || idproduit==40543) {
			window.parent.location = '/catalogue/puzzles-personnalises.php';
		} else {
			$.get("/websvc/additem.ws.php?idproduit="+idproduit+"&qte="+qte+"&nbencaddie="+incart+"&nbstock="+nbstock+"&nocache="+Math.random(),function(data) {
				if (data.page != null) { if (data.page != '') {
					$('#s_'+idproduit).show();

					if (data.total != null) {
						$('#montant_panier').html(data.total);
						$('#montant_panier_head').html(data.nbtotal);
						$('#montant_panier_head_tablette').html(data.nbtotal);
						$('#montant_panier_head_mobile').html(data.nbtotal);
					}

					} else { window.parent.location.href = '/caddie/'; }
				 } else {
					window.parent.location.href = '/caddie/';
				 }
			},"json");
		}
}



function pad (str, max) {
				str = str.toString();
				return str.length < max ? pad("0" + str, max) : str;
}

function os_update_chrono(interval) {
				var temps = new Date().valueOf();
				var delta = os_temps.js + os_temps.restant - temps;
				if (delta < 0) { delta = 0; }
				var reste = {h:0,m:0,s:0};
				reste.h = Math.floor(delta / 3600000);
				if (reste.h > 23) {
					reste.j = Math.floor(delta /  (3600000*24));
					reste.h = Math.floor((delta - (reste.j * 3600000 * 24)) / 3600000);
					reste.m = Math.floor((delta - reste.j * 3600000 * 24 - reste.h * 3600000) / 60000);
					reste.s = Math.floor((delta - reste.h * 3600000 - reste.m * 60000 - reste.j * 3600000 * 24) / 1000);
					$('#os_chrono_count').html(reste.j+local_chrono_day+' '+pad(reste.h,2)+':'+pad(reste.m,2)+':'+pad(reste.s,2));
				} else {
					reste.m = Math.floor((delta - reste.h * 3600000) / 60000);
					reste.s = Math.floor((delta - reste.h * 3600000 - reste.m * 60000) / 1000);
					$('#os_chrono_count').html(pad(reste.h,2)+':'+pad(reste.m,2)+':'+pad(reste.s,2));
				}
				if (interval==1) {
					setInterval("os_update_chrono(0)",1000);
				}
}
	// a partir de 1030 px on envoi vers coeurtablette
	// a partir de 542 px on envoi vers coeurmobile
	// sinon vers coeur
	var idcoeur = "#coeur";
	var idhead = "#head_a_maliste";
	if (idSite != 2) {
		if (  window.innerWidth < '1050' && window.innerWidth > '540'){
			 idcoeur = "#coeurtablette";
			 idhead = "#head_a_maliste_tablette";
		}else if(window.innerWidth < '540'){
			 idcoeur = "#coeurmobile";
			 idhead = "#head_a_maliste_mobile";
		}else if(window.innerWidth > '1050'){
			 idcoeur = "#coeur";
			 idhead = "#head_a_maliste";
		}else{
			 idcoeur = "#coeur";
			 idhead = "#head_a_maliste";
		}

		$( window ).resize(function() {

			if (  window.innerWidth < '1050' && window.innerWidth > '540'){
				 idcoeur = "#coeurtablette";
				 idhead = "#head_a_maliste_tablette";
			}else if(window.innerWidth < '540'){
				 idcoeur = "#coeurmobile";
				 idhead = "#head_a_maliste_mobile";
			}else if(window.innerWidth > '1050'){
				 idcoeur = "#coeur";
				 idhead = "#head_a_maliste";
			}else{
				 idcoeur = "#coeur";
				 idhead = "#head_a_maliste";
			}

		});
	} else {
		if (  window.innerWidth < '991px'){
			idcoeur = "#coeurmobile";
			idhead = "#head_a_maliste_mobile";
		}
		$( window ).resize(function() {
			if (  window.innerWidth < '991px'){
				idcoeur = "#coeurmobile";
				idhead = "#head_a_maliste_mobile";
			}
		});
	}

	// etape 2

	function initMap() {

		if(!mapLoad){
					if(typeof google != 'undefined'){

						var t_dftopt 		= { mapTypeId	: google.maps.MapTypeId.ROADMAP };
						map 			= 	new google.maps.Map(document.getElementById("mapPOI"),t_dftopt); // Instantiation de la map
						var addr			= 	initmap_addr;

						loadMap(map,addr);
						mapLoad = true;
					}
		}
	}

	function initMapBE() {

		if(!mapLoad){
					if(typeof google != 'undefined'){

						var t_dftopt 		= { mapTypeId	: google.maps.MapTypeId.ROADMAP };
						map 			= 	new google.maps.Map(document.getElementById("mapPOI"),t_dftopt); // Instantiation de la map
						var addr			= 	initmap_addr;

						loadMapBE(map,addr);
						mapLoad = true;
					}
		}
	}

	function initMapDE() {


		if(!mapLoad){

					if(typeof google != 'undefined'){

						var t_dftopt 		= { mapTypeId	: google.maps.MapTypeId.ROADMAP };

						map 			= 	new google.maps.Map(document.getElementById("mapPOI"),t_dftopt); // Instantiation de la map
						var addr			= 	initmap_addr;

						loadMapDE(map,addr);
						mapLoad = true;
					}
		}
	}


	function showSuivi() { $('#d_sms').show(); }
	function hideSuivi() { $('#d_sms').hide(); }

	function tstportable() {
					var tel = $('#input_portable_destinataire').val();
					var reg = new RegExp('[^0-9]','g');
					$('#input_portable_destinataire').val(tel.replace(reg,''));
					var reg = new RegExp('^(06|07)([0-9]{8})$','g');
					tel = $('#input_portable_destinataire').val();
					if (!reg.test(tel)) { return true; }
					return false;
	}



$(function(){

	if (document.getElementById('idSite')){
			var idSite = document.getElementById('idSite').value;
	}else{
			var idSite = 0;
	}

	/*$('input.radio_pp_format').click(function() {
		document.location.href = $(this).data('href');
	});*/

	$('#next_etape_choix_pp').click(function() {
		var lien = $('input[type=radio][name=foo]:checked').attr('data-lien');
		if (lien === undefined || lien === null) {
			alert(local_selection_modele_pp);
		}else{
			document.location.href = lien;
		}

	});


	// placement de la suggestion de la recherche
	if (document.getElementById("input_search")){

		var p_search = $('#input_search').offset();
		var t_search = $(this).offset();

		var delta = 30;
		if (idSite==11) delta = 50;
		var top = p_search.top + delta;
		var left = p_search.left;

		var width = document.getElementById('input_search').offsetWidth;


		// document.getElementById('divautosuggest').style.left = left+'px';
		// document.getElementById('divautosuggest').style.top  = top+'px';
		// document.getElementById('divautosuggest').style.width  = width+'px';

		$( window ).resize(function() {
			var p_search = $('#input_search').offset();
			var t_search = $(this).offset();

			var top = p_search.top + 30;
			var left = p_search.left;

			var width = document.getElementById('input_search').offsetWidth;

			// document.getElementById('divautosuggest').style.left = left+'px';
			// document.getElementById('divautosuggest').style.top  = top+'px';
			// document.getElementById('divautosuggest').style.width  = width+'px';

		});

	}

	$('.highlight').click(function(){ $(this).find(':radio').attr('checked','checked'); });

	$('.img_info').on('mouseenter',function(){
		$(this).parent().find('.infobulle').show();
	}).on('mouseleave',function(){
		$(this).parent().find('.infobulle').hide();
	});

	$('input.clean').on('keyup keydown',function(){
		var regex = new RegExp('^(.+) (.+)','g');
		var str   = $(this).val();
		str = str.replace(new RegExp('[\\\\/\$\<\>\"\%\#\;\|\{\}]','g'),"");
		$(this).val(str);
	});

	$('input.comma').bind('keyup keydown',function(){
		var str = $(this).val();
		str = str.replace(';',',');
		$(this).val(str);
	});

	$('#HeaderContent .Panier').on('mouseenter',function() {
		$('#HeaderContent .EspaceClientPanier .global').stop(true,true);
		$('#HeaderContent .EspaceClientPanier .global').fadeIn(200);
	});
	$('#HeaderContent .EspaceClientPanier').on('mouseleave',function() {
		$('#HeaderContent .EspaceClientPanier .global').stop(true,true);
		$('#HeaderContent .EspaceClientPanier .global').fadeOut(200);
	});

	$('#select-pays').on('mouseenter',function() {
		$('#choix-pays').stop(true,true);
		$('#choix-pays').fadeIn(200);
	});
	$('#select-pays').on('mouseleave',function() {
		$('#choix-pays').stop(true,true);
		$('#choix-pays').fadeOut(200);
	});

	$('#select-pays-footer').on('mouseenter',function() {
		$('#choix-pays-footer').stop(true,true);
		$('#choix-pays-footer').fadeIn(200);
	});
	$('#select-pays-footer').on('mouseleave',function() {
		$('#choix-pays-footer').stop(true,true);
		$('#choix-pays-footer').fadeOut(200);
	});

	$('#select-pays-footer-mobile').on('mouseenter',function() {
		$('#choix-pays-footer-mobile').stop(true,true);
		$('#choix-pays-footer-mobile').fadeIn(200);
	});
	$('#select-pays-footer-mobile').on('mouseleave',function() {
		$('#choix-pays-footer-mobile').stop(true,true);
		$('#choix-pays-footer-mobile').fadeOut(200);
	});

	$('#filtre_prix_valide').bind('click',function() {
		var str = $(this).attr('data-rel');
		str = str.replace('VPMIN',Math.floor($( "#filtre_prix_slider" ).slider( "values", 0 )));
		str = str.replace('VPMAX',Math.ceil($( "#filtre_prix_slider" ).slider( "values", 1 )));
		window.location.href = str;
	});

	$('#filtre_prix_valide_mobile').bind('click',function() {
		var str = $(this).attr('data-rel');
		str = str.replace('VPMIN',Math.floor($( "#filtre_prix_slider_mobile" ).slider( "values", 0 )));
		str = str.replace('VPMAX',Math.ceil($( "#filtre_prix_slider_mobile" ).slider( "values", 1 )));
		window.location.href = str;
	});

	if (idSite==2) {
		$.each($('.container_filtre_search input'), function(a, b) {
			$(b).bind('keypress keydown keyup', function() {
					var t = $(this).attr('name');
					var c = AccentToNoAccent($(this).val());
					c = c.replace(/ /g, '').toLowerCase();
					var len = c.length;
					var no = true;
					if (/[^\w\s]/.test(c)) {
						$('#cf_' + t + '_list a').hide();
						$('#cf_' + t + '_list input').closest('label').hide();
						$('#cf_' + t + '_list span.no').show();
						return;
					}

					if (len === 0) {
							// Si le champ de recherche est vide, réaffichez tous les éléments
							$('#cf_' + t + '_list a').show();
							$('#cf_' + t + '_list input').closest('label').show();
							$('#cf_' + t + '_list span.no').hide();
							return;
					}

					var rg = new RegExp(c);

					$.each($('#cf_' + t + '_list a, #cf_' + t + '_list label'), function(k, v) {
							var s = $(v).text().replace(/ /g, '').toLowerCase();
							if (s.match(rg) == null) {
									$(v).hide();
							} else {
									$(v).show();
									no = false;
							}
					});

					if (no) {
							$('#cf_' + t + '_list span.no').show();
					} else {
							$('#cf_' + t + '_list span.no').hide();
					}
			});
		});
	} else {
		$.each($('.container_filtre_search input'),function(a,b) {
			$(b).bind('keypress keydown keyup',function() {

				var t = $(this).attr('name');
				var c = AccentToNoAccent($(this).val());
				c = c.replace(/ /g,'').toLowerCase();
				var len = c.length;
				var s = '';
				var rg = new RegExp('cf_'+t+'_([0-9]+)_(.*)'+c+'(.*)');
				var rg2= new RegExp('cf_'+t+'_([0-9]+)_'+c+'(.*)');
				var no = true;
				$.each($('#cf_'+t+'_list a'),function(k,v) {
						s = $(v).attr('id');
						if (s.match(rg) == null && len>0) {	$(v).hide(); } else {
							if (len>0 && s.match(rg2) != null) { $(v).prependTo('#cf_'+t+'_list'); }
							$(v).show(); no=false;
						}
				});
				if (no) { $('#cf_'+t+'_list span.no').show(); } else { $('#cf_'+t+'_list span.no').hide(); }
			});
		});
	}


	$('form.js_form').submit(function() { return js_form($(this)); });

	$(document).on('click','#alerte_valider',function() {

		var mail 	= $('#alerte_email').val();
		mail 		= mail.toLowerCase();
		$('#alerte_email').val(mail);
		var regex 		= /^[a-z0-9\_]+((-[a-z0-9\_]+)|(\.[a-z0-9\_]+)|(\_[a-z0-9]+))*\@[a-z0-9]+((\.|-)[a-z0-9]+)*\.[a-z]{2,6}$/;
		if(mail.length < 1 || !regex.test(mail)){
			$('#alerte_email').css('border','solid 1px #f00');
		}else{
			$.post('/websvc/alerte_nouveaute.ws.php',{type:$('#alerte_type').val(),id:$('#alerte_id').val(),email:$('#alerte_email').val(),puzzle_enfant:$('#alerte_puzzle_enfant').prop('checked') ? 1:0,puzzle_adulte:$('#alerte_puzzle_adulte').prop('checked') ? 1:0},function(retour) {
				$('#div_alert_inscription').hide();
				$('#div_alert_termine').fadeIn(500);
			},'json');
		}

	});

	$(document).on('click','#alerte_nouveaute_fermer',function() {
		$('div.ekko-lightbox button.close').click();
	});

	$(".jsPlImage").mouseenter( function() {
			$('#jsPl_'+$(this).attr('rel')).show();
			$('#jsPl_'+$(this).attr('rel')).mouseout( function() {
				$(this).hide();
			});
	});

	$('#nextetape').click(function(){

			if (idSite==2 || idSite==5 || idSite==9 || idSite==11){
				if(!document.getElementById('cgv').checked){
					$('#errCgv').css({ 'display' : 'inline'});
					if (idSite != 2){
						alert(localCGV);
					}
					return false;
				}
			}
			if (idSite==2) {
				$.ajax({
					url: '/websvc/check_connection.ws.php',
					method: 'GET',
					success: function(response) {
							if (response.connected) {
									window.location.href = '/caddie/?pg=etape2';
							} else {
								openModal();
							}
					}
				});
			} else {
				window.location.href='/caddie/?pg=etape2';
			}
			return true;
	});


	$("div.cubecoeur").bind('click',function() {
	if ($(this).data('site')==11) {
		var i = $(this).children();
		clic_cubecoeur_fdp(i);
		return;
	}

	var type = $(this).attr('data-rel');
	var pg = $(this).attr('data-pg');


	if (typeof type != "undefined") { // si on est sur la fiche produit
		var btn_prod_oui = "/_themes/puzzlethemes/fr/images/btn-ajout-liste2.jpg";
		var btn_prod_non = "/_themes/puzzlethemes/fr/images/btn-ajout-liste.jpg";
		if (idSite==2) {
			var btn_survol = "/_themes/puzzlethemes/fr/images/heart_icon_red.svg";
		} else {
			var btn_survol = "/_themes/puzzlethemes/fr/images/etoile.png";
		}
	}else{ // si on est sur le reste du site
		if (idSite==2) {
			var btn_prod_oui = "/_themes/puzzlethemes/fr/images/heart_icon_red.svg";
			var btn_prod_non = "/_themes/puzzlethemes/fr/images/heart_icon.svg";
			var btn_survol = "/_themes/puzzlethemes/fr/images/heart_icon_red.svg";
		} else {
			var btn_prod_oui = "/_themes/puzzlethemes/fr/images/etoile.png";
			var btn_prod_non = "/_themes/puzzlethemes/fr/images/etoile_gris.png";
			var btn_survol = "/_themes/puzzlethemes/fr/images/etoile.png";
		}
		if (idSite==24 && pg != "maliste") { // puzzle-online
			 btn_prod_oui = "/images-puzzle-online/btn_merkliste.png";
			 btn_prod_non = "/images-puzzle-online/btn_merkliste2.png";
			 btn_survol = "/_themes/puzzlethemes/fr/images/etoile.png";

		}
	}

	//if (typeof type != "undefined") {
	// sur la fiche produit
		var i = $(this).children();
		if (i.attr('src')==btn_prod_oui) {
			i.attr('src',btn_prod_non);
			var title = local_title_coeur_gris;
			i.attr('title',title);
			i.attr('alt',title);

			if (idhead == "#head_a_maliste"){
				if (idSite!=2) {
					var a = $(idhead).html();
					var t = a.split('(');
					var tt = parseInt(t[1].split(')')[0])-1;
					$(idhead).html(t[0]+'('+tt+')');
				} else {
					var a = $(".nbWishList").html();
					var tt = parseInt(a)-1;
					if (tt !== 0) {
						$(".nbWishList").addClass('flex');
					} else {
						$(".nbWishList").removeClass('flex');
					}
					$(".nbWishList").html(tt);
				}
			}else if (idhead == "#head_a_maliste_tablette"){
				var a = $(idhead).html();
				var tt = parseInt(a)-1;
				$(idhead).html(tt);
			}else if (idhead == "#head_a_maliste_mobile"){
				var a = $(idhead).html();
				var tt = parseInt(a)-1;
				$(idhead).html(tt);
			}


			$.post('/websvc/maliste.ws.php',{del:1,id:i.attr('data-rel')},function(data){

					},'json');
		} else {
			if (idSite!=2) {
				i.attr('src',btn_prod_oui);
				var title = local_title_coeur_rouge;
				i.attr('title',title);
				i.attr('alt',title);
				if ($(idcoeur).css('display')!='none') {
					var p = $(idcoeur).offset();
					var t = $(this).offset();
					var dt = t.top - p.top;
					var dl = t.left - p.left;
					var icoeur = $('<img src="'+btn_survol+'" width="15" height="19" id="icoeur"/>');
					$('body').append(icoeur);
					icoeur.css('position','absolute').css('top',t.top).css('left',t.left).css('z-index','1200');
				}

				if (idhead == "#head_a_maliste"){
					var a = $(idhead).html();
					var t = a.split('(');
					var tt = parseInt(t[1].split(')')[0])+1;
					$(idhead).html(t[0]+'('+tt+')');
				}else if (idhead == "#head_a_maliste_tablette"){
					var a = $(idhead).html();
					var tt = parseInt(a)+1;
					$(idhead).html(tt);
				}else if (idhead == "#head_a_maliste_mobile"){
					var a = $(idhead).html();
					var tt = parseInt(a)+1;
					$(idhead).html(tt);
				}
				$.post('/websvc/maliste.ws.php',{add:1,id:i.attr('data-rel')},function(data){

						},'json');
				icoeur.animate({top: "-="+dt,left: "-="+dl}, 800, 'swing', function() {
					icoeur.remove();

				});
			} else {
				i.attr('src',btn_prod_oui);
				var title = local_title_coeur_rouge;
				i.attr('title',title);
				i.attr('alt',title);
				if ($(idcoeur).css('display')!='none') {
					var p = $(idcoeur).offset();
					var t = $(this).offset();
					var dt = t.top - p.top;
					var dl = t.left - p.left;
					var icoeur = $('<img src="'+btn_survol+'" width="15" height="19" id="idcoeur"/>');
					$('body').append(icoeur);
					icoeur.css('position','absolute').css('top',t.top).css('left',t.left).css('z-index','1200');
				}

				if (idhead == "#head_a_maliste"){
					var a = $(".nbWishList").html();
					var tt = parseInt(a)+1;
					if (tt !== 0) {
						$(".nbWishList").addClass('flex');
					} else {
						$(".nbWishList").removeClass('flex');
					}
					$(".nbWishList").html(tt);
				}else if (idhead == "#head_a_maliste_tablette"){
					var a = $(idhead).html();
					var tt = parseInt(a)+1;
					$(idhead).html(tt);
				}else if (idhead == "#head_a_maliste_mobile"){
					var a = $(idhead).html();
					var tt = parseInt(a)+1;
					$(idhead).html(tt);
				}

				$.post('/websvc/maliste.ws.php',{add:1,id:i.attr('data-rel')},function(data){

						},'json');
				icoeur.animate({top: "-="+dt,left: "-="+dl}, 800, 'swing', function() {
					icoeur.remove();

				});
			}
		}

	});


	$("div.cubecoeur_fdp").bind('click',function() {
	var i = $(this).children();
	clic_cubecoeur_fdp(i);

});




	// etape 3

	$('.infosPaiement').hide();
	$('#infosPaiement9').show();
	$('input[name="mode_paiement"]').bind('click',function(){
		var id = $(this).val();

		$('.infosPaiement').hide();
		$('#infosPaiement' + id).show();
	});

	$('#etape3submit').click(function() {
		$(this).hide();
		$(this).parents('form').submit();
	});

	// etape 2

	if ($('#f_etape2').length) {

			$('#norue,#norue2').bind('click',function() {
				if ($(this).prop('checked')) {
					document.location.href = '/caddie/?pg=etape2&norue=1';
				} else {
					document.location.href = '/caddie/?pg=etape2';
				}
			});

			if (typeof mapBE != "undefined") {

				if (mapBE==true) {
					if (typeof geoCheckBE === 'function') {
						geoCheckBE(initmap_addr);
					}
				} else {
					if (livraison_pays=='FRANCE') {
						if (typeof geoCheck === 'function') {
							geoCheck(initmap_addr);
						}
					}
				}
				if (typeof mapDE != "undefined") {
					if (mapDE==true) {
						if (typeof geoCheckDE === 'function') {
							geoCheckDE(initmap_addr);
						}
					}
				}

			} else {

				if (livraison_pays=='FRANCE') {
					if (typeof geoCheck === 'function') {
						geoCheck(initmap_addr);
					}
				}

			}

			$(document).on('change','#choiceAddress',function() {
				$('<div id="dialog-page-load"></div>').appendTo('body');
				$('#dialog-page-load').html('<p style="text-align:center;display:block;color:#000;"><img src="/_themes/puzzlethemes/fr/images/ajax-loader.gif"/><br/>'+local_wait+'</p>');
				$.colorbox({inline:true, transition:'none', href:'#dialog-page-load', closeButton:false, width:"50%", height:"150"});
				if (idSite != 2) {
					$(this).closest('form').submit();
				} else {
						var selectedAddress = $(this).val();
						$('#hiddenChoiceAddress').val(selectedAddress);
						$('#formSelectChoiceAdresse').submit();
				}
			});

			$(document).on('click','.btAddressCaddie',function(){
				var obj = $(this);
				var _id;
				var _ca;
				if (obj.attr('id')) {
					_id = parseInt(obj.attr('id').split('_')[1]);
				}
				if (obj.attr('rel')) {
					_ca = parseInt(obj.attr('rel'));
				}

				// on cache le bouton ajouter adresse
				$("#btAddressCaddie").hide();


				$.post('../websvc/etape2_coordonnees.ws.php',{ id : _id, ca : _ca },function(data){
					if (idSite != 2) {$('#f_ml').hide();}
					$('#ad-adresse-livr').fadeOut(200,function(){
						if (idSite == 2) {
							$(data).prependTo('#adresse-livr .bloc-ad-pan');
						} else {
							$(data).prependTo('#adresse-livr');
						}
						$('#adresse-livr').find('input[type="text"]').first().focus();
					});
				});
			});


			$(document).on('click','#buttonCancel',function(){

				$('#ajaxAddress').fadeOut(200,function(){

					if (idSite != 2) {$('#f_ml').hide();}
					$('#ad-adresse-livr').fadeIn(150);

					$(this).remove();

					// on affiche le bouton ajouter adresse
					$("#btAddressCaddie").toggle();
					$('.btAddressCaddie').focus();

				});
			});

			$(document).on('click','#submitInscription',function() {
				f = $(this).parents('form');
				f.submit();
			});

			$(document).on('click keydown', 'input[name="z_mode_livraison"]', function (event) {
				if (event.type === 'click' || event.key === 'Enter') {
					$('input[name="mode_livraison"]').prop('checked', false);
					$('#divPOI').fadeIn(250);
					$('#portable_destinataire').show();
					reloadCarrousel(POIs);
					showSuivi();
				}
			});

			$(document).on('click keydown', 'input[name="mode_livraison"]', function (event) {
				if (event.type === 'click' || event.key === 'Enter') {
					if (!$(this).hasClass('POI_radio')) {
						$('input[name="z_mode_livraison"]').prop('checked', false);
					}
					if ($(this).hasClass('portableRequis')) {
						$('#portable_destinataire').show();
					} else {
						$('#divPOI').hide();
						$('#portable_destinataire').show();
						if ($(this).val() != 8 && idSite != 2) {
							$('html, body').animate({
								scrollTop: ($('#f_ml').offset().top - 150)
							}, 200);
						}
					}
					showSuivi();
				}
			});

			$('input.poi').bind('click',function(){
				if (typeof mapBE != "undefined") {
					if (mapBE==true) {
						initMapBE();
					} else {
						if (typeof mapDE != "undefined") {
							if (mapDE==true) {
								initMapDE();
							}
						} else {
								initMap();
						}

					}
				} else {
					if (typeof initMap === 'function') {
						initMap();
					}
				}
			});


			$('.custom-radio').on('keydown', function (event) {
				if (event.key === 'Enter') {
					$(this).find('input.poi').click();
				}
			});

			$('#portable_destinataire').show();


			$('#f_etape2').bind('click',function() {

				if (document.getElementById('idSite')){
						var idSite = document.getElementById('idSite').value;
				}else{
						var idSite = 0;
				}

				//ONLY if this field exists then do the tests
				inputName = 'acceptSupplierMailInfo';
				if($('input[name=' + inputName + ']').length>0) {

					//only alert if we selected a delivery mode
					var deliveryMode = $('input[name=mode_livraison]:checked').val();

					if (deliveryMode != "8" && deliveryMode !== undefined) {
						//then add an even to hide when changed
						$('input[name=' + inputName + ']').bind('change', function() {
							$("#supplierMailInfo_err").hide();

							//remove border
							$("#supplierDiv").css('border', '0');
							$("#supplierDiv").css('padding-top', '0px');
						});

						//then add an even to hide when changed
						$('input[name=mode_livraison]').bind('change', function() {
							$("#supplierMailInfo_err").hide();
						});

						$("#supplierMailInfo_err").html("");
						$("#supplierMailInfo_err").hide();
						var acceptSupplierMailInfo = $('input[name=' + inputName + ']:checked').val();
						if (acceptSupplierMailInfo===undefined) {
							//border
							$("#supplierDiv").css('border', '1px solid rgb(255, 0, 0)');
							$("#supplierDiv").css('padding-top', '7px');
							$("#supplierMailInfo_err").html("- "+ localSupplierMail);
							$("#supplierMailInfo_err").show();
							$('html, body').animate({scrollTop: ($("#supplierMailInfo_err").offset().top-150)},200);
							return false;
						}
					}
				}

				var a = $('input[name=mode_livraison]:checked').val();
				var b = $('input[name=z_mode_livraison]:checked').val();



				$('#cadre_choix_ml_err').html("");
				$('#cadre_choix_ml').css('border','solid 1px #ccc');
				if (a===undefined && b===undefined)  {
					$('#cadre_choix_ml').css('border','solid 1px #f00');
					$('#cadre_choix_ml_err').html(" - "+local_err_mode_liv);
					$('html, body').animate({scrollTop: ($('#f_ml').offset().top-150)},200);
					//alert(local_err_mode_liv);
					return false;
				}

				$('#choixPOI_err').html("");
				$('#choixPOI').css('border','solid 1px #ccc');
				if (a===undefined) {
					$('#choixPOI').css('border','solid 1px #f00');
					$('#choixPOI_err').html(local_err_mode_liv_pr);
					$('html, body').animate({scrollTop: ($('#choixPOI').offset().top-150)},200);
					//alert(local_err_mode_liv_pr);
					return false;
				}




				if (idSite == "10" || idSite == "24"){


					var tel = $('#input_portable_destinataire').val();

					var reg = new RegExp('[^0-9]','g');
					$('#input_portable_destinataire').val(tel.replace(reg,''));
					if (livraison_pays=='FRANCE') {
						var reg = new RegExp('^(06|07)([0-9]{8})$','g');
					} else {
						var reg = new RegExp('^([0-9]{6,})$','g');
					}
					tel = $('#input_portable_destinataire').val();

					$('#portable_destinataire_err').html("");
					$('#input_portable_destinataire').css('border','solid 1px #ccc');
					if (!reg.test(tel)) {
						if (!$('#sans_portable').prop('checked') && !$('#ml8').prop('checked')) {

							$('html, body').animate({scrollTop: ($('#input_portable_destinataire').offset().top-150)},200);
							//alert(local_err_portable_obligatoire);
							//GetElementById("portable_destinataire_err").InnerHTML="Vous devez indiquer un numéro de téléhone portable";
							$('#portable_destinataire_err').html("<br />"+local_err_portable_obligatoire);
							$('#input_portable_destinataire').css('border','solid 1px #f00');
							return false;
						}
					}
				}


				$('#tel_err').html("");
				$('#telsms').css('border','solid 1px #ccc');
				if ($('#suivi_sms').prop('checked')) {
					var reg = new RegExp('[^0-9]','g');
					var tel = $('#telsms').val();
					$('#telsms').val(tel.replace(reg,''));
					if ($('#telsms').val()=='') {
							$('html, body').animate({scrollTop: ($('#telsms').offset().top-150)},200);
							//alert(local_err_portable_obligatoire_suivi);
							$('#tel_err').html(local_err_portable_obligatoire_suivi);
							$('#telsms').css('border','solid 1px #f00');
							return false;
					}
				}
			});

			$('#sans_portable').bind('click',function() {
				if ($('#sans_portable').prop('checked')) {
					$('#input_portable_destinataire').val('');
					$('#suivi_sms').prop('checked',false);
				}
			});

			$('#suivi_sms').bind('change',function() {
				if ($('#suivi_sms').prop('checked')) {
					if ($('#telsms').val()=='') $('#telsms').val($('#input_portable_destinataire').val());
					$('#txt_sms').show();
				}
			});



	}




});


function updateCartModal(idproduit, qte, produit, prix) {
	var $existingProduct = $('#modal-panier .cart-product[data-idproduit="' + idproduit + '"]');

	var $matchedProduct = $existingProduct.filter(function() {
		return parseFloat($existingProduct.data('unitprice')) === parseFloat(prix);
	});

	if ($matchedProduct.length > 0) {
			var $quantitySelect = $existingProduct.find('select');
			var currentQuantity = parseInt($quantitySelect.val());
			var newQuantity = currentQuantity + qte;

			$quantitySelect.val(newQuantity);
			$existingProduct.find('select').attr('data-qte-initial', newQuantity);

			var unitPrice = parseFloat($existingProduct.data('unitprice'));
			var newTotal = unitPrice * newQuantity;

			var $totalLine = $existingProduct.find('#total-ligne-panier');
			$totalLine.text(newTotal.toFixed(2) + ' €');
	} else {
			var productHtml = '<div class="cart-product" data-idproduit="' + idproduit + '" data-unitprice="' + prix + '" style="display: flex;align-items: flex-start;gap: 12px;flex-direction: row;height: 108px;">' +
					'<div style="width:108px;">' +
					'<a href="' + produit.urlProduit + '" title="">' +
					'<img width="108" src="' + produit.image_url + '" alt="' + produit.designation + '" rel="' + idproduit + '" title="' + produit.designation + '" class="img-responsive">' +
					'</a>' +
					'</div>' +
					'<div style="display: flex;flex-direction: column;justify-content: space-between;align-items: flex-start;flex: 1 0 0;align-self: stretch;">' +
					'<div style="display: flex;flex-direction: column;align-items: flex-start;align-self: stretch;">' +
					'<div style="display: flex;justify-content: space-between;align-items: flex-start;align-self: stretch;">' +
					'<span style="color: #292929;font-size: 12px;font-weight: 600;">' + produit.designation + '</span>' +
					'<a title="Supprimer le produit ?" href="javascript:void(0);" onClick="showConfirmationPopup(' + idproduit + ', ' + produit.indexLigne + ')" class="" style="float:right">' +
					'<img width="16" height="16" src="/_themes/puzzlethemes/fr/images/trash-mod.svg" alt="Supprimer" title="Supprimer" style="border:0px;cursor:pointer">' +
					'</a>' +
					'</div>' +
					(produit.nbpieces ? '<span style="color: #292929;font-size: 12px;font-weight: 400;">' + produit.nbpieces + ' pièces</span>' : '') +
					'<span style="color: #292929;font-size: 12px;font-weight:400;font-style: italic;">' + produit.marque + '</span>' +
					'</div>' +
					'<div style="display: flex;align-items: center;justify-content: space-between;gap: 10px;align-self: stretch;">' +
					'<select class="select-product" aria-haspopup="true" aria-expanded="false" onchange="change_qte_select(this)" data-stock="' + produit.nb_stock + '" data-ligne="' + produit.indexLigne + '" data-qte-initial="' + qte + '" style="border-radius: 2px;border: 1px solid var(--Orange, #FF780F);width: 48px; margin: 0;">';

			var maxOptions = Math.min(99, produit.nb_stock);
			for (var i = 0; i < maxOptions; i++) {
					productHtml += '<option value="' + (i + 1) + '" ' + ((i + 1 === qte) ? 'selected' : '') + '>' + (i + 1) + '</option>';
			}


			productHtml += '</select>' +
					'<div><span id="total-ligne-panier" class="total-ligne-panier-' + produit.indexLigne + '" style="font-size: 12px;font-weight: 700;">' + ((prix * qte).toFixed(2).replace('.', ',')) + '€</span></div>' +
					'</div>' +
					'</div>' +
					'</div>' +
					'<div style="height: 1px;border-radius: 1px;background: var(--Smooth-Grey-100, #EFEFEF);"></div>';

			$('#modal-panier #modal-body-products').append(productHtml);
			$('.select-product').select2({
				dropdownAutoWidth: true,
				width: '48px',
				minimumResultsForSearch: Infinity,
				dropdownCss: {
						'max-height': '150px',
						'overflow-y': 'auto'
				},
				dropdownParent: $('#modal-panier')
			});
	}

	var nbproduits = $('#modal-panier .cart-product').length;
	if (nbproduits === 0) {
			$('#modal-body-products').hide();
			$('#modal-body-empty').show();
			$('#modal-footer-total').hide();
			$('.bt-pan-w').text('Continuer mes achats').attr('href', '/');
	} else {
			$('#modal-body-products').show();
			$('#modal-body-empty').hide();
			$('#modal-footer-total').show();
			$('.bt-pan-w').text('Valider mon panier').attr('href', '/caddie/');
			var total = 0;
			$('#modal-panier .cart-product').each(function() {
					total += parseFloat($(this).find('#total-ligne-panier').text().replace(' €', ''));
			});
	}
}



document.addEventListener('DOMContentLoaded', function () {
  var deleteLinks = document.querySelectorAll('#delete-cart');
  deleteLinks.forEach(function(link) {
    link.addEventListener('click', function(event) {
      event.preventDefault();

      var url = this.href;
      showConfirmationModal(url);
    });
  });
});


function showConfirmationModal(url) {
	lastFocusedElement = document.activeElement;

	var modalPopUp = document.getElementById('confirmation-popup');
	modalPopUp.style.display = 'flex';
	document.getElementById('popup-background').style.display = 'block';

	document.getElementById('confirm-delete').focus();
	document.getElementById('confirm-delete').onclick = function() {
			window.location.href = url;
	};
	document.getElementById('cancel-delete').onclick = closeConfirmationPopup;
	restoreBackgroundElements()
	disableBackgroundElements(modalPopUp);
	trapFocusModal(modalPopUp);
}


function removeProductFromCart(idproduit) {

	dialogAttente();
  $.ajax({
    url: '/websvc/delitem.ws.php',
    method: 'POST',
    data: { idproduit: idproduit },
    success: function(response) {
      var data = JSON.parse(response);

      if (data.success) {
        var $product = $('#modal-panier .cart-product[data-idproduit="' + idproduit + '"]');
				$product.next('div').remove();
				$product.remove();
				closeDialogAttente();

				$('#total-price-panier').html(data.soustotalpanier);

				var nbproduits = $('#modal-panier .cart-product').length;
        $('#montant_panier_head').html(data.nbtotal);

        var $productCard = $('.button-add-cart[data-idproduit="' + idproduit + '"]');
        $productCard.find('img').attr('src', '/images/add-to-cart.svg');

        var $totalProduitCard = $productCard.find('#total-produit-card-' + idproduit);
        if ($totalProduitCard.length > 0) {
          $totalProduitCard.remove();
        }

				if (nbproduits === 0) {
					$('#total-produit-panier').html('');
					$('#modal-body-products').hide();
					$('#modal-body-empty').show();
					$('#modal-footer-total').hide();
					$('.bt-pan-w').text('Continuer mes achats').attr('href', '/');
					$("#montant_panier_head").removeClass('flex');
				} else {
					$('#total-produit-panier').html(data.nbtotal);
					$("#montant_panier_head").addClass('flex');
				}
      }
    },
    error: function(error) {
      alert('Erreur lors de la requête. Veuillez réessayer.');
    }
  });
}

function showConfirmationPopup(idproduit) {
	var modalPopUp = document.getElementById('confirmation-popup');
	var modalPanier = document.getElementById('modal-panier');

  modalPopUp.style.display = 'flex';
  document.getElementById('popup-background').style.display = 'block';

	restoreBackgroundElements()
	disableBackgroundElements(modalPopUp);

  document.getElementById('confirm-delete').onclick = function() {
    removeProductFromCart(idproduit);
    closeConfirmationPopup();
		disableBackgroundElements(modalPanier);
		trapFocusModal(modalPanier);
  };
  document.getElementById('cancel-delete').onclick = function() {
    closeConfirmationPopup();
		disableBackgroundElements(modalPanier);
		trapFocusModal(modalPanier);
  };
}

function closeConfirmationPopup() {
  document.getElementById('confirmation-popup').style.display = 'none';
  document.getElementById('popup-background').style.display = 'none';
	restoreBackgroundElements()
	if (lastFocusedElement) {
		lastFocusedElement.focus();
	}
}



var nbproduits = $('#modal-panier .cart-product').length;
if (nbproduits === 0) {
	$('#modal-body-products').hide();
	$('#modal-body-empty').show();
	$('#modal-footer-total').hide();
	$('.bt-pan-w').text('Continuer mes achats').attr('href', '/');
} else {
	$('#modal-body-products').show();
	$('#modal-body-empty').hide();
	$('#modal-footer-total').show();
	$('.bt-pan-w').text('Valider mon panier').attr('href', '/caddie/');
}

$(document).ready(function() {
		var a = $(".nbWishList").html();
		var tt = parseInt(a);
		if (tt !== 0) {
			$(".nbWishList").addClass('flex');
		}
});

$(document).ready(function() {
	var b = $(".nbPanier").html();
	var bb = parseInt(b);
	if (bb !== 0) {
		$(".nbPanier").addClass('flex');
	}
});
