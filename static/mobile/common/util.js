define('util', ['vue', 'jquery', 'Const', 'framework', 'text!template/tags.html', 'moment', 'json'], function(vue, $, Const, framework, template, moment) {
    function InvalidCharacterError(message) {
        this.message = message;
    }
    InvalidCharacterError.prototype = new Error;
    InvalidCharacterError.prototype.name = 'InvalidCharacterError';

    var rword = /[^, ]+/g;
    var class2type = {};
    'Boolean Number String Function Array Date RegExp Object Error'.replace(rword, function (name) {
        class2type['[object ' + name + ']'] = name.toLowerCase()
    });
    var rhyphen = /([a-z\d])([A-Z]+)/g;
    var rcamelize = /[-_][^-_]/g;

    function formatNumber (number, decimals, point, thousands) {
        number = (number + '').replace(/[^0-9+\-Ee.]/g, '');
        var n = !isFinite(+number) ? 0 : +number,
            prec = !isFinite(+decimals) ? 3 : Math.abs(decimals),
            sep = thousands || ",",
            dec = point || ".",
            s = '',
            toFixedFix = function (n, prec) {
                var k = Math.pow(10, prec);
                return '' + (Math.round(n * k) / k)
                        .toFixed(prec);
            };
        // Fix for IE parseFloat(0.55).toFixed(0) = 0;
        s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
        if (s[0].length > 3) {
            s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
        }
        if ((s[1] || '').length < prec) {
            s[1] = s[1] || '';
            s[1] += new Array(prec - s[1].length + 1).join('0');
        }
        return s.join(dec);
    }

    return {
        /******************************************* 基础工具 *********************************************************/
        // 数据类型
        type: function (obj) {
            if (obj == null) {
                return String(obj);
            }
            // 早期的webkit内核浏览器实现了已废弃的ecma262v4标准，可以将正则字面量当作函数使用，因此typeof在判定正则时会返回function
            return typeof obj === 'object' || typeof obj === 'function' ? class2type[Object.prototype.toString.call(obj)] || 'object' : typeof obj;
        },
        // 判断是否为空，可判断空数组，空json
        isEmpty: function(v) {
            var type = this.type(v);
            if (type === 'undefined' || v === null) {
                return true;
            } else if (type === 'number') {
                return !v && v !== 0;
            } else if (type === 'array') {
                return v.length === 0;
            } else if (type === 'object') {
                for (var t in v)  {
                    return false;
                }
                return true;
            }
            return !v;
        },
        isTrue: function(check, defaultTrueOrFalse) {
            if (this.type(check) === 'undefined') {
                if (this.type(defaultTrueOrFalse) === 'undefined') {
                    return false;
                }
                return defaultTrueOrFalse;
            } else if (this.type(check) === 'function') {
                return check.call(null);
            }
            return this.getBoolean(check);
        },
        // 正则表达式判断
        check: function(v, regex) {
            return new RegExp(regex).test(v);
        },
        /******************************************* 数据转换 *********************************************************/
        // 获取boolean结果
        getBoolean: function(value) {
            if (value === false || value === 'false') {
                return false;
            }
            if (!value) {
                return false;
            }
            return true;
        },
        // 转number型
        toNumber: function(v) {
            return parseInt(v, 10);
        },
        toFloat: function (v) {
            return parseFloat(v);
        },
        toAmount: function (v) {
            return parseFloat(v);
        },
        toString: function(v) {
            if (this.isEmpty(v)) {
                return v;
            }
            return v + '';
        },
        toByte: function(v) {
            // byte:-128~127
            if (v < -128) {
                v += 256;
            } else if (v > 127) {
                v -= 256;
            }
            return v;
        },
        nvl: function(s, defaultValue) {
            return s === null ? defaultValue : s;
        },
        random: function (min, max) {
            return Math.floor(Math.random() * (max - min + 1) + min);
        },
        arrayToString: function (arr, seprator, ignoreNull) {
            if (seprator) {
                var str = '';
                for (var i=0; i<arr.length; i++) {
                    if (!ignoreNull || !this.isEmpty(arr[i])) {
                        if (str) {
                            str += seprator;
                        }
                        str += arr[i];
                    }
                }
                return str;
            }
        },
        stringToArray: function (str, seprator) {
            if (str && seprator) {
                return str.split(seprator);
            }
        },
        /******************************************* 参数相关 *********************************************************/
        encrypt: function (value, encode) {
            if (!value) {
                return value;
            }
            if (Const.init.urlEncode === 'simple' && (encode === undefined || encode !== false)) {
                return encodeURIComponent(this.simpleEncrypt(value));
            }
            return value;
        },
        decrypt: function (value, encode) {
            if (!value) {
                return value;
            }
            if (Const.init.urlEncode === 'simple' && (encode === undefined || encode !== false)) {
                return this.simpleDecrypt(decodeURIComponent(value));
            }
            return value;
        },
        _gup: function (name, url, encode) {
            if (!url) url = location.href;
            name = this.encrypt(name, encode);
            name = name.replace(/[\[]/,"\\\[").replace(/[\]]/,"\\\]");
            var regexS = "[\\?&]" + name + "=([^&#]*)";
            var regex = new RegExp( regexS );
            var results = regex.exec( url );
            return results === null ? null : this.decrypt(results[1], encode);
        },
        // 取url参数，例如：gup('type', 'http://localhost:8080/demo/xxx?type=123');
        gup: function(name, url, encode) {
            var result = this._gup(name, url, encode);
            if (result === null) {
                return this._gup(name, url, false);
            }
            return result;
        },
        path: function () {
            var h = location.hash;
            if (h) {
                if (this.startsWith(h, '#!')) {
                    return h.substring(2);
                } else if (this.startsWith(h, '#')) {
                    return '#';
                }
            }
            return '';
        },
        orderBy: function(array, name, reverse, toNumber) {
            var order = reverse ? -1 : 1;
            if (this.type(array) === 'array') {
                var util = this;
                array.sort(function (a, b) {
                    if (toNumber) {
                        return a[name] === b[name] ? 0 : util.toNumber(a[name]) > util.toNumber(b[name]) ? order : -order;
                    }
                    return a[name] === b[name] ? 0 : a[name] > b[name] ? order : -order;
                });
            }
            return array;
        },
        /******************************************* 字符相关 *********************************************************/
        contains: function(v, c) {
            if (this.type(v) === 'array') {
                for (var i=0; i<v.length; i++) {
                    if (v[i] === c) {
                        return true;
                    }
                }
                return false;
            }
            return v && v.indexOf(c) >= 0;
        },
        startsWith: function(v, c) {
            return v && v.indexOf(c) === 0;
        },
        endsWith: function(v, c) {
            return v && v.lastIndexOf(c) === v.length - c.length;
        },
        replaceAll: function(s, r, n) {
            if (s && r) {
                return s.replace(new RegExp(r, 'gm'), n);
            }
        },
        encode: function(s) {
            return encodeURIComponent(s);
        },
        decode: function (s) {
            return decodeURIComponent(s);
        },
        /******************************************* 通讯相关 *********************************************************/
        // 组织url地址
        // ${root}/xxx开头的返回/xxx,${portal}/xxx开头的返回portal地址
        // @{portal}、@{root}开头的表示要bv-sys-code到head中
        // 其他/开头的返回baseRestUrl+url
        // type: undefind-rest地址，html-页面，timestamp-增加时间戳
        url: function(url, type) {
            if (this.startsWith(url, 'http://') || this.startsWith(url, 'https://') || this.endsWith(url, '.json')) {
                return url;
            }
            if (this.startsWith(url, '/api/') || this.startsWith(url, '/app/') || this.startsWith(url, '/pub/')) {
                return url;
            }
            if (url && (url.indexOf("${root}/") === 0 || url.indexOf("@{root}/") === 0)) {
                return url.substring(7);
            }
            if (type && type === 'html') {
                return this.mix(url, {
                    _: new Date().getTime()
                });
            }
            if (type && type === 'path') {
                if (!this.isEmpty(Const.init.storage.url)) {
                    var extraParams = {};
                    for (var i=0; i<Const.init.storage.url.length; i++) {
                        var value = this.gup(Const.init.storage.url[i], url);
                        if (!value) {
                            value = this.gup(Const.init.storage.url[i]) || Const.rest.headers[Const.init.storage.url[i]];
                            if (value) {
                                extraParams[Const.init.storage.url[i]] = value;
                            }
                        }
                    }
                    return this.mix(Const.route.baseLocation + Const.route.versionLocation + '/#!/' + url, extraParams);
                }
                return this.mix(Const.route.baseLocation + Const.route.versionLocation + '/#!/' + url);
            }
            if (this.endsWith(url, '.js')) {
                return this.mix(Const.route.baseUrl + Const.route.baseLocation + Const.route.versionLocation + Const.route.scriptLocation + url, {
                    _: new Date().getTime()
                });
            }
            if (type && type === 'static') {
                return this.mix(Const.route.baseUrl + Const.route.baseLocation + Const.route.versionLocation + Const.route.htmlLocation + url, {
                    _: new Date().getTime()
                });
            }
            var resultUrl = Const.rest.baseUrl + url;
            if (type && type === 'timestamp') {
                return this.mix(resultUrl, {
                    _: new Date().getTime()
                });
                /*if (resultUrl.indexOf('?') < 0) {
                 resultUrl += '?_=' + new Date().getTime();
                 } else {
                 resultUrl += '&_=' + new Date().getTime();
                 }*/
            }
            return resultUrl;
        },
        json: function(data) {
            if (this.type(data) === 'string') {
                if (!data) {
                    return {};
                }
                if (!this.startsWith(data, '{') && !this.startsWith(data, '[')) {
                    return data;
                }
                return JSON.parse(data);
            }
            return JSON.stringify(data);
        },
        html: function (url) {
            var util = this;
            this.get({
                url: this.url(url),
                async: false,
                success: function (data) {
                    return util.json(data);
                }
            });
        },
        // ajax.get调用
        get: function(param) {
            param.type = 'get';
            this.ajax(param);
        },
        // ajax.post调用
        post: function(param) {
            param.type = 'post';
            if (!param.dataType) {
                param.dataType = 'json';
            }
            if (!param.contentType) {
                param.contentType = 'application/json';
            }
            if (param.data) {
                param.data = this.json(param.data);
            }
            this.ajax(param);
        },
        del: function(param) {
            param.type = 'delete';
            this.ajax(param);
        },
        // ajax.put调用
        put: function(param) {
            param.type = 'put';
            if (!param.dataType) {
                param.dataType = 'json';
            }
            param.contentType = 'application/json';
            if (param.data) {
                param.data = this.json(param.data);
            }
            this.ajax(param);
        },
        // ajax.post
        submit: function(param) {
            param.type = 'post';
            if (!param.dataType) {
                param.dataType = 'json';
            }
            param.contentType = 'application/json';
            if (param.data) {
                param.data = this.json(param.data);
            }
            this.ajax(param);
        },
        upload: function(param) {
            param.type = 'post';
            /// param.async = false;
            param.cache = false;
            param.contentType = false;
            param.processData = false;
            if (param.progress) {
                param.xhr = function() {
                    var xhr = $.ajaxSettings.xhr();
                    if (param.progress && xhr.upload) {
                        xhr.upload.addEventListener('progress', function (event) {
                            param.progress.call(null, event);
                        }, false);
                        return xhr;
                    }
                };
            }
            this.ajax(param);
        },
        script: function (param, callback) {
            if (this.type(param) === 'string') {
                if (param === 'hm') {
                    // 百度统计
                    if (!Const.global.hmInited) {
                        Const.global.hmInited = true;
                        window._hmt = window._hmt || [];
                        var hm = document.createElement("script");
                        hm.src = 'https://hm.baidu.com/hm.js?' + (Const.params && Const.params.hmKey);
                        var s = document.getElementsByTagName("script")[0];
                        s.parentNode.insertBefore(hm, s);
                    }
                } if (param === 'vds') {
                    if (!Const.global.vdsInited) {
                        Const.global.vdsInited = true;
                        var util = this;
                        window._vds = window._vds || [];
                        (function(){
                            window._vds.push(['setAccountId', Const.params && Const.params.vdsKey]);
                            window._vds.push(['setCs3', 'user_tel ',util.session('setCs')]);
                            window._vds.push(['enableHT',true]);
                            (function() {
                                var vds = document.createElement('script');
                                vds.type='text/javascript';
                                vds.async = true;
                                vds.src = ('https:' == document.location.protocol ? 'https://' : 'http://') + 'assets.growingio.com/vds.js';
                                var s = document.getElementsByTagName('script')[0];
                                s.parentNode.insertBefore(vds, s);
                            })();
                        })();
                    }
                } else if (param === 'amap') {
                    if (!Const.global.amapInited) {
                        Const.global.amapInited = true;
                        var script = document.createElement("script");
                        if (script.readyState) {
                            script.onreadystatechange = function () {
                                if (script.readyState == "loaded" || script.readyState == "complete") {
                                    script.onreadystatechange = null;
                                    callback();
                                }
                            };
                        } else {
                            script.onload = function () {
                                callback();
                            };
                        }
                        script.src = 'https://webapi.amap.com/maps?v=1.4.0&key=' + (Const.params && Const.params.amapKey);
                        var s = document.getElementsByTagName("script")[0];
                        s.parentNode.insertBefore(script, s);
                    }
                }
            } else {
                param.type = 'get';
                param.dataType = 'script';
                param.cache = true;
                this.ajax(param);
            }
        },
        // ajax
        // 参数：
        // $element:事件对应按钮，可控制按钮状态防止重复点击
        // close:执行成功后是否自动关闭窗口
        // alert属性undefined-仅识别时提示错误false-成功识别均不提示true-成功失败都提示
        ajax: function(param) {
            if (!param.url) {
                return;
            }
            // this.alert('hide');
            // this.loading('处理中...');
            if (param.loading === undefined || param.loading !== false) {
                this.loading();
            }
            var util = this;
            param = this.param(param);
            if (param.success) {
                param.$success = param.success;
            }
            if (param.error) {
                param.$error = param.error;
            }

            param.success = function(data) {
                if (util.type(data) === 'string') {
                    data = util.json(data);
                }
                if (util.success(data)) {
                    if (param.$success) {
                        param.$success.call(null, data);
                    }
                    // if (util.message(data) && (param.alert === undefined || param.alert !== false)) {
                    if (param.alert === true) {
                        util.alert({
                            message: '处理成功',
                            position: param.position,
                            level: param.level,
                            title: '处理成功'
                        });
                    }
                } else {
                    if (param.$error) {
                        param.$error.call(null, data);
                    }
                    if (param.alert === undefined || param.alert !== false) {
                        util.alert({
                            message: util.message(data),
                            level: 'error',
                            yes: param.yes
                        });
                    }
                }
                /* else if (data && data.head && data.head.retMsg) {
                 util.alert(data, param.$element, param.position || 'alert', param.level);
                 }*/
            }
            param.error = function(xhr, status, e) {
                if (param.$error) {
                    param.$error.call(null, xhr, status, e);
                }
                if (param.alert === undefined || param.alert !== false) {
                    if (xhr.status === 401 || xhr.status === 403) {
                        // alert('登录超时，请重新登录');
                        if (!Const.alerted && Const.init.type !== 'alert') {
                            Const.alerted = true;
                            util.alert({
                                message: '#error401',
                                level: 'error'
                            });
                        }
                    } else if (xhr.status === 404) {
                        util.alert({
                            message: '#error404',
                            level: 'error'
                        });
                    } else if (xhr.status !== 200) {
                        util.alert({
                            message: (xhr.responseJSON && xhr.responseJSON.message) || '#unknownError',
                            level: 'error'
                        });
                    } else {
                        // 200
                        if (param.close) {
                            util.modal('hide');
                        }
                    }

                    util.report({
                        from: 'ajax',
                        type: param && param.type,
                        url: param && param.url,
                        status: xhr.status,
                        response: xhr.responseJSON || xhr.responseText
                    });
                }
            }
            if (param.complete) {
                param.$complete = param.complete;
            }
            param.complete = function() {
                if (param.$complete) {
                    param.$complete.call(null);
                }
                if (param.loading === undefined || param.loading !== false) {
                    util.loading('hide')
                };
            }
            param.global = false;
            // 不受全局配置影响
            /*if (!Const.rest.head) {
             param.global = false;
             }*/
            $.ajax(param);
        },
        // 内部调用
        param: function (param) {
            if (this.type(param) === 'string') {
                // 从url或sessionStorage获取参数
                if (Const.init.storage.url.indexOf(param) >= 0) {
                    // 从url获取
                    return this.gup(param) || Const.rest.headers[param];
                } else if (Const.init.storage.session.indexOf(param) >= 0) {
                    return this.session(param) || Const.rest.headers[param];
                }
                return;
            }
            if (!param.headers) {
                param.headers = {};
            }
            if (Const.rest.headers) {
                param.headers = this.mix(param.headers, Const.rest.headers);
            }
            if (Const.init.auth) {
                if (Const.init.auth === 'app') {
                    // app需要在head传token\channel\版本等信息
                    var token = this.gup('access_token');
                    if (token) {
                        param.headers['Authorization'] = 'Bearer ' + token;
                        param.headers['access_token'] = token;
                    }
                    var sysVersion = this.gup('SysVersion');
                    if (sysVersion) {
                        param.headers['SysVersion'] = sysVersion;
                    }
                    var appVersion = this.gup('APPVersion');
                    if (appVersion) {
                        param.headers['APPVersion'] = appVersion;
                    }
                    var deviceResolution = this.gup('DeviceResolution');
                    if (deviceResolution) {
                        param.headers['DeviceResolution'] = deviceResolution;
                    }
                    var deviceModel = this.gup('DeviceModel');
                    if (deviceModel) {
                        param.headers['DeviceModel'] = deviceModel;
                    }
                } else if (Const.init.auth === 'h5') {
                    var token = param.token || this.param('token');
                    var channelNo = param.channelNo  || this.param('channelNo') || Const.rest.headers.channelNo;
                    if (token) {
                        param.headers.token = token;
                    }
                    if (channelNo) {
                        param.headers.channelNo  = channelNo;
                    }
                } else if (this.type(Const.init.auth) === 'function') {
                    param = Const.init.auth.call(this, param);
                }
            }
            param.url = this.url(param.url);
            return param;
        },
        query: function(param) {
            if (!param || this.isEmpty(param.data)) {
                return;
            }
            if (!param.type) {
                param.type = 'post';
            }
            if (!param.url) {
                param.url = Const.url.select.query;
            }
            this[param.type](param);
        },
        queryOne: function(param) {
            if (!param || this.isEmpty(param.data)) {
                return;
            }
            if (!param.type) {
                param.type = 'post';
            }
            if (!param.url) {
                param.url = Const.url.select.init;
            }
            this[param.type](param);
        },
        form: function (name, file, multiple) {
            if (!name || !file) {
                return null;
            }
            if (!multiple) {
                /*if (!file.name) {
                    return null;
                }*/
                var formData = new FormData();
                if (file.name) {
                    formData.append(name, file, file.name);
                } else {
                    formData.append(name, file);
                }
                return formData;
            } else {
                var formData = new FormData();
                for (var p in file) {
                    if (p.name) {
                        formData.append(name, file[p], file[p].name);
                    }
                }
                return formData;
            }
        },
        //验证码倒计时 param, second
        countdown: function($element, param) {
            var second = param.second;
            var waiting = param.waiting || 's后重新获取';
            $($element).text(second + waiting);
            $($element).attr('disabled', 'disabled');
            var int = setInterval(function () {
                $($element).text(--second + waiting);
                if (second <= 0) {
                    clearInterval(int);
                    $($element).text(param.text);
                    $($element).removeAttr('disabled');
                }
            }, 1000);
        },
        // 判断是否成功
        success: function(data) {
            return !data.head || (data.head && data.head.retFlag && data.head.retFlag === '00000');
        },
        code: function (data) {
            return data.head && data.head.retFlag;
        },
        message: function(data) {
            if (this.type(data) === 'string' && this.startsWith(data, '#')) {
                return Const.messages[data.substring(1)];
            }
            return (data.head && data.head.retMsg) || Const.messages['unknownError'];
        },
        data: function(data) {
            return data.head ? data.body : data;
        },
        /******************************************* 缓存相关 *********************************************************/
        // 支持两种格式：设置cache({})，获取cache('a,b,c')
        cache: function(param) {
            if (this.type(param) === 'string' || this.type(param) === 'undefined') {
                // 获取
                if (Const.cache.type === 'local') {
                    // return this.clone(Const.cache.param) || {};
                    return this.session('param');
                } else if (Const.cache.type === 'server') {
                    return this.cacheServer(param);
                } else if (Const.cache.type === 'both') {
                    // var result = this.clone(Const.cache.param);
                    var result = this.session('param');
                    if (this.isEmpty(result)) {
                        return this.cacheServer(param);
                    }
                    return result;
                }
            } else if (this.type(param) === 'object') {
                // 设置
                if (Const.cache.type === 'local') {
                    // Const.cache.param = this.mix(Const.cache.param || {}, param);
                    this.session('param', this.mix(this.session('param') || {}, param));
                } else if (Const.cache.type === 'server') {
                    this.cacheServer(param);
                } else if (Const.cache.type === 'both') {
                    // Const.cache.param = this.mix(Const.cache.param || {}, param);
                    this.session('param', this.mix(this.session('param') || {}, param));
                    this.cacheServer(param);
                }
            }
        },
        cacheLocal: function (param) {
            if (this.type(param) === 'undefined') {
                return Const.global.param;
            } else if (this.type(param) === 'string') {
                if (Const.global.param) {
                    return Const.global.param[param];
                }
                return null;
            } else if (this.type(param) === 'object') {
                Const.global.param = param;
            }
        },
        // 支持两种格式：设置cacheServer({})，获取cacheServer('a,b,c')
        cacheServer: function (param) {
            var util = this;
            var token = param.token || this.param('token');
            if (this.isEmpty(token)) {
                return;
            }
            if (this.type(param) === 'string') {
                var result = {};
                this.post({
                    url: Const.url.cache.get,
                    async: false,
                    data: {
                        type: 'get',
                        params: util.simpleEncrypt(util.json(param))
                    },
                    success: function (res) {
                        var data = util.data(res);
                        for (var p in data) {
                            result[util.simpleDecrypt(p)] = util.simpleDecrypt(data[p]);
                        }
                    }
                });
                return result;
            } else if (this.type(param) === 'object') {
                var params = '';
                var data = {};
                for (var p in param) {
                    if (params) {
                        params += ',';
                    }
                    params += p;
                    data[util.simpleEncrypt(p)] = util.simpleEncrypt(param[p]);
                }
                this.post({
                    url: Const.url.cache.set,
                    data: util.mix({
                        type: 'set',
                        params: util.simpleEncrypt(params)
                    }, data)
                });
            }
        },
        session: function(key, value) {
            // return Const.vm.root && Const.vm.root[key];
            if (value === undefined) {
                // get
                var result = sessionStorage.getItem((Const.init.appName ? Const.init.appName + '-' : '') + key);
                if (result) {
                    return this.json(result);
                }
            } else {
                // set
                sessionStorage.setItem((Const.init.appName ? Const.init.appName + '-' : '') + key, this.json(value));
            }
        },
        storage: function(key, value, id) {
            if (key) {
                var storeKey;
                if (id) {
                    storeKey = Const.init.appCode + '_' + id + '_' + key;
                } else {
                    storeKey = Const.init.appCode + '_' + key;
                }
                if (this.type(value) === 'undefined') {
                    // 查询
                    return localStorage.getItem(storeKey);
                } else {
                    // 设置
                    localStorage.setItem(storeKey, value);
                }
            }
        },
        /******************************************* 日期相关 *********************************************************/
        date: function(pattern, date, period) {
            if (!pattern || pattern === 'date' || pattern === 'yyyy-mm-dd' || pattern === 'yyyy-MM-dd') {
                pattern = 'YYYY-MM-DD';
            } else if (pattern === 'datetime' || pattern === 'timestamp' || pattern === 'yyyy-MM-dd hh:mm:ss') {
                pattern = 'YYYY-MM-DD HH:mm:ss';
            }
            if (!period) {
                if (!date) {
                    date = new Date();
                }
                // moment支持'YYYY-MM-DD HH:mm:ss'
                return moment(date).format(pattern);
            }
            var arrs = period.split(',');
            return moment(date, pattern).add(arrs[0], arrs[1]).format(pattern);
        },
        time: function(pattern, date) {
            if (!pattern) {
                pattern = 'HH:mm:ss';
            }
            if (!date) {
                date = new Date();
            }
            return moment(date).format(pattern);
        },
        /******************************************* 数据处理 *********************************************************/
        clone: function(value, origin, flag) {
            var type = this.type(value);
            if (type !== 'undefined' && origin !== undefined) {
                if (type === 'array' && this.type(origin) === 'array') {
                    if (flag) {
                        value.splice(0, value.length);
                    }
                    for (var i=0; i<origin.length; i++) {
                        value.push(origin[i]);
                    }
                } else {
                    for (var p in origin) {
                        vue.set(value, p, origin[p]);
                    }
                }
                return;
            }
            if (type === 'undefined') {
                return;
            } else if (type === 'object') {
                return this.mix({}, value);
            } else if (type === 'array') {
                return value.slice(0);
            } else {
                return value;
            }
        },
        /*
         功能1：json串拷贝，deep设置为true时为深度拷贝
         功能2：url参数拼接
         */
        mix: function(url, param, deep) {
            if (!url || !param) {
                return url;
            }
            if (this.type(url) === 'object') {
                return $.extend(deep, {}, url, param);
            }
            for (var p in param) {
                if (deep) {
                    // 判断不能为空
                    if (this.isEmpty(param[p])) {
                        continue;
                    }
                }
                if (url.indexOf('?') < 0) {
                    url += '?';
                } else {
                    url += '&';
                }
                url += p + '=' + param[p];
            }
            return url;
        },
        // 数组合并
        concat: function (items, toInsert) {
            if (this.isEmpty(items)) {
                return toInsert || [];
            }
            if (this.type(items) !== 'array') {
                var result = [items];
                result.push.apply(result, toInsert);
                return result;
            }
            items.push.apply(items, toInsert);
            return items;
        },
        /******************************************* DOM 操作 *********************************************************/
        empty: function($element) {
            if ($element) {
                $('*', $element).remove();
                $($element).empty();
            }
        },
        remove: function($element) {
            if ($element) {
                $('*', $element).remove();
                $($element).remove();
            }
        },
        hasNav: function () {
            return $('body').hasClass('bv-theme-nav');
        },
        title: function (title) {
            if (window.AlipayJSBridge) {
                AlipayJSBridge.call('setTitle', {
                    title: title
                });
            } else {
                document.title = title;
            }
            /*if (this.hasNav()) {
                $('#navTitle').text(title);
            }*/
        },
        destroy: function (parent) {
            if (parent) {
                for (var i=0; i<parent.$children.length; i++) {
                    parent.$children[i].$destroy();
                }
            }
        },
        /*toBlob: function (base64) {
            var code = window.atob(base64.split(",")[1]);
            var aBuffer = new window.ArrayBuffer(code.length);
            var uBuffer = new window.Uint8Array(aBuffer);
            for (var i = 0; i < code.length; i++) {
                uBuffer[i] = code.charCodeAt(i) & 0xff ;
            }
            var blob = null;
            try {
                blob = new Blob([uBuffer], {type: 'image/jpeg'});
            }
            catch (e) {
                var BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder;
                if (e.name == 'TypeError' && BlobBuilder) {
                    var bb = new BlobBuilder();
                    bb.append(uBuffer.buffer);
                    blob = bb.getBlob('image/jpeg');
                } else if (e.name == "InvalidStateError") {
                    blob = new Blob([aBuffer], {type: 'image/jpeg'});
                } else{
                }
            }
            return blob;
        },*/
        createCache: function (blob) {
            var URL = window.URL || window.webkitURL || window.mozURL;
            return URL.createObjectURL(blob);
        },
        removeCache: function (url) {
            if (url && this.startsWith(url, 'blob')) {
                var URL = window.URL || window.webkitURL || window.mozURL;
                URL.revokeObjectURL(url);
            }
        },
        ime: function (type) {
            if (type && type === 'hide') {
                if (document.activeElement) {
                    // 关闭输入法
                    document.activeElement.blur();
                }
            }
        },
        // 替换加载页面
        replace: function($element, url, callback) {
            this.empty($element);
            this.destroy();
            // this.loading('加载中...');
            this.loading();
//            this.scroll($element);
            url = this.url(url, 'html');
            // $element.load(url, callback);
            //////////////// 百度统计开始
            if (Const.init.hm) {
                if (!window._hmt) {
                    window._hmt = [];
                }
                var path = location.pathname + location.hash;
                if (this.contains(path, '?')) {
                    path = path.substring(0, path.indexOf('?'));
                }
                if (Const.params.hmParam) {
                    var params = Const.params.hmParam.split(',');
                    if (params.length > 0) {
                        var param = '';
                        for (var i=0; i<params.length; i++) {
                            var paramValue = this.gup(params[i], location.pathname + location.hash);
                            if (paramValue) {
                                if (param) {
                                    param += '&';
                                }
                                param += params[i] + '=' + paramValue;
                            }
                        }
                        if (param) {
                            path += '?' + param;
                        }
                    }
                }
                if (this.contains(path, '#!')) {
                    window._hmt.push(['_trackPageview', path]);
                }
            }
            //////////////// 百度统计结束
            var util = this;
            $($element).attr('data-url', url).load(url, function(response, status, xhr) {
                util.loading('hide');
                if (util.type(callback) === 'function') {
                    callback.call(null, response, status, xhr);
                }
            });
            // $($element).attr('data-url', url);
        },
        // url, $target, back, ignore
        redirect: function(param) {
            /*var hash = url;
            if (this.contains(url, '#')) {
                hash = url.substring(url.indexOf('#') + 1);
            }
            if (hash.indexOf('?') > 0) {
                document.title = Const.route.pages[hash.substring(0, hash.indexOf('?'))].title;
                url = Const.route.pages[hash.substring(0, hash.indexOf('?'))].url;
            } else {
                document.title = Const.route.pages[hash].title;
                url = Const.route.pages[hash].url;
            }
            if (!this.gup('t', url)) {
                url = this.mix(url, {
                    t: new Date().getTime()
                });
            }*/
            this.ime('hide');
            if (this.type(param) === 'number') {
                history.go(-1);
                return;
            }
            if (param.title) {
                document.title = param.title;
            }
            var $target = param.$target;
            if (!$target) {
                $target = $('#mainDiv');
            }
            var url = param.url;
            if (this.startsWith(url, 'http')) {
                this.replace($target, url);
                return;
            }
            if (Const.route.baseLocation && this.startsWith(url, Const.route.baseLocation)) {
                return;
            }
            // 是否需要拼装url
            if (!this.isEmpty(Const.init.storage.url)) {
                var extraParams = {};
                for (var i=0; i<Const.init.storage.url.length; i++) {
                    var value = this.gup(Const.init.storage.url[i], url);
                    if (!value) {
                        value = this.gup(Const.init.storage.url[i]) || Const.rest.headers[Const.init.storage.url[i]];
                        if (value) {
                            extraParams[Const.init.storage.url[i]] = value;
                        }
                    }
                }
                url = this.mix(url, extraParams);
            }
            if (!this.isEmpty(Const.init.storage.session)) {
                for (var i=0; i<Const.init.storage.session.length; i++) {
                    var value = this.gup(Const.init.storage.session[i], url);
                    if (!value) {
                        value = this.gup(Const.init.storage.session[i]) || Const.rest.headers[Const.init.storage.session[i]];
                        if (value) {
                            this.session(Const.init.storage.session[i], value);
                        }
                    }
                }
            }
            /*var token = this.gup('token', url);
            if (!token) {
                token = this.gup('token');
                if (token) {
                    url = this.mix(url, {
                        token: token
                    });
                }
            }
            //channelNo
            var channelNo= this.gup('channelNo', url) ;
            if (!channelNo) {
                channelNo  = this.gup('channelNo') || Const.rest.headers.channelNo;
                if (channelNo ) {
                    url = this.mix(url, {
                        channelNo : channelNo
                    });
                }
            }*/
            this.replace($target, Const.route.baseLocation + Const.route.versionLocation + Const.route.htmlLocation + url);
            url = Const.route.baseLocation + Const.route.versionLocation + '/#!' + url;
            if (param.ignore) {
                if (param.back === false) {
                    history.pushState({back: false}, '', url);
                }
                history.replaceState({}, '', url);
            } else if (param.back === undefined || param.back === true || param.back === 'true') {
                history.pushState({}, '', url);
            } else if (param.back === false || param.back === 'false') {
                history.pushState({back: false}, '', url);
                history.pushState({}, '', url);
            } else if (param.back === 'close') {
                history.pushState({back: 'close'}, '', url);
                history.pushState({}, '', url);
            } else {
                history.pushState({back: param.back || url, title: param.title}, '', url);
                history.pushState({}, '', url);
            }
        },
        // 关闭窗口，目前仅支持支付宝
        exit: function () {
            if (window.AlipayJSBridge) {
                AlipayJSBridge.call('exitApp');
            }
        },
        location: function(url) {
            window.location.href = url;
        },
        width: function($elements) {
            if ($elements && $elements.length > 0) {
                if ($elements.length == 1) {
                    return $elements.outerWidth(true);
                }
                var w = 0;
                $elements.each(function(index, element) {
                    w += $(element).outerWidth(true);
                });
                return w;
            }
            return 0;
        },
        /*height: function () {
            if ($('body').hasClass('framework7-root')) {
                // framework7的body高度
                var h = 0;
                $('.page-content').children().each(function () {
                    h += $(this).outerHeight(true);
                });
                return h;
            }
        },*/
        open: function(url) {
            window.open(url);
        },
        // 下载文件
        download: function(url, $trigger, checkBeforeDownload) {
            if ($trigger) {
                $trigger.tooltip('hide');
            }
            var util = this;
            if (util.type(url) === 'string') {
                if (this.startsWith(url, '#')) {
                    url = Const.url.file.download + '/' + url.substring(1);
                }
                if (checkBeforeDownload) {
                    this.get({
                        url: url + (url.indexOf('?') < 0 ? '?' : '&') + 'type=check',
                        success: function() {
                            $('iframe#download').attr('src', util.url(url));
                        }
                    });
                } else {
                    $('iframe#download').attr('src', util.url(url));
                }
            } else {
                this.post({
                    $element: url.$element,
                    url: url.url,
                    data: url.data,
                    success: function(data) {
                        var data = util.data(data);
                        $('iframe#download').attr('src', util.url(Const.url.excel.download + '?fileName=' + data.fileName + '&originName=' + data.originName));
                    }
                });
            }
        },
        formInit: function ($element) {
            if ($($element).is('form')) {
                return $element;
            } else if ($('form', $element).length === 1) {
                return $('form', $element);
            } else if ($($element).closest('form').length === 1) {
                return $($element).closest('form');
            }
        },
        // 初始化form校验
        validateInit: function($element) {
            var $form = this.formInit($element);
            if ($($form).is('form')) {
                $($form).validationEngine({validationEventTrigger: 'change', showPrompts: false, maxErrorsPerField: 1, showOneMessage: true, focusFirstField: false, validateNonVisibleFields: true});
            }
        },
        // 内部
        // 合并validate属性
        // 'data-validation-engine': 'validate[required,equals[#prev]]'
        // 'data-errormessage-value-missing': '确认密码不能为空'
        // 'data-errormessage-pattern-mismatch': '确认密码与新密码不一致'
        validateMix: function(validate) {
            if (this.isEmpty(validate)) {
                return;
            }
            var result = {};
            var validateStr = '';
            if (validate.required) {
                if (validateStr) {
                    validateStr += ',';
                }
                validateStr += 'required';
                if (validate.required !== true) {
                    result['data-errormessage-value-missing'] = validate.required;
                }
            }
            if (validate.equals) {
                if (validateStr) {
                    validateStr += ',';
                }
                if (validate.equals.code) {
                    validateStr += 'equals[' + validate.equals.code + ']';
                } else {
                    validateStr += 'equals[' + validate.equals + ']';
                }
                if (validate.equals.desc) {
                    result['data-errormessage-pattern-mismatch'] = validate.equals.desc;
                }
            }
            if (validate.minSize !== undefined) {
                if (validateStr) {
                    validateStr += ',';
                }
                if (this.type(validate.minSize) === 'number') {
                    validateStr += 'minSize[' + validate.minSize + ']';
                } else if (this.type(validate.minSize) === 'object') {
                    if (validate.minSize.code) {
                        validateStr += 'minSize[' + validate.minSize.code + ']';
                    }
                    if (validate.minSize.desc) {
                        result['data-errormessage-range-underflow'] = validate.minSize.desc;
                    }
                }
            }
            if (validate.maxSize !== undefined) {
                if (validateStr) {
                    validateStr += ',';
                }
                if (this.type(validate.maxSize) === 'number') {
                    validateStr += 'maxSize[' + validate.maxSize + ']';
                } else if (this.type(validate.maxSize) === 'object') {
                    if (validate.maxSize.code) {
                        validateStr += 'maxSize[' + validate.maxSize.code + ']';
                    }
                    if (validate.maxSize.desc) {
                        result['data-errormessage-range-overflow'] = validate.maxSize.desc;
                    }
                }
            }
            if (validate.min !== undefined) {
                if (validateStr) {
                    validateStr += ',';
                }
                if (this.type(validate.min) === 'number') {
                    validateStr += 'min[' + validate.min + ']';
                } else if (this.type(validate.min) === 'object') {
                    if (validate.min.code) {
                        validateStr += 'min[' + validate.min.code + ']';
                    }
                    if (validate.min.desc) {
                        result['data-errormessage-range-underflow'] = validate.min.desc;
                    }
                }
            }
            if (validate.max !== undefined) {
                if (validateStr) {
                    validateStr += ',';
                }
                if (this.type(validate.max) === 'number') {
                    validateStr += 'max[' + validate.max + ']';
                } else if (this.type(validate.max) === 'object') {
                    if (validate.max.code) {
                        validateStr += 'max[' + validate.max.code + ']';
                    }
                    if (validate.max.desc) {
                        result['data-errormessage-range-overflow'] = validate.max.desc;
                    }
                }
            }
            if (validate.custom !== undefined) {
                if (validateStr) {
                    validateStr += ',';
                }
                if (this.type(validate.custom) === 'string') {
                    validateStr += 'custom[' + validate.custom + ']';
                } else if (this.type(validate.custom) === 'object') {
                    if (validate.custom.code) {
                        validateStr += 'custom[' + validate.custom.code + ']';
                    }
                    if (validate.custom.desc) {
                        result['data-errormessage-custom-error'] = validate.custom.desc;
                    }
                }
            }
            if (validate.future !== undefined) {
                if (validateStr) {
                    validateStr += ',';
                }
                if (this.type(validate.future) === 'string') {
                    validateStr += 'future[' + validate.future + ']';
                } else if (this.type(validate.future) === 'object') {
                    if (validate.future.code) {
                        validateStr += 'future[' + validate.future.code + ']';
                    }
                    if (validate.future.desc) {
                        result['data-errormessage-type-mismatch'] = validate.future.desc;
                    }
                }
            }
            if (validate.past !== undefined) {
                if (validateStr) {
                    validateStr += ',';
                }
                if (this.type(validate.past) === 'string') {
                    validateStr += 'past[' + validate.past + ']';
                } else if (this.type(validate.past) === 'object') {
                    if (validate.past.code) {
                        validateStr += 'past[' + validate.past.code + ']';
                    }
                    if (validate.past.desc) {
                        result['data-errormessage-type-mismatch'] = validate.past.desc;
                    }
                }
            }

            result['data-validation-engine'] = 'validate[' + validateStr + ']';

            return result;
        },
        // 校验form表单
        validate: function($element) {
            if ($($element).attr('data-validation-engine')) {
                var ret = $($element).validationEngine('validate');
                if (!ret) {
                    this.validateAlert($($element).closest('form'));
                }
                return ret;
            } else {
                var $form = this.formInit($element);
                if ($($form).is("form")) {
                    var ret = $($form).validationEngine('validate');
                    if (!ret) {
                        this.validateAlert($form);
                    }
                    return ret;
                }
            }
        },
        validateAlert: function ($form) {
            var msg = $($form).data('jqv').msg;
            if (msg) {
                var fields = $($form).data('jqv').InvalidFields;
                // 是否显示
                if (fields && fields.length === 1) {
                    var $accordion = $(fields[0]).closest('.accordion-item');
                    if ($accordion && $accordion.length === 1 && !$accordion.is('.accordion-item-expanded')) {
                        Const.global.f.accordionOpen($accordion);
                    }
                }
                this.alert({
                    message: msg
                });
            }
        },
        checked: function($element, value) {
            if (this.type(value) === 'undefined') {
                return $($element).prop('checked');
            }
            $($element).prop('checked', value);
            return value;
        },
        /******************************************* 数组相关 *********************************************************/
        // arrs: 二维数组
        // values: 数组
        index: function(arrs, values, code, jsonValue) {
            if (values != undefined && values != null) {
                if (this.type(values) === 'string' || this.type(values) === 'number') {
                    for (var i=0; i<arrs.length; i++) {
                        if (code) {
                            if (arrs[i][code] === values) {
                                return jsonValue ? arrs[i] : i;
                            }
                        } else {
                            if (arrs[i] === values) {
                                return jsonValue ? arrs[i] : i;
                            }
                        }
                    }
                } else if (this.type(values) === 'array') {
                    for (var i=0; i<arrs.length; i++) {
                        var subArr = arrs[i];
                        for (var j=0; j<subArr.length; j++) {
                            if (subArr[j] !== values[j]) {
                                break;
                            }
                            if (j === subArr.length - 1) {
                                return jsonValue ? arrs[i] : i;
                            }
                        }
                    }
                }
            }
            return jsonValue ? null : -1;
        },
        find: function(rows, keys, values) {
            for (var i=0; i<rows.length; i++) {
                var row = rows[i];
                for (var j=0; j<keys.length; j++) {
                    if (row[keys[j]] !== values[j]) {
                        break;
                    }
                    if (j === keys.length - 1) {
                        return i;
                    }
                }
            }
            return -1;
        },

        /******************************************* 虚拟vm   *********************************************************/
        bind: function(param) {
            if (param.container && !param.el) {
                param.el = '[data-container=' + param.container + ']';
                delete param.container;
            }
            // param.parent = Const.vm.root;
            /*var util = this;
            if (param.mounted) {
                var _mounted = param.mounted;
                param.mounted = function () {
                    util.initBodyHeight();
                    _mounted.call(this);
                };
            } else {
                param.mounted = function () {
                    util.initBodyHeight();
                };
            }*/
            return new vue(param);
        },
        // framework7专用
        /*initBodyHeight: function () {
            if ($('.webview-content').length == 0) {
                // $('.views').addClass('webview');
                // $('body').height(util.height());
                $('body').height('100%');
                // $('.views').removeClass('webview');
            } else {
                $('body').height(this.height());
            }
        },*/
        // 兼容util.vm(vm, 'xxx', 'yyy')及util.vm(vm, 'xxx.yyy')
        vm: function(parent, key, sub) {
            var vm;
            if (!parent) {
                vm = Const.vm.modal;
            } else {
                vm = parent;
            }
            if (vm.tags) {
                vm = vm.$children[0];
            }
            // modified bv-form嵌套了一层vm(bv-form-container-form or bv-form-container-div)
            /*if (this.tagName(vm) === 'bv-form') {
                vm = vm.$children[0];
            }*/
            // end
            if (!key) {
                return vm;
            }
            if (!this.contains(key, '.')) {
                var found = false;
                for (var i=0; i<vm.$children.length; i++) {
                    if (key === (vm.$children[i].name || vm.$children[i].$vnode.key)) {
                        vm = vm.$children[i];
                        found = true;
                        break;
                    }
                }
                if (!found) {
                    return null;
                }
            } else {
                var keys = key.split('.');
                for (var i=0; i<keys.length; i++) {
                    vm = this.vm(vm, keys[i]);
                }
            }
            if (!this.contains(sub, '.')) {
                return this.vm(vm, sub);
            } else {
                var keys = sub.split('.');
                for (var i=0; i<keys.length; i++) {
                    vm = this.vm(vm, keys[i]);
                }
            }
            return vm;
        },
        tagName: function (vm) {
            return vm.$options._componentTag;
        },
        refresh: function(param) {
            if (param && param.vm) {
                var tagType = this.tagName(param.vm);
                if (tagType) {
                    /*if (tagType === 'bv-form-container-form' || tagType === 'bv-form-container-div') {
                        param.vm = param.vm.$parent;
                        tagType = 'bv-form';
                    }*/
                    if (tagType === 'bv-form') {
                        if (this.type(param.clazz) !== 'undefined') {
                            param.vm.innerClass = param.clazz;
                        }
                        if (param.title) {
                            param.vm.innerTitle = param.title;
                        }
                        if (param.entity) {
                            this.clone(param.vm.innerEntity, param.entity);
                            /// param.vm.innerEntity = this.mix(param.vm.innerEntity, param.entity);
                        }
                        if (param.columns && this.type(param.columns) === 'array') {
                            for (var i=0; i<param.columns.length; i++) {
                                param.vm.innerColumns.push(param.vm.initColumn(param.columns[i]));
                                param.vm.innerInitEntity[param.columns[i].name] = null;
                            }
                        }
                        if (param.column && param.column.name) {
                            if (param.column.head) {
                                for (var i=0; i<param.vm.innerColumns.length; i++) {
                                    if (param.column.name === param.vm.innerColumns[i].name) {
                                        param.vm.innerColumns[i].head = param.column.head;
                                    }
                                }
                            }
                        }
                        if (param.editType) {
                            param.vm.innerEditType = param.editType;
                        }
                        if (param.show) {
                            if (param.show.name) {
                                param.vm.showColumn(param.show.name);
                            }
                            if (param.show.names) {
                                var names = param.show.names.split(',');
                                for (var i=0; i<names.length; i++) {
                                    param.vm.showColumn($.trim(names[i]));
                                }
                            }
                            if (param.show.operate) {
                                param.vm.showOperate(param.show.operate);
                            }
                        }
                        if (param.hide) {
                            if (param.hide.name) {
                                param.vm.hideColumn(param.hide.name);
                            }
                            if (param.hide.names) {
                                var names = param.hide.names.split(',');
                                for (var i=0; i<names.length; i++) {
                                    param.vm.hideColumn($.trim(names[i]));
                                }
                            }
                            if (param.hide.operate) {
                                param.vm.hideOperate(param.hide.operate);
                            }
                        } if (param.create) {
                            if (param.create.name) {
                                param.vm.showColumn(param.create.name);
                            }
                            if (param.create.names) {
                                var names = param.create.names.split(',');
                                for (var i=0; i<names.length; i++) {
                                    param.vm.showColumn($.trim(names[i]));
                                }
                            }
                            if (param.create.operate) {
                                param.vm.showOperate(param.create.operate);
                            }
                        }
                        if (param.destroy) {
                            if (param.destroy.name) {
                                param.vm.hideColumn(param.destroy.name);
                            }
                            if (param.destroy.names) {
                                var names = param.destroy.names.split(',');
                                for (var i=0; i<names.length; i++) {
                                    param.vm.hideColumn($.trim(names[i]));
                                }
                            }
                            if (param.destroy.operate) {
                                param.vm.hideOperate(param.destroy.operate);
                            }
                        }
                        if (param.name) {
                            if (param.initRows) {
                                this.refresh({
                                    id: param.id + '-' + param.name,
                                    innerInitRows: param.initRows
                                });
                            }
                        } else if (param.name && this.type(param.value) !== 'undefined') {
                            param.vm.innerEntity[param.name] = param.value;
                        }
                    } else if (tagType === 'bv-chart') {
                        if (param.type) {
                            if (param.vm.innerType !== param.type) {
                                param.vm.innerType = param.type;
                                param.vm.localChart = null;
                            }
                        }
                        if (param.labels) {
                            param.vm.innerLabels = param.labels;
                        }
                        if (param.datasets) {
                            param.vm.innerDatasets = param.datasets;
                        }
                        param.vm.refresh();
                    } else if (tagType === 'bv-textfield') {
                        if (param.value !== undefined) {
                            param.vm.innerEntity[param.vm.name] = param.value;
                        }
                        if (param.attr) {
                            this.clone(param.vm.innerAttr, param.attr);
                        }
                    } else if (tagType === 'bv-select') {
                        if (param.excludes !== undefined && this.type(param.excludes) === 'array') {
                            for (var i=0; i<param.vm.innerOptions.length; i++) {
                                if (param.excludes.indexOf(param.vm.innerOptions[i].code) >= 0) {
                                    vue.set(param.vm.innerOptions[i], 'hide', true);
                                } else {
                                    vue.set(param.vm.innerOptions[i], 'hide', false);
                                }
                            }
                            if (param.excludes.indexOf(param.vm.innerEntity[param.vm.name]) >= 0) {
                                param.vm.innerEntity[param.vm.name] = null;
                            }
                        }
                        if (param.includes !== undefined && this.type(param.includes) === 'array') {
                            for (var i=0; i<param.vm.innerOptions.length; i++) {
                                if (param.includes.indexOf(param.vm.innerOptions[i].code) >= 0) {
                                    vue.set(param.vm.innerOptions[i], 'hide', false);
                                } else {
                                    vue.set(param.vm.innerOptions[i], 'hide', true);
                                }
                            }
                            if (param.includes.indexOf(param.vm.innerEntity[param.vm.name]) < 0) {
                                param.vm.innerEntity[param.vm.name] = null;
                            }
                        }
                        if (param.choose) {
                            // this.clone(param.vm.innerChoose, param.choose);
                            param.vm.innerChoose = param.choose;
                            this.initSelectData(param.vm, 'select');
                        }
                    } else if (tagType === 'bv-list') {
                        if (param.title !== undefined) {
                            param.vm.innerTitle = param.title;
                        }
                        if (param.items && this.type(param.items) === 'array') {
                            param.vm.init();
                            param.vm.innerItems = param.items;
                        }
                    } else if (tagType === 'bv-tabs') {
                        if (param.index !== undefined) {
                            param.vm.innerCurrentIndex = param.index;
                        }
                        if (param.content !== undefined) {
                            Const.global.f.showTab($('.bv-tabs-content').eq(param.content));
                        }
                    }
                } else if (param.value !== undefined) {
                    param.vm.innerEntity[param.vm.name] = param.value;
                }
            }
        },
        tabsIndex: function (vm) {
            if (vm) {
                return vm.innerCurrentIndex;
            }
            return -1;
        },
        reset: function(id, names) {
        },
        value: function(id, name) {
        },
        hide: function(param) {
        },
        /******************************************* 辅助工具 *********************************************************/
        guid: function() {
            var d = new Date().getTime();
            var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
                var r = (d + Math.random()*16)%16 | 0;
                d = Math.floor(d/16);
                return (c=='x' ? r : (r&0x3|0x8)).toString(16);
            });
            return uuid;
        },
        debug: function(title, content) {
            if (Const.init.debug) {
                if (this.isEmpty(content)) {
                    console.log(title);
                } else {
                    console.log(title, content);
                }
            }
        },
        heredoc: function(fn) {
            return fn.toString().replace('return;', '').replace(/^[^\/]+\/\*!?\s?/, '').replace(/\*\/[^\/]+$/, '').trim().replace(/>\s*</g, '><');
        },
        template: function (tagName) {
            return $('.' + tagName, template).prop('outerHTML');
        },
        /******************************************* 组件 *********************************************************/
        // menus属性
        actions: function (buttons) {
            if (buttons && buttons.length > 0) {
                var _b = [];
                for (var i=0; i<buttons.length; i++) {
                    _b.push({
                        text: buttons[i].text,
                        onClick: buttons[i].click
                    });
                }
                Const.global.f.actions(_b);
            }
        },
        report: function (message) {
            if (Const.url.report && message) {
                var param = this.param({
                    url: Const.url.report,
                    type: 'post',
                    dataType: 'json',
                    contentType: 'application/json',
                    global: false
                });
                param.data = this.json({
                    client: navigator.userAgent,
                    timestamp: moment().format('YYYY-MM-DD HH:mm:ss.SSS'),
                    headers: param.headers,
                    message: message
                });
                param.error = function (xhr, status, e) {
                    // 错误日志上送失败，放入队列重新发送
                    if (xhr.status !== 200 && Const.cache.reports.length < (Const.init.maxReport)) {
                        Const.cache.reports.push(message);
                    }
                };
                $.ajax(param);
            }
        },
        // title属性
        // message属性
        // clazz属性
        // operates属性（text、click、type-支持primary/default）
        // yes属性（与operates属性不能同时用）

        // Const.global.f.alert(text, [title, callbackOk])
        alert: function (param) {
            if (!param) {
                return;
            }
            var message;
            if (this.type(param) === 'string') {
                if (this.startsWith(param, '#')) {
                    Const.global.f.modal({
                        text: Const.messages[param.substring(1)],
                        buttons: [ {text: Const.messages.alertOk} ]
                    });
                    // Const.global.f.alert(Const.messages[param.substring(1)]);
                } else {
                    Const.global.f.modal({
                        text: param,
                        buttons: [ {text: Const.messages.alertOk} ]
                    });
                    // Const.global.f.alert(param);
                }
            } else if (param.message) {
                if (this.startsWith(param.message, '#')) {
                    Const.global.f.modal({
                        text: Const.messages[param.message.substring(1)],
                        title: param.title,
                        buttons: [ {text: Const.messages.alertOk, onClick: param.yes} ]
                    });
                    // Const.global.f.alert(Const.messages[param.message.substring(1)], param.title, param.yes);
                } else {
                    Const.global.f.modal({
                        text: param.message,
                        title: param.title,
                        buttons: [ {text: Const.messages.alertOk, onClick: param.yes} ]
                    });
                    // Const.global.f.alert(param.message, param.title, param.yes);
                }
            } else {
                Const.global.f.modal({
                    text: Const.messages['unknownError'],
                    buttons: [ {text: Const.messages.alertOk} ]
                });
                // Const.global.f.alert(Const.messages['unknownError']);
            }
        },
        // 弹层
        popup: function (param) {
            this.ime('hide');
            if (this.type(param) === 'string') {
                if (param === 'close') {
                    Const.global.f.closeModal();
                } else {
                    // .xx or #xxx
                }
                return;
            }
            if (param.type) {
                // agree
                if ($('.agree-popup').length === 0) {
                    // 创建
                    $('body').append(this.template('agree-popup'));
                    // $('.agree-popup div#content').height($(window).height() - 45);
                    var util = this;
                    $('.agree-popup iframe').on('load', function () {
                        util.loading('hide');
                        /*if ($(this).attr('src') !== 'about:blank') {
                            try {
                                $(this).height($('html', $(this).contents()).height());
                            } catch (e) {
                            }
                        }else{
                            try {
                                $(this).height('100%');
                            } catch (e) {
                            }
                        }*/
                    });
                }
                param.$element = $('.agree-popup');
            }
            if (param.$element) {
                if (param.title) {
                    $(param.$element).attr('data-title', param.title);
                }
                if (param.url) {
                    $(param.$element).attr('data-url', param.url);
                }
                Const.global.f.popup(param.$element);
            }
        },
        // myApp.confirm(text, [title, callbackOk, callbackCancel])
        confirm: function (param) {
            if (param) {
                if (this.startsWith(param.message, '#')) {
                    Const.global.f.confirm(Const.messages[param.message.substring(1)], param.title, param.yes, param.no);
                } else {
                    Const.global.f.confirm(param.message, param.title, param.yes, param.no);
                }
            }
        },
        modal: function (param) {
            if (param) {
                // util.modal('close')
                if (this.type(param) === 'string') {
                    if (param === 'close') {
                        Const.global.f.closeModal();
                    } else {
                        // .xx or #xxx
                    }
                    return;
                }
                var buttons = [];
                if (param.operates && param.operates.length > 0) {
                    for (var i=0; i<param.operates.length; i++) {
                        buttons.push({
                            text: param.operates[i].text,
                            close: param.operates[i].close,
                            onClick: param.operates[i].click
                        });
                    }
                }
                if (param.close) {
                    buttons.push({
                        cssClass: 'close',
                        text: '<a href="javascript:;" class="chip-delete modal-close"></a>',
                        close: true
                    });
                    // param.extra = '';
                }
                Const.global.f.modal({
                    title: param.title,
                    text: param.message,
                    cssClass: param.clazz,
                    afterText: param.extra,
                    verticalButtons: param.inline !== undefined && param.inline === false,
                    buttons: buttons
                });
            }
        },
        // 显示错误提示信息
        // message duration // level title
        /*show: function(param) {
            if (param) {
                if (param.position) {
                    if (param.position === 'top') {
                        weui.topTips(param.message);
                    }
                } else {
                    weui.toast(param.message);
                }
            }
        },*/
        preloading: function () {
            $('.bv-overlay').show();
            setTimeout(function () {
                $('.bv-overlay').hide();
            }, Const.init.loadingDelay);
        },
        // util.loading('加载中...')
        // util.loading('支付中...', 'paying')
        loading: function(type, clazz) {
            if (type && type === 'hide') {
                if (!Const.global.loading || Const.global.loading === 1) {
                    setTimeout(function () {
                        if (Const.global.customLoading) {
                            if (Const.global.customLoading === 'preloader') {
                                Const.global.f.preloader.hide();
                            } else {
                                Const.global.f.closeModal('.' + Const.global.customLoading);
                            }
                        } else {
                            Const.global.f.preloader.hide();
                            /*if ($('.modal.modal-in:not(.modal-preloader)').length === 0) {
                                Const.global.f.closeModal('.modal-preloader');
                            }*/
                            /*if (Const.global.$loading) {
                             Const.global.$loading.hide();
                             }*/
                        }
                        Const.global.loading = 0;
                    }, Const.init.loadingDelay);
                } else {
                    Const.global.loading--;
                }
            } else {
                if (clazz) {
                    Const.global.customLoading = clazz;
                    return Const.global.f.modal({
                        text: '<div class="preloader"></div>',
                        cssClass: 'modal-preloader ' + (clazz || ''),
                        afterText: type
                    });
                } else if (!Const.global.loading) {
                    Const.global.loading = 1;

                    /// clazz = 'paying';
                    //加载中
                    if (!type) {
                        Const.global.customLoading = false;
                        Const.global.f.preloader.show();
                    } else {
                        Const.global.customLoading = 'preloader';
                        Const.global.f.preloader.show(type);
                    }
                    // Const.global.f.showIndicator();
                    // Const.global.f.root.append('<div class="preloader-indicator-overlay"></div><div class="preloader-indicator-modal"><span class="preloader preloader-white"></span></div>');
                    /// Const.global.$loading = weui.loading(type || '处理中...');
                } else {
                    Const.global.loading++;
                }
            }
        },
        /******************************************* 内部使用 *********************************************************/
        transOrder: function (orderList, orders) {
            if (!orderList) {
                orderList = [];
            }
            if (orders) {
                var ordersArr = orders.split(',');
                for (var i=0; i<ordersArr.length; i++) {
                    var order = $.trim(ordersArr[i]);
                    if (order) {
                        var arr = order.replace(/\s+/g, ' ').split(' ');
                        if (arr.length === 1) {
                            orderList.push({
                                name: $.trim(arr[0])
                            });
                        } else if (arr.length === 2) {
                            orderList.push({
                                name: $.trim(arr[0]),
                                sort: $.trim(arr[1])
                            });
                        }
                    }
                }
            }
            return orderList;
        },
        // 根据页码、每页显示记录数获取偏移量
        offset: function(page, limit) {
            if (page !== undefined && limit !== undefined) {
                return (page -1) * limit;
            }
            return 0;
        },
        // 限制输入
        fix: function(event, type, text) {
            var r = '';
            var m = '';
            if (type) {
                if (type === 'integer') {
                    r = /\D+/g;
                } else if (type === 'number') {
                    r = /[^\d.-]/g;
                } else if (type === 'phone') {
                    r = /[^\d]/g;
                } else if (type === '+number') {
                    r = /[^\d.]/g;
                } else if (type === 'amount') {
                    r = /[^\d.]/g;
                    m = /\d+(\.\d{0,2})?/g;
                }else if (type === 'trim'){
                    r = /^\s+|\s+$/g;
                }
            }
            if (text) {
                event.preventDefault();
                var result = event.target.value + text;
                if (r) {
                    result = result.replace(r, '');
                }
                if (m) {
                    result = result.match(r);
                    if (result) {
                        result = result[0];
                    }
                }
                // 判断长度
                var maxlength = event.target.maxLength;
                if (maxlength > 0) {
                    // -1表示未限制长度
                    if (result.length > maxlength) {
                        event.target.value = result.substring(0, maxlength);
                    } else {
                        event.target.value = result;
                    }
                } else {
                    event.target.value = result;
                }
            } else {
                var result = event.target.value;
                if (r) {
                    result = result.replace(r, '');
                }
                if (m) {
                    result = result.match(m);
                    if (result) {
                        // result = result.join('');
                        result = result[0];
                    }
                }
                if (event.target.value !== result) {
                    event.target.value = result;
                }
            }
            return event.target.value;
        },
        
        clipboard: function () {
            var clipboardData = event.clipboardData || window.clipboardData;
            return clipboardData.getData('text');
        },
        // 根据字典值取对应的名称
        trans: function(value, config) {
            if ((!value && value != 0) || !config) {
                return value;
            }
            var result = undefined;
            if (this.type(config) === 'string') {
                if (this.startsWith(config, '#')) {
                    config = {
                        preset: 'json',
                        choose: this.transOptions({
                            preset: 'json',
                            initOptions: Const.dicts[config.substring(1)]
                        }).options
                    };
                }
            }
            if (config.choose) {
                var seprator = ',';
                if (config.seprator) {
                    seprator = config.seprator;
                }
                if (config.preset && !config.code) {
                    config.code = Const.init.preset[config.preset].code;
                    config.desc = Const.init.preset[config.preset].desc;
                }
                if (this.type(value) === 'number') {
                    value = this.toString(value);
                    for (var i=0; i<config.choose.length; i++) {
                        if (value === config.choose[i][config.code]) {
                            return config.choose[i][config.desc];
                        }
                    }
                } else {
                    var values = value.split(seprator);
                    for (var index=0; index<values.length; index++) {
                        for (var i=0; i<config.choose.length; i++) {
                            if (values[index] === config.choose[i][config.code]) {
                                if (result) {
                                    result += seprator;
                                } else {
                                    result = '';
                                }
                                result += config.choose[i][config.desc];
                                break;
                            }
                        }
                    }
                }
            }
            return result === undefined ? value : result;
        },
        // 数据格式化
        // 支持:
        // format('xxx', 'file')
        // format('xxx')
        // format('xxx', 'time')
        // format('xxx', 'truncate(10)')
        // format('xxx', 'xxx|yyy') -> xxx.filters.xxx = function(v, yyy) {}
        format: function(v, type) {
            if (!v) {
                return v;
            }
            if (!type || type === 'dict') {
                return v;
            }
            if (this.type(v) === 'number') {
                v = new Number(v);
            }

            var formatType = type;
            var params = null;
            if (type.indexOf('(') > 0 && type.indexOf(')') > 0) {
                type = this.replaceAll($.trim(type), ', ', ',');
                formatType = type.substring(0, type.indexOf('('));
                params = type.substring(type.indexOf('(') + 1, type.indexOf(')')).split(',');
            }

            var param = null;
            var types;
            if (type.indexOf('|') > 0) {
                types = type.split('|');
                if (types.length > 1) {
                    type = types[0];
                    param = types[1];
                }
            } else {
                types = type;
            }

            switch (formatType) {
                case 'number':
                    // number, decimals, point, thousands
                    var number = v;
                    var decimals;
                    var point;
                    var thousands;
                    if (params !== null) {
                        if (params.length > 0) {
                            decimals = params[0];
                        }
                        if (params.length > 1) {
                            point = params[1];
                        }
                        if (params.length > 2) {
                            thousands = params[2];
                        }
                    }
                    return formatNumber(number, decimals, point, thousands);
                case 'file':
                    return formatNumber(v, 0);
                case 'currency':
                    // amount, symbol, fractionSize
                    var amount = v;
                    var symbol;
                    var fractionSize;
                    if (params !== null) {
                        if (params.length > 0) {
                            symbol = params[0];
                        }
                        if (params.length > 1) {
                            fractionSize = params[1];
                        }
                    }
                    return (symbol !== 'false' ? (symbol || '\u00a5') : '') + formatNumber(amount, isFinite(fractionSize) ? fractionSize : 2);
                case 'currencyFen':
                    var amount = this.toNumber(v) / 100;
                    var symbol;
                    var fractionSize;
                    if (params !== null) {
                        if (params.length > 0) {
                            symbol = params[0];
                        }
                        if (params.length > 1) {
                            fractionSize = params[1];
                        }
                    }
                    return (symbol || '\u00a5') + formatNumber(amount, isFinite(fractionSize) ? fractionSize : 2);
                case 'date':
                    if (this.type(v) === 'string' && v.length >= 10) {
                        return v.substring(0, 10);
                    }
                /// return this.filter.date(v, 'yyyy-MM-dd');
                case 'datetime':
                    if (this.type(v) === 'string' && v.length >= 19) {
                        return v.substring(0, 19);
                    }
                /// return this.filter.date(v, 'yyyy-MM-dd HH:mm:ss');
                case 'time':
                    if (this.type(v) === 'string' && v.length >= 10) {
                        return v.substring(10, 19);
                    }
                /// return this.filter.date(v, 'HH:mm:ss');
                case 'timestamp':
                    if (this.type(v) === 'string' && v.length >= 19) {
                        return v.substring(0, 19);
                    }
                /// return this.filter.date(v, 'yyyy-MM-dd HH:mm:ss');
                case 'truncate':
                    var str = v;
                    var length;
                    var end;
                    if (params !== null) {
                        if (params.length > 0) {
                            length = params[0];
                        }
                        if (params.length > 1) {
                            end = params[1];
                        }
                    }
                    //length，新字符串长度，truncation，新字符串的结尾的字段,返回新字符串
                    if (!str) {
                        return '';
                    }
                    str = String(str);
                    if (isNaN(length)) {
                        length = 30;
                    }
                    end = typeof end === "string" ? end : "...";
                    return str.length > length ? str.slice(0, length - end.length) + end : str;
                /// return this.filter.truncate(v, this.toNumber(param));
                case 'hyphen':
                    //转换为连字符线风格
                    return v.replace(rhyphen, '$1-$2').toLowerCase();
                case 'camelize':
                    //提前判断，提高getStyle等的效率
                    if (!v || v.indexOf('-') < 0 && v.indexOf('_') < 0) {
                        return v;
                    }
                    //转换为驼峰风格
                    return v.replace(rcamelize, function (match) {
                        return match.charAt(1).toUpperCase()
                    });
                case 'card3':
                    return v && v.length >= 3 && v.substr(0, 3);
                case 'card4':
                    return v && v.length >= 4 && v.substr(-4, 4);
                case 'phone4':
                    return v && v.length == 11 && (v.substring(0, 3) + '****' + v.substring(7, 11));
                default:
                    // TODO: xxxxx
                    return this.filter[formatType].call(null, v, param);
            }
            return v;
        },
        attr: function(name, presetName, attr) {
            if (!attr) {
                attr = {};
            }
            var preset;
            if (this.type(presetName) != 'undefined') {
                // presetName可以为false，表示不取预设信息
                if (presetName) {
                    preset = Const.rule[presetName];
                } else {
                    preset = Const.rule[name];
                }
            }
            return attr;
        },

        initDefault: function(vm) {
            if (!vm.innerAttr) {
                vm.innerAttr = {};
            }
            if (vm.id) {
                vm.innerAttr.id = vm.id;
            }
            if (vm.name) {
                vm.innerAttr.name = vm.name;
            }
            if (!this.isEmpty(vm.defaultValue) && this.isEmpty(vm.innerValue)) {
                if (vm.defaultValue === '$sysdate') {
                    vm.defaultValue = this.date();
                }
                vm.innerValue = vm.defaultValue;
            }
            if (!this.isEmpty(vm.innerValue) && vm.innerEntity && vm.name) {
                vm.innerEntity[vm.name] = vm.innerValue;
            }
            if (this.isEmpty(vm.innerValue) && vm.innerEntity && vm.name) {
                vm.innerValue = vm.innerEntity[vm.name];
            }
            if (!vm.innerCode && vm.preset) {
                vm.innerCode = Const.init.preset[vm.preset].code;
                vm.innerDesc = Const.init.preset[vm.preset].desc;
            }
            if (!this.isEmpty(vm.initParam)) {
                if (this.isEmpty(vm.initParamList)) {
                    vm.initParamList = [];
                }
                var data;
                if (this.type(vm.initParam) === 'function') {
                    // TODO: !!!!
                    data = vm.initParam.call(null, '');
                } else {
                    data = vm.initParam;
                }
                for (var p in data) {
                    vm.initParamList.push({
                        name: p,
                        operate: '=',
                        value: data[p]
                    });
                }
            }
            if (!this.isEmpty(vm.validate)) {
                /*if (!vm.validateJson) {
                 vm.validateJson = [];
                 }*/
                vm.innerAttr = this.mix(vm.innerAttr, this.validateMix(vm.validate));
            }
            if (this.type(vm.innerAttr.maxlength) === 'string' && this.startsWith(vm.innerAttr.maxlength, '#')) {
                vm.innerAttr.maxlength = Const.lengths[vm.innerAttr.maxlength.substring(1)];
            }
            // 处理默认排序
            if (vm.orders) {
                var initOrders = vm.orders.split(',');
                for (var i=0; i<initOrders.length; i++) {
                    var order = $.trim(initOrders[i]);
                    if (order) {
                        var arr = order.replace(/\s+/g, ' ').split(' ');
                        if (arr.length === 1) {
                            vm.localOrderList.push({
                                name: $.trim(arr[0])
                            });
                        } else if (arr.length === 2) {
                            vm.localOrderList.push({
                                name: $.trim(arr[0]),
                                sort: $.trim(arr[1])
                            });
                        }
                    }
                }
            }
        },
        initId: function(vm) {
            if (!vm.innerAttr.id) {
                vm.innerAttr.id = vm.name;
            }
        },

        transPresetOptions: function (initOptions, preset) {
            if (this.isEmpty(initOptions)) {
                return initOptions || [];
            }
            var options = [];
            if (this.type(initOptions) === 'object') {
                for (var p in initOptions) {
                    options.push({
                        code: this.toString(p),
                        name: initOptions[p]
                    });
                }
            } else if (preset === 'json') {
                for (var i=0; i<initOptions.length; i++) {
                    for (p in initOptions[i]) {
                        options.push({
                            code: p,
                            name: initOptions[i][p]
                        });
                    }
                }
            } else if (preset === 'simple') {
                for (var i=0; i<initOptions.length; i++) {
                    options.push({
                        name: initOptions[i]
                    });
                }
            } else {
                options = initOptions;
            }
            return options;
        },
        /*
         config: {
         initOptions: [],
         extraOptions: [],
         excludeOptions: [],
         preset: '',
         code: '',
         desc: '',
         label: '',
         trans: '',
         type: 'select-radio-checkbox-auto',
         show: function() {}
         }
         返回格式: {
         options: [],
         groups: []
         }
         */
        transOptions: function(config) {
            if (!config) {
                config = {};
            }
            if (!config.type) {
                config.type = 'select';
            }
            var results = {};

            var initOptions = config.initOptions;
            if (!initOptions) {
                initOptions = [];
            }
            /*var presets = Const.init[config.preset || 'default'];
             if (!presets) {
             return results;
             }*/
            if (this.type(initOptions) === 'string' && this.startsWith(initOptions, '#')) {
                var $dicts = Const.dicts[initOptions.substring(1)];
                if ($dicts == null) {
                    initOptions = [];
                } else {
                    initOptions = this.clone(Const.dicts[initOptions.substring(1)]);
                }
            }
            var options = this.transPresetOptions(initOptions, config.preset);
            var extraOptions = this.transPresetOptions(config.extraOptions, config.preset);

            if (config.type !== 'auto' && config.show && this.type(config.show) === 'function') {
                for (var i=0; i<options.length; i++) {
                    options[i][config.desc] = config.show.call(null, options[i]);
                }
            }

            if (config.desc && !this.isEmpty(config.trans)) {
                if (this.type(config.trans) === 'array') {
                    for (var i=0; i<options.length; i++) {
                        for (var j=0; j<config.trans.length; j++) {
                            if (options[i][config.code] === config.trans[j][config.code]) {
                                options[i][config.desc] = config.trans[j][config.desc];
                            }
                        }
                    }
                } else if (this.type(config.trans) === 'object') {
                    for (var i=0; i<options.length; i++) {
                        options[i][config.desc] = config.trans[options[i][config.code]];
                    }
                }
            }
            // 处理excludes
            if (config.excludeOptions && config.excludeOptions.length > 0) {
                for (i=0; i<config.excludeOptions.length; i++) {
                    var index = this.index(options, config.excludeOptions[i], config.code);
                    if (index >= 0) {
                        options.splice(index, 1);
                    }
                }
            }

            // 仅select支持group分组
            if (config.type === 'select' && config.label) {
                var groups = [];

                var currentGroup = '';
                var currentSub = [];
                for (var i=0; i<options.length; i++) {
                    var option = options[i];
                    if (option[config.label]) {
                        if (currentGroup && currentGroup !== option[config.label]) {
                            groups.push({
                                label: option[config.label],
                                options: this.clone(currentSub)
                            });
                            currentSub = [];
                        }
                        currentGroup = option[config.label];
                        currentSub.push(option);

                        if (i === options.length - 1) {
                            groups.push({
                                label: option[config.label],
                                options: this.clone(currentSub)
                            });
                            currentGroup = '';
                            currentSub = [];
                        }
                    } else {
                        options.push(option);
                    }
                }
                results.groups = groups;
            }
            if (options && extraOptions && extraOptions.length > 0) {
                for (var i=0; i<extraOptions.length; i++) {
                    options.push(extraOptions[i]);
                }
            }
            // auto支持$map属性，不支持options属性
            if (config.type === 'auto') {
                var shows = [];
                var map = {};
                for (var i=0; i<options.length; i++) {
                    var desc = this.transAutoShow({
                        show: config.show,
                        preset: config.preset,
                        code: config.code,
                        desc: config.desc,
                        data: options[i]
                    });
                    shows.push(desc);
                    map[desc] = options[i];
                }
                // return results;
                results.shows = shows;
                results.map = map;
            }
            results.options = options;
            return results;
        },
        doAutoProcess: function(vm, query, process) {
            if (this.isEmpty(vm.innerChoose) && vm.url) {
                var util = this;
                if (vm.entityName) {
                    util.post({
                        url: vm.url,
                        data: {
                            entityName: vm.entityName,
                            distinct: vm.distinct,
                            columns: (vm.innerDesc ? (vm.innerCode + "," + vm.innerDesc) : vm.innerCode) + (vm.extraColumns ? ',' + vm.extraColumns : ''),
                            initParamList: util.transInitParam(vm),
                            orderList: vm.localOrderList,
                            q: query,
                            limit: vm.limit
                        },
                        success: function(res) {
                            var results = util.transOptions({
                                type: 'auto',
                                initOptions: util.data(res).data || util.data(res),
                                extraOptions: vm.extras,
                                excludeOptions: vm.excludes,
                                preset: vm.preset,
                                code: vm.innerCode,
                                desc: vm.innerDesc,
                                label: vm.label,
                                trans: vm.trans,
                                show: vm.show
                            });
                            if (results.options) {
                                vm.innerOptions = results.options;
                            }
                            if (results.shows) {
                                vm.localShows = results.shows;
                            }
                            if (results.map) {
                                vm.localMap = results.map;
                            }
                            process(vm.localShows);
                        }
                    });
                } else {
                    if (vm.method === 'post') {
                        util.post({
                            url: vm.url,
                            data: {
                                initParamList: util.transInitParam(vm),
                                orderList: vm.localOrderList,
                                q: query,
                                limit: vm.limit
                            },
                            success: function(res) {
                                var results = util.transOptions({
                                    type: 'auto',
                                    initOptions: util.data(res).data || util.data(res),
                                    extraOptions: vm.extras,
                                    excludeOptions: vm.excludes,
                                    preset: vm.preset,
                                    code: vm.innerCode,
                                    desc: vm.innerDesc,
                                    label: vm.label,
                                    trans: vm.trans,
                                    show: vm.show
                                });
                                if (results.options) {
                                    vm.innerOptions = results.options;
                                }
                                if (results.shows) {
                                    vm.localShows = results.shows;
                                }
                                if (results.map) {
                                    vm.localMap = results.map;
                                }
                                process(vm.localShows);
                            }
                        });
                    } else if (vm.method === 'get') {
                        util.get({
                            url: vm.url,
                            data: util.mix(util.transParam(util.transInitParam(vm)), {
                                q: query,
                                limit: vm.limit
                            }),
                            success: function(res) {
                                var results = util.transOptions({
                                    type: 'auto',
                                    initOptions: util.data(res).data || util.data(res),
                                    extraOptions: vm.extras,
                                    excludeOptions: vm.excludes,
                                    preset: vm.preset,
                                    code: vm.innerCode,
                                    desc: vm.innerDesc,
                                    label: vm.label,
                                    trans: vm.trans,
                                    show: vm.show
                                });
                                if (results.options) {
                                    vm.innerOptions = results.options;
                                }
                                if (results.shows) {
                                    vm.localShows = results.shows;
                                }
                                if (results.map) {
                                    vm.localMap = results.map;
                                }
                                process(vm.localShows);
                            }
                        });
                    }
                }
            } else {
                process(vm.localShows);
            }
        },
        /*
         config: {
         show: function() {},
         preset: '',
         data: ''
         }
         */
        transAutoShow: function(config) {
            if (config.show && this.type(config.show) === 'function') {
                return config.show.call(null, config.data);
            } else if (config.preset === 'simple') {
                return config.data;
            } else {
                /*var presets = Const.init.preset[config.preset || 'default'];
                 if (!presets) {
                 return null;
                 }*/
                if (config.desc) {
                    return this.toString(config.data[config.desc]);
                } else {
                    return this.toString(config.data[config.code]);
                }
            }
        },

        transInitParam: function(vm) {
            if (vm.initParamList) {
                for (var i=0; i<vm.initParamList.length; i++) {
                    var initParam = vm.initParamList[i];
                    if (initParam.from) {
                        if (initParam.duplex) {
                            initParam.value = vm[initParam.duplex][initParam.from];
                        } else {
                            initParam.value = vm.innerEntity[initParam.from];
                        }
                        if (initParam.operate && initParam.operate === 'like') {
                            initParam.value = '%' + initParam.value + '%';
                        }
                        vm.initParamList[i] = initParam;
                    }
                }
                return vm.initParamList;
            }
        },
        // select,radio,checkbox,auto公用
        initSelectParam: function(vm) {
            if (!this.isEmpty(vm.multiple)) {
                vm.innerAttr.multiple = vm.multiple;
            }

            /*if (this.isEmpty(vm.innerEntity[vm.name])) {
             vm.innerEntity[vm.name] = this.toString(vm.defaultValue) || '';
             } else {
             vm.innerEntity[vm.name] = this.toString(vm.innerEntity[vm.name]) || '';
             }*/
        },
        initSelectData: function(vm, type, trigger) {
            var util = this;
            if (type !== 'auto' && vm.url && util.isEmpty(vm.innerChoose)) {
                util.transInitParam(vm);
                if (vm.entityName) {
                    var columnNames = vm.innerCode;
                    if (util.isEmpty(vm.trans)) {
                        if (vm.innerDesc) {
                            columnNames += ',' + vm.innerDesc;
                        }
                        if (vm.label) {
                            columnNames += ',' + vm.label;
                        }
                        if (vm.extraColumns) {
                            columnNames += ',' + vm.extraColumns;
                        }
                    }
                    if (vm.method === 'post') {
                        util.post({
                            url: vm.url,
                            data: {
                                entityName: vm.entityName,
                                columns: columnNames,
                                initParamList: vm.initParamList,
                                orderList: vm.localOrderList
                            },
                            success: function(data) {
                                util.initSelectOptions(vm, util.data(data), type, trigger);
                            }
                        });
                    } else if (vm.method === 'get') {
                        var data = {
                            entityName: vm.entityName,
                            columns: columnNames
                        };
                        if (!util.isEmpty(vm.initParamList)) {
                            data = util.mix(data, util.transParam(vm.initParamList));
                        }
                        util.get({
                            url: vm.url,
                            data: data,
                            success: function(data) {
                                util.initSelectOptions(vm, util.data(data), type, trigger);
                            }
                        });
                    }
                } else if (vm.localCustomLoad) {
                    if (vm.method === 'post') {
                        util.post({
                            url: vm.url,
                            data: {
                                initParamList: vm.initParamList,
                                orderList: vm.localOrderList
                            },
                            success: function(data) {
                                util.initSelectOptions(vm, util.data(data), type, trigger);
                            }
                        });
                    } else if (vm.method === 'get') {
                        util.get({
                            url: vm.url,
                            data: util.transParam(vm.initParamList),
                            success: function(data) {
                                util.initSelectOptions(vm, util.data(data), type, trigger);
                            }
                        });
                    }
                }
            } else if (type === 'auto' && vm.initUrl && util.isEmpty(vm.innerChoose) && !util.isEmpty(vm.innerEntity[vm.name])) {
                util.transInitParam(vm);
                var initParamList;
                if (vm.initParamList) {
                    initParamList = util.clone(vm.initParamList);
                } else {
                    initParamList = [];
                }
                initParamList.push({
                    name: vm.innerCode,
                    value: vm.innerEntity[vm.name],
                    operate: '='
                });
                if (vm.method === 'post') {
                    util.post({
                        url: vm.initUrl,
                        data: {
                            entityName: vm.entityName,
                            columns: (vm.innerDesc ? (vm.innerCode + "," + vm.innerDesc) : vm.innerCode) + (vm.extraColumns ? ',' + vm.extraColumns : ''),
                            distinct: vm.distinct,
                            initParamList: initParamList
                        },
                        success: function(data) {
                            if (util.data(data)) {
                                $('input', vm.$el).val(util.transAutoShow({
                                    show: vm.show,
                                    preset: vm.preset,
                                    code: vm.innerCode,
                                    desc: vm.innerDesc,
                                    data: util.data(data)
                                }));
                            }
                            if (util.type(vm.onItemInit) === 'function') {
                                vm.onItemInit.call(null, util.data(data));
                            }
                        }
                    });
                } else if (vm.method === 'get') {
                    util.get({
                        url: vm.initUrl,
                        data: util.transParam(initParamList),
                        success: function(data) {
                            if (util.data(data)) {
                                $('input', vm.$el).val(util.transAutoShow({
                                    show: vm.show,
                                    preset: vm.preset,
                                    code: vm.innerCode,
                                    desc: vm.innerDesc,
                                    data: util.data(data)
                                }));
                            }
                            if (util.type(vm.onItemInit) === 'function') {
                                vm.onItemInit.call(null, util.data(data));
                            }
                        }
                    });
                }
            } else {
                if (util.type(vm.innerChoose) === 'object' && !util.isEmpty(vm.innerEntity[vm.load])) {
                    util.initSelectOptions(vm, vm.innerChoose ? util.clone(vm.innerChoose[vm.innerEntity[vm.load]]) : vm.innerChoose, type, trigger);
                }else if (util.type(vm.innerChoose) === 'function') {
                    util.initSelectOptions(vm, vm.innerChoose.call(null), type, trigger);
                } else {
                    util.initSelectOptions(vm, vm.innerChoose ? util.clone(vm.innerChoose) : vm.innerChoose, type, trigger);
                }
                // TODO: 不加延迟会出js错误，不好定位，暂时处理一下
                /*setTimeout(function() {

                 }, 300);*/
            }
        },
        transParam: function(paramList) {
            var param = {};
            if (this.type(paramList) === 'array' && paramList.length > 0) {
                for (var i=0; i<paramList.length; i++) {
                    param[paramList[i].name] = paramList[i].value;
                }
            }
            return param;
        },
        initSelectOptions: function(vm, initOptions, type, trigger) {
            if (trigger && vm.innerEntity[vm.name]) {
                vm.innerEntity[vm.name] = null;
                // TODO:此处可能有问题
                /*                    for (var i=0; i<options.length; i++) {
                 if (options[i][vm.innerCode] === vm.innerEntity[vm.name]) {
                 return options;
                 }
                 }*/
            }

            var results = this.transOptions({
                type: type,
                initOptions: initOptions,
                extraOptions: vm.extras,
                excludeOptions: vm.excludes,
                preset: vm.preset,
                code: vm.innerCode,
                desc: vm.innerDesc,
                label: vm.label,
                trans: vm.trans,
                show: vm.show
            });
            if (results.options) {
                vm.innerOptions = results.options;
                if (type === 'auto') {
                    for (var i=0; i<vm.innerOptions.length; i++) {
                        if (vm.innerOptions[i][vm.innerCode] === vm.innerEntity[vm.name] || vm.innerOptions[i][vm.innerDesc] === vm.innerEntity[vm.name]) {
                            $('input', vm.$el).val(this.transAutoShow({
                                show: vm.show,
                                preset: vm.preset,
                                code: vm.innerCode,
                                desc: vm.innerDesc,
                                data: vm.innerOptions[i]
                            }));
                            break;
                        }
                    }
                } else if (type === 'select') {
                    if (!vm.innerEntity[vm.name] && !vm.initOption && vm.innerOptions.length > 0) {
                        vm.innerEntity[vm.name] = !this.isEmpty(vm.innerOptions[0][vm.innerDesc]) ? vm.innerOptions[0][vm.innerDesc] : (!this.isEmpty(vm.innerOptions[0][vm.innerCode]) ? vm.innerOptions[0][vm.innerCode] : vm.innerOptions[0]);
                    }
                }
            }
            if (vm.innerGroups) {
                vm.innerGroups = results.groups;
            }
            if (vm.localShows) {
                vm.localShows = results.shows;
            }
            if (vm.localMap) {
                vm.localMap = results.map;
            }
        },
        // 内部调用
        initConfig: function() {
            var util = this;
            this.get({
                url: Const.url.cache.config,
                async: false,
                success: function(data) {
                    if (data) {
                        Const.init = util.mix(Const.init, util.data(data));
                    }
                }
            });
        },
        // 初始化字典
        initDicts: function() {
//            Const.dicts = {};
            var util = this;
            this.get({
                url: Const.url.cache.dicts,
                success: function(data) {
                    if (data) {
                        Const.dicts = util.mix(Const.dicts, util.data(data));
//                        $.extend(Const.dicts, util.data(data));
                    }
                }
            });
        },

        toUtf8: function(str) {
            var result = [];
            for (var i = 0; i < str.length; i++) {
                var code = str.charCodeAt(i);
                if (code > 0x0000 && code <= 0x007F) {
                    // 单字节，这里并不考虑0x0000，因为它是空字节
                    // U+00000000 – U+0000007F  0xxxxxxx
                    result.push(this.toByte(code));
                } else if (code >= 0x0080 && code <= 0x07FF) {
                    // 双字节
                    // U+00000080 – U+000007FF  110xxxxx 10xxxxxx
                    // 110xxxxx
                    result.push(this.toByte(0xC0 | ((code >> 6) & 0x1F)));
                    // 10xxxxxx
                    result.push(this.toByte(0x80 | (code & 0x3F)));
                } else if (code >= 0x0800 && code <= 0xFFFF) {
                    // 三字节
                    // U+00000800 – U+0000FFFF  1110xxxx 10xxxxxx 10xxxxxx
                    // 1110xxxx
                    result.push(this.toByte(0xE0 | ((code >> 12) & 0x0F)));
                    // 10xxxxxx
                    result.push(this.toByte(0x80 | ((code >> 6) & 0x3F)));
                    // 10xxxxxx
                    result.push(this.toByte(0x80 | (code & 0x3F)));
                } else if (code >= 0x00010000 && code <= 0x001FFFFF) {
                    // 四字节
                    // U+00010000 – U+001FFFFF  11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
                } else if (code >= 0x00200000 && code <= 0x03FFFFFF) {
                    // 五字节
                    // U+00200000 – U+03FFFFFF  111110xx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx
                } else /** if (code >= 0x04000000 && code <= 0x7FFFFFFF)*/ {
                    // 六字节
                    // U+04000000 – U+7FFFFFFF  1111110x 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx
                }
            }
            return result;
        },
        toUtf16: function(bytes) {
            var res = [];
            var i = 0;
            for (var i=0; i<bytes.length; i++) {
                if (bytes[i] < 0) {
                    bytes[i] += 256;
                }
                var code = bytes[i];
                // 对第一个字节进行判断
                if (((code >> 7) & 0xFF) == 0x0) {
                    // 单字节
                    // 0xxxxxxx
                    res.push(String.fromCharCode(bytes[i]));
                } else if (((code >> 5) & 0xFF) == 0x6) {
                    // 双字节
                    // 110xxxxx 10xxxxxx
                    var code2 = bytes[++i];
                    var byte1 = (code & 0x1F) << 6;
                    var byte2 = code2 & 0x3F;
                    var utf16 = byte1 | byte2;
                    res.push(String.fromCharCode(utf16));
                } else if (((code >> 4) & 0xFF) == 0xE) {
                    // 三字节
                    // 1110xxxx 10xxxxxx 10xxxxxx
                    var code2 = bytes[++i];
                    var code3 = bytes[++i];
                    var byte1 = (code << 4) | ((code2 >> 2) & 0x0F);
                    var byte2 = ((code2 & 0x03) << 6) | (code3 & 0x3F);
                    utf16 = ((byte1 & 0x00FF) << 8) | byte2
                    res.push(String.fromCharCode(utf16));
                } else if (((code >> 3) & 0xFF) == 0x1E) {
                    // 四字节
                    // 11110xxx 10xxxxxx 10xxxxxx 10xxxxxx
                } else if (((code >> 2) & 0xFF) == 0x3E) {
                    // 五字节
                    // 111110xx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx
                } else /** if (((code >> 1) & 0xFF) == 0x7E)*/ {
                    // 六字节
                    // 1111110x 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx 10xxxxxx
                }
            }

            return res.join('');
        },

        base64Chars: 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
        base64Encode: function(bytes) {
            // var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
            // var str = String(bytes);
            var block, charCode, map = this.base64Chars, output = '';
            var position;
            for (
                var idx = 0;
                // initialize result and counter
                // if the next str index does not exist:
                //   change the mapping table to "="
                //   check if d has no fractional digits
                bytes[this.toNumber(idx | 0)] || (map = '=', idx % 1);
                // "8 - idx % 1 * 8" generates the sequence 2, 4, 6, 8
                output += map.charAt(position)
            ) {
                charCode = bytes[this.toNumber(idx += 3/4)];
                if (charCode < 0) {
                    charCode += 256;
                }
                if (charCode > 0xFF) {
                    throw new InvalidCharacterError("'btoa' failed: The string to be encoded contains characters outside of the Latin1 range.");
                }
                block = block << 8 | charCode;

                position = 63 & (block >> (8 - (idx % 1 * 8)));
            }
            return output;
        },
        base64Decode: function(str) {
            if (!str) {
                return '';
            }

            str = String(str).replace(/=+$/, '');
            if (str.length % 4 == 1) {
                throw new InvalidCharacterError("'atob' failed: The string to be decoded is not correctly encoded.");
            }
            var res = [];
            // var chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
            for (
                // initialize result and counters
                var bc = 0, bs, buffer, idx = 0;
                // get next character
                buffer = str.charAt(idx++);
                // character found in table? initialize bit storage and add its ascii value;
                ~buffer && (bs = bc % 4 ? bs * 64 + buffer : buffer,
                    // and if not first of each 4 characters,
                    // convert the first 8 bits to one ascii character
                bc++ % 4) ? res.push(255 & bs >> (-2 * bc & 6)) : 0
            ) {
                // try to find character in table (0-63, not found => -1)
                buffer = this.base64Chars.indexOf(buffer);
            }
            return res;
        },
        simpleEncrypt: function(str) {
            if (this.type(str) === 'undefined' || str === null) {
                return null;
            }
            var bytes = this.toUtf8(str);

            var half;
            for (half=0; half<bytes.length; half++) {
                bytes[half] = this.toByte(~bytes[half]);
            }

            half = parseInt(bytes.length / 2);

            for (var i=0; i<half; i++) {
                if (i % 2 === 1) {
                    var b = bytes[i];
                    bytes[i] = bytes[i + half];
                    bytes[i + half] = b;
                }
            }
            return this.base64Encode(bytes);
        },
        simpleDecrypt: function(str) {
            if (this.type(str) === 'undefined' || str === null) {
                return null;
            }
            str = this.replaceAll(str, '_', '/');
            var bytes = this.base64Decode(str);
            var half = parseInt(bytes.length / 2);

            for (var i=0; i<half; i++) {
                if (i % 2 === 1) {
                    var b = bytes[i];
                    bytes[i] = bytes[i + half];
                    bytes[i + half] = b;
                }
            }

            for (var i=0; i<bytes.length; i++) {
                bytes[i] = ~bytes[i];
            }

            return this.toUtf16(bytes);
        },
        // 图片压缩
        compress: function (file, options) {
            var reader = new FileReader();
            var util = this;
            reader.onload = function (evt) {
                // 启用压缩的分支
                var img = new Image();
                img.onload = function () {
                    var ratio = util.detectVerticalSquash(img);
                    var orientation = util.getOrientation(util.dataURItoBuffer(img.src));
                    var canvas = document.createElement('canvas');
                    var ctx = canvas.getContext('2d');

                    var maxW = options.compress.width;
                    var maxH = options.compress.height;
                    var w = img.width;
                    var h = img.height;
                    var dataURL = void 0;

                    if (file.size > options.maxSize) {
                        // 需要压缩
                        if (w < h && h > maxH) {
                            w = parseInt(maxH * img.width / img.height);
                            h = maxH;
                        } else if (w >= h && w > maxW) {
                            h = parseInt(maxW * img.height / img.width);
                            w = maxW;
                        }
                    } else {
                        // 不需要压缩，仅校正方向
                    }

                    canvas.width = w;
                    canvas.height = h;

                    if (orientation > 0) {
                        util.orientationHelper(canvas, ctx, orientation);
                    } else if (file.size <= options.maxSize) {
                        // 不压缩，不校正方向
                        options.success(file);
                        return;
                    }
                    ctx.drawImage(img, 0, 0, w, h / ratio);

                    if (/image\/jpeg/.test(file.type) || /image\/jpg/.test(file.type)) {
                        if (file.size > options.maxSize) {
                            dataURL = canvas.toDataURL('image/jpeg', options.compress.quality);
                        } else {
                            dataURL = canvas.toDataURL('image/jpeg');
                        }
                    } else {
                        dataURL = canvas.toDataURL(file.type);
                    }

                    if (/;base64,null/.test(dataURL) || /;base64,$/.test(dataURL) || dataURL === 'data:,') {
                        // 压缩出错，以文件方式上传的，采用原文件上传
                        console.warn('Compress fail, dataURL is ' + dataURL + '. Next will use origin file to upload.');
                        options.success(file);
                    } else {
                        var blob = util.dataURItoBlob(dataURL);
                        blob.id = file.id;
                        blob.name = file.name;
                        blob.lastModified = file.lastModified;
                        blob.lastModifiedDate = file.lastModifiedDate;
                        options.success(blob);
                    }
                };
                img.src = evt.target.result;
            };
            reader.readAsDataURL(file);
        },
        /**
         * 检查图片是否有被压扁，如果有，返回比率
         * ref to http://stackoverflow.com/questions/11929099/html5-canvas-drawimage-ratio-bug-ios
         */
        detectVerticalSquash: function (img) {
            // 拍照在IOS7或以下的机型会出现照片被压扁的bug
            var data;
            var ih = img.naturalHeight;
            var canvas = document.createElement('canvas');
            canvas.width = 1;
            canvas.height = ih;
            var ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            try {
                data = ctx.getImageData(0, 0, 1, ih).data;
            } catch (err) {
                console.log('Cannot check verticalSquash: CORS?');
                return 1;
            }
            var sy = 0;
            var ey = ih;
            var py = ih;
            while (py > sy) {
                var alpha = data[(py - 1) * 4 + 3];
                if (alpha === 0) {
                    ey = py;
                } else {
                    sy = py;
                }
                py = ey + sy >> 1; // py = parseInt((ey + sy) / 2)
            }
            var ratio = py / ih;
            return ratio === 0 ? 1 : ratio;
        },
        /**
         * 获取图片的orientation
         * ref to http://stackoverflow.com/questions/7584794/accessing-jpeg-exif-rotation-data-in-javascript-on-the-client-side
         */
        getOrientation: function (buffer) {
            var view = new DataView(buffer);
            if (view.getUint16(0, false) != 0xFFD8) return -2;
            var length = view.byteLength,
                offset = 2;
            while (offset < length) {
                var marker = view.getUint16(offset, false);
                offset += 2;
                if (marker == 0xFFE1) {
                    if (view.getUint32(offset += 2, false) != 0x45786966) return -1;
                    var little = view.getUint16(offset += 6, false) == 0x4949;
                    offset += view.getUint32(offset + 4, little);
                    var tags = view.getUint16(offset, little);
                    offset += 2;
                    for (var i = 0; i < tags; i++) {
                        if (view.getUint16(offset + i * 12, little) == 0x0112) return view.getUint16(offset + i * 12 + 8, little);
                    }
                } else if ((marker & 0xFF00) != 0xFF00) break;else offset += view.getUint16(offset, false);
            }
            return -1;
        },
        /**
         * 修正拍照时图片的方向
         * ref to http://stackoverflow.com/questions/19463126/how-to-draw-photo-with-correct-orientation-in-canvas-after-capture-photo-by-usin
         */
        orientationHelper: function (canvas, ctx, orientation) {
            var w = canvas.width,
                h = canvas.height;
            if (orientation > 4) {
                canvas.width = h;
                canvas.height = w;
            }
            switch (orientation) {
                case 2:
                    // horizontal flip
                    ctx.translate(w, 0);
                    ctx.scale(-1, 1);
                    break;
                case 3:
                    // 180° rotate left
                    ctx.translate(w, h);
                    ctx.rotate(Math.PI);
                    break;
                case 4:
                    // vertical flip
                    ctx.translate(0, h);
                    ctx.scale(1, -1);
                    break;
                case 5:
                    // vertical flip + 90 rotate right
                    ctx.rotate(0.5 * Math.PI);
                    ctx.scale(1, -1);
                    break;
                case 6:
                    // 90° rotate right
                    ctx.rotate(0.5 * Math.PI);
                    ctx.translate(0, -h);
                    break;
                case 7:
                    // horizontal flip + 90 rotate right
                    ctx.rotate(0.5 * Math.PI);
                    ctx.translate(w, -h);
                    ctx.scale(-1, 1);
                    break;
                case 8:
                    // 90° rotate left
                    ctx.rotate(-0.5 * Math.PI);
                    ctx.translate(-w, 0);
                    break;
            }
        },
        /**
         * dataURI to blob, ref to https://gist.github.com/fupslot/5015897
         * @param dataURI
         */
        dataURItoBuffer: function (dataURI) {
            var byteString = atob(dataURI.split(',')[1]);
            var buffer = new ArrayBuffer(byteString.length);
            var view = new Uint8Array(buffer);
            for (var i = 0; i < byteString.length; i++) {
                view[i] = byteString.charCodeAt(i);
            }
            return buffer;
        },
        dataURItoBlob: function (dataURI) {
            var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
            var buffer = this.dataURItoBuffer(dataURI);
            return new Blob([buffer], { type: mimeString });
        },
        isWebview: function (key) {
            if (key) {
                return this.gup(key);
            }
        },
        // 微信配置
        weixinConfig: function (callback) {
            if (Const.url.weixin.signature) {
                var util = this;
                var url = window.location.href;
                if (url.indexOf('#') > 0) {
                    url = url.substring(0, url.indexOf('#'));
                }
                require(['wx'], function (wx) {
                    util.get({
                        url: Const.url.weixin.signature,
                        data: {
                            url: url
                        },
                        success: function (res) {
                            var data = util.data(res);
                            if (data) {
                                require(['wx'], function (wx) {
                                    wx.config({
                                        // debug: true,
                                        appId: data.appid,
                                        timestamp: data.timestamp,
                                        nonceStr: data.noncestr,
                                        signature: data.signature,
                                        jsApiList: ['chooseImage', 'uploadImage', 'getLocalImgData']
                                    });
                                    /*wx.error(function(res) {
                                        console.log(res);
                                        return;
                                    });*/
                                    wx.ready(function() {
                                        if (callback) {
                                            callback.call(null, data);
                                        }
                                    });
                                });
                            }
                        }
                    });
                });
            }
        },
        weixinCall: function (method, param) {
            if (method) {
                this.weixinConfig(function () {
                    require(['wx'], function (wx) {
                        wx[method](param);
                    });
                });
            }
        },
        weixinUpload: function (localId, callback) {
            var util = this;
            this.weixinConfig(function () {
                require(['wx'], function (wx) {
                    wx.uploadImage({
                        localId: localId,
                        success: function (res) {
                            // res2.serverId
                            if (util.type(callback) === 'function') {
                                callback.call(null, res.serverId);
                            }
                        },
                        error: function (error) {
                        }
                    });
                });
            });
        },

        // 仅限内部调用
        initPage: function (type) {
            // console.log(Const.global.f)
            if (type && Const.global.f) {
                // Const.global.f = null;
                if (type === 'swiper') {
                    Const.global.f.initPageSwiper('.page');
                }
                return;
            }
            Const.global.f = new framework({
                router: false,
                modalTitle: '',
                modalButtonOk: '确定',
                modalButtonCancel: '取消',
                modalTemplate: this.template('framework-modal-template')
                /*pushState: true,
                onAjaxStart: function (xhr) {
                    Const.global.f.showIndicator();
                },
                onAjaxComplete: function (xhr) {
                    Const.global.f.hideIndicator();
                }*/
            });
        },
        init: function(from) {
            if (!Const.inited) {
                Const.inited = true;
                Const.from = from;
                Const.init = this.mix(Const.init, __Const.init, true);
                Const.url = this.mix(Const.url, __Const.url, true);
                Const.rest = this.mix(Const.rest, __Const.rest, true);
                Const.params = this.mix(Const.params, __Const.params, true);
                Const.dicts = this.mix(Const.dicts, __Const.dicts);
                Const.rule = this.mix(Const.rule, __Const.rule);
                Const.route = this.mix(Const.route, __Const.route, true);
                Const.messages = this.mix(Const.messages, __Const.messages);
                Const.lengths = this.mix(Const.lengths, __Const.lengths);
                Const.cache = this.mix(Const.cache, __Const.cache);
                // Const.entities = this.mix(Const.entities, __Const.entities);
                var util = this;
                $.ajaxSetup ({
                    cache: false
                });
                $(document).ajaxError(function(event, xhr, options, exc) {
                    var message = xhr.responseJSON && xhr.responseJSON.appId ? xhr.responseJSON.message : '';
                    switch (xhr.status) {
                        case 500:
                            util.alert({
                                message: message || '#error500',
                                level: 'error'
                            });
                            break;
                        case 401:
                            if (Const.init.login) {
                                if (!from || from !== 'login') {
                                    util.login();
                                }
                            } else {
                                if (!Const.alerted && Const.init.type !== 'alert') {
                                    Const.alerted = true;
                                    util.alert({
                                        message: '#error401',
                                        level: 'error'
                                    });
                                }
                                // alert('登录超时，请重新登录');
                            }
                            break;
                        case 403:
                            if (Const.init.login) {
                                if (!from || from !== 'login') {
                                    util.login();
                                    // util.alert(message || '登陆超时，请重新登录', undefined, 'alert', 'error');
                                }
                            } else {
                                if (!Const.alerted) {
                                    Const.alerted = true;
                                    util.alert({
                                        message: '#error403',
                                        level: 'error'
                                    });
                                }
                                // alert('登录超时，请重新登录');
                            }
                            break;
                        case 404:
                            util.alert({
                                message: message || '#error404',
                                level: 'error'
                            });
                            break;
                        case 405:
                            util.alert({
                                message: message || '#error405',
                                level: 'error'
                            });
                            break;
                        case 408:
                            util.alert({
                                message: message || '#error408',
                                level: 'error'
                            });
                            break;
                        case 200:
                            Const.alerted = false;
                            break;
                        default:
                            util.alert({
                                message: message || '#unknownError',
                                level: 'error'
                            });
                    }

                    util.report({
                        from: 'ajaxError',
                        type: options && options.type,
                        url: options && options.url,
                        status: xhr.status,
                        error: exc,
                        response: xhr.responseJSON || xhr.responseText
                    });
                });

                if (Const.init.config) {
                    util.initConfig();
                }
            }
        }
    }
});
