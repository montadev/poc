var oldPOImarker;
var POIs			= 	0;

// v�rification de l'adresse sur le syst�me de cartographie, pour afficher la carte et proposer le mode seulement si les coordonn�es existent pour cette adresse
var geoCheck = function(addr) {
	var geocoder 		= new google.maps.Geocoder();

	geocoder.geocode({ 'address' : addr }, function(results,status){
	if(status == google.maps.GeocoderStatus.OK){
			var _position 	= results[0].geometry.location;
			var _latitude 	= results[0].geometry.location.lat();
			var _longitude 	= results[0].geometry.location.lng();
			$.post('../websvc/etape2_geocoding.ws.php',{ longitude : _longitude, latitude : _latitude },function(data){
				if (data['POInb']['MR']==0) {
					$('#zm1000').attr('disabled','disabled');
					$('#zm1000no').show();
					$('#zm1000date').hide();
					$('#zm1002').attr('disabled','disabled');
					$('#zm1002no').show();
					$('#zm1002date').hide();
				}
				if (data['POInb']['CHR']==0) {
					$('#zm1003').attr('disabled','disabled');
					$('#zm1003no').show();
					$('#zm1003date').hide();
					$('#zm1004').attr('disabled','disabled');
					$('#zm1004no').show();
					$('#zm1004date').hide();
				}
				if (data['POInb']['MR']==0 && data['POInb']['A2P']==0) {
					$('#zm1001').attr('disabled','disabled');
					$('#zm1001no').show();
					$('#zm1001date').hide();
				}
				if (data['POInb']['BPR']==0) {
					$('#zm1020').attr('disabled','disabled');
					$('#zm1020no').show();
					$('#zm1020date').hide();
				}
			},'json');
			$('#blockprload').hide();
			$('#blockpr').show();
	} else {
		$('#blockprload').hide();
		$('#blockprerror').show();
	}
	});
};

// v�rification de l'adresse sur le syst�me de cartographie, pour afficher la carte et proposer le mode seulement si les coordonn�es existent pour cette adresse
var geoCheckBE = function(addr) {
	var geocoder 		= new google.maps.Geocoder();

	geocoder.geocode({ 'address' : addr }, function(results,status){
	if(status == google.maps.GeocoderStatus.OK){
			var _position 	= results[0].geometry.location;
			var _latitude 	= results[0].geometry.location.lat();
			var _longitude 	= results[0].geometry.location.lng();
			$.post('../websvc/etape2_geocoding.ws.php',{ longitude : _longitude, latitude : _latitude, pays:'BE' },function(data){
				if (data['POInb']['MR']==0) {
					$('#zm46').attr('disabled','disabled');
					$('#zm46no').show();
					$('#zm46date').hide();
				}
			},'json');
			$('#blockprload').hide();
			$('#blockpr').show();
	} else {
		$('#blockprload').hide();
		$('#blockprerror').show();
	}
	});
};

// v�rification de l'adresse sur le syst�me de cartographie, pour afficher la carte et proposer le mode seulement si les coordonn�es existent pour cette adresse
var geoCheckDE = function(addr) {
	var geocoder 		= new google.maps.Geocoder();
	geocoder.geocode({ 'address' : addr }, function(results,status){
	if(status == google.maps.GeocoderStatus.OK){
			var _position 	= results[0].geometry.location;
			var _latitude 	= results[0].geometry.location.lat();
			var _longitude 	= results[0].geometry.location.lng();
			$.post('../websvc/etape2_geocoding.ws.php',{ longitude : _longitude, latitude : _latitude, pays:'DE' },function(data){
				if (data['POInb']['DPD']==0) {
					$('#zm81').attr('disabled','disabled');
					$('#zm81no').show();
					$('#zm81date').hide();
				}
			},'json');
			$('#blockprload').hide();
			$('#blockpr').show();
	} else {
		$('#blockprload').hide();
		$('#blockprerror').show();
	}
	});
};


