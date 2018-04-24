/*
定义requirejs的配置，以及一些全局变量
*/
// 全局变量
var __global = {
    isMobile: navigator.userAgent.match(/mobile/i),        // 判断是否为移动版浏览器
    formId: 0,
    vm: {}
};
require.config({
    /*urlArgs: function(moduleName, url) {
        return '?_=' + (_version[url] || _version[moduleName] || _version._);
    },*/
    baseUrl: __baseResourcePath || '/public',
    map: {
        '*': {
            'css': 'js/require-css/css.min',
            'text': 'js/require-text/text.min'
        }
    },
    paths: {
        vue: 'js/vue/vue.min',
        jquery: 'js/jquery/jquery-3.min',
        bootstrap: 'js/bootstrap/js/bootstrap.min',
//        form: 'js/form/jquery.form',
        ztree: 'js/ztree/jquery.ztree.core.min',
        ztreeCheck: 'js/ztree/jquery.ztree.excheck.min',
        moment: 'js/moment/moment-with-locales.min',
//        datepicker: 'js/bootstrap-datepicker/bootstrap-datepicker.min',
//        datepickerLang: 'js/bootstrap-datepicker/locales/bootstrap-datepicker.zh-CN.min',
        datetimepicker: 'js/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min',
        'switch': 'js/bootstrap-switch/js/bootstrap-switch.min',
        typeahead: 'js/bootstrap-typeahead/bootstrap3-typeahead.min',
//        datetimepickerLang: 'js/bootstrap-datetimepicker/locales/bootstrap-datetimepicker.zh-CN',
        validationEngine: 'js/validation/jquery.validationEngine.min',
        validation: 'js/validation/languages/jquery.validationEngine-zh_CN',
        wangEditor: 'js/wangEditor/wangEditor.min',
        plupload: 'js/plupload-2/plupload.full.min',
        pluploadLang: 'js/plupload-2/i18n/zh_CN',
        json: 'js/json/json2.min',
        md5: 'js/md5/md5.min',
        toastr: 'js/toastr/toastr.min',
        popover: 'js/popover/jquery.webui-popover.min',
        keySwitch: 'js/jquery-keySwitch/jquery.keySwitch',
        scroll: 'js/jquery-nicescroll/jquery.nicescroll.min',
        mousewheel: 'js/jquery-mousewheel/jquery.mousewheel.min',
        multiselect: 'js/multiselect/js/multiselect',
        chart: 'js/chart/Chart.min',
        lazy: 'js/echo/echo.min',
        crop: 'js/cropper/cropper.min',
        lightgallery: 'js/lightGallery/js/lightgallery.min',
        galleryFullscreen: 'js/lightGallery/js/lg-fullscreen.min',
        galleryPager: 'js/lightGallery/js/lg-pager.min',
        galleryZoom: 'js/lightGallery/js/lg-zoom.min',
        gallery: 'js/lightGallery/js/lg-thumbnail.min',

        raven: 'https://cdn.ravenjs.com/3.24.1/raven.min',

        util: 'common/util.js?v=201804021633',
        Const: 'common/const',
        bvBasic: 'tags/bv-basic.js?v=201804021633',
        bvDate: 'tags/bv-date',
        bvAuto: 'tags/bv-auto',
        bvTree: 'tags/bv-tree',
        bvChart: 'tags/bv-chart',
        bvFile: 'tags/bv-file.js?v=201804021633',
        bvEditor: 'tags/bv-editor',
        bvGrant: 'tags/bv-grant',
        bvForm: 'tags/bv-form.js?v=201804021633',
        bvTable: 'tags/bv-table.js?v=201804021203',
        bvLayout: 'tags/bv-layout',
        bvView: 'tags/bv-view',
    },
    shim: {
        vue: {
            exports: 'vue'
        },
        jquery: {
            exports: 'jquery'
        },
        bootstrap: {
            deps: ['jquery'],
            exports: 'bootstrap'
        },
        ztree: {
            deps: ['css!js/ztree/zTreeStyle', 'jquery'],
            exports: 'ztree'
        },
        ztreeCheck: {
            deps: ['ztree'],
            exports: 'ztreeCheck'
        },
        moment: {
            exports: 'moment'
        },
        /*        datepicker: {
         deps: ['css!js/bootstrap-datepicker/css/bootstrap-datepicker3.min'],
         exports: 'datepicker'
         },
         datepickerLang: {
         deps: ['datepicker'],
         exports: 'datepickerLang'
         },*/
        datetimepicker: {
            deps: ['css!js/bootstrap-datetimepicker/css/bootstrap-datetimepicker.min', 'moment'],
            exports: 'datetimepicker'
        },
        'switch': {
            deps: ['css!js/bootstrap-switch/css/bootstrap-switch.min'],
            exports: 'switch'
        },
        typeahead: {
            exports: 'typeahead'
        },
        /*        datetimepickerLang: {
         deps: ['datetimepicker'],
         exports: 'datetimepickerLang'
         },*/
        validationEngine: {
            deps: ['css!js/validation/validationEngine.jquery.min', 'jquery'],
            exports: 'validationEngine'
        },
        validation: {
            deps: ['jquery', 'validationEngine'],
            exports: 'validation'
        },
        wangEditor: {
            deps: ['css!js/wangEditor/css/wangEditor.min'],
            exports: 'wangEditor'
        },
        plupload: {
            exports: 'plupload'
        },
        pluploadLang: {
            deps: ['plupload'],
            exports: 'pluploadLang'
        },
        json: {
            exports: 'json'
        },
        md5: {
            exports: 'md5'
        },
        toastr: {
            deps: ['css!js/toastr/toastr'],
            exports: 'toastr'
        },
        popover: {
            deps: ['css!js/popover/jquery.webui-popover.min'],
            exports: 'popover'
        },
        keySwitch: {
            deps: ['jquery'],
            exports: 'keySwitch'
        },
        scroll: {
            deps: ['jquery'],
            exports: 'scroll'
        },
        mousewheel: {
            deps: ['jquery'],
            exports: 'mousewheel'
        },
        multiselect: {
            deps: ['css!js/multiselect/css/style', 'jquery'],
            exports: 'multiselect'
        },
        chart: {
            deps: ['moment'],
            exports: 'chart'
        },
        lazy: {
            exports: 'lazy'
        },
        crop: {
            deps: ['css!js/cropper/cropper.min', 'jquery'],
            exports: 'crop'
        },
        lightgallery: {
            deps: ['css!js/lightGallery/css/lightgallery.min', 'jquery'],
            exports: 'lightgallery'
        },
        galleryFullscreen: {
            deps: ['lightgallery'],
            exports: 'galleryFullscreen'
        },
        galleryPager: {
            deps: ['lightgallery'],
            exports: 'galleryPager'
        },
        galleryZoom: {
            deps: ['lightgallery'],
            exports: 'galleryZoom'
        },
        gallery: {
            deps: ['lightgallery', 'mousewheel', 'galleryFullscreen', 'galleryZoom', 'crop'],
            exports: 'gallery'
        },
        raven: {
            exports: 'raven'
        },
        util: {
            exports: 'util'
        },
        Const: {
            exports: 'Const'
        },
        bvBasic: {
            exports: 'bvBasic'
        },
        bvDate: {
            deps: ['datetimepicker'],
            exports: 'bvDate'
        },
        bvAuto: {
            deps: ['typeahead'],
            exports: 'bvAuto'
        },
        bvTree: {
            deps: ['ztreeCheck'],
            exports: 'bvTree'
        },
        bvChart: {
            deps: ['chart'],
            exports: 'bvChart'
        },
        bvFile: {
            deps: ['plupload'],
            exports: 'bvFile'
        },
        bvEditor: {
            deps: ['plupload', 'wangEditor'],
            exports: 'bvEditor'
        },
        bvGrant: {
            deps: ['multiselect'],
            exports: 'bvGrant'
        },
        bvForm: {
            deps: ['bvBasic', 'validation'],
            exports: 'bvForm'
        },
        bvTable: {
            deps: ['bvBasic'],
            exports: 'bvTable'
        },
        bvLayout: {
            exports: 'bvLayout'
        },
        bvView: {
            exports: 'bvView'
        }
    }
});