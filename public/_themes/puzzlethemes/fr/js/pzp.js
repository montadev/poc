
function ias_update(v) {
				var t=v.split(';');
				if ($('#paysage').hasClass('selected')) { var tmp=t[1]; t[1]=t[2]; t[2]=tmp; }
				if (t[2]>0 && window.location.href.includes('etape=3') == false ) {
					var select = ias.getSelection(true);
					var ax = 0 ;
					var ay = 0 ;
					select.x1=0;
					select.x2=$('#img_area').width();
					select.y1=0;
					select.y2=parseInt(select.x2/(t[1]/t[2]));
					ax = select.x2; ay = select.y2;

					if (select.y2 > $('#img_area').height()) {
						select.y2 = $('#img_area').height();
						select.x2 = parseInt(select.y2 * (t[1]/t[2]));
						ax = select.x2; ay = select.y2;
						var margin = parseInt(($('#img_area').width()-select.x2)/2);
						select.x1 += margin;
						select.x2 += margin;

					} else {
						var margin = parseInt(($('#img_area').height()-select.y2)/2);
						select.y1 += margin;
						select.y2 += margin;
					}
					ias.setOptions({aspectRatio: ax+':'+ay});
					ias.animateSelection(select.x1,select.y1,select.x2-1,select.y2-1, 'false');
					ias.update();
					$('#frm_etape input[name=x1]').val(select.x1);
					$('#frm_etape input[name=x2]').val(select.x2);
					$('#frm_etape input[name=y1]').val(select.y1);
					$('#frm_etape input[name=y2]').val(select.y2);
					maj_quality(select);
					$('img.heartmask').remove();
					$('div.linemarge1').remove();
					$('div.linemarge2').remove();
					$('div.linemarge3').remove();
					$('div.linemarge4').remove();
					$('div.linemarge5').remove();
					$('div.linemarge6').remove();
					$('div.linemargehp1').remove();
					$('div.linemargehp2').remove();

					$('img.margesecuritymask').remove();
					$('div.positionsecurity').remove();

					var x = $('input[name=pzp_type]:checked').val().split(';');
					if (x[3]==240) {
						var ver = '';
						if ($('#paysage').hasClass('selected')) { ver = '_v'; }
						$('div.imgareaselect-selection').append('<img style="width:100%" src="/pzp/heart_mask'+ver+'.png" class="heartmask "/>');
					}
					if (x[0]==53706) {
						$('div.imgareaselect-selection').append('<img style="width:100%" src="/pzp/round_mask.png" class="heartmask "/>');
					}

					if (x[3] != 240 && x[0] != 53706){
						var ver = '';
						var position = '15%';
						if ($('#paysage').hasClass('selected')) { ver = '-v'; position = '10%'; }
						//$('div.imgareaselect-selection').append('<div style="padding-left: '+position+';" class="positionsecurity"><a href="#" data-toggle="tooltip" data-placement="bottom"  title="'+local_msg_marge_securite+'" style="z-index:99999;cursor:pointer;display:block;position: absolute; height: 15px; color: #FCFCFC; font-size: 10px; ">'+local_lien_marge_securite+'</a></div><img style="width:100%;height:100%;opacity: 0.8;" src="/pzp/filet-security-mask'+ver+'.png"  class="margesecuritymask "/>');
						//$('div.imgareaselect-selection').append('<div style="padding-left: '+position+';" class="positionsecurity"></div><img style="width:100%;height:100%;opacity: 0.8;" src="/pzp/filet-security-mask'+ver+'.png"  class="margesecuritymask" />');

						if($('#idSite').val()!='2') {
							$('body').append('<div class="linemarge1" style="height:1px; width:1px; border-bottom: 1px dashed #000000; position:absolute; -moz-transform-origin:0% 0%; -webkit-transform-origin:0% 0%; transform-origin:0% 0%;"></div>');
							$('body').append('<div class="linemarge2" style="height:1px; width:1px; border-bottom: 1px dashed #000000; position:absolute; -moz-transform-origin:0% 0%; -webkit-transform-origin:0% 0%; transform-origin:0% 0%;"></div>');
							$('body').append('<div class="linemarge3" style="height:1px; width:1px; border-bottom: 1px dashed #000000; position:absolute; -moz-transform-origin:0% 0%; -webkit-transform-origin:0% 0%; transform-origin:0% 0%;"></div>');
							$('body').append('<div class="linemarge4" style="height:1px; width:1px; border-bottom: 1px dashed #000000; position:absolute; -moz-transform-origin:0% 0%; -webkit-transform-origin:0% 0%; transform-origin:0% 0%;"></div>');
							$('body').append('<div class="linemarge5" style="height:1px; width:1px; border-bottom: 1px dashed #000000; position:absolute; -moz-transform-origin:0% 0%; -webkit-transform-origin:0% 0%; transform-origin:0% 0%;"></div>');
							$('body').append('<div class="linemarge6" style="height:1px; width:1px; border-bottom: 1px dashed #000000; position:absolute; -moz-transform-origin:0% 0%; -webkit-transform-origin:0% 0%; transform-origin:0% 0%;"></div>');
							$('body').append('<div class="linemargehp1" style="height:1px; width:1px; border-bottom: 1px dashed #000000; position:absolute; -moz-transform-origin:0% 0%; -webkit-transform-origin:0% 0%; transform-origin:0% 0%;"></div>');
							$('body').append('<div class="linemargehp2" style="height:1px; width:1px; border-bottom: 1px dashed #000000; position:absolute; -moz-transform-origin:0% 0%; -webkit-transform-origin:0% 0%; transform-origin:0% 0%;"></div>');
						} else {
							$('body').append('<div class="linemarge1" style="height:1px; width:1px; border-bottom: 1px dashed #9E360E; position:absolute; -moz-transform-origin:0% 0%; -webkit-transform-origin:0% 0%; transform-origin:0% 0%;"></div>');
							$('body').append('<div class="linemargehp2" style="height:1px; width:1px; border-bottom: 1px dashed #9E360E; position:absolute; -moz-transform-origin:0% 0%; -webkit-transform-origin:0% 0%; transform-origin:0% 0%;"></div>');
							$('body').append('<div class="linemarge3" style="height:1px; width:1px; border-bottom: 1px dashed #9E360E; position:absolute; -moz-transform-origin:0% 0%; -webkit-transform-origin:0% 0%; transform-origin:0% 0%;"></div>');
						}


						/*$('div.imgareaselect-selection').css({
							'border': 'white solid 10px',
							'opacity':0.5,
							'box-sizing': 'border-box',
							'-moz-box-sizing': 'border-box',
							'-webkit-box-sizing': 'border-box'
						});*/

						$('[data-toggle="tooltip"]').tooltip();
					}
					if (x[3] >= 2000 || x[0]==53706 || x[3]==240) {
						$('.linemarge1').css({
							'visibility' : 'hidden'
						});
						$('.linemarge2').css({
							'visibility' : 'hidden'
						});
						$('.linemarge3').css({
							'visibility' : 'hidden'
						});
						$('.linemarge4').css({
							'visibility' : 'hidden'
						});
						$('.linemarge5').css({
							'visibility' : 'hidden'
						});
						$('.linemarge6').css({
							'visibility' : 'hidden'
						});
						$('#btnmarge').css({
							'visibility' : 'hidden'
						});
						$('#btnmarge2').css({
							'visibility' : 'hidden'
						});
						if($('#idSite').val()!='2') {
							$('body').append('<div class="linemargehp1" style="height:1px; width:1px; border-bottom: 1px dashed #000000; position:absolute; -moz-transform-origin:0% 0%; -webkit-transform-origin:0% 0%; transform-origin:0% 0%;"></div>');
							$('body').append('<div class="linemargehp2" style="height:1px; width:1px; border-bottom: 1px dashed #000000; position:absolute; -moz-transform-origin:0% 0%; -webkit-transform-origin:0% 0%; transform-origin:0% 0%;"></div>');
						} else {
							$('body').append('<div class="linemargehp2" style="height:1px; width:1px; border-bottom: 1px dashed #9E360E; position:absolute; -moz-transform-origin:0% 0%; -webkit-transform-origin:0% 0%; transform-origin:0% 0%;"></div>');
						}


					} else {
						$('#btnmarge').css({
							'visibility' : 'visible'
						});
						$('#btnmarge2').css({
							'visibility' : 'visible'
						});
					}
					draw_security_lines(select);
				}
				//draw_security_lines();

}
/*function draw_security_lines(){

	if ($('#btnmarge').length > 0) {
		var marge1top = $('#btnmarge').offset().top+$('#btnmarge').outerHeight();
		var marge1left = $('#btnmarge').offset().left+$('#btnmarge').outerWidth()/2;
		var marge1width = $('div.imgareaselect-selection').offset().top-$('#btnmarge').offset().top-$('#btnmarge').outerHeight();
		var marge2top = marge1top+marge1width;
		var marge2left = marge1left;
		var marge2width = 0;
		if ($('div.imgareaselect-selection').offset().left > marge1left) {
			marge2width = $('div.imgareaselect-selection').offset().left-marge1left;
		}
		var marge3top = $('#btnmarge2').offset().top;
		var marge3left = $('#btnmarge2').offset().left+$('#btnmarge2').outerWidth()/2;
		var marge3width = $('#btnmarge2').offset().top-$('div.imgareaselect-selection').offset().top-$('div.imgareaselect-selection').height();
		var marge4top = marge3top-marge3width;
		var marge4left = marge3left;
		var marge4width = 0;
		if ($('div.imgareaselect-selection').offset().left+$('div.imgareaselect-selection').width() < marge3left) {
			marge4width = marge3left-$('div.imgareaselect-selection').offset().left-$('div.imgareaselect-selection').width();
		}

		$('.linemarge1').css({
			top: marge1top,
			left: marge1left,
			width: marge1width,
			height: 1,
			'transform-origin': '0 0',
			'-webkit-transform': 'rotate(90deg)',
			'-moz-transform': 'rotate(90deg)',
			'-ms-transform': 'rotate(90deg)',
			'-o-transform': 'rotate(90deg)',
			'transform': 'rotate(90deg)',
			'zoom': 1
		});
		$('.linemarge2').css({
			top: marge2top,
			left: marge2left,
			width: marge2width,
			height: 1
		});
		$('.linemarge3').css({
			top: marge3top,
			left: marge3left,
			width: marge3width,
			height: 1,
			'transform-origin': '0 0',
			'-webkit-transform': 'rotate(270deg)',
			'-moz-transform': 'rotate(270deg)',
			'-ms-transform': 'rotate(270deg)',
			'-o-transform': 'rotate(270deg)',
			'transform': 'rotate(270deg)',
			'zoom': 1
		});
		$('.linemarge4').css({
			top: marge4top,
			left: marge4left,
			width: marge4width,
			height: 1,
			'transform-origin': '0 0',
			'-webkit-transform': 'rotate(180deg)',
			'-moz-transform': 'rotate(180deg)',
			'-ms-transform': 'rotate(180deg)',
			'-o-transform': 'rotate(180deg)',
			'transform': 'rotate(180deg)',
			'zoom': 1
		});
	}
	var x = $('input[name=pzp_type]:checked').val().split(';');
	var longcm,largcm,longimg, largimg;

	if (x[1] > x[2]) {
		longcm = x[1];
		largcm = x[2];
	} else {
		longcm = x[2];
		largcm = x[1];
	}
	var bordersecuhautbas,bordersecugauchedroit;
	if ($('div.imgareaselect-selection').width() > $('div.imgareaselect-selection').height()) {
		longimg = $('div.imgareaselect-selection').width();
		largimg = $('div.imgareaselect-selection').height();
		bordersecuhautbas = Math.round((4.0/(largcm*10))*largimg);
		bordersecugauchedroit = Math.round((4.0/(longcm*10))*longimg);

	} else {
		longimg = $('div.imgareaselect-selection').height();
		largimg = $('div.imgareaselect-selection').width();
		bordersecuhautbas = Math.round((4.0/(longcm*10))*longimg);
		bordersecugauchedroit = Math.round((4.0/(largcm*10))*largimg);
	}
	$('div.bordersecurity2').remove();
	$('div.bordersecurity1').remove();
	$('div.imgareaselect-selection').append('<div class="bordersecurity1" style="width:100%; height:100%;border-width:'+bordersecuhautbas+'px '+bordersecugauchedroit+'px '+bordersecuhautbas+'px '+bordersecugauchedroit+'px; border-style: solid; border-color:#333333 ;opacity:0.3;box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box; display: block;"></div>');
	$('div.bordersecurity1').append('<div class="bordersecurity2"  style="width:'+($('div.bordersecurity1').width()-1)+'px; height:'+($('div.bordersecurity1').height()-1)+'px;border:1px dashed white; display: block;"></div>');
}*/
function draw_security_lines(selection){

	if ($('#btnmarge').length > 0) {
		//console.log(selection);
		//console.log(selection.x1);
		var marge11top = $('#btnmarge').offset().top+$('#btnmarge').outerHeight()/2;
		var marge11left = $('#btnmarge').offset().left+$('#btnmarge').outerWidth();
		var marge11width = ($('#idSite').val() != '2') ? 100 : -$('#btnmarge').outerWidth() + 3;
		var marge1top = marge11top+3;
		var marge1left = marge11left + ($('#idSite').val() != '2' ? marge11width : 0);
		var marge1width = $('.imgareaselect-outer').offset().top + (($('#idSite').val() !== '2') ? selection.y1 : 0) - marge1top;
		var marge2top = marge1top+marge1width;
		var marge2left = marge1left;
		var marge2width = 0;
		if ($('.imgareaselect-outer').offset().left+selection.x1 > marge2left) {
			marge2width = $('.imgareaselect-outer').offset().left+selection.x1-marge2left;
		}
		var marge22top = $('#btnmarge2').offset().top+$('#btnmarge2').outerHeight()/2;
		var marge22left = $('#btnmarge2').offset().left + (($('#idSite').val() === '2') ? $('#btnmarge2').outerWidth()-3 : 0);
		var marge22width = marge22left-($('#img_area').offset().left+$('#img_area').width()/2);
		var marge3top = marge22top-3;
		var marge3left = marge22left;
		var marge3width = marge3top-$('.imgareaselect-outer').offset().top-selection.y1-(selection.y2-selection.y1);
		var marge4top = marge3top-marge3width;
		var marge4left = marge3left;
		var marge4width = 0;
		if ($('.imgareaselect-outer').offset().left+selection.x1+(selection.x2-selection.x1) < marge4left) {
			marge4width = marge4left-$('.imgareaselect-outer').offset().left-selection.x1-(selection.x2-selection.x1);
		}
		var marge5top = $('#btnmarge3').offset().top+$('#btnmarge3').outerHeight()/2;
		var marge5left = $('#btnmarge3').offset().left;
		var marge5width = marge5left-$('#img_area').offset().left;
		var marge6top = marge5top-3;
		var marge6left = ($('#idSite').val() != '2') ? marge5left-marge5width : marge5left+$('#btnmarge3').outerWidth()-4;
		var marge6width = marge6top-$('#img_area').offset().top-$('#img_area').height();



		$('.linemarge1').css({
			top: marge1top,
			left: marge1left,
			width: marge1width,
			height: 1,
			'transform-origin': '0 0',
			'-webkit-transform': 'rotate(90deg)',
			'-moz-transform': 'rotate(90deg)',
			'-ms-transform': 'rotate(90deg)',
			'-o-transform': 'rotate(90deg)',
			'transform': 'rotate(90deg)',
			'zoom': 1
		});
		$('.linemarge2').css({
			top: marge2top,
			left: marge2left,
			width: marge2width,
			height: 1,
			'transform-origin': '0 0',
			'-webkit-transform': 'rotate(0deg)',
			'-moz-transform': 'rotate(0deg)',
			'-ms-transform': 'rotate(0deg)',
			'-o-transform': 'rotate(0deg)',
			'transform': 'rotate(0deg)',
			'zoom': 1
		});
		$('.linemarge3').css({
			top: marge3top,
			left: marge3left,
			width: marge3width,
			height: 1,
			'transform-origin': '0 0',
			'-webkit-transform': 'rotate(270deg)',
			'-moz-transform': 'rotate(270deg)',
			'-ms-transform': 'rotate(270deg)',
			'-o-transform': 'rotate(270deg)',
			'transform': 'rotate(270deg)',
			'zoom': 1
		});
		$('.linemarge4').css({
			top: marge4top,
			left: marge4left,
			width: marge4width,
			height: 1,
			'transform-origin': '0 0',
			'-webkit-transform': 'rotate(180deg)',
			'-moz-transform': 'rotate(180deg)',
			'-ms-transform': 'rotate(180deg)',
			'-o-transform': 'rotate(180deg)',
			'transform': 'rotate(180deg)',
			'zoom': 1
		});
		$('.linemarge5').css({
			top: marge11top,
			left: marge11left,
			width: marge11width,
			height: 1,
			'transform-origin': '0 0',
			'-webkit-transform': 'rotate(0deg)',
			'-moz-transform': 'rotate(0deg)',
			'-ms-transform': 'rotate(0deg)',
			'-o-transform': 'rotate(0deg)',
			'transform': 'rotate(0deg)',
			'zoom': 1
		});
		$('.linemarge6').css({
			top: marge22top,
			left: marge22left,
			width: marge22width,
			height: 1,
			'transform-origin': '0 0',
			'-webkit-transform': 'rotate(180deg)',
			'-moz-transform': 'rotate(180deg)',
			'-ms-transform': 'rotate(180deg)',
			'-o-transform': 'rotate(180deg)',
			'transform': 'rotate(180deg)',
			'zoom': 1
		});
		if($('#idSite').val()!='2') {
			$('.linemargehp1').css({
				top: marge5top,
				left: marge5left,
				width: marge5width,
				height: 1,
				'transform-origin': '0 0',
				'-webkit-transform': 'rotate(180deg)',
				'-moz-transform': 'rotate(180deg)',
				'-ms-transform': 'rotate(180deg)',
				'-o-transform': 'rotate(180deg)',
				'transform': 'rotate(180deg)',
				'zoom': 1
			});
		}
		$('.linemargehp2').css({
			top: marge6top,
			left: marge6left,
			width: marge6width,
			height: 1,
			'transform-origin': '0 0',
			'-webkit-transform': 'rotate(270deg)',
			'-moz-transform': 'rotate(270deg)',
			'-ms-transform': 'rotate(270deg)',
			'-o-transform': 'rotate(270deg)',
			'transform': 'rotate(270deg)',
			'zoom': 1
		});

		if (marge4left-marge4width < marge2left) {
			marge2width = marge2left-marge4left+marge4width;
			$('.linemarge2').css({
				top: marge2top,
				left: marge2left,
				width: marge2width,
				height: 1,
				'transform-origin': '0 0',
				'-webkit-transform': 'rotate(180deg)',
				'-moz-transform': 'rotate(180deg)',
				'-ms-transform': 'rotate(180deg)',
				'-o-transform': 'rotate(180deg)',
				'transform': 'rotate(180deg)',
				'zoom': 1
			});
		} else if (marge2left+marge2width > marge4left) {
			marge4width = marge2left+marge2width - marge4left;
			$('.linemarge4').css({
				top: marge4top,
				left: marge4left,
				width: marge4width,
				height: 1,
				'transform-origin': '0 0',
				'-webkit-transform': 'rotate(0deg)',
				'-moz-transform': 'rotate(0deg)',
				'-ms-transform': 'rotate(0deg)',
				'-o-transform': 'rotate(0deg)',
				'transform': 'rotate(0deg)',
				'zoom': 1
			});
		}
	}
	if($('#idSite').val()=='14'){
		$('.linemarge1').css('display','none');
		$('.linemarge2').css('display','none');
		$('.linemarge5').css('display','none');
		$('#btnmarge').css('display','none');

	}
	var x = $('input[name=pzp_type]:checked').val().split(';');
	var longcm,largcm,longimg, largimg;

	if (x[1] > x[2]) {
		longcm = x[1];
		largcm = x[2];
	} else {
		longcm = x[2];
		largcm = x[1];
	}
	var bordersecuhautbas,bordersecugauchedroit;
	if ((selection.x2-selection.x1) > (selection.y2-selection.y1)) {
		longimg = (selection.x2-selection.x1);
		largimg = (selection.y2-selection.y1);
		bordersecuhautbas = Math.round((4.0/(largcm*10))*largimg);
		bordersecugauchedroit = Math.round((4.0/(longcm*10))*longimg);

	} else {
		longimg = (selection.y2-selection.y1);
		largimg = (selection.x2-selection.x1);
		bordersecuhautbas = Math.round((4.0/(longcm*10))*longimg);
		bordersecugauchedroit = Math.round((4.0/(largcm*10))*largimg);
	}

	$('div.bordersecurity2').remove();
	$('div.bordersecurity1').remove();
	if (x[3] < 2000 && x[0]!=53706 && x[3]!=240) {
		if (idSite == 2){
			$('div.imgareaselect-selection').append('<div class="bordersecurity1" style="width:100%; height:100%;border-width:'+bordersecuhautbas+'px '+bordersecugauchedroit+'px '+bordersecuhautbas+'px '+bordersecugauchedroit+'px;  border-style: solid; border-color:#FF780F ;box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box; display: block;"></div>');
		} else {
			$('div.imgareaselect-selection').append('<div class="bordersecurity1" style="width:100%; height:100%;border-width:'+bordersecuhautbas+'px '+bordersecugauchedroit+'px '+bordersecuhautbas+'px '+bordersecugauchedroit+'px; border-style: solid; border-color:#333333 ;opacity:0.3;box-sizing:border-box;-moz-box-sizing:border-box;-webkit-box-sizing:border-box; display: block;"></div>');
		}
		$('div.bordersecurity1').append('<div class="bordersecurity2"  style="width:'+($('div.bordersecurity1').width()-1)+'px; height:'+($('div.bordersecurity1').height()-1)+'px;border:1px dashed white; display: block;"></div>');
	}
}