var loadMap = function(map,addr,selected_ml){
	var geocoder 		= new google.maps.Geocoder();
	var bounds 			= new google.maps.LatLngBounds();

	var point_inputs 	= $("fieldset#point_field input.reloadPOI");
	var chrono_inputs 	= $("fieldset#chrono_field input.reloadPOI");

	var updateCheckbox = function(fiel,v){
		if(fiel == "point_field"){
			if(v){
				point_inputs.first().attr("checked","checked");
			}
			chrono_inputs.attr("checked","");
		}else{
			point_inputs.attr("checked","");
			chrono_inputs.attr("checked","checked");
		}
		point_inputs.change();
		chrono_inputs.change();
	}

	geocoder.geocode({ 'address' : addr }, function(results,status){
		$('#errMapPOI').remove();


		if(status == google.maps.GeocoderStatus.OK){
			var _position 	= results[0].geometry.location;
			var _latitude 	= results[0].geometry.location.lat();
			var _longitude 	= results[0].geometry.location.lng();

			$.post('../websvc/etape2_geocoding.ws.php',{ longitude : _longitude, latitude : _latitude},function(data){
				map.setCenter(results[0].geometry.location); // Centrage sur l'adresse de livraison du client

				var me = new google.maps.Marker({
					position	:  _position,
					map			:  map,
					icon		:  '/_themes/puzzlethemes/fr/images/design_elements/locate.png'
				});

				bounds.extend(_position);

				POF	= data['POF'];
				$.each(POF,function(k,v) {
					if ($('.proche_'+k).length) {
						$('.proche_'+k).html(v['nom']);
					}
				});

				POIs	= data['POIs'];

				var ind = 0;

				$.each(POIs,function(k,v){
					// Placage des marqueurs
					if(parseInt(v['isClosed']) == 0){
						if(ind < 6){ bounds.extend(new google.maps.LatLng(v['latitude'],v['longitude'])); }

						var POImarker 	= 	new google.maps.Marker({
												position	:  new google.maps.LatLng(v['latitude'],v['longitude']),
												map			:  map,
												icon		:  '/_themes/puzzlethemes/fr/images/design_elements/locateOn.png'
											});

						v['POImarker'] 	= POImarker; // Ajout du marker dans le tableau des POIs

						POImarker.addListener('click',function(){ selectedPOI(v); });
						infoBulle(v);
					}

					++ind;
				});

				map.fitBounds(bounds);

				stateSlideCarrousel($('.carrousel_scrolltop'));
				stateSlideCarrousel($('.carrousel_scrollbottom'));



				reloadCarrousel(POIs); // G�n�ration du carrousel_POI

				$('input[name="type_POI"]').bind('change',function(){
					updateCheckbox($(this).parent().parent("fieldset").attr("id"),true);
				});

				$('.reloadPOI').bind('change',function(){
					var el = $(this);

					if($(this).is(':checked')){
						var parent_fiel = $(this).parent().parent().parent();
						var radio_rel 	= parent_fiel.find('input[name="type_POI"]');

						if (!radio_rel.is(":checked")){
							radio_rel.attr("checked","checked");
							updateCheckbox(parent_fiel.attr("id"),false);
						}

						$.each(POIs,function(k,v){
							if(v['type'] == el.val()){ POIs[k]['POImarker'].setVisible(true); }
						});
					}else{
						$.each(POIs,function(k,v){
							if(v['type'] == el.val()){
								POIs[k]['POImarker'].setVisible(false);
								POIs[k]['iw'].close();
							}
						});
					}

					reloadCarrousel(POIs); // Reg�n�ration du carrousel_POI
				});
			},'json');
		}
	});

	$(document).on('change',':radio[name="mode_livraison"]',function(){ radioMl($(this)); });
	$(document).on('click',':radio[name="mode_livraison"]',function(){ radioMl($(this)); });

	$(document).on('click','#carrousel_POI .carrousel_elt',function(){
		$('.carrousel_selected').removeClass('carrousel_selected');

		$(this).find(':radio[name="mode_livraison"]').prop('checked',true);
		radioMl($(this).find(':radio[name="mode_livraison"]'));

		$(this).addClass('carrousel_selected');

		var IDPOI 		= $(this).attr('id').split('_')[1] + '_' + $(this).attr('id').split('_')[2]; // Position de ELT

		if(oldPOImarker){
			oldPOImarker['iw'].close();
			//oldPOImarker['POImarker'].setIcon(oldPOImarker['picto']);
		}

		POIs[IDPOI]['iw'].open(map,POIs[IDPOI]['POImarker']);
		POIs[IDPOI]['POImarker'].setIcon('/_themes/puzzlethemes/fr/images/design_elements/locateOn.png');

		oldPOImarker = POIs[IDPOI];

		selected_ml = $(this).find(':radio[name="mode_livraison"]').val();
	});

	$('#carrousel_POI').find('.carrousel_scrolltop').bind('click',function(){ slideTop($(this),300) });
	$('#carrousel_POI').find('.carrousel_scrollbottom').bind('click',function(){ slideBottom($(this),300) });
};


