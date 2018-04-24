define('bridge', ['vue', 'jquery', 'util', 'Const'], function(vue, $, util, Const) {
    // var JSBRIDGE_PROTOCOL = 'bestvike://bk_bridge';
    return {
        _register: {},
        callback: {},
        getPort: function () {
            return Math.floor(Math.random() * (1 << 30));
        },
        getUri:function(method, params, port){
            params = this.getParam(params);
            var uri = Const.params.bridgeProtocol + ':' + port + '/' + method + (params ? '?' + params : '');
            return uri;
        },
        getParam:function(obj){
            if (obj && typeof obj === 'object') {
                //stringify()用于从一个对象解析出字符串
                return JSON.stringify(obj);
            } else {
                return obj || '';
            }
        },
        callApp: function (method, params, callback) {
            // synchMethod
            var port = this.getPort();
            this.callback[port] = callback;
            if (!params) {
                params = {};
            }
            params.method = method;
            var uri = this.getUri('synchMethod', params, port);
            //window.prompt(uri, “”)将uri传递到native层，以次对应onJsPrompt方法中的message、defaultValue参数，
            //prompt方法中第一个参数可以传送约定好的特定方法标识，prompt方法中第二个参数可以传入对应的参数序列
            var flag = window.prompt(uri, '');
//           alert(JSON.stringify('调用成功'+flag));
            //如果只是简单的操作，可以直接传个特殊标示也行，不过我没有处理，这样不好，有js注入的漏洞，别改
            //window.prompt('标志flag', '');
        },
        //用于native回传的port值和执行结果
        callAppResult: function (port, jsonObj){
            var callback = this.callback[port];
            callback && callback(jsonObj);
            delete this.callbacks[port];
        },
        //供java主动调用的方法
        callJs: function (method, param) {
            if (method && this._register[method]) {
                this._register[method](param);
            }
        },
        registerJs: function (method, callback) {
            if (method && this.callback) {
                this._register[method] = callback;
            }
        }
    }
});
