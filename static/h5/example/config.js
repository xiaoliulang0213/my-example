//////////////// 上线修改开始 ///////////////////////
var __env = 'dev';
// 支持dev,run
var __param = 'dev';
var __baseResourcePath = __env === 'run' ? '/run/mobile' : '/mobile';
var __baseAppPath = __env === 'run' ? 'run/' : '';
//////////////// 结束 //////////////////////////////
// 公共js/css版本，进展__env='run'时生效，目的是为了处理缓存
var __version = '1.0.0';
var __baseResourcePath = __env === 'run' ? '/run/mobile' : '/mobile';

var __Const = {
    init: {
        appName:'example',
        auth: 'h5'
    },
    rest: {
        baseUrl: window.location.protocol + "//" + window.location.host,
        headers: {}
    },
    url: {
    },
    route: {
        baseUrl: window.location.protocol + "//" + window.location.host,
        baseLocation: '/h5/example',
        versionLocation: '',
        htmlLocation: '/html',
        scriptLocation: (__env === 'run' ? '/run' : '') + '/js'
    },
    params: {
    },
    dicts: {
    },
    messages: {
        alertOk: '我知道了',
        unknownError: '网络通讯异常',
        error500: '网络通讯异常',
        error401: '登录超时，请重新登录',
        error403: '登录超时',
        error404: '网络通讯异常',
        error405: '网络通讯异常',
        error408: '请求超时'
    },
    lengths: {
    },
    cache: {
        type: 'local'
    }
}

window.loader = {
    script: function (url, async, callback) {
        if (url) {
            var innerAsync;
            if (typeof(async) === 'function') {
                callback = async;
                innerAsync = false;
            } else {
                innerAsync = async;
            }
            if (typeof(url) === 'string') {
                var script = document.createElement("script");
                script.type = "text/javascript";
                if (typeof(callback) !== 'undefined') {
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
                }
                var src;
                if (url.indexOf('/') === 0) {
                    src = window.__baseResourcePath + url;
                } else {
                    src = window.__baseAppPath + url;
                }
                if (!window.__env || window.__env === 'dev') {
                    src += '?_=' + new Date().getTime();
                }
                script.src = src;
                document.body.appendChild(script);
            } else {
                if (innerAsync) {
                    // 异步加载
                    var count = 0;
                    for (var i=0; i<url.length; i++) {
                        this.script(url[i], innerAsync, function () {
                            count++;
                            if (typeof(callback) === 'function' && count >= url.length) {
                                callback();
                            }
                        });
                    }
                } else {
                    // 顺序加载
                    var loader = this;
                    loader.script(url[0], innerAsync, function () {
                        url.splice(0, 1);
                        if (url.length > 0) {
                            loader.script(url, innerAsync, callback);
                        } else if (typeof(callback) === 'function') {
                            callback();
                        }
                    });
                }
            }
        }
    },
    style: function (url, async, callback) {
        if (url) {
            var innerAsync;
            if (typeof(async) === 'function') {
                callback = async;
                innerAsync = false;
            } else {
                innerAsync = async;
            }
            if (typeof(url) === 'string') {
                var link = document.createElement('link');
                link.type = 'text/css';
                link.rel = 'stylesheet';
                if (typeof(callback) === 'function') {
                    if (link.readyState) {
                        link.onreadystatechange = function () {
                            if (link.readyState == "loaded" || link.readyState == "complete") {
                                link.onreadystatechange = null;
                                callback();
                            }
                        };
                    } else {
                        link.onload = function () {
                            callback();
                        };
                    }
                }
                var src;
                if (url.indexOf('/') === 0) {
                    src = window.__baseResourcePath + url;
                } else {
                    src = window.__baseAppPath + url;
                }
                if (!window.__env || window.__env === 'dev') {
                    src += '?_=' + new Date().getTime();
                }
                link.href = src;
                document.getElementsByTagName("head")[0].appendChild(link);
            } else {
                if (innerAsync) {
                    // 异步加载
                    var count = 0;
                    for (var i=0; i<url.length; i++) {
                        this.style(url[i], innerAsync, function () {
                            count++;
                            if (typeof(callback) === 'function' && count >= url.length) {
                                callback();
                            }
                        });
                    }
                } else {
                    var loader = this;
                    loader.style(url[0], innerAsync, function () {
                        url.splice(0, 1);
                        if (url.length > 0) {
                            loader.style(url, innerAsync, callback);
                        } else if (typeof(callback) === 'function') {
                            callback();
                        }
                    });
                }
            }
        }
    }
};