function maj_quality(selection) {
				var x = $('input[name=pzp_type]:checked').val().split(';');
				if ($('#paysage').hasClass('selected')) { var tmp = x[1]; x[1] = x[2]; x[2] = tmp; }
				var pw = x[1]/2.51;
				var ph = x[2]/2.51;
				if (pw>0 && ph>0) {
					var dpw = rw/$('#img_area').width()*(selection.x2-selection.x1)/pw;
					var dph = rh/$('#img_area').height()*(selection.y2-selection.y1)/ph;
					var dp = dpw;
					if (dph<dp) { dp=dph; }
					star(0);
					$('#q_txt').html(local_pzp_q0);
					$('#q_img_warning').hide();
					if (dp>=110) { star(4); $('#q_txt').html(local_pzp_q4);}
					else { if (dp>=85) { star(3); $('#q_txt').html(local_pzp_q3);}
						else { if (dp>=65) { star(2); $('#q_txt').html(local_pzp_q2); $('#q_img_warning').show(); }
							else { if (dp>=45) { star(1); $('#q_txt').html(local_pzp_q1); $('#q_img_warning').show(); }
							}
						}
					}
				}
}


function star(nb) {

	for(var i=1;i<5;i++) {
		if (i<=nb) {
		$('#star'+i).attr('src','/_themes/puzzlethemes/fr/images/pp/star.png');
		} else {
		$('#star'+i).attr('src','/_themes/puzzlethemes/fr/images/pp/star_off.png');
		}
	}
}