var loadMapBE = function(map,addr,selected_ml){
	var geocoder 		= new google.maps.Geocoder();
	var bounds 			= new google.maps.LatLngBounds();

	var point_inputs 	= $("fieldset#point_field input.reloadPOI");
	var chrono_inputs 	= $("fieldset#chrono_field input.reloadPOI");

	var updateCheckbox = function(fiel,v){
		if(fiel == "point_field"){
			if(v){
				point_inputs.first().attr("checked","checked");
			}
			chrono_inputs.attr("checked","");
		}else{
			point_inputs.attr("checked","");
			chrono_inputs.attr("checked","checked");
		}
		point_inputs.change();
		chrono_inputs.change();
	}

	geocoder.geocode({ 'address' : addr }, function(results,status){
		$('#errMapPOI').remove();


		if(status == google.maps.GeocoderStatus.OK){
			var _position 	= results[0].geometry.location;
			var _latitude 	= results[0].geometry.location.lat();
			var _longitude 	= results[0].geometry.location.lng();

			$.post('../websvc/etape2_geocoding.ws.php',{ longitude : _longitude, latitude : _latitude, pays:'BE'},function(data){
				map.setCenter(results[0].geometry.location); // Centrage sur l'adresse de livraison du client

				var me = new google.maps.Marker({
					position	:  _position,
					map			:  map,
					icon		:  '/_themes/puzzlethemes/fr/images/design_elements/locate.png'
				});

				bounds.extend(_position);

				POF	= data['POF'];
				$.each(POF,function(k,v) {
					if ($('.proche_'+k).length) {
						$('.proche_'+k).html(v['nom']);
					}
				});

				POIs	= data['POIs'];

				var ind = 0;

				$.each(POIs,function(k,v){
					// Placage des marqueurs
					if(parseInt(v['isClosed']) == 0){
						if(ind < 6){ bounds.extend(new google.maps.LatLng(v['latitude'],v['longitude'])); }

						var POImarker 	= 	new google.maps.Marker({
												position	:  new google.maps.LatLng(v['latitude'],v['longitude']),
												map			:  map,
												icon		:  '/_themes/puzzlethemes/fr/images/design_elements/locateOn.png'
											});

						v['POImarker'] 	= POImarker; // Ajout du marker dans le tableau des POIs

						POImarker.addListener('click',function(){ selectedPOI(v); });
						infoBulle(v);
					}

					++ind;
				});

				map.fitBounds(bounds);

				stateSlideCarrousel($('.carrousel_scrolltop'));
				stateSlideCarrousel($('.carrousel_scrollbottom'));



				reloadCarrousel(POIs); // G�n�ration du carrousel_POI

				$('input[name="type_POI"]').bind('change',function(){
					updateCheckbox($(this).parent().parent("fieldset").attr("id"),true);
				});

				$('.reloadPOI').bind('change',function(){
					var el = $(this);

					if($(this).is(':checked')){
						var parent_fiel = $(this).parent().parent().parent();
						var radio_rel 	= parent_fiel.find('input[name="type_POI"]');

						if (!radio_rel.is(":checked")){
							radio_rel.attr("checked","checked");
							updateCheckbox(parent_fiel.attr("id"),false);
						}

						$.each(POIs,function(k,v){
							if(v['type'] == el.val()){ POIs[k]['POImarker'].setVisible(true); }
						});
					}else{
						$.each(POIs,function(k,v){
							if(v['type'] == el.val()){
								POIs[k]['POImarker'].setVisible(false);
								POIs[k]['iw'].close();
							}
						});
					}

					reloadCarrousel(POIs); // Reg�n�ration du carrousel_POI
				});
			},'json');
		}
	});

	$(document).on('change',':radio[name="mode_livraison"]',function(){ radioMl($(this)); });
	$(document).on('click',':radio[name="mode_livraison"]',function(){ radioMl($(this)); });

	$(document).on('click','#carrousel_POI .carrousel_elt',function(){
		$('.carrousel_selected').removeClass('carrousel_selected');

		$(this).find(':radio[name="mode_livraison"]').prop('checked',true);
		radioMl($(this).find(':radio[name="mode_livraison"]'));

		$(this).addClass('carrousel_selected');

		var IDPOI 		= $(this).attr('id').split('_')[1] + '_' + $(this).attr('id').split('_')[2]; // Position de ELT

		if(oldPOImarker){
			oldPOImarker['iw'].close();
			//oldPOImarker['POImarker'].setIcon(oldPOImarker['picto']);
		}

		POIs[IDPOI]['iw'].open(map,POIs[IDPOI]['POImarker']);
		POIs[IDPOI]['POImarker'].setIcon('/_themes/puzzlethemes/fr/images/design_elements/locateOn.png');

		oldPOImarker = POIs[IDPOI];

		selected_ml = $(this).find(':radio[name="mode_livraison"]').val();
	});

	$('#carrousel_POI').find('.carrousel_scrolltop').bind('click',function(){ slideTop($(this),300) });
	$('#carrousel_POI').find('.carrousel_scrollbottom').bind('click',function(){ slideBottom($(this),300) });
};


