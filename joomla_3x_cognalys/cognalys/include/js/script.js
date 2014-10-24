var g_valid_mobiles = [];
var g_tels = [];
var g_cognalys_form;

jQuery(function() {	
	jQuery('input[name=cognalys_form_type]').each(function() {
		var form_type = jQuery(this).val();
		var form = jQuery(this).parents('form');

		form.find('input[type=submit],button[type=submit]').on('click', function() {
			g_cognalys_form = jQuery(this).parents('form');
			var jform_mobile = g_cognalys_form.find('#jform_mobile,#modlgn-mobile');
			if (jform_mobile.length == 0)
			{
				return true;
			}

			for (i = 0; i < g_valid_mobiles.length; i ++)
			{
				if (g_valid_mobiles[i] == jform_mobile.val())
				{
					return true;
				}
			}
			check_cognalys1(jform_mobile.val());

			return false;
		});

		switch(form_type) {
			case 'Core Joomla Registration':
				var mobile = jQuery('<div class="control-group">' +
							'<div class="control-label">' +
							'<label id="jform_mobile-lbl" for="jform_mobile" class="hasTooltip required" title="" data-original-title="<strong>Mobile</strong><br />Enter your mobile number." aria-invalid="false">' +
							' Mobile Number<span class="star">&nbsp;*</span></label></div>' +
							'<div class="controls">' +
							'<input type="text" name="jform[mobile]" id="jform_mobile" value="" class="required" size="20" required="required" aria-required="true">' + 
							'<div class="cognalys-message"></div></div>' +
							'</div>');
				mobile.appendTo(form.find('fieldset'));
				mobile.find('input')
					.intlTelInput()
					.data('label', form.find('label[for=jform_mobile]'));
				break;
			case 'Core Joomla Contact Us':
				var mobile = jQuery('<div class="control-group">' +
							'<div class="control-label">' +
							'<label id="jform_mobile-lbl" for="jform_mobile" class="hasTooltip required" title="" data-original-title="<strong>Mobile</strong><br />Enter your mobile number." aria-invalid="false">' +
							' Mobile Number:<span class="star">&nbsp;*</span></label></div>' +
							'<div class="controls">' +
							'<input type="text" name="jform[mobile]" id="jform_mobile" value="" class="required" size="20" required="required" aria-required="true">' + 
							'<div class="cognalys-message"></div></div>' +
							'</div>');
				mobile.appendTo(form.find('fieldset .control-group:last'));
				mobile.find('input')
					.intlTelInput()
					.data('label', form.find('label[for=jform_mobile]'));
				break;
			case 'Core Joomla login Component Form':
				var mobile = jQuery('<div class="control-group">' +
							'<div class="control-label">' +
							'<label id="jform_mobile-lbl" for="jform_mobile" class="hasTooltip required" title="" data-original-title="<strong>Mobile</strong><br />Enter your mobile number." aria-invalid="false">' +
							' Mobile Number:<span class="star">&nbsp;*</span></label></div>' +
							'<div class="controls">' +
							'<input type="text" name="jform[mobile]" id="jform_mobile" value="" class="required" size="20" required="required" aria-required="true">' + 
							'<div class="cognalys-message"></div></div>' +
							'</div>');
				mobile.insertBefore(form.find('fieldset .control-group:last'));
				mobile.find('input')
					.intlTelInput()
					.data('label', form.find('label[for=jform_mobile]'));
				break;
			case 'Core Joomla login Module':
				var mobile = jQuery('<div id="form-login-mobile" class="control-group">' +
					'<div class="controls">' +
					'<div class="input-prepend">' +
					'<span class="add-on"><span class="icon-phone hasTooltip" title="" data-original-title="Mobile"></span>' +
					'<label for="modlgn-mobile" class="element-invisible" aria-invalid="false">Mobile</label>' +
					'</span>' +
					'<input id="modlgn-mobile" type="text" name="mobile" class="input-small" tabindex="0" size="18">' + 
					'</div>' +
					'</div>' +
					'<div class="cognalys-message"></div>' +
					'</div>');
				mobile.insertAfter(form.find('#form-login-password.control-group'));
				mobile.find('input')
					.intlTelInput()
					.data('label', form.find('label[for=jform_mobile]'));
				break;
		}
	});
});

function show_cognalys_message(msg, show_loader) {
	if (g_cognalys_form)
	{
		g_cognalys_form.find('#jform_mobile,#modlgn-mobile').addClass('invalid');
		g_cognalys_form.find('label[for=jform_mobile]').addClass('invalid');
		var div_msg = g_cognalys_form.find('.cognalys-message')
			.text(msg)
			.show();
		if (show_loader)
			div_msg.addClass('cognalys-loader');
		else
			div_msg.removeClass('cognalys-loader');
	}
}

