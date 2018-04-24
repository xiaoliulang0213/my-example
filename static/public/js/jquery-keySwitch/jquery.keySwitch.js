(function($) {
	$.fn.keySwitch = function() {
		$(window.document).off('keydown').on('keydown', disableKey);
		$(window.document).off('keydown', 'form').on('keydown', 'form', disableEnterDown);
		$(window.document).off('keyup', 'form').on('keyup', 'form', CheckForEnter);
		function disableEnterDown(e) {
			var event = $.event.fix(e); //修正event事件
			if (event.keyCode == 13) {
				var element = event.target; //jQuery统一修正为target
				if (element.nodeName == "TEXTAREA" || element.getAttribute('contenteditable') === 'true') {
					return true;
				}
				event.preventDefault();
				if (element.nodeName == "INPUT" || element.nodeName == "SELECT") {
					return true;
				}
				return false;
			}
			return true;
		}
		function CheckForEnter(e) {
			var event = $.event.fix(e); //修正event事件
			if (event.keyCode == 13) {
				var element = event.target; //jQuery统一修正为target
				if ($(element).hasClass("auto")) {
					return true;
				}
				var buttons = "button,reset,submit"; //button格式
				if (element.nodeName == "INPUT" || element.nodeName == "SELECT") {
					//获取缓存的页面input集合
					var inputs = $("input,textarea,select,button").filter(":visible:enabled").filter(function() {
						var tabindex = $(this).attr("tabindex");
						if (tabindex == undefined || tabindex != "-1") {
							return true;
						}
						return false;
					});
					var index = inputs.index(element); //当前input位置
					if (buttons.indexOf(inputs[index].type) < 0) {
						return nextIndex(inputs, buttons, index);
////						return false;
//						inputs[index + 1].focus();
//						if (element.nodeName == "INPUT" || element.nodeName == "TEXTAREA") {
//							inputs[index + 1].select();
//						}
					}
				}
			}
			return true;
		};
		function nextIndex(inputs, buttons, index) {
			var i;
			for (i=index+1; i<inputs.length; i++) {
				var e = inputs.eq(i);
				if (e.attr("readonly") != "true" && e.attr("readonly") != "readonly" && e.attr("disabled") != "disabled" && e.attr("hidden") != "true") {
					if (buttons.indexOf(e.prop("type")) < 0) {
						e.focus();
						e.select();
					} else {
						e.focus();
//						e.select();
						e.click();
						return true;
					}
					break;
				}
			}
			return false;
		};
		function disableKey(e) {
			var event = $.event.fix(e); //修正event事件
			var code = event.which;
			var element = event.target;
			if (((code == 8)		//BackSpace    
					&&((element.type != "text" && element.type != "textarea" && element.type != "password" && element.getAttribute('contenteditable') !== 'true')
					|| element.readOnly == true))
					|| (event.ctrlKey && (code == 78 || code == 82) )	//CtrlN,CtrlR    
					|| code == 116 ) {													//F5
		    	return false;
		    }
		    return true;
		};
	}
})(jQuery);
