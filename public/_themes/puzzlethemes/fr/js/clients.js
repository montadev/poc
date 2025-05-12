// Fonctions pour "ma liste de produits"
//

var timerCol_ml ;
var timerRename_ml;

function saveCom_ml(id) {
		if (id>0) {
		$.post('/websvc/maliste.ws.php',{ id : id, t : $('#commentaire_'+id).val() }, 
			function(data) {
				if (data.id>0) {
					$('#commentaire_'+data.id+'_coche').fadeIn(500);
				} 
			},'json');
		}
}

function saveNom_ml() {
		var i = $('#select_ml_input');
		$.post('/websvc/maliste.ws.php',{nom:i.val(),idl:i.attr('rel')},function() {
				$('#select_ml_input_change').fadeIn(500);
		});
}

function calcultotal_ml() {
	var total = 0;
	var nb = 0;
	$('.prixclient_ml').each(function() {
		var id = $(this).attr('id').split('_')[1];
		var coche = $('#coche_'+id);
		if (coche.prop('checked'))  {
			nb+=1;
			total += parseInt(100*$(this).attr('rel'));
		}
	});
	total =total / 100;
	$('span.total_ml').html(localPrice.replace('%PRIX%',total.toFixed(2)));
	$('span.th_nb').html(nb+' '+(nb>1 ? localProduits:localProduit));
}

function vide_maliste() {
	$('<div id="fancybox-loading" style="width:400px"><span>'+local_wait+'</span></div>').appendTo('body');
	$.post('/websvc/maliste.ws.php',{ raz:1 },function() {
		document.location.href=document.location.href;
	});
}

function ml_ajouter() {
		var produits = [];
		$('.prixclient_ml').each(function() {
			var id = $(this).attr('id').split('_')[1];
			var coche = $('#coche_'+id);
			if (coche.prop('checked'))  {
				produits.push(id);
			}
		});
		if (produits.length >0) {
			$('<div id="fancybox-loading" style="width:400px"><span>'+local_wait+'</span></div>').appendTo('body');
			$.get("/websvc/additem.ws.php?liste_id_produit="+produits.join(',')+"&nocache="+Math.random(),function(data) {
					document.location.href='/caddie'; 
			});
		}
}	

function ml_charge_vignettes(id) {
		$('#div_charge_vignettes').empty();
		$.post('/websvc/vignettes.ws.php',{id:id},function(data) {
			alert(data.vignettes);
			if (data.vignettes) {
				$('#div_charge_vignettes').html(data.vignettes);
				$('.fancybox-thumb:first').click();
			}
		},'json');
}

$(function() {
	$('.txtcom_ml').bind('change keyup',function() {
		clearTimeout(timerCol_ml);
		var id = $(this).attr('id').split('_')[1];
		$('#commentaire_'+id+'_coche').hide();
		 timerCol_ml = setTimeout("saveCom_ml("+id+")",300);
	});

	calcultotal_ml();
	$('.maliste_produit_check').bind('change',function() {
		calcultotal_ml();
	});
	$('table.espace_maliste th input[type="checkbox"]').bind('change',function() {
		if ($(this).prop('checked')) {
			$('table.espace_maliste input[type="checkbox"]').prop('checked','checked');
		} else {
			$('table.espace_maliste input[type="checkbox"]').prop('checked','');		
		}
		calcultotal_ml();
	});
	// New select all list
	$('#all-select-list input[type="checkbox"]').bind('change',function() {
		if ($(this).prop('checked')) {
			$('table.espace_maliste input[type="checkbox"]').prop('checked','checked');
		} else {
			$('table.espace_maliste input[type="checkbox"]').prop('checked','');		
		}
		calcultotal_ml();
	});
	$('a.th_add').bind('click',function() { ml_ajouter(); });
	
	$('.select_ml_div').bind('click',function() {
		var id = $(this).attr('id');
		if (id=='ml_create') {
			$('<div id="fancybox-loading" style="width:400px"><span>'+local_wait+'</span></div>').appendTo('body');
			$.get('/websvc/maliste.ws.php',{create:1},function() {
			document.location.href = '/clients/?pg=maliste';
			});
		} else {
			$('<div id="fancybox-loading" style="width:400px"><span>'+local_wait+'</span></div>').appendTo('body');
			var id = $(this).attr('rel');
			$.get('/websvc/maliste.ws.php',{change:id},function() {
				document.location.href = '/clients/?pg=maliste';
			});
		}
	}); 
	$('#select_ml_input').bind('keyup change',function() {
		clearTimeout(timerRename_ml);
		$('#select_ml_input_change').hide();
		timerRename_ml = setTimeout("saveNom_ml()",300);
		var z = $('div.select_ml_div_hl').html();
		var x = z.split('('); 
		$('div.select_ml_div_hl').html($(this).val()+' ('+x[1]);
	});
	
	$('.txtcom_ml').bind('change keyup',function() {
		clearTimeout(timerCol_ml);
		var id = $(this).attr('id').split('_')[1];
		$('#commentaire_'+id+'_coche').hide();
		 timerCol_ml = setTimeout("saveCom_ml("+id+")",300);
	});
	
	$('#ml_supprimer_liste').bind('click',function() {
		$('<div id="fancybox-loading" style="width:400px"><span>'+local_wait+'</span></div>').appendTo('body');
			
		$.post('/websvc/maliste.ws.php',{delet:1,idl:$(this).attr('rel')},function(data) {
			if (data.nok) {
				
			} else {
				document.location.href = '/clients/?pg=maliste';
			}
		});
	});
	
	
	$('#ml_over').bind('mouseenter',function() {
		$('#ml-choix-div').stop(true,true);
		$('#ml-choix-div').fadeIn(200);
	});
	$('#ml_over').on('mouseleave',function() {
		$('#ml-choix-div').stop(true,true);
		$('#ml-choix-div').fadeOut(200);
	});
});



