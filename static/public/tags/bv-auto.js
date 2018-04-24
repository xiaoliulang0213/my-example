define([
    'vue',
    'jquery',
    'util',
    'Const'
], function (vue, $, util, Const) {
    vue.component('bv-auto', {
        props: {
            entity: {
                default: function () {
                    return {};
                }
            },

            id: {
                default: ''
            },
            name: {
                default: ''
            },
            // class
            clazz: {
                default: ''
            },
            // 属性定义
            attr: {
                default: function () {
                    return {};
                }
            },
            // 默认值
            defaultValue: '',
            // 初始值
            value: {
                default: ''
            },
            // 数据校验
            validate: {
                default: ''
            },
            load: {
                default: ''
            },

            // 字典类型，支持enums,dicts
            preset: {
                default: 'default'
            },
            code: {
                default: ''
            },
            desc: {
                default: ''
            },
            // 数据
            choose: {
                default: ''
            },
            // 数据接口
            url: {
                default: ''
            },
            method: {
                default: 'post'
            },
            entityName: {
                default: ''
            },
            initParam: {
                default: ''
            },
            initParamList: {
                default: ''
            },
            orders: {
                default: ''
            },
            // 翻译code用的字典
            trans: {
                default: ''
            },
            // 额外显示
            extras: {
                default: ''
            },
            // 不予显示的code值
            excludes: {
                default: ''
            },
            show: {
                default: ''
            },

            initUrl: {
                default: Const.url.auto.init
            },
            // 是否增加去重
            distinct: {
                default: ''
            },
            extraColumns: {
                default: ''
            },
            /*
             每次最多显示数量
             */
            limit: {
                default: 10
            },
            onItemInit: {
                default: ''
            },
            onChange: {
                default: ''
            },
            from: {
                default: ''
            }
        },
        data: function () {
            return {
                options: []
            };
        },
        beforeCreate: function () {
            this.orderList = [];
            this.customLoad = false;
            /*
             内部用，结构为：{code: {code: '', name: '', desc: ''}}
             */
            this.map = {};
            this.shows = [];
        },
        created: function () {
            if (!this.url) {
                if (this.limit) {
                    this.url = Const.url.auto.page;
                } else {
                    this.url = Const.url.auto.query;
                }
            }
        },
        mounted: function () {
            util.initDefault(this);
            util.initId(this);
            util.initSelectParam(this);

            var vm = this;
            if (this.load) {
                vm.$watch('entity.' + vm.load + (vm.from === 'filter' ? 'Filter' : ''), function(val, oldVal) {
                    if (!util.isEmpty(val)) {
                        util.initSelectData(vm, 'auto', 'load');
                    } else {
                        $('input', vm.$el).val('');
                        vm.entity[vm.name] = null;
                        vm.map = {};
                        vm.shows = [];
                    }
                });
                vm.$watch('entity.' + vm.name, function(val, oldVal) {
                    if (util.isEmpty(val)) {
                        $('input', vm.$el).val('');
                    }
                });
            }
            util.initSelectData(this, 'auto');

            $('input', vm.$el).typeahead({
                source: function (query, process) {
                    util.doAutoProcess(vm, query, process);
                },
                matcher: !vm.choose && vm.url && function() {
                    return true;
                },
                items: vm.limit,
                minLength: 0,
                showHintOnFocus: true,
                fitToElement: true,
                autoSelect: false,
///                    delay: 500,
                afterSelect: function (item) {
                    vm.entity[vm.name] = vm.map[item][vm.code];
                    util.validate($('input', vm.$el), true);
                    if (util.type(vm.onChange) === 'function') {
                        vm.onChange.call(vm, vm.entity, vm.entity[vm.name], vm.map[item]);
                    }
                }
            });

            $('input', vm.$el).on('blur', function() {
                if (util.isEmpty(vm.entity[vm.name])) {
                    $(this).val('');
                }
                if (util.isEmpty($(this).val())) {
                    vm.entity[vm.name] = '';
                }

                var $typeahead = $(this).data('typeahead');
                if ($typeahead) {
                    $typeahead.focused = false;
                }
            });
        },
        methods: {
            trigger: function(event) {
                $('input', this.$el).typeahead('lookup').focus();
            },
            change: function(event) {
                this.entity[this.name] = '';
                $('input', this.$el).val('');
                util.validate($('input', this.$el), true);
                $('input', this.$el).typeahead('focus');
                if (util.type(this.onChange) === 'function') {
                    this.onChange.call(this, {});
                }
            }
        },
        /****** 模板定义 ******/
        template: util.template('bv-auto')
    });
});