function getprixpack() {
		if ($('input[name="pzp_type"]:checked').length) {
			if ($('input[name="pzp_type"]:checked').length && $('#sq').length && $('#pzp_type_list').length) {
				$.post('/pzp/prix.php',{nbp:$('input[name="pzp_type"]:checked').val().split(';')[3],qte:$('#sq').val(),format:($('#pzp_type_list').val()==2 ? 'A6':'A5'),type:'Perso'},function(data) {
				if (data) {
				//if (data.prix>0) {
					$('#prix-pack').html(local_prix+' : '+data.prix+' &euro;');
				//} else { $('#prix-pack').html(''); }
				}
				},"json");
			}
		}
}


function dialogPageLoad() {
	//$.colorbox({inline:true, transition:'none', href:'#dialog-page-load', closeButton:false, width:"50%", height:"150"});

	$.colorbox({inline:true, href:'#dialog-page-load-page', closeButton:(idSite == 2) ? true : false, width:"382", height:"250",overlayClose:false,escKey:false,onCleanup: function() { if (idSite == 2) { handleModalClose(); } },onClosed: function() { if (idSite == 2) { handleModalClose(); } }});
}

function dialogEndPageLoad() {
	//$.colorbox({inline:true, transition:'none', href:'#dialog-page-load', closeButton:false, width:"50%", height:"150"});

	$.colorbox({inline:true, href:'#dialog-page-load-page-end', closeButton:(idSite == 2) ? true : false, width:"382", height:"250",overlayClose:false,escKey:false,onCleanup: function() { if (idSite == 2) { handleModalClose(); } },onClosed: function() { if (idSite == 2) { handleModalClose(); } }});
}

