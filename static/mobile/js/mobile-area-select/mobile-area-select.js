//
(function(factory) {
	//amd
	if (typeof define === 'function' && define.amd) {
		define(['jquery'], factory);
	} else if (typeof module === "object" && module && typeof module.exports === "object") {
		module.exports = factory();
	} else {
		factory(window.Zepto || window.jQuery || $);
	}
})(function($) {
	
	$.fn.mobileAreaSelect = function( options ) {
		var rnd = Math.random().toString().replace('.', '');
		//Options
		var settings = $.extend({
			id:"dialog_"+rnd,//弹出层ID
			data:"../mobile/js/mobile-area-select/address.json",//数据路径
			index:0,

			code: 'code',
			name: 'name',
			// 省
			provinces: [],
			// 市
			cities: [],
			// 区
			districts: [],

			value:[],//地址code
			text:[],//地址名称
			level:3,//几级选择
			mtop:30,//列表默认top值和单列高度有关
			separator:' ',//地址名称间隔符号
			isMaskClose:true,//是否给mask填加关闭弹层事件
			closeBtn:".js-close",//绑定关闭弹层事件对象
			dialog:".select-dialog",
			onChange:$.noop//点击确定后的回调函数
		}, options );
		
		var preventDefault = function(e) {
			e.stopPropagation();
			e.preventDefault();
		}
		var _private={
			init:function(obj){
				this.index=settings.index;
				this.mtop=settings.mtop;
				this.value=settings.value;
				this.oldvalue = this.value.concat([]);
				this.text=settings.text;
				this.level=settings.level;
				this.scroller = $('#' + settings.id).find(".select-scroll ul");
				this.$ms=$(obj);
				this.getData();
				this.createHtml();
				this.bindEvent();
			},
			getData: function() {
				var _this = this;
				// by lihua
				if (typeof settings.data === 'function') {
					_this.provinces = settings.data.call(null);
				}
				// else if (typeof settings.data == "object") {
				// 	this.data = settings.data;
				// } else {
				// 	$.ajax({
				// 		dataType: 'json',
				// 		cache: true,
				// 		url: settings.data,
				// 		type: 'GET',
				// 		success: function(result) {
				// 			_this.data = result.data;
				// 		},
				// 		accepts: {
				// 			json: "application/json, text/javascript, */*; q=0.01"
				// 		}
				// 	});
				// }
			},
			bindEvent:function(){
				var _this=this;
				
				this.$ms.on("click",function(){
					$("body").append(_this.htmlStr);
					$("html").on("touchmove.popBlur",preventDefault);
					_this.scroller = $('#' + settings.id).find(".select-scroll ul");
					_this.format();
					var start = 0,
						end = 0;
					_this.scroller.children().on('touchstart', function(e) {
						start = e.originalEvent.changedTouches[0].pageY;
					});
					_this.scroller.children().on('touchmove', function(e) {
						end = e.originalEvent.changedTouches[0].pageY;
						var diff = end - start;
						var dl = $(e.target).parent();
						if (dl[0].nodeName != "DL") {
							return;
						}
						var top = parseInt(dl.css('top') || 0) + diff;
						dl.css('top', top);
						start = end;
						return false;
					});
					_this.scroller.children().on('touchend', function(e) {
						end = e.originalEvent.changedTouches[0].pageY;
						var diff = end - start;
						var dl = $(e.target).parent();
						if (dl[0].nodeName != "DL") {
							return;
						}
						var i = $(dl.parent()).index();
						var top = parseInt(dl.css('top') || 0) + diff;
						if (top > _this.mtop) {
							top = _this.mtop;
						}
						if (top < -$(dl).height() + 60) {
							top = -$(dl).height() + 60;
						}
						var mod = top / _this.mtop;
						var mode = Math.round(mod);
						var index = Math.abs(mode) + 1;
						if (mode == 1) {
							index = 0;
						}
						_this.value[i] = $(dl.children().get(index)).attr('ref');
						_this.value[i] == 0 ? _this.text[i] = "" : _this.text[i] = $(dl.children().get(index)).html();
						for (var j = _this.level - 1; j > i; j--) {
							_this.value[j] = 0;
							_this.text[j] = "";
						}
						if (!$(dl.children().get(index)).hasClass('focus')) {
							_this.format();
						}
						$(dl.children().get(index)).addClass('focus').siblings().removeClass('focus');
						dl.css('top', mode * _this.mtop);
						return false;
					});
				});
				
				$("body").on("click","#"+settings.id,function(e){
					
					//给mask添加关闭事件
					if($.contains(e.target,$(this).find(".select-cnt")[0])&&settings.isMaskClose){
						_this.close();
					}
					//点击确定按钮
					if($(e.target).hasClass("js-submit")){
						_this.submit();
					}
					//点击取消按钮
					if($(e.target).hasClass("js-close")){
						_this.close();
					}
					
				});
				
			},
			createHtml:function(){
				var str='<div class="select-dialog show" id="'+settings.id+'">'
							+'<div class="select-cnt">'
							+'<div class="select-scroll"><ul>';
					//根据level添加li
					for(var i=1;i<=settings.level;i++){
						str+='<li></li>';
					}
					str=str+'</ul><p></p></div>'
						+'<div class="select-action"><button class="b-cencel js-close">取消</button><button class="b-submit js-submit">确定</button></div>'
						+'</div></div>';
				this.htmlStr=str;
//				return str;
			},
			format: function() {
				var _this = this;
				// this.f(this.data);
				// by lihua
				this.f(this.provinces);
			},
			f: function(data) {
				var _this = this;
				var item = data;
				if (!item) {
					item = [];
				};
				var str = '<dl><dd ref="0">请选择</dd>';
				var focus = 0,
					childData, top = _this.mtop;
				if (_this.index !== 0 && _this.value[_this.index - 1] == "0") {
					str = '<dl><dd ref="0" class="focus">请选择</dd>';
					_this.value[_this.index] = 0;
					_this.text[_this.index] = "";
					focus = 0;
				} else {
					
					if (_this.value[_this.index] == "0") {
						str = '<dl><dd ref="0" class="focus">请选择</dd>';
						focus = 0;
					}
					for (var j = 0, len = item.length; j < len; j++) {
						// var id = item[j].code || 0;
						// by lihua
						var id = item[j][settings.code] || 0;
						var cls = '';
						if (_this.value[_this.index] == id) {
							cls = "focus";
							focus = id;
							// childData = item[j].cities||item[j].district;
							// by lihua
							if (_this.index < _this.level - 1) {
								if (_this.index === 0) {
									if (!_this.cities || _this.cities.length === 0 || _this.value[_this.index + 1] == '0') {
										childData = settings.data.call(null, item[j][settings.code]);
										_this.cities = childData;
									} else {
										childData = _this.cities;
									}
								} else if (_this.index === 1) {
									if (!_this.districts || _this.districts.length === 0 || _this.value[_this.index + 1] == '0') {
										childData = settings.data.call(null, item[j][settings.code]);
										_this.districts = childData;
									} else {
										childData = _this.districts;
									}
								} else {
									childData = settings.data.call(null, item[j][settings.code]);
								}
							} else {
								childData = [];
							}

							top = _this.mtop * (-j);
						};
						// str += '<dd class="' + cls + '" ref="' + id + '">' + item[j].name + '</dd>';
						// by lihua
						str += '<dd class="' + cls + '" ref="' + id + '">' + item[j][settings.name] + '</dd>';
					}
				}
				str += "</dl>";
				var newdom = $(str);
				newdom.css('top', top);
				var child = _this.scroller.children();
				$(child[_this.index]).html(newdom);
				_this.index++;
				if (_this.index > _this.level - 1) {
					_this.index = 0;
					return;
				}
				_this.f(childData);
			},
			submit: function() {
				this.oldvalue = this.value.concat([]);
				if (this.$ms[0].nodeType == 1) {
					//input
					var areaString=this.text.join('').toString();//所选地区字符串长度（包含逗号）
					$('#add_detail').val(areaString);
					var sLength=this.text.join('').toString().length;
					if(sLength>13){
						var beginS=areaString.substring(0,6)+"...";//前6个字+...
						var endS=areaString.substring(sLength-7,sLength);//后7个字
						var showTxt=beginS+endS;
						this.$ms.val(showTxt);
					}
					else{
						this.$ms.val(this.text.join(''));
					}
					
					this.$ms.attr('data-value', this.value.join(','));//城市编码
					
				}
				this.$ms.next(':hidden').val(this.value.join(','));//城市编码
				this.close();
				//执行回调
				settings.onChange.apply(this,arguments);
			},
			close:function(){
				this.value = this.oldvalue.concat([]);
				$("#"+settings.id).remove();
				$("html").off(".popBlur");
			}
			
		}
		
		return this.each(function(){
			_private.init(this);
            
		});
	}
	
});