var loadMapDE = function(map,addr,selected_ml){
    var geocoder 		= new google.maps.Geocoder();
	var bounds 			= new google.maps.LatLngBounds();

	var point_inputs 	= $("fieldset#point_field input.reloadPOI");
	var chrono_inputs 	= $("fieldset#chrono_field input.reloadPOI");

	var updateCheckbox = function(fiel,v){
		if(fiel == "point_field"){
			if(v){
				point_inputs.first().attr("checked","checked");
			}
			chrono_inputs.attr("checked","");
		}else{
			point_inputs.attr("checked","");
			chrono_inputs.attr("checked","checked");
		}
		point_inputs.change();
		chrono_inputs.change();
	}


	geocoder.geocode({ 'address' : addr }, function(results,status){
		$('#errMapPOI').remove();


		if(status == google.maps.GeocoderStatus.OK){
			var _position 	= results[0].geometry.location;
			var _latitude 	= results[0].geometry.location.lat();
			var _longitude 	= results[0].geometry.location.lng();

			$.post('../websvc/etape2_geocoding.ws.php',{ longitude : _longitude, latitude : _latitude, pays:'DE'},function(data){
				map.setCenter(results[0].geometry.location); // Centrage sur l'adresse de livraison du client

				var me = new google.maps.Marker({
					position	:  _position,
					map			:  map,
					icon		:  '/_themes/puzzlethemes/fr/images/design_elements/locate.png'
				});

				bounds.extend(_position);

				POF	= data['POF'];
				$.each(POF,function(k,v) {
					if ($('.proche_'+k).length) {
						$('.proche_'+k).html(v['nom']);
					}
				});

				POIs	= data['POIs'];

				var ind = 0;

				$.each(POIs,function(k,v){
					// Placage des marqueurs
					if(parseInt(v['isClosed']) == 0){
						if(ind < 6){ bounds.extend(new google.maps.LatLng(v['latitude'],v['longitude'])); }

						var POImarker 	= 	new google.maps.Marker({
												position	:  new google.maps.LatLng(v['latitude'],v['longitude']),
												map			:  map,
												icon		:  '/_themes/puzzlethemes/fr/images/design_elements/locateOn.png'
											});

						v['POImarker'] 	= POImarker; // Ajout du marker dans le tableau des POIs

						POImarker.addListener('click',function(){ selectedPOI(v); });
						infoBulle(v);
					}

					++ind;
				});

				map.fitBounds(bounds);

				stateSlideCarrousel($('.carrousel_scrolltop'));
				stateSlideCarrousel($('.carrousel_scrollbottom'));



				reloadCarrousel(POIs); // G�n�ration du carrousel_POI

				$('input[name="type_POI"]').bind('change',function(){
					updateCheckbox($(this).parent().parent("fieldset").attr("id"),true);
				});

				$('.reloadPOI').bind('change',function(){
					var el = $(this);

					if($(this).is(':checked')){
						var parent_fiel = $(this).parent().parent().parent();
						var radio_rel 	= parent_fiel.find('input[name="type_POI"]');

						if (!radio_rel.is(":checked")){
							radio_rel.attr("checked","checked");
							updateCheckbox(parent_fiel.attr("id"),false);
						}

						$.each(POIs,function(k,v){
							if(v['type'] == el.val()){ POIs[k]['POImarker'].setVisible(true); }
						});
					}else{
						$.each(POIs,function(k,v){
							if(v['type'] == el.val()){
								POIs[k]['POImarker'].setVisible(false);
								POIs[k]['iw'].close();
							}
						});
					}

					reloadCarrousel(POIs); // Reg�n�ration du carrousel_POI
				});
			},'json');
		}
	});

	$(document).on('change',':radio[name="mode_livraison"]',function(){ radioMl($(this)); });
	$(document).on('click',':radio[name="mode_livraison"]',function(){ radioMl($(this)); });

	$(document).on('click','#carrousel_POI .carrousel_elt',function(){
		$('.carrousel_selected').removeClass('carrousel_selected');

		$(this).find(':radio[name="mode_livraison"]').prop('checked',true);
		radioMl($(this).find(':radio[name="mode_livraison"]'));

		$(this).addClass('carrousel_selected');

		var IDPOI 		= $(this).attr('id').split('_')[1] + '_' + $(this).attr('id').split('_')[2]; // Position de ELT

		if(oldPOImarker){
			oldPOImarker['iw'].close();
			//oldPOImarker['POImarker'].setIcon(oldPOImarker['picto']);
		}

		POIs[IDPOI]['iw'].open(map,POIs[IDPOI]['POImarker']);
		POIs[IDPOI]['POImarker'].setIcon('/_themes/puzzlethemes/fr/images/design_elements/locateOn.png');

		oldPOImarker = POIs[IDPOI];

		selected_ml = $(this).find(':radio[name="mode_livraison"]').val();
	});

	$('#carrousel_POI').find('.carrousel_scrolltop').bind('click',function(){ slideTop($(this),300) });
	$('#carrousel_POI').find('.carrousel_scrollbottom').bind('click',function(){ slideBottom($(this),300) });
};


