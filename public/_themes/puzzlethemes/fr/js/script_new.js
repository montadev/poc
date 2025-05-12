///////////////////////////////////////////////////////////////////////////////////////
//specialement pour ie (function bind)
if (!Function.prototype.bind) {
  Function.prototype.bind = function(oThis) {
    if (typeof this !== 'function') {
      // closest thing possible to the ECMAScript 5
      // internal IsCallable function
      throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
    }

    var aArgs   = Array.prototype.slice.call(arguments, 1),
        fToBind = this,
        fNOP    = function() {},
        fBound  = function() {
          return fToBind.apply(this instanceof fNOP
                 ? this
                 : oThis,
                 aArgs.concat(Array.prototype.slice.call(arguments)));
        };

    fNOP.prototype = this.prototype;
    fBound.prototype = new fNOP();

    return fBound;
  };
}
///////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////
//gestion du compte a rebourd pour l'offre flash
function Rebour() {
	var date1 = new Date();
	var date2 = new Date ($('#dateFinOffre').val());

	var sec = (date2 - date1) / 1000;
	var n = 24 * 3600;
	if (sec > 0) {
	j = Math.floor (sec / n);
	h = Math.floor ((sec - (j * n)) / 3600);
	mn = Math.floor ((sec - ((j * n + h * 3600))) / 60);
	sec = Math.floor (sec - ((j * n + h * 3600 + mn * 60)));
	var Affiche=document.getElementById("Compte");
	var AfficheMini=document.getElementById("CompteMini");
	var AfficheMobile=document.getElementById("CompteMobile");
	/*if (j>0){
		h = h + j*24;
	}*/

	if (sec>=0 && sec <=9){
		sec = "0"+sec;
	}
	if (mn>=0 && mn <=9){
		mn = "0"+mn;
	}
	if (j==0){
		if (h==0){
			Affiche.innerHTML = mn + local_min + sec + local_s;
			AfficheMini.innerHTML = mn + local_min + sec + local_s;
			AfficheMobile.innerHTML = mn + local_min + sec + local_s;
		}else{
			Affiche.innerHTML = h + local_h + mn + local_min + sec + local_s;
			AfficheMini.innerHTML = h + local_h + mn + local_min + sec + local_s;
			AfficheMobile.innerHTML = h + local_h + mn + local_min + sec + local_s;
		}

	} else {

			Affiche.innerHTML = j + local_j + h + local_h + mn + local_min + sec + local_s;
			AfficheMini.innerHTML = j + local_j + h + local_h + mn + local_min + sec + local_s;
			AfficheMobile.innerHTML = j + local_j + h + local_h + mn + local_min + sec + local_s;


	}


	}
	/*if (sec==0){
		$.get("/websvc/vente_flash.ws.php", function (result) {
			$('#load_donnees').html(result);
		});
		setTimeout (Rebour, 1000);
	}else{*/
		setTimeout (Rebour, 1000);
	//}
}
///////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////
//gestion du compte a rebourd pour les produits
function Rebour_commande_produit(){
	if (document.getElementById("CompteurCommande")){
		var date1 = new Date();
		var date2 = new Date ($('#dateCommanderLeAvant').val());

		var sec = (date2 - date1) / 1000;
		var n = 24 * 3600;
		if (sec > 0) {
		j = Math.floor (sec / n);
		h = Math.floor ((sec - (j * n)) / 3600);
		mn = Math.floor ((sec - ((j * n + h * 3600))) / 60);
		sec = Math.floor (sec - ((j * n + h * 3600 + mn * 60)));
		var Affiche=document.getElementById("CompteurCommande");
		if (j>0){
			h = h + j*24;
		}

		if (sec>=0 && sec <=9){
			sec = "0"+sec;
		}
		if (mn>=0 && mn <=9){
			mn = "0"+mn;
		}

		if (h==0){
			if (mn==1){
					Affiche.innerHTML = mn +" minute";
			}else{
					Affiche.innerHTML = mn +" minutes";
			}

		}else{
			if (mn==1){
				if (h==1){
						Affiche.innerHTML = h +" heure et "+ mn +" minute";
				}else{
						Affiche.innerHTML = h +" heures et "+ mn +" minute";
				}

			}else{
				if (h==1){
						Affiche.innerHTML = h +" heure et "+ mn +" minutes";
				}else{
						Affiche.innerHTML = h +" heures et "+ mn +" minutes";
				}

			}

		}

		}
		setTimeout (Rebour_commande_produit, 1000);
	}
}
///////////////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////////////
//appel au différentes fonctions
jQuery(function($){

	if (document.getElementById('idSite')){
			var idSite = document.getElementById('idSite').value;
	}else{
			var idSite = 0;
	}

	if (idSite==2 || idSite==10 || idSite==5 || idSite==9 || idSite==4 ){
		// Lancement du compte à rebours au chargement de la page
		Rebour();
	}

	if (idSite==2 || idSite==31){
		// Lancement du compte à rebours au chargement de la page
		Rebour_commande_produit();

		// gestion du select pour le choix des pays
		$("#select-pays").on("mouseenter",function(){
			$("#choix-pays").stop(!0,!0);
			$("#choix-pays").fadeIn(200)
		});
		$("#select-pays").on("mouseleave",function(){
			$("#choix-pays").stop(!0,!0);
			$("#choix-pays").fadeOut(200)
		});
	}



	// gestion du autocomplete des champs des formulaires (desactivé)
	$('form,input,select,textarea').attr("autocomplete", "off");

	// Gestion des popups
	$(document).delegate('*[data-toggle="lightbox"]', 'click', function(event) {
		event.preventDefault();
		$(this).ekkoLightbox();
	});

	// Gestion de la popup offre speciale -> redirection panier
	$(document).delegate('*[data-toggle="lightboxPanier"]', 'click', function(event) {
		event.preventDefault();
		return $(this).ekkoLightbox({
						onHide: function() {
							window.location.href = '/caddie/';
						}
					});


	});

	// gestion du scroll (retour en haut)
	$(document).on( 'scroll', function(){
		if ($(window).scrollTop() > 100) {
			$('.scroll-top-wrapper').addClass('show');
		} else {
			$('.scroll-top-wrapper').removeClass('show');
		}

		/*if (idSite == 11) {
			if ($(window).scrollTop() > 75) {
				$('.panier-chache').show();
			} else {
				$('.panier-chache').hide();
			}
		}*/
	});
	$('.scroll-top-wrapper').on('click', scrollToTop);

	// colorbox images vignette produits
	$(".box-produit-vignette").colorbox({rel:'box-produit-vignette', maxWidth:'95%', maxHeight:'95%',title:false,current:false, href: function() {
            var $element = $.colorbox.element();
			return $element.data('ref');
        }
	});
	// colorbox images normale produits
	$(".box-produit-image").colorbox({rel:'box-produit-vignette', maxWidth:'95%', maxHeight:'95%',title:false,current:false,href: function() {
			var $element = $('.box-produit-vignette:first');
			return $element.data('ref');
        }
	});
	// colorbox vidéo produits
	$(".box-produit-video").colorbox({maxWidth:'95%', maxHeight:'95%', href: function() {
            var $element = $.colorbox.element();
			return $element.data('ref');
        }
	});

	// colorbox générique
	$('.click-open-dialog').click(function(){
		$.colorbox({width:$(this).data('width'),height:$(this).data('height'),href:$(this).data('url'),iframe:$(this).data('iframe')});
	});

	// gestion du slider principale de la page accueil
	/*$('.variable-width').slick({
		  dots: true,
		  infinite: true,
		  speed: 300,
		  slidesToShow: 1,
		  centerMode: true,
		  variableWidth: true
	});	*/

	// gestion du slider des offres panier
	$('.slider_panier').slick({
		  dots: false,
		  infinite: true,
		  autoplay: true,
		  autoplaySpeed: 3000,
		  speed: 500,
		  fade: true,
		  arrows:true
	});

	// gestion du slider principale de la page pp
	$('.responsive_wrapper_pp').slick({
		  dots: true,
		  infinite: true,
		  slidesToShow: 1,
		  slidesToScroll: 1,
		  autoplay: true,
		  autoplaySpeed: 6000,
		  speed: 1200,
		  fade: true,
		  arrows:false
	});

	// gestion du slider principale de la page accueil
	$('.responsive_wrapper').slick({
		  dots: true,
		  infinite: true,
		  slidesToShow: 1,
		  slidesToScroll: 1,
		  autoplay: true,
		  autoplaySpeed: 5000,
		  speed: 500,
		  fade: true,
		  arrows:false
	});

	// gestion du slider principale de la page accueil
	$('.responsive_bandeau_web').slick({
		  dots: false,
		  infinite: true,
		  slidesToShow: 1,
		  slidesToScroll: 1,
		  autoplay: true,
		  autoplaySpeed: 3000,
		  speed: 1000,
		  fade: true,
		  arrows:false
	});
	// gestion du slider principale de la page accueil
	$('.responsive_bandeau_mobile').slick({
		  dots: false,
		  infinite: true,
		  slidesToShow: 1,
		  slidesToScroll: 1,
		  autoplay: true,
		  autoplaySpeed: 3000,
		  speed: 1000,
		  fade: true,
		  arrows:false
	});

	// gestion du diaporama des marques
	$('.responsive_marque').slick({
		  dots: false,
		  infinite: true,
		  speed: 300,
		  slidesToShow: 4,
		  slidesToScroll: 4,
		  responsive: [
			{
			  breakpoint: 1200,
			  settings: {
				slidesToShow: 3,
				slidesToScroll: 3
			  }
			},
			{
			  breakpoint: 1024,
			  settings: {
				slidesToShow: 2,
				slidesToScroll: 2
			  }
			},
			{
			  breakpoint: 480,
			  settings: {
				slidesToShow: 1,
				slidesToScroll: 1
			  }
			}
		  ]
	});

	// gestion du diaporama des PP
	$('.responsive_pp').slick({
		  dots: false,
		  infinite: true,
		  speed: 300,
		  slidesToShow: 6,
		  slidesToScroll: 6,
		  responsive: [
			{
			  breakpoint: 1200,
			  settings: {
				slidesToShow: 5,
				slidesToScroll: 5
			  }
			},
			{
			  breakpoint: 1050,
			  settings: {
				slidesToShow: 4,
				slidesToScroll: 4
			  }
			},
			{
			  breakpoint: 1024,
			  settings: {
				slidesToShow: 3,
				slidesToScroll: 3
			  }
			},
			{
			  breakpoint: 600,
			  settings: {
				slidesToShow: 2,
				slidesToScroll: 2
			  }
			},
			{
			  breakpoint: 480,
			  settings: {
				slidesToShow: 1,
				slidesToScroll: 1
			  }
			}
		  ]
	});



	// gestion des diapormas NEWS et PROMOS
	$('.responsive_accueil').slick({
		  dots: false,
		  infinite: true,
		  speed: 300,
		  slidesToShow: 5,
		  slidesToScroll: 5,
		  responsive: [
			  {
			  breakpoint: 1200,
			  settings: {
				slidesToShow: 5,
				slidesToScroll: 5
			  }
			},
			{
			  breakpoint: 1100,
			  settings: {
				slidesToShow: 4,
				slidesToScroll: 4
			  }
			},
			{
			  breakpoint: 1000,
			  settings: {
				slidesToShow: 3,
				slidesToScroll: 3
			  }
			},
			{
			  breakpoint: 720,
			  settings: {
				slidesToShow: 2,
				slidesToScroll: 2
			  }
			},
			{
			  breakpoint: 530,
			  settings: {
				slidesToShow: 1,
				slidesToScroll: 1
			  }
			}
		  ]
	});

	// gestion des diapormas NEWS et PROMOS
	$('.responsive_newpromos').slick({
		  dots: false,
		  infinite: true,
		  speed: 300,
		  slidesToShow: 3,
		  slidesToScroll: 3,
		  responsive: [
			  {
			  breakpoint: 1200,
			  settings: {
				slidesToShow: 2,
				slidesToScroll: 2
			  }
			},
			{
			  breakpoint: 530,
			  settings: {
				slidesToShow: 1,
				slidesToScroll: 1
			  }
			}
		  ]
	});

	// gestion du diaporama des produits consultés
	$('.responsive_prod_consulte').slick({
		  dots: false,
		  infinite: true,
		  speed: 300,
		  slidesToShow: 6,

		  slidesToScroll: 6,
		  responsive: [
			  {
			  breakpoint: 1200,
			  settings: {
				slidesToShow: 5,
				slidesToScroll: 5
			  }
			},
			{
			  breakpoint: 1100,
			  settings: {
				slidesToShow: 4,
				slidesToScroll: 4
			  }
			},
			{
			  breakpoint: 1000,
			  settings: {
				slidesToShow: 3,
				slidesToScroll: 3
			  }
			},
			{
			  breakpoint: 720,
			  settings: {
				slidesToShow: 2,
				slidesToScroll: 2
			  }
			},
			{
			  breakpoint: 530,
			  settings: {
				slidesToShow: 1,
				slidesToScroll: 1
			  }
			}
		  ]
	});

	$('.responsive_pzon_consulte').slick({
		  dots: false,
		  infinite: true,
		  speed: 300,
		  slidesToShow: 4,

		  slidesToScroll: 4,
		  responsive: [
			{
			  breakpoint: 1180,
			  settings: {
				slidesToShow: 3,
				slidesToScroll: 3
			  }
			},
			{
			  breakpoint: 850,
			  settings: {
				slidesToShow: 2,
				slidesToScroll: 2
			  }
			},
			{
			  breakpoint: 650,
			  settings: {
				slidesToShow: 1,
				slidesToScroll: 1
			  }
			}
		  ]
	});

	// gestion du menu mobile
	window.prettyPrint && prettyPrint()
	$(document).on('click', '.yamm .dropdown-menu', function(e) {
	  e.stopPropagation()
	});

	// On cache la zone de texte
	jQuery('#toggle').hide();
	// toggle() lorsque le lien avec l'ID #toggler est cliqué
	jQuery('a#toggler').click(function(){
		  jQuery('#toggle').toggle(400);
		  return false;
	});

	// gestion des blocs attributes du filtre
	$('.bloc').each(function() {
    var id = $(this).attr('id');
    var duration = "slow";

    if (idSite == "2") {
        duration = 300;
        if (id === "ig549" || id === "ig595" || id === "ig551") {
            $("#displayBloc_" + id).addClass("enroule");
            $("#monBloc_" + id).slideToggle(duration);
        }
    }

    $("#displayBloc_" + id).click(function () {
        $("#monBloc_" + id).slideToggle(duration);
        $(this).toggleClass("enroule");
        return false;
    });
	});

	// gestion du bloc marque du filtre
	$("#displayBlocMarque").click(function () {
			var duration = idSite == "2" ? 300 : "slow";
			$("#monBlocMarque").slideToggle(duration);
			$(this).toggleClass("enroule");
			return false;
	});

	// gestion du bloc couleur du filtre
	$("#displayBlocCouleur").click(function () {
			var duration = idSite == "2" ? 300 : "slow";
			$("#monBlocCouleur").slideToggle(duration);
			$(this).toggleClass("enroule");
			return false;
	});

	// gestion du bloc prix du filtre
	$("#displayBlocPrix").click(function () {
			var duration = idSite == "2" ? 300 : "slow";
			$("#monBlocPrix").slideToggle(duration);
			$(this).toggleClass("enroule");
			return false;
	});


	// gestion des bloc attributs mobile du filtre
	$('.blocMobile').each(function() {
		var id = $(this).attr('id');
		$("#monBlocMobile_"+id).hide();
		$("#displayBlocMobile_"+id).click(function () {
			$("#monBlocMobile_"+id).slideToggle("slow");
			$(this).toggleClass("enrouleMobile"); return false;
		});
	});

	// gestion du bloc mobile marque du filtre
	$("#monBlocMobileMarque").hide();
    $("#displayBlocMobileMarque").click(function () {
        $("#monBlocMobileMarque").slideToggle("slow");
        $(this).toggleClass("enrouleMobile"); return false;
    });

	// gestion du bloc mobile couleur du filtre
	$("#monBlocMobileCouleur").hide();
    $("#displayBlocMobileCouleur").click(function () {
        $("#monBlocMobileCouleur").slideToggle("slow");
        $(this).toggleClass("enrouleMobile"); return false;
    });

	// gestion du bloc mobile prix du filtre
	if (idSite != "2") {
		$("#monBlocMobilePrix").hide();
		$("#displayBlocMobilePrix").click(function () {
			$("#monBlocMobilePrix").slideToggle("slow");
			$(this).toggleClass("enrouleMobile"); return false;
		});
	}

	// gestion du bloc categiorie footer
	$("#monBlocCategorieFooter").hide();
    $("#displayBlocCategorieFooter").click(function () {
        $("#monBlocCategorieFooter").slideToggle("slow");
        $(this).toggleClass("enrouleMobile"); return false;
    });

	// gestion du bloc taille footer
	$("#monBlocTailleFooter").hide();
    $("#displayBlocTailleFooter").click(function () {
        $("#monBlocTailleFooter").slideToggle("slow");
        $(this).toggleClass("enrouleMobile"); return false;
    });

	// gestion du bloc taille footer
	$("div.bloc-footer-menu-mobile").hide();
    $("a.bloc-footer-menu-mobile").click(function () {
        $(this).next().slideToggle("slow");
        $(this).toggleClass("enrouleMobile"); return false;
    });

	// gestion du bloc marque footer
	$("#monBlocMarqueFooter").hide();
    $("#displayBlocMarqueFooter").click(function () {
        $("#monBlocMarqueFooter").slideToggle("slow");
        $(this).toggleClass("enrouleMobile"); return false;
    });

	// gestion du bloc sites footer
	$("#monBlocsitesFooter").hide();
    $("#displayBlocsitesFooter").click(function () {
        $("#monBlocsitesFooter").slideToggle("slow");
        $(this).toggleClass("enrouleMobile"); return false;
    });

	// gestion du bloc planet footer
	$("#monBlocPlanetFooter").hide();
    $("#displayBlocPlanetFooter").click(function () {
        $("#monBlocPlanetFooter").slideToggle("slow");
        $(this).toggleClass("enrouleMobile"); return false;
    });

	// menu mobile espace client mes commandes
	$("#monBlocMobileMesCommandes").hide();
    $("#displayBlocMobileMesCommandes").click(function () {
        $("#monBlocMobileMesCommandes").slideToggle("slow");
        $(this).toggleClass("enrouleMobile"); return false;
    });

	// menu mobile espace client mes informations
	$("#monBlocMobileMesInformations").hide();
    $("#displayBlocMobileMesInformations").click(function () {
        $("#monBlocMobileMesInformations").slideToggle("slow");
        $(this).toggleClass("enrouleMobile"); return false;
    });

	// menu mobile espace client vos photos
	$("#monBlocMobileVosPhotos").hide();
    $("#displayBlocMobileVosPhotos").click(function () {
        $("#monBlocMobileVosPhotos").slideToggle("slow");
        $(this).toggleClass("enrouleMobile"); return false;
    });

	// menu mobile espace client besoin d'aide
	$("#monBlocMobileBesoinAide").hide();
    $("#displayBlocMobileBesoinAide").click(function () {
        $("#monBlocMobileBesoinAide").slideToggle("slow");
        $(this).toggleClass("enrouleMobile"); return false;
    });

	// liste des commandes
	$('.blocListeCommande').each(function() {
		var id = $(this).attr('id');
		$("#monBloc"+id).hide();
		$("#displayBloc"+id).click(function () {
			$("#monBloc"+id).slideToggle("slow");
			$(this).toggleClass("enrouleMobile"); return false;
		});
	});

	$('.tableautsa').each(function() {
		var id = $(this).attr('id');
		$("#cde_"+id).hide();
		$("#displayBloc_"+id).click(function () {
			$("#cde_"+id).slideToggle("slow");
			$(this).toggleClass("enrouleMobile"); return false;
		});
	});


	// gestion de l'affichage du bandeau cookie en bas de page
	var cookieScripts = function () {
		// Loading external javascript file
		$.cookiesDirective.loadScript({
			appendTo: ''
		});
	}
	/* Call cookiesDirective, overriding any default params
		*** These are the defaults ***
			explicitConsent: true,
			position: 'top',
			duration: 10,
			limit: 0,
			message: null,
			cookieScripts: null,
			privacyPolicyUri: 'privacy.html',
			scriptWrapper: function(){},
			fontFamily: 'helvetica',
			fontColor: '#FFFFFF',
			fontSize: '13px',
			backgroundColor: '#000000',
			backgroundOpacity: '80',
			linkColor: '#CA0000'*/
	if (idSite != "2" && idSite != "11" && idSite != "9" ) {
		$.cookiesDirective({
			explicitConsent: false,
			position : 'bottom',
			limit: 1,
			duration: 10000,
			scriptWrapper: cookieScripts,
			backgroundColor: '#666666',
			linkColor: '#ffffff'
		});
	}


	function gestion_affichage_select(){
		// on enlever
		var y = $('input.offre_choix_produit').not(':checked');
		if (y.length) {
			y.each(function() {
				var cube = $(this).data('produit');
				$("#"+cube).css( 'border','1px solid #c0c0c0');
			});
		}


		var x = $('input.offre_choix_produit:checked');
		if (x.length) {
			x.each(function() {
				var cube = $(this).data('produit');
				$("#"+cube).css( 'border','1px solid #FA5800');
			});
		}
	}

	// choix des produits offerts dans la popup offre
	/*$(document).on('click','input.offre_choix_produit',function() {
		var x = $('input.offre_choix_produit:checked');
		var type_offre = $('#type_offre').val();

		if (type_offre=='NEW1'){
			var msg = local_choix_produit_offre_new1;
		}else if (type_offre=='NEW2'){
			var msg = local_choix_produit_offre_new2;

		}else{
			var msg = local_choix_produit_offre;
		}

		if (x.length) {
			if (x.length > $('#max_offre').val()) {
				$(this).prop('checked',false);
				alert(msg);
			}
		}
		if (type_offre=='NEW1' || type_offre=='NEW2'){
			gestion_affichage_select();
		}

	});*/

	// choix des produits offerts dans la popup offre
	$(document).on('click','input.offre_choix_produit',function() {

		var type_offre = $('#type_offre').val();

		if (type_offre=='NEW1'){
			var msg = local_choix_produit_offre_new1;

			if (type_offre=='NEW1' || type_offre=='NEW2'){
				gestion_affichage_select();
			}
		}else if (type_offre=='NEW2'){
			var msg = local_choix_produit_offre_new2;

			if (type_offre=='NEW1' || type_offre=='NEW2'){
				gestion_affichage_select();
			}
		}else{
			var x = $('input.offre_choix_produit:checked');
			var msg = local_choix_produit_offre;
			if (x.length) {
				if (x.length > $('#max_offre').val()) {
					$(this).prop('checked',false);
					alert(msg);
				}
			}
		}




	});


	$(document).on('click','#offre_valider',function() {
		var x = $('input.offre_choix_produit:checked');
		if (x.length) {
			var liste=[];
			x.each(function() {
				liste.push($(this).data('produit'));
			});
			$('#pop_offre').hide();
			$('#pop_offre_loader').show();
			$.post('/websvc/additem.ws.php',{liste_id_produit_offre:liste.join()},function(response) {
				document.location.href='/caddie';
			},'json');
		}
	});




	$(document).on('click','.offre_choix_produit',function() {
		// on compte le nombre de checkbox coche
		var nb_checked = $('input.offre_choix_produit:checked').length;
		// on recupère le nombre de produits autorisé
		var max_offre = $('input.max_offre').val();

		var reste_prod_to_choose = parseInt(max_offre) - parseInt(nb_checked);

		if (parseInt(reste_prod_to_choose)>0){
			if (parseInt(reste_prod_to_choose)==1){
				var retourTxt = local_deb_phrase_info_popup_offre_speciale+' 1 '+local_fin_phrase_info_popup_offre_speciale_singulier;
			}else{
				var retourTxt = local_deb_phrase_info_popup_offre_speciale+' '+parseInt(reste_prod_to_choose)+' '+local_fin_phrase_info_popup_offre_speciale_pluriel
			}
		}else{
			var retourTxt = local_phrase_info_popup_offre_speciale_selection_impossible;
		}
		// on met a jour le span du nombre de produits a selectionne
		$("#nbprod").html(retourTxt);


	});

	$(document).on('click', '[data-selection="selection"]', function(event) {
    event.preventDefault();
    $(this).ekkoLightbox({
        onShown: function() {
            var modal = this.modal;
            $(modal).addClass('modal-second-selection');
        }
    });
	});

	$(document).on('click','.offre_choix_produit_new',function() {
		var cube = $(this).data('produit');
		// on recupère le nombre de produits autorisé
		var max_offre = $('input.max_offre').val();
		// on récupère le nombre demande
		var nb_demande = $('#selectFPstock_OS_'+cube).val();


		if (parseInt(nb_demande)>0){
			if (parseInt(max_offre)>0){
				if (parseInt(nb_demande) <= parseInt(max_offre)){

					var reste_prod_to_choose = parseInt(max_offre) - parseInt(nb_demande);
					$('input.max_offre').val(reste_prod_to_choose);
					var cube = $(this).data('produit');
					$("#"+cube).css( 'border','1px solid #FA5800');
					var liste=[];
					liste.push($(this).data('produit'));
					$.post('/websvc/additem.ws.php',{liste_id_produit_offre_new:liste.join(),qte:nb_demande,nbencaddie:$(this).data('incart'),nbstock:$(this).data('stock')},function(response) {

						if(response.msgE_stock != null) {
							if (idSite == 2) {
								showNotificationModal(data.msgE_stock);
							} else {
								alert(response.msgE_stock);
							}
						}
						else if(response.msgE_qte != null) {
							if (idSite == 2) {
								showNotificationModal(data.msgE_qte);
							} else {
								alert(response.msgE_qte);
							}
						}
						else{
							$('#montant_panier').html(response.total);
							$('#montant_panier_head').html(response.nbtotal);
							$('#montant_panier_head_tablette').html(response.nbtotal);
							$('#montant_panier_head_mobile').html(response.nbtotal);

							// affichage message produit ajoute
							$("#info_"+cube).html(local_msg_affiche_ajout_produit_offre_speciale+response.qte);
							if (idSite == 2) {
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
									urlProduit: response.urlProduit,
									image_url: response.image_url,
									indexLigne: response.indexLigne,
									designation: response.designation,
									nbpieces: response.nbpieces,
									marque: response.marque,
									prixclient: response.prixclient,
									totalProduit: response.total,
									totalPanier: response.totalPanier,
									nb_stock: response.nb_stock
								};
								var prix = produit.prixclient;
								var totalProduitDansPanier = parseInt(response.qte);
								var $productCard = $('.button-add-cart[data-idproduit="' + cube + '"]');
								var imageSrc = totalProduitDansPanier > 0 ? '/_themes/puzzlethemes/fr/images/add-to-cart-vide.svg' : '/_themes/puzzlethemes/fr/images/add-to-cart.svg';

								$productCard.find('img').attr('src', imageSrc);

								var $totalProduitCard = $productCard.find('#total-produit-card-' + cube);

								if ($totalProduitCard.length === 0) {
										$productCard.append('<span id="total-produit-card-' + cube + '" class="total-produit-card"">' + totalProduitDansPanier + '</span>');
								} else {
										$totalProduitCard.html(totalProduitDansPanier);
								}
								$('#total-produit-panier').html(response.nbtotal + ' Articles');
								$('#total-price-panier').html(parseFloat(response.totalPanier).toFixed(2).replace('.', ',') + '€');

								updateCartModal(cube, nb_demande, produit, prix);
								$('.modal-second-selection').modal('hide');
							}
							// modification du message du haut
							if (parseInt(reste_prod_to_choose)>0){
								if (parseInt(reste_prod_to_choose)==1){
									var retourTxt = local_deb_phrase_info_popup_offre_speciale+' 1 '+local_fin_phrase_info_popup_offre_speciale_singulier;
								}else{
									var retourTxt = local_deb_phrase_info_popup_offre_speciale+' '+parseInt(reste_prod_to_choose)+' '+local_fin_phrase_info_popup_offre_speciale_pluriel
								}
							}else{
								var retourTxt = local_phrase_info_popup_offre_speciale_selection_impossible;
							}
							// on met a jour le span du nombre de produits a selectionne
							$("#nbprod").html(retourTxt);
						}
					},'json');
               }else{
					alert(local_msg_affiche_qte_trop_importante);
			   }
			}else{
				var type_offre = $('#type_offre').val();

				if (type_offre=='NEW1'){
					var msg = local_choix_produit_offre_new1;
				}else if (type_offre=='NEW2'){
					var msg = local_choix_produit_offre_new2;
				}
				alert(msg);
			}
		}else{
			alert(local_msg_affiche_qte_0);
		}




	});

	$(document).on('click','#offre_valider_new',function() {
		var x = $('input.offre_choix_produit:checked');
		if (x.length) {
			var liste=[];
			x.each(function() {
				liste.push($(this).data('produit'));
			});
			$('#pop_offre').hide();
			$('#pop_offre_loader').show();
			$.post('/websvc/additem.ws.php',{liste_id_produit_offre_new:liste.join()},function(response) {
				document.location.href='/caddie';
			},'json');
		}
	});



	if(window.innerWidth>1000) {
		if (idSite == "2") {
			$('#iprincipale').elevateZoom({
				zoomType: 'inner',
				cursor: 'pointer'
			});
		} else {
			$('#iprincipale').elevateZoom({
				cursor: "pointer",
				zoomWindowFadeIn: 15,
				zoomWindowFadeOut: 5,
				zoomWindowWidth: 500,
				zoomWindowHeight: 450,
				borderColour: ($('#idSite').val()==11 ? "#cccccc":($('#idSite').val()==34 ? "#081f55":($('#idSite').val()==35 ? "#032e7d":($('#idSite').val()==37 ? "#d1bb65":"#FF6600")))),
				lensBorderColour: ($('#idSite').val()==11 ? "#cccccc":($('#idSite').val()==34 ? "#081f55":($('#idSite').val()==35 ? "#032e7d":($('#idSite').val()==37 ? "#d1bb65":"#FF6600")))),
				borderSize: 2,
				gallery:'gallery_01',
				galleryActiveClass: 'active'
			});
		}
	}
});
///////////////////////////////////////////////////////////////////////////////////////
function call_zoom(img){
	//$('.zoomWindowContainer div').stop().css("background-image","url("+ img +")");
	//$('.zoomContainer').remove();
	if (idSite == "2") {
		$('#iprincipale').elevateZoom({
			zoomType: 'inner',
			cursor: 'pointer'
		});
		$('.zoomContainer').remove();
	} else {
		$('#iprincipale').elevateZoom({
			cursor: "pointer",
			zoomWindowFadeIn: 15,
			zoomWindowFadeOut: 5,
			zoomWindowWidth: 450,
			zoomWindowHeight: 450,
			borderColour: ($('#idSite').val()==11 ? "#cccccc":($('#idSite').val()==34 ? "#081f55":($('#idSite').val()==35 ? "#032e7d":($('#idSite').val()==37 ? "#d1bb65":"#FF6600")))),
			lensBorderColour: ($('#idSite').val()==11 ? "#cccccc":($('#idSite').val()==34 ? "#081f55":($('#idSite').val()==35 ? "#032e7d":($('#idSite').val()==37 ? "#d1bb65":"#FF6600")))),
			borderSize: 2,
			gallery:'gallery_01',
			galleryActiveClass: 'active'
		});
	}
}
///////////////////////////////////////////////////////////////////////////////////////
// gestion du menu (fixed au scroll apres num px)
var num = 145; //number of pixels before modifying styles
$(window).bind('scroll', function () {

	if ( !document.getElementById("img_area") ) { // on ne scroll pas sur la page de recadrage des PP
		$('#stopcoeur').hide();
		if ($(window).scrollTop() > num) {
			// on cache le coeur stopcoeur
			$('#lecoeur').hide();
			// on fixe le menu
			$('.menu').addClass('fixed');
		} else {
			// on enleve la class fixed du menu
			$('.menu').removeClass('fixed');
			// on affiche le coeur
			$( "#lecoeur" ).show();
		}
	}


});

