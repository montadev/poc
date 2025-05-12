


$(function(){
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
			$('#CTnom').addClass('fielderror');
			$('#msg_err_nom').html(tplMsg2);
			$('#img_err_nom').attr({ 'src' : '/_themes/puzzlethemes/fr/images/nok.png' });
		}else{
			$('#CTnom').removeClass('fielderror');
			$('#msg_err_nom').html('');
			$('#img_err_nom').attr({ 'src' : '/_themes/puzzlethemes/fr/images/ok.png' });
		}

	});
	$('#CTmail').on('blur',function(){
		var mail 	= $(this).val();
		mail 		= mail.toLowerCase();
		$(this).val(mail);
		var regex 		= /^[a-z0-9\_]+((-[a-z0-9\_]+)|(\.[a-z0-9\_]+)|(\_[a-z0-9]+))*\@[a-z0-9]+((\.|-)[a-z0-9]+)*\.[a-z]{2,6}$/;
		if(mail.length < 1 || !regex.test(mail)){
			$('#CTmail').addClass('fielderror');
			$('#msg_err_mail').html(tplMsg3);
			$('#img_err_mail').attr({ 'src' : '/_themes/puzzlethemes/fr/images/nok.png' });
		}else{
			$('#CTmail').removeClass('fielderror');
			$('#msg_err_mail').html('');
			$('#img_err_mail').attr({ 'src' : '/_themes/puzzlethemes/fr/images/ok.png' });
		}
	});
	$('#CTmail2').on('blur',function(){
		var mail 	= $(this).val();
		var mail1   = $('#CTmail').val();
		mail 		= mail.toLowerCase();
		$(this).val(mail);
		if(mail1 != mail || mail.length<1 || $('#CTmail').hasClass('fielderror')){
			$('#CTmail2').addClass('fielderror');
			$('#msg_err_mail2').html(tplMsg4);
			$('#img_err_mail2').attr({ 'src' : '/_themes/puzzlethemes/fr/images/nok.png' });
		}else{
			$('#CTmail2').removeClass('fielderror');
			$('#msg_err_mail2').html('');
			$('#img_err_mail2').attr({ 'src' : '/_themes/puzzlethemes/fr/images/ok.png' });
		}
	});
});