var selectedPOI		= function(POI){
	$('.carrousel_selected').removeClass('carrousel_selected');

	$('#ELT_' + POI['rang'] + '_' + POI['ID']).find(':radio[name="mode_livraison"]').prop('checked',true);

	radioMl($('#ELT_' + POI['rang'] + '_' + POI['ID']).find(':radio[name="mode_livraison"]'));

	$('#ELT_' + POI['rang'] + '_' + POI['ID']).addClass('carrousel_selected');

	var parent_grp 	= $('#ELT_' + POI['rang'] + '_' + POI['ID']).parent('.carrousel_grp');

	parent_grp.prevAll('.carrousel_grp').removeClass('carrousel_grpcurrent carrousel_grpnext')
										.addClass('carrousel_grpprevious')
										.css({ top : '488px', bottom : '-488px' });
	parent_grp.nextAll('.carrousel_grp').removeClass('carrousel_grpcurrent carrousel_grpprevious')
										.addClass('carrousel_grpnext')
										.css({ top : '-488px', bottom : '488px' });

	parent_grp.removeClass('carrousel_grpprevious carrousel_grpnext')
			  .addClass('carrousel_grpcurrent')
			  .css({ top : '20px', bottom : '20px' });

	stateSlideCarrousel($('.carrousel_scrolltop'));
	stateSlideCarrousel($('.carrousel_scrollbottom'));

	selected_ml 	= $('#ELT_' + POI['rang'] + '_' + POI['ID']).find(':radio[name="mode_livraison"]').val();
}

var radioMl	=	function(e){
	selected_ml = e.val();
	$('.carrousel_selected').removeClass('carrousel_selected');
}

