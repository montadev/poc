		var a_compteur_ventes = [];
		var a_compteur_ventes_image = [];
		var a_compteur_ventes_moves = [];
		var a_compteur_ventes_busy = [];
		var compteur_ventes_hauteur = 27;
		var compteur_images_par_lettre = 6;
		var compteur_nb_chars = 7;

		function compteur_ventes(v) {
			l=v.length;
			$('#divcptventes').empty();
			var u = 0;
			for(var i=l;i>0;i--) {
				var c = v.charAt(i-1);
				a_compteur_ventes[i] = parseInt(c);
				a_compteur_ventes_image[i] = 0;
				u++;
				y = parseInt(c) * compteur_ventes_hauteur * compteur_images_par_lettre;
				$('#divcptventes').append('<div id="divcptventes_'+i+'" style="float:right;background:url(\'/_themes/puzzlethemes/fr/images/compteur2.jpg\');background-position:0 -'+y+'px;width:17px;height:27px"></div>'+(u%3==0 && i>1 ? '<img style="float:right" src="/_themes/puzzlethemes/fr/images/compteur-point.jpg"/>':''));
				a_compteur_ventes_moves[i] = 0;
				a_compteur_ventes_busy[i] = 0;

			}
		}

		function compteur_ventes_incremente(i) {

			a_compteur_ventes_image[i] = a_compteur_ventes_image[i]+1;
			a_compteur_ventes_busy[i] = 1;
			if (a_compteur_ventes_image[i]<=compteur_images_par_lettre) {
				var y = a_compteur_ventes[i] * compteur_ventes_hauteur * compteur_images_par_lettre + a_compteur_ventes_image[i] * compteur_ventes_hauteur ;
				$('#divcptventes_'+i).css('background-position','0 -'+y+'px');
				setTimeout('compteur_ventes_incremente('+i+')',Math.floor(20*(i/2)));
			} else {
				a_compteur_ventes_image[i] = 0;
				a_compteur_ventes[i] = (a_compteur_ventes[i] +1) %10;
				a_compteur_ventes_busy[i] = 0;
				var y = a_compteur_ventes[i] * compteur_ventes_hauteur * compteur_images_par_lettre  ;
				$('#divcptventes_'+i).css('background-position','0 -'+y+'px');
			}
		}

		function compteur_ventes_maj() {
			var todo = false;
			for(var i=1;i<=compteur_nb_chars;i++) {
				if (a_compteur_ventes_moves[i]>0) {
					todo = true;
					if (a_compteur_ventes_busy[i]==0) {
						compteur_ventes_incremente(i);
						a_compteur_ventes_moves[i] = a_compteur_ventes_moves[i] - 1;
					}
				}
			}
			if (todo) { setTimeout('compteur_ventes_maj()',50); }
			else { setTimeout('compteur_ventes_maj()',2000); }
		}

		function compteur_ventes_set_moves(v) {
			var do_move = true;
			var changement = false;
			for(var i=1;i<=compteur_nb_chars;i++) {
				if (a_compteur_ventes_moves[i] > 0) {
					do_move = false;
				}
				var c = v.charAt(i-1);
				var d = parseInt(c);
				if (d - a_compteur_ventes[i] > 0 || d - a_compteur_ventes[i] <0) { changement=true; }
			}
			if (do_move & changement) {
				for(var i=1;i<=compteur_nb_chars;i++) {
					var c = v.charAt(i-1);
					var d = parseInt(c);
					if (d - a_compteur_ventes[i] > 0) {
						a_compteur_ventes_moves[i] = d - a_compteur_ventes[i] ;

					} else {
						if (d - a_compteur_ventes[i] < 0) {
							a_compteur_ventes_moves[i] = d + 10 - a_compteur_ventes[i];
						}
					}
					if (i>(compteur_nb_chars-2)) { a_compteur_ventes_moves[i] = a_compteur_ventes_moves[i] + 10; }

				}
			}
		}
