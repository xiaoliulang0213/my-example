/*
常量定义
*/
define({
    init: {
        // 是否开启DEBUG模式
        debug: false,
        // 字典参数配置初始化定义
        preset: {
            'default': {
                code: 'code',
                desc: 'desc'
            },
            enums: {
                code: 'name',
                desc: 'desc'
            },
            dict: {
                code: 'dictCode',
                desc: 'dictShow'
            },
            simple: {
                code: 'name',
                desc: 'name'
            },
            json: {
                code: 'code',
                desc: 'name'
            }
        },
        auth: false,
        urlEncode: false,
        maxReport: 100,
        loadingDelay: 300,
        storage: {
            // 通过url传参的变量名
            url: [],
            // 通过sessionStorage保存的变量名
            session: []
        }
    },
    // 后台rest接口地址，默认带/api
    rest: {
        baseUrl: window.location.protocol + "//" + window.location.host + '/api'
    },
    // 部分地址配置
    url: {
        table: {
            page: '/common/table/page',
            select: '/common/table/select',
            deleteByIds: '/common/table/deleteByIds'
        },
        form: {
            init: '/common/form/init',
            insert: '/common/form/insert',
            update: '/common/form/update',
            deleteById: '/common/form/delete'
        },
        select: {
            query: '/common/select/query',
            init: '/common/select/init'
        },
        auto: {
            query: '/common/auto/query',
            init: '/common/auto/init'
        },
        file: {
            download: '${portal}/file'      // /{fileSign}
        },
        cache: {
            config: '/cache/config',
            enums: '/cache/enums',
            dicts: '/cache/dicts',
            params: '/cache/params',
            set: '',
            get: ''
        },
        upload: {
            upload: '${portal}/file/upload',
            swf: '${root}/js/plupload-2/Moxie.swf'
        },
        weixin: {
            signature: ''
        },
        report: ''
    },
    params: {},
    // 字典配置
    dicts: {},
    rule: {},
    route: {},
    messages: {
        alertOk: '确定',
        unknownError: '未知错误',
        error500: '后台服务异常',
        error401: '登录超时，请重新登录',
        error403: '登录超时',
        error404: '找不到资源',
        error405: '请求方法异常',
        error408: '请求超时'
    },
    lengths: {},
    cache: {
        // 支持local、server、both
        type: 'local',
        reports: new Array()
    },
    vm: {},
    global: __global
});