$('.btn_peinture').bind('click', function () {

	var table_id = $(this).parents(".header_peinture:first").attr('id');
	//var prix_ptn = parseFloat($(this).parent().attr('data-prix'));
	//var prixavant_ptn = parseFloat($(this).parent().attr('data-prixavant'));
	//var prixmembre_ptn = parseFloat($(this).parent().attr('data-prixmembre'));
	//var id_ptn = $(this).parent().attr('data-id');
	//$('#'+table_id+" .infos_maquettes").css("background-color","red");
	var maquette_prix = parseFloat($('#'+table_id+" .infos_maquettes").attr('data-prix'));
	var maquette_prixavant = parseFloat($('#'+table_id+" .infos_maquettes").attr('data-prixavant'));
	var maquette_prixmembre = parseFloat($('#'+table_id+" .infos_maquettes").attr('data-prixmembre'));
	var liste_ids = "";
	//alert(prixavant_ptn);
	//alert(total_prix);
	//
	//$('#'+table_id+" tr").html(total_prix-prix_ptn);

	if($(this).parent().hasClass('peinture_actif')) {
		$(this).parent().removeClass('peinture_actif');
		$(this).parent().children('.overlay_peinture').show();
	} else {
		$(this).parent().addClass('peinture_actif');
		$(this).parent().children('.overlay_peinture').hide();
	}
	$('#'+table_id+" .peinture_actif").each(function(){
		maquette_prix += parseFloat($(this).attr('data-prix'));
		maquette_prixavant += parseFloat($(this).attr('data-prixavant'));
		maquette_prixmembre += parseFloat($(this).attr('data-prixmembre'));
		liste_ids = liste_ids + $(this).attr('data-id')+";";
	});
	if (liste_ids.length > 0) {
		liste_ids = liste_ids.substring(0, liste_ids.length - 1);
	}
	$('#'+table_id).attr('data-peintures',liste_ids);
	maquette_prix = parseFloat(maquette_prix).toFixed(2);
	maquette_prixavant = parseFloat(maquette_prixavant).toFixed(2);
	maquette_prixmembre = parseFloat(maquette_prixmembre).toFixed(2);
	var maquette_prixpromo = parseFloat(maquette_prixavant-maquette_prix).toFixed(2)+' &euro; (- '+Math.floor(Math.round(100*((maquette_prixavant-maquette_prix)/maquette_prixavant)))+'%)';
	$('#'+table_id+" .prixsanspromo_peinture").html(maquette_prixavant+' &euro;');
	$('#'+table_id+" .prix_peinture").html(maquette_prix+' &euro;');
	$('#'+table_id+" .prix_membre_peinture").html(maquette_prixmembre+' &euro;');
	$('#'+table_id+" .promo_peinture").html(maquette_prixpromo);

});
///////////////////////////////////////////////////////////////////////////////////////
// gestion du menu (fixed au scroll apres num px)
/*var num = 145; //number of pixels before modifying styles
$(window).bind('scroll', function () {
    if ($(window).scrollTop() > num) {
		// on fixe le menu
		$('.menu_mobile').addClass('fixed_mobile');
    } else {
		// on enleve la class fixed du menu
		$('.menu_mobile').removeClass('fixed_mobile');
    }
});
///////////////////////////////////////////////////////////////////////////////////////
// gestion du menu (fixed au scroll apres num px)
var num = 145; //number of pixels before modifying styles
$(window).bind('scroll', function () {
    if ($(window).scrollTop() > num) {
		// on fixe le menu
        $('.menu_avant_mobile').addClass('fixed_tablette');
    } else {
		// on enleve la class fixed du menu
        $('.menu_avant_mobile').removeClass('fixed_tablette');
    }
});*/
///////////////////////////////////////////////////////////////////////////////////////
// gestion du scroll vers le top
function scrollToTop() {
	verticalOffset = typeof(verticalOffset) != 'undefined' ? verticalOffset : 0;
	element = $('body');
	offset = element.offset();
	offsetTop = offset.top-25;
	$('html, body').animate({scrollTop: offsetTop}, 500, 'linear');
}