function splitTextIntoLines(text, maxLineLength) {
	const words = text.split(' ');
	const lines = [];
	let currentLine = '';

	words.forEach(word => {
			if ((currentLine + word).length > maxLineLength) {
					lines.push(currentLine.trim());
					currentLine = '';
			}
			currentLine += word + ' ';
	});

	lines.push(currentLine.trim());
	return lines;
}

function downloadPDFWishlist() {
	const products = document.querySelectorAll('.cube_maliste');
	const productList = [];
	const baseUrl = window.location.origin;

	products.forEach(product => {
		const nameElement = product.querySelector('#libelle-produit');
		const piecesElement = product.querySelector('#nb-pieces-produit');
		const priceElement = product.querySelector('#price-produit');
		const linkElement = product.querySelector('#link-produit');

		const name = nameElement ? nameElement.innerText : 'Nom indisponible';
		const pieces = piecesElement ? piecesElement.innerText : 'Pièces indisponibles';
		const price = priceElement ? priceElement.innerText : 'Prix indisponible';
		let lien = linkElement ? linkElement.href : 'Lien indisponible';

		lien = lien.replace(baseUrl + '/clients/', baseUrl + '/');

		productList.push({
			name,
			pieces,
			price,
			lien
		});
	});

	const { jsPDF } = window.jspdf;
	const doc = new jsPDF();

	doc.setFontSize(18);
	doc.text('Liste des produits', 10, 10);

	doc.setFontSize(12);
	let yOffset = 20;
	const maxLineLength = 60;
	const lineHeight = 10;
	const linkHeight = 15;
	const pageHeight = doc.internal.pageSize.height; // Hauteur de la page
	const maxYOffset = pageHeight - 20; // Hauteur maximale avant de passer à une nouvelle page

	productList.forEach((product, index) => {
		const text = `${index + 1}. ${product.name} - ${product.pieces} - ${product.price}`;
		const lines = splitTextIntoLines(text, maxLineLength);

		// Vérifie si une nouvelle page est nécessaire
		if (yOffset + lines.length * lineHeight + linkHeight > maxYOffset) {
			doc.addPage();
			yOffset = 10; // Réinitialise la position verticale
		}

		lines.forEach(line => {
			doc.text(line, 10, yOffset);
			yOffset += lineHeight;
		});

		doc.text('Lien:', 10, yOffset);
		doc.setTextColor(0, 0, 255);
		doc.textWithLink(product.lien, 25, yOffset, { url: product.lien });
		doc.setTextColor(0, 0, 0);
		yOffset += linkHeight;
	});

	doc.save('liste_des_produits.pdf');
}

var idSite = document.getElementById('idSite').value;

if (idSite = 2) {
	$(document).ready(function () {
		$('#ml_create').on('click', function () {
				if (!$(this).hasClass('expanded')) {
						$(this).addClass('expanded');
						$(this).append('<input type="text" id="list_name" placeholder="Saisir le nom de ma liste" />');
						$(this).append('<button id="create_list_btn">OK</button>');
	
						$('#list_name, #create_list_btn').show();
				}
		});

		$('#ml_create_mobile').on('click', function () {
			if (!$(this).hasClass('expanded')) {
				$(this).addClass('expanded');
				$('<div id="new_list_container_mobile" style="padding: 12px;width: 100%;display: flex;box-sizing: border-box;justify-content: space-between;">' +
					'<input type="text" id="list_name_mobile" placeholder="Saisir le nom de ma liste" style="width: 100%;" class="bt-list" />' +
					'<button id="create_list_btn_mobile">OK</button>' +
					'</div>').insertBefore($(this).closest('.content-pagination-mobile'));
			}
		});
	
		$(document).on('click', '#create_list_btn', function () {
				var listName = $('#list_name').val();
				if (listName) {
						createAndUpdateList(listName);
				} else {
						alert('Veuillez entrer un nom de liste');
				}
		});

		$(document).on('click', '#create_list_btn_mobile', function () {
				var listName = $('#list_name_mobile').val();
				if (listName) {
						createAndUpdateList(listName);
				} else {
						alert('Veuillez entrer un nom de liste');
				}
		});
	
		function createAndUpdateList(listName) {
				$('<div id="fancybox-loading" style="width:400px"><span>Chargement...</span></div>').appendTo('body');
	
				var url = '/websvc/maliste.ws.php';
				var params = {
						name: listName
				};
	
				$.get(url, {
						createAndUpdate: 1,
						name: listName
				}, function (response) {
						document.location.href = '/clients/?pg=maliste';
				});
		}
	});
}
