	// gestion des inputs
	function gestion_input(etat,id_input,id_msg,msg,id_icone,id_group){
		if (etat==1){
			$('#'+id_input).addClass('fielderror');

			$('#'+id_msg).html(msg);

			$('#'+id_icone).addClass('glyphicon-remove');
			$('#'+id_icone).removeClass('glyphicon-ok');

			$('#'+id_group).addClass('has-error');
			$('#'+id_group).removeClass('has-success');
		}else{

			$('#'+id_input).removeClass('fielderror');
			$('#'+id_msg).html('');

			$('#'+id_icone).removeClass('glyphicon-remove');
			$('#'+id_icone).addClass('glyphicon-ok');

			$('#'+id_group).removeClass('has-error');
			$('#'+id_group).addClass('has-success');
		}

	}

$(function(){




	$('span.it').bind('click',function() {
		$('span.it').removeClass('selected');
		$(this).addClass('selected');
		$('#ticket_cat').val($(this).data('rel'));
	});

	$('#sendMsg').on('click',function() {
		$('#CTnom').blur();
		$('#CTmail').blur();
		$('#CTmail2').blur();
		if ($('#CTnom').hasClass('fielderror') || $('#CTmail').hasClass('fielderror') || $('#CTmail2').hasClass('fielderror') || $('#message').val()=='' || $('#ticket_cat').val()=='') {
			alert(tplMsg1);
		} else {
			$('#fCT').submit();
		}
	});
	$('#CTnom').on('blur',function(){

		var regex = new RegExp('^(.+)','g');
		var str   = $(this).val().replace(/^\s+|\s+$/g,'');
		str = str.replace(new RegExp('[\\\\/\$\<\>\"\%\#\;\|\{\}]','g'),"");
		$(this).val(str);

		if(str.length < 1 || !regex.test(str)){
			gestion_input(1,"CTnom","msg_err_nom",tplMsg2,"icone_err_nom","msg_err_nom_group");
		}else{
			gestion_input(0,"CTnom","msg_err_nom","","icone_err_nom","msg_err_nom_group");
		}

		/*if(str.length < 1 || !regex.test(str)){
			$('#CTnom').addClass('fielderror');
			$('#msg_err_nom').html(tplMsg2);
			$('#img_err_nom').attr({ 'src' : '/_themes/puzzlethemes/fr/images/nok.png' });
		}else{
			$('#CTnom').removeClass('fielderror');
			$('#msg_err_nom').html('');
			$('#img_err_nom').attr({ 'src' : '/_themes/puzzlethemes/fr/images/ok.png' });
		}*/

	});
	$('#CTmail').on('blur',function(){
		var mail 	= $(this).val();
		mail 		= mail.toLowerCase();
		$(this).val(mail);
		var regex 		= /^[a-z0-9\_]+((-[a-z0-9\_]+)|(\.[a-z0-9\_]+)|(\_[a-z0-9]+))*\@[a-z0-9]+((\.|-)[a-z0-9]+)*\.[a-z]{2,}$/;

		if(mail.length < 1 || !regex.test(mail)){
			gestion_input(1,"CTmail","msg_err_email",tplMsg3,"icone_err_email","msg_err_email_group");
		}else{
			gestion_input(0,"CTmail","msg_err_email","","icone_err_email","msg_err_email_group");
		}

		/*if(mail.length < 1 || !regex.test(mail)){
			$('#CTmail').addClass('fielderror');
			$('#msg_err_mail').html(tplMsg3);
			$('#img_err_mail').attr({ 'src' : '/_themes/puzzlethemes/fr/images/nok.png' });
		}else{
			$('#CTmail').removeClass('fielderror');
			$('#msg_err_mail').html('');
			$('#img_err_mail').attr({ 'src' : '/_themes/puzzlethemes/fr/images/ok.png' });
		}*/
	});
	$('#CTmail2').on('blur',function(){
		var mail 	= $(this).val();
		var mail1   = $('#CTmail').val();
		mail 		= mail.toLowerCase();
		$(this).val(mail);

		if(mail1 != mail || mail.length<1 || $('#CTmail').hasClass('fielderror')){
			gestion_input(1,"CTmail2","msg_err_email2",tplMsg4,"icone_err_email2","msg_err_email2_group");
		}else{
			gestion_input(0,"CTmail2","msg_err_email2","","icone_err_email2","msg_err_email2_group");
		}
		/*if(mail1 != mail || mail.length<1 || $('#CTmail').hasClass('fielderror')){
			$('#CTmail2').addClass('fielderror');
			$('#msg_err_mail2').html(tplMsg4);
			$('#img_err_mail2').attr({ 'src' : '/_themes/puzzlethemes/fr/images/nok.png' });
		}else{
			$('#CTmail2').removeClass('fielderror');
			$('#msg_err_mail2').html('');
			$('#img_err_mail2').attr({ 'src' : '/_themes/puzzlethemes/fr/images/ok.png' });
		}*/
	});


	$('#message').on('blur',function(){
		var message 	= $(this).val();

		if(message.length < 5){
			gestion_input(1,"message","msg_err_message",local_msg_message_oblig,"icone_err_message","msg_err_message_group");
		}else{
			gestion_input(0,"message","msg_err_message","","icone_err_message","msg_err_message_group");
		}

		/*if(mail.length < 1 || !regex.test(mail)){
			$('#CTmail').addClass('fielderror');
			$('#msg_err_mail').html(tplMsg3);
			$('#img_err_mail').attr({ 'src' : '/_themes/puzzlethemes/fr/images/nok.png' });
		}else{
			$('#CTmail').removeClass('fielderror');
			$('#msg_err_mail').html('');
			$('#img_err_mail').attr({ 'src' : '/_themes/puzzlethemes/fr/images/ok.png' });
		}*/
	});





	$('#Icode_porte, #Icode_porte2, #Iinterphone').addClass('clean');

	$(document).on('keyup keydown','.clean_tel',function(){
		var reg = new RegExp('[^0-9]','g');
		var str = $(this).val();

		$(this).val(str.replace(reg,''));
	});

	$(document).on('keyup','.ws_cp',function(){
		var str = $(this).val();
		str 	= str.replace(' ','');

		$(this).val(str);

		if($(this).val().length > 4){
			$.post('../websvc/getvilles.ws.php',{ iso : $('#Ipays').val(),
												  cp  : $(this).val() },function(theResponse){
				var villes = theResponse.split(',');
				$('#getvilles').html('');

				if(theResponse != -1){
					$('#getvilles').show();

					$.each(villes,function(key,value){
						$('<span>'+value+'</span>').attr('id','ville_'+key).click(function(){
							$('#getvilles').hide();
							$('.ws_ville').val(value);
							/*$('#Iville').removeClass('fielderror');
							$('#msg_err_ville').html('');
							$('#img_err_ville').attr({ 'src' : '/_themes/puzzlethemes/fr/images/ok.png' });
							$('#tr_err_ville').hide();	*/

							gestion_input(0,"Iville","msg_err_ville","","icone_err_ville","msg_err_ville");

						}).appendTo($('#getvilles'));
					});

				}else{ $('#getvilles').hide(); }

				//$('.ws_ville').focus(function(){ $('#getvilles').hide(); });
				//$('.ws_ville').blur(function(){ $('#getvilles').hide(); });
			});
		}else{
			$('.ws_ville').val('');
			$('#getvilles').hide();
		}
	});


	$('#Imail').bind('blur',function(){
		var mail 	= $(this).val();
		mail 		= mail.toLowerCase();
		$(this).val(mail);
		var regex 		= /^[a-z0-9\_]+((-[a-z0-9\_]+)|(\.[a-z0-9\_]+)|(\_[a-z0-9]+))*\@[a-z0-9]+((\.|-)[a-z0-9]+)*\.[a-z]{2,}$/;
		if(mail.length < 1 || !regex.test(mail)){
			/*$('#Imail').addClass('fielderror');
			$('#msg_err_email_group').addClass('has-error');
			$('#msg_err_email_group').removeClass('has-success');
			$('#msg_err_email').html(localClientInvalidMail);
			$('#img_err_email').attr({ 'src' : '/_themes/puzzlethemes/fr/images/nok.png' });
			$('#tr_err_email').show();*/

			gestion_input(1,"Imail","msg_err_email",localClientInvalidMail,"icone_err_email","msg_err_email_group");

		}else{
			$.post('/websvc/accountexist.ws.php',{ mail: mail },function(response){
				if(response != '-1'){

					/*$('#Imail').addClass('fielderror');
					$('#msg_err_email_group').addClass('has-error');
					$('#msg_err_email_group').removeClass('has-success');
					$('#msg_err_email').html('Email déjà utilisé pour un autre compte.');
					$('#img_err_email').attr({ 'src' : '/_themes/puzzlethemes/fr/images/nok.png' });
					$('#tr_err_email').show();*/

					gestion_input(1,"Imail","msg_err_email",localClientExistingMail,"icone_err_email","msg_err_email_group");

					/*$('<tr><td style="text-align:right !important">' +
					 '	<label for="Ipwd"><strong>'+localClientInvalidPwd+'</strong>&nbsp;<span class="required">*</span></label> :' +
					 '</td>' +
					 '<td>' +
					 '	<input id="Ipwd" type="password" name="pwd" size="20" />' +
					 '</td></tr>').appendTo($('#table_mail'));

					$('.hidd').remove();
					//$('#table_mail').siblings('.hidd').remove();
					$('#table_mail').after(response);

					$('#hchg').attr('name','f_connect');
					$('#Imail').attr('name','mail').unbind('blur');

					$('form').attr('action','/clients/');*/
				}else{
					/*$('#Imail').removeClass('fielderror');
					$('#msg_err_email_group').removeClass('has-error');
					$('#msg_err_email_group').addClass('has-success');
					$('#msg_err_email').html('');
					$('#img_err_email').attr({ 'src' : '/_themes/puzzlethemes/fr/images/ok.png' });
					$('#tr_err_email').hide();*/

					gestion_input(0,"Imail","msg_err_email","","icone_err_email","msg_err_email_group");

				}
			});


		}
	});

	$('#ImailInscription').bind('blur',function(){
		var mail 	= $(this).val();
		mail 		= mail.toLowerCase();
		$(this).val(mail);
		var regex 		= /^[a-z0-9\_]+((-[a-z0-9\_]+)|(\.[a-z0-9\_]+)|(\_[a-z0-9]+))*\@[a-z0-9]+((\.|-)[a-z0-9]+)*\.[a-z]{2,}$/;
		if(mail.length < 1 || !regex.test(mail)){
			gestion_input(1,"ImailInscription","msg_err_email",localClientInvalidMail,"icone_err_email","msg_err_email_group");
		}else{
			$.post('/websvc/accountexist.ws.php',{ mail: mail },function(response){
				if(response != '-1'){
					gestion_input(1,"ImailInscription","msg_err_email",localClientExistingMail,"icone_err_email","msg_err_email_group");
				}else{
					gestion_input(0,"ImailInscription","msg_err_email","","icone_err_email","msg_err_email_group");

				}
			});


		}
	});

	$('#Imail2').bind('blur',function(){
		var mail 	= $(this).val();
		mail 		= mail.toLowerCase();
		var mailorigine 	= $('#Imail').val();
		mailorigine 		= mailorigine.toLowerCase();
		$(this).val(mail);
		var regex 		= /^[a-z0-9\_]+((-[a-z0-9\_]+)|(\.[a-z0-9\_]+)|(\_[a-z0-9]+))*\@[a-z0-9]+((\.|-)[a-z0-9]+)*\.[a-z]{2,}$/;
		if(mail.length < 1 || !regex.test(mail)){


			gestion_input(1,"Imail2","msg_err_email2",localClientInvalidMail,"icone_err_email2","msg_err_email_group2");
		}else if(mail != mailorigine){
			gestion_input(1,"Imail2","msg_err_email2",localClientInvalidMail,"icone_err_email2","msg_err_email_group2");
		}else{


					gestion_input(0,"Imail2","msg_err_email2","","icone_err_email2","msg_err_email_group2");





		}
	});

	$('#numdossier').bind('blur', function() {
		var reg = new RegExp('^[0-9]{7,}[A-Z]{3}$','g');
		if(reg.test($(this).val())){
			$('#img_err_nd').attr({ 'src' : '/_themes/puzzlethemes/fr/images/ok.png' });
			$('#msg_err_nd').html('').hide();
		} else {
			$('#img_err_nd').attr({ 'src' : '/_themes/puzzlethemes/fr/images/nok.png' });
			$('#msg_err_nd').html(localClientInvalidND).show();
		}
	}).focus();

	$('#Ipwd').bind('blur',function(){
		var pwd1 	= $('#Ipwd').val();
		if(pwd1.length >= 6) {
			/*$('#img_err_pwd').attr({ 'src' : '/_themes/puzzlethemes/fr/images/ok.png' });
			$('#msg_err_pwd').html('');
			$('#tr_err_pwd').hide();
			$('#Ipwd').removeClass('fielderror');
			$('#msg_err_pwd_group').addClass('has-success');
			$('#msg_err_pwd_group').removeClass('has-error');*/

			gestion_input(0,"Ipwd","msg_err_pwd","","icone_err_pwd","msg_err_pwd_group");

		} else {
			/*$('#img_err_pwd').attr({ 'src' : '/_themes/puzzlethemes/fr/images/nok.png' });
			$('#msg_err_pwd').html(localClientInvalidPwd);
			$('#tr_err_pwd').show();
			$('#Ipwd').addClass('fielderror');
			$('#msg_err_pwd_group').addClass('has-error');
			$('#msg_err_pwd_group').removeClass('has-success');*/

			gestion_input(1,"Ipwd","msg_err_pwd",localClientInvalidPwd,"icone_err_pwd","msg_err_pwd_group");

		}
	});

	$('#Ipwd2').bind('blur',function(){
		var pwd1 	= $('#Ipwd').val();
		var pwd2 	= $('#Ipwd2').val();
		if(pwd1 == pwd2 && pwd2.length >= 4) {
			/*$('#img_err_pwd2').attr({ 'src' : '/_themes/puzzlethemes/fr/images/ok.png' });
			$('#msg_err_pwd2').html('');
			$('#tr_err_pwd2').hide();
			$('#Ipwd2').removeClass('fielderror');
			$('#msg_err_pwd2_group').addClass('has-success');
			$('#msg_err_pwd2_group').removeClass('has-error');*/

			gestion_input(0,"Ipwd2","msg_err_pwd2","","icone_err_pwd2","msg_err_pwd2_group");
		} else {
			/*$('#img_err_pwd2').attr({ 'src' : '/_themes/puzzlethemes/fr/images/nok.png' });
			$('#msg_err_pwd2').html(localClientInvalidPwd2);
			$('#tr_err_pwd2').show();
			$('#Ipwd2').addClass('fielderror');
			$('#msg_err_pwd2_group').addClass('has-error');
			$('#msg_err_pwd2_group').removeClass('has-success');	*/

			gestion_input(1,"Ipwd2","msg_err_pwd2",localClientInvalidPwd2,"icone_err_pwd2","msg_err_pwd2_group");
		}
	});

	$('#Imail_market').bind('blur',function(){
		var mail 	= $(this).val();
		mail 		= mail.toLowerCase();

		$(this).val(mail);

		var regex 		= /^[a-z0-9\_]+((-[a-z0-9\_]+)|(\.[a-z0-9\_]+)|(\_[a-z0-9]+))*\@[a-z0-9]+((\.|-)[a-z0-9]+)*\.[a-z]{2,}$/;
		//(yopmail|spamgourmet|jetable|ephemail|iximail)
		if(mail.length < 1 || !regex.test(mail)){
			$('#Imail').addClass('fielderror');
			$('#msg_err_email').html(localClientInvalidMail);
			$('#img_err_email').attr({ 'src' : '/_themes/puzzlethemes/fr/images/nok.png' });
			$('#tr_err_email').show();
		}else{
			$.post('/websvc/accountexist.ws.php',{ mail: mail },function(response){
				if(response != '-1'){

					$('#confirmPwd').remove();

					$('#hchg').attr('name','f_connect');
					$('#Imail').attr('name','mail').die('blur');
					$('#Imail').addClass('existingmail');


				}
				$('#Imail').removeClass('fielderror');

				$('#msg_err_email').html('');
				$('#img_err_email').attr({ 'src' : '/_themes/puzzlethemes/fr/images/ok.png' });
				$('#tr_err_email').hide();
			});
		}
	});


	$(document).on('blur','#Icp',function(){
		var pays = $('#Ipays').val();

		if(pays == 'FR' || pays == 'GP' || pays == 'GF' ||
		   pays == 'MQ' || pays == 'YT' || pays == 'RE' ||
		   pays == 'PM' || pays == 'NC' || pays == 'PF' ||
		   pays == 'WF' || pays == 'MC' || pays == 'ARMEE 25000'){

			var reg = new RegExp('^[0-9]{5}$','g');

			if(!reg.test($(this).val())){
				/*$('#Icp').addClass('fielderror');
				$('#msg_err_cp').html(localClientInvalidCP);
				$('#img_err_cp').attr({ 'src' : '/_themes/puzzlethemes/fr/images/nok.png' });
				$('#tr_err_cp').show();

				$('#msg_err_cp_group').addClass('has-error');
				$('#msg_err_cp_group').removeClass('has-success');*/

				gestion_input(1,"Icp","msg_err_cp",localClientInvalidCP,"icone_err_cp","msg_err_cp_group");

			}else{
				/*$('#Icp').removeClass('fielderror');
				$('#msg_err_cp').html('');
				$('#img_err_cp').attr({ 'src' : '/_themes/puzzlethemes/fr/images/ok.png' });
				$('#tr_err_cp').hide();

				$('#msg_err_cp_group').removeClass('has-error');
				$('#msg_err_cp_group').addClass('has-success');	*/

				gestion_input(0,"Icp","msg_err_cp","","icone_err_cp","msg_err_cp_group");

				var change = false;

				if($(this).val().substring(0,2) < '97' && pays != 'FR'){ $('#Ipays').val('FR'); change = true; }
				if($(this).val().substring(0,3) == '970' || $(this).val().substring(0,3) == '971'){ $('#Ipays').val('GP'); }
				if($(this).val().substring(0,3) == '973'){ $('#Ipays').val('GF'); }
				if($(this).val().substring(0,3) == '972'){ $('#Ipays').val('MQ'); }
				if($(this).val().substring(0,3) == '976'){ $('#Ipays').val('YT'); }
				if($(this).val().substring(0,3) == '974'){ $('#Ipays').val('RE'); }
				if($(this).val().substring(0,3) == '975'){ $('#Ipays').val('PM'); }
				if($(this).val().substring(0,3) == '988'){ $('#Ipays').val('NC'); }
				if($(this).val().substring(0,3) == '987'){ $('#Ipays').val('PF'); }
				if($(this).val().substring(0,3) == '986'){ $('#Ipays').val('WF'); }
				if($(this).val().substring(0,3) == '980'){ $('#Ipays').val('MC'); }
				if($(this).val().substring(0,2) == '00'){ $('#Ipays').val('ARMEE 25000'); }

				if(change){ $('.ws_cp').keyup(); }
			}
		}else{
			var reg2 = new RegExp('@','g');
			if($(this).val().length < 1 && pays != 'IE'){
				/*$('#Icp').addClass('fielderror');
				$('#msg_err_cp').html(localClientInvalidCP);
				$('#img_err_cp').attr({ 'src' : '/_themes/puzzlethemes/fr/images/nok.png' });
				$('#tr_err_cp').show();

				$('#msg_err_cp_group').addClass('has-error');
				$('#msg_err_cp_group').removeClass('has-success');	*/

				gestion_input(1,"Icp","msg_err_cp",localClientInvalidCP,"icone_err_cp","msg_err_cp_group");
			} else if(reg2.test($(this).val())){
				gestion_input(1,"Icp","msg_err_cp",localClientInvalidCP,"icone_err_cp","msg_err_cp_group");
			}else{
				/*$('#Icp').removeClass('fielderror');
				$('#msg_err_cp').html('');
				$('#img_err_cp').attr({ 'src' : '/_themes/puzzlethemes/fr/images/ok.png' });
				$('#tr_err_cp').hide();

				$('#msg_err_cp_group').removeClass('has-error');
				$('#msg_err_cp_group').addClass('has-success');*/

				gestion_input(0,"Icp","msg_err_cp","","icone_err_cp","msg_err_cp_group");
			}
		}
	});

	$(document).on('blur','#LIcp',function(){
		if($(this).is(':visible')) {
		var pays = $('#ILpays').val();

		if(pays == 'FR' || pays == 'GP' || pays == 'GF' ||
		   pays == 'MQ' || pays == 'YT' || pays == 'RE' ||
		   pays == 'PM' || pays == 'NC' || pays == 'PF' ||
		   pays == 'WF' || pays == 'MC' || pays == 'ARMEE 25000'){

			var reg = new RegExp('^[0-9]{5}$','g');

			if(!reg.test($(this).val())){
				/*$('#Icp').addClass('fielderror');
				$('#msg_err_cp').html(localClientInvalidCP);
				$('#img_err_cp').attr({ 'src' : '/_themes/puzzlethemes/fr/images/nok.png' });
				$('#tr_err_cp').show();

				$('#msg_err_cp_group').addClass('has-error');
				$('#msg_err_cp_group').removeClass('has-success');*/

				gestion_input(1,"ILcp","msg_err_Lcp",localClientInvalidCP,"icone_err_Lcp","msg_err_Lcp_group");

			}else{
				/*$('#Icp').removeClass('fielderror');
				$('#msg_err_cp').html('');
				$('#img_err_cp').attr({ 'src' : '/_themes/puzzlethemes/fr/images/ok.png' });
				$('#tr_err_cp').hide();

				$('#msg_err_cp_group').removeClass('has-error');
				$('#msg_err_cp_group').addClass('has-success');	*/

				gestion_input(0,"ILcp","msg_err_Lcp","","icone_err_Lcp","msg_err_Lcp_group");

				var change = false;

				if($(this).val().substring(0,2) < '97' && pays != 'FR'){ $('#ILpays').val('FR'); change = true; }
				if($(this).val().substring(0,3) == '970' || $(this).val().substring(0,3) == '971'){ $('#ILpays').val('GP'); }
				if($(this).val().substring(0,3) == '973'){ $('#ILpays').val('GF'); }
				if($(this).val().substring(0,3) == '972'){ $('#ILpays').val('MQ'); }
				if($(this).val().substring(0,3) == '976'){ $('#ILpays').val('YT'); }
				if($(this).val().substring(0,3) == '974'){ $('#ILpays').val('RE'); }
				if($(this).val().substring(0,3) == '975'){ $('#ILpays').val('PM'); }
				if($(this).val().substring(0,3) == '988'){ $('#ILpays').val('NC'); }
				if($(this).val().substring(0,3) == '987'){ $('#ILpays').val('PF'); }
				if($(this).val().substring(0,3) == '986'){ $('#ILpays').val('WF'); }
				if($(this).val().substring(0,3) == '980'){ $('#ILpays').val('MC'); }
				if($(this).val().substring(0,2) == '00'){ $('#ILpays').val('ARMEE 25000'); }

				if(change){ $('.ws_cp').keyup(); }
			}
		}else{
			if($(this).val().length < 1 && pays != 'IE'){
				/*$('#Icp').addClass('fielderror');
				$('#msg_err_cp').html(localClientInvalidCP);
				$('#img_err_cp').attr({ 'src' : '/_themes/puzzlethemes/fr/images/nok.png' });
				$('#tr_err_cp').show();

				$('#msg_err_cp_group').addClass('has-error');
				$('#msg_err_cp_group').removeClass('has-success');	*/

				gestion_input(1,"ILcp","msg_err_Lcp",localClientInvalidCP,"icone_err_Lcp","msg_err_Lcp_group");

			}else{
				/*$('#Icp').removeClass('fielderror');
				$('#msg_err_cp').html('');
				$('#img_err_cp').attr({ 'src' : '/_themes/puzzlethemes/fr/images/ok.png' });
				$('#tr_err_cp').hide();

				$('#msg_err_cp_group').removeClass('has-error');
				$('#msg_err_cp_group').addClass('has-success');*/

				gestion_input(0,"ILcp","msg_err_Lcp","","icone_err_Lcp","msg_err_Lcp_group");
			}
		}
	}
	});

	$(document).on('blur','#IpaysB2B',function(){

		var str   = $(this).val();
		str = str.replace(new RegExp('[\\\\/\$\<\>\"\%\#\;\|\{\}]','g'),"");
		$(this).val(str);

		//var regex = new RegExp('^[A-Za-z0-9\-]+','g');
		//var str   = $(this).val().replace(/^\s+|\s+$/g,''); //Remplace le trim

		if(str.length < 1){
			$('#IpaysB2B').addClass('fielderror');
		}else{
			$('#IpaysB2B').removeClass('fielderror');
		}
	});



	$(document).on('blur','#Inom',function(){

		var str   = $(this).val();
		str = str.replace(new RegExp('[\\\\/\$\<\>\"\%\#\;\|\{\}]','g'),"");
		$(this).val(str);

		//var regex = new RegExp('^[A-Za-z0-9\-]+','g');
		//var str   = $(this).val().replace(/^\s+|\s+$/g,''); //Remplace le trim

		if(str.length < 1){
			gestion_input(1,"Inom","msg_err_nom",localClientInvalidNom,"icone_err_nom","msg_err_nom_group");
		}else{
			gestion_input(0,"Inom","msg_err_nom","","icone_err_nom","msg_err_nom_group");
		}
	});

	$(document).on('blur','#Iprenom',function(){

		var str   = $(this).val();
		str = str.replace(new RegExp('[\\\\/\$\<\>\"\%\#\;\|\{\}]','g'),"");
		$(this).val(str);

		//var regex = new RegExp('^[A-Za-z0-9\-]+','g');
		//var str   = $(this).val().replace(/^\s+|\s+$/g,''); //Remplace le trim

		if(str.length < 1){
			gestion_input(1,"Iprenom","msg_err_prenom",localClientInvalidNom,"icone_err_prenom","msg_err_prenom_group");
		}else{
			gestion_input(0,"Iprenom","msg_err_prenom","","icone_err_prenom","msg_err_prenom_group");
		}
	});





	$(document).on('blur','#Iadresse',function(){
		if($(this).val().length < 5){
			gestion_input(1,"Iadresse","msg_err_adr",localClientInvalidAdr,"icone_err_adr","msg_err_adr_group");
		}else{
			gestion_input(0,"Iadresse","msg_err_adr","","icone_err_adr","msg_err_adr_group");
		}

	});

	$(document).on('blur','#Iville',function(){

		if($(this).val().length < 1){
			gestion_input(1,"Iville","msg_err_ville",localClientInvalidVille,"icone_err_ville","msg_err_ville_group");
		}else{
			gestion_input(0,"Iville","msg_err_ville","","icone_err_ville","msg_err_ville_group");
		}

	});

	$(document).on('blur','#Itelfixe, #Itelportable',function(){ checkTels(); });

	$(document).on('blur','#Ifax',function(){
		var tel = $('#Ifax').val();
		if(tel.length > 0){
			var regexTel = /^(\+[0-9]{2})?[0-9]{9,15}$/;
			if (!regexTel.test(tel)){
				$('#Ifax').addClass('fielderror');
			}else{
				$('#Ifax').removeClass('fielderror');
			}
		}else{ $('#Ifax').removeClass('fielderror'); }
	});

	$(document).on('blur','#ILadresse',function(){
		if($(this).is(':visible')) {
			if($(this).val().length < 5){
				gestion_input(1,"ILadresse","msg_err_Ladr",localClientInvalidAdr,"icone_err_Ladr","msg_err_Ladr_group");
			}else{
				gestion_input(0,"ILadresse","msg_err_Ladr","","icone_err_Ladr","msg_err_Ladr_group");
			}
		}
	});
	$(document).on('blur','#ILville',function(){
		if($(this).is(':visible')) {
			if($(this).val().length < 1){
				gestion_input(1,"ILville","msg_err_Lville",localClientInvalidAdr,"icone_err_Lville","msg_err_Lville_group");
			}else{
				gestion_input(0,"ILville","msg_err_Lville","","icone_err_Lville","msg_err_Lville_group");
			}
	}

	});


	$(document).on('submit','#form',function() {

		$('#mail,#Inom,#Iprenom,#soc,#Iadresse,#Icp,#Iville,#Itelportable,#Ipwd,#Ipwd2,#ILadresse,#ILcp,#ILville,#Cno_tva,#IpaysB2B').blur();
		//$('#Inom').keydown();
		checkTels(1);
		checkCiv();
		if($('.dataerror').length > 0){
			alert(local_msg_element_non_valides);
			return false;
		}
		if($('.fielderror').length > 0){
			alert(local_msg_erreur_inscription);
			return false;
		}
	});




	var idSite = document.getElementById('idSite').value;

	if (idSite != 2) {
		$('#mail').bind('blur',function(){

			var mail 	= $(this).val();
			mail 		= mail.toLowerCase();
			$(this).val(mail);
			var regex 		= /^[a-z0-9\_]+((-[a-z0-9\_]+)|(\.[a-z0-9\_]+)|(\_[a-z0-9]+))*\@[a-z0-9]+((\.|-)[a-z0-9]+)*\.[a-z]{2,}$/;
			if(mail.length < 1 || !regex.test(mail)){
				gestion_input(1,"mail","msg_err_email",localClientInvalidMail,"icone_err_email","msg_err_email_group");

			}else{
				gestion_input(0,"mail","msg_err_email","","icone_err_email","msg_err_email_group");


			}
		}).focus();
	} else {
		$('#mail').bind('blur',function(){

			var mail 	= $(this).val();
			mail 		= mail.toLowerCase();
			$(this).val(mail);
			var regex 		= /^[a-z0-9\_]+((-[a-z0-9\_]+)|(\.[a-z0-9\_]+)|(\_[a-z0-9]+))*\@[a-z0-9]+((\.|-)[a-z0-9]+)*\.[a-z]{2,}$/;
			if(mail.length < 1 || !regex.test(mail)){
				gestion_input(1,"mail","msg_err_email",localClientInvalidMail,"icone_err_email","msg_err_email_group");

			}else{
				gestion_input(0,"mail","msg_err_email","","icone_err_email","msg_err_email_group");


			}
		})
	}


	$('#mail2').bind('blur',function(){
		var mail 	= $(this).val();
		mail 		= mail.toLowerCase();
		$(this).val(mail);
		var regex 		= /^[a-z0-9\_]+((-[a-z0-9\_]+)|(\.[a-z0-9\_]+)|(\_[a-z0-9]+))*\@[a-z0-9]+((\.|-)[a-z0-9]+)*\.[a-z]{2,}$/;
		if(mail.length < 1 || !regex.test(mail)){
			gestion_input(1,"mail2","msg_err_email2",localClientInvalidMail,"icone_err_email2","msg_err_email2_group");

		}else{
			gestion_input(0,"mail2","msg_err_email2","","icone_err_email2","msg_err_email2_group");


		}
	}).focus();

   $(document).ready(function () {
      $('#mail2').bind('paste', function (e) {
         e.preventDefault();
      });
   });

	$(document).on('submit','#formadressemail',function() {
		$('#mail,#mail2').blur();
		//$('#mail').keydown();
		if($('.fielderror').length > 0){
			alert(local_msg_element_non_valides);
			return false;
		}
	});


   $(document).ready(function () {
      $('#npass2').bind('paste', function (e) {
         e.preventDefault();
      });
   });

	$('#pass').bind('blur',function(){
		var pwd1 	= $('#pass').val();
		if(pwd1.length >= 3) {
			gestion_input(0,"pass","msg_err_pass","","icone_err_pass","msg_err_pass_group");

		} else {

			gestion_input(1,"pass","msg_err_pass",local_msg_saisi_old_mdp,"icone_err_pass","msg_err_pass_group");

		}
	});


	$("#select_all_marques").click(function(){
		$('input:checkbox[name="marques[]"]:enabled').not(this).prop('checked', this.checked);
	});

	$('#Cno_tva').bind('click', function() {
		if( $('#Cno_tva').is(':checked') ){
			$('#ITVA').attr('disabled','disabled');
		} else {
			$('#ITVA').removeAttr('disabled');
		}

		if( !$('#Cno_tva').is(':checked') && $('#ITVA').val()=='' ){


			gestion_input(1,"tva","msg_err_tva",local_msg_saisi_old_mdp,"icone_err_tva","msg_err_tva_group");
			$('#ITVA').addClass('dataerror');
		} else {
			gestion_input(0,"tva","msg_err_tva","","icone_err_tva","msg_err_tva_group");
			$('#ITVA').removeClass('dataerror');



		}
	});
	$('#Cno_tva').bind('blur', function() {
		if( !$('#Cno_tva').is(':checked') && $('#ITVA').val()=='' ){


			gestion_input(1,"tva","msg_err_tva",local_msg_saisi_old_mdp,"icone_err_tva","msg_err_tva_group");
			$('#ITVA').addClass('dataerror');
		} else {

			gestion_input(0,"tva","msg_err_tva","","icone_err_tva","msg_err_tva_group");
			$('#ITVA').removeClass('dataerror');


		}
	});
	$('#ITVA').bind('blur', function() {
		if( !$('#Cno_tva').is(':checked') && $('#ITVA').val()=='' ){


			gestion_input(1,"tva","msg_err_tva",local_msg_saisi_old_mdp,"icone_err_tva","msg_err_tva_group");
			$('#ITVA').addClass('dataerror');
		} else {

			gestion_input(0,"tva","msg_err_tva","","icone_err_tva","msg_err_tva_group");
			$('#ITVA').removeClass('dataerror');


		}
	});
	$('#Iadr_diff').bind('click', function() {
		if( $('#Iadr_diff').is(':checked') ){
			$('#blocLadr').show()
		} else {
			$('#blocLadr').hide();
		}
	});

	$('#npass').bind('blur',function(){
		var pwd1 	= $('#npass').val();
		if(pwd1.length >= 3 && pwd1.length <=20) {
			gestion_input(0,"npass","msg_err_npass","","icone_err_npass","msg_err_npass_group");

		} else {

			gestion_input(1,"npass","msg_err_npass",local_msg_saisi_new_mdp,"icone_err_npass","msg_err_npass_group");

		}
	});

	$('#npass2').bind('blur',function(){
		var pwd1 	= $('#npass2').val();
		if(pwd1.length >= 3 && pwd1.length <=20) {
			gestion_input(0,"npass2","msg_err_npass2","","icone_err_npass2","msg_err_npass2_group");

		} else {

			gestion_input(1,"npass2","msg_err_npass2",local_msg_confirm_mdp,"icone_err_npass2","msg_err_npass2_group");

		}
	});


	if (idSite == 2) {
		$(document).on('submit', '#formmdp', function() {
			var $form = $(this);
			$form.find('#pass, #npass, #npass2').blur();
			if ($form.find('.fielderror').length > 0) {
					alert(local_msg_element_non_valides);
					return false;
			}
		});
	} else {
		$(document).on('submit','#formmdp',function() {
			$('#pass,#npass,#npass2').blur();
			//$('#pass').keydown();
			if($('.fielderror').length > 0){
				alert(local_msg_element_non_valides);
				return false;
			}
		});
	}




	$('.radioWAC').bind('click',function(){
		if($(this).val() == '1'){
			$('#dtNaissancePrevue').show();
		}else{
			$('#dtNaissancePrevue').find('select').val('');
			$('#dtNaissancePrevue').hide();
		}
	});

	$('#show_complement_inscription').bind('click',function(){
		$(this).hide();
		$('#hide_complement_inscription').show();
		$('#complement_inscription').show();
	}).show();

	$('#hide_complement_inscription').bind('click',function(){
		$(this).hide();
		$('#show_complement_inscription').show();
		$('#complement_inscription').hide();
	}).hide();

	$('#main_espaceclient').find('input,select').bind('focus',function(){
		$(this).addClass('focus');
	}).bind('blur',function(){
		$(this).removeClass('focus');
	});

	var checkCiv = function() {
		var c = parseInt($('input[name=civilite]:checked').val());


		if (c!=1 && c!=2 && c!=3) {
			gestion_input(1,"Icivilite","msg_err_civilite",localClientInvalidCiv,"icone_err_civilite","msg_err_civilite_group");
		}else{
			gestion_input(0,"Icivilite","msg_err_civilite","","icone_err_civilite","msg_err_civilite_group");
		}


		/*if (c!=1 && c!=2 && c!=3) {
				$('#img_err_civilite').attr({ 'src' : '/_themes/puzzlethemes/fr/images/nok.png' });
				$('#msg_err_civilite').html('Veuillez sélectionner votre civilité');
				$('#Icivilite').addClass('fielderror');
				$('#msg_err_civilite_group').addClass('has-error');
				$('#msg_err_civilite_group').removeClass('has-success');
		} else {
				$('#Icivilite').removeClass('fielderror');
				$('#msg_err_civilite').html('');
				$('#img_err_civilite').attr({ 'src' : '/_themes/puzzlethemes/fr/images/blank.png' });
				$('#msg_err_civilite_group').removeClass('has-error');
				$('#msg_err_civilite_group').addClass('has-success');
		}*/
	}

	var checkTels = function(check){
		var telFixe = '';
		if ($('#Itelfixe').length) { telFixe = $('#Itelfixe').val(); }
		var telPort = $('#Itelportable').val();

		if(telFixe == '' && telPort == ''){
				/*$('#img_err_numero').attr({ 'src' : '/_themes/puzzlethemes/fr/images/nok.png' });
				$('#img_err_numero1').attr({ 'src' : '/_themes/puzzlethemes/fr/images/nok.png' });
				$('#img_err_numero2').attr({ 'src' : '/_themes/puzzlethemes/fr/images/nok.png' });*/
				if ($('#Itelfixe').length) {
					$('#Itelfixe').addClass('fielderror');
				}
				$('#msg_err_numero').html(localClientInvalidTel);
				if ($('#msg_err_numero2').length) {
					//$('#msg_err_numero1').html(localClientInvalidTel1);
					gestion_input(1,"Itelportable","msg_err_numero1",localClientInvalidTel1,"icone_err_numero","msg_err_numero_group");
					//$('#msg_err_numero2').html(localClientInvalidTel2);
					gestion_input(1,"Itelportable","msg_err_numero2",localClientInvalidTel2,"icone_err_numero","msg_err_numero_group");
					/*$('#msg_err_numero1').parent().css('border-left','solid 1px #ff0000');
					$('#msg_err_numero2').parent().css('border-left','solid 1px #ff0000');*/
				} else {
					//$('#msg_err_numero').html(localClientInvalidTel);
					gestion_input(1,"Itelportable","msg_err_numero",localClientInvalidTel,"icone_err_numero","msg_err_numero_group");
					//$('#msg_err_numero1').html(localClientInvalidTel);
					gestion_input(1,"Itelportable","msg_err_numero1",localClientInvalidTel,"icone_err_numero","msg_err_numero_group");
				}
				/*$('#Itelportable').addClass('fielderror');
				$('#msg_err_numero_group').addClass('has-error');
				$('#msg_err_numero_group').removeClass('has-success');*/



		}else{

				if ($('#Itelfixe').length) { $('#Itelfixe').removeClass('fielderror'); }
			/*$('#Itelportable').removeClass('fielderror');
			$('#msg_err_numero_group').removeClass('has-error');
			$('#msg_err_numero_group').addClass('has-success');
			$('#msg_err_numero').html('');*/

			gestion_input(0,"Itelportable","msg_err_numero","","icone_err_numero","msg_err_numero_group");

			if ($('#msg_err_numero2').length) {
				$('#msg_err_numero1').html('');
				$('#msg_err_numero2').html('');
				/*$('#msg_err_numero1').parent().css('border-left','solid 0px');
				$('#msg_err_numero2').parent().css('border-left','solid 0px');*/
			} else {
				$('#msg_err_numero').html('');
				$('#msg_err_numero1').html('');
			}
			/*$('#img_err_numero').attr({ 'src' : '/_themes/puzzlethemes/fr/images/blank.png' });
			$('#img_err_numero1').attr({ 'src' : '/_themes/puzzlethemes/fr/images/blank.png' });
			$('#img_err_numero2').attr({ 'src' : '/_themes/puzzlethemes/fr/images/blank.png' });*/


		}
	}

	var checkMobile = function(mobile){
	}

	var checkFixe = function(fixe){
	}


	// ----------------------------------------------------- page connexion caddie

	$('#Fmail').bind('blur',function(){
		var mail 	= $(this).val();
		mail 		= mail.toLowerCase();
		$(this).val(mail);
		var regex 		= /^[a-z0-9\_]+((-[a-z0-9\_]+)|(\.[a-z0-9\_]+)|(\_[a-z0-9]+))*\@[a-z0-9]+((\.|-)[a-z0-9]+)*\.[a-z]{2,}$/;
		if(mail.length < 1 || !regex.test(mail)){
			$(this).addClass('fielderror');
			$('#msg_err_email').html(localClientInvalidMail);
		}else{
			$(this).removeClass('fielderror');
		}
	}).focus();

	$('#bt_commande_rapide').bind('click',function() {
			$('#Fmail').blur();
			if ($('#Fmail').hasClass('fielderror')) {
				return false;
			}
			var mail = $('#Fmail').val();
			if (mail != '') {
				$.post('/websvc/accountexist.ws.php',{ mail: mail },function(response){
					if(response != '-1'){
						$('#Fmail').addClass('existingmail');
						$('#msg_err_email').html(localClientExistingMail);
						return false;
					}
					$('#frm_commande_rapide').submit();
				});
			}
	});

});