function gestion_qte_produit(signe,nbstock){

	if (signe=='moins'){
		if (parseInt($('#selectFPstock').val())>1) {
			$('#selectFPstock').val(parseInt($('#selectFPstock').val())-1);
			$('#selectFPstock2').val(parseInt($('#selectFPstock2').val())-1);
		}

	}

	if (signe=='plus'){
		if (parseInt($('#selectFPstock').val())<nbstock) {
			$('#selectFPstock').val(parseInt($('#selectFPstock').val())+1);
			$('#selectFPstock2').val(parseInt($('#selectFPstock2').val())+1);
		} else {
			if (nbstock>1){
				alert(local_nb_exemplaires_max.replace('%NBSTOCK%',nbstock));
			}else{
				alert(local_nb_exemplaire_max.replace('%NBSTOCK%',nbstock));
			}

		}

	}
}

function gestion_qte_produit_id(id,signe,nbstock){

	if (signe=='moins'){
		if (parseInt($('#selectFPstock_'+id).val())>1) {
			$('#selectFPstock_'+id).val(parseInt($('#selectFPstock_'+id).val())-1);
			$('#selectFPstock2_'+id).val(parseInt($('#selectFPstock2_'+id).val())-1);
		}

	}

	if (signe=='plus'){
		if (parseInt($('#selectFPstock_'+id).val())<nbstock) {
			$('#selectFPstock_'+id).val(parseInt($('#selectFPstock_'+id).val())+1);
			$('#selectFPstock2_'+id).val(parseInt($('#selectFPstock2_'+id).val())+1);
		} else {
			if (nbstock>1){
				alert(local_nb_exemplaires_max.replace('%NBSTOCK%',nbstock));
			}else{
				alert(local_nb_exemplaire_max.replace('%NBSTOCK%',nbstock));
			}

		}

	}
}


