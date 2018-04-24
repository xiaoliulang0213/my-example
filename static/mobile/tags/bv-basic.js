define([
    'vue',
    'jquery',
    'util',
    'Const'
], function (vue, $, util, Const) {
    vue.component('bv-static', {
        props: {
            //// 公共属性 //////
            entity: '',
            name: '',
            // class
            clazz: '',
            // 属性定义
            attr: '',
            // 默认值
            defaultValue: '',
            // 初始值
            value: '',

            //// 专属属性 ////
            // 设置值
            text: '',
            // 格式化
            format: '',
            // 自定义显示
            show: '',

            from: '',

            //// 以下属性暂未用到 ////
            id: '',
            href: '',
            title: '',
            operate: ''
        },
        data: function() {
            return {
                innerEntity: this.entity,
                innerClass: this.clazz,
                innerAttr: this.attr,
                innerValue: this.value
            };
        },
        created: function() {
            util.initDefault(this);
        },
        mounted: function () {
            if (this.text) {
                this.innerValue = this.text;
            }
            this.initVal(this.innerValue);
            if (this.from === 'form') {
                this.$watch('entity.' + this.name, function(val, oldVal) {
                    this.initVal(val);
                });
            }
        },
        methods: {
            initVal: function (val) {
                if (this.show && util.type(this.show) === 'function') {
                    this.innerValue = util.format(this.show.call(null, val), this.format);
                } else {
                    this.innerValue = util.format(val, this.format);
                }
            }
        },
        /****** 模板定义 ******/
        template: util.template('bv-static')
    });

    vue.component('bv-textfield', {
        props: {
            //// 公共属性 //////
            entity: '',
            name: '',
            // class
            clazz: '',
            // 属性定义
            attr: '',
            // 默认值
            defaultValue: '',
            // 初始值
            value: '',

            // 数据校验
            validate: '',

            //// 专属属性 ////
            type: {
                default: 'text'
            },
            autocomplete: true,
            fix: '',
            blur: '',

            operate: '',

            //// 以下属性暂未用到 ////
            id: ''
        },
        data: function () {
            return {
                innerEntity: this.entity,
                innerClass: this.clazz,
                innerAttr: this.attr || {},
                innerValue: this.value,
                innerType: this.type,
                innerFix: this.fix
                //innerCheckFix: !util.isEmpty(this.fix)
            };
        },
        created: function() {
            util.initDefault(this);
            util.initId(this);
            if (this.fix) {
                if (this.fix === 'number') {
                    this.innerType = 'number';
                    //this.innerCheckFix = false;
                } else if (this.fix === 'phone') {
                    this.innerType = 'tel';
                    this.innerFix = 'number';
                    //this.innerCheckFix = false;
                }
            }else {
                this.innerFix = 'trim';
            }
        },
        beforeDestroy: function () {
            // TODO: 需要确认有没有其他影响
            this.innerEntity[this.name] = null;
        },
        methods: {
            checkInput: function(event) {
                if (this.innerFix) {
                    this.innerEntity[this.name] = util.fix(event, this.innerFix);
                }
            },
            checkPaste: function (event) {
                if (this.innerFix) {
                    var text = util.clipboard();
                    this.innerEntity[this.name] = util.fix(event, this.innerFix, text);
                }
            }
        },
        /****** 模板定义 ******/
        template: util.template('bv-textfield')
    });

    vue.component('bv-select', {
        props: {
            //// 公共属性 //////
            entity: '',

            name: '',
            // class
            clazz: '',
            // 属性定义
            attr: '',
            // 数据校验
            validate: '',
            // 默认值
            defaultValue: '',
            // 初始值
            value: '',
            load: '',

            // 字典类型，支持enums,dicts
            preset: {
                default: 'default'
            },
            code: '',
            desc: '',
            // 数据
            choose: '',
            // 数据接口
            url: {
                default: Const.url.select.query
            },
            method: {
                default: 'post'
            },
            entityName: '',
            initParam: '',
            initParamList: '',
            orders: '',
            // 翻译code用的字典
            trans: '',
            // 额外显示
            extras: '',
            // 不予显示的code值
            excludes: '',
            show: '',
            onChange: '',

            //// 专属属性 ////
            initOption: {
                default: '请选择'
            },

            //// 以下属性暂未用到 ////
            id: '',
            multiple: false,
            head: ''
        },
        data: function () {
            return {
                innerEntity: this.entity,
                innerClass: this.clazz,
                innerAttr: this.attr,
                innerValue: this.value,
                innerCode: this.code,
                innerDesc: this.desc,
                innerChoose: this.choose,
                innerGroups: [],
                innerOptions: []
            };
        },
        beforeCreate: function () {
            this.localOrderList = [];
            this.localCustomLoad = false;
        },
        mounted: function () {
            if (this.url !== Const.url.select.query) {
                this.localCustomLoad = true;
            }
            util.initDefault(this);
            util.initId(this);
            util.initSelectParam(this);

            var vm = this;
            if (this.load) {
                vm.$watch('innerEntity.' + vm.load, function(val, oldVal) {
                    if (!util.isEmpty(val)) {
                        util.initSelectData(vm, 'select', 'load');
                    } else {
                        vm.innerEntity[vm.name] = null;
                        vm.innerOptions = [];
                    }
                });
            }
            util.initSelectData(this, 'select');

            if (util.type(this.onChange) === 'function') {
                vm.$watch('innerEntity.' + vm.name, function (val, oldVal) {
                    this.onChange.call(this, this.innerEntity, this.innerEntity[this.name], util.index(this.innerOptions, this.innerEntity[this.name], this.innerCode, true));
                })
            }
        },
        /****** 模板定义 ******/
        template: util.template('bv-select')
    });

    vue.component('bv-radio', {
        props: {
            entity: '',

            name: '',
            // class
            clazz: '',
            // 属性定义
            attr: '',
            // 数据校验
            validate: '',
            // 默认值
            defaultValue: '',
            // 初始值
            value: '',
            load: '',

            // 字典类型，支持enums,dicts
            preset: {
                default: 'default'
            },
            code: '',
            desc: '',
            // 数据
            choose: '',
            // 数据接口
            url: {
                default: Const.url.select.query
            },
            method: {
                default: 'post'
            },
            entityName: '',
            initParam: '',
            initParamList: '',
            orders: '',
            // 翻译code用的字典
            trans: '',
            // 额外显示
            extras: '',
            // 不予显示的code值
            excludes: '',
            show: '',
            onChange: '',

            // radio、checkbox专用
            labelClass: '',
            extraColumns: '',
            cols: '',
            //
            id: ''
        },
        data: function () {
            return {
                innerEntity: this.entity || {},
                innerClass: this.clazz,
                innerAttr: this.attr,
                innerValue: this.value,
                innerCode: this.code,
                innerDesc: this.desc,
                innerChoose: this.choose,
                innerOptions: [],
                innerLabelClass: this.labelClass
            };
        },
        beforeCreate: function () {
            this.localOrderList = [];
            this.localCustomLoad = false;
        },
        mounted: function () {
            if (this.url !== Const.url.select.query) {
                this.localCustomLoad = true;
            }
            util.initDefault(this);
            util.initSelectParam(this);

            if (this.cols && this.cols > 0 && this.cols <= 12) {
                this.innerLabelClass = 'col-custom col-md-' + this.cols;
            }

            var vm = this;
            if (this.load) {
                vm.$watch('innerEntity.' + vm.load, function(val, oldVal) {
                    if (!util.isEmpty(val)) {
                        util.initSelectData(vm, 'radio', 'load');
                    } else {
                        vm.innerEntity[vm.name] = null;
                        vm.innerOptions = [];
                    }
                });
            }
            util.initSelectData(this, 'radio');

            $(this.$el).on('change', 'input', function (event) {
                vm.innerEntity[vm.name] = $('input[type=radio]:checked', vm.$el).val();
                if (util.type(vm.onChange) === 'function') {
                    vm.onChange.call(vm, vm.innerEntity, vm.innerEntity[vm.name], util.index(vm.innerOptions, vm.innerEntity[vm.name], vm.innerCode, true));
                }
            });
        },
        /****** 模板定义 ******/
        template: util.template('bv-radio')
    });

    vue.component('bv-checkbox', {
        props: {
            entity: '',

            name: '',
            // class
            clazz: '',
            // 属性定义
            attr: '',
            // 数据校验
            validate: '',
            // 默认值
            defaultValue: '',
            // 初始值
            value: '',
            load: '',

            // 字典类型，支持enums,dicts
            preset: {
                default: 'default'
            },
            code: '',
            desc: '',
            // 数据
            choose: '',
            // 数据接口
            url: {
                default: Const.url.select.query
            },
            method: {
                default: 'post'
            },
            entityName: '',
            initParam: '',
            initParamList: '',
            orders: '',
            // 翻译code用的字典
            trans: '',
            // 额外显示
            extras: '',
            // 不予显示的code值
            excludes: '',
            show: '',
            onChange: '',

            // radio、checkbox专用
            labelClass: '',
            extraColumns: '',
            sticky: '',

            //
            id: ''
        },
        data: function () {
            return {
                innerEntity: this.entity,
                innerClass: this.clazz,
                innerAttr: this.attr,
                innerValue: this.value,
                innerCode: this.code,
                innerDesc: this.desc,
                innerChoose: this.choose,
                innerOptions: [],
                innerLabelClass: this.labelClass,
                innerSticky: this.sticky,
                innerValues: []
            };
        },
        watch: {
            innerValues: function (val, oldVal) {
                this.innerEntity[this.name] = util.arrayToString(val, this.localSeprator);
            }
        },
        beforeCreate: function () {
            this.localOrderList = [];
            this.localCustomLoad = false;
            this.localSeprator = ',';
        },
        mounted: function () {
            if (this.url !== Const.url.select.query) {
                this.localCustomLoad = true;
            }
            if (this.innerSticky && util.startsWith(this.innerSticky, '#')) {
                this.innerSticky = this.innerEntity[this.innerSticky.substring(1)];
            }
            util.initDefault(this);
            util.initSelectParam(this);

            if (util.type(this.innerValue) !== 'array' ) {
                if (this.innerValue) {
                    if (util.type(this.innerValue) === 'string' && this.innerValue.indexOf(this.localSeprator) !== -1) {
                        this.innerValues = util.stringToArray(this.innerValue, this.localSeprator);
                    } else{
                        this.innerValues.push(this.innerValue);
                    }
                }
            } else {
                this.innerValues = innerValue;
            }
            if (this.innerSticky && !util.contains(this.innerValues, this.innerSticky)) {
                this.innerValues.push(this.innerSticky);
                if (util.type(this.innerValue) !== 'array' ) {
                    if (!this.innerValue) {
                        this.innerValue = this.innerSticky;
                    } else {
                        this.innerValue += this.localSeprator + this.innerSticky;
                    }
                    this.innerEntity[this.name] = this.innerValue;
                }
            }

            var vm = this;
            if (this.load) {
                vm.$watch('innerEntity.' + vm.load, function(val, oldVal) {
                    if (!util.isEmpty(val)) {
                        util.initSelectData(vm, 'checkbox', 'load');
                    } else {
                        vm.innerEntity[vm.name] = null;
                        vm.innerOptions = [];
                    }
                });
            }
            util.initSelectData(this, 'checkbox');

            $(this.$el).on('change', 'input', function (event) {
                var v = [];
                $('input[type=checkbox]:checked', vm.$el).each(function() {
                    v.push($(this).val());
                });
                vm.innerValues = v;
                if (util.type(this.onChange) === 'function') {
                    vm.$nextTick(function () {
                        vm.onChange.call(vm, vm.innerEntity, vm.innerEntity[vm.name], util.index(vm.innerOptions, vm.innerEntity[vm.name], vm.innerCode, true));
                    });
                }
            });
        },
        /****** 模板定义 ******/
        template: util.template('bv-checkbox')
    });

    vue.component('bv-toggle', {
        props: {
            entity: '',

            name: '',
            // class
            clazz: '',
            // 属性定义
            /// attr: '',
            // 数据校验
            validate: '',
            // 默认值
            defaultValue: '',
            // 初始值
            value: '',
            head: '',
            // 数组，[trueVal, falseVal]，比如['ON', 'OFF']
            choose: '',

            onChange: ''
        },
        data: function () {
            return {
                innerEntity: this.entity,
                innerClass: this.clazz,
                /// innerAttr: this.attr,
                innerValue: this.value,
                innerBindValue: ''
            };
        },
        watch: {
            innerBindValue: function (val, oldVal) {
                if (this.choose && this.choose.length === 2) {
                    if (val) {
                        this.innerEntity[this.name] = this.choose[0];
                    } else {
                        this.innerEntity[this.name] = this.choose[1];
                    }
                } else {
                    this.innerEntity[this.name] = val;
                }
            }
        },
        mounted: function () {
            util.initDefault(this);
            if (this.choose && this.choose.length === 2) {
                if (this.innerValue === this.choose[0]) {
                    this.innerBindValue = true;
                } else {
                    this.innerBindValue = false;
                }
            } else {
                if (this.innerValue === null || this.innerValue === undefined) {
                    this.innerBindValue = false;
                } else {
                    this.innerBindValue = this.innerValue;
                }
            }

            var vm = this;
            $('input', this.$el).on('change', function (event) {
                vm.innerBindValue = util.checked($(this));
                if (util.type(vm.onChange) === 'function') {
                    vm.$nextTick(function () {
                        vm.onChange.call(vm, vm.innerEntity, vm.innerEntity[vm.name]);
                    });
                }
            });
        },
        /****** 模板定义 ******/
        template: util.template('bv-toggle')
    });
});