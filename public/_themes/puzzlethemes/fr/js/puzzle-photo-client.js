
var data;
$(function() {
	



	// gestion du select liste des produits avec photo
	$('#Ipuzzleclient').ddslick({
		width: '100%',

		imagePosition: "left",
		truncateDescription: true,
		selectText: local_selection_puzzle_liste,
		onSelected: function (data) {
			console.log(data);			
			if (data.selectedData.value != 0){
				$('#msg_err_puzzleclient').load('/websvc/upload_photo_puzzle_client.ws.php?CAS=VERIFPUZZLE&idUpload='+$("#idUpload").val()+'&valProdSelect='+data.selectedData.value); 
				
				$('#msg_err_puzzleclient2').load('/websvc/upload_photo_puzzle_client.ws.php?CAS=VERIFPUZZLEOBSOLETE&idUpload='+$("#idUpload").val()+'&valProdSelect='+data.selectedData.value); 			
				
				$('#valProdSelect').val(data.selectedData.value);
				$('#ProdSelectEnCasInsert').val(data.selectedData.description);	
				$('#ImgSelectEnCasInsert').val(data.selectedData.imageSrc);	
			}else{
				$('#msg_err_puzzleclient').load('/websvc/upload_photo_puzzle_client.ws.php?CAS=VERIFPUZZLE&idUpload='+$("#idUpload").val()+'&valProdSelect='+data.selectedData.value); 
				
				$('#msg_err_puzzleclient2').load('/websvc/upload_photo_puzzle_client.ws.php?CAS=VERIFPUZZLEOBSOLETE&idUpload='+$("#idUpload").val()+'&valProdSelect='+data.selectedData.value); 			
				
				$('#valProdSelect').val(0);
				$('#ProdSelectEnCasInsert').val("");	
				$('#ImgSelectEnCasInsert').val("");	
			}

		}
	});	
	 


	// sur la selection la coche affiche
	$(".isEmplacement").hide();
    $('input[type=radio][name=affiche]').change(function() {
        if (this.value == '1') {
            $(".isEmplacement").slideToggle("slow");
        }
        else if (this.value == '2') {
            $(".isEmplacement").hide();
			$(".isAutre").hide();
			$("#Iemplacement")[0].selectedIndex = -1;
			$("#Ipreciser").val('');
        }
    });

	// en cas de modif et si affiche coche, on affiche emplacement
	if ($('input[type=radio][name=affiche]:checked').attr('value')==1){
		$(".isEmplacement").slideToggle("slow");
	}	

	// sur modification du select emplacement
	$(".isAutre").hide();
	$("#Iemplacement").change(function(){  	
		var value = $("#Iemplacement option:selected").val();
		if (value==10){
			var theDiv = $(".is" + value);
			$(".isAutre").slideToggle("slow");			
		}else{
			$(".isAutre").hide();
		}
	}); 
	
	// en cas de modif et si emplacement est autre, on affiche precision
	if ($("#Iemplacement").val() == 10){
		$(".isAutre").slideToggle("slow");
	}	
	
	// gestion de la popup de chargement
	function dialogPageLoadPPC() {
		$.colorbox({inline:true, href:'#dialog-page-load-page-ppc', closeButton:false, width:"382", height:"250",overlayClose:false,escKey:false});	
	}
	
	// fermeture de la popup du chargement
	function closeDialogPageLoadPPC() {
		$.colorbox.close();
	}

	// suppression d'une image
	$('.kv-file-remove-ok').bind('click',function(){
		var idphoto = $(this).attr('data-id');
		var produit = $(this).attr('data-produit');
		var client = $(this).attr('data-client');
		var idUpload = $(this).attr('data-id-upload');
		if (confirm(local_question_suppr_photo)){
			dialogPageLoadPPC();
			$.get('/websvc/upload_photo_puzzle_client.ws.php',{ idUpload : idUpload, idphoto : idphoto, valProdSelect : produit, client : client, "CAS" : "SUPP_IMG", nocache : Math.random() },function(data) {
				closeDialogPageLoadPPC();
				if (data.uploaded == "ERROR"){
					//alert(data.error);
					if (data.error == "ERREUR IMG SUPPR"){		
						alert(local_msg_erreur_suppr_img);
					}					
				}else{		
					document.location.href='/clients/?pg=ajoutphotos&id='+idUpload;
				}
			});	
		}
	});

	// suppression d'un upload
	$('.supprimer_upload').bind('click',function(){
		var idUpload = $(this).attr('data-id-upload');
		var produit = $(this).attr('data-produit');
		var client = $(this).attr('data-client');	
		if (confirm(local_question_suppr_upload)){
			dialogPageLoadPPC();
			
			$.get('/websvc/upload_photo_puzzle_client.ws.php',{ idUpload : idUpload,valProdSelect : produit, client : client, "CAS" : "SUPP_UPLOAD", nocache : Math.random() },function(data) {
				closeDialogPageLoadPPC();
				if (data.uploaded == "ERROR"){
					alert(data.error);
					if (data.error == "ERREUR UPLOAD SUPPR"){		
						alert(local_msg_erreur_suppr_upload);
					}					
				}else{		
					document.location.href='/clients/?pg=ajoutphotos&id=-1';
				}
			});	
		}
	});


	// afficher realisations en fonction d'un produit sur la fiche produit
	$('.afficher_realisation').bind('click',function(){
		$('#loading-ppc').css('display', 'block');
		var statut = $(this).attr('data-statut');	
		if (statut=="visible"){
			var produit = $(this).attr('data-id-produit');	
			$("#txt_voir_realisation").text(local_deb_msg_afficher_puzzle_sur_produit_1);
			$(this).attr("data-statut","Nonvisible");
			$('#lespuzzlesclients').load('/websvc/load_realisation_puzzle_client.ws.php?idproduit='+produit); 				
		}else if(statut=="visibleCharge"){
			$("#txt_voir_realisation").text(local_deb_msg_afficher_puzzle_sur_produit_1);
			$(this).attr("data-statut","Nonvisible");
			$("#lespuzzlesclients").slideToggle("slow");
		}else if(statut=="Nonvisible"){
			$("#txt_voir_realisation").text(local_deb_msg_afficher_puzzle_sur_produit_2);
			$(this).attr("data-statut","visibleCharge");
			$("#lespuzzlesclients").hide();
		}
		$('#loading-ppc').css('display', 'none');
		$('html,body').animate({scrollTop: $("#blocppc").offset().top-40}, 'slow');
	});


	// formulaire de validation des uploads
	$('#formAjoutPhoto').on('submit', function (e) {
		// On empêche le navigateur de soumettre le formulaire
		e.preventDefault();
		
		if ($("#valProdSelect").val() != 0){
			if($('.file-error-message').css('display') == 'block'){
				alert(local_msg_erreur_selection_file);
			}else if ($("#CAS").val()=="INSERT" && $('input#file-3')[0].files.length ==0){
				alert(local_msg_erreur_photo);
				
			}else if ($("#CAS").val()=="INSERT" && $('input#file-3')[0].files.length >$("#nbfilemax").val() ){
				alert(local_msg_erreur_photo_trop);
			}else{
				
				$('input#file-3').prop('disabled', true);
				dialogPageLoadPPC();
				var $form = $(this);

				var formdata = (window.FormData) ? new FormData($form[0]) : null;
				var data = (formdata !== null) ? formdata : $form.serialize();

				$.ajax({
					url: "/websvc/upload_photo_puzzle_client.ws.php",
					type: $form.attr('method'),
					contentType: false, // obligatoire pour de l'upload
					processData: false, // obligatoire pour de l'upload
					dataType: 'json', // selon le retour attendu
					data: data,
					success: function (response) {
						
						if (response.uploaded == "ERROR"){
							closeDialogPageLoadPPC();
							if(response.error == "CLIENT"){
								alert(local_msg_erreur_client);
							}else if(response.error == "PRODUIT"){
								alert(local_msg_erreur_produit);
							}else if(response.error == "DIFFICULTE"){
								alert(local_msg_erreur_difficulte);
							}else if(response.error == "HEURES"){
								alert(local_msg_erreur_temps);
							}else if(response.error == "EMPLACEMENT"){
								alert(local_msg_erreur_emplacement);
							}else if(response.error == "PRECISION"){
								alert(local_msg_erreur_detail_emplacement);
							}else if (response.error == "DROIT"){
								alert(local_msg_erreur_droit);
							}else if(response.error == "PASPHOTO"){
								alert(local_msg_erreur_photo);
							}else if(response.error == "EXISTEDEJA"){
								alert(local_msg_erreur_upload_existe_deja);
							}
							$('input#file-3').prop('disabled', false);
						}else{	
							if ($("#CAS").val()=="INSERT"){
								// CAS prend la valeur UPDATE
								$("#CAS").val("UPDATE");
								// affectation du idupload
								$("#idUpload").val(response.ID);	 
							}						
							if ($('#file-3').length){
								$('input#file-3').prop('disabled', false);
								$input.fileinput("upload");
							}else{
								closeDialogPageLoadPPC();
								document.location.href='/clients/?pg=ajoutphotos&id='+response.ID;		
							}

						}				
					}
				});
			}
		}else{
			alert(local_msg_erreur_produit);
		}
	



	});

	// gestion des photos sur la page des uploads
	$(".box-produit-image-puzzle-unique").colorbox({maxWidth:'95%', maxHeight:'95%',title:false,current:false});
	
	if ($('#formAjoutPhoto').length) {
	
		var tableauPhoto;
		var nbPhotoAutorise;
		
		$.get('/websvc/upload_photo_puzzle_client.ws.php',{ idUpload : $("#idUpload").val(),valProdSelect : $("#valProdSelect").val(), client : $("#client").val(),nbfilemax : $("#nbfilemax").val(), "CAS" : "RECUP_PHOTO", nocache : Math.random() },function(data) {
			tableauPhoto = data.response;
			nbPhotoAutorise = data.nbPhotoAutorise;
			$input.fileinput({
					showCaption: false,
					resizeImage: true,
					uploadUrl: "/websvc/upload_photo_puzzle_client.ws.php",
					browseClass: "btn btn-primary btn-lg",
					language: $("#language").val(),	
					allowedFileExtensions : ['jpg', 'png','gif'],
					uploadAsync: false,
					//initialPreview: [tableauPhoto], initialiser les photos deja uploade
					showUpload: false, // hide upload button
					showRemove: true, // hide remove button	
					autoReplace: true,					
					maxFileCount :nbPhotoAutorise,
					previewFileIcon: "<i class='glyphicon glyphicon-king'></i>",
					uploadExtraData: function() {
						return {
							idUpload: $("#idUpload").val(),
							client: $("#client").val(),
							valProdSelect: $("#valProdSelect").val(),
							CAS : "UPLOAD_PHOTO"
						};
					}		
									
				}).on('filebatchuploadsuccess', function(event, data, files, extra) {
					response =  data.response;
					closeDialogPageLoadPPC();	
					document.location.href='/clients/?pg=ajoutphotos&id='+response.ID;
					
				}).on('fileselectnone', function(event, data, files, extra) {
					response =  data.response;
					closeDialogPageLoadPPC();	
					document.location.href='/clients/?pg=ajoutphotos&id='+response.ID;
					/*response =  data.response;
					
					// dans le cas de l'insertion, on averti il faut cocher autoriser les droits et valider
					if ($("#CAS").val() == "INSERT"){
						$('#autoriserdroit').css('color', 'red'); 
						$('#autoriserdroit').css('font-weight', 'bold');
						$('#messageinfoautoriserdroit').css('display', 'block');
						$('#blocinfoautoriserdroit').css('border-color', 'red'); 
						$('html,body').animate({scrollTop: $("#blocinfoautoriserdroit").offset().top-90}, 'slow'); 
						
					}
					
					$('#messageinfotelechargerok').css('display', 'block');
					if (response.nbfileupload==1){
						$('#messageinfotelechargerok1').css('display', 'block');
					}else{
						$('#messageinfotelechargerok2').css('display', 'block');
					}

					setTimeout(function() {
						$('#messageinfotelechargerok').fadeOut('fast');
					}, 2000); // <-- time in milliseconds			


					// CAS prend la valeur UPDATE
					$("#CAS").val("UPDATE");
					// affectation du idupload
					$("#idUpload").val(response.ID);
					// mise a jour du nombre du fichier restant
					$("#nbfilemax").val($("#nbfilemax").val()-response.nbfileupload);
					// interdire modification du select
					$("#isCreation").val("YES");
					$(".listpuzzle").css("display", "none");
					$(".puzzle").css("display", "block");
					$('.puzzle').html("<div style='width:340px;padding:5px;vertical-align:middle;height:50px; color:#333;position:relative; border-radius:2px; border:solid 1px #ccc;'><div style='padding-left:5px;float:left;width:45px'><img width='35px' src="+$("#ImgSelectEnCasInsert").val()+"></div><div style='padding-left:5px;float:left;width:250px;font-size:85%;'>"+$("#ProdSelectEnCasInsert").val()+"</div></div>");	*/	
				}).on('fileerror', function (event, data, previewId, index) {
					$input.fileinput('reset');
				});	
				
		},'json');	
	}	
	
	
	
	var $input = $("#file-3");
	
	// gestion des images
	$(".box-produit-image-puzzle-gerer").colorbox({maxWidth:'95%', maxHeight:'95%',title:false,current:false});	
	
	// gestion du textarea
	/*if($('#Icomplement').length){
		var text_max = 150;
		$('#textarea_feedback').html(text_max + ' '+local_caractere_restant);
		var text_length = $('#Icomplement').val().length;
		var text_remaining = text_max - text_length;

		$('#textarea_feedback').html(text_remaining + ' '+local_caractere_restant);
		
		$('#Icomplement').keyup(function() {
			var text_length = $('#Icomplement').val().length;
			var text_remaining = text_max - text_length;

			$('#textarea_feedback').html(text_remaining + ' '+local_caractere_restant);
		});
	}*/
	
	
	// controle du naviguateur
	var userAgent = navigator.userAgent.toLowerCase();
	$.browser = {
	   version: (userAgent.match( /.+(?:rv|it|ra|ie|me)[/: ]([d.]+)/ ) || [])[1],
	   chrome: /chrome/.test( userAgent ),
	   safari: /webkit/.test( userAgent ) && !/chrome/.test( userAgent ),
	   opera: /opera/.test( userAgent ),
	   msie: /msie/.test( userAgent ) && !/opera/.test( userAgent ),
	   mozilla: /mozilla/.test( userAgent ) && !/(compatible|webkit)/.test( userAgent )
	};
	if( $.browser['msie'] && ($.browser['version']=='7.0' || $.browser['version']=='8.0' || $.browser['version']=='9.0') ){
	   $('#messageinfonaviguateur').css('display', 'block');
	}
	else {
	   $('#messageinfonaviguateur').css('display', 'none');
	}	
	
});					


