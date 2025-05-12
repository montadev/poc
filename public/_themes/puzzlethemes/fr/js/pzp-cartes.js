
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
				textes_en_scene();
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

		function textes_en_scene() {
			for (var i=0;i<textes.length;i++) {
				stage.addChild(textes[i].text);
				//stage.addChild(textes[i].cadre_shape);
			}
		}

		function textes_add(i) {
			var t = textes[i].txt;
			if (textes[i].libre==1 && textes[i].params!='br') {
				t = t.replace(/[\n]/gi, "\n\n" );
			}
			textes[i].text = new createjs.Text(t,textes[i].style+" "+textes[i].taille+"px "+textes[i].fonte,textes[i].couleur);
			textes[i].text.textBaseline = 'bottom';
			var bounds = textes[i].text.getBounds();
			textes[i].cadre_shape = new createjs.Shape();
			//textes[i].cadre_shape.graphics.setStrokeStyle(1).beginFill(textes[i].cadre).drawRect(0,0,bounds.width,-bounds.height);
			//textes[i].cadre_shape.cursor = "pointer";
			textes[i].cadre_shape.text = textes[i].text;
			textes[i].cadre_shape.id = textes[i].id;
			//textes[i].cadre_shape.on("mousedown", function(evt) {
						//auto_fade = setTimeout("autofade()",1000);
						//$("#d_texte_"+this.id).stop().css("background-color", "#f00").animate({ backgroundColor: "#fff"}, 1000);
			//});
			//textes[i].cadre_shape.on("pressmove", function(evt) {
						//this.x = evt.stageX + this.offset.x;
						//this.y = evt.stageY + this.offset.y;
						//this.text.x = this.x;
						//this.text.y = this.y;
			//});

			if (textes[i].align=='c') {
				textes[i].text.x = textes[i].x - bounds.width/2;
				textes[i].text.y = textes[i].y - bounds.height/2;
			}
			if (textes[i].align=='l') {
				textes[i].text.x = textes[i].x;
				textes[i].text.y = textes[i].y - bounds.height/2;
			}
			if (textes[i].align=='r') {
				textes[i].text.x = textes[i].x - bounds.width;
				textes[i].text.y = textes[i].y - bounds.height/2;
			}
			if (textes[i].libre==1) {
				textes[i].text.x = textes[i].x;
				textes[i].text.y = textes[i].y;
			}
			//textes[i].cadre_shape.x = textes[i].text.x;
			//textes[i].cadre_shape.y = textes[i].text.y;


		}

		function textes_init() {
			$('textarea.texte').each(function(k,v) {
				var id = v.id.split('_')[1];
				var index = textes.length;
				textes[index]  = {
					txt:$('#texte_'+id).val(),
					taille:$('#texte_'+id+'_taille').val(),
					couleur:$('#texte_'+id+'_couleur').val(),
					fonte:$('#texte_'+id+'_fonte').val(),
					style:$('#texte_'+id+'_style').val(),
					align:$('#texte_'+id+'_align').val(),
					libre:$('#texte_'+id+'_libre').val(),
					params:$('#texte_'+id+'_params').val(),
					cadre:"rgba(255,255,255,0.01)",
					x:$('#texte_'+id+'_x').val(),
					y:parseInt($('#texte_'+id+'_y').val()),
					id:id
				};
				if (textes[index].txt=='') textes[index].txt=' ';
			});
			for (var i=0;i<textes.length;i++) {
				textes_add(i);
			}
		}

		function textes_maj() {
			js_update();
			for (var i=0;i<textes.length;i++) {
				//stage.removeChild(textes[i].cadre_shape);
				stage.removeChild(textes[i].text);
			}
			textes = [];
			textes_init();
			textes_en_scene();
		}

		function init_cartes() {
			stage = new createjs.Stage("canvas");
			var load_text = new createjs.Text('Chargement en cours...',"20px arial","#404040");
			stage.addChild(load_text);
			stage.update();
			calques_charge_images();
			textes_init();
			stage.removeChild(load_text);
			stage.update();

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
						if (highlight_upload) { $("#dphotonew").stop().css("borderColor", "#f00").animate({ borderColor: "#fff"}, 2500); }
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

			//setTimeout("init_r()",1000);

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

		var monthNames = new Array('FR','DE','EN');
		var dateWords = new Array('FR','DE','EN');
		var dayNames = new Array('FR','DE','EN');
		monthNames['FR'] = new Array('Janvier','F\351vrier','Mars','Avril','Mai','Juin','Juillet','Ao\373t','Septembre','Octobre','Novembre','D\351cembre');
		monthNames['DE'] = new Array('Januar','Februar','M&auml;rz','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember');
		monthNames['EN'] = new Array('January','February','March','April','Mai','June','July','August','September','October','November','December');
		dateWords['FR'] = new Array('Le','Né le','Née le','il pèse','elle pèse','et mesure','Je suis né le','Je suis née le','pèse');
		dateWords['DE'] = new Array('Am','Geboren am','Geboren am','er wiegt','sie wiegt','und masst','Ich bin am','Ich bin am','wiege');
		dateWords['EN'] = new Array('On','Born','Born','weights','weights','and','I was born','I was born','weights');
		dayNames['FR'] = new Array('Dimanche','Lundi','Mardi','Mercredi','Jeudi','Vendredi','Samedi');
		dayNames['DE'] = new Array('Sonntag','Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag');
		dayNames['EN'] = new Array('Sunday','Monday','Tuesday','Thursday','Wednesday','Friday','Saturday');



		function js_update() {

			if ($('#calendrier').length) {
				var v = $('#calendrier').val();
				var dt1=/^(\d{2})\/(\d{2})\/(\d{4}) (\d{2})\:(\d{2})$/;
				var dt2=/^(\d{2})\/(\d{2})\/(\d{4})$/;
				if (v.search(dt1) != -1) {
					var s = v.match(dt1);
					calendrier_update2(s[1],s[2],s[3],s[4],s[5]);
				} else {
					if (v.search(dt2) != -1) {
						var s = v.match(dt2);
						calendrier_update2(s[1],s[2],s[3],'','');
					}
				}
			}
			else {
				if ($('input[name="jsaction"]').length) {
					var x =$('input[name="jsaction"]').val();
					eval(x);
				}
			}
		}

		function calendrier_update2(j,mo,a,h,mi) {
			 var a2 = a.substr(2,2);
			 var d = new Date(a,mo-1,j);
			 var js = d.getDay();
			 var x =$('input[name="jsaction"]').val();
			 c_j = j; c_mo = mo; c_a = a; c_h = h; c_mi = mi; c_a2 = a2; c_js = js;
			 eval(x);
		}

var c_j,c_mo,c_a,c_h,c_mi,c_a2,c_js;

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
						$.colorbox({inline:true, href:'#dialog-telecharger', closeButton:false, width:"382", height:"240",overlayClose:false,escKey:false});
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
						$.get('/pzp/upload.php',{ add : sessid, carte:'1', fid : file.fid, rnd : Math.random() },function(data) {
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

	$('textarea.texte').bind('keyup',function() {
		clearTimeout(auto_update);
		//$(this).val( $(this).val().replace( /\r?\n/gi, '' ) );
		auto_update = setTimeout("textes_maj()",1000);
		auto_fade = setTimeout("autofade()",1000);
	});
	/*$('textarea.texte').bind('blur',function() {
		clearTimeout(auto_update);
		$(this).val( $(this).val().replace( /\r?\n/gi, '' ) );
		auto_update = setTimeout("textes_maj()",1000);
		auto_fade = setTimeout("autofade()",1000);
	});*/
	$('textarea.no_return').bind('keyup',function() {
		$(this).val( $(this).val().replace( /\r?\n/gi, '' ) );
	});
	$('textarea.no_return').bind('blur',function() {
		$(this).val( $(this).val().replace( /\r?\n/gi, '' ) );
	});

	$('#carte-termine').bind('click',function() {
				if (highlight_upload && $('#dphotonew').length) {
						alert(local_pzp_select_image);
						return;
				} else {
					if ($('#calendrier').length) {
						if ($('#calendrier').val()=='') {
							alert(local_pzp_select_date);
							$('#croixcal').show();
							return;
						}
					}
					if ($('#poids').length) {
						if ($('#poids').val()=='') {
							alert(local_pzp_select_poids);
							return;
						}
					}
					if ($('#taille').length) {
						if ($('#taille').val()=='') {
							alert(local_pzp_select_taille);
							return;
						}
					}
					$('#frm_controles input[name="c0_x"]').val(calques[0].bitmap.x);
					$('#frm_controles input[name="c0_y"]').val(calques[0].bitmap.y);
					$('#frm_controles input[name="c0_w"]').val(calques[0].bounds.width);
					$('#frm_controles input[name="c0_h"]').val(calques[0].bounds.height);
					$('#frm_controles input[name="c0_r"]').val(calques[0].bitmap.rotation);
					dialogPageLoad();
					$.post('/pzp/cartes.php',{ site:'gp', ctrl : $.base64('encode',$('#frm_controles').serialize()), photo : $.base64('encode',photo) },function(data) {
						$('#frm_controles input[name="out"]').val(data.url);
						$('#frm_controles input[name="outsrc"]').val(data.p);
						var h = document.location.href;
						document.location.href = h.split('?')[0]+'?ctrl='+$.base64('encode',$('#frm_controles').serialize())+'&photo='+$.base64('encode',calques[0].src);
					},'json');
				}
	});

	// http://xdsoft.net/jqplugins/datetimepicker/
	$('#calendrier').datetimepicker({ lang:local_language, timepicker:($('#withTime').val() == 'true'), format:($('#withTime').val()=='true' ? 'd/m/Y H:i':'d/m/Y')});
	$('#calendrier').bind('focus',function() { $('img.imgcal').click(); });
	$('.upcal').bind('change',function() {
		$('#croixcal').hide();
		textes_maj();
	});

	$('#a-out-retour').bind('click',function() {
		dialogPageLoad();
		var h = document.location.href;
		document.location.href = h.split('?')[0]+'?ctrl='+$.base64('encode',$('#frm_controles').serialize());
	});
	$('#a-out-cart').bind('click',function() {
		if ($('#carte_ok').length) {
			if ($('#carte_ok').prop('checked')) {} else {
				$('#text_carte_ok').css('border','solid 2px #f00');
				return false;
			}
		}
		$.post('/websvc/additem.ws.php',{csid: sessid, carte:$.base64('encode',$('#frm_controles').serialize())},function(data) {
			if (data['add-carte']=='ok') {
				dialogPageLoad();
				document.location.href = '/caddie';
			} else { alert('Erreur'); }
		},"json");
	});

	$('#select-quantite').on('selectmenuchange',function() { getprixpack(); });

});