function closeDialogPageLoad() {
	$.colorbox.close();
}

var noUploadProgress = (function () {
        if (navigator.userAgent.match(/(Android)|(Windows Phone)|(XBLWP)|(ZuneWP)|(w(eb)?OSBrowser)|(webOS)|(Kindle\/(1.0|2.0|2.5|3.0))/)) {
          return true;
        }
        return false;
})();


	$('.click-open-dialog').click(function(){
		$.colorbox({width:$(this).data('width'),height:$(this).data('height'),href:$(this).data('url'),iframe:$(this).data('iframe')});
	});

function raz(){
ias = $('#img_area').imgAreaSelect({ aspectRatio: '1:1', handles: true, persistent:true, x1: 0, y1: 0, x2: 100, y2: 100, instance:true,
			onInit:function() {
				$('div.liste_modeles input').click(function() {
					ias_update($(this).val());
				});

				$('div.liste_'+$('#pzp_type_list').val()).show();
				$('#pzp_liste_loader').hide();
				if ($('#frm_etape input[name="ref"]').val()!='') {
					$('input[name="pzp_type"]').each(function() {
						var v = $(this).val().split(';')[0];
						if (v==$('#frm_etape input[name="ref"]').val()) {
							$(this).parent('div').click();
						}
					});
				} else {
					$('input.premier_1').parent('div').click();
				}
				if ($('#prix-pack').length) {
					$('#pzp_type_list').change(function() {
					$('#divsq').html(quantites[$('#pzp_type_list').val()]);
						getprixpack();
					});

					$('input.premier_2').parent('div').click();
				}
			},
			onSelectEnd: function (img, selection) {
				$('#frm_etape input[name=x1]').val(selection.x1);
				$('#frm_etape input[name=x2]').val(selection.x2);
				$('#frm_etape input[name=y1]').val(selection.y1);
				$('#frm_etape input[name=y2]').val(selection.y2);
				maj_quality(selection);
				draw_security_lines(selection);
			},
			onSelectChange: function (img, selection) {
				draw_security_lines(selection);
			}
		});

}


;(function($) {

    var b64 = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/",
        a256 = '',
        r64 = [256],
        r256 = [256],
        i = 0;

    var UTF8 = {

        encode: function(strUni) {
            var strUtf = strUni.replace(/[\u0080-\u07ff]/g,
            function(c) {
                var cc = c.charCodeAt(0);
                return String.fromCharCode(0xc0 | cc >> 6, 0x80 | cc & 0x3f);
            })
            .replace(/[\u0800-\uffff]/g,
            function(c) {
                var cc = c.charCodeAt(0);
                return String.fromCharCode(0xe0 | cc >> 12, 0x80 | cc >> 6 & 0x3F, 0x80 | cc & 0x3f);
            });
            return strUtf;
        },

        decode: function(strUtf) {
            var strUni = strUtf.replace(/[\u00e0-\u00ef][\u0080-\u00bf][\u0080-\u00bf]/g,
            function(c) {
                var cc = ((c.charCodeAt(0) & 0x0f) << 12) | ((c.charCodeAt(1) & 0x3f) << 6) | (c.charCodeAt(2) & 0x3f);
                return String.fromCharCode(cc);
            })
            .replace(/[\u00c0-\u00df][\u0080-\u00bf]/g,
            function(c) {
                var cc = (c.charCodeAt(0) & 0x1f) << 6 | c.charCodeAt(1) & 0x3f;
                return String.fromCharCode(cc);
            });
            return strUni;
        }
    };

    while(i < 256) {
        var c = String.fromCharCode(i);
        a256 += c;
        r256[i] = i;
        r64[i] = b64.indexOf(c);
        ++i;
    }

    function code(s, discard, alpha, beta, w1, w2) {
        s = String(s);
        var buffer = 0,
            i = 0,
            length = s.length,
            result = '',
            bitsInBuffer = 0;

        while(i < length) {
            var c = s.charCodeAt(i);
            c = c < 256 ? alpha[c] : -1;

            buffer = (buffer << w1) + c;
            bitsInBuffer += w1;

            while(bitsInBuffer >= w2) {
                bitsInBuffer -= w2;
                var tmp = buffer >> bitsInBuffer;
                result += beta.charAt(tmp);
                buffer ^= tmp << bitsInBuffer;
            }
            ++i;
        }
        if(!discard && bitsInBuffer > 0) result += beta.charAt(buffer << (w2 - bitsInBuffer));
        return result;
    }

    var Plugin = $.base64 = function(dir, input, encode) {
            return input ? Plugin[dir](input, encode) : dir ? null : this;
        };

    Plugin.btoa = Plugin.encode = function(plain, utf8encode) {
        plain = Plugin.raw === false || Plugin.utf8encode || utf8encode ? UTF8.encode(plain) : plain;
        plain = code(plain, false, r256, b64, 8, 6);
        return plain + '===='.slice((plain.length % 4) || 4);
    };

    Plugin.atob = Plugin.decode = function(coded, utf8decode) {
        coded = String(coded).split('=');
        var i = coded.length;
        do {--i;
            coded[i] = code(coded[i], true, r64, a256, 6, 8);
        } while (i > 0);
        coded = coded.join('');
        return Plugin.raw === false || Plugin.utf8decode || utf8decode ? UTF8.decode(coded) : coded;
    };
}(jQuery));

