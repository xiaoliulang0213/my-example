/*
定义requirejs的配置，以及一些全局变量
*/
// 全局变量
var __global = {};
if (navigator.userAgent.indexOf('Android') > -1 || navigator.userAgent.indexOf('Adr') > -1) {
    __global.os = 'android';
} else if (!!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/)) {
    __global.os = 'ios';
} else {
    __global.os = 'android';
}

require.config({
    baseUrl: __baseResourcePath || '/mobile',
    map: {
        '*': {
            'css': 'js/require-css/css.min',
            'text': 'js/require-text/text.min',
            'async': 'js/require-async/async.min'
        }
    },
    paths: {
        vue: 'js/vue/vue.min',
        jquery: 'js/jquery/jquery-2.min',
        json: 'js/json/json2.min',
        framework: 'js/framework/js/framework7.min',
        moment: 'js/moment/moment-with-locales.min',
        validationEngine: 'js/validation/jquery.validationEngine',
        validation: 'js/validation/languages/jquery.validationEngine-zh_CN',
        bmap: 'https://api.map.baidu.com/api?v=2.0&ak=' + (__Const.params && __Const.params.mapKey),
        amap: 'https://webapi.amap.com/maps?v=1.4.0&key=' + (__Const.params && __Const.params.amapKey),
        wx: 'https://res.wx.qq.com/open/js/jweixin-1.2.0',
        alipay: 'https://gw.alipayobjects.com/as/g/h5-lib/alipayjsapi/3.1.0/alipayjsapi.inc.min',

        util: 'common/util.js?v=1.0.1',
        Const: 'common/const',
        bridge: 'common/bridge.' + __global.os,
        iserviceBridge: 'common/bridge.iservice',

        bvBasic: 'tags/bv-basic.js?v=1.0.1',
        bvDate: 'tags/bv-date.js?v=1.0.1',
        bvPicker: 'tags/bv-picker.js?v=1.0.1',
        bvUpload: 'tags/bv-upload.js?v=1.0.1',
        bvList: 'tags/bv-list',
        bvForm: 'tags/bv-form',
        bvLayout: 'tags/bv-layout'
    },
    shim: {
        vue: {
            exports: 'vue'
        },
        jquery: {
            exports: 'jquery'
        },
        json: {
            exports: 'json'
        },
        framework: {
            exports: 'framework'
        },
        moment: {
            exports: 'moment'
        },
        validationEngine: {
            deps: ['jquery'],
            exports: 'validationEngine'
        },
        validation: {
            deps: ['jquery', 'validationEngine'],
            exports: 'validation'
        },
        bmap: {
            exports: 'bmap'
        },
        amap: {
            exports: 'amap'
        },
        wx: {
            exports: 'wx'
        },
        alipay: {
            exports: 'alipay'
        },
        util: {
            exports: 'util'
        },
        Const: {
            exports: 'Const'
        },
        bridge: {
            exports: 'bridge'
        },
        iserviceBridge: {
            exports: 'iserviceBridge'
        },
        bvBasic: {
            exports: 'bvBasic'
        },
        bvDate: {
            deps: ['moment'],
            exports: 'bvDate'
        },
        bvPicker: {
            exports: 'bvPicker'
        },
        bvUpload: {
            exports: 'bvUpload'
        },
        bvList: {
            exports: 'bvList'
        },
        bvForm: {
            deps: ['bvBasic', 'bvDate', 'bvPicker', 'validation'],
            exports: 'bvForm'
        },
        bvLayout: {
            exports: 'bvLayout'
        }
    }
});