function gestion_qte_produit_colle_produit(signe,nbstock,idProduitColle){

	if (signe=='moins'){
		if (parseInt($('#selectFPstockColle_'+idProduitColle).val())>1) {
			$('#selectFPstockColle_'+idProduitColle).val(parseInt($('#selectFPstockColle_'+idProduitColle).val())-1);
		}

	}

	if (signe=='plus'){
		if (parseInt($('#selectFPstockColle_'+idProduitColle).val())<nbstock) {
			$('#selectFPstockColle_'+idProduitColle).val(parseInt($('#selectFPstockColle_'+idProduitColle).val())+1);
		} else {
			if (nbstock>1){
				alert(local_nb_exemplaires_max.replace('%NBSTOCK%',nbstock));
			}else{
				alert(local_nb_exemplaire_max.replace('%NBSTOCK%',nbstock));
			}

		}

	}
}


function gestion_qte_produit_cube(signe,nbstock,idproduit){
	if (signe=='moins'){
		if (parseInt($('#selectFPstock_'+idproduit).val())>1) {
			$('#selectFPstock_'+idproduit).val(parseInt($('#selectFPstock_'+idproduit).val())-1);
		}

	}

	if (signe=='plus'){
		if (parseInt($('#selectFPstock_'+idproduit).val())<nbstock) {
			$('#selectFPstock_'+idproduit).val(parseInt($('#selectFPstock_'+idproduit).val())+1);
		} else {
			if (nbstock>1){
				alert(local_nb_exemplaires_max.replace('%NBSTOCK%',nbstock));
			}else{
				alert(local_nb_exemplaire_max.replace('%NBSTOCK%',nbstock));
			}

		}

	}
}