// ----------------------------------------------------- selection villes

var villehl = -1;
var objVille;
$(function() {

	$(document).on('click','.ws_cp',function() {
		if ($('#getvilles').html()!='') {
			$('#getvilles').show();
		}
	});
	$(document).on('click','.ws_ville',function() {
		if ($('#getvilles').html()!='') {
			$('#getvilles').show();
		}
	});
	$(document).on('focus','.ws_ville',function() {
		if ($('#getvilles').html()!='') {
			$('#getvilles').show();
		}
	});

 if ($('#Iville').length) {
 objVille = document.getElementById('Iville');
 objVille.onkeydown = function (event){
		var key =getKeyCode(event);

		var TAB = 9;
		var ESC = 27;
		var KEYUP = 38;
		var KEYDN = 40;
		var ENTER = 13;

		switch(key)
		{
			case ENTER:
			$('#getvilles').hide();
			break;

			case TAB:
			$('#getvilles').hide();
			break;

			case ESC:
			$('#getvilles').hide();
			break;

			case KEYUP:
			villehl--;
			changeHighlightVille();
			break;

			case KEYDN:
			villehl++;
			changeHighlightVille();
			break;

			default:

			break;
		}

	}
}


});

changeHighlightVille = function (){
	var items = $('#getvilles span');
	if(villehl >= items.length ) villehl=0;
	if(villehl < 0 ) villehl=items.length-1;
	for (i in items)
	{
		var a = items[i];
		if (villehl == i)
		{
			$('#Iville').val($('#'+a.id).html());
			$('#'+a.id).addClass('selected');
		}
		else
		{
			$('#'+a.id).removeClass('selected');

		}
	}

}
