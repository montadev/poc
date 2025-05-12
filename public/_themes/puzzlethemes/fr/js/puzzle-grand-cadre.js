
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

function star(nb) {

	for(var i=1;i<5;i++) {
		if (i<=nb) {
		$('#star'+i).attr('src','/_themes/puzzlethemes/fr/images/pp/star.png');
		} else {
		$('#star'+i).attr('src','/_themes/puzzlethemes/fr/images/pp/star_off.png');
		}
	}
}

function maj_quality() {

				var iw = calques[0].bounds.width / calques[1].bounds.width * largeur; // taille de l'impression de l'image perso
				var ih = calques[0].bounds.height / calques[1].bounds.height * hauteur;

				if (iw>0 && ih>0) {
					var dpw = rw/(iw/2.51);
					var dph = rh/(ih/2.51);
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


function getprixpack() {
				$.post('/pzp/prix.php',{prix:'ht',nbp:$('#frm_carte_choix_prix input[name=pieces]:checked').val(),qte:$('#frm_carte_choix_prix select[name=quantite]').val(),format:$('#frm_controles input[name=format]').val(),type:'Theme'},function(data) {
				if (data) {
					$('#prix-pack').html(local_prix+' HT : '+data.prix+' &euro;');
				}
				},"json");
}

function dialogPageLoad() {

	$('#dialog-page-load').html('<p style="text-align:center;display:block;color:#000;"><img src="/_themes/puzzlethemes/fr/images/ajax-loader.gif"/><br/>'+local_wait+'</p>');
	$.colorbox({inline:true, transition:'none', href:'#dialog-page-load', closeButton:false, width:"350", height:"150"});
}

function closeDialogPageLoad() {
	$.colorbox.close();
}


var stage;
var loader = 0;
var update;
var auto_update;
var auto_fade;
var textes = [];

function calques_init_placement() {
			if (calques[0].start_pos=='center') {
				calques[0].bitmap.x = calques[1].bounds.width/2;
				calques[0].bitmap.y = calques[1].bounds.height/2;
			} else {
				calques[0].bitmap.x = parseInt(calques[0].start_x);
				calques[0].bitmap.y = parseInt(calques[0].start_y);
			}

			var ratio = calques[0].bounds.width / calques[0].start_width;
			calques[0].bounds.width = calques[0].bounds.width / ratio;
			calques[0].bounds.height = calques[0].bounds.height / ratio;
			if ($('#file_upload').length) {} else { calques[0].bitmap.visible = false; }
			calques[1].bitmap.x = parseInt(calques[1].start_x);
			calques[1].bitmap.y = parseInt(calques[1].start_y);
			update = true;
		}

		function calcule_angle(p0,p1,c) {
			var x1 = p0.x;
			var y1 = p0.y;
			var x2 = c.x;
			var y2 = c.y;
			var x3 = p1.x;
			var y3 = p1.y;
			var a = x2 - x1;
			var b = y2 - y1;
			var c = x3 - x2;
			var d = y3 - y2;
			var atanA = Math.atan2(a, b);
			var atanB = Math.atan2(c, d);
			return (atanA - atanB) * (-180 / Math.PI);
		}

		function updateLoader() {
			loader += 1;
			if (loader == calques.length) {
				calques_en_scene();
			}
		}

		function calques_charge_images() {

			for(var i=0;i<calques.length;i++) {
					calques[i].image = new Image();
					calques[i].image.src = calques[i].src;
					calques[i].image.onload = updateLoader;
					if (calques[i].cadre || calques[i].controles) {
						calques[i].control_container =  new createjs.Container();
					}
			}
		}


		function init_cartes() {
			$('div.vmodele input').prop('disabled',true);
			stage = new createjs.Stage("canvas");
			calques_charge_images();
			stage.update();
			setTimeout("$('#dloader').hide()",1000);
			setTimeout("$('div.vmodele input').prop('disabled',false)",1000);
			}

		function update_controles() {
			for (var i=0;i<calques.length;i++) {
				if (calques[i].control_container) {

					calques[i].control_container.x = calques[i].bitmap.x;
					calques[i].control_container.y = calques[i].bitmap.y;
					calques[i].control_container.rotation = calques[i].bitmap.rotation;

					calques[i].controle[0].shape.graphics.clear().beginFill(calques[i].controles.replace('alpha',calques[i].controle[0].shape.alpha)).drawRect(-calques[i].bounds.width/2-4,-calques[i].bounds.height/2-4, 8,8);
					calques[i].controle[1].shape.graphics.clear().beginFill(calques[i].controles.replace('alpha',calques[i].controle[1].shape.alpha)).drawRect(calques[i].bounds.width/2-4, -calques[i].bounds.height/2-4, 8,8);
					calques[i].controle[2].shape.graphics.clear().beginFill(calques[i].controles.replace('alpha',calques[i].controle[2].shape.alpha)).drawRect(calques[i].bounds.width/2-4, calques[i].bounds.height/2-4, 8,8);
					calques[i].controle[3].shape.graphics.clear().beginFill(calques[i].controles.replace('alpha',calques[i].controle[3].shape.alpha)).drawRect(-calques[i].bounds.width/2-4, calques[i].bounds.height/2-4, 8,8);

					calques[i].cadre_shape.graphics.clear().setStrokeStyle(1).beginStroke(calques[i].cadre.replace('alpha',calques[i].cadre_alpha)).drawRect(-calques[i].bounds.width/2,-calques[i].bounds.height/2,calques[i].bounds.width,calques[i].bounds.height);

				}
			}
			maj_quality();
		}

		function calques_en_scene() {

			createjs.Touch.enable(stage);
			stage.enableMouseOver();

			for (var i=0;i<calques.length;i++) {

				calques[i].bitmap = new createjs.Bitmap(calques[i].image);
				calques[i].bitmap.calque = calques[i];
				calques[i].bounds = calques[i].bitmap.getBounds();
				calques[i].ratio = calques[i].bounds.width / calques[i].bounds.height;
				calques[i].bounds.width0 = calques[i].bounds.width;
				calques[i].bounds.height0 = calques[i].bounds.height;
				stage.addChild(calques[i].bitmap);

				if (calques[i].cadre || calques[i].controles) {
					calques[i].bitmap.regX = calques[i].bounds.width/2 ;
					calques[i].bitmap.regY = calques[i].bounds.height/2 ;
				}

				if (calques[i].cadre) {
					calques[i].cadre_alpha = 0.01;
					calques[i].cadre_shape = new createjs.Shape();

				}
				if (calques[i].controles) {

					calques[i].angle = 0;
					calques[i].controle = [];
					for (var j=0;j<4;j++) {
						calques[i].controle[j] = {};
						calques[i].controle[j].shape = new createjs.Shape();
						calques[i].controle[j].shape.cursor = "pointer";
						calques[i].controle[j].shape.calque = calques[i];
						calques[i].controle[j].shape.alpha = 0.01;
					}

					calques[i].bitmap.cursor = "pointer";


					calques[i].bitmap.on("mousedown", function(evt) {
						clearTimeout(auto_fade);
						auto_fade = setTimeout("autofade()",3000);
						this.offset = {x:this.x-evt.stageX, y:this.y-evt.stageY};
						for (var x=0;x<4;x++) {
								this.calque.controle[x].shape.alpha = 1;
						}
						this.calque.cadre_alpha = 1;
						update = true;
					});

					calques[i].bitmap.on('pressmove', function(evt) {
						this.x = evt.stageX + this.offset.x;
						this.y = evt.stageY + this.offset.y;
						clearTimeout(auto_fade);
						auto_fade = setTimeout("autofade()",3000);
						update = true;
					});

					for (var j=0;j<4;j++) {
						calques[i].controle[j].shape.on('mousedown', function(evt) {
							clearTimeout(auto_fade);
							auto_fade = setTimeout("autofade()",3000);
							this.p0 = {x:evt.stageX, y:evt.stageY};
							this.center = {x:this.calque.bitmap.x, y:this.calque.bitmap.y};
							this.start = this.calque.angle;
						});
						calques[i].controle[j].shape.on('pressmove', function(evt) {
							this.p1 = {x:evt.stageX, y:evt.stageY};
							var angle = (180-calcule_angle(this.p0,this.p1,this.center))%360;
							this.calque.angle = (this.start+angle)%360;

							var ratio = Math.sqrt(Math.pow(this.p1.x-this.center.x,2)+Math.pow(this.p1.y-this.center.y,2)) / Math.sqrt(Math.pow(this.calque.bounds.width/2,2)+Math.pow(this.calque.bounds.height/2,2));
							this.calque.bounds.width *= ratio;
							this.calque.bounds.height *= ratio;
							var check = this.calque.bounds.width / this.calque.bounds.height;
							if (check != this.calque.ratio) { this.calque.bounds.width = this.calque.bounds.height * this.calque.ratio; }
							clearTimeout(auto_fade);
							auto_fade = setTimeout("autofade()",3000);
							update = true;
						});
					}
				} else {


					//calques[i].bitmap.on("mousedown", function(evt) {
					//	for(z=0;z<calques.length;z++) {
					//		if (i!=z) {
					//			if (calques[z].controles && calques[z].inside == 0) {
					//				calques[z].cadre_alpha = 0.01;
					//				for (var zx=0;zx<4;zx++) {
					//					calques[z].controle[zx].shape.alpha = 0.01;
					//				}
					//			}
					//		}
					//	}
					//
					//	update = true;
					//
					//}
					//);
				}
			}

			for (var i=0;i<calques.length;i++) {
				if (calques[i].cadre) {
					calques[i].control_container.addChild(calques[i].cadre_shape);
				}
				if (calques[i].controles) {
					for (var j=0;j<calques[i].controle.length;j++) {
						calques[i].control_container.addChild(calques[i].controle[j].shape);
					}
				}
				if (calques[i].control_container) {
					stage.addChild(calques[i].control_container);
				}
			}

			calques_init_placement();
			update_controles();
			createjs.Ticker.addEventListener("tick", tick);

			setTimeout("init_r()",300);

		}

		function init_r() { if (calques[0].start_r!='') { calques[0].angle = calques[0].start_r; update=true; } }

		function autofade() {
			for(z=0;z<calques.length;z++) {
				if (calques[z].controles) {
					calques[z].cadre_alpha = 0.01;
					for (var zx=0;zx<4;zx++) {
						calques[z].controle[zx].shape.alpha = 0.01;
					}
				}
			}
			update = true;
		}

		function tick(event) {
			if (update) {
				update = false;
				for (var i=0;i<calques.length;i++) {
					if (calques[i].controles) {
						calques[i].bitmap.rotation = calques[i].angle;
						calques[i].bitmap.scaleX = calques[i].bounds.width / calques[i].bounds.width0;
						calques[i].bitmap.scaleY = calques[i].bounds.height / calques[i].bounds.height0;
					}
				}
				update_controles();
			}
			stage.update(event);
		}


var noUploadProgress = (function () {
        if (navigator.userAgent.match(/(Android)|(Windows Phone)|(XBLWP)|(ZuneWP)|(w(eb)?OSBrowser)|(webOS)|(Kindle\/(1.0|2.0|2.5|3.0))/)) {
          return true;
        }
        return false;
})();

$(function() {

	$('#file_upload').fileUploadUI({
			uploadTable    : $('#files'),
			downloadTable  : $('#files'),
			buildUploadRow : function(files,index){

					if( /Android|webOS|iPhone|iPad|iPod|BlackBerry/i.test(navigator.userAgent) ) {
						$.colorbox({reposition: true, top: 0, left: 0, closeButton:false, transition: 'none', speed:'50', inline:true, href:"#dialog-telecharger"}).fadeIn(100);

					} else {

						$.colorbox({inline:true, href:'#dialog-telecharger', closeButton:false, maxWidth:"95%", maxHeight:"95%", width:"520", height:"420",overlayClose:false,escKey:false});
					}

					if (noUploadProgress) {
					return $('<tr><td width="340" class="file_upload_progress" style="text-align:center"><img src="/_themes/puzzlethemes/fr/images/ajax-loader.gif"/><\/td><\/tr>');
					} else {
					return $('<tr><td width="340" class="file_upload_progress" ><span style="text-align:center;display:block" id="file_upload_progress_pc">0 %</span><div><\/div></td><td width="0">' +
							'<\/td><\/tr>');
					}
			},
			buildDownloadRow: function(file){


				if (file.error==0) {

						$.get('/pzp/upload.php',{ add : sessid, fid : file.fid, rnd : Math.random() },function(data) {

							calques[0].src = '/puzzlesperso/'+sessid+'/'+data.fid+'_v.jpg';
							var h = document.location.href;
							dialogPageLoad();
							document.location.href = h.split('?')[0]+'?ctrl='+$.base64('encode',$('#frm_controles').serialize())+'&photo='+$.base64('encode',calques[0].src);
						},'json');
					} else {
					closeDialogPageLoad();
							if (file.error==1) {
							alert(local_pzp_erreur_1);
						}
						if (file.error==2) {
							alert(local_pzp_erreur_2);
						}
						if (file.error==3) {
							alert(local_pzp_erreur_3);
						}
						if (file.error==4) {
							alert(local_pzp_erreur_4);
						}
					}
			}
		});



	$('#a-out-retour').bind('click',function() {
		dialogPageLoad();
		var h = document.location.href;
		document.location.href = h.split('?')[0]+'?ctrl='+$.base64('encode',$('#frm_controles').serialize());
	});

	$('#a-out-boite').bind('click',function() {
		var h = $.base64(document.location.href);
		document.location.href = '/catalogue/puzzle-grand-cadre-boite.php?etape=3&backurl='+h+'&gcadre='+$('#frm_controles input[name="modele"]').val()+'&modele='+$('#frm_controles input[name="mid"]').val()+'&selection='+$(this).data('src');
	});

	$('#valider_pieces').bind('click',function() {
		var z = $('input[name=rpieces]:checked').val();
		if (typeof z == 'undefined') {
			alert(local_pzp_select_pieces);
		} else {
			$('#frm_controles input[name="pieces"]').val($('input[name=rpieces]:checked').val());
			$('#frm_controles input[name="mid"]').val($('input[name=rpieces]:checked').data('pid'));
			var h = document.location.href;
			document.location.href = h.split('?')[0]+'?ctrl='+$.base64('encode',$('#frm_controles').serialize());
		}
	});

	$('#valider_modele').bind('click',function() {
		if ($('#star1').attr('src')=='/_themes/puzzlethemes/fr/images/pp/star.png') {
			var z = $('input[name=rmodele]:checked').val();
			if (typeof z == 'undefined') {
				alert(local_pzp_select_m);
			} else {
				$('#frm_controles input[name="modele"]').val($('input[name=rmodele]:checked').val());
				$('#frm_controles input[name="c0_x"]').val(calques[0].bitmap.x);
				$('#frm_controles input[name="c0_y"]').val(calques[0].bitmap.y);
				$('#frm_controles input[name="c0_w"]').val(calques[0].bounds.width);
				$('#frm_controles input[name="c0_h"]').val(calques[0].bounds.height);
				$('#frm_controles input[name="c0_r"]').val(calques[0].bitmap.rotation);
				dialogPageLoad();
				$.post('/pzp/grands-cadres.php',{ ctrl : $.base64('encode',$('#frm_controles').serialize()), photo : $.base64('encode',photo) },function(data) {
								//$('#frm_controles input[name="out"]').val(data.url);
								//$('#frm_controles input[name="outsrc"]').val(data.p);
								//var h = document.location.href;
								//document.location.href = h.split('?')[0]+'?ctrl='+$.base64('encode',$('#frm_controles').serialize())+'&photo='+$.base64('encode',calques[0].src);
								var h = $.base64('encode',$('#frm_controles input[name="pieces"]').val()+';'+$('#frm_controles input[name="mid"]').val()+';'+$('#frm_controles input[name="photo"]').val());

								document.location.href = '/catalogue/puzzle-grand-cadre-boite.php?etape=3&backurl='+h+'&gcadre='+$('#frm_controles input[name="modele"]').val()+'&modele='+$('#frm_controles input[name="mid"]').val()+'&selection='+$.base64('encode',data.url);

							},'json');
			}
		} else { alert(local_pzp_quality); }
	});

	$('div.vmodele').bind('click',function() {
		var s = $(this).find('input[type=radio]');
		var m = s.val();
		var pos = s.data('pos').split(',');

		$('#dloader').show();
		setTimeout("$('#dloader').hide()",1000);
		calques[1].image.src = '/_themes/puzzlethemes/fr/images/cadres/grands-cadres/'+m+'/'+pieces+'-'+m+'.petit.png';
		//calques[0].angle=pos[3];
		var ratio = calques[0].bounds.height / calques[0].bounds.width;

		//calques[0].bounds.width=parseInt(pos[0]);
		//calques[0].bounds.height=parseInt(calques[0].bounds.width*ratio);
		calques[0].bitmap.x=parseInt(pos[1]);
		calques[0].bitmap.y=parseInt(pos[2]);


		update=true;
		update_controles();
		$(this).find('input[type=radio]').prop('checked',true);
		stage.update();
	});

	if ($('#vignettes').length) {
			$.get('/pzp/vignettes.php',{ id : sessid, rnd : Math.random() },function(data) {	$('#vignettes').html(data.h); },"json");

			$(document).on('click','#vignettes div',function() {


				var src = $(this).find('img').attr('src').replace('_icon','_v');
				var h = document.location.href;
				dialogPageLoad();
				document.location.href = h.split('?')[0]+'?ctrl='+$.base64('encode',$('#frm_controles').serialize())+'&photo='+$.base64('encode',src);

				//$('#frm_etape input[name=id]').val($.base64('encode',$(this).find('img').attr('src').replace('_icon','_v')));
				//$('#frm_etape').submit();
			});
	}

});