function gestion_qte_produit_cube_OS(signe,nbstock,idproduit){
	if (signe=='moins'){
		if (parseInt($('#selectFPstock_OS_'+idproduit).val())>1) {
			$('#selectFPstock_OS_'+idproduit).val(parseInt($('#selectFPstock_OS_'+idproduit).val())-1);
		}

	}

	if (signe=='plus'){

		if (parseInt($('#selectFPstock_OS_'+idproduit).val())<nbstock) {
			$('#selectFPstock_OS_'+idproduit).val(parseInt($('#selectFPstock_OS_'+idproduit).val())+1);
		} else {
			if (nbstock>1){
				alert(local_nb_exemplaires_max.replace('%NBSTOCK%',nbstock));
			}else{
				alert(local_nb_exemplaire_max.replace('%NBSTOCK%',nbstock));
			}

		}

	}
}

function gestion_qte_produit_colle(signe,nbstock){
	if (signe=='moins'){
		if (parseInt($('#selectFPstock').val())>0) {
			$('#selectFPstock').val(parseInt($('#selectFPstock').val())-1);
			$('#selectFPstock2').val(parseInt($('#selectFPstock2').val())-1);
		}

	}

	if (signe=='plus'){
		if (parseInt($('#selectFPstock').val())<nbstock) {
			$('#selectFPstock').val(parseInt($('#selectFPstock').val())+1);
			$('#selectFPstock2').val(parseInt($('#selectFPstock2').val())+1);
		} else {
			if (nbstock>1){
				alert(local_nb_exemplaires_max.replace('%NBSTOCK%',nbstock));
			}else{
				alert(local_nb_exemplaire_max.replace('%NBSTOCK%',nbstock));
			}

		}

	}
}

