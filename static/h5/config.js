/**
 __appCode定义应用编码，注意：portal为特殊编码不能占用，指内网门户
 本文件的__Const变量会覆盖public/common/const.js中相关配置
 __Const.init.debug：是否开启调试，设置为true后会在浏览器控制台输出部分调试信息，调用输出信息的方式为util.debug(title, content)
 __Const.init.login：session超时后是否弹出登录窗口，设置为true会弹出，否则仅提示错误信息
 */
// 支持dev,run
var __env = 'dev';

var __appPath = '';
if (location.pathname && location.pathname.substring(0, 1) === '/') {
    if (location.pathname.substring(location.pathname.length - 1) !== '/') {
        // => /oa/main.html
        __appPath = location.pathname.substring(1, location.pathname.lastIndexOf('/'));
    } else {
        // => /oa/
        __appPath = location.pathname.replace(new RegExp('/', "gm"), '');
    }
}
var __appCode = 'example';
var __baseResourcePath = __env === 'run' ? '/run/public' : '/public';
var __baseAppPath = __env === 'run' ? 'run/' : '';
var __Const = {
    init: {
        debug: true,
        login: true,
        appCode: __appCode,
        appPath: __appPath
    },
    url: {
        authority: {
            info: 'custom/json/user.json',
            menus: 'custom/json/menu.json'
        }
    },
    rest: {
        baseUrl: window.location.protocol + "//" + window.location.host
    },
    dicts: {
        holidayType: [
            {
                normal: '正常工作日'
            },
            {
                weekend: '周末'
            },
            {
                holiday: '法定节假日'
            },
            {
                swap: '调整工作日'
            }
        ],
        optionsJson: [
            {
                '1': '选项1'
            },
            {
                '2': '选项2'
            }
        ],
        cityType: [
            {
                province: '省'
            },
            {
                city: '市'
            },
            {
                area: '区'
            }
        ],
        yesOrNo: [
            {
                Y: '是'
            },
            {
                N: '否'
            }
        ]
    }
};

function __heredoc(fn) {
    return fn.toString().replace(/^[^\/]+\/\*!?\s?/, '').replace(/\*\/[^\/]+$/, '').trim().replace(/>\s*</g, '><');
}
// 增加doc描述
var __doc = {
    formTag: '为测试方便，页面用到的标签均在form中调试，跟手工调用参数基本类似（form列定义中config属性即标签属性定义）',

    /// $duplexData: '标签属性绑定对象，数组格式，调用方式如：{$duplexData: [@entity]}',
    /// $duplexLine: '第几行数据，跟$duplexData结合使用，默认为0',
    /// $duplexName: '标签绑定属性名，为entity的属性',
    entity: '实体类定义',
    id: '元素id属性',
    name: '实体类属性',
    load: '触发标签变动的属性名',
    clazz: '标签设置的class',
    attr: '属性定义，json类型，比如id、name等都可以通过该属性设置;同时包括数据校验规则定义，json类型，具体支持格式参考jquery.validationEngine.js定义',
    title: 'tooltip提示',
    validate: '数据校验规则定义，json类型，支持required、equals等属性',
    defaultValue: '默认值，仅在绑定变量值为空时有效，一般用于新增页面设置默认值',
    value: '初始值，不管绑定变量之前有没有值，都用该值覆盖',
    format: '数据格式化规则',
    show: '自定义格式化方法',
    preset: '预设属性，定义在const.js中(Const.init.preset)',
    code: '选项代码属性定义',
    desc: '选项显示属性定义',
    choose: __heredoc(function() {
        /*!
<pre>choose配置支持几种格式（需配合属性preset用）：
1、preset无需设置
ioFlag: [
    {
        code: 'I',
        desc: '收'
    },
    {
        code: 'O',
        desc: '支'
    }
]
2、preset='json'
ioFlag: [
    {
        'I': '收'
    },
    {
        'O': '支'
    }
]
3、preset='simple'，key、value相同
ioFlag: ['收', '支']
4、定义'#optionName'，格式同上，选项从Const.dicts中取值
</pre>
        */
    }),
    /*
    3、preset='json'，显示顺序可能有问题，JSON是无序的
ioFlag: {
    'I': '收',
    'O': '支'
}
    */
    entityName: '实体类名，注意小写字母开头，需跟url配合使用',
    initParam: '初始参数定义，json格式，格式为：{name1: value2, name2: value2}，为$initParamList的简化版，操作方式为=',
    initParamList: '初始参数定义，数组格式，格式为：[{name: \'列名\', value: \'列值\', operate: \'操作方式\'},...]',
    orderList: '排序定义，数组格式，格式为[{name: \'xxx\', sort: \'asc\'}, ...]',
    trans: '数组或json，代码转换字典项配置',
    extras: '数组，追加显示的数据配置，注意格式应和preset定义一致',
    excludes: '数组，不予显示的code值',
    show: '自定义显示方法',
    cols: '列宽定义，占满宽度为12，占1/2为6，占1/3为4，占1/4为3，以此类推'
    // load: '默认值为空，如果设置为绑定属性var，则会监听var的变化进行初始化'
};

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