var reloadCarrousel	= function(POIs){

	var types = $('input[name="z_mode_livraison"]:checked').attr('rel');

	$.each(POIs,function(k,v){

		if (jQuery.isFunction(POIs[k]['POImarker'].setVisible)) {

			if (types=='1000' || (types=='1002' && qpp==0)) {
				if(v['type'] != 'MR'){ POIs[k]['POImarker'].setVisible(false); }
				else { POIs[k]['POImarker'].setVisible(true); }
			}
			else {
				if (types=='1001') {
				if(v['type'] == 'CHR' || v['type']=='BPR' || v['type']=='MR'){ POIs[k]['POImarker'].setVisible(false); }
				else { POIs[k]['POImarker'].setVisible(true); }
				}
				else {
					if (types=='1020') {
						if(v['type'] != 'BPR'){ POIs[k]['POImarker'].setVisible(false); }
							else { POIs[k]['POImarker'].setVisible(true); }
					}
					if (types=='1003' || types=='1004') {
						if(v['type'] != 'CHR'){ POIs[k]['POImarker'].setVisible(false); }
						else { POIs[k]['POImarker'].setVisible(true); }
					}
					if (types=='1002' && qpp>0) {
						if(v['type'] != 'A2P'){ POIs[k]['POImarker'].setVisible(false); }
						else { POIs[k]['POImarker'].setVisible(true); }
					}
				}
			}

		}
	});

	$('#carrousel_POI').find('.carrousel_grp').remove(); // On vide tout

	if(typeof oldPOImarker != 'undefined'){
			oldPOImarker['iw'].close();
	}

	if (types=='1000' || (types=='1002' && qpp==0)) {
		$('.filtre_BPR').prop('checked',false);
		$('.filtre_A2P').prop('checked',false);
		$('.filtre_CHR').prop('checked',false);
		$('.filtre_MR').prop('checked',true);
	}
	if (types=='1002' && qpp>0) {
		$('.filtre_BPR').prop('checked',false);
		$('.filtre_A2P').prop('checked',true);
		$('.filtre_CHR').prop('checked',false);
		$('.filtre_MR').prop('checked',false);
	}
	if (types=='1001') {
		$('.filtre_BPR').prop('checked',false);
		$('.filtre_A2P').prop('checked',true);
		$('.filtre_CHR').prop('checked',false);
		$('.filtre_MR').prop('checked',false);
	}
	if (types=='1003' || types=='1004') {
		$('.filtre_BPR').prop('checked',false);
		$('.filtre_A2P').prop('checked',false);
		$('.filtre_CHR').prop('checked',true);
		$('.filtre_MR').prop('checked',false);
	}
	if (types=='1020') {
		$('.filtre_BPR').prop('checked',true);
		$('.filtre_A2P').prop('checked',false);
		$('.filtre_CHR').prop('checked',false);
		$('.filtre_MR').prop('checked',false);
	}


	var ind 		= 0;
	$.each(POIs,function(k,v){
		if($('.filtre_' + v['type']).is(':checked')){
			if(ind == 0 || ind%4 == 0){
				$('<div class="carrousel_grp ' + (ind == 0 ? 'carrousel_grpcurrent' : 'carrousel_grpnext') + '"></div>').appendTo('#carrousel_POI')
			}

			if(parseInt(v['isClosed']) == 1){
				$('<div id="ELT_' + k + '" class="carrousel_eltOff">' +
				  '<span class="POI_name">' + v['nom'] + '</span>' +
				  '<span class="POI_adresse">' + v['adresse1'] + '</span>' +
				  '<span class="POI_adresse">' + v['adresse2'] + '</span>' +
				  '<span class="POI_adresse">' + v['adresse3'] + '</span>' +
				  '<span class="POI_adresse">' + v['cp'] + ' ' + v['ville'] + '</span>' +
				  '<span class="POI_distance">' + v['distance'] + ' km</span>' +
				  '<div class="POI_close" style="bottom:3px; left:2px" title="En cong\351s"></div>' +
				   (parseInt(v['mobilite']) == 1 ? '<div class="POI_handicap" style="bottom:3px; left:26px"></div>' : '') +
				  '</div>').appendTo('.carrousel_grp:last');
			}else{
				$('<div id="ELT_' + k + '" class="carrousel_elt">' +
				  '<input tabindex="0" class="POI_radio portableRequis" type="radio" ' + ((selected_ml ==  (v['modelivraison'] + '_' + k) || selected_ml ==  (v['modelivraison'] + '_' + v['ID'])) ? '' : '') + ' name="mode_livraison" value="' + v['modelivraison'] + '_' + v['ID'] + '" />' +
				  '<span class="POI_name">' + v['nom'] + '</span>' +
				  '<span class="POI_adresse">' + v['adresse1'] + '</span>' +
				  '<span class="POI_adresse">' + v['adresse2'] + '</span>' +
				  '<span class="POI_adresse">' + v['adresse3'] + '</span>' +
				  '<span class="POI_adresse">' + v['cp'] + ' ' + v['ville'] + '</span>' +
				  '<span class="POI_distance">' + v['distance'] + ' km</span>' +
				  (parseInt(v['mobilite']) == 1 ? '<div class="POI_handicap" style="bottom:3px; left:2px"></div>' : '') +
				  '</div>').appendTo('.carrousel_grp:last');
			}

			if(selected_ml == (v['modelivraison'] + '_' + k)){ selectedPOI(POIs[v['ID']]); }

			$('#ELT_' + k).on('keydown', 'input[type="radio"]', function(event) {
				if (event.key === 'Enter') {
						$(this).prop('checked', true).trigger('change');
				}
			});

			++ind;
		}
	});

	stateSlideCarrousel($('.carrousel_scrolltop'));
	stateSlideCarrousel($('.carrousel_scrollbottom'));
}