function gestion_qte_produit_poster(signe){
	if (signe=='moins'){
		if (parseInt($('#selectFPstock').val())>0) {
			$('#selectFPstock').val(parseInt($('#selectFPstock').val())-1);
			$('#selectFPstock2').val(parseInt($('#selectFPstock2').val())-1);
		}
	}

	if (signe=='plus'){
			$('#selectFPstock').val(parseInt($('#selectFPstock').val())+1);
			$('#selectFPstock2').val(parseInt($('#selectFPstock2').val())+1);
	}
}

function gestion_qte_produit_poster1000(signe){
	if (signe=='moins'){
		if (parseInt($('#selectFPstock1000').val())>0) {
			$('#selectFPstock1000').val(parseInt($('#selectFPstock1000').val())-1);
		}
	}

	if (signe=='plus'){
			$('#selectFPstock1000').val(parseInt($('#selectFPstock1000').val())+1);
	}
}

function select_garantie_serenite(){
	if(document.getElementById('gtr').checked){
		change_pack(5);
	}else{
		change_pack(1);
	}
}

function select_grantie_serenite_mobile(){
	if(document.getElementById('gtr_mobile').checked){
		change_pack(5);
	}else{
		change_pack(1);
	}
}

function select_carte() {
	if(document.getElementById('coche_carte').checked) {
		$.get('/websvc/additem.ws.php?idproduit=40368&qte=1&nbencaddie=0&nbstock=999&nocache='+Math.random(),{},function() {
			document.location.href = '/caddie';
		});
	}
}