function hide_cognalys_message() {
	if (g_cognalys_form)
	{
		g_cognalys_form.find('#jform_mobile,#modlgn-mobile').removeClass('invalid');
		g_cognalys_form.find('label[for=jform_mobile]').removeClass('invalid');
		g_cognalys_form.find('.cognalys-message')
			.hide();
	}
}

function check_cognalys1(mobile)
{
	if (mobile == '') {
		g_cognalys_form.find('#jform_mobile,#modlgn-mobile').addClass('invalid');
		g_cognalys_form.find('label[for=jform_mobile]').addClass('invalid');
		return;
	}

	show_cognalys_message('Calling your mobile, please wait.', true);

	jQuery.ajax({
			url: jQuery('base').attr('href'),
			type: 'POST',
			data: {
				check_cognalys: 1,
				mobile: mobile
			},
			dataType: 'json'
		}).done(function(rets) {
			var otp_starts = "";
			for (i = 0; i < rets.length; i ++)
			{
				ret = rets[i];
				var tel = {};

				if (ret.status == "success")
				{
					tel.mobile = ret.mobile;
					tel.keymatch = ret.keymatch;
					tel.otp_start = ret.otp_start;
					otp_starts += '<tr><td style="border:none">' + ret.mobile + ' : </td><td style="border:none">' + 
						'<input type="text" name="otp" value="' + ret.otp_start + '" data-mobile="' + ret.mobile + 
						'" class="text ui-widget-content ui-corner-all otp"></td></tr>';
					set_tel(tel);
				}
				else if (ret.status == "500")
				{
					show_cognalys_message('Could not connect to cognalys server.');
					return;
				}
			}

			if (otp_starts != "")
			{
				var dialog = jQuery('<div id="dialog-form" title="Enter OTP">' +
					'<p class="validateTips">Enter the last five digit of missed call you recieved from Cognalys</p>' +
					'<table style="border:none;">' +
					otp_starts +
					'</table></div>');
				dialog.dialog({ 
						height: 300,
						width: 400,
						modal: true,
						buttons: {
							"OK": function() {
								var mobiles = [], otps = [];
								dialog.find('.otp').each(function() {
									mobile = jQuery(this).attr('data-mobile');
									mobiles[mobiles.length] = mobile;
									otps[otps.length] = jQuery(this).val();
								});
								check_cognalys2(dialog, mobiles, otps);
							},
							"Cancel": function() {
								dialog.dialog( "close" );
								dialog.find('.otp').each(function() {
									mobile = jQuery(this).attr('data-mobile');
								});
							}
						},
						close: function() {
							hide_cognalys_message();
						}
					});
			}
			else {
				show_cognalys_message('Invalid mobile number.');
			}
		});
}

function set_tel(tel)
{
	for (i = 0; i < g_tels.length; i ++)
	{
		var t = g_tels[i];
		if (t.mobile == tel.mobile)
		{
			g_tels[i] = tel;
			return;
		}
	}

	g_tels[g_tels.length] = tel;
}

function get_tel(mobile)
{
	for (i = 0; i < g_tels.length; i ++)
	{
		var t = g_tels[i];
		if (t.mobile == mobile)
		{
			return t;
		}
	}

	return null;
}

function set_valid_mobile(mobile)
{
	for (i = 0; i < g_valid_mobiles.length; i ++)
	{
		if (g_valid_mobiles[i] == mobile)
		{
			g_valid_mobiles[i] = mobile;
			return;
		}
	}
	g_valid_mobiles[g_valid_mobiles.length] = mobile;
}

function check_cognalys2(dialog, mobiles, otps) {
	keymatch = "";
	otp = "";
	for (i = 0; i < mobiles.length; i ++)
	{
		var tel = get_tel(mobiles[i]);
		if (keymatch != "") keymatch += ",";
		keymatch += tel.keymatch;
		if (otp != "") otp += ",";
		otp += otps[i];
	}

	jQuery.ajax({
		url: jQuery('base').attr('href'),
		type: 'POST',
		data: {
			check_cognalys: 2,
			keymatch: keymatch,
			otp: otp
		},
		dataType: 'json'
	}).done(function(rets) {
		dialog.dialog( "close" );
		for (i = 0; i < rets.length; i ++)
		{
			ret = rets[i];
			tel = get_tel(ret.mobile);
			if (ret.status == "success")
			{
				set_valid_mobile(ret.mobile);
				g_cognalys_form.find('input[type=submit],button[type=submit]').click();
				hide_cognalys_message();
			}
			else if (ret.status == "500")
			{
				show_cognalys_message('Could not connect to cognalys server.');
			}
			else {
				show_cognalys_message('Invalid OTP.');
			}
		}
	});
}