var slideTop 	= function(ui,decal){
	var parent = ui.parents('.carrousel');

	if(parent.find('.carrousel_grpprevious').length > 0){
		parent.find('.carrousel_grpcurrent').stop().animate({ top:decal,bottom:-decal},300,function(){
			$(this).removeClass('carrousel_grpcurrent').addClass('carrousel_grpnext');
			stateSlideCarrousel(ui);
		});
		parent.find('.carrousel_grpprevious:last').stop().animate({ top:'20',bottom:'20'},300,function(){
			$(this).removeClass('carrousel_grpprevious').addClass('carrousel_grpcurrent');
			stateSlideCarrousel(ui);
		});
	}
}

var slideBottom 	= function(ui,decal){
	var parent = ui.parents('.carrousel');

	if(parent.find('.carrousel_grpnext').length > 0){
		parent.find('.carrousel_grpcurrent').stop().animate({ top:-decal,bottom:decal},300,function(){
			$(this).removeClass('carrousel_grpcurrent').addClass('carrousel_grpprevious');
			stateSlideCarrousel(ui);
		});
		parent.find('.carrousel_grpnext:first').stop().animate({ top:'20',bottom:'20'},300,function(){
			$(this).removeClass('carrousel_grpnext').addClass('carrousel_grpcurrent');
			stateSlideCarrousel(ui);
		});
	}
}

var stateSlideCarrousel = function(ui){
	var parent = ui.parents('.carrousel');

	if(parent.find('.carrousel_grpnext').length > 0){
		parent.find('.carrousel_scrollbottom').removeClass('carrousel_scrollbottom_end');
	}else{
		parent.find('.carrousel_scrollbottom').addClass('carrousel_scrollbottom_end');
	}

	if(parent.find('.carrousel_grpprevious').length > 0){
		parent.find('.carrousel_scrolltop').removeClass('carrousel_scrolltop_end');
	}else{
		parent.find('.carrousel_scrolltop').addClass('carrousel_scrolltop_end');
	}
}

var infoBulle = function(_marker){
	_marker['iw'] = new google.maps.InfoWindow({ content : 	'<div style="padding:10px">' +
																(parseInt(_marker['mobilite']) == 1 ? '<div class="POI_handicap" style="top:34px; left:10px"></div>' : '') +
																'<strong ' + (parseInt(_marker['mobilite']) == 1 ? 'style="padding-left:30px;"' : '') + '>' + _marker['nom'] + '</strong>' +
																'<br />' +
																'<br />' +
																'<span style="display:block; ' + (parseInt(_marker['mobilite']) == 1 ? 'padding-left:30px;' : '') + ' color:#666">' + _marker['HO'].replace(" ","&nbsp;") + '</span>' +
																'<strong style="display:block; margin-top:5px; ' + (parseInt(_marker['mobilite']) == 1 ? 'padding-left:30px;' : '') + ' color:#666">' + _marker['FE'] + '</strong>' +
															'</div>' });

	google.maps.event.addListener(_marker['POImarker'],'click',function(){
		if(typeof oldPOImarker != 'undefined'){
			oldPOImarker['iw'].close();
			//oldPOImarker['POImarker'].setIcon(oldPOImarker['picto']);
		}

		_marker['iw'].open(map,_marker['POImarker']);
		_marker['POImarker'].setIcon('/_themes/puzzlethemes/fr/images/design_elements/locateOn.png');

		oldPOImarker = _marker;
	});
}