function select_carte_mobile() {
	if(document.getElementById('coche_carte_mobile').checked) {
		$.get('/websvc/additem.ws.php?idproduit=40368&qte=1&nbencaddie=0&nbstock=999&nocache='+Math.random(),{},function() {
			document.location.href = '/caddie';
		});
	}
}


function btn_add_carte() {
	$.get('/websvc/additem.ws.php?idproduit=40368&qte=1&nbencaddie=0&nbstock=999&nocache=' + Math.random(), {}, function(response) {
		if (response.produitExiste) {
			$.notify({
				icon: '',
				title:"",
				message: ""
			}, {
				type: 'minimalist',
				delay: 5000,
				icon_type: 'image',
				template: '<div style="padding:14px;" data-notify="container" class="col-xs-11 col-sm-3 success-message-add-panier" role="success">' +
					'<img data-notify="icon" src="/_themes/puzzlethemes/fr/images/check-circle-add-panier.svg" >' +
					'<span style="color:#035D0C;font-size: 12px;" data-notify="message">Déjà dans votre panier !</span>' +
				'</div>'
			});
		} else {
			$.notify({
				icon: '',
				title:"",
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
				urlProduit: response.urlProduit,
				image_url: response.image_url,
				indexLigne: response.indexLigne,
				designation: response.designation,
				nbpieces: response.nbpieces,
				marque: response.marque,
				prixclient: response.prixclient,
				totalProduit:response.total,
				totalPanier:response.totalPanier,
				nb_stock:response.nb_stock
			};
			console.log(40368, 1, produit, response.prixclient)
			updateCartModal(40368, 1, produit, response.prixclient);
		}
		$('#montant_panier_head').html(response.total);
		$('#total-produit-panier').html(response.nbtotal + ' Articles');
		$('#total-price-panier').html(response.totalPanier.toFixed(2) + ' €');
		if (response.nbtotal !== 0) {
			$("#montant_panier_head").addClass('flex');
		}
	}, 'json');
}




/*$(document).ready(function() {
	 $('.carousel').carousel({
		 interval: 5000,
		 swipe: 30
	 })
});*/


$(function() {
	/*if ($('#message_exemplaires').text().length != 0 ){
		setTimeout(function() {
			$.notify($('#message_exemplaires').text(), { type: 'warning',icon: "/_themes/puzzlethemes/fr/images/stress-pieces.png" });
		}, 2000);
    }
*/
	if ($('#message_exemplaires').text().length != 0 ){
		setTimeout(function() {
			$.notify({
				icon: $('#img_message_exemplaires').text(),
				title:"",
				message: $('#message_exemplaires').text()
			},{
				type: 'minimalist',
				delay: 5000,
				icon_type: 'image',
				template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0}" role="alert">' +
					'<button type="button" aria-hidden="true" class="close" data-notify="dismiss">&times;</button>' +
					'<img data-notify="icon" class="pull-left">' +
					'<span data-notify="message">{2}</span>' +
				'</div>'
			});
		}, 2000);
    }
	if ($('#message_nb_vue').text().length != 0){
		setTimeout(function() {
			$.notify({
				icon: $('#img_message_nb_vue').text(),
				title:"",
				message: $('#message_nb_vue').text()
			},{
				type: 'minimalist',
				delay: 5000,
				icon_type: 'image',
				template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0}" role="alert">' +
					'<button type="button" aria-hidden="true" class="close" data-notify="dismiss">&times;</button>' +
					'<img data-notify="icon" class="img-circle pull-left">' +
					'<span data-notify="message">{2}</span>' +
				'</div>'
			});
		}, 4000);
    }

	if ($('#message_vente30j').text().length != 0 ){
		setTimeout(function() {
			$.notify({
				icon: $('#img_message_vente30j').text(),
				title:"",
				message: $('#message_vente30j').text()
			},{
				type: 'minimalist',
				delay: 5000,
				icon_type: 'image',
				template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0}" role="alert">' +
					'<button type="button" aria-hidden="true" class="close" data-notify="dismiss">&times;</button>' +
					'<img data-notify="icon" class="img-circle pull-left">' +
					'<span data-notify="message">{2}</span>' +
				'</div>'
			});
		}, 6000);
    }
	/*if ($('#message_nb_vue').text().length != 0){
		setTimeout(function() {
			$.notify($('#message_nb_vue').text(), { type: 'warning',icon: "/_themes/puzzlethemes/fr/images/stress-pieces.png" });
		}, 1000);
    }*/
    /*setTimeout(function() {
        $.bootstrapGrowl("Danger, Danger!", {
            type: 'danger',
            align: 'center',
            width: 'auto',

            allow_dismiss: false
        });
    }, 2000);

    setTimeout(function() {
        $.bootstrapGrowl("Danger, Danger!", {
            type: 'info',
            align: 'left',
            stackup_spacing: 30
        });
    }, 3000);*/

	$('span.notifymessage').each(function() {

			var timeo = $(this).data('timeout');
			var icon = $(this).data('icon');
			var delay = $(this).data('delay');
			var txt = $(this).text();

			setTimeout(function() {
				$.notify({
					icon: icon,
					title:"",
					message: txt
				},{
					type: 'minimalist',
					delay: delay,
					icon_type: 'image',
					template: '<div data-notify="container" class="col-xs-11 col-sm-3 alert alert-{0}" role="alert">' +
						'<button type="button" aria-hidden="true" class="close" data-notify="dismiss">&times;</button>' +
						'<img data-notify="icon" class="img-circle pull-left">' +
						'<span data-notify="message">{2}</span>' +
					'</div>'
				});
			}, timeo);
		});

	$('.offrepanier').click(function(){

		var IDOffre = $(this).attr('data-id');
		var largeur_fenetre = $(window).width();
		var hauteur_fenetre = $(window).height();


		var typeEcran = "WEB";
		if (largeur_fenetre<=1025 && largeur_fenetre>=543){
			var typeEcran = "TABLETTE";
		}
		if (largeur_fenetre<543){
			var typeEcran = "MOBILE";
		}

		$.post('/websvc/save_clic_offres_panier.ws.php',{IDOffre:IDOffre,type:typeEcran},function(data){

				},'json');
	});
	$('.offre-flash').click(function(){
		var type = $(this).attr('data-type');
		var IDOffre = $(this).attr('data-id');

		$.post('/websvc/save_clic_offres_speciales.ws.php',{IDOffre:IDOffre,type:type},function(data){

				},'json');
	});
	$('.offre-flash-produit').click(function(){
		var type = $(this).attr('data-type');
		var IDOffre = $(this).attr('data-id');

		if (type=="INCONNU"){
			var largeur_fenetre = $(window).width();
			var hauteur_fenetre = $(window).height();


			var typeEcran = "WEB";
			if (largeur_fenetre<=1025 && largeur_fenetre>=543){
				var typeEcran = "TABLETTE";
			}
			if (largeur_fenetre<543){
				var typeEcran = "MOBILE";
			}
			$.post('/websvc/save_clic_offres_speciales.ws.php',{IDOffre:IDOffre,type:typeEcran},function(data){

					},'json');
		}

	});



		$('input,textarea').focus(function(){
		   $(this).data('placeholder',$(this).attr('placeholder'))
				  .attr('placeholder','');
		}).blur(function(){
		   $(this).attr('placeholder',$(this).data('placeholder'));
		});



	$('a.btdelpp').bind('click',function() {
		var pid = $(this).data('pp');
		if (confirm(local_msg_del_pp)) {
			$.get('/websvc/delpp.ws.php', { id:pid }, function(reponse) {
						document.location.href=document.location.href;
			},'json');
		}
	});

	$('a.btn_addpp').bind('click',function() {

					var pid = $(this).data('pp');
					var idp = $(this).data('idproduit');
					var qte = $('#selectFPstock_'+pid).val();

					$.get('/websvc/additem.ws.php', { rnd : Math.random(), qte:qte, nbencaddie:0, nbstock:999, idproduit: idp, idphoto: pid, mespp:1 }, function(reponse) {
						document.location.href='/caddie/';
					},'json');

	});


});




function griserMDP() {
 var valeurRadioChoix = $('input[type=radio][name=choix_id]:checked').attr('value');
 if (valeurRadioChoix == "inscrit") {
	$("#pwd").removeAttr('disabled');
	$("#searchMDP").css('color', '#FA5800');
	$("#f_connect").val('1');
	$("#formLogin").attr("action", "");
    $('#formLogin').find('input[name="mail"]').prop('id', 'Imail');
 }
 else {
	$("#pwd").val('');
	$("#pwd").attr('disabled','disabled');
	$("#searchMDP").css('color', '#cacaca');
	$("#f_connect").val('');
	$("#formLogin").attr("action", "/clients/?pg=inscription");
    $('#formLogin').find('input[name="mail"]').prop('id', 'mail');

 }
}


