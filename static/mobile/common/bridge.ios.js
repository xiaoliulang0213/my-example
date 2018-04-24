define('bridge', ['vue', 'jquery', 'util', 'Const'], function(vue, $, util, Const) {
    function setupWebViewJavascriptBridge(callback) {
        if (window.WebViewJavascriptBridge) { return callback(WebViewJavascriptBridge); }
        if (window.WVJBCallbacks) { return window.WVJBCallbacks.push(callback); }
        window.WVJBCallbacks = [callback];
        var WVJBIframe = document.createElement('iframe');
        WVJBIframe.style.display = 'none';
        WVJBIframe.src = 'https://__bridge_loaded__';
        document.documentElement.appendChild(WVJBIframe);
        setTimeout(function() { document.documentElement.removeChild(WVJBIframe) }, 0)
    }
    return {
        callApp: function (method, params, callback) {
            setupWebViewJavascriptBridge(function (_bridge) {
                _bridge.callHandler(method, params, callback);
            });
        },
       registerJs: function (method, callback) {
            setupWebViewJavascriptBridge(function (_bridge) {
               _bridge.registerHandler(method, callback);
                /*
                //获取userId
                _bridge.registerHandler('getUserId', function(data, responseCallback) {
                    alert(11);
                    alert(data);
                })
                //获取CustNo
                _bridge.registerHandler('getCustNo', function(data, responseCallback) {
                    alert(data.userId);
                })
                */
            });
        }
    }
});