$(function() {

		if (document.getElementById('idSite')){
				var idSite = document.getElementById('idSite').value;
		}else{
				var idSite = 0;
		}

		$('#back_etape_colle').click(function() {

			$('#frm_etape input[name=etape]').val('3');
			$('#frm_etape').submit();
		});


		$('#telecharger-image-pp').click(function() { $('#ifile').click(); });

		var currentRequest = null;
		var modalClosed = false;

		$('#file_upload-accueil').fileUploadUI({
			uploadTable: $('#files'),
			downloadTable: $('#files'),
			buildUploadRow: function (files, index) {
				modalClosed = false;

				if (/Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent)) {
					$.colorbox({
						reposition: true,
						top: 0,
						left: 0,
						closeButton: (idSite == 2) ? true : false,
						transition: 'none',
						speed: '50',
						inline: true,
						href: "#dialog-telecharger",
						onCleanup: function () {
							if (idSite == 2) {
								handleModalClose();
							}
						},
						onClosed: function () {
							if (idSite == 2) {
								handleModalClose();
							}
						}
					}).fadeIn(100);
				} else {
					$.colorbox({
						inline: true,
						href: '#dialog-telecharger',
						closeButton: (idSite == 2) ? true : false,
						maxWidth: "95%",
						maxHeight: "95%",
						width: "520",
						height: "420",
						overlayClose: false,
						escKey: false,
						onCleanup: function () {
							if (idSite == 2) {
								handleModalClose();
							}
						},
						onClosed: function () {
							if (idSite == 2) {
								handleModalClose();
							}
						}
					});
				}

				if (noUploadProgress) {
					return $('<tr><td width="340" class="file_upload_progress" style="text-align:center"><img src="/_themes/puzzlethemes/fr/images/ajax-loader.gif"/><\/td><\/tr>');
				} else {
					return $('<tr><td width="340" class="file_upload_progress"><span style="text-align:center;display:block" id="file_upload_progress_pc">0 %</span><div><\/div></td><td width="0"><\/td><\/tr>');
				}
			},
			buildDownloadRow: function (file) {
				if (file.error == 0) {
					if (modalClosed) return;

					currentRequest = $.get('/pzp/upload.php', {
						add: sessid,
						fid: file.fid,
						rnd: Math.random()
					}, function (data) {
						if (data['error'] == 'image') {
							closeDialogPageLoad();
							alert(local_pzp_erreur_2);
						} else {
							dialogPageLoad();
							$('#frm_etape input[name=id]').val($.base64('encode', data['src']));

							if (idSite == 2) {
								var selectedRadioGroup = "";
								if (window.location.href.includes('etape=2') || window.location.href.includes('etape=3')) {
									selectedRadioGroup = 'pzp_type';
								} else {
									selectedRadioGroup = 'radio_pp_format';
								}

								var selectedRadio = document.querySelector('input[name="' + selectedRadioGroup + '"]:checked');
								if (selectedRadio) {
									var redirectUrl = selectedRadio.getAttribute('data-lien');
									var idProduit = selectedRadio.getAttribute('data-id-produit');
									var params = new URLSearchParams();
									var frmEtape = document.getElementById('frm_etape');
									var formData = new FormData(frmEtape);

									formData.forEach(function (value, key) {
										params.append(key, value);
									});

									params.set('ref', idProduit);
									params.set('id', $.base64('encode', data['src']));
									params.set('etape', 2);

									redirectUrl += '?' + params.toString();
									window.location.href = redirectUrl;
								}
							} else {
								$('#frm_etape').submit();
							}
						}
					}, 'json');
				} else {
					closeDialogPageLoad();
					if (file.error == 1) {
						alert(local_pzp_erreur_1);
					} else if (file.error == 2) {
						alert(local_pzp_erreur_2);
					} else if (file.error == 3) {
						alert(local_pzp_erreur_3);
					} else if (file.error == 4) {
						alert(local_pzp_erreur_4);
					}
				}
			}
		});


		// Fonction pour gérer la fermeture de la modale + annuler la requête si elle existe
		function handleModalClose() {
			modalClosed = true;
			if (currentRequest) {
				currentRequest.abort();
				currentRequest = null;
			}
		}


		if ($('#vignettes').length) {
			$.get('/pzp/vignettes.php',{ id : sessid, rnd : Math.random() },function(data) {	$('#vignettes').html(data.h); },"json");

			$(document).on('click','#vignettes div',function() {
				dialogPageLoad();
				$('#frm_etape input[name=id]').val($.base64('encode',$(this).find('img').attr('src').replace('_icon','_v')));
				$('#frm_etape').submit();
			});

		}

	// ----------------- ETAPE DE CHOIX DU FORMAT --------------------------------------------------------------------

	if ($('#pzp_type_list').length) {


$.extend($.imgAreaSelect.prototype, {
    animateSelection: function (x1, y1, x2, y2, duration) {
        var fx = $.extend($('<div/>')[0], {
            ias: this,
            start: this.getSelection(),
            end: { x1: x1, y1: y1, x2: x2, y2: y2 }
        });

        $(fx).animate({
            cur: 1
        },
        {
            duration: duration,
            step: function (now, fx) {
                var start = fx.elem.start, end = fx.elem.end,
                    curX1 = Math.round(start.x1 + (end.x1 - start.x1) * now),
                    curY1 = Math.round(start.y1 + (end.y1 - start.y1) * now),
                    curX2 = Math.round(start.x2 + (end.x2 - start.x2) * now),
                    curY2 = Math.round(start.y2 + (end.y2 - start.y2) * now);
                fx.elem.ias.setSelection(curX1, curY1, curX2, curY2);
                fx.elem.ias.update();
				draw_security_lines(end);

            }
        });
    }
});


		if (idSite == 2){
			$('#toggle').change(function() {
				if (this.checked) {
				  $('#paysage').addClass('selected');
				  $('#portrait').removeClass('selected');
				} else {
				  $('#portrait').addClass('selected');
				  $('#paysage').removeClass('selected');
				}
				ias_update($('input[name=pzp_type]:checked').val());
			  });
		} else {
			$('#div_img_format span').click(function() {
				$('#div_img_format span').removeClass('selected');
				$(this).addClass('selected');
				ias_update($('input[name=pzp_type]:checked').val());
			});
		}

		$('#pzp_type_list').change(function() {
			$('div.liste_modeles').hide();
			$('div.liste_'+$('#pzp_type_list').val()).show();
			$('input.premier_'+$('#pzp_type_list').val()).click();
		});

		$('div.liste_modeles').click(function(e) {
			var i = $(this).find('input');
			i.prop('checked',true);
			ias_update(i.val());
			if ($('#prix-pack').length) { getprixpack(); }
		});

		$(document).on('change','#sq',function() { getprixpack(); });


		ias = $('#img_area').imgAreaSelect({ aspectRatio: '1:1', persistent:true, handles: true, x1: 0, y1: 0, x2: 100, y2: 100, instance:true,
			onInit:function() {
				$('div.liste_modeles input').click(function() {
					ias_update($(this).val());
				});

				$('div.liste_'+$('#pzp_type_list').val()).show();
				$('#pzp_liste_loader').hide();
				if ($('#frm_etape input[name="ref"]').val()!='') {
					$('input[name="pzp_type"]').each(function() {
						var v = parseInt($(this).val().split(';')[0]);
						if (v==parseInt($('#frm_etape input[name="ref"]').val())) {
							$(this).parent('div').click();
						}
					});
				} else {
					$('input.premier_1').parent('div').click();
				}
				if ($('#prix-pack').length) {
					$('#pzp_type_list').change(function() {
					$('#divsq').html(quantites[$('#pzp_type_list').val()]);
						getprixpack();
					});

					$('input.premier_2').parent('div').click();
				}
			},
			onSelectEnd: function (img, selection) {
				$('#frm_etape input[name=x1]').val(selection.x1);
				$('#frm_etape input[name=x2]').val(selection.x2);
				$('#frm_etape input[name=y1]').val(selection.y1);
				$('#frm_etape input[name=y2]').val(selection.y2);
				maj_quality(selection);
				draw_security_lines(selection);
			},
			onSelectChange: function (img, selection) {
				draw_security_lines(selection);
			}

		});

		$('#next_etape2').click(function() {
			if ($('#star1').attr('src')=='/_themes/puzzlethemes/fr/images/pp/star.png') {
				var format = '';
				if ($('#paysage').hasClass('selected')) {
					format = 'paysage';
				} else {
					format = 'portrait';
				}
				dialogPageLoad();
				var x = $('input[name=pzp_type]:checked').val().split(';');
				$.get('/pzp/recadre.php',{ rnd : Math.random(), pc : x[3], idp : x[0],id : sessid, src : $('#img_area').attr('src'), format : format, x1 : $('#frm_etape input[name=x1]').val(),  x2 : $('#frm_etape input[name=x2]').val(),  y1 : $('#frm_etape input[name=y1]').val(),  y2 : $('#frm_etape input[name=y2]').val(), width: $('#img_area').width(), height: $('#img_area').height() },function(data) {
								if (data.file!='') {
									if ($('#pzp_type_list').val()==10) {
										$('#frm_etape input[name=boite]').val('poster');
										$('#frm_etape input[name=selection]').val($.base64('encode',data.file));
										$('#frm_etape input[name=etape]').val('cadre');
										$('#frm_etape input[name=orientation]').val(format);
										$('#frm_etape input[name=modele]').val($('input[name=pzp_type]:checked').val());
										$('#frm_etape').submit();
									}
									else {
										if ($('#pzp_type_list').val()>1 && $('#pzp_type_list').val()<10) {
											$('#frm_etape input[name=qte]').val($('#sq').val());
											$('#frm_etape input[name=format]').val(($('#pzp_type_list').val()==2 ? 'A6':'A5'));
											$('#frm_etape input[name=pieces]').val($('input[name="pzp_type"]:checked').val().split(';')[3]);
											$('#frm_etape input[name=boite]').val('pack');
											$('#frm_etape input[name=selection]').val($.base64('encode',data.file));
											$('#frm_etape input[name=etape]').val(4);
											$('#frm_etape input[name=modele]').val($('input[name=pzp_type]:checked').val());
											$('#frm_etape').submit();
										} else {
											var model = $('input[name=pzp_type]:checked').val();
											if (model.split(';')[0] == '53706') { $('#frm_etape input[name=etape]').val(3); }
											$('#frm_etape input[name=selection]').val($.base64('encode',data.file));
											$('#frm_etape input[name=modele]').val($('input[name=pzp_type]:checked').val());
											$('#frm_etape input[name=orientation]').val(format);
											$('#frm_etape').submit();
										}
									}
								} else { alert(local_pzp_erreur); }
				},"json");
			} else { alert(local_pzp_quality); }
		});



	}

	// ----------------- ETAPE DE CHOIX DU CADRE --------------------------------------------------------------------

	if ($('#icadre').length) {

		$('#next_etape3').click(function() {
			$('#frm_etape input[name=etape]').val('3');
			var cadre = '';
			if (!$('#no_cadre').prop('checked')) { cadre = $('#icadre').attr('data-rel'); }
			$('#frm_etape input[name=cadre]').val(cadre);
			$('#frm_etape').submit();
		});
			$('#next_etape3_poster').click(function() {
			$('#frm_etape input[name=etape]').val('4');
			var cadre = '';
			if ($('#no_cadre').prop('checked')) {
				$('#frm_etape').submit();
			}
			else {
				cadre = $('#icadre').attr('data-rel');
				$('#frm_etape input[name=cadre]').val(cadre);
				$.get('/pzp/boites.php',{ fuid : $('#frm_etape input[name=selection]').val(), rnd : Math.random(), csid : sessid, cadre : cadre, modeleposter:$('#frm_etape input[name=modele]').val() },function(data) {
					$('#frm_etape').submit();
				},'json');
			}

		});
		$('#back_etape2').click(function() {
			$('#frm_etape input[name=etape]').val('2');
			$('#frm_etape').submit();
		});


		$('div.liste_cadres img.cadre').click(function() {
			if ($('#no_cadre').prop('checked')) {
				$('#no_cadre').prop('checked',false);
			}

			$('#icadre').attr('data-rel',$(this).attr('data-rel'));
			$('div.liste_cadres img.cadre').removeClass('selected');
			$(this).addClass('selected');
			var src = $(this).attr('src');
			$('#icadre').attr('src',src.replace('_100','_750'));

			$('#icadre').show();

		});

		$('#no_cadre').click(function() {
			if ($(this).prop('checked')) {
				$('#icadre').fadeOut(1000);
			} else {
				$('div.liste_cadres img.cadre:first').click();
			}
		});



	}

	// ----------------- ETAPE DE CHOIX DE LA BOITE --------------------------------------------------------------------


	if ($('#img_box').length || $('img_box_mobile').lenght) {
	var garderboite = 0;
		$('div.onglet_boite').on('click keydown', function(e) {
			if (e.type === 'click' || (e.type === 'keydown' && e.key === 'Enter' && idSite == 2)) {
				var type = $(this).attr('data-rel');
				if (idSite == 2){
					var $parentDiv = $(this).closest('.marg-box-p');
				}
				if (type==6 && idSite != 2) {
					txmode=1; $('div.work_right').css('min-height','460px'); $('#d_area').show(); $('#d_txt').hide();
					$('#votre_texte_valide').val($('#votre_texte_area').val());
				} else {
					txmode=0; $('div.work_right').css('min-height','400px'); $('#d_area').hide(); $('#d_txt').show();
					$('#votre_texte_valide').val($('#votre_texte').val());
				}

				if (idSite == 2){
					$parentDiv.find('div.onglet_boite').removeClass('selected');
				} else {
					$('div.onglet_boite').removeClass('selected');
				}
				$(this).addClass('selected');
				$('div.liste_boites').css('width','100%');
				$('div.liste_boites').html('<img class="loader" src="/_themes/puzzlethemes/fr/images/ajax-loader.gif"/>');
				$("#next_etape3").hide();
				$("#next_etape3_temp").show();
				var texte = $('#votre_texte_valide').val();
				if (texte == local_pzp_saisie_default) { texte=''; }

				if (idSite == 2) {
					var idProduit = $('#id_produit').val();
					var puzzleOptions = document.querySelectorAll('.puzzle-option');
					puzzleOptions.forEach(function (option) {
						if (option.querySelector('input[type="radio"]').getAttribute('data-id-produit') == idProduit) {
							option.classList.add('selected');
							option.querySelector('input[type="radio"]').checked = true;

							var selectedText = option.querySelector('.nom').textContent;
							document.getElementById('selected_puzzle').textContent = selectedText;

							var label = option.getAttribute('data-label');
							var dimensions = option.getAttribute('data-dimensions');
							var prix = option.getAttribute('data-prix');
							document.getElementById('taille_select').innerHTML = label + ' <span style="font-weight: 400">(' + dimensions + ')</span> - ' + prix;

						}
					});




				}


				$.get('/pzp/boites.php',{ fuid : $('#frm_etape input[name=selection]').val(), orientation:$('#frm_etape input[name=orientation]').val(), rnd : Math.random(), type: type, cadre:$('#frm_etape input[name=cadre]').val(),id: $('#id_produit').val(), csid: sessid, texte:texte }, function(data) {
					$('div.liste_boites').empty();
					var raz_nth = true;
					//nth_box = 0;
					if (garderboite==1){
						garderboite=0;
					}else{
						nth_box = 0;
					}
					var maxLength = ($('#idSite').val() !== '2') ? data.trel.length : 9;
					for(var i=0;i<maxLength;i++) {
						var img = '<img id="o_img_id_'+i+'" data-rel="'+data.trel[i]+'" titre="image_boites_'+i+'" alt="image_boites_'+i+'" src="'+data.tsrc[i]+'" class="boite" tabindex="0"/>';
						$('div.liste_boites').append(img);
						$('#o_img_id_' + i).on('keydown', function(e) {
							if (e.key === 'Enter') {
									e.preventDefault();
									$(this).click();
							}
						});
						if (i==nth_box) { $('#o_img_id_'+i).click(); raz_nth=false; }
					}

					// on reactive le bouton suivant
					$("#next_etape3_temp").hide();
					$("#next_etape3").show();
					$('div.liste_boites').css('width','');
					if (raz_nth) { nth_box = 0;  $('#o_img_id_0').click(); }
				},'json');
			}
		});

		$(document).on('click','div.liste_boites img.boite',function() {
			clearInterval(blink);
			nth_box = $(this).parent().children().index(this);
			$('#img_box').attr('data-rel',$(this).attr('data-rel'));
			$('#img_box_mobile').attr('data-rel',$(this).attr('data-rel'));
			$('div.liste_boites img.boite').removeClass('selected');
			$(this).addClass('selected');
			var src = $(this).attr('src');
			$('#img_box').attr('src',src.replace('_ico','_view'));
			$('#img_box_mobile').attr('src',src.replace('_ico','_view'));
		});

		if (idSite == 2){
			$('#bloc_pc div.onglet_boite:first-child').click();
			$('#bloc_mobile div.onglet_boite:first-child').click();
		} else {
			$('div.boites div.onglet_boite:first-child').click();
		}

		$('.maj_texte').click(function() {
			clearInterval(blink);
			var txv = $('div.onglet_boite.selected').attr('data-rel') == 6 ? $('#votre_texte_area').val() : $('#votre_texte').val();
			$('#votre_texte_valide').val(txv);
			$('#cptCall').val($('div.liste_boites img.selected').attr('data-rel'));
			garderboite = 1;
			if (idSite == 2){
				if ($(window).width() <= 991) {
					$('#bloc_mobile div.onglet_boite.selected').click();
				} else {
						$('#bloc_pc div.onglet_boite.selected').click();
				}
			} else {
				$('div.selected').click();
			}

		});

		$('#d_etape2').click(function() { document.location.href='/catalogue/puzzle-personnalise.php?etape=2&id='+$('#frm_etape input[name=id]').val(); });
		if (idSite == 2) {
			$('#back_etape2').click(function() {
				var x1 = $('#frm_etape input[name=x1]').val();
				var x2 = $('#frm_etape input[name=x2]').val();
				var y1 = $('#frm_etape input[name=y1]').val();
				var y2 = $('#frm_etape input[name=y2]').val();
				var pzp_type = $('input[name=pzp_type]:checked').val();
				var format = ($('#paysage').hasClass('selected')) ? 'paysage' : 'portrait';
				var idProduit = $('#id_produit').val();
				var url = '/catalogue/puzzle-personnalise.php?etape=2&id='+$('#frm_etape input[name=id]').val() + '&ref=' + idProduit + '&x1=' + x1 + '&x2=' + x2 + '&y1=' + y1 + '&y2=' + y2 + '&pzp_type=' + pzp_type + '&format=' + format;

				window.location.href = url;
			});
		} else {
			$('#back_etape2').click(function() { document.location.href='/catalogue/puzzle-personnalise.php?etape=2&id='+$('#frm_etape input[name=id]').val(); });
		}
		//$('#back_etape2_grand_cadre').click(function() { document.location.href='/catalogue/puzzle-grand-cadre.php?ctrl='+$('#frm_etape input[name=ctrl]').val(); });
		$('#bt_changer_illu').click(function() {
			var h = $('#frm_etape input[name=backurl]').val();
			var th = h.split(';');
			document.location.href='/catalogue/puzzle-grand-cadre.php?pieces='+th[0]+'&mid='+th[1]+'&photo='+$.base64('encode',th[2]);
		});

		$('#next_etape3').click(function() {
			var texte = $('#votre_texte_valide').val();
			if (texte == local_pzp_saisie_default) { texte=''; }
			dialogPageLoad();
			$('#frm_etape input[name=boite]').val($.base64('encode',$('#img_box').attr('src')));
			$('#frm_etape input[name=box]').val($('#img_box').attr('data-rel'));
			$('#frm_etape input[name=texte]').val(texte);
			$('#frm_etape').submit();
		});

		$('#votre_texte').focus(function() { if ($(this).val()==local_pzp_saisie_default) { $(this).val(''); $(this).removeClass('grey'); } });

		$('#votre_texte').focus( function() {
			$(this).addClass('focused');
		});

		$('#votre_texte').blur(function() {
			$(this).removeClass('focused');
		});

		$('#votre_texte').bind('keyup change',function() {
			$('#votre_texte_len').fadeIn();
			var s = $('#votre_texte').val();
			//s = s.replace(/[^\s\n\w\d!"'\.,{}\[\]\(\)\\=|°#$%&/?¿¡´+*@-_àéìòùèùäïöüëñõãÖÜÏÄËÿ]+/gim,"");
			//$('#votre_texte').val(s);
			var pluriel = '';
			if (35-$(this).val().length>1) { pluriel = 's'; }
			$('#votre_texte_len').html(local_pzp_saisie_reste.replace('%NB%',35-$(this).val().length).replace('%X%',pluriel));
			clearTimeout(texte_timeout);
			texte_timeout = setTimeout("$('#votre_texte_len').fadeOut()", 1500);
			clearInterval(blink);
			blink = setInterval("$('#maj_texte').toggleClass('maj_texte_blink')",600);
		});
		if (idSite == 2) {
			$('#votre_texte_area').focus( function() {
				$(this).addClass('focused');
			});

			$('#votre_texte_area').blur(function() {
				$(this).removeClass('focused');
			});
			$('#votre_texte_area').bind('keyup change',function() {
				$('#votre_texte_len').fadeIn();
				var s = $('#votre_texte_area').val();
				var pluriel = '';
				if (35-$(this).val().length>1) { pluriel = 's'; }
				$('#votre_texte_len').html(local_pzp_saisie_reste.replace('%NB%',35-$(this).val().length).replace('%X%',pluriel));
				clearTimeout(texte_timeout);
				texte_timeout = setTimeout("$('#votre_texte_len').fadeOut()", 1500);
				clearInterval(blink);
				blink = setInterval("$('#maj_texte').toggleClass('maj_texte_blink')",600);
			});
		} else {
			$('#votre_texte_area').focus(function() { if ($(this).val()==local_pzp_saisie_default) { $(this).val('');  } });
			$('#votre_texte_area').bind('keyup change paste',function() {
				var txt = $(this).val();
				//txt = txt.replace(/[^\s\n\w\d!"'\.,{}\[\]\(\)\\=|°#$%&/?¿¡´+*@-_àéìòùèùäïöüëñõãÖÜÏÄËÿ]+/gim,"");
				//$(this).val(txt);
				var t = txt.split('\n');
				for (var i=0;i<4;i++) {
					if (t[i]) {
						$('#area_line'+(i+1)).html(t[i].length);
						if (t[i].length > 38) { $('#area_line'+(i+1)).css('color','#f00'); }
						else { $('#area_line'+(i+1)).css('color','#000'); }
					} else { $('#area_line'+(i+1)).css('color','#000'); $('#area_line'+(i+1)).html('0'); }
				}
				clearInterval(blink);
				blink = setInterval("$('#maj_texte_area').toggleClass('maj_texte_blink')",600);
			});
		}



	}

	// ----------------- ETAPE FINALE --------------------------------------------------------------------


	if ($('div.work_left_final').length) {

		$('#d_etape2').click(function() {
			$('#frm_etape input[name=etape]').val('2');
			$('#frm_etape').submit();
		});
		$('#d_etape3').click(function() {
			$('#frm_etape input[name=etape]').val('3');
			$('#frm_etape').submit();
		});
		$('#back_etape3').click(function() {
			$('#frm_etape input[name=etape]').val('3');
			$('#frm_etape').submit();
		});
		$('#back_etape2').click(function() {
			$('#frm_etape input[name=etape]').val('2');
			$('#frm_etape').submit();
		});
		$('#next_etape4').on('click keydown', function(e) {
			if($('#cgv_pp').prop('checked')){
				$('#to_cart').hide();

				dialogEndPageLoad();

				/*$.get('/pzp/boites.php',{ rnd : Math.random(), pf:1, box:$('#frm_etape input[name=box]').val(), boite: $('#frm_etape input[name=boite]').val(), csid: sessid, cadre : $('#frm_etape input[name=cadre]').val(), texte:$('#frm_etape input[name=texte]').val() }, function(data) {
					$.get('/websvc/additem.ws.php', { csid: sessid, pf: data.pf, rnd : Math.random(), qte:$('#qte').val(), nbencaddie:0, nbstock:999, colle:$('#frm_etape input[name=colle]').val(), idproduit: $('#frm_etape input[name=modele]').val().split(';')[0], idphoto: data.id, box:$('#img_box').attr('src') }, function(reponse) {
						document.location.href='/caddie/';
					},'json');
				},'json');*/
				var conserver = 0;
				var assembled = 0;
				var assembled_qte = 0;
				if ($('#frm_etape input[name=assembled]').val()==1) {
					assembled=1;
					assembled_qte=1;
					if ($('#selectFPstock_assembled').length) {
						assembled_qte = $('#selectFPstock_assembled').val();
					}
				}


				if ($('#conserver').prop('checked')) { conserver=1; }
				$.get('/pzp/boites.php',{ gcadre:$('#frm_etape input[name=gcadre]').val(), fuid : $('#frm_etape input[name=selection]').val(),idproduit: $('#frm_etape input[name=modele]').val().split(';')[0], rnd : Math.random(), pf:1, box:$('#frm_etape input[name=box]').val(), conserver:conserver, boximg:$('#img_box').attr('src'), boite: $('#frm_etape input[name=boite]').val(), csid: sessid, cadre : $('#frm_etape input[name=cadre]').val(), texte:$('#frm_etape input[name=texte]').val(), poster:$('#frm_etape input[name=poster]').val(), poster1000:$('#frm_etape input[name=poster1000]').val() }, function(data) {
					$.get('/websvc/additem.ws.php', { csid: sessid, pf: data.pf, rnd : Math.random(), qte:$('#selectFPstock').val(), nbencaddie:0, nbstock:999, assembled:assembled, assembled_qte:assembled_qte, poster:$('#frm_etape input[name=poster]').val(), poster1000:$('#frm_etape input[name=poster1000]').val(), colle:$('#frm_etape input[name=colle]').val(), idproduit: $('#frm_etape input[name=modele]').val().split(';')[0], idphoto: data.id, box:$('#img_box').attr('src') }, function(reponse) { if (idSite != 2) { document.location.href='/caddie/'; } else {$('#frm_etape input[name=etape]').val('5');$('#frm_etape').submit();	}
					},'json');
				},'json');

			} else { $('#cgv_pp_msg').show(); }
		});

		$('#next_etape4_pack').click(function() {
			if($('#cgv_pp').prop('checked')){
				$('#to_cart').hide();
				dialogEndPageLoad();


				$.get('/pzp/boites.php',{ fuid : $('#frm_etape input[name=selection]').val(),idproduit: $('#frm_etape input[name=modele]').val().split(';')[0], rnd : Math.random(), pf:1, box:$('#frm_etape input[name=box]').val(), boite: $('#frm_etape input[name=boite]').val(), csid: sessid, cadre : $('#frm_etape input[name=cadre]').val(), texte:$('#frm_etape input[name=texte]').val() }, function(data) {


					$.get('/websvc/additem.ws.php', { csid: sessid, rnd : Math.random(), qte:$('#frm_etape input[name=qte]').val(), format:$('#frm_etape input[name=format]').val(), pieces:$('#frm_etape input[name=pieces]').val(), idphoto: data.id }, function(reponse) {
						document.location.href='/caddie/';
					},'json');

				},'json');



			} else { $('#cgv_pp_msg').show(); }
		});

		$('#next_etape4_poster').click(function() {
			if($('#cgv_pp').prop('checked')){
				$('#to_cart').hide();
				dialogEndPageLoad();


					$.get('/pzp/boites.php',{ fuid : $('#frm_etape input[name=selection]').val(),cadre: $('#frm_etape input[name=cadre]').val(), idproduit: $('#frm_etape input[name=modele]').val().split(';')[0], rnd : Math.random(), pf:1, csid: sessid, boite:'poster' }, function(data) {

					$.get('/websvc/additem.ws.php', { csid: sessid, rnd : Math.random(), nbencaddie:0, nbstock:999, qte:$('#selectFPstock').val(), idphoto: data.id, idproduit: $('#frm_etape input[name=modele]').val().split(';')[0] }, function(reponse) {
						document.location.href='/caddie/';
					},'json');

				},'json');



			} else { $('#cgv_pp_msg').show(); }
		});


	}

	$('#d_etape1').click(function() {
		if (idSite == 2){
			document.location.href='/pp-fr-new/puzzle-personnalise.php';
		}
		if (idSite == 10){
			document.location.href='/pp-de-new/puzzle-personnalise.php';
		}
	});
});
